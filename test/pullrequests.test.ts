import { Connection } from '../lib/github';
import { PullRequests } from '../lib/pullrequests';

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
  const prs = await PullRequests.qAttention(new class extends MockConnection {
    protected items = [
      {
        html_url: 'https://test-html-url',
        title: 'test-title',
        repository_url: 'https://api.github.com/repos/test-org/test-repo',
      }
    ];
  }());
  expect(prs).toHaveLength(1);
  const pr = prs[0];
  expect(pr.url).toBe('https://test-html-url');
  expect(pr.title).toBe('test-title');
  expect(pr.repo).toBe('test-org/test-repo');
});