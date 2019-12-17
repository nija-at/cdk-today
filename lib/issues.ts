import { getBorderCharacters, table, TableUserConfig } from 'table';
import { Connection } from './github';

export interface Issue {
  readonly id: number;

  readonly url: string;

  readonly title: string;

  readonly repo: string;
}

// All members must be mandatory and the defaults specified in DEFAULT_DISPLAY_OPTIONS
export interface DisplayOptions {
  readonly truncWidth: number;
}

const DEFAULT_DISPLAY_OPTIONS = {
  truncWidth: 60
};
const REPOS_PREFIX = 'https://api.github.com/repos/';

export class Issues {

  public static KEY_ORDER: Array<keyof Issue> = ['id', 'repo', 'title', 'url'];

  public static async qUnprioritzedBugs(conn: Connection): Promise<Issues> {
    return new Issues(
      await this.fetchIssues(conn, `is:open+is:issue+label:bug+-label:p0+-label:p1+-label:p2+assignee:${conn.user}`));
  }

  public static async qP1Bugs(conn: Connection): Promise<Issues> {
    return new Issues(await this.fetchIssues(conn, `is:open+is:issue+label:bug+label:p1+assignee:${conn.user}`));
  }

  public static async qAwaitingReview(conn: Connection): Promise<Issues> {
    return new Issues(
      await this.fetchIssues(conn, `is:open+is:pr+-is:draft+assignee:${conn.user}+archived:false+review:required+-author:${conn.user}`));
  }

  private static async fetchIssues(conn: Connection, query: string): Promise<Issue[]> {
    const res = await conn.call(`/search/issues?q=${query}`);
    return res.items.map((item: any) => {
      return {
        id: item.number,
        url: item.html_url,
        title: item.title,
        repo: item.repository_url.substring(REPOS_PREFIX.length),
      };
    });
  }

  public constructor(public readonly issues: Issue[]) {}

  /**
   * Presents the list of issues to a string that is of table form.
   * The table converts each item into a table row, in order. The cells in this
   * row hold the values in the object.
   */
  public tablify(displayOptions: DisplayOptions = DEFAULT_DISPLAY_OPTIONS): string {
    if (this.issues.length === 0) {
      return '🙌 You are free to go!';
    }
    const data: string[][] = this.issues.map((item) => ['*'].concat(Issues.KEY_ORDER.map((k) => {
      const val = item[k];
      if (typeof(val) === 'string') {
        return val.length > displayOptions.truncWidth ? `${val.substring(0, displayOptions.truncWidth - 3)}...` : val;
      }
      return `${val}`;
    })));
    return table(data, this.tableConfig());
  }

  private tableConfig(): TableUserConfig {
    return {
      singleLine: true,
      border: getBorderCharacters('void'),
      columns: {
        0: {
          paddingLeft: 0,
          paddingRight: 0,
        }
      }
    };
  }
}