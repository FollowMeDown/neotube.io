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
    myChart;

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
        // this.myChart = new Chart('myChart', {
        //     type: 'line',
        //     data: {
        //         datasets: [{
        //             data: [
        //                 {
        //                     x: new Date(),
        //                     y: 20
        //                 },
        //                 {
        //                     x: new Date(),
        //                     y: 10
        //                 }
        //             ]
        //         }]
        //     },
        //     options: {
        //         maintainAspectRatio: false,
        //         legend: {
        //             display: false
        //         },
        //         scales: {
        //             xAxes: [{
        //                 type: 'time',
        //                 time: {
        //                     unit: 'day'
        //                 }
        //             }]
        //         },
        //         elements: {
        //             line: {
        //                 fill: false,
        //                 borderWidth: 2,
        //                 borderColor: '#00af92',
        //                 tension: 0 // 禁用贝塞尔曲线
        //             }
        //         }
        //     }
        // });
    }

    ngOnDestroy() {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }

    initPage() {
        this.initShow();
        this.getAddrAssets();
        this.getListData();
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
