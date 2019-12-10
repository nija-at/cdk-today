import { Connection } from './github';

const REPOS_PREFIX = 'https://api.github.com/repos/';

export class PullRequests {
  public static async qAwaitingReview(conn: Connection): Promise<PullRequest[]> {
    return await this.fetchPullRequests(conn, `is:open+is:pr+assignee:${conn.user}+archived:false+review:required`);
  }

  private static async fetchPullRequests(conn: Connection, query: string): Promise<PullRequest[]> {
    const res = await conn.call(`/search/issues?q=${query}`);
    return res.items.map((item: any) => {
      return {
        url: item.html_url,
        title: item.title,
        repo: item.repository_url.substring(REPOS_PREFIX.length),
      };
    });
  }
}

export interface PullRequest {
  readonly url: string;

  readonly title: string;

  readonly repo: string;
}