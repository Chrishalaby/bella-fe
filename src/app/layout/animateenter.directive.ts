import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    Renderer2,
} from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[animateEnter]',
})
export class AnimateEnterDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input('animateEnter') animation!: string;

    documentScrollListener: Function | null = null;
    loadListener: Function = () => {};
    entered: boolean = false;
    @HostBinding('class.visibility-hidden') visibilityHidden: boolean = true;

    constructor(
        public el: ElementRef,
        public renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        if (this.isImage()) {
            this.loadListener = this.renderer.listen(
                this.el.nativeElement,
                'load',
                () => {
                    this.bind();
                }
            );
        }
    }

    ngAfterViewInit() {
        if (!this.isImage()) {
            this.bind();
        }
    }

    bind(): void {
        if (this.isInViewPort()) {
            this.enter();
        }

        if (!this.entered) {
            this.documentScrollListener = this.renderer.listen(
                'window',
                'scroll',
                () => {
                    if (this.isInViewPort() && this.documentScrollListener) {
                        this.enter();
                        this.documentScrollListener();
                        this.documentScrollListener = null;
                    }
                }
            );
        }
    }

    shouldEnter(): boolean {
        return this.entered ? false : this.isInViewPort();
    }

    isInViewPort() {
        if (isPlatformBrowser(this.platformId)) {
            const rect =
                this.el.nativeElement.parentElement.parentElement.parentElement.getBoundingClientRect();
            const docElement = document.documentElement;
            const winHeight = docElement.clientHeight;

            if (rect.top > 0) {
                return rect.top >= 0 && winHeight >= rect.top;
            } else {
                return true;
            }
        }
        return false;
    }

    enter(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.el.nativeElement.classList.add('hidden', this.animation);
            this.el.nativeElement.classList.remove(
                'visibility-hidden',
                'hidden'
            );
            this.entered = true;
        }
    }

    isImage(): boolean {
        return this.el.nativeElement.tagName === 'IMG';
    }

    ngOnDestroy() {
        if (this.documentScrollListener) {
            this.documentScrollListener();
        }

        if (this.loadListener) {
            this.loadListener();
        }
    }
}