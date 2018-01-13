#!/usr/bin/env node

const debug = require('debug')('migrations');

const version = process.argv[2];
const migrationFile = `./v${version}.js`;
const migrate = require(migrationFile);

migrate().then(() => {
  debug('Migration successful \n');
  process.exit(0);
}).catch(error => {
  debug(`${error.message} \n`);
  process.exit(1);
});

