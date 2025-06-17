import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Todo, TodoService } from '../todo-service.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  providers: [TodoService],
  imports: [
    CommonModule, 
    FormsModule,  
    DragDropModule, 
    TodoItemComponent,
    RouterModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent{
  todos: Todo[] = [];
  newTodoText = '';
  newTodoDueDate?: string;
  newTodoPriority: 'Low' | 'Medium' | 'High' = 'Medium';
  priorities = ['Low', 'Medium', 'High'];
  formSubmitted = false;
  
   constructor(private todoService: TodoService) {
    this.todos = this.todoService.getTodos();
  }

  addTodo(): void {
    this.formSubmitted = true;
    if (this.newTodoText.trim()) {
      this.todoService.addTodo(
        this.newTodoText, 
        this.newTodoDueDate, 
        this.newTodoPriority
      );
      this.resetForm();
      this.todos = this.todoService.getTodos();
    }
  }

  resetForm(): void {
    this.newTodoText = '';
    this.newTodoDueDate = undefined;
    this.newTodoPriority = 'Medium';
    this.formSubmitted = false; 
  
  }

    toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  editTodo(updatedTodo: Todo): void {
  this.todoService.updateTodoFull(updatedTodo);
  this.todos = this.todoService.getTodos();
}

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
    this.todos = this.todoService.getTodos();
  }

  drop(event: CdkDragDrop<Todo[]>) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
    this.todoService.reorderTodos(this.todos);
  }
}