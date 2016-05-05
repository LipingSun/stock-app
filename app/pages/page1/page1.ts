import {Page, NavController} from 'ionic-angular';
import {Http} from 'angular2/http';
import {CHART_DIRECTIVES} from 'angular2-highcharts';
import {SearchPage} from '../search-page/search-page';
import {INTERACTIVE_CHART_API} from "../../config";

@Page({
    templateUrl: 'build/pages/page1/page1.html',
    directives: [CHART_DIRECTIVES]
})
export class Page1 {
    mainStock;
    compareStock;
    compareList = [];

    constructor(public http:Http, public nav:NavController) {
    }

    clearStock() {
        this.mainStock = null;
        this.compareStock = null;
        this.compareList = [];
    }

    onPageWillEnter() {
        if (this.mainStock) {
            if (!this.mainStock.symbol) {
                this.mainStock = null;
            } else {
                if (!this.compareStock) {
                    console.log('mainStock', this.mainStock.symbol);
                    this.getHistoryData(this.mainStock);
                } else {
                    console.log('compareStock', this.compareStock.symbol);
                    // this.getHistoryData(this.compareStock);
                }
            }
        }
    }

    searchStock(stock) {
        this.nav.push(SearchPage, stock);
    }

    getHistoryData(stock) {
        let params = {
            Normalized: false,
            NumberOfDays: 5000,
            // StartDate: '2011-03-01T00:00:00-00',
            // EndDate: '2016-05-02T00:00:00-00',
            DataPeriod: "Day",
            Elements: [
                {
                    Symbol: stock.symbol,
                    Type: "price",
                    Params: ["ohlc"] //ohlc, c = close only
                }
            ]
            //,LabelPeriod: 'Week',
            //LabelInterval: 1
        };
        let url = INTERACTIVE_CHART_API + JSON.stringify(params);
        console.log(url);
        this.http.get(url).subscribe(
            res => {
                console.log("ok", res.json());
                this.setChartOption(stock.symbol, res.json());
            },
            err => {
                console.log("err", err.json());
            }
        );
    }

    setChartOption(symbol, data) {
        // data = data.body.stockB;
        var dates = data.Dates || [];
        var elements = data.Elements || [];
        var chartSeries = [];

        if (elements[0]) {

            for (var i = 0, datLen = dates.length; i < datLen; i++) {
                var date = new Date(dates[i]);
                var dat = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
                var pointData = [
                    dat,
                    // elements[0].DataSeries['open'].values[i],
                    // elements[0].DataSeries['high'].values[i],
                    // elements[0].DataSeries['low'].values[i],
                    elements[0].DataSeries['close'].values[i]
                ];
                chartSeries.push(pointData);
            }

            this.mainStock.chartOption = {
                rangeSelector: {
                    selected: 0
                },
                title: {
                    text: symbol + ' Stock Price'
                },
                series: [{
                    name: symbol,
                    data: chartSeries,
                    tooltip: {
                        valueDecimals: 2
                    }
                    // dataGrouping: {
                    //     units: [[
                    //         'week',                         // unit name
                    //         [1]                             // allowed multiples
                    //     ], [
                    //         'month',
                    //         [1, 2, 3, 4, 6]
                    //     ]]
                    // }
                }]
            };
        }
    }

}
