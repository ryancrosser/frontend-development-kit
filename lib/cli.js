const yargs = require('yargs');

yargs
  .command('clean', 'Perform clean up operations', argv => {
    require('./commands/clean/cli').cli();
  })
  .help()
  .demandCommand(1, '').argv;
