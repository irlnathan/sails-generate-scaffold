var path = require('path');
var fs = require('fs');
var log = require('npmlog');

log.info('.sailsrc', 'adding sails-scaffolding generator');
var sailsrcPath = path.resolve(process.cwd(), '../..', '.sailsrc');
if (!fs.existsSync(sailsrcPath)) {
  log.info('No .sailsrc found in parent module. Skipping');
  process.exit(0);
}

var sailsrc = JSON.parse(fs.readFileSync(sailsrcPath).toString());
sailsrc.generators.modules.scaffolding = 'sails-scaffolding';

log.info('.sailsrc', 'writing file...');
fs.writeFileSync(sailsrcPath, JSON.stringify(sailsrc, null, 2));
