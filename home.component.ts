import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface Feature {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
      ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
        {
      title: 'User Profile Form',
      description: 'Complete user form with skills and projects',
      icon: 'person_add',
      route: '/user-form'
    },
    {
      title: 'User Dashboard',
      description: 'Manage multiple users with profile pictures',
      icon: 'group',
      route: '/user-dashboard'
    },
    {
      title: 'Todo List',
      description: 'Manage Tasks with priorities and due dates',
      icon: 'check_circle',
      route: '/todo-list'
    }
  ];
  
  featureRows: any[][] = [];

  constructor() {
    // Split features into rows of 2
    for (let i = 0; i < this.features.length; i += 2) {
      this.featureRows.push(this.features.slice(i, i + 2));
    }
  }
}