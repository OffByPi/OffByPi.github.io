---
title: "Loguru"
tags: [dev, python, logging]
---
[loguru](https://github.com/Delgan/loguru) is a drop-in replacement for Python's `logging` module with sane defaults: no boilerplate handler/formatter setup, colorized output, structured `bind()` context, and built-in file rotation.

```python
from loguru import logger

logger.info("started")
logger.bind(user_id=42).warning("low balance")
```

## Intercepting stdlib logging

`loguru` and the standard `logging` module are separate systems — third-party libraries that call `logging.getLogger(__name__)` never reach loguru's sinks unless you bridge them. The standard bridge is a `logging.Handler` that re-emits every stdlib record through loguru, forwarding the caller's stack depth so loguru reports the original call site instead of the handler itself.

```python
import logging
from loguru import logger

class InterceptHandler(logging.Handler):
    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )
```

Install it on the root logger as early as possible in `main()`, before importing anything that might configure `logging` itself:

```python
def main():
    logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
```

* `force=True` clears any handlers a library already attached to the root logger — without it, `basicConfig` is a no-op if handlers exist.
* `level=0` on the root logger disables stdlib-side filtering, leaving level filtering to loguru's own sinks.
* Child loggers propagate to root by default, so this catches most libraries automatically.
* A library that disables propagation or attaches its own handler needs an explicit override: `logging.getLogger("that.lib").handlers = [InterceptHandler()]`.

## Cheatsheet

### Setup
```python
from loguru import logger
logger.add("app.log", rotation="10 MB") # log to file with rotation
logger.remove() # drop the default stderr sink
```

### Intercept stdlib logging
```python
logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True) # call in main(), before other imports
```
