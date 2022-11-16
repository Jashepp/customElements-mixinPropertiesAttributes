
const { defineConfig } = require('cypress')

module.exports = defineConfig({
    "e2e": {
        "baseUrl": "http://localhost:8181/tests/",
        "supportFile": false,
        "specPattern": "tests/**/*.test.js",
    },
    "includeShadowDom": true,
    "video": false,
    "screenshotOnRunFailure": false,
});
