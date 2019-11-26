import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '@core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notfound',
    template: `
        <section class="page-content">
            <div class="search-content">
                <div class="line-first">{{ 'Sorry, Your search does not exist.' | translate: lang }}</div>
                <div class="line-second">{{ 'Try going back to where you were or heading to the' | translate: lang }} <a routerLink="/home">{{ 'home page' | translate: lang }}</a>.</div>
            </div>
        </section>
    `,
    styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit, OnDestroy {
    lang;
    langSub: Subscription;

    constructor(private commonService: CommonService) {
        this.lang = this.commonService.lang;
    }

    ngOnInit() {
        this.langSub = this.commonService.langSub$.subscribe(res => {
            this.lang = res;
        });
    }

    ngOnDestroy(): void {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }

}
