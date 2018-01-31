import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// stubs
import { RouterLinkStubDirective, RouterOutletStubComponent } from '../../test-stubs/router-stubs';

// components
import { ErrorPageComponent } from './error-page.component';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let rootDE: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorPageComponent, RouterLinkStubDirective, RouterOutletStubComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    rootDE = fixture.debugElement;
    fixture.detectChanges();
  });

  it('-- check component creation', () => {
    expect(component).toBeTruthy();
  });

  it('-- check component content', () => {
    const el: HTMLElement = rootDE.query(By.css('h1')).nativeElement;
    expect(el.textContent).toContain('Woooops');
  });

  it('-- check error option redirects', () => {
    const errorLinks = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
    expect(errorLinks.length).toBe(2, 'option count should be 2');

    let errorOptionRouter: RouterLinkStubDirective;

    let errorLink = errorLinks[0];
    errorOptionRouter = errorLink.injector.get(RouterLinkStubDirective);
    expect(errorLinks[0].nativeElement.textContent).toBe('Report issue', '1st link is report issue');
    expect(errorOptionRouter.linkParams).toBe('/home', '1st link redirects to home');

    errorLink = errorLinks[1];
    errorOptionRouter = errorLink.injector.get(RouterLinkStubDirective);
    expect(errorLinks[1].nativeElement.textContent).toBe('Return to home', '2st link is return to home');
    expect(errorOptionRouter.linkParams).toBe('/home', '2st link redirects to home');
  });
});

