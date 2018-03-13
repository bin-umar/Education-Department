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
}

export interface IAuth {
  error: boolean;
  data: {
    hash: string
  };
}
