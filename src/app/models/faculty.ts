
/**
 * Group interfaces
 */

export interface IGroup {
  id: number;
  kfId: number;
  fcId: number;
  idSpec: number;
  number: number;
  name: string;
  degree: string;
  type: string;
  course: number;
  subgroup: number;
  subgroup2: number;
  studentsAmount: number;
  educationYear: string;
  extraction: number;
  load: number;
}

export interface GroupResponse {
  error: boolean;
  data: [IGroup];
}

/**
 * Faculty interfaces
 */

export interface Faculty {
  id: number;
  fullName: string;
  shortName: string;
}

export interface IFaculty {
  error: boolean;
  data: [Faculty];
}

/**
 * Kafedra interfaces
 */

export interface Kafedra {
  id: number;
  shortName: string;
  fullName: string;
}

export interface KafedraRes {
  error: boolean;
  data: [Kafedra];
}
