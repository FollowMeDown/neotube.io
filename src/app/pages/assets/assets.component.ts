import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, CommonService } from '@core';
import { Page } from '@lib';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-assets',
    templateUrl: './assets.component.html'
})
export class AssetsComponent implements OnInit, OnDestroy {
    displayDataList = [];
    page = new Page();
    loading = false;
    lang;
    langSub: Subscription;
    isNumberPattern: any = /^\d+$/;

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
                this.router.navigateByUrl('/assets/page/1');
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
        this.loading = true;
        this.apiService.GetAllAssets(this.page.index, this.page.size).subscribe((res: any) => {
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

    onpageGo(num: number) {
        this.router.navigateByUrl(`/assets/page/${num}`);
    }
}
