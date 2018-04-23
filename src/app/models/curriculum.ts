/**
 * Curriculum interfaces
 */

export interface ICurriculum {
  id: number;
  number: number;
  subjectName: string;
  credits: number;
  creditsAudit: number;
  lessonsHours: number;
  course: number;
  exam: number;
  kmd: number;
  courseProject: number;
  courseWork: number;
}

export interface CurriculumList {
  id: number;
  number: number;
  speciality: string;
  course: number;
  degree: string;
  type: string;
  educationYear: number;
  idStandard: number;
  dateOfStandard: Date;
  locked: number;
}

export interface ICurriculumList {
  error: boolean;
  data: [CurriculumList];
}

export interface ExtractionSubject {
  id: number;
  name: string;
  idStSubject: number;
  credits: number;
  auditCredits: number;
  course: number;
  lessonHours: number;
  exam: string;
  kmd: string;
  courseProject: number;
  courseWork: number;
  lkPlan: number;
  lkTotal: number;
  lbPlan: number;
  lbTotal: number;
  prPlan: number;
  prTotal: number;
  smPlan: number;
  smTotal: number;
  trainingPrac: number;
  manuPrac: number;
  diplomPrac: number;
  bachelorWork: number;
  gosExam: number;
  total: number;
  idKafedra: number;
  selective: number;
}

export interface ResponseExtractionSubject {
  error: boolean;
  data: [ExtractionSubject];
}
