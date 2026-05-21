import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
  project: any = null;
  tasks: any[] = [];
  projectId!: number;
  loading = true;

  showTaskForm = false;
  taskTitle = '';
  taskDesc = '';
  taskStatus = 'todo';
  taskDueDate = '';
  taskAssigneeId: number | null = null;
  taskError = '';

  showMemberForm = false;
  memberEmail = '';
  memberRole = 'member';
  memberError = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private taskService: TaskService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
    this.loadTasks();
  }

  loadProject() {
    this.projectService.getOne(this.projectId).subscribe(p => { this.project = p; this.loading = false; });
  }

  loadTasks() {
    this.taskService.getProjectTasks(this.projectId).subscribe(t => this.tasks = t);
  }

  isAdmin(): boolean {
    if (!this.project) return false;
    const me = this.auth.getCurrentUser();
    const member = this.project.members.find((m: any) => m.user.id === me.id);
    return member?.role === 'admin' || this.project.owner_id === me.id;
  }

  createTask() {
    if (!this.taskTitle.trim()) { this.taskError = 'Task title is required.'; return; }
    this.taskService.create({
      title: this.taskTitle,
      description: this.taskDesc,
      status: this.taskStatus,
      due_date: this.taskDueDate || null,
      assignee_id: this.taskAssigneeId,
      project_id: this.projectId
    }).subscribe({
      next: () => { this.showTaskForm = false; this.taskTitle = ''; this.taskDesc = ''; this.taskDueDate = ''; this.taskAssigneeId = null; this.loadTasks(); },
      error: (e) => { this.taskError = e.error?.detail || 'Failed to create task.'; }
    });
  }

  updateStatus(task: any, status: string, assigneeId?: number | null) {
    const update: any = { status };
    if (assigneeId !== undefined) update.assignee_id = assigneeId;
    this.taskService.update(task.id, update).subscribe(() => this.loadTasks());
  }

  deleteTask(id: number) {
    this.taskService.delete(id).subscribe(() => this.loadTasks());
  }

  addMember() {
    if (!this.memberEmail.trim()) { this.memberError = 'Email is required.'; return; }
    this.projectService.addMember(this.projectId, this.memberEmail, this.memberRole).subscribe({
      next: () => { this.showMemberForm = false; this.memberEmail = ''; this.loadProject(); },
      error: (e) => { this.memberError = e.error?.detail || 'Failed to add member.'; }
    });
  }

  removeMember(userId: number) {
    this.projectService.removeMember(this.projectId, userId).subscribe(() => this.loadProject());
  }

  statusLabel(s: string) {
    return s === 'in_progress' ? 'In Progress' : s === 'done' ? 'Done' : 'To Do';
  }
}
