//
// post-install.js
//  executes after npm install
//

let log = null;

try {
    log = require('@unc/logger').register(__filename); // logger

    log.info('Up North Coding Logger Installed - Yay!');
} catch (e) {
    console.warn('ERROR: cannot load Up North Coding Logger. ', e);
}
