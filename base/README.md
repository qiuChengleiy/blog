# node-notes
node 学习笔记   参考:https://github.com/chyingp/nodejs-learning-guide

### 目录

* 1.node学习
* 2.[express框架学习](../doc/express.js)
* 3.[数据库操作封装](../doc/db.js)

* 解压与压缩

```js


// 1. 资源压缩

const fs = require('fs');
const zlib = require('zlib');


const gzip = zlib.createGzip();

const in_ = fs.createReadStream('./test.jpg');
const out = fs.createWriteStream('./test.zip');

in_.pipe(gzip).pipe(out);


// 中间件使用
var ARCHIVER = require('archiver');
var FS = require('fs');

var presentDate = new Date();
var myDate = presentDate.toLocaleDateString();//获取当前日期，eg:2017-02-08，以此日期为压缩包文件名
var path1 = './test.jpg';//图片的绝对路径
var path2 = './第一张图片.jpg';
var files = [path1,path2];//将图片路径组合成数组形式，用for循环遍历
//压缩后文件输出地址：/ARCHIVER/appData/files/，压缩包名：eg：2017-02-08.zip
var output = FS.createWriteStream('my1.zip');
//archiver可压缩为zip或tar格式，这里选择zip格式，注意这里新定义了一个变量archive，而不是原有的archiver包引用
var archive = ARCHIVER('zip', {
    store: true
});
//将压缩路径、包名与压缩格式连接
archive.pipe(output);
//nameInZIP指压缩包内的文件名
var nameInZIP = ['1.jpg','2.jpg'];
for (var i = 0; i < files.length; i++) {
    console.log(files[i]);
    //FS读取文件流并命名，将读取的文件流append到压缩包中
    archive.append(FS.createReadStream(files[i]), {'name': nameInZIP[i]});
}
//压缩结束
archive.finalize();


// 有问题 能压缩 不能解压 加压是空的
//2. 解压

// const gunzip = zlib.createGunzip();

// const in_zip = fs.createReadStream('./my1.zip');
// const out_ = fs.createWriteStream(__dirname );

// in_zip.pipe(gunzip).pipe(out_);

//中间件使用
var AdmZip = require('adm-zip');
var zip = new AdmZip('./my1.zip'); 
zip.extractAllTo( "./test/");



// http 服务端压缩

const http = require('http');

const zlib = require('zlib');

const fs = require('fs');

const filePath = './html/index.html';
const h = 'hello';


const server = http.createServer((req,res) => {
	const acceptEncoding = req.headers['accept-encoding'];

	var gzip ;

	if(acceptEncoding.indexOf('gzip') != '-1') {
		gzip = zlib.createGzip();

		res.writeHead(200,{
			'Content-Encoding': 'zip'
		});


        res.end(zlib.gzipSync(h) );

	   //const data = fs.createReadStream(filePath).pipe(gzip).pipe(res);
	}else {
		//fs.createReadStream(filePath).pipe(res);
		 res.end(h);
	}
}).listen(8080);

```

* http模块

```js

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

```

* fs文件系统

```js
const fs = require('fs');

fs.readFile('./index.html','utf-8',function(data,err) {
	err? console.log(err) : console.log(data);
})


//通过流来读取

const stream = fs.createReadStream('./index.html','utf-8');

stream.on('data',(chunk) => {
	console.log(chunk);
})

stream.on('err',(err) => {
	console.log(err.message)
}).on('end',() => {
	console.log('没有数据了')
}).on('close',() => {
	console.log('关闭')
}) 

// 这里写入 会将整个文件重写
fs.writeFile('./index.html','<h2>写入</h2>','utf-8',(err) => {
	if(err) {
		throw err;
	}else {
		fs.readFile('./index.html','utf-8',(data,err) => {
			console.log(data);
		})
	}
})


const writeStream = fs.createWriteStream('./test.html','utf-8');

writeStream.on('close',() => {
	console.log('....close')
})

// 追加进去的 但是还是把源文件全部改掉了
writeStream.write('<h2>test</h2>');
writeStream.write('<h4>h4 ...</h4>');
writeStream.write('<h4>h4 hahah</h4>');
writeStream.on('end',() => {
	console.log('....')
})


//判断文件是否存在
fs.access('./index.html',(err) => {
	if(err) {
		throw err;
	}

	console.log('文件存在')
})

//创建目录
fs.mkdir('./mkdir',(err) => {
	if(err) {
		console.log(err.message)
	}

})

//删除文件
fs.unlink('./第一张图片.jpg',(err) => {
	//if(err) throw err;
})


//删除目录
fs.rmdir('./test1',(err) => {
	console.log(err);
})


//读取目录

const dirs = fs.readdirSync('./doc','utf-8');
console.log(dirs);

const path = require('path');

const files = path.resolve('./doc','test');

console.log(files); // /Users/qiuchenglei/file-web/git/node-notes/doc/test

var statsm = fs.statSync(files);
//console.log(statsm);

//遍历目录

const forFile = function(dir) {
	let results = [ path.resolve(dir) ];
	const files_ = fs.readdirSync(dir,'utf-8')

	files_.forEach(function(e) {
		var file = path.resolve(dir,e);

		const stats = fs.statSync(file);

		if(stats.isFile()) {
			results.push(file);
			console.log(file);
		}else if(stats.isDirectory()) {
			results = results.concat(forFile(file));
			console.log(file);
		}
	})

	return results;
}



console.log(forFile('./doc'))
/*['/Users/qiuchenglei/file-web/git/node-notes/doc',
  '/Users/qiuchenglei/file-web/git/node-notes/doc/test',
  '/Users/qiuchenglei/file-web/git/node-notes/doc/test/test.jpg',
  '/Users/qiuchenglei/file-web/git/node-notes/doc/test.html' ]
*/





// 文件重命名 可以是目录也可以是文件

fs.rename('./my1.zip','test.zip',(err) => {
	console.log('yes')
})


//监听文件修改

const options = {
	persistent: true,
	interval: 2000
}

fs.watchFile('./test.html',options,(curr,prev) => {
	console.log('time' + curr.mtime)
	console.log(prev);
})


```

* 进程

```js

const exec = require('child_process').exec;

// 成功的例子
exec('ls -al', function(error, stdout, stderr){
    if(error) {
        console.error('error: ' + error);
        return;
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + typeof stderr);
});


// 失败的例子
exec('ls hello.txt', function(error, stdout, stderr){
    if(error) {
        console.error('error: ' + error);
        return;
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
});


var child_process = require('child_process');

child_process.execFile('node', ['http.js'], function(error, stdout, stderr){
    if(error){
        throw error;
    }
    console.log(stdout);
});

```















