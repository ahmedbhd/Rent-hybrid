import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
<<<<<<< Updated upstream
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
=======
  templateUrl: 'about.html'
})
export class AboutPage {
>>>>>>> Stashed changes

  constructor(public navCtrl: NavController) {

  }

}
