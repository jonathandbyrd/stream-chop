var stream = require('stream')
var eol = require('os').EOL

var streamChop = new stream.Transform( { objectMode: true } )
var lineLength;

streamChop._transform = function (chunk, encoding, done) {

        if (this._lastChunk) {
                var newChunk = chunk;
                var oldChunk = this._lastChunk;
                chunk = Buffer.concat([oldChunk, newChunk]);
                this._lastChunk = null
                console.log("oldlen=" + oldChunk.length);
                console.log("newlen=" + newChunk.length);
                console.log("totlen=" + chunk.length);
        }

        var lineLength = this.lineLength;
        var startPos = 0;
        var lines = [];
        var newLineEnding = false;
        var realChunkLength = chunk.length;

        console.log("rclen=" + realChunkLength);
        for(var i = 1; (startPos + lineLength) <= realChunkLength;  i++) {
                var line = chunk.slice(startPos, lineLength * i).toString() + eol;
                lines.push(line);
                startPos += lineLength;
        }

        if ((startPos != chunk.length - 2)){
                if ((startPos + lineLength) > realChunkLength) {
                        this._lastChunk = chunk.slice(startPos);
                        console.log("lclen=" + this._lastChunk.length);
                }
        }

        lines.forEach(this.push.bind(this));
        console.log(`lines in batch: ${lines.length}`);
        done();
}

streamChop._flush = function (done) {
        this._lastChunk + "";
        if (this._lastChunk.length > 0) {
                this.push(this._lastChunk.toString() + eol);
        }
        this._lastChunk = null
        done()
}

module.exports = streamChop, lineLength
