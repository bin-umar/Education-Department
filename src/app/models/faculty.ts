
/**
 * Group interfaces
 */

export interface IGroup {
  id: number;
  kfId: number;
  fcId: number;
  idSpec: number;
  speciality: string;
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

export interface Department {
  id: number;
  fullName: string;
  shortName: string;
  chief: string;
  chiefPosition?: string;
}

export interface IDepartment {
  error: boolean;
  data: [Department];
}

export interface DepartmentInfo {
  fcId: number;
  fcFullName: string;
  fcShortName: string;
  fcChief: string;
  kfId: number;
  kfFullName: string;
  kfShortName: string;
  kfChiefPosition: string;
  kfChief: string;
}

export interface IDepartmentInfo {
  error: boolean;
  data: DepartmentInfo;
}
