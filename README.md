# Urlz

Functional toolkit for URLs. Drop-in [NodeJS Url](https://nodejs.org/api/url.html) and
[NodeJS QueryString](https://nodejs.org/api/url.html) replacement.
Originally built for a static site generator where URL transformation is a common task, but use-cases
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

#### 1. Original `format` / `parse` provide limited, low-level functionality

#### 2. Urlz respects "relativeness" and "absoluteness" of urlz

```js
console.log(U.addLeftDir("bar", "/foo.txt"))  // "/bar/foo.txt" (+)
console.log(UU.join("bar", "/foo.txt"))       // "bar/foo.txt"  (-) naive

console.log(U.addRightDir("bar", "/foo.txt")) // "/bar/foo.txt" (+)
console.log(UU.join("/foo.txt", "bar"))       // "/foo.txt/bar" (-) naive
```

#### 3. Urlz is composition friendly

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

#### 4. Urlz is like CRUD for path fragments

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

#### 5. Urlz provides extra utils

*TODO: describe*

## API

*TODO: describe*
