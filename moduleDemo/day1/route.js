/*
* day 1  
* 路由初探
*/
'use strict' 

const http = require("http");

http.createServer((req,res) => {

	res.writeHead(200, {"Content-Type": "text/html;charset=UTF8"});

	let id = req.url.substr(7)

	if(req.url.substr(0,7) == "/count/") {
		if(/^\d{5}$/.test(id)) {			// ID 只允许在5位 而且只能是5位数字
			res.end(`count is ${id}`);
		}else {
			res.end('err path')
		}
	}else if(req.url.substr(0,7) == "/pass_/") {
		if(/^\d{5}$/.test(id)) {
			res.end(`pass_ is ${id}`);
		}else {
			res.end('err path')
		}
	}else {
		res.end('err path')
	}
	

	console.log(id)

	res.end();

}).listen(3000,(err) => {
	if (err) throw err;
	console.log('serer is starting on port 3001 O(∩_∩)O哈哈~');
});







