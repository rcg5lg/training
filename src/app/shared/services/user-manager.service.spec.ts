import { TestBed, async, inject, ComponentFixtureAutoDetect, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserManagerService } from './user-manager.service';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { UserLoginHistoryService } from './user-login-history.service';
import { UserLoginHistoryServiceStub } from '../../../test-stubs/service-stubs';

describe(`UserManagerService`, () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [
                UserManagerService,
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: UserLoginHistoryService, useClass: UserLoginHistoryServiceStub },
            ]
        });
    }));

    it(`-- doUserLogin method - with correct data`,
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User(0, 'foo');
                const reqPass = 'bar';
                const reqUrl = service.APIUrl + 'users/check_login';

                service.doUserLogin(reqUser.username, reqPass).then((rez: User) => {
                    expect(rez.username).toBe(reqUser.username, 'Request user is not received');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('username') === reqUser.username
                        && body.get('password') === reqPass;
                }, `POST to ${reqUrl} with user and password`)
                    .flush({ 'success': true, 'user': reqUser }, { status: 200, statusText: 'OK' });
                backend.verify();

                tick(); // needed so that new loggedUser value is updated in service;

                expect(service.hasLoggedUser()).toBeTruthy('The service should be able to confirm that a user is logged in');
                expect(service.getLoggedUser()).toBeDefined('The service should be able to return the logged user');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should be able to return the logged user');

                service.loggedUser$.subscribe((newValue) => {
                    expect(newValue).not.toBeNull('The service should publish the details of a new user');
                    expect(newValue.username).toBe(reqUser.username, 'After login, the new user should be dispatched, and name readable');
                });
            })));

    it(`-- doUserLogin method - with invalid response from server`,
        async(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User(1, 'foo');
                const reqPass = 'bar';
                const reqUrl = service.APIUrl + 'users/check_login';

                service.doUserLogin(reqUser.username, reqPass).catch((error) => {
                    expect(error.message).toContain('Invalid credentials', 'Error should be thrown when no success: false is received ');
                });
                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('username') === reqUser.username
                        && body.get('password') === reqPass;
                }, `POST to ${reqUrl} with user and password`)
                    .flush({ 'success': false }, { status: 200, statusText: 'OK' });
            })));

    it(`-- doUserLogin method - with request error`,
        async(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User(1, 'foo');
                const reqPass = 'bar';
                const reqUrl = service.APIUrl + 'users/check_login';

                service.doUserLogin(reqUser.username, reqPass).catch((error) => {
                    expect(error).not.toContain('Invalid credentials', 'Error should be thrown when no success: false is received ');
                });
                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('username') === reqUser.username
                        && body.get('password') === reqPass;
                }, `POST to ${reqUrl} with user and password`)
                    .flush(null, { status: 404, statusText: 'Page not found' });
            })));

});
