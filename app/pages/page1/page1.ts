import {Page, NavController, Modal} from 'ionic-angular';
import {Http} from 'angular2/http';
import {CHART_DIRECTIVES} from 'angular2-highcharts';
import {SearchPage} from '../search-page/search-page';

// API_URL = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=";
const WEB_SERVER = 'http://localhost:3000';
const INTERACTIVE_CHART_API = WEB_SERVER + '/MODApis/Api/v2/InteractiveChart/json?parameters=';

@Page({
    templateUrl: 'build/pages/page1/page1.html',
    directives: [CHART_DIRECTIVES]
})
export class Page1 {
    stock = {
        symbol: null,
        chartOption: null
    };
    compareList = [];
    hideChart = true;
    symbol:String;
    isCompare:boolean = false;

    constructor(public http:Http, public nav:NavController) {
    }

    onPageWillEnter() {
        if (this.stock.symbol) {
            if (!this.isCompare) {
                console.log(this.stock.symbol);
                this.getHistoryData(this.stock);
                this.hideChart = false;
            } else {

            }
        }
    }

    openSearchPage(stock) {
        this.nav.push(SearchPage, stock);
        // let modal = Modal.create(SearchPage);
        // this.nav.present(modal);
    }

    getHistoryData(stock) {
        let params = {
            Normalized: false,
            NumberOfDays: 365,
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
        // this.http.get('http://192.168.1.103:3000/api/compare/3ced5627-44ad-4683-99dc-62779c9dd9c4').subscribe(
        //     res => {
        //         console.log("ok", res.json());
        //         this.render(symbol, res.json());
        //     },
        //     err => {
        //         console.log("err", err.json());
        //     }
        // );
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

            this.stock.chartOption = {
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

    compare() {
        
        this.compareList.push();
        // this.openSearchPage();
    }
}
