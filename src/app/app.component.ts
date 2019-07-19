import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {timer} from "rxjs/observable/timer";

import { TabsPage } from '../pages/tabs/tabs';
import * as firebase from 'firebase';
import { FIREBASE_CONFIG} from "./environment";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  showSplash = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      timer(500).subscribe(() => this.showSplash = false);
    });
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}
