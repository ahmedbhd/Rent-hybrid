import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import * as firebase from 'firebase';
import { snapshotToArray} from "../../app/environment";

@Component({
  selector: 'page-location-detail',
  templateUrl: 'location-detail.html',
})
export class LocationDetailPage {
  key:any;
  item:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad LocationDetailPage');
    this.key = this.navParams.get('data');
    console.log(this.key);
    this.item= firebase.database().ref('location/'+this.key);
    console.log(this.item);
  }
  closeModal() {
    this.view.dismiss(null);
  }
}
