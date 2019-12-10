import { TableView } from '../lib/tableview';

interface KeyType {
  readonly key1: string;
  readonly key2: string;
  readonly key3: string;
}

test('all keys are selected when key order is not specified', () => {
  const obj: KeyType = {
    key1: 'val1',
    key2: 'val2',
    key3: 'val3'
  };

  const tableview = new TableView();
  const data = tableview.stringify([obj]);
  expect(data).toContain('val1');
  expect(data).toContain('val2');
  expect(data).toContain('val3');
});

test('key ordering works as expected', () => {
  const obj: KeyType = {
    key1: 'val1',
    key2: 'val2',
    key3: 'val3'
  };

  const tableview = new TableView();
  const data = tableview.stringify([obj], ['key3', 'key2', 'key1']);
  expect(data).toMatch(/val3.*val2.*val1/);
});

test('unspecified keys are skipped', () => {
  const obj: KeyType = {
    key1: 'val1',
    key2: 'val2',
    key3: 'val3'
  };

  const tableview = new TableView();
  const data = tableview.stringify([obj], ['key3']);
  expect(data).toContain('val3');
  expect(data).not.toContain('val1');
  expect(data).not.toContain('val2');
});

test('truncation works', () => {
  const tableview = new TableView({
    truncWidth: 10
  });

  const obj: KeyType = {
    key1: 'no-trunc',
    key2: 'exactly-10',
    key3: 'definitely-truncated'
  };

  const data = tableview.stringify([obj]);
  expect(data).toContain('no-trunc');
  expect(data).toContain('exactly-10');
  expect(data).toContain('definit...');
  expect(data).not.toContain('definitely-truncated');
});