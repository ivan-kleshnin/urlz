# Urlz

Functional toolkit for URLs. Drop-in [`url`](https://nodejs.org/api/url.html) and
[`querystring`](https://nodejs.org/api/querystring.html) replacement.
Originally built for a static site generator where URL transformations are common, but use-cases
are really unlimited.

### Features

* High-level URL manipulations
* Curried composable API
* Crossplatform: works in NodeJS and all modern browsers
* Extensive test suite

Dependencies:
* [`pathz`](https://github.com/ivan-kleshnin/pathz)

Peer dependencies:
* [`url`](https://nodejs.org/api/url)
* [`querystring`](https://nodejs.org/api/querystring)
* [`@paqmind/ramda`](http://ramdajs.com/) (temp. until basic Ramda)

## Usage

```
$ npm install urlz
```

```js
let U = require("urlz")

// The following snippets also use shortcuts for:
let R = require("ramda")
let UU = require("url")
```

## Motivation

#### 1. Original `format` / `parse` provide limited, low-level, mutable API

#### 2. `urlz` preserves trailing slash or its absence

#### 3. `urlz` respects "relativeness" and "absoluteness" of urls

```js
console.log(U.addLeftDir("bar", "/foo.txt"))  // "/bar/foo.txt" (+)
console.log(UU.join("bar", "/foo.txt"))       // "bar/foo.txt"  (-) naive

console.log(U.addRightDir("bar", "/foo.txt")) // "/bar/foo.txt" (+)
console.log(UU.join("/foo.txt", "bar"))       // "/foo.txt/bar" (-) naive
```

#### 4. `urlz` is composition friendly

```js
let R = require("ramda")

let src = "content/team/about.md"
let dst = R.pipe(
  U.withLeftDir("public"),
  U.addRightDir(P.name(src)),
  U.withBase("index.html")
)(src)

console.log(dst) // "public/team/about/index.html"
                 // corresponding to "/team/about/" URL
```

#### 5. `urlz` is like CRUD for path fragments

```js
// GET
console.log(U.leftDir("/foo/bar/baz.txt"))  // "foo"
console.log(U.rightDir("/foo/bar/baz.txt")) // "bar"

// UPDATE
console.log(U.withLeftDir ("qux", "/foo/bar/baz.txt")) // "/qux/bar/baz.txt"
console.log(U.withRightDir("qux", "/foo/bar/baz.txt")) // "/foo/qux/baz.txt"

// DELETE
console.log(U.dropLeftDir ("/foo/bar/baz.txt")) // "/bar/baz.txt"
console.log(U.dropRightDir("/foo/bar/baz.txt")) // "/foo/baz.txt"

// ...
```

#### 6. `urlz` provides extra utils

*TODO: describe*

## API

*TODO: describe*
