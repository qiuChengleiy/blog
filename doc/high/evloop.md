### Envent Loop

#### 进程和线程

> ###### 涉及面试题：进程与线程区别？JS 单线程带来的好处？

本质上来说，两个名词都是 CPU 工作时间片的一个描述。

##### 进程

CPU 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序

##### 线程
线程是进程中的更小单位，描述了执行一段指令所需的时间

##### 在浏览器中

打开一个tab相当于创建了一个进程，一个进程中包含多个线程（比如渲染线程、JS引擎线程、HTTP请求线程等) 发起一个请求相当于创建一个线程，结束后，该线程可能被销毁


JS引擎线程可能会阻止UI渲染，这两个线程互斥，原因是JS可以修改DOM，如果JS执行并且UI还在工作，这样创建元素可能不安全。单线程也有好处，比如它更节省内存，节约上下文切换时间，没有锁的问题的好处。在服务端中，锁的问题比如读取数据枷锁，直到读取完毕后才可以进行写入操作


##### 执行栈

> ###### 涉及面试题：什么是执行栈？

可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则

平时开发中也可以查看报错情况，可以定位到准确的执行位置

当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放了过多的函数且没有得到释放的话，就会出现爆栈的问题

```js
function bar() {
  bar()
}
bar() // Maximum call stack
```

#### 浏览器中的Event Loop 

> ###### 涉及面试题：异步代码执行顺序？解释一下什么是 Event Loop ？

##### 异步代码执行

JS在执行的时候往执行栈中存放函数，遇到异步的代码，会挂起，等待需要执行的时候加入task（task有多种)队列，当执行栈为空时，就会从task队列中拿出需要执行的代码放入执行栈中执行，JS 中的异步还是同步行为（只不过顺序不一样）



##### 事件循环队列

不同的任务源会被分配到不同的 Task 队列

任务源可分为： 
- 微任务（microtask） 
- 宏任务（macrotask）

> 在 ES6 规范中，microtask 称为 jobs，macrotask 称为 task

如下代码执行顺序：

```js

console.log('script start') // 1

async function async1() {
  await async2()  // 3.
  console.log('async1 end') // 9
}
async function async2() {
  console.log('async2 end') // 4
}
async1() // 2 调用

setTimeout(function() {
  console.log('setTimeout') // 10
}, 0)

new Promise(resolve => {
  console.log('Promise') // 5
  resolve()
})
  .then(function() {
    console.log('promise1') // 7
  })
  .then(function() {
    console.log('promise2') // 8
  })

console.log('script end') // 6

```

新的浏览器下输出：

```js
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout
```

- await 看成是让出线程的标志
- await 后面跟着 Promise 的话，async1 end 需要等待三个 tick 才能执行到


Event Loop 执行顺序

- 先执同步代码-宏任务
- 执行完同步，执行栈为空，查看是否有异步代码要执行
- 执行所有微任务
- 当执行完所有微任务，如有必要会渲染页面
- 开始下一轮Event Loop, 执行宏任务中的异步代码，也就是setTimeout的回调


虽然 setTimeout 写在 Promise 之前，但是因为 Promise 属于微任务而 setTimeout 属于宏任务


微任务包括：

- process.nextTick
- promise 
- MutationObserver，其中 process.nextTick 为 Node 独有。


宏任务包括：

- script 
- setTimeout 
- setInterval 
- setImmediate 
- I/O 
- UI rendering


#### Node中的Event Loop

> ###### 涉及面试题：Node 中的 Event Loop 和浏览器中的有什么区别？process.nexttick 执行顺序？

Node 中的 Event Loop 和浏览器中的是完全不相同的东西

Node 的 Event Loop 分为 6 个阶段，它们会按照顺序反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

##### timers

timers 阶段会执行 setTimeout 和 setInterval 回调，并且是由 poll 阶段控制的。

同样，在 Node 中定时器指定的时间也不是准确时间，只能是尽快执行。


##### I/O

I/O 阶段会处理一些上一轮循环中的少数未执行的 I/O 回调


##### idle, prepare

idle, prepare 阶段内部实现

##### poll

poll 是一个至关重要的阶段，这一阶段中，系统会做两件事情

- 回到 timer 阶段执行回调
- 执行 I/O 回调


并且在进入该阶段时如果没有设定了 timer 的话:

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生 
 - -1. 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
 - -2. 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去
 
当然设定了 timer 的话且 poll 队列为空，则会判断是否有 timer 超时，如果有的话会回到 timer 阶段执行回调。

##### check
check 阶段执行 setImmediate

##### close callbacks

close callbacks 阶段执行 close 事件

对于以上代码来说，setTimeout 可能执行在前，也可能执行在后


```js
const fs = require('fs')

fs.readFile(__filename, () => {
    setTimeout(() => {
        console.log('timeout');
    }, 0)
    setImmediate(() => {
        console.log('immediate')
    })
})
```

首先在有些情况下，定时器的执行顺序其实是随机的

```js
setTimeout(() => {
    console.log('setTimeout')
}, 0)
setImmediate(() => {
    console.log('setImmediate')
})
```

-  setTimeout(fn, 0) === setTimeout(fn, 1)，这是由源码决定的
- 事件循环也是需要成本的，如果在准备时候花费了大于 1ms 的时间，那么在 timer 阶段就会直接执行 setTimeout 回调
- 如果准备时间花费小于 1ms，那么就是 setImmediate 回调先执行了


--------- 

待续....











