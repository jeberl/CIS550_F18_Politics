import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { EasylookComponent } from './easylook/easylook.component';
import { ZipcodeComponent } from './zipcode/zipcode.component';
import { ZipcodeDataComponent } from './zipcode-data/zipcode-data.component';
import { StateScreenComponent } from './state-screen/state-screen.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
 
  { path: '', component:EasylookComponent },
  { path: 'zip', component:ZipcodeComponent },
  { path: 'zip-data', component:ZipcodeDataComponent },
  { path: 'district-data', component:StateScreenComponent },
  { path: 'map', component:MapComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    EasylookComponent,
    ZipcodeComponent,
    ZipcodeDataComponent,
    StateScreenComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
