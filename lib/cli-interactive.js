const fs = require('fs');
const {Select, Input} = require('enquirer');

const cleaner = require('./cleaner');

module.exports.cli = async () => {
  const responses = {};

  let selection;

  do {
    const startDirectoryPrompt = new Input({
      name: 'startDirectory',
      message: 'Where do you want to start looking?',
      initial: process.cwd(),
      validate: input => {
        if (!fs.existsSync(input)) {
          return `Path does not exist: ${input}`;
        }
        return true;
      }
    });
    responses.startDirectory = await startDirectoryPrompt.run();

    const ignoreGlobalPackagesPrompt = new Select({
      name: 'ignoreGlobalPackages',
      message: 'Ignore global packages?',
      choices: ['yes', 'no'],
      initial: 'yes',
      result: input => {
        if (input === 'yes') {
          return true;
        } else {
          return false;
        }
      }
    });
    responses.ignoreGlobalPackagesPrompt = await ignoreGlobalPackagesPrompt.run();

    const dryRunPrompt = new Select({
      name: 'dryRun',
      message: 'Do you want to test the process?',
      choices: ['yes', 'no'],
      initial: 'no',
      result: input => {
        if (input === 'yes') {
          return true;
        } else {
          return false;
        }
      }
    });
    responses.dryRunPrompt = await dryRunPrompt.run();
  } while (selection !== 'exit');

  cleaner(responses);
};
