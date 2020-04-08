/**
 * fs模块
 */

const fs = require('fs')

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
        })
    }

    const main = (argv) => {
        copy(argv)
    }

    copy(process.argv.slice(2))
}



