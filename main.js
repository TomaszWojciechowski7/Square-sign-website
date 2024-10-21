"use strict";
( () => {
    var V, $, P = function() {
        var e = self.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
        if (e && e.responseStart > 0 && e.responseStart < performance.now())
            return e
    }, R = function(e) {
        if (document.readyState === "loading")
            return "loading";
        var t = P();
        if (t) {
            if (e < t.domInteractive)
                return "loading";
            if (t.domContentLoadedEventStart === 0 || e < t.domContentLoadedEventStart)
                return "dom-interactive";
            if (t.domComplete === 0 || e < t.domComplete)
                return "dom-content-loaded"
        }
        return "complete"
    }, Ie = function(e) {
        var t = e.nodeName;
        return e.nodeType === 1 ? t.toLowerCase() : t.toUpperCase().replace(/^#/, "")
    }, G = function(e, t) {
        var r = "";
        try {
            for (; e && e.nodeType !== 9; ) {
                var a = e
                  , i = a.id ? "#" + a.id : Ie(a) + (a.classList && a.classList.value && a.classList.value.trim() && a.classList.value.trim().length ? "." + a.classList.value.trim().replace(/\s+/g, ".") : "");
                if (r.length + i.length > (t || 100) - 1)
                    return r || i;
                if (r = r ? i + ">" + r : i,
                a.id)
                    break;
                e = a.parentNode
            }
        } catch {}
        return r
    }, oe = -1, se = function() {
        return oe
    }, M = function(e) {
        addEventListener("pageshow", function(t) {
            t.persisted && (oe = t.timeStamp,
            e(t))
        }, !0)
    }, _ = function() {
        var e = P();
        return e && e.activationStart || 0
    }, g = function(e, t) {
        var r = P()
          , a = "navigate";
        return se() >= 0 ? a = "back-forward-cache" : r && (document.prerendering || _() > 0 ? a = "prerender" : document.wasDiscarded ? a = "restore" : r.type && (a = r.type.replace(/_/g, "-"))),
        {
            name: e,
            value: t === void 0 ? -1 : t,
            rating: "good",
            delta: 0,
            entries: [],
            id: "v4-".concat(Date.now(), "-").concat(Math.floor(8999999999999 * Math.random()) + 1e12),
            navigationType: a
        }
    }, L = function(e, t, r) {
        try {
            if (PerformanceObserver.supportedEntryTypes.includes(e)) {
                var a = new PerformanceObserver(function(i) {
                    Promise.resolve().then(function() {
                        t(i.getEntries())
                    })
                }
                );
                return a.observe(Object.assign({
                    type: e,
                    buffered: !0
                }, r || {})),
                a
            }
        } catch {}
    }, v = function(e, t, r, a) {
        var i, n;
        return function(o) {
            t.value >= 0 && (o || a) && ((n = t.value - (i || 0)) || i === void 0) && (i = t.value,
            t.delta = n,
            t.rating = function(s, u) {
                return s > u[1] ? "poor" : s > u[0] ? "needs-improvement" : "good"
            }(t.value, r),
            e(t))
        }
    }, J = function(e) {
        requestAnimationFrame(function() {
            return requestAnimationFrame(function() {
                return e()
            })
        })
    }, W = function(e) {
        document.addEventListener("visibilitychange", function() {
            document.visibilityState === "hidden" && e()
        })
    }, Z = function(e) {
        var t = !1;
        return function() {
            t || (e(),
            t = !0)
        }
    }, b = -1, Q = function() {
        return document.visibilityState !== "hidden" || document.prerendering ? 1 / 0 : 0
    }, B = function(e) {
        document.visibilityState === "hidden" && b > -1 && (b = e.type === "visibilitychange" ? e.timeStamp : 0,
        Fe())
    }, ee = function() {
        addEventListener("visibilitychange", B, !0),
        addEventListener("prerenderingchange", B, !0)
    }, Fe = function() {
        removeEventListener("visibilitychange", B, !0),
        removeEventListener("prerenderingchange", B, !0)
    }, ce = function() {
        return b < 0 && (b = Q(),
        ee(),
        M(function() {
            setTimeout(function() {
                b = Q(),
                ee()
            }, 0)
        })),
        {
            get firstHiddenTime() {
                return b
            }
        }
    }, z = function(e) {
        document.prerendering ? addEventListener("prerenderingchange", function() {
            return e()
        }, !0) : e()
    }, te = [1800, 3e3], ue = function(e, t) {
        t = t || {},
        z(function() {
            var r, a = ce(), i = g("FCP"), n = L("paint", function(o) {
                o.forEach(function(s) {
                    s.name === "first-contentful-paint" && (n.disconnect(),
                    s.startTime < a.firstHiddenTime && (i.value = Math.max(s.startTime - _(), 0),
                    i.entries.push(s),
                    r(!0)))
                })
            });
            n && (r = v(e, i, te, t.reportAllChanges),
            M(function(o) {
                i = g("FCP"),
                r = v(e, i, te, t.reportAllChanges),
                J(function() {
                    i.value = performance.now() - o.timeStamp,
                    r(!0)
                })
            }))
        })
    }, ne = [.1, .25], de = function(e, t) {
        (function(r, a) {
            a = a || {},
            ue(Z(function() {
                var i, n = g("CLS", 0), o = 0, s = [], u = function(l) {
                    l.forEach(function(c) {
                        if (!c.hadRecentInput) {
                            var f = s[0]
                              , h = s[s.length - 1];
                            o && c.startTime - h.startTime < 1e3 && c.startTime - f.startTime < 5e3 ? (o += c.value,
                            s.push(c)) : (o = c.value,
                            s = [c])
                        }
                    }),
                    o > n.value && (n.value = o,
                    n.entries = s,
                    i())
                }, d = L("layout-shift", u);
                d && (i = v(r, n, ne, a.reportAllChanges),
                W(function() {
                    u(d.takeRecords()),
                    i(!0)
                }),
                M(function() {
                    o = 0,
                    n = g("CLS", 0),
                    i = v(r, n, ne, a.reportAllChanges),
                    J(function() {
                        return i()
                    })
                }),
                setTimeout(i, 0))
            }))
        }
        )(function(r) {
            var a = function(i) {
                var n, o = {};
                if (i.entries.length) {
                    var s = i.entries.reduce(function(d, l) {
                        return d && d.value > l.value ? d : l
                    });
                    if (s && s.sources && s.sources.length) {
                        var u = (n = s.sources).find(function(d) {
                            return d.node && d.node.nodeType === 1
                        }) || n[0];
                        u && (o = {
                            largestShiftTarget: G(u.node),
                            largestShiftTime: s.startTime,
                            largestShiftValue: s.value,
                            largestShiftSource: u,
                            largestShiftEntry: s,
                            loadState: R(s.startTime)
                        })
                    }
                }
                return Object.assign(i, {
                    attribution: o
                })
            }(r);
            e(a)
        }, t)
    }, le = function(e, t) {
        ue(function(r) {
            var a = function(i) {
                var n = {
                    timeToFirstByte: 0,
                    firstByteToFCP: i.value,
                    loadState: R(se())
                };
                if (i.entries.length) {
                    var o = P()
                      , s = i.entries[i.entries.length - 1];
                    if (o) {
                        var u = o.activationStart || 0
                          , d = Math.max(0, o.responseStart - u);
                        n = {
                            timeToFirstByte: d,
                            firstByteToFCP: i.value - d,
                            loadState: R(i.entries[0].startTime),
                            navigationEntry: o,
                            fcpEntry: s
                        }
                    }
                }
                return Object.assign(i, {
                    attribution: n
                })
            }(r);
            e(a)
        }, t)
    }, fe = 0, q = 1 / 0, A = 0, xe = function(e) {
        e.forEach(function(t) {
            t.interactionId && (q = Math.min(q, t.interactionId),
            A = Math.max(A, t.interactionId),
            fe = A ? (A - q) / 7 + 1 : 0)
        })
    }, me = function() {
        return V ? fe : performance.interactionCount || 0
    }, Ae = function() {
        "interactionCount"in performance || V || (V = L("event", xe, {
            type: "event",
            buffered: !0,
            durationThreshold: 0
        }))
    }, p = [], D = new Map, pe = 0, Re = function() {
        var e = Math.min(p.length - 1, Math.floor((me() - pe) / 50));
        return p[e]
    }, ge = [], Be = function(e) {
        if (ge.forEach(function(i) {
            return i(e)
        }),
        e.interactionId || e.entryType === "first-input") {
            var t = p[p.length - 1]
              , r = D.get(e.interactionId);
            if (r || p.length < 10 || e.duration > t.latency) {
                if (r)
                    e.duration > r.latency ? (r.entries = [e],
                    r.latency = e.duration) : e.duration === r.latency && e.startTime === r.entries[0].startTime && r.entries.push(e);
                else {
                    var a = {
                        id: e.interactionId,
                        latency: e.duration,
                        entries: [e]
                    };
                    D.set(a.id, a),
                    p.push(a)
                }
                p.sort(function(i, n) {
                    return n.latency - i.latency
                }),
                p.length > 10 && p.splice(10).forEach(function(i) {
                    return D.delete(i.id)
                })
            }
        }
    }, K = function(e) {
        var t = self.requestIdleCallback || self.setTimeout
          , r = -1;
        return e = Z(e),
        document.visibilityState === "hidden" ? e() : (r = t(e),
        W(e)),
        r
    }, re = [200, 500], _e = function(e, t) {
        "PerformanceEventTiming"in self && "interactionId"in PerformanceEventTiming.prototype && (t = t || {},
        z(function() {
            var r;
            Ae();
            var a, i = g("INP"), n = function(s) {
                K(function() {
                    s.forEach(Be);
                    var u = Re();
                    u && u.latency !== i.value && (i.value = u.latency,
                    i.entries = u.entries,
                    a())
                })
            }, o = L("event", n, {
                durationThreshold: (r = t.durationThreshold) !== null && r !== void 0 ? r : 40
            });
            a = v(e, i, re, t.reportAllChanges),
            o && (o.observe({
                type: "first-input",
                buffered: !0
            }),
            W(function() {
                n(o.takeRecords()),
                a(!0)
            }),
            M(function() {
                pe = me(),
                p.length = 0,
                D.clear(),
                i = g("INP"),
                a = v(e, i, re, t.reportAllChanges)
            }))
        }))
    }, w = [], T = [], U = 0, X = new WeakMap, C = new Map, j = -1, We = function(e) {
        w = w.concat(e),
        ve()
    }, ve = function() {
        j < 0 && (j = K(ze))
    }, ze = function() {
        C.size > 10 && C.forEach(function(o, s) {
            D.has(s) || C.delete(s)
        });
        var e = p.map(function(o) {
            return X.get(o.entries[0])
        })
          , t = T.length - 50;
        T = T.filter(function(o, s) {
            return s >= t || e.includes(o)
        });
        for (var r = new Set, a = 0; a < T.length; a++) {
            var i = T[a];
            he(i.startTime, i.processingEnd).forEach(function(o) {
                r.add(o)
            })
        }
        var n = w.length - 1 - 50;
        w = w.filter(function(o, s) {
            return o.startTime > U && s > n || r.has(o)
        }),
        j = -1
    };
    ge.push(function(e) {
        e.interactionId && e.target && !C.has(e.interactionId) && C.set(e.interactionId, e.target)
    }, function(e) {
        var t, r = e.startTime + e.duration;
        U = Math.max(U, e.processingEnd);
        for (var a = T.length - 1; a >= 0; a--) {
            var i = T[a];
            if (Math.abs(r - i.renderTime) <= 8) {
                (t = i).startTime = Math.min(e.startTime, t.startTime),
                t.processingStart = Math.min(e.processingStart, t.processingStart),
                t.processingEnd = Math.max(e.processingEnd, t.processingEnd),
                t.entries.push(e);
                break
            }
        }
        t || (t = {
            startTime: e.startTime,
            processingStart: e.processingStart,
            processingEnd: e.processingEnd,
            renderTime: r,
            entries: [e]
        },
        T.push(t)),
        (e.interactionId || e.entryType === "first-input") && X.set(e, t),
        ve()
    });
    var he = function(e, t) {
        for (var r, a = [], i = 0; r = w[i]; i++)
            if (!(r.startTime + r.duration < e)) {
                if (r.startTime > t)
                    break;
                a.push(r)
            }
        return a
    }
      , Te = function(e, t) {
        $ || ($ = L("long-animation-frame", We)),
        _e(function(r) {
            var a = function(i) {
                var n = i.entries[0]
                  , o = X.get(n)
                  , s = n.processingStart
                  , u = o.processingEnd
                  , d = o.entries.sort(function(E, De) {
                    return E.processingStart - De.processingStart
                })
                  , l = he(n.startTime, u)
                  , c = i.entries.find(function(E) {
                    return E.target
                })
                  , f = c && c.target || C.get(n.interactionId)
                  , h = [n.startTime + n.duration, u].concat(l.map(function(E) {
                    return E.startTime + E.duration
                }))
                  , x = Math.max.apply(Math, h)
                  , ke = {
                    interactionTarget: G(f),
                    interactionTargetElement: f,
                    interactionType: n.name.startsWith("key") ? "keyboard" : "pointer",
                    interactionTime: n.startTime,
                    nextPaintTime: x,
                    processedEventEntries: d,
                    longAnimationFrameEntries: l,
                    inputDelay: s - n.startTime,
                    processingDuration: u - s,
                    presentationDelay: Math.max(x - u, 0),
                    loadState: R(n.startTime)
                };
                return Object.assign(i, {
                    attribution: ke
                })
            }(r);
            e(a)
        }, t)
    }
      , ie = [2500, 4e3]
      , H = {}
      , ye = function(e, t) {
        (function(r, a) {
            a = a || {},
            z(function() {
                var i, n = ce(), o = g("LCP"), s = function(l) {
                    a.reportAllChanges || (l = l.slice(-1)),
                    l.forEach(function(c) {
                        c.startTime < n.firstHiddenTime && (o.value = Math.max(c.startTime - _(), 0),
                        o.entries = [c],
                        i())
                    })
                }, u = L("largest-contentful-paint", s);
                if (u) {
                    i = v(r, o, ie, a.reportAllChanges);
                    var d = Z(function() {
                        H[o.id] || (s(u.takeRecords()),
                        u.disconnect(),
                        H[o.id] = !0,
                        i(!0))
                    });
                    ["keydown", "click"].forEach(function(l) {
                        addEventListener(l, function() {
                            return K(d)
                        }, !0)
                    }),
                    W(d),
                    M(function(l) {
                        o = g("LCP"),
                        i = v(r, o, ie, a.reportAllChanges),
                        J(function() {
                            o.value = performance.now() - l.timeStamp,
                            H[o.id] = !0,
                            i(!0)
                        })
                    })
                }
            })
        }
        )(function(r) {
            var a = function(i) {
                var n = {
                    timeToFirstByte: 0,
                    resourceLoadDelay: 0,
                    resourceLoadDuration: 0,
                    elementRenderDelay: i.value
                };
                if (i.entries.length) {
                    var o = P();
                    if (o) {
                        var s = o.activationStart || 0
                          , u = i.entries[i.entries.length - 1]
                          , d = u.url && performance.getEntriesByType("resource").filter(function(x) {
                            return x.name === u.url
                        })[0]
                          , l = Math.max(0, o.responseStart - s)
                          , c = Math.max(l, d ? (d.requestStart || d.startTime) - s : 0)
                          , f = Math.max(c, d ? d.responseEnd - s : 0)
                          , h = Math.max(f, u.startTime - s);
                        n = {
                            element: G(u.element),
                            timeToFirstByte: l,
                            resourceLoadDelay: c - l,
                            resourceLoadDuration: f - c,
                            elementRenderDelay: h - f,
                            navigationEntry: o,
                            lcpEntry: u
                        },
                        u.url && (n.url = u.url),
                        d && (n.lcpResourceEntry = d)
                    }
                }
                return Object.assign(i, {
                    attribution: n
                })
            }(r);
            e(a)
        }, t)
    }
      , ae = [800, 1800]
      , Oe = function e(t) {
        document.prerendering ? z(function() {
            return e(t)
        }) : document.readyState !== "complete" ? addEventListener("load", function() {
            return e(t)
        }, !0) : setTimeout(t, 0)
    }
      , Ne = function(e, t) {
        t = t || {};
        var r = g("TTFB")
          , a = v(e, r, ae, t.reportAllChanges);
        Oe(function() {
            var i = P();
            i && (r.value = Math.max(i.responseStart - _(), 0),
            r.entries = [i],
            a(!0),
            M(function() {
                r = g("TTFB", 0),
                (a = v(e, r, ae, t.reportAllChanges))(!0)
            }))
        })
    }
      , Se = function(e, t) {
        Ne(function(r) {
            var a = function(i) {
                var n = {
                    waitingDuration: 0,
                    cacheDuration: 0,
                    dnsDuration: 0,
                    connectionDuration: 0,
                    requestDuration: 0
                };
                if (i.entries.length) {
                    var o = i.entries[0]
                      , s = o.activationStart || 0
                      , u = Math.max((o.workerStart || o.fetchStart) - s, 0)
                      , d = Math.max(o.domainLookupStart - s, 0)
                      , l = Math.max(o.connectStart - s, 0)
                      , c = Math.max(o.connectEnd - s, 0);
                    n = {
                        waitingDuration: u,
                        cacheDuration: d - u,
                        dnsDuration: l - d,
                        connectionDuration: c - l,
                        requestDuration: i.value - c,
                        navigationEntry: o
                    }
                }
                return Object.assign(i, {
                    attribution: n
                })
            }(r);
            e(a)
        }, t)
    };
    function qe(e) {
        for (let t in e)
            if (e[t] !== void 0)
                return !0;
        return !1
    }
    function S(e) {
        return qe(e) ? e : void 0
    }
    function y() {
        return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
    }
    function He() {
        return "" + y() + y() + "-" + y() + "-" + y() + "-" + y() + "-" + y() + y() + y()
    }
    var m = class {
        constructor(t, r) {
            this.event = t;
            this.data = r
        }
        serialize() {
            return {
                source: "framer.site",
                timestamp: Date.now(),
                data: {
                    type: "track",
                    uuid: He(),
                    event: this.event,
                    ...this.data
                }
            }
        }
    }
    ;
    function we(e) {
        let t = new Set;
        try {
            ye(n => t.add(n)),
            le(n => t.add(n)),
            de( ({delta: n, ...o}) => {
                t.add({
                    ...o,
                    delta: n * 1e3
                })
            }
            ),
            Te(n => t.add(n)),
            Se(n => t.add(n))
        } catch {}
        let r = new Set([...performance.getEntriesByType("mark"), ...performance.getEntriesByType("measure")].filter(n => n.name.startsWith("framer-")));
        new PerformanceObserver(n => {
            n.getEntries().forEach(s => {
                s.name.startsWith("framer-") && r.add(s)
            }
            )
        }
        ).observe({
            entryTypes: ["measure", "mark"]
        });
        let a = document.getElementById("main").dataset
          , i = {
            pageOptimizedAt: a.framerPageOptimizedAt ? new Date(a.framerPageOptimizedAt).getTime() : null,
            ssrReleasedAt: a.framerSsrReleasedAt ? new Date(a.framerSsrReleasedAt).getTime() : null,
            origin: document.location.origin,
            pathname: document.location.pathname,
            search: document.location.search
        };
        addEventListener("visibilitychange", () => {
            document.visibilityState === "hidden" && be(t, r, i, e)
        }
        ),
        addEventListener("pagehide", () => be(t, r, i, e))
    }
    var Ee = !1;
    function be(e, t, r, a) {
        let i = [];
        if (Ee || (i.push(Ve(r)),
        Ee = !0),
        e.size > 0 && (i.push(...Ue(e, r)),
        e.clear()),
        t.size > 0) {
            let n = je(t);
            n && i.push(n),
            t.clear()
        }
        a(i)
    }
    function Ve({pageOptimizedAt: e, ssrReleasedAt: t, origin: r, pathname: a, search: i}) {
        var u, d, l, c, f, h;
        let n = performance.getEntriesByType("navigation")[0]
          , o = document.querySelector("[data-framer-css-ssr-minified]");
        return new m("published_site_performance",{
            domNodes: document.getElementsByTagName("*").length,
            pageLoadDurationMs: (n == null ? void 0 : n.domContentLoadedEventEnd) !== void 0 && n.domContentLoadedEventStart !== void 0 ? Math.round(n.domContentLoadedEventEnd - n.domContentLoadedEventStart) : null,
            timeToFirstByteMs: n ? Math.round(n.responseStart) : null,
            resourcesCount: performance.getEntriesByType("resource").length,
            framerCSSSize: (u = o == null ? void 0 : o.textContent) == null ? void 0 : u.length,
            headSize: document.head.innerHTML.length,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hydrationDurationMs: null,
            pageOptimizedAt: e,
            ssrReleasedAt: t,
            devicePixelRatio: window.devicePixelRatio,
            navigationTiming: n ? {
                activationStart: n.activationStart,
                connectEnd: n.connectEnd,
                connectStart: n.connectStart,
                criticalCHRestart: n.criticalCHRestart,
                decodedBodySize: n.decodedBodySize,
                deliveryType: n.deliveryType,
                domComplete: n.domComplete,
                domContentLoadedEventEnd: n.domContentLoadedEventEnd,
                domContentLoadedEventStart: n.domContentLoadedEventStart,
                domInteractive: n.domInteractive,
                domainLookupEnd: n.domainLookupEnd,
                domainLookupStart: n.domainLookupStart,
                duration: n.duration,
                encodedBodySize: n.encodedBodySize,
                fetchStart: n.fetchStart,
                firstInterimResponseStart: n.firstInterimResponseStart,
                loadEventEnd: n.loadEventEnd,
                loadEventStart: n.loadEventStart,
                nextHopProtocol: n.nextHopProtocol,
                redirectCount: n.redirectCount,
                redirectEnd: n.redirectEnd,
                redirectStart: n.redirectStart,
                requestStart: n.requestStart,
                responseEnd: n.responseEnd,
                responseStart: n.responseStart,
                responseStatus: n.responseStatus,
                secureConnectionStart: n.secureConnectionStart,
                serverTiming: n.serverTiming ? JSON.stringify(n.serverTiming) : null,
                startTime: n.startTime,
                transferSize: n.transferSize,
                type: n.type,
                unloadEventEnd: n.unloadEventEnd,
                unloadEventStart: n.unloadEventStart,
                workerStart: n.workerStart
            } : void 0,
            connection: S({
                downlink: (d = navigator.connection) == null ? void 0 : d.downlink,
                downlinkMax: (l = navigator.connection) == null ? void 0 : l.downlinkMax,
                rtt: (c = navigator.connection) == null ? void 0 : c.rtt,
                saveData: (f = navigator.connection) == null ? void 0 : f.saveData,
                type: (h = navigator.connection) == null ? void 0 : h.type
            }),
            context: {
                origin: r,
                pathname: a,
                search: i
            }
        })
    }
    function Ue(e, {pageOptimizedAt: t, ssrReleasedAt: r, origin: a, pathname: i, search: n}) {
        let o = [];
        return e.forEach(s => {
            e.delete(s);
            let {name: u, delta: d, id: l, attribution: c} = s
              , f = {
                metric: u,
                label: l,
                value: Math.round(d),
                pageOptimizedAt: t,
                ssrReleasedAt: r,
                context: {
                    origin: a,
                    pathname: i,
                    search: n
                },
                attributionLcp: void 0,
                attributionCls: void 0,
                attributionInp: void 0,
                attributionFcp: void 0,
                attributionTtfb: void 0
            };
            u === "LCP" ? f.attributionLcp = S({
                element: c.element,
                timeToFirstByte: c.timeToFirstByte,
                resourceLoadDelay: c.resourceLoadDelay,
                resourceLoadTime: c.resourceLoadDuration,
                elementRenderDelay: c.elementRenderDelay,
                url: c.url
            }) : u === "CLS" ? f.attributionCls = S({
                largestShiftTarget: c.largestShiftTarget,
                largestShiftTime: c.largestShiftTime,
                largestShiftValue: c.largestShiftValue,
                loadState: c.loadState
            }) : u === "INP" ? f.attributionInp = S({
                eventTarget: c.interactionTarget,
                eventType: c.interactionType,
                eventTime: c.interactionTime ? Math.round(c.interactionTime) : void 0,
                loadState: c.loadState,
                inputDelay: c.inputDelay,
                processingDuration: c.processingDuration,
                presentationDelay: c.presentationDelay,
                nextPaintTime: c.nextPaintTime
            }) : u === "FCP" ? f.attributionFcp = S({
                timeToFirstByte: c.timeToFirstByte,
                firstByteToFCP: c.firstByteToFCP,
                loadState: c.loadState
            }) : u === "TTFB" && (f.attributionTtfb = S({
                waitingTime: c.waitingDuration,
                dnsTime: c.dnsDuration,
                connectionTime: c.connectionDuration,
                requestTime: c.requestDuration,
                cacheDuration: c.cacheDuration
            })),
            o.push(new m("published_site_performance_web_vitals",f))
        }
        ),
        o
    }
    function je(e) {
        let t = [];
        if (e.forEach(r => {
            e.delete(r);
            let a = {
                name: r.name,
                startTime: r.startTime,
                duration: r.duration
            };
            t.push(a)
        }
        ),
        t.length !== 0)
            return new m("published_site_performance_user_timings",{
                timings: JSON.stringify(t)
            })
    }
    var Y = null;
    function O() {
        if (!Y) {
            let e = document.currentScript;
            Y = {
                src: (e == null ? void 0 : e.src) ?? "https://events.framer.com/",
                framerSiteId: e ? e.getAttribute("data-fid") : null
            }
        }
        return Y
    }
    var Ge = O();
    function I(e, t) {
        let r = [new m("published_site_pageview",{
            referrer: (t == null ? void 0 : t.initialReferrer) || null,
            url: location.href,
            hostname: location.hostname || null,
            pathname: location.pathname || null,
            hash: location.hash || null,
            search: location.search || null,
            framerSiteId: Ge.framerSiteId
        })];
        e(r)
    }
    async function N(e={
        priority: "background"
    }) {
        if (window.scheduler) {
            if (window.scheduler.yield)
                return window.scheduler.yield(e);
            if (window.scheduler.postTask)
                return window.scheduler.postTask( () => {}
                , e)
        }
        return Promise.resolve()
    }
    function Ce(e) {
        addEventListener("popstate", () => I(e));
        let t = history.pushState;
        history.pushState = function(...r) {
            t.apply(history, r),
            (async () => (await N(),
            I(e)))()
        }
    }
    function Pe(e) {
        window.__send_framer_event = (t, r) => {
            let a = new m(t,r);
            e([a])
        }
    }
    var k = "__framer_events";
    function Me(e) {
        if (window[k] || (window[k] = []),
        window[k].length > 0) {
            let t = window[k].map(r => new m(r[0],r[1]));
            e(t),
            window[k].length = 0
        }
        window[k].push = function(...t) {
            let r = t.map(a => new m(a[0],a[1]));
            return e(r),
            -1
        }
    }
    var Le = O()
      , Je = new URL(Le.src)
      , Ze = Je.origin + "/anonymous";
    function Ke(e) {
        if (!location.protocol.startsWith("http"))
            return;
        let t = {
            framerSiteId: Le.framerSiteId,
            origin: document.location.origin,
            pathname: document.location.pathname,
            search: document.location.search,
            visitTimeOrigin: performance.timeOrigin
        };
        navigator.sendBeacon(Ze, JSON.stringify(e.map(r => ({
            ...r,
            data: {
                ...r.data,
                context: {
                    ...t,
                    ...r.data.context
                }
            }
        }))))
    }
    function F(e) {
        if (e.length === 0)
            return;
        let t = e.map(r => r.serialize());
        Ke(t)
    }
    var Xe = async () => {
        await N(),
        we(F),
        Ce(F),
        Pe(F),
        Me(F);
        let e = typeof document.referrer == "string";
        I(F, {
            initialReferrer: e && document.referrer || null
        })
    }
    ;
    Xe();
}
)();