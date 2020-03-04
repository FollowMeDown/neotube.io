import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from '@lib';
import { Subscription } from 'rxjs';
import { ApiService, CommonService } from '@core';

@Component({
    templateUrl: './asset-info.component.html',
    styleUrls: ['./asset-info.component.scss']
})
export class AssetInfoComponent implements OnInit, OnDestroy {
    displayDataList: any = [];
    page = new Page();
    loading = false;
    lang;
    langSub: Subscription;

    assetInfo: any = [];
    assetRegisterInfo: any = [];
    assetType: string;
    assetId: string;
    isAssetPattern: any = /^(0x)([0-9a-f]{64})$/;
    isNep5Pattern: any = /^([0-9a-f]{40})$/;
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
        this.page.size = 10;
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });

        this.aRouter.params.subscribe(params => {
            this.assetType = this.router.url.split('/')[1];
            const page = Number(params.page);
            if (
                this.isNumberPattern.test(page) &&
                ((this.assetType === 'asset' && this.isAssetPattern.test(params.assetId)) ||
                    (this.assetType === 'nep5' && this.isNep5Pattern.test(params.assetId)))
            ) {
                if (params.assetId !== this.assetId) {
                    this.page.index = page;
                    this.assetId = params.assetId;
                    this.checkCondition();
                    this.getListData();
                } else {
                    this.page.index = page;
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

    checkCondition() {
        this.assetInfo = [];
        this.assetRegisterInfo = [];
        if (this.assetType !== 'nep5') {
            this.apiService.GetAssetInfo(this.assetId).subscribe((res: any) => {
                if (res.result) {
                    this.assetInfo = res.result;
                }
            });
        } else {
            this.apiService.GetNep5Info(this.assetId).subscribe((res: any) => {
                if (res.code === 200) {
                    if (typeof res.result === 'object') {
                        this.assetInfo = res.result;
                        this.apiService.GetNep5RegisterInfo(res.result.id).subscribe((res2: any) => {
                            if (res2.result) {
                                this.assetRegisterInfo = res2.result;
                            }
                        });
                    } else if (typeof res.result === 'string') {
                        this.router.navigate([`/transaction/${res.result}`]);
                    }
                }
            });
        }
    }

    getListData() {
        this.loading = true;
        this.apiService.GetRankByAssetID(this.page.index, this.page.size, this.assetId).subscribe((res: any) => {
            if (res.code === 200) {
                this.displayDataList = res.result.data;
                this.page.total = res.result.total;
                this.page.length =
                    res.result.total > 10000 ? Math.ceil(10000 / this.page.size) : Math.ceil(res.result.total / this.page.size);
                if (this.page.index > this.page.length) {
                    this.page.index = 1;
                }
            } else {
                this.displayDataList = false;
            }
            this.loading = false;
        });
    }

    onpageGo(num: number) {
        this.router.navigateByUrl(`/${this.assetType}/${this.assetId}/page/${num}`);
    }
}
