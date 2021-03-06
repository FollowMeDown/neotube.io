import { Component, OnInit } from '@angular/core';
import { CommonService, ApiService } from '@core';
import {
    Router,
    RouterEvent,
    NavigationStart,
    NavigationEnd
} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    lang;
    net;
    currentPage = '';
    copyRightYear = new Date().getFullYear();
    showDropdown = false;
    showPcAssetDropdown = false;
    showIpadAssetDropdown = false;
    showMobileAssetDropdown = false;
    showLangDropdown = false;
    showFooterLangDropdown = false;

    searchVal = '';

    isHashPattern = /^((0x)?)([0-9a-f]{64})$/;
    isAssetPattern = /^([0-9a-f]{40})$/;
    isAddressPattern = /^A([0-9a-zA-Z]{33})$/;
    isNumberPattern = /^\d+$/;
    neoRankLink =
        '/asset/0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b/page/';
    gasRankLink =
        '/asset/0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7/page/';

    constructor(
        private commonService: CommonService,
        private apiService: ApiService,
        private router: Router
    ) {
        this.lang = this.commonService.lang;
        this.net = this.apiService.net;
    }

    ngOnInit(): void {
        this.router.events.subscribe((res: RouterEvent) => {
            if (res instanceof NavigationStart) {
                const urlHash: any = this.commonService.formatUrlHash(
                    location.hash
                );
                if (urlHash.lang) {
                    this.changeLang(urlHash.lang);
                }
            }
            if (res instanceof NavigationEnd) {
                const searchIndex = this.router.url.lastIndexOf('#');
                this.currentPage = this.router.url.slice(
                    0,
                    searchIndex === -1 ? undefined : searchIndex
                );
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
            value = value.replace(/[,???]/g, '');
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

    changeLang(lang) {
        this.showLangDropdown = false;
        this.showFooterLangDropdown = false;
        if (lang === this.lang) {
            return;
        }
        this.lang = lang;
        this.toNewHash();
        this.commonService.changeLang(lang);
    }

    changeNet(net: string) {
        if (net === this.net) {
            return;
        }
        this.net = net;
        if (net === 'mainnet') {
            location.href = `${this.apiService.mainOrigin}${location.pathname}`;
        } else {
            location.href = `${this.apiService.testOrigin}${location.pathname}`;
        }
    }

    toNewHash() {
        let newHash = '';
        const hash: any = this.commonService.formatUrlHash(location.hash);
        if (hash.lang) {
            newHash = `lang=${this.lang}`;
        }
        location.hash = newHash;
    }

    hiddleMenu() {
        this.showDropdown = false;
        this.showMobileAssetDropdown = false;
    }
}
