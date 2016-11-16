/**
 * @author Michał Kwilman <michal.kwilman@gmail.com>
 * @license MIT
 * @version 1.0
 */

(function() {
    'use strict';

    describe('gitHubReader RepositoryListController', function () {
        var createController, $httpBackend;

        beforeEach(module('gitHubReader'));

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            $httpBackend = $injector.get('$httpBackend');


            readJSON.base = '/base/src/modules/githubreader/tests/fixtures/';
            createController = function () {
                return $controller('RepositoryListController', {});
            };

        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be initialized', function () {
            var controller = createController();
    		expect(controller.repos.length).toBeFalsy();
        });

        it('should fetch first out of 3 pages of user\'s repository', function () {
            var controller = createController();
    		controller.userName = 'goeuro';

            var mockResponse = readJSON('goeuro-repos.json');


    		$httpBackend.expectRoute('GET', 'https://api.github.com/users/goeuro/repos')
                .respond(function () {
                    return [mockResponse.status, mockResponse.data, mockResponse.headers];
                });
    		controller.getRepos();
            $httpBackend.flush();

            // CONDITIONS
    		expect(controller.repos.length).toEqual(10);
            expect(controller.currentPage).toEqual(1);
            expect(controller.numberOfPages).toEqual(3);
            expect(controller.processing).toBeFalsy();

        });

        it('should not find github user', function () {
            var controller = createController();
            controller.userName = 'ThereIsNoUserLikeThis-hash4453453'; //example user which not exist

            var mockResponse = readJSON('404-user-repos.json');


            $httpBackend.expectRoute('GET', 'https://api.github.com/users/:userName/repos')
                .respond(function () {
                    return [mockResponse.status, mockResponse.data, mockResponse.headers];
                });
            controller.getRepos();
            $httpBackend.flush();

            // CONDITIONS
            expect(controller.errorMsg).toEqual('Couldn\'t find given user in github database');
            expect(controller.repos.length).toEqual(0);
            expect(controller.numberOfPages).toEqual(0);
            expect(controller.processing).toBeFalsy();  


        });

        it('should receive empty array of user\'s repositories ', function () {
            var controller = createController();
            controller.userName = 'y'; //example user with no repositories as for 15.11.2016

            var mockResponse = readJSON('user-no-repos.json');


            $httpBackend.expectRoute('GET', 'https://api.github.com/users/:userName/repos')
                .respond(function () {
                    return [mockResponse.status, mockResponse.data, mockResponse.headers];
                });
            controller.getRepos();
            $httpBackend.flush();

            // CONDITIONS

            expect(controller.repos.length).toEqual(0);
            expect(controller.errorMsg).toEqual('User does not have any repository');
            expect(controller.numberOfPages).toEqual(0);
            expect(controller.processing).toBeFalsy();  


        });

    });

})();
