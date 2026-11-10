import { Component } from '@angular/core';
import { DEMO_USER } from '../models/sticky-note.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  collapsed = false;
  user = DEMO_USER;

  navItems: NavItem[] = [
    { label: 'The Wall', icon: '🧱', route: '/wall' },
    { label: 'Create Test', icon: '✎', route: '/create-test' },
    { label: 'Performance', icon: '📊', route: '/performance' }
  ];

  toggle(): void {
    this.collapsed = !this.collapsed;
  }
}
