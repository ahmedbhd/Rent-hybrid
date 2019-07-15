import { NavController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { MbscEventcalendarOptions } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private http: HttpClient) {

  }
  events: any;

  eventSettings: MbscEventcalendarOptions = {
    lang: 'eng',
    theme: 'ios',
    display: 'inline',
    calendarHeight: 614,
    view: {
      calendar: {
        labels: true
      }
    }
  };

  ngOnInit() {
    this.http.jsonp('https://trial.mobiscroll.com/events/', 'callback').subscribe((resp: any) => {
      this.events = resp;
    });
  }
}
