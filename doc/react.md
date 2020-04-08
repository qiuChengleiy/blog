
#### 生命周期

```jsx
import React from 'react'
import ReactDOM from 'react-dom'


// react 组件API探讨： （基于class组件)
// 重点组件生命周期 

// 1. 首先是组件挂载时期 : (UNSAFE_componentWillMount()方法已经过时)

//		constructor() -> getDerivedStateFromProps() -> render() -> componentDidMount()



// 2. 组件进入更新阶段: (UNSAFE_componentWillMount() UNSAFE_componentWillReceiveProps() 方法已经过时)

//     static getDerivedStateFromProps() -> shouldComponentUpdate() -> render() -> getSnapshotBeforeUpdate() -> 
// 		-> componentDidUpdate()

// ******** Component.forceUpdate() 调用此方法会强制更新

// 默认情况下，当组件的state或props改变时，组件将重新渲染。如果你的render()方法依赖于一些其他的数据，
// 你可以告诉React组件需要通过调用forceUpdate()重新渲染。 
// 调用forceUpdate()会导致组件跳过shouldComponentUpdate(),直接调用render()。
// 这将触发组件的正常生命周期方法,包括每个子组件的shouldComponentUpdate()方法。 
// forceUpdate就是重新render。有些变量不在state上，当时你又想达到这个变量更新的时候，刷新render；
// 或者state里的某个变量层次太深，更新的时候没有自动触发render。这些时候都可以手动调用forceUpdate自动触发render



// 3. 组件进入卸载阶段: 
//		componentWillUnmount() -> componentDidCatch(error, info)


// 4. 组件渲染捕获错误阶段：
//		static getDerivedStateFromError()  -> componentDidCatch()


class Lifes extends React.Component {
	constructor(props) {
		super(props)
		console.log('挂载------1')
		this.state = {
			val: 0,
			hasError: false
		}
	}

	// 在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用 它应返回一个对象来更新 state，如果返回 null 则不更新任何内容
	// 这里做了一个实验：
	// 		1. 当返回null时 ， 组件正常渲染更新计时器中的state数据
	//      2. 当进行判断后，返回指定的state对象时， 会返现state更改成了返回的对象， 但是计时器依然在工作，返回的state依然没有改变，
	//         这是因为在每次render之前都会调用它，这样允许我们再更新前去改变state
	// 其实还有一个方法： UNSAFE_componentWillMount() 这个已经过时了
	static getDerivedStateFromProps(props, state) {
		console.log(props, state) // {type: "1"} {val: 0}
		console.log('挂载------2')
		console.log('更新------1')
		if(props.type === '2') {
			return { val: props.type }   
			// 这里的返回state的更新并不会触发  shouldComponentUpdate 、getSnapshotBeforeUpdate 、 componentDidUpdate
		}

		return null 
	}


	// 在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state
	static getDerivedStateFromError(error) {
	    // 更新 state 使下一次渲染可以显降级 UI
	    console.log(error)
	    return { hasError: true }
    }

    // 此生命周期在后代组件抛出错误后被调用
    componentDidCatch(error, info) {
	    // "组件堆栈" 例子:
	    //   in ComponentThatThrows (created by App)
	    //   in ErrorBoundary (created by App)
	    //   in div (created by App)
	    //   in App
    }

	// 组件更新时被调用  true 触发重绘  false 终止 : 默认 true
	shouldComponentUpdate() {
		console.log('更新------2')
		return true
	}

	// 在最近一次渲染输出（*******提交到 DOM 节点*********）之前调用
	// 引用文档的一句话： 它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。
	// 				   此生命周期的任何返回值将作为参数传递给 componentDidUpdate()。
	// 
	getSnapshotBeforeUpdate(prevProps, prevState) {
		console.log('更新------4')  
		console.log(prevProps, prevState)  // {type: "1"} {val: 1}
		return { val: 'getSnapshotBeforeUpdate'}
	}


	// 会在更新后会被立即调用。首次渲染不会执行此方法
	// 当组件更新后，可以在此处对 DOM 进行操作。如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。
	// （例如，当 props 未发生变化时，则不会执行网络请求）。
	// 你也直接调用 setState()，但请注意它必须被包裹在一个条件语件里，正如上述的例子那样进行处理，否则会导致死循环。
	// 它还会导致额外的重新渲染，虽然用户不可见，但会影响组件性能。不要将 props “镜像”给 state，请考虑直接使用 props。
	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log('更新------5')
		console.log(prevProps, prevState, snapshot) // {type: "1"} {val: 1} {val: "getSnapshotBeforeUpdate"}
		if(prevState.val === 2) {  // 这里要有条件， 不然会报错， 进入死循环
			console.log(snapshot)
			// this.setState({ val: 'didUpdate' })  // 可以直接设置state 来触发重绘
		}
	}


	// 这种情况比较适合依赖外部数据的时候
	forceUpdated() {
		if(this.props.update) {
			this.forceUpdate(() => console.log('强制刷新组件')) // 强刷
		}
	}



	// 会在组件卸载及销毁之前直接调用
	// 在此方法中执行必要的清理操作，例如，清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等。
	//不应调用 setState()，因为该组件将永远不会重新渲染。组件实例卸载后，将永远不会再挂载它。
	// 举个最简单的例子: 组件的插和拔
	componentWillUnmount() {
		console.log('卸载组件')
	}



	// 初次挂载组件渲染完成时执行 ----- 即时循环setState也只执行了一次
	componentDidMount() {
		console.log('挂载------4')
	   // this.interval = setInterval(() => this.setState({val: this.state.val += 1 }), 1000)
	}

	// 渲染函数 触发渲染执行
	render() {
		//if(this.state.val === 4) clearInterval(this.interval)
		console.log('挂载------3')
		console.log('更新------3')
		return (
			<>
			<div>hello world {this.state.val}</div>
			{this.state.hasError && (<h1>发现错误拉~</h1>)}
			</>
		)
	}
}


class Parent extends React.Component {
	constructor(props) {
		super(props)
		console.log(props)  // {pro: "yes"}
		this.state = {
			show: true
		}

		this.domRef = React.createRef()
	}

	bindClick() {
		// this.setState({
		// 	show: false
		// })
	   this.domRef.current.forceUpdated()  // 点击的时候强制刷新
	}

	componentDidMount() {
		const el = ReactDOM.findDOMNode(this.domRef.current)
		console.dir(el) // 这样会拿到真实的DOM节点 //  div .... div
	}

	createHtml() {
		 return {__html: '<h1>innerHTML</h1>'}; // 指定html 一便dangerouslySetInnerHTML插入
	}

	render() {	
		// 当点击click事件的时候 会发现控制台会打印 ： 组件已经注销
		return(
			<>
			<div onClick={() => this.bindClick()}>点击注销组件Life</div>
			{this.state.show && <Lifes ref={this.domRef} type="1" update={true}/>}
			<div dangerouslySetInnerHTML={this.createHtml()}></div>
			</>
		)
	}
}

// 此外拓展一个知识点
// 设置一个默认属性
Parent.defaultProps = {
 	pro: 'yes' 
}

// 关于ReactDOM
// 熟悉 ReactDOM.findDOMNode(component) 就好了， 另外还有一个render方法


// 另外还有服务端渲染
// import ReactDOMServer from 'react-dom/server';
// 后边会有详细介绍,这里不拓展了


// dangerouslySetInnerHTML
// dangerouslySetInnerHTML 是 React 为浏览器 DOM 提供 innerHTML 的替换方案。通常来讲，使用代码直接设置 HTML 存在风险，
// 因为很容易无意中使用户暴露于跨站脚本（XSS）的攻击。因此，你可以直接在 React 中设置 HTML，
// 但当你想设置 dangerouslySetInnerHTML 时，需要向其传递包含 key 为 __html 的对象

// htmlFor  由于 for 在 JavaScript 中是保留字，所以 React 元素中使用了 htmlFor 来代替。


// style 也可以 style = { { width: .... } }  样式上传入一个style

export const Life = <Parent />
```

