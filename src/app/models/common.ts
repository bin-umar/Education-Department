/**
 * Authorization interfaces
 */
export interface UserInfo {
  userId: number;
  type: string;
  time: string;
}

export interface IAuth {
  error: boolean;
  data: {
    hash: string
  };
}

export interface CheckResponse {
  error: boolean;
  data: {
    last_action: string;
  };
}

/**
 * Common http responses
 */

export interface ResponseAdd {
  error: boolean;
  data: {
    id: number
  };
}

export interface UpdateResponse {
  error: boolean;
}

/**
 * Speciality interfaces
 */

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

/**
 * Group interfaces
 */

export interface IGroup {
  id: number;
  idSpec: number;
  number: number;
  name: string;
  degree: string;
  type: string;
  course: number;
  studentsAmount: number;
  educationYear: string;
}

export interface GroupResponse {
  error: boolean;
  data: [IGroup];
}
