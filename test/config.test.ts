import fs = require('fs');
import { promisify } from 'util';
import { Config, ConfigEntries } from '../lib/config';

const readFile = promisify(fs.readFile);

function tmpfile() {
  return `/tmp/config-${Math.floor(Math.random() * 10000)}.json`;
}

test('user is retrieved correctly', async () => {
  const config = new Config({ file: './test/config/good.json' });
  const user = await config.user();
  expect(user).toBe('test-user');
});

test('fails if there is no user in the config file', async () => {
  const config = new Config({ file: './test/config/empty.json' });
  await expect(config.user()).rejects.toThrow(/Could not find user in config file/);
});

test('setup sets the file up correctly', async () => {
  function setup(c: Config): Promise<ConfigEntries> {
    return Promise.resolve({
      user: 'this-user'
    });
  }

  const file = tmpfile();
  const config = new Config({ file, setup });
  await config.setup();

  const fileJson = JSON.parse(await readFile(file, { encoding: 'utf-8' }));
  expect(fileJson.user).toStrictEqual('this-user');
});