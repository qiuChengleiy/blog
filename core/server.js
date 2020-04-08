/**
 * 子进程 http服务
 */

const http = require('http')
http.createServer((req,res) => {
    const query = require('url').parse(req.url).query

    if(query == 'a=1') {
        throw '服务器出错'
    }

    res.writeHead(200)
    res.end(query)

}).listen(8001)

console.log('子进程 server启动')

console.log('输出log')



