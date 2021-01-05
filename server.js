const http = require('http');
const path = require('path');
const fs = require('fs');

let p = path.join(__dirname, '/workingfolder')


myFunc = () => {
    fs.stat(p, (err, stats) => {
        if (err) {
            console.log("Working Directory not found. Creating one.")
            fs.mkdir(p, { recursive: true }, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log("we will now create a new file with its name being timestamp and its content being time stamp")
                    let d = new Date();
                    fs.writeFile(path.join(p, String(d)), String(d), (err) => {
                        if (err) throw err;
                    })
                }
            });

        } else {
            console.log("Status of folder found is: ", stats.isDirectory(), "We will now create a timestamped file");
            let d = new Date();
            fs.writeFile(path.join(p, String(d)), String(d), (err) => {
                if (err) throw err;
            })
        }
    })
}


http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        "Access-Control-Allow-Origin": "*"
    });
    if (req.url === '/createfile') {
        myFunc();
        res.write(JSON.stringify({
            "message": "File Created"
        }))
        res.end()

    } else if (req.url === '/getmyfiles') {
        if (!fs.existsSync(p)) {
            res.write(JSON.stringify({
                "message": "No files/dir founf first use '/createfile' end-point to create files and then /getmyfiles end-point to retrieve files"
            }))
            res.end()
        } else {
            fs.readdir(p,"utf8",(err,files)=> {
                let fileNameArray =[]

                files.forEach(file => {
                    fileNameArray.push(path.basename(file))
                })

                res.write(JSON.stringify({
                    "List of Files": fileNameArray
                }))

                res.end();

            })
        }
    } else {
        res.write(JSON.stringify({
            "message": "Use '/createfile' end-point to create files and /getmyfiles end-point to retrieve files"
        }))
        res.end()
    }
}).listen(4321)