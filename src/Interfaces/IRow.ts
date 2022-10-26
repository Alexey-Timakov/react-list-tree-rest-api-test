export interface IRow {
  id: number;
  rowName: string;
  total: number;
  salary: number;
  mimExploitation: number;
  machineOperatorSalary: number;
  materials: number;
  mainCosts: number;
  supportCosts: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  child?: ITree;
}

export type ITree = Array<IRow>

// --------------------------------
export interface INewRowRequest {
  parentId: number | null;
  rowName: string;
  equipmentCosts: number;
  estimatedProfit: number;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  salary: number;
  supportCosts: number;
}

export interface IRowResponse {
  id: number;
  rowName: string;
  total: number;
  salary: number;
  mimExploitation: number;
  machineOperatorSalary: number;
  materials: number;
  mainCosts: number;
  supportCosts: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
}

export interface INewRowResponse {
  current: IRowResponse;
  changed: IRowResponse[];
}

export interface IUpdateRowRequest {
  equipmentCosts: number;
  estimatedProfit: number;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  rowName: string;
  salary: number;
  supportCosts: number;
}

export interface IUpdateRowResponse {
  current: IRowResponse;
  changed: IRowResponse[];
}

export class NewRow {
  "id": number;
  "total": number;
  "parentId": number | null;
  "rowName": string;
  "equipmentCosts": number;
  "estimatedProfit": number;
  "machineOperatorSalary": number;
  "mainCosts": number;
  "materials": number;
  "mimExploitation": number;
  "overheads": number;
  "salary": number;
  "supportCosts": number;
  "child": []

  constructor(parentId: number | null) {
    this.id = 0;
    this.total = 0;
    this.parentId = parentId;
    this.rowName = "";
    this.equipmentCosts = 0;
    this.estimatedProfit = 0;
    this.machineOperatorSalary = 0;
    this.mainCosts = 0;
    this.materials = 0;
    this.mimExploitation = 0;
    this.overheads = 0;
    this.salary = 0;
    this.supportCosts = 0;
    this.child = [];
  }
}