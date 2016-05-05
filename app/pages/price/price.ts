import {Page, NavController} from 'ionic-angular';
import {SearchPage} from "../search-page/search-page";
import {StockChartData} from "../../providers/stock-chart-data/stock-chart-data";
import {CHART_DIRECTIVES} from 'angular2-highcharts';

@Page({
    templateUrl: 'build/pages/price/price.html',
    directives: [CHART_DIRECTIVES]
})
export class PricePage {
    stocks = [];

    constructor(public nav:NavController, public stockChartData:StockChartData) {
    }

    onPageWillEnter() {
        var newStock = this.stocks[this.stocks.length - 1];
        if (newStock && !newStock.chart) {
            this.stockChartData.render(newStock);
        }
    }

    addStock() {
        this.nav.push(SearchPage, this.stocks);
    }

    removeStock(stock) {
        delete this.stocks[this.stocks.indexOf(stock)];
    }

    
}
