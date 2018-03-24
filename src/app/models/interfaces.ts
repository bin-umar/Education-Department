export interface ISubject {
  name: string;
  idType: number;
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

export interface ISubType {
  id: number;
  name: string;
  showConfigIcons: boolean;
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
}
