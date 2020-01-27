const main = async () => {
  const argv = process.argv.slice(2);
  if (!Object.keys(argv).length) {
    require('./cli-interactive').cli();
  } else {
    require('./cli');
  }
};

main();
