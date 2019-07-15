import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {MbscEventcalendarOptions} from '@mobiscroll/angular';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  events: any;
  eventSettings: MbscEventcalendarOptions = {
    lang: 'fr',
    theme: 'material',
    display: 'inline',
    view: {
      calendar: {
        labels: true,
        popover: false
      },
      eventList: { type: 'day' }
    }
  };

  dailySettings: MbscEventcalendarOptions = {
    display: 'inline',
    view: {
      eventList: { type: 'day' }
    }
  };

  constructor(public navCtrl: NavController, private http: HttpClient) {

  }

  ngOnInit() {
    this.http.jsonp('https://trial.mobiscroll.com/events/', 'callback').subscribe((resp: any) => {
      this.events = resp;
    });
  }

  eventClick(event) {
    console.log('eventclick');
    console.log(event);
  }
}
