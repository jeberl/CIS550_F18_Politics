import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TightComponent } from './tight/tight.component';
import { ContactComponent } from './contact/contact.component';
import { RunComponent } from './run/run.component';
import { HomeComponent } from './home/home.component';
import { CommitteeComponent } from './committee/committee.component';

const routes: Routes = [
	{ path: 'tight', component: TightComponent },
	{ path: 'contact', component: ContactComponent },
	{ path: 'run', component: RunComponent },
	{ path: 'committee', component: CommitteeComponent },
	{ path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 
}
