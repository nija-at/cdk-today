import { Connection } from './github';

const REPOS_PREFIX = 'https://api.github.com/repos/';

export class PullRequests {
  public static async qAttention(conn: Connection): Promise<PullRequest[]> {
    const res = await conn.call(`/search/issues?q=is:open+is:pr+assignee:${conn.user}+archived:false+review:required`);
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