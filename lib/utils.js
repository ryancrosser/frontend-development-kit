import {parserConfiguration} from './parser-args';

export const argParser = (commandArgs, options) => {
  console.log('commandArgs', commandArgs);
  console.log('options', options);

  return Object.assign(options[commandArgs], parserConfiguration);
};

export const getCommand = args => {
  return args[0];
};
