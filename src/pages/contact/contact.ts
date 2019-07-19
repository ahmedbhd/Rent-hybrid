import {Component, ElementRef, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';
import {NavController} from 'ionic-angular';
import * as firebase from 'firebase';
import {snapshotToArray} from "../../app/environment";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  locations: { text, cin, tel, start: number, end: number, color, key }[] = [];
  payments: {
    id: number,
    type: string,
    amount: number,
    date: Date,
    locationKey: string
  } [] = [];

  @ViewChild("barCanvas") barCanvas: ElementRef;
  refLocation = firebase.database().ref('location/');
  refPayment = firebase.database().ref('payment/');
  barChartValues: number[] = [];
  lineChartValues: number[] = [];
  lineChart: any;
  @ViewChild('lineCanvas') lineCanvas;
  private barChart: Chart;

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    for (let i = 0; i < 12; i++) {
      this.barChartValues[i] = 0;
      this.lineChartValues[i] = 0;
    }
    this.refLocation.on('value', resp => {
      this.locations = snapshotToArray(resp);
      let map = new Map<number,number[]>();
      for (let i = 0; i < 12; i++) {
        map.set(i, []);
      }
      this.locations.forEach((location) => {
        for (let day = new Date(location.start).getTime(); day <= new Date(location.end).getTime(); day += 86400000) {
          let loopDay = new Date(day).getDate();
          let loopMonth = new Date(day).getMonth();
          map.get(loopMonth).push(loopDay);
        }
      });
      map.forEach((value, key) => {
        // Unique values
        this.lineChartValues[key] = value.filter((v, i, a) => a.indexOf(v) === i).length;
      });
    });
    this.refPayment.on('value', resp => {
      this.payments = snapshotToArray(resp);
      this.payments.forEach((payment) => {
        let month = new Date(payment.date).getMonth();
        this.barChartValues[month] += payment.amount;
      });
      this.createBarChart();
      this.createLineChart();
    });
  }

  public createBarChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
        datasets: [
          {
            label: "Revenu",
            data: this.barChartValues,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(0, 128, 38, 0.2)",
              "rgba(153, 192, 86, 0.2)",
              "rgba(30, 162, 235, 0.2)",
              "rgba(128, 66, 66, 0.2)",
              "rgba(159, 38, 128, 0.2)",
              "rgba(64, 128, 206, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(0, 128, 38, 1)",
              "rgba(153, 192, 86, 1)",
              "rgba(30, 162, 235, 1)",
              "rgba(128, 66, 66, 1)",
              "rgba(159, 38, 128, 1)",
              "rgba(64, 128, 206, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: Math.max(...this.barChartValues) + 50
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return tooltipItem.value + ' DT';
            }
          }
        }
      }
    });
  }

  public createLineChart() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
        datasets: [
          {
            label: 'Occupation Jour/Mois',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.lineChartValues,
            spanGaps: false,
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: Math.max(...this.lineChartValues) + 4
              }
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let numberofDays = new Date(2019, tooltipItem.index +1, 0).getDate();
              let label = 'Occupée ' + tooltipItem.value + ' Jours';
              if(tooltipItem.value == numberofDays)
                label = 'Complet !';
              return label;
            }
          }
        }
      }
    });
  }
}
