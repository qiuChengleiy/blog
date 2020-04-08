/**
 *  http 网络编程
 *  两种使用方式:    1. 服务端  2.客户端  
 */

 const http = require('http')

 // 创建http服务器
 // HTTP请求本质上是一个数据流，由请求头（headers）和请求体（body）组成
// http模块在接受到请求头后 会调用回调函数
{
    const app = http.createServer((req,res) => {
       // console.log(req.headers)
        // 完整的请求头
        // { host: 'localhost:8001',
        // connection: 'keep-alive',
        // 'cache-control': 'max-age=0',
        // 'upgrade-insecure-requests': '1',
        // 'user-agent':
        // 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
        // accept:
        // 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        // 'accept-encoding': 'gzip, deflate, br',
        // 'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        // cookie: 'Hm_lvt_080836300300be57b7f34f4b3e97d911=1529056422' }
        
        const headers = {
            'Content-Type': 'text-plain'
        }

        // let body = [];
        // req.on('data', (chunk) => {
        //     chunk.toString()
        //     body.push(chunk)
        // })

        // req.on('end', () => {
        //     body = Buffer.concat(body)
        //     console.log(body.toString())
        // })
        
        res.writeHead(200,headers)
        res.end(process.argv[2])
        
    })

    // app.listen(8000)
}

// client    ---- https | http解析
const https = require('https')
const fs = require('fs')

{
    () => {
    // http
    https.get('https://www.bilibili.com',(res) => {
        console.log(res.headers)
        let data = ''
        res.on('data', (chunk) => {
            data+=chunk.toString()
        })

        res.on('end',() => {
            console.log(data)   //  返回html 字符串
        })
    })

    // 文件下载
    const url = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560310882335&di=3c11ef2b81970197eac6c607305ddb79&imgtype=0&src=http%3A%2F%2Fpic9.nipic.com%2F20100923%2F2531170_140325352643_2.jpg'
    const ws = fs.createWriteStream('./test.jpg')

    let receivedBytes = 0;
    let totalBytes = 0;
    
    https.get(url,(res) => {
        res.pipe(ws)

        totalBytes = parseInt(res.headers['content-length'], 10);

        res.on('data', (chunk) => {
            // 更新下载的文件块字节大小
            receivedBytes += chunk.length;
        })

        const timer = setInterval(() =>  console.log('当前进度---->'+((receivedBytes/totalBytes)*100).toFixed(2) + '%'),0)

        ws.on('finish',() => {
            console.log('写入完成')
            clearInterval(timer)
        })

        res.on('end',() => {
            console.log('写入结束')   //  返回html 字符串
            ws.close()
        })
    })}

}


// 创建https 服务器
// https模块与http模块极为类似，区别在于https模块需要额外处理SSL证书
{
    () => {
    const options = {
        key: fs.readFileSync('./ssl/default.key'),
        cert: fs.readFileSync('./ssl/default.cer')
    };

    const server = https.createServer(options, function (request, response) {
            // ...
    });

    // NodeJS支持SNI技术，可以根据HTTPS客户端请求使用的域名动态使用不同的证书，因此同一个HTTPS服务器可以使用多个域名提供服务。接着上例，可以使用以下方法为HTTPS服务器添加多组证书。
    server.addContext('foo.com', {
        key: fs.readFileSync('./ssl/foo.com.key'),
        cert: fs.readFileSync('./ssl/foo.com.cer'),
        rejectUnauthorized: false
        // 如果目标服务器使用的SSL证书是自制的，不是从颁发机构购买的，默认情况下https模块会拒绝连接，提示说有证书安全问题。
        //在options里加入rejectUnauthorized: false字段可以禁用对证书有效性的检查，从而允许https模块请求开发环境下使用自制证书的HTTPS服务器
    });
    
    server.addContext('bar.com', {
        key: fs.readFileSync('./ssl/bar.com.key'),
        cert: fs.readFileSync('./ssl/bar.com.cer')
    });


    // client
    const options_ = {
        hostname: 'www.example.com',
        port: 443,
        path: '/',
        method: 'GET'
    };

    const request = https.request(options_, function (response) {});

    request.end()}
}


// url 解析
const url = require('url')
const queryString = require('querystring')
{

    http.createServer((req,res) => {
        const reqUrl = req.url
        const _ = url.parse(reqUrl)  // url解析  --- 有用的字段为   *** query    pathname

        res.writeHead(200,{ 'Content-Type': 'text/plain' })
        res.end(JSON.stringify(_))
        //{"protocol":null,
        //   "slashes":null,
        //   "auth":null,
        //   "host":null,
        //   "port":null,
        //   "hostname":null,
        //   "hash":null,
        //   "search":"?a=1",
        //   "query":"a=1",
        //   "pathname":"/test/user",
        //   "path":"/test/user?a=1",
        //   "href":"/test/user?a=1"}

        // 转成url
        const url_ = url.format({protocol: 'http',host: 'www.baidu.com',pathname: '/search',search: 'a=1'})
        console.log(url_)
        // http://www.baidu.com/search?a=1

        // query参数解析
        const query = queryString.parse('a=1&a=100&a=50&b=2')
        console.log(query) // { a: [ '1', '100', '50' ], b: '2' }

    }).listen(8000)
}









