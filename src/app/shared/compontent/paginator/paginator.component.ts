import { Component, Input, EventEmitter, Output, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '@core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges, OnInit, OnDestroy {
    public list: number[] = [];
    public groupBase = 0;
    public maxGroup = 1;
    @Input() pageIndex: number; // 当前页数
    @Input() pageSize: number; // 没用到
    @Input() pageLength: number;
    @Output() onpageGo = new EventEmitter<number>();

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
    ngOnChanges() {
        if (this.pageIndex <= 0) {
            this.pageIndex = 1;
        }
        this.groupBase = Math.ceil(this.pageIndex / 3);
        if (this.pageLength) {
            this.maxGroup = Math.ceil(this.pageLength / 3);
            this.resolveList();
        }
    }

    ngOnDestroy() {
        if (this.langSub) {
            this.langSub.unsubscribe();
        }
    }
    public groupPrev() {
        if (this.groupBase > 1) {
            this.groupBase--;
            this.resolveList();
        }
    }
    public groupNext() {
        if (this.groupBase < this.maxGroup) {
            this.groupBase++;
            this.resolveList();
        }
    }
    public jump(value: number) {
        if (value !== this.pageIndex) {
            this.onpageGo.emit(value);
        }
    }
    public prev() {
        if (this.pageIndex - 1 >= 1) {
            this.onpageGo.emit(this.pageIndex - 1);
        }
        this.groupBase = Math.ceil((this.pageIndex - 1) / 3);
        this.resolveList();
    }
    public next() {
        if (this.pageIndex + 1 <= this.pageLength) {
            this.onpageGo.emit(this.pageIndex + 1);
        }
        this.groupBase = Math.ceil((this.pageIndex + 1) / 3);
        this.resolveList();
    }

    private resolveList() {
        this.list = [];
        for (let i = 1; i <= 3; i++) {
            const p = (this.groupBase - 1) * 3 + i;
            if (p >= 1 && p <= this.pageLength) {
                this.list.push(p);
            }
        }
    }
}
