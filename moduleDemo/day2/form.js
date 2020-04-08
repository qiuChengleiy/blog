/*
* day 2  
* FORM:  npm i -S formidable  中间件
*/
'use strict' 

const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const formidable = require('formidable');
const util = require('util');


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
			 // parse a file upload
			    let form = new formidable.IncomingForm();
			    form.encoding = 'utf-8';

			    fs.access('./day2/upload',(err) => {
			    	if (err) {
			    		fs.mkdirSync("./day2/upload");
			    	}
			    })
			   
	
			    form.uploadDir = "./day2/upload";
			 
			    form.parse(req, function(err, fields, files) {

			      console.log(files.file.name);

			      // 文件改名  新名称必须加上路劲
			      if(files.file.name) {
			      	fs.rename(`./${files.file.path}`,`./day2/upload/${files.file.name}`,(err) => {
			      		if(err) console.log(err);
			      	});
			      }

			       res.writeHead(200, {'content-type': 'text/plain'});
			       res.write('received upload:\n\n');
			       res.end(util.inspect({fields: fields, files: files}));  // 工具类
			    });
			 
			    return;
		}
	}

}).listen(3000,(err) => {
	if (err) throw err;
	console.log('serer is starting on port 3000 O(∩_∩)O哈哈~');
});







