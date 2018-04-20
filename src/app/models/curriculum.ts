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
