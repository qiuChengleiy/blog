/*
* day 1  
* fs :
*/
'use strict' 

const http = require("http");
const fs = require("fs");

const global_path = './day1/';

http.createServer((req,res) => {

	res.writeHead(200, {"Content-Type": "text/html;charset=UTF8"});

	// 读取文件
	fs.readFile(`${global_path}/1.txt`, {"charset": "utf-8"}, (err,data) =>{   // 异步执行  执行顺序上外部代码先执行 回调是I/O操作完成后调用
		if (err) throw err;
		res.end(data);
	})

	// 创建文件夹  异步执行
	fs.mkdir(`${global_path}upload/image`,(err) => {   //  注意： 在创建image之前 upload要存在 不能直接写  /upload/image
		if (err) console.log(err);
	});

	//检查文件 可以是文件夹或者可执行文件
	fs.stat(`${global_path}/upload/image`,(err,stats) => {
			if(err) console.log(err)

			// 获取文件的大小；
    		console.log(stats.size);

    		// 获取文件最后一次访问的时间；
		    console.log(stats.atime.toLocaleString());
			// 文件创建的时间；
		    console.log(stats.birthtime.toLocaleString());
			// 文件最后一次修改时间；
		    console.log(stats.mtime.toLocaleString());
			// 状态发生变化的时间；
		    console.log(stats.ctime.toLocaleString())
			// 判断是否是目录；是返回true；不是返回false；
		    console.log(stats.isFile())
		    // 判断是否四文件夹
			console.log(stats.isDirectory()); // true


		   //	res.end("我是先调用的");     //  先调用回调/// 此时已经结束了 程序进行  并不会执行上边读取 txt文件的回调
		   // 这里最好不要 res.end 结束请求  因为可能有其他已经执行的回调还没有调用
		})

	// 查看文件夹下的所有文件 文件夹只会显示文件夹不会显示内部文件或者说是不会吧嵌套的文件夹或文件输出
	fs.readdir('./day1',(err,files) => {
		if (err) console.log(err);
		console.log(files)
		// 返回
		// [ '1.jpg',
		//   '1.txt',
		//   'fs.js',
		//   'hello.js',
		//   'http.js',
		//   'index.html',
		//   'route.js',
		//   'upload',
		//   'user.html' ]


		// 迭代文件夹目录 ： 异步变同步  （异步执行会导致某些检测直接跳过）
		let dirArr = [];  // 存储文件

		(function iterator(i){
			// 迭代结束
			if(i == files.length) {
				return
			}

			fs.stat(`./day1/${files[i]}`,(err,stats) => {
				if (err) console.log(err);
				if(stats.isDirectory()) {
					// dirArr.push(files[i])
					fs.readdir(`./day1/${files[i]}`,(err,file_) => {
						if (err) console.log(err);
						console.log(file_)
					})
				}
				iterator(i+1);  // 遍历
				console.log(dirArr)
			})


		})(0)
	})


}).listen(3000,(err) => {
	if (err) throw err;
	console.log('serer is starting on port 3000 O(∩_∩)O哈哈~');
});



// 补充：

//遍历目录 （推荐使用）
const path = require('path');

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

console.log(forFile('./day1'))
// [ '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/1.jpg',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/1.txt',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/fs.js',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/hello.js',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/http.js',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/index.html',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/route.js',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/upload',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/upload/image',
//   '/Users/qiuchenglei/node/NodeJS进阶学习/moduleDemo/day1/user.html' ]


// 判断文件是否存在
fs.access(`${global_path}/1.jpg`,(err) => {
	if(err) {
		throw err;
	}

	console.log('文件存在')
})




//删除文件
// fs.unlink('./第一张图片.jpg',(err) => {
// 	//if(err) throw err;
// })


// //删除目录
// fs.rmdir('./test1',(err) => {
// 	console.log(err);
// })



// 文件重命名 可以是目录也可以是文件

// fs.rename('./1.jpg','2.jpg',(err) => {
// 	console.log('yes')
// })



// 获取文件拓展名
console.log(path.extname("sdad/sdada/index.html"));






























