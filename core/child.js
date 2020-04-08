/**
 * 子进程
 */

process.on('message', msg => {
    console.log('from father:  -----> ' , msg)
})


let num = 0;

// 隔一秒发一次信息
setInterval(() => {
    process.send(`i love you ${num} times`)
    num++
},1000)





