#!/bin/bash

cd node_modules/solid-auth-fetcher/dist/login/oidc/
sed -i -e 's/const form_urlencoded_1 = __importDefault(require("form-urlencoded"));/let form_urlencoded_1 = __importDefault(require("form-urlencoded")); if( typeof form_urlencoded_1.default != "function" ) {form_urlencoded_1 = form_urlencoded_1.default ;}/g' TokenRequester.js
