import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'unixTime'
})
export class UnixTimePipe implements PipeTransform {
    transform(value: any, lang): any {
        if (!value || typeof value !== 'number') {
            return value;
        }
        const res = value * 1000;
        value = (new Date().getTime() - value * 1000) / 1000;
        const min = Math.floor(value / 60);
        const sec = Math.floor(value);
        if (min > 59) {
            return this.getTime(res);
        }
        switch (lang) {
            case 'en':
                if (min > 0) {
                    return min + ' minutes ago';
                } else if (sec > 10) {
                    return sec + ' seconds ago';
                } else if (sec >= 0) {
                    return 'just now';
                }
            case 'zh':
                if (min > 0) {
                    return min + ' 分钟前';
                } else if (sec > 10) {
                    return sec + ' 秒前';
                } else if (sec >= 0) {
                    return '刚刚';
                }
            case 'ko':
                if (min > 0) {
                    return min + ' 분 전';
                } else if (sec > 10) {
                    return sec + ' 초 전';
                } else if (sec >= 0) {
                    return '다만';
                }
            case 'ja':
                if (min > 0) {
                    return min + ' 分前';
                } else if (sec > 10) {
                    return sec + ' 秒前';
                } else if (sec >= 0) {
                    return 'ただ';
                }
            case 'ru':
                if (min > 0) {
                    return min + ' минуту назад';
                } else if (sec > 10) {
                    return sec + ' секунду назад';
                } else if (sec >= 0) {
                    return 'просто';
                }
            case 'de':
                if (min > 0) {
                    return `Vor ${min} Minute`;
                } else if (sec > 10) {
                    return `Vor ${sec} Sekunde`;
                } else if (sec >= 0) {
                    return 'gerade';
                }
            case 'fr':
                if (min > 0) {
                    return `il y a ${min} minute`;
                } else if (sec > 10) {
                    return `Il y a ${sec} seconde`;
                } else if (sec >= 0) {
                    return 'juste';
                }
            case 'es':
                if (min > 0) {
                    return `Hace ${min} minuto`;
                } else if (sec > 10) {
                    return `Hace ${sec} segundo`;
                } else if (sec >= 0) {
                    return 'sólo';
                }
            case 'it':
                if (min > 0) {
                    return min + ' minuto fa';
                } else if (sec > 10) {
                    return sec + ' secondo fa';
                } else if (sec >= 0) {
                    return 'appena';
                }
            default:
                if (min > 0) {
                    return min + ' minutes ago';
                } else if (sec > 10) {
                    return sec + ' seconds ago';
                } else if (sec >= 0) {
                    return 'just now';
                }
        }
    }
    getTime(time: any) {
        time = new Date(time);
        const year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();
        month = this.PrefixInteger(month, 2);
        day = this.PrefixInteger(day, 2);
        hour = this.PrefixInteger(hour, 2);
        minute = this.PrefixInteger(minute, 2);
        second = this.PrefixInteger(second, 2);
        const times =
            year +
            '-' +
            month +
            '-' +
            day +
            ' ' +
            hour +
            ':' +
            minute +
            ':' +
            second;
        return times;
    }
    PrefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }
}
