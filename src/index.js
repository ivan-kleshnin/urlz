import * as R from "@paqmind/ramdax"
import U from "url"
import QS from "querystring"
import P from "pathz/lib/browser"

/**
 * Notes:
 *   obj.host has priority over obj.hostname + obj.port and obj.href
 *   but
 *   obj.pathname + obj.search have priority over obj.path and obj.href
 */

R.reduce2 = R.addIndex(R.reduce)

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

// API =============================================================================================
let parse = (url) => {
  let obj = U.parse(url)
  obj.origin = (obj.protocol ? obj.protocol + "//" : "") + obj.host
  obj.relHref = obj.path + (obj.hash || "")
  return obj
}

let format = U.format

let resolve = U.resolve

let domainToASCII = U.domainToASCII

let domainToUnicode = U.domainToUnicode

let dir = parsing(P.dir)

let splitDirs = parsing(P.splitDirs)

let base = parsing(P.base)

let name = parsing(P.name)

let ext = parsing(P.ext)

let leftDirs = parsing1(P.leftDirs)

let rightDirs = parsing1(P.rightDirs)

let leftDir = parsing(P.leftDir)

let rightDir = parsing(P.rightDir)

let addLeftDir = parsingAndFormatting1(P.addLeftDir)

let addRightDir = parsingAndFormatting1(P.addRightDir)

let dropLeftDir = parsingAndFormatting(P.dropLeftDir)

let dropRightDir = parsingAndFormatting(P.dropRightDir)

let withLeftDir = parsingAndFormatting1(P.withLeftDir)

let withRightDir = parsingAndFormatting1(P.withRightDir)

let withDir = parsingAndFormatting1(P.withDir)

let withBase = parsingAndFormatting1(P.withBase)

let withName = parsingAndFormatting1(P.withName)

let withExt = parsingAndFormatting1(P.withExt)

let dropBase = parsingAndFormatting(P.dropBase)

let dropExt = parsingAndFormatting(P.dropExt)

let ensureRoot = (path) => path.startsWith("/") ? path : "/" + path

let ensureProtocol = (protocol) => protocol.endsWith(":") ? protocol : protocol + ":"

let ensureQs = (qs) => qs
  ? qs.startsWith("?") ? qs : "?" + qs
  : ""

let ensureHash = (hash) => hash
  ? hash.startsWith("#") ? hash : "#" + hash
  : ""

let protocol = (url) => {
  return parse(url).protocol
}

let auth = (url) => {
  return parse(url).auth
}

let host = (url) => {
  return parse(url).host
}

let hostname = (url) => {
  return parse(url).hostname
}

let port = (url) => {
  return parse(url).port
}

let search = (url) => {
  return parse(url).search
}

let query = (url) => {
  return parse(url).query
}

let path = (url) => {
  return parse(url).path
}

let pathname = (url) => {
  return parse(url).pathname
}

let relHref = (url) => {
  let obj = parse(url)
  return obj.path + (obj.hash || "")
}

let withProtocol = R.curry((protocol, url) => {
  // Abs. URL is assumed
  let obj = parse(url)
  obj.protocol = ensureProtocol(protocol)
  obj.hostname = obj.hostname || "localhost" // polyfill hostname
  obj.pathname = ensureRoot(obj.pathname)
  return format(obj)
})

let withAuth = R.curry((auth, url) => {
  // Abs. URL is assumed
  let obj = parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.hostname = obj.hostname || "localhost" // polyfill hostname
  obj.auth = auth
  obj.pathname = ensureRoot(obj.pathname)
  return format(obj)
})

let withHost = R.curry((host, url) => {
  // Abs. URL is assumed
  let obj = parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.host = host
  delete obj.hostname // drop hostname
  delete obj.port     // drop port
  obj.pathname = ensureRoot(obj.pathname)
  return format(obj)
})

let withHostname = R.curry((hostname, url) => {
  // Abs. URL is assumed
  let obj = parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.hostname = hostname
  delete obj.host
  return format(obj)
})

let withPort = R.curry((port, url) => {
  // Abs. URL is assumed
  let obj = parse(url)
  obj.protocol = obj.protocol || "http:" // polyfill protocol
  obj.hostname = obj.hostname || "localhost" // polyfill hostname
  obj.port = port
  delete obj.host
  return format(obj)
})

let withQs = R.curry((qs, url) => {
  let obj = parse(url)
  obj.search = ensureQs(qs)
  delete obj.path
  return format(obj)
})

let withQuery = R.curry((query, url) => {
  let obj = U.parse(url)
  obj.search = R.pipe(
    R.merge(QS.parse(obj.query)),
    R.filter(R.notNil),
    QS.stringify,
    ensureQs
  )(query)
  delete obj.path
  return format(obj)
})

let withHash = R.curry((hash, url) => {
  let obj = parse(url)
  obj.hash = ensureHash(hash)
  return format(obj)
})

let withPathname = R.curry((pathname, url) => {
  let obj = parse(url)
  obj.pathname = obj.path.startsWith("/")
    ? ensureRoot(pathname)
    : pathname
  delete obj.path
  return format(obj)
})

let urlType = (url) => {
  let obj = parse(url)
  if (obj.protocol) {
    return "absolute"
  } else if (obj.path.startsWith("/")) {
    return "root-relative"
  } else {
    return "relative"
  }
}

let isAbsolute = (url) => {
  return urlType(url) == "absolute"
}

let isRootRelative = (url) => {
  return urlType(url) == "root-relative"
}

let isRelative = (url) => {
  return urlType(url) != "absolute" // "root-relative" IS relative as well
}

let join = (...xs) => {
  return R.reduce2((z, x, i) => {
    return i > 0
      ? (x.startsWith("?") || x.startsWith("#")) ? (z + x) : (z + "/" + x)
      : x
  }, "", xs)
}

let normalize = (url) => {
  let obj = U.parse(url)
  obj.pathname = P.normalize(obj.pathname)
  delete obj.path
  return format(obj)
}

let relative = R.curry((url1, url2) => {
  let obj1 = U.parse(url1)
  let obj2 = U.parse(url2)
  if (obj1.host == obj2.host) {
    return P.relative(obj1.pathname, obj2.pathname)
  } else {
    return null
  }
})

let equals = (url1, url2) => {
  let u1 = U.parse(url1)
  let u2 = U.parse(url2)
  let q1 = QS.parse(u1.query)
  let q2 = QS.parse(u2.query)
  return u1.hostname == u2.hostname
    && (u1.port || 80) == (u2.port || 80)
    && u1.pathname == u2.pathname
    && R.equals(q1, q2)
}

export default {
  parse,
  format,
  resolve,
  domainToASCII,
  domainToUnicode,

  dir,
  splitDirs,
  base,
  name,
  ext,
  leftDirs,
  rightDirs,
  leftDir,
  rightDir,

  addLeftDir,
  addRightDir,
  dropLeftDir,
  dropRightDir,
  withLeftDir,
  withRightDir,

  withDir,
  withBase,
  withName,
  withExt,
  dropBase,
  dropExt,
  ensureRoot,
  ensureProtocol,
  ensureQs,
  ensureHash,
  auth,
  protocol,
  host,
  hostname,
  port,
  search,
  query,
  path,
  pathname,
  relHref,
  withProtocol,
  withAuth,
  withHost,
  withHostname,
  withPort,
  withHash,
  withQs,
  withQuery,
  withPathname,

  urlType,
  isAbsolute,
  isRootRelative,
  isRelative,

  join,
  normalize,
  relative,
  equals
}
