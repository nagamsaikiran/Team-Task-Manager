import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <div *ngIf="showNavbar" class="flex h-screen bg-gray-100 overflow-hidden">
      <app-navbar></app-navbar>
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
    <div *ngIf="!showNavbar">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  showNavbar = false;

  constructor(public auth: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const publicPages = ['/login', '/signup'];
        const isPublic = publicPages.some(p => event.url.startsWith(p));
        this.showNavbar = auth.isLoggedIn() && !isPublic;
      }
    });
  }
}
