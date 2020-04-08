/*
* day 1  
* http :
*/
'use strict' 

const http = require("http");  // http 模块
const url = require("url");     // url
const qs = require("querystring");   // 字符串查询模块


http.createServer((req,res) => {

	// 设置请求头
	//res.setHeader({"Content-Type": "text/html;charset=utf-8"})
	
	// 返回请求头
	res.writeHead(200,{"Content-Type": "text/html;charset=utf-8"});
	// .css => text/css .jpg/.png => image/jpeg&png  .js .



	// 输出
	res.write("<h1>hello nodejs</h1>")

	// 两个是对象 一个是请求 一个是响应
	// console.log(req)  
	// console.log(res)

	//req #代表锚点 它后边的hash不会触发网络请求 所以后边携带的参数都不会发送到服务器
	res.write(`${req.url}<br/>`)


	// 对url的解析  req.url #后边的值不会获取到

	res.write(`${url.parse("https://www.baidu.com/s?wd=%23rsv_20").host}<br/>`);  // 输出 host 主机/域名部分
	res.write(`${url.parse(req.url).pathname}<br>`);  // 输出url地址部分 不携带参数
	res.write(`${url.parse(req.url).query}<br>`); // 输出参数部分  a=sada&b=sdjal982
	res.write(`${url.parse("/adasdada/inde.html#13131").hash}<br>`);    // 输出#后边的参数
	res.write(`${url.parse(req.url).search}<br>`);// 输出？问号后边部分  a=sada&b=sdjal982
	// 其他的还有 origin port password protocol协议

	// 参数的解析 ？后边携带的参数
	let json = JSON.stringify(url.parse(req.url,true));
	res.write(`${json.query}<br><br><br>`)  // 会解析成一个对象  获取参数直接加上 query.name

	//Object
	// {
	// "protocol": null,
	// "slashes": null,
	// "auth": null,
	// "host": null,
	// "port": null,
	// "hostname": null,
	// "hash": null,
	// "search": "?a=1&b=2",
	// "query": {
	// 	"a": "1",
	// 	"b": "2"
	// },
	// "pathname": "/adasdada/inde.html",
	// "path": "/adasdada/inde.html?a=1&b=2",
	// "href": "/adasdada/inde.html?a=1&b=2"
	// }


	// 查询字符串模块解析 url参数
	let arg = qs.parse('foo=bar&abc=xyz&abc=123');
	console.log(arg)
	// { foo: 'bar', abc: [ 'xyz', '123' ] }
	// { foo: 'bar', abc: [ 'xyz', '123' ] }

	// 转换 不带参数默认转为下面
	//qs.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
	// 返回 'foo=bar&baz=qux&baz=quux&corge='

	// 带参数： 1:分隔符 2：之间的引用符号
	//qs.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
	// 返回 'foo:bar;baz:qux'


	// 解码  默认情况下是utf-8
	// let code = qs.parse('w=%D6%D0%CE%C4&foo=bar', null, null,{ decodeURIComponent: gbkDecodeURIComponent });
	// console.log(code);


	// url转换  .resolve 第一个参数：原来的地址  第二个参数目标地址
	res.write(`${url.resolve("127.0.0.1:3000/","/admin")}<br>`);   // 127.0.0.1:/admin
	res.write(`${url.resolve("/index.html","username")}<br>`);    // /username
	res.write(`${url.resolve("127.0.0.1:3000/index.html","/user")}<br>`);  // 127.0.0.1:/user



	// 结束响应   结束响应后边就不能执行代码了
	res.end();

}).listen(3000,(err) => {
	if (err) throw err;
	console.log('serer is starting on port 3000 O(∩_∩)O哈哈~');
});







