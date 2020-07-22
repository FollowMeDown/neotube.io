import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, CommonService } from '@core';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './transaction-info.component.html',
    styleUrls: ['./transaction-info.component.scss']
})
export class TransactionInfoComponent implements OnInit, OnDestroy {
    displayDataList: any = [];
    loading = false;
    lang;
    langSub: Subscription;

    transfer: any = [];
    transferNep5: any = [];
    transferNft: any = [];
    txInfo: any = {};
    scripts: any = {};
    txid: string;
    isHashPattern: any = /^(0x)([0-9a-f]{64})$/;

    constructor(
        private router: Router,
        private apiService: ApiService,
        private aRouter: ActivatedRoute,
        private commonService: CommonService
    ) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });

        this.aRouter.params.subscribe(params => {
            if (this.isHashPattern.test(params.txid)) {
                if (params.txid !== this.txid) {
                    this.txid = params.txid;
                    this.initPage();
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
        this.transfer = '';
        this.transferNep5 = '';
        this.transferNft = '';
        this.txInfo = {};
        this.scripts = {};
        this.apiService.GetTXByTXID(this.txid).subscribe((res: any) => {
            if (res.code === 200) {
                if (res.result.nft_txs) {
                    this.transferNft = res.result.nft_txs;
                    this.txInfo = res.result.tx;
                    this.scripts = res.result.script;
                } else {
                    this.txInfo = res.result;
                    this.getTxData();
                }
            }
        });
    }

    getTxData() {
        this.apiService.GetScripts(this.txid).subscribe((res: any) => {
            if (res.code === 200) {
                this.scripts = res.result;
            }
        });
        this.apiService.GetTransferByTXID(this.txid).subscribe((res: any) => {
            if (res.code === 200) {
                this.transfer = res.result;
            }
        });
        this.apiService.GetNep5TransferByTXID(this.txid).subscribe((res: any) => {
            if (res.code === 200) {
                this.transferNep5 = res.result;
            }
        });
    }
}
