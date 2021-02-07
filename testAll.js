//
//  Test All of the modules within /lib
//

const path = require('path');
const fs = require('fs');

(function findTests() {
    fs.readdirSync(path.join(__dirname, 'src'), { withFileTypes: true }).forEach(function (file) {
        if (file.isDirectory() === true) {
            try {
                console.log('===========================================================================');
                console.log('=== testAll running: ', path.join(__dirname, 'lib', file.name, 'test.js'));
                console.log('===========================================================================');

                require(path.join(__dirname, 'lib', file.name, 'test.js'));
            } catch (e) {
                console.error('findTests() failed with error: ', e);
                return null;
            }
        }
    });
})();
