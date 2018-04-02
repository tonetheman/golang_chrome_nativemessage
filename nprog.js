
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

function tryone() {
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
}


function trytwo() {
    // big big buffer
    // max len for a cnm
    let buffer = new Buffer(1024*1024);
    let pos = 0;

    // read in the 4 bytes
    fs.read(process.stdin.fd, buffer, pos, 4, null, function(err,bytesRead,buffer) {
        if (err) {
            log("got err in 4 byte read 1: " + err);
            return;
        }
        log("no error in 4 byte read!: " + bytesRead);
        log("got 4 bytes in buffer now");
        // figure out the next read size
        let needToRead = buffer.readUInt32LE(pos);
        log("need to read is: " + needToRead);

        // next read here full message
        fs.read(process.stdin.fd, buffer, 4, needToRead,null, function(err2,bytesRead2,buffer2) {
            if (err2) {
                log("got err2 in 4 bytes read 2: " + err);
                return;
            }
            log("no error in rest of the read! "  + bytesRead2);
            log(buffer2.toString("utf8",4,4+needToRead));
        } );
    });
}

const { Writable } = require("stream");
let util = require("util");

class TonyWriteStream extends Writable {
    constructor(options) {
        super(options);
    }

    _write(chunk, encoding, callback) {
        log("TS:_write:" + util.inspect(chunk));
        // need to read a uint32 starting at pos 0
        let needToRead = chunk.readUInt32LE(0);
        log("TS:_write:needtoread: " + needToRead);
        // read a string starting at byte 4
        // end here is 4 + needToRead
        let msg = chunk.toString("utf8",4, 4+needToRead);
        log("TS:_write:msg: " + msg);
        callback();
    }

    _final(callback) {
        callback();
    }
}

let ts = new TonyWriteStream();
process.stdin.pipe(ts);