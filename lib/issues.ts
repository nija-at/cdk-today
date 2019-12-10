import { Connection } from './github';

const REPOS_PREFIX = 'https://api.github.com/repos/';

export class Issues {
  public static async qUnprioritzedBugs(conn: Connection): Promise<Issue[]> {
    return await this.fetchIssues(conn,
      `is:open+is:issue+label:bug+-label:p0+-label:p1+-label:p2+assignee:${conn.user}`);
  }

  public static async qP1Bugs(conn: Connection): Promise<Issue[]> {
    return await this.fetchIssues(conn, `is:open+is:issue+label:bug+label:p1+assignee:${conn.user}`);
  }

  private static async fetchIssues(conn: Connection, query: string): Promise<Issue[]> {
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

export interface Issue {
  readonly url: string;

  readonly title: string;

  readonly repo: string;
}