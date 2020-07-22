import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, CommonService } from '@core';
import { Page } from '@lib';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {
    displayDataList = [];
    page = new Page();
    loading = false;
    lang;
    langSub: Subscription;
    showDropdown = false;
    isNumberPattern: any = /^\d+$/;

    transType = 'all';
    transfer: any = [];
    transferNep5: any = [];
    transferNft: any = [];
    show: any = [];

    constructor(
        private apiService: ApiService,
        private aRouter: ActivatedRoute,
        private router: Router,
        private commonService: CommonService
    ) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.aRouter.params.subscribe(params => {
            const page = Number(params.page);
            if (this.isNumberPattern.test(page)) {
                this.page.index = page;
                this.getListData();
            } else {
                this.router.navigateByUrl('/transactions/page/1');
            }
        });

        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });
    }

    ngOnDestroy(): void {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }

    getListData() {
        this.initShow();
        this.loading = true;
        this.apiService.GetTransactions(this.page.index, this.page.size, this.transType).subscribe((res: any) => {
            if (res.code === 200) {
                this.displayDataList = res.result.data;
                this.page.length = Math.ceil(res.result.total / this.page.size);
                if (this.page.index > this.page.length) {
                    this.page.index = 1;
                }
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

    getNftTx(index: number, txid: string) {
        this.apiService.GetNftTxByTxId(txid).subscribe((res: any) => {
            if (res.code === 200 && res.result && res.result.nft_txs) {
                this.transferNft[index] = res.result.nft_txs;
            }
        });
    }

    showInfo(index: number, txid: string, isNft = false) {
        this.show[index] = !this.show[index];
        if (this.show[index] && this.transfer[index] === 0 && this.transferNep5[index] === 0 && this.transferNft[index] === 0) {
            this.transfer[index] = '';
            this.transferNep5[index] = '';
            this.transferNft[index] = '';
            if (isNft) {
                this.getNftTx(index, txid);
            } else {
                this.getTransferByTxid(index, txid);
                this.getNep5TransferByTxid(index, txid);
            }
        }
    }

    changeTransType(type: string) {
        this.transType = type;
        this.page.index = 1;
        this.showDropdown = false;
        this.getListData();
    }

    initShow() {
        for (let i = 0; i < this.page.size; i++) {
            this.show[i] = false;
            this.transfer[i] = 0;
            this.transferNep5[i] = 0;
            this.transferNft[i] = 0;
        }
    }

    onpageGo(num: number) {
        this.router.navigateByUrl(`/transactions/page/${num}`);
    }
}
