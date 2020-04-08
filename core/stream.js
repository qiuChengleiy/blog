/**
 * stream 数据流
 */

const fs = require('fs')

 {
     const rs = fs.createReadStream(process.argv[2])
     const ws = fs.createWriteStream(process.argv[3])
     let html = ''
     rs.on('data', (chunk) => {
         // console.log(chunk) 
         // 返回的是二进制的一个数据
         // <Buffer 3c 21 44 4f 43 54 59 50 45 20 68 74 6d 6c 3e 0a 3c 68 74 6d 6c 20 6c 61 6e 67 3d 22 65 6e 22 3e 0a 3c 68 65 61 64 3e 0a 20 20 20 20 3c 6d 65 74 61 20 ... >
         html+=chunk.toString('utf-8')

         // 代码改进 --- 加入写入流
         {
            if(!ws.write(chunk)) {   // 写入流跟不上读入流时  停掉 -- 此处判断是否写入目标
                rs.pause()
            }
         }
         
     })

     rs.on('end', () => {
         ws.end()  // 读取结束时 
     })

     ws.on('drain', () => {
         rs.resume() 
     })

     rs.on('close', () => {
         console.log('读取完成 ---- > 解析文件: \n')
         console.log(html)

        //解析得到的文件
        //  <!DOCTYPE html>
        // <html lang="en">
        // <head>
        //     <meta charset="UTF-8">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <meta http-equiv="X-UA-Compatible" content="ie=edge">
        //     <title>Document</title>
        // </head>
        // <body>
        //     createReadStream  here !
        // </body>
        // </html>
     })

 }


 // 另一种是使用 提供的pipe
 {
    // 参考fs.js
 }