import { table, TableUserConfig } from 'table';

interface TableViewProps {
  readonly truncWidth: number;
}

export class TableView {

  private readonly truncWidth: number;

  public constructor(props?: TableViewProps) {
    this.truncWidth = (props && props.truncWidth) || 60;
  }

  /**
   * Converts the given list of items to a string object that is of table form.
   * The table converts each item into a table row, in order. The cells in this
   * row hold the values in the object.
   *
   * This method works only when all items in the array are symmetrical, i.e.,
   * contain the same set of keys.
   *
   * @param items the items to convert to a table
   * @param keyOrder when provided, only the keys specified are filtered to be used
   * from the object and in the order they're specified. When not specified, all the
   * keys will be considered and in no guaranteed order.
   */
  public stringify<T>(items: T[], keyOrder?: Array<keyof T>): string {
    if (items.length === 0) {
      return '🙌 You are free to go!';
    }
    if (keyOrder === undefined) {
      keyOrder = Object.keys(items[0]) as Array<keyof T>;
    }
    const data: any[][] = items.map((item) => keyOrder!.map((k) => {
      const val = item[k];
      if (typeof(val) === 'string') {
        return val.length > this.truncWidth ? `${val.substring(0, this.truncWidth - 3)}...` : val;
      }
      return val;
    }));
    return table(data, this.buildConfig());
  }

  private buildConfig(): TableUserConfig {
    return {
      singleLine: true,
      border: {
        topBody: '─',
        topJoin: '─',
        topLeft: '┌',
        topRight: '┐',

        bottomBody: '─',
        bottomJoin: '─',
        bottomLeft: '└',
        bottomRight: '┘',

        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: ' ',

        joinBody: ' ',
        joinLeft: '├',
        joinRight: '┤',
        joinJoin: ' '
      }
    };
  }
}