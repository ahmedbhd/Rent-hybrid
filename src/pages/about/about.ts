import { Component } from '@angular/core';
import { ViewChild, OnInit } from '@angular/core';
import { mobiscroll, MbscEventcalendarOptions, MbscRangeOptions, MbscFormOptions, MbscPopupOptions, MbscColorOptions, MbscEventcalendar, MbscPopup } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';

mobiscroll.settings = {
  lang: 'ar',
  theme: 'material'
};

let preventSet,
  eventToEdit;

@Component({
  selector: 'page-about',
  templateUrl: './about.html'
})
export class AboutPage implements OnInit {
  constructor(private http: HttpClient) {}

  events: Array < any > ;
  eventText: string;
  eventDesc: string;
  allDay: boolean;
  eventStart: Date;
  eventEnd: Date;
  isFree: string;
  eventColor: string;
  btn = '<button class="mbsc-btn mbsc-btn-outline mbsc-btn-primary md-edit-btn">Edit</button>';
  controlType: Array < string > ;
  wheelType: string;

  @ViewChild('mbscCal')
  cal: MbscEventcalendar;

  @ViewChild('mbscList')
  list: MbscEventcalendar;

  @ViewChild('mbscPopup')
  popup: MbscPopup;

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

  change() {
    this.controlType = this.allDay ? ['date'] : ['date', 'time'];
    this.wheelType = this.allDay ? 'MM dd yy' : '|D M d|';
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

  ngOnInit() {
    this.http.jsonp('https://trial.mobiscroll.com/events-update/', 'callback').subscribe((resp: any) => {
      for (let i = 0; i < resp.length; ++i) {
        resp[i].text += this.btn;
      }
      this.events = resp;
    });
  }
}
