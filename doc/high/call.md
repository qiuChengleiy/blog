#### 手写 call、apply 及 bind 函数

> ###### 涉及面试题：call、apply 及 bind 函数内部实现是怎么样的？

特点：

- 第一个参数默认是window
- 改变this指向，并且新对象可以执行该函数并能接受参数


##### call

- 首先是Function的原型上添加方法
- 接着给context上下文添加fn属性
- call传入多余的参数作为函数执行的参数
- 最后将fn从目标对象移除掉
```js
Function.prototype.call_ = () => {
    console.log('call_')
}

function MyTest(e) {
    console.log(this) // { name: 'lili', fn: [Function: MyTest] }
    console.log('mytest ----> ' + e) // mytest ----> lili
}

// MyTest.call_() // test

// 需： MyTest.call_(obj, 'call_')

Function.prototype.call_ = function (context) { // 这里要是 function 不然捕捉不到this
    console.log(this, context) // [Function: MyTest] { name: 'lili' }
    // 判断调用者是否是函数
    if(typeof this !== 'function') {
        throw new TypeError('type error')
    }

    // // context 上下文 
    context = context || window
    context.fn = this // 赋予要执行函数
    const args = [...arguments].slice(1)
    const result = context.fn(args)
    delete context.fn // 移除属性
    return result // 返回执行结果
}

const obj = {
    name: 'lili'
}

MyTest.call_(obj, obj.name)
```

##### apply

apply和call很像，传参形式有点不一样

```js
Function.prototype.call_ = function (context) { // 这里要是 function 不然捕捉不到this
    console.log(this, context) // [Function: MyTest] { name: 'lili' }
    // 判断调用者是否是函数
    if(typeof this !== 'function') {
        throw new TypeError('type error')
    }

    // // context 上下文 
    context = context || window
    context.fn = this // 赋予要执行函数
    
    // 对参数进行处理
    let result
    // 传的是数组
    if(arguments[1]) {
       // 将数组扩展到函数参数上
        result = context.fn(...arguments[1])
    }else {
        result = context.fn()
    }
    delete context.fn // 移除属性
    return result // 返回执行结果
}
```

##### bind

bind实现的是绑定上下文并且返回的是一个函数

```js
function test (e,v) {
    console.log(e) // 12
    console.log(v) // 10
    console.log(this) // { name: 1 }
}

const obj = { name: 1 }

test.bind(obj, 12)(10)

test.bind(obj)(10)
// 10
// undefined
```

实现

```js
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const _this = this
  const args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
    // 当this不被改变时 忽略传入的this
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```


#### new

> ###### 涉及面试题：new 的原理是什么？通过 new 的方式创建对象和通过字面量创建有什么区别？

调用 new 的过程中会发生:

- 新生成了一个对象
- 链接到原型
- 绑定 this
- 返回新对象

new的实现：
```js
function create() {
  let obj = {}
  let Con = [].shift.call(arguments) // 获取传入的第一个参数
  obj.__proto__ = Con.prototype
  let result = Con.apply(obj, arguments)
  return result instanceof Object ? result : obj
}
```

- 创建一个空对象
- 获取构造函数
- 设置空对象的原型
- 绑定 this 并执行构造函数
- 确保返回值为对象

对于对象来说，其实都是通过 new 产生的，无论是 function Foo() 还是 let a = { b : 1 } 。

对于创建一个对象来说，更推荐使用字面量的方式创建对象（无论性能上还是可读性）。因为你使用 new Object() 的方式创建对象需要通过作用域链一层层找到 Object，但是你使用字面量的方式就没这个问题。

```js
function Foo() {}
// function 就是个语法糖
// 内部等同于 new Function()
let a = { b: 1 }
// 这个字面量内部也是使用了 new Object()
```





#### instanceof 的原理

instanceof 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype。

实现：
```js
function myInstanceof(left, right) {
  let prototype = right.prototype
  left = left.__proto__
  while (true) {
    if (left === null || left === undefined)
      return false
    if (prototype === left)
      return true
    left = left.__proto__
  }
}
```

- 首先获取类型的原型
- 然后获得对象的原型
- 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null


#### 为什么 0.1 + 0.2 != 0.3
> ###### 为什么 0.1 + 0.2 != 0.3？如何解决这个问题？

计算机是通过
二进制来存储东西的，0.1 在二进制中是无限循环的一些数字，其实不只是 0.1，其实很多十进制小数用二进制表示都是无限循环的
那么这些循环的数字被裁剪了，就会出现精度丢失的问题，也就造成了 0.1 不再是 0.1 了，而是变成了 0.100000000000000002

###### console.log(0.1)为什么是0.1？

输入内容的时候，二进制被转换为了十进制，十进制又被转换为了字符串，在这个转换的过程中发生了取近似值的过程，所以打印出来的其实是一个近似值，你也可以通过以下代码来验证

```js
console.log(0.100000000000000002) // 0.1
```

如何解决这个问题？

```js
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3 // true
```


#### 垃圾回收机制

> ###### V8 下的垃圾回收机制是怎么样的？

V8 实现了准确式 GC，GC 算法采用了分代式垃圾回收机制。因此，V8 将内存（堆）分为新生代和老生代两部分。

新生代中的对象一般存活时间较短，使用 Scavenge GC 算法。

老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是标记清除算法和标记压缩算法。
