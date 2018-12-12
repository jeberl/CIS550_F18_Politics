import { Component, OnInit } from '@angular/core';

declare var $;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    setTimeout(function(){
      $('#map').initMap();
      alert("Hello"); }, 3000);
  }

}
