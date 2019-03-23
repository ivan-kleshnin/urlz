"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var R = _interopRequireWildcard(require("@paqmind/ramdax"));

var _url = _interopRequireDefault(require("url"));

var _querystring = _interopRequireDefault(require("querystring"));

var _browser = _interopRequireDefault(require("pathz/lib/browser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Notes:
 *   obj.host has priority over obj.hostname + obj.port and obj.href
 *   but
 *   obj.pathname + obj.search have priority over obj.path and obj.href
 */
R.reduce2 = R.addIndex(R.reduce);

var parsing = function parsing(fn) {
  return function (url) {
    var obj = _url.default.parse(url);

    return fn(obj.pathname);
  };
};

var parsing1 = function parsing1(fn) {
  return R.curry(function (x, url) {
    var obj = _url.default.parse(url);

    return fn(x, obj.pathname);
  });
};

var parsingAndFormatting = function parsingAndFormatting(fn) {
  return R.curry(function (url) {
    var obj = _url.default.parse(url);

    obj.pathname = fn(obj.pathname);
    return _url.default.format(obj);
  });
};

var parsingAndFormatting1 = function parsingAndFormatting1(fn) {
  return R.curry(function (x, url) {
    var obj = _url.default.parse(url);

    obj.pathname = fn(x, obj.pathname);
    return _url.default.format(obj);
  });
}; // API =============================================================================================


var parse = function parse(url) {
  var obj = _url.default.parse(url);

  obj.origin = (obj.protocol ? obj.protocol + "//" : "") + obj.host;
  obj.relHref = obj.path + (obj.hash || "");
  return obj;
};

var format = _url.default.format;
var resolve = _url.default.resolve;
var domainToASCII = _url.default.domainToASCII;
var domainToUnicode = _url.default.domainToUnicode;
var dir = parsing(_browser.default.dir);
var splitDirs = parsing(_browser.default.splitDirs);
var base = parsing(_browser.default.base);
var name = parsing(_browser.default.name);
var ext = parsing(_browser.default.ext);
var leftDirs = parsing1(_browser.default.leftDirs);
var rightDirs = parsing1(_browser.default.rightDirs);
var leftDir = parsing(_browser.default.leftDir);
var rightDir = parsing(_browser.default.rightDir);
var addLeftDir = parsingAndFormatting1(_browser.default.addLeftDir);
var addRightDir = parsingAndFormatting1(_browser.default.addRightDir);
var dropLeftDir = parsingAndFormatting(_browser.default.dropLeftDir);
var dropRightDir = parsingAndFormatting(_browser.default.dropRightDir);
var withLeftDir = parsingAndFormatting1(_browser.default.withLeftDir);
var withRightDir = parsingAndFormatting1(_browser.default.withRightDir);
var withDir = parsingAndFormatting1(_browser.default.withDir);
var withBase = parsingAndFormatting1(_browser.default.withBase);
var withName = parsingAndFormatting1(_browser.default.withName);
var withExt = parsingAndFormatting1(_browser.default.withExt);
var dropBase = parsingAndFormatting(_browser.default.dropBase);
var dropExt = parsingAndFormatting(_browser.default.dropExt);

var ensureRoot = function ensureRoot(path) {
  return path.startsWith("/") ? path : "/" + path;
};

var ensureProtocol = function ensureProtocol(protocol) {
  return protocol.endsWith(":") ? protocol : protocol + ":";
};

var ensureQs = function ensureQs(qs) {
  return qs ? qs.startsWith("?") ? qs : "?" + qs : "";
};

var ensureHash = function ensureHash(hash) {
  return hash ? hash.startsWith("#") ? hash : "#" + hash : "";
};

var protocol = function protocol(url) {
  return parse(url).protocol;
};

var auth = function auth(url) {
  return parse(url).auth;
};

var host = function host(url) {
  return parse(url).host;
};

var hostname = function hostname(url) {
  return parse(url).hostname;
};

var port = function port(url) {
  return parse(url).port;
};

var search = function search(url) {
  return parse(url).search;
};

var query = function query(url) {
  return parse(url).query;
};

var path = function path(url) {
  return parse(url).path;
};

var pathname = function pathname(url) {
  return parse(url).pathname;
};

var relHref = function relHref(url) {
  var obj = parse(url);
  return obj.path + (obj.hash || "");
};

var withProtocol = R.curry(function (protocol, url) {
  // Abs. URL is assumed
  var obj = parse(url);
  obj.protocol = ensureProtocol(protocol);
  obj.hostname = obj.hostname || "localhost"; // polyfill hostname

  obj.pathname = ensureRoot(obj.pathname);
  return format(obj);
});
var withAuth = R.curry(function (auth, url) {
  // Abs. URL is assumed
  var obj = parse(url);
  obj.protocol = obj.protocol || "http:"; // polyfill protocol

  obj.hostname = obj.hostname || "localhost"; // polyfill hostname

  obj.auth = auth;
  obj.pathname = ensureRoot(obj.pathname);
  return format(obj);
});
var withHost = R.curry(function (host, url) {
  // Abs. URL is assumed
  var obj = parse(url);
  obj.protocol = obj.protocol || "http:"; // polyfill protocol

  obj.host = host;
  delete obj.hostname; // drop hostname

  delete obj.port; // drop port

  obj.pathname = ensureRoot(obj.pathname);
  return format(obj);
});
var withHostname = R.curry(function (hostname, url) {
  // Abs. URL is assumed
  var obj = parse(url);
  obj.protocol = obj.protocol || "http:"; // polyfill protocol

  obj.hostname = hostname;
  delete obj.host;
  return format(obj);
});
var withPort = R.curry(function (port, url) {
  // Abs. URL is assumed
  var obj = parse(url);
  obj.protocol = obj.protocol || "http:"; // polyfill protocol

  obj.hostname = obj.hostname || "localhost"; // polyfill hostname

  obj.port = port;
  delete obj.host;
  return format(obj);
});
var withQs = R.curry(function (qs, url) {
  var obj = parse(url);
  obj.search = ensureQs(qs);
  delete obj.path;
  return format(obj);
});
var withQuery = R.curry(function (query, url) {
  var obj = _url.default.parse(url);

  obj.search = R.pipe(R.merge(_querystring.default.parse(obj.query)), R.filter(R.notNil), _querystring.default.stringify, ensureQs)(query);
  delete obj.path;
  return format(obj);
});
var withHash = R.curry(function (hash, url) {
  var obj = parse(url);
  obj.hash = ensureHash(hash);
  return format(obj);
});
var withPathname = R.curry(function (pathname, url) {
  var obj = parse(url);
  obj.pathname = obj.path.startsWith("/") ? ensureRoot(pathname) : pathname;
  delete obj.path;
  return format(obj);
});

var urlType = function urlType(url) {
  var obj = parse(url);

  if (obj.protocol) {
    return "absolute";
  } else if (obj.path.startsWith("/")) {
    return "root-relative";
  } else {
    return "relative";
  }
};

var isAbsolute = function isAbsolute(url) {
  return urlType(url) == "absolute";
};

var isRootRelative = function isRootRelative(url) {
  return urlType(url) == "root-relative";
};

var isRelative = function isRelative(url) {
  return urlType(url) != "absolute"; // "root-relative" IS relative as well
};

var join = function join() {
  for (var _len = arguments.length, xs = new Array(_len), _key = 0; _key < _len; _key++) {
    xs[_key] = arguments[_key];
  }

  return R.reduce2(function (z, x, i) {
    return i > 0 ? x.startsWith("?") || x.startsWith("#") ? z + x : z + "/" + x : x;
  }, "", xs);
};

var normalize = function normalize(url) {
  var obj = _url.default.parse(url);

  obj.pathname = _browser.default.normalize(obj.pathname);
  delete obj.path;
  return format(obj);
};

var relative = R.curry(function (url1, url2) {
  var obj1 = _url.default.parse(url1);

  var obj2 = _url.default.parse(url2);

  if (obj1.host == obj2.host) {
    return _browser.default.relative(obj1.pathname, obj2.pathname);
  } else {
    return null;
  }
});

var equals = function equals(url1, url2) {
  var u1 = _url.default.parse(url1);

  var u2 = _url.default.parse(url2);

  var q1 = _querystring.default.parse(u1.query);

  var q2 = _querystring.default.parse(u2.query);

  return u1.hostname == u2.hostname && (u1.port || 80) == (u2.port || 80) && u1.pathname == u2.pathname && R.equals(q1, q2);
};

var _default = {
  parse: parse,
  format: format,
  resolve: resolve,
  domainToASCII: domainToASCII,
  domainToUnicode: domainToUnicode,
  dir: dir,
  splitDirs: splitDirs,
  base: base,
  name: name,
  ext: ext,
  leftDirs: leftDirs,
  rightDirs: rightDirs,
  leftDir: leftDir,
  rightDir: rightDir,
  addLeftDir: addLeftDir,
  addRightDir: addRightDir,
  dropLeftDir: dropLeftDir,
  dropRightDir: dropRightDir,
  withLeftDir: withLeftDir,
  withRightDir: withRightDir,
  withDir: withDir,
  withBase: withBase,
  withName: withName,
  withExt: withExt,
  dropBase: dropBase,
  dropExt: dropExt,
  ensureRoot: ensureRoot,
  ensureProtocol: ensureProtocol,
  ensureQs: ensureQs,
  ensureHash: ensureHash,
  auth: auth,
  protocol: protocol,
  host: host,
  hostname: hostname,
  port: port,
  search: search,
  query: query,
  path: path,
  pathname: pathname,
  relHref: relHref,
  withProtocol: withProtocol,
  withAuth: withAuth,
  withHost: withHost,
  withHostname: withHostname,
  withPort: withPort,
  withHash: withHash,
  withQs: withQs,
  withQuery: withQuery,
  withPathname: withPathname,
  urlType: urlType,
  isAbsolute: isAbsolute,
  isRootRelative: isRootRelative,
  isRelative: isRelative,
  join: join,
  normalize: normalize,
  relative: relative,
  equals: equals
};
exports.default = _default;
