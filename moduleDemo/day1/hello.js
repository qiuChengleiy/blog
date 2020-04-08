/*
* day 1  
* 初识Node
*/
'use strict' 

const http = require("http");
const fs = require("fs");

let res_ = (res,page) => fs.readFile(page, (err,data) => {
		if (err) throw err;
		res.writeHead(200, {"Content-Type": "text/html;charset=UFT-8"});
		res.end(data);
	});

// node中没有web容器的概念，每一次的请求都要通过路由来处理

http.createServer((req,res) => {
	
	//比如：读取一张图片
	if(req.url == "/1.jpg") {
		fs.readFile("1.jpg", (err,data) => {
		if (err) throw err;
		res.writeHead(200, {"Content-Type": "image/jpg"});
		res.end(data);
	  });
	}else {
		req.url == "/" ? res_.call(this,res,"index.html") : res_.call(this,res,"user.html");
	}

}).listen(3000,(err) => {
	if (err) throw err;
	console.log('serer is starting on port 3001 O(∩_∩)O哈哈~');
});







