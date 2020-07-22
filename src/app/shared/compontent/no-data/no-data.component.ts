import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '@core';

@Component({
    selector: 'app-no-data',
    template: `
        <div>{{ 'No data' | translate: lang }}</div>
    `,
    styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit, OnDestroy {
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

    ngOnDestroy() {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }
}
