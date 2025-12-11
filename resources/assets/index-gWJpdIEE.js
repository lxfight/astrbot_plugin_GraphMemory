const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/ToolsPanel-BEKbfd8F.js",
      "assets/ToolsPanel-DUS-A2G7.css",
      "assets/LinkPanel-D4oBTstd.js",
      "assets/LinkPanel-CeeJ9b0q.css",
      "assets/ConnectPanel-DGmUDZX6.js",
      "assets/ConnectPanel-3-PBhHvS.css",
      "assets/MonitorPanel-Bf8KqZ1x.js",
      "assets/MonitorPanel-BOGj3a54.css",
      "assets/DebugPanel-BvMLjHdi.js",
      "assets/DebugPanel-BDr8aIK3.css",
    ])
) => i.map((i) => d[i]);
/**
 * @vue/shared v3.5.25
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/
function e(t) {
  const e = Object.create(null);
  for (const n of t.split(",")) e[n] = 1;
  return (t) => t in e;
}
!(function () {
  const t = document.createElement("link").relList;
  if (!(t && t.supports && t.supports("modulepreload"))) {
    for (const t of document.querySelectorAll('link[rel="modulepreload"]'))
      e(t);
    new MutationObserver((t) => {
      for (const n of t)
        if ("childList" === n.type)
          for (const t of n.addedNodes)
            "LINK" === t.tagName && "modulepreload" === t.rel && e(t);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function e(t) {
    if (t.ep) return;
    t.ep = !0;
    const e = (function (t) {
      const e = {};
      return (
        t.integrity && (e.integrity = t.integrity),
        t.referrerPolicy && (e.referrerPolicy = t.referrerPolicy),
        "use-credentials" === t.crossOrigin
          ? (e.credentials = "include")
          : "anonymous" === t.crossOrigin
          ? (e.credentials = "omit")
          : (e.credentials = "same-origin"),
        e
      );
    })(t);
    fetch(t.href, e);
  }
})();
const n = {},
  r = [],
  o = () => {},
  i = () => !1,
  s = (t) =>
    111 === t.charCodeAt(0) &&
    110 === t.charCodeAt(1) &&
    (t.charCodeAt(2) > 122 || t.charCodeAt(2) < 97),
  a = (t) => t.startsWith("onUpdate:"),
  l = Object.assign,
  u = (t, e) => {
    const n = t.indexOf(e);
    n > -1 && t.splice(n, 1);
  },
  c = Object.prototype.hasOwnProperty,
  f = (t, e) => c.call(t, e),
  h = Array.isArray,
  d = (t) => "[object Map]" === x(t),
  p = (t) => "[object Set]" === x(t),
  g = (t) => "[object Date]" === x(t),
  v = (t) => "function" == typeof t,
  y = (t) => "string" == typeof t,
  m = (t) => "symbol" == typeof t,
  _ = (t) => null !== t && "object" == typeof t,
  b = (t) => (_(t) || v(t)) && v(t.then) && v(t.catch),
  w = Object.prototype.toString,
  x = (t) => w.call(t),
  k = (t) => "[object Object]" === x(t),
  S = (t) => y(t) && "NaN" !== t && "-" !== t[0] && "" + parseInt(t, 10) === t,
  E = e(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  ),
  C = (t) => {
    const e = Object.create(null);
    return (n) => e[n] || (e[n] = t(n));
  },
  A = /-\w/g,
  O = C((t) => t.replace(A, (t) => t.slice(1).toUpperCase())),
  T = /\B([A-Z])/g,
  N = C((t) => t.replace(T, "-$1").toLowerCase()),
  P = C((t) => t.charAt(0).toUpperCase() + t.slice(1)),
  M = C((t) => (t ? `on${P(t)}` : "")),
  R = (t, e) => !Object.is(t, e),
  j = (t, ...e) => {
    for (let n = 0; n < t.length; n++) t[n](...e);
  },
  z = (t, e, n, r = !1) => {
    Object.defineProperty(t, e, {
      configurable: !0,
      enumerable: !1,
      writable: r,
      value: n,
    });
  },
  D = (t) => {
    const e = parseFloat(t);
    return isNaN(e) ? t : e;
  };
let I;
const L = () =>
  I ||
  (I =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof self
      ? self
      : "undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : {});
function U(t) {
  if (h(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) {
      const r = t[n],
        o = y(r) ? V(r) : U(r);
      if (o) for (const t in o) e[t] = o[t];
    }
    return e;
  }
  if (y(t) || _(t)) return t;
}
const F = /;(?![^(]*\))/g,
  B = /:([^]+)/,
  $ = /\/\*[^]*?\*\//g;
function V(t) {
  const e = {};
  return (
    t
      .replace($, "")
      .split(F)
      .forEach((t) => {
        if (t) {
          const n = t.split(B);
          n.length > 1 && (e[n[0].trim()] = n[1].trim());
        }
      }),
    e
  );
}
function q(t) {
  let e = "";
  if (y(t)) e = t;
  else if (h(t))
    for (let n = 0; n < t.length; n++) {
      const r = q(t[n]);
      r && (e += r + " ");
    }
  else if (_(t)) for (const n in t) t[n] && (e += n + " ");
  return e.trim();
}
const H = e(
  "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly"
);
function G(t) {
  return !!t || "" === t;
}
function W(t, e) {
  if (t === e) return !0;
  let n = g(t),
    r = g(e);
  if (n || r) return !(!n || !r) && t.getTime() === e.getTime();
  if (((n = m(t)), (r = m(e)), n || r)) return t === e;
  if (((n = h(t)), (r = h(e)), n || r))
    return (
      !(!n || !r) &&
      (function (t, e) {
        if (t.length !== e.length) return !1;
        let n = !0;
        for (let r = 0; n && r < t.length; r++) n = W(t[r], e[r]);
        return n;
      })(t, e)
    );
  if (((n = _(t)), (r = _(e)), n || r)) {
    if (!n || !r) return !1;
    if (Object.keys(t).length !== Object.keys(e).length) return !1;
    for (const n in t) {
      const r = t.hasOwnProperty(n),
        o = e.hasOwnProperty(n);
      if ((r && !o) || (!r && o) || !W(t[n], e[n])) return !1;
    }
  }
  return String(t) === String(e);
}
function X(t, e) {
  return t.findIndex((t) => W(t, e));
}
const Y = (t) => !(!t || !0 !== t.__v_isRef),
  J = (t) =>
    y(t)
      ? t
      : null == t
      ? ""
      : h(t) || (_(t) && (t.toString === w || !v(t.toString)))
      ? Y(t)
        ? J(t.value)
        : JSON.stringify(t, K, 2)
      : String(t),
  K = (t, e) =>
    Y(e)
      ? K(t, e.value)
      : d(e)
      ? {
          [`Map(${e.size})`]: [...e.entries()].reduce(
            (t, [e, n], r) => ((t[Z(e, r) + " =>"] = n), t),
            {}
          ),
        }
      : p(e)
      ? { [`Set(${e.size})`]: [...e.values()].map((t) => Z(t)) }
      : m(e)
      ? Z(e)
      : !_(e) || h(e) || k(e)
      ? e
      : String(e),
  Z = (t, e = "") => {
    var n;
    return m(t) ? `Symbol(${null != (n = t.description) ? n : e})` : t;
  };
/**
 * @vue/reactivity v3.5.25
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/
let Q, tt;
class et {
  constructor(t = !1) {
    (this.detached = t),
      (this._active = !0),
      (this._on = 0),
      (this.effects = []),
      (this.cleanups = []),
      (this._isPaused = !1),
      (this.parent = Q),
      !t && Q && (this.index = (Q.scopes || (Q.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      let t, e;
      if (((this._isPaused = !0), this.scopes))
        for (t = 0, e = this.scopes.length; t < e; t++) this.scopes[t].pause();
      for (t = 0, e = this.effects.length; t < e; t++) this.effects[t].pause();
    }
  }
  resume() {
    if (this._active && this._isPaused) {
      let t, e;
      if (((this._isPaused = !1), this.scopes))
        for (t = 0, e = this.scopes.length; t < e; t++) this.scopes[t].resume();
      for (t = 0, e = this.effects.length; t < e; t++) this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const e = Q;
      try {
        return (Q = this), t();
      } finally {
        Q = e;
      }
    }
  }
  on() {
    1 === ++this._on && ((this.prevScope = Q), (Q = this));
  }
  off() {
    this._on > 0 &&
      0 === --this._on &&
      ((Q = this.prevScope), (this.prevScope = void 0));
  }
  stop(t) {
    if (this._active) {
      let e, n;
      for (this._active = !1, e = 0, n = this.effects.length; e < n; e++)
        this.effects[e].stop();
      for (this.effects.length = 0, e = 0, n = this.cleanups.length; e < n; e++)
        this.cleanups[e]();
      if (((this.cleanups.length = 0), this.scopes)) {
        for (e = 0, n = this.scopes.length; e < n; e++) this.scopes[e].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const t = this.parent.scopes.pop();
        t &&
          t !== this &&
          ((this.parent.scopes[this.index] = t), (t.index = this.index));
      }
      this.parent = void 0;
    }
  }
}
function nt(t) {
  return new et(t);
}
function rt() {
  return Q;
}
const ot = new WeakSet();
class it {
  constructor(t) {
    (this.fn = t),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 5),
      (this.next = void 0),
      (this.cleanup = void 0),
      (this.scheduler = void 0),
      Q && Q.active && Q.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    64 & this.flags &&
      ((this.flags &= -65), ot.has(this) && (ot.delete(this), this.trigger()));
  }
  notify() {
    (2 & this.flags && !(32 & this.flags)) || 8 & this.flags || ut(this);
  }
  run() {
    if (!(1 & this.flags)) return this.fn();
    (this.flags |= 2), xt(this), ht(this);
    const t = tt,
      e = mt;
    (tt = this), (mt = !0);
    try {
      return this.fn();
    } finally {
      dt(this), (tt = t), (mt = e), (this.flags &= -3);
    }
  }
  stop() {
    if (1 & this.flags) {
      for (let t = this.deps; t; t = t.nextDep) vt(t);
      (this.deps = this.depsTail = void 0),
        xt(this),
        this.onStop && this.onStop(),
        (this.flags &= -2);
    }
  }
  trigger() {
    64 & this.flags
      ? ot.add(this)
      : this.scheduler
      ? this.scheduler()
      : this.runIfDirty();
  }
  runIfDirty() {
    pt(this) && this.run();
  }
  get dirty() {
    return pt(this);
  }
}
let st,
  at,
  lt = 0;
function ut(t, e = !1) {
  if (((t.flags |= 8), e)) return (t.next = at), void (at = t);
  (t.next = st), (st = t);
}
function ct() {
  lt++;
}
function ft() {
  if (--lt > 0) return;
  if (at) {
    let t = at;
    for (at = void 0; t; ) {
      const e = t.next;
      (t.next = void 0), (t.flags &= -9), (t = e);
    }
  }
  let t;
  for (; st; ) {
    let n = st;
    for (st = void 0; n; ) {
      const r = n.next;
      if (((n.next = void 0), (n.flags &= -9), 1 & n.flags))
        try {
          n.trigger();
        } catch (e) {
          t || (t = e);
        }
      n = r;
    }
  }
  if (t) throw t;
}
function ht(t) {
  for (let e = t.deps; e; e = e.nextDep)
    (e.version = -1),
      (e.prevActiveLink = e.dep.activeLink),
      (e.dep.activeLink = e);
}
function dt(t) {
  let e,
    n = t.depsTail,
    r = n;
  for (; r; ) {
    const t = r.prevDep;
    -1 === r.version ? (r === n && (n = t), vt(r), yt(r)) : (e = r),
      (r.dep.activeLink = r.prevActiveLink),
      (r.prevActiveLink = void 0),
      (r = t);
  }
  (t.deps = e), (t.depsTail = n);
}
function pt(t) {
  for (let e = t.deps; e; e = e.nextDep)
    if (
      e.dep.version !== e.version ||
      (e.dep.computed && (gt(e.dep.computed) || e.dep.version !== e.version))
    )
      return !0;
  return !!t._dirty;
}
function gt(t) {
  if (4 & t.flags && !(16 & t.flags)) return;
  if (((t.flags &= -17), t.globalVersion === kt)) return;
  if (
    ((t.globalVersion = kt),
    !t.isSSR && 128 & t.flags && ((!t.deps && !t._dirty) || !pt(t)))
  )
    return;
  t.flags |= 2;
  const e = t.dep,
    n = tt,
    r = mt;
  (tt = t), (mt = !0);
  try {
    ht(t);
    const n = t.fn(t._value);
    (0 === e.version || R(n, t._value)) &&
      ((t.flags |= 128), (t._value = n), e.version++);
  } catch (o) {
    throw (e.version++, o);
  } finally {
    (tt = n), (mt = r), dt(t), (t.flags &= -3);
  }
}
function vt(t, e = !1) {
  const { dep: n, prevSub: r, nextSub: o } = t;
  if (
    (r && ((r.nextSub = o), (t.prevSub = void 0)),
    o && ((o.prevSub = r), (t.nextSub = void 0)),
    n.subs === t && ((n.subs = r), !r && n.computed))
  ) {
    n.computed.flags &= -5;
    for (let t = n.computed.deps; t; t = t.nextDep) vt(t, !0);
  }
  e || --n.sc || !n.map || n.map.delete(n.key);
}
function yt(t) {
  const { prevDep: e, nextDep: n } = t;
  e && ((e.nextDep = n), (t.prevDep = void 0)),
    n && ((n.prevDep = e), (t.nextDep = void 0));
}
let mt = !0;
const _t = [];
function bt() {
  _t.push(mt), (mt = !1);
}
function wt() {
  const t = _t.pop();
  mt = void 0 === t || t;
}
function xt(t) {
  const { cleanup: e } = t;
  if (((t.cleanup = void 0), e)) {
    const t = tt;
    tt = void 0;
    try {
      e();
    } finally {
      tt = t;
    }
  }
}
let kt = 0;
class St {
  constructor(t, e) {
    (this.sub = t),
      (this.dep = e),
      (this.version = e.version),
      (this.nextDep =
        this.prevDep =
        this.nextSub =
        this.prevSub =
        this.prevActiveLink =
          void 0);
  }
}
class Et {
  constructor(t) {
    (this.computed = t),
      (this.version = 0),
      (this.activeLink = void 0),
      (this.subs = void 0),
      (this.map = void 0),
      (this.key = void 0),
      (this.sc = 0),
      (this.__v_skip = !0);
  }
  track(t) {
    if (!tt || !mt || tt === this.computed) return;
    let e = this.activeLink;
    if (void 0 === e || e.sub !== tt)
      (e = this.activeLink = new St(tt, this)),
        tt.deps
          ? ((e.prevDep = tt.depsTail),
            (tt.depsTail.nextDep = e),
            (tt.depsTail = e))
          : (tt.deps = tt.depsTail = e),
        Ct(e);
    else if (-1 === e.version && ((e.version = this.version), e.nextDep)) {
      const t = e.nextDep;
      (t.prevDep = e.prevDep),
        e.prevDep && (e.prevDep.nextDep = t),
        (e.prevDep = tt.depsTail),
        (e.nextDep = void 0),
        (tt.depsTail.nextDep = e),
        (tt.depsTail = e),
        tt.deps === e && (tt.deps = t);
    }
    return e;
  }
  trigger(t) {
    this.version++, kt++, this.notify(t);
  }
  notify(t) {
    ct();
    try {
      0;
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      ft();
    }
  }
}
function Ct(t) {
  if ((t.dep.sc++, 4 & t.sub.flags)) {
    const e = t.dep.computed;
    if (e && !t.dep.subs) {
      e.flags |= 20;
      for (let t = e.deps; t; t = t.nextDep) Ct(t);
    }
    const n = t.dep.subs;
    n !== t && ((t.prevSub = n), n && (n.nextSub = t)), (t.dep.subs = t);
  }
}
const At = new WeakMap(),
  Ot = Symbol(""),
  Tt = Symbol(""),
  Nt = Symbol("");
function Pt(t, e, n) {
  if (mt && tt) {
    let e = At.get(t);
    e || At.set(t, (e = new Map()));
    let r = e.get(n);
    r || (e.set(n, (r = new Et())), (r.map = e), (r.key = n)), r.track();
  }
}
function Mt(t, e, n, r, o, i) {
  const s = At.get(t);
  if (!s) return void kt++;
  const a = (t) => {
    t && t.trigger();
  };
  if ((ct(), "clear" === e)) s.forEach(a);
  else {
    const o = h(t),
      i = o && S(n);
    if (o && "length" === n) {
      const t = Number(r);
      s.forEach((e, n) => {
        ("length" === n || n === Nt || (!m(n) && n >= t)) && a(e);
      });
    } else
      switch (
        ((void 0 !== n || s.has(void 0)) && a(s.get(n)), i && a(s.get(Nt)), e)
      ) {
        case "add":
          o ? i && a(s.get("length")) : (a(s.get(Ot)), d(t) && a(s.get(Tt)));
          break;
        case "delete":
          o || (a(s.get(Ot)), d(t) && a(s.get(Tt)));
          break;
        case "set":
          d(t) && a(s.get(Ot));
      }
  }
  ft();
}
function Rt(t) {
  const e = _e(t);
  return e === t ? e : (Pt(e, 0, Nt), ye(t) ? e : e.map(we));
}
function jt(t) {
  return Pt((t = _e(t)), 0, Nt), t;
}
function zt(t, e) {
  return ve(t) ? (ge(t) ? xe(we(e)) : xe(e)) : we(e);
}
const Dt = {
  __proto__: null,
  [Symbol.iterator]() {
    return It(this, Symbol.iterator, (t) => zt(this, t));
  },
  concat(...t) {
    return Rt(this).concat(...t.map((t) => (h(t) ? Rt(t) : t)));
  },
  entries() {
    return It(this, "entries", (t) => ((t[1] = zt(this, t[1])), t));
  },
  every(t, e) {
    return Ut(this, "every", t, e, void 0, arguments);
  },
  filter(t, e) {
    return Ut(
      this,
      "filter",
      t,
      e,
      (t) => t.map((t) => zt(this, t)),
      arguments
    );
  },
  find(t, e) {
    return Ut(this, "find", t, e, (t) => zt(this, t), arguments);
  },
  findIndex(t, e) {
    return Ut(this, "findIndex", t, e, void 0, arguments);
  },
  findLast(t, e) {
    return Ut(this, "findLast", t, e, (t) => zt(this, t), arguments);
  },
  findLastIndex(t, e) {
    return Ut(this, "findLastIndex", t, e, void 0, arguments);
  },
  forEach(t, e) {
    return Ut(this, "forEach", t, e, void 0, arguments);
  },
  includes(...t) {
    return Bt(this, "includes", t);
  },
  indexOf(...t) {
    return Bt(this, "indexOf", t);
  },
  join(t) {
    return Rt(this).join(t);
  },
  lastIndexOf(...t) {
    return Bt(this, "lastIndexOf", t);
  },
  map(t, e) {
    return Ut(this, "map", t, e, void 0, arguments);
  },
  pop() {
    return $t(this, "pop");
  },
  push(...t) {
    return $t(this, "push", t);
  },
  reduce(t, ...e) {
    return Ft(this, "reduce", t, e);
  },
  reduceRight(t, ...e) {
    return Ft(this, "reduceRight", t, e);
  },
  shift() {
    return $t(this, "shift");
  },
  some(t, e) {
    return Ut(this, "some", t, e, void 0, arguments);
  },
  splice(...t) {
    return $t(this, "splice", t);
  },
  toReversed() {
    return Rt(this).toReversed();
  },
  toSorted(t) {
    return Rt(this).toSorted(t);
  },
  toSpliced(...t) {
    return Rt(this).toSpliced(...t);
  },
  unshift(...t) {
    return $t(this, "unshift", t);
  },
  values() {
    return It(this, "values", (t) => zt(this, t));
  },
};
function It(t, e, n) {
  const r = jt(t),
    o = r[e]();
  return (
    r === t ||
      ye(t) ||
      ((o._next = o.next),
      (o.next = () => {
        const t = o._next();
        return t.done || (t.value = n(t.value)), t;
      })),
    o
  );
}
const Lt = Array.prototype;
function Ut(t, e, n, r, o, i) {
  const s = jt(t),
    a = s !== t && !ye(t),
    l = s[e];
  if (l !== Lt[e]) {
    const e = l.apply(t, i);
    return a ? we(e) : e;
  }
  let u = n;
  s !== t &&
    (a
      ? (u = function (e, r) {
          return n.call(this, zt(t, e), r, t);
        })
      : n.length > 2 &&
        (u = function (e, r) {
          return n.call(this, e, r, t);
        }));
  const c = l.call(s, u, r);
  return a && o ? o(c) : c;
}
function Ft(t, e, n, r) {
  const o = jt(t);
  let i = n;
  return (
    o !== t &&
      (ye(t)
        ? n.length > 3 &&
          (i = function (e, r, o) {
            return n.call(this, e, r, o, t);
          })
        : (i = function (e, r, o) {
            return n.call(this, e, zt(t, r), o, t);
          })),
    o[e](i, ...r)
  );
}
function Bt(t, e, n) {
  const r = _e(t);
  Pt(r, 0, Nt);
  const o = r[e](...n);
  return (-1 !== o && !1 !== o) || !me(n[0])
    ? o
    : ((n[0] = _e(n[0])), r[e](...n));
}
function $t(t, e, n = []) {
  bt(), ct();
  const r = _e(t)[e].apply(t, n);
  return ft(), wt(), r;
}
const Vt = e("__proto__,__v_isRef,__isVue"),
  qt = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((t) => "arguments" !== t && "caller" !== t)
      .map((t) => Symbol[t])
      .filter(m)
  );
function Ht(t) {
  m(t) || (t = String(t));
  const e = _e(this);
  return Pt(e, 0, t), e.hasOwnProperty(t);
}
class Gt {
  constructor(t = !1, e = !1) {
    (this._isReadonly = t), (this._isShallow = e);
  }
  get(t, e, n) {
    if ("__v_skip" === e) return t.__v_skip;
    const r = this._isReadonly,
      o = this._isShallow;
    if ("__v_isReactive" === e) return !r;
    if ("__v_isReadonly" === e) return r;
    if ("__v_isShallow" === e) return o;
    if ("__v_raw" === e)
      return n === (r ? (o ? ue : le) : o ? ae : se).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(n)
        ? t
        : void 0;
    const i = h(t);
    if (!r) {
      let t;
      if (i && (t = Dt[e])) return t;
      if ("hasOwnProperty" === e) return Ht;
    }
    const s = Reflect.get(t, e, ke(t) ? t : n);
    if (m(e) ? qt.has(e) : Vt(e)) return s;
    if ((r || Pt(t, 0, e), o)) return s;
    if (ke(s)) {
      const t = i && S(e) ? s : s.value;
      return r && _(t) ? de(t) : t;
    }
    return _(s) ? (r ? de(s) : fe(s)) : s;
  }
}
class Wt extends Gt {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, e, n, r) {
    let o = t[e];
    const i = h(t) && S(e);
    if (!this._isShallow) {
      const t = ve(o);
      if ((ye(n) || ve(n) || ((o = _e(o)), (n = _e(n))), !i && ke(o) && !ke(n)))
        return t || (o.value = n), !0;
    }
    const s = i ? Number(e) < t.length : f(t, e),
      a = Reflect.set(t, e, n, ke(t) ? t : r);
    return (
      t === _e(r) && (s ? R(n, o) && Mt(t, "set", e, n) : Mt(t, "add", e, n)), a
    );
  }
  deleteProperty(t, e) {
    const n = f(t, e);
    t[e];
    const r = Reflect.deleteProperty(t, e);
    return r && n && Mt(t, "delete", e, void 0), r;
  }
  has(t, e) {
    const n = Reflect.has(t, e);
    return (m(e) && qt.has(e)) || Pt(t, 0, e), n;
  }
  ownKeys(t) {
    return Pt(t, 0, h(t) ? "length" : Ot), Reflect.ownKeys(t);
  }
}
class Xt extends Gt {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, e) {
    return !0;
  }
  deleteProperty(t, e) {
    return !0;
  }
}
const Yt = new Wt(),
  Jt = new Xt(),
  Kt = new Wt(!0),
  Zt = (t) => t,
  Qt = (t) => Reflect.getPrototypeOf(t);
function te(t) {
  return function (...e) {
    return "delete" !== t && ("clear" === t ? void 0 : this);
  };
}
function ee(t, e) {
  const n = {
    get(n) {
      const r = this.__v_raw,
        o = _e(r),
        i = _e(n);
      t || (R(n, i) && Pt(o, 0, n), Pt(o, 0, i));
      const { has: s } = Qt(o),
        a = e ? Zt : t ? xe : we;
      return s.call(o, n)
        ? a(r.get(n))
        : s.call(o, i)
        ? a(r.get(i))
        : void (r !== o && r.get(n));
    },
    get size() {
      const e = this.__v_raw;
      return !t && Pt(_e(e), 0, Ot), e.size;
    },
    has(e) {
      const n = this.__v_raw,
        r = _e(n),
        o = _e(e);
      return (
        t || (R(e, o) && Pt(r, 0, e), Pt(r, 0, o)),
        e === o ? n.has(e) : n.has(e) || n.has(o)
      );
    },
    forEach(n, r) {
      const o = this,
        i = o.__v_raw,
        s = _e(i),
        a = e ? Zt : t ? xe : we;
      return !t && Pt(s, 0, Ot), i.forEach((t, e) => n.call(r, a(t), a(e), o));
    },
  };
  l(
    n,
    t
      ? {
          add: te("add"),
          set: te("set"),
          delete: te("delete"),
          clear: te("clear"),
        }
      : {
          add(t) {
            e || ye(t) || ve(t) || (t = _e(t));
            const n = _e(this);
            return Qt(n).has.call(n, t) || (n.add(t), Mt(n, "add", t, t)), this;
          },
          set(t, n) {
            e || ye(n) || ve(n) || (n = _e(n));
            const r = _e(this),
              { has: o, get: i } = Qt(r);
            let s = o.call(r, t);
            s || ((t = _e(t)), (s = o.call(r, t)));
            const a = i.call(r, t);
            return (
              r.set(t, n),
              s ? R(n, a) && Mt(r, "set", t, n) : Mt(r, "add", t, n),
              this
            );
          },
          delete(t) {
            const e = _e(this),
              { has: n, get: r } = Qt(e);
            let o = n.call(e, t);
            o || ((t = _e(t)), (o = n.call(e, t))), r && r.call(e, t);
            const i = e.delete(t);
            return o && Mt(e, "delete", t, void 0), i;
          },
          clear() {
            const t = _e(this),
              e = 0 !== t.size,
              n = t.clear();
            return e && Mt(t, "clear", void 0, void 0), n;
          },
        }
  );
  return (
    ["keys", "values", "entries", Symbol.iterator].forEach((r) => {
      n[r] = (function (t, e, n) {
        return function (...r) {
          const o = this.__v_raw,
            i = _e(o),
            s = d(i),
            a = "entries" === t || (t === Symbol.iterator && s),
            l = "keys" === t && s,
            u = o[t](...r),
            c = n ? Zt : e ? xe : we;
          return (
            !e && Pt(i, 0, l ? Tt : Ot),
            {
              next() {
                const { value: t, done: e } = u.next();
                return e
                  ? { value: t, done: e }
                  : { value: a ? [c(t[0]), c(t[1])] : c(t), done: e };
              },
              [Symbol.iterator]() {
                return this;
              },
            }
          );
        };
      })(r, t, e);
    }),
    n
  );
}
function ne(t, e) {
  const n = ee(t, e);
  return (e, r, o) =>
    "__v_isReactive" === r
      ? !t
      : "__v_isReadonly" === r
      ? t
      : "__v_raw" === r
      ? e
      : Reflect.get(f(n, r) && r in e ? n : e, r, o);
}
const re = { get: ne(!1, !1) },
  oe = { get: ne(!1, !0) },
  ie = { get: ne(!0, !1) },
  se = new WeakMap(),
  ae = new WeakMap(),
  le = new WeakMap(),
  ue = new WeakMap();
function ce(t) {
  return t.__v_skip || !Object.isExtensible(t)
    ? 0
    : (function (t) {
        switch (t) {
          case "Object":
          case "Array":
            return 1;
          case "Map":
          case "Set":
          case "WeakMap":
          case "WeakSet":
            return 2;
          default:
            return 0;
        }
      })(((t) => x(t).slice(8, -1))(t));
}
function fe(t) {
  return ve(t) ? t : pe(t, !1, Yt, re, se);
}
function he(t) {
  return pe(t, !1, Kt, oe, ae);
}
function de(t) {
  return pe(t, !0, Jt, ie, le);
}
function pe(t, e, n, r, o) {
  if (!_(t)) return t;
  if (t.__v_raw && (!e || !t.__v_isReactive)) return t;
  const i = ce(t);
  if (0 === i) return t;
  const s = o.get(t);
  if (s) return s;
  const a = new Proxy(t, 2 === i ? r : n);
  return o.set(t, a), a;
}
function ge(t) {
  return ve(t) ? ge(t.__v_raw) : !(!t || !t.__v_isReactive);
}
function ve(t) {
  return !(!t || !t.__v_isReadonly);
}
function ye(t) {
  return !(!t || !t.__v_isShallow);
}
function me(t) {
  return !!t && !!t.__v_raw;
}
function _e(t) {
  const e = t && t.__v_raw;
  return e ? _e(e) : t;
}
function be(t) {
  return !f(t, "__v_skip") && Object.isExtensible(t) && z(t, "__v_skip", !0), t;
}
const we = (t) => (_(t) ? fe(t) : t),
  xe = (t) => (_(t) ? de(t) : t);
function ke(t) {
  return !!t && !0 === t.__v_isRef;
}
function Se(t) {
  return Ee(t, !1);
}
function Ee(t, e) {
  return ke(t) ? t : new Ce(t, e);
}
class Ce {
  constructor(t, e) {
    (this.dep = new Et()),
      (this.__v_isRef = !0),
      (this.__v_isShallow = !1),
      (this._rawValue = e ? t : _e(t)),
      (this._value = e ? t : we(t)),
      (this.__v_isShallow = e);
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const e = this._rawValue,
      n = this.__v_isShallow || ye(t) || ve(t);
    (t = n ? t : _e(t)),
      R(t, e) &&
        ((this._rawValue = t),
        (this._value = n ? t : we(t)),
        this.dep.trigger());
  }
}
function Ae(t) {
  return ke(t) ? t.value : t;
}
const Oe = {
  get: (t, e, n) => ("__v_raw" === e ? t : Ae(Reflect.get(t, e, n))),
  set: (t, e, n, r) => {
    const o = t[e];
    return ke(o) && !ke(n) ? ((o.value = n), !0) : Reflect.set(t, e, n, r);
  },
};
function Te(t) {
  return ge(t) ? t : new Proxy(t, Oe);
}
class Ne {
  constructor(t, e, n) {
    (this._object = t),
      (this._key = e),
      (this._defaultValue = n),
      (this.__v_isRef = !0),
      (this._value = void 0),
      (this._raw = _e(t));
    let r = !0,
      o = t;
    if (!h(t) || !S(String(e)))
      do {
        r = !me(o) || ye(o);
      } while (r && (o = o.__v_raw));
    this._shallow = r;
  }
  get value() {
    let t = this._object[this._key];
    return (
      this._shallow && (t = Ae(t)),
      (this._value = void 0 === t ? this._defaultValue : t)
    );
  }
  set value(t) {
    if (this._shallow && ke(this._raw[this._key])) {
      const e = this._object[this._key];
      if (ke(e)) return void (e.value = t);
    }
    this._object[this._key] = t;
  }
  get dep() {
    return (function (t, e) {
      const n = At.get(t);
      return n && n.get(e);
    })(this._raw, this._key);
  }
}
function Pe(t, e, n) {
  return new Ne(t, e, n);
}
class Me {
  constructor(t, e, n) {
    (this.fn = t),
      (this.setter = e),
      (this._value = void 0),
      (this.dep = new Et(this)),
      (this.__v_isRef = !0),
      (this.deps = void 0),
      (this.depsTail = void 0),
      (this.flags = 16),
      (this.globalVersion = kt - 1),
      (this.next = void 0),
      (this.effect = this),
      (this.__v_isReadonly = !e),
      (this.isSSR = n);
  }
  notify() {
    if (((this.flags |= 16), !(8 & this.flags) && tt !== this))
      return ut(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return gt(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
const Re = {},
  je = new WeakMap();
let ze;
function De(t, e, r = n) {
  const {
      immediate: i,
      deep: s,
      once: a,
      scheduler: l,
      augmentJob: c,
      call: f,
    } = r,
    d = (t) => (s ? t : ye(t) || !1 === s || 0 === s ? Ie(t, 1) : Ie(t));
  let p,
    g,
    y,
    m,
    _ = !1,
    b = !1;
  if (
    (ke(t)
      ? ((g = () => t.value), (_ = ye(t)))
      : ge(t)
      ? ((g = () => d(t)), (_ = !0))
      : h(t)
      ? ((b = !0),
        (_ = t.some((t) => ge(t) || ye(t))),
        (g = () =>
          t.map((t) =>
            ke(t) ? t.value : ge(t) ? d(t) : v(t) ? (f ? f(t, 2) : t()) : void 0
          )))
      : (g = v(t)
          ? e
            ? f
              ? () => f(t, 2)
              : t
            : () => {
                if (y) {
                  bt();
                  try {
                    y();
                  } finally {
                    wt();
                  }
                }
                const e = ze;
                ze = p;
                try {
                  return f ? f(t, 3, [m]) : t(m);
                } finally {
                  ze = e;
                }
              }
          : o),
    e && s)
  ) {
    const t = g,
      e = !0 === s ? 1 / 0 : s;
    g = () => Ie(t(), e);
  }
  const w = rt(),
    x = () => {
      p.stop(), w && w.active && u(w.effects, p);
    };
  if (a && e) {
    const t = e;
    e = (...e) => {
      t(...e), x();
    };
  }
  let k = b ? new Array(t.length).fill(Re) : Re;
  const S = (t) => {
    if (1 & p.flags && (p.dirty || t))
      if (e) {
        const t = p.run();
        if (s || _ || (b ? t.some((t, e) => R(t, k[e])) : R(t, k))) {
          y && y();
          const n = ze;
          ze = p;
          try {
            const n = [t, k === Re ? void 0 : b && k[0] === Re ? [] : k, m];
            (k = t), f ? f(e, 3, n) : e(...n);
          } finally {
            ze = n;
          }
        }
      } else p.run();
  };
  return (
    c && c(S),
    (p = new it(g)),
    (p.scheduler = l ? () => l(S, !1) : S),
    (m = (t) =>
      (function (t, e = !1, n = ze) {
        if (n) {
          let e = je.get(n);
          e || je.set(n, (e = [])), e.push(t);
        }
      })(t, !1, p)),
    (y = p.onStop =
      () => {
        const t = je.get(p);
        if (t) {
          if (f) f(t, 4);
          else for (const e of t) e();
          je.delete(p);
        }
      }),
    e ? (i ? S(!0) : (k = p.run())) : l ? l(S.bind(null, !0), !0) : p.run(),
    (x.pause = p.pause.bind(p)),
    (x.resume = p.resume.bind(p)),
    (x.stop = x),
    x
  );
}
function Ie(t, e = 1 / 0, n) {
  if (e <= 0 || !_(t) || t.__v_skip) return t;
  if (((n = n || new Map()).get(t) || 0) >= e) return t;
  if ((n.set(t, e), e--, ke(t))) Ie(t.value, e, n);
  else if (h(t)) for (let r = 0; r < t.length; r++) Ie(t[r], e, n);
  else if (p(t) || d(t))
    t.forEach((t) => {
      Ie(t, e, n);
    });
  else if (k(t)) {
    for (const r in t) Ie(t[r], e, n);
    for (const r of Object.getOwnPropertySymbols(t))
      Object.prototype.propertyIsEnumerable.call(t, r) && Ie(t[r], e, n);
  }
  return t;
}
/**
 * @vue/runtime-core v3.5.25
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Le(t, e, n, r) {
  try {
    return r ? t(...r) : t();
  } catch (o) {
    Fe(o, e, n);
  }
}
function Ue(t, e, n, r) {
  if (v(t)) {
    const o = Le(t, e, n, r);
    return (
      o &&
        b(o) &&
        o.catch((t) => {
          Fe(t, e, n);
        }),
      o
    );
  }
  if (h(t)) {
    const o = [];
    for (let i = 0; i < t.length; i++) o.push(Ue(t[i], e, n, r));
    return o;
  }
}
function Fe(t, e, r, o = !0) {
  e && e.vnode;
  const { errorHandler: i, throwUnhandledErrorInProduction: s } =
    (e && e.appContext.config) || n;
  if (e) {
    let n = e.parent;
    const o = e.proxy,
      s = `https://vuejs.org/error-reference/#runtime-${r}`;
    for (; n; ) {
      const e = n.ec;
      if (e)
        for (let n = 0; n < e.length; n++) if (!1 === e[n](t, o, s)) return;
      n = n.parent;
    }
    if (i) return bt(), Le(i, null, 10, [t, o, s]), void wt();
  }
  !(function (t, e, n, r = !0, o = !1) {
    if (o) throw t;
  })(t, 0, 0, o, s);
}
const Be = [];
let $e = -1;
const Ve = [];
let qe = null,
  He = 0;
const Ge = Promise.resolve();
let We = null;
function Xe(t) {
  const e = We || Ge;
  return t ? e.then(this ? t.bind(this) : t) : e;
}
function Ye(t) {
  if (!(1 & t.flags)) {
    const e = Qe(t),
      n = Be[Be.length - 1];
    !n || (!(2 & t.flags) && e >= Qe(n))
      ? Be.push(t)
      : Be.splice(
          (function (t) {
            let e = $e + 1,
              n = Be.length;
            for (; e < n; ) {
              const r = (e + n) >>> 1,
                o = Be[r],
                i = Qe(o);
              i < t || (i === t && 2 & o.flags) ? (e = r + 1) : (n = r);
            }
            return e;
          })(e),
          0,
          t
        ),
      (t.flags |= 1),
      Je();
  }
}
function Je() {
  We || (We = Ge.then(tn));
}
function Ke(t, e, n = $e + 1) {
  for (; n < Be.length; n++) {
    const e = Be[n];
    if (e && 2 & e.flags) {
      if (t && e.id !== t.uid) continue;
      Be.splice(n, 1),
        n--,
        4 & e.flags && (e.flags &= -2),
        e(),
        4 & e.flags || (e.flags &= -2);
    }
  }
}
function Ze(t) {
  if (Ve.length) {
    const t = [...new Set(Ve)].sort((t, e) => Qe(t) - Qe(e));
    if (((Ve.length = 0), qe)) return void qe.push(...t);
    for (qe = t, He = 0; He < qe.length; He++) {
      const t = qe[He];
      4 & t.flags && (t.flags &= -2), 8 & t.flags || t(), (t.flags &= -2);
    }
    (qe = null), (He = 0);
  }
}
const Qe = (t) => (null == t.id ? (2 & t.flags ? -1 : 1 / 0) : t.id);
function tn(t) {
  try {
    for ($e = 0; $e < Be.length; $e++) {
      const t = Be[$e];
      !t ||
        8 & t.flags ||
        (4 & t.flags && (t.flags &= -2),
        Le(t, t.i, t.i ? 15 : 14),
        4 & t.flags || (t.flags &= -2));
    }
  } finally {
    for (; $e < Be.length; $e++) {
      const t = Be[$e];
      t && (t.flags &= -2);
    }
    ($e = -1),
      (Be.length = 0),
      Ze(),
      (We = null),
      (Be.length || Ve.length) && tn();
  }
}
let en = null,
  nn = null;
function rn(t) {
  const e = en;
  return (en = t), (nn = (t && t.type.__scopeId) || null), e;
}
function on(t, e = en, n) {
  if (!e) return t;
  if (t._n) return t;
  const r = (...n) => {
    r._d && po(-1);
    const o = rn(e);
    let i;
    try {
      i = t(...n);
    } finally {
      rn(o), r._d && po(1);
    }
    return i;
  };
  return (r._n = !0), (r._c = !0), (r._d = !0), r;
}
function sn(t, e) {
  if (null === en) return t;
  const r = Ho(en),
    o = t.dirs || (t.dirs = []);
  for (let i = 0; i < e.length; i++) {
    let [t, s, a, l = n] = e[i];
    t &&
      (v(t) && (t = { mounted: t, updated: t }),
      t.deep && Ie(s),
      o.push({
        dir: t,
        instance: r,
        value: s,
        oldValue: void 0,
        arg: a,
        modifiers: l,
      }));
  }
  return t;
}
function an(t, e, n, r) {
  const o = t.dirs,
    i = e && e.dirs;
  for (let s = 0; s < o.length; s++) {
    const a = o[s];
    i && (a.oldValue = i[s].value);
    let l = a.dir[r];
    l && (bt(), Ue(l, n, 8, [t.el, a, t, e]), wt());
  }
}
const ln = Symbol("_vte"),
  un = (t) => t.__isTeleport,
  cn = Symbol("_leaveCb"),
  fn = Symbol("_enterCb");
function hn() {
  const t = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: new Map(),
  };
  return (
    Bn(() => {
      t.isMounted = !0;
    }),
    qn(() => {
      t.isUnmounting = !0;
    }),
    t
  );
}
const dn = [Function, Array],
  pn = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: dn,
    onEnter: dn,
    onAfterEnter: dn,
    onEnterCancelled: dn,
    onBeforeLeave: dn,
    onLeave: dn,
    onAfterLeave: dn,
    onLeaveCancelled: dn,
    onBeforeAppear: dn,
    onAppear: dn,
    onAfterAppear: dn,
    onAppearCancelled: dn,
  },
  gn = (t) => {
    const e = t.subTree;
    return e.component ? gn(e.component) : e;
  };
function vn(t) {
  let e = t[0];
  if (t.length > 1)
    for (const n of t)
      if (n.type !== ao) {
        e = n;
        break;
      }
  return e;
}
const yn = {
  name: "BaseTransition",
  props: pn,
  setup(t, { slots: e }) {
    const n = zo(),
      r = hn();
    return () => {
      const o = e.default && kn(e.default(), !0);
      if (!o || !o.length) return;
      const i = vn(o),
        s = _e(t),
        { mode: a } = s;
      if (r.isLeaving) return bn(i);
      const l = wn(i);
      if (!l) return bn(i);
      let u = _n(l, s, r, n, (t) => (u = t));
      l.type !== ao && xn(l, u);
      let c = n.subTree && wn(n.subTree);
      if (c && c.type !== ao && !_o(c, l) && gn(n).type !== ao) {
        let t = _n(c, s, r, n);
        if ((xn(c, t), "out-in" === a && l.type !== ao))
          return (
            (r.isLeaving = !0),
            (t.afterLeave = () => {
              (r.isLeaving = !1),
                8 & n.job.flags || n.update(),
                delete t.afterLeave,
                (c = void 0);
            }),
            bn(i)
          );
        "in-out" === a && l.type !== ao
          ? (t.delayLeave = (t, e, n) => {
              (mn(r, c)[String(c.key)] = c),
                (t[cn] = () => {
                  e(), (t[cn] = void 0), delete u.delayedLeave, (c = void 0);
                }),
                (u.delayedLeave = () => {
                  n(), delete u.delayedLeave, (c = void 0);
                });
            })
          : (c = void 0);
      } else c && (c = void 0);
      return i;
    };
  },
};
function mn(t, e) {
  const { leavingVNodes: n } = t;
  let r = n.get(e.type);
  return r || ((r = Object.create(null)), n.set(e.type, r)), r;
}
function _n(t, e, n, r, o) {
  const {
      appear: i,
      mode: s,
      persisted: a = !1,
      onBeforeEnter: l,
      onEnter: u,
      onAfterEnter: c,
      onEnterCancelled: f,
      onBeforeLeave: d,
      onLeave: p,
      onAfterLeave: g,
      onLeaveCancelled: v,
      onBeforeAppear: y,
      onAppear: m,
      onAfterAppear: _,
      onAppearCancelled: b,
    } = e,
    w = String(t.key),
    x = mn(n, t),
    k = (t, e) => {
      t && Ue(t, r, 9, e);
    },
    S = (t, e) => {
      const n = e[1];
      k(t, e),
        h(t) ? t.every((t) => t.length <= 1) && n() : t.length <= 1 && n();
    },
    E = {
      mode: s,
      persisted: a,
      beforeEnter(e) {
        let r = l;
        if (!n.isMounted) {
          if (!i) return;
          r = y || l;
        }
        e[cn] && e[cn](!0);
        const o = x[w];
        o && _o(t, o) && o.el[cn] && o.el[cn](), k(r, [e]);
      },
      enter(t) {
        let e = u,
          r = c,
          o = f;
        if (!n.isMounted) {
          if (!i) return;
          (e = m || u), (r = _ || c), (o = b || f);
        }
        let s = !1;
        const a = (t[fn] = (e) => {
          s ||
            ((s = !0),
            k(e ? o : r, [t]),
            E.delayedLeave && E.delayedLeave(),
            (t[fn] = void 0));
        });
        e ? S(e, [t, a]) : a();
      },
      leave(e, r) {
        const o = String(t.key);
        if ((e[fn] && e[fn](!0), n.isUnmounting)) return r();
        k(d, [e]);
        let i = !1;
        const s = (e[cn] = (n) => {
          i ||
            ((i = !0),
            r(),
            k(n ? v : g, [e]),
            (e[cn] = void 0),
            x[o] === t && delete x[o]);
        });
        (x[o] = t), p ? S(p, [e, s]) : s();
      },
      clone(t) {
        const i = _n(t, e, n, r, o);
        return o && o(i), i;
      },
    };
  return E;
}
function bn(t) {
  if (Rn(t)) return ((t = So(t)).children = null), t;
}
function wn(t) {
  if (!Rn(t)) return un(t.type) && t.children ? vn(t.children) : t;
  if (t.component) return t.component.subTree;
  const { shapeFlag: e, children: n } = t;
  if (n) {
    if (16 & e) return n[0];
    if (32 & e && v(n.default)) return n.default();
  }
}
function xn(t, e) {
  6 & t.shapeFlag && t.component
    ? ((t.transition = e), xn(t.component.subTree, e))
    : 128 & t.shapeFlag
    ? ((t.ssContent.transition = e.clone(t.ssContent)),
      (t.ssFallback.transition = e.clone(t.ssFallback)))
    : (t.transition = e);
}
function kn(t, e = !1, n) {
  let r = [],
    o = 0;
  for (let i = 0; i < t.length; i++) {
    let s = t[i];
    const a = null == n ? s.key : String(n) + String(null != s.key ? s.key : i);
    s.type === io
      ? (128 & s.patchFlag && o++, (r = r.concat(kn(s.children, e, a))))
      : (e || s.type !== ao) && r.push(null != a ? So(s, { key: a }) : s);
  }
  if (o > 1) for (let i = 0; i < r.length; i++) r[i].patchFlag = -2;
  return r;
}
function Sn(t, e) {
  return v(t) ? (() => l({ name: t.name }, e, { setup: t }))() : t;
}
function En(t) {
  t.ids = [t.ids[0] + t.ids[2]++ + "-", 0, 0];
}
const Cn = new WeakMap();
function An(t, e, r, o, s = !1) {
  if (h(t))
    return void t.forEach((t, n) => An(t, e && (h(e) ? e[n] : e), r, o, s));
  if (Nn(o) && !s)
    return void (
      512 & o.shapeFlag &&
      o.type.__asyncResolved &&
      o.component.subTree.component &&
      An(t, e, r, o.component.subTree)
    );
  const a = 4 & o.shapeFlag ? Ho(o.component) : o.el,
    l = s ? null : a,
    { i: c, r: d } = t,
    p = e && e.r,
    g = c.refs === n ? (c.refs = {}) : c.refs,
    m = c.setupState,
    _ = _e(m),
    b = m === n ? i : (t) => f(_, t);
  if (null != p && p !== d)
    if ((On(e), y(p))) (g[p] = null), b(p) && (m[p] = null);
    else if (ke(p)) {
      p.value = null;
      const t = e;
      t.k && (g[t.k] = null);
    }
  if (v(d)) Le(d, c, 12, [l, g]);
  else {
    const e = y(d),
      n = ke(d);
    if (e || n) {
      const o = () => {
        if (t.f) {
          const n = e ? (b(d) ? m[d] : g[d]) : d.value;
          if (s) h(n) && u(n, a);
          else if (h(n)) n.includes(a) || n.push(a);
          else if (e) (g[d] = [a]), b(d) && (m[d] = g[d]);
          else {
            const e = [a];
            (d.value = e), t.k && (g[t.k] = e);
          }
        } else
          e
            ? ((g[d] = l), b(d) && (m[d] = l))
            : n && ((d.value = l), t.k && (g[t.k] = l));
      };
      if (l) {
        const e = () => {
          o(), Cn.delete(t);
        };
        (e.id = -1), Cn.set(t, e), Kr(e, r);
      } else On(t), o();
    }
  }
}
function On(t) {
  const e = Cn.get(t);
  e && ((e.flags |= 8), Cn.delete(t));
}
const Tn = (t) => 8 === t.nodeType;
L().requestIdleCallback, L().cancelIdleCallback;
const Nn = (t) => !!t.type.__asyncLoader;
function Pn(t) {
  v(t) && (t = { loader: t });
  const {
    loader: e,
    loadingComponent: n,
    errorComponent: r,
    delay: o = 200,
    hydrate: i,
    timeout: s,
    suspensible: a = !0,
    onError: l,
  } = t;
  let u,
    c = null,
    f = 0;
  const h = () => {
    let t;
    return (
      c ||
      (t = c =
        e()
          .catch((t) => {
            if (((t = t instanceof Error ? t : new Error(String(t))), l))
              return new Promise((e, n) => {
                l(
                  t,
                  () => e((f++, (c = null), h())),
                  () => n(t),
                  f + 1
                );
              });
            throw t;
          })
          .then((e) =>
            t !== c && c
              ? c
              : (e &&
                  (e.__esModule || "Module" === e[Symbol.toStringTag]) &&
                  (e = e.default),
                (u = e),
                e)
          ))
    );
  };
  return Sn({
    name: "AsyncComponentWrapper",
    __asyncLoader: h,
    __asyncHydrate(t, e, n) {
      let r = !1;
      (e.bu || (e.bu = [])).push(() => (r = !0));
      const o = () => {
          r || n();
        },
        s = i
          ? () => {
              const n = i(o, (e) =>
                (function (t, e) {
                  if (Tn(t) && "[" === t.data) {
                    let n = 1,
                      r = t.nextSibling;
                    for (; r; ) {
                      if (1 === r.nodeType) {
                        if (!1 === e(r)) break;
                      } else if (Tn(r))
                        if ("]" === r.data) {
                          if (0 === --n) break;
                        } else "[" === r.data && n++;
                      r = r.nextSibling;
                    }
                  } else e(t);
                })(t, e)
              );
              n && (e.bum || (e.bum = [])).push(n);
            }
          : o;
      u ? s() : h().then(() => !e.isUnmounted && s());
    },
    get __asyncResolved() {
      return u;
    },
    setup() {
      const t = jo;
      if ((En(t), u)) return () => Mn(u, t);
      const e = (e) => {
        (c = null), Fe(e, t, 13, !r);
      };
      if ((a && t.suspense) || Bo)
        return h()
          .then((e) => () => Mn(e, t))
          .catch((t) => (e(t), () => (r ? ko(r, { error: t }) : null)));
      const i = Se(!1),
        l = Se(),
        f = Se(!!o);
      return (
        o &&
          setTimeout(() => {
            f.value = !1;
          }, o),
        null != s &&
          setTimeout(() => {
            if (!i.value && !l.value) {
              const t = new Error(`Async component timed out after ${s}ms.`);
              e(t), (l.value = t);
            }
          }, s),
        h()
          .then(() => {
            (i.value = !0), t.parent && Rn(t.parent.vnode) && t.parent.update();
          })
          .catch((t) => {
            e(t), (l.value = t);
          }),
        () =>
          i.value && u
            ? Mn(u, t)
            : l.value && r
            ? ko(r, { error: l.value })
            : n && !f.value
            ? Mn(n, t)
            : void 0
      );
    },
  });
}
function Mn(t, e) {
  const { ref: n, props: r, children: o, ce: i } = e.vnode,
    s = ko(t, r, o);
  return (s.ref = n), (s.ce = i), delete e.vnode.ce, s;
}
const Rn = (t) => t.type.__isKeepAlive;
function jn(t, e) {
  Dn(t, "a", e);
}
function zn(t, e) {
  Dn(t, "da", e);
}
function Dn(t, e, n = jo) {
  const r =
    t.__wdc ||
    (t.__wdc = () => {
      let e = n;
      for (; e; ) {
        if (e.isDeactivated) return;
        e = e.parent;
      }
      return t();
    });
  if ((Ln(e, r, n), n)) {
    let t = n.parent;
    for (; t && t.parent; )
      Rn(t.parent.vnode) && In(r, e, n, t), (t = t.parent);
  }
}
function In(t, e, n, r) {
  const o = Ln(e, t, r, !0);
  Hn(() => {
    u(r[e], o);
  }, n);
}
function Ln(t, e, n = jo, r = !1) {
  if (n) {
    const o = n[t] || (n[t] = []),
      i =
        e.__weh ||
        (e.__weh = (...r) => {
          bt();
          const o = Lo(n),
            i = Ue(e, n, t, r);
          return o(), wt(), i;
        });
    return r ? o.unshift(i) : o.push(i), i;
  }
}
const Un =
    (t) =>
    (e, n = jo) => {
      (Bo && "sp" !== t) || Ln(t, (...t) => e(...t), n);
    },
  Fn = Un("bm"),
  Bn = Un("m"),
  $n = Un("bu"),
  Vn = Un("u"),
  qn = Un("bum"),
  Hn = Un("um"),
  Gn = Un("sp"),
  Wn = Un("rtg"),
  Xn = Un("rtc");
function Yn(t, e = jo) {
  Ln("ec", t, e);
}
const Jn = Symbol.for("v-ndc");
function Kn(t) {
  return y(t)
    ? (function (t, e, n = !0, r = !1) {
        const o = en || jo;
        if (o) {
          const n = o.type;
          {
            const t = Go(n, !1);
            if (t && (t === e || t === O(e) || t === P(O(e)))) return n;
          }
          const i = Zn(o[t] || n[t], e) || Zn(o.appContext[t], e);
          return !i && r ? n : i;
        }
      })("components", t, !1) || t
    : t || Jn;
}
function Zn(t, e) {
  return t && (t[e] || t[O(e)] || t[P(O(e))]);
}
function Qn(t, e, n, r) {
  let o;
  const i = n,
    s = h(t);
  if (s || y(t)) {
    let n = !1,
      r = !1;
    s && ge(t) && ((n = !ye(t)), (r = ve(t)), (t = jt(t))),
      (o = new Array(t.length));
    for (let s = 0, a = t.length; s < a; s++)
      o[s] = e(n ? (r ? xe(we(t[s])) : we(t[s])) : t[s], s, void 0, i);
  } else if ("number" == typeof t) {
    o = new Array(t);
    for (let n = 0; n < t; n++) o[n] = e(n + 1, n, void 0, i);
  } else if (_(t))
    if (t[Symbol.iterator]) o = Array.from(t, (t, n) => e(t, n, void 0, i));
    else {
      const n = Object.keys(t);
      o = new Array(n.length);
      for (let r = 0, s = n.length; r < s; r++) {
        const s = n[r];
        o[r] = e(t[s], s, r, i);
      }
    }
  else o = [];
  return o;
}
const tr = (t) => (t ? (Fo(t) ? Ho(t) : tr(t.parent)) : null),
  er = l(Object.create(null), {
    $: (t) => t,
    $el: (t) => t.vnode.el,
    $data: (t) => t.data,
    $props: (t) => t.props,
    $attrs: (t) => t.attrs,
    $slots: (t) => t.slots,
    $refs: (t) => t.refs,
    $parent: (t) => tr(t.parent),
    $root: (t) => tr(t.root),
    $host: (t) => t.ce,
    $emit: (t) => t.emit,
    $options: (t) => ur(t),
    $forceUpdate: (t) =>
      t.f ||
      (t.f = () => {
        Ye(t.update);
      }),
    $nextTick: (t) => t.n || (t.n = Xe.bind(t.proxy)),
    $watch: (t) => Ar.bind(t),
  }),
  nr = (t, e) => t !== n && !t.__isScriptSetup && f(t, e),
  rr = {
    get({ _: t }, e) {
      if ("__v_skip" === e) return !0;
      const {
        ctx: r,
        setupState: o,
        data: i,
        props: s,
        accessCache: a,
        type: l,
        appContext: u,
      } = t;
      if ("$" !== e[0]) {
        const t = a[e];
        if (void 0 !== t)
          switch (t) {
            case 1:
              return o[e];
            case 2:
              return i[e];
            case 4:
              return r[e];
            case 3:
              return s[e];
          }
        else {
          if (nr(o, e)) return (a[e] = 1), o[e];
          if (i !== n && f(i, e)) return (a[e] = 2), i[e];
          if (f(s, e)) return (a[e] = 3), s[e];
          if (r !== n && f(r, e)) return (a[e] = 4), r[e];
          ir && (a[e] = 0);
        }
      }
      const c = er[e];
      let h, d;
      return c
        ? ("$attrs" === e && Pt(t.attrs, 0, ""), c(t))
        : (h = l.__cssModules) && (h = h[e])
        ? h
        : r !== n && f(r, e)
        ? ((a[e] = 4), r[e])
        : ((d = u.config.globalProperties), f(d, e) ? d[e] : void 0);
    },
    set({ _: t }, e, r) {
      const { data: o, setupState: i, ctx: s } = t;
      return nr(i, e)
        ? ((i[e] = r), !0)
        : o !== n && f(o, e)
        ? ((o[e] = r), !0)
        : !f(t.props, e) &&
          ("$" !== e[0] || !(e.slice(1) in t)) &&
          ((s[e] = r), !0);
    },
    has(
      {
        _: {
          data: t,
          setupState: e,
          accessCache: r,
          ctx: o,
          appContext: i,
          props: s,
          type: a,
        },
      },
      l
    ) {
      let u;
      return !!(
        r[l] ||
        (t !== n && "$" !== l[0] && f(t, l)) ||
        nr(e, l) ||
        f(s, l) ||
        f(o, l) ||
        f(er, l) ||
        f(i.config.globalProperties, l) ||
        ((u = a.__cssModules) && u[l])
      );
    },
    defineProperty(t, e, n) {
      return (
        null != n.get
          ? (t._.accessCache[e] = 0)
          : f(n, "value") && this.set(t, e, n.value, null),
        Reflect.defineProperty(t, e, n)
      );
    },
  };
function or(t) {
  return h(t) ? t.reduce((t, e) => ((t[e] = null), t), {}) : t;
}
let ir = !0;
function sr(t) {
  const e = ur(t),
    n = t.proxy,
    r = t.ctx;
  (ir = !1), e.beforeCreate && ar(e.beforeCreate, t, "bc");
  const {
    data: i,
    computed: s,
    methods: a,
    watch: l,
    provide: u,
    inject: c,
    created: f,
    beforeMount: d,
    mounted: p,
    beforeUpdate: g,
    updated: y,
    activated: m,
    deactivated: b,
    beforeDestroy: w,
    beforeUnmount: x,
    destroyed: k,
    unmounted: S,
    render: E,
    renderTracked: C,
    renderTriggered: A,
    errorCaptured: O,
    serverPrefetch: T,
    expose: N,
    inheritAttrs: P,
    components: M,
    directives: R,
    filters: j,
  } = e;
  if (
    (c &&
      (function (t, e) {
        h(t) && (t = dr(t));
        for (const n in t) {
          const r = t[n];
          let o;
          (o = _(r)
            ? "default" in r
              ? xr(r.from || n, r.default, !0)
              : xr(r.from || n)
            : xr(r)),
            ke(o)
              ? Object.defineProperty(e, n, {
                  enumerable: !0,
                  configurable: !0,
                  get: () => o.value,
                  set: (t) => (o.value = t),
                })
              : (e[n] = o);
        }
      })(c, r, null),
    a)
  )
    for (const o in a) {
      const t = a[o];
      v(t) && (r[o] = t.bind(n));
    }
  if (i) {
    const e = i.call(n, n);
    _(e) && (t.data = fe(e));
  }
  if (((ir = !0), s))
    for (const h in s) {
      const t = s[h],
        e = v(t) ? t.bind(n, n) : v(t.get) ? t.get.bind(n, n) : o,
        i = !v(t) && v(t.set) ? t.set.bind(n) : o,
        a = Wo({ get: e, set: i });
      Object.defineProperty(r, h, {
        enumerable: !0,
        configurable: !0,
        get: () => a.value,
        set: (t) => (a.value = t),
      });
    }
  if (l) for (const o in l) lr(l[o], r, n, o);
  if (u) {
    const t = v(u) ? u.call(n) : u;
    Reflect.ownKeys(t).forEach((e) => {
      wr(e, t[e]);
    });
  }
  function z(t, e) {
    h(e) ? e.forEach((e) => t(e.bind(n))) : e && t(e.bind(n));
  }
  if (
    (f && ar(f, t, "c"),
    z(Fn, d),
    z(Bn, p),
    z($n, g),
    z(Vn, y),
    z(jn, m),
    z(zn, b),
    z(Yn, O),
    z(Xn, C),
    z(Wn, A),
    z(qn, x),
    z(Hn, S),
    z(Gn, T),
    h(N))
  )
    if (N.length) {
      const e = t.exposed || (t.exposed = {});
      N.forEach((t) => {
        Object.defineProperty(e, t, {
          get: () => n[t],
          set: (e) => (n[t] = e),
          enumerable: !0,
        });
      });
    } else t.exposed || (t.exposed = {});
  E && t.render === o && (t.render = E),
    null != P && (t.inheritAttrs = P),
    M && (t.components = M),
    R && (t.directives = R),
    T && En(t);
}
function ar(t, e, n) {
  Ue(h(t) ? t.map((t) => t.bind(e.proxy)) : t.bind(e.proxy), e, n);
}
function lr(t, e, n, r) {
  let o = r.includes(".") ? Or(n, r) : () => n[r];
  if (y(t)) {
    const n = e[t];
    v(n) && Er(o, n);
  } else if (v(t)) Er(o, t.bind(n));
  else if (_(t))
    if (h(t)) t.forEach((t) => lr(t, e, n, r));
    else {
      const r = v(t.handler) ? t.handler.bind(n) : e[t.handler];
      v(r) && Er(o, r, t);
    }
}
function ur(t) {
  const e = t.type,
    { mixins: n, extends: r } = e,
    {
      mixins: o,
      optionsCache: i,
      config: { optionMergeStrategies: s },
    } = t.appContext,
    a = i.get(e);
  let l;
  return (
    a
      ? (l = a)
      : o.length || n || r
      ? ((l = {}), o.length && o.forEach((t) => cr(l, t, s, !0)), cr(l, e, s))
      : (l = e),
    _(e) && i.set(e, l),
    l
  );
}
function cr(t, e, n, r = !1) {
  const { mixins: o, extends: i } = e;
  i && cr(t, i, n, !0), o && o.forEach((e) => cr(t, e, n, !0));
  for (const s in e)
    if (r && "expose" === s);
    else {
      const r = fr[s] || (n && n[s]);
      t[s] = r ? r(t[s], e[s]) : e[s];
    }
  return t;
}
const fr = {
  data: hr,
  props: vr,
  emits: vr,
  methods: gr,
  computed: gr,
  beforeCreate: pr,
  created: pr,
  beforeMount: pr,
  mounted: pr,
  beforeUpdate: pr,
  updated: pr,
  beforeDestroy: pr,
  beforeUnmount: pr,
  destroyed: pr,
  unmounted: pr,
  activated: pr,
  deactivated: pr,
  errorCaptured: pr,
  serverPrefetch: pr,
  components: gr,
  directives: gr,
  watch: function (t, e) {
    if (!t) return e;
    if (!e) return t;
    const n = l(Object.create(null), t);
    for (const r in e) n[r] = pr(t[r], e[r]);
    return n;
  },
  provide: hr,
  inject: function (t, e) {
    return gr(dr(t), dr(e));
  },
};
function hr(t, e) {
  return e
    ? t
      ? function () {
          return l(
            v(t) ? t.call(this, this) : t,
            v(e) ? e.call(this, this) : e
          );
        }
      : e
    : t;
}
function dr(t) {
  if (h(t)) {
    const e = {};
    for (let n = 0; n < t.length; n++) e[t[n]] = t[n];
    return e;
  }
  return t;
}
function pr(t, e) {
  return t ? [...new Set([].concat(t, e))] : e;
}
function gr(t, e) {
  return t ? l(Object.create(null), t, e) : e;
}
function vr(t, e) {
  return t
    ? h(t) && h(e)
      ? [...new Set([...t, ...e])]
      : l(Object.create(null), or(t), or(null != e ? e : {}))
    : e;
}
function yr() {
  return {
    app: null,
    config: {
      isNativeTag: i,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let mr = 0;
function _r(t, e) {
  return function (e, n = null) {
    v(e) || (e = l({}, e)), null == n || _(n) || (n = null);
    const r = yr(),
      o = new WeakSet(),
      i = [];
    let s = !1;
    const a = (r.app = {
      _uid: mr++,
      _component: e,
      _props: n,
      _container: null,
      _context: r,
      _instance: null,
      version: Yo,
      get config() {
        return r.config;
      },
      set config(t) {},
      use: (t, ...e) => (
        o.has(t) ||
          (t && v(t.install)
            ? (o.add(t), t.install(a, ...e))
            : v(t) && (o.add(t), t(a, ...e))),
        a
      ),
      mixin: (t) => (r.mixins.includes(t) || r.mixins.push(t), a),
      component: (t, e) => (e ? ((r.components[t] = e), a) : r.components[t]),
      directive: (t, e) => (e ? ((r.directives[t] = e), a) : r.directives[t]),
      mount(o, i, l) {
        if (!s) {
          const i = a._ceVNode || ko(e, n);
          return (
            (i.appContext = r),
            !0 === l ? (l = "svg") : !1 === l && (l = void 0),
            t(i, o, l),
            (s = !0),
            (a._container = o),
            (o.__vue_app__ = a),
            Ho(i.component)
          );
        }
      },
      onUnmount(t) {
        i.push(t);
      },
      unmount() {
        s &&
          (Ue(i, a._instance, 16),
          t(null, a._container),
          delete a._container.__vue_app__);
      },
      provide: (t, e) => ((r.provides[t] = e), a),
      runWithContext(t) {
        const e = br;
        br = a;
        try {
          return t();
        } finally {
          br = e;
        }
      },
    });
    return a;
  };
}
let br = null;
function wr(t, e) {
  if (jo) {
    let n = jo.provides;
    const r = jo.parent && jo.parent.provides;
    r === n && (n = jo.provides = Object.create(r)), (n[t] = e);
  }
}
function xr(t, e, n = !1) {
  const r = zo();
  if (r || br) {
    let o = br
      ? br._context.provides
      : r
      ? null == r.parent || r.ce
        ? r.vnode.appContext && r.vnode.appContext.provides
        : r.parent.provides
      : void 0;
    if (o && t in o) return o[t];
    if (arguments.length > 1) return n && v(e) ? e.call(r && r.proxy) : e;
  }
}
const kr = Symbol.for("v-scx"),
  Sr = () => xr(kr);
function Er(t, e, n) {
  return Cr(t, e, n);
}
function Cr(t, e, r = n) {
  const { immediate: i, deep: s, flush: a, once: u } = r,
    c = l({}, r),
    f = (e && i) || (!e && "post" !== a);
  let h;
  if (Bo)
    if ("sync" === a) {
      const t = Sr();
      h = t.__watcherHandles || (t.__watcherHandles = []);
    } else if (!f) {
      const t = () => {};
      return (t.stop = o), (t.resume = o), (t.pause = o), t;
    }
  const d = jo;
  c.call = (t, e, n) => Ue(t, d, e, n);
  let p = !1;
  "post" === a
    ? (c.scheduler = (t) => {
        Kr(t, d && d.suspense);
      })
    : "sync" !== a &&
      ((p = !0),
      (c.scheduler = (t, e) => {
        e ? t() : Ye(t);
      })),
    (c.augmentJob = (t) => {
      e && (t.flags |= 4),
        p && ((t.flags |= 2), d && ((t.id = d.uid), (t.i = d)));
    });
  const g = De(t, e, c);
  return Bo && (h ? h.push(g) : f && g()), g;
}
function Ar(t, e, n) {
  const r = this.proxy,
    o = y(t) ? (t.includes(".") ? Or(r, t) : () => r[t]) : t.bind(r, r);
  let i;
  v(e) ? (i = e) : ((i = e.handler), (n = e));
  const s = Lo(this),
    a = Cr(o, i.bind(r), n);
  return s(), a;
}
function Or(t, e) {
  const n = e.split(".");
  return () => {
    let e = t;
    for (let t = 0; t < n.length && e; t++) e = e[n[t]];
    return e;
  };
}
function Tr(t, e, ...r) {
  if (t.isUnmounted) return;
  const o = t.vnode.props || n;
  let i = r;
  const s = e.startsWith("update:"),
    a =
      s &&
      ((t, e) =>
        "modelValue" === e || "model-value" === e
          ? t.modelModifiers
          : t[`${e}Modifiers`] ||
            t[`${O(e)}Modifiers`] ||
            t[`${N(e)}Modifiers`])(o, e.slice(7));
  let l;
  a &&
    (a.trim && (i = r.map((t) => (y(t) ? t.trim() : t))),
    a.number && (i = r.map(D)));
  let u = o[(l = M(e))] || o[(l = M(O(e)))];
  !u && s && (u = o[(l = M(N(e)))]), u && Ue(u, t, 6, i);
  const c = o[l + "Once"];
  if (c) {
    if (t.emitted) {
      if (t.emitted[l]) return;
    } else t.emitted = {};
    (t.emitted[l] = !0), Ue(c, t, 6, i);
  }
}
const Nr = new WeakMap();
function Pr(t, e, n = !1) {
  const r = n ? Nr : e.emitsCache,
    o = r.get(t);
  if (void 0 !== o) return o;
  const i = t.emits;
  let s = {},
    a = !1;
  if (!v(t)) {
    const r = (t) => {
      const n = Pr(t, e, !0);
      n && ((a = !0), l(s, n));
    };
    !n && e.mixins.length && e.mixins.forEach(r),
      t.extends && r(t.extends),
      t.mixins && t.mixins.forEach(r);
  }
  return i || a
    ? (h(i) ? i.forEach((t) => (s[t] = null)) : l(s, i), _(t) && r.set(t, s), s)
    : (_(t) && r.set(t, null), null);
}
function Mr(t, e) {
  return (
    !(!t || !s(e)) &&
    ((e = e.slice(2).replace(/Once$/, "")),
    f(t, e[0].toLowerCase() + e.slice(1)) || f(t, N(e)) || f(t, e))
  );
}
function Rr(t) {
  const {
      type: e,
      vnode: n,
      proxy: r,
      withProxy: o,
      propsOptions: [i],
      slots: s,
      attrs: l,
      emit: u,
      render: c,
      renderCache: f,
      props: h,
      data: d,
      setupState: p,
      ctx: g,
      inheritAttrs: v,
    } = t,
    y = rn(t);
  let m, _;
  try {
    if (4 & n.shapeFlag) {
      const t = o || r,
        e = t;
      (m = Oo(c.call(e, t, f, h, p, d, g))), (_ = l);
    } else {
      const t = e;
      0,
        (m = Oo(
          t.length > 1 ? t(h, { attrs: l, slots: s, emit: u }) : t(h, null)
        )),
        (_ = e.props ? l : jr(l));
    }
  } catch (w) {
    (uo.length = 0), Fe(w, t, 1), (m = ko(ao));
  }
  let b = m;
  if (_ && !1 !== v) {
    const t = Object.keys(_),
      { shapeFlag: e } = b;
    t.length &&
      7 & e &&
      (i && t.some(a) && (_ = zr(_, i)), (b = So(b, _, !1, !0)));
  }
  return (
    n.dirs &&
      ((b = So(b, null, !1, !0)),
      (b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs)),
    n.transition && xn(b, n.transition),
    (m = b),
    rn(y),
    m
  );
}
const jr = (t) => {
    let e;
    for (const n in t)
      ("class" === n || "style" === n || s(n)) && ((e || (e = {}))[n] = t[n]);
    return e;
  },
  zr = (t, e) => {
    const n = {};
    for (const r in t) (a(r) && r.slice(9) in e) || (n[r] = t[r]);
    return n;
  };
function Dr(t, e, n) {
  const r = Object.keys(e);
  if (r.length !== Object.keys(t).length) return !0;
  for (let o = 0; o < r.length; o++) {
    const i = r[o];
    if (e[i] !== t[i] && !Mr(n, i)) return !0;
  }
  return !1;
}
const Ir = {},
  Lr = () => Object.create(Ir),
  Ur = (t) => Object.getPrototypeOf(t) === Ir;
function Fr(t, e, r, o) {
  const [i, s] = t.propsOptions;
  let a,
    l = !1;
  if (e)
    for (let n in e) {
      if (E(n)) continue;
      const u = e[n];
      let c;
      i && f(i, (c = O(n)))
        ? s && s.includes(c)
          ? ((a || (a = {}))[c] = u)
          : (r[c] = u)
        : Mr(t.emitsOptions, n) ||
          (n in o && u === o[n]) ||
          ((o[n] = u), (l = !0));
    }
  if (s) {
    const e = _e(r),
      o = a || n;
    for (let n = 0; n < s.length; n++) {
      const a = s[n];
      r[a] = Br(i, e, a, o[a], t, !f(o, a));
    }
  }
  return l;
}
function Br(t, e, n, r, o, i) {
  const s = t[n];
  if (null != s) {
    const t = f(s, "default");
    if (t && void 0 === r) {
      const t = s.default;
      if (s.type !== Function && !s.skipFactory && v(t)) {
        const { propsDefaults: i } = o;
        if (n in i) r = i[n];
        else {
          const s = Lo(o);
          (r = i[n] = t.call(null, e)), s();
        }
      } else r = t;
      o.ce && o.ce._setProp(n, r);
    }
    s[0] &&
      (i && !t ? (r = !1) : !s[1] || ("" !== r && r !== N(n)) || (r = !0));
  }
  return r;
}
const $r = new WeakMap();
function Vr(t, e, o = !1) {
  const i = o ? $r : e.propsCache,
    s = i.get(t);
  if (s) return s;
  const a = t.props,
    u = {},
    c = [];
  let d = !1;
  if (!v(t)) {
    const n = (t) => {
      d = !0;
      const [n, r] = Vr(t, e, !0);
      l(u, n), r && c.push(...r);
    };
    !o && e.mixins.length && e.mixins.forEach(n),
      t.extends && n(t.extends),
      t.mixins && t.mixins.forEach(n);
  }
  if (!a && !d) return _(t) && i.set(t, r), r;
  if (h(a))
    for (let r = 0; r < a.length; r++) {
      const t = O(a[r]);
      qr(t) && (u[t] = n);
    }
  else if (a)
    for (const n in a) {
      const t = O(n);
      if (qr(t)) {
        const e = a[n],
          r = (u[t] = h(e) || v(e) ? { type: e } : l({}, e)),
          o = r.type;
        let i = !1,
          s = !0;
        if (h(o))
          for (let t = 0; t < o.length; ++t) {
            const e = o[t],
              n = v(e) && e.name;
            if ("Boolean" === n) {
              i = !0;
              break;
            }
            "String" === n && (s = !1);
          }
        else i = v(o) && "Boolean" === o.name;
        (r[0] = i), (r[1] = s), (i || f(r, "default")) && c.push(t);
      }
    }
  const p = [u, c];
  return _(t) && i.set(t, p), p;
}
function qr(t) {
  return "$" !== t[0] && !E(t);
}
const Hr = (t) => "_" === t || "_ctx" === t || "$stable" === t,
  Gr = (t) => (h(t) ? t.map(Oo) : [Oo(t)]),
  Wr = (t, e, n) => {
    if (e._n) return e;
    const r = on((...t) => Gr(e(...t)), n);
    return (r._c = !1), r;
  },
  Xr = (t, e, n) => {
    const r = t._ctx;
    for (const o in t) {
      if (Hr(o)) continue;
      const n = t[o];
      if (v(n)) e[o] = Wr(0, n, r);
      else if (null != n) {
        const t = Gr(n);
        e[o] = () => t;
      }
    }
  },
  Yr = (t, e) => {
    const n = Gr(e);
    t.slots.default = () => n;
  },
  Jr = (t, e, n) => {
    for (const r in e) (!n && Hr(r)) || (t[r] = e[r]);
  },
  Kr = function (t, e) {
    e && e.pendingBranch
      ? h(t)
        ? e.effects.push(...t)
        : e.effects.push(t)
      : (h((n = t))
          ? Ve.push(...n)
          : qe && -1 === n.id
          ? qe.splice(He + 1, 0, n)
          : 1 & n.flags || (Ve.push(n), (n.flags |= 1)),
        Je());
    var n;
  };
function Zr(t) {
  return (function (t) {
    L().__VUE__ = !0;
    const {
        insert: e,
        remove: i,
        patchProp: s,
        createElement: a,
        createText: l,
        createComment: u,
        setText: c,
        setElementText: h,
        parentNode: d,
        nextSibling: p,
        setScopeId: g = o,
        insertStaticContent: v,
      } = t,
      y = (
        t,
        e,
        n,
        r = null,
        o = null,
        i = null,
        s = void 0,
        a = null,
        l = !!e.dynamicChildren
      ) => {
        if (t === e) return;
        t && !_o(t, e) && ((r = Z(t)), W(t, o, i, !0), (t = null)),
          -2 === e.patchFlag && ((l = !1), (e.dynamicChildren = null));
        const { type: u, ref: c, shapeFlag: f } = e;
        switch (u) {
          case so:
            m(t, e, n, r);
            break;
          case ao:
            _(t, e, n, r);
            break;
          case lo:
            null == t && w(e, n, r, s);
            break;
          case io:
            D(t, e, n, r, o, i, s, a, l);
            break;
          default:
            1 & f
              ? S(t, e, n, r, o, i, s, a, l)
              : 6 & f
              ? I(t, e, n, r, o, i, s, a, l)
              : (64 & f || 128 & f) && u.process(t, e, n, r, o, i, s, a, l, nt);
        }
        null != c && o
          ? An(c, t && t.ref, i, e || t, !e)
          : null == c && t && null != t.ref && An(t.ref, null, i, t, !0);
      },
      m = (t, n, r, o) => {
        if (null == t) e((n.el = l(n.children)), r, o);
        else {
          const e = (n.el = t.el);
          n.children !== t.children && c(e, n.children);
        }
      },
      _ = (t, n, r, o) => {
        null == t ? e((n.el = u(n.children || "")), r, o) : (n.el = t.el);
      },
      w = (t, e, n, r) => {
        [t.el, t.anchor] = v(t.children, e, n, r, t.el, t.anchor);
      },
      x = ({ el: t, anchor: n }, r, o) => {
        let i;
        for (; t && t !== n; ) (i = p(t)), e(t, r, o), (t = i);
        e(n, r, o);
      },
      k = ({ el: t, anchor: e }) => {
        let n;
        for (; t && t !== e; ) (n = p(t)), i(t), (t = n);
        i(e);
      },
      S = (t, e, n, r, o, i, s, a, l) => {
        if (
          ("svg" === e.type ? (s = "svg") : "math" === e.type && (s = "mathml"),
          null == t)
        )
          C(e, n, r, o, i, s, a, l);
        else {
          const n = t.el && t.el._isVueCE ? t.el : null;
          try {
            n && n._beginPatch(), P(t, e, o, i, s, a, l);
          } finally {
            n && n._endPatch();
          }
        }
      },
      C = (t, n, r, o, i, l, u, c) => {
        let f, d;
        const { props: p, shapeFlag: g, transition: v, dirs: y } = t;
        if (
          ((f = t.el = a(t.type, l, p && p.is, p)),
          8 & g
            ? h(f, t.children)
            : 16 & g && T(t.children, f, null, o, i, Qr(t, l), u, c),
          y && an(t, null, o, "created"),
          A(f, t, t.scopeId, u, o),
          p)
        ) {
          for (const t in p) "value" === t || E(t) || s(f, t, null, p[t], l, o);
          "value" in p && s(f, "value", null, p.value, l),
            (d = p.onVnodeBeforeMount) && Po(d, o, t);
        }
        y && an(t, null, o, "beforeMount");
        const m = (function (t, e) {
          return (!t || (t && !t.pendingBranch)) && e && !e.persisted;
        })(i, v);
        m && v.beforeEnter(f),
          e(f, n, r),
          ((d = p && p.onVnodeMounted) || m || y) &&
            Kr(() => {
              d && Po(d, o, t), m && v.enter(f), y && an(t, null, o, "mounted");
            }, i);
      },
      A = (t, e, n, r, o) => {
        if ((n && g(t, n), r)) for (let i = 0; i < r.length; i++) g(t, r[i]);
        if (o) {
          let n = o.subTree;
          if (
            e === n ||
            (oo(n.type) && (n.ssContent === e || n.ssFallback === e))
          ) {
            const e = o.vnode;
            A(t, e, e.scopeId, e.slotScopeIds, o.parent);
          }
        }
      },
      T = (t, e, n, r, o, i, s, a, l = 0) => {
        for (let u = l; u < t.length; u++) {
          const l = (t[u] = a ? To(t[u]) : Oo(t[u]));
          y(null, l, e, n, r, o, i, s, a);
        }
      },
      P = (t, e, r, o, i, a, l) => {
        const u = (e.el = t.el);
        let { patchFlag: c, dynamicChildren: f, dirs: d } = e;
        c |= 16 & t.patchFlag;
        const p = t.props || n,
          g = e.props || n;
        let v;
        if (
          (r && to(r, !1),
          (v = g.onVnodeBeforeUpdate) && Po(v, r, e, t),
          d && an(e, t, r, "beforeUpdate"),
          r && to(r, !0),
          ((p.innerHTML && null == g.innerHTML) ||
            (p.textContent && null == g.textContent)) &&
            h(u, ""),
          f
            ? M(t.dynamicChildren, f, u, r, o, Qr(e, i), a)
            : l || V(t, e, u, null, r, o, Qr(e, i), a, !1),
          c > 0)
        ) {
          if (16 & c) R(u, p, g, r, i);
          else if (
            (2 & c && p.class !== g.class && s(u, "class", null, g.class, i),
            4 & c && s(u, "style", p.style, g.style, i),
            8 & c)
          ) {
            const t = e.dynamicProps;
            for (let e = 0; e < t.length; e++) {
              const n = t[e],
                o = p[n],
                a = g[n];
              (a === o && "value" !== n) || s(u, n, o, a, i, r);
            }
          }
          1 & c && t.children !== e.children && h(u, e.children);
        } else l || null != f || R(u, p, g, r, i);
        ((v = g.onVnodeUpdated) || d) &&
          Kr(() => {
            v && Po(v, r, e, t), d && an(e, t, r, "updated");
          }, o);
      },
      M = (t, e, n, r, o, i, s) => {
        for (let a = 0; a < e.length; a++) {
          const l = t[a],
            u = e[a],
            c =
              l.el && (l.type === io || !_o(l, u) || 198 & l.shapeFlag)
                ? d(l.el)
                : n;
          y(l, u, c, null, r, o, i, s, !0);
        }
      },
      R = (t, e, r, o, i) => {
        if (e !== r) {
          if (e !== n)
            for (const n in e) E(n) || n in r || s(t, n, e[n], null, i, o);
          for (const n in r) {
            if (E(n)) continue;
            const a = r[n],
              l = e[n];
            a !== l && "value" !== n && s(t, n, l, a, i, o);
          }
          "value" in r && s(t, "value", e.value, r.value, i);
        }
      },
      D = (t, n, r, o, i, s, a, u, c) => {
        const f = (n.el = t ? t.el : l("")),
          h = (n.anchor = t ? t.anchor : l(""));
        let { patchFlag: d, dynamicChildren: p, slotScopeIds: g } = n;
        g && (u = u ? u.concat(g) : g),
          null == t
            ? (e(f, r, o), e(h, r, o), T(n.children || [], r, h, i, s, a, u, c))
            : d > 0 && 64 & d && p && t.dynamicChildren
            ? (M(t.dynamicChildren, p, r, i, s, a, u),
              (null != n.key || (i && n === i.subTree)) && eo(t, n, !0))
            : V(t, n, r, h, i, s, a, u, c);
      },
      I = (t, e, n, r, o, i, s, a, l) => {
        (e.slotScopeIds = a),
          null == t
            ? 512 & e.shapeFlag
              ? o.ctx.activate(e, n, r, s, l)
              : U(e, n, r, o, i, s, l)
            : F(t, e, l);
      },
      U = (t, e, r, o, i, s, a) => {
        const l = (t.component = (function (t, e, r) {
          const o = t.type,
            i = (e ? e.appContext : t.appContext) || Mo,
            s = {
              uid: Ro++,
              vnode: t,
              type: o,
              parent: e,
              appContext: i,
              root: null,
              next: null,
              subTree: null,
              effect: null,
              update: null,
              job: null,
              scope: new et(!0),
              render: null,
              proxy: null,
              exposed: null,
              exposeProxy: null,
              withProxy: null,
              provides: e ? e.provides : Object.create(i.provides),
              ids: e ? e.ids : ["", 0, 0],
              accessCache: null,
              renderCache: [],
              components: null,
              directives: null,
              propsOptions: Vr(o, i),
              emitsOptions: Pr(o, i),
              emit: null,
              emitted: null,
              propsDefaults: n,
              inheritAttrs: o.inheritAttrs,
              ctx: n,
              data: n,
              props: n,
              attrs: n,
              slots: n,
              refs: n,
              setupState: n,
              setupContext: null,
              suspense: r,
              suspenseId: r ? r.pendingId : 0,
              asyncDep: null,
              asyncResolved: !1,
              isMounted: !1,
              isUnmounted: !1,
              isDeactivated: !1,
              bc: null,
              c: null,
              bm: null,
              m: null,
              bu: null,
              u: null,
              um: null,
              bum: null,
              da: null,
              a: null,
              rtg: null,
              rtc: null,
              ec: null,
              sp: null,
            };
          (s.ctx = { _: s }),
            (s.root = e ? e.root : s),
            (s.emit = Tr.bind(null, s)),
            t.ce && t.ce(s);
          return s;
        })(t, o, i));
        if (
          (Rn(t) && (l.ctx.renderer = nt),
          (function (t, e = !1, n = !1) {
            e && Io(e);
            const { props: r, children: o } = t.vnode,
              i = Fo(t);
            (function (t, e, n, r = !1) {
              const o = {},
                i = Lr();
              (t.propsDefaults = Object.create(null)), Fr(t, e, o, i);
              for (const s in t.propsOptions[0]) s in o || (o[s] = void 0);
              n
                ? (t.props = r ? o : he(o))
                : t.type.props
                ? (t.props = o)
                : (t.props = i),
                (t.attrs = i);
            })(t, r, i, e),
              ((t, e, n) => {
                const r = (t.slots = Lr());
                if (32 & t.vnode.shapeFlag) {
                  const t = e._;
                  t ? (Jr(r, e, n), n && z(r, "_", t, !0)) : Xr(e, r);
                } else e && Yr(t, e);
              })(t, o, n || e);
            const s = i
              ? (function (t, e) {
                  const n = t.type;
                  (t.accessCache = Object.create(null)),
                    (t.proxy = new Proxy(t.ctx, rr));
                  const { setup: r } = n;
                  if (r) {
                    bt();
                    const n = (t.setupContext =
                        r.length > 1
                          ? (function (t) {
                              const e = (e) => {
                                t.exposed = e || {};
                              };
                              return {
                                attrs: new Proxy(t.attrs, qo),
                                slots: t.slots,
                                emit: t.emit,
                                expose: e,
                              };
                            })(t)
                          : null),
                      o = Lo(t),
                      i = Le(r, t, 0, [t.props, n]),
                      s = b(i);
                    if ((wt(), o(), (!s && !t.sp) || Nn(t) || En(t), s)) {
                      if ((i.then(Uo, Uo), e))
                        return i
                          .then((e) => {
                            $o(t, e);
                          })
                          .catch((e) => {
                            Fe(e, t, 0);
                          });
                      t.asyncDep = i;
                    } else $o(t, i);
                  } else Vo(t);
                })(t, e)
              : void 0;
            e && Io(!1);
          })(l, !1, a),
          l.asyncDep)
        ) {
          if ((i && i.registerDep(l, B, a), !t.el)) {
            const n = (l.subTree = ko(ao));
            _(null, n, e, r), (t.placeholder = n.el);
          }
        } else B(l, t, e, r, i, s, a);
      },
      F = (t, e, n) => {
        const r = (e.component = t.component);
        if (
          (function (t, e, n) {
            const { props: r, children: o, component: i } = t,
              { props: s, children: a, patchFlag: l } = e,
              u = i.emitsOptions;
            if (e.dirs || e.transition) return !0;
            if (!(n && l >= 0))
              return (
                !((!o && !a) || (a && a.$stable)) ||
                (r !== s && (r ? !s || Dr(r, s, u) : !!s))
              );
            if (1024 & l) return !0;
            if (16 & l) return r ? Dr(r, s, u) : !!s;
            if (8 & l) {
              const t = e.dynamicProps;
              for (let e = 0; e < t.length; e++) {
                const n = t[e];
                if (s[n] !== r[n] && !Mr(u, n)) return !0;
              }
            }
            return !1;
          })(t, e, n)
        ) {
          if (r.asyncDep && !r.asyncResolved) return void $(r, e, n);
          (r.next = e), r.update();
        } else (e.el = t.el), (r.vnode = e);
      },
      B = (t, e, n, r, o, i, s) => {
        const a = () => {
          if (t.isMounted) {
            let { next: e, bu: n, u: r, parent: l, vnode: u } = t;
            {
              const n = no(t);
              if (n)
                return (
                  e && ((e.el = u.el), $(t, e, s)),
                  void n.asyncDep.then(() => {
                    t.isUnmounted || a();
                  })
                );
            }
            let c,
              f = e;
            to(t, !1),
              e ? ((e.el = u.el), $(t, e, s)) : (e = u),
              n && j(n),
              (c = e.props && e.props.onVnodeBeforeUpdate) && Po(c, l, e, u),
              to(t, !0);
            const h = Rr(t),
              p = t.subTree;
            (t.subTree = h),
              y(p, h, d(p.el), Z(p), t, o, i),
              (e.el = h.el),
              null === f &&
                (function ({ vnode: t, parent: e }, n) {
                  for (; e; ) {
                    const r = e.subTree;
                    if (
                      (r.suspense &&
                        r.suspense.activeBranch === t &&
                        (r.el = t.el),
                      r !== t)
                    )
                      break;
                    ((t = e.vnode).el = n), (e = e.parent);
                  }
                })(t, h.el),
              r && Kr(r, o),
              (c = e.props && e.props.onVnodeUpdated) &&
                Kr(() => Po(c, l, e, u), o);
          } else {
            let s;
            const { el: a, props: l } = e,
              { bm: u, m: c, parent: f, root: h, type: d } = t,
              p = Nn(e);
            to(t, !1),
              u && j(u),
              !p && (s = l && l.onVnodeBeforeMount) && Po(s, f, e),
              to(t, !0);
            {
              h.ce && !1 !== h.ce._def.shadowRoot && h.ce._injectChildStyle(d);
              const s = (t.subTree = Rr(t));
              y(null, s, n, r, t, o, i), (e.el = s.el);
            }
            if ((c && Kr(c, o), !p && (s = l && l.onVnodeMounted))) {
              const t = e;
              Kr(() => Po(s, f, t), o);
            }
            (256 & e.shapeFlag ||
              (f && Nn(f.vnode) && 256 & f.vnode.shapeFlag)) &&
              t.a &&
              Kr(t.a, o),
              (t.isMounted = !0),
              (e = n = r = null);
          }
        };
        t.scope.on();
        const l = (t.effect = new it(a));
        t.scope.off();
        const u = (t.update = l.run.bind(l)),
          c = (t.job = l.runIfDirty.bind(l));
        (c.i = t), (c.id = t.uid), (l.scheduler = () => Ye(c)), to(t, !0), u();
      },
      $ = (t, e, r) => {
        e.component = t;
        const o = t.vnode.props;
        (t.vnode = e),
          (t.next = null),
          (function (t, e, n, r) {
            const {
                props: o,
                attrs: i,
                vnode: { patchFlag: s },
              } = t,
              a = _e(o),
              [l] = t.propsOptions;
            let u = !1;
            if (!(r || s > 0) || 16 & s) {
              let r;
              Fr(t, e, o, i) && (u = !0);
              for (const i in a)
                (e && (f(e, i) || ((r = N(i)) !== i && f(e, r)))) ||
                  (l
                    ? !n ||
                      (void 0 === n[i] && void 0 === n[r]) ||
                      (o[i] = Br(l, a, i, void 0, t, !0))
                    : delete o[i]);
              if (i !== a)
                for (const t in i) (e && f(e, t)) || (delete i[t], (u = !0));
            } else if (8 & s) {
              const n = t.vnode.dynamicProps;
              for (let r = 0; r < n.length; r++) {
                let s = n[r];
                if (Mr(t.emitsOptions, s)) continue;
                const c = e[s];
                if (l)
                  if (f(i, s)) c !== i[s] && ((i[s] = c), (u = !0));
                  else {
                    const e = O(s);
                    o[e] = Br(l, a, e, c, t, !1);
                  }
                else c !== i[s] && ((i[s] = c), (u = !0));
              }
            }
            u && Mt(t.attrs, "set", "");
          })(t, e.props, o, r),
          ((t, e, r) => {
            const { vnode: o, slots: i } = t;
            let s = !0,
              a = n;
            if (32 & o.shapeFlag) {
              const t = e._;
              t
                ? r && 1 === t
                  ? (s = !1)
                  : Jr(i, e, r)
                : ((s = !e.$stable), Xr(e, i)),
                (a = e);
            } else e && (Yr(t, e), (a = { default: 1 }));
            if (s) for (const n in i) Hr(n) || null != a[n] || delete i[n];
          })(t, e.children, r),
          bt(),
          Ke(t),
          wt();
      },
      V = (t, e, n, r, o, i, s, a, l = !1) => {
        const u = t && t.children,
          c = t ? t.shapeFlag : 0,
          f = e.children,
          { patchFlag: d, shapeFlag: p } = e;
        if (d > 0) {
          if (128 & d) return void H(u, f, n, r, o, i, s, a, l);
          if (256 & d) return void q(u, f, n, r, o, i, s, a, l);
        }
        8 & p
          ? (16 & c && K(u, o, i), f !== u && h(n, f))
          : 16 & c
          ? 16 & p
            ? H(u, f, n, r, o, i, s, a, l)
            : K(u, o, i, !0)
          : (8 & c && h(n, ""), 16 & p && T(f, n, r, o, i, s, a, l));
      },
      q = (t, e, n, o, i, s, a, l, u) => {
        e = e || r;
        const c = (t = t || r).length,
          f = e.length,
          h = Math.min(c, f);
        let d;
        for (d = 0; d < h; d++) {
          const r = (e[d] = u ? To(e[d]) : Oo(e[d]));
          y(t[d], r, n, null, i, s, a, l, u);
        }
        c > f ? K(t, i, s, !0, !1, h) : T(e, n, o, i, s, a, l, u, h);
      },
      H = (t, e, n, o, i, s, a, l, u) => {
        let c = 0;
        const f = e.length;
        let h = t.length - 1,
          d = f - 1;
        for (; c <= h && c <= d; ) {
          const r = t[c],
            o = (e[c] = u ? To(e[c]) : Oo(e[c]));
          if (!_o(r, o)) break;
          y(r, o, n, null, i, s, a, l, u), c++;
        }
        for (; c <= h && c <= d; ) {
          const r = t[h],
            o = (e[d] = u ? To(e[d]) : Oo(e[d]));
          if (!_o(r, o)) break;
          y(r, o, n, null, i, s, a, l, u), h--, d--;
        }
        if (c > h) {
          if (c <= d) {
            const t = d + 1,
              r = t < f ? e[t].el : o;
            for (; c <= d; )
              y(null, (e[c] = u ? To(e[c]) : Oo(e[c])), n, r, i, s, a, l, u),
                c++;
          }
        } else if (c > d) for (; c <= h; ) W(t[c], i, s, !0), c++;
        else {
          const p = c,
            g = c,
            v = new Map();
          for (c = g; c <= d; c++) {
            const t = (e[c] = u ? To(e[c]) : Oo(e[c]));
            null != t.key && v.set(t.key, c);
          }
          let m,
            _ = 0;
          const b = d - g + 1;
          let w = !1,
            x = 0;
          const k = new Array(b);
          for (c = 0; c < b; c++) k[c] = 0;
          for (c = p; c <= h; c++) {
            const r = t[c];
            if (_ >= b) {
              W(r, i, s, !0);
              continue;
            }
            let o;
            if (null != r.key) o = v.get(r.key);
            else
              for (m = g; m <= d; m++)
                if (0 === k[m - g] && _o(r, e[m])) {
                  o = m;
                  break;
                }
            void 0 === o
              ? W(r, i, s, !0)
              : ((k[o - g] = c + 1),
                o >= x ? (x = o) : (w = !0),
                y(r, e[o], n, null, i, s, a, l, u),
                _++);
          }
          const S = w
            ? (function (t) {
                const e = t.slice(),
                  n = [0];
                let r, o, i, s, a;
                const l = t.length;
                for (r = 0; r < l; r++) {
                  const l = t[r];
                  if (0 !== l) {
                    if (((o = n[n.length - 1]), t[o] < l)) {
                      (e[r] = o), n.push(r);
                      continue;
                    }
                    for (i = 0, s = n.length - 1; i < s; )
                      (a = (i + s) >> 1), t[n[a]] < l ? (i = a + 1) : (s = a);
                    l < t[n[i]] && (i > 0 && (e[r] = n[i - 1]), (n[i] = r));
                  }
                }
                (i = n.length), (s = n[i - 1]);
                for (; i-- > 0; ) (n[i] = s), (s = e[s]);
                return n;
              })(k)
            : r;
          for (m = S.length - 1, c = b - 1; c >= 0; c--) {
            const t = g + c,
              r = e[t],
              h = e[t + 1],
              d = t + 1 < f ? h.el || h.placeholder : o;
            0 === k[c]
              ? y(null, r, n, d, i, s, a, l, u)
              : w && (m < 0 || c !== S[m] ? G(r, n, d, 2) : m--);
          }
        }
      },
      G = (t, n, r, o, s = null) => {
        const { el: a, type: l, transition: u, children: c, shapeFlag: f } = t;
        if (6 & f) return void G(t.component.subTree, n, r, o);
        if (128 & f) return void t.suspense.move(n, r, o);
        if (64 & f) return void l.move(t, n, r, nt);
        if (l === io) {
          e(a, n, r);
          for (let t = 0; t < c.length; t++) G(c[t], n, r, o);
          return void e(t.anchor, n, r);
        }
        if (l === lo) return void x(t, n, r);
        if (2 !== o && 1 & f && u)
          if (0 === o) u.beforeEnter(a), e(a, n, r), Kr(() => u.enter(a), s);
          else {
            const { leave: o, delayLeave: s, afterLeave: l } = u,
              c = () => {
                t.ctx.isUnmounted ? i(a) : e(a, n, r);
              },
              f = () => {
                a._isLeaving && a[cn](!0),
                  o(a, () => {
                    c(), l && l();
                  });
              };
            s ? s(a, c, f) : f();
          }
        else e(a, n, r);
      },
      W = (t, e, n, r = !1, o = !1) => {
        const {
          type: i,
          props: s,
          ref: a,
          children: l,
          dynamicChildren: u,
          shapeFlag: c,
          patchFlag: f,
          dirs: h,
          cacheIndex: d,
        } = t;
        if (
          (-2 === f && (o = !1),
          null != a && (bt(), An(a, null, n, t, !0), wt()),
          null != d && (e.renderCache[d] = void 0),
          256 & c)
        )
          return void e.ctx.deactivate(t);
        const p = 1 & c && h,
          g = !Nn(t);
        let v;
        if ((g && (v = s && s.onVnodeBeforeUnmount) && Po(v, e, t), 6 & c))
          J(t.component, n, r);
        else {
          if (128 & c) return void t.suspense.unmount(n, r);
          p && an(t, null, e, "beforeUnmount"),
            64 & c
              ? t.type.remove(t, e, n, nt, r)
              : u && !u.hasOnce && (i !== io || (f > 0 && 64 & f))
              ? K(u, e, n, !1, !0)
              : ((i === io && 384 & f) || (!o && 16 & c)) && K(l, e, n),
            r && X(t);
        }
        ((g && (v = s && s.onVnodeUnmounted)) || p) &&
          Kr(() => {
            v && Po(v, e, t), p && an(t, null, e, "unmounted");
          }, n);
      },
      X = (t) => {
        const { type: e, el: n, anchor: r, transition: o } = t;
        if (e === io) return void Y(n, r);
        if (e === lo) return void k(t);
        const s = () => {
          i(n), o && !o.persisted && o.afterLeave && o.afterLeave();
        };
        if (1 & t.shapeFlag && o && !o.persisted) {
          const { leave: e, delayLeave: r } = o,
            i = () => e(n, s);
          r ? r(t.el, s, i) : i();
        } else s();
      },
      Y = (t, e) => {
        let n;
        for (; t !== e; ) (n = p(t)), i(t), (t = n);
        i(e);
      },
      J = (t, e, n) => {
        const { bum: r, scope: o, job: i, subTree: s, um: a, m: l, a: u } = t;
        ro(l),
          ro(u),
          r && j(r),
          o.stop(),
          i && ((i.flags |= 8), W(s, t, e, n)),
          a && Kr(a, e),
          Kr(() => {
            t.isUnmounted = !0;
          }, e);
      },
      K = (t, e, n, r = !1, o = !1, i = 0) => {
        for (let s = i; s < t.length; s++) W(t[s], e, n, r, o);
      },
      Z = (t) => {
        if (6 & t.shapeFlag) return Z(t.component.subTree);
        if (128 & t.shapeFlag) return t.suspense.next();
        const e = p(t.anchor || t.el),
          n = e && e[ln];
        return n ? p(n) : e;
      };
    let Q = !1;
    const tt = (t, e, n) => {
        null == t
          ? e._vnode && W(e._vnode, null, null, !0)
          : y(e._vnode || null, t, e, null, null, null, n),
          (e._vnode = t),
          Q || ((Q = !0), Ke(), Ze(), (Q = !1));
      },
      nt = { p: y, um: W, m: G, r: X, mt: U, mc: T, pc: V, pbc: M, n: Z, o: t };
    let rt;
    return { render: tt, hydrate: rt, createApp: _r(tt) };
  })(t);
}
function Qr({ type: t, props: e }, n) {
  return ("svg" === n && "foreignObject" === t) ||
    ("mathml" === n &&
      "annotation-xml" === t &&
      e &&
      e.encoding &&
      e.encoding.includes("html"))
    ? void 0
    : n;
}
function to({ effect: t, job: e }, n) {
  n ? ((t.flags |= 32), (e.flags |= 4)) : ((t.flags &= -33), (e.flags &= -5));
}
function eo(t, e, n = !1) {
  const r = t.children,
    o = e.children;
  if (h(r) && h(o))
    for (let i = 0; i < r.length; i++) {
      const t = r[i];
      let e = o[i];
      1 & e.shapeFlag &&
        !e.dynamicChildren &&
        ((e.patchFlag <= 0 || 32 === e.patchFlag) &&
          ((e = o[i] = To(o[i])), (e.el = t.el)),
        n || -2 === e.patchFlag || eo(t, e)),
        e.type === so && -1 !== e.patchFlag && (e.el = t.el),
        e.type !== ao || e.el || (e.el = t.el);
    }
}
function no(t) {
  const e = t.subTree.component;
  if (e) return e.asyncDep && !e.asyncResolved ? e : no(e);
}
function ro(t) {
  if (t) for (let e = 0; e < t.length; e++) t[e].flags |= 8;
}
const oo = (t) => t.__isSuspense;
const io = Symbol.for("v-fgt"),
  so = Symbol.for("v-txt"),
  ao = Symbol.for("v-cmt"),
  lo = Symbol.for("v-stc"),
  uo = [];
let co = null;
function fo(t = !1) {
  uo.push((co = t ? null : []));
}
let ho = 1;
function po(t, e = !1) {
  (ho += t), t < 0 && co && e && (co.hasOnce = !0);
}
function go(t) {
  return (
    (t.dynamicChildren = ho > 0 ? co || r : null),
    uo.pop(),
    (co = uo[uo.length - 1] || null),
    ho > 0 && co && co.push(t),
    t
  );
}
function vo(t, e, n, r, o, i) {
  return go(xo(t, e, n, r, o, i, !0));
}
function yo(t, e, n, r, o) {
  return go(ko(t, e, n, r, o, !0));
}
function mo(t) {
  return !!t && !0 === t.__v_isVNode;
}
function _o(t, e) {
  return t.type === e.type && t.key === e.key;
}
const bo = ({ key: t }) => (null != t ? t : null),
  wo = ({ ref: t, ref_key: e, ref_for: n }) => (
    "number" == typeof t && (t = "" + t),
    null != t
      ? y(t) || ke(t) || v(t)
        ? { i: en, r: t, k: e, f: !!n }
        : t
      : null
  );
function xo(
  t,
  e = null,
  n = null,
  r = 0,
  o = null,
  i = t === io ? 0 : 1,
  s = !1,
  a = !1
) {
  const l = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: t,
    props: e,
    key: e && bo(e),
    ref: e && wo(e),
    scopeId: nn,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: r,
    dynamicProps: o,
    dynamicChildren: null,
    appContext: null,
    ctx: en,
  };
  return (
    a
      ? (No(l, n), 128 & i && t.normalize(l))
      : n && (l.shapeFlag |= y(n) ? 8 : 16),
    ho > 0 &&
      !s &&
      co &&
      (l.patchFlag > 0 || 6 & i) &&
      32 !== l.patchFlag &&
      co.push(l),
    l
  );
}
const ko = function (t, e = null, n = null, r = 0, o = null, i = !1) {
  (t && t !== Jn) || (t = ao);
  if (mo(t)) {
    const r = So(t, e, !0);
    return (
      n && No(r, n),
      ho > 0 &&
        !i &&
        co &&
        (6 & r.shapeFlag ? (co[co.indexOf(t)] = r) : co.push(r)),
      (r.patchFlag = -2),
      r
    );
  }
  (s = t), v(s) && "__vccOpts" in s && (t = t.__vccOpts);
  var s;
  if (e) {
    e = (function (t) {
      return t ? (me(t) || Ur(t) ? l({}, t) : t) : null;
    })(e);
    let { class: t, style: n } = e;
    t && !y(t) && (e.class = q(t)),
      _(n) && (me(n) && !h(n) && (n = l({}, n)), (e.style = U(n)));
  }
  const a = y(t) ? 1 : oo(t) ? 128 : un(t) ? 64 : _(t) ? 4 : v(t) ? 2 : 0;
  return xo(t, e, n, r, o, a, i, !0);
};
function So(t, e, n = !1, r = !1) {
  const { props: o, ref: i, patchFlag: a, children: l, transition: u } = t,
    c = e
      ? (function (...t) {
          const e = {};
          for (let n = 0; n < t.length; n++) {
            const r = t[n];
            for (const t in r)
              if ("class" === t)
                e.class !== r.class && (e.class = q([e.class, r.class]));
              else if ("style" === t) e.style = U([e.style, r.style]);
              else if (s(t)) {
                const n = e[t],
                  o = r[t];
                !o ||
                  n === o ||
                  (h(n) && n.includes(o)) ||
                  (e[t] = n ? [].concat(n, o) : o);
              } else "" !== t && (e[t] = r[t]);
          }
          return e;
        })(o || {}, e)
      : o,
    f = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: t.type,
      props: c,
      key: c && bo(c),
      ref:
        e && e.ref
          ? n && i
            ? h(i)
              ? i.concat(wo(e))
              : [i, wo(e)]
            : wo(e)
          : i,
      scopeId: t.scopeId,
      slotScopeIds: t.slotScopeIds,
      children: l,
      target: t.target,
      targetStart: t.targetStart,
      targetAnchor: t.targetAnchor,
      staticCount: t.staticCount,
      shapeFlag: t.shapeFlag,
      patchFlag: e && t.type !== io ? (-1 === a ? 16 : 16 | a) : a,
      dynamicProps: t.dynamicProps,
      dynamicChildren: t.dynamicChildren,
      appContext: t.appContext,
      dirs: t.dirs,
      transition: u,
      component: t.component,
      suspense: t.suspense,
      ssContent: t.ssContent && So(t.ssContent),
      ssFallback: t.ssFallback && So(t.ssFallback),
      placeholder: t.placeholder,
      el: t.el,
      anchor: t.anchor,
      ctx: t.ctx,
      ce: t.ce,
    };
  return u && r && xn(f, u.clone(f)), f;
}
function Eo(t = " ", e = 0) {
  return ko(so, null, t, e);
}
function Co(t, e) {
  const n = ko(lo, null, t);
  return (n.staticCount = e), n;
}
function Ao(t = "", e = !1) {
  return e ? (fo(), yo(ao, null, t)) : ko(ao, null, t);
}
function Oo(t) {
  return null == t || "boolean" == typeof t
    ? ko(ao)
    : h(t)
    ? ko(io, null, t.slice())
    : mo(t)
    ? To(t)
    : ko(so, null, String(t));
}
function To(t) {
  return (null === t.el && -1 !== t.patchFlag) || t.memo ? t : So(t);
}
function No(t, e) {
  let n = 0;
  const { shapeFlag: r } = t;
  if (null == e) e = null;
  else if (h(e)) n = 16;
  else if ("object" == typeof e) {
    if (65 & r) {
      const n = e.default;
      return void (n && (n._c && (n._d = !1), No(t, n()), n._c && (n._d = !0)));
    }
    {
      n = 32;
      const r = e._;
      r || Ur(e)
        ? 3 === r &&
          en &&
          (1 === en.slots._ ? (e._ = 1) : ((e._ = 2), (t.patchFlag |= 1024)))
        : (e._ctx = en);
    }
  } else
    v(e)
      ? ((e = { default: e, _ctx: en }), (n = 32))
      : ((e = String(e)), 64 & r ? ((n = 16), (e = [Eo(e)])) : (n = 8));
  (t.children = e), (t.shapeFlag |= n);
}
function Po(t, e, n, r = null) {
  Ue(t, e, 7, [n, r]);
}
const Mo = yr();
let Ro = 0;
let jo = null;
const zo = () => jo || en;
let Do, Io;
{
  const t = L(),
    e = (e, n) => {
      let r;
      return (
        (r = t[e]) || (r = t[e] = []),
        r.push(n),
        (t) => {
          r.length > 1 ? r.forEach((e) => e(t)) : r[0](t);
        }
      );
    };
  (Do = e("__VUE_INSTANCE_SETTERS__", (t) => (jo = t))),
    (Io = e("__VUE_SSR_SETTERS__", (t) => (Bo = t)));
}
const Lo = (t) => {
    const e = jo;
    return (
      Do(t),
      t.scope.on(),
      () => {
        t.scope.off(), Do(e);
      }
    );
  },
  Uo = () => {
    jo && jo.scope.off(), Do(null);
  };
function Fo(t) {
  return 4 & t.vnode.shapeFlag;
}
let Bo = !1;
function $o(t, e, n) {
  v(e)
    ? t.type.__ssrInlineRender
      ? (t.ssrRender = e)
      : (t.render = e)
    : _(e) && (t.setupState = Te(e)),
    Vo(t);
}
function Vo(t, e, n) {
  const r = t.type;
  t.render || (t.render = r.render || o);
  {
    const e = Lo(t);
    bt();
    try {
      sr(t);
    } finally {
      wt(), e();
    }
  }
}
const qo = { get: (t, e) => (Pt(t, 0, ""), t[e]) };
function Ho(t) {
  return t.exposed
    ? t.exposeProxy ||
        (t.exposeProxy = new Proxy(Te(be(t.exposed)), {
          get: (e, n) => (n in e ? e[n] : n in er ? er[n](t) : void 0),
          has: (t, e) => e in t || e in er,
        }))
    : t.proxy;
}
function Go(t, e = !0) {
  return v(t) ? t.displayName || t.name : t.name || (e && t.__name);
}
const Wo = (t, e) => {
  const n = (function (t, e, n = !1) {
    let r, o;
    return v(t) ? (r = t) : ((r = t.get), (o = t.set)), new Me(r, o, n);
  })(t, 0, Bo);
  return n;
};
function Xo(t, e, n) {
  try {
    po(-1);
    const r = arguments.length;
    return 2 === r
      ? _(e) && !h(e)
        ? mo(e)
          ? ko(t, null, [e])
          : ko(t, e)
        : ko(t, null, e)
      : (r > 3
          ? (n = Array.prototype.slice.call(arguments, 2))
          : 3 === r && mo(n) && (n = [n]),
        ko(t, e, n));
  } finally {
    po(1);
  }
}
const Yo = "3.5.25";
/**
 * @vue/runtime-dom v3.5.25
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let Jo;
const Ko = "undefined" != typeof window && window.trustedTypes;
if (Ko)
  try {
    Jo = Ko.createPolicy("vue", { createHTML: (t) => t });
  } catch (cw) {}
const Zo = Jo ? (t) => Jo.createHTML(t) : (t) => t,
  Qo = "undefined" != typeof document ? document : null,
  ti = Qo && Qo.createElement("template"),
  ei = {
    insert: (t, e, n) => {
      e.insertBefore(t, n || null);
    },
    remove: (t) => {
      const e = t.parentNode;
      e && e.removeChild(t);
    },
    createElement: (t, e, n, r) => {
      const o =
        "svg" === e
          ? Qo.createElementNS("http://www.w3.org/2000/svg", t)
          : "mathml" === e
          ? Qo.createElementNS("http://www.w3.org/1998/Math/MathML", t)
          : n
          ? Qo.createElement(t, { is: n })
          : Qo.createElement(t);
      return (
        "select" === t &&
          r &&
          null != r.multiple &&
          o.setAttribute("multiple", r.multiple),
        o
      );
    },
    createText: (t) => Qo.createTextNode(t),
    createComment: (t) => Qo.createComment(t),
    setText: (t, e) => {
      t.nodeValue = e;
    },
    setElementText: (t, e) => {
      t.textContent = e;
    },
    parentNode: (t) => t.parentNode,
    nextSibling: (t) => t.nextSibling,
    querySelector: (t) => Qo.querySelector(t),
    setScopeId(t, e) {
      t.setAttribute(e, "");
    },
    insertStaticContent(t, e, n, r, o, i) {
      const s = n ? n.previousSibling : e.lastChild;
      if (o && (o === i || o.nextSibling))
        for (
          ;
          e.insertBefore(o.cloneNode(!0), n), o !== i && (o = o.nextSibling);

        );
      else {
        ti.innerHTML = Zo(
          "svg" === r
            ? `<svg>${t}</svg>`
            : "mathml" === r
            ? `<math>${t}</math>`
            : t
        );
        const o = ti.content;
        if ("svg" === r || "mathml" === r) {
          const t = o.firstChild;
          for (; t.firstChild; ) o.appendChild(t.firstChild);
          o.removeChild(t);
        }
        e.insertBefore(o, n);
      }
      return [
        s ? s.nextSibling : e.firstChild,
        n ? n.previousSibling : e.lastChild,
      ];
    },
  },
  ni = "transition",
  ri = "animation",
  oi = Symbol("_vtc"),
  ii = {
    name: String,
    type: String,
    css: { type: Boolean, default: !0 },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String,
  },
  si = l({}, pn, ii),
  ai = ((t) => ((t.displayName = "Transition"), (t.props = si), t))(
    (t, { slots: e }) => Xo(yn, ci(t), e)
  ),
  li = (t, e = []) => {
    h(t) ? t.forEach((t) => t(...e)) : t && t(...e);
  },
  ui = (t) => !!t && (h(t) ? t.some((t) => t.length > 1) : t.length > 1);
function ci(t) {
  const e = {};
  for (const l in t) l in ii || (e[l] = t[l]);
  if (!1 === t.css) return e;
  const {
      name: n = "v",
      type: r,
      duration: o,
      enterFromClass: i = `${n}-enter-from`,
      enterActiveClass: s = `${n}-enter-active`,
      enterToClass: a = `${n}-enter-to`,
      appearFromClass: u = i,
      appearActiveClass: c = s,
      appearToClass: f = a,
      leaveFromClass: h = `${n}-leave-from`,
      leaveActiveClass: d = `${n}-leave-active`,
      leaveToClass: p = `${n}-leave-to`,
    } = t,
    g = (function (t) {
      if (null == t) return null;
      if (_(t)) return [fi(t.enter), fi(t.leave)];
      {
        const e = fi(t);
        return [e, e];
      }
    })(o),
    v = g && g[0],
    y = g && g[1],
    {
      onBeforeEnter: m,
      onEnter: b,
      onEnterCancelled: w,
      onLeave: x,
      onLeaveCancelled: k,
      onBeforeAppear: S = m,
      onAppear: E = b,
      onAppearCancelled: C = w,
    } = e,
    A = (t, e, n, r) => {
      (t._enterCancelled = r), di(t, e ? f : a), di(t, e ? c : s), n && n();
    },
    O = (t, e) => {
      (t._isLeaving = !1), di(t, h), di(t, p), di(t, d), e && e();
    },
    T = (t) => (e, n) => {
      const o = t ? E : b,
        s = () => A(e, t, n);
      li(o, [e, s]),
        pi(() => {
          di(e, t ? u : i), hi(e, t ? f : a), ui(o) || vi(e, r, v, s);
        });
    };
  return l(e, {
    onBeforeEnter(t) {
      li(m, [t]), hi(t, i), hi(t, s);
    },
    onBeforeAppear(t) {
      li(S, [t]), hi(t, u), hi(t, c);
    },
    onEnter: T(!1),
    onAppear: T(!0),
    onLeave(t, e) {
      t._isLeaving = !0;
      const n = () => O(t, e);
      hi(t, h),
        t._enterCancelled ? (hi(t, d), bi(t)) : (bi(t), hi(t, d)),
        pi(() => {
          t._isLeaving && (di(t, h), hi(t, p), ui(x) || vi(t, r, y, n));
        }),
        li(x, [t, n]);
    },
    onEnterCancelled(t) {
      A(t, !1, void 0, !0), li(w, [t]);
    },
    onAppearCancelled(t) {
      A(t, !0, void 0, !0), li(C, [t]);
    },
    onLeaveCancelled(t) {
      O(t), li(k, [t]);
    },
  });
}
function fi(t) {
  const e = ((t) => {
    const e = y(t) ? Number(t) : NaN;
    return isNaN(e) ? t : e;
  })(t);
  return e;
}
function hi(t, e) {
  e.split(/\s+/).forEach((e) => e && t.classList.add(e)),
    (t[oi] || (t[oi] = new Set())).add(e);
}
function di(t, e) {
  e.split(/\s+/).forEach((e) => e && t.classList.remove(e));
  const n = t[oi];
  n && (n.delete(e), n.size || (t[oi] = void 0));
}
function pi(t) {
  requestAnimationFrame(() => {
    requestAnimationFrame(t);
  });
}
let gi = 0;
function vi(t, e, n, r) {
  const o = (t._endId = ++gi),
    i = () => {
      o === t._endId && r();
    };
  if (null != n) return setTimeout(i, n);
  const { type: s, timeout: a, propCount: l } = yi(t, e);
  if (!s) return r();
  const u = s + "end";
  let c = 0;
  const f = () => {
      t.removeEventListener(u, h), i();
    },
    h = (e) => {
      e.target === t && ++c >= l && f();
    };
  setTimeout(() => {
    c < l && f();
  }, a + 1),
    t.addEventListener(u, h);
}
function yi(t, e) {
  const n = window.getComputedStyle(t),
    r = (t) => (n[t] || "").split(", "),
    o = r(`${ni}Delay`),
    i = r(`${ni}Duration`),
    s = mi(o, i),
    a = r(`${ri}Delay`),
    l = r(`${ri}Duration`),
    u = mi(a, l);
  let c = null,
    f = 0,
    h = 0;
  e === ni
    ? s > 0 && ((c = ni), (f = s), (h = i.length))
    : e === ri
    ? u > 0 && ((c = ri), (f = u), (h = l.length))
    : ((f = Math.max(s, u)),
      (c = f > 0 ? (s > u ? ni : ri) : null),
      (h = c ? (c === ni ? i.length : l.length) : 0));
  return {
    type: c,
    timeout: f,
    propCount: h,
    hasTransform:
      c === ni &&
      /\b(?:transform|all)(?:,|$)/.test(r(`${ni}Property`).toString()),
  };
}
function mi(t, e) {
  for (; t.length < e.length; ) t = t.concat(t);
  return Math.max(...e.map((e, n) => _i(e) + _i(t[n])));
}
function _i(t) {
  return "auto" === t ? 0 : 1e3 * Number(t.slice(0, -1).replace(",", "."));
}
function bi(t) {
  return (t ? t.ownerDocument : document).body.offsetHeight;
}
const wi = Symbol("_vod"),
  xi = Symbol("_vsh"),
  ki = Symbol(""),
  Si = /(?:^|;)\s*display\s*:/;
const Ei = /\s*!important$/;
function Ci(t, e, n) {
  if (h(n)) n.forEach((n) => Ci(t, e, n));
  else if ((null == n && (n = ""), e.startsWith("--"))) t.setProperty(e, n);
  else {
    const r = (function (t, e) {
      const n = Oi[e];
      if (n) return n;
      let r = O(e);
      if ("filter" !== r && r in t) return (Oi[e] = r);
      r = P(r);
      for (let o = 0; o < Ai.length; o++) {
        const n = Ai[o] + r;
        if (n in t) return (Oi[e] = n);
      }
      return e;
    })(t, e);
    Ei.test(n)
      ? t.setProperty(N(r), n.replace(Ei, ""), "important")
      : (t[r] = n);
  }
}
const Ai = ["Webkit", "Moz", "ms"],
  Oi = {};
const Ti = "http://www.w3.org/1999/xlink";
function Ni(t, e, n, r, o, i = H(e)) {
  r && e.startsWith("xlink:")
    ? null == n
      ? t.removeAttributeNS(Ti, e.slice(6, e.length))
      : t.setAttributeNS(Ti, e, n)
    : null == n || (i && !G(n))
    ? t.removeAttribute(e)
    : t.setAttribute(e, i ? "" : m(n) ? String(n) : n);
}
function Pi(t, e, n, r, o) {
  if ("innerHTML" === e || "textContent" === e)
    return void (null != n && (t[e] = "innerHTML" === e ? Zo(n) : n));
  const i = t.tagName;
  if ("value" === e && "PROGRESS" !== i && !i.includes("-")) {
    const r = "OPTION" === i ? t.getAttribute("value") || "" : t.value,
      o = null == n ? ("checkbox" === t.type ? "on" : "") : String(n);
    return (
      (r === o && "_value" in t) || (t.value = o),
      null == n && t.removeAttribute(e),
      void (t._value = n)
    );
  }
  let s = !1;
  if ("" === n || null == n) {
    const r = typeof t[e];
    "boolean" === r
      ? (n = G(n))
      : null == n && "string" === r
      ? ((n = ""), (s = !0))
      : "number" === r && ((n = 0), (s = !0));
  }
  try {
    t[e] = n;
  } catch (cw) {}
  s && t.removeAttribute(o || e);
}
function Mi(t, e, n, r) {
  t.addEventListener(e, n, r);
}
const Ri = Symbol("_vei");
function ji(t, e, n, r, o = null) {
  const i = t[Ri] || (t[Ri] = {}),
    s = i[e];
  if (r && s) s.value = r;
  else {
    const [n, a] = (function (t) {
      let e;
      if (zi.test(t)) {
        let n;
        for (e = {}; (n = t.match(zi)); )
          (t = t.slice(0, t.length - n[0].length)),
            (e[n[0].toLowerCase()] = !0);
      }
      const n = ":" === t[2] ? t.slice(3) : N(t.slice(2));
      return [n, e];
    })(e);
    if (r) {
      const s = (i[e] = (function (t, e) {
        const n = (t) => {
          if (t._vts) {
            if (t._vts <= n.attached) return;
          } else t._vts = Date.now();
          Ue(
            (function (t, e) {
              if (h(e)) {
                const n = t.stopImmediatePropagation;
                return (
                  (t.stopImmediatePropagation = () => {
                    n.call(t), (t._stopped = !0);
                  }),
                  e.map((t) => (e) => !e._stopped && t && t(e))
                );
              }
              return e;
            })(t, n.value),
            e,
            5,
            [t]
          );
        };
        return (n.value = t), (n.attached = Li()), n;
      })(r, o));
      Mi(t, n, s, a);
    } else
      s &&
        (!(function (t, e, n, r) {
          t.removeEventListener(e, n, r);
        })(t, n, s, a),
        (i[e] = void 0));
  }
}
const zi = /(?:Once|Passive|Capture)$/;
let Di = 0;
const Ii = Promise.resolve(),
  Li = () => Di || (Ii.then(() => (Di = 0)), (Di = Date.now()));
const Ui = (t) =>
  111 === t.charCodeAt(0) &&
  110 === t.charCodeAt(1) &&
  t.charCodeAt(2) > 96 &&
  t.charCodeAt(2) < 123;
const Fi = new WeakMap(),
  Bi = new WeakMap(),
  $i = Symbol("_moveCb"),
  Vi = Symbol("_enterCb"),
  qi = ((t) => (delete t.props.mode, t))({
    name: "TransitionGroup",
    props: l({}, si, { tag: String, moveClass: String }),
    setup(t, { slots: e }) {
      const n = zo(),
        r = hn();
      let o, i;
      return (
        Vn(() => {
          if (!o.length) return;
          const e = t.moveClass || `${t.name || "v"}-move`;
          if (
            !(function (t, e, n) {
              const r = t.cloneNode(),
                o = t[oi];
              o &&
                o.forEach((t) => {
                  t.split(/\s+/).forEach((t) => t && r.classList.remove(t));
                });
              n.split(/\s+/).forEach((t) => t && r.classList.add(t)),
                (r.style.display = "none");
              const i = 1 === e.nodeType ? e : e.parentNode;
              i.appendChild(r);
              const { hasTransform: s } = yi(r);
              return i.removeChild(r), s;
            })(o[0].el, n.vnode.el, e)
          )
            return void (o = []);
          o.forEach(Hi), o.forEach(Gi);
          const r = o.filter(Wi);
          bi(n.vnode.el),
            r.forEach((t) => {
              const n = t.el,
                r = n.style;
              hi(n, e),
                (r.transform = r.webkitTransform = r.transitionDuration = "");
              const o = (n[$i] = (t) => {
                (t && t.target !== n) ||
                  (t && !t.propertyName.endsWith("transform")) ||
                  (n.removeEventListener("transitionend", o),
                  (n[$i] = null),
                  di(n, e));
              });
              n.addEventListener("transitionend", o);
            }),
            (o = []);
        }),
        () => {
          const s = _e(t),
            a = ci(s);
          let l = s.tag || io;
          if (((o = []), i))
            for (let t = 0; t < i.length; t++) {
              const e = i[t];
              e.el &&
                e.el instanceof Element &&
                (o.push(e),
                xn(e, _n(e, a, r, n)),
                Fi.set(e, { left: e.el.offsetLeft, top: e.el.offsetTop }));
            }
          i = e.default ? kn(e.default()) : [];
          for (let t = 0; t < i.length; t++) {
            const e = i[t];
            null != e.key && xn(e, _n(e, a, r, n));
          }
          return ko(l, null, i);
        }
      );
    },
  });
function Hi(t) {
  const e = t.el;
  e[$i] && e[$i](), e[Vi] && e[Vi]();
}
function Gi(t) {
  Bi.set(t, { left: t.el.offsetLeft, top: t.el.offsetTop });
}
function Wi(t) {
  const e = Fi.get(t),
    n = Bi.get(t),
    r = e.left - n.left,
    o = e.top - n.top;
  if (r || o) {
    const e = t.el.style;
    return (
      (e.transform = e.webkitTransform = `translate(${r}px,${o}px)`),
      (e.transitionDuration = "0s"),
      t
    );
  }
}
const Xi = (t) => {
  const e = t.props["onUpdate:modelValue"] || !1;
  return h(e) ? (t) => j(e, t) : e;
};
function Yi(t) {
  t.target.composing = !0;
}
function Ji(t) {
  const e = t.target;
  e.composing && ((e.composing = !1), e.dispatchEvent(new Event("input")));
}
const Ki = Symbol("_assign");
function Zi(t, e, n) {
  return e && (t = t.trim()), n && (t = D(t)), t;
}
const Qi = {
    created(t, { modifiers: { lazy: e, trim: n, number: r } }, o) {
      t[Ki] = Xi(o);
      const i = r || (o.props && "number" === o.props.type);
      Mi(t, e ? "change" : "input", (e) => {
        e.target.composing || t[Ki](Zi(t.value, n, i));
      }),
        (n || i) &&
          Mi(t, "change", () => {
            t.value = Zi(t.value, n, i);
          }),
        e ||
          (Mi(t, "compositionstart", Yi),
          Mi(t, "compositionend", Ji),
          Mi(t, "change", Ji));
    },
    mounted(t, { value: e }) {
      t.value = null == e ? "" : e;
    },
    beforeUpdate(
      t,
      { value: e, oldValue: n, modifiers: { lazy: r, trim: o, number: i } },
      s
    ) {
      if (((t[Ki] = Xi(s)), t.composing)) return;
      const a = null == e ? "" : e;
      if (
        ((!i && "number" !== t.type) || /^0\d/.test(t.value)
          ? t.value
          : D(t.value)) !== a
      ) {
        if (document.activeElement === t && "range" !== t.type) {
          if (r && e === n) return;
          if (o && t.value.trim() === a) return;
        }
        t.value = a;
      }
    },
  },
  ts = {
    deep: !0,
    created(t, e, n) {
      (t[Ki] = Xi(n)),
        Mi(t, "change", () => {
          const e = t._modelValue,
            n = os(t),
            r = t.checked,
            o = t[Ki];
          if (h(e)) {
            const t = X(e, n),
              i = -1 !== t;
            if (r && !i) o(e.concat(n));
            else if (!r && i) {
              const n = [...e];
              n.splice(t, 1), o(n);
            }
          } else if (p(e)) {
            const t = new Set(e);
            r ? t.add(n) : t.delete(n), o(t);
          } else o(is(t, r));
        });
    },
    mounted: es,
    beforeUpdate(t, e, n) {
      (t[Ki] = Xi(n)), es(t, e, n);
    },
  };
function es(t, { value: e, oldValue: n }, r) {
  let o;
  if (((t._modelValue = e), h(e))) o = X(e, r.props.value) > -1;
  else if (p(e)) o = e.has(r.props.value);
  else {
    if (e === n) return;
    o = W(e, is(t, !0));
  }
  t.checked !== o && (t.checked = o);
}
const ns = {
  deep: !0,
  created(t, { value: e, modifiers: { number: n } }, r) {
    const o = p(e);
    Mi(t, "change", () => {
      const e = Array.prototype.filter
        .call(t.options, (t) => t.selected)
        .map((t) => (n ? D(os(t)) : os(t)));
      t[Ki](t.multiple ? (o ? new Set(e) : e) : e[0]),
        (t._assigning = !0),
        Xe(() => {
          t._assigning = !1;
        });
    }),
      (t[Ki] = Xi(r));
  },
  mounted(t, { value: e }) {
    rs(t, e);
  },
  beforeUpdate(t, e, n) {
    t[Ki] = Xi(n);
  },
  updated(t, { value: e }) {
    t._assigning || rs(t, e);
  },
};
function rs(t, e) {
  const n = t.multiple,
    r = h(e);
  if (!n || r || p(e)) {
    for (let o = 0, i = t.options.length; o < i; o++) {
      const i = t.options[o],
        s = os(i);
      if (n)
        if (r) {
          const t = typeof s;
          i.selected =
            "string" === t || "number" === t
              ? e.some((t) => String(t) === String(s))
              : X(e, s) > -1;
        } else i.selected = e.has(s);
      else if (W(os(i), e))
        return void (t.selectedIndex !== o && (t.selectedIndex = o));
    }
    n || -1 === t.selectedIndex || (t.selectedIndex = -1);
  }
}
function os(t) {
  return "_value" in t ? t._value : t.value;
}
function is(t, e) {
  const n = e ? "_trueValue" : "_falseValue";
  return n in t ? t[n] : e;
}
const ss = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace",
  },
  as = (t, e) => {
    const n = t._withKeys || (t._withKeys = {}),
      r = e.join(".");
    return (
      n[r] ||
      (n[r] = (n) => {
        if (!("key" in n)) return;
        const r = N(n.key);
        return e.some((t) => t === r || ss[t] === r) ? t(n) : void 0;
      })
    );
  },
  ls = l(
    {
      patchProp: (t, e, n, r, o, i) => {
        const l = "svg" === o;
        "class" === e
          ? (function (t, e, n) {
              const r = t[oi];
              r && (e = (e ? [e, ...r] : [...r]).join(" ")),
                null == e
                  ? t.removeAttribute("class")
                  : n
                  ? t.setAttribute("class", e)
                  : (t.className = e);
            })(t, r, l)
          : "style" === e
          ? (function (t, e, n) {
              const r = t.style,
                o = y(n);
              let i = !1;
              if (n && !o) {
                if (e)
                  if (y(e))
                    for (const t of e.split(";")) {
                      const e = t.slice(0, t.indexOf(":")).trim();
                      null == n[e] && Ci(r, e, "");
                    }
                  else for (const t in e) null == n[t] && Ci(r, t, "");
                for (const t in n) "display" === t && (i = !0), Ci(r, t, n[t]);
              } else if (o) {
                if (e !== n) {
                  const t = r[ki];
                  t && (n += ";" + t), (r.cssText = n), (i = Si.test(n));
                }
              } else e && t.removeAttribute("style");
              wi in t &&
                ((t[wi] = i ? r.display : ""), t[xi] && (r.display = "none"));
            })(t, n, r)
          : s(e)
          ? a(e) || ji(t, e, 0, r, i)
          : (
              "." === e[0]
                ? ((e = e.slice(1)), 1)
                : "^" === e[0]
                ? ((e = e.slice(1)), 0)
                : (function (t, e, n, r) {
                    if (r)
                      return (
                        "innerHTML" === e ||
                        "textContent" === e ||
                        !!(e in t && Ui(e) && v(n))
                      );
                    if (
                      "spellcheck" === e ||
                      "draggable" === e ||
                      "translate" === e ||
                      "autocorrect" === e
                    )
                      return !1;
                    if ("sandbox" === e && "IFRAME" === t.tagName) return !1;
                    if ("form" === e) return !1;
                    if ("list" === e && "INPUT" === t.tagName) return !1;
                    if ("type" === e && "TEXTAREA" === t.tagName) return !1;
                    if ("width" === e || "height" === e) {
                      const e = t.tagName;
                      if (
                        "IMG" === e ||
                        "VIDEO" === e ||
                        "CANVAS" === e ||
                        "SOURCE" === e
                      )
                        return !1;
                    }
                    if (Ui(e) && y(n)) return !1;
                    return e in t;
                  })(t, e, r, l)
            )
          ? (Pi(t, e, r),
            t.tagName.includes("-") ||
              ("value" !== e && "checked" !== e && "selected" !== e) ||
              Ni(t, e, r, l, 0, "value" !== e))
          : !t._isVueCE || (!/[A-Z]/.test(e) && y(r))
          ? ("true-value" === e
              ? (t._trueValue = r)
              : "false-value" === e && (t._falseValue = r),
            Ni(t, e, r, l))
          : Pi(t, O(e), r, 0, e);
      },
    },
    ei
  );
let us;
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let cs;
const fs = (t) => (cs = t),
  hs = Symbol();
function ds(t) {
  return (
    t &&
    "object" == typeof t &&
    "[object Object]" === Object.prototype.toString.call(t) &&
    "function" != typeof t.toJSON
  );
}
var ps, gs;
((gs = ps || (ps = {})).direct = "direct"),
  (gs.patchObject = "patch object"),
  (gs.patchFunction = "patch function");
const vs = () => {};
function ys(t, e, n, r = vs) {
  t.push(e);
  const o = () => {
    const n = t.indexOf(e);
    n > -1 && (t.splice(n, 1), r());
  };
  var i;
  return !n && rt() && ((i = o), Q && Q.cleanups.push(i)), o;
}
function ms(t, ...e) {
  t.slice().forEach((t) => {
    t(...e);
  });
}
const _s = (t) => t(),
  bs = Symbol(),
  ws = Symbol();
function xs(t, e) {
  t instanceof Map && e instanceof Map
    ? e.forEach((e, n) => t.set(n, e))
    : t instanceof Set && e instanceof Set && e.forEach(t.add, t);
  for (const n in e) {
    if (!e.hasOwnProperty(n)) continue;
    const r = e[n],
      o = t[n];
    ds(o) && ds(r) && t.hasOwnProperty(n) && !ke(r) && !ge(r)
      ? (t[n] = xs(o, r))
      : (t[n] = r);
  }
  return t;
}
const ks = Symbol();
function Ss(t) {
  return !ds(t) || !t.hasOwnProperty(ks);
}
const { assign: Es } = Object;
function Cs(t) {
  return !(!ke(t) || !t.effect);
}
function As(t, e, n, r) {
  const { state: o, actions: i, getters: s } = e,
    a = n.state.value[t];
  let l;
  return (
    (l = Os(
      t,
      function () {
        a || (n.state.value[t] = o ? o() : {});
        const e = (function (t) {
          const e = h(t) ? new Array(t.length) : {};
          for (const n in t) e[n] = Pe(t, n);
          return e;
        })(n.state.value[t]);
        return Es(
          e,
          i,
          Object.keys(s || {}).reduce(
            (e, r) => (
              (e[r] = be(
                Wo(() => {
                  fs(n);
                  const e = n._s.get(t);
                  return s[r].call(e, e);
                })
              )),
              e
            ),
            {}
          )
        );
      },
      e,
      n,
      r,
      !0
    )),
    l
  );
}
function Os(t, e, n = {}, r, o, i) {
  let s;
  const a = Es({ actions: {} }, n),
    l = { deep: !0 };
  let u,
    c,
    f,
    h = [],
    d = [];
  const p = r.state.value[t];
  let g;
  function v(e) {
    let n;
    (u = c = !1),
      "function" == typeof e
        ? (e(r.state.value[t]),
          (n = { type: ps.patchFunction, storeId: t, events: f }))
        : (xs(r.state.value[t], e),
          (n = { type: ps.patchObject, payload: e, storeId: t, events: f }));
    const o = (g = Symbol());
    Xe().then(() => {
      g === o && (u = !0);
    }),
      (c = !0),
      ms(h, n, r.state.value[t]);
  }
  i || p || (r.state.value[t] = {}), Se({});
  const y = i
    ? function () {
        const { state: t } = n,
          e = t ? t() : {};
        this.$patch((t) => {
          Es(t, e);
        });
      }
    : vs;
  const m = (e, n = "") => {
      if (bs in e) return (e[ws] = n), e;
      const o = function () {
        fs(r);
        const n = Array.from(arguments),
          i = [],
          s = [];
        let a;
        ms(d, {
          args: n,
          name: o[ws],
          store: _,
          after: function (t) {
            i.push(t);
          },
          onError: function (t) {
            s.push(t);
          },
        });
        try {
          a = e.apply(this && this.$id === t ? this : _, n);
        } catch (l) {
          throw (ms(s, l), l);
        }
        return a instanceof Promise
          ? a
              .then((t) => (ms(i, t), t))
              .catch((t) => (ms(s, t), Promise.reject(t)))
          : (ms(i, a), a);
      };
      return (o[bs] = !0), (o[ws] = n), o;
    },
    _ = fe({
      _p: r,
      $id: t,
      $onAction: ys.bind(null, d),
      $patch: v,
      $reset: y,
      $subscribe(e, n = {}) {
        const o = ys(h, e, n.detached, () => i()),
          i = s.run(() =>
            Er(
              () => r.state.value[t],
              (r) => {
                ("sync" === n.flush ? c : u) &&
                  e({ storeId: t, type: ps.direct, events: f }, r);
              },
              Es({}, l, n)
            )
          );
        return o;
      },
      $dispose: function () {
        s.stop(), (h = []), (d = []), r._s.delete(t);
      },
    });
  r._s.set(t, _);
  const b = ((r._a && r._a.runWithContext) || _s)(() =>
    r._e.run(() => (s = nt()).run(() => e({ action: m })))
  );
  for (const w in b) {
    const e = b[w];
    if ((ke(e) && !Cs(e)) || ge(e))
      i ||
        (p && Ss(e) && (ke(e) ? (e.value = p[w]) : xs(e, p[w])),
        (r.state.value[t][w] = e));
    else if ("function" == typeof e) {
      const t = m(e, w);
      (b[w] = t), (a.actions[w] = e);
    }
  }
  return (
    Es(_, b),
    Es(_e(_), b),
    Object.defineProperty(_, "$state", {
      get: () => r.state.value[t],
      set: (t) => {
        v((e) => {
          Es(e, t);
        });
      },
    }),
    r._p.forEach((t) => {
      Es(
        _,
        s.run(() => t({ store: _, app: r._a, pinia: r, options: a }))
      );
    }),
    p && i && n.hydrate && n.hydrate(_.$state, p),
    (u = !0),
    (c = !0),
    _
  );
}
/*! #__NO_SIDE_EFFECTS__ */ function Ts(t, e, n) {
  let r, o;
  const i = "function" == typeof e;
  function s(t, n) {
    const s = !(!zo() && !br);
    (t = t || (s ? xr(hs, null) : null)) && fs(t),
      (t = cs)._s.has(r) || (i ? Os(r, e, o, t) : As(r, o, t));
    return t._s.get(r);
  }
  return (
    "string" == typeof t ? ((r = t), (o = i ? n : e)) : ((o = t), (r = t.id)),
    (s.$id = r),
    s
  );
}
/*!
 * vue-router v4.6.3
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */ const Ns = "undefined" != typeof document;
function Ps(t) {
  return (
    "object" == typeof t ||
    "displayName" in t ||
    "props" in t ||
    "__vccOpts" in t
  );
}
const Ms = Object.assign;
function Rs(t, e) {
  const n = {};
  for (const r in e) {
    const o = e[r];
    n[r] = zs(o) ? o.map(t) : t(o);
  }
  return n;
}
const js = () => {},
  zs = Array.isArray;
function Ds(t, e) {
  const n = {};
  for (const r in t) n[r] = r in e ? e[r] : t[r];
  return n;
}
const Is = /#/g,
  Ls = /&/g,
  Us = /\//g,
  Fs = /=/g,
  Bs = /\?/g,
  $s = /\+/g,
  Vs = /%5B/g,
  qs = /%5D/g,
  Hs = /%5E/g,
  Gs = /%60/g,
  Ws = /%7B/g,
  Xs = /%7C/g,
  Ys = /%7D/g,
  Js = /%20/g;
function Ks(t) {
  return null == t
    ? ""
    : encodeURI("" + t)
        .replace(Xs, "|")
        .replace(Vs, "[")
        .replace(qs, "]");
}
function Zs(t) {
  return Ks(t)
    .replace($s, "%2B")
    .replace(Js, "+")
    .replace(Is, "%23")
    .replace(Ls, "%26")
    .replace(Gs, "`")
    .replace(Ws, "{")
    .replace(Ys, "}")
    .replace(Hs, "^");
}
function Qs(t) {
  return Zs(t).replace(Fs, "%3D");
}
function ta(t) {
  return (function (t) {
    return Ks(t).replace(Is, "%23").replace(Bs, "%3F");
  })(t).replace(Us, "%2F");
}
function ea(t) {
  if (null == t) return null;
  try {
    return decodeURIComponent("" + t);
  } catch (e) {}
  return "" + t;
}
const na = /\/$/;
function ra(t, e, n = "/") {
  let r,
    o = {},
    i = "",
    s = "";
  const a = e.indexOf("#");
  let l = e.indexOf("?");
  return (
    (l = a >= 0 && l > a ? -1 : l),
    l >= 0 &&
      ((r = e.slice(0, l)),
      (i = e.slice(l, a > 0 ? a : e.length)),
      (o = t(i.slice(1)))),
    a >= 0 && ((r = r || e.slice(0, a)), (s = e.slice(a, e.length))),
    (r = (function (t, e) {
      if (t.startsWith("/")) return t;
      if (!t) return e;
      const n = e.split("/"),
        r = t.split("/"),
        o = r[r.length - 1];
      (".." !== o && "." !== o) || r.push("");
      let i,
        s,
        a = n.length - 1;
      for (i = 0; i < r.length; i++)
        if (((s = r[i]), "." !== s)) {
          if (".." !== s) break;
          a > 1 && a--;
        }
      return n.slice(0, a).join("/") + "/" + r.slice(i).join("/");
    })(null != r ? r : e, n)),
    { fullPath: r + i + s, path: r, query: o, hash: ea(s) }
  );
}
function oa(t, e) {
  return e && t.toLowerCase().startsWith(e.toLowerCase())
    ? t.slice(e.length) || "/"
    : t;
}
function ia(t, e) {
  return (t.aliasOf || t) === (e.aliasOf || e);
}
function sa(t, e) {
  if (Object.keys(t).length !== Object.keys(e).length) return !1;
  for (const n in t) if (!aa(t[n], e[n])) return !1;
  return !0;
}
function aa(t, e) {
  return zs(t) ? la(t, e) : zs(e) ? la(e, t) : t === e;
}
function la(t, e) {
  return zs(e)
    ? t.length === e.length && t.every((t, n) => t === e[n])
    : 1 === t.length && t[0] === e;
}
const ua = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0,
};
let ca = (function (t) {
    return (t.pop = "pop"), (t.push = "push"), t;
  })({}),
  fa = (function (t) {
    return (t.back = "back"), (t.forward = "forward"), (t.unknown = ""), t;
  })({});
function ha(t) {
  if (!t)
    if (Ns) {
      const e = document.querySelector("base");
      t = (t = (e && e.getAttribute("href")) || "/").replace(
        /^\w+:\/\/[^\/]+/,
        ""
      );
    } else t = "/";
  return "/" !== t[0] && "#" !== t[0] && (t = "/" + t), t.replace(na, "");
}
const da = /^[^#]+#/;
function pa(t, e) {
  return t.replace(da, "#") + e;
}
const ga = () => ({ left: window.scrollX, top: window.scrollY });
function va(t) {
  let e;
  if ("el" in t) {
    const n = t.el,
      r = "string" == typeof n && n.startsWith("#"),
      o =
        "string" == typeof n
          ? r
            ? document.getElementById(n.slice(1))
            : document.querySelector(n)
          : n;
    if (!o) return;
    e = (function (t, e) {
      const n = document.documentElement.getBoundingClientRect(),
        r = t.getBoundingClientRect();
      return {
        behavior: e.behavior,
        left: r.left - n.left - (e.left || 0),
        top: r.top - n.top - (e.top || 0),
      };
    })(o, t);
  } else e = t;
  "scrollBehavior" in document.documentElement.style
    ? window.scrollTo(e)
    : window.scrollTo(
        null != e.left ? e.left : window.scrollX,
        null != e.top ? e.top : window.scrollY
      );
}
function ya(t, e) {
  return (history.state ? history.state.position - e : -1) + t;
}
const ma = new Map();
function _a(t) {
  return "string" == typeof t || "symbol" == typeof t;
}
let ba = (function (t) {
  return (
    (t[(t.MATCHER_NOT_FOUND = 1)] = "MATCHER_NOT_FOUND"),
    (t[(t.NAVIGATION_GUARD_REDIRECT = 2)] = "NAVIGATION_GUARD_REDIRECT"),
    (t[(t.NAVIGATION_ABORTED = 4)] = "NAVIGATION_ABORTED"),
    (t[(t.NAVIGATION_CANCELLED = 8)] = "NAVIGATION_CANCELLED"),
    (t[(t.NAVIGATION_DUPLICATED = 16)] = "NAVIGATION_DUPLICATED"),
    t
  );
})({});
const wa = Symbol("");
function xa(t, e) {
  return Ms(new Error(), { type: t, [wa]: !0 }, e);
}
function ka(t, e) {
  return t instanceof Error && wa in t && (null == e || !!(t.type & e));
}
ba.MATCHER_NOT_FOUND,
  ba.NAVIGATION_GUARD_REDIRECT,
  ba.NAVIGATION_ABORTED,
  ba.NAVIGATION_CANCELLED,
  ba.NAVIGATION_DUPLICATED;
function Sa(t) {
  const e = {};
  if ("" === t || "?" === t) return e;
  const n = ("?" === t[0] ? t.slice(1) : t).split("&");
  for (let r = 0; r < n.length; ++r) {
    const t = n[r].replace($s, " "),
      o = t.indexOf("="),
      i = ea(o < 0 ? t : t.slice(0, o)),
      s = o < 0 ? null : ea(t.slice(o + 1));
    if (i in e) {
      let t = e[i];
      zs(t) || (t = e[i] = [t]), t.push(s);
    } else e[i] = s;
  }
  return e;
}
function Ea(t) {
  let e = "";
  for (let n in t) {
    const r = t[n];
    (n = Qs(n)),
      null != r
        ? (zs(r) ? r.map((t) => t && Zs(t)) : [r && Zs(r)]).forEach((t) => {
            void 0 !== t &&
              ((e += (e.length ? "&" : "") + n), null != t && (e += "=" + t));
          })
        : void 0 !== r && (e += (e.length ? "&" : "") + n);
  }
  return e;
}
function Ca(t) {
  const e = {};
  for (const n in t) {
    const r = t[n];
    void 0 !== r &&
      (e[n] = zs(r)
        ? r.map((t) => (null == t ? null : "" + t))
        : null == r
        ? r
        : "" + r);
  }
  return e;
}
const Aa = Symbol(""),
  Oa = Symbol(""),
  Ta = Symbol(""),
  Na = Symbol(""),
  Pa = Symbol("");
function Ma() {
  let t = [];
  return {
    add: function (e) {
      return (
        t.push(e),
        () => {
          const n = t.indexOf(e);
          n > -1 && t.splice(n, 1);
        }
      );
    },
    list: () => t.slice(),
    reset: function () {
      t = [];
    },
  };
}
function Ra(t, e, n, r, o, i = (t) => t()) {
  const s = r && (r.enterCallbacks[o] = r.enterCallbacks[o] || []);
  return () =>
    new Promise((a, l) => {
      const u = (t) => {
          var i;
          !1 === t
            ? l(xa(ba.NAVIGATION_ABORTED, { from: n, to: e }))
            : t instanceof Error
            ? l(t)
            : "string" == typeof (i = t) || (i && "object" == typeof i)
            ? l(xa(ba.NAVIGATION_GUARD_REDIRECT, { from: e, to: t }))
            : (s &&
                r.enterCallbacks[o] === s &&
                "function" == typeof t &&
                s.push(t),
              a());
        },
        c = i(() => t.call(r && r.instances[o], e, n, u));
      let f = Promise.resolve(c);
      t.length < 3 && (f = f.then(u)), f.catch((t) => l(t));
    });
}
function ja(t, e, n, r, o = (t) => t()) {
  const i = [];
  for (const s of t)
    for (const t in s.components) {
      let a = s.components[t];
      if ("beforeRouteEnter" === e || s.instances[t])
        if (Ps(a)) {
          const l = (a.__vccOpts || a)[e];
          l && i.push(Ra(l, n, r, s, t, o));
        } else {
          let l = a();
          i.push(() =>
            l.then((i) => {
              if (!i)
                throw new Error(
                  `Couldn't resolve component "${t}" at "${s.path}"`
                );
              const a =
                (l = i).__esModule ||
                "Module" === l[Symbol.toStringTag] ||
                (l.default && Ps(l.default))
                  ? i.default
                  : i;
              var l;
              (s.mods[t] = i), (s.components[t] = a);
              const u = (a.__vccOpts || a)[e];
              return u && Ra(u, n, r, s, t, o)();
            })
          );
        }
    }
  return i;
}
function za(t, e) {
  const { pathname: n, search: r, hash: o } = e,
    i = t.indexOf("#");
  if (i > -1) {
    let e = o.includes(t.slice(i)) ? t.slice(i).length : 1,
      n = o.slice(e);
    return "/" !== n[0] && (n = "/" + n), oa(n, "");
  }
  return oa(n, t) + r + o;
}
function Da(t, e, n, r = !1, o = !1) {
  return {
    back: t,
    current: e,
    forward: n,
    replaced: r,
    position: window.history.length,
    scroll: o ? ga() : null,
  };
}
function Ia(t) {
  const { history: e, location: n } = window,
    r = { value: za(t, n) },
    o = { value: e.state };
  function i(r, i, s) {
    const a = t.indexOf("#"),
      l =
        a > -1
          ? (n.host && document.querySelector("base") ? t : t.slice(a)) + r
          : location.protocol + "//" + location.host + t + r;
    try {
      e[s ? "replaceState" : "pushState"](i, "", l), (o.value = i);
    } catch (u) {
      n[s ? "replace" : "assign"](l);
    }
  }
  return (
    o.value ||
      i(
        r.value,
        {
          back: null,
          current: r.value,
          forward: null,
          position: e.length - 1,
          replaced: !0,
          scroll: null,
        },
        !0
      ),
    {
      location: r,
      state: o,
      push: function (t, n) {
        const s = Ms({}, o.value, e.state, { forward: t, scroll: ga() });
        i(s.current, s, !0),
          i(
            t,
            Ms({}, Da(r.value, t, null), { position: s.position + 1 }, n),
            !1
          ),
          (r.value = t);
      },
      replace: function (t, n) {
        i(
          t,
          Ms({}, e.state, Da(o.value.back, t, o.value.forward, !0), n, {
            position: o.value.position,
          }),
          !0
        ),
          (r.value = t);
      },
    }
  );
}
function La(t) {
  const e = Ia((t = ha(t))),
    n = (function (t, e, n, r) {
      let o = [],
        i = [],
        s = null;
      const a = ({ state: i }) => {
        const a = za(t, location),
          l = n.value,
          u = e.value;
        let c = 0;
        if (i) {
          if (((n.value = a), (e.value = i), s && s === l))
            return void (s = null);
          c = u ? i.position - u.position : 0;
        } else r(a);
        o.forEach((t) => {
          t(n.value, l, {
            delta: c,
            type: ca.pop,
            direction: c ? (c > 0 ? fa.forward : fa.back) : fa.unknown,
          });
        });
      };
      function l() {
        if ("hidden" === document.visibilityState) {
          const { history: t } = window;
          if (!t.state) return;
          t.replaceState(Ms({}, t.state, { scroll: ga() }), "");
        }
      }
      return (
        window.addEventListener("popstate", a),
        window.addEventListener("pagehide", l),
        document.addEventListener("visibilitychange", l),
        {
          pauseListeners: function () {
            s = n.value;
          },
          listen: function (t) {
            o.push(t);
            const e = () => {
              const e = o.indexOf(t);
              e > -1 && o.splice(e, 1);
            };
            return i.push(e), e;
          },
          destroy: function () {
            for (const t of i) t();
            (i = []),
              window.removeEventListener("popstate", a),
              window.removeEventListener("pagehide", l),
              document.removeEventListener("visibilitychange", l);
          },
        }
      );
    })(t, e.state, e.location, e.replace);
  const r = Ms(
    {
      location: "",
      base: t,
      go: function (t, e = !0) {
        e || n.pauseListeners(), history.go(t);
      },
      createHref: pa.bind(null, t),
    },
    e,
    n
  );
  return (
    Object.defineProperty(r, "location", {
      enumerable: !0,
      get: () => e.location.value,
    }),
    Object.defineProperty(r, "state", {
      enumerable: !0,
      get: () => e.state.value,
    }),
    r
  );
}
let Ua = (function (t) {
  return (
    (t[(t.Static = 0)] = "Static"),
    (t[(t.Param = 1)] = "Param"),
    (t[(t.Group = 2)] = "Group"),
    t
  );
})({});
var Fa = (function (t) {
  return (
    (t[(t.Static = 0)] = "Static"),
    (t[(t.Param = 1)] = "Param"),
    (t[(t.ParamRegExp = 2)] = "ParamRegExp"),
    (t[(t.ParamRegExpEnd = 3)] = "ParamRegExpEnd"),
    (t[(t.EscapeNext = 4)] = "EscapeNext"),
    t
  );
})(Fa || {});
const Ba = { type: Ua.Static, value: "" },
  $a = /[a-zA-Z0-9_]/;
const Va = "[^/]+?",
  qa = { sensitive: !1, strict: !1, start: !0, end: !0 };
var Ha = (function (t) {
  return (
    (t[(t._multiplier = 10)] = "_multiplier"),
    (t[(t.Root = 90)] = "Root"),
    (t[(t.Segment = 40)] = "Segment"),
    (t[(t.SubSegment = 30)] = "SubSegment"),
    (t[(t.Static = 40)] = "Static"),
    (t[(t.Dynamic = 20)] = "Dynamic"),
    (t[(t.BonusCustomRegExp = 10)] = "BonusCustomRegExp"),
    (t[(t.BonusWildcard = -50)] = "BonusWildcard"),
    (t[(t.BonusRepeatable = -20)] = "BonusRepeatable"),
    (t[(t.BonusOptional = -8)] = "BonusOptional"),
    (t[(t.BonusStrict = 0.7000000000000001)] = "BonusStrict"),
    (t[(t.BonusCaseSensitive = 0.25)] = "BonusCaseSensitive"),
    t
  );
})(Ha || {});
const Ga = /[.+*?^${}()[\]/\\]/g;
function Wa(t, e) {
  let n = 0;
  for (; n < t.length && n < e.length; ) {
    const r = e[n] - t[n];
    if (r) return r;
    n++;
  }
  return t.length < e.length
    ? 1 === t.length && t[0] === Ha.Static + Ha.Segment
      ? -1
      : 1
    : t.length > e.length
    ? 1 === e.length && e[0] === Ha.Static + Ha.Segment
      ? 1
      : -1
    : 0;
}
function Xa(t, e) {
  let n = 0;
  const r = t.score,
    o = e.score;
  for (; n < r.length && n < o.length; ) {
    const t = Wa(r[n], o[n]);
    if (t) return t;
    n++;
  }
  if (1 === Math.abs(o.length - r.length)) {
    if (Ya(r)) return 1;
    if (Ya(o)) return -1;
  }
  return o.length - r.length;
}
function Ya(t) {
  const e = t[t.length - 1];
  return t.length > 0 && e[e.length - 1] < 0;
}
const Ja = { strict: !1, end: !0, sensitive: !1 };
function Ka(t, e, n) {
  const r = (function (t, e) {
      const n = Ms({}, qa, e),
        r = [];
      let o = n.start ? "^" : "";
      const i = [];
      for (const a of t) {
        const t = a.length ? [] : [Ha.Root];
        n.strict && !a.length && (o += "/");
        for (let e = 0; e < a.length; e++) {
          const r = a[e];
          let s = Ha.Segment + (n.sensitive ? Ha.BonusCaseSensitive : 0);
          if (r.type === Ua.Static)
            e || (o += "/"),
              (o += r.value.replace(Ga, "\\$&")),
              (s += Ha.Static);
          else if (r.type === Ua.Param) {
            const { value: t, repeatable: n, optional: l, regexp: u } = r;
            i.push({ name: t, repeatable: n, optional: l });
            const c = u || Va;
            c !== Va && (s += Ha.BonusCustomRegExp);
            let f = n ? `((?:${c})(?:/(?:${c}))*)` : `(${c})`;
            e || (f = l && a.length < 2 ? `(?:/${f})` : "/" + f),
              l && (f += "?"),
              (o += f),
              (s += Ha.Dynamic),
              l && (s += Ha.BonusOptional),
              n && (s += Ha.BonusRepeatable),
              ".*" === c && (s += Ha.BonusWildcard);
          }
          t.push(s);
        }
        r.push(t);
      }
      if (n.strict && n.end) {
        const t = r.length - 1;
        r[t][r[t].length - 1] += Ha.BonusStrict;
      }
      n.strict || (o += "/?"),
        n.end ? (o += "$") : n.strict && !o.endsWith("/") && (o += "(?:/|$)");
      const s = new RegExp(o, n.sensitive ? "" : "i");
      return {
        re: s,
        score: r,
        keys: i,
        parse: function (t) {
          const e = t.match(s),
            n = {};
          if (!e) return null;
          for (let r = 1; r < e.length; r++) {
            const t = e[r] || "",
              o = i[r - 1];
            n[o.name] = t && o.repeatable ? t.split("/") : t;
          }
          return n;
        },
        stringify: function (e) {
          let n = "",
            r = !1;
          for (const o of t) {
            (r && n.endsWith("/")) || (n += "/"), (r = !1);
            for (const t of o)
              if (t.type === Ua.Static) n += t.value;
              else if (t.type === Ua.Param) {
                const { value: i, repeatable: s, optional: a } = t,
                  l = i in e ? e[i] : "";
                if (zs(l) && !s)
                  throw new Error(
                    `Provided param "${i}" is an array but it is not repeatable (* or + modifiers)`
                  );
                const u = zs(l) ? l.join("/") : l;
                if (!u) {
                  if (!a) throw new Error(`Missing required param "${i}"`);
                  o.length < 2 &&
                    (n.endsWith("/") ? (n = n.slice(0, -1)) : (r = !0));
                }
                n += u;
              }
          }
          return n || "/";
        },
      };
    })(
      (function (t) {
        if (!t) return [[]];
        if ("/" === t) return [[Ba]];
        if (!t.startsWith("/")) throw new Error(`Invalid path "${t}"`);
        function e(t) {
          throw new Error(`ERR (${n})/"${u}": ${t}`);
        }
        let n = Fa.Static,
          r = n;
        const o = [];
        let i;
        function s() {
          i && o.push(i), (i = []);
        }
        let a,
          l = 0,
          u = "",
          c = "";
        function f() {
          u &&
            (n === Fa.Static
              ? i.push({ type: Ua.Static, value: u })
              : n === Fa.Param ||
                n === Fa.ParamRegExp ||
                n === Fa.ParamRegExpEnd
              ? (i.length > 1 &&
                  ("*" === a || "+" === a) &&
                  e(
                    `A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`
                  ),
                i.push({
                  type: Ua.Param,
                  value: u,
                  regexp: c,
                  repeatable: "*" === a || "+" === a,
                  optional: "*" === a || "?" === a,
                }))
              : e("Invalid state to consume buffer"),
            (u = ""));
        }
        function h() {
          u += a;
        }
        for (; l < t.length; )
          if (((a = t[l++]), "\\" !== a || n === Fa.ParamRegExp))
            switch (n) {
              case Fa.Static:
                "/" === a
                  ? (u && f(), s())
                  : ":" === a
                  ? (f(), (n = Fa.Param))
                  : h();
                break;
              case Fa.EscapeNext:
                h(), (n = r);
                break;
              case Fa.Param:
                "(" === a
                  ? (n = Fa.ParamRegExp)
                  : $a.test(a)
                  ? h()
                  : (f(),
                    (n = Fa.Static),
                    "*" !== a && "?" !== a && "+" !== a && l--);
                break;
              case Fa.ParamRegExp:
                ")" === a
                  ? "\\" == c[c.length - 1]
                    ? (c = c.slice(0, -1) + a)
                    : (n = Fa.ParamRegExpEnd)
                  : (c += a);
                break;
              case Fa.ParamRegExpEnd:
                f(),
                  (n = Fa.Static),
                  "*" !== a && "?" !== a && "+" !== a && l--,
                  (c = "");
                break;
              default:
                e("Unknown state");
            }
          else (r = n), (n = Fa.EscapeNext);
        return (
          n === Fa.ParamRegExp &&
            e(`Unfinished custom RegExp for param "${u}"`),
          f(),
          s(),
          o
        );
      })(t.path),
      n
    ),
    o = Ms(r, { record: t, parent: e, children: [], alias: [] });
  return e && !o.record.aliasOf == !e.record.aliasOf && e.children.push(o), o;
}
function Za(t, e) {
  const n = [],
    r = new Map();
  function o(t, n, r) {
    const a = !r,
      l = tl(t);
    l.aliasOf = r && r.record;
    const u = Ds(e, t),
      c = [l];
    if ("alias" in t) {
      const e = "string" == typeof t.alias ? [t.alias] : t.alias;
      for (const t of e)
        c.push(
          tl(
            Ms({}, l, {
              components: r ? r.record.components : l.components,
              path: t,
              aliasOf: r ? r.record : l,
            })
          )
        );
    }
    let f, h;
    for (const e of c) {
      const { path: c } = e;
      if (n && "/" !== c[0]) {
        const t = n.record.path,
          r = "/" === t[t.length - 1] ? "" : "/";
        e.path = n.record.path + (c && r + c);
      }
      if (
        ((f = Ka(e, n, u)),
        r
          ? r.alias.push(f)
          : ((h = h || f),
            h !== f && h.alias.push(f),
            a && t.name && !nl(f) && i(t.name)),
        ol(f) && s(f),
        l.children)
      ) {
        const t = l.children;
        for (let e = 0; e < t.length; e++) o(t[e], f, r && r.children[e]);
      }
      r = r || f;
    }
    return h
      ? () => {
          i(h);
        }
      : js;
  }
  function i(t) {
    if (_a(t)) {
      const e = r.get(t);
      e &&
        (r.delete(t),
        n.splice(n.indexOf(e), 1),
        e.children.forEach(i),
        e.alias.forEach(i));
    } else {
      const e = n.indexOf(t);
      e > -1 &&
        (n.splice(e, 1),
        t.record.name && r.delete(t.record.name),
        t.children.forEach(i),
        t.alias.forEach(i));
    }
  }
  function s(t) {
    const e = (function (t, e) {
      let n = 0,
        r = e.length;
      for (; n !== r; ) {
        const o = (n + r) >> 1;
        Xa(t, e[o]) < 0 ? (r = o) : (n = o + 1);
      }
      const o = (function (t) {
        let e = t;
        for (; (e = e.parent); ) if (ol(e) && 0 === Xa(t, e)) return e;
      })(t);
      o && (r = e.lastIndexOf(o, r - 1));
      return r;
    })(t, n);
    n.splice(e, 0, t), t.record.name && !nl(t) && r.set(t.record.name, t);
  }
  return (
    (e = Ds(Ja, e)),
    t.forEach((t) => o(t)),
    {
      addRoute: o,
      resolve: function (t, e) {
        let o,
          i,
          s,
          a = {};
        if ("name" in t && t.name) {
          if (((o = r.get(t.name)), !o))
            throw xa(ba.MATCHER_NOT_FOUND, { location: t });
          (s = o.record.name),
            (a = Ms(
              Qa(
                e.params,
                o.keys
                  .filter((t) => !t.optional)
                  .concat(
                    o.parent ? o.parent.keys.filter((t) => t.optional) : []
                  )
                  .map((t) => t.name)
              ),
              t.params &&
                Qa(
                  t.params,
                  o.keys.map((t) => t.name)
                )
            )),
            (i = o.stringify(a));
        } else if (null != t.path)
          (i = t.path),
            (o = n.find((t) => t.re.test(i))),
            o && ((a = o.parse(i)), (s = o.record.name));
        else {
          if (
            ((o = e.name ? r.get(e.name) : n.find((t) => t.re.test(e.path))),
            !o)
          )
            throw xa(ba.MATCHER_NOT_FOUND, { location: t, currentLocation: e });
          (s = o.record.name),
            (a = Ms({}, e.params, t.params)),
            (i = o.stringify(a));
        }
        const l = [];
        let u = o;
        for (; u; ) l.unshift(u.record), (u = u.parent);
        return { name: s, path: i, params: a, matched: l, meta: rl(l) };
      },
      removeRoute: i,
      clearRoutes: function () {
        (n.length = 0), r.clear();
      },
      getRoutes: function () {
        return n;
      },
      getRecordMatcher: function (t) {
        return r.get(t);
      },
    }
  );
}
function Qa(t, e) {
  const n = {};
  for (const r of e) r in t && (n[r] = t[r]);
  return n;
}
function tl(t) {
  const e = {
    path: t.path,
    redirect: t.redirect,
    name: t.name,
    meta: t.meta || {},
    aliasOf: t.aliasOf,
    beforeEnter: t.beforeEnter,
    props: el(t),
    children: t.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components:
      "components" in t
        ? t.components || null
        : t.component && { default: t.component },
  };
  return Object.defineProperty(e, "mods", { value: {} }), e;
}
function el(t) {
  const e = {},
    n = t.props || !1;
  if ("component" in t) e.default = n;
  else for (const r in t.components) e[r] = "object" == typeof n ? n[r] : n;
  return e;
}
function nl(t) {
  for (; t; ) {
    if (t.record.aliasOf) return !0;
    t = t.parent;
  }
  return !1;
}
function rl(t) {
  return t.reduce((t, e) => Ms(t, e.meta), {});
}
function ol({ record: t }) {
  return !!(
    t.name ||
    (t.components && Object.keys(t.components).length) ||
    t.redirect
  );
}
function il(t) {
  const e = xr(Ta),
    n = xr(Na),
    r = Wo(() => {
      const n = Ae(t.to);
      return e.resolve(n);
    }),
    o = Wo(() => {
      const { matched: t } = r.value,
        { length: e } = t,
        o = t[e - 1],
        i = n.matched;
      if (!o || !i.length) return -1;
      const s = i.findIndex(ia.bind(null, o));
      if (s > -1) return s;
      const a = al(t[e - 2]);
      return e > 1 && al(o) === a && i[i.length - 1].path !== a
        ? i.findIndex(ia.bind(null, t[e - 2]))
        : s;
    }),
    i = Wo(
      () =>
        o.value > -1 &&
        (function (t, e) {
          for (const n in e) {
            const r = e[n],
              o = t[n];
            if ("string" == typeof r) {
              if (r !== o) return !1;
            } else if (
              !zs(o) ||
              o.length !== r.length ||
              r.some((t, e) => t !== o[e])
            )
              return !1;
          }
          return !0;
        })(n.params, r.value.params)
    ),
    s = Wo(
      () =>
        o.value > -1 &&
        o.value === n.matched.length - 1 &&
        sa(n.params, r.value.params)
    );
  return {
    route: r,
    href: Wo(() => r.value.href),
    isActive: i,
    isExactActive: s,
    navigate: function (n = {}) {
      if (
        (function (t) {
          if (t.metaKey || t.altKey || t.ctrlKey || t.shiftKey) return;
          if (t.defaultPrevented) return;
          if (void 0 !== t.button && 0 !== t.button) return;
          if (t.currentTarget && t.currentTarget.getAttribute) {
            const e = t.currentTarget.getAttribute("target");
            if (/\b_blank\b/i.test(e)) return;
          }
          t.preventDefault && t.preventDefault();
          return !0;
        })(n)
      ) {
        const n = e[Ae(t.replace) ? "replace" : "push"](Ae(t.to)).catch(js);
        return (
          t.viewTransition &&
            "undefined" != typeof document &&
            "startViewTransition" in document &&
            document.startViewTransition(() => n),
          n
        );
      }
      return Promise.resolve();
    },
  };
}
const sl = Sn({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: { type: [String, Object], required: !0 },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: { type: String, default: "page" },
    viewTransition: Boolean,
  },
  useLink: il,
  setup(t, { slots: e }) {
    const n = fe(il(t)),
      { options: r } = xr(Ta),
      o = Wo(() => ({
        [ll(t.activeClass, r.linkActiveClass, "router-link-active")]:
          n.isActive,
        [ll(
          t.exactActiveClass,
          r.linkExactActiveClass,
          "router-link-exact-active"
        )]: n.isExactActive,
      }));
    return () => {
      const r = e.default && (1 === (i = e.default(n)).length ? i[0] : i);
      var i;
      return t.custom
        ? r
        : Xo(
            "a",
            {
              "aria-current": n.isExactActive ? t.ariaCurrentValue : null,
              href: n.href,
              onClick: n.navigate,
              class: o.value,
            },
            r
          );
    };
  },
});
function al(t) {
  return t ? (t.aliasOf ? t.aliasOf.path : t.path) : "";
}
const ll = (t, e, n) => (null != t ? t : null != e ? e : n);
function ul(t, e) {
  if (!t) return null;
  const n = t(e);
  return 1 === n.length ? n[0] : n;
}
const cl = Sn({
  name: "RouterView",
  inheritAttrs: !1,
  props: { name: { type: String, default: "default" }, route: Object },
  compatConfig: { MODE: 3 },
  setup(t, { attrs: e, slots: n }) {
    const r = xr(Pa),
      o = Wo(() => t.route || r.value),
      i = xr(Oa, 0),
      s = Wo(() => {
        let t = Ae(i);
        const { matched: e } = o.value;
        let n;
        for (; (n = e[t]) && !n.components; ) t++;
        return t;
      }),
      a = Wo(() => o.value.matched[s.value]);
    wr(
      Oa,
      Wo(() => s.value + 1)
    ),
      wr(Aa, a),
      wr(Pa, o);
    const l = Se();
    return (
      Er(
        () => [l.value, a.value, t.name],
        ([t, e, n], [r, o, i]) => {
          e &&
            ((e.instances[n] = t),
            o &&
              o !== e &&
              t &&
              t === r &&
              (e.leaveGuards.size || (e.leaveGuards = o.leaveGuards),
              e.updateGuards.size || (e.updateGuards = o.updateGuards))),
            !t ||
              !e ||
              (o && ia(e, o) && r) ||
              (e.enterCallbacks[n] || []).forEach((e) => e(t));
        },
        { flush: "post" }
      ),
      () => {
        const r = o.value,
          i = t.name,
          s = a.value,
          u = s && s.components[i];
        if (!u) return ul(n.default, { Component: u, route: r });
        const c = s.props[i],
          f = c
            ? !0 === c
              ? r.params
              : "function" == typeof c
              ? c(r)
              : c
            : null,
          h = Xo(
            u,
            Ms({}, f, e, {
              onVnodeUnmounted: (t) => {
                t.component.isUnmounted && (s.instances[i] = null);
              },
              ref: l,
            })
          );
        return ul(n.default, { Component: h, route: r }) || h;
      }
    );
  },
});
const fl = Ts("ui", () => {
    const t = Se(!1),
      e = Se(!0),
      n = Se("info"),
      r = Se("graph"),
      o = Se([]),
      i = Se([]),
      s = Se({});
    let a = 0;
    const l = Wo(() => (t.value ? "dark" : "light"));
    function u(t) {
      const e = o.value.findIndex((e) => e.id === t);
      e > -1 && o.value.splice(e, 1);
    }
    return {
      isDark: t,
      sidebarOpen: e,
      activeTab: n,
      activeView: r,
      toasts: o,
      openPanels: i,
      panelData: s,
      theme: l,
      initializeTheme: function () {
        const e = localStorage.getItem("theme");
        (t.value = "light" !== e),
          document.body.classList.toggle("dark", t.value);
      },
      toggleTheme: function () {
        (t.value = !t.value),
          localStorage.setItem("theme", l.value),
          document.body.classList.toggle("dark", t.value);
      },
      toggleSidebar: function () {
        e.value = !e.value;
      },
      switchTab: function (t) {
        n.value = t;
      },
      switchView: function (t) {
        ["graph", "dashboard"].includes(t) && (r.value = t);
      },
      showToast: function (t, e, n = "info", r = 4e3) {
        const i = a++;
        o.value.push({ id: i, title: t, message: e, type: n }),
          r > 0 &&
            setTimeout(() => {
              u(i);
            }, r);
      },
      removeToast: u,
      togglePanel: function (t, e = null) {
        const n = i.value.indexOf(t);
        n > -1
          ? (i.value.splice(n, 1), delete s.value[t])
          : (i.value.push(t), e && (s.value[t] = e));
      },
      closePanel: function (t) {
        const e = i.value.indexOf(t);
        e > -1 && (i.value.splice(e, 1), delete s.value[t]);
      },
      closeAllPanels: function () {
        (i.value = []), (s.value = {});
      },
    };
  }),
  hl = ["data-lucide"],
  dl = {
    __name: "Icon",
    props: {
      name: { type: String, required: !0 },
      size: { type: String, default: "1rem" },
    },
    setup(t) {
      const e = t,
        n = Wo(() => ({ width: e.size, height: e.size }));
      function r() {
        window.lucide && window.lucide.createIcons();
      }
      return (
        Bn(() => {
          Xe(() => r());
        }),
        Vn(() => {
          Xe(() => r());
        }),
        Er(
          () => e.name,
          () => {
            Xe(() => r());
          }
        ),
        (e, r) => (
          fo(),
          vo("i", { "data-lucide": t.name, style: U(n.value) }, null, 12, hl)
        )
      );
    },
  },
  pl = (t, e) => {
    const n = t.__vccOpts || t;
    for (const [r, o] of e) n[r] = o;
    return n;
  },
  gl = { class: "toast-container" },
  vl = { class: "toast-content" },
  yl = { class: "toast-title" },
  ml = { key: 0, class: "toast-message" },
  _l = ["onClick"],
  bl = pl(
    {
      __name: "ToastContainer",
      setup(t) {
        const e = fl(),
          n = {
            success: "check-circle",
            error: "alert-circle",
            warning: "alert-triangle",
            info: "info",
          };
        return (t, r) => (
          fo(),
          vo("div", gl, [
            ko(
              qi,
              { name: "toast" },
              {
                default: on(() => [
                  (fo(!0),
                  vo(
                    io,
                    null,
                    Qn(
                      Ae(e).toasts,
                      (t) => (
                        fo(),
                        vo(
                          "div",
                          { key: t.id, class: q(["toast", t.type]) },
                          [
                            ko(
                              dl,
                              { name: n[t.type], class: "toast-icon" },
                              null,
                              8,
                              ["name"]
                            ),
                            xo("div", vl, [
                              xo("div", yl, J(t.title), 1),
                              t.message
                                ? (fo(), vo("div", ml, J(t.message), 1))
                                : Ao("", !0),
                            ]),
                            xo(
                              "button",
                              {
                                onClick: (n) => Ae(e).removeToast(t.id),
                                class: "toast-close",
                              },
                              [ko(dl, { name: "x", size: "1rem" })],
                              8,
                              _l
                            ),
                          ],
                          2
                        )
                      )
                    ),
                    128
                  )),
                ]),
                _: 1,
              }
            ),
          ])
        );
      },
    },
    [["__scopeId", "data-v-d30a03a9"]]
  ),
  wl = { id: "app-container" },
  xl = {
    __name: "App",
    setup(t) {
      const e = fl();
      return (
        Bn(() => {
          e.initializeTheme();
        }),
        (t, e) => (fo(), vo("div", wl, [ko(bl), ko(Ae(cl))]))
      );
    },
  };
function kl(t, e) {
  return function () {
    return t.apply(e, arguments);
  };
}
const { toString: Sl } = Object.prototype,
  { getPrototypeOf: El } = Object,
  { iterator: Cl, toStringTag: Al } = Symbol,
  Ol = ((t) => (e) => {
    const n = Sl.call(e);
    return t[n] || (t[n] = n.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  Tl = (t) => ((t = t.toLowerCase()), (e) => Ol(e) === t),
  Nl = (t) => (e) => typeof e === t,
  { isArray: Pl } = Array,
  Ml = Nl("undefined");
function Rl(t) {
  return (
    null !== t &&
    !Ml(t) &&
    null !== t.constructor &&
    !Ml(t.constructor) &&
    Dl(t.constructor.isBuffer) &&
    t.constructor.isBuffer(t)
  );
}
const jl = Tl("ArrayBuffer");
const zl = Nl("string"),
  Dl = Nl("function"),
  Il = Nl("number"),
  Ll = (t) => null !== t && "object" == typeof t,
  Ul = (t) => {
    if ("object" !== Ol(t)) return !1;
    const e = El(t);
    return !(
      (null !== e &&
        e !== Object.prototype &&
        null !== Object.getPrototypeOf(e)) ||
      Al in t ||
      Cl in t
    );
  },
  Fl = Tl("Date"),
  Bl = Tl("File"),
  $l = Tl("Blob"),
  Vl = Tl("FileList"),
  ql = Tl("URLSearchParams"),
  [Hl, Gl, Wl, Xl] = ["ReadableStream", "Request", "Response", "Headers"].map(
    Tl
  );
function Yl(t, e, { allOwnKeys: n = !1 } = {}) {
  if (null == t) return;
  let r, o;
  if (("object" != typeof t && (t = [t]), Pl(t)))
    for (r = 0, o = t.length; r < o; r++) e.call(null, t[r], r, t);
  else {
    if (Rl(t)) return;
    const o = n ? Object.getOwnPropertyNames(t) : Object.keys(t),
      i = o.length;
    let s;
    for (r = 0; r < i; r++) (s = o[r]), e.call(null, t[s], s, t);
  }
}
function Jl(t, e) {
  if (Rl(t)) return null;
  e = e.toLowerCase();
  const n = Object.keys(t);
  let r,
    o = n.length;
  for (; o-- > 0; ) if (((r = n[o]), e === r.toLowerCase())) return r;
  return null;
}
const Kl =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof self
      ? self
      : "undefined" != typeof window
      ? window
      : global,
  Zl = (t) => !Ml(t) && t !== Kl;
const Ql = (
    (t) => (e) =>
      t && e instanceof t
  )("undefined" != typeof Uint8Array && El(Uint8Array)),
  tu = Tl("HTMLFormElement"),
  eu = (
    ({ hasOwnProperty: t }) =>
    (e, n) =>
      t.call(e, n)
  )(Object.prototype),
  nu = Tl("RegExp"),
  ru = (t, e) => {
    const n = Object.getOwnPropertyDescriptors(t),
      r = {};
    Yl(n, (n, o) => {
      let i;
      !1 !== (i = e(n, o, t)) && (r[o] = i || n);
    }),
      Object.defineProperties(t, r);
  };
const ou = Tl("AsyncFunction"),
  iu =
    ((su = "function" == typeof setImmediate),
    (au = Dl(Kl.postMessage)),
    su
      ? setImmediate
      : au
      ? ((lu = `axios@${Math.random()}`),
        (uu = []),
        Kl.addEventListener(
          "message",
          ({ source: t, data: e }) => {
            t === Kl && e === lu && uu.length && uu.shift()();
          },
          !1
        ),
        (t) => {
          uu.push(t), Kl.postMessage(lu, "*");
        })
      : (t) => setTimeout(t));
var su, au, lu, uu;
const cu =
    "undefined" != typeof queueMicrotask
      ? queueMicrotask.bind(Kl)
      : ("undefined" != typeof process && process.nextTick) || iu,
  fu = {
    isArray: Pl,
    isArrayBuffer: jl,
    isBuffer: Rl,
    isFormData: (t) => {
      let e;
      return (
        t &&
        (("function" == typeof FormData && t instanceof FormData) ||
          (Dl(t.append) &&
            ("formdata" === (e = Ol(t)) ||
              ("object" === e &&
                Dl(t.toString) &&
                "[object FormData]" === t.toString()))))
      );
    },
    isArrayBufferView: function (t) {
      let e;
      return (
        (e =
          "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
            ? ArrayBuffer.isView(t)
            : t && t.buffer && jl(t.buffer)),
        e
      );
    },
    isString: zl,
    isNumber: Il,
    isBoolean: (t) => !0 === t || !1 === t,
    isObject: Ll,
    isPlainObject: Ul,
    isEmptyObject: (t) => {
      if (!Ll(t) || Rl(t)) return !1;
      try {
        return (
          0 === Object.keys(t).length &&
          Object.getPrototypeOf(t) === Object.prototype
        );
      } catch (cw) {
        return !1;
      }
    },
    isReadableStream: Hl,
    isRequest: Gl,
    isResponse: Wl,
    isHeaders: Xl,
    isUndefined: Ml,
    isDate: Fl,
    isFile: Bl,
    isBlob: $l,
    isRegExp: nu,
    isFunction: Dl,
    isStream: (t) => Ll(t) && Dl(t.pipe),
    isURLSearchParams: ql,
    isTypedArray: Ql,
    isFileList: Vl,
    forEach: Yl,
    merge: function t() {
      const { caseless: e, skipUndefined: n } = (Zl(this) && this) || {},
        r = {},
        o = (o, i) => {
          const s = (e && Jl(r, i)) || i;
          Ul(r[s]) && Ul(o)
            ? (r[s] = t(r[s], o))
            : Ul(o)
            ? (r[s] = t({}, o))
            : Pl(o)
            ? (r[s] = o.slice())
            : (n && Ml(o)) || (r[s] = o);
        };
      for (let i = 0, s = arguments.length; i < s; i++)
        arguments[i] && Yl(arguments[i], o);
      return r;
    },
    extend: (t, e, n, { allOwnKeys: r } = {}) => (
      Yl(
        e,
        (e, r) => {
          n && Dl(e) ? (t[r] = kl(e, n)) : (t[r] = e);
        },
        { allOwnKeys: r }
      ),
      t
    ),
    trim: (t) =>
      t.trim ? t.trim() : t.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
    stripBOM: (t) => (65279 === t.charCodeAt(0) && (t = t.slice(1)), t),
    inherits: (t, e, n, r) => {
      (t.prototype = Object.create(e.prototype, r)),
        (t.prototype.constructor = t),
        Object.defineProperty(t, "super", { value: e.prototype }),
        n && Object.assign(t.prototype, n);
    },
    toFlatObject: (t, e, n, r) => {
      let o, i, s;
      const a = {};
      if (((e = e || {}), null == t)) return e;
      do {
        for (o = Object.getOwnPropertyNames(t), i = o.length; i-- > 0; )
          (s = o[i]),
            (r && !r(s, t, e)) || a[s] || ((e[s] = t[s]), (a[s] = !0));
        t = !1 !== n && El(t);
      } while (t && (!n || n(t, e)) && t !== Object.prototype);
      return e;
    },
    kindOf: Ol,
    kindOfTest: Tl,
    endsWith: (t, e, n) => {
      (t = String(t)),
        (void 0 === n || n > t.length) && (n = t.length),
        (n -= e.length);
      const r = t.indexOf(e, n);
      return -1 !== r && r === n;
    },
    toArray: (t) => {
      if (!t) return null;
      if (Pl(t)) return t;
      let e = t.length;
      if (!Il(e)) return null;
      const n = new Array(e);
      for (; e-- > 0; ) n[e] = t[e];
      return n;
    },
    forEachEntry: (t, e) => {
      const n = (t && t[Cl]).call(t);
      let r;
      for (; (r = n.next()) && !r.done; ) {
        const n = r.value;
        e.call(t, n[0], n[1]);
      }
    },
    matchAll: (t, e) => {
      let n;
      const r = [];
      for (; null !== (n = t.exec(e)); ) r.push(n);
      return r;
    },
    isHTMLForm: tu,
    hasOwnProperty: eu,
    hasOwnProp: eu,
    reduceDescriptors: ru,
    freezeMethods: (t) => {
      ru(t, (e, n) => {
        if (Dl(t) && -1 !== ["arguments", "caller", "callee"].indexOf(n))
          return !1;
        const r = t[n];
        Dl(r) &&
          ((e.enumerable = !1),
          "writable" in e
            ? (e.writable = !1)
            : e.set ||
              (e.set = () => {
                throw Error("Can not rewrite read-only method '" + n + "'");
              }));
      });
    },
    toObjectSet: (t, e) => {
      const n = {},
        r = (t) => {
          t.forEach((t) => {
            n[t] = !0;
          });
        };
      return Pl(t) ? r(t) : r(String(t).split(e)), n;
    },
    toCamelCase: (t) =>
      t.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (t, e, n) {
        return e.toUpperCase() + n;
      }),
    noop: () => {},
    toFiniteNumber: (t, e) => (null != t && Number.isFinite((t = +t)) ? t : e),
    findKey: Jl,
    global: Kl,
    isContextDefined: Zl,
    isSpecCompliantForm: function (t) {
      return !!(t && Dl(t.append) && "FormData" === t[Al] && t[Cl]);
    },
    toJSONObject: (t) => {
      const e = new Array(10),
        n = (t, r) => {
          if (Ll(t)) {
            if (e.indexOf(t) >= 0) return;
            if (Rl(t)) return t;
            if (!("toJSON" in t)) {
              e[r] = t;
              const o = Pl(t) ? [] : {};
              return (
                Yl(t, (t, e) => {
                  const i = n(t, r + 1);
                  !Ml(i) && (o[e] = i);
                }),
                (e[r] = void 0),
                o
              );
            }
          }
          return t;
        };
      return n(t, 0);
    },
    isAsyncFn: ou,
    isThenable: (t) => t && (Ll(t) || Dl(t)) && Dl(t.then) && Dl(t.catch),
    setImmediate: iu,
    asap: cu,
    isIterable: (t) => null != t && Dl(t[Cl]),
  };
function hu(t, e, n, r, o) {
  Error.call(this),
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : (this.stack = new Error().stack),
    (this.message = t),
    (this.name = "AxiosError"),
    e && (this.code = e),
    n && (this.config = n),
    r && (this.request = r),
    o && ((this.response = o), (this.status = o.status ? o.status : null));
}
fu.inherits(hu, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: fu.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    };
  },
});
const du = hu.prototype,
  pu = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
].forEach((t) => {
  pu[t] = { value: t };
}),
  Object.defineProperties(hu, pu),
  Object.defineProperty(du, "isAxiosError", { value: !0 }),
  (hu.from = (t, e, n, r, o, i) => {
    const s = Object.create(du);
    fu.toFlatObject(
      t,
      s,
      function (t) {
        return t !== Error.prototype;
      },
      (t) => "isAxiosError" !== t
    );
    const a = t && t.message ? t.message : "Error",
      l = null == e && t ? t.code : e;
    return (
      hu.call(s, a, l, n, r, o),
      t &&
        null == s.cause &&
        Object.defineProperty(s, "cause", { value: t, configurable: !0 }),
      (s.name = (t && t.name) || "Error"),
      i && Object.assign(s, i),
      s
    );
  });
function gu(t) {
  return fu.isPlainObject(t) || fu.isArray(t);
}
function vu(t) {
  return fu.endsWith(t, "[]") ? t.slice(0, -2) : t;
}
function yu(t, e, n) {
  return t
    ? t
        .concat(e)
        .map(function (t, e) {
          return (t = vu(t)), !n && e ? "[" + t + "]" : t;
        })
        .join(n ? "." : "")
    : e;
}
const mu = fu.toFlatObject(fu, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function _u(t, e, n) {
  if (!fu.isObject(t)) throw new TypeError("target must be an object");
  e = e || new FormData();
  const r = (n = fu.toFlatObject(
      n,
      { metaTokens: !0, dots: !1, indexes: !1 },
      !1,
      function (t, e) {
        return !fu.isUndefined(e[t]);
      }
    )).metaTokens,
    o = n.visitor || u,
    i = n.dots,
    s = n.indexes,
    a =
      (n.Blob || ("undefined" != typeof Blob && Blob)) &&
      fu.isSpecCompliantForm(e);
  if (!fu.isFunction(o)) throw new TypeError("visitor must be a function");
  function l(t) {
    if (null === t) return "";
    if (fu.isDate(t)) return t.toISOString();
    if (fu.isBoolean(t)) return t.toString();
    if (!a && fu.isBlob(t))
      throw new hu("Blob is not supported. Use a Buffer instead.");
    return fu.isArrayBuffer(t) || fu.isTypedArray(t)
      ? a && "function" == typeof Blob
        ? new Blob([t])
        : Buffer.from(t)
      : t;
  }
  function u(t, n, o) {
    let a = t;
    if (t && !o && "object" == typeof t)
      if (fu.endsWith(n, "{}"))
        (n = r ? n : n.slice(0, -2)), (t = JSON.stringify(t));
      else if (
        (fu.isArray(t) &&
          (function (t) {
            return fu.isArray(t) && !t.some(gu);
          })(t)) ||
        ((fu.isFileList(t) || fu.endsWith(n, "[]")) && (a = fu.toArray(t)))
      )
        return (
          (n = vu(n)),
          a.forEach(function (t, r) {
            !fu.isUndefined(t) &&
              null !== t &&
              e.append(
                !0 === s ? yu([n], r, i) : null === s ? n : n + "[]",
                l(t)
              );
          }),
          !1
        );
    return !!gu(t) || (e.append(yu(o, n, i), l(t)), !1);
  }
  const c = [],
    f = Object.assign(mu, {
      defaultVisitor: u,
      convertValue: l,
      isVisitable: gu,
    });
  if (!fu.isObject(t)) throw new TypeError("data must be an object");
  return (
    (function t(n, r) {
      if (!fu.isUndefined(n)) {
        if (-1 !== c.indexOf(n))
          throw Error("Circular reference detected in " + r.join("."));
        c.push(n),
          fu.forEach(n, function (n, i) {
            !0 ===
              (!(fu.isUndefined(n) || null === n) &&
                o.call(e, n, fu.isString(i) ? i.trim() : i, r, f)) &&
              t(n, r ? r.concat(i) : [i]);
          }),
          c.pop();
      }
    })(t),
    e
  );
}
function bu(t) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  };
  return encodeURIComponent(t).replace(/[!'()~]|%20|%00/g, function (t) {
    return e[t];
  });
}
function wu(t, e) {
  (this._pairs = []), t && _u(t, this, e);
}
const xu = wu.prototype;
function ku(t) {
  return encodeURIComponent(t)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+");
}
function Su(t, e, n) {
  if (!e) return t;
  const r = (n && n.encode) || ku;
  fu.isFunction(n) && (n = { serialize: n });
  const o = n && n.serialize;
  let i;
  if (
    ((i = o
      ? o(e, n)
      : fu.isURLSearchParams(e)
      ? e.toString()
      : new wu(e, n).toString(r)),
    i)
  ) {
    const e = t.indexOf("#");
    -1 !== e && (t = t.slice(0, e)),
      (t += (-1 === t.indexOf("?") ? "?" : "&") + i);
  }
  return t;
}
(xu.append = function (t, e) {
  this._pairs.push([t, e]);
}),
  (xu.toString = function (t) {
    const e = t
      ? function (e) {
          return t.call(this, e, bu);
        }
      : bu;
    return this._pairs
      .map(function (t) {
        return e(t[0]) + "=" + e(t[1]);
      }, "")
      .join("&");
  });
class Eu {
  constructor() {
    this.handlers = [];
  }
  use(t, e, n) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: e,
        synchronous: !!n && n.synchronous,
        runWhen: n ? n.runWhen : null,
      }),
      this.handlers.length - 1
    );
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
    this.handlers && (this.handlers = []);
  }
  forEach(t) {
    fu.forEach(this.handlers, function (e) {
      null !== e && t(e);
    });
  }
}
const Cu = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
  },
  Au = {
    isBrowser: !0,
    classes: {
      URLSearchParams:
        "undefined" != typeof URLSearchParams ? URLSearchParams : wu,
      FormData: "undefined" != typeof FormData ? FormData : null,
      Blob: "undefined" != typeof Blob ? Blob : null,
    },
    protocols: ["http", "https", "file", "blob", "url", "data"],
  },
  Ou = "undefined" != typeof window && "undefined" != typeof document,
  Tu = ("object" == typeof navigator && navigator) || void 0,
  Nu =
    Ou &&
    (!Tu || ["ReactNative", "NativeScript", "NS"].indexOf(Tu.product) < 0),
  Pu =
    "undefined" != typeof WorkerGlobalScope &&
    self instanceof WorkerGlobalScope &&
    "function" == typeof self.importScripts,
  Mu = (Ou && window.location.href) || "http://localhost",
  Ru = {
    ...Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          hasBrowserEnv: Ou,
          hasStandardBrowserEnv: Nu,
          hasStandardBrowserWebWorkerEnv: Pu,
          navigator: Tu,
          origin: Mu,
        },
        Symbol.toStringTag,
        { value: "Module" }
      )
    ),
    ...Au,
  };
function ju(t) {
  function e(t, n, r, o) {
    let i = t[o++];
    if ("__proto__" === i) return !0;
    const s = Number.isFinite(+i),
      a = o >= t.length;
    if (((i = !i && fu.isArray(r) ? r.length : i), a))
      return fu.hasOwnProp(r, i) ? (r[i] = [r[i], n]) : (r[i] = n), !s;
    (r[i] && fu.isObject(r[i])) || (r[i] = []);
    return (
      e(t, n, r[i], o) &&
        fu.isArray(r[i]) &&
        (r[i] = (function (t) {
          const e = {},
            n = Object.keys(t);
          let r;
          const o = n.length;
          let i;
          for (r = 0; r < o; r++) (i = n[r]), (e[i] = t[i]);
          return e;
        })(r[i])),
      !s
    );
  }
  if (fu.isFormData(t) && fu.isFunction(t.entries)) {
    const n = {};
    return (
      fu.forEachEntry(t, (t, r) => {
        e(
          (function (t) {
            return fu
              .matchAll(/\w+|\[(\w*)]/g, t)
              .map((t) => ("[]" === t[0] ? "" : t[1] || t[0]));
          })(t),
          r,
          n,
          0
        );
      }),
      n
    );
  }
  return null;
}
const zu = {
  transitional: Cu,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function (t, e) {
      const n = e.getContentType() || "",
        r = n.indexOf("application/json") > -1,
        o = fu.isObject(t);
      o && fu.isHTMLForm(t) && (t = new FormData(t));
      if (fu.isFormData(t)) return r ? JSON.stringify(ju(t)) : t;
      if (
        fu.isArrayBuffer(t) ||
        fu.isBuffer(t) ||
        fu.isStream(t) ||
        fu.isFile(t) ||
        fu.isBlob(t) ||
        fu.isReadableStream(t)
      )
        return t;
      if (fu.isArrayBufferView(t)) return t.buffer;
      if (fu.isURLSearchParams(t))
        return (
          e.setContentType(
            "application/x-www-form-urlencoded;charset=utf-8",
            !1
          ),
          t.toString()
        );
      let i;
      if (o) {
        if (n.indexOf("application/x-www-form-urlencoded") > -1)
          return (function (t, e) {
            return _u(t, new Ru.classes.URLSearchParams(), {
              visitor: function (t, e, n, r) {
                return Ru.isNode && fu.isBuffer(t)
                  ? (this.append(e, t.toString("base64")), !1)
                  : r.defaultVisitor.apply(this, arguments);
              },
              ...e,
            });
          })(t, this.formSerializer).toString();
        if ((i = fu.isFileList(t)) || n.indexOf("multipart/form-data") > -1) {
          const e = this.env && this.env.FormData;
          return _u(
            i ? { "files[]": t } : t,
            e && new e(),
            this.formSerializer
          );
        }
      }
      return o || r
        ? (e.setContentType("application/json", !1),
          (function (t, e, n) {
            if (fu.isString(t))
              try {
                return (e || JSON.parse)(t), fu.trim(t);
              } catch (cw) {
                if ("SyntaxError" !== cw.name) throw cw;
              }
            return (n || JSON.stringify)(t);
          })(t))
        : t;
    },
  ],
  transformResponse: [
    function (t) {
      const e = this.transitional || zu.transitional,
        n = e && e.forcedJSONParsing,
        r = "json" === this.responseType;
      if (fu.isResponse(t) || fu.isReadableStream(t)) return t;
      if (t && fu.isString(t) && ((n && !this.responseType) || r)) {
        const n = !(e && e.silentJSONParsing) && r;
        try {
          return JSON.parse(t, this.parseReviver);
        } catch (cw) {
          if (n) {
            if ("SyntaxError" === cw.name)
              throw hu.from(cw, hu.ERR_BAD_RESPONSE, this, null, this.response);
            throw cw;
          }
        }
      }
      return t;
    },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: Ru.classes.FormData, Blob: Ru.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
};
fu.forEach(["delete", "get", "head", "post", "put", "patch"], (t) => {
  zu.headers[t] = {};
});
const Du = fu.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]),
  Iu = Symbol("internals");
function Lu(t) {
  return t && String(t).trim().toLowerCase();
}
function Uu(t) {
  return !1 === t || null == t ? t : fu.isArray(t) ? t.map(Uu) : String(t);
}
function Fu(t, e, n, r, o) {
  return fu.isFunction(r)
    ? r.call(this, e, n)
    : (o && (e = n),
      fu.isString(e)
        ? fu.isString(r)
          ? -1 !== e.indexOf(r)
          : fu.isRegExp(r)
          ? r.test(e)
          : void 0
        : void 0);
}
let Bu = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, e, n) {
    const r = this;
    function o(t, e, n) {
      const o = Lu(e);
      if (!o) throw new Error("header name must be a non-empty string");
      const i = fu.findKey(r, o);
      (!i || void 0 === r[i] || !0 === n || (void 0 === n && !1 !== r[i])) &&
        (r[i || e] = Uu(t));
    }
    const i = (t, e) => fu.forEach(t, (t, n) => o(t, n, e));
    if (fu.isPlainObject(t) || t instanceof this.constructor) i(t, e);
    else if (
      fu.isString(t) &&
      (t = t.trim()) &&
      !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(t.trim())
    )
      i(
        ((t) => {
          const e = {};
          let n, r, o;
          return (
            t &&
              t.split("\n").forEach(function (t) {
                (o = t.indexOf(":")),
                  (n = t.substring(0, o).trim().toLowerCase()),
                  (r = t.substring(o + 1).trim()),
                  !n ||
                    (e[n] && Du[n]) ||
                    ("set-cookie" === n
                      ? e[n]
                        ? e[n].push(r)
                        : (e[n] = [r])
                      : (e[n] = e[n] ? e[n] + ", " + r : r));
              }),
            e
          );
        })(t),
        e
      );
    else if (fu.isObject(t) && fu.isIterable(t)) {
      let n,
        r,
        o = {};
      for (const e of t) {
        if (!fu.isArray(e))
          throw TypeError("Object iterator must return a key-value pair");
        o[(r = e[0])] = (n = o[r])
          ? fu.isArray(n)
            ? [...n, e[1]]
            : [n, e[1]]
          : e[1];
      }
      i(o, e);
    } else null != t && o(e, t, n);
    return this;
  }
  get(t, e) {
    if ((t = Lu(t))) {
      const n = fu.findKey(this, t);
      if (n) {
        const t = this[n];
        if (!e) return t;
        if (!0 === e)
          return (function (t) {
            const e = Object.create(null),
              n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
            let r;
            for (; (r = n.exec(t)); ) e[r[1]] = r[2];
            return e;
          })(t);
        if (fu.isFunction(e)) return e.call(this, t, n);
        if (fu.isRegExp(e)) return e.exec(t);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, e) {
    if ((t = Lu(t))) {
      const n = fu.findKey(this, t);
      return !(!n || void 0 === this[n] || (e && !Fu(0, this[n], n, e)));
    }
    return !1;
  }
  delete(t, e) {
    const n = this;
    let r = !1;
    function o(t) {
      if ((t = Lu(t))) {
        const o = fu.findKey(n, t);
        !o || (e && !Fu(0, n[o], o, e)) || (delete n[o], (r = !0));
      }
    }
    return fu.isArray(t) ? t.forEach(o) : o(t), r;
  }
  clear(t) {
    const e = Object.keys(this);
    let n = e.length,
      r = !1;
    for (; n--; ) {
      const o = e[n];
      (t && !Fu(0, this[o], o, t, !0)) || (delete this[o], (r = !0));
    }
    return r;
  }
  normalize(t) {
    const e = this,
      n = {};
    return (
      fu.forEach(this, (r, o) => {
        const i = fu.findKey(n, o);
        if (i) return (e[i] = Uu(r)), void delete e[o];
        const s = t
          ? (function (t) {
              return t
                .trim()
                .toLowerCase()
                .replace(/([a-z\d])(\w*)/g, (t, e, n) => e.toUpperCase() + n);
            })(o)
          : String(o).trim();
        s !== o && delete e[o], (e[s] = Uu(r)), (n[s] = !0);
      }),
      this
    );
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const e = Object.create(null);
    return (
      fu.forEach(this, (n, r) => {
        null != n && !1 !== n && (e[r] = t && fu.isArray(n) ? n.join(", ") : n);
      }),
      e
    );
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON())
      .map(([t, e]) => t + ": " + e)
      .join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...e) {
    const n = new this(t);
    return e.forEach((t) => n.set(t)), n;
  }
  static accessor(t) {
    const e = (this[Iu] = this[Iu] = { accessors: {} }).accessors,
      n = this.prototype;
    function r(t) {
      const r = Lu(t);
      e[r] ||
        (!(function (t, e) {
          const n = fu.toCamelCase(" " + e);
          ["get", "set", "has"].forEach((r) => {
            Object.defineProperty(t, r + n, {
              value: function (t, n, o) {
                return this[r].call(this, e, t, n, o);
              },
              configurable: !0,
            });
          });
        })(n, t),
        (e[r] = !0));
    }
    return fu.isArray(t) ? t.forEach(r) : r(t), this;
  }
};
function $u(t, e) {
  const n = this || zu,
    r = e || n,
    o = Bu.from(r.headers);
  let i = r.data;
  return (
    fu.forEach(t, function (t) {
      i = t.call(n, i, o.normalize(), e ? e.status : void 0);
    }),
    o.normalize(),
    i
  );
}
function Vu(t) {
  return !(!t || !t.__CANCEL__);
}
function qu(t, e, n) {
  hu.call(this, null == t ? "canceled" : t, hu.ERR_CANCELED, e, n),
    (this.name = "CanceledError");
}
function Hu(t, e, n) {
  const r = n.config.validateStatus;
  n.status && r && !r(n.status)
    ? e(
        new hu(
          "Request failed with status code " + n.status,
          [hu.ERR_BAD_REQUEST, hu.ERR_BAD_RESPONSE][
            Math.floor(n.status / 100) - 4
          ],
          n.config,
          n.request,
          n
        )
      )
    : t(n);
}
Bu.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]),
  fu.reduceDescriptors(Bu.prototype, ({ value: t }, e) => {
    let n = e[0].toUpperCase() + e.slice(1);
    return {
      get: () => t,
      set(t) {
        this[n] = t;
      },
    };
  }),
  fu.freezeMethods(Bu),
  fu.inherits(qu, hu, { __CANCEL__: !0 });
const Gu = (t, e, n = 3) => {
    let r = 0;
    const o = (function (t, e) {
      t = t || 10;
      const n = new Array(t),
        r = new Array(t);
      let o,
        i = 0,
        s = 0;
      return (
        (e = void 0 !== e ? e : 1e3),
        function (a) {
          const l = Date.now(),
            u = r[s];
          o || (o = l), (n[i] = a), (r[i] = l);
          let c = s,
            f = 0;
          for (; c !== i; ) (f += n[c++]), (c %= t);
          if (((i = (i + 1) % t), i === s && (s = (s + 1) % t), l - o < e))
            return;
          const h = u && l - u;
          return h ? Math.round((1e3 * f) / h) : void 0;
        }
      );
    })(50, 250);
    return (function (t, e) {
      let n,
        r,
        o = 0,
        i = 1e3 / e;
      const s = (e, i = Date.now()) => {
        (o = i), (n = null), r && (clearTimeout(r), (r = null)), t(...e);
      };
      return [
        (...t) => {
          const e = Date.now(),
            a = e - o;
          a >= i
            ? s(t, e)
            : ((n = t),
              r ||
                (r = setTimeout(() => {
                  (r = null), s(n);
                }, i - a)));
        },
        () => n && s(n),
      ];
    })((n) => {
      const i = n.loaded,
        s = n.lengthComputable ? n.total : void 0,
        a = i - r,
        l = o(a);
      r = i;
      t({
        loaded: i,
        total: s,
        progress: s ? i / s : void 0,
        bytes: a,
        rate: l || void 0,
        estimated: l && s && i <= s ? (s - i) / l : void 0,
        event: n,
        lengthComputable: null != s,
        [e ? "download" : "upload"]: !0,
      });
    }, n);
  },
  Wu = (t, e) => {
    const n = null != t;
    return [(r) => e[0]({ lengthComputable: n, total: t, loaded: r }), e[1]];
  },
  Xu =
    (t) =>
    (...e) =>
      fu.asap(() => t(...e)),
  Yu = Ru.hasStandardBrowserEnv
    ? ((t, e) => (n) => (
        (n = new URL(n, Ru.origin)),
        t.protocol === n.protocol &&
          t.host === n.host &&
          (e || t.port === n.port)
      ))(
        new URL(Ru.origin),
        Ru.navigator && /(msie|trident)/i.test(Ru.navigator.userAgent)
      )
    : () => !0,
  Ju = Ru.hasStandardBrowserEnv
    ? {
        write(t, e, n, r, o, i, s) {
          if ("undefined" == typeof document) return;
          const a = [`${t}=${encodeURIComponent(e)}`];
          fu.isNumber(n) && a.push(`expires=${new Date(n).toUTCString()}`),
            fu.isString(r) && a.push(`path=${r}`),
            fu.isString(o) && a.push(`domain=${o}`),
            !0 === i && a.push("secure"),
            fu.isString(s) && a.push(`SameSite=${s}`),
            (document.cookie = a.join("; "));
        },
        read(t) {
          if ("undefined" == typeof document) return null;
          const e = document.cookie.match(
            new RegExp("(?:^|; )" + t + "=([^;]*)")
          );
          return e ? decodeURIComponent(e[1]) : null;
        },
        remove(t) {
          this.write(t, "", Date.now() - 864e5, "/");
        },
      }
    : { write() {}, read: () => null, remove() {} };
function Ku(t, e, n) {
  let r = !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
  return t && (r || 0 == n)
    ? (function (t, e) {
        return e ? t.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : t;
      })(t, e)
    : e;
}
const Zu = (t) => (t instanceof Bu ? { ...t } : t);
function Qu(t, e) {
  e = e || {};
  const n = {};
  function r(t, e, n, r) {
    return fu.isPlainObject(t) && fu.isPlainObject(e)
      ? fu.merge.call({ caseless: r }, t, e)
      : fu.isPlainObject(e)
      ? fu.merge({}, e)
      : fu.isArray(e)
      ? e.slice()
      : e;
  }
  function o(t, e, n, o) {
    return fu.isUndefined(e)
      ? fu.isUndefined(t)
        ? void 0
        : r(void 0, t, 0, o)
      : r(t, e, 0, o);
  }
  function i(t, e) {
    if (!fu.isUndefined(e)) return r(void 0, e);
  }
  function s(t, e) {
    return fu.isUndefined(e)
      ? fu.isUndefined(t)
        ? void 0
        : r(void 0, t)
      : r(void 0, e);
  }
  function a(n, o, i) {
    return i in e ? r(n, o) : i in t ? r(void 0, n) : void 0;
  }
  const l = {
    url: i,
    method: i,
    data: i,
    baseURL: s,
    transformRequest: s,
    transformResponse: s,
    paramsSerializer: s,
    timeout: s,
    timeoutMessage: s,
    withCredentials: s,
    withXSRFToken: s,
    adapter: s,
    responseType: s,
    xsrfCookieName: s,
    xsrfHeaderName: s,
    onUploadProgress: s,
    onDownloadProgress: s,
    decompress: s,
    maxContentLength: s,
    maxBodyLength: s,
    beforeRedirect: s,
    transport: s,
    httpAgent: s,
    httpsAgent: s,
    cancelToken: s,
    socketPath: s,
    responseEncoding: s,
    validateStatus: a,
    headers: (t, e, n) => o(Zu(t), Zu(e), 0, !0),
  };
  return (
    fu.forEach(Object.keys({ ...t, ...e }), function (r) {
      const i = l[r] || o,
        s = i(t[r], e[r], r);
      (fu.isUndefined(s) && i !== a) || (n[r] = s);
    }),
    n
  );
}
const tc = (t) => {
    const e = Qu({}, t);
    let {
      data: n,
      withXSRFToken: r,
      xsrfHeaderName: o,
      xsrfCookieName: i,
      headers: s,
      auth: a,
    } = e;
    if (
      ((e.headers = s = Bu.from(s)),
      (e.url = Su(
        Ku(e.baseURL, e.url, e.allowAbsoluteUrls),
        t.params,
        t.paramsSerializer
      )),
      a &&
        s.set(
          "Authorization",
          "Basic " +
            btoa(
              (a.username || "") +
                ":" +
                (a.password ? unescape(encodeURIComponent(a.password)) : "")
            )
        ),
      fu.isFormData(n))
    )
      if (Ru.hasStandardBrowserEnv || Ru.hasStandardBrowserWebWorkerEnv)
        s.setContentType(void 0);
      else if (fu.isFunction(n.getHeaders)) {
        const t = n.getHeaders(),
          e = ["content-type", "content-length"];
        Object.entries(t).forEach(([t, n]) => {
          e.includes(t.toLowerCase()) && s.set(t, n);
        });
      }
    if (
      Ru.hasStandardBrowserEnv &&
      (r && fu.isFunction(r) && (r = r(e)), r || (!1 !== r && Yu(e.url)))
    ) {
      const t = o && i && Ju.read(i);
      t && s.set(o, t);
    }
    return e;
  },
  ec =
    "undefined" != typeof XMLHttpRequest &&
    function (t) {
      return new Promise(function (e, n) {
        const r = tc(t);
        let o = r.data;
        const i = Bu.from(r.headers).normalize();
        let s,
          a,
          l,
          u,
          c,
          { responseType: f, onUploadProgress: h, onDownloadProgress: d } = r;
        function p() {
          u && u(),
            c && c(),
            r.cancelToken && r.cancelToken.unsubscribe(s),
            r.signal && r.signal.removeEventListener("abort", s);
        }
        let g = new XMLHttpRequest();
        function v() {
          if (!g) return;
          const r = Bu.from(
            "getAllResponseHeaders" in g && g.getAllResponseHeaders()
          );
          Hu(
            function (t) {
              e(t), p();
            },
            function (t) {
              n(t), p();
            },
            {
              data:
                f && "text" !== f && "json" !== f ? g.response : g.responseText,
              status: g.status,
              statusText: g.statusText,
              headers: r,
              config: t,
              request: g,
            }
          ),
            (g = null);
        }
        g.open(r.method.toUpperCase(), r.url, !0),
          (g.timeout = r.timeout),
          "onloadend" in g
            ? (g.onloadend = v)
            : (g.onreadystatechange = function () {
                g &&
                  4 === g.readyState &&
                  (0 !== g.status ||
                    (g.responseURL && 0 === g.responseURL.indexOf("file:"))) &&
                  setTimeout(v);
              }),
          (g.onabort = function () {
            g &&
              (n(new hu("Request aborted", hu.ECONNABORTED, t, g)), (g = null));
          }),
          (g.onerror = function (e) {
            const r = new hu(
              e && e.message ? e.message : "Network Error",
              hu.ERR_NETWORK,
              t,
              g
            );
            (r.event = e || null), n(r), (g = null);
          }),
          (g.ontimeout = function () {
            let e = r.timeout
              ? "timeout of " + r.timeout + "ms exceeded"
              : "timeout exceeded";
            const o = r.transitional || Cu;
            r.timeoutErrorMessage && (e = r.timeoutErrorMessage),
              n(
                new hu(
                  e,
                  o.clarifyTimeoutError ? hu.ETIMEDOUT : hu.ECONNABORTED,
                  t,
                  g
                )
              ),
              (g = null);
          }),
          void 0 === o && i.setContentType(null),
          "setRequestHeader" in g &&
            fu.forEach(i.toJSON(), function (t, e) {
              g.setRequestHeader(e, t);
            }),
          fu.isUndefined(r.withCredentials) ||
            (g.withCredentials = !!r.withCredentials),
          f && "json" !== f && (g.responseType = r.responseType),
          d && (([l, c] = Gu(d, !0)), g.addEventListener("progress", l)),
          h &&
            g.upload &&
            (([a, u] = Gu(h)),
            g.upload.addEventListener("progress", a),
            g.upload.addEventListener("loadend", u)),
          (r.cancelToken || r.signal) &&
            ((s = (e) => {
              g &&
                (n(!e || e.type ? new qu(null, t, g) : e),
                g.abort(),
                (g = null));
            }),
            r.cancelToken && r.cancelToken.subscribe(s),
            r.signal &&
              (r.signal.aborted ? s() : r.signal.addEventListener("abort", s)));
        const y = (function (t) {
          const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(t);
          return (e && e[1]) || "";
        })(r.url);
        y && -1 === Ru.protocols.indexOf(y)
          ? n(new hu("Unsupported protocol " + y + ":", hu.ERR_BAD_REQUEST, t))
          : g.send(o || null);
      });
    },
  nc = (t, e) => {
    const { length: n } = (t = t ? t.filter(Boolean) : []);
    if (e || n) {
      let n,
        r = new AbortController();
      const o = function (t) {
        if (!n) {
          (n = !0), s();
          const e = t instanceof Error ? t : this.reason;
          r.abort(
            e instanceof hu ? e : new qu(e instanceof Error ? e.message : e)
          );
        }
      };
      let i =
        e &&
        setTimeout(() => {
          (i = null), o(new hu(`timeout ${e} of ms exceeded`, hu.ETIMEDOUT));
        }, e);
      const s = () => {
        t &&
          (i && clearTimeout(i),
          (i = null),
          t.forEach((t) => {
            t.unsubscribe
              ? t.unsubscribe(o)
              : t.removeEventListener("abort", o);
          }),
          (t = null));
      };
      t.forEach((t) => t.addEventListener("abort", o));
      const { signal: a } = r;
      return (a.unsubscribe = () => fu.asap(s)), a;
    }
  },
  rc = function* (t, e) {
    let n = t.byteLength;
    if (n < e) return void (yield t);
    let r,
      o = 0;
    for (; o < n; ) (r = o + e), yield t.slice(o, r), (o = r);
  },
  oc = async function* (t) {
    if (t[Symbol.asyncIterator]) return void (yield* t);
    const e = t.getReader();
    try {
      for (;;) {
        const { done: t, value: n } = await e.read();
        if (t) break;
        yield n;
      }
    } finally {
      await e.cancel();
    }
  },
  ic = (t, e, n, r) => {
    const o = (async function* (t, e) {
      for await (const n of oc(t)) yield* rc(n, e);
    })(t, e);
    let i,
      s = 0,
      a = (t) => {
        i || ((i = !0), r && r(t));
      };
    return new ReadableStream(
      {
        async pull(t) {
          try {
            const { done: e, value: r } = await o.next();
            if (e) return a(), void t.close();
            let i = r.byteLength;
            if (n) {
              let t = (s += i);
              n(t);
            }
            t.enqueue(new Uint8Array(r));
          } catch (e) {
            throw (a(e), e);
          }
        },
        cancel: (t) => (a(t), o.return()),
      },
      { highWaterMark: 2 }
    );
  },
  { isFunction: sc } = fu,
  ac = (({ Request: t, Response: e }) => ({ Request: t, Response: e }))(
    fu.global
  ),
  { ReadableStream: lc, TextEncoder: uc } = fu.global,
  cc = (t, ...e) => {
    try {
      return !!t(...e);
    } catch (cw) {
      return !1;
    }
  },
  fc = (t) => {
    t = fu.merge.call({ skipUndefined: !0 }, ac, t);
    const { fetch: e, Request: n, Response: r } = t,
      o = e ? sc(e) : "function" == typeof fetch,
      i = sc(n),
      s = sc(r);
    if (!o) return !1;
    const a = o && sc(lc),
      l =
        o &&
        ("function" == typeof uc
          ? (
              (t) => (e) =>
                t.encode(e)
            )(new uc())
          : async (t) => new Uint8Array(await new n(t).arrayBuffer())),
      u =
        i &&
        a &&
        cc(() => {
          let t = !1;
          const e = new n(Ru.origin, {
            body: new lc(),
            method: "POST",
            get duplex() {
              return (t = !0), "half";
            },
          }).headers.has("Content-Type");
          return t && !e;
        }),
      c = s && a && cc(() => fu.isReadableStream(new r("").body)),
      f = { stream: c && ((t) => t.body) };
    o &&
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
        !f[t] &&
          (f[t] = (e, n) => {
            let r = e && e[t];
            if (r) return r.call(e);
            throw new hu(
              `Response type '${t}' is not supported`,
              hu.ERR_NOT_SUPPORT,
              n
            );
          });
      });
    const h = async (t, e) => {
      const r = fu.toFiniteNumber(t.getContentLength());
      return null == r
        ? (async (t) => {
            if (null == t) return 0;
            if (fu.isBlob(t)) return t.size;
            if (fu.isSpecCompliantForm(t)) {
              const e = new n(Ru.origin, { method: "POST", body: t });
              return (await e.arrayBuffer()).byteLength;
            }
            return fu.isArrayBufferView(t) || fu.isArrayBuffer(t)
              ? t.byteLength
              : (fu.isURLSearchParams(t) && (t += ""),
                fu.isString(t) ? (await l(t)).byteLength : void 0);
          })(e)
        : r;
    };
    return async (t) => {
      let {
          url: o,
          method: s,
          data: a,
          signal: l,
          cancelToken: d,
          timeout: p,
          onDownloadProgress: g,
          onUploadProgress: v,
          responseType: y,
          headers: m,
          withCredentials: _ = "same-origin",
          fetchOptions: b,
        } = tc(t),
        w = e || fetch;
      y = y ? (y + "").toLowerCase() : "text";
      let x = nc([l, d && d.toAbortSignal()], p),
        k = null;
      const S =
        x &&
        x.unsubscribe &&
        (() => {
          x.unsubscribe();
        });
      let E;
      try {
        if (
          v &&
          u &&
          "get" !== s &&
          "head" !== s &&
          0 !== (E = await h(m, a))
        ) {
          let t,
            e = new n(o, { method: "POST", body: a, duplex: "half" });
          if (
            (fu.isFormData(a) &&
              (t = e.headers.get("content-type")) &&
              m.setContentType(t),
            e.body)
          ) {
            const [t, n] = Wu(E, Gu(Xu(v)));
            a = ic(e.body, 65536, t, n);
          }
        }
        fu.isString(_) || (_ = _ ? "include" : "omit");
        const e = i && "credentials" in n.prototype,
          l = {
            ...b,
            signal: x,
            method: s.toUpperCase(),
            headers: m.normalize().toJSON(),
            body: a,
            duplex: "half",
            credentials: e ? _ : void 0,
          };
        k = i && new n(o, l);
        let d = await (i ? w(k, b) : w(o, l));
        const p = c && ("stream" === y || "response" === y);
        if (c && (g || (p && S))) {
          const t = {};
          ["status", "statusText", "headers"].forEach((e) => {
            t[e] = d[e];
          });
          const e = fu.toFiniteNumber(d.headers.get("content-length")),
            [n, o] = (g && Wu(e, Gu(Xu(g), !0))) || [];
          d = new r(
            ic(d.body, 65536, n, () => {
              o && o(), S && S();
            }),
            t
          );
        }
        y = y || "text";
        let C = await f[fu.findKey(f, y) || "text"](d, t);
        return (
          !p && S && S(),
          await new Promise((e, n) => {
            Hu(e, n, {
              data: C,
              headers: Bu.from(d.headers),
              status: d.status,
              statusText: d.statusText,
              config: t,
              request: k,
            });
          })
        );
      } catch (C) {
        if (
          (S && S(),
          C && "TypeError" === C.name && /Load failed|fetch/i.test(C.message))
        )
          throw Object.assign(new hu("Network Error", hu.ERR_NETWORK, t, k), {
            cause: C.cause || C,
          });
        throw hu.from(C, C && C.code, t, k);
      }
    };
  },
  hc = new Map(),
  dc = (t) => {
    let e = (t && t.env) || {};
    const { fetch: n, Request: r, Response: o } = e,
      i = [r, o, n];
    let s,
      a,
      l = i.length,
      u = hc;
    for (; l--; )
      (s = i[l]),
        (a = u.get(s)),
        void 0 === a && u.set(s, (a = l ? new Map() : fc(e))),
        (u = a);
    return a;
  };
dc();
const pc = { http: null, xhr: ec, fetch: { get: dc } };
fu.forEach(pc, (t, e) => {
  if (t) {
    try {
      Object.defineProperty(t, "name", { value: e });
    } catch (cw) {}
    Object.defineProperty(t, "adapterName", { value: e });
  }
});
const gc = (t) => `- ${t}`,
  vc = (t) => fu.isFunction(t) || null === t || !1 === t;
const yc = {
  getAdapter: function (t, e) {
    t = fu.isArray(t) ? t : [t];
    const { length: n } = t;
    let r, o;
    const i = {};
    for (let s = 0; s < n; s++) {
      let n;
      if (
        ((r = t[s]),
        (o = r),
        !vc(r) && ((o = pc[(n = String(r)).toLowerCase()]), void 0 === o))
      )
        throw new hu(`Unknown adapter '${n}'`);
      if (o && (fu.isFunction(o) || (o = o.get(e)))) break;
      i[n || "#" + s] = o;
    }
    if (!o) {
      const t = Object.entries(i).map(
        ([t, e]) =>
          `adapter ${t} ` +
          (!1 === e
            ? "is not supported by the environment"
            : "is not available in the build")
      );
      throw new hu(
        "There is no suitable adapter to dispatch the request " +
          (n
            ? t.length > 1
              ? "since :\n" + t.map(gc).join("\n")
              : " " + gc(t[0])
            : "as no adapter specified"),
        "ERR_NOT_SUPPORT"
      );
    }
    return o;
  },
  adapters: pc,
};
function mc(t) {
  if (
    (t.cancelToken && t.cancelToken.throwIfRequested(),
    t.signal && t.signal.aborted)
  )
    throw new qu(null, t);
}
function _c(t) {
  mc(t),
    (t.headers = Bu.from(t.headers)),
    (t.data = $u.call(t, t.transformRequest)),
    -1 !== ["post", "put", "patch"].indexOf(t.method) &&
      t.headers.setContentType("application/x-www-form-urlencoded", !1);
  return yc
    .getAdapter(
      t.adapter || zu.adapter,
      t
    )(t)
    .then(
      function (e) {
        return (
          mc(t),
          (e.data = $u.call(t, t.transformResponse, e)),
          (e.headers = Bu.from(e.headers)),
          e
        );
      },
      function (e) {
        return (
          Vu(e) ||
            (mc(t),
            e &&
              e.response &&
              ((e.response.data = $u.call(t, t.transformResponse, e.response)),
              (e.response.headers = Bu.from(e.response.headers)))),
          Promise.reject(e)
        );
      }
    );
}
const bc = "1.13.2",
  wc = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (t, e) => {
    wc[t] = function (n) {
      return typeof n === t || "a" + (e < 1 ? "n " : " ") + t;
    };
  }
);
const xc = {};
(wc.transitional = function (t, e, n) {
  return (r, o, i) => {
    if (!1 === t)
      throw new hu(
        (function (t, e) {
          return (
            "[Axios v" +
            bc +
            "] Transitional option '" +
            t +
            "'" +
            e +
            (n ? ". " + n : "")
          );
        })(o, " has been removed" + (e ? " in " + e : "")),
        hu.ERR_DEPRECATED
      );
    return e && !xc[o] && (xc[o] = !0), !t || t(r, o, i);
  };
}),
  (wc.spelling = function (t) {
    return (t, e) => !0;
  });
const kc = {
    assertOptions: function (t, e, n) {
      if ("object" != typeof t)
        throw new hu("options must be an object", hu.ERR_BAD_OPTION_VALUE);
      const r = Object.keys(t);
      let o = r.length;
      for (; o-- > 0; ) {
        const i = r[o],
          s = e[i];
        if (s) {
          const e = t[i],
            n = void 0 === e || s(e, i, t);
          if (!0 !== n)
            throw new hu(
              "option " + i + " must be " + n,
              hu.ERR_BAD_OPTION_VALUE
            );
          continue;
        }
        if (!0 !== n) throw new hu("Unknown option " + i, hu.ERR_BAD_OPTION);
      }
    },
    validators: wc,
  },
  Sc = kc.validators;
let Ec = class {
  constructor(t) {
    (this.defaults = t || {}),
      (this.interceptors = { request: new Eu(), response: new Eu() });
  }
  async request(t, e) {
    try {
      return await this._request(t, e);
    } catch (n) {
      if (n instanceof Error) {
        let t = {};
        Error.captureStackTrace
          ? Error.captureStackTrace(t)
          : (t = new Error());
        const e = t.stack ? t.stack.replace(/^.+\n/, "") : "";
        try {
          n.stack
            ? e &&
              !String(n.stack).endsWith(e.replace(/^.+\n.+\n/, "")) &&
              (n.stack += "\n" + e)
            : (n.stack = e);
        } catch (cw) {}
      }
      throw n;
    }
  }
  _request(t, e) {
    "string" == typeof t ? ((e = e || {}).url = t) : (e = t || {}),
      (e = Qu(this.defaults, e));
    const { transitional: n, paramsSerializer: r, headers: o } = e;
    void 0 !== n &&
      kc.assertOptions(
        n,
        {
          silentJSONParsing: Sc.transitional(Sc.boolean),
          forcedJSONParsing: Sc.transitional(Sc.boolean),
          clarifyTimeoutError: Sc.transitional(Sc.boolean),
        },
        !1
      ),
      null != r &&
        (fu.isFunction(r)
          ? (e.paramsSerializer = { serialize: r })
          : kc.assertOptions(
              r,
              { encode: Sc.function, serialize: Sc.function },
              !0
            )),
      void 0 !== e.allowAbsoluteUrls ||
        (void 0 !== this.defaults.allowAbsoluteUrls
          ? (e.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (e.allowAbsoluteUrls = !0)),
      kc.assertOptions(
        e,
        {
          baseUrl: Sc.spelling("baseURL"),
          withXsrfToken: Sc.spelling("withXSRFToken"),
        },
        !0
      ),
      (e.method = (e.method || this.defaults.method || "get").toLowerCase());
    let i = o && fu.merge(o.common, o[e.method]);
    o &&
      fu.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (t) => {
          delete o[t];
        }
      ),
      (e.headers = Bu.concat(i, o));
    const s = [];
    let a = !0;
    this.interceptors.request.forEach(function (t) {
      ("function" == typeof t.runWhen && !1 === t.runWhen(e)) ||
        ((a = a && t.synchronous), s.unshift(t.fulfilled, t.rejected));
    });
    const l = [];
    let u;
    this.interceptors.response.forEach(function (t) {
      l.push(t.fulfilled, t.rejected);
    });
    let c,
      f = 0;
    if (!a) {
      const t = [_c.bind(this), void 0];
      for (
        t.unshift(...s), t.push(...l), c = t.length, u = Promise.resolve(e);
        f < c;

      )
        u = u.then(t[f++], t[f++]);
      return u;
    }
    c = s.length;
    let h = e;
    for (; f < c; ) {
      const t = s[f++],
        e = s[f++];
      try {
        h = t(h);
      } catch (d) {
        e.call(this, d);
        break;
      }
    }
    try {
      u = _c.call(this, h);
    } catch (d) {
      return Promise.reject(d);
    }
    for (f = 0, c = l.length; f < c; ) u = u.then(l[f++], l[f++]);
    return u;
  }
  getUri(t) {
    return Su(
      Ku((t = Qu(this.defaults, t)).baseURL, t.url, t.allowAbsoluteUrls),
      t.params,
      t.paramsSerializer
    );
  }
};
fu.forEach(["delete", "get", "head", "options"], function (t) {
  Ec.prototype[t] = function (e, n) {
    return this.request(
      Qu(n || {}, { method: t, url: e, data: (n || {}).data })
    );
  };
}),
  fu.forEach(["post", "put", "patch"], function (t) {
    function e(e) {
      return function (n, r, o) {
        return this.request(
          Qu(o || {}, {
            method: t,
            headers: e ? { "Content-Type": "multipart/form-data" } : {},
            url: n,
            data: r,
          })
        );
      };
    }
    (Ec.prototype[t] = e()), (Ec.prototype[t + "Form"] = e(!0));
  });
const Cc = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526,
};
Object.entries(Cc).forEach(([t, e]) => {
  Cc[e] = t;
});
const Ac = (function t(e) {
  const n = new Ec(e),
    r = kl(Ec.prototype.request, n);
  return (
    fu.extend(r, Ec.prototype, n, { allOwnKeys: !0 }),
    fu.extend(r, n, null, { allOwnKeys: !0 }),
    (r.create = function (n) {
      return t(Qu(e, n));
    }),
    r
  );
})(zu);
(Ac.Axios = Ec),
  (Ac.CanceledError = qu),
  (Ac.CancelToken = class t {
    constructor(t) {
      if ("function" != typeof t)
        throw new TypeError("executor must be a function.");
      let e;
      this.promise = new Promise(function (t) {
        e = t;
      });
      const n = this;
      this.promise.then((t) => {
        if (!n._listeners) return;
        let e = n._listeners.length;
        for (; e-- > 0; ) n._listeners[e](t);
        n._listeners = null;
      }),
        (this.promise.then = (t) => {
          let e;
          const r = new Promise((t) => {
            n.subscribe(t), (e = t);
          }).then(t);
          return (
            (r.cancel = function () {
              n.unsubscribe(e);
            }),
            r
          );
        }),
        t(function (t, r, o) {
          n.reason || ((n.reason = new qu(t, r, o)), e(n.reason));
        });
    }
    throwIfRequested() {
      if (this.reason) throw this.reason;
    }
    subscribe(t) {
      this.reason
        ? t(this.reason)
        : this._listeners
        ? this._listeners.push(t)
        : (this._listeners = [t]);
    }
    unsubscribe(t) {
      if (!this._listeners) return;
      const e = this._listeners.indexOf(t);
      -1 !== e && this._listeners.splice(e, 1);
    }
    toAbortSignal() {
      const t = new AbortController(),
        e = (e) => {
          t.abort(e);
        };
      return (
        this.subscribe(e),
        (t.signal.unsubscribe = () => this.unsubscribe(e)),
        t.signal
      );
    }
    static source() {
      let e;
      return {
        token: new t(function (t) {
          e = t;
        }),
        cancel: e,
      };
    }
  }),
  (Ac.isCancel = Vu),
  (Ac.VERSION = bc),
  (Ac.toFormData = _u),
  (Ac.AxiosError = hu),
  (Ac.Cancel = Ac.CanceledError),
  (Ac.all = function (t) {
    return Promise.all(t);
  }),
  (Ac.spread = function (t) {
    return function (e) {
      return t.apply(null, e);
    };
  }),
  (Ac.isAxiosError = function (t) {
    return fu.isObject(t) && !0 === t.isAxiosError;
  }),
  (Ac.mergeConfig = Qu),
  (Ac.AxiosHeaders = Bu),
  (Ac.formToJSON = (t) => ju(fu.isHTMLForm(t) ? new FormData(t) : t)),
  (Ac.getAdapter = yc.getAdapter),
  (Ac.HttpStatusCode = Cc),
  (Ac.default = Ac);
const {
    Axios: Oc,
    AxiosError: Tc,
    CanceledError: Nc,
    isCancel: Pc,
    CancelToken: Mc,
    VERSION: Rc,
    all: jc,
    Cancel: zc,
    isAxiosError: Dc,
    spread: Ic,
    toFormData: Lc,
    AxiosHeaders: Uc,
    HttpStatusCode: Fc,
    formToJSON: Bc,
    getAdapter: $c,
    mergeConfig: Vc,
  } = Ac,
  qc = Ac.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
  });
qc.interceptors.request.use(
  (t) => {
    const e = sessionStorage.getItem("session_token");
    return e && (t.headers.Authorization = `Bearer ${e}`), t;
  },
  (t) => Promise.reject(t)
);
const Hc = (t, e) =>
    qc.get(
      `/debug_search?q=${encodeURIComponent(t)}&session_id=${encodeURIComponent(
        e
      )}`
    ),
  Gc = (t) => qc.post("/edge", t),
  Wc = (t, e = {}) => qc.post("/batch-delete", { task_name: t, params: e }),
  Xc = (t, e) => qc.post("/link", { session_id: t, entity_name: e }),
  Yc = Ts("graph", () => {
    const t = fl(),
      e = Se({ nodes: [], links: [] }),
      n = Se([]),
      r = Se("global"),
      o = Se(null),
      i = Se(null),
      s = Se(new Set()),
      a = Se(new Set()),
      l = Se(!0),
      u = Se(!1),
      c = Se(null),
      f = Se(null),
      h = Wo(() => e.value.nodes.length),
      d = Wo(() => e.value.links.length);
    function p(t, e = f.value) {
      e && t && (e.centerAt(t.x, t.y, 1e3), e.zoom(3, 1e3));
    }
    async function g(n = "global") {
      r.value = n;
      try {
        const t = await ((t) => {
            const e =
              t && "global" !== t
                ? `/graph?session_id=${encodeURIComponent(t)}`
                : "/graph";
            return qc.get(e);
          })(n),
          r = t.data;
        if (!r) return void (e.value = { nodes: [], links: [] });
        const o = (r.nodes || []).filter((t) => t && t.id),
          i = new Set(o.map((t) => t.id)),
          s = (r.edges || []).filter(
            (t) =>
              t && t.source && t.target && i.has(t.source) && i.has(t.target)
          );
        e.value = { nodes: o, links: s };
      } catch (o) {
        t.showToast("加载失败", "无法加载图谱数据", "error"),
          (e.value = { nodes: [], links: [] });
      }
    }
    function v() {
      (o.value = null), s.value.clear(), a.value.clear();
    }
    function y(t) {
      s.value.clear(),
        a.value.clear(),
        t &&
          (s.value.add(t.id),
          e.value.links.forEach((e) => {
            const n = "object" == typeof e.source ? e.source.id : e.source,
              r = "object" == typeof e.target ? e.target.id : e.target;
            n === t.id && (a.value.add(e), s.value.add(r)),
              r === t.id && (a.value.add(e), s.value.add(n));
          }));
    }
    return {
      graphData: e,
      contexts: n,
      currentSessionId: r,
      selectedNode: o,
      hoverNode: i,
      highlightNodes: s,
      highlightLinks: a,
      showLabels: l,
      isConnecting: u,
      connectionStartNode: c,
      graphInstance: f,
      nodeCount: h,
      edgeCount: d,
      fetchContexts: async function () {
        try {
          const t = await qc.get("/contexts");
          n.value = t.data || [];
        } catch (e) {
          t.showToast("错误", "无法获取会话列表", "error");
        }
      },
      loadGraphData: g,
      selectNode: function (t) {
        (o.value = t), y(t);
      },
      clearSelection: v,
      highlightNetwork: y,
      deleteSelectedNode: async function () {
        var e, n, i, s;
        if (o.value)
          try {
            await ((i = o.value.type),
            (s = o.value.id),
            qc.delete(`/node/${i}/${s}`)),
              t.showToast("删除成功", "节点已删除", "success"),
              v(),
              await g(r.value);
          } catch (a) {
            const r =
              (null == (n = null == (e = a.response) ? void 0 : e.data)
                ? void 0
                : n.detail) || "删除失败";
            t.showToast("删除失败", r, "error");
          }
      },
      setGraphInstance: function (t) {
        f.value = t;
      },
      focusNode: p,
      zoomToFit: function () {
        f.value && f.value.zoomToFit(400);
      },
      performSearch: function (t) {
        if (!t.trim()) return s.value.clear(), void a.value.clear();
        const n = t.toLowerCase(),
          r = e.value.nodes.filter(
            (t) =>
              t.name.toLowerCase().includes(n) ||
              t.type.toLowerCase().includes(n) ||
              t.id.toLowerCase().includes(n)
          );
        r.length > 0 &&
          (s.value.clear(),
          a.value.clear(),
          r.forEach((t) => s.value.add(t.id)),
          1 === r.length && ((o.value = r[0]), p(r[0])));
      },
      showConnectPanel: function (e, n) {
        t.togglePanel("connect", { fromNode: e, toNode: n });
      },
    };
  }),
  Jc = { class: "app-header" },
  Kc = { class: "header-left" },
  Zc = { class: "logo" },
  Qc = { class: "view-switcher" },
  tf = { class: "header-right" },
  ef = { class: "search-box" },
  nf = { class: "session-selector" },
  rf = ["value"],
  of = pl(
    {
      __name: "AppHeader",
      setup(t) {
        const e = Yc(),
          n = fl(),
          r = Se("");
        function o(t) {
          e.loadGraphData(t.target.value);
        }
        return (
          Er(r, (t) => {
            e.performSearch(t);
          }),
          (t, i) => (
            fo(),
            vo("header", Jc, [
              xo("div", Kc, [
                xo("div", Zc, [
                  ko(dl, { name: "brain", size: "1.5rem" }),
                  i[3] || (i[3] = xo("span", null, "GraphMemory", -1)),
                ]),
                xo("div", Qc, [
                  sn(
                    xo(
                      "select",
                      {
                        "onUpdate:modelValue":
                          i[0] || (i[0] = (t) => (Ae(n).activeView = t)),
                        class: "btn btn-secondary",
                      },
                      [
                        ...(i[4] ||
                          (i[4] = [
                            xo("option", { value: "graph" }, "图谱", -1),
                            xo("option", { value: "dashboard" }, "仪表板", -1),
                          ])),
                      ],
                      512
                    ),
                    [[ns, Ae(n).activeView]]
                  ),
                ]),
              ]),
              xo("div", tf, [
                xo("div", ef, [
                  ko(dl, { name: "search", class: "search-icon" }),
                  sn(
                    xo(
                      "input",
                      {
                        type: "text",
                        "onUpdate:modelValue":
                          i[1] || (i[1] = (t) => (r.value = t)),
                        placeholder: "搜索节点...",
                        class: "search-input",
                      },
                      null,
                      512
                    ),
                    [[Qi, r.value]]
                  ),
                ]),
                xo("div", nf, [
                  sn(
                    xo(
                      "select",
                      {
                        "onUpdate:modelValue":
                          i[2] || (i[2] = (t) => (Ae(e).currentSessionId = t)),
                        onChange: o,
                        class: "btn btn-secondary",
                      },
                      [
                        i[5] ||
                          (i[5] = xo(
                            "option",
                            { value: "global" },
                            "全局视图",
                            -1
                          )),
                        (fo(!0),
                        vo(
                          io,
                          null,
                          Qn(Ae(e).contexts, (t) => {
                            return (
                              fo(),
                              vo(
                                "option",
                                { key: t.session_id, value: t.session_id },
                                J(
                                  (e = t.session_id).length > 20
                                    ? `...${e.slice(-17)}`
                                    : e
                                ),
                                9,
                                rf
                              )
                            );
                            var e;
                          }),
                          128
                        )),
                      ],
                      544
                    ),
                    [[ns, Ae(e).currentSessionId]]
                  ),
                ]),
              ]),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-8f07f364"]]
  ),
  sf = { class: "node-info-panel" },
  af = { key: 0, class: "node-info-empty" },
  lf = { key: 1, class: "node-info-detail" },
  uf = { style: { "margin-bottom": "1.5rem" } },
  cf = {
    style: {
      "font-size": "1rem",
      "font-weight": "600",
      "margin-bottom": "0.5rem",
    },
  },
  ff = {
    style: {
      display: "flex",
      gap: "0.5rem",
      "font-size": "0.625rem",
      "font-family": "'Courier New', monospace",
      color: "#666",
    },
  },
  hf = {
    style: {
      padding: "0.25rem 0.5rem",
      background: "rgba(0,0,0,0.05)",
      "border-radius": "0.25rem",
    },
  },
  df = {
    style: {
      padding: "0.25rem 0.5rem",
      background: "rgba(0,0,0,0.05)",
      "border-radius": "0.25rem",
    },
  },
  pf = { style: { "margin-bottom": "1.5rem" } },
  gf = {
    style: {
      display: "flex",
      "justify-content": "space-between",
      "align-items": "center",
      "margin-bottom": "0.75rem",
    },
  },
  vf = { key: 0 },
  yf = { key: 0, class: "property-list" },
  mf = { class: "property-key" },
  _f = { class: "property-value" },
  bf = { key: 1, class: "empty-message" },
  wf = { key: 1 },
  xf = { key: 0, class: "edit-form" },
  kf = { class: "form-label" },
  Sf = ["onUpdate:modelValue"],
  Ef = { key: 1, class: "empty-message" },
  Cf = { style: { "margin-bottom": "1.5rem" } },
  Af = { key: 0, class: "observation-list" },
  Of = { key: 1, class: "empty-message" },
  Tf = { style: { "margin-bottom": "1.5rem" } },
  Nf = { key: 0, class: "neighbor-list" },
  Pf = ["onClick"],
  Mf = { class: "neighbor-name" },
  Rf = { class: "neighbor-relation" },
  jf = ["onClick"],
  zf = { key: 1, class: "empty-message" },
  Df = {
    style: {
      "margin-top": "1.5rem",
      "padding-top": "1.5rem",
      "border-top": "1px solid rgba(0,0,0,0.05)",
    },
  },
  If = pl(
    {
      __name: "NodeInfoPanel",
      setup(t) {
        const e = Yc(),
          n = fl(),
          r = Se(!1),
          o = Se({}),
          i = ["summary", "type", "text"],
          s = Wo(() => {
            var t;
            const n = null == (t = e.selectedNode) ? void 0 : t.properties;
            return n && Object.keys(n).length > 0;
          }),
          a = Wo(() => {
            var t;
            const n = null == (t = e.selectedNode) ? void 0 : t.properties;
            return !!n && i.some((t) => t in n);
          }),
          l = Wo(() => {
            var t;
            const n = null == (t = e.selectedNode) ? void 0 : t.observations;
            return n && n.length > 0;
          }),
          u = Wo(() => {
            if (!e.selectedNode) return [];
            const t = e.selectedNode,
              n = [];
            return (
              e.graphData.links.forEach((r) => {
                const o = "object" == typeof r.source ? r.source.id : r.source,
                  i = "object" == typeof r.target ? r.target.id : r.target;
                if (o === t.id || i === t.id) {
                  const s = o === t.id ? i : o,
                    a = e.graphData.nodes.find((t) => t.id === s);
                  a &&
                    n.push({
                      node: a,
                      link: r,
                      relation: r.relation || r.label || "RELATED_TO",
                    });
                }
              }),
              n
            );
          });
        function c(t) {
          return "object" == typeof t ? JSON.stringify(t) : String(t);
        }
        function f() {
          if (((r.value = !r.value), r.value)) {
            const t = e.selectedNode.properties || {};
            (o.value = {}),
              i.forEach((e) => {
                e in t && (o.value[e] = t[e]);
              });
          }
        }
        function h() {
          (r.value = !1), (o.value = {});
        }
        async function d() {
          var t, i, s, a, l;
          if (e.selectedNode)
            try {
              await ((s = e.selectedNode.type),
              (a = e.selectedNode.id),
              (l = o.value),
              qc.patch(`/node/${s}/${a}`, l)),
                n.showToast("更新成功", "属性已更新", "success"),
                (r.value = !1),
                await e.loadGraphData(e.currentSessionId);
            } catch (u) {
              const e =
                (null == (i = null == (t = u.response) ? void 0 : t.data)
                  ? void 0
                  : i.detail) || "更新失败";
              n.showToast("更新失败", e, "error");
            }
        }
        async function p(t) {
          var r, o;
          if (confirm(`确定要删除关系 "${t.relation}" 吗？`))
            try {
              const r = t.link,
                o = "object" == typeof r.source ? r.source.id : r.source,
                i = "object" == typeof r.target ? r.target.id : r.target,
                s = e.graphData.nodes.find((t) => t.id === o),
                a = e.graphData.nodes.find((t) => t.id === i);
              await ((t) => {
                const e = new URLSearchParams({
                  from_id: t.from_id,
                  to_id: t.to_id,
                  rel_type: t.rel_type,
                  from_type: t.from_type,
                  to_type: t.to_type,
                });
                return qc.delete(`/edge?${e.toString()}`);
              })({
                from_id: o,
                to_id: i,
                rel_type: t.relation,
                from_type: s.type,
                to_type: a.type,
              }),
                n.showToast("删除成功", "关系已删除", "success"),
                await e.loadGraphData(e.currentSessionId);
            } catch (i) {
              const t =
                (null == (o = null == (r = i.response) ? void 0 : r.data)
                  ? void 0
                  : o.detail) || "删除失败";
              n.showToast("删除失败", t, "error");
            }
        }
        function g() {
          confirm(
            `确定要删除节点 "${e.selectedNode.name}" 吗？此操作不可撤销。`
          ) && e.deleteSelectedNode();
        }
        return (
          Er(
            () => e.selectedNode,
            () => {
              (r.value = !1), (o.value = {});
            }
          ),
          (t, n) => (
            fo(),
            vo("div", sf, [
              Ae(e).selectedNode
                ? (fo(),
                  vo("div", lf, [
                    xo("div", uf, [
                      xo("h3", cf, J(Ae(e).selectedNode.name), 1),
                      xo("div", ff, [
                        xo("span", hf, J(Ae(e).selectedNode.type), 1),
                        xo("span", df, J(Ae(e).selectedNode.id), 1),
                      ]),
                    ]),
                    xo("div", pf, [
                      xo("div", gf, [
                        n[1] ||
                          (n[1] = xo(
                            "h4",
                            { class: "section-title" },
                            "属性",
                            -1
                          )),
                        xo(
                          "button",
                          { onClick: f, class: "icon-btn", title: "编辑属性" },
                          [
                            ko(
                              dl,
                              {
                                name: r.value ? "x" : "edit",
                                size: "0.875rem",
                              },
                              null,
                              8,
                              ["name"]
                            ),
                          ]
                        ),
                      ]),
                      r.value
                        ? (fo(),
                          vo("div", wf, [
                            a.value
                              ? (fo(),
                                vo("div", xf, [
                                  (fo(),
                                  vo(
                                    io,
                                    null,
                                    Qn(i, (t) =>
                                      xo(
                                        "div",
                                        { key: t, class: "form-group" },
                                        [
                                          xo("label", kf, J(t), 1),
                                          sn(
                                            xo(
                                              "input",
                                              {
                                                "onUpdate:modelValue": (e) =>
                                                  (o.value[t] = e),
                                                type: "text",
                                                class: "form-input",
                                              },
                                              null,
                                              8,
                                              Sf
                                            ),
                                            [[Qi, o.value[t]]]
                                          ),
                                        ]
                                      )
                                    ),
                                    64
                                  )),
                                  xo(
                                    "div",
                                    {
                                      style: {
                                        display: "flex",
                                        gap: "0.5rem",
                                        "margin-top": "1rem",
                                      },
                                    },
                                    [
                                      xo(
                                        "button",
                                        {
                                          onClick: d,
                                          class: "btn btn-primary",
                                        },
                                        "保存"
                                      ),
                                      xo(
                                        "button",
                                        {
                                          onClick: h,
                                          class: "btn btn-secondary",
                                        },
                                        "取消"
                                      ),
                                    ]
                                  ),
                                ]))
                              : (fo(), vo("div", Ef, "此节点类型无可编辑属性")),
                          ]))
                        : (fo(),
                          vo("div", vf, [
                            s.value
                              ? (fo(),
                                vo("div", yf, [
                                  (fo(!0),
                                  vo(
                                    io,
                                    null,
                                    Qn(
                                      Object.entries(
                                        Ae(e).selectedNode.properties || {}
                                      ),
                                      ([t, e]) => (
                                        fo(),
                                        vo(
                                          "div",
                                          { key: t, class: "property-item" },
                                          [
                                            xo("span", mf, J(t) + ":", 1),
                                            xo("span", _f, J(c(e)), 1),
                                          ]
                                        )
                                      )
                                    ),
                                    128
                                  )),
                                ]))
                              : (fo(), vo("div", bf, "无属性")),
                          ])),
                    ]),
                    xo("div", Cf, [
                      n[2] ||
                        (n[2] = xo(
                          "h4",
                          { class: "section-title" },
                          "观察",
                          -1
                        )),
                      l.value
                        ? (fo(),
                          vo("div", Af, [
                            (fo(!0),
                            vo(
                              io,
                              null,
                              Qn(
                                Ae(e).selectedNode.observations,
                                (t, e) => (
                                  fo(),
                                  vo(
                                    "div",
                                    { key: e, class: "observation-item" },
                                    J(t),
                                    1
                                  )
                                )
                              ),
                              128
                            )),
                          ]))
                        : (fo(), vo("div", Of, "无观察")),
                    ]),
                    xo("div", Tf, [
                      n[3] ||
                        (n[3] = xo(
                          "h4",
                          { class: "section-title" },
                          "连接节点",
                          -1
                        )),
                      u.value.length > 0
                        ? (fo(),
                          vo("div", Nf, [
                            (fo(!0),
                            vo(
                              io,
                              null,
                              Qn(
                                u.value,
                                (t) => (
                                  fo(),
                                  vo(
                                    "div",
                                    {
                                      key: t.link.source + "-" + t.link.target,
                                      class: "neighbor-item",
                                    },
                                    [
                                      xo(
                                        "span",
                                        {
                                          onClick: (n) => {
                                            return (
                                              (r = t.node),
                                              e.selectNode(r),
                                              void e.focusNode(r)
                                            );
                                            var r;
                                          },
                                          class: "neighbor-info",
                                        },
                                        [
                                          xo("span", Mf, J(t.node.name), 1),
                                          xo(
                                            "span",
                                            Rf,
                                            "(" + J(t.relation) + ")",
                                            1
                                          ),
                                        ],
                                        8,
                                        Pf
                                      ),
                                      xo(
                                        "button",
                                        {
                                          onClick: (e) => p(t),
                                          class: "icon-btn delete-btn",
                                          title: "删除关系",
                                        },
                                        [
                                          ko(dl, {
                                            name: "x",
                                            size: "0.875rem",
                                          }),
                                        ],
                                        8,
                                        jf
                                      ),
                                    ]
                                  )
                                )
                              ),
                              128
                            )),
                          ]))
                        : (fo(), vo("div", zf, "无连接")),
                    ]),
                    xo("div", Df, [
                      xo(
                        "button",
                        {
                          onClick: g,
                          class: "btn btn-secondary",
                          style: {
                            background: "rgba(239,68,68,0.1)",
                            color: "#ef4444",
                            width: "100%",
                          },
                        },
                        [
                          ko(dl, { name: "trash-2", size: "0.875rem" }),
                          n[4] || (n[4] = xo("span", null, "删除节点", -1)),
                        ]
                      ),
                    ]),
                  ]))
                : (fo(),
                  vo("div", af, [
                    ko(dl, {
                      name: "mouse-pointer-2",
                      size: "2rem",
                      style: { margin: "0 auto 0.75rem", "stroke-width": "1" },
                    }),
                    n[0] ||
                      (n[0] = xo(
                        "p",
                        {
                          style: {
                            "font-size": "0.75rem",
                            "letter-spacing": "0.05em",
                          },
                        },
                        "选择一个节点",
                        -1
                      )),
                  ])),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-67fd27dd"]]
  ),
  Lf = { key: 0, class: "floating-card" },
  Uf = { class: "card-header" },
  Ff = { class: "card-content" },
  Bf = pl(
    {
      __name: "SideBar",
      setup(t) {
        const e = Yc();
        return (t, n) =>
          Ae(e).selectedNode
            ? (fo(),
              vo("aside", Lf, [
                xo("div", Uf, [
                  n[1] || (n[1] = xo("h3", null, "节点信息", -1)),
                  xo(
                    "button",
                    {
                      onClick: n[0] || (n[0] = (t) => Ae(e).clearSelection()),
                      class: "close-btn",
                    },
                    [ko(dl, { name: "x", size: "1rem" })]
                  ),
                ]),
                xo("div", Ff, [ko(If)]),
              ]))
            : Ao("", !0);
      },
    },
    [["__scopeId", "data-v-db2ed623"]]
  );
var $f = "http://www.w3.org/1999/xhtml";
const Vf = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: $f,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/",
};
function qf(t) {
  var e = (t += ""),
    n = e.indexOf(":");
  return (
    n >= 0 && "xmlns" !== (e = t.slice(0, n)) && (t = t.slice(n + 1)),
    Vf.hasOwnProperty(e) ? { space: Vf[e], local: t } : t
  );
}
function Hf(t) {
  return function () {
    var e = this.ownerDocument,
      n = this.namespaceURI;
    return n === $f && e.documentElement.namespaceURI === $f
      ? e.createElement(t)
      : e.createElementNS(n, t);
  };
}
function Gf(t) {
  return function () {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Wf(t) {
  var e = qf(t);
  return (e.local ? Gf : Hf)(e);
}
function Xf() {}
function Yf(t) {
  return null == t
    ? Xf
    : function () {
        return this.querySelector(t);
      };
}
function Jf() {
  return [];
}
function Kf(t) {
  return null == t
    ? Jf
    : function () {
        return this.querySelectorAll(t);
      };
}
function Zf(t) {
  return function () {
    return null == (e = t.apply(this, arguments))
      ? []
      : Array.isArray(e)
      ? e
      : Array.from(e);
    var e;
  };
}
function Qf(t) {
  return function () {
    return this.matches(t);
  };
}
function th(t) {
  return function (e) {
    return e.matches(t);
  };
}
var eh = Array.prototype.find;
function nh() {
  return this.firstElementChild;
}
var rh = Array.prototype.filter;
function oh() {
  return Array.from(this.children);
}
function ih(t) {
  return new Array(t.length);
}
function sh(t, e) {
  (this.ownerDocument = t.ownerDocument),
    (this.namespaceURI = t.namespaceURI),
    (this._next = null),
    (this._parent = t),
    (this.__data__ = e);
}
function ah(t, e, n, r, o, i) {
  for (var s, a = 0, l = e.length, u = i.length; a < u; ++a)
    (s = e[a]) ? ((s.__data__ = i[a]), (r[a] = s)) : (n[a] = new sh(t, i[a]));
  for (; a < l; ++a) (s = e[a]) && (o[a] = s);
}
function lh(t, e, n, r, o, i, s) {
  var a,
    l,
    u,
    c = new Map(),
    f = e.length,
    h = i.length,
    d = new Array(f);
  for (a = 0; a < f; ++a)
    (l = e[a]) &&
      ((d[a] = u = s.call(l, l.__data__, a, e) + ""),
      c.has(u) ? (o[a] = l) : c.set(u, l));
  for (a = 0; a < h; ++a)
    (u = s.call(t, i[a], a, i) + ""),
      (l = c.get(u))
        ? ((r[a] = l), (l.__data__ = i[a]), c.delete(u))
        : (n[a] = new sh(t, i[a]));
  for (a = 0; a < f; ++a) (l = e[a]) && c.get(d[a]) === l && (o[a] = l);
}
function uh(t) {
  return t.__data__;
}
function ch(t) {
  return "object" == typeof t && "length" in t ? t : Array.from(t);
}
function fh(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function hh(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function dh(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function ph(t, e) {
  return function () {
    this.setAttribute(t, e);
  };
}
function gh(t, e) {
  return function () {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function vh(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function yh(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n
      ? this.removeAttributeNS(t.space, t.local)
      : this.setAttributeNS(t.space, t.local, n);
  };
}
function mh(t) {
  return (
    (t.ownerDocument && t.ownerDocument.defaultView) ||
    (t.document && t) ||
    t.defaultView
  );
}
function _h(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
function bh(t, e, n) {
  return function () {
    this.style.setProperty(t, e, n);
  };
}
function wh(t, e, n) {
  return function () {
    var r = e.apply(this, arguments);
    null == r ? this.style.removeProperty(t) : this.style.setProperty(t, r, n);
  };
}
function xh(t, e) {
  return (
    t.style.getPropertyValue(e) ||
    mh(t).getComputedStyle(t, null).getPropertyValue(e)
  );
}
function kh(t) {
  return function () {
    delete this[t];
  };
}
function Sh(t, e) {
  return function () {
    this[t] = e;
  };
}
function Eh(t, e) {
  return function () {
    var n = e.apply(this, arguments);
    null == n ? delete this[t] : (this[t] = n);
  };
}
function Ch(t) {
  return t.trim().split(/^|\s+/);
}
function Ah(t) {
  return t.classList || new Oh(t);
}
function Oh(t) {
  (this._node = t), (this._names = Ch(t.getAttribute("class") || ""));
}
function Th(t, e) {
  for (var n = Ah(t), r = -1, o = e.length; ++r < o; ) n.add(e[r]);
}
function Nh(t, e) {
  for (var n = Ah(t), r = -1, o = e.length; ++r < o; ) n.remove(e[r]);
}
function Ph(t) {
  return function () {
    Th(this, t);
  };
}
function Mh(t) {
  return function () {
    Nh(this, t);
  };
}
function Rh(t, e) {
  return function () {
    (e.apply(this, arguments) ? Th : Nh)(this, t);
  };
}
function jh() {
  this.textContent = "";
}
function zh(t) {
  return function () {
    this.textContent = t;
  };
}
function Dh(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.textContent = null == e ? "" : e;
  };
}
function Ih() {
  this.innerHTML = "";
}
function Lh(t) {
  return function () {
    this.innerHTML = t;
  };
}
function Uh(t) {
  return function () {
    var e = t.apply(this, arguments);
    this.innerHTML = null == e ? "" : e;
  };
}
function Fh() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Bh() {
  this.previousSibling &&
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function $h() {
  return null;
}
function Vh() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function qh() {
  var t = this.cloneNode(!1),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Hh() {
  var t = this.cloneNode(!0),
    e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function Gh(t) {
  return function () {
    var e = this.__on;
    if (e) {
      for (var n, r = 0, o = -1, i = e.length; r < i; ++r)
        (n = e[r]),
          (t.type && n.type !== t.type) || n.name !== t.name
            ? (e[++o] = n)
            : this.removeEventListener(n.type, n.listener, n.options);
      ++o ? (e.length = o) : delete this.__on;
    }
  };
}
function Wh(t, e, n) {
  return function () {
    var r,
      o = this.__on,
      i = (function (t) {
        return function (e) {
          t.call(this, e, this.__data__);
        };
      })(e);
    if (o)
      for (var s = 0, a = o.length; s < a; ++s)
        if ((r = o[s]).type === t.type && r.name === t.name)
          return (
            this.removeEventListener(r.type, r.listener, r.options),
            this.addEventListener(r.type, (r.listener = i), (r.options = n)),
            void (r.value = e)
          );
    this.addEventListener(t.type, i, n),
      (r = { type: t.type, name: t.name, value: e, listener: i, options: n }),
      o ? o.push(r) : (this.__on = [r]);
  };
}
function Xh(t, e, n) {
  var r = mh(t),
    o = r.CustomEvent;
  "function" == typeof o
    ? (o = new o(e, n))
    : ((o = r.document.createEvent("Event")),
      n
        ? (o.initEvent(e, n.bubbles, n.cancelable), (o.detail = n.detail))
        : o.initEvent(e, !1, !1)),
    t.dispatchEvent(o);
}
function Yh(t, e) {
  return function () {
    return Xh(this, t, e);
  };
}
function Jh(t, e) {
  return function () {
    return Xh(this, t, e.apply(this, arguments));
  };
}
(sh.prototype = {
  constructor: sh,
  appendChild: function (t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function (t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function (t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function (t) {
    return this._parent.querySelectorAll(t);
  },
}),
  (Oh.prototype = {
    add: function (t) {
      this._names.indexOf(t) < 0 &&
        (this._names.push(t),
        this._node.setAttribute("class", this._names.join(" ")));
    },
    remove: function (t) {
      var e = this._names.indexOf(t);
      e >= 0 &&
        (this._names.splice(e, 1),
        this._node.setAttribute("class", this._names.join(" ")));
    },
    contains: function (t) {
      return this._names.indexOf(t) >= 0;
    },
  });
var Kh = [null];
function Zh(t, e) {
  (this._groups = t), (this._parents = e);
}
function Qh() {
  return new Zh([[document.documentElement]], Kh);
}
function td(t) {
  return "string" == typeof t
    ? new Zh([[document.querySelector(t)]], [document.documentElement])
    : new Zh([[t]], Kh);
}
function ed(t, e) {
  if (
    ((t = (function (t) {
      let e;
      for (; (e = t.sourceEvent); ) t = e;
      return t;
    })(t)),
    void 0 === e && (e = t.currentTarget),
    e)
  ) {
    var n = e.ownerSVGElement || e;
    if (n.createSVGPoint) {
      var r = n.createSVGPoint();
      return (
        (r.x = t.clientX),
        (r.y = t.clientY),
        [(r = r.matrixTransform(e.getScreenCTM().inverse())).x, r.y]
      );
    }
    if (e.getBoundingClientRect) {
      var o = e.getBoundingClientRect();
      return [
        t.clientX - o.left - e.clientLeft,
        t.clientY - o.top - e.clientTop,
      ];
    }
  }
  return [t.pageX, t.pageY];
}
Zh.prototype = Qh.prototype = {
  constructor: Zh,
  select: function (t) {
    "function" != typeof t && (t = Yf(t));
    for (
      var e = this._groups, n = e.length, r = new Array(n), o = 0;
      o < n;
      ++o
    )
      for (
        var i, s, a = e[o], l = a.length, u = (r[o] = new Array(l)), c = 0;
        c < l;
        ++c
      )
        (i = a[c]) &&
          (s = t.call(i, i.__data__, c, a)) &&
          ("__data__" in i && (s.__data__ = i.__data__), (u[c] = s));
    return new Zh(r, this._parents);
  },
  selectAll: function (t) {
    t = "function" == typeof t ? Zf(t) : Kf(t);
    for (var e = this._groups, n = e.length, r = [], o = [], i = 0; i < n; ++i)
      for (var s, a = e[i], l = a.length, u = 0; u < l; ++u)
        (s = a[u]) && (r.push(t.call(s, s.__data__, u, a)), o.push(s));
    return new Zh(r, o);
  },
  selectChild: function (t) {
    return this.select(
      null == t
        ? nh
        : (function (t) {
            return function () {
              return eh.call(this.children, t);
            };
          })("function" == typeof t ? t : th(t))
    );
  },
  selectChildren: function (t) {
    return this.selectAll(
      null == t
        ? oh
        : (function (t) {
            return function () {
              return rh.call(this.children, t);
            };
          })("function" == typeof t ? t : th(t))
    );
  },
  filter: function (t) {
    "function" != typeof t && (t = Qf(t));
    for (
      var e = this._groups, n = e.length, r = new Array(n), o = 0;
      o < n;
      ++o
    )
      for (var i, s = e[o], a = s.length, l = (r[o] = []), u = 0; u < a; ++u)
        (i = s[u]) && t.call(i, i.__data__, u, s) && l.push(i);
    return new Zh(r, this._parents);
  },
  data: function (t, e) {
    if (!arguments.length) return Array.from(this, uh);
    var n,
      r = e ? lh : ah,
      o = this._parents,
      i = this._groups;
    "function" != typeof t &&
      ((n = t),
      (t = function () {
        return n;
      }));
    for (
      var s = i.length,
        a = new Array(s),
        l = new Array(s),
        u = new Array(s),
        c = 0;
      c < s;
      ++c
    ) {
      var f = o[c],
        h = i[c],
        d = h.length,
        p = ch(t.call(f, f && f.__data__, c, o)),
        g = p.length,
        v = (l[c] = new Array(g)),
        y = (a[c] = new Array(g));
      r(f, h, v, y, (u[c] = new Array(d)), p, e);
      for (var m, _, b = 0, w = 0; b < g; ++b)
        if ((m = v[b])) {
          for (b >= w && (w = b + 1); !(_ = y[w]) && ++w < g; );
          m._next = _ || null;
        }
    }
    return ((a = new Zh(a, o))._enter = l), (a._exit = u), a;
  },
  enter: function () {
    return new Zh(this._enter || this._groups.map(ih), this._parents);
  },
  exit: function () {
    return new Zh(this._exit || this._groups.map(ih), this._parents);
  },
  join: function (t, e, n) {
    var r = this.enter(),
      o = this,
      i = this.exit();
    return (
      "function" == typeof t
        ? (r = t(r)) && (r = r.selection())
        : (r = r.append(t + "")),
      null != e && (o = e(o)) && (o = o.selection()),
      null == n ? i.remove() : n(i),
      r && o ? r.merge(o).order() : o
    );
  },
  merge: function (t) {
    for (
      var e = t.selection ? t.selection() : t,
        n = this._groups,
        r = e._groups,
        o = n.length,
        i = r.length,
        s = Math.min(o, i),
        a = new Array(o),
        l = 0;
      l < s;
      ++l
    )
      for (
        var u,
          c = n[l],
          f = r[l],
          h = c.length,
          d = (a[l] = new Array(h)),
          p = 0;
        p < h;
        ++p
      )
        (u = c[p] || f[p]) && (d[p] = u);
    for (; l < o; ++l) a[l] = n[l];
    return new Zh(a, this._parents);
  },
  selection: function () {
    return this;
  },
  order: function () {
    for (var t = this._groups, e = -1, n = t.length; ++e < n; )
      for (var r, o = t[e], i = o.length - 1, s = o[i]; --i >= 0; )
        (r = o[i]) &&
          (s &&
            4 ^ r.compareDocumentPosition(s) &&
            s.parentNode.insertBefore(r, s),
          (s = r));
    return this;
  },
  sort: function (t) {
    function e(e, n) {
      return e && n ? t(e.__data__, n.__data__) : !e - !n;
    }
    t || (t = fh);
    for (
      var n = this._groups, r = n.length, o = new Array(r), i = 0;
      i < r;
      ++i
    ) {
      for (
        var s, a = n[i], l = a.length, u = (o[i] = new Array(l)), c = 0;
        c < l;
        ++c
      )
        (s = a[c]) && (u[c] = s);
      u.sort(e);
    }
    return new Zh(o, this._parents).order();
  },
  call: function () {
    var t = arguments[0];
    return (arguments[0] = this), t.apply(null, arguments), this;
  },
  nodes: function () {
    return Array.from(this);
  },
  node: function () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
      for (var r = t[e], o = 0, i = r.length; o < i; ++o) {
        var s = r[o];
        if (s) return s;
      }
    return null;
  },
  size: function () {
    let t = 0;
    for (const e of this) ++t;
    return t;
  },
  empty: function () {
    return !this.node();
  },
  each: function (t) {
    for (var e = this._groups, n = 0, r = e.length; n < r; ++n)
      for (var o, i = e[n], s = 0, a = i.length; s < a; ++s)
        (o = i[s]) && t.call(o, o.__data__, s, i);
    return this;
  },
  attr: function (t, e) {
    var n = qf(t);
    if (arguments.length < 2) {
      var r = this.node();
      return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
    }
    return this.each(
      (null == e
        ? n.local
          ? dh
          : hh
        : "function" == typeof e
        ? n.local
          ? yh
          : vh
        : n.local
        ? gh
        : ph)(n, e)
    );
  },
  style: function (t, e, n) {
    return arguments.length > 1
      ? this.each(
          (null == e ? _h : "function" == typeof e ? wh : bh)(
            t,
            e,
            null == n ? "" : n
          )
        )
      : xh(this.node(), t);
  },
  property: function (t, e) {
    return arguments.length > 1
      ? this.each((null == e ? kh : "function" == typeof e ? Eh : Sh)(t, e))
      : this.node()[t];
  },
  classed: function (t, e) {
    var n = Ch(t + "");
    if (arguments.length < 2) {
      for (var r = Ah(this.node()), o = -1, i = n.length; ++o < i; )
        if (!r.contains(n[o])) return !1;
      return !0;
    }
    return this.each(("function" == typeof e ? Rh : e ? Ph : Mh)(n, e));
  },
  text: function (t) {
    return arguments.length
      ? this.each(null == t ? jh : ("function" == typeof t ? Dh : zh)(t))
      : this.node().textContent;
  },
  html: function (t) {
    return arguments.length
      ? this.each(null == t ? Ih : ("function" == typeof t ? Uh : Lh)(t))
      : this.node().innerHTML;
  },
  raise: function () {
    return this.each(Fh);
  },
  lower: function () {
    return this.each(Bh);
  },
  append: function (t) {
    var e = "function" == typeof t ? t : Wf(t);
    return this.select(function () {
      return this.appendChild(e.apply(this, arguments));
    });
  },
  insert: function (t, e) {
    var n = "function" == typeof t ? t : Wf(t),
      r = null == e ? $h : "function" == typeof e ? e : Yf(e);
    return this.select(function () {
      return this.insertBefore(
        n.apply(this, arguments),
        r.apply(this, arguments) || null
      );
    });
  },
  remove: function () {
    return this.each(Vh);
  },
  clone: function (t) {
    return this.select(t ? Hh : qh);
  },
  datum: function (t) {
    return arguments.length
      ? this.property("__data__", t)
      : this.node().__data__;
  },
  on: function (t, e, n) {
    var r,
      o,
      i = (function (t) {
        return t
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = "",
              n = t.indexOf(".");
            return (
              n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))),
              { type: t, name: e }
            );
          });
      })(t + ""),
      s = i.length;
    if (!(arguments.length < 2)) {
      for (a = e ? Wh : Gh, r = 0; r < s; ++r) this.each(a(i[r], e, n));
      return this;
    }
    var a = this.node().__on;
    if (a)
      for (var l, u = 0, c = a.length; u < c; ++u)
        for (r = 0, l = a[u]; r < s; ++r)
          if ((o = i[r]).type === l.type && o.name === l.name) return l.value;
  },
  dispatch: function (t, e) {
    return this.each(("function" == typeof e ? Jh : Yh)(t, e));
  },
  [Symbol.iterator]: function* () {
    for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
      for (var r, o = t[e], i = 0, s = o.length; i < s; ++i)
        (r = o[i]) && (yield r);
  },
};
var nd = { value: () => {} };
function rd() {
  for (var t, e = 0, n = arguments.length, r = {}; e < n; ++e) {
    if (!(t = arguments[e] + "") || t in r || /[\s.]/.test(t))
      throw new Error("illegal type: " + t);
    r[t] = [];
  }
  return new od(r);
}
function od(t) {
  this._ = t;
}
function id(t, e) {
  for (var n, r = 0, o = t.length; r < o; ++r)
    if ((n = t[r]).name === e) return n.value;
}
function sd(t, e, n) {
  for (var r = 0, o = t.length; r < o; ++r)
    if (t[r].name === e) {
      (t[r] = nd), (t = t.slice(0, r).concat(t.slice(r + 1)));
      break;
    }
  return null != n && t.push({ name: e, value: n }), t;
}
od.prototype = rd.prototype = {
  constructor: od,
  on: function (t, e) {
    var n,
      r,
      o = this._,
      i =
        ((r = o),
        (t + "")
          .trim()
          .split(/^|\s+/)
          .map(function (t) {
            var e = "",
              n = t.indexOf(".");
            if (
              (n >= 0 && ((e = t.slice(n + 1)), (t = t.slice(0, n))),
              t && !r.hasOwnProperty(t))
            )
              throw new Error("unknown type: " + t);
            return { type: t, name: e };
          })),
      s = -1,
      a = i.length;
    if (!(arguments.length < 2)) {
      if (null != e && "function" != typeof e)
        throw new Error("invalid callback: " + e);
      for (; ++s < a; )
        if ((n = (t = i[s]).type)) o[n] = sd(o[n], t.name, e);
        else if (null == e) for (n in o) o[n] = sd(o[n], t.name, null);
      return this;
    }
    for (; ++s < a; )
      if ((n = (t = i[s]).type) && (n = id(o[n], t.name))) return n;
  },
  copy: function () {
    var t = {},
      e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new od(t);
  },
  call: function (t, e) {
    if ((n = arguments.length - 2) > 0)
      for (var n, r, o = new Array(n), i = 0; i < n; ++i)
        o[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (i = 0, n = (r = this._[t]).length; i < n; ++i) r[i].value.apply(e, o);
  },
  apply: function (t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var r = this._[t], o = 0, i = r.length; o < i; ++o)
      r[o].value.apply(e, n);
  },
};
const ad = { passive: !1 },
  ld = { capture: !0, passive: !1 };
function ud(t) {
  t.stopImmediatePropagation();
}
function cd(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function fd(t) {
  var e = t.document.documentElement,
    n = td(t).on("dragstart.drag", cd, ld);
  "onselectstart" in e
    ? n.on("selectstart.drag", cd, ld)
    : ((e.__noselect = e.style.MozUserSelect),
      (e.style.MozUserSelect = "none"));
}
function hd(t, e) {
  var n = t.document.documentElement,
    r = td(t).on("dragstart.drag", null);
  e &&
    (r.on("click.drag", cd, ld),
    setTimeout(function () {
      r.on("click.drag", null);
    }, 0)),
    "onselectstart" in n
      ? r.on("selectstart.drag", null)
      : ((n.style.MozUserSelect = n.__noselect), delete n.__noselect);
}
const dd = (t) => () => t;
function pd(
  t,
  {
    sourceEvent: e,
    subject: n,
    target: r,
    identifier: o,
    active: i,
    x: s,
    y: a,
    dx: l,
    dy: u,
    dispatch: c,
  }
) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    identifier: { value: o, enumerable: !0, configurable: !0 },
    active: { value: i, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: u, enumerable: !0, configurable: !0 },
    _: { value: c },
  });
}
function gd(t) {
  return !t.ctrlKey && !t.button;
}
function vd() {
  return this.parentNode;
}
function yd(t, e) {
  return null == e ? { x: t.x, y: t.y } : e;
}
function md() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function _d(t, e, n) {
  (t.prototype = e.prototype = n), (n.constructor = t);
}
function bd(t, e) {
  var n = Object.create(t.prototype);
  for (var r in e) n[r] = e[r];
  return n;
}
function wd() {}
pd.prototype.on = function () {
  var t = this._.on.apply(this._, arguments);
  return t === this._ ? this : t;
};
var xd = 0.7,
  kd = 1 / xd,
  Sd = "\\s*([+-]?\\d+)\\s*",
  Ed = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
  Cd = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
  Ad = /^#([0-9a-f]{3,8})$/,
  Od = new RegExp(`^rgb\\(${Sd},${Sd},${Sd}\\)$`),
  Td = new RegExp(`^rgb\\(${Cd},${Cd},${Cd}\\)$`),
  Nd = new RegExp(`^rgba\\(${Sd},${Sd},${Sd},${Ed}\\)$`),
  Pd = new RegExp(`^rgba\\(${Cd},${Cd},${Cd},${Ed}\\)$`),
  Md = new RegExp(`^hsl\\(${Ed},${Cd},${Cd}\\)$`),
  Rd = new RegExp(`^hsla\\(${Ed},${Cd},${Cd},${Ed}\\)$`),
  jd = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
function zd() {
  return this.rgb().formatHex();
}
function Dd() {
  return this.rgb().formatRgb();
}
function Id(t) {
  var e, n;
  return (
    (t = (t + "").trim().toLowerCase()),
    (e = Ad.exec(t))
      ? ((n = e[1].length),
        (e = parseInt(e[1], 16)),
        6 === n
          ? Ld(e)
          : 3 === n
          ? new Bd(
              ((e >> 8) & 15) | ((e >> 4) & 240),
              ((e >> 4) & 15) | (240 & e),
              ((15 & e) << 4) | (15 & e),
              1
            )
          : 8 === n
          ? Ud(
              (e >> 24) & 255,
              (e >> 16) & 255,
              (e >> 8) & 255,
              (255 & e) / 255
            )
          : 4 === n
          ? Ud(
              ((e >> 12) & 15) | ((e >> 8) & 240),
              ((e >> 8) & 15) | ((e >> 4) & 240),
              ((e >> 4) & 15) | (240 & e),
              (((15 & e) << 4) | (15 & e)) / 255
            )
          : null)
      : (e = Od.exec(t))
      ? new Bd(e[1], e[2], e[3], 1)
      : (e = Td.exec(t))
      ? new Bd((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
      : (e = Nd.exec(t))
      ? Ud(e[1], e[2], e[3], e[4])
      : (e = Pd.exec(t))
      ? Ud((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
      : (e = Md.exec(t))
      ? Wd(e[1], e[2] / 100, e[3] / 100, 1)
      : (e = Rd.exec(t))
      ? Wd(e[1], e[2] / 100, e[3] / 100, e[4])
      : jd.hasOwnProperty(t)
      ? Ld(jd[t])
      : "transparent" === t
      ? new Bd(NaN, NaN, NaN, 0)
      : null
  );
}
function Ld(t) {
  return new Bd((t >> 16) & 255, (t >> 8) & 255, 255 & t, 1);
}
function Ud(t, e, n, r) {
  return r <= 0 && (t = e = n = NaN), new Bd(t, e, n, r);
}
function Fd(t, e, n, r) {
  return 1 === arguments.length
    ? ((o = t) instanceof wd || (o = Id(o)),
      o ? new Bd((o = o.rgb()).r, o.g, o.b, o.opacity) : new Bd())
    : new Bd(t, e, n, null == r ? 1 : r);
  var o;
}
function Bd(t, e, n, r) {
  (this.r = +t), (this.g = +e), (this.b = +n), (this.opacity = +r);
}
function $d() {
  return `#${Gd(this.r)}${Gd(this.g)}${Gd(this.b)}`;
}
function Vd() {
  const t = qd(this.opacity);
  return `${1 === t ? "rgb(" : "rgba("}${Hd(this.r)}, ${Hd(this.g)}, ${Hd(
    this.b
  )}${1 === t ? ")" : `, ${t})`}`;
}
function qd(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function Hd(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function Gd(t) {
  return ((t = Hd(t)) < 16 ? "0" : "") + t.toString(16);
}
function Wd(t, e, n, r) {
  return (
    r <= 0
      ? (t = e = n = NaN)
      : n <= 0 || n >= 1
      ? (t = e = NaN)
      : e <= 0 && (t = NaN),
    new Yd(t, e, n, r)
  );
}
function Xd(t) {
  if (t instanceof Yd) return new Yd(t.h, t.s, t.l, t.opacity);
  if ((t instanceof wd || (t = Id(t)), !t)) return new Yd();
  if (t instanceof Yd) return t;
  var e = (t = t.rgb()).r / 255,
    n = t.g / 255,
    r = t.b / 255,
    o = Math.min(e, n, r),
    i = Math.max(e, n, r),
    s = NaN,
    a = i - o,
    l = (i + o) / 2;
  return (
    a
      ? ((s =
          e === i
            ? (n - r) / a + 6 * (n < r)
            : n === i
            ? (r - e) / a + 2
            : (e - n) / a + 4),
        (a /= l < 0.5 ? i + o : 2 - i - o),
        (s *= 60))
      : (a = l > 0 && l < 1 ? 0 : s),
    new Yd(s, a, l, t.opacity)
  );
}
function Yd(t, e, n, r) {
  (this.h = +t), (this.s = +e), (this.l = +n), (this.opacity = +r);
}
function Jd(t) {
  return (t = (t || 0) % 360) < 0 ? t + 360 : t;
}
function Kd(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Zd(t, e, n) {
  return (
    255 *
    (t < 60
      ? e + ((n - e) * t) / 60
      : t < 180
      ? n
      : t < 240
      ? e + ((n - e) * (240 - t)) / 60
      : e)
  );
}
_d(wd, Id, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: zd,
  formatHex: zd,
  formatHex8: function () {
    return this.rgb().formatHex8();
  },
  formatHsl: function () {
    return Xd(this).formatHsl();
  },
  formatRgb: Dd,
  toString: Dd,
}),
  _d(
    Bd,
    Fd,
    bd(wd, {
      brighter(t) {
        return (
          (t = null == t ? kd : Math.pow(kd, t)),
          new Bd(this.r * t, this.g * t, this.b * t, this.opacity)
        );
      },
      darker(t) {
        return (
          (t = null == t ? xd : Math.pow(xd, t)),
          new Bd(this.r * t, this.g * t, this.b * t, this.opacity)
        );
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Bd(Hd(this.r), Hd(this.g), Hd(this.b), qd(this.opacity));
      },
      displayable() {
        return (
          -0.5 <= this.r &&
          this.r < 255.5 &&
          -0.5 <= this.g &&
          this.g < 255.5 &&
          -0.5 <= this.b &&
          this.b < 255.5 &&
          0 <= this.opacity &&
          this.opacity <= 1
        );
      },
      hex: $d,
      formatHex: $d,
      formatHex8: function () {
        return `#${Gd(this.r)}${Gd(this.g)}${Gd(this.b)}${Gd(
          255 * (isNaN(this.opacity) ? 1 : this.opacity)
        )}`;
      },
      formatRgb: Vd,
      toString: Vd,
    })
  ),
  _d(
    Yd,
    function (t, e, n, r) {
      return 1 === arguments.length
        ? Xd(t)
        : new Yd(t, e, n, null == r ? 1 : r);
    },
    bd(wd, {
      brighter(t) {
        return (
          (t = null == t ? kd : Math.pow(kd, t)),
          new Yd(this.h, this.s, this.l * t, this.opacity)
        );
      },
      darker(t) {
        return (
          (t = null == t ? xd : Math.pow(xd, t)),
          new Yd(this.h, this.s, this.l * t, this.opacity)
        );
      },
      rgb() {
        var t = (this.h % 360) + 360 * (this.h < 0),
          e = isNaN(t) || isNaN(this.s) ? 0 : this.s,
          n = this.l,
          r = n + (n < 0.5 ? n : 1 - n) * e,
          o = 2 * n - r;
        return new Bd(
          Zd(t >= 240 ? t - 240 : t + 120, o, r),
          Zd(t, o, r),
          Zd(t < 120 ? t + 240 : t - 120, o, r),
          this.opacity
        );
      },
      clamp() {
        return new Yd(Jd(this.h), Kd(this.s), Kd(this.l), qd(this.opacity));
      },
      displayable() {
        return (
          ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
          0 <= this.l &&
          this.l <= 1 &&
          0 <= this.opacity &&
          this.opacity <= 1
        );
      },
      formatHsl() {
        const t = qd(this.opacity);
        return `${1 === t ? "hsl(" : "hsla("}${Jd(this.h)}, ${
          100 * Kd(this.s)
        }%, ${100 * Kd(this.l)}%${1 === t ? ")" : `, ${t})`}`;
      },
    })
  );
const Qd = (t) => () => t;
function tp(t) {
  return 1 === (t = +t)
    ? ep
    : function (e, n) {
        return n - e
          ? (function (t, e, n) {
              return (
                (t = Math.pow(t, n)),
                (e = Math.pow(e, n) - t),
                (n = 1 / n),
                function (r) {
                  return Math.pow(t + r * e, n);
                }
              );
            })(e, n, t)
          : Qd(isNaN(e) ? n : e);
      };
}
function ep(t, e) {
  var n = e - t;
  return n
    ? (function (t, e) {
        return function (n) {
          return t + n * e;
        };
      })(t, n)
    : Qd(isNaN(t) ? e : t);
}
const np = (function t(e) {
  var n = tp(e);
  function r(t, e) {
    var r = n((t = Fd(t)).r, (e = Fd(e)).r),
      o = n(t.g, e.g),
      i = n(t.b, e.b),
      s = ep(t.opacity, e.opacity);
    return function (e) {
      return (
        (t.r = r(e)), (t.g = o(e)), (t.b = i(e)), (t.opacity = s(e)), t + ""
      );
    };
  }
  return (r.gamma = t), r;
})(1);
function rp(t, e) {
  return (
    (t = +t),
    (e = +e),
    function (n) {
      return t * (1 - n) + e * n;
    }
  );
}
var op = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  ip = new RegExp(op.source, "g");
function sp(t, e) {
  var n,
    r,
    o,
    i = (op.lastIndex = ip.lastIndex = 0),
    s = -1,
    a = [],
    l = [];
  for (t += "", e += ""; (n = op.exec(t)) && (r = ip.exec(e)); )
    (o = r.index) > i &&
      ((o = e.slice(i, o)), a[s] ? (a[s] += o) : (a[++s] = o)),
      (n = n[0]) === (r = r[0])
        ? a[s]
          ? (a[s] += r)
          : (a[++s] = r)
        : ((a[++s] = null), l.push({ i: s, x: rp(n, r) })),
      (i = ip.lastIndex);
  return (
    i < e.length && ((o = e.slice(i)), a[s] ? (a[s] += o) : (a[++s] = o)),
    a.length < 2
      ? l[0]
        ? (function (t) {
            return function (e) {
              return t(e) + "";
            };
          })(l[0].x)
        : (function (t) {
            return function () {
              return t;
            };
          })(e)
      : ((e = l.length),
        function (t) {
          for (var n, r = 0; r < e; ++r) a[(n = l[r]).i] = n.x(t);
          return a.join("");
        })
  );
}
var ap,
  lp = 180 / Math.PI,
  up = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1,
  };
function cp(t, e, n, r, o, i) {
  var s, a, l;
  return (
    (s = Math.sqrt(t * t + e * e)) && ((t /= s), (e /= s)),
    (l = t * n + e * r) && ((n -= t * l), (r -= e * l)),
    (a = Math.sqrt(n * n + r * r)) && ((n /= a), (r /= a), (l /= a)),
    t * r < e * n && ((t = -t), (e = -e), (l = -l), (s = -s)),
    {
      translateX: o,
      translateY: i,
      rotate: Math.atan2(e, t) * lp,
      skewX: Math.atan(l) * lp,
      scaleX: s,
      scaleY: a,
    }
  );
}
function fp(t, e, n, r) {
  function o(t) {
    return t.length ? t.pop() + " " : "";
  }
  return function (i, s) {
    var a = [],
      l = [];
    return (
      (i = t(i)),
      (s = t(s)),
      (function (t, r, o, i, s, a) {
        if (t !== o || r !== i) {
          var l = s.push("translate(", null, e, null, n);
          a.push({ i: l - 4, x: rp(t, o) }, { i: l - 2, x: rp(r, i) });
        } else (o || i) && s.push("translate(" + o + e + i + n);
      })(i.translateX, i.translateY, s.translateX, s.translateY, a, l),
      (function (t, e, n, i) {
        t !== e
          ? (t - e > 180 ? (e += 360) : e - t > 180 && (t += 360),
            i.push({ i: n.push(o(n) + "rotate(", null, r) - 2, x: rp(t, e) }))
          : e && n.push(o(n) + "rotate(" + e + r);
      })(i.rotate, s.rotate, a, l),
      (function (t, e, n, i) {
        t !== e
          ? i.push({ i: n.push(o(n) + "skewX(", null, r) - 2, x: rp(t, e) })
          : e && n.push(o(n) + "skewX(" + e + r);
      })(i.skewX, s.skewX, a, l),
      (function (t, e, n, r, i, s) {
        if (t !== n || e !== r) {
          var a = i.push(o(i) + "scale(", null, ",", null, ")");
          s.push({ i: a - 4, x: rp(t, n) }, { i: a - 2, x: rp(e, r) });
        } else
          (1 === n && 1 === r) || i.push(o(i) + "scale(" + n + "," + r + ")");
      })(i.scaleX, i.scaleY, s.scaleX, s.scaleY, a, l),
      (i = s = null),
      function (t) {
        for (var e, n = -1, r = l.length; ++n < r; ) a[(e = l[n]).i] = e.x(t);
        return a.join("");
      }
    );
  };
}
var hp = fp(
    function (t) {
      const e = new (
        "function" == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix
      )(t + "");
      return e.isIdentity ? up : cp(e.a, e.b, e.c, e.d, e.e, e.f);
    },
    "px, ",
    "px)",
    "deg)"
  ),
  dp = fp(
    function (t) {
      return null == t
        ? up
        : (ap ||
            (ap = document.createElementNS("http://www.w3.org/2000/svg", "g")),
          ap.setAttribute("transform", t),
          (t = ap.transform.baseVal.consolidate())
            ? cp((t = t.matrix).a, t.b, t.c, t.d, t.e, t.f)
            : up);
    },
    ", ",
    ")",
    ")"
  );
function pp(t) {
  return ((t = Math.exp(t)) + 1 / t) / 2;
}
const gp = (function t(e, n, r) {
  function o(t, o) {
    var i,
      s,
      a = t[0],
      l = t[1],
      u = t[2],
      c = o[0],
      f = o[1],
      h = o[2],
      d = c - a,
      p = f - l,
      g = d * d + p * p;
    if (g < 1e-12)
      (s = Math.log(h / u) / e),
        (i = function (t) {
          return [a + t * d, l + t * p, u * Math.exp(e * t * s)];
        });
    else {
      var v = Math.sqrt(g),
        y = (h * h - u * u + r * g) / (2 * u * n * v),
        m = (h * h - u * u - r * g) / (2 * h * n * v),
        _ = Math.log(Math.sqrt(y * y + 1) - y),
        b = Math.log(Math.sqrt(m * m + 1) - m);
      (s = (b - _) / e),
        (i = function (t) {
          var r,
            o = t * s,
            i = pp(_),
            c =
              (u / (n * v)) *
              (i * ((r = e * o + _), ((r = Math.exp(2 * r)) - 1) / (r + 1)) -
                (function (t) {
                  return ((t = Math.exp(t)) - 1 / t) / 2;
                })(_));
          return [a + c * d, l + c * p, (u * i) / pp(e * o + _)];
        });
    }
    return (i.duration = (1e3 * s * e) / Math.SQRT2), i;
  }
  return (
    (o.rho = function (e) {
      var n = Math.max(0.001, +e),
        r = n * n;
      return t(n, r, r * r);
    }),
    o
  );
})(Math.SQRT2, 2, 4);
var vp,
  yp,
  mp = 0,
  _p = 0,
  bp = 0,
  wp = 0,
  xp = 0,
  kp = 0,
  Sp = "object" == typeof performance && performance.now ? performance : Date,
  Ep =
    "object" == typeof window && window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : function (t) {
          setTimeout(t, 17);
        };
function Cp() {
  return xp || (Ep(Ap), (xp = Sp.now() + kp));
}
function Ap() {
  xp = 0;
}
function Op() {
  this._call = this._time = this._next = null;
}
function Tp(t, e, n) {
  var r = new Op();
  return r.restart(t, e, n), r;
}
function Np() {
  (xp = (wp = Sp.now()) + kp), (mp = _p = 0);
  try {
    !(function () {
      Cp(), ++mp;
      for (var t, e = vp; e; )
        (t = xp - e._time) >= 0 && e._call.call(void 0, t), (e = e._next);
      --mp;
    })();
  } finally {
    (mp = 0),
      (function () {
        var t,
          e,
          n = vp,
          r = 1 / 0;
        for (; n; )
          n._call
            ? (r > n._time && (r = n._time), (t = n), (n = n._next))
            : ((e = n._next),
              (n._next = null),
              (n = t ? (t._next = e) : (vp = e)));
        (yp = t), Mp(r);
      })(),
      (xp = 0);
  }
}
function Pp() {
  var t = Sp.now(),
    e = t - wp;
  e > 1e3 && ((kp -= e), (wp = t));
}
function Mp(t) {
  mp ||
    (_p && (_p = clearTimeout(_p)),
    t - xp > 24
      ? (t < 1 / 0 && (_p = setTimeout(Np, t - Sp.now() - kp)),
        bp && (bp = clearInterval(bp)))
      : (bp || ((wp = Sp.now()), (bp = setInterval(Pp, 1e3))),
        (mp = 1),
        Ep(Np)));
}
function Rp(t, e, n) {
  var r = new Op();
  return (
    (e = null == e ? 0 : +e),
    r.restart(
      (n) => {
        r.stop(), t(n + e);
      },
      e,
      n
    ),
    r
  );
}
Op.prototype = Tp.prototype = {
  constructor: Op,
  restart: function (t, e, n) {
    if ("function" != typeof t)
      throw new TypeError("callback is not a function");
    (n = (null == n ? Cp() : +n) + (null == e ? 0 : +e)),
      this._next ||
        yp === this ||
        (yp ? (yp._next = this) : (vp = this), (yp = this)),
      (this._call = t),
      (this._time = n),
      Mp();
  },
  stop: function () {
    this._call && ((this._call = null), (this._time = 1 / 0), Mp());
  },
};
var jp = rd("start", "end", "cancel", "interrupt"),
  zp = [];
function Dp(t, e, n, r, o, i) {
  var s = t.__transition;
  if (s) {
    if (n in s) return;
  } else t.__transition = {};
  !(function (t, e, n) {
    var r,
      o = t.__transition;
    function i(t) {
      (n.state = 1),
        n.timer.restart(s, n.delay, n.time),
        n.delay <= t && s(t - n.delay);
    }
    function s(i) {
      var u, c, f, h;
      if (1 !== n.state) return l();
      for (u in o)
        if ((h = o[u]).name === n.name) {
          if (3 === h.state) return Rp(s);
          4 === h.state
            ? ((h.state = 6),
              h.timer.stop(),
              h.on.call("interrupt", t, t.__data__, h.index, h.group),
              delete o[u])
            : +u < e &&
              ((h.state = 6),
              h.timer.stop(),
              h.on.call("cancel", t, t.__data__, h.index, h.group),
              delete o[u]);
        }
      if (
        (Rp(function () {
          3 === n.state &&
            ((n.state = 4), n.timer.restart(a, n.delay, n.time), a(i));
        }),
        (n.state = 2),
        n.on.call("start", t, t.__data__, n.index, n.group),
        2 === n.state)
      ) {
        for (
          n.state = 3, r = new Array((f = n.tween.length)), u = 0, c = -1;
          u < f;
          ++u
        )
          (h = n.tween[u].value.call(t, t.__data__, n.index, n.group)) &&
            (r[++c] = h);
        r.length = c + 1;
      }
    }
    function a(e) {
      for (
        var o =
            e < n.duration
              ? n.ease.call(null, e / n.duration)
              : (n.timer.restart(l), (n.state = 5), 1),
          i = -1,
          s = r.length;
        ++i < s;

      )
        r[i].call(t, o);
      5 === n.state && (n.on.call("end", t, t.__data__, n.index, n.group), l());
    }
    function l() {
      for (var r in ((n.state = 6), n.timer.stop(), delete o[e], o)) return;
      delete t.__transition;
    }
    (o[e] = n), (n.timer = Tp(i, 0, n.time));
  })(t, n, {
    name: e,
    index: r,
    group: o,
    on: jp,
    tween: zp,
    time: i.time,
    delay: i.delay,
    duration: i.duration,
    ease: i.ease,
    timer: null,
    state: 0,
  });
}
function Ip(t, e) {
  var n = Up(t, e);
  if (n.state > 0) throw new Error("too late; already scheduled");
  return n;
}
function Lp(t, e) {
  var n = Up(t, e);
  if (n.state > 3) throw new Error("too late; already running");
  return n;
}
function Up(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Fp(t, e) {
  var n,
    r,
    o,
    i = t.__transition,
    s = !0;
  if (i) {
    for (o in ((e = null == e ? null : e + ""), i))
      (n = i[o]).name === e
        ? ((r = n.state > 2 && n.state < 5),
          (n.state = 6),
          n.timer.stop(),
          n.on.call(
            r ? "interrupt" : "cancel",
            t,
            t.__data__,
            n.index,
            n.group
          ),
          delete i[o])
        : (s = !1);
    s && delete t.__transition;
  }
}
function Bp(t, e) {
  var n, r;
  return function () {
    var o = Lp(this, t),
      i = o.tween;
    if (i !== n)
      for (var s = 0, a = (r = n = i).length; s < a; ++s)
        if (r[s].name === e) {
          (r = r.slice()).splice(s, 1);
          break;
        }
    o.tween = r;
  };
}
function $p(t, e, n) {
  var r, o;
  if ("function" != typeof n) throw new Error();
  return function () {
    var i = Lp(this, t),
      s = i.tween;
    if (s !== r) {
      o = (r = s).slice();
      for (var a = { name: e, value: n }, l = 0, u = o.length; l < u; ++l)
        if (o[l].name === e) {
          o[l] = a;
          break;
        }
      l === u && o.push(a);
    }
    i.tween = o;
  };
}
function Vp(t, e, n) {
  var r = t._id;
  return (
    t.each(function () {
      var t = Lp(this, r);
      (t.value || (t.value = {}))[e] = n.apply(this, arguments);
    }),
    function (t) {
      return Up(t, r).value[e];
    }
  );
}
function qp(t, e) {
  var n;
  return (
    "number" == typeof e
      ? rp
      : e instanceof Id
      ? np
      : (n = Id(e))
      ? ((e = n), np)
      : sp
  )(t, e);
}
function Hp(t) {
  return function () {
    this.removeAttribute(t);
  };
}
function Gp(t) {
  return function () {
    this.removeAttributeNS(t.space, t.local);
  };
}
function Wp(t, e, n) {
  var r,
    o,
    i = n + "";
  return function () {
    var s = this.getAttribute(t);
    return s === i ? null : s === r ? o : (o = e((r = s), n));
  };
}
function Xp(t, e, n) {
  var r,
    o,
    i = n + "";
  return function () {
    var s = this.getAttributeNS(t.space, t.local);
    return s === i ? null : s === r ? o : (o = e((r = s), n));
  };
}
function Yp(t, e, n) {
  var r, o, i;
  return function () {
    var s,
      a,
      l = n(this);
    if (null != l)
      return (s = this.getAttribute(t)) === (a = l + "")
        ? null
        : s === r && a === o
        ? i
        : ((o = a), (i = e((r = s), l)));
    this.removeAttribute(t);
  };
}
function Jp(t, e, n) {
  var r, o, i;
  return function () {
    var s,
      a,
      l = n(this);
    if (null != l)
      return (s = this.getAttributeNS(t.space, t.local)) === (a = l + "")
        ? null
        : s === r && a === o
        ? i
        : ((o = a), (i = e((r = s), l)));
    this.removeAttributeNS(t.space, t.local);
  };
}
function Kp(t, e) {
  var n, r;
  function o() {
    var o = e.apply(this, arguments);
    return (
      o !== r &&
        (n =
          (r = o) &&
          (function (t, e) {
            return function (n) {
              this.setAttributeNS(t.space, t.local, e.call(this, n));
            };
          })(t, o)),
      n
    );
  }
  return (o._value = e), o;
}
function Zp(t, e) {
  var n, r;
  function o() {
    var o = e.apply(this, arguments);
    return (
      o !== r &&
        (n =
          (r = o) &&
          (function (t, e) {
            return function (n) {
              this.setAttribute(t, e.call(this, n));
            };
          })(t, o)),
      n
    );
  }
  return (o._value = e), o;
}
function Qp(t, e) {
  return function () {
    Ip(this, t).delay = +e.apply(this, arguments);
  };
}
function tg(t, e) {
  return (
    (e = +e),
    function () {
      Ip(this, t).delay = e;
    }
  );
}
function eg(t, e) {
  return function () {
    Lp(this, t).duration = +e.apply(this, arguments);
  };
}
function ng(t, e) {
  return (
    (e = +e),
    function () {
      Lp(this, t).duration = e;
    }
  );
}
var rg = Qh.prototype.constructor;
function og(t) {
  return function () {
    this.style.removeProperty(t);
  };
}
var ig = 0;
function sg(t, e, n, r) {
  (this._groups = t), (this._parents = e), (this._name = n), (this._id = r);
}
function ag() {
  return ++ig;
}
var lg = Qh.prototype;
sg.prototype = {
  constructor: sg,
  select: function (t) {
    var e = this._name,
      n = this._id;
    "function" != typeof t && (t = Yf(t));
    for (
      var r = this._groups, o = r.length, i = new Array(o), s = 0;
      s < o;
      ++s
    )
      for (
        var a, l, u = r[s], c = u.length, f = (i[s] = new Array(c)), h = 0;
        h < c;
        ++h
      )
        (a = u[h]) &&
          (l = t.call(a, a.__data__, h, u)) &&
          ("__data__" in a && (l.__data__ = a.__data__),
          (f[h] = l),
          Dp(f[h], e, n, h, f, Up(a, n)));
    return new sg(i, this._parents, e, n);
  },
  selectAll: function (t) {
    var e = this._name,
      n = this._id;
    "function" != typeof t && (t = Kf(t));
    for (var r = this._groups, o = r.length, i = [], s = [], a = 0; a < o; ++a)
      for (var l, u = r[a], c = u.length, f = 0; f < c; ++f)
        if ((l = u[f])) {
          for (
            var h,
              d = t.call(l, l.__data__, f, u),
              p = Up(l, n),
              g = 0,
              v = d.length;
            g < v;
            ++g
          )
            (h = d[g]) && Dp(h, e, n, g, d, p);
          i.push(d), s.push(l);
        }
    return new sg(i, s, e, n);
  },
  selectChild: lg.selectChild,
  selectChildren: lg.selectChildren,
  filter: function (t) {
    "function" != typeof t && (t = Qf(t));
    for (
      var e = this._groups, n = e.length, r = new Array(n), o = 0;
      o < n;
      ++o
    )
      for (var i, s = e[o], a = s.length, l = (r[o] = []), u = 0; u < a; ++u)
        (i = s[u]) && t.call(i, i.__data__, u, s) && l.push(i);
    return new sg(r, this._parents, this._name, this._id);
  },
  merge: function (t) {
    if (t._id !== this._id) throw new Error();
    for (
      var e = this._groups,
        n = t._groups,
        r = e.length,
        o = n.length,
        i = Math.min(r, o),
        s = new Array(r),
        a = 0;
      a < i;
      ++a
    )
      for (
        var l,
          u = e[a],
          c = n[a],
          f = u.length,
          h = (s[a] = new Array(f)),
          d = 0;
        d < f;
        ++d
      )
        (l = u[d] || c[d]) && (h[d] = l);
    for (; a < r; ++a) s[a] = e[a];
    return new sg(s, this._parents, this._name, this._id);
  },
  selection: function () {
    return new rg(this._groups, this._parents);
  },
  transition: function () {
    for (
      var t = this._name,
        e = this._id,
        n = ag(),
        r = this._groups,
        o = r.length,
        i = 0;
      i < o;
      ++i
    )
      for (var s, a = r[i], l = a.length, u = 0; u < l; ++u)
        if ((s = a[u])) {
          var c = Up(s, e);
          Dp(s, t, n, u, a, {
            time: c.time + c.delay + c.duration,
            delay: 0,
            duration: c.duration,
            ease: c.ease,
          });
        }
    return new sg(r, this._parents, t, n);
  },
  call: lg.call,
  nodes: lg.nodes,
  node: lg.node,
  size: lg.size,
  empty: lg.empty,
  each: lg.each,
  on: function (t, e) {
    var n = this._id;
    return arguments.length < 2
      ? Up(this.node(), n).on.on(t)
      : this.each(
          (function (t, e, n) {
            var r,
              o,
              i = (function (t) {
                return (t + "")
                  .trim()
                  .split(/^|\s+/)
                  .every(function (t) {
                    var e = t.indexOf(".");
                    return e >= 0 && (t = t.slice(0, e)), !t || "start" === t;
                  });
              })(e)
                ? Ip
                : Lp;
            return function () {
              var s = i(this, t),
                a = s.on;
              a !== r && (o = (r = a).copy()).on(e, n), (s.on = o);
            };
          })(n, t, e)
        );
  },
  attr: function (t, e) {
    var n = qf(t),
      r = "transform" === n ? dp : qp;
    return this.attrTween(
      t,
      "function" == typeof e
        ? (n.local ? Jp : Yp)(n, r, Vp(this, "attr." + t, e))
        : null == e
        ? (n.local ? Gp : Hp)(n)
        : (n.local ? Xp : Wp)(n, r, e)
    );
  },
  attrTween: function (t, e) {
    var n = "attr." + t;
    if (arguments.length < 2) return (n = this.tween(n)) && n._value;
    if (null == e) return this.tween(n, null);
    if ("function" != typeof e) throw new Error();
    var r = qf(t);
    return this.tween(n, (r.local ? Kp : Zp)(r, e));
  },
  style: function (t, e, n) {
    var r = "transform" == (t += "") ? hp : qp;
    return null == e
      ? this.styleTween(
          t,
          (function (t, e) {
            var n, r, o;
            return function () {
              var i = xh(this, t),
                s = (this.style.removeProperty(t), xh(this, t));
              return i === s
                ? null
                : i === n && s === r
                ? o
                : (o = e((n = i), (r = s)));
            };
          })(t, r)
        ).on("end.style." + t, og(t))
      : "function" == typeof e
      ? this.styleTween(
          t,
          (function (t, e, n) {
            var r, o, i;
            return function () {
              var s = xh(this, t),
                a = n(this),
                l = a + "";
              return (
                null == a &&
                  (this.style.removeProperty(t), (l = a = xh(this, t))),
                s === l
                  ? null
                  : s === r && l === o
                  ? i
                  : ((o = l), (i = e((r = s), a)))
              );
            };
          })(t, r, Vp(this, "style." + t, e))
        ).each(
          (function (t, e) {
            var n,
              r,
              o,
              i,
              s = "style." + e,
              a = "end." + s;
            return function () {
              var l = Lp(this, t),
                u = l.on,
                c = null == l.value[s] ? i || (i = og(e)) : void 0;
              (u === n && o === c) || (r = (n = u).copy()).on(a, (o = c)),
                (l.on = r);
            };
          })(this._id, t)
        )
      : this.styleTween(
          t,
          (function (t, e, n) {
            var r,
              o,
              i = n + "";
            return function () {
              var s = xh(this, t);
              return s === i ? null : s === r ? o : (o = e((r = s), n));
            };
          })(t, r, e),
          n
        ).on("end.style." + t, null);
  },
  styleTween: function (t, e, n) {
    var r = "style." + (t += "");
    if (arguments.length < 2) return (r = this.tween(r)) && r._value;
    if (null == e) return this.tween(r, null);
    if ("function" != typeof e) throw new Error();
    return this.tween(
      r,
      (function (t, e, n) {
        var r, o;
        function i() {
          var i = e.apply(this, arguments);
          return (
            i !== o &&
              (r =
                (o = i) &&
                (function (t, e, n) {
                  return function (r) {
                    this.style.setProperty(t, e.call(this, r), n);
                  };
                })(t, i, n)),
            r
          );
        }
        return (i._value = e), i;
      })(t, e, null == n ? "" : n)
    );
  },
  text: function (t) {
    return this.tween(
      "text",
      "function" == typeof t
        ? (function (t) {
            return function () {
              var e = t(this);
              this.textContent = null == e ? "" : e;
            };
          })(Vp(this, "text", t))
        : (function (t) {
            return function () {
              this.textContent = t;
            };
          })(null == t ? "" : t + "")
    );
  },
  textTween: function (t) {
    var e = "text";
    if (arguments.length < 1) return (e = this.tween(e)) && e._value;
    if (null == t) return this.tween(e, null);
    if ("function" != typeof t) throw new Error();
    return this.tween(
      e,
      (function (t) {
        var e, n;
        function r() {
          var r = t.apply(this, arguments);
          return (
            r !== n &&
              (e =
                (n = r) &&
                (function (t) {
                  return function (e) {
                    this.textContent = t.call(this, e);
                  };
                })(r)),
            e
          );
        }
        return (r._value = t), r;
      })(t)
    );
  },
  remove: function () {
    return this.on(
      "end.remove",
      ((t = this._id),
      function () {
        var e = this.parentNode;
        for (var n in this.__transition) if (+n !== t) return;
        e && e.removeChild(this);
      })
    );
    var t;
  },
  tween: function (t, e) {
    var n = this._id;
    if (((t += ""), arguments.length < 2)) {
      for (var r, o = Up(this.node(), n).tween, i = 0, s = o.length; i < s; ++i)
        if ((r = o[i]).name === t) return r.value;
      return null;
    }
    return this.each((null == e ? Bp : $p)(n, t, e));
  },
  delay: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(("function" == typeof t ? Qp : tg)(e, t))
      : Up(this.node(), e).delay;
  },
  duration: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(("function" == typeof t ? eg : ng)(e, t))
      : Up(this.node(), e).duration;
  },
  ease: function (t) {
    var e = this._id;
    return arguments.length
      ? this.each(
          (function (t, e) {
            if ("function" != typeof e) throw new Error();
            return function () {
              Lp(this, t).ease = e;
            };
          })(e, t)
        )
      : Up(this.node(), e).ease;
  },
  easeVarying: function (t) {
    if ("function" != typeof t) throw new Error();
    return this.each(
      (function (t, e) {
        return function () {
          var n = e.apply(this, arguments);
          if ("function" != typeof n) throw new Error();
          Lp(this, t).ease = n;
        };
      })(this._id, t)
    );
  },
  end: function () {
    var t,
      e,
      n = this,
      r = n._id,
      o = n.size();
    return new Promise(function (i, s) {
      var a = { value: s },
        l = {
          value: function () {
            0 === --o && i();
          },
        };
      n.each(function () {
        var n = Lp(this, r),
          o = n.on;
        o !== t &&
          ((e = (t = o).copy())._.cancel.push(a),
          e._.interrupt.push(a),
          e._.end.push(l)),
          (n.on = e);
      }),
        0 === o && i();
    });
  },
  [Symbol.iterator]: lg[Symbol.iterator],
};
var ug = {
  time: null,
  delay: 0,
  duration: 250,
  ease: function (t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  },
};
function cg(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode)) throw new Error(`transition ${e} not found`);
  return n;
}
(Qh.prototype.interrupt = function (t) {
  return this.each(function () {
    Fp(this, t);
  });
}),
  (Qh.prototype.transition = function (t) {
    var e, n;
    t instanceof sg
      ? ((e = t._id), (t = t._name))
      : ((e = ag()), ((n = ug).time = Cp()), (t = null == t ? null : t + ""));
    for (var r = this._groups, o = r.length, i = 0; i < o; ++i)
      for (var s, a = r[i], l = a.length, u = 0; u < l; ++u)
        (s = a[u]) && Dp(s, t, e, u, a, n || cg(s, e));
    return new sg(r, this._parents, t, e);
  });
const fg = (t) => () => t;
function hg(t, { sourceEvent: e, target: n, transform: r, dispatch: o }) {
  Object.defineProperties(this, {
    type: { value: t, enumerable: !0, configurable: !0 },
    sourceEvent: { value: e, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: o },
  });
}
function dg(t, e, n) {
  (this.k = t), (this.x = e), (this.y = n);
}
dg.prototype = {
  constructor: dg,
  scale: function (t) {
    return 1 === t ? this : new dg(this.k * t, this.x, this.y);
  },
  translate: function (t, e) {
    return (0 === t) & (0 === e)
      ? this
      : new dg(this.k, this.x + this.k * t, this.y + this.k * e);
  },
  apply: function (t) {
    return [t[0] * this.k + this.x, t[1] * this.k + this.y];
  },
  applyX: function (t) {
    return t * this.k + this.x;
  },
  applyY: function (t) {
    return t * this.k + this.y;
  },
  invert: function (t) {
    return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
  },
  invertX: function (t) {
    return (t - this.x) / this.k;
  },
  invertY: function (t) {
    return (t - this.y) / this.k;
  },
  rescaleX: function (t) {
    return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
  },
  rescaleY: function (t) {
    return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
  },
  toString: function () {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  },
};
var pg = new dg(1, 0, 0);
function gg(t) {
  for (; !t.__zoom; ) if (!(t = t.parentNode)) return pg;
  return t.__zoom;
}
function vg(t) {
  t.stopImmediatePropagation();
}
function yg(t) {
  t.preventDefault(), t.stopImmediatePropagation();
}
function mg(t) {
  return !((t.ctrlKey && "wheel" !== t.type) || t.button);
}
function _g() {
  var t = this;
  return t instanceof SVGElement
    ? (t = t.ownerSVGElement || t).hasAttribute("viewBox")
      ? [
          [(t = t.viewBox.baseVal).x, t.y],
          [t.x + t.width, t.y + t.height],
        ]
      : [
          [0, 0],
          [t.width.baseVal.value, t.height.baseVal.value],
        ]
    : [
        [0, 0],
        [t.clientWidth, t.clientHeight],
      ];
}
function bg() {
  return this.__zoom || pg;
}
function wg(t) {
  return (
    -t.deltaY *
    (1 === t.deltaMode ? 0.05 : t.deltaMode ? 1 : 0.002) *
    (t.ctrlKey ? 10 : 1)
  );
}
function xg() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function kg(t, e, n) {
  var r = t.invertX(e[0][0]) - n[0][0],
    o = t.invertX(e[1][0]) - n[1][0],
    i = t.invertY(e[0][1]) - n[0][1],
    s = t.invertY(e[1][1]) - n[1][1];
  return t.translate(
    o > r ? (r + o) / 2 : Math.min(0, r) || Math.max(0, o),
    s > i ? (i + s) / 2 : Math.min(0, i) || Math.max(0, s)
  );
}
function Sg() {
  var t,
    e,
    n,
    r = mg,
    o = _g,
    i = kg,
    s = wg,
    a = xg,
    l = [0, 1 / 0],
    u = [
      [-1 / 0, -1 / 0],
      [1 / 0, 1 / 0],
    ],
    c = 250,
    f = gp,
    h = rd("start", "zoom", "end"),
    d = 0,
    p = 10;
  function g(t) {
    t.property("__zoom", bg)
      .on("wheel.zoom", x, { passive: !1 })
      .on("mousedown.zoom", k)
      .on("dblclick.zoom", S)
      .filter(a)
      .on("touchstart.zoom", E)
      .on("touchmove.zoom", C)
      .on("touchend.zoom touchcancel.zoom", A)
      .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(t, e) {
    return (e = Math.max(l[0], Math.min(l[1], e))) === t.k
      ? t
      : new dg(e, t.x, t.y);
  }
  function y(t, e, n) {
    var r = e[0] - n[0] * t.k,
      o = e[1] - n[1] * t.k;
    return r === t.x && o === t.y ? t : new dg(t.k, r, o);
  }
  function m(t) {
    return [(+t[0][0] + +t[1][0]) / 2, (+t[0][1] + +t[1][1]) / 2];
  }
  function _(t, e, n, r) {
    t.on("start.zoom", function () {
      b(this, arguments).event(r).start();
    })
      .on("interrupt.zoom end.zoom", function () {
        b(this, arguments).event(r).end();
      })
      .tween("zoom", function () {
        var t = this,
          i = arguments,
          s = b(t, i).event(r),
          a = o.apply(t, i),
          l = null == n ? m(a) : "function" == typeof n ? n.apply(t, i) : n,
          u = Math.max(a[1][0] - a[0][0], a[1][1] - a[0][1]),
          c = t.__zoom,
          h = "function" == typeof e ? e.apply(t, i) : e,
          d = f(c.invert(l).concat(u / c.k), h.invert(l).concat(u / h.k));
        return function (t) {
          if (1 === t) t = h;
          else {
            var e = d(t),
              n = u / e[2];
            t = new dg(n, l[0] - e[0] * n, l[1] - e[1] * n);
          }
          s.zoom(null, t);
        };
      });
  }
  function b(t, e, n) {
    return (!n && t.__zooming) || new w(t, e);
  }
  function w(t, e) {
    (this.that = t),
      (this.args = e),
      (this.active = 0),
      (this.sourceEvent = null),
      (this.extent = o.apply(t, e)),
      (this.taps = 0);
  }
  function x(t, ...e) {
    if (r.apply(this, arguments)) {
      var n = b(this, e).event(t),
        o = this.__zoom,
        a = Math.max(
          l[0],
          Math.min(l[1], o.k * Math.pow(2, s.apply(this, arguments)))
        ),
        c = ed(t);
      if (n.wheel)
        (n.mouse[0][0] === c[0] && n.mouse[0][1] === c[1]) ||
          (n.mouse[1] = o.invert((n.mouse[0] = c))),
          clearTimeout(n.wheel);
      else {
        if (o.k === a) return;
        (n.mouse = [c, o.invert(c)]), Fp(this), n.start();
      }
      yg(t),
        (n.wheel = setTimeout(function () {
          (n.wheel = null), n.end();
        }, 150)),
        n.zoom("mouse", i(y(v(o, a), n.mouse[0], n.mouse[1]), n.extent, u));
    }
  }
  function k(t, ...e) {
    if (!n && r.apply(this, arguments)) {
      var o = t.currentTarget,
        s = b(this, e, !0).event(t),
        a = td(t.view)
          .on(
            "mousemove.zoom",
            function (t) {
              if ((yg(t), !s.moved)) {
                var e = t.clientX - c,
                  n = t.clientY - f;
                s.moved = e * e + n * n > d;
              }
              s.event(t).zoom(
                "mouse",
                i(
                  y(s.that.__zoom, (s.mouse[0] = ed(t, o)), s.mouse[1]),
                  s.extent,
                  u
                )
              );
            },
            !0
          )
          .on(
            "mouseup.zoom",
            function (t) {
              a.on("mousemove.zoom mouseup.zoom", null),
                hd(t.view, s.moved),
                yg(t),
                s.event(t).end();
            },
            !0
          ),
        l = ed(t, o),
        c = t.clientX,
        f = t.clientY;
      fd(t.view),
        vg(t),
        (s.mouse = [l, this.__zoom.invert(l)]),
        Fp(this),
        s.start();
    }
  }
  function S(t, ...e) {
    if (r.apply(this, arguments)) {
      var n = this.__zoom,
        s = ed(t.changedTouches ? t.changedTouches[0] : t, this),
        a = n.invert(s),
        l = n.k * (t.shiftKey ? 0.5 : 2),
        f = i(y(v(n, l), s, a), o.apply(this, e), u);
      yg(t),
        c > 0
          ? td(this).transition().duration(c).call(_, f, s, t)
          : td(this).call(g.transform, f, s, t);
    }
  }
  function E(n, ...o) {
    if (r.apply(this, arguments)) {
      var i,
        s,
        a,
        l,
        u = n.touches,
        c = u.length,
        f = b(this, o, n.changedTouches.length === c).event(n);
      for (vg(n), s = 0; s < c; ++s)
        (l = [(l = ed((a = u[s]), this)), this.__zoom.invert(l), a.identifier]),
          f.touch0
            ? f.touch1 || f.touch0[2] === l[2] || ((f.touch1 = l), (f.taps = 0))
            : ((f.touch0 = l), (i = !0), (f.taps = 1 + !!t));
      t && (t = clearTimeout(t)),
        i &&
          (f.taps < 2 &&
            ((e = l[0]),
            (t = setTimeout(function () {
              t = null;
            }, 500))),
          Fp(this),
          f.start());
    }
  }
  function C(t, ...e) {
    if (this.__zooming) {
      var n,
        r,
        o,
        s,
        a = b(this, e).event(t),
        l = t.changedTouches,
        c = l.length;
      for (yg(t), n = 0; n < c; ++n)
        (o = ed((r = l[n]), this)),
          a.touch0 && a.touch0[2] === r.identifier
            ? (a.touch0[0] = o)
            : a.touch1 && a.touch1[2] === r.identifier && (a.touch1[0] = o);
      if (((r = a.that.__zoom), a.touch1)) {
        var f = a.touch0[0],
          h = a.touch0[1],
          d = a.touch1[0],
          p = a.touch1[1],
          g = (g = d[0] - f[0]) * g + (g = d[1] - f[1]) * g,
          m = (m = p[0] - h[0]) * m + (m = p[1] - h[1]) * m;
        (r = v(r, Math.sqrt(g / m))),
          (o = [(f[0] + d[0]) / 2, (f[1] + d[1]) / 2]),
          (s = [(h[0] + p[0]) / 2, (h[1] + p[1]) / 2]);
      } else {
        if (!a.touch0) return;
        (o = a.touch0[0]), (s = a.touch0[1]);
      }
      a.zoom("touch", i(y(r, o, s), a.extent, u));
    }
  }
  function A(t, ...r) {
    if (this.__zooming) {
      var o,
        i,
        s = b(this, r).event(t),
        a = t.changedTouches,
        l = a.length;
      for (
        vg(t),
          n && clearTimeout(n),
          n = setTimeout(function () {
            n = null;
          }, 500),
          o = 0;
        o < l;
        ++o
      )
        (i = a[o]),
          s.touch0 && s.touch0[2] === i.identifier
            ? delete s.touch0
            : s.touch1 && s.touch1[2] === i.identifier && delete s.touch1;
      if (
        (s.touch1 && !s.touch0 && ((s.touch0 = s.touch1), delete s.touch1),
        s.touch0)
      )
        s.touch0[1] = this.__zoom.invert(s.touch0[0]);
      else if (
        (s.end(),
        2 === s.taps &&
          ((i = ed(i, this)), Math.hypot(e[0] - i[0], e[1] - i[1]) < p))
      ) {
        var u = td(this).on("dblclick.zoom");
        u && u.apply(this, arguments);
      }
    }
  }
  return (
    (g.transform = function (t, e, n, r) {
      var o = t.selection ? t.selection() : t;
      o.property("__zoom", bg),
        t !== o
          ? _(t, e, n, r)
          : o.interrupt().each(function () {
              b(this, arguments)
                .event(r)
                .start()
                .zoom(
                  null,
                  "function" == typeof e ? e.apply(this, arguments) : e
                )
                .end();
            });
    }),
    (g.scaleBy = function (t, e, n, r) {
      g.scaleTo(
        t,
        function () {
          return (
            this.__zoom.k *
            ("function" == typeof e ? e.apply(this, arguments) : e)
          );
        },
        n,
        r
      );
    }),
    (g.scaleTo = function (t, e, n, r) {
      g.transform(
        t,
        function () {
          var t = o.apply(this, arguments),
            r = this.__zoom,
            s =
              null == n
                ? m(t)
                : "function" == typeof n
                ? n.apply(this, arguments)
                : n,
            a = r.invert(s),
            l = "function" == typeof e ? e.apply(this, arguments) : e;
          return i(y(v(r, l), s, a), t, u);
        },
        n,
        r
      );
    }),
    (g.translateBy = function (t, e, n, r) {
      g.transform(
        t,
        function () {
          return i(
            this.__zoom.translate(
              "function" == typeof e ? e.apply(this, arguments) : e,
              "function" == typeof n ? n.apply(this, arguments) : n
            ),
            o.apply(this, arguments),
            u
          );
        },
        null,
        r
      );
    }),
    (g.translateTo = function (t, e, n, r, s) {
      g.transform(
        t,
        function () {
          var t = o.apply(this, arguments),
            s = this.__zoom,
            a =
              null == r
                ? m(t)
                : "function" == typeof r
                ? r.apply(this, arguments)
                : r;
          return i(
            pg
              .translate(a[0], a[1])
              .scale(s.k)
              .translate(
                "function" == typeof e ? -e.apply(this, arguments) : -e,
                "function" == typeof n ? -n.apply(this, arguments) : -n
              ),
            t,
            u
          );
        },
        r,
        s
      );
    }),
    (w.prototype = {
      event: function (t) {
        return t && (this.sourceEvent = t), this;
      },
      start: function () {
        return (
          1 === ++this.active &&
            ((this.that.__zooming = this), this.emit("start")),
          this
        );
      },
      zoom: function (t, e) {
        return (
          this.mouse &&
            "mouse" !== t &&
            (this.mouse[1] = e.invert(this.mouse[0])),
          this.touch0 &&
            "touch" !== t &&
            (this.touch0[1] = e.invert(this.touch0[0])),
          this.touch1 &&
            "touch" !== t &&
            (this.touch1[1] = e.invert(this.touch1[0])),
          (this.that.__zoom = e),
          this.emit("zoom"),
          this
        );
      },
      end: function () {
        return (
          0 === --this.active && (delete this.that.__zooming, this.emit("end")),
          this
        );
      },
      emit: function (t) {
        var e = td(this.that).datum();
        h.call(
          t,
          this.that,
          new hg(t, {
            sourceEvent: this.sourceEvent,
            target: g,
            transform: this.that.__zoom,
            dispatch: h,
          }),
          e
        );
      },
    }),
    (g.wheelDelta = function (t) {
      return arguments.length
        ? ((s = "function" == typeof t ? t : fg(+t)), g)
        : s;
    }),
    (g.filter = function (t) {
      return arguments.length
        ? ((r = "function" == typeof t ? t : fg(!!t)), g)
        : r;
    }),
    (g.touchable = function (t) {
      return arguments.length
        ? ((a = "function" == typeof t ? t : fg(!!t)), g)
        : a;
    }),
    (g.extent = function (t) {
      return arguments.length
        ? ((o =
            "function" == typeof t
              ? t
              : fg([
                  [+t[0][0], +t[0][1]],
                  [+t[1][0], +t[1][1]],
                ])),
          g)
        : o;
    }),
    (g.scaleExtent = function (t) {
      return arguments.length
        ? ((l[0] = +t[0]), (l[1] = +t[1]), g)
        : [l[0], l[1]];
    }),
    (g.translateExtent = function (t) {
      return arguments.length
        ? ((u[0][0] = +t[0][0]),
          (u[1][0] = +t[1][0]),
          (u[0][1] = +t[0][1]),
          (u[1][1] = +t[1][1]),
          g)
        : [
            [u[0][0], u[0][1]],
            [u[1][0], u[1][1]],
          ];
    }),
    (g.constrain = function (t) {
      return arguments.length ? ((i = t), g) : i;
    }),
    (g.duration = function (t) {
      return arguments.length ? ((c = +t), g) : c;
    }),
    (g.interpolate = function (t) {
      return arguments.length ? ((f = t), g) : f;
    }),
    (g.on = function () {
      var t = h.on.apply(h, arguments);
      return t === h ? g : t;
    }),
    (g.clickDistance = function (t) {
      return arguments.length ? ((d = (t = +t) * t), g) : Math.sqrt(d);
    }),
    (g.tapDistance = function (t) {
      return arguments.length ? ((p = +t), g) : p;
    }),
    g
  );
}
gg.prototype = dg.prototype;
class Eg extends Map {
  constructor(t, e = Ag) {
    if (
      (super(),
      Object.defineProperties(this, {
        _intern: { value: new Map() },
        _key: { value: e },
      }),
      null != t)
    )
      for (const [n, r] of t) this.set(n, r);
  }
  get(t) {
    return super.get(Cg(this, t));
  }
  has(t) {
    return super.has(Cg(this, t));
  }
  set(t, e) {
    return super.set(
      (function ({ _intern: t, _key: e }, n) {
        const r = e(n);
        return t.has(r) ? t.get(r) : (t.set(r, n), n);
      })(this, t),
      e
    );
  }
  delete(t) {
    return super.delete(
      (function ({ _intern: t, _key: e }, n) {
        const r = e(n);
        t.has(r) && ((n = t.get(r)), t.delete(r));
        return n;
      })(this, t)
    );
  }
}
function Cg({ _intern: t, _key: e }, n) {
  const r = e(n);
  return t.has(r) ? t.get(r) : n;
}
function Ag(t) {
  return null !== t && "object" == typeof t ? t.valueOf() : t;
}
function Og(t, e) {
  let n;
  if (void 0 === e)
    for (const r of t)
      null != r && (n < r || (void 0 === n && r >= r)) && (n = r);
  else {
    let r = -1;
    for (let o of t)
      null != (o = e(o, ++r, t)) &&
        (n < o || (void 0 === n && o >= o)) &&
        (n = o);
  }
  return n;
}
function Tg(t, e) {
  let n;
  if (void 0 === e)
    for (const r of t)
      null != r && (n > r || (void 0 === n && r >= r)) && (n = r);
  else {
    let r = -1;
    for (let o of t)
      null != (o = e(o, ++r, t)) &&
        (n > o || (void 0 === n && o >= o)) &&
        (n = o);
  }
  return n;
}
var Ng =
    "object" == typeof global && global && global.Object === Object && global,
  Pg = "object" == typeof self && self && self.Object === Object && self,
  Mg = Ng || Pg || Function("return this")(),
  Rg = Mg.Symbol,
  jg = Object.prototype,
  zg = jg.hasOwnProperty,
  Dg = jg.toString,
  Ig = Rg ? Rg.toStringTag : void 0;
var Lg = Object.prototype.toString;
var Ug = Rg ? Rg.toStringTag : void 0;
function Fg(t) {
  return null == t
    ? void 0 === t
      ? "[object Undefined]"
      : "[object Null]"
    : Ug && Ug in Object(t)
    ? (function (t) {
        var e = zg.call(t, Ig),
          n = t[Ig];
        try {
          t[Ig] = void 0;
          var r = !0;
        } catch (cw) {}
        var o = Dg.call(t);
        return r && (e ? (t[Ig] = n) : delete t[Ig]), o;
      })(t)
    : (function (t) {
        return Lg.call(t);
      })(t);
}
var Bg = /\s/;
var $g = /^\s+/;
function Vg(t) {
  return t
    ? t
        .slice(
          0,
          (function (t) {
            for (var e = t.length; e-- && Bg.test(t.charAt(e)); );
            return e;
          })(t) + 1
        )
        .replace($g, "")
    : t;
}
function qg(t) {
  var e = typeof t;
  return null != t && ("object" == e || "function" == e);
}
var Hg = /^[-+]0x[0-9a-f]+$/i,
  Gg = /^0b[01]+$/i,
  Wg = /^0o[0-7]+$/i,
  Xg = parseInt;
function Yg(t) {
  if ("number" == typeof t) return t;
  if (
    (function (t) {
      return (
        "symbol" == typeof t ||
        ((function (t) {
          return null != t && "object" == typeof t;
        })(t) &&
          "[object Symbol]" == Fg(t))
      );
    })(t)
  )
    return NaN;
  if (qg(t)) {
    var e = "function" == typeof t.valueOf ? t.valueOf() : t;
    t = qg(e) ? e + "" : e;
  }
  if ("string" != typeof t) return 0 === t ? t : +t;
  t = Vg(t);
  var n = Gg.test(t);
  return n || Wg.test(t) ? Xg(t.slice(2), n ? 2 : 8) : Hg.test(t) ? NaN : +t;
}
var Jg = function () {
    return Mg.Date.now();
  },
  Kg = Math.max,
  Zg = Math.min;
function Qg(t, e, n) {
  var r,
    o,
    i,
    s,
    a,
    l,
    u = 0,
    c = !1,
    f = !1,
    h = !0;
  if ("function" != typeof t) throw new TypeError("Expected a function");
  function d(e) {
    var n = r,
      i = o;
    return (r = o = void 0), (u = e), (s = t.apply(i, n));
  }
  function p(t) {
    var n = t - l;
    return void 0 === l || n >= e || n < 0 || (f && t - u >= i);
  }
  function g() {
    var t = Jg();
    if (p(t)) return v(t);
    a = setTimeout(
      g,
      (function (t) {
        var n = e - (t - l);
        return f ? Zg(n, i - (t - u)) : n;
      })(t)
    );
  }
  function v(t) {
    return (a = void 0), h && r ? d(t) : ((r = o = void 0), s);
  }
  function y() {
    var t = Jg(),
      n = p(t);
    if (((r = arguments), (o = this), (l = t), n)) {
      if (void 0 === a)
        return (function (t) {
          return (u = t), (a = setTimeout(g, e)), c ? d(t) : s;
        })(l);
      if (f) return clearTimeout(a), (a = setTimeout(g, e)), d(l);
    }
    return void 0 === a && (a = setTimeout(g, e)), s;
  }
  return (
    (e = Yg(e) || 0),
    qg(n) &&
      ((c = !!n.leading),
      (i = (f = "maxWait" in n) ? Kg(Yg(n.maxWait) || 0, e) : i),
      (h = "trailing" in n ? !!n.trailing : h)),
    (y.cancel = function () {
      void 0 !== a && clearTimeout(a), (u = 0), (r = l = o = a = void 0);
    }),
    (y.flush = function () {
      return void 0 === a ? s : v(Jg());
    }),
    y
  );
}
var tv = Object.freeze({
    Linear: Object.freeze({
      None: function (t) {
        return t;
      },
      In: function (t) {
        return t;
      },
      Out: function (t) {
        return t;
      },
      InOut: function (t) {
        return t;
      },
    }),
    Quadratic: Object.freeze({
      In: function (t) {
        return t * t;
      },
      Out: function (t) {
        return t * (2 - t);
      },
      InOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1);
      },
    }),
    Cubic: Object.freeze({
      In: function (t) {
        return t * t * t;
      },
      Out: function (t) {
        return --t * t * t + 1;
      },
      InOut: function (t) {
        return (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
      },
    }),
    Quartic: Object.freeze({
      In: function (t) {
        return t * t * t * t;
      },
      Out: function (t) {
        return 1 - --t * t * t * t;
      },
      InOut: function (t) {
        return (t *= 2) < 1
          ? 0.5 * t * t * t * t
          : -0.5 * ((t -= 2) * t * t * t - 2);
      },
    }),
    Quintic: Object.freeze({
      In: function (t) {
        return t * t * t * t * t;
      },
      Out: function (t) {
        return --t * t * t * t * t + 1;
      },
      InOut: function (t) {
        return (t *= 2) < 1
          ? 0.5 * t * t * t * t * t
          : 0.5 * ((t -= 2) * t * t * t * t + 2);
      },
    }),
    Sinusoidal: Object.freeze({
      In: function (t) {
        return 1 - Math.sin(((1 - t) * Math.PI) / 2);
      },
      Out: function (t) {
        return Math.sin((t * Math.PI) / 2);
      },
      InOut: function (t) {
        return 0.5 * (1 - Math.sin(Math.PI * (0.5 - t)));
      },
    }),
    Exponential: Object.freeze({
      In: function (t) {
        return 0 === t ? 0 : Math.pow(1024, t - 1);
      },
      Out: function (t) {
        return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
      },
      InOut: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (t *= 2) < 1
          ? 0.5 * Math.pow(1024, t - 1)
          : 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
      },
    }),
    Circular: Object.freeze({
      In: function (t) {
        return 1 - Math.sqrt(1 - t * t);
      },
      Out: function (t) {
        return Math.sqrt(1 - --t * t);
      },
      InOut: function (t) {
        return (t *= 2) < 1
          ? -0.5 * (Math.sqrt(1 - t * t) - 1)
          : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
      },
    }),
    Elastic: Object.freeze({
      In: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : -Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI);
      },
      Out: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : Math.pow(2, -10 * t) * Math.sin(5 * (t - 0.1) * Math.PI) + 1;
      },
      InOut: function (t) {
        return 0 === t
          ? 0
          : 1 === t
          ? 1
          : (t *= 2) < 1
          ? -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI)
          : 0.5 *
              Math.pow(2, -10 * (t - 1)) *
              Math.sin(5 * (t - 1.1) * Math.PI) +
            1;
      },
    }),
    Back: Object.freeze({
      In: function (t) {
        var e = 1.70158;
        return 1 === t ? 1 : t * t * ((e + 1) * t - e);
      },
      Out: function (t) {
        var e = 1.70158;
        return 0 === t ? 0 : --t * t * ((e + 1) * t + e) + 1;
      },
      InOut: function (t) {
        var e = 2.5949095;
        return (t *= 2) < 1
          ? t * t * ((e + 1) * t - e) * 0.5
          : 0.5 * ((t -= 2) * t * ((e + 1) * t + e) + 2);
      },
    }),
    Bounce: Object.freeze({
      In: function (t) {
        return 1 - tv.Bounce.Out(1 - t);
      },
      Out: function (t) {
        return t < 1 / 2.75
          ? 7.5625 * t * t
          : t < 2 / 2.75
          ? 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
          : t < 2.5 / 2.75
          ? 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
          : 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      },
      InOut: function (t) {
        return t < 0.5
          ? 0.5 * tv.Bounce.In(2 * t)
          : 0.5 * tv.Bounce.Out(2 * t - 1) + 0.5;
      },
    }),
    generatePow: function (t) {
      return (
        void 0 === t && (t = 4),
        (t = (t = t < Number.EPSILON ? Number.EPSILON : t) > 1e4 ? 1e4 : t),
        {
          In: function (e) {
            return Math.pow(e, t);
          },
          Out: function (e) {
            return 1 - Math.pow(1 - e, t);
          },
          InOut: function (e) {
            return e < 0.5
              ? Math.pow(2 * e, t) / 2
              : (1 - Math.pow(2 - 2 * e, t)) / 2 + 0.5;
          },
        }
      );
    },
  }),
  ev = function () {
    return performance.now();
  },
  nv = (function () {
    function t() {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      (this._tweens = {}),
        (this._tweensAddedDuringUpdate = {}),
        this.add.apply(this, t);
    }
    return (
      (t.prototype.getAll = function () {
        var t = this;
        return Object.keys(this._tweens).map(function (e) {
          return t._tweens[e];
        });
      }),
      (t.prototype.removeAll = function () {
        this._tweens = {};
      }),
      (t.prototype.add = function () {
        for (var t, e = [], n = 0; n < arguments.length; n++)
          e[n] = arguments[n];
        for (var r = 0, o = e; r < o.length; r++) {
          var i = o[r];
          null === (t = i._group) || void 0 === t || t.remove(i),
            (i._group = this),
            (this._tweens[i.getId()] = i),
            (this._tweensAddedDuringUpdate[i.getId()] = i);
        }
      }),
      (t.prototype.remove = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        for (var n = 0, r = t; n < r.length; n++) {
          var o = r[n];
          (o._group = void 0),
            delete this._tweens[o.getId()],
            delete this._tweensAddedDuringUpdate[o.getId()];
        }
      }),
      (t.prototype.allStopped = function () {
        return this.getAll().every(function (t) {
          return !t.isPlaying();
        });
      }),
      (t.prototype.update = function (t, e) {
        void 0 === t && (t = ev()), void 0 === e && (e = !0);
        var n = Object.keys(this._tweens);
        if (0 !== n.length)
          for (; n.length > 0; ) {
            this._tweensAddedDuringUpdate = {};
            for (var r = 0; r < n.length; r++) {
              var o = this._tweens[n[r]],
                i = !e;
              o && !1 === o.update(t, i) && !e && this.remove(o);
            }
            n = Object.keys(this._tweensAddedDuringUpdate);
          }
      }),
      t
    );
  })(),
  rv = {
    Linear: function (t, e) {
      var n = t.length - 1,
        r = n * e,
        o = Math.floor(r),
        i = rv.Utils.Linear;
      return e < 0
        ? i(t[0], t[1], r)
        : e > 1
        ? i(t[n], t[n - 1], n - r)
        : i(t[o], t[o + 1 > n ? n : o + 1], r - o);
    },
    Utils: {
      Linear: function (t, e, n) {
        return (e - t) * n + t;
      },
    },
  },
  ov = (function () {
    function t() {}
    return (
      (t.nextId = function () {
        return t._nextId++;
      }),
      (t._nextId = 0),
      t
    );
  })(),
  iv = new nv(),
  sv = (function () {
    function t(t, e) {
      (this._isPaused = !1),
        (this._pauseStart = 0),
        (this._valuesStart = {}),
        (this._valuesEnd = {}),
        (this._valuesStartRepeat = {}),
        (this._duration = 1e3),
        (this._isDynamic = !1),
        (this._initialRepeat = 0),
        (this._repeat = 0),
        (this._yoyo = !1),
        (this._isPlaying = !1),
        (this._reversed = !1),
        (this._delayTime = 0),
        (this._startTime = 0),
        (this._easingFunction = tv.Linear.None),
        (this._interpolationFunction = rv.Linear),
        (this._chainedTweens = []),
        (this._onStartCallbackFired = !1),
        (this._onEveryStartCallbackFired = !1),
        (this._id = ov.nextId()),
        (this._isChainStopped = !1),
        (this._propertiesAreSetUp = !1),
        (this._goToEnd = !1),
        (this._object = t),
        "object" == typeof e
          ? ((this._group = e), e.add(this))
          : !0 === e && ((this._group = iv), iv.add(this));
    }
    return (
      (t.prototype.getId = function () {
        return this._id;
      }),
      (t.prototype.isPlaying = function () {
        return this._isPlaying;
      }),
      (t.prototype.isPaused = function () {
        return this._isPaused;
      }),
      (t.prototype.getDuration = function () {
        return this._duration;
      }),
      (t.prototype.to = function (t, e) {
        if ((void 0 === e && (e = 1e3), this._isPlaying))
          throw new Error(
            "Can not call Tween.to() while Tween is already started or paused. Stop the Tween first."
          );
        return (
          (this._valuesEnd = t),
          (this._propertiesAreSetUp = !1),
          (this._duration = e < 0 ? 0 : e),
          this
        );
      }),
      (t.prototype.duration = function (t) {
        return (
          void 0 === t && (t = 1e3), (this._duration = t < 0 ? 0 : t), this
        );
      }),
      (t.prototype.dynamic = function (t) {
        return void 0 === t && (t = !1), (this._isDynamic = t), this;
      }),
      (t.prototype.start = function (t, e) {
        if (
          (void 0 === t && (t = ev()),
          void 0 === e && (e = !1),
          this._isPlaying)
        )
          return this;
        if (((this._repeat = this._initialRepeat), this._reversed))
          for (var n in ((this._reversed = !1), this._valuesStartRepeat))
            this._swapEndStartRepeatValues(n),
              (this._valuesStart[n] = this._valuesStartRepeat[n]);
        if (
          ((this._isPlaying = !0),
          (this._isPaused = !1),
          (this._onStartCallbackFired = !1),
          (this._onEveryStartCallbackFired = !1),
          (this._isChainStopped = !1),
          (this._startTime = t),
          (this._startTime += this._delayTime),
          !this._propertiesAreSetUp || e)
        ) {
          if (((this._propertiesAreSetUp = !0), !this._isDynamic)) {
            var r = {};
            for (var o in this._valuesEnd) r[o] = this._valuesEnd[o];
            this._valuesEnd = r;
          }
          this._setupProperties(
            this._object,
            this._valuesStart,
            this._valuesEnd,
            this._valuesStartRepeat,
            e
          );
        }
        return this;
      }),
      (t.prototype.startFromCurrentValues = function (t) {
        return this.start(t, !0);
      }),
      (t.prototype._setupProperties = function (t, e, n, r, o) {
        for (var i in n) {
          var s = t[i],
            a = Array.isArray(s),
            l = a ? "array" : typeof s,
            u = !a && Array.isArray(n[i]);
          if ("undefined" !== l && "function" !== l) {
            if (u) {
              if (0 === (v = n[i]).length) continue;
              for (var c = [s], f = 0, h = v.length; f < h; f += 1) {
                var d = this._handleRelativeValue(s, v[f]);
                if (isNaN(d)) {
                  u = !1;
                  break;
                }
                c.push(d);
              }
              u && (n[i] = c);
            }
            if (("object" !== l && !a) || !s || u)
              (void 0 === e[i] || o) && (e[i] = s),
                a || (e[i] *= 1),
                (r[i] = u ? n[i].slice().reverse() : e[i] || 0);
            else {
              e[i] = a ? [] : {};
              var p = s;
              for (var g in p) e[i][g] = p[g];
              r[i] = a ? [] : {};
              var v = n[i];
              if (!this._isDynamic) {
                var y = {};
                for (var g in v) y[g] = v[g];
                n[i] = v = y;
              }
              this._setupProperties(p, e[i], v, r[i], o);
            }
          }
        }
      }),
      (t.prototype.stop = function () {
        return (
          this._isChainStopped ||
            ((this._isChainStopped = !0), this.stopChainedTweens()),
          this._isPlaying
            ? ((this._isPlaying = !1),
              (this._isPaused = !1),
              this._onStopCallback && this._onStopCallback(this._object),
              this)
            : this
        );
      }),
      (t.prototype.end = function () {
        return (
          (this._goToEnd = !0),
          this.update(this._startTime + this._duration),
          this
        );
      }),
      (t.prototype.pause = function (t) {
        return (
          void 0 === t && (t = ev()),
          this._isPaused ||
            !this._isPlaying ||
            ((this._isPaused = !0), (this._pauseStart = t)),
          this
        );
      }),
      (t.prototype.resume = function (t) {
        return (
          void 0 === t && (t = ev()),
          this._isPaused && this._isPlaying
            ? ((this._isPaused = !1),
              (this._startTime += t - this._pauseStart),
              (this._pauseStart = 0),
              this)
            : this
        );
      }),
      (t.prototype.stopChainedTweens = function () {
        for (var t = 0, e = this._chainedTweens.length; t < e; t++)
          this._chainedTweens[t].stop();
        return this;
      }),
      (t.prototype.group = function (t) {
        return t ? (t.add(this), this) : this;
      }),
      (t.prototype.remove = function () {
        var t;
        return (
          null === (t = this._group) || void 0 === t || t.remove(this), this
        );
      }),
      (t.prototype.delay = function (t) {
        return void 0 === t && (t = 0), (this._delayTime = t), this;
      }),
      (t.prototype.repeat = function (t) {
        return (
          void 0 === t && (t = 0),
          (this._initialRepeat = t),
          (this._repeat = t),
          this
        );
      }),
      (t.prototype.repeatDelay = function (t) {
        return (this._repeatDelayTime = t), this;
      }),
      (t.prototype.yoyo = function (t) {
        return void 0 === t && (t = !1), (this._yoyo = t), this;
      }),
      (t.prototype.easing = function (t) {
        return (
          void 0 === t && (t = tv.Linear.None), (this._easingFunction = t), this
        );
      }),
      (t.prototype.interpolation = function (t) {
        return (
          void 0 === t && (t = rv.Linear),
          (this._interpolationFunction = t),
          this
        );
      }),
      (t.prototype.chain = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        return (this._chainedTweens = t), this;
      }),
      (t.prototype.onStart = function (t) {
        return (this._onStartCallback = t), this;
      }),
      (t.prototype.onEveryStart = function (t) {
        return (this._onEveryStartCallback = t), this;
      }),
      (t.prototype.onUpdate = function (t) {
        return (this._onUpdateCallback = t), this;
      }),
      (t.prototype.onRepeat = function (t) {
        return (this._onRepeatCallback = t), this;
      }),
      (t.prototype.onComplete = function (t) {
        return (this._onCompleteCallback = t), this;
      }),
      (t.prototype.onStop = function (t) {
        return (this._onStopCallback = t), this;
      }),
      (t.prototype.update = function (e, n) {
        var r,
          o,
          i = this;
        if (
          (void 0 === e && (e = ev()),
          void 0 === n && (n = t.autoStartOnUpdate),
          this._isPaused)
        )
          return !0;
        if (!this._goToEnd && !this._isPlaying) {
          if (!n) return !1;
          this.start(e, !0);
        }
        if (((this._goToEnd = !1), e < this._startTime)) return !0;
        !1 === this._onStartCallbackFired &&
          (this._onStartCallback && this._onStartCallback(this._object),
          (this._onStartCallbackFired = !0)),
          !1 === this._onEveryStartCallbackFired &&
            (this._onEveryStartCallback &&
              this._onEveryStartCallback(this._object),
            (this._onEveryStartCallbackFired = !0));
        var s = e - this._startTime,
          a =
            this._duration +
            (null !== (r = this._repeatDelayTime) && void 0 !== r
              ? r
              : this._delayTime),
          l = this._duration + this._repeat * a,
          u = (function () {
            if (0 === i._duration) return 1;
            if (s > l) return 1;
            var t = Math.trunc(s / a),
              e = s - t * a,
              n = Math.min(e / i._duration, 1);
            return 0 === n && s === i._duration ? 1 : n;
          })(),
          c = this._easingFunction(u);
        if (
          (this._updateProperties(
            this._object,
            this._valuesStart,
            this._valuesEnd,
            c
          ),
          this._onUpdateCallback && this._onUpdateCallback(this._object, u),
          0 === this._duration || s >= this._duration)
        ) {
          if (this._repeat > 0) {
            var f = Math.min(
              Math.trunc((s - this._duration) / a) + 1,
              this._repeat
            );
            for (o in (isFinite(this._repeat) && (this._repeat -= f),
            this._valuesStartRepeat))
              this._yoyo ||
                "string" != typeof this._valuesEnd[o] ||
                (this._valuesStartRepeat[o] =
                  this._valuesStartRepeat[o] + parseFloat(this._valuesEnd[o])),
                this._yoyo && this._swapEndStartRepeatValues(o),
                (this._valuesStart[o] = this._valuesStartRepeat[o]);
            return (
              this._yoyo && (this._reversed = !this._reversed),
              (this._startTime += a * f),
              this._onRepeatCallback && this._onRepeatCallback(this._object),
              (this._onEveryStartCallbackFired = !1),
              !0
            );
          }
          this._onCompleteCallback && this._onCompleteCallback(this._object);
          for (var h = 0, d = this._chainedTweens.length; h < d; h++)
            this._chainedTweens[h].start(this._startTime + this._duration, !1);
          return (this._isPlaying = !1), !1;
        }
        return !0;
      }),
      (t.prototype._updateProperties = function (t, e, n, r) {
        for (var o in n)
          if (void 0 !== e[o]) {
            var i = e[o] || 0,
              s = n[o],
              a = Array.isArray(t[o]),
              l = Array.isArray(s);
            !a && l
              ? (t[o] = this._interpolationFunction(s, r))
              : "object" == typeof s && s
              ? this._updateProperties(t[o], i, s, r)
              : "number" == typeof (s = this._handleRelativeValue(i, s)) &&
                (t[o] = i + (s - i) * r);
          }
      }),
      (t.prototype._handleRelativeValue = function (t, e) {
        return "string" != typeof e
          ? e
          : "+" === e.charAt(0) || "-" === e.charAt(0)
          ? t + parseFloat(e)
          : parseFloat(e);
      }),
      (t.prototype._swapEndStartRepeatValues = function (t) {
        var e = this._valuesStartRepeat[t],
          n = this._valuesEnd[t];
        (this._valuesStartRepeat[t] =
          "string" == typeof n
            ? this._valuesStartRepeat[t] + parseFloat(n)
            : this._valuesEnd[t]),
          (this._valuesEnd[t] = e);
      }),
      (t.autoStartOnUpdate = !1),
      t
    );
  })();
ov.nextId;
var av = iv;
function lv(t, e) {
  (null == e || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function uv(t, e, n) {
  return Object.defineProperty(t, "prototype", { writable: !1 }), t;
}
function cv(t, e) {
  return (
    (function (t) {
      if (Array.isArray(t)) return t;
    })(t) ||
    (function (t, e) {
      var n =
        null == t
          ? null
          : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
            t["@@iterator"];
      if (null != n) {
        var r,
          o,
          i,
          s,
          a = [],
          l = !0,
          u = !1;
        try {
          if (((i = (n = n.call(t)).next), 0 === e));
          else
            for (
              ;
              !(l = (r = i.call(n)).done) && (a.push(r.value), a.length !== e);
              l = !0
            );
        } catch (c) {
          (u = !0), (o = c);
        } finally {
          try {
            if (!l && null != n.return && ((s = n.return()), Object(s) !== s))
              return;
          } finally {
            if (u) throw o;
          }
        }
        return a;
      }
    })(t, e) ||
    (function (t, e) {
      if (t) {
        if ("string" == typeof t) return lv(t, e);
        var n = {}.toString.call(t).slice(8, -1);
        return (
          "Object" === n && t.constructor && (n = t.constructor.name),
          "Map" === n || "Set" === n
            ? Array.from(t)
            : "Arguments" === n ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
            ? lv(t, e)
            : void 0
        );
      }
    })(t, e) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
av.getAll.bind(av),
  av.removeAll.bind(av),
  av.add.bind(av),
  av.remove.bind(av),
  av.update.bind(av);
var fv = uv(function t(e, n) {
  var r = n.default,
    o = void 0 === r ? null : r,
    i = n.triggerUpdate,
    s = void 0 === i || i,
    a = n.onChange,
    l = void 0 === a ? function (t, e) {} : a;
  !(function (t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function");
  })(this, t),
    (this.name = e),
    (this.defaultVal = o),
    (this.triggerUpdate = s),
    (this.onChange = l);
});
function hv(t) {
  var e = t.stateInit,
    n =
      void 0 === e
        ? function () {
            return {};
          }
        : e,
    r = t.props,
    o = void 0 === r ? {} : r,
    i = t.methods,
    s = void 0 === i ? {} : i,
    a = t.aliases,
    l = void 0 === a ? {} : a,
    u = t.init,
    c = void 0 === u ? function () {} : u,
    f = t.update,
    h = void 0 === f ? function () {} : f,
    d = Object.keys(o).map(function (t) {
      return new fv(t, o[t]);
    });
  return function t() {
    for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++)
      r[o] = arguments[o];
    var i = !!(this instanceof t ? this.constructor : void 0),
      a = i ? r.shift() : void 0,
      u = r[0],
      f = void 0 === u ? {} : u,
      p = Object.assign({}, n instanceof Function ? n(f) : n, {
        initialised: !1,
      }),
      g = {};
    function v(t) {
      return y(t, f), m(), v;
    }
    var y = function (t, e) {
        c.call(v, t, p, e), (p.initialised = !0);
      },
      m = Qg(function () {
        p.initialised && (h.call(v, p, g), (g = {}));
      }, 1);
    return (
      d.forEach(function (t) {
        var e, n, r, o, i, s, a, l;
        v[t.name] =
          ((n = (e = t).name),
          (r = e.triggerUpdate),
          (o = void 0 !== r && r),
          (i = e.onChange),
          (s = void 0 === i ? function (t, e) {} : i),
          (a = e.defaultVal),
          (l = void 0 === a ? null : a),
          function (t) {
            var e = p[n];
            if (!arguments.length) return e;
            var r = void 0 === t ? l : t;
            return (
              (p[n] = r),
              s.call(v, r, p, e),
              !g.hasOwnProperty(n) && (g[n] = e),
              o && m(),
              v
            );
          });
      }),
      Object.keys(s).forEach(function (t) {
        v[t] = function () {
          for (var e, n = arguments.length, r = new Array(n), o = 0; o < n; o++)
            r[o] = arguments[o];
          return (e = s[t]).call.apply(e, [v, p].concat(r));
        };
      }),
      Object.entries(l).forEach(function (t) {
        var e = cv(t, 2),
          n = e[0],
          r = e[1];
        return (v[n] = v[r]);
      }),
      (v.resetProps = function () {
        return (
          d.forEach(function (t) {
            v[t.name](t.defaultVal);
          }),
          v
        );
      }),
      v.resetProps(),
      (p._rerender = m),
      i && a && v(a),
      v
    );
  };
}
var dv = function (t) {
  return "function" == typeof t
    ? t
    : "string" == typeof t
    ? function (e) {
        return e[t];
      }
    : function (e) {
        return t;
      };
};
function pv(t) {
  return (pv =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (t) {
          return typeof t;
        }
      : function (t) {
          return t &&
            "function" == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
            ? "symbol"
            : typeof t;
        })(t);
}
var gv = /^\s+/,
  vv = /\s+$/;
function yv(t, e) {
  if (((e = e || {}), (t = t || "") instanceof yv)) return t;
  if (!(this instanceof yv)) return new yv(t, e);
  var n = (function (t) {
    var e = { r: 0, g: 0, b: 0 },
      n = 1,
      r = null,
      o = null,
      i = null,
      s = !1,
      a = !1;
    "string" == typeof t &&
      (t = (function (t) {
        t = t.replace(gv, "").replace(vv, "").toLowerCase();
        var e,
          n = !1;
        if (jv[t]) (t = jv[t]), (n = !0);
        else if ("transparent" == t)
          return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        if ((e = Wv.rgb.exec(t))) return { r: e[1], g: e[2], b: e[3] };
        if ((e = Wv.rgba.exec(t)))
          return { r: e[1], g: e[2], b: e[3], a: e[4] };
        if ((e = Wv.hsl.exec(t))) return { h: e[1], s: e[2], l: e[3] };
        if ((e = Wv.hsla.exec(t)))
          return { h: e[1], s: e[2], l: e[3], a: e[4] };
        if ((e = Wv.hsv.exec(t))) return { h: e[1], s: e[2], v: e[3] };
        if ((e = Wv.hsva.exec(t)))
          return { h: e[1], s: e[2], v: e[3], a: e[4] };
        if ((e = Wv.hex8.exec(t)))
          return {
            r: Uv(e[1]),
            g: Uv(e[2]),
            b: Uv(e[3]),
            a: Vv(e[4]),
            format: n ? "name" : "hex8",
          };
        if ((e = Wv.hex6.exec(t)))
          return {
            r: Uv(e[1]),
            g: Uv(e[2]),
            b: Uv(e[3]),
            format: n ? "name" : "hex",
          };
        if ((e = Wv.hex4.exec(t)))
          return {
            r: Uv(e[1] + "" + e[1]),
            g: Uv(e[2] + "" + e[2]),
            b: Uv(e[3] + "" + e[3]),
            a: Vv(e[4] + "" + e[4]),
            format: n ? "name" : "hex8",
          };
        if ((e = Wv.hex3.exec(t)))
          return {
            r: Uv(e[1] + "" + e[1]),
            g: Uv(e[2] + "" + e[2]),
            b: Uv(e[3] + "" + e[3]),
            format: n ? "name" : "hex",
          };
        return !1;
      })(t));
    "object" == pv(t) &&
      (Xv(t.r) && Xv(t.g) && Xv(t.b)
        ? ((l = t.r),
          (u = t.g),
          (c = t.b),
          (e = {
            r: 255 * Iv(l, 255),
            g: 255 * Iv(u, 255),
            b: 255 * Iv(c, 255),
          }),
          (s = !0),
          (a = "%" === String(t.r).substr(-1) ? "prgb" : "rgb"))
        : Xv(t.h) && Xv(t.s) && Xv(t.v)
        ? ((r = Bv(t.s)),
          (o = Bv(t.v)),
          (e = (function (t, e, n) {
            (t = 6 * Iv(t, 360)), (e = Iv(e, 100)), (n = Iv(n, 100));
            var r = Math.floor(t),
              o = t - r,
              i = n * (1 - e),
              s = n * (1 - o * e),
              a = n * (1 - (1 - o) * e),
              l = r % 6,
              u = [n, s, i, i, a, n][l],
              c = [a, n, n, s, i, i][l],
              f = [i, i, a, n, n, s][l];
            return { r: 255 * u, g: 255 * c, b: 255 * f };
          })(t.h, r, o)),
          (s = !0),
          (a = "hsv"))
        : Xv(t.h) &&
          Xv(t.s) &&
          Xv(t.l) &&
          ((r = Bv(t.s)),
          (i = Bv(t.l)),
          (e = (function (t, e, n) {
            var r, o, i;
            function s(t, e, n) {
              return (
                n < 0 && (n += 1),
                n > 1 && (n -= 1),
                n < 1 / 6
                  ? t + 6 * (e - t) * n
                  : n < 0.5
                  ? e
                  : n < 2 / 3
                  ? t + (e - t) * (2 / 3 - n) * 6
                  : t
              );
            }
            if (((t = Iv(t, 360)), (e = Iv(e, 100)), (n = Iv(n, 100)), 0 === e))
              r = o = i = n;
            else {
              var a = n < 0.5 ? n * (1 + e) : n + e - n * e,
                l = 2 * n - a;
              (r = s(l, a, t + 1 / 3)),
                (o = s(l, a, t)),
                (i = s(l, a, t - 1 / 3));
            }
            return { r: 255 * r, g: 255 * o, b: 255 * i };
          })(t.h, r, i)),
          (s = !0),
          (a = "hsl")),
      t.hasOwnProperty("a") && (n = t.a));
    var l, u, c;
    return (
      (n = Dv(n)),
      {
        ok: s,
        format: t.format || a,
        r: Math.min(255, Math.max(e.r, 0)),
        g: Math.min(255, Math.max(e.g, 0)),
        b: Math.min(255, Math.max(e.b, 0)),
        a: n,
      }
    );
  })(t);
  (this._originalInput = t),
    (this._r = n.r),
    (this._g = n.g),
    (this._b = n.b),
    (this._a = n.a),
    (this._roundA = Math.round(100 * this._a) / 100),
    (this._format = e.format || n.format),
    (this._gradientType = e.gradientType),
    this._r < 1 && (this._r = Math.round(this._r)),
    this._g < 1 && (this._g = Math.round(this._g)),
    this._b < 1 && (this._b = Math.round(this._b)),
    (this._ok = n.ok);
}
function mv(t, e, n) {
  (t = Iv(t, 255)), (e = Iv(e, 255)), (n = Iv(n, 255));
  var r,
    o,
    i = Math.max(t, e, n),
    s = Math.min(t, e, n),
    a = (i + s) / 2;
  if (i == s) r = o = 0;
  else {
    var l = i - s;
    switch (((o = a > 0.5 ? l / (2 - i - s) : l / (i + s)), i)) {
      case t:
        r = (e - n) / l + (e < n ? 6 : 0);
        break;
      case e:
        r = (n - t) / l + 2;
        break;
      case n:
        r = (t - e) / l + 4;
    }
    r /= 6;
  }
  return { h: r, s: o, l: a };
}
function _v(t, e, n) {
  (t = Iv(t, 255)), (e = Iv(e, 255)), (n = Iv(n, 255));
  var r,
    o,
    i = Math.max(t, e, n),
    s = Math.min(t, e, n),
    a = i,
    l = i - s;
  if (((o = 0 === i ? 0 : l / i), i == s)) r = 0;
  else {
    switch (i) {
      case t:
        r = (e - n) / l + (e < n ? 6 : 0);
        break;
      case e:
        r = (n - t) / l + 2;
        break;
      case n:
        r = (t - e) / l + 4;
    }
    r /= 6;
  }
  return { h: r, s: o, v: a };
}
function bv(t, e, n, r) {
  var o = [
    Fv(Math.round(t).toString(16)),
    Fv(Math.round(e).toString(16)),
    Fv(Math.round(n).toString(16)),
  ];
  return r &&
    o[0].charAt(0) == o[0].charAt(1) &&
    o[1].charAt(0) == o[1].charAt(1) &&
    o[2].charAt(0) == o[2].charAt(1)
    ? o[0].charAt(0) + o[1].charAt(0) + o[2].charAt(0)
    : o.join("");
}
function wv(t, e, n, r) {
  return [
    Fv($v(r)),
    Fv(Math.round(t).toString(16)),
    Fv(Math.round(e).toString(16)),
    Fv(Math.round(n).toString(16)),
  ].join("");
}
function xv(t, e) {
  e = 0 === e ? 0 : e || 10;
  var n = yv(t).toHsl();
  return (n.s -= e / 100), (n.s = Lv(n.s)), yv(n);
}
function kv(t, e) {
  e = 0 === e ? 0 : e || 10;
  var n = yv(t).toHsl();
  return (n.s += e / 100), (n.s = Lv(n.s)), yv(n);
}
function Sv(t) {
  return yv(t).desaturate(100);
}
function Ev(t, e) {
  e = 0 === e ? 0 : e || 10;
  var n = yv(t).toHsl();
  return (n.l += e / 100), (n.l = Lv(n.l)), yv(n);
}
function Cv(t, e) {
  e = 0 === e ? 0 : e || 10;
  var n = yv(t).toRgb();
  return (
    (n.r = Math.max(0, Math.min(255, n.r - Math.round((-e / 100) * 255)))),
    (n.g = Math.max(0, Math.min(255, n.g - Math.round((-e / 100) * 255)))),
    (n.b = Math.max(0, Math.min(255, n.b - Math.round((-e / 100) * 255)))),
    yv(n)
  );
}
function Av(t, e) {
  e = 0 === e ? 0 : e || 10;
  var n = yv(t).toHsl();
  return (n.l -= e / 100), (n.l = Lv(n.l)), yv(n);
}
function Ov(t, e) {
  var n = yv(t).toHsl(),
    r = (n.h + e) % 360;
  return (n.h = r < 0 ? 360 + r : r), yv(n);
}
function Tv(t) {
  var e = yv(t).toHsl();
  return (e.h = (e.h + 180) % 360), yv(e);
}
function Nv(t, e) {
  if (isNaN(e) || e <= 0)
    throw new Error("Argument to polyad must be a positive number");
  for (var n = yv(t).toHsl(), r = [yv(t)], o = 360 / e, i = 1; i < e; i++)
    r.push(yv({ h: (n.h + i * o) % 360, s: n.s, l: n.l }));
  return r;
}
function Pv(t) {
  var e = yv(t).toHsl(),
    n = e.h;
  return [
    yv(t),
    yv({ h: (n + 72) % 360, s: e.s, l: e.l }),
    yv({ h: (n + 216) % 360, s: e.s, l: e.l }),
  ];
}
function Mv(t, e, n) {
  (e = e || 6), (n = n || 30);
  var r = yv(t).toHsl(),
    o = 360 / n,
    i = [yv(t)];
  for (r.h = (r.h - ((o * e) >> 1) + 720) % 360; --e; )
    (r.h = (r.h + o) % 360), i.push(yv(r));
  return i;
}
function Rv(t, e) {
  e = e || 6;
  for (
    var n = yv(t).toHsv(), r = n.h, o = n.s, i = n.v, s = [], a = 1 / e;
    e--;

  )
    s.push(yv({ h: r, s: o, v: i })), (i = (i + a) % 1);
  return s;
}
(yv.prototype = {
  isDark: function () {
    return this.getBrightness() < 128;
  },
  isLight: function () {
    return !this.isDark();
  },
  isValid: function () {
    return this._ok;
  },
  getOriginalInput: function () {
    return this._originalInput;
  },
  getFormat: function () {
    return this._format;
  },
  getAlpha: function () {
    return this._a;
  },
  getBrightness: function () {
    var t = this.toRgb();
    return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3;
  },
  getLuminance: function () {
    var t,
      e,
      n,
      r = this.toRgb();
    return (
      (t = r.r / 255),
      (e = r.g / 255),
      (n = r.b / 255),
      0.2126 * (t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4)) +
        0.7152 *
          (e <= 0.03928 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4)) +
        0.0722 * (n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4))
    );
  },
  setAlpha: function (t) {
    return (
      (this._a = Dv(t)), (this._roundA = Math.round(100 * this._a) / 100), this
    );
  },
  toHsv: function () {
    var t = _v(this._r, this._g, this._b);
    return { h: 360 * t.h, s: t.s, v: t.v, a: this._a };
  },
  toHsvString: function () {
    var t = _v(this._r, this._g, this._b),
      e = Math.round(360 * t.h),
      n = Math.round(100 * t.s),
      r = Math.round(100 * t.v);
    return 1 == this._a
      ? "hsv(" + e + ", " + n + "%, " + r + "%)"
      : "hsva(" + e + ", " + n + "%, " + r + "%, " + this._roundA + ")";
  },
  toHsl: function () {
    var t = mv(this._r, this._g, this._b);
    return { h: 360 * t.h, s: t.s, l: t.l, a: this._a };
  },
  toHslString: function () {
    var t = mv(this._r, this._g, this._b),
      e = Math.round(360 * t.h),
      n = Math.round(100 * t.s),
      r = Math.round(100 * t.l);
    return 1 == this._a
      ? "hsl(" + e + ", " + n + "%, " + r + "%)"
      : "hsla(" + e + ", " + n + "%, " + r + "%, " + this._roundA + ")";
  },
  toHex: function (t) {
    return bv(this._r, this._g, this._b, t);
  },
  toHexString: function (t) {
    return "#" + this.toHex(t);
  },
  toHex8: function (t) {
    return (function (t, e, n, r, o) {
      var i = [
        Fv(Math.round(t).toString(16)),
        Fv(Math.round(e).toString(16)),
        Fv(Math.round(n).toString(16)),
        Fv($v(r)),
      ];
      if (
        o &&
        i[0].charAt(0) == i[0].charAt(1) &&
        i[1].charAt(0) == i[1].charAt(1) &&
        i[2].charAt(0) == i[2].charAt(1) &&
        i[3].charAt(0) == i[3].charAt(1)
      )
        return (
          i[0].charAt(0) + i[1].charAt(0) + i[2].charAt(0) + i[3].charAt(0)
        );
      return i.join("");
    })(this._r, this._g, this._b, this._a, t);
  },
  toHex8String: function (t) {
    return "#" + this.toHex8(t);
  },
  toRgb: function () {
    return {
      r: Math.round(this._r),
      g: Math.round(this._g),
      b: Math.round(this._b),
      a: this._a,
    };
  },
  toRgbString: function () {
    return 1 == this._a
      ? "rgb(" +
          Math.round(this._r) +
          ", " +
          Math.round(this._g) +
          ", " +
          Math.round(this._b) +
          ")"
      : "rgba(" +
          Math.round(this._r) +
          ", " +
          Math.round(this._g) +
          ", " +
          Math.round(this._b) +
          ", " +
          this._roundA +
          ")";
  },
  toPercentageRgb: function () {
    return {
      r: Math.round(100 * Iv(this._r, 255)) + "%",
      g: Math.round(100 * Iv(this._g, 255)) + "%",
      b: Math.round(100 * Iv(this._b, 255)) + "%",
      a: this._a,
    };
  },
  toPercentageRgbString: function () {
    return 1 == this._a
      ? "rgb(" +
          Math.round(100 * Iv(this._r, 255)) +
          "%, " +
          Math.round(100 * Iv(this._g, 255)) +
          "%, " +
          Math.round(100 * Iv(this._b, 255)) +
          "%)"
      : "rgba(" +
          Math.round(100 * Iv(this._r, 255)) +
          "%, " +
          Math.round(100 * Iv(this._g, 255)) +
          "%, " +
          Math.round(100 * Iv(this._b, 255)) +
          "%, " +
          this._roundA +
          ")";
  },
  toName: function () {
    return 0 === this._a
      ? "transparent"
      : !(this._a < 1) && (zv[bv(this._r, this._g, this._b, !0)] || !1);
  },
  toFilter: function (t) {
    var e = "#" + wv(this._r, this._g, this._b, this._a),
      n = e,
      r = this._gradientType ? "GradientType = 1, " : "";
    if (t) {
      var o = yv(t);
      n = "#" + wv(o._r, o._g, o._b, o._a);
    }
    return (
      "progid:DXImageTransform.Microsoft.gradient(" +
      r +
      "startColorstr=" +
      e +
      ",endColorstr=" +
      n +
      ")"
    );
  },
  toString: function (t) {
    var e = !!t;
    t = t || this._format;
    var n = !1,
      r = this._a < 1 && this._a >= 0;
    return e ||
      !r ||
      ("hex" !== t &&
        "hex6" !== t &&
        "hex3" !== t &&
        "hex4" !== t &&
        "hex8" !== t &&
        "name" !== t)
      ? ("rgb" === t && (n = this.toRgbString()),
        "prgb" === t && (n = this.toPercentageRgbString()),
        ("hex" !== t && "hex6" !== t) || (n = this.toHexString()),
        "hex3" === t && (n = this.toHexString(!0)),
        "hex4" === t && (n = this.toHex8String(!0)),
        "hex8" === t && (n = this.toHex8String()),
        "name" === t && (n = this.toName()),
        "hsl" === t && (n = this.toHslString()),
        "hsv" === t && (n = this.toHsvString()),
        n || this.toHexString())
      : "name" === t && 0 === this._a
      ? this.toName()
      : this.toRgbString();
  },
  clone: function () {
    return yv(this.toString());
  },
  _applyModification: function (t, e) {
    var n = t.apply(null, [this].concat([].slice.call(e)));
    return (
      (this._r = n._r),
      (this._g = n._g),
      (this._b = n._b),
      this.setAlpha(n._a),
      this
    );
  },
  lighten: function () {
    return this._applyModification(Ev, arguments);
  },
  brighten: function () {
    return this._applyModification(Cv, arguments);
  },
  darken: function () {
    return this._applyModification(Av, arguments);
  },
  desaturate: function () {
    return this._applyModification(xv, arguments);
  },
  saturate: function () {
    return this._applyModification(kv, arguments);
  },
  greyscale: function () {
    return this._applyModification(Sv, arguments);
  },
  spin: function () {
    return this._applyModification(Ov, arguments);
  },
  _applyCombination: function (t, e) {
    return t.apply(null, [this].concat([].slice.call(e)));
  },
  analogous: function () {
    return this._applyCombination(Mv, arguments);
  },
  complement: function () {
    return this._applyCombination(Tv, arguments);
  },
  monochromatic: function () {
    return this._applyCombination(Rv, arguments);
  },
  splitcomplement: function () {
    return this._applyCombination(Pv, arguments);
  },
  triad: function () {
    return this._applyCombination(Nv, [3]);
  },
  tetrad: function () {
    return this._applyCombination(Nv, [4]);
  },
}),
  (yv.fromRatio = function (t, e) {
    if ("object" == pv(t)) {
      var n = {};
      for (var r in t)
        t.hasOwnProperty(r) && (n[r] = "a" === r ? t[r] : Bv(t[r]));
      t = n;
    }
    return yv(t, e);
  }),
  (yv.equals = function (t, e) {
    return !(!t || !e) && yv(t).toRgbString() == yv(e).toRgbString();
  }),
  (yv.random = function () {
    return yv.fromRatio({
      r: Math.random(),
      g: Math.random(),
      b: Math.random(),
    });
  }),
  (yv.mix = function (t, e, n) {
    n = 0 === n ? 0 : n || 50;
    var r = yv(t).toRgb(),
      o = yv(e).toRgb(),
      i = n / 100;
    return yv({
      r: (o.r - r.r) * i + r.r,
      g: (o.g - r.g) * i + r.g,
      b: (o.b - r.b) * i + r.b,
      a: (o.a - r.a) * i + r.a,
    });
  }),
  (yv.readability = function (t, e) {
    var n = yv(t),
      r = yv(e);
    return (
      (Math.max(n.getLuminance(), r.getLuminance()) + 0.05) /
      (Math.min(n.getLuminance(), r.getLuminance()) + 0.05)
    );
  }),
  (yv.isReadable = function (t, e, n) {
    var r,
      o,
      i = yv.readability(t, e);
    switch (
      ((o = !1),
      (r = (function (t) {
        var e, n;
        (e = (
          (t = t || { level: "AA", size: "small" }).level || "AA"
        ).toUpperCase()),
          (n = (t.size || "small").toLowerCase()),
          "AA" !== e && "AAA" !== e && (e = "AA");
        "small" !== n && "large" !== n && (n = "small");
        return { level: e, size: n };
      })(n)).level + r.size)
    ) {
      case "AAsmall":
      case "AAAlarge":
        o = i >= 4.5;
        break;
      case "AAlarge":
        o = i >= 3;
        break;
      case "AAAsmall":
        o = i >= 7;
    }
    return o;
  }),
  (yv.mostReadable = function (t, e, n) {
    var r,
      o,
      i,
      s,
      a = null,
      l = 0;
    (o = (n = n || {}).includeFallbackColors), (i = n.level), (s = n.size);
    for (var u = 0; u < e.length; u++)
      (r = yv.readability(t, e[u])) > l && ((l = r), (a = yv(e[u])));
    return yv.isReadable(t, a, { level: i, size: s }) || !o
      ? a
      : ((n.includeFallbackColors = !1),
        yv.mostReadable(t, ["#fff", "#000"], n));
  });
var jv = (yv.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32",
  }),
  zv = (yv.hexNames = (function (t) {
    var e = {};
    for (var n in t) t.hasOwnProperty(n) && (e[t[n]] = n);
    return e;
  })(jv));
function Dv(t) {
  return (t = parseFloat(t)), (isNaN(t) || t < 0 || t > 1) && (t = 1), t;
}
function Iv(t, e) {
  (function (t) {
    return "string" == typeof t && -1 != t.indexOf(".") && 1 === parseFloat(t);
  })(t) && (t = "100%");
  var n = (function (t) {
    return "string" == typeof t && -1 != t.indexOf("%");
  })(t);
  return (
    (t = Math.min(e, Math.max(0, parseFloat(t)))),
    n && (t = parseInt(t * e, 10) / 100),
    Math.abs(t - e) < 1e-6 ? 1 : (t % e) / parseFloat(e)
  );
}
function Lv(t) {
  return Math.min(1, Math.max(0, t));
}
function Uv(t) {
  return parseInt(t, 16);
}
function Fv(t) {
  return 1 == t.length ? "0" + t : "" + t;
}
function Bv(t) {
  return t <= 1 && (t = 100 * t + "%"), t;
}
function $v(t) {
  return Math.round(255 * parseFloat(t)).toString(16);
}
function Vv(t) {
  return Uv(t) / 255;
}
var qv,
  Hv,
  Gv,
  Wv =
    ((Hv =
      "[\\s|\\(]+(" +
      (qv = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)") +
      ")[,|\\s]+(" +
      qv +
      ")[,|\\s]+(" +
      qv +
      ")\\s*\\)?"),
    (Gv =
      "[\\s|\\(]+(" +
      qv +
      ")[,|\\s]+(" +
      qv +
      ")[,|\\s]+(" +
      qv +
      ")[,|\\s]+(" +
      qv +
      ")\\s*\\)?"),
    {
      CSS_UNIT: new RegExp(qv),
      rgb: new RegExp("rgb" + Hv),
      rgba: new RegExp("rgba" + Gv),
      hsl: new RegExp("hsl" + Hv),
      hsla: new RegExp("hsla" + Gv),
      hsv: new RegExp("hsv" + Hv),
      hsva: new RegExp("hsva" + Gv),
      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
      hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    });
function Xv(t) {
  return !!Wv.CSS_UNIT.exec(t);
}
function Yv(t, e) {
  (null == e || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function Jv(t, e, n) {
  if ("function" == typeof t ? t === e : t.has(e))
    return arguments.length < 3 ? e : n;
  throw new TypeError("Private element is not present on this object");
}
function Kv(t, e) {
  return t.get(Jv(t, e));
}
function Zv(t, e, n) {
  (function (t, e) {
    if (e.has(t))
      throw new TypeError(
        "Cannot initialize the same private elements twice on an object"
      );
  })(t, e),
    e.set(t, n);
}
function Qv(t, e, n) {
  return t.set(Jv(t, e), n), n;
}
function ty(t, e, n) {
  return (
    e &&
      (function (t, e) {
        for (var n = 0; n < e.length; n++) {
          var r = e[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(t, ny(r.key), r);
        }
      })(t.prototype, e),
    Object.defineProperty(t, "prototype", { writable: !1 }),
    t
  );
}
function ey(t) {
  return (
    (function (t) {
      if (Array.isArray(t)) return Yv(t);
    })(t) ||
    (function (t) {
      if (
        ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
        null != t["@@iterator"]
      )
        return Array.from(t);
    })(t) ||
    (function (t, e) {
      if (t) {
        if ("string" == typeof t) return Yv(t, e);
        var n = {}.toString.call(t).slice(8, -1);
        return (
          "Object" === n && t.constructor && (n = t.constructor.name),
          "Map" === n || "Set" === n
            ? Array.from(t)
            : "Arguments" === n ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
            ? Yv(t, e)
            : void 0
        );
      }
    })(t) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
function ny(t) {
  var e = (function (t, e) {
    if ("object" != typeof t || !t) return t;
    var n = t[Symbol.toPrimitive];
    if (void 0 !== n) {
      var r = n.call(t, e);
      if ("object" != typeof r) return r;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(t);
  })(t, "string");
  return "symbol" == typeof e ? e : e + "";
}
var ry,
  oy,
  iy,
  sy,
  ay,
  ly,
  uy,
  cy,
  fy,
  hy,
  dy,
  py,
  gy = function (t, e, n) {
    return (t << 16) + (e << 8) + n;
  },
  vy = function (t, e) {
    return (123 * t) % Math.pow(2, e);
  },
  yy = new WeakMap(),
  my = new WeakMap(),
  _y = (function () {
    return ty(
      function t() {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 6;
        !(function (t, e) {
          if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function");
        })(this, t),
          Zv(this, yy, void 0),
          Zv(this, my, void 0),
          Qv(my, this, e),
          this.reset();
      },
      [
        {
          key: "reset",
          value: function () {
            Qv(yy, this, ["__reserved for background__"]);
          },
        },
        {
          key: "register",
          value: function (t) {
            if (Kv(yy, this).length >= Math.pow(2, 24 - Kv(my, this)))
              return null;
            var e,
              n = Kv(yy, this).length,
              r = vy(n, Kv(my, this)),
              o =
                ((e = n + (r << (24 - Kv(my, this)))),
                "#".concat(
                  Math.min(e, Math.pow(2, 24)).toString(16).padStart(6, "0")
                ));
            return Kv(yy, this).push(t), o;
          },
        },
        {
          key: "lookup",
          value: function (t) {
            if (!t) return null;
            var e,
              n,
              r,
              o,
              i =
                "string" == typeof t
                  ? ((e = yv(t).toRgb()),
                    (n = e.r),
                    (r = e.g),
                    (o = e.b),
                    gy(n, r, o))
                  : gy.apply(void 0, ey(t));
            if (!i) return null;
            var s = i & (Math.pow(2, 24 - Kv(my, this)) - 1),
              a = (i >> (24 - Kv(my, this))) & (Math.pow(2, Kv(my, this)) - 1);
            return vy(s, Kv(my, this)) !== a || s >= Kv(yy, this).length
              ? null
              : Kv(yy, this)[s];
          },
        },
      ]
    );
  })(),
  by = {},
  wy = [],
  xy = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
  ky = Array.isArray;
function Sy(t, e) {
  for (var n in e) t[n] = e[n];
  return t;
}
function Ey(t) {
  t && t.parentNode && t.parentNode.removeChild(t);
}
function Cy(t, e, n, r, o) {
  var i = {
    type: t,
    props: e,
    key: n,
    ref: r,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __c: null,
    constructor: void 0,
    __v: null == o ? ++iy : o,
    __i: -1,
    __u: 0,
  };
  return null == o && null != oy.vnode && oy.vnode(i), i;
}
function Ay(t) {
  return t.children;
}
function Oy(t, e) {
  (this.props = t), (this.context = e);
}
function Ty(t, e) {
  if (null == e) return t.__ ? Ty(t.__, t.__i + 1) : null;
  for (var n; e < t.__k.length; e++)
    if (null != (n = t.__k[e]) && null != n.__e) return n.__e;
  return "function" == typeof t.type ? Ty(t) : null;
}
function Ny(t) {
  var e, n;
  if (null != (t = t.__) && null != t.__c) {
    for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++)
      if (null != (n = t.__k[e]) && null != n.__e) {
        t.__e = t.__c.base = n.__e;
        break;
      }
    return Ny(t);
  }
}
function Py(t) {
  ((!t.__d && (t.__d = !0) && ay.push(t) && !My.__r++) ||
    ly != oy.debounceRendering) &&
    ((ly = oy.debounceRendering) || uy)(My);
}
function My() {
  for (var t, e, n, r, o, i, s, a = 1; ay.length; )
    ay.length > a && ay.sort(cy),
      (t = ay.shift()),
      (a = ay.length),
      t.__d &&
        ((n = void 0),
        (r = void 0),
        (o = (r = (e = t).__v).__e),
        (i = []),
        (s = []),
        e.__P &&
          (((n = Sy({}, r)).__v = r.__v + 1),
          oy.vnode && oy.vnode(n),
          Uy(
            e.__P,
            n,
            r,
            e.__n,
            e.__P.namespaceURI,
            32 & r.__u ? [o] : null,
            i,
            null == o ? Ty(r) : o,
            !!(32 & r.__u),
            s
          ),
          (n.__v = r.__v),
          (n.__.__k[n.__i] = n),
          By(i, n, s),
          (r.__e = r.__ = null),
          n.__e != o && Ny(n)));
  My.__r = 0;
}
function Ry(t, e, n, r, o, i, s, a, l, u, c) {
  var f,
    h,
    d,
    p,
    g,
    v,
    y,
    m = (r && r.__k) || wy,
    _ = e.length;
  for (
    l = (function (t, e, n, r, o) {
      var i,
        s,
        a,
        l,
        u,
        c = n.length,
        f = c,
        h = 0;
      for (t.__k = new Array(o), i = 0; i < o; i++)
        null != (s = e[i]) && "boolean" != typeof s && "function" != typeof s
          ? ("string" == typeof s ||
            "number" == typeof s ||
            "bigint" == typeof s ||
            s.constructor == String
              ? (s = t.__k[i] = Cy(null, s, null, null, null))
              : ky(s)
              ? (s = t.__k[i] = Cy(Ay, { children: s }, null, null, null))
              : null == s.constructor && s.__b > 0
              ? (s = t.__k[i] =
                  Cy(s.type, s.props, s.key, s.ref ? s.ref : null, s.__v))
              : (t.__k[i] = s),
            (l = i + h),
            (s.__ = t),
            (s.__b = t.__b + 1),
            -1 != (u = s.__i = zy(s, n, l, f)) &&
              (f--, (a = n[u]) && (a.__u |= 2)),
            null == a || null == a.__v
              ? (-1 == u && (o > c ? h-- : o < c && h++),
                "function" != typeof s.type && (s.__u |= 4))
              : u != l &&
                (u == l - 1
                  ? h--
                  : u == l + 1
                  ? h++
                  : (u > l ? h-- : h++, (s.__u |= 4))))
          : (t.__k[i] = null);
      if (f)
        for (i = 0; i < c; i++)
          null != (a = n[i]) &&
            !(2 & a.__u) &&
            (a.__e == r && (r = Ty(a)), qy(a, a));
      return r;
    })(n, e, m, l, _),
      f = 0;
    f < _;
    f++
  )
    null != (d = n.__k[f]) &&
      ((h = -1 == d.__i ? by : m[d.__i] || by),
      (d.__i = f),
      (v = Uy(t, d, h, o, i, s, a, l, u, c)),
      (p = d.__e),
      d.ref &&
        h.ref != d.ref &&
        (h.ref && Vy(h.ref, null, d), c.push(d.ref, d.__c || p, d)),
      null == g && null != p && (g = p),
      (y = !!(4 & d.__u)) || h.__k === d.__k
        ? (l = jy(d, l, t, y))
        : "function" == typeof d.type && void 0 !== v
        ? (l = v)
        : p && (l = p.nextSibling),
      (d.__u &= -7));
  return (n.__e = g), l;
}
function jy(t, e, n, r) {
  var o, i;
  if ("function" == typeof t.type) {
    for (o = t.__k, i = 0; o && i < o.length; i++)
      o[i] && ((o[i].__ = t), (e = jy(o[i], e, n, r)));
    return e;
  }
  t.__e != e &&
    (r &&
      (e && t.type && !e.parentNode && (e = Ty(t)),
      n.insertBefore(t.__e, e || null)),
    (e = t.__e));
  do {
    e = e && e.nextSibling;
  } while (null != e && 8 == e.nodeType);
  return e;
}
function zy(t, e, n, r) {
  var o,
    i,
    s,
    a = t.key,
    l = t.type,
    u = e[n],
    c = null != u && !(2 & u.__u);
  if ((null === u && null == a) || (c && a == u.key && l == u.type)) return n;
  if (r > (c ? 1 : 0))
    for (o = n - 1, i = n + 1; o >= 0 || i < e.length; )
      if (
        null != (u = e[(s = o >= 0 ? o-- : i++)]) &&
        !(2 & u.__u) &&
        a == u.key &&
        l == u.type
      )
        return s;
  return -1;
}
function Dy(t, e, n) {
  "-" == e[0]
    ? t.setProperty(e, null == n ? "" : n)
    : (t[e] =
        null == n ? "" : "number" != typeof n || xy.test(e) ? n : n + "px");
}
function Iy(t, e, n, r, o) {
  var i, s;
  t: if ("style" == e)
    if ("string" == typeof n) t.style.cssText = n;
    else {
      if (("string" == typeof r && (t.style.cssText = r = ""), r))
        for (e in r) (n && e in n) || Dy(t.style, e, "");
      if (n) for (e in n) (r && n[e] == r[e]) || Dy(t.style, e, n[e]);
    }
  else if ("o" == e[0] && "n" == e[1])
    (i = e != (e = e.replace(fy, "$1"))),
      (s = e.toLowerCase()),
      (e =
        s in t || "onFocusOut" == e || "onFocusIn" == e
          ? s.slice(2)
          : e.slice(2)),
      t.l || (t.l = {}),
      (t.l[e + i] = n),
      n
        ? r
          ? (n.u = r.u)
          : ((n.u = hy), t.addEventListener(e, i ? py : dy, i))
        : t.removeEventListener(e, i ? py : dy, i);
  else {
    if ("http://www.w3.org/2000/svg" == o)
      e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (
      "width" != e &&
      "height" != e &&
      "href" != e &&
      "list" != e &&
      "form" != e &&
      "tabIndex" != e &&
      "download" != e &&
      "rowSpan" != e &&
      "colSpan" != e &&
      "role" != e &&
      "popover" != e &&
      e in t
    )
      try {
        t[e] = null == n ? "" : n;
        break t;
      } catch (a) {}
    "function" == typeof n ||
      (null == n || (!1 === n && "-" != e[4])
        ? t.removeAttribute(e)
        : t.setAttribute(e, "popover" == e && 1 == n ? "" : n));
  }
}
function Ly(t) {
  return function (e) {
    if (this.l) {
      var n = this.l[e.type + t];
      if (null == e.t) e.t = hy++;
      else if (e.t < n.u) return;
      return n(oy.event ? oy.event(e) : e);
    }
  };
}
function Uy(t, e, n, r, o, i, s, a, l, u) {
  var c,
    f,
    h,
    d,
    p,
    g,
    v,
    y,
    m,
    _,
    b,
    w,
    x,
    k,
    S,
    E,
    C,
    A = e.type;
  if (null != e.constructor) return null;
  128 & n.__u && ((l = !!(32 & n.__u)), (i = [(a = e.__e = n.__e)])),
    (c = oy.__b) && c(e);
  t: if ("function" == typeof A)
    try {
      if (
        ((y = e.props),
        (m = "prototype" in A && A.prototype.render),
        (_ = (c = A.contextType) && r[c.__c]),
        (b = c ? (_ ? _.props.value : c.__) : r),
        n.__c
          ? (v = (f = e.__c = n.__c).__ = f.__E)
          : (m
              ? (e.__c = f = new A(y, b))
              : ((e.__c = f = new Oy(y, b)),
                (f.constructor = A),
                (f.render = Hy)),
            _ && _.sub(f),
            f.state || (f.state = {}),
            (f.__n = r),
            (h = f.__d = !0),
            (f.__h = []),
            (f._sb = [])),
        m && null == f.__s && (f.__s = f.state),
        m &&
          null != A.getDerivedStateFromProps &&
          (f.__s == f.state && (f.__s = Sy({}, f.__s)),
          Sy(f.__s, A.getDerivedStateFromProps(y, f.__s))),
        (d = f.props),
        (p = f.state),
        (f.__v = e),
        h)
      )
        m &&
          null == A.getDerivedStateFromProps &&
          null != f.componentWillMount &&
          f.componentWillMount(),
          m && null != f.componentDidMount && f.__h.push(f.componentDidMount);
      else {
        if (
          (m &&
            null == A.getDerivedStateFromProps &&
            y !== d &&
            null != f.componentWillReceiveProps &&
            f.componentWillReceiveProps(y, b),
          e.__v == n.__v ||
            (!f.__e &&
              null != f.shouldComponentUpdate &&
              !1 === f.shouldComponentUpdate(y, f.__s, b)))
        ) {
          for (
            e.__v != n.__v && ((f.props = y), (f.state = f.__s), (f.__d = !1)),
              e.__e = n.__e,
              e.__k = n.__k,
              e.__k.some(function (t) {
                t && (t.__ = e);
              }),
              w = 0;
            w < f._sb.length;
            w++
          )
            f.__h.push(f._sb[w]);
          (f._sb = []), f.__h.length && s.push(f);
          break t;
        }
        null != f.componentWillUpdate && f.componentWillUpdate(y, f.__s, b),
          m &&
            null != f.componentDidUpdate &&
            f.__h.push(function () {
              f.componentDidUpdate(d, p, g);
            });
      }
      if (
        ((f.context = b),
        (f.props = y),
        (f.__P = t),
        (f.__e = !1),
        (x = oy.__r),
        (k = 0),
        m)
      ) {
        for (
          f.state = f.__s,
            f.__d = !1,
            x && x(e),
            c = f.render(f.props, f.state, f.context),
            S = 0;
          S < f._sb.length;
          S++
        )
          f.__h.push(f._sb[S]);
        f._sb = [];
      } else
        do {
          (f.__d = !1),
            x && x(e),
            (c = f.render(f.props, f.state, f.context)),
            (f.state = f.__s);
        } while (f.__d && ++k < 25);
      (f.state = f.__s),
        null != f.getChildContext && (r = Sy(Sy({}, r), f.getChildContext())),
        m &&
          !h &&
          null != f.getSnapshotBeforeUpdate &&
          (g = f.getSnapshotBeforeUpdate(d, p)),
        (E = c),
        null != c &&
          c.type === Ay &&
          null == c.key &&
          (E = $y(c.props.children)),
        (a = Ry(t, ky(E) ? E : [E], e, n, r, o, i, s, a, l, u)),
        (f.base = e.__e),
        (e.__u &= -161),
        f.__h.length && s.push(f),
        v && (f.__E = f.__ = null);
    } catch (O) {
      if (((e.__v = null), l || null != i))
        if (O.then) {
          for (e.__u |= l ? 160 : 128; a && 8 == a.nodeType && a.nextSibling; )
            a = a.nextSibling;
          (i[i.indexOf(a)] = null), (e.__e = a);
        } else {
          for (C = i.length; C--; ) Ey(i[C]);
          Fy(e);
        }
      else (e.__e = n.__e), (e.__k = n.__k), O.then || Fy(e);
      oy.__e(O, e, n);
    }
  else
    null == i && e.__v == n.__v
      ? ((e.__k = n.__k), (e.__e = n.__e))
      : (a = e.__e =
          (function (t, e, n, r, o, i, s, a, l) {
            var u,
              c,
              f,
              h,
              d,
              p,
              g,
              v = n.props || by,
              y = e.props,
              m = e.type;
            if (
              ("svg" == m
                ? (o = "http://www.w3.org/2000/svg")
                : "math" == m
                ? (o = "http://www.w3.org/1998/Math/MathML")
                : o || (o = "http://www.w3.org/1999/xhtml"),
              null != i)
            )
              for (u = 0; u < i.length; u++)
                if (
                  (d = i[u]) &&
                  "setAttribute" in d == !!m &&
                  (m ? d.localName == m : 3 == d.nodeType)
                ) {
                  (t = d), (i[u] = null);
                  break;
                }
            if (null == t) {
              if (null == m) return document.createTextNode(y);
              (t = document.createElementNS(o, m, y.is && y)),
                a && (oy.__m && oy.__m(e, i), (a = !1)),
                (i = null);
            }
            if (null == m) v === y || (a && t.data == y) || (t.data = y);
            else {
              if (((i = i && ry.call(t.childNodes)), !a && null != i))
                for (v = {}, u = 0; u < t.attributes.length; u++)
                  v[(d = t.attributes[u]).name] = d.value;
              for (u in v)
                if (((d = v[u]), "children" == u));
                else if ("dangerouslySetInnerHTML" == u) f = d;
                else if (!(u in y)) {
                  if (
                    ("value" == u && "defaultValue" in y) ||
                    ("checked" == u && "defaultChecked" in y)
                  )
                    continue;
                  Iy(t, u, null, d, o);
                }
              for (u in y)
                (d = y[u]),
                  "children" == u
                    ? (h = d)
                    : "dangerouslySetInnerHTML" == u
                    ? (c = d)
                    : "value" == u
                    ? (p = d)
                    : "checked" == u
                    ? (g = d)
                    : (a && "function" != typeof d) ||
                      v[u] === d ||
                      Iy(t, u, d, v[u], o);
              if (c)
                a ||
                  (f && (c.__html == f.__html || c.__html == t.innerHTML)) ||
                  (t.innerHTML = c.__html),
                  (e.__k = []);
              else if (
                (f && (t.innerHTML = ""),
                Ry(
                  "template" == e.type ? t.content : t,
                  ky(h) ? h : [h],
                  e,
                  n,
                  r,
                  "foreignObject" == m ? "http://www.w3.org/1999/xhtml" : o,
                  i,
                  s,
                  i ? i[0] : n.__k && Ty(n, 0),
                  a,
                  l
                ),
                null != i)
              )
                for (u = i.length; u--; ) Ey(i[u]);
              a ||
                ((u = "value"),
                "progress" == m && null == p
                  ? t.removeAttribute("value")
                  : null != p &&
                    (p !== t[u] ||
                      ("progress" == m && !p) ||
                      ("option" == m && p != v[u])) &&
                    Iy(t, u, p, v[u], o),
                (u = "checked"),
                null != g && g != t[u] && Iy(t, u, g, v[u], o));
            }
            return t;
          })(n.__e, e, n, r, o, i, s, l, u));
  return (c = oy.diffed) && c(e), 128 & e.__u ? void 0 : a;
}
function Fy(t) {
  t && t.__c && (t.__c.__e = !0), t && t.__k && t.__k.forEach(Fy);
}
function By(t, e, n) {
  for (var r = 0; r < n.length; r++) Vy(n[r], n[++r], n[++r]);
  oy.__c && oy.__c(e, t),
    t.some(function (e) {
      try {
        (t = e.__h),
          (e.__h = []),
          t.some(function (t) {
            t.call(e);
          });
      } catch (n) {
        oy.__e(n, e.__v);
      }
    });
}
function $y(t) {
  return "object" != typeof t || null == t || (t.__b && t.__b > 0)
    ? t
    : ky(t)
    ? t.map($y)
    : Sy({}, t);
}
function Vy(t, e, n) {
  try {
    if ("function" == typeof t) {
      var r = "function" == typeof t.__u;
      r && t.__u(), (r && null == e) || (t.__u = t(e));
    } else t.current = e;
  } catch (o) {
    oy.__e(o, n);
  }
}
function qy(t, e, n) {
  var r, o;
  if (
    (oy.unmount && oy.unmount(t),
    (r = t.ref) && ((r.current && r.current != t.__e) || Vy(r, null, e)),
    null != (r = t.__c))
  ) {
    if (r.componentWillUnmount)
      try {
        r.componentWillUnmount();
      } catch (i) {
        oy.__e(i, e);
      }
    r.base = r.__P = null;
  }
  if ((r = t.__k))
    for (o = 0; o < r.length; o++)
      r[o] && qy(r[o], e, n || "function" != typeof t.type);
  n || Ey(t.__e), (t.__c = t.__ = t.__e = void 0);
}
function Hy(t, e, n) {
  return this.constructor(t, n);
}
function Gy(t, e, n) {
  var r, o, i;
  e == document && (e = document.documentElement),
    oy.__ && oy.__(t, e),
    (r = !1 ? null : e.__k),
    (o = []),
    (i = []),
    Uy(
      e,
      (t = e.__k =
        (function (t, e, n) {
          var r,
            o,
            i,
            s = {};
          for (i in e)
            "key" == i ? (r = e[i]) : "ref" == i ? (o = e[i]) : (s[i] = e[i]);
          if (
            (arguments.length > 2 &&
              (s.children = arguments.length > 3 ? ry.call(arguments, 2) : n),
            "function" == typeof t && null != t.defaultProps)
          )
            for (i in t.defaultProps)
              void 0 === s[i] && (s[i] = t.defaultProps[i]);
          return Cy(t, s, r, o, null);
        })(Ay, null, [t])),
      r || by,
      by,
      e.namespaceURI,
      r ? null : e.firstChild ? ry.call(e.childNodes) : null,
      o,
      r ? r.__e : e.firstChild,
      false,
      i
    ),
    By(o, t, i);
}
function Wy(t, e, n) {
  var r,
    o,
    i,
    s,
    a = Sy({}, t.props);
  for (i in (t.type && t.type.defaultProps && (s = t.type.defaultProps), e))
    "key" == i
      ? (r = e[i])
      : "ref" == i
      ? (o = e[i])
      : (a[i] = void 0 === e[i] && null != s ? s[i] : e[i]);
  return (
    arguments.length > 2 &&
      (a.children = arguments.length > 3 ? ry.call(arguments, 2) : n),
    Cy(t.type, a, r || t.key, o || t.ref, null)
  );
}
function Xy(t, e) {
  (null == e || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function Yy(t, e, n) {
  return (
    (e = (function (t) {
      var e = (function (t, e) {
        if ("object" != typeof t || !t) return t;
        var n = t[Symbol.toPrimitive];
        if (void 0 !== n) {
          var r = n.call(t, e);
          if ("object" != typeof r) return r;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      })(t, "string");
      return "symbol" == typeof e ? e : e + "";
    })(e)) in t
      ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = n),
    t
  );
}
function Jy(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e &&
      (r = r.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function Ky(t, e) {
  return (
    (function (t) {
      if (Array.isArray(t)) return t;
    })(t) ||
    (function (t, e) {
      var n =
        null == t
          ? null
          : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
            t["@@iterator"];
      if (null != n) {
        var r,
          o,
          i,
          s,
          a = [],
          l = !0,
          u = !1;
        try {
          if (((i = (n = n.call(t)).next), 0 === e));
          else
            for (
              ;
              !(l = (r = i.call(n)).done) && (a.push(r.value), a.length !== e);
              l = !0
            );
        } catch (c) {
          (u = !0), (o = c);
        } finally {
          try {
            if (!l && null != n.return && ((s = n.return()), Object(s) !== s))
              return;
          } finally {
            if (u) throw o;
          }
        }
        return a;
      }
    })(t, e) ||
    (function (t, e) {
      if (t) {
        if ("string" == typeof t) return Xy(t, e);
        var n = {}.toString.call(t).slice(8, -1);
        return (
          "Object" === n && t.constructor && (n = t.constructor.name),
          "Map" === n || "Set" === n
            ? Array.from(t)
            : "Arguments" === n ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
            ? Xy(t, e)
            : void 0
        );
      }
    })(t, e) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
function Zy(t) {
  return (Zy =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (t) {
          return typeof t;
        }
      : function (t) {
          return t &&
            "function" == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
            ? "symbol"
            : typeof t;
        })(t);
}
(ry = wy.slice),
  (oy = {
    __e: function (t, e, n, r) {
      for (var o, i, s; (e = e.__); )
        if ((o = e.__c) && !o.__)
          try {
            if (
              ((i = o.constructor) &&
                null != i.getDerivedStateFromError &&
                (o.setState(i.getDerivedStateFromError(t)), (s = o.__d)),
              null != o.componentDidCatch &&
                (o.componentDidCatch(t, r || {}), (s = o.__d)),
              s)
            )
              return (o.__E = o);
          } catch (a) {
            t = a;
          }
      throw t;
    },
  }),
  (iy = 0),
  (sy = function (t) {
    return null != t && null == t.constructor;
  }),
  (Oy.prototype.setState = function (t, e) {
    var n;
    (n =
      null != this.__s && this.__s != this.state
        ? this.__s
        : (this.__s = Sy({}, this.state))),
      "function" == typeof t && (t = t(Sy({}, n), this.props)),
      t && Sy(n, t),
      null != t && this.__v && (e && this._sb.push(e), Py(this));
  }),
  (Oy.prototype.forceUpdate = function (t) {
    this.__v && ((this.__e = !0), t && this.__h.push(t), Py(this));
  }),
  (Oy.prototype.render = Ay),
  (ay = []),
  (uy =
    "function" == typeof Promise
      ? Promise.prototype.then.bind(Promise.resolve())
      : setTimeout),
  (cy = function (t, e) {
    return t.__v.__b - e.__v.__b;
  }),
  (My.__r = 0),
  (fy = /(PointerCapture)$|Capture$/i),
  (hy = 0),
  (dy = Ly(!1)),
  (py = Ly(!0));
var Qy = function (t) {
  if ("object" !== Zy(t)) return t;
  var e,
    n = Wy(t);
  n.props &&
    ((n.props = (function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = null != arguments[e] ? arguments[e] : {};
        e % 2
          ? Jy(Object(n), !0).forEach(function (e) {
              Yy(t, e, n[e]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
          : Jy(Object(n)).forEach(function (e) {
              Object.defineProperty(
                t,
                e,
                Object.getOwnPropertyDescriptor(n, e)
              );
            });
      }
      return t;
    })({}, n.props)),
    null != n &&
      null !== (e = n.props) &&
      void 0 !== e &&
      e.children &&
      (n.props.children = Array.isArray(n.props.children)
        ? n.props.children.map(Qy)
        : Qy(n.props.children)));
  return n;
};
!(function (t, e) {
  void 0 === e && (e = {});
  var n = e.insertAt;
  if ("undefined" != typeof document) {
    var r = document.head || document.getElementsByTagName("head")[0],
      o = document.createElement("style");
    (o.type = "text/css"),
      "top" === n && r.firstChild
        ? r.insertBefore(o, r.firstChild)
        : r.appendChild(o),
      o.styleSheet
        ? (o.styleSheet.cssText = t)
        : o.appendChild(document.createTextNode(t));
  }
})(
  ".float-tooltip-kap {\n  position: absolute;\n  width: max-content; /* prevent shrinking near right edge */\n  max-width: max(50%, 150px);\n  padding: 3px 5px;\n  border-radius: 3px;\n  font: 12px sans-serif;\n  color: #eee;\n  background: rgba(0,0,0,0.6);\n  pointer-events: none;\n}\n"
);
var tm = hv({
  props: {
    content: { default: !1 },
    offsetX: { triggerUpdate: !1 },
    offsetY: { triggerUpdate: !1 },
  },
  init: function (t, e) {
    var n = (
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
      ).style,
      r = void 0 === n ? {} : n,
      o = td(
        !!t && "object" === Zy(t) && !!t.node && "function" == typeof t.node
          ? t.node()
          : t
      );
    "static" === o.style("position") && o.style("position", "relative"),
      (e.tooltipEl = o.append("div").attr("class", "float-tooltip-kap")),
      Object.entries(r).forEach(function (t) {
        var n = Ky(t, 2),
          r = n[0],
          o = n[1];
        return e.tooltipEl.style(r, o);
      }),
      e.tooltipEl.style("left", "-10000px").style("display", "none");
    var i = "tooltip-".concat(Math.round(1e12 * Math.random()));
    (e.mouseInside = !1),
      o.on("mousemove.".concat(i), function (t) {
        e.mouseInside = !0;
        var n = ed(t),
          r = o.node(),
          i = r.offsetWidth,
          s = r.offsetHeight,
          a = [
            null === e.offsetX || void 0 === e.offsetX
              ? "-".concat((n[0] / i) * 100, "%")
              : "number" == typeof e.offsetX
              ? "calc(-50% + ".concat(e.offsetX, "px)")
              : e.offsetX,
            null === e.offsetY || void 0 === e.offsetY
              ? s > 130 && s - n[1] < 100
                ? "calc(-100% - 6px)"
                : "21px"
              : "number" == typeof e.offsetY
              ? e.offsetY < 0
                ? "calc(-100% - ".concat(Math.abs(e.offsetY), "px)")
                : "".concat(e.offsetY, "px")
              : e.offsetY,
          ];
        e.tooltipEl
          .style("left", n[0] + "px")
          .style("top", n[1] + "px")
          .style("transform", "translate(".concat(a.join(","), ")")),
          e.content && e.tooltipEl.style("display", "inline");
      }),
      o.on("mouseover.".concat(i), function () {
        (e.mouseInside = !0),
          e.content && e.tooltipEl.style("display", "inline");
      }),
      o.on("mouseout.".concat(i), function () {
        (e.mouseInside = !1), e.tooltipEl.style("display", "none");
      });
  },
  update: function (t) {
    var e, n, r;
    t.tooltipEl.style(
      "display",
      t.content && t.mouseInside ? "inline" : "none"
    ),
      t.content
        ? t.content instanceof HTMLElement
          ? (t.tooltipEl.text(""),
            t.tooltipEl.append(function () {
              return t.content;
            }))
          : "string" == typeof t.content
          ? t.tooltipEl.html(t.content)
          : ((r = t.content),
            sy(Wy(r))
              ? (t.tooltipEl.text(""),
                (e = t.content),
                delete (n = t.tooltipEl.node()).__k,
                Gy(Qy(e), n))
              : t.tooltipEl.style("display", "none"))
        : t.tooltipEl.text("");
  },
});
function em(t, e, n) {
  var r,
    o = 1;
  function i() {
    var i,
      s,
      a = r.length,
      l = 0,
      u = 0,
      c = 0;
    for (i = 0; i < a; ++i)
      (l += (s = r[i]).x || 0), (u += s.y || 0), (c += s.z || 0);
    for (
      l = (l / a - t) * o, u = (u / a - e) * o, c = (c / a - n) * o, i = 0;
      i < a;
      ++i
    )
      (s = r[i]), l && (s.x -= l), u && (s.y -= u), c && (s.z -= c);
  }
  return (
    null == t && (t = 0),
    null == e && (e = 0),
    null == n && (n = 0),
    (i.initialize = function (t) {
      r = t;
    }),
    (i.x = function (e) {
      return arguments.length ? ((t = +e), i) : t;
    }),
    (i.y = function (t) {
      return arguments.length ? ((e = +t), i) : e;
    }),
    (i.z = function (t) {
      return arguments.length ? ((n = +t), i) : n;
    }),
    (i.strength = function (t) {
      return arguments.length ? ((o = +t), i) : o;
    }),
    i
  );
}
function nm(t, e, n) {
  if (isNaN(e)) return t;
  var r,
    o,
    i,
    s,
    a,
    l,
    u = t._root,
    c = { data: n },
    f = t._x0,
    h = t._x1;
  if (!u) return (t._root = c), t;
  for (; u.length; )
    if (
      ((s = e >= (o = (f + h) / 2)) ? (f = o) : (h = o),
      (r = u),
      !(u = u[(a = +s)]))
    )
      return (r[a] = c), t;
  if (e === (i = +t._x.call(null, u.data)))
    return (c.next = u), r ? (r[a] = c) : (t._root = c), t;
  do {
    (r = r ? (r[a] = new Array(2)) : (t._root = new Array(2))),
      (s = e >= (o = (f + h) / 2)) ? (f = o) : (h = o);
  } while ((a = +s) === (l = +(i >= o)));
  return (r[l] = u), (r[a] = c), t;
}
function rm(t, e, n) {
  (this.node = t), (this.x0 = e), (this.x1 = n);
}
function om(t) {
  return t[0];
}
function im(t, e) {
  var n = new sm(null == e ? om : e, NaN, NaN);
  return null == t ? n : n.addAll(t);
}
function sm(t, e, n) {
  (this._x = t), (this._x0 = e), (this._x1 = n), (this._root = void 0);
}
function am(t) {
  for (var e = { data: t.data }, n = e; (t = t.next); )
    n = n.next = { data: t.data };
  return e;
}
var lm = (im.prototype = sm.prototype);
function um(t, e, n, r) {
  if (isNaN(e) || isNaN(n)) return t;
  var o,
    i,
    s,
    a,
    l,
    u,
    c,
    f,
    h,
    d = t._root,
    p = { data: r },
    g = t._x0,
    v = t._y0,
    y = t._x1,
    m = t._y1;
  if (!d) return (t._root = p), t;
  for (; d.length; )
    if (
      ((u = e >= (i = (g + y) / 2)) ? (g = i) : (y = i),
      (c = n >= (s = (v + m) / 2)) ? (v = s) : (m = s),
      (o = d),
      !(d = d[(f = (c << 1) | u)]))
    )
      return (o[f] = p), t;
  if (
    ((a = +t._x.call(null, d.data)),
    (l = +t._y.call(null, d.data)),
    e === a && n === l)
  )
    return (p.next = d), o ? (o[f] = p) : (t._root = p), t;
  do {
    (o = o ? (o[f] = new Array(4)) : (t._root = new Array(4))),
      (u = e >= (i = (g + y) / 2)) ? (g = i) : (y = i),
      (c = n >= (s = (v + m) / 2)) ? (v = s) : (m = s);
  } while ((f = (c << 1) | u) == (h = ((l >= s) << 1) | (a >= i)));
  return (o[h] = d), (o[f] = p), t;
}
function cm(t, e, n, r, o) {
  (this.node = t), (this.x0 = e), (this.y0 = n), (this.x1 = r), (this.y1 = o);
}
function fm(t) {
  return t[0];
}
function hm(t) {
  return t[1];
}
function dm(t, e, n) {
  var r = new pm(null == e ? fm : e, null == n ? hm : n, NaN, NaN, NaN, NaN);
  return null == t ? r : r.addAll(t);
}
function pm(t, e, n, r, o, i) {
  (this._x = t),
    (this._y = e),
    (this._x0 = n),
    (this._y0 = r),
    (this._x1 = o),
    (this._y1 = i),
    (this._root = void 0);
}
function gm(t) {
  for (var e = { data: t.data }, n = e; (t = t.next); )
    n = n.next = { data: t.data };
  return e;
}
(lm.copy = function () {
  var t,
    e,
    n = new sm(this._x, this._x0, this._x1),
    r = this._root;
  if (!r) return n;
  if (!r.length) return (n._root = am(r)), n;
  for (t = [{ source: r, target: (n._root = new Array(2)) }]; (r = t.pop()); )
    for (var o = 0; o < 2; ++o)
      (e = r.source[o]) &&
        (e.length
          ? t.push({ source: e, target: (r.target[o] = new Array(2)) })
          : (r.target[o] = am(e)));
  return n;
}),
  (lm.add = function (t) {
    const e = +this._x.call(null, t);
    return nm(this.cover(e), e, t);
  }),
  (lm.addAll = function (t) {
    Array.isArray(t) || (t = Array.from(t));
    const e = t.length,
      n = new Float64Array(e);
    let r = 1 / 0,
      o = -1 / 0;
    for (let i, s = 0; s < e; ++s)
      isNaN((i = +this._x.call(null, t[s]))) ||
        ((n[s] = i), i < r && (r = i), i > o && (o = i));
    if (r > o) return this;
    this.cover(r).cover(o);
    for (let i = 0; i < e; ++i) nm(this, n[i], t[i]);
    return this;
  }),
  (lm.cover = function (t) {
    if (isNaN((t = +t))) return this;
    var e = this._x0,
      n = this._x1;
    if (isNaN(e)) n = (e = Math.floor(t)) + 1;
    else {
      for (var r, o, i = n - e || 1, s = this._root; e > t || t >= n; )
        switch (
          ((o = +(t < e)), ((r = new Array(2))[o] = s), (s = r), (i *= 2), o)
        ) {
          case 0:
            n = e + i;
            break;
          case 1:
            e = n - i;
        }
      this._root && this._root.length && (this._root = s);
    }
    return (this._x0 = e), (this._x1 = n), this;
  }),
  (lm.data = function () {
    var t = [];
    return (
      this.visit(function (e) {
        if (!e.length)
          do {
            t.push(e.data);
          } while ((e = e.next));
      }),
      t
    );
  }),
  (lm.extent = function (t) {
    return arguments.length
      ? this.cover(+t[0][0]).cover(+t[1][0])
      : isNaN(this._x0)
      ? void 0
      : [[this._x0], [this._x1]];
  }),
  (lm.find = function (t, e) {
    var n,
      r,
      o,
      i,
      s,
      a = this._x0,
      l = this._x1,
      u = [],
      c = this._root;
    for (
      c && u.push(new rm(c, a, l)),
        null == e ? (e = 1 / 0) : ((a = t - e), (l = t + e));
      (i = u.pop());

    )
      if (!(!(c = i.node) || (r = i.x0) > l || (o = i.x1) < a))
        if (c.length) {
          var f = (r + o) / 2;
          u.push(new rm(c[1], f, o), new rm(c[0], r, f)),
            (s = +(t >= f)) &&
              ((i = u[u.length - 1]),
              (u[u.length - 1] = u[u.length - 1 - s]),
              (u[u.length - 1 - s] = i));
        } else {
          var h = Math.abs(t - +this._x.call(null, c.data));
          h < e && ((e = h), (a = t - h), (l = t + h), (n = c.data));
        }
    return n;
  }),
  (lm.remove = function (t) {
    if (isNaN((i = +this._x.call(null, t)))) return this;
    var e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c = this._root,
      f = this._x0,
      h = this._x1;
    if (!c) return this;
    if (c.length)
      for (;;) {
        if (
          ((a = i >= (s = (f + h) / 2)) ? (f = s) : (h = s),
          (e = c),
          !(c = c[(l = +a)]))
        )
          return this;
        if (!c.length) break;
        e[(l + 1) & 1] && ((n = e), (u = l));
      }
    for (; c.data !== t; ) if (((r = c), !(c = c.next))) return this;
    return (
      (o = c.next) && delete c.next,
      r
        ? (o ? (r.next = o) : delete r.next, this)
        : e
        ? (o ? (e[l] = o) : delete e[l],
          (c = e[0] || e[1]) &&
            c === (e[1] || e[0]) &&
            !c.length &&
            (n ? (n[u] = c) : (this._root = c)),
          this)
        : ((this._root = o), this)
    );
  }),
  (lm.removeAll = function (t) {
    for (var e = 0, n = t.length; e < n; ++e) this.remove(t[e]);
    return this;
  }),
  (lm.root = function () {
    return this._root;
  }),
  (lm.size = function () {
    var t = 0;
    return (
      this.visit(function (e) {
        if (!e.length)
          do {
            ++t;
          } while ((e = e.next));
      }),
      t
    );
  }),
  (lm.visit = function (t) {
    var e,
      n,
      r,
      o,
      i = [],
      s = this._root;
    for (s && i.push(new rm(s, this._x0, this._x1)); (e = i.pop()); )
      if (!t((s = e.node), (r = e.x0), (o = e.x1)) && s.length) {
        var a = (r + o) / 2;
        (n = s[1]) && i.push(new rm(n, a, o)),
          (n = s[0]) && i.push(new rm(n, r, a));
      }
    return this;
  }),
  (lm.visitAfter = function (t) {
    var e,
      n = [],
      r = [];
    for (
      this._root && n.push(new rm(this._root, this._x0, this._x1));
      (e = n.pop());

    ) {
      var o = e.node;
      if (o.length) {
        var i,
          s = e.x0,
          a = e.x1,
          l = (s + a) / 2;
        (i = o[0]) && n.push(new rm(i, s, l)),
          (i = o[1]) && n.push(new rm(i, l, a));
      }
      r.push(e);
    }
    for (; (e = r.pop()); ) t(e.node, e.x0, e.x1);
    return this;
  }),
  (lm.x = function (t) {
    return arguments.length ? ((this._x = t), this) : this._x;
  });
var vm = (dm.prototype = pm.prototype);
function ym(t, e, n, r, o) {
  if (isNaN(e) || isNaN(n) || isNaN(r)) return t;
  var i,
    s,
    a,
    l,
    u,
    c,
    f,
    h,
    d,
    p,
    g,
    v,
    y = t._root,
    m = { data: o },
    _ = t._x0,
    b = t._y0,
    w = t._z0,
    x = t._x1,
    k = t._y1,
    S = t._z1;
  if (!y) return (t._root = m), t;
  for (; y.length; )
    if (
      ((h = e >= (s = (_ + x) / 2)) ? (_ = s) : (x = s),
      (d = n >= (a = (b + k) / 2)) ? (b = a) : (k = a),
      (p = r >= (l = (w + S) / 2)) ? (w = l) : (S = l),
      (i = y),
      !(y = y[(g = (p << 2) | (d << 1) | h)]))
    )
      return (i[g] = m), t;
  if (
    ((u = +t._x.call(null, y.data)),
    (c = +t._y.call(null, y.data)),
    (f = +t._z.call(null, y.data)),
    e === u && n === c && r === f)
  )
    return (m.next = y), i ? (i[g] = m) : (t._root = m), t;
  do {
    (i = i ? (i[g] = new Array(8)) : (t._root = new Array(8))),
      (h = e >= (s = (_ + x) / 2)) ? (_ = s) : (x = s),
      (d = n >= (a = (b + k) / 2)) ? (b = a) : (k = a),
      (p = r >= (l = (w + S) / 2)) ? (w = l) : (S = l);
  } while (
    (g = (p << 2) | (d << 1) | h) ==
    (v = ((f >= l) << 2) | ((c >= a) << 1) | (u >= s))
  );
  return (i[v] = y), (i[g] = m), t;
}
function mm(t, e, n, r, o, i, s) {
  (this.node = t),
    (this.x0 = e),
    (this.y0 = n),
    (this.z0 = r),
    (this.x1 = o),
    (this.y1 = i),
    (this.z1 = s);
}
(vm.copy = function () {
  var t,
    e,
    n = new pm(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
    r = this._root;
  if (!r) return n;
  if (!r.length) return (n._root = gm(r)), n;
  for (t = [{ source: r, target: (n._root = new Array(4)) }]; (r = t.pop()); )
    for (var o = 0; o < 4; ++o)
      (e = r.source[o]) &&
        (e.length
          ? t.push({ source: e, target: (r.target[o] = new Array(4)) })
          : (r.target[o] = gm(e)));
  return n;
}),
  (vm.add = function (t) {
    const e = +this._x.call(null, t),
      n = +this._y.call(null, t);
    return um(this.cover(e, n), e, n, t);
  }),
  (vm.addAll = function (t) {
    var e,
      n,
      r,
      o,
      i = t.length,
      s = new Array(i),
      a = new Array(i),
      l = 1 / 0,
      u = 1 / 0,
      c = -1 / 0,
      f = -1 / 0;
    for (n = 0; n < i; ++n)
      isNaN((r = +this._x.call(null, (e = t[n])))) ||
        isNaN((o = +this._y.call(null, e))) ||
        ((s[n] = r),
        (a[n] = o),
        r < l && (l = r),
        r > c && (c = r),
        o < u && (u = o),
        o > f && (f = o));
    if (l > c || u > f) return this;
    for (this.cover(l, u).cover(c, f), n = 0; n < i; ++n)
      um(this, s[n], a[n], t[n]);
    return this;
  }),
  (vm.cover = function (t, e) {
    if (isNaN((t = +t)) || isNaN((e = +e))) return this;
    var n = this._x0,
      r = this._y0,
      o = this._x1,
      i = this._y1;
    if (isNaN(n)) (o = (n = Math.floor(t)) + 1), (i = (r = Math.floor(e)) + 1);
    else {
      for (
        var s, a, l = o - n || 1, u = this._root;
        n > t || t >= o || r > e || e >= i;

      )
        switch (
          ((a = ((e < r) << 1) | (t < n)),
          ((s = new Array(4))[a] = u),
          (u = s),
          (l *= 2),
          a)
        ) {
          case 0:
            (o = n + l), (i = r + l);
            break;
          case 1:
            (n = o - l), (i = r + l);
            break;
          case 2:
            (o = n + l), (r = i - l);
            break;
          case 3:
            (n = o - l), (r = i - l);
        }
      this._root && this._root.length && (this._root = u);
    }
    return (this._x0 = n), (this._y0 = r), (this._x1 = o), (this._y1 = i), this;
  }),
  (vm.data = function () {
    var t = [];
    return (
      this.visit(function (e) {
        if (!e.length)
          do {
            t.push(e.data);
          } while ((e = e.next));
      }),
      t
    );
  }),
  (vm.extent = function (t) {
    return arguments.length
      ? this.cover(+t[0][0], +t[0][1]).cover(+t[1][0], +t[1][1])
      : isNaN(this._x0)
      ? void 0
      : [
          [this._x0, this._y0],
          [this._x1, this._y1],
        ];
  }),
  (vm.find = function (t, e, n) {
    var r,
      o,
      i,
      s,
      a,
      l,
      u,
      c = this._x0,
      f = this._y0,
      h = this._x1,
      d = this._y1,
      p = [],
      g = this._root;
    for (
      g && p.push(new cm(g, c, f, h, d)),
        null == n
          ? (n = 1 / 0)
          : ((c = t - n), (f = e - n), (h = t + n), (d = e + n), (n *= n));
      (l = p.pop());

    )
      if (
        !(
          !(g = l.node) ||
          (o = l.x0) > h ||
          (i = l.y0) > d ||
          (s = l.x1) < c ||
          (a = l.y1) < f
        )
      )
        if (g.length) {
          var v = (o + s) / 2,
            y = (i + a) / 2;
          p.push(
            new cm(g[3], v, y, s, a),
            new cm(g[2], o, y, v, a),
            new cm(g[1], v, i, s, y),
            new cm(g[0], o, i, v, y)
          ),
            (u = ((e >= y) << 1) | (t >= v)) &&
              ((l = p[p.length - 1]),
              (p[p.length - 1] = p[p.length - 1 - u]),
              (p[p.length - 1 - u] = l));
        } else {
          var m = t - +this._x.call(null, g.data),
            _ = e - +this._y.call(null, g.data),
            b = m * m + _ * _;
          if (b < n) {
            var w = Math.sqrt((n = b));
            (c = t - w), (f = e - w), (h = t + w), (d = e + w), (r = g.data);
          }
        }
    return r;
  }),
  (vm.remove = function (t) {
    if (
      isNaN((i = +this._x.call(null, t))) ||
      isNaN((s = +this._y.call(null, t)))
    )
      return this;
    var e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      h,
      d = this._root,
      p = this._x0,
      g = this._y0,
      v = this._x1,
      y = this._y1;
    if (!d) return this;
    if (d.length)
      for (;;) {
        if (
          ((u = i >= (a = (p + v) / 2)) ? (p = a) : (v = a),
          (c = s >= (l = (g + y) / 2)) ? (g = l) : (y = l),
          (e = d),
          !(d = d[(f = (c << 1) | u)]))
        )
          return this;
        if (!d.length) break;
        (e[(f + 1) & 3] || e[(f + 2) & 3] || e[(f + 3) & 3]) &&
          ((n = e), (h = f));
      }
    for (; d.data !== t; ) if (((r = d), !(d = d.next))) return this;
    return (
      (o = d.next) && delete d.next,
      r
        ? (o ? (r.next = o) : delete r.next, this)
        : e
        ? (o ? (e[f] = o) : delete e[f],
          (d = e[0] || e[1] || e[2] || e[3]) &&
            d === (e[3] || e[2] || e[1] || e[0]) &&
            !d.length &&
            (n ? (n[h] = d) : (this._root = d)),
          this)
        : ((this._root = o), this)
    );
  }),
  (vm.removeAll = function (t) {
    for (var e = 0, n = t.length; e < n; ++e) this.remove(t[e]);
    return this;
  }),
  (vm.root = function () {
    return this._root;
  }),
  (vm.size = function () {
    var t = 0;
    return (
      this.visit(function (e) {
        if (!e.length)
          do {
            ++t;
          } while ((e = e.next));
      }),
      t
    );
  }),
  (vm.visit = function (t) {
    var e,
      n,
      r,
      o,
      i,
      s,
      a = [],
      l = this._root;
    for (
      l && a.push(new cm(l, this._x0, this._y0, this._x1, this._y1));
      (e = a.pop());

    )
      if (
        !t((l = e.node), (r = e.x0), (o = e.y0), (i = e.x1), (s = e.y1)) &&
        l.length
      ) {
        var u = (r + i) / 2,
          c = (o + s) / 2;
        (n = l[3]) && a.push(new cm(n, u, c, i, s)),
          (n = l[2]) && a.push(new cm(n, r, c, u, s)),
          (n = l[1]) && a.push(new cm(n, u, o, i, c)),
          (n = l[0]) && a.push(new cm(n, r, o, u, c));
      }
    return this;
  }),
  (vm.visitAfter = function (t) {
    var e,
      n = [],
      r = [];
    for (
      this._root &&
      n.push(new cm(this._root, this._x0, this._y0, this._x1, this._y1));
      (e = n.pop());

    ) {
      var o = e.node;
      if (o.length) {
        var i,
          s = e.x0,
          a = e.y0,
          l = e.x1,
          u = e.y1,
          c = (s + l) / 2,
          f = (a + u) / 2;
        (i = o[0]) && n.push(new cm(i, s, a, c, f)),
          (i = o[1]) && n.push(new cm(i, c, a, l, f)),
          (i = o[2]) && n.push(new cm(i, s, f, c, u)),
          (i = o[3]) && n.push(new cm(i, c, f, l, u));
      }
      r.push(e);
    }
    for (; (e = r.pop()); ) t(e.node, e.x0, e.y0, e.x1, e.y1);
    return this;
  }),
  (vm.x = function (t) {
    return arguments.length ? ((this._x = t), this) : this._x;
  }),
  (vm.y = function (t) {
    return arguments.length ? ((this._y = t), this) : this._y;
  });
const _m = (t, e, n, r, o, i) =>
  Math.sqrt((t - r) ** 2 + (e - o) ** 2 + (n - i) ** 2);
function bm(t) {
  return t[0];
}
function wm(t) {
  return t[1];
}
function xm(t) {
  return t[2];
}
function km(t, e, n, r) {
  var o = new Sm(
    null == e ? bm : e,
    null == n ? wm : n,
    null == r ? xm : r,
    NaN,
    NaN,
    NaN,
    NaN,
    NaN,
    NaN
  );
  return null == t ? o : o.addAll(t);
}
function Sm(t, e, n, r, o, i, s, a, l) {
  (this._x = t),
    (this._y = e),
    (this._z = n),
    (this._x0 = r),
    (this._y0 = o),
    (this._z0 = i),
    (this._x1 = s),
    (this._y1 = a),
    (this._z1 = l),
    (this._root = void 0);
}
function Em(t) {
  for (var e = { data: t.data }, n = e; (t = t.next); )
    n = n.next = { data: t.data };
  return e;
}
var Cm = (km.prototype = Sm.prototype);
function Am(t) {
  return function () {
    return t;
  };
}
function Om(t) {
  return 1e-6 * (t() - 0.5);
}
function Tm(t) {
  return t.index;
}
function Nm(t, e) {
  var n = t.get(e);
  if (!n) throw new Error("node not found: " + e);
  return n;
}
function Pm(t) {
  var e,
    n,
    r,
    o,
    i,
    s,
    a,
    l = Tm,
    u = function (t) {
      return 1 / Math.min(i[t.source.index], i[t.target.index]);
    },
    c = Am(30),
    f = 1;
  function h(r) {
    for (var i = 0, l = t.length; i < f; ++i)
      for (var u, c, h, d, p, g = 0, v = 0, y = 0, m = 0; g < l; ++g)
        (c = (u = t[g]).source),
          (v = (h = u.target).x + h.vx - c.x - c.vx || Om(a)),
          o > 1 && (y = h.y + h.vy - c.y - c.vy || Om(a)),
          o > 2 && (m = h.z + h.vz - c.z - c.vz || Om(a)),
          (v *= d =
            (((d = Math.sqrt(v * v + y * y + m * m)) - n[g]) / d) * r * e[g]),
          (y *= d),
          (m *= d),
          (h.vx -= v * (p = s[g])),
          o > 1 && (h.vy -= y * p),
          o > 2 && (h.vz -= m * p),
          (c.vx += v * (p = 1 - p)),
          o > 1 && (c.vy += y * p),
          o > 2 && (c.vz += m * p);
  }
  function d() {
    if (r) {
      var o,
        a,
        u = r.length,
        c = t.length,
        f = new Map(r.map((t, e) => [l(t, e, r), t]));
      for (o = 0, i = new Array(u); o < c; ++o)
        ((a = t[o]).index = o),
          "object" != typeof a.source && (a.source = Nm(f, a.source)),
          "object" != typeof a.target && (a.target = Nm(f, a.target)),
          (i[a.source.index] = (i[a.source.index] || 0) + 1),
          (i[a.target.index] = (i[a.target.index] || 0) + 1);
      for (o = 0, s = new Array(c); o < c; ++o)
        (a = t[o]),
          (s[o] = i[a.source.index] / (i[a.source.index] + i[a.target.index]));
      (e = new Array(c)), p(), (n = new Array(c)), g();
    }
  }
  function p() {
    if (r) for (var n = 0, o = t.length; n < o; ++n) e[n] = +u(t[n], n, t);
  }
  function g() {
    if (r) for (var e = 0, o = t.length; e < o; ++e) n[e] = +c(t[e], e, t);
  }
  return (
    null == t && (t = []),
    (h.initialize = function (t, ...e) {
      (r = t),
        (a = e.find((t) => "function" == typeof t) || Math.random),
        (o = e.find((t) => [1, 2, 3].includes(t)) || 2),
        d();
    }),
    (h.links = function (e) {
      return arguments.length ? ((t = e), d(), h) : t;
    }),
    (h.id = function (t) {
      return arguments.length ? ((l = t), h) : l;
    }),
    (h.iterations = function (t) {
      return arguments.length ? ((f = +t), h) : f;
    }),
    (h.strength = function (t) {
      return arguments.length
        ? ((u = "function" == typeof t ? t : Am(+t)), p(), h)
        : u;
    }),
    (h.distance = function (t) {
      return arguments.length
        ? ((c = "function" == typeof t ? t : Am(+t)), g(), h)
        : c;
    }),
    h
  );
}
(Cm.copy = function () {
  var t,
    e,
    n = new Sm(
      this._x,
      this._y,
      this._z,
      this._x0,
      this._y0,
      this._z0,
      this._x1,
      this._y1,
      this._z1
    ),
    r = this._root;
  if (!r) return n;
  if (!r.length) return (n._root = Em(r)), n;
  for (t = [{ source: r, target: (n._root = new Array(8)) }]; (r = t.pop()); )
    for (var o = 0; o < 8; ++o)
      (e = r.source[o]) &&
        (e.length
          ? t.push({ source: e, target: (r.target[o] = new Array(8)) })
          : (r.target[o] = Em(e)));
  return n;
}),
  (Cm.add = function (t) {
    const e = +this._x.call(null, t),
      n = +this._y.call(null, t),
      r = +this._z.call(null, t);
    return ym(this.cover(e, n, r), e, n, r, t);
  }),
  (Cm.addAll = function (t) {
    Array.isArray(t) || (t = Array.from(t));
    const e = t.length,
      n = new Float64Array(e),
      r = new Float64Array(e),
      o = new Float64Array(e);
    let i = 1 / 0,
      s = 1 / 0,
      a = 1 / 0,
      l = -1 / 0,
      u = -1 / 0,
      c = -1 / 0;
    for (let f, h, d, p, g = 0; g < e; ++g)
      isNaN((h = +this._x.call(null, (f = t[g])))) ||
        isNaN((d = +this._y.call(null, f))) ||
        isNaN((p = +this._z.call(null, f))) ||
        ((n[g] = h),
        (r[g] = d),
        (o[g] = p),
        h < i && (i = h),
        h > l && (l = h),
        d < s && (s = d),
        d > u && (u = d),
        p < a && (a = p),
        p > c && (c = p));
    if (i > l || s > u || a > c) return this;
    this.cover(i, s, a).cover(l, u, c);
    for (let f = 0; f < e; ++f) ym(this, n[f], r[f], o[f], t[f]);
    return this;
  }),
  (Cm.cover = function (t, e, n) {
    if (isNaN((t = +t)) || isNaN((e = +e)) || isNaN((n = +n))) return this;
    var r = this._x0,
      o = this._y0,
      i = this._z0,
      s = this._x1,
      a = this._y1,
      l = this._z1;
    if (isNaN(r))
      (s = (r = Math.floor(t)) + 1),
        (a = (o = Math.floor(e)) + 1),
        (l = (i = Math.floor(n)) + 1);
    else {
      for (
        var u, c, f = s - r || 1, h = this._root;
        r > t || t >= s || o > e || e >= a || i > n || n >= l;

      )
        switch (
          ((c = ((n < i) << 2) | ((e < o) << 1) | (t < r)),
          ((u = new Array(8))[c] = h),
          (h = u),
          (f *= 2),
          c)
        ) {
          case 0:
            (s = r + f), (a = o + f), (l = i + f);
            break;
          case 1:
            (r = s - f), (a = o + f), (l = i + f);
            break;
          case 2:
            (s = r + f), (o = a - f), (l = i + f);
            break;
          case 3:
            (r = s - f), (o = a - f), (l = i + f);
            break;
          case 4:
            (s = r + f), (a = o + f), (i = l - f);
            break;
          case 5:
            (r = s - f), (a = o + f), (i = l - f);
            break;
          case 6:
            (s = r + f), (o = a - f), (i = l - f);
            break;
          case 7:
            (r = s - f), (o = a - f), (i = l - f);
        }
      this._root && this._root.length && (this._root = h);
    }
    return (
      (this._x0 = r),
      (this._y0 = o),
      (this._z0 = i),
      (this._x1 = s),
      (this._y1 = a),
      (this._z1 = l),
      this
    );
  }),
  (Cm.data = function () {
    var t = [];
    return (
      this.visit(function (e) {
        if (!e.length)
          do {
            t.push(e.data);
          } while ((e = e.next));
      }),
      t
    );
  }),
  (Cm.extent = function (t) {
    return arguments.length
      ? this.cover(+t[0][0], +t[0][1], +t[0][2]).cover(
          +t[1][0],
          +t[1][1],
          +t[1][2]
        )
      : isNaN(this._x0)
      ? void 0
      : [
          [this._x0, this._y0, this._z0],
          [this._x1, this._y1, this._z1],
        ];
  }),
  (Cm.find = function (t, e, n, r) {
    var o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      h,
      d = this._x0,
      p = this._y0,
      g = this._z0,
      v = this._x1,
      y = this._y1,
      m = this._z1,
      _ = [],
      b = this._root;
    for (
      b && _.push(new mm(b, d, p, g, v, y, m)),
        null == r
          ? (r = 1 / 0)
          : ((d = t - r),
            (p = e - r),
            (g = n - r),
            (v = t + r),
            (y = e + r),
            (m = n + r),
            (r *= r));
      (f = _.pop());

    )
      if (
        !(
          !(b = f.node) ||
          (i = f.x0) > v ||
          (s = f.y0) > y ||
          (a = f.z0) > m ||
          (l = f.x1) < d ||
          (u = f.y1) < p ||
          (c = f.z1) < g
        )
      )
        if (b.length) {
          var w = (i + l) / 2,
            x = (s + u) / 2,
            k = (a + c) / 2;
          _.push(
            new mm(b[7], w, x, k, l, u, c),
            new mm(b[6], i, x, k, w, u, c),
            new mm(b[5], w, s, k, l, x, c),
            new mm(b[4], i, s, k, w, x, c),
            new mm(b[3], w, x, a, l, u, k),
            new mm(b[2], i, x, a, w, u, k),
            new mm(b[1], w, s, a, l, x, k),
            new mm(b[0], i, s, a, w, x, k)
          ),
            (h = ((n >= k) << 2) | ((e >= x) << 1) | (t >= w)) &&
              ((f = _[_.length - 1]),
              (_[_.length - 1] = _[_.length - 1 - h]),
              (_[_.length - 1 - h] = f));
        } else {
          var S = t - +this._x.call(null, b.data),
            E = e - +this._y.call(null, b.data),
            C = n - +this._z.call(null, b.data),
            A = S * S + E * E + C * C;
          if (A < r) {
            var O = Math.sqrt((r = A));
            (d = t - O),
              (p = e - O),
              (g = n - O),
              (v = t + O),
              (y = e + O),
              (m = n + O),
              (o = b.data);
          }
        }
    return o;
  }),
  (Cm.findAllWithinRadius = function (t, e, n, r) {
    const o = [],
      i = t - r,
      s = e - r,
      a = n - r,
      l = t + r,
      u = e + r,
      c = n + r;
    return (
      this.visit((f, h, d, p, g, v, y) => {
        if (!f.length)
          do {
            const i = f.data;
            _m(t, e, n, this._x(i), this._y(i), this._z(i)) <= r && o.push(i);
          } while ((f = f.next));
        return h > l || d > u || p > c || g < i || v < s || y < a;
      }),
      o
    );
  }),
  (Cm.remove = function (t) {
    if (
      isNaN((i = +this._x.call(null, t))) ||
      isNaN((s = +this._y.call(null, t))) ||
      isNaN((a = +this._z.call(null, t)))
    )
      return this;
    var e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u,
      c,
      f,
      h,
      d,
      p,
      g,
      v = this._root,
      y = this._x0,
      m = this._y0,
      _ = this._z0,
      b = this._x1,
      w = this._y1,
      x = this._z1;
    if (!v) return this;
    if (v.length)
      for (;;) {
        if (
          ((f = i >= (l = (y + b) / 2)) ? (y = l) : (b = l),
          (h = s >= (u = (m + w) / 2)) ? (m = u) : (w = u),
          (d = a >= (c = (_ + x) / 2)) ? (_ = c) : (x = c),
          (e = v),
          !(v = v[(p = (d << 2) | (h << 1) | f)]))
        )
          return this;
        if (!v.length) break;
        (e[(p + 1) & 7] ||
          e[(p + 2) & 7] ||
          e[(p + 3) & 7] ||
          e[(p + 4) & 7] ||
          e[(p + 5) & 7] ||
          e[(p + 6) & 7] ||
          e[(p + 7) & 7]) &&
          ((n = e), (g = p));
      }
    for (; v.data !== t; ) if (((r = v), !(v = v.next))) return this;
    return (
      (o = v.next) && delete v.next,
      r
        ? (o ? (r.next = o) : delete r.next, this)
        : e
        ? (o ? (e[p] = o) : delete e[p],
          (v = e[0] || e[1] || e[2] || e[3] || e[4] || e[5] || e[6] || e[7]) &&
            v ===
              (e[7] || e[6] || e[5] || e[4] || e[3] || e[2] || e[1] || e[0]) &&
            !v.length &&
            (n ? (n[g] = v) : (this._root = v)),
          this)
        : ((this._root = o), this)
    );
  }),
  (Cm.removeAll = function (t) {
    for (var e = 0, n = t.length; e < n; ++e) this.remove(t[e]);
    return this;
  }),
  (Cm.root = function () {
    return this._root;
  }),
  (Cm.size = function () {
    var t = 0;
    return (
      this.visit(function (e) {
        if (!e.length)
          do {
            ++t;
          } while ((e = e.next));
      }),
      t
    );
  }),
  (Cm.visit = function (t) {
    var e,
      n,
      r,
      o,
      i,
      s,
      a,
      l,
      u = [],
      c = this._root;
    for (
      c &&
      u.push(
        new mm(c, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1)
      );
      (e = u.pop());

    )
      if (
        !t(
          (c = e.node),
          (r = e.x0),
          (o = e.y0),
          (i = e.z0),
          (s = e.x1),
          (a = e.y1),
          (l = e.z1)
        ) &&
        c.length
      ) {
        var f = (r + s) / 2,
          h = (o + a) / 2,
          d = (i + l) / 2;
        (n = c[7]) && u.push(new mm(n, f, h, d, s, a, l)),
          (n = c[6]) && u.push(new mm(n, r, h, d, f, a, l)),
          (n = c[5]) && u.push(new mm(n, f, o, d, s, h, l)),
          (n = c[4]) && u.push(new mm(n, r, o, d, f, h, l)),
          (n = c[3]) && u.push(new mm(n, f, h, i, s, a, d)),
          (n = c[2]) && u.push(new mm(n, r, h, i, f, a, d)),
          (n = c[1]) && u.push(new mm(n, f, o, i, s, h, d)),
          (n = c[0]) && u.push(new mm(n, r, o, i, f, h, d));
      }
    return this;
  }),
  (Cm.visitAfter = function (t) {
    var e,
      n = [],
      r = [];
    for (
      this._root &&
      n.push(
        new mm(
          this._root,
          this._x0,
          this._y0,
          this._z0,
          this._x1,
          this._y1,
          this._z1
        )
      );
      (e = n.pop());

    ) {
      var o = e.node;
      if (o.length) {
        var i,
          s = e.x0,
          a = e.y0,
          l = e.z0,
          u = e.x1,
          c = e.y1,
          f = e.z1,
          h = (s + u) / 2,
          d = (a + c) / 2,
          p = (l + f) / 2;
        (i = o[0]) && n.push(new mm(i, s, a, l, h, d, p)),
          (i = o[1]) && n.push(new mm(i, h, a, l, u, d, p)),
          (i = o[2]) && n.push(new mm(i, s, d, l, h, c, p)),
          (i = o[3]) && n.push(new mm(i, h, d, l, u, c, p)),
          (i = o[4]) && n.push(new mm(i, s, a, p, h, d, f)),
          (i = o[5]) && n.push(new mm(i, h, a, p, u, d, f)),
          (i = o[6]) && n.push(new mm(i, s, d, p, h, c, f)),
          (i = o[7]) && n.push(new mm(i, h, d, p, u, c, f));
      }
      r.push(e);
    }
    for (; (e = r.pop()); ) t(e.node, e.x0, e.y0, e.z0, e.x1, e.y1, e.z1);
    return this;
  }),
  (Cm.x = function (t) {
    return arguments.length ? ((this._x = t), this) : this._x;
  }),
  (Cm.y = function (t) {
    return arguments.length ? ((this._y = t), this) : this._y;
  }),
  (Cm.z = function (t) {
    return arguments.length ? ((this._z = t), this) : this._z;
  });
const Mm = 4294967296;
function Rm(t) {
  return t.x;
}
function jm(t) {
  return t.y;
}
function zm(t) {
  return t.z;
}
var Dm = Math.PI * (3 - Math.sqrt(5)),
  Im = (20 * Math.PI) / (9 + Math.sqrt(221));
function Lm(t, e) {
  e = e || 2;
  var n,
    r = Math.min(3, Math.max(1, Math.round(e))),
    o = 1,
    i = 0.001,
    s = 1 - Math.pow(i, 1 / 300),
    a = 0,
    l = 0.6,
    u = new Map(),
    c = Tp(d),
    f = rd("tick", "end"),
    h = (function () {
      let t = 1;
      return () => (t = (1664525 * t + 1013904223) % Mm) / Mm;
    })();
  function d() {
    p(), f.call("tick", n), o < i && (c.stop(), f.call("end", n));
  }
  function p(e) {
    var i,
      c,
      f = t.length;
    void 0 === e && (e = 1);
    for (var h = 0; h < e; ++h)
      for (
        o += (a - o) * s,
          u.forEach(function (t) {
            t(o);
          }),
          i = 0;
        i < f;
        ++i
      )
        null == (c = t[i]).fx ? (c.x += c.vx *= l) : ((c.x = c.fx), (c.vx = 0)),
          r > 1 &&
            (null == c.fy ? (c.y += c.vy *= l) : ((c.y = c.fy), (c.vy = 0))),
          r > 2 &&
            (null == c.fz ? (c.z += c.vz *= l) : ((c.z = c.fz), (c.vz = 0)));
    return n;
  }
  function g() {
    for (var e, n = 0, o = t.length; n < o; ++n) {
      if (
        (((e = t[n]).index = n),
        null != e.fx && (e.x = e.fx),
        null != e.fy && (e.y = e.fy),
        null != e.fz && (e.z = e.fz),
        isNaN(e.x) || (r > 1 && isNaN(e.y)) || (r > 2 && isNaN(e.z)))
      ) {
        var i =
            10 * (r > 2 ? Math.cbrt(0.5 + n) : r > 1 ? Math.sqrt(0.5 + n) : n),
          s = n * Dm,
          a = n * Im;
        1 === r
          ? (e.x = i)
          : 2 === r
          ? ((e.x = i * Math.cos(s)), (e.y = i * Math.sin(s)))
          : ((e.x = i * Math.sin(s) * Math.cos(a)),
            (e.y = i * Math.cos(s)),
            (e.z = i * Math.sin(s) * Math.sin(a)));
      }
      (isNaN(e.vx) || (r > 1 && isNaN(e.vy)) || (r > 2 && isNaN(e.vz))) &&
        ((e.vx = 0), r > 1 && (e.vy = 0), r > 2 && (e.vz = 0));
    }
  }
  function v(e) {
    return e.initialize && e.initialize(t, h, r), e;
  }
  return (
    null == t && (t = []),
    g(),
    (n = {
      tick: p,
      restart: function () {
        return c.restart(d), n;
      },
      stop: function () {
        return c.stop(), n;
      },
      numDimensions: function (t) {
        return arguments.length
          ? ((r = Math.min(3, Math.max(1, Math.round(t)))), u.forEach(v), n)
          : r;
      },
      nodes: function (e) {
        return arguments.length ? ((t = e), g(), u.forEach(v), n) : t;
      },
      alpha: function (t) {
        return arguments.length ? ((o = +t), n) : o;
      },
      alphaMin: function (t) {
        return arguments.length ? ((i = +t), n) : i;
      },
      alphaDecay: function (t) {
        return arguments.length ? ((s = +t), n) : +s;
      },
      alphaTarget: function (t) {
        return arguments.length ? ((a = +t), n) : a;
      },
      velocityDecay: function (t) {
        return arguments.length ? ((l = 1 - t), n) : 1 - l;
      },
      randomSource: function (t) {
        return arguments.length ? ((h = t), u.forEach(v), n) : h;
      },
      force: function (t, e) {
        return arguments.length > 1
          ? (null == e ? u.delete(t) : u.set(t, v(e)), n)
          : u.get(t);
      },
      find: function () {
        var e,
          n,
          o,
          i,
          s,
          a,
          l = Array.prototype.slice.call(arguments),
          u = l.shift() || 0,
          c = (r > 1 ? l.shift() : null) || 0,
          f = (r > 2 ? l.shift() : null) || 0,
          h = l.shift() || 1 / 0,
          d = 0,
          p = t.length;
        for (h *= h, d = 0; d < p; ++d)
          (i =
            (e = u - (s = t[d]).x) * e +
            (n = c - (s.y || 0)) * n +
            (o = f - (s.z || 0)) * o) < h && ((a = s), (h = i));
        return a;
      },
      on: function (t, e) {
        return arguments.length > 1 ? (f.on(t, e), n) : f.on(t);
      },
    })
  );
}
function Um() {
  var t,
    e,
    n,
    r,
    o,
    i,
    s = Am(-30),
    a = 1,
    l = 1 / 0,
    u = 0.81;
  function c(r) {
    var i,
      s = t.length,
      a = (
        1 === e
          ? im(t, Rm)
          : 2 === e
          ? dm(t, Rm, jm)
          : 3 === e
          ? km(t, Rm, jm, zm)
          : null
      ).visitAfter(h);
    for (o = r, i = 0; i < s; ++i) (n = t[i]), a.visit(d);
  }
  function f() {
    if (t) {
      var e,
        n,
        r = t.length;
      for (i = new Array(r), e = 0; e < r; ++e)
        (n = t[e]), (i[n.index] = +s(n, e, t));
    }
  }
  function h(t) {
    var n,
      r,
      o,
      s,
      a,
      l,
      u = 0,
      c = 0,
      f = t.length;
    if (f) {
      for (o = s = a = l = 0; l < f; ++l)
        (n = t[l]) &&
          (r = Math.abs(n.value)) &&
          ((u += n.value),
          (c += r),
          (o += r * (n.x || 0)),
          (s += r * (n.y || 0)),
          (a += r * (n.z || 0)));
      (u *= Math.sqrt(4 / f)),
        (t.x = o / c),
        e > 1 && (t.y = s / c),
        e > 2 && (t.z = a / c);
    } else {
      ((n = t).x = n.data.x),
        e > 1 && (n.y = n.data.y),
        e > 2 && (n.z = n.data.z);
      do {
        u += i[n.data.index];
      } while ((n = n.next));
    }
    t.value = u;
  }
  function d(t, s, c, f, h) {
    if (!t.value) return !0;
    var d = [c, f, h][e - 1],
      p = t.x - n.x,
      g = e > 1 ? t.y - n.y : 0,
      v = e > 2 ? t.z - n.z : 0,
      y = d - s,
      m = p * p + g * g + v * v;
    if ((y * y) / u < m)
      return (
        m < l &&
          (0 === p && (m += (p = Om(r)) * p),
          e > 1 && 0 === g && (m += (g = Om(r)) * g),
          e > 2 && 0 === v && (m += (v = Om(r)) * v),
          m < a && (m = Math.sqrt(a * m)),
          (n.vx += (p * t.value * o) / m),
          e > 1 && (n.vy += (g * t.value * o) / m),
          e > 2 && (n.vz += (v * t.value * o) / m)),
        !0
      );
    if (!(t.length || m >= l)) {
      (t.data !== n || t.next) &&
        (0 === p && (m += (p = Om(r)) * p),
        e > 1 && 0 === g && (m += (g = Om(r)) * g),
        e > 2 && 0 === v && (m += (v = Om(r)) * v),
        m < a && (m = Math.sqrt(a * m)));
      do {
        t.data !== n &&
          ((y = (i[t.data.index] * o) / m),
          (n.vx += p * y),
          e > 1 && (n.vy += g * y),
          e > 2 && (n.vz += v * y));
      } while ((t = t.next));
    }
  }
  return (
    (c.initialize = function (n, ...o) {
      (t = n),
        (r = o.find((t) => "function" == typeof t) || Math.random),
        (e = o.find((t) => [1, 2, 3].includes(t)) || 2),
        f();
    }),
    (c.strength = function (t) {
      return arguments.length
        ? ((s = "function" == typeof t ? t : Am(+t)), f(), c)
        : s;
    }),
    (c.distanceMin = function (t) {
      return arguments.length ? ((a = t * t), c) : Math.sqrt(a);
    }),
    (c.distanceMax = function (t) {
      return arguments.length ? ((l = t * t), c) : Math.sqrt(l);
    }),
    (c.theta = function (t) {
      return arguments.length ? ((u = t * t), c) : Math.sqrt(u);
    }),
    c
  );
}
const {
  abs: Fm,
  cos: Bm,
  sin: $m,
  acos: Vm,
  atan2: qm,
  sqrt: Hm,
  pow: Gm,
} = Math;
function Wm(t) {
  return t < 0 ? -Gm(-t, 1 / 3) : Gm(t, 1 / 3);
}
const Xm = Math.PI,
  Ym = 2 * Xm,
  Jm = Xm / 2,
  Km = Number.MAX_SAFE_INTEGER || 9007199254740991,
  Zm = Number.MIN_SAFE_INTEGER || -9007199254740991,
  Qm = { x: 0, y: 0, z: 0 },
  t_ = {
    Tvalues: [
      -0.06405689286260563, 0.06405689286260563, -0.1911188674736163,
      0.1911188674736163, -0.3150426796961634, 0.3150426796961634,
      -0.4337935076260451, 0.4337935076260451, -0.5454214713888396,
      0.5454214713888396, -0.6480936519369755, 0.6480936519369755,
      -0.7401241915785544, 0.7401241915785544, -0.820001985973903,
      0.820001985973903, -0.8864155270044011, 0.8864155270044011,
      -0.9382745520027328, 0.9382745520027328, -0.9747285559713095,
      0.9747285559713095, -0.9951872199970213, 0.9951872199970213,
    ],
    Cvalues: [
      0.12793819534675216, 0.12793819534675216, 0.1258374563468283,
      0.1258374563468283, 0.12167047292780339, 0.12167047292780339,
      0.1155056680537256, 0.1155056680537256, 0.10744427011596563,
      0.10744427011596563, 0.09761865210411388, 0.09761865210411388,
      0.08619016153195327, 0.08619016153195327, 0.0733464814110803,
      0.0733464814110803, 0.05929858491543678, 0.05929858491543678,
      0.04427743881741981, 0.04427743881741981, 0.028531388628933663,
      0.028531388628933663, 0.0123412297999872, 0.0123412297999872,
    ],
    arcfn: function (t, e) {
      const n = e(t);
      let r = n.x * n.x + n.y * n.y;
      return void 0 !== n.z && (r += n.z * n.z), Hm(r);
    },
    compute: function (t, e, n) {
      if (0 === t) return (e[0].t = 0), e[0];
      const r = e.length - 1;
      if (1 === t) return (e[r].t = 1), e[r];
      const o = 1 - t;
      let i = e;
      if (0 === r) return (e[0].t = t), e[0];
      if (1 === r) {
        const e = {
          x: o * i[0].x + t * i[1].x,
          y: o * i[0].y + t * i[1].y,
          t: t,
        };
        return n && (e.z = o * i[0].z + t * i[1].z), e;
      }
      if (r < 4) {
        let e,
          s,
          a,
          l = o * o,
          u = t * t,
          c = 0;
        2 === r
          ? ((i = [i[0], i[1], i[2], Qm]), (e = l), (s = o * t * 2), (a = u))
          : 3 === r &&
            ((e = l * o), (s = l * t * 3), (a = o * u * 3), (c = t * u));
        const f = {
          x: e * i[0].x + s * i[1].x + a * i[2].x + c * i[3].x,
          y: e * i[0].y + s * i[1].y + a * i[2].y + c * i[3].y,
          t: t,
        };
        return (
          n && (f.z = e * i[0].z + s * i[1].z + a * i[2].z + c * i[3].z), f
        );
      }
      const s = JSON.parse(JSON.stringify(e));
      for (; s.length > 1; ) {
        for (let e = 0; e < s.length - 1; e++)
          (s[e] = {
            x: s[e].x + (s[e + 1].x - s[e].x) * t,
            y: s[e].y + (s[e + 1].y - s[e].y) * t,
          }),
            void 0 !== s[e].z && (s[e].z = s[e].z + (s[e + 1].z - s[e].z) * t);
        s.splice(s.length - 1, 1);
      }
      return (s[0].t = t), s[0];
    },
    computeWithRatios: function (t, e, n, r) {
      const o = 1 - t,
        i = n,
        s = e;
      let a,
        l = i[0],
        u = i[1],
        c = i[2],
        f = i[3];
      return (
        (l *= o),
        (u *= t),
        2 === s.length
          ? ((a = l + u),
            {
              x: (l * s[0].x + u * s[1].x) / a,
              y: (l * s[0].y + u * s[1].y) / a,
              z: !!r && (l * s[0].z + u * s[1].z) / a,
              t: t,
            })
          : ((l *= o),
            (u *= 2 * o),
            (c *= t * t),
            3 === s.length
              ? ((a = l + u + c),
                {
                  x: (l * s[0].x + u * s[1].x + c * s[2].x) / a,
                  y: (l * s[0].y + u * s[1].y + c * s[2].y) / a,
                  z: !!r && (l * s[0].z + u * s[1].z + c * s[2].z) / a,
                  t: t,
                })
              : ((l *= o),
                (u *= 1.5 * o),
                (c *= 3 * o),
                (f *= t * t * t),
                4 === s.length
                  ? ((a = l + u + c + f),
                    {
                      x:
                        (l * s[0].x + u * s[1].x + c * s[2].x + f * s[3].x) / a,
                      y:
                        (l * s[0].y + u * s[1].y + c * s[2].y + f * s[3].y) / a,
                      z:
                        !!r &&
                        (l * s[0].z + u * s[1].z + c * s[2].z + f * s[3].z) / a,
                      t: t,
                    })
                  : void 0))
      );
    },
    derive: function (t, e) {
      const n = [];
      for (let r = t, o = r.length, i = o - 1; o > 1; o--, i--) {
        const t = [];
        for (let n, o = 0; o < i; o++)
          (n = { x: i * (r[o + 1].x - r[o].x), y: i * (r[o + 1].y - r[o].y) }),
            e && (n.z = i * (r[o + 1].z - r[o].z)),
            t.push(n);
        n.push(t), (r = t);
      }
      return n;
    },
    between: function (t, e, n) {
      return (
        (e <= t && t <= n) || t_.approximately(t, e) || t_.approximately(t, n)
      );
    },
    approximately: function (t, e, n) {
      return Fm(t - e) <= (n || 1e-6);
    },
    length: function (t) {
      const e = t_.Tvalues.length;
      let n = 0;
      for (let r, o = 0; o < e; o++)
        (r = 0.5 * t_.Tvalues[o] + 0.5), (n += t_.Cvalues[o] * t_.arcfn(r, t));
      return 0.5 * n;
    },
    map: function (t, e, n, r, o) {
      return r + (o - r) * ((t - e) / (n - e));
    },
    lerp: function (t, e, n) {
      const r = { x: e.x + t * (n.x - e.x), y: e.y + t * (n.y - e.y) };
      return (
        void 0 !== e.z && void 0 !== n.z && (r.z = e.z + t * (n.z - e.z)), r
      );
    },
    pointToString: function (t) {
      let e = t.x + "/" + t.y;
      return void 0 !== t.z && (e += "/" + t.z), e;
    },
    pointsToString: function (t) {
      return "[" + t.map(t_.pointToString).join(", ") + "]";
    },
    copy: function (t) {
      return JSON.parse(JSON.stringify(t));
    },
    angle: function (t, e, n) {
      const r = e.x - t.x,
        o = e.y - t.y,
        i = n.x - t.x,
        s = n.y - t.y;
      return qm(r * s - o * i, r * i + o * s);
    },
    round: function (t, e) {
      const n = "" + t,
        r = n.indexOf(".");
      return parseFloat(n.substring(0, r + 1 + e));
    },
    dist: function (t, e) {
      const n = t.x - e.x,
        r = t.y - e.y;
      return Hm(n * n + r * r);
    },
    closest: function (t, e) {
      let n,
        r,
        o = Gm(2, 63);
      return (
        t.forEach(function (t, i) {
          (r = t_.dist(e, t)), r < o && ((o = r), (n = i));
        }),
        { mdist: o, mpos: n }
      );
    },
    abcratio: function (t, e) {
      if (2 !== e && 3 !== e) return !1;
      if (void 0 === t) t = 0.5;
      else if (0 === t || 1 === t) return t;
      const n = Gm(t, e) + Gm(1 - t, e);
      return Fm((n - 1) / n);
    },
    projectionratio: function (t, e) {
      if (2 !== e && 3 !== e) return !1;
      if (void 0 === t) t = 0.5;
      else if (0 === t || 1 === t) return t;
      const n = Gm(1 - t, e);
      return n / (Gm(t, e) + n);
    },
    lli8: function (t, e, n, r, o, i, s, a) {
      const l = (t - n) * (i - a) - (e - r) * (o - s);
      return (
        0 != l && {
          x: ((t * r - e * n) * (o - s) - (t - n) * (o * a - i * s)) / l,
          y: ((t * r - e * n) * (i - a) - (e - r) * (o * a - i * s)) / l,
        }
      );
    },
    lli4: function (t, e, n, r) {
      const o = t.x,
        i = t.y,
        s = e.x,
        a = e.y,
        l = n.x,
        u = n.y,
        c = r.x,
        f = r.y;
      return t_.lli8(o, i, s, a, l, u, c, f);
    },
    lli: function (t, e) {
      return t_.lli4(t, t.c, e, e.c);
    },
    makeline: function (t, e) {
      return new c_(t.x, t.y, (t.x + e.x) / 2, (t.y + e.y) / 2, e.x, e.y);
    },
    findbbox: function (t) {
      let e = Km,
        n = Km,
        r = Zm,
        o = Zm;
      return (
        t.forEach(function (t) {
          const i = t.bbox();
          e > i.x.min && (e = i.x.min),
            n > i.y.min && (n = i.y.min),
            r < i.x.max && (r = i.x.max),
            o < i.y.max && (o = i.y.max);
        }),
        {
          x: { min: e, mid: (e + r) / 2, max: r, size: r - e },
          y: { min: n, mid: (n + o) / 2, max: o, size: o - n },
        }
      );
    },
    shapeintersections: function (t, e, n, r, o) {
      if (!t_.bboxoverlap(e, r)) return [];
      const i = [],
        s = [t.startcap, t.forward, t.back, t.endcap],
        a = [n.startcap, n.forward, n.back, n.endcap];
      return (
        s.forEach(function (e) {
          e.virtual ||
            a.forEach(function (r) {
              if (r.virtual) return;
              const s = e.intersects(r, o);
              s.length > 0 &&
                ((s.c1 = e), (s.c2 = r), (s.s1 = t), (s.s2 = n), i.push(s));
            });
        }),
        i
      );
    },
    makeshape: function (t, e, n) {
      const r = e.points.length,
        o = t.points.length,
        i = t_.makeline(e.points[r - 1], t.points[0]),
        s = t_.makeline(t.points[o - 1], e.points[0]),
        a = {
          startcap: i,
          forward: t,
          back: e,
          endcap: s,
          bbox: t_.findbbox([i, t, e, s]),
          intersections: function (t) {
            return t_.shapeintersections(a, a.bbox, t, t.bbox, n);
          },
        };
      return a;
    },
    getminmax: function (t, e, n) {
      if (!n) return { min: 0, max: 0 };
      let r,
        o,
        i = Km,
        s = Zm;
      -1 === n.indexOf(0) && (n = [0].concat(n)),
        -1 === n.indexOf(1) && n.push(1);
      for (let a = 0, l = n.length; a < l; a++)
        (r = n[a]),
          (o = t.get(r)),
          o[e] < i && (i = o[e]),
          o[e] > s && (s = o[e]);
      return { min: i, mid: (i + s) / 2, max: s, size: s - i };
    },
    align: function (t, e) {
      const n = e.p1.x,
        r = e.p1.y,
        o = -qm(e.p2.y - r, e.p2.x - n);
      return t.map(function (t) {
        return {
          x: (t.x - n) * Bm(o) - (t.y - r) * $m(o),
          y: (t.x - n) * $m(o) + (t.y - r) * Bm(o),
        };
      });
    },
    roots: function (t, e) {
      e = e || { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } };
      const n = t.length - 1,
        r = t_.align(t, e),
        o = function (t) {
          return 0 <= t && t <= 1;
        };
      if (2 === n) {
        const t = r[0].y,
          e = r[1].y,
          n = r[2].y,
          i = t - 2 * e + n;
        if (0 !== i) {
          const r = -Hm(e * e - t * n),
            s = -t + e;
          return [-(r + s) / i, -(-r + s) / i].filter(o);
        }
        return e !== n && 0 === i
          ? [(2 * e - n) / (2 * e - 2 * n)].filter(o)
          : [];
      }
      const i = r[0].y,
        s = r[1].y,
        a = r[2].y;
      let l = 3 * s - i - 3 * a + r[3].y,
        u = 3 * i - 6 * s + 3 * a,
        c = -3 * i + 3 * s,
        f = i;
      if (t_.approximately(l, 0)) {
        if (t_.approximately(u, 0))
          return t_.approximately(c, 0) ? [] : [-f / c].filter(o);
        const t = Hm(c * c - 4 * u * f),
          e = 2 * u;
        return [(t - c) / e, (-c - t) / e].filter(o);
      }
      (u /= l), (c /= l), (f /= l);
      const h = (3 * c - u * u) / 3,
        d = h / 3,
        p = (2 * u * u * u - 9 * u * c + 27 * f) / 27,
        g = p / 2,
        v = g * g + d * d * d;
      let y, m, _, b, w;
      if (v < 0) {
        const t = -h / 3,
          e = Hm(t * t * t),
          n = -p / (2 * e),
          r = Vm(n < -1 ? -1 : n > 1 ? 1 : n),
          i = 2 * Wm(e);
        return (
          (_ = i * Bm(r / 3) - u / 3),
          (b = i * Bm((r + Ym) / 3) - u / 3),
          (w = i * Bm((r + 2 * Ym) / 3) - u / 3),
          [_, b, w].filter(o)
        );
      }
      if (0 === v)
        return (
          (y = g < 0 ? Wm(-g) : -Wm(g)),
          (_ = 2 * y - u / 3),
          (b = -y - u / 3),
          [_, b].filter(o)
        );
      {
        const t = Hm(v);
        return (y = Wm(-g + t)), (m = Wm(g + t)), [y - m - u / 3].filter(o);
      }
    },
    droots: function (t) {
      if (3 === t.length) {
        const e = t[0],
          n = t[1],
          r = t[2],
          o = e - 2 * n + r;
        if (0 !== o) {
          const t = -Hm(n * n - e * r),
            i = -e + n;
          return [-(t + i) / o, -(-t + i) / o];
        }
        return n !== r && 0 === o ? [(2 * n - r) / (2 * (n - r))] : [];
      }
      if (2 === t.length) {
        const e = t[0],
          n = t[1];
        return e !== n ? [e / (e - n)] : [];
      }
      return [];
    },
    curvature: function (t, e, n, r, o) {
      let i,
        s,
        a,
        l,
        u = 0,
        c = 0;
      const f = t_.compute(t, e),
        h = t_.compute(t, n),
        d = f.x * f.x + f.y * f.y;
      if (
        (r
          ? ((i = Hm(
              Gm(f.y * h.z - h.y * f.z, 2) +
                Gm(f.z * h.x - h.z * f.x, 2) +
                Gm(f.x * h.y - h.x * f.y, 2)
            )),
            (s = Gm(d + f.z * f.z, 1.5)))
          : ((i = f.x * h.y - f.y * h.x), (s = Gm(d, 1.5))),
        0 === i || 0 === s)
      )
        return { k: 0, r: 0 };
      if (((u = i / s), (c = s / i), !o)) {
        const o = t_.curvature(t - 0.001, e, n, r, !0).k,
          i = t_.curvature(t + 0.001, e, n, r, !0).k;
        (l = (i - u + (u - o)) / 2), (a = (Fm(i - u) + Fm(u - o)) / 2);
      }
      return { k: u, r: c, dk: l, adk: a };
    },
    inflections: function (t) {
      if (t.length < 4) return [];
      const e = t_.align(t, { p1: t[0], p2: t.slice(-1)[0] }),
        n = e[2].x * e[1].y,
        r = e[3].x * e[1].y,
        o = e[1].x * e[2].y,
        i = 18 * (-3 * n + 2 * r + 3 * o - e[3].x * e[2].y),
        s = 18 * (3 * n - r - 3 * o),
        a = 18 * (o - n);
      if (t_.approximately(i, 0)) {
        if (!t_.approximately(s, 0)) {
          let t = -a / s;
          if (0 <= t && t <= 1) return [t];
        }
        return [];
      }
      const l = 2 * i;
      if (t_.approximately(l, 0)) return [];
      const u = s * s - 4 * i * a;
      if (u < 0) return [];
      const c = Math.sqrt(u);
      return [(c - s) / l, -(s + c) / l].filter(function (t) {
        return 0 <= t && t <= 1;
      });
    },
    bboxoverlap: function (t, e) {
      const n = ["x", "y"],
        r = n.length;
      for (let o, i, s, a, l = 0; l < r; l++)
        if (
          ((o = n[l]),
          (i = t[o].mid),
          (s = e[o].mid),
          (a = (t[o].size + e[o].size) / 2),
          Fm(i - s) >= a)
        )
          return !1;
      return !0;
    },
    expandbox: function (t, e) {
      e.x.min < t.x.min && (t.x.min = e.x.min),
        e.y.min < t.y.min && (t.y.min = e.y.min),
        e.z && e.z.min < t.z.min && (t.z.min = e.z.min),
        e.x.max > t.x.max && (t.x.max = e.x.max),
        e.y.max > t.y.max && (t.y.max = e.y.max),
        e.z && e.z.max > t.z.max && (t.z.max = e.z.max),
        (t.x.mid = (t.x.min + t.x.max) / 2),
        (t.y.mid = (t.y.min + t.y.max) / 2),
        t.z && (t.z.mid = (t.z.min + t.z.max) / 2),
        (t.x.size = t.x.max - t.x.min),
        (t.y.size = t.y.max - t.y.min),
        t.z && (t.z.size = t.z.max - t.z.min);
    },
    pairiteration: function (t, e, n) {
      const r = t.bbox(),
        o = e.bbox(),
        i = 1e5,
        s = n || 0.5;
      if (r.x.size + r.y.size < s && o.x.size + o.y.size < s)
        return [
          (((i * (t._t1 + t._t2)) / 2) | 0) / i +
            "/" +
            (((i * (e._t1 + e._t2)) / 2) | 0) / i,
        ];
      let a = t.split(0.5),
        l = e.split(0.5),
        u = [
          { left: a.left, right: l.left },
          { left: a.left, right: l.right },
          { left: a.right, right: l.right },
          { left: a.right, right: l.left },
        ];
      u = u.filter(function (t) {
        return t_.bboxoverlap(t.left.bbox(), t.right.bbox());
      });
      let c = [];
      return (
        0 === u.length ||
          (u.forEach(function (t) {
            c = c.concat(t_.pairiteration(t.left, t.right, s));
          }),
          (c = c.filter(function (t, e) {
            return c.indexOf(t) === e;
          }))),
        c
      );
    },
    getccenter: function (t, e, n) {
      const r = e.x - t.x,
        o = e.y - t.y,
        i = n.x - e.x,
        s = n.y - e.y,
        a = r * Bm(Jm) - o * $m(Jm),
        l = r * $m(Jm) + o * Bm(Jm),
        u = i * Bm(Jm) - s * $m(Jm),
        c = i * $m(Jm) + s * Bm(Jm),
        f = (t.x + e.x) / 2,
        h = (t.y + e.y) / 2,
        d = (e.x + n.x) / 2,
        p = (e.y + n.y) / 2,
        g = f + a,
        v = h + l,
        y = d + u,
        m = p + c,
        _ = t_.lli8(f, h, g, v, d, p, y, m),
        b = t_.dist(_, t);
      let w,
        x = qm(t.y - _.y, t.x - _.x),
        k = qm(e.y - _.y, e.x - _.x),
        S = qm(n.y - _.y, n.x - _.x);
      return (
        x < S
          ? ((x > k || k > S) && (x += Ym),
            x > S && ((w = S), (S = x), (x = w)))
          : S < k && k < x
          ? ((w = S), (S = x), (x = w))
          : (S += Ym),
        (_.s = x),
        (_.e = S),
        (_.r = b),
        _
      );
    },
    numberSort: function (t, e) {
      return t - e;
    },
  };
class e_ {
  constructor(t) {
    (this.curves = []),
      (this._3d = !1),
      t && ((this.curves = t), (this._3d = this.curves[0]._3d));
  }
  valueOf() {
    return this.toString();
  }
  toString() {
    return (
      "[" +
      this.curves
        .map(function (t) {
          return t_.pointsToString(t.points);
        })
        .join(", ") +
      "]"
    );
  }
  addCurve(t) {
    this.curves.push(t), (this._3d = this._3d || t._3d);
  }
  length() {
    return this.curves
      .map(function (t) {
        return t.length();
      })
      .reduce(function (t, e) {
        return t + e;
      });
  }
  curve(t) {
    return this.curves[t];
  }
  bbox() {
    const t = this.curves;
    for (var e = t[0].bbox(), n = 1; n < t.length; n++)
      t_.expandbox(e, t[n].bbox());
    return e;
  }
  offset(t) {
    const e = [];
    return (
      this.curves.forEach(function (n) {
        e.push(...n.offset(t));
      }),
      new e_(e)
    );
  }
}
const {
    abs: n_,
    min: r_,
    max: o_,
    cos: i_,
    sin: s_,
    acos: a_,
    sqrt: l_,
  } = Math,
  u_ = Math.PI;
class c_ {
  constructor(t) {
    let e = t && t.forEach ? t : Array.from(arguments).slice(),
      n = !1;
    if ("object" == typeof e[0]) {
      n = e.length;
      const t = [];
      e.forEach(function (e) {
        ["x", "y", "z"].forEach(function (n) {
          void 0 !== e[n] && t.push(e[n]);
        });
      }),
        (e = t);
    }
    let r = !1;
    const o = e.length;
    if (n) {
      if (n > 4) {
        if (1 !== arguments.length)
          throw new Error(
            "Only new Bezier(point[]) is accepted for 4th and higher order curves"
          );
        r = !0;
      }
    } else if (
      6 !== o &&
      8 !== o &&
      9 !== o &&
      12 !== o &&
      1 !== arguments.length
    )
      throw new Error(
        "Only new Bezier(point[]) is accepted for 4th and higher order curves"
      );
    const i = (this._3d =
        (!r && (9 === o || 12 === o)) || (t && t[0] && void 0 !== t[0].z)),
      s = (this.points = []);
    for (let h = 0, d = i ? 3 : 2; h < o; h += d) {
      var a = { x: e[h], y: e[h + 1] };
      i && (a.z = e[h + 2]), s.push(a);
    }
    const l = (this.order = s.length - 1),
      u = (this.dims = ["x", "y"]);
    i && u.push("z"), (this.dimlen = u.length);
    const c = t_.align(s, { p1: s[0], p2: s[l] }),
      f = t_.dist(s[0], s[l]);
    (this._linear = c.reduce((t, e) => t + n_(e.y), 0) < f / 50),
      (this._lut = []),
      (this._t1 = 0),
      (this._t2 = 1),
      this.update();
  }
  static quadraticFromPoints(t, e, n, r) {
    if ((void 0 === r && (r = 0.5), 0 === r)) return new c_(e, e, n);
    if (1 === r) return new c_(t, e, e);
    const o = c_.getABC(2, t, e, n, r);
    return new c_(t, o.A, n);
  }
  static cubicFromPoints(t, e, n, r, o) {
    void 0 === r && (r = 0.5);
    const i = c_.getABC(3, t, e, n, r);
    void 0 === o && (o = t_.dist(e, i.C));
    const s = (o * (1 - r)) / r,
      a = t_.dist(t, n),
      l = (n.x - t.x) / a,
      u = (n.y - t.y) / a,
      c = o * l,
      f = o * u,
      h = s * l,
      d = s * u,
      p = e.x - c,
      g = e.y - f,
      v = e.x + h,
      y = e.y + d,
      m = i.A,
      _ = m.x + (p - m.x) / (1 - r),
      b = m.y + (g - m.y) / (1 - r),
      w = m.x + (v - m.x) / r,
      x = m.y + (y - m.y) / r,
      k = { x: t.x + (_ - t.x) / r, y: t.y + (b - t.y) / r },
      S = { x: n.x + (w - n.x) / (1 - r), y: n.y + (x - n.y) / (1 - r) };
    return new c_(t, k, S, n);
  }
  static getUtils() {
    return t_;
  }
  getUtils() {
    return c_.getUtils();
  }
  static get PolyBezier() {
    return e_;
  }
  valueOf() {
    return this.toString();
  }
  toString() {
    return t_.pointsToString(this.points);
  }
  toSVG() {
    if (this._3d) return !1;
    const t = this.points,
      e = ["M", t[0].x, t[0].y, 2 === this.order ? "Q" : "C"];
    for (let n = 1, r = t.length; n < r; n++) e.push(t[n].x), e.push(t[n].y);
    return e.join(" ");
  }
  setRatios(t) {
    if (t.length !== this.points.length)
      throw new Error("incorrect number of ratio values");
    (this.ratios = t), (this._lut = []);
  }
  verify() {
    const t = this.coordDigest();
    t !== this._print && ((this._print = t), this.update());
  }
  coordDigest() {
    return this.points
      .map(function (t, e) {
        return "" + e + t.x + t.y + (t.z ? t.z : 0);
      })
      .join("");
  }
  update() {
    (this._lut = []),
      (this.dpoints = t_.derive(this.points, this._3d)),
      this.computedirection();
  }
  computedirection() {
    const t = this.points,
      e = t_.angle(t[0], t[this.order], t[1]);
    this.clockwise = e > 0;
  }
  length() {
    return t_.length(this.derivative.bind(this));
  }
  static getABC(t = 2, e, n, r, o = 0.5) {
    const i = t_.projectionratio(o, t),
      s = 1 - i,
      a = { x: i * e.x + s * r.x, y: i * e.y + s * r.y },
      l = t_.abcratio(o, t);
    return {
      A: { x: n.x + (n.x - a.x) / l, y: n.y + (n.y - a.y) / l },
      B: n,
      C: a,
      S: e,
      E: r,
    };
  }
  getABC(t, e) {
    e = e || this.get(t);
    let n = this.points[0],
      r = this.points[this.order];
    return c_.getABC(this.order, n, e, r, t);
  }
  getLUT(t) {
    if ((this.verify(), (t = t || 100), this._lut.length === t + 1))
      return this._lut;
    (this._lut = []), t++, (this._lut = []);
    for (let e, n, r = 0; r < t; r++)
      (n = r / (t - 1)), (e = this.compute(n)), (e.t = n), this._lut.push(e);
    return this._lut;
  }
  on(e, n) {
    n = n || 5;
    const r = this.getLUT(),
      o = [];
    for (let t, i = 0, s = 0; i < r.length; i++)
      (t = r[i]), t_.dist(t, e) < n && (o.push(t), (s += i / r.length));
    return !!o.length && (t /= o.length);
  }
  project(t) {
    const e = this.getLUT(),
      n = e.length - 1,
      r = t_.closest(e, t),
      o = r.mpos,
      i = (o - 1) / n,
      s = (o + 1) / n,
      a = 0.1 / n;
    let l,
      u = r.mdist,
      c = i,
      f = c;
    u += 1;
    for (let h; c < s + a; c += a)
      (l = this.compute(c)), (h = t_.dist(t, l)), h < u && ((u = h), (f = c));
    return (
      (f = f < 0 ? 0 : f > 1 ? 1 : f),
      (l = this.compute(f)),
      (l.t = f),
      (l.d = u),
      l
    );
  }
  get(t) {
    return this.compute(t);
  }
  point(t) {
    return this.points[t];
  }
  compute(t) {
    return this.ratios
      ? t_.computeWithRatios(t, this.points, this.ratios, this._3d)
      : t_.compute(t, this.points, this._3d, this.ratios);
  }
  raise() {
    const t = this.points,
      e = [t[0]],
      n = t.length;
    for (let r, o, i = 1; i < n; i++)
      (r = t[i]),
        (o = t[i - 1]),
        (e[i] = {
          x: ((n - i) / n) * r.x + (i / n) * o.x,
          y: ((n - i) / n) * r.y + (i / n) * o.y,
        });
    return (e[n] = t[n - 1]), new c_(e);
  }
  derivative(t) {
    return t_.compute(t, this.dpoints[0], this._3d);
  }
  dderivative(t) {
    return t_.compute(t, this.dpoints[1], this._3d);
  }
  align() {
    let t = this.points;
    return new c_(t_.align(t, { p1: t[0], p2: t[t.length - 1] }));
  }
  curvature(t) {
    return t_.curvature(t, this.dpoints[0], this.dpoints[1], this._3d);
  }
  inflections() {
    return t_.inflections(this.points);
  }
  normal(t) {
    return this._3d ? this.__normal3(t) : this.__normal2(t);
  }
  __normal2(t) {
    const e = this.derivative(t),
      n = l_(e.x * e.x + e.y * e.y);
    return { t: t, x: -e.y / n, y: e.x / n };
  }
  __normal3(t) {
    const e = this.derivative(t),
      n = this.derivative(t + 0.01),
      r = l_(e.x * e.x + e.y * e.y + e.z * e.z),
      o = l_(n.x * n.x + n.y * n.y + n.z * n.z);
    (e.x /= r), (e.y /= r), (e.z /= r), (n.x /= o), (n.y /= o), (n.z /= o);
    const i = {
        x: n.y * e.z - n.z * e.y,
        y: n.z * e.x - n.x * e.z,
        z: n.x * e.y - n.y * e.x,
      },
      s = l_(i.x * i.x + i.y * i.y + i.z * i.z);
    (i.x /= s), (i.y /= s), (i.z /= s);
    const a = [
      i.x * i.x,
      i.x * i.y - i.z,
      i.x * i.z + i.y,
      i.x * i.y + i.z,
      i.y * i.y,
      i.y * i.z - i.x,
      i.x * i.z - i.y,
      i.y * i.z + i.x,
      i.z * i.z,
    ];
    return {
      t: t,
      x: a[0] * e.x + a[1] * e.y + a[2] * e.z,
      y: a[3] * e.x + a[4] * e.y + a[5] * e.z,
      z: a[6] * e.x + a[7] * e.y + a[8] * e.z,
    };
  }
  hull(t) {
    let e = this.points,
      n = [],
      r = [],
      o = 0;
    for (
      r[o++] = e[0],
        r[o++] = e[1],
        r[o++] = e[2],
        3 === this.order && (r[o++] = e[3]);
      e.length > 1;

    ) {
      n = [];
      for (let i, s = 0, a = e.length - 1; s < a; s++)
        (i = t_.lerp(t, e[s], e[s + 1])), (r[o++] = i), n.push(i);
      e = n;
    }
    return r;
  }
  split(t, e) {
    if (0 === t && e) return this.split(e).left;
    if (1 === e) return this.split(t).right;
    const n = this.hull(t),
      r = {
        left:
          2 === this.order
            ? new c_([n[0], n[3], n[5]])
            : new c_([n[0], n[4], n[7], n[9]]),
        right:
          2 === this.order
            ? new c_([n[5], n[4], n[2]])
            : new c_([n[9], n[8], n[6], n[3]]),
        span: n,
      };
    return (
      (r.left._t1 = t_.map(0, 0, 1, this._t1, this._t2)),
      (r.left._t2 = t_.map(t, 0, 1, this._t1, this._t2)),
      (r.right._t1 = t_.map(t, 0, 1, this._t1, this._t2)),
      (r.right._t2 = t_.map(1, 0, 1, this._t1, this._t2)),
      e ? ((e = t_.map(e, t, 1, 0, 1)), r.right.split(e).left) : r
    );
  }
  extrema() {
    const t = {};
    let e = [];
    return (
      this.dims.forEach(
        function (n) {
          let r = function (t) {
              return t[n];
            },
            o = this.dpoints[0].map(r);
          (t[n] = t_.droots(o)),
            3 === this.order &&
              ((o = this.dpoints[1].map(r)),
              (t[n] = t[n].concat(t_.droots(o)))),
            (t[n] = t[n].filter(function (t) {
              return t >= 0 && t <= 1;
            })),
            (e = e.concat(t[n].sort(t_.numberSort)));
        }.bind(this)
      ),
      (t.values = e.sort(t_.numberSort).filter(function (t, n) {
        return e.indexOf(t) === n;
      })),
      t
    );
  }
  bbox() {
    const t = this.extrema(),
      e = {};
    return (
      this.dims.forEach(
        function (n) {
          e[n] = t_.getminmax(this, n, t[n]);
        }.bind(this)
      ),
      e
    );
  }
  overlaps(t) {
    const e = this.bbox(),
      n = t.bbox();
    return t_.bboxoverlap(e, n);
  }
  offset(t, e) {
    if (void 0 !== e) {
      const n = this.get(t),
        r = this.normal(t),
        o = { c: n, n: r, x: n.x + r.x * e, y: n.y + r.y * e };
      return this._3d && (o.z = n.z + r.z * e), o;
    }
    if (this._linear) {
      const e = this.normal(0),
        n = this.points.map(function (n) {
          const r = { x: n.x + t * e.x, y: n.y + t * e.y };
          return n.z && e.z && (r.z = n.z + t * e.z), r;
        });
      return [new c_(n)];
    }
    return this.reduce().map(function (e) {
      return e._linear ? e.offset(t)[0] : e.scale(t);
    });
  }
  simple() {
    if (3 === this.order) {
      const t = t_.angle(this.points[0], this.points[3], this.points[1]),
        e = t_.angle(this.points[0], this.points[3], this.points[2]);
      if ((t > 0 && e < 0) || (t < 0 && e > 0)) return !1;
    }
    const t = this.normal(0),
      e = this.normal(1);
    let n = t.x * e.x + t.y * e.y;
    return this._3d && (n += t.z * e.z), n_(a_(n)) < u_ / 3;
  }
  reduce() {
    let t,
      e,
      n = 0,
      r = 0,
      o = 0.01,
      i = [],
      s = [],
      a = this.extrema().values;
    for (
      -1 === a.indexOf(0) && (a = [0].concat(a)),
        -1 === a.indexOf(1) && a.push(1),
        n = a[0],
        t = 1;
      t < a.length;
      t++
    )
      (r = a[t]),
        (e = this.split(n, r)),
        (e._t1 = n),
        (e._t2 = r),
        i.push(e),
        (n = r);
    return (
      i.forEach(function (t) {
        for (n = 0, r = 0; r <= 1; )
          for (r = n + o; r <= 1.01; r += o)
            if (((e = t.split(n, r)), !e.simple())) {
              if (((r -= o), n_(n - r) < o)) return [];
              (e = t.split(n, r)),
                (e._t1 = t_.map(n, 0, 1, t._t1, t._t2)),
                (e._t2 = t_.map(r, 0, 1, t._t1, t._t2)),
                s.push(e),
                (n = r);
              break;
            }
        n < 1 &&
          ((e = t.split(n, 1)),
          (e._t1 = t_.map(n, 0, 1, t._t1, t._t2)),
          (e._t2 = t._t2),
          s.push(e));
      }),
      s
    );
  }
  translate(t, e, n) {
    n = "number" == typeof n ? n : e;
    const r = this.order;
    let o = this.points.map((t, o) => (1 - o / r) * e + (o / r) * n);
    return new c_(
      this.points.map((e, n) => ({ x: e.x + t.x * o[n], y: e.y + t.y * o[n] }))
    );
  }
  scale(t) {
    const e = this.order;
    let n = !1;
    if (("function" == typeof t && (n = t), n && 2 === e))
      return this.raise().scale(n);
    const r = this.clockwise,
      o = this.points;
    if (this._linear)
      return this.translate(this.normal(0), n ? n(0) : t, n ? n(1) : t);
    const i = n ? n(0) : t,
      s = n ? n(1) : t,
      a = [this.offset(0, 10), this.offset(1, 10)],
      l = [],
      u = t_.lli4(a[0], a[0].c, a[1], a[1].c);
    if (!u) throw new Error("cannot scale this curve. Try reducing it first.");
    return (
      [0, 1].forEach(function (t) {
        const n = (l[t * e] = t_.copy(o[t * e]));
        (n.x += (t ? s : i) * a[t].n.x), (n.y += (t ? s : i) * a[t].n.y);
      }),
      n
        ? ([0, 1].forEach(function (i) {
            if (2 !== e || !i) {
              var s = o[i + 1],
                a = { x: s.x - u.x, y: s.y - u.y },
                c = n ? n((i + 1) / e) : t;
              n && !r && (c = -c);
              var f = l_(a.x * a.x + a.y * a.y);
              (a.x /= f),
                (a.y /= f),
                (l[i + 1] = { x: s.x + c * a.x, y: s.y + c * a.y });
            }
          }),
          new c_(l))
        : ([0, 1].forEach((t) => {
            if (2 === e && t) return;
            const n = l[t * e],
              r = this.derivative(t),
              i = { x: n.x + r.x, y: n.y + r.y };
            l[t + 1] = t_.lli4(n, i, u, o[t + 1]);
          }),
          new c_(l))
    );
  }
  outline(t, e, n, r) {
    if (((e = void 0 === e ? t : e), this._linear)) {
      const o = this.normal(0),
        i = this.points[0],
        s = this.points[this.points.length - 1];
      let a, l, u;
      void 0 === n && ((n = t), (r = e)),
        (a = { x: i.x + o.x * t, y: i.y + o.y * t }),
        (u = { x: s.x + o.x * n, y: s.y + o.y * n }),
        (l = { x: (a.x + u.x) / 2, y: (a.y + u.y) / 2 });
      const c = [a, l, u];
      (a = { x: i.x - o.x * e, y: i.y - o.y * e }),
        (u = { x: s.x - o.x * r, y: s.y - o.y * r }),
        (l = { x: (a.x + u.x) / 2, y: (a.y + u.y) / 2 });
      const f = [u, l, a],
        h = t_.makeline(f[2], c[0]),
        d = t_.makeline(c[2], f[0]),
        p = [h, new c_(c), d, new c_(f)];
      return new e_(p);
    }
    const o = this.reduce(),
      i = o.length,
      s = [];
    let a,
      l = [],
      u = 0,
      c = this.length();
    const f = void 0 !== n && void 0 !== r;
    function h(t, e, n, r, o) {
      return function (i) {
        const s = r / n,
          a = (r + o) / n,
          l = e - t;
        return t_.map(i, 0, 1, t + s * l, t + a * l);
      };
    }
    o.forEach(function (o) {
      const i = o.length();
      f
        ? (s.push(o.scale(h(t, n, c, u, i))),
          l.push(o.scale(h(-e, -r, c, u, i))))
        : (s.push(o.scale(t)), l.push(o.scale(-e))),
        (u += i);
    }),
      (l = l
        .map(function (t) {
          return (
            (a = t.points),
            a[3]
              ? (t.points = [a[3], a[2], a[1], a[0]])
              : (t.points = [a[2], a[1], a[0]]),
            t
          );
        })
        .reverse());
    const d = s[0].points[0],
      p = s[i - 1].points[s[i - 1].points.length - 1],
      g = l[i - 1].points[l[i - 1].points.length - 1],
      v = l[0].points[0],
      y = t_.makeline(g, d),
      m = t_.makeline(p, v),
      _ = [y].concat(s).concat([m]).concat(l);
    return new e_(_);
  }
  outlineshapes(t, e, n) {
    e = e || t;
    const r = this.outline(t, e).curves,
      o = [];
    for (let i = 1, s = r.length; i < s / 2; i++) {
      const t = t_.makeshape(r[i], r[s - i], n);
      (t.startcap.virtual = i > 1),
        (t.endcap.virtual = i < s / 2 - 1),
        o.push(t);
    }
    return o;
  }
  intersects(t, e) {
    return t
      ? t.p1 && t.p2
        ? this.lineIntersects(t)
        : (t instanceof c_ && (t = t.reduce()),
          this.curveintersects(this.reduce(), t, e))
      : this.selfintersects(e);
  }
  lineIntersects(t) {
    const e = r_(t.p1.x, t.p2.x),
      n = r_(t.p1.y, t.p2.y),
      r = o_(t.p1.x, t.p2.x),
      o = o_(t.p1.y, t.p2.y);
    return t_.roots(this.points, t).filter((t) => {
      var i = this.get(t);
      return t_.between(i.x, e, r) && t_.between(i.y, n, o);
    });
  }
  selfintersects(t) {
    const e = this.reduce(),
      n = e.length - 2,
      r = [];
    for (let o, i, s, a = 0; a < n; a++)
      (i = e.slice(a, a + 1)),
        (s = e.slice(a + 2)),
        (o = this.curveintersects(i, s, t)),
        r.push(...o);
    return r;
  }
  curveintersects(t, e, n) {
    const r = [];
    t.forEach(function (t) {
      e.forEach(function (e) {
        t.overlaps(e) && r.push({ left: t, right: e });
      });
    });
    let o = [];
    return (
      r.forEach(function (t) {
        const e = t_.pairiteration(t.left, t.right, n);
        e.length > 0 && (o = o.concat(e));
      }),
      o
    );
  }
  arcs(t) {
    return (t = t || 0.5), this._iterate(t, []);
  }
  _error(t, e, n, r) {
    const o = (r - n) / 4,
      i = this.get(n + o),
      s = this.get(r - o),
      a = t_.dist(t, e),
      l = t_.dist(t, i),
      u = t_.dist(t, s);
    return n_(l - a) + n_(u - a);
  }
  _iterate(t, e) {
    let n,
      r = 0,
      o = 1;
    do {
      (n = 0), (o = 1);
      let i,
        s,
        a,
        l,
        u,
        c = this.get(r),
        f = !1,
        h = !1,
        d = o,
        p = 1;
      do {
        if (
          ((h = f),
          (l = a),
          (d = (r + o) / 2),
          (i = this.get(d)),
          (s = this.get(o)),
          (a = t_.getccenter(c, i, s)),
          (a.interval = { start: r, end: o }),
          (f = this._error(a, c, r, o) <= t),
          (u = h && !f),
          u || (p = o),
          f)
        ) {
          if (o >= 1) {
            if (((a.interval.end = p = 1), (l = a), o > 1)) {
              let t = { x: a.x + a.r * i_(a.e), y: a.y + a.r * s_(a.e) };
              a.e += t_.angle({ x: a.x, y: a.y }, t, this.get(1));
            }
            break;
          }
          o += (o - r) / 2;
        } else o = d;
      } while (!u && n++ < 100);
      if (n >= 100) break;
      (l = l || a), e.push(l), (r = p);
    } while (o < 1);
    return e;
  }
}
function f_(t, e) {
  (null == e || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function h_(t, e) {
  return (
    (function (t) {
      if (Array.isArray(t)) return t;
    })(t) ||
    (function (t, e) {
      var n =
        null == t
          ? null
          : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
            t["@@iterator"];
      if (null != n) {
        var r,
          o,
          i,
          s,
          a = [],
          l = !0,
          u = !1;
        try {
          if (((i = (n = n.call(t)).next), 0 === e));
          else
            for (
              ;
              !(l = (r = i.call(n)).done) && (a.push(r.value), a.length !== e);
              l = !0
            );
        } catch (c) {
          (u = !0), (o = c);
        } finally {
          try {
            if (!l && null != n.return && ((s = n.return()), Object(s) !== s))
              return;
          } finally {
            if (u) throw o;
          }
        }
        return a;
      }
    })(t, e) ||
    g_(t, e) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
function d_(t) {
  return (
    (function (t) {
      if (Array.isArray(t)) return f_(t);
    })(t) ||
    (function (t) {
      if (
        ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
        null != t["@@iterator"]
      )
        return Array.from(t);
    })(t) ||
    g_(t) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
function p_(t) {
  var e = (function (t, e) {
    if ("object" != typeof t || !t) return t;
    var n = t[Symbol.toPrimitive];
    if (void 0 !== n) {
      var r = n.call(t, e);
      if ("object" != typeof r) return r;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(t);
  })(t, "string");
  return "symbol" == typeof e ? e : e + "";
}
function g_(t, e) {
  if (t) {
    if ("string" == typeof t) return f_(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return (
      "Object" === n && t.constructor && (n = t.constructor.name),
      "Map" === n || "Set" === n
        ? Array.from(t)
        : "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        ? f_(t, e)
        : void 0
    );
  }
}
var v_ = function () {
  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
    n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
    r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
    o = (e instanceof Array ? (e.length ? e : [void 0]) : [e]).map(function (
      t
    ) {
      return { keyAccessor: t, isProp: !(t instanceof Function) };
    }),
    i = t.reduce(function (t, e) {
      var r = t,
        i = e;
      return (
        o.forEach(function (t, e) {
          var s,
            a = t.keyAccessor;
          if (t.isProp) {
            var l = i,
              u = l[a],
              c = (function (t, e) {
                if (null == t) return {};
                var n,
                  r,
                  o = (function (t, e) {
                    if (null == t) return {};
                    var n = {};
                    for (var r in t)
                      if ({}.hasOwnProperty.call(t, r)) {
                        if (e.includes(r)) continue;
                        n[r] = t[r];
                      }
                    return n;
                  })(t, e);
                if (Object.getOwnPropertySymbols) {
                  var i = Object.getOwnPropertySymbols(t);
                  for (r = 0; r < i.length; r++)
                    (n = i[r]),
                      e.includes(n) ||
                        ({}.propertyIsEnumerable.call(t, n) && (o[n] = t[n]));
                }
                return o;
              })(l, [a].map(p_));
            (s = u), (i = c);
          } else s = a(i, e);
          e + 1 < o.length
            ? (r.hasOwnProperty(s) || (r[s] = {}), (r = r[s]))
            : n
            ? (r.hasOwnProperty(s) || (r[s] = []), r[s].push(i))
            : (r[s] = i);
        }),
        t
      );
    }, {});
  n instanceof Function &&
    (function t(e) {
      var r =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
      r === o.length
        ? Object.keys(e).forEach(function (t) {
            return (e[t] = n(e[t]));
          })
        : Object.values(e).forEach(function (e) {
            return t(e, r + 1);
          });
    })(i);
  var s = i;
  return (
    r &&
      ((s = []),
      (function t(e) {
        var n =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
        n.length === o.length
          ? s.push({ keys: n, vals: e })
          : Object.entries(e).forEach(function (e) {
              var r = h_(e, 2),
                o = r[0],
                i = r[1];
              return t(i, [].concat(d_(n), [o]));
            });
      })(i),
      e instanceof Array &&
        0 === e.length &&
        1 === s.length &&
        (s[0].keys = [])),
    s
  );
};
function y_(t, e) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(t);
      break;
    default:
      this.range(e).domain(t);
  }
  return this;
}
const m_ = Symbol("implicit");
const __ = (function (t) {
  for (var e = (t.length / 6) | 0, n = new Array(e), r = 0; r < e; )
    n[r] = "#" + t.slice(6 * r, 6 * ++r);
  return n;
})("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");
function b_(t, e) {
  (null == e || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function w_(t, e, n) {
  if (k_()) return Reflect.construct.apply(null, arguments);
  var r = [null];
  return r.push.apply(r, e), new (t.bind.apply(t, r))();
}
function x_(t, e, n) {
  return (
    (e = (function (t) {
      var e = (function (t, e) {
        if ("object" != typeof t || !t) return t;
        var n = t[Symbol.toPrimitive];
        if (void 0 !== n) {
          var r = n.call(t, e);
          if ("object" != typeof r) return r;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      })(t, "string");
      return "symbol" == typeof e ? e : e + "";
    })(e)) in t
      ? Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (t[e] = n),
    t
  );
}
function k_() {
  try {
    var t = !Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    );
  } catch (e) {}
  return (k_ = function () {
    return !!t;
  })();
}
function S_(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e &&
      (r = r.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })),
      n.push.apply(n, r);
  }
  return n;
}
function E_(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = null != arguments[e] ? arguments[e] : {};
    e % 2
      ? S_(Object(n), !0).forEach(function (e) {
          x_(t, e, n[e]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
      : S_(Object(n)).forEach(function (e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
        });
  }
  return t;
}
function C_(t, e) {
  return (
    (function (t) {
      if (Array.isArray(t)) return t;
    })(t) ||
    (function (t, e) {
      var n =
        null == t
          ? null
          : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
            t["@@iterator"];
      if (null != n) {
        var r,
          o,
          i,
          s,
          a = [],
          l = !0,
          u = !1;
        try {
          if (((i = (n = n.call(t)).next), 0 === e));
          else
            for (
              ;
              !(l = (r = i.call(n)).done) && (a.push(r.value), a.length !== e);
              l = !0
            );
        } catch (c) {
          (u = !0), (o = c);
        } finally {
          try {
            if (!l && null != n.return && ((s = n.return()), Object(s) !== s))
              return;
          } finally {
            if (u) throw o;
          }
        }
        return a;
      }
    })(t, e) ||
    T_(t, e) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
function A_(t) {
  return (
    (function (t) {
      if (Array.isArray(t)) return b_(t);
    })(t) ||
    (function (t) {
      if (
        ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
        null != t["@@iterator"]
      )
        return Array.from(t);
    })(t) ||
    T_(t) ||
    (function () {
      throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    })()
  );
}
function O_(t) {
  return (O_ =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (t) {
          return typeof t;
        }
      : function (t) {
          return t &&
            "function" == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
            ? "symbol"
            : typeof t;
        })(t);
}
function T_(t, e) {
  if (t) {
    if ("string" == typeof t) return b_(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return (
      "Object" === n && t.constructor && (n = t.constructor.name),
      "Map" === n || "Set" === n
        ? Array.from(t)
        : "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        ? b_(t, e)
        : void 0
    );
  }
}
!(function (t, e) {
  void 0 === e && (e = {});
  var n = e.insertAt;
  if ("undefined" != typeof document) {
    var r = document.head || document.getElementsByTagName("head")[0],
      o = document.createElement("style");
    (o.type = "text/css"),
      "top" === n && r.firstChild
        ? r.insertBefore(o, r.firstChild)
        : r.appendChild(o),
      o.styleSheet
        ? (o.styleSheet.cssText = t)
        : o.appendChild(document.createTextNode(t));
  }
})(
  ".force-graph-container canvas {\n  display: block;\n  user-select: none;\n  outline: none;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.force-graph-container .clickable {\n  cursor: pointer;\n}\n\n.force-graph-container .grabbable {\n  cursor: move;\n  cursor: grab;\n  cursor: -moz-grab;\n  cursor: -webkit-grab;\n}\n\n.force-graph-container .grabbable:active {\n  cursor: grabbing;\n  cursor: -moz-grabbing;\n  cursor: -webkit-grabbing;\n}\n"
);
var N_ = (function t() {
  var e = new Eg(),
    n = [],
    r = [],
    o = m_;
  function i(t) {
    let i = e.get(t);
    if (void 0 === i) {
      if (o !== m_) return o;
      e.set(t, (i = n.push(t) - 1));
    }
    return r[i % r.length];
  }
  return (
    (i.domain = function (t) {
      if (!arguments.length) return n.slice();
      (n = []), (e = new Eg());
      for (const r of t) e.has(r) || e.set(r, n.push(r) - 1);
      return i;
    }),
    (i.range = function (t) {
      return arguments.length ? ((r = Array.from(t)), i) : r.slice();
    }),
    (i.unknown = function (t) {
      return arguments.length ? ((o = t), i) : o;
    }),
    (i.copy = function () {
      return t(n, r).unknown(o);
    }),
    y_.apply(i, arguments),
    i
  );
})(__);
function P_(t, e, n) {
  e &&
    "string" == typeof n &&
    t
      .filter(function (t) {
        return !t[n];
      })
      .forEach(function (t) {
        t[n] = N_(e(t));
      });
}
var M_ = function (t, e) {
    return e.onNeedsRedraw && e.onNeedsRedraw();
  },
  R_ = function (t, e) {
    if (!e.isShadow) {
      var n = dv(e.linkDirectionalParticles);
      e.graphData.links.forEach(function (t) {
        var e = Math.round(Math.abs(n(t)));
        e
          ? (t.__photons = A_(Array(e)).map(function () {
              return {};
            }))
          : delete t.__photons;
      });
    }
  },
  j_ = hv({
    props: {
      graphData: {
        default: { nodes: [], links: [] },
        onChange: function (t, e) {
          (e.engineRunning = !1), R_(0, e);
        },
      },
      dagMode: {
        onChange: function (t, e) {
          !t &&
            (e.graphData.nodes || []).forEach(function (t) {
              return (t.fx = t.fy = void 0);
            });
        },
      },
      dagLevelDistance: {},
      dagNodeFilter: {
        default: function (t) {
          return !0;
        },
      },
      onDagError: { triggerUpdate: !1 },
      nodeRelSize: { default: 4, triggerUpdate: !1, onChange: M_ },
      nodeId: { default: "id" },
      nodeVal: { default: "val", triggerUpdate: !1, onChange: M_ },
      nodeColor: { default: "color", triggerUpdate: !1, onChange: M_ },
      nodeAutoColorBy: {},
      nodeCanvasObject: { triggerUpdate: !1, onChange: M_ },
      nodeCanvasObjectMode: {
        default: function () {
          return "replace";
        },
        triggerUpdate: !1,
        onChange: M_,
      },
      nodeVisibility: { default: !0, triggerUpdate: !1, onChange: M_ },
      linkSource: { default: "source" },
      linkTarget: { default: "target" },
      linkVisibility: { default: !0, triggerUpdate: !1, onChange: M_ },
      linkColor: { default: "color", triggerUpdate: !1, onChange: M_ },
      linkAutoColorBy: {},
      linkLineDash: { triggerUpdate: !1, onChange: M_ },
      linkWidth: { default: 1, triggerUpdate: !1, onChange: M_ },
      linkCurvature: { default: 0, triggerUpdate: !1, onChange: M_ },
      linkCanvasObject: { triggerUpdate: !1, onChange: M_ },
      linkCanvasObjectMode: {
        default: function () {
          return "replace";
        },
        triggerUpdate: !1,
        onChange: M_,
      },
      linkDirectionalArrowLength: {
        default: 0,
        triggerUpdate: !1,
        onChange: M_,
      },
      linkDirectionalArrowColor: { triggerUpdate: !1, onChange: M_ },
      linkDirectionalArrowRelPos: {
        default: 0.5,
        triggerUpdate: !1,
        onChange: M_,
      },
      linkDirectionalParticles: { default: 0, triggerUpdate: !1, onChange: R_ },
      linkDirectionalParticleSpeed: { default: 0.01, triggerUpdate: !1 },
      linkDirectionalParticleOffset: { default: 0, triggerUpdate: !1 },
      linkDirectionalParticleWidth: { default: 4, triggerUpdate: !1 },
      linkDirectionalParticleColor: { triggerUpdate: !1 },
      linkDirectionalParticleCanvasObject: { triggerUpdate: !1 },
      globalScale: { default: 1, triggerUpdate: !1 },
      d3AlphaMin: { default: 0, triggerUpdate: !1 },
      d3AlphaDecay: {
        default: 0.0228,
        triggerUpdate: !1,
        onChange: function (t, e) {
          e.forceLayout.alphaDecay(t);
        },
      },
      d3AlphaTarget: {
        default: 0,
        triggerUpdate: !1,
        onChange: function (t, e) {
          e.forceLayout.alphaTarget(t);
        },
      },
      d3VelocityDecay: {
        default: 0.4,
        triggerUpdate: !1,
        onChange: function (t, e) {
          e.forceLayout.velocityDecay(t);
        },
      },
      warmupTicks: { default: 0, triggerUpdate: !1 },
      cooldownTicks: { default: 1 / 0, triggerUpdate: !1 },
      cooldownTime: { default: 15e3, triggerUpdate: !1 },
      onUpdate: { default: function () {}, triggerUpdate: !1 },
      onFinishUpdate: { default: function () {}, triggerUpdate: !1 },
      onEngineTick: { default: function () {}, triggerUpdate: !1 },
      onEngineStop: { default: function () {}, triggerUpdate: !1 },
      onNeedsRedraw: { triggerUpdate: !1 },
      isShadow: { default: !1, triggerUpdate: !1 },
    },
    methods: {
      d3Force: function (t, e, n) {
        return void 0 === n
          ? t.forceLayout.force(e)
          : (t.forceLayout.force(e, n), this);
      },
      d3ReheatSimulation: function (t) {
        return t.forceLayout.alpha(1), this.resetCountdown(), this;
      },
      resetCountdown: function (t) {
        return (
          (t.cntTicks = 0),
          (t.startTickTime = new Date()),
          (t.engineRunning = !0),
          this
        );
      },
      isEngineRunning: function (t) {
        return !!t.engineRunning;
      },
      tickFrame: function (t) {
        var e, n, r, o, i, s;
        return (
          !t.isShadow &&
            t.engineRunning &&
            (++t.cntTicks > t.cooldownTicks ||
            new Date() - t.startTickTime > t.cooldownTime ||
            (t.d3AlphaMin > 0 && t.forceLayout.alpha() < t.d3AlphaMin)
              ? ((t.engineRunning = !1), t.onEngineStop())
              : (t.forceLayout.tick(), t.onEngineTick())),
          (function () {
            var e = dv(t.linkVisibility),
              n = dv(t.linkColor),
              r = dv(t.linkWidth),
              o = dv(t.linkLineDash),
              i = dv(t.linkCurvature),
              s = dv(t.linkCanvasObjectMode),
              a = t.ctx,
              l = 2 * t.isShadow,
              u = t.graphData.links.filter(e);
            u.forEach(function (t) {
              var e = i(t);
              if (!e) return void (t.__controlPoints = null);
              var n = t.source,
                r = t.target;
              if (!(n && r && n.hasOwnProperty("x") && r.hasOwnProperty("x")))
                return;
              var o = Math.sqrt(
                Math.pow(r.x - n.x, 2) + Math.pow(r.y - n.y, 2)
              );
              if (o > 0) {
                var s = Math.atan2(r.y - n.y, r.x - n.x),
                  a = o * e,
                  l = {
                    x: (n.x + r.x) / 2 + a * Math.cos(s - Math.PI / 2),
                    y: (n.y + r.y) / 2 + a * Math.sin(s - Math.PI / 2),
                  };
                t.__controlPoints = [l.x, l.y];
              } else {
                var u = 70 * e;
                t.__controlPoints = [r.x, r.y - u, r.x + u, r.y];
              }
            });
            var c = [],
              f = [],
              h = u;
            if (t.linkCanvasObject) {
              var d = [],
                p = [];
              u.forEach(function (t) {
                return ({ before: c, after: f, replace: d }[s(t)] || p).push(t);
              }),
                (h = [].concat(A_(c), f, p)),
                (c = c.concat(d));
            }
            a.save(),
              c.forEach(function (e) {
                return t.linkCanvasObject(e, a, t.globalScale);
              }),
              a.restore();
            var g = v_(h, [n, r, o]);
            a.save(),
              Object.entries(g).forEach(function (e) {
                var n = C_(e, 2),
                  r = n[0],
                  i = n[1],
                  s = r && "undefined" !== r ? r : "rgba(0,0,0,0.15)";
                Object.entries(i).forEach(function (e) {
                  var n = C_(e, 2),
                    r = n[0],
                    i = n[1],
                    u = (r || 1) / t.globalScale + l;
                  Object.entries(i).forEach(function (t) {
                    var e = C_(t, 2);
                    e[0];
                    var n = e[1],
                      r = o(n[0]);
                    a.beginPath(),
                      n.forEach(function (t) {
                        var e = t.source,
                          n = t.target;
                        if (
                          e &&
                          n &&
                          e.hasOwnProperty("x") &&
                          n.hasOwnProperty("x")
                        ) {
                          a.moveTo(e.x, e.y);
                          var r = t.__controlPoints;
                          r
                            ? a[
                                2 === r.length
                                  ? "quadraticCurveTo"
                                  : "bezierCurveTo"
                              ].apply(a, A_(r).concat([n.x, n.y]))
                            : a.lineTo(n.x, n.y);
                        }
                      }),
                      (a.strokeStyle = s),
                      (a.lineWidth = u),
                      a.setLineDash(r || []),
                      a.stroke();
                  });
                });
              }),
              a.restore(),
              a.save(),
              f.forEach(function (e) {
                return t.linkCanvasObject(e, a, t.globalScale);
              }),
              a.restore();
          })(),
          !t.isShadow &&
            ((e = dv(t.linkDirectionalArrowLength)),
            (n = dv(t.linkDirectionalArrowRelPos)),
            (r = dv(t.linkVisibility)),
            (o = dv(t.linkDirectionalArrowColor || t.linkColor)),
            (i = dv(t.nodeVal)),
            (s = t.ctx).save(),
            t.graphData.links.filter(r).forEach(function (r) {
              var a = e(r);
              if (a && !(a < 0)) {
                var l = r.source,
                  u = r.target;
                if (l && u && l.hasOwnProperty("x") && u.hasOwnProperty("x")) {
                  var c = Math.sqrt(Math.max(0, i(l) || 1)) * t.nodeRelSize,
                    f = Math.sqrt(Math.max(0, i(u) || 1)) * t.nodeRelSize,
                    h = Math.min(1, Math.max(0, n(r))),
                    d = o(r) || "rgba(0,0,0,0.28)",
                    p = a / 1.6 / 2,
                    g =
                      r.__controlPoints &&
                      w_(
                        c_,
                        [l.x, l.y].concat(A_(r.__controlPoints), [u.x, u.y])
                      ),
                    v = g
                      ? function (t) {
                          return g.get(t);
                        }
                      : function (t) {
                          return {
                            x: l.x + (u.x - l.x) * t || 0,
                            y: l.y + (u.y - l.y) * t || 0,
                          };
                        },
                    y = g
                      ? g.length()
                      : Math.sqrt(
                          Math.pow(u.x - l.x, 2) + Math.pow(u.y - l.y, 2)
                        ),
                    m = c + a + (y - c - f - a) * h,
                    _ = v(m / y),
                    b = v((m - a) / y),
                    w = v((m - 0.8 * a) / y),
                    x = Math.atan2(_.y - b.y, _.x - b.x) - Math.PI / 2;
                  s.beginPath(),
                    s.moveTo(_.x, _.y),
                    s.lineTo(b.x + p * Math.cos(x), b.y + p * Math.sin(x)),
                    s.lineTo(w.x, w.y),
                    s.lineTo(b.x - p * Math.cos(x), b.y - p * Math.sin(x)),
                    (s.fillStyle = d),
                    s.fill();
                }
              }
            }),
            s.restore()),
          !t.isShadow &&
            (function () {
              var e = dv(t.linkDirectionalParticles),
                n = dv(t.linkDirectionalParticleSpeed),
                r = dv(t.linkDirectionalParticleOffset),
                o = dv(t.linkDirectionalParticleWidth),
                i = dv(t.linkVisibility),
                s = dv(t.linkDirectionalParticleColor || t.linkColor),
                a = t.ctx;
              a.save(),
                t.graphData.links.filter(i).forEach(function (i) {
                  var l = e(i);
                  if (i.hasOwnProperty("__photons") && i.__photons.length) {
                    var u = i.source,
                      c = i.target;
                    if (
                      u &&
                      c &&
                      u.hasOwnProperty("x") &&
                      c.hasOwnProperty("x")
                    ) {
                      var f = n(i),
                        h = Math.abs(r(i)),
                        d = i.__photons || [],
                        p = Math.max(0, o(i) / 2) / Math.sqrt(t.globalScale),
                        g = s(i) || "rgba(0,0,0,0.28)";
                      a.fillStyle = g;
                      var v = i.__controlPoints
                          ? w_(
                              c_,
                              [u.x, u.y].concat(A_(i.__controlPoints), [
                                c.x,
                                c.y,
                              ])
                            )
                          : null,
                        y = 0,
                        m = !1;
                      d.forEach(function (e) {
                        var n = !!e.__singleHop;
                        if (
                          (e.hasOwnProperty("__progressRatio") ||
                            (e.__progressRatio = n ? 0 : (y + h) / l),
                          !n && y++,
                          (e.__progressRatio += f),
                          e.__progressRatio >= 1)
                        ) {
                          if (n) return void (m = !0);
                          e.__progressRatio = e.__progressRatio % 1;
                        }
                        var r = e.__progressRatio,
                          o = v
                            ? v.get(r)
                            : {
                                x: u.x + (c.x - u.x) * r || 0,
                                y: u.y + (c.y - u.y) * r || 0,
                              };
                        t.linkDirectionalParticleCanvasObject
                          ? t.linkDirectionalParticleCanvasObject(
                              o.x,
                              o.y,
                              i,
                              a,
                              t.globalScale
                            )
                          : (a.beginPath(),
                            a.arc(o.x, o.y, p, 0, 2 * Math.PI, !1),
                            a.fill());
                      }),
                        m &&
                          (i.__photons = i.__photons.filter(function (t) {
                            return !t.__singleHop || t.__progressRatio <= 1;
                          }));
                    }
                  }
                }),
                a.restore();
            })(),
          (function () {
            var e = dv(t.nodeVisibility),
              n = dv(t.nodeVal),
              r = dv(t.nodeColor),
              o = dv(t.nodeCanvasObjectMode),
              i = t.ctx,
              s = t.isShadow / t.globalScale,
              a = t.graphData.nodes.filter(e);
            i.save(),
              a.forEach(function (e) {
                var a = o(e);
                if (
                  !t.nodeCanvasObject ||
                  ("before" !== a && "replace" !== a) ||
                  (t.nodeCanvasObject(e, i, t.globalScale), "replace" !== a)
                ) {
                  var l = Math.sqrt(Math.max(0, n(e) || 1)) * t.nodeRelSize + s;
                  i.beginPath(),
                    i.arc(e.x, e.y, l, 0, 2 * Math.PI, !1),
                    (i.fillStyle = r(e) || "rgba(31, 120, 180, 0.92)"),
                    i.fill(),
                    t.nodeCanvasObject &&
                      "after" === a &&
                      t.nodeCanvasObject(e, t.ctx, t.globalScale);
                } else i.restore();
              }),
              i.restore();
          })(),
          this
        );
      },
      emitParticle: function (t, e) {
        return (
          e &&
            (!e.__photons && (e.__photons = []),
            e.__photons.push({ __singleHop: !0 })),
          this
        );
      },
    },
    stateInit: function () {
      return {
        forceLayout: Lm()
          .force("link", Pm())
          .force("charge", Um())
          .force("center", em())
          .force("dagRadial", null)
          .stop(),
        engineRunning: !1,
      };
    },
    init: function (t, e) {
      e.ctx = t;
    },
    update: function (t, e) {
      (t.engineRunning = !1),
        t.onUpdate(),
        null !== t.nodeAutoColorBy &&
          P_(t.graphData.nodes, dv(t.nodeAutoColorBy), t.nodeColor),
        null !== t.linkAutoColorBy &&
          P_(t.graphData.links, dv(t.linkAutoColorBy), t.linkColor),
        t.graphData.links.forEach(function (e) {
          (e.source = e[t.linkSource]), (e.target = e[t.linkTarget]);
        }),
        t.forceLayout.stop().alpha(1).nodes(t.graphData.nodes);
      var n = t.forceLayout.force("link");
      n &&
        n
          .id(function (e) {
            return e[t.nodeId];
          })
          .links(t.graphData.links);
      var r =
          t.dagMode &&
          (function (t, e) {
            var n = t.nodes,
              r = t.links,
              o =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {},
              i = o.nodeFilter,
              s =
                void 0 === i
                  ? function () {
                      return !0;
                    }
                  : i,
              a = o.onLoopError,
              l =
                void 0 === a
                  ? function (t) {
                      throw "Invalid DAG structure! Found cycle in node path: ".concat(
                        t.join(" -> "),
                        "."
                      );
                    }
                  : a,
              u = {};
            n.forEach(function (t) {
              return (u[e(t)] = { data: t, out: [], depth: -1, skip: !s(t) });
            }),
              r.forEach(function (t) {
                var n = t.source,
                  r = t.target,
                  o = l(n),
                  i = l(r);
                if (!u.hasOwnProperty(o))
                  throw "Missing source node with id: ".concat(o);
                if (!u.hasOwnProperty(i))
                  throw "Missing target node with id: ".concat(i);
                var s = u[o],
                  a = u[i];
                function l(t) {
                  return "object" === O_(t) ? e(t) : t;
                }
                s.out.push(a);
              });
            var c = [];
            return (
              (function t(n) {
                for (
                  var r =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : [],
                    o =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : 0,
                    i = function () {
                      var i = n[s];
                      if (-1 !== r.indexOf(i)) {
                        var a = []
                          .concat(A_(r.slice(r.indexOf(i))), [i])
                          .map(function (t) {
                            return e(t.data);
                          });
                        return (
                          c.some(function (t) {
                            return (
                              t.length === a.length &&
                              t.every(function (t, e) {
                                return t === a[e];
                              })
                            );
                          }) || (c.push(a), l(a)),
                          1
                        );
                      }
                      o > i.depth &&
                        ((i.depth = o),
                        t(i.out, [].concat(A_(r), [i]), o + (i.skip ? 0 : 1)));
                    },
                    s = 0,
                    a = n.length;
                  s < a;
                  s++
                )
                  i();
              })(Object.values(u)),
              Object.assign.apply(
                Object,
                [{}].concat(
                  A_(
                    Object.entries(u)
                      .filter(function (t) {
                        return !C_(t, 2)[1].skip;
                      })
                      .map(function (t) {
                        var e = C_(t, 2);
                        return x_({}, e[0], e[1].depth);
                      })
                  )
                )
              )
            );
          })(
            t.graphData,
            function (e) {
              return e[t.nodeId];
            },
            { nodeFilter: t.dagNodeFilter, onLoopError: t.onDagError || void 0 }
          ),
        o = Math.max.apply(Math, A_(Object.values(r || []))),
        i =
          t.dagLevelDistance ||
          (t.graphData.nodes.length / (o || 1)) *
            2 *
            (-1 !== ["radialin", "radialout"].indexOf(t.dagMode) ? 0.7 : 1);
      if (["lr", "rl", "td", "bu"].includes(e.dagMode)) {
        var s = ["lr", "rl"].includes(e.dagMode) ? "fx" : "fy";
        t.graphData.nodes.filter(t.dagNodeFilter).forEach(function (t) {
          return delete t[s];
        });
      }
      if (["lr", "rl", "td", "bu"].includes(t.dagMode)) {
        var a = ["rl", "bu"].includes(t.dagMode),
          l = ["lr", "rl"].includes(t.dagMode) ? "fx" : "fy";
        t.graphData.nodes.filter(t.dagNodeFilter).forEach(function (e) {
          return (e[l] = (function (e) {
            return (r[e[t.nodeId]] - o / 2) * i * (a ? -1 : 1);
          })(e));
        });
      }
      t.forceLayout.force(
        "dagRadial",
        -1 !== ["radialin", "radialout"].indexOf(t.dagMode)
          ? (function (t, e, n, r) {
              var o,
                i,
                s,
                a,
                l = Am(0.1);
              function u(t) {
                for (var l = 0, u = o.length; l < u; ++l) {
                  var c = o[l],
                    f = c.x - e || 1e-6,
                    h = (c.y || 0) - n || 1e-6,
                    d = (c.z || 0) - r || 1e-6,
                    p = Math.sqrt(f * f + h * h + d * d),
                    g = ((a[l] - p) * s[l] * t) / p;
                  (c.vx += f * g),
                    i > 1 && (c.vy += h * g),
                    i > 2 && (c.vz += d * g);
                }
              }
              function c() {
                if (o) {
                  var e,
                    n = o.length;
                  for (s = new Array(n), a = new Array(n), e = 0; e < n; ++e)
                    (a[e] = +t(o[e], e, o)),
                      (s[e] = isNaN(a[e]) ? 0 : +l(o[e], e, o));
                }
              }
              return (
                "function" != typeof t && (t = Am(+t)),
                null == e && (e = 0),
                null == n && (n = 0),
                null == r && (r = 0),
                (u.initialize = function (t, ...e) {
                  (o = t), (i = e.find((t) => [1, 2, 3].includes(t)) || 2), c();
                }),
                (u.strength = function (t) {
                  return arguments.length
                    ? ((l = "function" == typeof t ? t : Am(+t)), c(), u)
                    : l;
                }),
                (u.radius = function (e) {
                  return arguments.length
                    ? ((t = "function" == typeof e ? e : Am(+e)), c(), u)
                    : t;
                }),
                (u.x = function (t) {
                  return arguments.length ? ((e = +t), u) : e;
                }),
                (u.y = function (t) {
                  return arguments.length ? ((n = +t), u) : n;
                }),
                (u.z = function (t) {
                  return arguments.length ? ((r = +t), u) : r;
                }),
                u
              );
            })(function (e) {
              var n = r[e[t.nodeId]] || -1;
              return ("radialin" === t.dagMode ? o - n : n) * i;
            }).strength(function (e) {
              return t.dagNodeFilter(e) ? 1 : 0;
            })
          : null
      );
      for (
        var u = 0;
        u < t.warmupTicks &&
        !(t.d3AlphaMin > 0 && t.forceLayout.alpha() < t.d3AlphaMin);
        u++
      )
        t.forceLayout.tick();
      this.resetCountdown(), t.onFinishUpdate();
    },
  });
function z_(t, e) {
  var n = t instanceof Array ? t : [t],
    r = new e();
  return (
    r._destructor && r._destructor(),
    {
      linkProp: function (t) {
        return {
          default: r[t](),
          onChange: function (e, r) {
            n.forEach(function (n) {
              return r[n][t](e);
            });
          },
          triggerUpdate: !1,
        };
      },
      linkMethod: function (t) {
        return function (e) {
          for (
            var r = arguments.length, o = new Array(r > 1 ? r - 1 : 0), i = 1;
            i < r;
            i++
          )
            o[i - 1] = arguments[i];
          var s = [];
          return (
            n.forEach(function (n) {
              var r = e[n],
                i = r[t].apply(r, o);
              i !== r && s.push(i);
            }),
            s.length ? s[0] : this
          );
        };
      },
    }
  );
}
var D_ = z_("forceGraph", j_),
  I_ = z_(["forceGraph", "shadowGraph"], j_),
  L_ = Object.assign.apply(
    Object,
    A_(
      [
        "nodeColor",
        "nodeAutoColorBy",
        "nodeCanvasObject",
        "nodeCanvasObjectMode",
        "linkColor",
        "linkAutoColorBy",
        "linkLineDash",
        "linkWidth",
        "linkCanvasObject",
        "linkCanvasObjectMode",
        "linkDirectionalArrowLength",
        "linkDirectionalArrowColor",
        "linkDirectionalArrowRelPos",
        "linkDirectionalParticles",
        "linkDirectionalParticleSpeed",
        "linkDirectionalParticleOffset",
        "linkDirectionalParticleWidth",
        "linkDirectionalParticleColor",
        "linkDirectionalParticleCanvasObject",
        "dagMode",
        "dagLevelDistance",
        "dagNodeFilter",
        "onDagError",
        "d3AlphaMin",
        "d3AlphaDecay",
        "d3VelocityDecay",
        "warmupTicks",
        "cooldownTicks",
        "cooldownTime",
        "onEngineTick",
        "onEngineStop",
      ].map(function (t) {
        return x_({}, t, D_.linkProp(t));
      })
    ).concat(
      A_(
        [
          "nodeRelSize",
          "nodeId",
          "nodeVal",
          "nodeVisibility",
          "linkSource",
          "linkTarget",
          "linkVisibility",
          "linkCurvature",
        ].map(function (t) {
          return x_({}, t, I_.linkProp(t));
        })
      )
    )
  ),
  U_ = Object.assign.apply(
    Object,
    A_(
      ["d3Force", "d3ReheatSimulation", "emitParticle"].map(function (t) {
        return x_({}, t, D_.linkMethod(t));
      })
    )
  );
function F_(t) {
  if (t.canvas) {
    var e = t.canvas.width,
      n = t.canvas.height;
    300 === e && 150 === n && (e = n = 0);
    var r = window.devicePixelRatio;
    (e /= r),
      (n /= r),
      [t.canvas, t.shadowCanvas].forEach(function (o) {
        (o.style.width = "".concat(t.width, "px")),
          (o.style.height = "".concat(t.height, "px")),
          (o.width = t.width * r),
          (o.height = t.height * r),
          e || n || o.getContext("2d").scale(r, r);
      });
    var o = gg(t.canvas).k;
    t.zoom.translateBy(
      t.zoom.__baseElem,
      (t.width - e) / 2 / o,
      (t.height - n) / 2 / o
    ),
      (t.needsRedraw = !0);
  }
}
function B_(t) {
  var e = window.devicePixelRatio;
  t.setTransform(e, 0, 0, e, 0, 0);
}
function $_(t, e, n) {
  t.save(), B_(t), t.clearRect(0, 0, e, n), t.restore();
}
var V_ = hv({
  props: E_(
    {
      width: {
        default: window.innerWidth,
        onChange: function (t, e) {
          return F_(e);
        },
        triggerUpdate: !1,
      },
      height: {
        default: window.innerHeight,
        onChange: function (t, e) {
          return F_(e);
        },
        triggerUpdate: !1,
      },
      graphData: {
        default: { nodes: [], links: [] },
        onChange: function (t, e) {
          [t.nodes, t.links].every(function (t) {
            return (t || []).every(function (t) {
              return !t.hasOwnProperty("__indexColor");
            });
          }) && e.colorTracker.reset(),
            [
              { type: "Node", objs: t.nodes },
              { type: "Link", objs: t.links },
            ].forEach(function (t) {
              var n = t.type;
              t.objs
                .filter(function (t) {
                  if (!t.hasOwnProperty("__indexColor")) return !0;
                  var n = e.colorTracker.lookup(t.__indexColor);
                  return !n || !n.hasOwnProperty("d") || n.d !== t;
                })
                .forEach(function (t) {
                  t.__indexColor = e.colorTracker.register({ type: n, d: t });
                });
            }),
            e.forceGraph.graphData(t),
            e.shadowGraph.graphData(t);
        },
        triggerUpdate: !1,
      },
      backgroundColor: {
        onChange: function (t, e) {
          e.canvas && t && (e.canvas.style.background = t);
        },
        triggerUpdate: !1,
      },
      nodeLabel: { default: "name", triggerUpdate: !1 },
      nodePointerAreaPaint: {
        onChange: function (t, e) {
          e.shadowGraph.nodeCanvasObject(
            t
              ? function (e, n, r) {
                  return t(e, e.__indexColor, n, r);
                }
              : null
          ),
            e.flushShadowCanvas && e.flushShadowCanvas();
        },
        triggerUpdate: !1,
      },
      linkPointerAreaPaint: {
        onChange: function (t, e) {
          e.shadowGraph.linkCanvasObject(
            t
              ? function (e, n, r) {
                  return t(e, e.__indexColor, n, r);
                }
              : null
          ),
            e.flushShadowCanvas && e.flushShadowCanvas();
        },
        triggerUpdate: !1,
      },
      linkLabel: { default: "name", triggerUpdate: !1 },
      linkHoverPrecision: { default: 4, triggerUpdate: !1 },
      minZoom: {
        default: 0.01,
        onChange: function (t, e) {
          e.zoom.scaleExtent([t, e.zoom.scaleExtent()[1]]);
        },
        triggerUpdate: !1,
      },
      maxZoom: {
        default: 1e3,
        onChange: function (t, e) {
          e.zoom.scaleExtent([e.zoom.scaleExtent()[0], t]);
        },
        triggerUpdate: !1,
      },
      enableNodeDrag: { default: !0, triggerUpdate: !1 },
      enableZoomInteraction: { default: !0, triggerUpdate: !1 },
      enablePanInteraction: { default: !0, triggerUpdate: !1 },
      enableZoomPanInteraction: { default: !0, triggerUpdate: !1 },
      enablePointerInteraction: {
        default: !0,
        onChange: function (t, e) {
          e.hoverObj = null;
        },
        triggerUpdate: !1,
      },
      autoPauseRedraw: { default: !0, triggerUpdate: !1 },
      onNodeDrag: { default: function () {}, triggerUpdate: !1 },
      onNodeDragEnd: { default: function () {}, triggerUpdate: !1 },
      onNodeClick: { triggerUpdate: !1 },
      onNodeRightClick: { triggerUpdate: !1 },
      onNodeHover: { triggerUpdate: !1 },
      onLinkClick: { triggerUpdate: !1 },
      onLinkRightClick: { triggerUpdate: !1 },
      onLinkHover: { triggerUpdate: !1 },
      onBackgroundClick: { triggerUpdate: !1 },
      onBackgroundRightClick: { triggerUpdate: !1 },
      showPointerCursor: { default: !0, triggerUpdate: !1 },
      onZoom: { triggerUpdate: !1 },
      onZoomEnd: { triggerUpdate: !1 },
      onRenderFramePre: { triggerUpdate: !1 },
      onRenderFramePost: { triggerUpdate: !1 },
    },
    L_
  ),
  aliases: { stopAnimation: "pauseAnimation" },
  methods: E_(
    {
      graph2ScreenCoords: function (t, e, n) {
        var r = gg(t.canvas);
        return { x: e * r.k + r.x, y: n * r.k + r.y };
      },
      screen2GraphCoords: function (t, e, n) {
        var r = gg(t.canvas);
        return { x: (e - r.x) / r.k, y: (n - r.y) / r.k };
      },
      centerAt: function (t, e, n, r) {
        if (!t.canvas) return null;
        if (void 0 !== e || void 0 !== n) {
          var o = Object.assign(
            {},
            void 0 !== e ? { x: e } : {},
            void 0 !== n ? { y: n } : {}
          );
          return (
            r
              ? t.tweenGroup.add(
                  new sv(i())
                    .to(o, r)
                    .easing(tv.Quadratic.Out)
                    .onUpdate(s)
                    .start()
                )
              : s(o),
            this
          );
        }
        return i();
        function i() {
          var e = gg(t.canvas);
          return {
            x: (t.width / 2 - e.x) / e.k,
            y: (t.height / 2 - e.y) / e.k,
          };
        }
        function s(e) {
          var n = e.x,
            r = e.y;
          t.zoom.translateTo(
            t.zoom.__baseElem,
            void 0 === n ? i().x : n,
            void 0 === r ? i().y : r
          ),
            (t.needsRedraw = !0);
        }
      },
      zoom: function (t, e, n) {
        return t.canvas
          ? void 0 !== e
            ? (n
                ? t.tweenGroup.add(
                    new sv({ k: r() })
                      .to({ k: e }, n)
                      .easing(tv.Quadratic.Out)
                      .onUpdate(function (t) {
                        return o(t.k);
                      })
                      .start()
                  )
                : o(e),
              this)
            : r()
          : null;
        function r() {
          return gg(t.canvas).k;
        }
        function o(e) {
          t.zoom.scaleTo(t.zoom.__baseElem, e), (t.needsRedraw = !0);
        }
      },
      zoomToFit: function (t) {
        for (
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0,
            n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 10,
            r = arguments.length,
            o = new Array(r > 3 ? r - 3 : 0),
            i = 3;
          i < r;
          i++
        )
          o[i - 3] = arguments[i];
        var s = this.getGraphBbox.apply(this, o);
        if (s) {
          var a = { x: (s.x[0] + s.x[1]) / 2, y: (s.y[0] + s.y[1]) / 2 },
            l = Math.max(
              1e-12,
              Math.min(
                1e12,
                (t.width - 2 * n) / (s.x[1] - s.x[0]),
                (t.height - 2 * n) / (s.y[1] - s.y[0])
              )
            );
          this.centerAt(a.x, a.y, e), this.zoom(l, e);
        }
        return this;
      },
      getGraphBbox: function (t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : function () {
                  return !0;
                },
          n = dv(t.nodeVal),
          r = function (e) {
            return Math.sqrt(Math.max(0, n(e) || 1)) * t.nodeRelSize;
          },
          o = t.graphData.nodes.filter(e).map(function (t) {
            return { x: t.x, y: t.y, r: r(t) };
          });
        return o.length
          ? {
              x: [
                Tg(o, function (t) {
                  return t.x - t.r;
                }),
                Og(o, function (t) {
                  return t.x + t.r;
                }),
              ],
              y: [
                Tg(o, function (t) {
                  return t.y - t.r;
                }),
                Og(o, function (t) {
                  return t.y + t.r;
                }),
              ],
            }
          : null;
      },
      pauseAnimation: function (t) {
        return (
          t.animationFrameRequestId &&
            (cancelAnimationFrame(t.animationFrameRequestId),
            (t.animationFrameRequestId = null)),
          this
        );
      },
      resumeAnimation: function (t) {
        return t.animationFrameRequestId || this._animationCycle(), this;
      },
      _destructor: function () {
        this.pauseAnimation(), this.graphData({ nodes: [], links: [] });
      },
    },
    U_
  ),
  stateInit: function () {
    return {
      lastSetZoom: 1,
      zoom: Sg(),
      forceGraph: new j_(),
      shadowGraph: new j_()
        .cooldownTicks(0)
        .nodeColor("__indexColor")
        .linkColor("__indexColor")
        .isShadow(!0),
      colorTracker: new _y(),
      tweenGroup: new nv(),
    };
  },
  init: function (t, e) {
    var n = this;
    t.innerHTML = "";
    var r = document.createElement("div");
    r.classList.add("force-graph-container"),
      (r.style.position = "relative"),
      t.appendChild(r),
      (e.canvas = document.createElement("canvas")),
      e.backgroundColor && (e.canvas.style.background = e.backgroundColor),
      r.appendChild(e.canvas),
      (e.shadowCanvas = document.createElement("canvas"));
    var o = e.canvas.getContext("2d"),
      i = e.shadowCanvas.getContext("2d", { willReadFrequently: !0 }),
      s = { x: -1e12, y: -1e12 },
      a = function () {
        var t = null,
          n = window.devicePixelRatio,
          r =
            s.x > 0 && s.y > 0 ? i.getImageData(s.x * n, s.y * n, 1, 1) : null;
        return r && (t = e.colorTracker.lookup(r.data)), t;
      };
    td(e.canvas).call(
      (function () {
        var t,
          e,
          n,
          r,
          o = gd,
          i = vd,
          s = yd,
          a = md,
          l = {},
          u = rd("start", "drag", "end"),
          c = 0,
          f = 0;
        function h(t) {
          t.on("mousedown.drag", d)
            .filter(a)
            .on("touchstart.drag", v)
            .on("touchmove.drag", y, ad)
            .on("touchend.drag touchcancel.drag", m)
            .style("touch-action", "none")
            .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
        }
        function d(s, a) {
          if (!r && o.call(this, s, a)) {
            var l = _(this, i.call(this, s, a), s, a, "mouse");
            l &&
              (td(s.view).on("mousemove.drag", p, ld).on("mouseup.drag", g, ld),
              fd(s.view),
              ud(s),
              (n = !1),
              (t = s.clientX),
              (e = s.clientY),
              l("start", s));
          }
        }
        function p(r) {
          if ((cd(r), !n)) {
            var o = r.clientX - t,
              i = r.clientY - e;
            n = o * o + i * i > f;
          }
          l.mouse("drag", r);
        }
        function g(t) {
          td(t.view).on("mousemove.drag mouseup.drag", null),
            hd(t.view, n),
            cd(t),
            l.mouse("end", t);
        }
        function v(t, e) {
          if (o.call(this, t, e)) {
            var n,
              r,
              s = t.changedTouches,
              a = i.call(this, t, e),
              l = s.length;
            for (n = 0; n < l; ++n)
              (r = _(this, a, t, e, s[n].identifier, s[n])) &&
                (ud(t), r("start", t, s[n]));
          }
        }
        function y(t) {
          var e,
            n,
            r = t.changedTouches,
            o = r.length;
          for (e = 0; e < o; ++e)
            (n = l[r[e].identifier]) && (cd(t), n("drag", t, r[e]));
        }
        function m(t) {
          var e,
            n,
            o = t.changedTouches,
            i = o.length;
          for (
            r && clearTimeout(r),
              r = setTimeout(function () {
                r = null;
              }, 500),
              e = 0;
            e < i;
            ++e
          )
            (n = l[o[e].identifier]) && (ud(t), n("end", t, o[e]));
        }
        function _(t, e, n, r, o, i) {
          var a,
            f,
            d,
            p = u.copy(),
            g = ed(i || n, e);
          if (
            null !=
            (d = s.call(
              t,
              new pd("beforestart", {
                sourceEvent: n,
                target: h,
                identifier: o,
                active: c,
                x: g[0],
                y: g[1],
                dx: 0,
                dy: 0,
                dispatch: p,
              }),
              r
            ))
          )
            return (
              (a = d.x - g[0] || 0),
              (f = d.y - g[1] || 0),
              function n(i, s, u) {
                var v,
                  y = g;
                switch (i) {
                  case "start":
                    (l[o] = n), (v = c++);
                    break;
                  case "end":
                    delete l[o], --c;
                  case "drag":
                    (g = ed(u || s, e)), (v = c);
                }
                p.call(
                  i,
                  t,
                  new pd(i, {
                    sourceEvent: s,
                    subject: d,
                    target: h,
                    identifier: o,
                    active: v,
                    x: g[0] + a,
                    y: g[1] + f,
                    dx: g[0] - y[0],
                    dy: g[1] - y[1],
                    dispatch: p,
                  }),
                  r
                );
              }
            );
        }
        return (
          (h.filter = function (t) {
            return arguments.length
              ? ((o = "function" == typeof t ? t : dd(!!t)), h)
              : o;
          }),
          (h.container = function (t) {
            return arguments.length
              ? ((i = "function" == typeof t ? t : dd(t)), h)
              : i;
          }),
          (h.subject = function (t) {
            return arguments.length
              ? ((s = "function" == typeof t ? t : dd(t)), h)
              : s;
          }),
          (h.touchable = function (t) {
            return arguments.length
              ? ((a = "function" == typeof t ? t : dd(!!t)), h)
              : a;
          }),
          (h.on = function () {
            var t = u.on.apply(u, arguments);
            return t === u ? h : t;
          }),
          (h.clickDistance = function (t) {
            return arguments.length ? ((f = (t = +t) * t), h) : Math.sqrt(f);
          }),
          h
        );
      })()
        .subject(function () {
          if (!e.enableNodeDrag) return null;
          var t = a();
          return t && "Node" === t.type ? t.d : null;
        })
        .on("start", function (t) {
          var n = t.subject;
          (n.__initialDragPos = { x: n.x, y: n.y, fx: n.fx, fy: n.fy }),
            t.active || ((n.fx = n.x), (n.fy = n.y)),
            e.canvas.classList.add("grabbable");
        })
        .on("drag", function (t) {
          var n = t.subject,
            r = n.__initialDragPos,
            o = t,
            i = gg(e.canvas).k,
            s = {
              x: r.x + (o.x - r.x) / i - n.x,
              y: r.y + (o.y - r.y) / i - n.y,
            };
          ["x", "y"].forEach(function (t) {
            return (n["f".concat(t)] = n[t] = r[t] + (o[t] - r[t]) / i);
          }),
            (!n.__dragged &&
              5 >=
                Math.sqrt(
                  (function (t) {
                    let e = 0;
                    for (let n of t) (n = +n) && (e += n);
                    return e;
                  })(
                    ["x", "y"].map(function (e) {
                      return Math.pow(t[e] - r[e], 2);
                    })
                  )
                )) ||
              (e.forceGraph.d3AlphaTarget(0.3).resetCountdown(),
              (e.isPointerDragging = !0),
              (n.__dragged = !0),
              e.onNodeDrag(n, s));
        })
        .on("end", function (t) {
          var n = t.subject,
            r = n.__initialDragPos,
            o = { x: n.x - r.x, y: n.y - r.y };
          void 0 === r.fx && (n.fx = void 0),
            void 0 === r.fy && (n.fy = void 0),
            delete n.__initialDragPos,
            e.forceGraph.d3AlphaTarget() &&
              e.forceGraph.d3AlphaTarget(0).resetCountdown(),
            e.canvas.classList.remove("grabbable"),
            (e.isPointerDragging = !1),
            n.__dragged && (delete n.__dragged, e.onNodeDragEnd(n, o));
        })
    ),
      e.zoom((e.zoom.__baseElem = td(e.canvas))),
      e.zoom.__baseElem.on("dblclick.zoom", null),
      e.zoom
        .filter(function (t) {
          return (
            !t.button &&
            e.enableZoomPanInteraction &&
            ("wheel" !== t.type || dv(e.enableZoomInteraction)(t)) &&
            ("wheel" === t.type || dv(e.enablePanInteraction)(t))
          );
        })
        .on("zoom", function (t) {
          var r = t.transform;
          [o, i].forEach(function (t) {
            B_(t), t.translate(r.x, r.y), t.scale(r.k, r.k);
          }),
            (e.isPointerDragging = !0),
            e.onZoom && e.onZoom(E_(E_({}, r), n.centerAt())),
            (e.needsRedraw = !0);
        })
        .on("end", function (t) {
          (e.isPointerDragging = !1),
            e.onZoomEnd && e.onZoomEnd(E_(E_({}, t.transform), n.centerAt()));
        }),
      F_(e),
      e.forceGraph
        .onNeedsRedraw(function () {
          return (e.needsRedraw = !0);
        })
        .onFinishUpdate(function () {
          gg(e.canvas).k === e.lastSetZoom &&
            e.graphData.nodes.length &&
            (e.zoom.scaleTo(
              e.zoom.__baseElem,
              (e.lastSetZoom = 4 / Math.cbrt(e.graphData.nodes.length))
            ),
            (e.needsRedraw = !0));
        }),
      (e.tooltip = new tm(r)),
      ["pointermove", "pointerdown"].forEach(function (t) {
        return r.addEventListener(
          t,
          function (n) {
            "pointerdown" === t &&
              ((e.isPointerPressed = !0), (e.pointerDownEvent = n)),
              !e.isPointerDragging &&
                "pointermove" === n.type &&
                e.onBackgroundClick &&
                (n.pressure > 0 || e.isPointerPressed) &&
                ("mouse" === n.pointerType ||
                  void 0 === n.movementX ||
                  [n.movementX, n.movementY].some(function (t) {
                    return Math.abs(t) > 1;
                  })) &&
                (e.isPointerDragging = !0);
            var o,
              i,
              a,
              l =
                ((o = r.getBoundingClientRect()),
                (i = window.pageXOffset || document.documentElement.scrollLeft),
                (a = window.pageYOffset || document.documentElement.scrollTop),
                { top: o.top + a, left: o.left + i });
            (s.x = n.pageX - l.left), (s.y = n.pageY - l.top);
          },
          { passive: !0 }
        );
      }),
      r.addEventListener(
        "pointerup",
        function (t) {
          if (e.isPointerPressed)
            if (((e.isPointerPressed = !1), e.isPointerDragging))
              e.isPointerDragging = !1;
            else {
              var n = [t, e.pointerDownEvent];
              requestAnimationFrame(function () {
                if (0 === t.button)
                  if (e.hoverObj) {
                    var r = e["on".concat(e.hoverObj.type, "Click")];
                    r && r.apply(void 0, [e.hoverObj.d].concat(n));
                  } else e.onBackgroundClick && e.onBackgroundClick.apply(e, n);
                if (2 === t.button)
                  if (e.hoverObj) {
                    var o = e["on".concat(e.hoverObj.type, "RightClick")];
                    o && o.apply(void 0, [e.hoverObj.d].concat(n));
                  } else
                    e.onBackgroundRightClick &&
                      e.onBackgroundRightClick.apply(e, n);
              });
            }
        },
        { passive: !0 }
      ),
      r.addEventListener("contextmenu", function (t) {
        return (
          !(
            e.onBackgroundRightClick ||
            e.onNodeRightClick ||
            e.onLinkRightClick
          ) || (t.preventDefault(), !1)
        );
      }),
      e.forceGraph(o),
      e.shadowGraph(i);
    var l = (function (t, e, n) {
      var r = !0,
        o = !0;
      if ("function" != typeof t) throw new TypeError("Expected a function");
      return (
        qg(n) &&
          ((r = "leading" in n ? !!n.leading : r),
          (o = "trailing" in n ? !!n.trailing : o)),
        Qg(t, e, { leading: r, maxWait: e, trailing: o })
      );
    })(function () {
      $_(i, e.width, e.height),
        e.shadowGraph.linkWidth(function (t) {
          return dv(e.linkWidth)(t) + e.linkHoverPrecision;
        });
      var t = gg(e.canvas);
      e.shadowGraph.globalScale(t.k).tickFrame();
    }, 800);
    (e.flushShadowCanvas = l.flush),
      (this._animationCycle = function t() {
        var n =
          !e.autoPauseRedraw ||
          !!e.needsRedraw ||
          e.forceGraph.isEngineRunning() ||
          e.graphData.links.some(function (t) {
            return t.__photons && t.__photons.length;
          });
        if (((e.needsRedraw = !1), e.enablePointerInteraction)) {
          var r = e.isPointerDragging ? null : a();
          if (r !== e.hoverObj) {
            var i = e.hoverObj,
              s = i ? i.type : null,
              u = r ? r.type : null;
            if (s && s !== u) {
              var c = e["on".concat(s, "Hover")];
              c && c(null, i.d);
            }
            if (u) {
              var f = e["on".concat(u, "Hover")];
              f && f(r.d, s === u ? i.d : null);
            }
            e.tooltip.content(
              (r && dv(e["".concat(r.type.toLowerCase(), "Label")])(r.d)) ||
                null
            ),
              e.canvas.classList[
                ((r && e["on".concat(u, "Click")]) ||
                  (!r && e.onBackgroundClick)) &&
                dv(e.showPointerCursor)(null == r ? void 0 : r.d)
                  ? "add"
                  : "remove"
              ]("clickable"),
              (e.hoverObj = r);
          }
          n && l();
        }
        if (n) {
          $_(o, e.width, e.height);
          var h = gg(e.canvas).k;
          e.onRenderFramePre && e.onRenderFramePre(o, h),
            e.forceGraph.globalScale(h).tickFrame(),
            e.onRenderFramePost && e.onRenderFramePost(o, h);
        }
        e.tweenGroup.update(),
          (e.animationFrameRequestId = requestAnimationFrame(t));
      })();
  },
  update: function (t) {},
});
const q_ = pl(
    {
      __name: "GraphCanvas",
      setup(t) {
        const e = Se(null),
          n = Yc(),
          r = fl();
        let o,
          i = !0;
        function s() {
          o &&
            e.value &&
            (o.width(e.value.clientWidth), o.height(e.value.clientHeight));
        }
        return (
          Bn(() => {
            !(function () {
              if (!e.value) return;
              const t = (t) => {
                  if (n.selectedNode && t.id === n.selectedNode.id)
                    return r.isDark ? "#fff" : "#000";
                  if (
                    !n.isConnecting &&
                    n.highlightNodes.size > 0 &&
                    !n.highlightNodes.has(t.id)
                  )
                    return r.isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)";
                  switch (t.type || t.group || "") {
                    case "User":
                      return "#60a5fa";
                    case "Session":
                      return "#a78bfa";
                    case "Message":
                      return "#34d399";
                    case "Entity":
                      return "#fbbf24";
                    case "MemoryFragment":
                      return "#f472b6";
                    default:
                      return "#9ca3af";
                  }
                },
                i = (t) =>
                  n.highlightLinks.size > 0 && !n.highlightLinks.has(t)
                    ? r.isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)"
                    : r.isDark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)";
              (o = V_()(e.value)
                .backgroundColor(r.isDark ? "#080808" : "#f2f2f2")
                .nodeLabel(null)
                .nodeColor(t)
                .nodeVal((t) => 5 * (t.importance || 0.5))
                .nodeRelSize(4)
                .linkColor(i)
                .linkWidth((t) => (n.highlightLinks.has(t) ? 2.5 : 1))
                .linkDirectionalParticles((t) =>
                  n.highlightLinks.has(t) ? 3 : 0
                )
                .linkDirectionalParticleWidth(3)
                .cooldownTime(3e3)
                .d3AlphaDecay(0.02)
                .d3VelocityDecay(0.3)
                .d3AlphaMin(0.001)
                .onNodeClick((t, e) => {
                  n.isConnecting
                    ? (function (t) {
                        if (n.connectionStartNode) {
                          if (n.connectionStartNode.id === t.id)
                            return void r.showToast(
                              "无法连接",
                              "不能连接节点自身",
                              "warning"
                            );
                          const e = n.connectionStartNode,
                            o = t;
                          (n.isConnecting = !1),
                            (n.connectionStartNode = null),
                            n.highlightNodes.clear(),
                            n.showConnectPanel(e, o);
                        } else
                          (n.connectionStartNode = t),
                            r.showToast(
                              "已选择起始节点",
                              `${t.name}，请点击第二个节点`,
                              "info",
                              3e3
                            ),
                            n.highlightNodes.clear(),
                            n.highlightNodes.add(t.id);
                      })(t)
                    : (n.selectNode(t),
                      n.focusNode(t, o),
                      r.switchTab("info"),
                      r.sidebarOpen || r.toggleSidebar());
                })
                .onNodeHover((t) => {
                  (n.hoverNode = t),
                    (e.value.style.cursor = t ? "pointer" : null);
                })
                .onNodeDrag((t) => {
                  o &&
                    (o.d3ReheatSimulation(),
                    o.cooldownTime(500),
                    o.d3AlphaDecay(0.1));
                })
                .onNodeDragEnd((t) => {
                  o && (o.cooldownTime(3e3), o.d3AlphaDecay(0.02));
                })
                .onBackgroundClick(() => n.clearSelection())
                .nodeCanvasObject((e, o, i) => {
                  const s =
                      4 * Math.sqrt(Math.max(0, 5 * (e.importance || 0.5))),
                    a = n.selectedNode && e.id === n.selectedNode.id,
                    l = n.highlightNodes.has(e.id),
                    u = !n.isConnecting && n.highlightNodes.size > 0 && !l;
                  if (
                    (o.beginPath(),
                    o.arc(e.x, e.y, s, 0, 2 * Math.PI, !1),
                    (o.fillStyle = u
                      ? r.isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.05)"
                      : t(e)),
                    o.fill(),
                    a &&
                      ((o.strokeStyle = r.isDark ? "#fff" : "#333"),
                      (o.lineWidth = 2 / i),
                      o.stroke(),
                      o.beginPath(),
                      o.arc(e.x, e.y, 1.5 * s, 0, 2 * Math.PI, !1),
                      (o.strokeStyle = r.isDark
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.1)"),
                      (o.lineWidth = 1 / i),
                      o.stroke()),
                    n.showLabels || a || l)
                  ) {
                    const t = e.name,
                      n = (a ? 14 : 10) / i;
                    (o.font = `${a ? "bold" : ""} ${n}px 'Inter', sans-serif`),
                      (o.textAlign = "center"),
                      (o.textBaseline = "top");
                    const l = r.isDark
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(0,0,0,0.8)",
                      c = r.isDark
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.2)";
                    if (((o.fillStyle = u ? c : l), a)) {
                      const i = o.measureText(t).width,
                        a = 1.2 * n;
                      (o.fillStyle = r.isDark
                        ? "rgba(0,0,0,0.7)"
                        : "rgba(255,255,255,0.8)"),
                        o.fillRect(e.x - i / 2 - 2, e.y + s + 2, i + 4, a),
                        (o.fillStyle = u ? c : l);
                    }
                    o.fillText(t, e.x, e.y + s + 2);
                  }
                })
                .graphData(n.graphData)),
                n.setGraphInstance(o),
                s();
            })(),
              window.addEventListener("resize", s);
          }),
          Hn(() => {
            window.removeEventListener("resize", s), o && o._destructor();
          }),
          Er(
            () => n.graphData,
            (t, e) => {
              if (o) {
                o.graphData(t);
                const n = !e || t.nodes.length !== e.nodes.length;
                (i || n) && (setTimeout(() => o.zoomToFit(400), 200), (i = !1));
              }
            }
          ),
          Er(
            () => r.isDark,
            () => {
              o &&
                (o.backgroundColor(r.isDark ? "#080808" : "#f2f2f2"),
                o.nodeColor(o.nodeColor()),
                o.linkColor(o.linkColor()),
                o.nodeCanvasObject(o.nodeCanvasObject()));
            }
          ),
          Er(
            () => n.highlightNodes,
            () => {
              o &&
                (o.nodeColor(o.nodeColor()),
                o.linkColor(o.linkColor()),
                o.linkWidth(o.linkWidth()),
                o.linkDirectionalParticles((t) =>
                  n.highlightLinks.has(t) ? 2 : 0
                ),
                o.nodeCanvasObject(o.nodeCanvasObject()));
            }
          ),
          Er(
            () => n.showLabels,
            () => {
              o && o.nodeCanvasObject(o.nodeCanvasObject());
            }
          ),
          (t, n) => (
            fo(),
            vo(
              "div",
              { ref_key: "graphContainer", ref: e, class: "graph-container" },
              null,
              512
            )
          )
        );
      },
    },
    [["__scopeId", "data-v-309ede67"]]
  ),
  H_ = { class: "bottom-controls" },
  G_ = { class: "stats" },
  W_ = { class: "stat-item" },
  X_ = { class: "stat-item" },
  Y_ = { class: "controls" },
  J_ = { class: "checkbox-label" },
  K_ = pl(
    {
      __name: "BottomControls",
      setup(t) {
        const e = Yc();
        return (t, n) => (
          fo(),
          vo("div", H_, [
            xo("div", G_, [
              xo("span", W_, [
                ko(dl, { name: "circle", size: "0.75rem" }),
                Eo(" 节点: " + J(Ae(e).nodeCount), 1),
              ]),
              xo("span", X_, [
                ko(dl, { name: "git-branch", size: "0.75rem" }),
                Eo(" 边: " + J(Ae(e).edgeCount), 1),
              ]),
            ]),
            xo("div", Y_, [
              xo("label", J_, [
                sn(
                  xo(
                    "input",
                    {
                      type: "checkbox",
                      "onUpdate:modelValue":
                        n[0] || (n[0] = (t) => (Ae(e).showLabels = t)),
                    },
                    null,
                    512
                  ),
                  [[ts, Ae(e).showLabels]]
                ),
                n[3] || (n[3] = xo("span", null, "显示标签", -1)),
              ]),
              xo(
                "button",
                {
                  onClick:
                    n[1] ||
                    (n[1] = (t) => Ae(e).loadGraphData(Ae(e).currentSessionId)),
                  class: "icon-btn",
                  title: "重新加载",
                },
                [ko(dl, { name: "refresh-cw", size: "1rem" })]
              ),
              xo(
                "button",
                {
                  onClick:
                    n[2] ||
                    (n[2] = (...t) => Ae(e).zoomToFit && Ae(e).zoomToFit(...t)),
                  class: "icon-btn",
                  title: "适应视图",
                },
                [ko(dl, { name: "maximize-2", size: "1rem" })]
              ),
            ]),
          ])
        );
      },
    },
    [["__scopeId", "data-v-b8a09ee0"]]
  ),
  Z_ = { class: "right-toolbar" },
  Q_ = ["onClick", "onMouseenter"],
  tb = { class: "bookmark-tab" },
  eb = { key: 0, class: "bookmark-label" },
  nb = pl(
    {
      __name: "RightToolbar",
      setup(t) {
        const e = fl(),
          n = Yc(),
          r = Se(null),
          o = [
            {
              id: "monitor",
              label: "监控",
              icon: "activity",
              action: "switchTab",
            },
            { id: "debug", label: "调试", icon: "bug", action: "switchTab" },
            {
              id: "tools",
              label: "高级工具",
              icon: "wrench",
              action: "openPanel",
            },
            {
              id: "link",
              label: "关联到会话",
              icon: "link",
              action: "linkEntity",
            },
            {
              id: "connect",
              label: "连接节点",
              icon: "share-2",
              action: "toggleConnect",
            },
          ];
        return (t, i) => (
          fo(),
          vo("div", Z_, [
            (fo(),
            vo(
              io,
              null,
              Qn(o, (t) =>
                xo(
                  "div",
                  {
                    key: t.id,
                    class: q([
                      "tool-bookmark",
                      { active: Ae(e).openPanels.includes(t.id) },
                    ]),
                    onClick: (r) =>
                      ((t) =>
                        "connect" === t.id
                          ? ((n.isConnecting = !n.isConnecting),
                            (n.connectionStartNode = null),
                            void (n.isConnecting
                              ? (e.showToast(
                                  "连接模式",
                                  "请依次点击两个节点以创建关系",
                                  "info",
                                  3e3
                                ),
                                e.togglePanel("connect"))
                              : e.closePanel("connect")))
                          : "link" === t.id
                          ? n.selectedNode && "Entity" === n.selectedNode.type
                            ? void e.togglePanel(t.id, {
                                entityName: n.selectedNode.name,
                              })
                            : void e.showToast(
                                "无法关联",
                                "请先选择一个实体节点",
                                "warning"
                              )
                          : void e.togglePanel(t.id))(t),
                    onMouseenter: (e) => (r.value = t.id),
                    onMouseleave: i[0] || (i[0] = (t) => (r.value = null)),
                  },
                  [
                    xo("div", tb, [
                      ko(dl, { name: t.icon, size: "1.125rem" }, null, 8, [
                        "name",
                      ]),
                    ]),
                    ko(
                      ai,
                      { name: "label-slide" },
                      {
                        default: on(() => [
                          r.value === t.id
                            ? (fo(), vo("div", eb, J(t.label), 1))
                            : Ao("", !0),
                        ]),
                        _: 2,
                      },
                      1024
                    ),
                  ],
                  42,
                  Q_
                )
              ),
              64
            )),
          ])
        );
      },
    },
    [["__scopeId", "data-v-018c1090"]]
  ),
  rb = {},
  ob = function (t, e, n) {
    let r = Promise.resolve();
    if (e && e.length > 0) {
      document.getElementsByTagName("link");
      const t = document.querySelector("meta[property=csp-nonce]"),
        n =
          (null == t ? void 0 : t.nonce) ||
          (null == t ? void 0 : t.getAttribute("nonce"));
      r = Promise.allSettled(
        e.map((t) => {
          if (
            (t = (function (t) {
              return "/" + t;
            })(t)) in rb
          )
            return;
          rb[t] = !0;
          const e = t.endsWith(".css"),
            r = e ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${t}"]${r}`)) return;
          const o = document.createElement("link");
          return (
            (o.rel = e ? "stylesheet" : "modulepreload"),
            e || (o.as = "script"),
            (o.crossOrigin = ""),
            (o.href = t),
            n && o.setAttribute("nonce", n),
            document.head.appendChild(o),
            e
              ? new Promise((e, n) => {
                  o.addEventListener("load", e),
                    o.addEventListener("error", () =>
                      n(new Error(`Unable to preload CSS for ${t}`))
                    );
                })
              : void 0
          );
        })
      );
    }
    function o(t) {
      const e = new Event("vite:preloadError", { cancelable: !0 });
      if (((e.payload = t), window.dispatchEvent(e), !e.defaultPrevented))
        throw t;
    }
    return r.then((e) => {
      for (const t of e || []) "rejected" === t.status && o(t.reason);
      return t().catch(o);
    });
  },
  ib = { class: "panels-container" },
  sb = { class: "panel-header" },
  ab = { class: "panel-title" },
  lb = ["onClick"],
  ub = { class: "panel-content" },
  cb = pl(
    {
      __name: "RightPanel",
      setup(t) {
        const e = fl(),
          n = Pn(() =>
            ob(
              () => import("./ToolsPanel-BEKbfd8F.js"),
              __vite__mapDeps([0, 1])
            )
          ),
          r = Pn(() =>
            ob(() => import("./LinkPanel-D4oBTstd.js"), __vite__mapDeps([2, 3]))
          ),
          o = Pn(() =>
            ob(
              () => import("./ConnectPanel-DGmUDZX6.js"),
              __vite__mapDeps([4, 5])
            )
          ),
          i = {
            monitor: "监控",
            debug: "调试",
            tools: "高级工具",
            link: "关联实体到会话",
            connect: "连接节点",
          },
          s = {
            monitor: Pn(() =>
              ob(
                () => import("./MonitorPanel-Bf8KqZ1x.js"),
                __vite__mapDeps([6, 7])
              )
            ),
            debug: Pn(() =>
              ob(
                () => import("./DebugPanel-BvMLjHdi.js"),
                __vite__mapDeps([8, 9])
              )
            ),
            tools: n,
            link: r,
            connect: o,
          },
          a = (t) => i[t] || "",
          l = (t) => s[t] || null,
          u = (t) => {
            e.openPanels.length;
            return { right: 3 + 23 * t + "rem" };
          };
        return (t, n) => (
          fo(),
          vo("div", ib, [
            ko(
              qi,
              { name: "panel-slide", tag: "div", class: "panels-wrapper" },
              {
                default: on(() => [
                  (fo(!0),
                  vo(
                    io,
                    null,
                    Qn(
                      Ae(e).openPanels,
                      (t, n) => (
                        fo(),
                        vo(
                          "div",
                          { key: t, class: "right-panel", style: U(u(n)) },
                          [
                            xo("div", sb, [
                              xo("h3", ab, J(a(t)), 1),
                              xo(
                                "button",
                                {
                                  onClick: (n) => Ae(e).closePanel(t),
                                  class: "icon-btn",
                                },
                                [ko(dl, { name: "x", size: "1rem" })],
                                8,
                                lb
                              ),
                            ]),
                            xo("div", ub, [
                              l(t)
                                ? (fo(),
                                  yo(
                                    Kn(l(t)),
                                    {
                                      key: 0,
                                      "panel-data": Ae(e).panelData[t],
                                    },
                                    null,
                                    8,
                                    ["panel-data"]
                                  ))
                                : Ao("", !0),
                            ]),
                          ],
                          4
                        )
                      )
                    ),
                    128
                  )),
                ]),
                _: 1,
              }
            ),
          ])
        );
      },
    },
    [["__scopeId", "data-v-2e9f2940"]]
  ),
  fb = { key: 0, class: "connect-mode-overlay" },
  hb = { class: "connect-mode-banner" },
  db = { class: "banner-icon" },
  pb = { class: "banner-content" },
  gb = { class: "banner-desc" },
  vb = pl(
    {
      __name: "ConnectModeOverlay",
      setup(t) {
        const e = Yc(),
          n = fl();
        function r() {
          (e.isConnecting = !1),
            (e.connectionStartNode = null),
            e.highlightNodes.clear(),
            n.closePanel("connect");
        }
        return (t, n) => (
          fo(),
          yo(
            ai,
            { name: "overlay-fade" },
            {
              default: on(() => [
                Ae(e).isConnecting
                  ? (fo(),
                    vo("div", fb, [
                      xo("div", hb, [
                        xo("div", db, [
                          ko(dl, { name: "share-2", size: "1.5rem" }),
                        ]),
                        xo("div", pb, [
                          n[2] ||
                            (n[2] = xo(
                              "div",
                              { class: "banner-title" },
                              "连接模式已激活",
                              -1
                            )),
                          xo("div", gb, [
                            Ae(e).connectionStartNode
                              ? (fo(),
                                vo(
                                  io,
                                  { key: 1 },
                                  [
                                    n[0] || (n[0] = Eo(" 已选择 ", -1)),
                                    xo(
                                      "strong",
                                      null,
                                      J(Ae(e).connectionStartNode.name),
                                      1
                                    ),
                                    n[1] ||
                                      (n[1] = Eo(
                                        "，点击第二个节点完成连接 ",
                                        -1
                                      )),
                                  ],
                                  64
                                ))
                              : (fo(),
                                vo(
                                  io,
                                  { key: 0 },
                                  [Eo(" 点击第一个节点作为起始节点 ")],
                                  64
                                )),
                          ]),
                        ]),
                        xo("button", { onClick: r, class: "banner-close" }, [
                          ko(dl, { name: "x", size: "1.25rem" }),
                        ]),
                      ]),
                    ]))
                  : Ao("", !0),
              ]),
              _: 1,
            }
          )
        );
      },
    },
    [["__scopeId", "data-v-f1036573"]]
  ),
  yb = { class: "dashboard-view" },
  mb = { class: "stats-grid" },
  _b = { class: "stat-card" },
  bb = { class: "stat-icon" },
  wb = { class: "stat-content" },
  xb = { class: "stat-value" },
  kb = { class: "stat-card" },
  Sb = { class: "stat-icon" },
  Eb = { class: "stat-content" },
  Cb = { class: "stat-value" },
  Ab = { class: "stat-card" },
  Ob = { class: "stat-icon" },
  Tb = { class: "stat-content" },
  Nb = { class: "stat-value" },
  Pb = { class: "stat-card" },
  Mb = { class: "stat-icon" },
  Rb = { class: "dashboard-content" },
  jb = { class: "section" },
  zb = { class: "section-title" },
  Db = { class: "session-list" },
  Ib = ["onClick"],
  Lb = { class: "session-info" },
  Ub = { class: "session-name" },
  Fb = { class: "session-meta" },
  Bb = { key: 0, class: "empty-state" },
  $b = { class: "section" },
  Vb = { class: "section-title" },
  qb = { class: "quick-actions" },
  Hb = pl(
    {
      __name: "DashboardView",
      setup(t) {
        const e = Yc(),
          n = fl(),
          r = Wo(() => e.contexts.slice(0, 5)),
          o = (t = null) => {
            t && e.loadGraphData(t), n.switchView("graph");
          };
        return (
          Bn(async () => {
            0 === e.contexts.length && (await e.fetchContexts());
          }),
          (t, n) => (
            fo(),
            vo("div", yb, [
              xo("div", mb, [
                xo("div", _b, [
                  xo("div", bb, [ko(dl, { name: "database", size: "1.5rem" })]),
                  xo("div", wb, [
                    n[1] ||
                      (n[1] = xo(
                        "div",
                        { class: "stat-label" },
                        "总节点数",
                        -1
                      )),
                    xo("div", xb, J(Ae(e).nodeCount), 1),
                  ]),
                ]),
                xo("div", kb, [
                  xo("div", Sb, [
                    ko(dl, { name: "git-branch", size: "1.5rem" }),
                  ]),
                  xo("div", Eb, [
                    n[2] ||
                      (n[2] = xo("div", { class: "stat-label" }, "总边数", -1)),
                    xo("div", Cb, J(Ae(e).edgeCount), 1),
                  ]),
                ]),
                xo("div", Ab, [
                  xo("div", Ob, [
                    ko(dl, { name: "message-circle", size: "1.5rem" }),
                  ]),
                  xo("div", Tb, [
                    n[3] ||
                      (n[3] = xo(
                        "div",
                        { class: "stat-label" },
                        "会话数量",
                        -1
                      )),
                    xo("div", Nb, J(Ae(e).contexts.length), 1),
                  ]),
                ]),
                xo("div", Pb, [
                  xo("div", Mb, [ko(dl, { name: "activity", size: "1.5rem" })]),
                  n[4] ||
                    (n[4] = xo(
                      "div",
                      { class: "stat-content" },
                      [
                        xo("div", { class: "stat-label" }, "系统状态"),
                        xo(
                          "div",
                          { class: "stat-value status online" },
                          " 运行中 "
                        ),
                      ],
                      -1
                    )),
                ]),
              ]),
              xo("div", Rb, [
                xo("div", jb, [
                  xo("h2", zb, [
                    ko(dl, { name: "list", size: "1.25rem" }),
                    n[5] || (n[5] = xo("span", null, "最近会话", -1)),
                  ]),
                  xo("div", Db, [
                    (fo(!0),
                    vo(
                      io,
                      null,
                      Qn(
                        r.value,
                        (t) => (
                          fo(),
                          vo(
                            "div",
                            {
                              key: t.session_id,
                              class: "session-item",
                              onClick: (e) => o(t.session_id),
                            },
                            [
                              xo("div", Lb, [
                                xo("div", Ub, J(t.session_id), 1),
                                xo("div", Fb, [
                                  xo(
                                    "span",
                                    null,
                                    J(t.node_count) + " 节点",
                                    1
                                  ),
                                  xo("span", null, J(t.edge_count) + " 边", 1),
                                ]),
                              ]),
                              ko(dl, { name: "chevron-right", size: "1rem" }),
                            ],
                            8,
                            Ib
                          )
                        )
                      ),
                      128
                    )),
                    0 === r.value.length
                      ? (fo(),
                        vo("div", Bb, [
                          ko(dl, { name: "inbox", size: "2rem" }),
                          n[6] || (n[6] = xo("p", null, "暂无会话数据", -1)),
                        ]))
                      : Ao("", !0),
                  ]),
                ]),
                xo("div", $b, [
                  xo("h2", Vb, [
                    ko(dl, { name: "zap", size: "1.25rem" }),
                    n[7] || (n[7] = xo("span", null, "快速操作", -1)),
                  ]),
                  xo("div", qb, [
                    xo(
                      "button",
                      {
                        onClick: n[0] || (n[0] = (t) => o()),
                        class: "action-btn",
                      },
                      [
                        ko(dl, { name: "network", size: "1.25rem" }),
                        n[8] || (n[8] = xo("span", null, "进入图谱", -1)),
                      ]
                    ),
                  ]),
                ]),
              ]),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-bd1e6ba3"]]
  ),
  Gb = Se([]),
  Wb = Se([]),
  Xb = Se([]);
let Yb = null;
const Jb = { class: "main-container" },
  Kb = { key: 0, class: "graph-view" },
  Zb = { key: 1, class: "dashboard-container" },
  Qb = pl(
    {
      __name: "GraphView",
      setup(t) {
        const e = Yc(),
          n = fl(),
          { connectWebSocket: r } = (function () {
            function t(t) {
              Gb.value.push({
                ...t,
                timestamp: t.timestamp || new Date().toISOString(),
              });
            }
            return {
              logs: Gb,
              tasks: Wb,
              messages: Xb,
              connectWebSocket: function e() {
                if (Yb && Yb.readyState === WebSocket.OPEN) return;
                const n = `${
                  "https:" === window.location.protocol ? "wss:" : "ws:"
                }//${window.location.host}/ws/status`;
                (Yb = new WebSocket(n)),
                  (Yb.onopen = () => {
                    t({ level: "INFO", message: "监控服务已连接。" });
                  }),
                  (Yb.onmessage = (e) => {
                    try {
                      const n = JSON.parse(e.data);
                      switch (n.type) {
                        case "log":
                          t(n.payload);
                          break;
                        case "task":
                          Wb.value.push(n.payload);
                          break;
                        case "message":
                          Xb.value.push(n.payload);
                      }
                    } catch (cw) {}
                  }),
                  (Yb.onclose = () => {
                    t({
                      level: "WARNING",
                      message: "监控服务已断开，3秒后重试...",
                    }),
                      setTimeout(e, 3e3);
                  }),
                  (Yb.onerror = (e) => {
                    t({ level: "ERROR", message: "监控服务连接错误。" }),
                      Yb.close();
                  });
              },
            };
          })();
        return (
          Bn(async () => {
            await e.fetchContexts(), await e.loadGraphData(), r();
          }),
          (t, e) => (
            fo(),
            vo("div", Jb, [
              ko(of),
              "graph" === Ae(n).activeView
                ? (fo(),
                  vo("div", Kb, [
                    ko(q_),
                    ko(K_),
                    ko(nb),
                    ko(cb),
                    ko(vb),
                    ko(Bf),
                  ]))
                : (fo(), vo("div", Zb, [ko(Hb)])),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-012259ef"]]
  ),
  tw = Ts("auth", () => {
    const t = Se(!1),
      e = Se(!1),
      n = xr(Ta),
      r = fl();
    function o() {
      (t.value = !1),
        sessionStorage.removeItem("session_token"),
        (document.cookie =
          "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"),
        n.push({ name: "login" });
    }
    return {
      isLoggedIn: t,
      sessionChecked: e,
      login: async function (e) {
        var o, i;
        try {
          const r = await ((t) => qc.post("/login", { key: t }))(e);
          if (r.data.token)
            return (
              sessionStorage.setItem("session_token", r.data.token),
              (t.value = !0),
              n.push({ name: "main" }),
              !0
            );
          throw new Error("服务器未返回有效的 token");
        } catch (s) {
          const e =
            (null == (i = null == (o = s.response) ? void 0 : o.data)
              ? void 0
              : i.detail) || "登录失败";
          return (
            r.showToast("登录失败", e, "error"),
            (t.value = !1),
            sessionStorage.removeItem("session_token"),
            (document.cookie =
              "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"),
            !1
          );
        }
      },
      logout: o,
      checkSession: async function () {
        if (sessionStorage.getItem("session_token"))
          try {
            await qc.get("/contexts"), (t.value = !0);
          } catch (n) {
            o();
          }
        else t.value = !1;
        e.value = !0;
      },
    };
  }),
  ew = { class: "login-screen" },
  nw = { class: "login-box glass" },
  rw = { key: 0 },
  ow = { key: 1, class: "loader" },
  iw = { key: 0, class: "login-error" },
  sw = pl(
    {
      __name: "LoginView",
      setup(t) {
        const e = Se(""),
          n = Se(!1),
          r = Se(""),
          o = tw();
        async function i() {
          if (!e.value.trim()) return;
          (n.value = !0), (r.value = "");
          (await o.login(e.value)) || (r.value = "访问密钥无效或连接失败"),
            (n.value = !1);
        }
        return (
          fl(),
          (t, o) => (
            fo(),
            vo("div", ew, [
              xo("div", nw, [
                o[1] ||
                  (o[1] = Co(
                    '<div style="margin-bottom:2rem;" data-v-22474a02><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-network" data-v-22474a02><rect width="18" height="18" x="3" y="3" rx="2" data-v-22474a02></rect><path d="M8 12h.01" data-v-22474a02></path><path d="M12 8h.01" data-v-22474a02></path><path d="M12 12h.01" data-v-22474a02></path><path d="M12 16h.01" data-v-22474a02></path><path d="M16 12h.01" data-v-22474a02></path><path d="M8 12v-1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5V12" data-v-22474a02></path><path d="M12 12v-1.5a.5.5 0 0 1 .5-.5h3.5" data-v-22474a02></path><path d="M12 12v1.5a.5.5 0 0 0 .5.5h3.5" data-v-22474a02></path><path d="M12 8v1.5a.5.5 0 0 0 .5.5h3.5" data-v-22474a02></path></svg></div><h2 style="font-size:1.25rem;font-weight:300;letter-spacing:0.1em;margin-bottom:0.5rem;" data-v-22474a02>图谱记忆</h2><p style="font-size:0.75rem;color:#999;margin-bottom:2.5rem;letter-spacing:0.05em;" data-v-22474a02>可视化知识图谱</p>',
                    3
                  )),
                sn(
                  xo(
                    "input",
                    {
                      type: "password",
                      "onUpdate:modelValue":
                        o[0] || (o[0] = (t) => (e.value = t)),
                      onKeyup: as(i, ["enter"]),
                      placeholder: "访问密钥",
                      class: "login-key-input",
                    },
                    null,
                    544
                  ),
                  [[Qi, e.value]]
                ),
                xo("button", { onClick: i, class: "login-btn" }, [
                  n.value
                    ? (fo(), vo("div", ow))
                    : (fo(), vo("span", rw, "连接")),
                ]),
                r.value ? (fo(), vo("p", iw, J(r.value), 1)) : Ao("", !0),
              ]),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-22474a02"]]
  ),
  aw = (function (t) {
    const e = Za(t.routes, t),
      n = t.parseQuery || Sa,
      r = t.stringifyQuery || Ea,
      o = t.history,
      i = Ma(),
      s = Ma(),
      a = Ma(),
      l = Ee(ua, !0);
    let u = ua;
    Ns &&
      t.scrollBehavior &&
      "scrollRestoration" in history &&
      (history.scrollRestoration = "manual");
    const c = Rs.bind(null, (t) => "" + t),
      f = Rs.bind(null, ta),
      h = Rs.bind(null, ea);
    function d(t, i) {
      if (((i = Ms({}, i || l.value)), "string" == typeof t)) {
        const r = ra(n, t, i.path),
          s = e.resolve({ path: r.path }, i),
          a = o.createHref(r.fullPath);
        return Ms(r, s, {
          params: h(s.params),
          hash: ea(r.hash),
          redirectedFrom: void 0,
          href: a,
        });
      }
      let s;
      if (null != t.path) s = Ms({}, t, { path: ra(n, t.path, i.path).path });
      else {
        const e = Ms({}, t.params);
        for (const t in e) null == e[t] && delete e[t];
        (s = Ms({}, t, { params: f(e) })), (i.params = f(i.params));
      }
      const a = e.resolve(s, i),
        u = t.hash || "";
      a.params = c(h(a.params));
      const d = (function (t, e) {
        const n = e.query ? t(e.query) : "";
        return e.path + (n && "?") + n + (e.hash || "");
      })(
        r,
        Ms({}, t, {
          hash:
            ((p = u), Ks(p).replace(Ws, "{").replace(Ys, "}").replace(Hs, "^")),
          path: a.path,
        })
      );
      var p;
      const g = o.createHref(d);
      return Ms(
        { fullPath: d, hash: u, query: r === Ea ? Ca(t.query) : t.query || {} },
        a,
        { redirectedFrom: void 0, href: g }
      );
    }
    function p(t) {
      return "string" == typeof t ? ra(n, t, l.value.path) : Ms({}, t);
    }
    function g(t, e) {
      if (u !== t) return xa(ba.NAVIGATION_CANCELLED, { from: e, to: t });
    }
    function v(t) {
      return m(t);
    }
    function y(t, e) {
      const n = t.matched[t.matched.length - 1];
      if (n && n.redirect) {
        const { redirect: r } = n;
        let o = "function" == typeof r ? r(t, e) : r;
        return (
          "string" == typeof o &&
            ((o =
              o.includes("?") || o.includes("#") ? (o = p(o)) : { path: o }),
            (o.params = {})),
          Ms(
            {
              query: t.query,
              hash: t.hash,
              params: null != o.path ? {} : t.params,
            },
            o
          )
        );
      }
    }
    function m(t, e) {
      const n = (u = d(t)),
        o = l.value,
        i = t.state,
        s = t.force,
        a = !0 === t.replace,
        c = y(n, o);
      if (c)
        return m(
          Ms(p(c), {
            state: "object" == typeof c ? Ms({}, i, c.state) : i,
            force: s,
            replace: a,
          }),
          e || n
        );
      const f = n;
      let h;
      return (
        (f.redirectedFrom = e),
        !s &&
          (function (t, e, n) {
            const r = e.matched.length - 1,
              o = n.matched.length - 1;
            return (
              r > -1 &&
              r === o &&
              ia(e.matched[r], n.matched[o]) &&
              sa(e.params, n.params) &&
              t(e.query) === t(n.query) &&
              e.hash === n.hash
            );
          })(r, o, n) &&
          ((h = xa(ba.NAVIGATION_DUPLICATED, { to: f, from: o })),
          P(o, o, !0, !1)),
        (h ? Promise.resolve(h) : w(f, o))
          .catch((t) =>
            ka(t)
              ? ka(t, ba.NAVIGATION_GUARD_REDIRECT)
                ? t
                : N(t)
              : T(t, f, o)
          )
          .then((t) => {
            if (t) {
              if (ka(t, ba.NAVIGATION_GUARD_REDIRECT))
                return m(
                  Ms({ replace: a }, p(t.to), {
                    state: "object" == typeof t.to ? Ms({}, i, t.to.state) : i,
                    force: s,
                  }),
                  e || f
                );
            } else t = k(f, o, !0, a, i);
            return x(f, o, t), t;
          })
      );
    }
    function _(t, e) {
      const n = g(t, e);
      return n ? Promise.reject(n) : Promise.resolve();
    }
    function b(t) {
      const e = j.values().next().value;
      return e && "function" == typeof e.runWithContext
        ? e.runWithContext(t)
        : t();
    }
    function w(t, e) {
      let n;
      const [r, o, a] = (function (t, e) {
        const n = [],
          r = [],
          o = [],
          i = Math.max(e.matched.length, t.matched.length);
        for (let s = 0; s < i; s++) {
          const i = e.matched[s];
          i && (t.matched.find((t) => ia(t, i)) ? r.push(i) : n.push(i));
          const a = t.matched[s];
          a && (e.matched.find((t) => ia(t, a)) || o.push(a));
        }
        return [n, r, o];
      })(
        /*!
         * vue-router v4.6.3
         * (c) 2025 Eduardo San Martin Morote
         * @license MIT
         */ t,
        e
      );
      n = ja(r.reverse(), "beforeRouteLeave", t, e);
      for (const i of r)
        i.leaveGuards.forEach((r) => {
          n.push(Ra(r, t, e));
        });
      const l = _.bind(null, t, e);
      return (
        n.push(l),
        D(n)
          .then(() => {
            n = [];
            for (const r of i.list()) n.push(Ra(r, t, e));
            return n.push(l), D(n);
          })
          .then(() => {
            n = ja(o, "beforeRouteUpdate", t, e);
            for (const r of o)
              r.updateGuards.forEach((r) => {
                n.push(Ra(r, t, e));
              });
            return n.push(l), D(n);
          })
          .then(() => {
            n = [];
            for (const r of a)
              if (r.beforeEnter)
                if (zs(r.beforeEnter))
                  for (const o of r.beforeEnter) n.push(Ra(o, t, e));
                else n.push(Ra(r.beforeEnter, t, e));
            return n.push(l), D(n);
          })
          .then(
            () => (
              t.matched.forEach((t) => (t.enterCallbacks = {})),
              (n = ja(a, "beforeRouteEnter", t, e, b)),
              n.push(l),
              D(n)
            )
          )
          .then(() => {
            n = [];
            for (const r of s.list()) n.push(Ra(r, t, e));
            return n.push(l), D(n);
          })
          .catch((t) =>
            ka(t, ba.NAVIGATION_CANCELLED) ? t : Promise.reject(t)
          )
      );
    }
    function x(t, e, n) {
      a.list().forEach((r) => b(() => r(t, e, n)));
    }
    function k(t, e, n, r, i) {
      const s = g(t, e);
      if (s) return s;
      const a = e === ua,
        u = Ns ? history.state : {};
      n &&
        (r || a
          ? o.replace(t.fullPath, Ms({ scroll: a && u && u.scroll }, i))
          : o.push(t.fullPath, i)),
        (l.value = t),
        P(t, e, n, a),
        N();
    }
    let S;
    function E() {
      S ||
        (S = o.listen((t, e, n) => {
          if (!z.listening) return;
          const r = d(t),
            i = y(r, z.currentRoute.value);
          if (i) return void m(Ms(i, { replace: !0, force: !0 }), r).catch(js);
          u = r;
          const s = l.value;
          var a, c;
          Ns && ((a = ya(s.fullPath, n.delta)), (c = ga()), ma.set(a, c)),
            w(r, s)
              .catch((t) =>
                ka(t, ba.NAVIGATION_ABORTED | ba.NAVIGATION_CANCELLED)
                  ? t
                  : ka(t, ba.NAVIGATION_GUARD_REDIRECT)
                  ? (m(Ms(p(t.to), { force: !0 }), r)
                      .then((t) => {
                        ka(
                          t,
                          ba.NAVIGATION_ABORTED | ba.NAVIGATION_DUPLICATED
                        ) &&
                          !n.delta &&
                          n.type === ca.pop &&
                          o.go(-1, !1);
                      })
                      .catch(js),
                    Promise.reject())
                  : (n.delta && o.go(-n.delta, !1), T(t, r, s))
              )
              .then((t) => {
                (t = t || k(r, s, !1)) &&
                  (n.delta && !ka(t, ba.NAVIGATION_CANCELLED)
                    ? o.go(-n.delta, !1)
                    : n.type === ca.pop &&
                      ka(t, ba.NAVIGATION_ABORTED | ba.NAVIGATION_DUPLICATED) &&
                      o.go(-1, !1)),
                  x(r, s, t);
              })
              .catch(js);
        }));
    }
    let C,
      A = Ma(),
      O = Ma();
    function T(t, e, n) {
      N(t);
      const r = O.list();
      return r.length && r.forEach((r) => r(t, e, n)), Promise.reject(t);
    }
    function N(t) {
      return (
        C ||
          ((C = !t),
          E(),
          A.list().forEach(([e, n]) => (t ? n(t) : e())),
          A.reset()),
        t
      );
    }
    function P(e, n, r, o) {
      const { scrollBehavior: i } = t;
      if (!Ns || !i) return Promise.resolve();
      const s =
        (!r &&
          (function (t) {
            const e = ma.get(t);
            return ma.delete(t), e;
          })(ya(e.fullPath, 0))) ||
        ((o || !r) && history.state && history.state.scroll) ||
        null;
      return Xe()
        .then(() => i(e, n, s))
        .then((t) => t && va(t))
        .catch((t) => T(t, e, n));
    }
    const M = (t) => o.go(t);
    let R;
    const j = new Set(),
      z = {
        currentRoute: l,
        listening: !0,
        addRoute: function (t, n) {
          let r, o;
          return (
            _a(t) ? ((r = e.getRecordMatcher(t)), (o = n)) : (o = t),
            e.addRoute(o, r)
          );
        },
        removeRoute: function (t) {
          const n = e.getRecordMatcher(t);
          n && e.removeRoute(n);
        },
        clearRoutes: e.clearRoutes,
        hasRoute: function (t) {
          return !!e.getRecordMatcher(t);
        },
        getRoutes: function () {
          return e.getRoutes().map((t) => t.record);
        },
        resolve: d,
        options: t,
        push: v,
        replace: function (t) {
          return v(Ms(p(t), { replace: !0 }));
        },
        go: M,
        back: () => M(-1),
        forward: () => M(1),
        beforeEach: i.add,
        beforeResolve: s.add,
        afterEach: a.add,
        onError: O.add,
        isReady: function () {
          return C && l.value !== ua
            ? Promise.resolve()
            : new Promise((t, e) => {
                A.add([t, e]);
              });
        },
        install(t) {
          t.component("RouterLink", sl),
            t.component("RouterView", cl),
            (t.config.globalProperties.$router = z),
            Object.defineProperty(t.config.globalProperties, "$route", {
              enumerable: !0,
              get: () => Ae(l),
            }),
            Ns &&
              !R &&
              l.value === ua &&
              ((R = !0), v(o.location).catch((t) => {}));
          const e = {};
          for (const r in ua)
            Object.defineProperty(e, r, {
              get: () => l.value[r],
              enumerable: !0,
            });
          t.provide(Ta, z), t.provide(Na, he(e)), t.provide(Pa, l);
          const n = t.unmount;
          j.add(t),
            (t.unmount = function () {
              j.delete(t),
                j.size < 1 &&
                  ((u = ua),
                  S && S(),
                  (S = null),
                  (l.value = ua),
                  (R = !1),
                  (C = !1)),
                n();
            });
        },
      };
    function D(t) {
      return t.reduce((t, e) => t.then(() => b(e)), Promise.resolve());
    }
    return z;
  })({
    history:
      ((lw = location.host
        ? lw || location.pathname + location.search
        : "").includes("#") || (lw += "#"),
      La(lw)),
    routes: [
      { path: "/", name: "main", component: Qb, meta: { requiresAuth: !0 } },
      { path: "/login", name: "login", component: sw },
    ],
  });
var lw;
aw.beforeEach(async (t, e, n) => {
  const r = tw();
  r.sessionChecked || (await r.checkSession());
  t.matched.some((t) => t.meta.requiresAuth) && !r.isLoggedIn
    ? n({ name: "login" })
    : "login" === t.name && r.isLoggedIn
    ? n({ name: "main" })
    : n();
});
const uw = ((...t) => {
  const e = (us || (us = Zr(ls))).createApp(...t),
    { mount: n } = e;
  return (
    (e.mount = (t) => {
      const r = (function (t) {
        if (y(t)) {
          return document.querySelector(t);
        }
        return t;
      })(t);
      if (!r) return;
      const o = e._component;
      v(o) || o.render || o.template || (o.template = r.innerHTML),
        1 === r.nodeType && (r.textContent = "");
      const i = n(
        r,
        !1,
        (function (t) {
          if (t instanceof SVGElement) return "svg";
          if ("function" == typeof MathMLElement && t instanceof MathMLElement)
            return "mathml";
        })(r)
      );
      return (
        r instanceof Element &&
          (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")),
        i
      );
    }),
    e
  );
})(xl);
uw.use(
  (function () {
    const t = nt(!0),
      e = t.run(() => Se({}));
    let n = [],
      r = [];
    const o = be({
      install(t) {
        fs(o),
          (o._a = t),
          t.provide(hs, o),
          (t.config.globalProperties.$pinia = o),
          r.forEach((t) => n.push(t)),
          (r = []);
      },
      use(t) {
        return this._a ? n.push(t) : r.push(t), this;
      },
      _p: n,
      _a: null,
      _e: t,
      _s: new Map(),
      state: e,
    });
    return o;
  })()
),
  uw.use(aw),
  uw.mount("#app");
export {
  io as F,
  pl as _,
  fl as a,
  xo as b,
  vo as c,
  Ao as d,
  ko as e,
  dl as f,
  Wc as g,
  Wo as h,
  Eo as i,
  Gc as j,
  Bn as k,
  Xc as l,
  Hn as m,
  q as n,
  fo as o,
  Qn as p,
  ns as q,
  Se as r,
  as as s,
  J as t,
  Yc as u,
  Qi as v,
  sn as w,
  yo as x,
  Hc as y,
};
