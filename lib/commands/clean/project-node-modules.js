const path = require('path');
const fsPromises = require('fs').promises;
const chalk = require('chalk');
const del = require('del');
const execa = require('execa');
const trash = require('trash');

const DEFAULT_OPTIONS = {
  startDirectory: process.cwd(),
  dryRun: false
};

const cleanProjectNodeModules = async (_options = DEFAULT_OPTIONS) => {
  const options = Object.assign({}, DEFAULT_OPTIONS, _options);
  if (options.verbose) {
    console.log();
    console.log(chalk.blue.underline('Options:'));
    console.log({
      startDirectory: options.startDirectory,
      node_modules: options.node_modules,
      lockFiles: options.lockFiles,
      ancestryLevel: options.ancestryLevel,
      reinstall: options.reinstall,
      dryRun: options.dryRun,
      verbose: options.verbose
    });
    console.log();
  }

  // check if directory has package.json file and node_modules directory
  let level = 0;
  let currentPath = path.resolve(options.startDirectory);

  // find project root
  while (!(await isProjectRoot(currentPath)) && level < options.ancestryLevel) {
    currentPath = path.join(currentPath, '..');
    level++;
  }
  if (!(await isProjectRoot(currentPath))) {
    console.log(
      chalk.red(
        `Could not find project root in current directory (${options.startDirectory}) or within ${
          options.ancestryLevel
        } parent ${options.ancestryLevel > 1 ? 'directories' : 'directory'}.`
      )
    );
  }
  const projectRootPath = currentPath;

  // remove node_modules
  if (options.node_modules) {
    try {
      const nodeModulesPath = path.join(projectRootPath, 'node_modules');
      const stat = await fsPromises.stat(nodeModulesPath);
      if (stat && stat.isDirectory()) {
        if (options.trash) {
          if (!options.dryRun) {
            await trash(nodeModulesPath);
          }
          if (options.verbose || options.dryRun) {
            console.log(chalk.white('Moved node_modules/ to the trash.'));
          }
        } else {
          const deletedDirectoryPaths = await del(nodeModulesPath, {dryRun: options.dryRun});
          if (options.verbose || options.dryRun) {
            console.log(chalk.white(`Deleted ${deletedDirectoryPaths}.`));
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // remove package-lock.json
  if (options.lockFiles) {
    try {
      const packageLockPath = path.join(projectRootPath, 'package-lock.json');
      const stat = await fsPromises.stat(packageLockPath);
      if (stat && stat.isFile()) {
        if (options.trash) {
          if (!options.dryRun) {
            await trash(packageLockPath);
          }
          if (options.verbose || options.dryRun) {
            console.log(chalk.white('Moved package-lock.json to the trash.'));
          }
        } else {
          const deletedDirectoryPaths = await del(packageLockPath, {dryRun: options.dryRun});
          if (options.verbose || options.dryRun) {
            console.log(chalk.white(`Deleted ${deletedDirectoryPaths}.`));
          }
        }
      }
    } catch (err) {
      if (options.verbose) {
        if (options.verbose && err.code === 'ENOENT' && err.syscall === 'stat') {
          console.log(chalk.red('Package-lock.json file not found, could not delete'));
        } else {
          console.log(chalk.yellow(err.message));
        }
      }
    }
  }

  // remove yarn.lock
  if (options.lockFiles) {
    try {
      const yarnLockPath = path.join(projectRootPath, 'yarn.lock');
      const stat = await fsPromises.stat(yarnLockPath);
      if (stat && stat.isFile()) {
        if (options.trash) {
          if (!options.dryRun) {
            await trash(yarnLockPath);
          }
          if (options.verbose || options.dryRun) {
            console.log(chalk.white('Moved yarn.lock to the trash.'));
          }
        } else {
          const deletedDirectoryPaths = await del(yarnLockPath, {dryRun: options.dryRun});
          if (options.verbose || options.dryRun) {
            console.log(chalk.white(`Deleted ${deletedDirectoryPaths}.`));
          }
        }
      }
    } catch (err) {
      if (options.verbose && err.code === 'ENOENT' && err.syscall === 'stat') {
        console.log(chalk.red('Yarn.lock file not found, could not delete'));
      } else {
        console.log(chalk.red(err.message));
      }
    }
  }

  if (options.reinstall) {
    try {
      if (options.reinstall === 'npm') {
        console.log(chalk.white('Reinstalling packages with npm'));
        let output;

        if (options.dryRun) {
          const {stdout} = await execa('npm', ['install', '--dry-run']);
          output = stdout;
        } else {
          const {stdout} = await execa('npm', ['install']);
          output = stdout;
        }
        if (options.verbose) {
          console.log(output);
        }
        console.log(chalk.white('Done.'));
      } else if (options.reinstall === 'yarn') {
        chalk.white('Reinstalling packages with yarn');
        // no dry run option for yarn
        let output;
        if (!options.dryRun) {
          const {stdout} = await execa('yarn', ['install']);
          output = stdout;
        }
        if (options.verbose) {
          console.log(output);
        }
        console.log(chalk.white('Done.'));

        // console.log(stdout);
      }
    } catch (err) {
      console.log(chalk.red(err.message));
    }
  }

  console.log();
  console.log(chalk.green('Finished.'));

  process.exit();
};

const isProjectRoot = async directoryPath => {
  try {
    if (
      (await fsPromises.stat(path.resolve(directoryPath))).isDirectory() &&
      (await fsPromises.stat(path.join(path.resolve(directoryPath), 'package.json'))).isFile()
    ) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
module.exports.cleanProjectNodeModules = cleanProjectNodeModules;
