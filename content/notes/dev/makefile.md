---
title: "Makefile"
tags: [dev, c, build-systems]
---
A `Makefile` declares build targets, their dependencies, and the recipe (shell commands) to produce them, rebuilding only what's stale based on file timestamps. Recipe lines must be indented with a **tab**, not spaces.

---

## Building a Shared Library

```makefile
CC=gcc
CFLAGS=-Wall -Werror -fPIC
LDFLAGS=-shared
SRC=mylib.c
OBJ=$(SRC:.c=.o)
LIB=libmylib.so

all: $(LIB)

$(LIB): $(OBJ)
	$(CC) $(LDFLAGS) -L. -o $@ $^ -l<dependency>

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -f $(OBJ) $(LIB)
```

`-fPIC` generates position-independent code, required for anything going into a shared object. `$@` is the target, `$^` all prerequisites, `$<` the first prerequisite — the pattern rule `%.o: %.c` compiles any `.c` into its matching `.o` without repeating the recipe per file.

## Detecting the Operating System

`$(OS)` is set by the environment on Windows but not on Unix, so it doubles as the branch condition. On non-Windows, `uname -s`/`uname -p` (captured via `$(shell ...)`) identify the OS and CPU architecture, letting the same Makefile set the right `-D` defines across platforms without a separate build file per OS.

```makefile
ifeq ($(OS),Windows_NT)
	CCFLAGS += -D WIN32
	ifeq ($(PROCESSOR_ARCHITEW6432),AMD64)
		CCFLAGS += -D AMD64
	else
		ifeq ($(PROCESSOR_ARCHITECTURE),AMD64)
			CCFLAGS += -D AMD64
		endif
		ifeq ($(PROCESSOR_ARCHITECTURE),x86)
			CCFLAGS += -D IA32
		endif
	endif
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		CCFLAGS += -D LINUX
	endif
	ifeq ($(UNAME_S),Darwin)
		CCFLAGS += -D OSX
	endif
	UNAME_P := $(shell uname -p)
	ifeq ($(UNAME_P),x86_64)
		CCFLAGS += -D AMD64
	endif
	ifneq ($(filter %86,$(UNAME_P)),)
		CCFLAGS += -D IA32
	endif
	ifneq ($(filter arm%,$(UNAME_P)),)
		CCFLAGS += -D ARM
	endif
endif
```
