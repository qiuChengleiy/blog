/**
 * path  文件路径
 */

 const path = require('path')
 const fs = require('fs')

 {
     console.log(path.normalize('.....//////test/a./asadd/'))  // ...../test/a./asadd/  去除 多余的 /    window下 \
     console.log(process.cwd())  // /Users/qiuchenglei/web/git/node-notes/core  获取绝对路径

    // 获取扩展名
     console.log(path.extname(process.argv[1]))   // .js    
 }



 // 目录遍历    --- 指令 node path.js  ~/node  会遍历node文件夹
 {
    function forFiles(dir, callback) {
        fs.readdirSync(dir).map(item => {
            const _ = path.join(dir,item) 
            if(fs.statSync(_).isDirectory()) {   // 如果是文件夹继续遍历    ---- 深度优先
                return forFiles(_,callback)
            }else {
                callback(_)
            }
        })
    }

   () => {
    forFiles(process.argv[2],(pathname) => {
        console.log(pathname)

        // ../moduleDemo/.DS_Store
        // ../moduleDemo/day1/1.jpg
        // ../moduleDemo/day1/1.txt
        // ../moduleDemo/day1/fs.js
        // ../moduleDemo/day1/hello.js
        // ../moduleDemo/day1/http.js
        // ../moduleDemo/day1/index.html
        // ../moduleDemo/day1/route.js
        // ../moduleDemo/day1/user.html
        // ../moduleDemo/day2/.DS_Store
        // ../moduleDemo/day2/form.js
        // ../moduleDemo/day2/index.html
        // ../moduleDemo/day2/post.js
        // ../moduleDemo/day2/upload/.DS_Store
        // ../moduleDemo/package.json
    })}
 }


 // 当读取文本文件时 --- 需要去除 utf8 BOM 否则浏览器会解析错误
{
    function readText(pathname) {
        var bin = fs.readFileSync(pathname);
    
        if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
            bin = bin.slice(3);
        }
    
        return bin.toString('utf-8');
    }
}

// GBK 转 UTF8
{
    //const iconv = require('iconv-lite');

    function readGBKText(pathname) {
        const bin = fs.readFileSync(pathname);

        return iconv.decode(bin, 'gbk');
    }
}

// 防止乱码  ---- binary编码
{
    function replace(pathname) {
        var str = fs.readFileSync(pathname, 'binary');
        str = str.replace('foo', 'bar');
        fs.writeFileSync(pathname, str, 'binary');
    }
}




