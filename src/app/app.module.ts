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
  MatCheckboxModule,
  MatTooltipModule,
  MatSlideToggleModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services
import { AuthService } from './services/auth.service';
import { MainService } from './services/main.service';
import { DataService } from './services/data.service';
import { StSubjectsService } from './services/st-subjects.service';

// Components
import { AppComponent } from './app.component';
import { StandardsListComponent } from './components/standards-list/standards-list.component';
import { StandardComponent } from './components/standard/standard.component';
import { GroupsComponent } from './components/groups/groups.component';
import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';
import { ExtractionComponent } from './components/extraction/extraction.component';
import { AddExtractionSubjectComponent } from './dialogs/add-extraction-subject/add-extraction-subject.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { AddStandardComponent } from './dialogs/add-standard/add-standard.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { LoadComponent } from './components/load/load.component';
import { FkFilterComponent } from './components/fk-filter/fk-filter.component';

// Pipes
import { EducationYearPipe } from './pipes/education-year.pipe';
import { TeacherNamePipe } from './pipes/teacher-name.pipe';
import { GetNamePipe } from './pipes/get-name.pipe';
import { SettingsComponent } from './components/settings/settings.component';

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
    AddExtractionSubjectComponent,
    GetNamePipe,
    EducationYearPipe,
    SubjectsComponent,
    LoadComponent,
    FkFilterComponent,
    TeacherNamePipe,
    SettingsComponent
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
    MatCheckboxModule,
    MatTooltipModule,
    MatSlideToggleModule
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
