# Up North Coding - Logger for NodeJS

A simple and useful NodeJS logger that uses colors on the console and can redact sensitive information before being output.

---

## NPM Install

within a nodejs project, install this module via NPM eg:

`npm install @unc/logger`

---

## NodeJS REQUIRE & Usage Example(s)

```
// Require the logger module.
const log = require('@unc/logger').register(__filename);

// basic usage:
log.info('test', 3, [3, 5, '10']);

// Supported levels: (all levels can have redaction applied)
log.trace(...)
log.debug(...)
log.info(...)
log.warn(...)
log.error(...)

// Redact some sensitive info (strings and objects are supported types for redaction)
log.redact('my password').info('"my password" should not display');

// string substitution example:
log.info('my name is %s. How are you?', 'Vance');

```

---

## TODO:

Better docs are coming soon. There are some minor bugs that also will get some love. Please be kind and patient or help out if you feel the urge!
