import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {MbscEventcalendarOptions, MbscPopupOptions, MbscRangeOptions, mobiscroll} from '@mobiscroll/angular';
import {HttpClient} from '@angular/common/http';

const now = new Date();
let id = 5;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  eventDate = [now, new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2)];
  events: any;
  allDay = false;
  eventText = '';
  eventDesc = '';

  isFree = 'busy';

  control: Array < string > ;
  wheels: string;


  change() {
    this.control = this.allDay ? ['date'] : ['date', 'time'];
    this.wheels = this.allDay ? 'MM dd yy' : '|D M d|';
  }

  rangeSettings: MbscRangeOptions = {
    controls: ['date', 'time'],
    dateWheels: '|D M d|',
    startInput: '#startDate',
    endInput: '#endDate',
    tabs: false,
    responsive: {
      large: {
        touchUi: false
      }
    },
    showSelector: false
  };

  popupSettings: MbscPopupOptions = {
    display: 'center',
    cssClass: 'mbsc-no-padding',
    buttons: [{
      text: 'Ajouter',
      handler: 'set'
    },
      'cancel'
    ],
    headerText: 'Ajouter une location',
    onSet: (event, inst) => {
      this.events.push({
        id: id,
        start: this.eventDate[0],
        end: this.eventDate[1],
        text: (this.eventText || 'New Event'),
        title: this.eventText || 'New Event',
        description: this.eventDesc,
        allDay: this.allDay,
        free: this.isFree === 'free'
      });
      this.eventText = '';
      this.eventDesc = '';
      id += 1;
    }
  };

  eventSettings: MbscEventcalendarOptions = {
    lang: 'fr',
    theme: 'material',
    display: 'inline',
    view: {
      calendar: {
        labels: true,
        popover: false
      },
      eventList: {type: 'day'}
    }
  };

  dailySettings: MbscEventcalendarOptions = {
    display: 'inline',
    view: {
      eventList: {type: 'day'}
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

  showInfoSnackBar() {
    mobiscroll.snackbar({
      message: 'Add button clicked!',
      color: 'success'
    });
  }
}
