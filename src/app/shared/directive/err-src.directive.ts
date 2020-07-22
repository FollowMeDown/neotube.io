import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[err-src]', // Attribute selector
    host: {
        '(error)': 'onError($event.target)'
    }
})
export class ErrSrcDirective {
    constructor() {}

    private image = '/assets/images/nft/default-logo.png';

    @Input('err-src')
    set backImg(img: string) {
        if (img) this.image = img;
    }

    onError(e) {
        e.src = this.image;
    }
}
