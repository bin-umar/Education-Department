export interface ISubject {
  id: number;
  idStandard: number;
  name: string;
  idType: number;
  selective: number;
  credits: number;
  typeOfMonitoring: {
    exam: string,
    goUpIWS: string
  };
  toTeacher: {
    total: number,
    including: {
      audit: number,
      kmro: number
    }
  };
    IWS: number;
  creditDividing: {
    terms: number[],
    credits: number[]
  };
  showConfigIcons: boolean;
}

export interface ISubjectList {
  id: number;
  name: string;
}

export interface ISubjectResponse {
  error: boolean;
  data: [ISubjectList];
}

export interface ISubType {
  id: number;
  name: string;
  showConfigIcons: boolean | false;
}

export interface ResSubType {
  error: boolean;
  data: [ISubType];
}

export interface IAuth {
  error: boolean;
  data: {
    hash: string
  };
}

export interface ResAddStandard {
  error: boolean;
  data: {
    id: number
  };
}

export interface ISpec {
  error: boolean;
  data: [ISpec];
}

export interface ISpec {
  fID: number;
  fSpec_NameRus: string;
  fSpec_NameTaj: string;
  fSpec_Shifr: string;
}

export class Spec {
  constructor(
    public fID: number,
    public fSpec_NameRus: string,
    public fSpec_NameTaj: string,
    public fSpec_Shifr: string
  ) { }
}

export interface IStandard {
  error: boolean;
  data: [{
    ids: number;
    fSpec_Shifr: string;
    timeOfStudying: number;
    typeOfStudying: string;
    degreeOfStudying: string;
    dateOfAcceptance: Date;
    locked: number;
  }];
}

export interface StandardList {
  id: number;
  number: number;
  specialty: string;
  degreeOfStudying: string;
  profession: string;
  timeOfStudying: number;
  typeOfStudying: string;
  dateOfAcceptance: Date;
  locked: number;
}

export interface IStSubjectResp {
  id: number;
  name: string;
  idStandard: number;
  idSubject: number;
  idType: number;
  selective: number;
  credits: number;
  tExam: string;
  goUpIWS: string;
  tTotal: number;
  tAudit: number;
  tKmro: number;
  IWS: number;
  cTerms: string;
  cCredits: string;
}

export interface StSubjectResp {
  error: boolean;
  data: [IStSubjectResp];
}

export interface UpdateResponse {
  error: boolean;
}
