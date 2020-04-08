```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// 组件加载
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { TodoComponent } from './todo/todo.component';
import { TodoHeaderComponent } from './todo/todo-header/todo-header.component';

// 业务
import { AuthService } from './core/auth.service';

// 路由配置
import { Router } from './app.router';

// web内存服务
import { InMemoryWebApiModule, HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryTodoDbService } from './todo/todo.server';



const routeConfig = [
  {
    path: 'login',
    component: TestComponent,
  },
  {
    path: '*', // 当路由配置中没有的时候，会跳转以下
    redirectTo: '',  // 跳转
    // pathMatch: 'full', // 完全匹配
  }
];

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    TodoComponent,
    TodoHeaderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
   // InMemoryWebApiModule.forRoot(InMemoryTodoDbService),
   // RouterModule.forRoot(routeConfig),
    Router,
  ],
  providers: [
    {provide: 'auth',  useClass: AuthService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



```