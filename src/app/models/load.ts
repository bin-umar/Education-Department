export interface Load {
  id: number;
  subjectName: string;
  idExSubject: number;
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
}

export interface ILoad {
  error: boolean;
  data: [Load];
}
