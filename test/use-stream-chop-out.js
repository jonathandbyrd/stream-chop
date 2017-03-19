var fs = require('fs')
var streamChop = require('../app/stream-chop');
streamChop.lineLength = 4234;
var source = fs.createReadStream('data/outpatient-test-file.txt')
var out = fs.createWriteStream("output/outpatient-test-lines.txt", "utf8");
console.time("test run");
source.pipe(streamChop).pipe(out);

// source.pipe(streamChop);
//
// streamChop.on('readable', function () {
//       var line
//       while (null !== (line = streamChop.read())) {
//            console.log("line= " + line.length);
//       }
// }).pipe(out);
console.timeEnd("test run");
