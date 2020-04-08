/**
 * fs模块
 */

const fs = require('fs')
const _ = process.argv[1]

// 小文件拷贝
{
    // 获取命令行参数
    console.log(process.argv) 
    // [ '/usr/local/bin/node',
    //   '/Users/qiuchenglei/web/git/node-notes/core/fs.js',
    //   './fs.js',
    //   './copy.js' ]

    // 文件拷贝功能  --- 小文件
    const copy = (arg) => {
        fs.writeFileSync(arg[1], fs.readFileSync(arg[0]))  // 第一个参数是目标文件  第二个源文件
    }

    const main = (argv) => {
        copy(argv)
    }

   // main(process.argv.slice(2)) --- 执行

    //  process是一个全局变量，可通过process.argv获得命令行参数。由于argv[0]固定等于NodeJS执行程序的绝对路径，argv[1]固定等于主模块的绝对路径，因此第一个命令行参数从argv[2]这个位置开始。
}



// 大文件拷贝
{
    // 对于大文件 我们只能一点一点读  --- 通过创建数据流
    const copy = (arg) => {
        const wr = fs.createWriteStream(arg[1])
        fs.createReadStream(arg[0]).pipe(wr)

        let i = 0;
        const timer = setInterval(() => i++ ,1000)

        wr.on('finish',() => {
            clearInterval(timer)
            console.log('文件拷贝完成 ----> 耗时'+ `${i}s`)
            fs.close()   // 关闭
        })
    }

    const main = (argv) => {
        copy(argv)
    }

   // main(process.argv.slice(2))
}



// 常用的文件属性
{
    // 返回一个文件描述对象
    const stat = fs.statSync(_)
   // console.log(stat,'\n')
}


// 异步IO
{
    fs.readFile(_,(err,data) => {
        if(err) {
            throw err
        }else {
           // console.log(data.toString())  // data 是一个Buffer类
        }
    })

    // 异步操作
    try{
        const data = fs.readFileSync(_)
       // console.log(data.toString())
    } catch(err) {
        throw err
    }
}

// 文件追加
{
  () => {
    const data = fs.readFileSync(process.argv[2])
    const _n = data.toString('utf-8').split('\n')
    const script = '<script scr="test.js"></script>'
     _n.splice(_n.length-2,0,script)
    fs.writeFileSync(process.argv[2], _n.join('\n'))
  }
}

// 文件常规操作
{
  () => {
    // 删除
    fs.unlinkSync('./1.txt')

    // 重新命名
    fs.renameSync('./test.html', './index.html')
  }
}




