import {Page, NavController, ViewController, Modal, NavParams} from 'ionic-angular';
import {SearchPage} from "../search-page/search-page";
import {CHART_DIRECTIVES} from 'angular2-highcharts';
import {CompareService} from "../../providers/compare-service/compare-service";
import {StockChartData} from "../../providers/stock-chart-data/stock-chart-data";

@Page({
    templateUrl: 'build/pages/compare/compare.html',
    directives: [CHART_DIRECTIVES]
})
export class ComparePage {

    compares = [];

    constructor(public nav:NavController, public compareService:CompareService, public stockChartData:StockChartData) {
    }

    addCompare() {
        let modal = Modal.create(AddCompareModal, this.compares);
        this.nav.present(modal)
    }

    addStock(compare) {
        this.nav.push(SearchPage, compare.stocks);
    }

    removeCompare(compare) {
        delete this.compares[this.compares.indexOf(compare)];
    }

    refresh(compare) {
        this.compareService.refresh(compare.id).then(data => {
            console.log('data');
            this.stockChartData.setChart(compare.stocks[0], data['body']['stockA']);
            this.stockChartData.setChart(compare.stocks[1], data['body']['stockB']);
        });
    }
}

@Page({
    template: `
        <ion-toolbar>
          <ion-title>
            Compare
          </ion-title>
          <ion-buttons start>
            <button (click)="viewCtrl.dismiss()">
              <span primary showWhen="ios">Cancel</span>
              <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
            </button>
          </ion-buttons>
        </ion-toolbar>
        
        <ion-content padding>
              <ion-list no-lines>
                  <ion-item>
                    {{ stockA[stockA.length - 1] ? stockA[stockA.length - 1].name : null }}
                    <button item-right clear (click)="select(stockA)">Select</button>
                  </ion-item>
                  <ion-item>
                    {{ stockB[stockB.length - 1] ? stockB[stockB.length - 1].name : null }}
                    <button item-right clear (click)="select(stockB)">Select</button>
                  </ion-item>
              </ion-list>
              <div padding>
                  <button primary block (click)="add()">Add</button>
              </div>
        </ion-content>
  `
})
class AddCompareModal {
    stockA = [];
    stockB = [];
    constructor(public nav:NavController, public viewCtrl:ViewController, public params:NavParams, public compareService:CompareService) {
        this.stockA.push({name: 'Stock A'});
        this.stockB.push({name: 'Stock B'});
    }

    select(stock) {
        this.nav.push(SearchPage, stock);
    }

    add() {
        var compare = {
            id : '',
            stocks: [this.stockA.pop(), this.stockB.pop()]
        };
        this.compareService.compare(compare).then(data => compare.id = data['compare_id']);
        this.params.data.push(compare);
        this.viewCtrl.dismiss();
    }
}
