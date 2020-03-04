import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CommonService {
    lang = 'en';
    langSource = new Subject<string>();
    langSub$ = this.langSource.asObservable();

    constructor() {
        if (localStorage.getItem('lang')) {
            this.lang = localStorage.getItem('lang');
        }
    }

    changeLang(lang) {
        this.lang = lang;
        localStorage.setItem('lang', lang);
        this.langSource.next(lang);
    }

    formatUrlHash(search: string) {
        if (typeof search !== 'undefined') {
            search = search.substr(1); // 从起始索引号提取字符串中指定数目的字符
            const arr = search.split('&'); // 把字符串分割为字符串数组
            const obj = {};
            let newarr = [];
            arr.forEach(item => {
                newarr = item.split('=');
                if (typeof obj[newarr[0]] === 'undefined') {
                    if (newarr[0] === 'lang') {
                        if (newarr[1] === 'zh') {
                            obj[newarr[0]] = 'zh';
                        } else {
                            obj[newarr[0]] = 'en';
                        }
                    }
                }
            });
            return obj;
        }
        return {};
    }
}
