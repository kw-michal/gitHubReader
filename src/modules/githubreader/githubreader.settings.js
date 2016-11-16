/**
 * @author Michał Kwilman <michal.kwilman@gmail.com>
 * @license MIT
 * @version 1.0
 */

/**
 * Settings file
 */
(function() {
    'use strict';

    angular
        .module('gitHubReader')
        .constant("GIT_HUB_READER_SETTINGS", {

            GITHUB_API_URL: "https://api.github.com",
            GITHUB_ITEMS_PER_PAGE: 10,
            GITHUB_API_HEADERS: {
                Accept: 'application/vnd.github.v3+json'
            }

        });

})();
