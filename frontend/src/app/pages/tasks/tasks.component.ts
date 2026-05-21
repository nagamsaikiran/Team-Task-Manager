import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  filter = 'all';
  loading = true;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getMyTasks().subscribe(t => { this.tasks = t; this.loading = false; });
  }

  get filtered() {
    if (this.filter === 'all') return this.tasks;
    return this.tasks.filter(t => t.status === this.filter);
  }

  updateStatus(task: any, status: string) {
    this.taskService.update(task.id, { status }).subscribe(() => {
      task.status = status;
    });
  }

  statusLabel(s: string) {
    return s === 'in_progress' ? 'In Progress' : s === 'done' ? 'Done' : 'To Do';
  }
}
