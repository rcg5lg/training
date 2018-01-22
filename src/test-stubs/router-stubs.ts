import { Component, Directive, Injectable, Input, HostListener } from '@angular/core';
import { NavigationExtras } from '@angular/router';

@Directive({
    selector: '[routerLink]'
})

export class RouterLinkStubDirective {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    @HostListener('click') onClick() {
        this.navigatedTo = this.linkParams;
    }
}

@Component({
    selector: 'router-outlet',
    template: ''
})
export class RouterOutletStubComponent { }

@Injectable()
export class RouterStub {
    public navigate(commands: any[], extras?: NavigationExtras) { }
}
