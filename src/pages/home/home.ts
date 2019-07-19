import {Component, ViewChild} from '@angular/core';
import {
  MbscColorOptions,
  MbscEventcalendar,
  MbscEventcalendarOptions,
  MbscNumpadDecimalOptions,
  MbscPopup,
  MbscPopupOptions,
  MbscRangeOptions,
  mobiscroll
} from '@mobiscroll/angular';
import {HttpClient} from '@angular/common/http';

import * as firebase from 'firebase';
import {snapshotToArray} from "../../app/environment";
import {CallNumber} from '@ionic-native/call-number';


mobiscroll.settings = {
  lang: 'fr',
  theme: 'material'
};

let preventSet,
  eventToEdit;

const now = new Date();

@Component({
  selector: 'page-home',
  templateUrl: './home.html',
  providers: [CallNumber]
})
export class HomePage {


  id: number = 1;
  refLocation = firebase.database().ref('location/');
  refPayment = firebase.database().ref('payment/');
  events = [];
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
  controlType: Array<string> = ['date', 'time'];
  wheelType: string = '|D M d|';
  @ViewChild('mbscCal')
  cal: MbscEventcalendar;
  @ViewChild('mbscList')
  list: MbscEventcalendar;
  @ViewChild('mbscPopup')
  popup: MbscPopup;
  @ViewChild('viewmbscPopup')
  viewPopup: MbscPopup;
  eventDate = [now, new Date(now.getTime() + 86400000)];
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
  calSettings: MbscEventcalendarOptions = {
    display: 'inline',
    view: {
      calendar: {type: 'month'}
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
        text: 'Enregistrer',
        handler: 'set'
      }
    ],
    headerText: 'Modifier Location',
    onSet: (event, inst) => {
      this.saveChanges();
    }
  };
  viewpopupSettings: MbscPopupOptions = {
    display: 'center',
    buttons: [
      'cancel',
      {
        text: 'Paiements',
        handler: 'set'
      }
    ],
    headerText: 'Informations',
    onSet: (event, inst) => {

    }
  };
  eventToBeEdited: any;
  markedDays = [];
  paymentType: string = 'avance';
  eventName: string;
  listSettings: MbscEventcalendarOptions = {
    display: 'inline',
    view: {
      eventList: {type: 'day'}
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
      } else {
        this.eventName = event.event.text.substring(0, event.event.text.indexOf('<button')) || '';
        this.eventText = event.event.cin || '';
        this.eventDesc = event.event.tel || '';
        this.eventStart = event.event.start;
        this.eventEnd = event.event.end;
        this.viewPopup.instance.show();
      }
    }
  };
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
      this.id = this.id + 1;

      let entity = {
        id: this.id,
        start: this.eventDate[0].getTime(),
        end: this.eventDate[1].getTime(),
        color: this.eventColor,
        cin: this.eventText,
        tel: this.eventDesc,
        text: this.eventName,
      };
      let newLocation = this.refLocation.push();
      newLocation.set(entity);
      mobiscroll.snackbar({
        message: 'Location Enregistrée.',
        color: 'success'
      });
      let locationKey;
      this.events.forEach((location) => {
        location.id == this.id ? locationKey = location.key : null;
      });
      let paymentEntity = {
        id: this.id,
        type: this.paymentType,
        amount: this.eventAmount,
        date: new Date().getTime(),
        locationKey: locationKey
      };
      let newPayment = this.refPayment.push();
      newPayment.set(paymentEntity);
      this.resetFields();
      this.cal.instance.navigate(this.eventDate[0], true);
      this.eventDate = [now, new Date(now.getTime() + 86400000)];
    }
  };
  key: string;

  constructor(private http: HttpClient, private callNumber: CallNumber) {

  }

  navigate(inst, val) {
    if (inst) {
      inst.navigate(val);
    }
  }

  saveChanges() {
    const eventToSave = {
      id: eventToEdit.id,
      text: this.eventName + this.btn,
      color: this.eventColor,
      start: this.eventStart,
      end: this.eventEnd,
      tel: this.eventDesc,
      cin: this.eventText
    };
    //, index = this.events.indexOf(this.events.filter(x => x.id === eventToEdit.id)[0]);
    let entityToSave = {
      id: eventToEdit.id,
      text: this.eventName,
      color: this.eventColor,
      start: this.eventStart.getTime(),
      end: this.eventEnd.getTime(),
      tel: this.eventDesc,
      cin: this.eventText
    };

    console.log('entityToSave');
    console.log(entityToSave);
    let adaNameRef = firebase.database().ref(`location/${this.key}`);
    adaNameRef.update(entityToSave);

    //this.events[index] = eventToSave;
  }

  updatePopup() {
    const event = eventToEdit;
    this.eventName = event.text.substring(0, event.text.indexOf('<button')) || '';
    this.eventText = event.cin || '';
    this.eventDesc = event.tel || '';
    this.eventStart = event.start;
    this.eventEnd = event.end;
    this.eventColor = event.color;
    this.key = event.key;
  }

  ionViewDidLoad() {
    this.refLocation.on('value', (resp: any) => {
      this.markedDays = [];
      this.events = [];
      resp = snapshotToArray(resp);
      for (let i = 0; i < resp.length; ++i) {
        resp[i].text += this.btn;
      }
      this.events = resp;
      this.events.forEach((location) => {
        location.start = new Date(location.start);
        location.end = new Date(location.end);
        let day;
        for (day = location.start.getTime(); day <= location.end.getTime(); day += 86400000) {
          let loopDay = new Date(day);
          this.markedDays.push({d: loopDay, color: location.color})
        }
      });
    });
  }

  resetFields() {
    this.eventText = '';
    this.eventDesc = '';
    this.eventName = '';
    this.eventColor = '';
    this.key = '';
    this.eventAmount = 0;
  }

  call(phone: string) {
    if (phone.length == 8) {
      this.callNumber.callNumber(phone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    } else {
      mobiscroll.snackbar({
        message: 'Numéro de téléphone est Invalid.',
        color: 'danger'
      });
    }
  }
}
