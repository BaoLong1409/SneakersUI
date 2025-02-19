import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DomService {
  private renderer: Renderer2 | null = null;
  constructor(
    @Inject (PLATFORM_ID) private platformId: Object,
    private rendererFactory: RendererFactory2,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer = rendererFactory.createRenderer(null, null);
    }
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  addClassToHtml(className: string): void {
    if (this.isBrowser() && this.renderer) {
      const htmlElement = document.documentElement;
      this.renderer.addClass(htmlElement, className);
    }
  }

  removeClassToHtml(className: string): void {
    if (this.isBrowser() && this.renderer) {
      const htmlElement = document.documentElement;
      this.renderer.removeClass(htmlElement, className);
    }
  }

  public containElement(element: string): boolean {
    if (this.isBrowser() && this.renderer) {
      const htmlElement = document.documentElement;
      if (htmlElement.classList.contains(element)) {
        return true;
      } 
      return false;
    }
    return false;
  }
}
