import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <div class="flex h-screen bg-gray-100 overflow-hidden">
      <app-navbar *ngIf="auth.isLoggedIn()"></app-navbar>
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
    <div *ngIf="!auth.isLoggedIn()">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
