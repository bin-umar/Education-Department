export interface Load {
  id: number;
  subjectName: string;
  idExSubject: number;
  fcId: number;
  fcName: string;
  term: number;
  course: number;
  group: string;
  degree: string;
  type: string;
  studentsAmount: number;
  section: string;
  hour: number;
  idGroup: number;
  isFlowSaved: boolean;
  hasError: boolean;
}

export interface ILoad {
  error: boolean;
  data: [Load];
}
