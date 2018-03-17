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
  MatDialogModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StandardsListComponent } from './components/standards-list/standards-list.component';
import { StandardComponent } from './components/standard/standard.component';
import { AddStandardComponent } from './components/add-standard/add-standard.component';
import { AuthService } from './shared/auth.service';
import { MainService } from './shared/main.service';
import {AppService} from "./shared/app.service";

@NgModule({
  declarations: [
    AppComponent,
    AddStandardComponent,
    StandardComponent,
    StandardsListComponent
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
    MatDialogModule
  ],
  entryComponents: [
    AddStandardComponent
  ],
  providers: [
    AuthService,
    MainService,
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
