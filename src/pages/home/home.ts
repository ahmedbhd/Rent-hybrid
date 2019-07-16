import {NavController} from 'ionic-angular';
import {Component} from '@angular/core';
import {MbscEventcalendarOptions, MbscPopupOptions, MbscRangeOptions, mobiscroll} from '@mobiscroll/angular';
import {HttpClient} from '@angular/common/http';

const now = new Date();
let id = 5;
let eventToEdit;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private http: HttpClient) {  }

  eventDate = [now, new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2)];
  events: any;
  allDay = false;
  eventText = '';
  eventDesc = '';

  isFree = 'busy';

  control: Array < string > ;
  wheels: string;

  btn = '<button class="mbsc-btn mbsc-btn-outline mbsc-btn-primary md-edit-btn">Edit</button>';
  eventStart: Date;
  eventEnd: Date;
  eventColor: string;

  change() {
    this.control = this.allDay ? ['date'] : ['date', 'time'];
    this.wheels = this.allDay ? 'MM dd yy' : '|D M d|';
  }

  rangeSettings: MbscRangeOptions = {
    controls: ['date', 'time'],
    dateWheels: '|D M d|',
    startInput: '#startDate',
    endInput: '#endDate',
    lang:'fr',
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


  // update
  updatePopup() {
    const event = eventToEdit,
      free = event.free ? 'free' : 'busy',
      oneDay = 1000 * 60 * 60 * 24,
      diff = new Date(event.end).getTime() - new Date(event.start).getTime(),
      days = Math.round(Math.abs(diff) / oneDay),
      allDay = event.allDay || days > 0;

    this.eventText = event.text.replace(this.btn, '') || '';
    this.eventDesc = event.desc || '';
    this.allDay = allDay;

    setTimeout(() => {
      this.eventStart = event.start;
      this.eventEnd = event.end;
    });

    this.isFree = free;
    this.eventColor = event.color;

    this.change();
  }

  saveChanges() {
    const eventToSave = {
        id: eventToEdit.id,
        text: this.eventText + this.btn,
        desc: this.eventDesc,
        color: this.eventColor,
        allDay: this.allDay,
        start: this.eventStart,
        end: this.eventEnd,
        free: this.isFree === 'free'
      },
      index = this.events.indexOf(this.events.filter(x => x.id === eventToEdit.id)[0]);

    this.events[index] = eventToSave;
  }
}
