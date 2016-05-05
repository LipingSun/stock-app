import {Page, NavController} from 'ionic-angular';
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

    onPageWillEnter() {
        var newCompare = this.compares[this.compares.length - 1];
        if (newCompare && newCompare.stocks.length === 2 && !newCompare.stocks[0].chart) {
            this.compareService.compare(newCompare).then(data => newCompare.id = data.compare_id);
        }
    }

    addCompares() {
        var compare = {
            stocks: []
        };
        this.compares.push(compare);
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
            this.stockChartData.setChart(compare.stocks[0], data.body.stockA);
            this.stockChartData.setChart(compare.stocks[1], data.body.stockB);
        });
    }
}
