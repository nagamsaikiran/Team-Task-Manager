import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  showForm = false;
  name = '';
  description = '';
  error = '';
  loading = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.projectService.getAll().subscribe(p => this.projects = p);
  }

  create() {
    if (!this.name.trim()) { this.error = 'Project name is required.'; return; }
    this.loading = true;
    this.projectService.create({ name: this.name, description: this.description }).subscribe({
      next: () => { this.showForm = false; this.name = ''; this.description = ''; this.loading = false; this.load(); },
      error: (e) => { this.error = e.error?.detail || 'Failed to create project.'; this.loading = false; }
    });
  }

  cancel() {
    this.showForm = false;
    this.name = '';
    this.description = '';
    this.error = '';
  }
}
