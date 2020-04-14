const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer(function(req,res){
    let filepath = null;
    if(req.url==='/'){
        filepath = path.join(__dirname,'public','index.html');
    } 
    else if(req.url==='/about'){
        filepath = path.join(__dirname,'public','about.html');
    }
    else if(req.url==='/contact'){
        filepath = path.join(__dirname,'public','contact.html');
    }
    else if(req.url==='/post'){
        filepath = path.join(__dirname,'public','post.html');
    }
    else{
        filepath = path.join(__dirname,'public',req.url);
    }

    let extname = path.extname(filepath);
    let contenttype = 'text/html';
    switch(extname){
        case '.css' :
            contenttype = 'text/css';
            break;
        case '.js':
            contenttype = 'text/js';
            break;
        case '.json':
            contenttype = 'application/json';
            break;
        case '.png':
            contenttype = 'image/png';
            break;
        case '.jpg':
            contenttype = 'image/jpg';
            break;
        case '.scss':
            contenttype = 'text/scss';
            break;
    }

    fs.readFile(filepath,function(err,content){
        if (err){
            if(err.code=='ENOENT'){
                fs.readFile(path.join(__filename,'public','404.html'),function(err,content){
                    if (err) throw err;
                    res.writeHead(500);
                    res.end(200,{'Content-Type':'text/html'});
                });
            }else{
                //different server error
                res.writeHead(500)
                res.end(`Server Error : ${err.code}`)
            }
        }else{
            res.writeHead(200,{'Content-Type':contenttype});
            res.end(content,'utf8');
        }
    });
});

const PORT  = process.env.PORT || 5000

server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));