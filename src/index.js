import * as R from "@paqmind/ramda"
import U from "url"
import P from "pathz/lib/posix"

let parsing = (fn) => {
  return (url) => {
    let obj = U.parse(url)
    return fn(obj.pathname)
  }
}

let parsing1 = (fn) => {
  return R.curry((x, url) => {
    let obj = U.parse(url)
    return fn(x, obj.pathname)
  })
}

let parsingAndFormatting = (fn) => {
  return R.curry((url) => {
    let obj = U.parse(url)
    obj.pathname = fn(obj.pathname)
    return U.format(obj)
  })
}

let parsingAndFormatting1 = (fn) => {
  return R.curry((x, url) => {
    let obj = U.parse(url)
    obj.pathname = fn(x, obj.pathname)
    return U.format(obj)
  })
}

export let dir = parsing(P.dir)
export let splitDirs = parsing(P.splitDirs)
export let base = parsing(P.base)
export let name = parsing(P.name)
export let ext = parsing(P.ext)
export let leftDirs = parsing1(P.leftDirs)
export let rightDirs = parsing1(P.rightDirs)
export let leftDir = parsing(P.leftDir)
export let rightDir = parsing(P.rightDir)

export let addLeftDir = parsingAndFormatting1(P.addLeftDir)
export let addRightDir = parsingAndFormatting1(P.addRightDir)
export let dropLeftDir = parsingAndFormatting(P.dropLeftDir)
export let dropRightDir = parsingAndFormatting(P.dropRightDir)
export let withLeftDir = parsingAndFormatting1(P.withLeftDir)
export let withRightDir = parsingAndFormatting1(P.withRightDir)

export let withDir = parsingAndFormatting1(P.withDir)
export let withBase = parsingAndFormatting1(P.withBase)
export let withName = parsingAndFormatting1(P.withName)
export let withExt = parsingAndFormatting1(P.withExt)
export let dropBase = parsingAndFormatting(P.dropBase)
export let dropExt = parsingAndFormatting(P.dropExt)

export let ensureRoot = (path) => path.startsWith("/") ? path : "/" + path

export let ensureProtocol = (protocol) => protocol.endsWith(":") ? protocol : protocol + ":"

export let ensureQs = (qs) => qs.startsWith("?") ? qs : "?" + qs

export let ensureHash = (hash) => hash.startsWith("#") ? hash : "#" + hash

export let protocol = (url) => {
  return U.parse(url).protocol
}

export let auth = (url) => {
  return U.parse(url).auth
}

export let host = (url) => {
  return U.parse(url).host
}

export let hostname = (url) => {
  return U.parse(url).hostname
}

export let port = (url) => {
  return U.parse(url).port
}

export let search = (url) => {
  return U.parse(url).search
}

export let qs = search

export let query = (url) => {
  return U.parse(url).query
}

export let path = (url) => {
  return U.parse(url).path
}

export let pathname = (url) => {
  return U.parse(url).pathname
}

export let relHref = (url) => {
  let obj = U.parse(url)
  return obj.path + (obj.hash || "")
}

export let withProtocol = R.curry((protocol, url) => {
  // Abs. URL is assumed
  let obj = U.parse(url)
  obj.protocol = ensureProtocol(protocol)
  obj.host = obj.host || "localhost:80" // polyfill host
  obj.pathname = ensureRoot(obj.pathname)
  return U.format(obj)
})

export let withAuth = R.curry((auth, url) => {
  // Abs. URL is assumed
  let obj = U.parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.host = obj.host || "localhost:80" // polyfill host
  obj.auth = auth
  obj.pathname = ensureRoot(obj.pathname)
  return U.format(obj)
})

export let withHost = R.curry((host, url) => {
  // Abs. URL is assumed
  let obj = U.parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.host = host
  obj.pathname = ensureRoot(obj.pathname)
  return U.format(obj)
})

export let withHostname = R.curry((hostname, url) => {
  // Abs. URL is assumed
  let obj = U.parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.hostname = hostname
  delete obj.host // drop host
  return U.format(obj)
})

export let withPort = R.curry((port, url) => {
  // Abs. URL is assumed
  let obj = U.parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.hostname = obj.hostname || "localhost" // polyfill hostname
  obj.port = port
  delete obj.host // drop host
  return U.format(obj)
})

export let withHash = R.curry((hash, url) => {
  let obj = U.parse(url)
  obj.hash = ensureHash(hash)
  return U.format(obj)
})

export let withQs = R.curry((qs, url) => {
  let obj = U.parse(url)
  obj.search = ensureQs(qs)
  return U.format(obj)
})

export let withPathname = R.curry((pathname, url) => {
  let obj = U.parse(url)
  obj.pathname = obj.path.startsWith("/")
    ? ensureRoot(pathname)
    : pathname
  delete obj.path
  return U.format(obj)
})

