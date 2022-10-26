import { ITree } from "./IRow";

export interface IStore {
  elements: ITree;
  status: 'idle' | 'loading' | 'completed' | 'failed';
  error: string | null;
}