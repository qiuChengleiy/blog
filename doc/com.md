```js

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}


```

```html

<!--The content below is only a placeholder and can be replaced.-->
<div style="text-align:center">
  <h1>
    Welcome to {{ title }}!   你好 世界 ！正式学习 angular 开发
  </h1>
</div>

<!-- <app-test></app-test> -->

<!-- 配置路由模块 -->
<router-outlet></router-outlet>

<app-todo></app-todo>


```

```css
h1{
    color:green;
}


```