#### setState

setState 在 React 中是经常使用的一个 API，但是它存在一些的问题经常会导致初学者出错，核心原因就是因为这个 API 是异步的。

首先 setState 的调用并不会马上引起 state 的改变，并且如果你一次调用了多个 setState ，那么结果可能并不如你期待的一样。

```js
handle() {
  // 初始化 `count` 为 0
  console.log(this.state.count) // -> 0
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // -> 0
}
```

第一，两次的打印都为 0，因为 setState 是个异步 API，只有同步代码运行完毕才会执行。setState 异步的原因我认为在于，setState 可能会导致 DOM 的重绘，如果调用一次就马上去进行重绘，那么调用多次就会造成不必要的性能损失。设计成异步的话，就可以将多次调用放入一个队列中，在恰当的时候统一进行更新过程。

第二，虽然调用了三次 setState ，但是 count 的值还是为 1。因为多次调用会合并为一次，只有当更新结束后 state 才会改变，三次调用等同于如下代码

```js
Object.assign(  
  {},
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
  { count: this.state.count + 1 },
)
```
当然你也可以通过以下方式来实现调用三次 setState 使得 count 为 3

```js
handle() {
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
  this.setState((prevState) => ({ count: prevState.count + 1 }))
}
```

如果你想在每次调用 setState 后获得正确的 state ，可以通过如下代码实现

