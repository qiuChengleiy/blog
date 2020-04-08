/**
 * 压缩与解压
 */

  // 使用第三方模块
  const archiver = require('archiver')
  const fs = require('fs')

  // 压缩
 {
    () => {
    const ws = fs.createWriteStream('./test.zip')
    const inpu = './test.jpg'
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    })

    // listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
    ws.on('close', function() {
       console.log(archive.pointer() + ' total bytes');
       console.log('archiver has been finalized and the output file descriptor has closed.');
       console.log('压缩结束')
    });

    archive.on('err', (err) => {
        if (err) throw err ;
    })

    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          throw err;
        }
      });


      // append a file from stream
        // var file1 = __dirname + '/file1.txt';
        // archive.append(fs.createReadStream(file1), { name: 'file1.txt' });
        
        // // append a file from string
        // archive.append('string cheese!', { name: 'file2.txt' });
        
        // // append a file from buffer
        // var buffer3 = Buffer.from('buff it!');
        // archive.append(buffer3, { name: 'file3.txt' });



    // append a file
    // archive.file('file1.txt', { name: 'file4.txt' });
    
    // // append files from a sub-directory and naming it `new-subdir` within the archive
    // archive.directory('subdir/', 'new-subdir');
    
    // // append files from a sub-directory, putting its contents at the root of archive
    // archive.directory('subdir/', false);
    
    // // append files from a glob pattern
    // archive.glob('subdir/*.txt');


    archive.pipe(ws)

    archive.file(inpu, { name: 'zip.jpg' })

    archive.finalize()
    
   }
 }


 // 解压 ---- 
 const unzip = require('unzip')
 {
    fs.createReadStream('./test.zip').pipe(unzip.Extract({ path: 'zip'}))
 }