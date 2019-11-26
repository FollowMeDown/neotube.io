import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService, CommonService } from '@core';

@Component({
    selector: 'app-notsearch',
    template: `
        <section class="page-content">
            <div class="search-content">
                <div class="line-first">{{ 'Sorry, Your search height, hash, address or transaction id does not exist.' | translate: lang }}</div>
                <div class="line-second">{{ 'Try going back to where you were or heading to the home page.' | translate: lang }}</div>
                <div class="search"><img src="/assets/images/search.png" alt="search" (click)="search()"><input type="text"
                        [placeholder]="'Block Height, Hash, Address or Transaction id' | translate: lang" [(ngModel)]="searchVal" (keyup.enter)="search()">
                </div>
            </div>
            <div class="view-all">
                <button routerLink="/home"><span>{{ 'Back home' | translate: lang }}</span></button>
            </div>
        </section>
    `,
    styleUrls: ['./notsearch.component.scss']
})
export class NotsearchComponent implements OnInit, OnDestroy {
    searchVal = '';
    lang;
    langSub: Subscription;

    isHashPattern = /^((0x)?)([0-9a-f]{64})$/;
    isAssetPattern = /^([0-9a-f]{40})$/;
    isAddressPattern = /^A([0-9a-zA-Z]{33})$/;
    isNumberPattern = /^\d+$/;

    @HostListener('window:load') public onReload() {
        this.searchVal = this.router.url.split('/')[2];
        this.search();
    }

    constructor(private router: Router, private apiService: ApiService, private commonService: CommonService) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });
    }

    ngOnDestroy() {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }

    search() {
        let value = this.searchVal;
        const inputValue = this.searchVal;
        value = value.trim(); // Remove whitespace
        if (value === '') {
            return;
        }
        this.searchVal = '';
        if (this.isHashPattern.test(value)) {
            if (value.length === 64) {
                value = '0x' + value;
            }
            this.apiService.CheckCondition(value).subscribe((res: any) => {
                if (res.code === 200) {
                    if (res.result === '1') {
                        this.router.navigateByUrl(`/transaction/${value}`);
                    } else if (res.result === '0') {
                        this.router.navigateByUrl(`/asset/${value}/page/1`);
                    }
                } else {
                    this.router.navigateByUrl(`/notsearch/${inputValue}`);
                }
            });
        } else if (this.isAssetPattern.test(value)) {
            this.apiService.GetNep5Info(value).subscribe((res: any) => {
                if (res.code === 200) {
                    if (typeof res.result === 'string') {
                        this.router.navigateByUrl(`/transaction/${res.result}`);
                    } else if (typeof res.result === 'object') {
                        this.router.navigateByUrl(`/nep5/${value}/page/1`);
                    }
                } else {
                    this.router.navigateByUrl(`/notsearch/${inputValue}`);
                }
            });
        } else if (this.isAddressPattern.test(value)) {
            this.apiService.GetAddrAssets(value).subscribe((res: any) => {
                if (res.code === 200) {
                    this.router.navigateByUrl(`/address/${value}/page/1`);
                } else {
                    this.router.navigateByUrl(`/notsearch/${inputValue}`);
                }
            });
        } else if (Number(value[0]) >= 0) {
            value = value.replace(/[,，]/g, '');
            if (!isNaN(Number(value)) && this.isNumberPattern.test(value)) {
                if (Number.isInteger(Number(value))) {
                    this.router.navigateByUrl(`/block/${value}/page/1`);
                }
            } else {
                this.router.navigateByUrl(`/notsearch/${inputValue}`);
            }
        } else {
            this.router.navigateByUrl(`/notsearch/${inputValue}`);
        }
    }
}
