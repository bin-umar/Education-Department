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

export interface ISpec {
  error: boolean;
  data: [{
    fID: number;
    fSpec_NameRus: string;
    fSpec_NameTaj: string;
    fSpec_Shifr: string;
  }];
}

export interface IStandard {
  error: boolean;
  data: [{
    ids: number;
    fSpec_NameRus: string;
    fSpec_NameTaj: string;
    profession: string;
    timeOfStudying: number;
    typeOfStudying: number;
  }];
}
