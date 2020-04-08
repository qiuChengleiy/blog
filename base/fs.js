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






































