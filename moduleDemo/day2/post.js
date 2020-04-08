/*
* day 2  
* POST:  node通过分割post发来的数据 通过事件监听来实现
*/
'use strict' 

const http = require("http");
const fs = require("fs");
const qs = require("querystring");

let res_ = (res,page) => fs.readFile(page, (err,data) => {
		if (err) throw err;
		res.writeHead(200, {"Content-Type": "text/html;charset=UFT-8"});
		res.end(data);
	});

http.createServer((req,res) => {
	
	if(req.url == "/") {
		 res_.call(this,res,"./day2/index.html")
	}else {
		if(req.url == "/admin" && req.method == "POST") {
			let data = '';
			req.on('data',(chunk) => {
				data+=chunk;
				console.log(data) // <Buffer 7b 22 75 73 65 72 6e 61 6d 65 22 3a 22 64 61 22 2c 22 70 61 73 73 77 6f 72 64 22 3a 22 64 61 64 61 22 7d>
			});

			req.on('end',(err) => {
				if(err) console.log(err);
				console.log(data.toString()); //{"username":"dadsa","password":"sdada"}
				 res.writeHead(200, {"Content-Type": "text/html;charset=UFT-8"});
				 res.end(data.toString())
			})
		}
	}

}).listen(3000,(err) => {
	if (err) throw err;
	console.log('serer is starting on port 3000 O(∩_∩)O哈哈~');
});







