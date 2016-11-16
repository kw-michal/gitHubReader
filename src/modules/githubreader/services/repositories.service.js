/**
 * @author Michał Kwilman <michal.kwilman@gmail.com>
 * @license MIT
 * @version 1.0
 */

(function() {
    'use strict';

    angular
        .module('gitHubReader')
        .service('repositories', repositories);

    repositories.$inject = ['$http', '$q', 'GIT_HUB_READER_SETTINGS'];

    /**
     * Fetch github repositories
     * Returns Object: {
     *     repos - array of repositories
     *     numberOfPages - last page index for pagination
     * }
     * @param {Object} $http - AngularJS service for XML HTTP Requests
     * @param {Object} $q - AngularJS service for A+ Promises
     * @param {Object} GIT_HUB_READER_SETTINGS - AngularJS Contstant Provider - config object with constants 
     * @return $q.promise
     */
    function repositories($http, $q, GIT_HUB_READER_SETTINGS) {

        this.getForUser = getForUser;

         function getForUser(userName, pageNumber) {

            if(!userName){
                throw('username parameter is required');
            }
            
            var defer = $q.defer();

            var url = [GIT_HUB_READER_SETTINGS.GITHUB_API_URL, 'users', userName, 'repos'].join('/');

            var params = {
                per_page: GIT_HUB_READER_SETTINGS.GITHUB_ITEMS_PER_PAGE
            }

            if (pageNumber){
                params.page = pageNumber;
            }

            return $http({
                    url: url,
                    method: 'GET',
                    headers: GIT_HUB_READER_SETTINGS.GITHUB_API_HEADERS,
                    params:params
                })
                .then(
                    function success(response) {
                        var repos = response.data.map(function(repo) {
                            return {
                                name: repo.name,
                                url: repo.html_url
                            };
                        });

                        var numberOfPages = 0;
                        if (response.headers('Link')) {

                            var pagesString = response.headers('Link').match(/\?page=(\d+)/g);
                            numberOfPages = +pagesString.map(function(pageString) {
                                    return pageString.split('=')[1];
                                })
                                .reduce(function(p, v) {
                                    return (p > v ? p : v);
                                });
                            if(response.headers('Link').indexOf('rel="last"')<0){
                               // current page is the last one, which means, that found value represents previous page
                               // so the last page will be previous one +1 
                               numberOfPages++;
                            }
                        }

                        defer.resolve({
                            repos: repos,
                            numberOfPages: numberOfPages
                        });
                        return defer.promise;

                    });
        }
    }


})();
