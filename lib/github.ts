import request = require('request-promise-native');

export interface ConnectionProps {
  readonly user: string;
}

export class Connection {

  public static HOST = 'https://api.github.com/';

  public readonly user: string;

  constructor(props: ConnectionProps) {
    this.user = props.user;
  }

  public async call(path: string) {
    const uri = this.buildUri(path);
    return await request.get(uri, {
      headers: { 'User-Agent': this.user },
      json: true
    });
  }

  private buildUri(path: string) {
    const uri = `${Connection.HOST}/${path}`;
    return uri.replace(/(?<!:)\/+/g, '/');
  }
}