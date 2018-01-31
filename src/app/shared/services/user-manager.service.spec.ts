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
                const reqUser = new User({ id: 0, username: 'foo' });
                const reqPass = 'bar';
                const reqUrl = service.APIUrl + 'login';

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
                    .flush({ success: true, 'user': reqUser }, { status: 200, statusText: 'OK' });
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

    it(`-- doUserLogin method - with invalid response from server - server returns sucess->false`,
        async(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo' });
                const reqPass = 'bar';
                const reqUrl = service.APIUrl + 'login';

                service.doUserLogin(reqUser.username, reqPass).catch((error) => {
                    expect(error.message).toContain('Invalid credentials', 'Error should be thrown when no success->false is received ');
                });
                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('username') === reqUser.username
                        && body.get('password') === reqPass;
                }, `POST to ${reqUrl} with user and password`)
                    .flush({ success: false }, { status: 200, statusText: 'OK' });
            })));

    it(`-- doUserLogin method - server request error`,
        async(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo' });
                const reqPass = 'bar';
                const reqUrl = service.APIUrl + 'login';

                service.doUserLogin(reqUser.username, reqPass).catch((error) => {
                    expect(error.message).not.toContain('Invalid credentials', 'Error should be thrown when no success->false is received ');
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

    it('-- doUserLogout -- when no user is logged in',
        async(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                service.doUserLogout().catch((error) => {
                    expect(error.message).toContain('No user logged in', 'If no user is logged in, error should be triggered when requesting logout');
                });

                backend.expectNone(`No requests should be triggered when no user is logged in`);
            })));

    it('-- doUserLogout -- perform logout for a logged user - request success',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUrl = service.APIUrl + 'logout';

                service.updateLoggedUser(reqUser);

                service.doUserLogout().then((result) => {
                    expect(result).toBeTruthy('User was logged out');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('token') === reqUser.token;
                }, `POST to ${reqUrl} with token`)
                    .flush({ success: true }, { status: 200, statusText: 'OK' });

                tick(); // so that changes from promise are applied in the service
                expect(service.hasLoggedUser()).toBeFalsy('The service should not have a logged user');
                expect(service.getLoggedUser()).toBeNull('The service should not be able to return the logged user');

                service.loggedUser$.subscribe((newValue) => {
                    expect(newValue).toBeNull('The service should publish null');
                });
            })));

    it('-- doUserLogout -- perform logout for a logged user - request returns success->false',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUrl = service.APIUrl + 'logout';

                service.updateLoggedUser(reqUser);

                service.doUserLogout().catch((error) => {
                    expect(error.message).toContain('Invalid token', 'The service should return an error when server responds responds with false');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('token') === reqUser.token;
                }, `POST to ${reqUrl} with token`)
                    .flush({ success: false }, { status: 200, statusText: 'OK' });


                tick(); // so that changes from promise are applied in the service

                expect(service.hasLoggedUser()).toBeTruthy('The service should still have a logged user');
                expect(service.getLoggedUser()).toBeDefined('The service should still be able to return the logged user');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should still contain the logged user details');
            })));

    it('-- doUserLogout -- perform logout for a logged user - request returns success->false',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUrl = service.APIUrl + 'logout';

                service.updateLoggedUser(reqUser);

                service.doUserLogout().catch((error) => {
                    expect(error.message).toContain('Invalid token', 'The service should return an error when server responds responds with false');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('token') === reqUser.token;
                }, `POST to ${reqUrl} with token`)
                    .flush({ success: false }, { status: 200, statusText: 'OK' });


                tick(); // so that changes from promise are applied in the service

                expect(service.hasLoggedUser()).toBeTruthy('The service should still have a logged user');
                expect(service.getLoggedUser()).toBeDefined('The service should still be able to return the logged user');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should still contain the logged user details');
            })));

    it('-- doUserLogout -- perform logout for a logged user - server request error',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUrl = service.APIUrl + 'logout';

                service.updateLoggedUser(reqUser);

                service.doUserLogout().catch((error) => {
                    expect(error.message).not.toContain('Invalid token', 'The service should return an error when server responds responds with false');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('token') === reqUser.token;
                }, `POST to ${reqUrl} with token`)
                    .flush(null, { status: 404, statusText: 'Page missing' });


                tick(); // so that changes from promise are applied in the service

                expect(service.hasLoggedUser()).toBeTruthy('The service should still have a logged user');
                expect(service.getLoggedUser()).toBeDefined('The service should still be able to return the logged user');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should still contain the logged user details');
            })));

    it('-- registerUser -- register a user - request success',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqPass = 'foobar';
                const reqUrl = service.APIUrl + 'users';

                expect(service.hasLoggedUser()).toBeFalsy('The service should not have a logged user initially');
                expect(service.getLoggedUser()).toBeNull('The service should not have any logged user credentials initially');

                service.registerUser(reqUser, reqPass).then((rez: User) => {
                    expect(rez.username).toBe(reqUser.username, 'Request user is not received');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('token') === reqUser.token;
                }, `POST to ${reqUrl} with token`)
                    .flush({ success: true, user: reqUser }, { status: 200, statusText: 'OK' });


                tick(); // so that changes from promise are applied in the service

                expect(service.hasLoggedUser()).toBeTruthy('The service a logged user after registration');
                expect(service.getLoggedUser()).toBeDefined('The service should be able to return a logged user after registration');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should contain the registered user details');

                service.loggedUser$.subscribe((newUser) => {
                    expect(newUser).toBeDefined('The service should publish a new user login');
                    expect(newUser.username).toBe(reqUser.username, 'The service should publish the new login details');
                });
            })));

    it('-- registerUser -- register a user - request returns success->false',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqPass = 'foobar';
                const reqUrl = service.APIUrl + 'users';

                expect(service.hasLoggedUser()).toBeFalsy('The service should not have a logged user initially');
                expect(service.getLoggedUser()).toBeNull('The service should not have any logged user credentials initially');

                service.registerUser(reqUser, reqPass).catch((error) => {
                    expect(error.message).toContain('Invalid data', 'The service should return an error when the server returns success->false');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('token') === reqUser.token;
                }, `POST to ${reqUrl} with token`)
                    .flush({ success: false }, { status: 200, statusText: 'OK' });


                tick(); // so that changes from promise are applied in the service

                expect(service.hasLoggedUser()).toBeFalsy('The service should not have a logged user after registration error');
                expect(service.getLoggedUser()).toBeNull('The service should not be able to return a logged user after registration error');
            })));

    it('-- registerUser -- register a user - server request error',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqPass = 'foobar';
                const reqUrl = service.APIUrl + 'users';

                expect(service.hasLoggedUser()).toBeFalsy('The service should not have a logged user initially');
                expect(service.getLoggedUser()).toBeNull('The service should not have any logged user credentials initially');

                service.registerUser(reqUser, reqPass).catch((error) => {
                    expect(error.message).not.toContain('Invalid data', 'The service should return an error when the server returns success->false');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'POST'
                        && body.get('token') === reqUser.token;
                }, `POST to ${reqUrl} with token`)
                    .flush(null, { status: 404, statusText: 'Page not found' });


                tick(); // so that changes from promise are applied in the service

                expect(service.hasLoggedUser()).toBeFalsy('The service should not have a logged user after registration error');
                expect(service.getLoggedUser()).toBeNull('The service should not be able to return a logged user after registration error');
            })));

    it('-- deleteUser -- delete an logged in user - request success',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqPass = 'foobar';
                const reqUrl = service.APIUrl + 'users/' + reqUser.id;

                service.updateLoggedUser(reqUser);

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');

                service.deleteUser(reqUser).then((result) => {
                    expect(result).toBeTruthy('The service should return success');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'DELETE';
                }, `DELETE to ${reqUrl}`)
                    .flush({ success: true }, { status: 200, statusText: 'ok' });

                tick();

                expect(service.hasLoggedUser()).toBeFalsy('The service should no longer have a logged user');
                expect(service.getLoggedUser()).toBeNull('The service should no longer be able to return a logged user');

                service.loggedUser$.subscribe((newUser) => {
                    expect(newUser).toBeNull('The service should publish null, because logged user is deleted');
                });
            })));

    it('-- deleteUser -- delete an logged in user - request returns success->false',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqPass = 'foobar';
                const reqUrl = service.APIUrl + 'users/' + reqUser.id;

                service.updateLoggedUser(reqUser);

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');

                service.deleteUser(reqUser).catch((error) => {
                    expect(error.message).toContain('Invalid data', 'The service should return an error when the server returns success->false');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'DELETE';
                }, `DELETE to ${reqUrl}`)
                    .flush({ success: false }, { status: 200, statusText: 'ok' });

                tick();

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');
            })));

    it('-- deleteUser -- delete an logged in user - server request error',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqPass = 'foobar';
                const reqUrl = service.APIUrl + 'users/' + reqUser.id;

                service.updateLoggedUser(reqUser);

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');

                service.deleteUser(reqUser).catch((error) => {
                    expect(error).not.toContain('Invalid data', 'The service should return an error when the server returns success->false');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'DELETE';
                }, `DELETE to ${reqUrl}`)
                    .flush(null, { status: 404, statusText: 'Page not found' });

                tick();

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');
            })));

    it('-- update User -- when calling without userData, throw error',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUrl = service.APIUrl + 'users';

                service.updateLoggedUser(reqUser);

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');

                service.updateUser(reqUser).catch((error) => {
                    expect(error).not.toContain('No user data provided', 'The service should return an error when user data is sent');
                });


                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');
            })));

    it('-- update User -- update the currently logged in user - request success',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUserModified = reqUser.clone();
                reqUserModified.username += '1';
                const reqUrl = service.APIUrl + 'users/' + reqUser.id;

                service.updateLoggedUser(reqUser);

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');

                service.updateUser(reqUserModified).then((completed: boolean) => {
                    expect(completed).toBeTruthy('The service should return the new user details');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'PUT'
                        && body.get('username') === reqUserModified.username;
                }, `PUT to ${reqUrl}`)
                    .flush({ 'success': true, 'user': reqUserModified }, { status: 200, statusText: 'ok' });

                tick();

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user');
                expect(service.getLoggedUser()).toBeDefined('The service should have the details of the logged user');
                expect(service.getLoggedUser().username).toBe(reqUserModified.username, 'The service should have the updated details for the logged user');

                service.loggedUser$.subscribe((updatedUser) => {
                    expect(updatedUser).toBeDefined('The service should publish a new user object');
                    expect(updatedUser.username).toBe(reqUserModified.username, 'The new user published should have the updated details');
                });
            })));

    it('-- update User -- update the currently logged in user - request success->false ',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUserModified = reqUser.clone();
                reqUserModified.username += '1';
                const reqUrl = service.APIUrl + 'users/' + reqUser.id;

                service.updateLoggedUser(reqUser);

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');

                service.updateUser(reqUserModified).catch((error) => {
                    expect(error.message).toContain('Invalid data', 'The service should trigger an error');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'PUT'
                        && body.get('username') === reqUserModified.username;
                }, `PUT to ${reqUrl}`)
                    .flush({ 'success': false }, { status: 200, statusText: 'ok' });

                tick();

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user');
                expect(service.getLoggedUser()).toBeDefined('The service should have the details of the logged user');
                expect(service.getLoggedUser().username).not.toBe(reqUserModified.username, 'The service should not have updated details for the logged user');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have the old details for the logged user');
            })));

    it('-- update User -- update the currently logged in user - server request error ',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUser = new User({ id: 1, username: 'foo', token: 'bar' });
                const reqUserModified = reqUser.clone();
                reqUserModified.username += '1';
                const reqUrl = service.APIUrl + 'users/' + reqUser.id;

                service.updateLoggedUser(reqUser);

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user initially');
                expect(service.getLoggedUser()).toBeDefined('The service should have a logged user initially');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have logged user credentials initially');

                service.updateUser(reqUserModified).catch((error) => {
                    expect(error.message).toContain('Invalid data', 'The service should trigger an error');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    const body = new HttpParams({ fromObject: req.body });

                    return req.url === reqUrl
                        && req.method === 'PUT'
                        && body.get('username') === reqUserModified.username;
                }, `PUT to ${reqUrl}`)
                    .flush({ 'success': false }, { status: 200, statusText: 'ok' });

                tick();

                expect(service.hasLoggedUser()).toBeTruthy('The service should have a logged user');
                expect(service.getLoggedUser()).toBeDefined('The service should have the details of the logged user');
                expect(service.getLoggedUser().username).not.toBe(reqUserModified.username, 'The service should not have updated details for the logged user');
                expect(service.getLoggedUser().username).toBe(reqUser.username, 'The service should have the old details for the logged user');
            })));

    it('-- getAllUsers -- retrieve all users from server - request success ',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const userList: User[] = [
                    new User({ id: 1, username: 'foo_1', token: 'bar_1' }),
                    new User({ id: 2, username: 'foo_2', token: 'bar_2' }),
                    new User({ id: 3, username: 'foo_3', token: 'bar_3' }),
                    new User({ id: 4, username: 'foo_4', token: 'bar_4' }),
                ];
                const reqUrl = service.APIUrl + 'users/';

                service.getAllUsers().then((returnedList: User[]) => {
                    expect(returnedList).toBeDefined('The service should return a user list');
                    expect(returnedList.length).toBe(userList.length, 'The service should return the provided');
                    expect(returnedList[0].username).toBe(userList[0].username, 'The returned user list provided by the service should match - case 1');
                    expect(returnedList[1].id).toBe(userList[1].id, 'The returned user list provided by the service should match - case 2');
                    expect(returnedList[2].token).toBe(userList[2].token, 'The returned user list provided by the service should match - case 3');
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === reqUrl
                        && req.method === 'GET';
                }, `GET to ${reqUrl}`)
                    .flush({ 'success': true, 'users': userList }, { status: 200, statusText: 'ok' });
            })));

    it('-- getAllUsers -- retrieve all users from server - request success->false ',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUrl = service.APIUrl + 'users/';

                service.getAllUsers().catch((error) => {
                    expect(error.message).toContain('Invalid data', 'The service should return an error when the server returns success->false')
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === reqUrl
                        && req.method === 'GET';
                }, `GET to ${reqUrl}`)
                    .flush({ 'success': false }, { status: 200, statusText: 'ok' });
            })));

    it('-- getAllUsers -- retrieve all users from server - server request errir ',
        fakeAsync(inject([UserManagerService, HttpTestingController],
            (service: UserManagerService, backend: HttpTestingController) => {
                const reqUrl = service.APIUrl + 'users/';

                service.getAllUsers().catch((error) => {
                    expect(error.message).not.toContain('Invalid data', 'The service should return an error when the server returns success->false')
                });

                backend.expectOne((req: HttpRequest<any>) => {
                    return req.url === reqUrl
                        && req.method === 'GET';
                }, `GET to ${reqUrl}`)
                    .flush(null, { status: 404, statusText: 'Page not found' });
            })));
});
