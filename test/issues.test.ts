import { Connection } from '../lib/github';
import { Issues } from '../lib/issues';

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

test('pr transformation works', async () => {
  const issues = await (Issues as any).fetchIssues(new class extends MockConnection {
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

test('no results is mapped correctly', async () => {
  const issues = await (Issues as any).fetchIssues(new class extends MockConnection {
    protected items = [];
  }(), 'does-not-matter');
  expect(issues).toHaveLength(0);
});