from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.core.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut
from app.auth.jwt import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

def require_project_member(project_id: int, user: User, db: Session):
    member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    return member

@router.post("", response_model=TaskOut, status_code=201)
def create_task(payload: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_project_member(payload.project_id, current_user, db)
    task = Task(
        title=payload.title,
        description=payload.description,
        status=payload.status,
        due_date=payload.due_date,
        project_id=payload.project_id,
        assignee_id=payload.assignee_id,
        created_by=current_user.id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/my", response_model=List[TaskOut])
def get_my_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Task).filter(Task.assignee_id == current_user.id).all()

@router.get("/my/overdue", response_model=List[TaskOut])
def get_overdue_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Task).filter(
        Task.assignee_id == current_user.id,
        Task.due_date < date.today(),
        Task.status != "done"
    ).all()

@router.get("/project/{project_id}", response_model=List[TaskOut])
def get_project_tasks(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_project_member(project_id, current_user, db)
    return db.query(Task).filter(Task.project_id == project_id).all()

@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    require_project_member(task.project_id, current_user, db)
    return task

@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    require_project_member(task.project_id, current_user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    member = require_project_member(task.project_id, current_user, db)
    if member.role != "admin" and task.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Only admins or task creator can delete")
    db.delete(task)
    db.commit()
