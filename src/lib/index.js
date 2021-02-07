const Util = require('util');

// max number of characters allowed for a given file path before being cut off.
const MAX_FILENAME_CHARS = 20;

const STRING_PADDING = Array(MAX_FILENAME_CHARS).join('.');

const REDACTED = '[REDACTED]';

// terminal colors.
// https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
const colors = {
    reset: '\x1b[0m',

    // log level colors
    trace: '\x1b[230m',
    debug: '\x1b[92m',
    info: '\x1b[97m',
    warn: '\x1b[33m',
    error: '\x1b[91m',

    // log timestamp and filename
    timestamp: '\x1b[38;5;97m',
    filename: '\x1b[38;5;250m',

    // data types
    array: '\x1b[38;5;45m',
    object: '\x1b[38;5;219m',
    number: '\x1b[38;5;208m',
    string: '\x1b[38;5;46m',
    function: '\x1b[38;5;255m' + '\x1b[48;5;235m',

    // special output
    undefined: '\x1b[38;5;208m',
    error_instance: '\x1b[91m',
    error_name: '\x1b[35m',
    error_msg: '\x1b[35m',
    error_stack: '\x1b[91m',
    error_text: '\x1b[93m',
};

// logging levels
const levels = {
    trace: {
        tag: '[TRACE]',
        console: 'log',
    },
    debug: {
        tag: '[DEBUG]',
        console: 'debug',
    },
    info: {
        tag: '[INFO] ',
        console: 'info',
    },
    warn: {
        tag: '[WARN] ',
        console: 'warn',
    },
    error: {
        tag: '[ERROR]',
        console: 'error',
    },
};

class Logger {
    #file = '';
    #RedactStr = '';

    constructor(file) {
        if (file === undefined || file === '') {
            console.error('ERROR: LOGGER REQUIRES A FILENAME VIA .register(__filename) function call!');
        }

        this.#file = file;
    }

    redact(sensitive) {
        let redact_str = '';
        switch (typeof sensitive) {
        case 'object':
            redact_str = JSON.stringify(sensitive);
            break;
        default:
            redact_str = sensitive;
        }

        this.#RedactStr = redact_str;
        return this;
    }

    output(level, all_args) {
        const now = new Date().toISOString();
        const args = [];

        for (let index = 0; index < all_args.length; index += 1) {
            const arg = all_args[index];

            // for a list of all typeof options:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#Description
            switch (typeof arg) {
            case 'object':
                args.push(formatObjectLog(arg));
                break;
            case 'undefined':
                args.push(color('undefined', 'Undefined'));
                break;
            case 'string':
                args.push(formatStringLog(arg, all_args, index));
                break;
            case 'number':
                args.push(color('number', arg));
                break;
            case 'function':
                args.push('Function: ' + color('function', arg.toString()));
                break;
            default:
                args.push(arg);
            }
        }

        // debug out all the common levels
        console[levels[level].console](
            color(level, levels[level].tag + ' ') + color('timestamp', now),
            color('filename', this.#file),

            this.#RedactStr === '' ? args.join(' ') : args.join(' ').split(this.#RedactStr).join(REDACTED)
        );

        // Special case where we want a LOT more debug for the ERROR logs.
        // this handles outputting a stack trace.
        if (level === 'error') {
            console.trace(color(level, ' ') + color('timestamp', now), color('filename', this.#file));
        }

        // reset
        this.#RedactStr = '';
    }
}

// format an object with coloring for pretty console messages
function formatObjectLog(arg) {
    if (arg instanceof Error) {
        return (
            color('error_instance', 'ErrorObject ') +
            color('error_name', 'Name:') +
            "'" +
            arg.name +
            "'" +
            ' ' +
            color('error_msg', ' Message:') +
            "'" +
            arg.message +
            "'" +
            '\n' +
            color('error_stack', 'StackTrace: \n  ') +
            color('error_text', arg.stack)
        );
    }

    // redact the Array or Object while keeping the data type in front of it.
    let json = JSON.stringify(arg);
    if (json === this.RedactStr) {
        json = REDACTED;
    }

    if (Array.isArray(arg)) {
        return 'Array: ' + color('array', json);
    }

    return 'Object:' + color('object', json);
}

// formats a string for pretty color output of console messages
function formatStringLog(arg, all_args, index) {
    // handle string replacements as `%s`, `%d`, `%i`, `%f`
    const substituteAry = arg.match(/%s|%d|%i|%f/g);

    if (substituteAry) {
        // if the current index (index) plus the number of matches for substituteAry is less than the
        // overall length of all the args array, we can proceed to try this.
        if (index + substituteAry.length < all_args.length) {
            const subs_ary = all_args.slice(index + 1, index + 1 + substituteAry.length);

            // if any Substitution is supplied but needs to be redacted, ensure it's redacted properly
            for (let i = 0; i < subs_ary.length; i += 1) {
                if (JSON.stringify(subs_ary[i]) === this.RedactStr) {
                    subs_ary[i] = REDACTED;
                }
            }

            index = index + substituteAry.length;
            return color('string', "'" + Util.format(arg, ...subs_ary) + "'");
        } else {
            // warn the user the call for this Substitution does not have enough info
            Logger.output(
                'error',
                'String Substitution Length Mismatch: found ',
                substituteAry.length,
                'items within "',
                arg,
                '" but only ',
                all_args.length - index,
                'args supplied'
            );
        }
    } else {
        return color('string', "'" + arg + "'");
    }
}

// setup each logger level function dynamically on the class prototype.
for (const level in levels) {
    Logger.prototype[level] = function (...args) {
        this.output(level, [].slice.call(args));
    };
}

// Register a logger instance.
// eg `require(...).register(__filename);` within each file that needs logging
//
exports.register = function (filename) {
    const file = (STRING_PADDING + filename.split('/').slice(-2).join('/')).slice(-MAX_FILENAME_CHARS);

    return new Logger(file);
};

// colorize for the terminal the input string.
function color(colour, input) {
    return colors.reset + colors[colour] + input + colors.reset;
}
