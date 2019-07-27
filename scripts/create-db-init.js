'use strict';

const fs = require('fs'),
  path = require('path'),
  sqlFolderPath = 'sql',
  initializationFileName = 'initialization.sql';

function readAllFilesInDirectory(directory) {
  let result = '';

  fs.readdirSync(directory).forEach(fileName => {
    result += `${fs.readFileSync(path.join(directory, fileName))}\n\n`;
  });

  return result;
}

let initializationContent = '';

// start with the script(s) to create database(s)
initializationContent += `${readAllFilesInDirectory(
  path.join(sqlFolderPath, 'databases')
)}`;

// add script(s) to create table(s)
initializationContent += `${readAllFilesInDirectory(
  path.join(sqlFolderPath, 'tables')
)}`;

// add script(s) to create trigger(s)
initializationContent += `${readAllFilesInDirectory(
  path.join(sqlFolderPath, 'triggers')
)}`;

// we have everything we need, write the file
const initializationFilePath = path.join(sqlFolderPath, initializationFileName);
fs.writeFileSync(initializationFilePath, initializationContent);
console.log(`Wrote initialization file to ${initializationFilePath}`);
