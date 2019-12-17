import { Connection } from '../lib/github';
import { Issue, Issues } from '../lib/issues';

abstract class MockConnection extends Connection {
  protected abstract items: any[];

  constructor() {
    super({
      user: 'test-user'
    });
  }

  public async call(_: string) {
    return Promise.resolve({
      items: this.items
    });
  }
}

test('issues are correctly mapped from the github schema', async () => {
  const issues: Issue[] = await (Issues as any).fetchIssues(new class extends MockConnection {
    protected items = [
      {
        html_url: 'https://test-html-url',
        title: 'test-title',
        repository_url: 'https://api.github.com/repos/test-org/test-repo',
      }
    ];
  }(), 'does-not-matter');
  expect(issues).toHaveLength(1);
  const issue = issues[0];
  expect(issue.url).toBe('https://test-html-url');
  expect(issue.title).toBe('test-title');
  expect(issue.repo).toBe('test-org/test-repo');
});

test('empty response from github results in empty results', async () => {
  const issues: Issue[] = await (Issues as any).fetchIssues(new class extends MockConnection {
    protected items = [];
  }(), 'does-not-matter');
  expect(issues).toHaveLength(0);
});

test('tablify - truncation works', () => {
  const issues = new Issues([{
    id: 1234,
    url: 'no-trunc',
    title: 'exactly-10',
    repo: 'definitely-truncated',
  }]);

  const data = issues.tablify({ truncWidth: 10 });
  expect(data).toContain('no-trunc');
  expect(data).toContain('exactly-10');
  expect(data).toContain('definit...');
  expect(data).not.toContain('definitely-truncated');
});

test('tablify - output honours specified key order', () => {
  const issue: Issue = {
    id: 1234,
    url: 'test-url',
    title: 'test-title',
    repo: 'test-repo',
  };
  const expectedOrder = new RegExp(Issues.KEY_ORDER.map((key) => issue[key]).join('.*'));

  const issues = new Issues([issue]);
  const data = issues.tablify();
  expect(data).toMatch(expectedOrder);
});