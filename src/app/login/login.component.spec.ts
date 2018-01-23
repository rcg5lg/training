import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// stubs
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../test-stubs/router-stubs';

// components
import { LoginComponent } from './login.component';
import { UserManagerService } from '../shared/services/user-manager.service';
import { User } from '../shared/models/user';

describe('Login Component', () => {
  let component: LoginComponent;
  let userMgrService: UserManagerService;
  let fixture: ComponentFixture<LoginComponent>;
  let rootDE: DebugElement;
  let formInputs: DebugElement[];
  let loginBtn: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientModule
      ],
      declarations: [
        LoginComponent
      ],
      providers: [
        UserManagerService,
        { provide: Router, useClass: RouterStub }
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    rootDE = fixture.debugElement;
    formInputs = rootDE.queryAll(By.css('input'));
    loginBtn = rootDE.query(By.css('button')).nativeElement;
    fixture.detectChanges();
  }));

  it('-- component creation', () => {
    expect(component).toBeTruthy();
  });

  it('-- initially, interface is empty', () => {
    expect(formInputs[0].nativeElement.textContent).toBe('', 'Username input should be empty');
    expect(formInputs[1].nativeElement.textContent).toBe('', 'Password input should be empty');

    expect(loginBtn.getAttribute('disabled')).toBeDefined('Submit should be disabled');
  });

  it('-- when setting only username, login button should be disabled', fakeAsync(() => {
    const newInputValue = 'Input 1';

    const usernameInput = formInputs[0].nativeElement;
    usernameInput.value = newInputValue;
    usernameInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.username).toBe(newInputValue, 'Username should be set');
    expect(loginBtn.getAttribute('disabled')).toBeDefined('Login button should remain disabled');
  }));

  it('--  when setting only password, login button should be disabled', fakeAsync(() => {
    const newInputValue = 'Input 1';

    const passInput = formInputs[1].nativeElement;
    passInput.value = newInputValue;
    passInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.password).toBe(newInputValue, 'Password should be set');
    expect(loginBtn.getAttribute('disabled')).toBeDefined('Login button should remain disabled');
  }));

  it('-- when setting both username/password, login button should be enabled', fakeAsync(() => {
    const newInputValue = 'Input 1';

    const usernameInput = formInputs[0].nativeElement;
    const passInput = formInputs[1].nativeElement;
    usernameInput.value = newInputValue;
    usernameInput.dispatchEvent(new Event('input'));
    passInput.value = newInputValue;
    passInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.username).toBe(newInputValue, 'Username should be set');
    expect(component.password).toBe(newInputValue, 'Password should be set');
    expect(loginBtn.getAttribute('disabled')).toBeNull('Login button should be enabled');
  }));

  it('-- when setting username as empty, login button should remain disabled and validation should appear', fakeAsync(() => {
    const newInputValue = 'Input 1';
    const usernameInput = formInputs[0].nativeElement;
    const passInput = formInputs[1].nativeElement;

    usernameInput.dispatchEvent(new Event('input'));
    passInput.value = newInputValue;
    passInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.username).toBe('', 'Username value empty');
    expect(component.password).toBe(newInputValue, 'Password value set');
    expect(loginBtn.getAttribute('disabled')).toBeDefined('Login button should be disabled');

    const divAlerts = rootDE.queryAll(By.css('div.alert-danger'));
    expect(divAlerts.length).toBe(1, '1 alert should be displayed');
    expect(divAlerts[0].nativeElement.textContent).toContain('Name', 'Confirming alert is related to username');
  }));

  it('-- when password input set as empty, login button should remain disabled and validation should appear', fakeAsync(() => {
    const newInputValue = 'Input 1';
    const usernameInput = formInputs[0].nativeElement;
    const passInput = formInputs[1].nativeElement;

    usernameInput.value = newInputValue;
    usernameInput.dispatchEvent(new Event('input'));
    passInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.username).toBe(newInputValue, 'Username value set');
    expect(component.password).toBe('', 'Password value empty');
    expect(loginBtn.getAttribute('disabled')).toBeDefined('Login button should be disabled');

    const divAlerts = rootDE.queryAll(By.css('div.alert-danger'));
    expect(divAlerts.length).toBe(1, '1 alert should be displayed');
    expect(divAlerts[0].nativeElement.textContent).toContain('Password', 'Confirming alert is related to password');
  }));

  it('-- when both inputs are set as empty, validation messages appear and login button remains disabled', fakeAsync(() => {
    const newInputValue = 'Input 1';
    const usernameInput = formInputs[0].nativeElement;
    const passInput = formInputs[1].nativeElement;

    usernameInput.dispatchEvent(new Event('input'));
    passInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.username).toBe('', 'Username value set');
    expect(component.password).toBe('', 'Password value empty');
    expect(loginBtn.getAttribute('disabled')).toBeDefined('Login button should be disabled');

    const divAlerts = rootDE.queryAll(By.css('div.alert-danger'));
    expect(divAlerts.length).toBe(2, '2 alert should be displayed');
  }));

  it('-- when clicking on login button with correct inputs, if request is ok, check confirmation message and forwarding', fakeAsync(() => {
    userMgrService = fixture.debugElement.injector.get(UserManagerService);
    const newInputValue = 'Input 1';
    const usernameInput = formInputs[0].nativeElement;
    const passInput = formInputs[1].nativeElement;

    usernameInput.value = newInputValue;
    usernameInput.dispatchEvent(new Event('input'));
    passInput.value = newInputValue;
    passInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(loginBtn.getAttribute('disabled')).toBeNull('Login button should be enabled');

    const loggedUser = new User();
    loggedUser.name = 'Jorj';
    spyOn(userMgrService, 'doUserLogin').and.returnValue(Promise.resolve(loggedUser));

    const spy = spyOn(fixture.debugElement.injector.get(Router), 'navigate');

    loginBtn.click();

    tick();
    fixture.detectChanges();

    expect(component.welcomeMsg).toContain(loggedUser.name, `Welcome message for ${loggedUser.name} should be displayed`);

    // tick needed because redirect is performed after 700ms, so we have to wait a few before request is actually performed
    tick(1000);
    const redirectParams = spy.calls.first().args;
    const redirectUrl = redirectParams[0].reduce((accumulator, value) => {
      return accumulator + value;
    }, '');
    expect(redirectUrl).toBe('/groups', `After login, redirect to /groups page should be performed`);

  }));

  it('-- when clicking on login button with correct inputs, if request is not ok, check error message', fakeAsync(() => {
    userMgrService = fixture.debugElement.injector.get(UserManagerService);
    const newInputValue = 'Input 1';
    const usernameInput = formInputs[0].nativeElement;
    const passInput = formInputs[1].nativeElement;

    usernameInput.value = newInputValue;
    usernameInput.dispatchEvent(new Event('input'));
    passInput.value = newInputValue;
    passInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(loginBtn.getAttribute('disabled')).toBeNull('Login button should be enabled');

    const loggedUser = new User();
    loggedUser.name = 'Jorj';
    const errorMsg = 'Dummy error';
    spyOn(userMgrService, 'doUserLogin').and.returnValue(Promise.reject(new Error(errorMsg)));

    loginBtn.click();

    tick();
    fixture.detectChanges();

    expect(component.welcomeMsg).toBe('', `Welcome message should be empty`);
    expect(component.loginError).toContain(errorMsg, `Error message should be set`);
  }));

});

