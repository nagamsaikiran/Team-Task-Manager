import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  tasks: any[] = [];
  overdueTasks: any[] = [];
  projects: any[] = [];
  loading = true;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.taskService.getMyTasks().subscribe(t => { this.tasks = t; this.loading = false; });
    this.taskService.getOverdueTasks().subscribe(t => this.overdueTasks = t);
    this.projectService.getAll().subscribe(p => this.projects = p);
  }

  get todoCount() { return this.tasks.filter(t => t.status === 'todo').length; }
  get inProgressCount() { return this.tasks.filter(t => t.status === 'in_progress').length; }
  get doneCount() { return this.tasks.filter(t => t.status === 'done').length; }
}
