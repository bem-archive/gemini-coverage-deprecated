# Simple gemini coverage

[![Build Status](https://travis-ci.org/bem/gemini-coverage.svg?branch=master)](https://travis-ci.org/bem/gemini-coverage)

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
