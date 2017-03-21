var fs = require('fs');
var path = require('path');
var streamChop = require('../app/stream-chop');

const INPATIENT_FILE_LENGTH = 5076;
const OUTPATIENT_FILE_LENGTH = 4234;
const dataDirectory = "data";
const outputDirectory = "output";

var customLength = 0; //default

//get the record types; inpatient or outpatient
var recordType = process.argv[2];
if (recordType == undefined || recordType.length <= 0) {
    console.error(`Missing Record Type: [${recordType}]; \n\n
      valid types are \"inpatient\" or \"outpatient\"\n
      e.g. >node stream-chop.js inpatient`);
  return;
}
else {
  if (recordType != "inpatient" && recordType != "outpatient") {
    console.error(`Unrecognized Record Type: [${recordType}]; \n\n
      valid types are \"inpatient\" or \"outpatient\"\n
      e.g. >node stream-chop.js inpatient`);
    return;
  }
  else {
    switch (recordType) {
      case "inpatient":
        customLength = INPATIENT_FILE_LENGTH;
        break;
      case "outpatient":
        customLength = OUTPATIENT_FILE_LENGTH;
        break;
    }
  }
}

//set lengths;
streamChop.lineLength = customLength;

console.time("test run");
//loop thru the data directory
fs.readdir(dataDirectory, function(err, files) {
  if (err) {
    console.error("Could not list the directory", err);
    process.exit(1);
  }

  files.forEach( function (file, index) {
    console.time("file: " + file);

    var dataFile = path.join(dataDirectory, file)
    var outputFile = path.join(outputDirectory, file + ".lines");

    var source = fs.createReadStream(dataFile)
    var out = fs.createWriteStream(outputFile, "utf8");

    source.pipe(streamChop).pipe(out);
    console.timeEnd("file: " + file);
  });
});
// source.pipe(streamChop);
//
// streamChop.on('readable', function () {
//       var line
//       while (null !== (line = streamChop.read())) {
//            console.log("line= " + line.length);
//       }
// }).pipe(out);
console.timeEnd("test run");
