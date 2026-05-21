from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional
from app.schemas.user import UserOut

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    due_date: Optional[date] = None
    assignee_id: Optional[int] = None
    project_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None
    assignee_id: Optional[int] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    due_date: Optional[date]
    project_id: int
    assignee_id: Optional[int]
    created_by: int
    created_at: datetime
    assignee: Optional[UserOut] = None

    model_config = {"from_attributes": True}
