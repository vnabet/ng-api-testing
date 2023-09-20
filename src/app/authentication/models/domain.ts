/**
 * Interface définissant un domaine
 */
export interface IDomain {
  domainId:number;
  name:string;
  // On a besoin du dataSetLabel s'il existe
  baseProperties: {dataSetLabel:string}
}
