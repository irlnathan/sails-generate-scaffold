var path = require('path');
var fs = require('fs');
var log = require('npmlog');

log.info('.sailsrc', 'adding sails-scaffolding generator');
var sailsrcPath = path.resolve(process.cwd(), '.sailsrc');
var sailsrc = JSON.parse(fs.readFileSync(sailsrcPath).toString());
sailsrc.generators.modules.scaffolding = 'sails-scaffolding';

log.info('.sailsrc', 'writing new file...');
fs.writeFileSync(sailsrcPath, JSON.stringify(sailsrc, null, 2));
