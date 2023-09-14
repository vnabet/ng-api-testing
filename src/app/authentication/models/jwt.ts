/**
 * TODO Commentaires
 */
export interface IJWTDTO {
  ClientId:string,
  DataSetLabel:string,
  DomainId:string[],
  DomainName:string,
  Email:string,
  FirstName:string,
  Id:string,
  IsApplicationAdmin:string,
  IsRoot:string,
  LastName:string,
  Login:string,
  Radical:string,
  UserClientId:string,
  exp:string,
  iat:string,
  iss:string,
  nbf:string
}

export interface IJWT {
  clientId:string,
  dataSetLabel:string,
  domainId:string[],
  domainName:string,
  email:string,
  firstName:string,
  id:string,
  isApplicationAdmin:boolean,
  isRoot:boolean,
  lastName:string,
  login:string,
  radical:string,
  userClientId:string,
  //date d'expiration du jeton
  exp:Date,
  //date à laquelle a été créé le jeton (issued at)
  iat:Date,
  iss:string,
  //date avant laquelle le jeton ne doit pas être considéré comme valide (not before)
  nbf:Date
}
