import { Component } from '@angular/core';
import { ViewChild, OnInit } from '@angular/core';
import {
  mobiscroll,
  MbscEventcalendarOptions,
  MbscRangeOptions,
  MbscPopupOptions,
  MbscColorOptions,
  MbscEventcalendar,
  MbscPopup,
  MbscNumberOptions, MbscNumpadDecimalOptions, MbscNumpadOptions
} from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';

import * as firebase from 'firebase';
import { snapshotToArray} from "../../app/environment";


mobiscroll.settings = {
  lang: 'fr',
  theme: 'material'
};

let preventSet,
  eventToEdit;

const now = new Date();

@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {
  refLocation = firebase.database().ref('location/');
  refPayment = firebase.database().ref('payment/');


  constructor(private http: HttpClient) {

  }

  events: Array < any > ;
  eventText: string;
  eventDesc: string;
  eventAmount: number = 0;

  numpadSettings: MbscNumpadDecimalOptions = {
    theme: 'material',
    lang: 'fr',
    scale: 0,
    max: 9999
  };

  // allDay: boolean;
  eventStart: Date;
  eventEnd: Date;
  eventColor: string;
  btn = '<button class="mbsc-btn mbsc-btn-primary md-edit-btn">Modifier</button>';
  controlType: Array < string > = ['date', 'time'] ;
  wheelType: string = '|D M d|';

  @ViewChild('mbscCal')
  cal: MbscEventcalendar;

  @ViewChild('mbscList')
  list: MbscEventcalendar;

  @ViewChild('mbscPopup')
  popup: MbscPopup;

  eventDate = [now, new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2)];

  addPopupSettings: MbscPopupOptions = {
    display: 'center',
    cssClass: 'mbsc-no-padding',
    buttons: [{
      text: 'Ajouter',
      handler: 'set'
    },
      'cancel'
    ],
    headerText: 'Ajouter Location',
    onSet: (event, inst) => {
      let id = 5;

      let entity = {
        id: id,
        start: this.eventDate[0].getTime(),
        end: this.eventDate[1].getTime(),
        color: this.eventColor,
        cin: this.eventText,
        tel: this.eventDesc,
        name: this.eventName,
      };
        let newLocation = this.refLocation.push();
        newLocation.set(entity);


      console.log('entityLoan');
      console.log(entity);

      let paymentEntity = {
        id:id,
        type: this.paymentType,
        amount: this.eventAmount,
        date: new Date().getTime()
      };
      console.log('entityPayment');
      console.log(paymentEntity);
      let newPayment = this.refPayment.push();
      newPayment.set(paymentEntity);

      this.events.push({
        id: id,
        start: this.eventDate[0],
        end: this.eventDate[1],
        color: this.eventColor,
        text: (this.eventText || 'Nouvelle location') + this.btn,
        title: this.eventText || 'Nouvelle location',
        description: this.eventDesc,
        name: this.eventName,
      });
      this.eventText = '';
      this.eventDesc = '';
      id += 1;
      // Navigate the calendar to the new event's start date
      this.cal.instance.navigate(this.eventDate[0], true);

      let day;
      let startDay = this.eventDate[0].getTime();
      let endDay = this.eventDate[1].getTime();
      for (day = startDay; day <= endDay; day += 86400000) {
        let loopDay=new Date(day);
        this.markedDays.push({d: loopDay,color: this.eventColor})
      }


    }
  };

  rangeSettings: MbscRangeOptions = {
    controls: ['date', 'time'],
    dateWheels: '|D M d|',
    tabs: false,
    responsive: {
      large: {
        touchUi: false
      }
    }
  };

  listSettings: MbscEventcalendarOptions = {
    display: 'inline',
    view: {
      eventList: { type: 'day' }
    },
    onPageChange: (event, inst) => {
      const day = event.firstDay;
      preventSet = true;
      this.navigate(this.cal.instance, day);
    },
    onEventSelect: (event, inst) => {
      if (event.domEvent.target.classList.contains('md-edit-btn')) {
        eventToEdit = event.event;
        this.eventToBeEdited = event.event;
        this.updatePopup();
        this.popup.instance.show();
      }
    }
  };

  calSettings: MbscEventcalendarOptions = {
    display: 'inline',
    view: {
      calendar: { type: 'month' }
    },
    onSetDate: (event, inst) => {
      if (!preventSet) {
        const day = event.date;
        this.navigate(this.list.instance, day);
      }
      preventSet = false;
    }
  };

  colorSettings: MbscColorOptions = {
    display: 'inline',
    clear: false,
    data: ['#fff568', '#ffc400', '#ff5252', '#f48fb1', '#ba68c8', '#8c9eff', '#90caf9', '#9ccc65', '#0db057', '#bcaaa4']
  };

  popupSettings: MbscPopupOptions = {
    display: 'center',
    buttons: [
      'cancel',
      {
        text: 'Save',
        handler: 'set'
      }
    ],
    headerText: 'Edit event',
    onSet: (event, inst) => {
      this.saveChanges();
    }
  };

  navigate(inst, val) {
    if (inst) {
      inst.navigate(val);
    }
  }

  // change() {
    // this.controlType = this.allDay ? ['date'] : ['date', 'time'];
    // this.wheelType = this.allDay ? 'MM dd yy' : '|D M d|';
  // }

  eventToBeEdited: any;

  saveChanges() {
    const eventToSave = {
        id: eventToEdit.id,
        text: this.eventText + this.btn,
        desc: this.eventDesc,
        color: this.eventColor,
        start: this.eventStart,
        end: this.eventEnd,
      },
      index = this.events.indexOf(this.events.filter(x => x.id === eventToEdit.id)[0]);
    this.events[index] = eventToSave;
    let startDate = new Date(this.eventToBeEdited.start).getTime();
    let startDate2 = eventToSave.start.getTime();
    let endDate = new Date(this.eventToBeEdited.end).getTime();
    let endDate2 = eventToSave.end.getTime();
    let datetime;
    for (datetime = startDate; datetime <= endDate; datetime += 86400000) {
      let loopDay = new Date(datetime).getDate();
      this.markedDays.forEach((markedDay) => {
        if(markedDay.d.getDate() == loopDay
          && markedDay.d.getMonth() == new Date(datetime).getMonth()
          && markedDay.d.getFullYear() == new Date(datetime).getFullYear()
          && markedDay.color == this.eventToBeEdited.color) {
          console.log(markedDay.d);
          this.markedDays.splice(this.markedDays.indexOf(markedDay),1);
        }
      });
    }
    console.log('daysToColor');
    for (let datetime2 = startDate2; datetime2 <= endDate2; datetime2 += 86400000) {
      console.log(new Date(datetime2));
      this.markedDays.push({d: new Date(datetime2), color: eventToSave.color})
    }
  }

  updatePopup() {
    const event = eventToEdit,
      free = event.free ? 'free' : 'busy',
      oneDay = 1000 * 60 * 60 * 24,
      diff = new Date(event.end).getTime() - new Date(event.start).getTime(),
      days = Math.round(Math.abs(diff) / oneDay);
      // allDay = event.allDay || days > 0;

    this.eventText = event.name.replace(this.btn, '') || '';
    this.eventDesc = event.cin || '';
    // this.allDay = allDay;

    setTimeout(() => {
      this.eventStart = event.start;
      this.eventEnd = event.end;
    });

    this.eventColor = event.color;

    // this.change();
  }

  ionViewDidLoad() {
    this.refLocation.on('value', (resp:any) => {
      resp  = snapshotToArray(resp);
      for (let i = 0; i < resp.length; ++i) {
        resp[i].name += this.btn;
        let day;
        let startDay = new Date(resp[i].start);
        let endDay = new Date(resp[i].end);
        for (day = startDay; day <= endDay; day += 86400000) {
          let loopDay=new Date(day);
          this.markedDays.push({d: loopDay,color: resp[i].color})
        }
        console.log(resp[i])
      }
      this.events = resp;
    });
  }


  markedDays: Array < any > = [];
  paymentType: string = 'avance';
  eventName: string;
}
