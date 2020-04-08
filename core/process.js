/**
 * process 进程管理模块
 */

const child_process_ = require('child_process') 
{
  () => {
    const spawn = child_process_.spawn
    console.log(process.execPath)  // /usr/local/bin/node

    let server_process = spawn(process.execPath,['./server.js'])  // spawn(command[, args][, options])

    // 递归重启
    const restart = () => {
        spawn(process.execPath,['./server.js']).on('close',() => {
            return restart()
        })
    }

    server_process.on('close', (code) => {
        console.log(`子进程退出码： ${code}`)
        return restart()
    })

    const { stdin, stdout, stderr } = server_process   // 输入 输出 错误 --- 流

    stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);  
        // 拿到的是 --- log  
        //stdout: 子进程 server启动
       // stdout: 输出log
    });
      
    stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
 }
}

// exec会将spawn的输入输出流转换成String，默认使用UTF-8的编码，然后传递给回调函数，使用回调方式在node中较为熟悉，比流更容易操作，所以我们能使用exec方法执行一些shell命令，
// 然后在回调中获取返回值。有点需要注意，这里的buffer是有最大缓存区的，如果超出会直接被kill掉，可用通过maxBuffer属性进行配置（默认: 200*1024）。
{
    () => {
    child_process_.exec('ls', (err, stdout, stderr) => {
        console.log(`\nstdout: ${stdout}`);  // 会返回当前目录下的文件名
        console.log(`\nstderr: ${stderr}`);
    })
 }
}


// fork 进程通信  --- 传入的是可执行文件
{
 () => {
   const fork = child_process_.fork
   const child = fork('./child.js')
   
   child.on('message', msg => {
       console.log('message from child ---> ' , msg )
   })

   child.send('hello child , I am your father ')
 }
}


/***
 *  高级用法
 *  1. 多个进程监听同一端口   ---- node默认会抛出 EADDRINUSE 错误
 *  2. 主进程 --- 可以做负载均衡
 */

 /**
  *  异常 
  * 开启两个子进程监听一个端口
  */

// +--------------+
// |              |
// |    master    |
// |              |
// +--------+--------------+- -- -- -
// |                                 |
// |                          Error: listen EADDRINUSE
// |                                 |
// |
// +----v----+                      +-----v---+
// |         |                      |         |
// | worker1 |                      | worker2 |
// |         |                      |         |
// +---------+                      +---------+
// ：8000                            ：8000


/**
 *  分发服务 -- 这种做法 ：
 * 但是这么做又会带来另一个问题，代理模式中十分消耗文件描述符（linux系统默认的最大文件描述符限制是1024），文件描述符在windows系统中称为句柄（handle），
 * 习惯性的我们也可以称linux中的文件描述符为句柄。当用户进行访问，首先连接到master进程，会消耗一个句柄，然后master进程再代理到worker进程又会消耗掉一个句柄，
 * 所以这种做法十分浪费系统资源。为了解决这个问题，Node的进程间通信可以发送句柄，节省系统资源。
 * 
 * 句柄是一种特殊的智能指针 。当一个应用程序要引用其他系统（如数据库、操作系统）所管理的内存块或对象时，就要使用句柄。
 */

// +--------------+
// |              |
// |    master    |
// |     ：80     |
// +--------+--------------+---------+
// |                                 |
// |                                 |
// |                                 |
// |                                 |
// +----v----+                      +-----v---+
// |         |                      |         |
// | worker1 |                      | worker2 |
// |         |                      |         |
// +---------+                      +---------+
// ：8000                            ：8001


/**
 * tcp 服务发送句柄
 * 可以在master进程启动一个tcp服务，然后通过IPC将服务的句柄发送给子进程，子进程再对服务的连接事件进行监听
 */

{
    // master.js
    () => {
    var { fork } = require('child_process')
    var server = require('net').createServer()
    server.on('connection', function(socket) {
    socket.end('handled by master') // 响应来自master
    })
    server.listen(3000, function() {
    console.log('master listening on: ', 3000)
    })
    for (var i = 0; i < 2; i++) {
    var child = fork('./child.js')
    child.send('server', server) // 发送句柄给worker
    console.log('worker create, pid is ', child.pid)
    }

    // child.js
    process.on('message', function (msg, handler) {
    if (msg !== 'server') {
        return
    }
    // 获取到句柄后，进行请求的监听
    handler.on('connection', function(socket) {
        socket.end('handled by worker, pid is ' + process.pid)  
    })
    })
 }
} 



/**
 * cluster模块
 * 用于多核CPU环境下多进程的负载均衡。cluster模块创建子进程本质上是通过child_procee.fork，
 * 利用该模块可以很容易的创建共享同一端口的子进程服务器。
 */
 
 const numCPUs = require('os').cpus().length   // 我的是四核
 const cluster = require('cluster')
 const http = require('http')

 {
    if(cluster.isMaster) {
        console.log(`主进程 ---- > pid:  ${process.pid}`)

        for(let i=0;i<numCPUs;i++) {
            cluster.fork().send('master sends message')
        }

        // 监听退出时
        cluster.on('exit',(worker, code ,signal) => {
            console.log(`工作进程 ${worker.process.pid }`)
        })

        // 监听消息
        cluster.on('message', (worker, message , handle) => {
            console.log(`工作进程 ${worker.process.pid}`)
            console.log(`工作进程 ${message}`)
        })

        // 监听事件
        cluster.on('listening', (worker, address) => {
            console.log(
              `A worker is now connected to ${address.address}:${address.port}`);
          });
    }else {
        /**
         * 创建 http 服务
         * 不同用户下访问的进程不同 
         */
        http.createServer((req,res) => {
            const child_ = process.pid
            res.writeHead(200,{ 'Content-Type': 'text/plain;charset=utf-8'})
            res.end(`进程 pid ---> ${child_}`)  // 进程 pid ---> 12655   进程 pid ---> 12656  开启两个页面访问
        }).listen(3000)

        process.on('message', msg => {
            console.log(`from master messages ---> ${msg}`)
        })

        process.send('i am child process ')
    }
 }









