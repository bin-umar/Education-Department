import { Component, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SettingsService } from '../../services/settings.service';
import { Settings } from '../../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent {

  @Output() cmpName: any = 'Меъёрҳо';
  items: Settings[];
  _items: Settings[] = [];
  constructor(private stService: SettingsService,
              public snackBar: MatSnackBar) {

    this.items = this.stService.settings;
    this.items.forEach(o => {
      o.isChanged = false;
      this._items.push(Object.assign(<Settings>{}, o));
    });

  }

  changingCaught (item: Settings) {
    const previous = this._items.find(o => +o.id === +item.id);
    item.isChanged = (+previous.value !== item.value);
  }

  saveValue(item: Settings) {
    if (item.value > 0 && item.value !== null && item.value !== undefined) {

      this.stService.saveValue(item).subscribe(resp => {
        if (!resp.error) {
          const obj = this._items.find(o => +o.id === +item.id);
          obj.value = item.value;

          this.snackBar.open('Бо муваффақият сабт карда шуд',  '',  {
            duration: 1500
          });

          item.isChanged = false;
        }
      });

    } else {
      this.snackBar.open('Қиммат нодуруст ворид карда шудааст',  '',  {
        duration: 2000
      });
    }
  }

}
