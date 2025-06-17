import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../todo-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();

  isEditing = false;
  editTodo: Todo = { id: 0, text: '', completed: false, priority: 'Medium' };
  priorities = ['Low', 'Medium', 'High'];

  startEditing(): void {
    this.isEditing = true;
    this.editTodo = { ...this.todo };
  }

  saveEdit(): void {
  if (this.editTodo.text.trim()) {
    this.edit.emit({
      ...this.editTodo,
      completed: this.todo.completed, 
      priority: this.editTodo.priority || 'Medium' 
    });
    this.isEditing = false;
  }
}

  cancelEdit(): void {
    this.isEditing = false;
  }

  confirmDelete(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.delete.emit(this.todo.id);
    }
  }

  getPriorityClass(): string {
    return `priority-${this.todo.priority.toLowerCase()}`;
  }

  getDueDateStatus(): string {
    if (!this.todo.dueDate) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.todo.dueDate);
    
    if (dueDate < today) return 'overdue';
    if (dueDate.getTime() === today.getTime()) return 'due-today';
    return '';
  }
}