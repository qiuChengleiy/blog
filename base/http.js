// dns 解析

const dns = require('dns');
dns.lookup('www.baidu.com',function(err,address,family) {
	if(err) throw err;
	console.log(address);
})

dns.resolve4('localhost',(err,address) => {
	console.log(JSON.stringify(address))
})


//http

const http = require('http')
const url = require('url')
const querystring = require('querystring');

const server = http.createServer((req,res) => {
	const url_ = req.url;
	const urlp = url.parse(url_);
	const query = urlp.query
	const urlobj = querystring.parse(query);

	console.log(url_,req.method);
	//header
	const headers = req.headers;
	res.end(JSON.stringify(urlobj));

头部

	// 增
res.setHeader('Content-Type', 'text/plain');

// 删
res.removeHeader('Content-Type');

// 改
res.setHeader('Content-Type', 'text/plain');
res.setHeader('Content-Type', 'text/html');  // 覆盖

// 查
res.getHeader('content-type');

res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff'
    });

res.setHeader('Content-Type', 'text/html; charset=utf-8');


  if(req.url == '/home' && req.method == 'POST'){   //这里要大写
  	
  	req.on('aborted',function() {
  		console.log('发起请求')
  	})

  	req.on('close',function() {
  		console.log('请求关闭')
  	})



	var body = '';

	req.on('data',(chunk) => {
		body+=chunk;
	})

	req.on('end',() => {
		
		//res.end(body_);
		//console.log(querystring.parse(body))
		const posts = querystring.parse(body)
		const obj = JSON.parse(JSON.stringify(posts));
		console.log(obj);
		res.write(obj);
		//res.send();
		res.end('ok');
	})
	
  }
  //res.end('ok')

}).listen(3000);



//client

const client = http.get('http://127.0.0.1:8003/home',(res) => {
	//console.log(res);
	res.pipe(process.stdout);
	console.log(res.statusCode)
	//返回给后台
})

var net = require('net');

var PORT = 8989;
var HOST = '127.0.0.1';

var servers = net.createServer(function(socket){
    console.log('Connected: ' + socket.remoteAddress + ':' + socket.remotePort);
    
    socket.on('data', function(data){
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
        console.log('Data is: ' + data);

        socket.write('Data from you is  "' + data + '"');
    });

    socket.on('close', function(){
         console.log('CLOSED: ' +
            socket.remoteAddress + ' ' + socket.remotePort);
    });
});
servers.listen(PORT, HOST);

console.log(servers instanceof net.Server);  // true






