```js
handle() {
    this.setState((prevState) => ({ count: prevState.count + 1 }), () => {
        console.log(this.state)
    })
}
```

#### 性能优化

这小节内容集中在组件的性能优化上，这一方面的性能优化也基本集中在 shouldComponentUpdate 这个钩子函数上做文章。

在 shouldComponentUpdate 函数中我们可以通过返回布尔值来决定当前组件是否需要更新。这层代码逻辑可以是简单地浅比较一下当前 state 和之前的 state 是否相同，也可以是判断某个值更新了才触发组件更新。一般来说不推荐完整地对比当前 state 和之前的 state 是否相同，因为组件更新触发可能会很频繁，这样的完整对比性能开销会有点大，可能会造成得不偿失的情况。

当然如果真的想完整对比当前 state 和之前的 state 是否相同，并且不影响性能也是行得通的，可以通过 immutable 或者 immer 这些库来生成不可变对象。这类库对于操作大规模的数据来说会提升不错的性能，并且一旦改变数据就会生成一个新的对象，对比前后 state 是否一致也就方便多了，同时也很推荐阅读下 immer 的源码实现。

另外如果只是单纯的浅比较一下，可以直接使用 PureComponent，底层就是实现了浅比较 state。


```jsx
class Test extends React.PureComponent {
  render() {
    return (
      <div>
        PureComponent
      </div>
    )
  }
}
```

这时候你可能会考虑到函数组件就不能使用这种方式了，如果你使用 16.6.0 之后的版本的话，可以使用 React.memo 来实现相同的功能。

```jsx
const Test = React.memo(() => (
    <div>
        PureComponent
    </div>
))
```
通过这种方式我们就可以既实现了 shouldComponentUpdate 的浅比较，又能够使用函数组件

#### 通信

其实 React 中的组件通信基本和 Vue 中的一致。同样也分为以下三种情况：

- 父子组件通信
- 兄弟组件通信
- 跨多层级组件通信
- 任意组件

##### 父子通信

父组件通过 props 传递数据给子组件，子组件通过调用父组件传来的函数传递数据给父组件，这两种方式是最常用的父子通信实现办法。

这种父子通信方式也就是典型的单向数据流，父组件通过 props 传递数据，子组件不能直接修改 props， 而是必须通过调用父组件函数的方式告知父组件修改数据。

