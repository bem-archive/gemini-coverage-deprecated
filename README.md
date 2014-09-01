# Simple gemini coverage

[![Build Status](https://travis-ci.org/bem/gemini-coverage.svg?branch=master)](https://travis-ci.org/bem/gemini-coverage)
[![Code Climate](https://codeclimate.com/github/bem/gemini-coverage/badges/gpa.svg)](https://codeclimate.com/github/bem/gemini-coverage)
[![Test Coverage](https://codeclimate.com/github/bem/gemini-coverage/badges/coverage.svg?rnd=9284)](https://codeclimate.com/github/bem/gemini-coverage)

###### Инструмент позволяет получать минимальную информацию о покрытии библиотеки **gemini**-тестами.

### Установка

```bash
npm i gemini-coverage
```
### Использование

```bash
gemini-coverage <path_to_bem_library> # (стандартный, консольный отчет)
gemini-coverage <path_to_bem_library> -r html # (отчет в виде html)
gemini-coverage <path_to_bem_library> -r number # (отчет в виде чисел - 3/5)
```

```js
var mkReport = require('gemini-coverage');
...
return mkReport(path_to_bem_library, reporter);
```
