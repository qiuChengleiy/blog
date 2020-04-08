
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




