##### 兄弟组件通信

对于这种情况可以通过共同的父组件来管理状态和事件函数。比如说其中一个兄弟组件调用父组件传递过来的事件函数修改父组件中的状态，然后父组件将状态传递给另一个兄弟组件。

##### 跨多层次组件通信

如果你使用 16.3 以上版本的话，对于这种情况可以使用 Context API。

```jsx
// 创建 Context，可以在开始就传入值
const StateContext = React.createContext()
class Parent extends React.Component {
  render () {
    return (
      // value 就是传入 Context 中的值
      <StateContext.Provider value='yck'>
        <Child />
      </StateContext.Provider>
    )
  }
}
class Child extends React.Component {
  render () {
    return (
      <ThemeContext.Consumer>
        // 取出值
        {context => (
          name is { context }
        )}
      </ThemeContext.Consumer>
    );
  }
}
```

##### 任意组件

这种方式可以通过 Redux 或者 Event Bus 解决，另外如果你不怕麻烦的话，可以使用这种方式解决上述所有的通信情况

____

#### 高级部分

##### HOC 是什么？相比 mixins 有什么优点？

很多人看到高阶组件（HOC）这个概念就被吓到了，认为这东西很难，其实这东西概念真的很简单，我们先来看一个例子。

其实这个做法在函数式编程里称之为高阶函数，大家都知道 React 的思想中是存在函数式编程的，高阶组件和高阶函数就是同一个东西。我们实现一个函数，传入一个组件，然后在函数内部再实现一个函数去扩展传入的组件，最后返回一个新的组件，这就是高阶组件的概念，作用就是为了更好的复用代码。

其实 HOC 和 Vue 中的 mixins 作用是一致的，并且在早期 React 也是使用 mixins 的方式。但是在使用 class 的方式创建组件以后，mixins 的方式就不能使用了，并且其实 mixins 也是存在一些问题的，比如：

- 隐含了一些依赖，比如我在组件中写了某个 state 并且在 mixin 中使用了，就这存在了一个依赖关系。万一下次别人要移除它，就得去 mixin 中查找依赖
- 多个 mixin 中可能存在相同命名的函数，同时代码组件中也不能出现相同命名的函数，否则就是重写了，其实我一直觉得命名真的是一件麻烦事。。
- 雪球效应，虽然我一个组件还是使用着同一个 mixin，但是一个 mixin 会被多个组件使用，可能会存在需求使得 mixin 修改原本的函数或者新增更多的函数，这样可能就会产生一个维护成本


##### 事件机制

```js
const Test = ({ list, handleClick }) => ({
    list.map((item, index) => (
        <span onClick={handleClick} key={index}>{index}</span>
    ))
})
```

以上类似代码想必大家经常会写到，但是你是否考虑过点击事件是否绑定在了每一个标签上？事实当然不是，JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 document 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件。

另外冒泡到 document 上的事件也不是原生浏览器事件，而是 React 自己实现的合成事件（SyntheticEvent）。因此我们如果不想要事件冒泡的话，调用 event.stopPropagation 是无效的，而应该调用 event.preventDefault。

那么实现合成事件的目的是什么呢？总的来说在我看来好处有两点，分别是：

- 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
- 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象。


##### Hooks
- useState：传入我们所需的初始状态，返回一个常量状态以及改变状态的函数
- useEffect：第一个参数接受一个 callback，每次组件更新都会执行这个 callback，并且 callback 可以返回一个函数，该函数会在每次组件销毁前执行。如果 useEffect 内部有依赖外部的属性，并且希望依赖属性不改变就不重复执行 useEffect 的话，可以传入一个依赖数组作为第二个参数
- useRef：如果你需要有一个地方来存储变化的数据
- useCallback：如果你需要一个不会随着组件更新而重新创建的 callback

___
- [拓展](https://juejin.im/book/5bdc715fe51d454e755f75ef/section/5bdc7333f265da611d661be0)







