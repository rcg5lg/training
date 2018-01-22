import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})

export class ModalComponent {
    @Input() title = '';
    @Input() displayed = false;
    @Output() closeEvent = new EventEmitter<boolean>();

    closeWindow() {
        this.closeEvent.emit(false);
    }

    saveData() {
        this.closeEvent.emit(true);
    }
}
