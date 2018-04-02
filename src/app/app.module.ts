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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { StandardsListComponent } from './components/standards-list/standards-list.component';
import { StandardComponent } from './components/standard/standard.component';

import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { AddStandardComponent } from './dialogs/add-standard/add-standard.component';

import { AuthService } from './services/auth.service';
import { MainService } from './services/main.service';
import { DataService } from './services/data.service';
import { StSubjectsService } from './services/st-subjects.service';
import { DeleteSubjectComponent } from './dialogs/delete-subject/delete-subject.component';

@NgModule({
  declarations: [
    AppComponent,
    AddStandardComponent,
    StandardComponent,
    StandardsListComponent,
    DeleteDialogComponent,
    DeleteSubjectComponent
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
    DeleteSubjectComponent
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
