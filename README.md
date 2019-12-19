# CDK Today

A command line utility aimed at maintainers of AWS CDK and its related Github repository.

Everyday, maintainers of the AWS CDK and related repositories perform a series of tasks to keep the repository healthy,
including, responding to community submitted PRs, triaging customer reported bugs, etc.

The goal of this tool is to provide a prioritized list of PRs, issues and tasks to check and respond to everyday.

## Demo

![screencast of the cdk-today cli tool](screencast.gif)

## Installation

### via npm

> Coming soon!

### via Github

```shell
git clone https://github.com/nija-at/cdk-today.git
cd cdk-today
yarn install && yarn build
```

In your `~/.bashrc` or `~/.zshrc`, add the line

```shell
alias cdk-today='<path to cdk-today>/bin/cdk-today'
```

## Set up

Before starting to use `cdk-today`, a one time setup is necessary.

```shell
cdk-today --setup
```

You will walk through a set of simple questions, then you're ready to go.