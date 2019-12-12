import fs = require('fs');
import inquirer = require('inquirer');
import os = require('os');
import path = require('path');
import { promisify } from 'util';
import { UserError } from './errors';

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface ConfigProps {
  readonly setup?: (c: Config) => Promise<ConfigEntries>;

  readonly file?: string;
}

export interface ConfigEntries {
  readonly user: string;
}

export class Config {

  public readonly file: string;
  private readonly setupCb?: (c: Config) => Promise<ConfigEntries>;

  public constructor(props?: ConfigProps) {
    this.setupCb = props && props.setup;
    this.file = (props && props.file) || path.join(os.homedir(), '.cdk-today.json');
  }

  public async user(): Promise<string> {
    const u: string = (await this.fetchConfig()).user;
    if (!u) {
      throw new UserError(`Could not find user in config file [${this.file}]. Re-run with the '--setup' flag.`);
    }
    return u;
  }

  public async setup() {
    if (!this.setupCb) {
      throw new Error('setup callback missing!');
    }
    const entries = await this.setupCb(this);
    await writeFile(this.file, JSON.stringify(entries, undefined, 2), { encoding: 'utf-8' });
  }

  private async fetchConfig(): Promise<any> {
    if (!await exists(this.file)) {
      throw new UserError(`Could not find setup file at [${this.file}]. Re-run with the --setup flag`);
    }
    return JSON.parse(await readFile(this.file, { encoding: 'utf-8'} ));
  }
}