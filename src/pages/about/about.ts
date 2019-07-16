import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'page-about',
  templateUrl: './about.html'
})
export class AboutPage {
  constructor(private http: HttpClient) {}


}
