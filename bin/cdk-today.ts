// tslint:disable:no-console

import inquirer = require('inquirer');
import { Connection } from '../lib/github';
import { Issues } from '../lib/issues';
import { PullRequest, PullRequests } from '../lib/pullrequests';
import { TableView } from '../lib/tableview';

enum Questions {
  PR_AWAITING_REVIEW = 'PRs assigned to me and need to be reviewed',

  BUG_UNPRIORITIZED = 'Bugs assigned to me and are not prioritized',

  BUG_P1 = 'Bugs assigned to me and whose priority is P1',

  QUIT = 'Quit!',
}

const tableview = new TableView();

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
          console.log(tableview.stringify(prs, ['repo', 'title', 'url']));
        });
        break;
      case Questions.BUG_UNPRIORITIZED:
        Issues.qUnprioritzedBugs(conn).then((issues) => {
          console.log(tableview.stringify(issues, ['repo', 'title', 'url']));
        });
        break;
      case Questions.BUG_P1:
        Issues.qP1Bugs(conn).then((issues) => {
          console.log(tableview.stringify(issues, ['repo', 'title', 'url']));
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