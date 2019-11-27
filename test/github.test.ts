import request = require('request-promise-native');
import gh = require('../lib/github');

jest.mock('request-promise-native');

const conn = new gh.Connection({
  user: 'test-user'
});
const stdRequestOptions = {
  headers: {
    'User-Agent': conn.user,
  },
  json: true
};

test('options are honoured correctly', async () => {
  await conn.call('/path?q=something+here&page=5');
  expect(request.get).toBeCalledWith('https://api.github.com/path?q=something+here&page=5', stdRequestOptions);
});

test('call() handles no forward slash (/)', async () => {
  await conn.call('no-slash-path');
  expect(request.get).toBeCalledWith('https://api.github.com/no-slash-path', stdRequestOptions);
});

test('call() handles multiple forward slashes (/)', async () => {
  await conn.call('////lots/of//slashes');
  expect(request.get).toBeCalledWith('https://api.github.com/lots/of/slashes', stdRequestOptions);
});