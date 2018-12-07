import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TightComponent } from './tight/tight.component';
import { ContactComponent } from './contact/contact.component';
import { RunComponent } from './run/run.component';
import { HomeComponent } from './home/home.component';
import { CommitteeComponent } from './committee/committee.component';
import { CandidateComponent } from './candidate/candidate.component';

@NgModule({
  declarations: [
    AppComponent,
    TightComponent,
    ContactComponent,
    RunComponent,
    HomeComponent,
    CommitteeComponent,
    CandidateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
