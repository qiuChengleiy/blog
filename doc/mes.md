```js
import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-todo-header',
  templateUrl: './todo-header.component.html',
  styleUrls: ['./todo-header.component.css']
})
export class TodoHeaderComponent implements OnInit {
  inputValue = '';

  // 绑入属性
  @Input() placeholder = 'What needs to be done?';
  @Input() delay = 300;

  // 唤起父组件
  @Output() onEnterUp = new EventEmitter<string>();
  @Output() textChanges = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
  }

  enterUp() {
    this.onEnterUp.emit('你好 我是子组件');
    this.textChanges.emit(this.inputValue);
    this.inputValue = '';
  }

  childs() {
    alert('父组件传入子组件');
  }

}


```

```html

<header class="header">
  <h1>Todos</h1>
  <input
    class="new-todo"
    [placeholder]="placeholder"
    autofocus=""
    [(ngModel)]="inputValue"
    (keyup.enter)="enterUp()">
</header>


```

```js

import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';

import { TodoHeaderComponent } from './todo-header/todo-header.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService],
})
export class TodoComponent implements OnInit {
  todos: Todo[]  = [];
  desc = '';

  // 唤起子组件
  @ViewChild(TodoHeaderComponent) child: TodoHeaderComponent;

  constructor(private service: TodoService) { }

  // 初始化函数
  ngOnInit() {
    console.log(this.child.childs());
    this.child.placeholder = '我要改变子组件的placeholder';
  }

  add() {
   // this.todos.push({id: '1', desc: this.desc, completed: false});
    this.todos = this.service.add(this.desc);
    this.desc = '';
    console.log(this.todos);
  }

  addTodo() {
    this.service
      .addTodo(this.desc)
      .then(todo => {
        this.todos = [...this.todos, todo];
        this.desc = '';
        console.log(todo);
      });
  }

  addTodos(ev) {
    console.log(ev);  // 子组件发来信息
  }

  onTextChanges(ev) {
    console.log(ev);
  }

}



```



```html

<p>
  todo works!
</p>

<div>
  <input type="text" [(ngModel)]="desc" (keyup.enter)="addTodo()">
  <ul>
    <li *ngFor="let todo of todos">{{ todo.desc }}</li>
  </ul>
</div>

<app-todo-header 
    delay="400"
    (textChanges)="onTextChanges($event)"
    (onEnterUp)="addTodos($event)" 
>
</app-todo-header>




```