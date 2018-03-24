import { Injectable } from '@angular/core';
import { ISubject, ISubType } from '../models/interfaces';

@Injectable()
export class AppService {

  subjects: ISubject[] = [
    {
      name: 'Забони хориҷӣ',
      idType: 1,
      credits: 8,
      typeOfMonitoring: {
        exam: '1,2',
        goUpIWS: ''
      },
      toTeacher: {
        total: 7,
        including: {
          audit: 2,
          kmro: 5
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [1, 2],
        credits: [3, 5]
      },
      showConfigIcons: false
    },
    {
      name: 'Забони русӣ',
      idType: 1,
      credits: 8,
      typeOfMonitoring: {
        exam: '1,2',
        goUpIWS: ''
      },
      toTeacher: {
        total: 7,
        including: {
          audit: 2,
          kmro: 5
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [1],
        credits: [6]
      },
      showConfigIcons: false
    },
    {
      name: 'Фалсафа',
      idType: 2,
      credits: 5,
      typeOfMonitoring: {
        exam: '4',
        goUpIWS: ''
      },
      toTeacher: {
        total: 4,
        including: {
          audit: 2,
          kmro: 2
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [4],
        credits: [5]
      },
      showConfigIcons: false
    },
    {
      name: 'Забони тоҷикӣ',
      idType: 1,
      credits: 8,
      typeOfMonitoring: {
        exam: '1,2',
        goUpIWS: ''
      },
      toTeacher: {
        total: 7,
        including: {
          audit: 2,
          kmro: 5
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [2],
        credits: [4]
      },
      showConfigIcons: false
    },
    {
      name: 'Технологияи информатсионӣ',
      idType: 2,
      credits: 8,
      typeOfMonitoring: {
        exam: '1,2',
        goUpIWS: ''
      },
      toTeacher: {
        total: 7,
        including: {
          audit: 2,
          kmro: 5
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [2],
        credits: [6]
      },
      showConfigIcons: false
    },
    {
      name: 'Назарияи иқтисодӣ',
      idType: 1,
      credits: 8,
      typeOfMonitoring: {
        exam: '1,2',
        goUpIWS: ''
      },
      toTeacher: {
        total: 7,
        including: {
          audit: 2,
          kmro: 5
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [4],
        credits: [3]
      },
      showConfigIcons: false
    },
    {
      name: 'Нақшакашии муҳандисӣ',
      idType: 3,
      credits: 8,
      typeOfMonitoring: {
        exam: '1,2',
        goUpIWS: ''
      },
      toTeacher: {
        total: 7,
        including: {
          audit: 2,
          kmro: 5
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [1],
        credits: [3]
      },
      showConfigIcons: false
    },
    {
      name: 'Графикаи компютерӣ',
      idType: 3,
      credits: 8,
      typeOfMonitoring: {
        exam: '1,2',
        goUpIWS: ''
      },
      toTeacher: {
        total: 7,
        including: {
          audit: 2,
          kmro: 5
        }
      },
      IWS: 1,
      creditDividing: {
        terms: [2],
        credits: [3]
      },
      showConfigIcons: false
    },
    {
      name: 'Назарияи қабули қарорҳо',
      idType: 4,
      credits: 6,
      typeOfMonitoring: {
        exam: '5',
        goUpIWS: '5'
      },
      toTeacher: {
        total: 4,
        including: {
          audit: 2,
          kmro: 2
        }
      },
      IWS: 2,
      creditDividing: {
        terms: [5],
        credits: [6]
      },
      showConfigIcons: false
    }
  ];

  subjectTypes: ISubType[] = [
    {
      id: 1,
      name: 'Бахши фанҳои гуманитарӣ',
      showConfigIcons: false
    },
    {
      id: 2,
      name: 'Бахши фанҳои табии-риёзӣ ва иқтисодӣ',
      showConfigIcons: false
    },
    {
      id: 3,
      name: 'Бахши фанҳои умумикасбӣ',
      showConfigIcons: false
    },
    {
      id: 4,
      name: 'Бахши фанҳои тахассусӣ',
      showConfigIcons: false
    },
    {
      id: 5,
      name: 'Бахши фанҳои ғайриаудиторӣ',
      showConfigIcons: false
    },
  ];

  degrees = ['бакалавр', 'магистр', 'PhD'];
  types = ['рӯзона', 'ғоибона', 'фосилавӣ'];

  constructor() { }

}
