import { Component } from '@angular/core';
import {LoadingController, NavController, ToastController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import * as firebase from 'firebase';
import { snapshotToArray} from "../../app/environment";
import {mobiscroll} from "@mobiscroll/angular";
import {CallNumber} from "@ionic-native/call-number";


@Component({
  selector: 'page-about',
  templateUrl: './about.html'
})
export class AboutPage {

  locations =[];
  refLocation = firebase.database().ref('location/');
  constructor(private http: HttpClient,
              private callNumber: CallNumber ,
              private loadingCtrl: LoadingController ,
              private toastCtrl: ToastController){}


  ionViewDidEnter(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      showBackdrop: true
    });
    loading.present();
    this.refLocation.on('value', resp => {
      this.locations = snapshotToArray(resp);
      loading.dismiss();
    },error =>  loading.dismiss());
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

  async delete (key){
    firebase.database().ref('location/'+key).remove().then(()=>this.presentToast("Location Supprimée"));
  }

  openDetail(item: any) {
    console.log(item);
  }
  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      cssClass: 'toastClass'
    });
    toast.present();
  }
}
