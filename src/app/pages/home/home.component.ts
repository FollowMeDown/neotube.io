import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService, ApiService } from '@core';
import { Subscription, fromEvent } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    lang;
    langSub: Subscription;

    queryCountTime: any;
    total;
    searchVal = '';

    isHashPattern = /^((0x)?)([0-9a-f]{64})$/;
    isAssetPattern = /^([0-9a-f]{40})$/;
    isAddressPattern = /^A([0-9a-zA-Z]{33})$/;
    isNumberPattern = /^\d+$/;

    // ecosystemz
    ecosystemzLen = 4;
    ecosystemzTotal = 4;
    ecosystemzFirstIndex = 0;
    ecosystemzPageIndex = 0;
    ecosystemzItemWidth = 305;
    // broadcast
    broadcastInterval: any;
    broadcastIndex = 0;
    broadcastTotal = 2;

    constructor(private commonService: CommonService, private apiService: ApiService, private router: Router) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.renderEcosystemz();
        fromEvent(window, 'resize').subscribe(() => {
            this.renderEcosystemz();
        });
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });

        this.getAllCounts();

        this.queryCountTime = setInterval(() => {
            this.getAllCounts();
        }, 20000);

        const broadcastList = document.getElementsByClassName('broadcast_content')[0].getElementsByTagName('p');
        this.broadcastInterval = setInterval(() => {
            broadcastList[this.broadcastIndex].removeAttribute('class');
            this.broadcastIndex = this.broadcastIndex < this.broadcastTotal - 1 ? ++this.broadcastIndex : 0;
            broadcastList[this.broadcastIndex].setAttribute('class', 'active');
        }, 2000);
    }

    ngOnDestroy(): void {
        window.clearInterval(this.queryCountTime);
        window.clearInterval(this.broadcastInterval);

        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }

    renderEcosystemz() {
        this.ecosystemzLen = 4;
        this.ecosystemzItemWidth = 305;
        if (window.innerWidth <= 1400) {
            this.ecosystemzLen = 3;
        }
        if (window.innerWidth <= 1090) {
            this.ecosystemzLen = 2;
        }
        if (window.innerWidth <= 780) {
            this.ecosystemzLen = 1;
        }
        if (window.innerWidth <= 405) {
            this.ecosystemzItemWidth = window.innerWidth - 100;
        }
    }

    preEcosystemPage() {
        if (this.ecosystemzPageIndex > 0) {
            this.toEcosystemPage(--this.ecosystemzPageIndex);
        }
    }

    nextEcosystemPage() {
        if (this.ecosystemzPageIndex < Math.ceil(this.ecosystemzTotal / this.ecosystemzLen) - 1) {
            this.toEcosystemPage(++this.ecosystemzPageIndex);
        }
    }

    toEcosystemPage(page: number) {
        this.ecosystemzPageIndex = page;
        this.ecosystemzFirstIndex = this.ecosystemzLen * page;
        document
            .getElementsByClassName('ecosystem_content')[0]
            .setAttribute(
                'style',
                `margin-left: -${this.ecosystemzItemWidth * this.ecosystemzFirstIndex}px; transition: margin-left ${0.4 *
                    this.ecosystemzLen}s`
            );
    }

    getAllCounts() {
        // this.total = {};
        this.apiService.GetAllCounts().subscribe((res: any) => {
            if (res.code === 200 && res.result) {
                this.total = res.result;
            }
        });
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
