/**
 * buffer  处理二进制数据
 */


 // 好像是废弃了 
 {
     const str = 'hello word'

     const buf = new Buffer(str,'utf-8')

     console.log(buf) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 64>
 }


 // 带有汉字 数字 字母 不用考虑范围
 {
     const str = '今天是礼拜二 学习nodejs的 1 天'

     const buf = Buffer.from(str)

     const buf_ = Buffer.allocUnsafe(buf.length)

     buf_.fill(str, 0)

     console.log(buf_.toString())  // 可以互转  --- 今天是礼拜二 学习nodejs的 天
 }


 