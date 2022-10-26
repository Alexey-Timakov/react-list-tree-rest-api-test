import { IRow, ITree } from "./IRow";

export interface Row {
  row: IRow,
  parentId: number | null;
  level: number;
}