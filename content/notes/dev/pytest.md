---
title: "Pytest"
tags: [dev, python, testing, pytest]
---
Pytest is Python's de-facto testing framework, built around plain `assert` statements, fixtures for setup/teardown, and a plugin ecosystem (coverage, freezing time, mocking).

## Monkeypatching a Method

The `monkeypatch` fixture replaces an attribute for the duration of a test and restores it automatically afterward. Wrapping it in an `autouse=True` fixture applies the patch to every test in the module without an explicit request.

```python
import pytest
from your_module import Component

@pytest.fixture(autouse=True)
def patch_set_name(monkeypatch):
    def mock_set_name(self, name):
        pass  # customize per test

    monkeypatch.setattr(Component, "set_name", mock_set_name)
```

## Adding Directories to $PYTHONPATH

Rather than mutating `sys.path` in test code, declare extra import paths in config so every test run picks them up consistently. In `pytest.ini`:

```ini
[pytest]
pythonpath = ADDITIONAL_DIRECTORY1 ADDITIONAL_DIRECTORY2
```

Or in `pyproject.toml`:

```toml
[tool.pytest.ini_options]
pythonpath = ["ADDITIONAL_DIRECTORY1", "ADDITIONAL_DIRECTORY2"]
```

## Fixture Cleanup

A fixture that `return`s only sets up state. Swap `return` for `yield` and put teardown code after the `yield` — pytest runs everything past it once the test finishes, even if the test raises.

```python
@pytest.fixture
def resource():
    r = acquire()
    yield r
    r.release()  # runs after the test, even on failure
```

## Using a Fixture Inside `pytest.mark.parametrize`

`parametrize` values are resolved before fixtures run, so you can't pass a fixture directly as a parameter. The workaround is the built-in `request` fixture, which exposes `getfixturevalue(fixture_name: str)` to resolve a fixture by name at test time.

```python
@pytest.mark.parametrize("fixture_name", ["fixture_a", "fixture_b"])
def test_something(request, fixture_name):
    value = request.getfixturevalue(fixture_name)
```

## Skipping When a Dependency Is Missing

`pytest.importorskip("module")` imports a module and skips the test (or whole file, at module level) if it's not installed, instead of failing with an `ImportError`.

```python
np = pytest.importorskip("numpy")
```

For conditional skips unrelated to imports, `pytest.skip` needs `allow_module_level=True` to run outside a test function — e.g. at the top of a file based on platform or environment:

```python
import sys
if sys.platform == "win32":
    pytest.skip("unsupported on Windows", allow_module_level=True)
```

## Coverage

Install `pytest-cov` and run with `--cov`:

```bash
pytest --cov-report html --cov=.
```

Exclude folders (e.g. the test suite itself) via `.coveragerc`:

```ini
[run]
omit = tests/*
```

## Cheatsheet

### Monkeypatching
```python
monkeypatch.setattr(Component, "set_name", mock_set_name)
```

### Config
```ini
# pytest.ini
[pytest]
pythonpath = ADDITIONAL_DIRECTORY1 ADDITIONAL_DIRECTORY2
```
```toml
# pyproject.toml
[tool.pytest.ini_options]
pythonpath = ["ADDITIONAL_DIRECTORY1", "ADDITIONAL_DIRECTORY2"]
```

### Fixtures
```python
yield r  # instead of return, for teardown after
request.getfixturevalue(fixture_name)  # resolve a fixture by name
```

### Skipping
```python
np = pytest.importorskip("numpy")
pytest.skip("reason", allow_module_level=True)
```

### Coverage
```bash
pytest --cov-report html --cov=. # requires pytest-cov
```
```ini
# .coveragerc
[run]
omit = tests/*
```
