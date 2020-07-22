import { Component, OnInit } from '@angular/core';
import { Page } from '@lib';
import { ApiService, CommonService } from '@core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nft',
    templateUrl: './nft.component.html',
    styleUrls: ['./nft.component.scss']
})
export class NftComponent implements OnInit {
    loading = false;
    displayData: any;
    assetId: string;
    lang;
    langSub: Subscription;
    isAssetPattern: any = /^([0-9a-f]{40})$/;
    isNumberPattern: any = /^\d+$/;

    txPage = new Page();
    holderPage = new Page();
    listTxData: any[];
    listHolderData: any[];
    txLoading = false;
    holderLoading = false;
    isTxTable = true;

    transType = 'all';
    transfer: any = [];
    transferNep5: any = [];
    transferNft: any = [];
    show: any = [];
    showDropdown = false;

    constructor(
        private apiService: ApiService,
        private aRouter: ActivatedRoute,
        private router: Router,
        private commonService: CommonService
    ) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.txPage.size = 10;
        this.holderPage.size = 10;
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });
        this.aRouter.params.subscribe(params => {
            const page = Number(params.page);
            if (this.isNumberPattern.test(page) && this.isAssetPattern.test(params.assetId)) {
                if (location.hash === '#holder') {
                    this.isTxTable = false;
                    this.holderPage.index = page;
                } else {
                    this.isTxTable = true;
                    this.txPage.index = page;
                }
                this.assetId = params.assetId;
                this.getData();
            } else {
                this.router.navigateByUrl('/notfound');
            }
        });
    }

    getData() {
        const nfts = JSON.parse(sessionStorage.getItem('nfts'));
        if (nfts) {
            this.findNft(nfts);
        } else {
            this.apiService.GetNfts().subscribe(res => {
                if (res.code === 200 && res.result) {
                    sessionStorage.setItem('nfts', JSON.stringify(res.result));
                    this.findNft(res.result);
                }
            });
        }
    }

    findNft(nfts: any) {
        this.displayData = nfts.find(item => item.assetId === this.assetId);
        if (this.displayData) {
            if (location.hash === '#holder') {
                this.getListHolderData();
            } else {
                this.getListTxData();
            }
        }
    }

    getListTxData() {
        this.initShow();
        this.txLoading = true;
        this.apiService.GetNftTxByAssetId(this.txPage.index, this.txPage.size, this.assetId).subscribe(res => {
            if (res.code === 200 && res.result) {
                this.listTxData = res.result.data;
                this.txPage.length =
                    res.result.total > 100 ? Math.ceil(100 / this.txPage.size) : Math.ceil(res.result.total / this.txPage.size);
                if (this.txPage.index > this.txPage.length) {
                    this.txPage.index = 1;
                }
            }
            this.txLoading = false;
        });
    }

    getListHolderData() {
        this.holderLoading = true;
        this.apiService.GetNftRankByAssetID(this.holderPage.index, this.holderPage.size, this.assetId).subscribe(res => {
            if (res.code === 200 && res.result) {
                this.listHolderData = res.result.data;
                this.holderPage.total = res.result.total;
                this.holderPage.length =
                    res.result.total > 100 ? Math.ceil(100 / this.holderPage.size) : Math.ceil(res.result.total / this.holderPage.size);
                if (this.holderPage.index > this.holderPage.length) {
                    this.holderPage.index = 1;
                }
            }
            this.holderLoading = false;
        });
    }

    onpageGo(num: number) {
        this.router.navigateByUrl(`/tokens-nft/${this.assetId}/page/${num}${location.hash}`);
    }

    showList(isTxTable: boolean) {
        if (this.isTxTable === isTxTable) {
            return;
        }
        location.hash = isTxTable ? '' : 'holder';
        this.isTxTable = isTxTable;
        if (isTxTable) {
            if (this.holderPage.index !== 1) {
                this.onpageGo(1);
            } else {
                this.txPage.index = 1;
                this.getListTxData();
            }
        } else {
            if (this.txPage.index !== 1) {
                this.onpageGo(1);
            } else {
                this.holderPage.index = 1;
                this.getListHolderData();
            }
        }
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
        this.txPage.index = 1;
        this.showDropdown = false;
        this.getListTxData();
    }

    initShow() {
        for (let i = 0; i < this.txPage.size; i++) {
            this.show[i] = false;
            this.transfer[i] = 0;
            this.transferNep5[i] = 0;
            this.transferNft[i] = 0;
        }
    }
}
