import {Page, NavController, Modal, NavParams} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import {CHART_DIRECTIVES} from 'angular2-highcharts';
import 'rxjs/add/operator/map'
import {SearchPage} from '../search-page/search-page';

// API_URL = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=";
// API_URL = "http://10.250.38.241:3000/MODApis/Api/v2/InteractiveChart/json?parameters=";
const API_ENDPOINT = "http://192.168.1.103:3000/MODApis/Api/v2/InteractiveChart/json?parameters=";

@Page({
    templateUrl: 'build/pages/page1/page1.html',
    directives: [CHART_DIRECTIVES]
})
export class Page1 {
    searchQuery:string = '';
    items = ["Apple", "Google"];
    isListHidden = true;
    options:Object;
    hideChart = true;
    symbol:String;

    constructor(public http:Http, public nav:NavController) {
    }

    onPageWillEnter() {
        if (this.symbol) {
            console.log(this.symbol);
            this.getHistoryData(this.symbol);
            this.hideChart = false;
        }
    }

    openSearchPage() {
        this.nav.push(SearchPage, this);
        // let modal = Modal.create(SearchPage);
        // this.nav.present(modal);
    }

    getHistoryData(symbol) {
        let params = {
            Normalized: false,
            // NumberOfDays: 365,
            StartDate: '2011-03-01T00:00:00-00',
            EndDate: '2016-05-02T00:00:00-00',
            DataPeriod: "Day",
            Elements: [
                {
                    Symbol: symbol,
                    Type: "price",
                    Params: ["ohlc"] //ohlc, c = close only
                }
            ]
            //,LabelPeriod: 'Week',
            //LabelInterval: 1
        };
        let url = API_ENDPOINT + JSON.stringify(params);
        console.log(url);
        this.http.get(url).subscribe(
            res => {
                console.log("ok", res.json());
                this.render(symbol, res.json());
            },
            err => {
                console.log("err", err.json());
            }
        );
    }

    render(symbol, data) {
        var dates = data.Dates || [];
        var elements = data.Elements || [];
        var chartSeries = [];

        if (elements[0]) {

            for (var i = 0, datLen = dates.length; i < datLen; i++) {
                var date = new Date(dates[i]);
                var dat = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
                var pointData = [
                    dat,
                    elements[0].DataSeries['open'].values[i],
                    elements[0].DataSeries['high'].values[i],
                    elements[0].DataSeries['low'].values[i],
                    elements[0].DataSeries['close'].values[i]
                ];
                chartSeries.push(pointData);
            }

            this.options = {
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

    getItems(searchbar) {

        this.isListHidden = false;

        // set q to the value of the searchbar
        var q = searchbar.value;

        // if the value is an empty string don't filter the items
        if (q.trim() == '') {
            return;
        }

        this.items = this.items.filter((v) => {
            if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                return true;
            }
            return false;
        })
    }
}
