# Release Notes for Up North Coding Logger Module

## 1.0.0

-   added color output, more formatting and redaction of sensitive data to `logger`
-   Development is using eslint now for more consistent code quality
-   cleaned packaging workflow and enhanced `npm run` commands for easier development
-   redaction is now possible of sensitive information. use the `log.redact(password).LEVEL('my password is %s', password)`
