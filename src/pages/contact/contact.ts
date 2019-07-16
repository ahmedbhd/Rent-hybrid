import { Component } from '@angular/core';
import {DateTime, NavController} from 'ionic-angular';
import * as firebase from 'firebase';
import { snapshotToArray} from "../../app/environment";
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  locations =[];
  payments =[];

  refLocation = firebase.database().ref('location/');
  refPayment = firebase.database().ref('payment/');
  inputName:string;
  inputCin:number;

  constructor(public navCtrl: NavController) {
    this.refLocation.on('value', resp => {
      this.locations = snapshotToArray(resp);
    });
    this.refPayment.on('value', resp => {
      this.payments = snapshotToArray(resp);
    });
  }

  addItem(item){
    if (item!=undefined && item != null) {
      let newLocation = this.refLocation.push();
      newLocation.set(item);
      this.inputName='';
      this.inputCin=0;
      let newPayment = this.refPayment.push();
      let date = new Date();
      console.log(date);
      newPayment.set({cin:item.cin,value:500,date: date.getTime()});
    }
  }
}
