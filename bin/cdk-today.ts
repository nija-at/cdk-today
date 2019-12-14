// tslint:disable:no-console

import colors = require('colors');
import inquirer = require('inquirer');
import { promisify } from 'util';
import { argv } from 'yargs';
import { Config, ConfigEntries } from '../lib/config';
import { UserError } from '../lib/errors';
import { Connection } from '../lib/github';
import { Issues } from '../lib/issues';

const sleep = promisify(setTimeout);

enum Questions {
  PR_AWAITING_REVIEW = 'PRs assigned to me and need to be reviewed',

  BUG_UNPRIORITIZED = 'Bugs assigned to me and are not prioritized',

  BUG_P1 = 'Bugs assigned to me and whose priority is P1',

  QUIT = 'Quit!',
}

async function ask(conn: Connection) {
  const answers = await inquirer.prompt([
    {
      name: 'response',
      type: 'list',
      message: '🌅 Where would you like to start? 🌅',
      choices: Object.values(Questions),
    }
  ]);
  switch (answers.response) {
    case Questions.PR_AWAITING_REVIEW:
      Issues.qAwaitingReview(conn).then((issues) => {
        console.log(issues.tablify());
      });
      break;
    case Questions.BUG_UNPRIORITIZED:
      Issues.qUnprioritzedBugs(conn).then((issues) => {
        console.log(issues.tablify());
      });
      break;
    case Questions.BUG_P1:
      Issues.qP1Bugs(conn).then((issues) => {
        console.log(issues.tablify());
      });
      break;
    case Questions.QUIT:
      process.exit();
    }
}

async function setup(config: Config): Promise<ConfigEntries> {
  console.log('🌅 Welcome to cdk-today! 🌅');
  console.log('Running first time setup...');
  const answers = await inquirer.prompt([
    {
      name: 'user',
      type: 'input',
      message: 'What is your Github username?',
    }
  ]);
  const data = { user: answers.user, };
  console.log(`Saving configuration to ${config.file}...`);
  await sleep(1500); // a bit of sleep, so the user can read what's on the screen.
  return data;
}

async function main() {
  try {
    const config = new Config({ setup });
    if (argv.setup) {
      await config.setup();
    } else {
      const user = await config.user();
      const ghconn = new Connection({
        user,
      });
      console.log('Welcome to your day!');

      await ask(ghconn);

      // TODO: Fix and turn on loop
      // const loop = (): any => {
      //   return ask(ghconn).then(loop);
      // };
      // Promise.resolve().then(loop);
    }
  } catch (err) {
    if (err.name === UserError.NAME) {
      console.error(colors.red(err.message));
    } else {
      throw err;
    }
  }
}

main();