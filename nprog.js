
//console.log(typeof process.stdin);
//console.log(typeof process.stdin.fd);
let fs = require("fs");
let outf = fs.openSync("ndbg.log","a+",0666);
fs.writeSync(outf, "started\n");
fs.fsyncSync(outf);
function log(msg) {
    fs.writeSync(outf, msg + "\n");
    fs.fsyncSync(outf);        
}
log("log started");
//process.stdin.setEncoding(null);
process.stdin.on("readable", function(){
    log("readable now");
    let buffer = new Buffer(4);
    let bytesRead = fs.readSync(process.stdin.fd,buffer,0,4);
    log(bytesRead);
    log(buffer.toString("hex"));
    let needToRead = buffer.readUInt32LE();
    log("need to read: " + needToRead);
    log("----");

    let messageBuffer = new Buffer(needToRead);
    bytesRead = fs.readSync(process.stdin.fd, messageBuffer,0,needToRead)
    log("read the message!");
    log(messageBuffer.toString());
    /*
    // tony notes this would only return a strign
    // tried removing setEncoding line did not help
    // either got object or string not a buffer like you
    // need
    const chunk = process.stdin.read(4);
    if (chunk !== null) {
        log("read this");
        log(typeof chunk);
        log(chunk);
        log("----")
    }
    */
});

