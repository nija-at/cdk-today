// tslint:disable:no-console

import inquirer = require('inquirer');
import { Connection } from '../lib/github';
import { Issues } from '../lib/issues';
import { PullRequests } from '../lib/pullrequests';

enum Questions {
  PR_AWAITING_REVIEW = 'PRs assigned to me and need to be reviewed',

  BUG_UNPRIORITIZED = 'Bugs assigned to me and are not prioritized',

  BUG_P1 = 'Bugs assigned to me and whose priority is P1',

  QUIT = 'Quit!',
}

async function ask(conn: Connection) {
  return inquirer.prompt([
    {
      name: 'response',
      type: 'list',
      message: '🌅 Where would you like to start? 🌅',
      choices: Object.values(Questions),
    }
  ]).then((answers) => {
    switch (answers.response) {
      case Questions.PR_AWAITING_REVIEW:
        PullRequests.qAwaitingReview(conn).then((prs) => {
          if (prs.length === 0) {
            console.log('🙌 You are free to go!');
          } else {
            prs.forEach((pr) => {
              const title = pr.title.length > 60 ? `${pr.title.substring(0, 57)}...` : pr.title;
              console.log(`* ${pr.repo} - ${title} - ${pr.url}`);
            });
          }
        });
        break;
      case Questions.BUG_UNPRIORITIZED:
        Issues.qUnprioritzedBugs(conn).then((prs) => {
          if (prs.length === 0) {
            console.log('🙌 You are free to go!');
          } else {
            prs.forEach((pr) => {
              const title = pr.title.length > 60 ? `${pr.title.substring(0, 57)}...` : pr.title;
              console.log(`* ${pr.repo} - ${title} - ${pr.url}`);
            });
          }
        });
        break;
      case Questions.BUG_P1:
        Issues.qP1Bugs(conn).then((prs) => {
          if (prs.length === 0) {
            console.log('🙌 You are free to go!');
          } else {
            prs.forEach((pr) => {
              const title = pr.title.length > 60 ? `${pr.title.substring(0, 57)}...` : pr.title;
              console.log(`* ${pr.repo} - ${title} - ${pr.url}`);
            });
          }
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