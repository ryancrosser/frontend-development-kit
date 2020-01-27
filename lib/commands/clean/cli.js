module.exports.cli = () => {
  require('yargs')
    .usage('fdl clean <command>')
    .command(
      'packages',
      'Delete node_modules, lockfiles, and reinstall',
      () => {},
      argv => {
        const {cleanProjectNodeModules} = require('./project-node-modules');
        cleanProjectNodeModules(argv);
      }
    )
    .option('startDirectory', {
      alias: 'dir',
      type: 'string',
      description: 'define the starting directory for the operation'
    })
    .option('ancestryLevel', {
      alias: 'level',
      type: 'integer',
      describe: 'Max directories to ascend to find project root',
      default: 2
    })
    .option('trash', {
      alias: 't',
      type: 'boolean',
      describe: 'Move files to trash (does not permanently delete)',
      default: false
    })
    .option('node_modules', {
      alias: 'node_module',
      type: 'boolean',
      describe: 'Process node_modules',
      default: true
    })
    .option('lockFiles', {
      alias: 'lockFile',
      type: 'boolean',
      describe: 'Process lockfiles (package-lock.json/yarn.lock)',
      default: true
    })
    .option('reinstall', {
      type: 'sting',
      choices: ['npm', 'yarn', false],
      describe: 'Whether or not node_modules should be reinstalled',
      default: 'npm'
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging',
      default: false
    })
    .option('dryRun', {
      alias: 'dry',
      type: 'boolean',
      description: 'Simulate the operation, with verbose logging',
      default: false
    })
    .demandCommand(1, '').argv;
};
