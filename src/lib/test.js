//
// Basic Visual Tester for Logger.js
//

const log = require('./index.js').register(__filename); // logger

// Sample Data Objects
const obj = {
    'top level': {
        'nested obj': 'nested value',
    },
};

const ary = [
    obj,
    {
        'object in array': [
            'array index 0',
            { 'object in array': 'value in obj' },
            ['array in array', 'password in nested array'],
        ],
    },
];

function testFunc() {
    const v = 'password';
    return v;
}

// end of sample data objects
// process.exit();
// log.info('this is a %s %d %i %f string', 's', 24, 600, 2.00)

for (const level in log) {
    // if(level != 'error'){
    //      continue;
    // }
    //
    console.log('============== outputting logging for level: ', level);

    log[level]('string');
    log[level](80085);
    log[level](obj);
    log[level](ary);
    log[level](new Error('this is an Error Object'));
    log[level](undefined);

    log.redact('1234')[level]('my password is 1234', 'String Redaction');
    log.redact('1234')[level]('my password is %s', '1234', 'String Redaction in Substitution');
    log.redact(1234)[level]('my password is 1234', 'Number Redaction');
    log.redact(1234)[level]('my password is %i', 1234, 'Number Redaction in Substitution');
    log.redact({ pwd: 1234 })[level]('my password is', { pwd: 1234 }, 'Object Redaction');
    log.redact({ pwd: 1234 })[level]('my password is %s', { pwd: 1234 }, 'Object Redaction in String Substitution');
    log.redact([1, 2, 3, 4])[level]('my password is', [1, 2, 3, 4], 'Array Redaction');
    log.redact([1, 2, 3, 4])[level]('my password is %s', [1, 2, 3, 4], 'Array Redaction in String Substitution');
    log.redact('password')[level](testFunc);

    log.redact('password')[level](ary);
}
