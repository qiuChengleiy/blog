```js

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { UUID } from 'angular2-uuid';
// import 'rxjs/add/operator/toPromise';

import {Todo} from './todo.model';
import { resolve } from 'url';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  // 定义你的假WebAPI地址，这个定义成什么都无所谓
  // 只要确保是无法访问的地址就好
  private api_url = 'api/todos';
  private headers = new Headers({'Content-Type': 'application/json'});

  todos: Todo[] = [];

  constructor(private http: Http) { }

  test() {
    this.http
              .get('http://localhost:3000/posts')
              .toPromise()
              .then(res => {
                 alert(JSON.stringify(res.json()));
              })
              .catch(this.handleError);
  }

  // POST /todos
    addTodo(desc: string): Promise<Todo> {
      this.test();
      const todo = {
        id: UUID.UUID(),
        desc: desc,
        completed: false
      };
      return this.http
              .post(this.api_url, JSON.stringify(todo), {headers: this.headers})
              .toPromise()
              .then(res => {
                 return res.json() as Todo;  // 以Todo的形式返回
              })
              .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  add(todoItem: string): Todo[] {
    const todo = {
      id: UUID.UUID(),
      desc: todoItem,
      completed: false
    };
    this.todos.push(todo);
    return this.todos;
  }

}


```