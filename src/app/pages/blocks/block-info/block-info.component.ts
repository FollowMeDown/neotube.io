import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService, CommonService } from '@core';
import { Subscription } from 'rxjs';
import { Page } from '@lib';

@Component({
    templateUrl: './block-info.component.html',
    styleUrls: ['./block-info.component.scss']
})
export class BlockInfoComponent implements OnInit, OnDestroy {
    displayDataList: any = [];
    page = new Page();
    loading = false;
    lang;
    langSub: Subscription;

    transfer: any = [];
    transferNep5: any = [];
    transferNft: any = [];
    blockInfo: any = [];
    transTotal = 0;
    totalBlocks = 0;
    show: any = [];
    height: number;
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
            const height = Number(params.height);
            if (this.isNumberPattern.test(height) && this.isNumberPattern.test(page)) {
                if (height !== this.height) {
                    this.page.index = page;
                    this.height = height;
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
        this.initShow();
        this.getAllcount();
        this.getBlockByHeight();
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

    getAllcount() {
        this.apiService.GetAllCounts().subscribe((res: any) => {
            if (res.result) {
                this.totalBlocks = res.result.blockCounts;
            }
        });
    }

    getListData() {
        this.loading = true;
        this.apiService.GetTXByHeight(this.page.index, this.page.size, this.height).subscribe((res: any) => {
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

    getBlockByHeight() {
        this.blockInfo = [];
        this.apiService.GetBlockByHeight(this.height).subscribe((res: any) => {
            if (res.result) {
                this.blockInfo = res.result;
            }
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

    onpageGo(num: number) {
        this.router.navigateByUrl(`/block/${this.height}/page/${num}`);
    }
}
