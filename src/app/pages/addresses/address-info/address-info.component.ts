import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, CommonService } from '@core';
import { Subscription } from 'rxjs';
import { Page } from '@lib';
import Chart from 'chart.js';

@Component({
    templateUrl: './address-info.component.html',
    styleUrls: ['./address-info.component.scss']
})
export class AddressInfoComponent implements OnInit, OnDestroy {
    displayDataList: any = [];
    page = new Page();
    loading = false;
    lang;
    langSub: Subscription;

    // asset history
    myChart;
    chartOption = 30;
    chartData = {}; // chartData.30: 30天数据，chartData.90: 90 天数据

    transfer: any = [];
    transferNep5: any = [];
    addrAssets: any = ['0'];
    transTotal = 0;
    show: any = [];
    address: string;
    isAddressPattern: any = /^A([0-9a-zA-Z]{33})$/;
    isNumberPattern: any = /^\d+$/;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private aRouter: ActivatedRoute,
        private commonService: CommonService
    ) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.page.size = 5;
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });

        this.aRouter.params.subscribe(params => {
            const page = Number(params.page);
            if (this.isAddressPattern.test(params.address) && this.isNumberPattern.test(page)) {
                if (params.address !== this.address) {
                    this.page.index = page;
                    this.address = params.address;
                    this.initPage();
                } else {
                    this.page.index = page;
                    this.initShow();
                    this.getListData();
                }
            } else {
                this.router.navigateByUrl('/notfound');
            }
        });
    }

    ngOnDestroy() {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }

    initPage() {
        this.chartData = {};
        this.chartOption = 30;
        this.initShow();
        this.getAddrAssets();
        this.getListData();
        this.getGasList();
    }

    initShow() {
        for (let i = 0; i < this.page.size; i++) {
            this.show[i] = false;
            this.transfer[i] = 0;
            this.transferNep5[i] = 0;
        }
    }

    showInfo(index, txid) {
        this.show[index] = !this.show[index];
        if (this.show[index] && this.transfer[index] === 0 && this.transferNep5[index] === 0) {
            this.transfer[index] = '';
            this.transferNep5[index] = '';
            this.getTransferByTxid(index, txid);
            this.getNep5TransferByTxid(index, txid);
        }
    }

    getGasChartData(option) {
        if (option === this.chartOption) {
            return;
        }
        this.chartOption = option;
        this.getGasList();
    }

    getGasList() {
        if (this.myChart && this.chartData.hasOwnProperty(this.chartOption) && this.chartData[this.chartOption]) {
            this.myChart.data.datasets[0].data = this.chartData[this.chartOption].array;
            this.myChart.options.scales.yAxes[0].ticks.min = this.chartData[this.chartOption].min;
            this.myChart.update();
        } else {
            this.apiService.GetAssetsHistorybyAddress(this.address, this.chartOption).subscribe((res: any) => {
                if (res.code === 200) {
                    this.chartData[this.chartOption] = this.handleChartData(res.result);
                    if (this.myChart) {
                        this.myChart.data.datasets[0].data = this.chartData[this.chartOption].array;
                        this.myChart.options.scales.yAxes[0].ticks.min = this.chartData[this.chartOption].min;
                        this.myChart.update();
                    } else {
                        this.initChart(this.chartData[this.chartOption]);
                    }
                }
            });
        }
    }

    handleChartData(data) {
        const targetData: any = { array: [] };
        const currentDay = this.formatDate(new Date().getTime() / 1000) + ' 00:00:00';
        const currentTime = new Date(currentDay).getTime() / 1000;
        const startTime = currentTime - (this.chartOption - 1) * 24 * 3600;
        if (data === null || data === undefined || data.length === 0) {
            targetData.array.push({ x: this.formatDate(startTime), y: 0 });
            targetData.array.push({ x: this.formatDate(currentTime), y: 0 });
            targetData.min = 0;
        } else {
            for (let i = 0, j = 0; i < this.chartOption; i++) {
                const leftTime = startTime + i * 24 * 3600;
                let x;
                let y;
                if (j === data.length) {
                    x = this.formatDate(leftTime);
                    y = targetData.array[i - 1].y;
                } else {
                    if (leftTime < data[j].recordTime) {
                        x = this.formatDate(leftTime);
                        y = i === 0 ? 0 : targetData.array[i - 1].y;
                    } else if (leftTime === data[j].recordTime) {
                        x = this.formatDate(data[j].recordTime);
                        y = Number(data[j].balance);
                        j++;
                    }
                }
                if (targetData.min) {
                    targetData.min = y < targetData.min ? y : targetData.min;
                } else {
                    targetData.min = y;
                }
                targetData.array[i] = { x, y };
            }
        }
        targetData.min = Math.floor(targetData.min * 0.95);
        return targetData;
    }

    formatDate(time) {
        const date = new Date(time * 1000);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    initChart(data) {
        this.myChart = new Chart('myChart', {
            type: 'line',
            data: {
                datasets: [{ data: data.array }]
            },
            options: {
                maintainAspectRatio: false,
                legend: { display: false },
                tooltips: {
                    intersect: false,
                    // bodyFontColor: '#00af92',
                    multiKeyBackground: '#00af92'
                },
                scales: {
                    xAxes: [
                        {
                            type: 'time',
                            gridLines: { display: false },
                            ticks: { maxTicksLimit: window.innerWidth < 500 ? 10 : 30 },
                            time: { displayFormats: { day: 'YYYY-MM-DD' } }
                        }
                    ],
                    yAxes: [{ ticks: { min: data.min } }]
                },
                elements: {
                    line: {
                        fill: false,
                        borderWidth: 2,
                        borderColor: '#00af92',
                        tension: 0 // 禁用贝塞尔曲线
                    }
                }
            }
        });
    }

    getAddrAssets() {
        this.apiService.GetAddrAssets(this.address).subscribe((res: any) => {
            if (res.code === 200) {
                this.addrAssets = this.balanceFilter(res.result);
            } else if (res.code === 1000) {
                this.addrAssets = [];
            } else {
                this.addrAssets = ['0'];
            }
        });
    }

    getListData() {
        this.loading = true;
        this.apiService.GetPageTXByAddress(this.page.index, this.page.size, this.address).subscribe((res: any) => {
            if (res.code === 200) {
                this.displayDataList = res.result.data;
                this.transTotal = res.result.total;
                this.page.length = Math.ceil(res.result.total / this.page.size);
                if (this.page.index > this.page.length) {
                    this.page.index = 1;
                }
            } else {
                this.displayDataList = false;
            }
            this.loading = false;
        });
    }

    getTransferByTxid(index, txid) {
        this.apiService.GetTransferByTXID(txid).subscribe((res: any) => {
            if (res.code === 200) {
                if (res.result.TxUTXO != null || res.result.TxVouts != null) {
                    this.transfer[index] = res.result;
                }
            }
        });
    }

    getNep5TransferByTxid(index, txid) {
        this.apiService.GetNep5TransferByTXID(txid).subscribe((res: any) => {
            if (res.code === 200) {
                if (res.result.length > 0) {
                    this.transferNep5[index] = res.result;
                }
            }
        });
    }

    balanceFilter(balance) {
        // remove balance = 0
        let target: any;
        let j = 0;
        target = [];
        for (const item of balance) {
            if (item.balance !== '0') {
                target[j++] = item;
            }
        }
        return target;
    }

    onpageGo(num: number) {
        this.router.navigateByUrl(`/address/${this.address}/page/${num}`);
    }
}
