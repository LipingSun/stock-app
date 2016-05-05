import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {INTERACTIVE_CHART_API} from "../../config";

@Injectable()
export class StockChartData {

    constructor(public http:Http) {
    }

    render(stock) {
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

        this.http.get(INTERACTIVE_CHART_API + JSON.stringify(params))
            .map(res => res.json())
            .subscribe(data => {
                this.setChart(stock, data)
            });
    }

    setChart(stock, data) {
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

            stock.chart = {
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: stock.name + ' Stock Price'
                },
                scrollbar : {
                    enabled : false
                },
                navigator : {
                    enabled : false
                },
                series: [{
                    name: stock.symbol,
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

