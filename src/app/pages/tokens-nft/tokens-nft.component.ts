import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService, ApiService } from '@core';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './tokens-nft.component.html',
    styleUrls: ['./tokens-nft.component.scss']
})
export class TokensNftComponent implements OnInit, OnDestroy {
    lang: string;
    langSub: Subscription;
    displayList: any[];

    constructor(private commonService: CommonService, private apiService: ApiService) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });
        this.getNFT();
    }

    ngOnDestroy(): void {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }

    getNFT() {
        this.apiService.GetNfts().subscribe(res => {
            if (res.code === 200 && res.result) {
                this.displayList = res.result;
                sessionStorage.setItem('nfts', JSON.stringify(res.result));
            }
        });
    }
}
