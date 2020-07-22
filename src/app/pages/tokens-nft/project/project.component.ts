import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '@core';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
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
