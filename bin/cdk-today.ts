// tslint:disable:no-console

import inquirer = require('inquirer');
import { Connection } from '../lib/github';
import { PullRequests } from '../lib/pullrequests';

enum Questions {
  PR_ATTENTION = 'PRs assigned to me that need to be reviewed',

  QUIT = 'Quit!',
}

async function ask(conn: Connection) {
  return inquirer.prompt([
    {
      name: 'response',
      type: 'list',
      message: 'Where would you like to start?',
      choices: Object.values(Questions),
    }
  ]).then((answers) => {
    switch (answers.response) {
      case Questions.PR_ATTENTION:
        PullRequests.qAttention(conn).then((prs) => {
          prs.forEach((pr) => {
            console.log(`* ${pr.repo} - ${pr.title} - ${pr.url}`);
          });
        });
        break;
      case Questions.QUIT:
        process.exit();
    }
  });
}

function main() {
  const ghconn = new Connection({
    user: 'nija-at',
  });
  console.log('Welcome to your day!');

  ask(ghconn);

  // TODO: Fix and turn on loop
  // const loop = (): any => {
  //   return ask(ghconn).then(loop);
  // };
  // Promise.resolve().then(loop);
}

main();