/**
 * @author Michał Kwilman <michal.kwilman@gmail.com>
 * @license MIT
 * @version 1.0
 */

(function() {
    'use strict';

    angular
        .module('gitHubReader')
        .controller('RepositoryListController', RepositoryListController);

    RepositoryListController.$inject = ['repositories'];

    /**
     * GitHub Repository Controller
     * It controls the search form and fetches list of repositories
     * Call "activate()" to initialize the logic
     * @param {Object} github AngularJS service which exposes some of GitHub API
     */
    function RepositoryListController(repositories) {
        var vm = this;

        // PUBLIC PROPERTIES
        vm.userName = '';
        vm.processing = false;
        vm.repos = [];
        // pagination
        vm.numberOfPages= 0;
        vm.currentPage = 1;
        vm.loopHelper = [];

        vm.errorMsg = null;

        // PUBLIC METHODS
        vm.getRepos = getRepos;

        activate();

        /**
         * Activates the controller
         * Perform starting logic here.
         */
        function activate() {

        }

        /**
         * Get Repository list for given user from GitHub 
         * Controls the the web interace through the vm
         */
        function getRepos(pageNumber) {

            vm.processing = true;
            vm.numberOfPages=0;
            vm.errorMsg = null;
            vm.loopHelper=[];
            vm.repos = [];

            pageNumber = pageNumber||1;
            repositories.getForUser(vm.userName, pageNumber)
                .then(
                    function(response) {
                        if (response.repos.length) {
                            vm.repos = response.repos;
                            vm.numberOfPages=response.numberOfPages;
                            vm.currentPage = pageNumber;
                            vm.loopHelper = new Array(response.numberOfPages);
                        } else {
                            vm.errorMsg = 'User does not have any repository';

                        }
                        vm.processing = false;
                    },
                    function(error) {
                        switch (+error.status) {
                            case 404:
                                vm.errorMsg = 'Couldn\'t find given user in github database';
                                break;
                            case 503:
                                vm.errorMsg = 'Github API does not respond';
                                break;
                            default:
                                vm.errorMsg = 'An error occurred.';
                        }
                        vm.processing = false;

                    }
                );
        }

    }

})();
