import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTableModule,
  MatPaginatorModule,
  MatInputModule,
  MatSortModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatCardModule,
  MatExpansionModule,
  MatButtonModule,
  MatDialogModule,
  MatCheckboxModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from './services/auth.service';
import { MainService } from './services/main.service';
import { DataService } from './services/data.service';
import { StSubjectsService } from './services/st-subjects.service';

import { AppComponent } from './app.component';
import { StandardsListComponent } from './components/standards-list/standards-list.component';
import { StandardComponent } from './components/standard/standard.component';
import { GroupsComponent } from './components/groups/groups.component';
import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';
import { ExtractionComponent } from './components/extraction/extraction.component';

import { AddExtractionSubjectComponent } from './dialogs/add-extraction-subject/add-extraction-subject.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { AddStandardComponent } from './dialogs/add-standard/add-standard.component';

@NgModule({
  declarations: [
    AppComponent,
    AddStandardComponent,
    StandardComponent,
    StandardsListComponent,
    DeleteDialogComponent,
    GroupsComponent,
    CurriculumListComponent,
    ExtractionComponent,
    AddExtractionSubjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatTableModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  entryComponents: [
    AddStandardComponent,
    DeleteDialogComponent,
    AddExtractionSubjectComponent
  ],
  providers: [
    MainService,
    AuthService,
    DataService,
    StSubjectsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
