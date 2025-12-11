import {
  _ as e,
  r as s,
  h as a,
  k as l,
  m as t,
  c as n,
  o,
  b as i,
  F as u,
  p as v,
  n as c,
  t as m,
  w as r,
  d as g,
  q as d,
} from "./index-gWJpdIEE.js";
const p = { class: "monitor-panel" },
  k = { class: "monitor-tabs" },
  y = ["onClick"],
  b = { class: "monitor-controls" },
  h = { class: "monitor-content" },
  w = { key: 0, class: "log-list" },
  f = ["data-level"],
  R = { class: "log-time" },
  I = { class: "log-level" },
  N = { class: "log-message" },
  O = { key: 0, class: "empty-message" },
  L = { key: 1, class: "task-list" },
  S = { class: "task-time" },
  _ = ["innerHTML"],
  A = { key: 0, class: "empty-message" },
  G = { key: 2, class: "message-list" },
  M = { class: "message-time" },
  x = { class: "message-sender" },
  C = { class: "message-text" },
  D = { key: 0, class: "empty-message" },
  F = e(
    {
      __name: "MonitorPanel",
      setup(e) {
        const F = s("logs"),
          T = s("ALL"),
          W = s(!1),
          E = s([]),
          H = s([]),
          $ = s([]),
          j = [
            { id: "logs", label: "日志" },
            { id: "tasks", label: "任务" },
            { id: "messages", label: "消息" },
          ],
          q = a(() =>
            "ALL" === T.value
              ? E.value
              : E.value.filter((e) => e.level === T.value)
          );
        let J = null;
        function P() {
          const e = `${
            "https:" === window.location.protocol ? "wss:" : "ws:"
          }//${window.location.host}/ws/status`;
          (J = new WebSocket(e)),
            (J.onopen = () => {
              U({
                level: "INFO",
                message: "监控服务已连接",
                timestamp: new Date().toISOString(),
              });
            }),
            (J.onmessage = (e) => {
              try {
                const l = JSON.parse(e.data);
                switch (l.type) {
                  case "log":
                    U(l.payload);
                    break;
                  case "task":
                    (a = l.payload),
                      W.value ||
                        (H.value.push(a),
                        H.value.length > 100 && H.value.shift());
                    break;
                  case "message":
                    (s = l.payload),
                      W.value ||
                        ($.value.push(s),
                        $.value.length > 100 && $.value.shift());
                }
              } catch (l) {}
              var s, a;
            }),
            (J.onclose = () => {
              U({
                level: "WARNING",
                message: "监控服务已断开，3秒后重试...",
                timestamp: new Date().toISOString(),
              }),
                setTimeout(P, 3e3);
            }),
            (J.onerror = (e) => {
              U({
                level: "ERROR",
                message: "监控服务连接错误",
                timestamp: new Date().toISOString(),
              });
            });
        }
        function U(e) {
          if (!W.value) {
            const s = e.message || "";
            (s.includes("GraphMemory") ||
              s.includes("graph_memory") ||
              s.includes("astrbot_plugin_GraphMemory")) &&
              (E.value.push(e), E.value.length > 1e3 && E.value.shift());
          }
        }
        function V() {
          W.value = !W.value;
        }
        function z() {
          "logs" === F.value
            ? (E.value = [])
            : "tasks" === F.value
            ? (H.value = [])
            : "messages" === F.value && ($.value = []);
        }
        function B(e) {
          return new Date(e).toLocaleTimeString();
        }
        return (
          l(() => {
            P();
          }),
          t(() => {
            J && J.close();
          }),
          (e, s) => (
            o(),
            n("div", p, [
              i("div", k, [
                (o(),
                n(
                  u,
                  null,
                  v(j, (e) =>
                    i(
                      "button",
                      {
                        key: e.id,
                        onClick: (s) => (F.value = e.id),
                        class: c(["monitor-tab", { active: F.value === e.id }]),
                      },
                      m(e.label),
                      11,
                      y
                    )
                  ),
                  64
                )),
              ]),
              i("div", b, [
                "logs" === F.value
                  ? r(
                      (o(),
                      n(
                        "select",
                        {
                          key: 0,
                          "onUpdate:modelValue":
                            s[0] || (s[0] = (e) => (T.value = e)),
                          class: "log-filter",
                        },
                        [
                          ...(s[1] ||
                            (s[1] = [
                              i("option", { value: "ALL" }, "全部", -1),
                              i("option", { value: "INFO" }, "INFO", -1),
                              i("option", { value: "WARNING" }, "WARNING", -1),
                              i("option", { value: "ERROR" }, "ERROR", -1),
                            ])),
                        ],
                        512
                      )),
                      [[d, T.value]]
                    )
                  : g("", !0),
                i(
                  "button",
                  { onClick: V, class: "btn btn-secondary btn-sm" },
                  m(W.value ? "继续" : "暂停"),
                  1
                ),
                i(
                  "button",
                  { onClick: z, class: "btn btn-secondary btn-sm" },
                  " 清空 "
                ),
              ]),
              i("div", h, [
                "logs" === F.value
                  ? (o(),
                    n("div", w, [
                      (o(!0),
                      n(
                        u,
                        null,
                        v(
                          q.value,
                          (e, s) => (
                            o(),
                            n(
                              "div",
                              {
                                key: s,
                                class: "log-entry",
                                "data-level": e.level,
                              },
                              [
                                i("span", R, m(B(e.timestamp)), 1),
                                i("span", I, "[" + m(e.level) + "]", 1),
                                i("span", N, m(e.message), 1),
                              ],
                              8,
                              f
                            )
                          )
                        ),
                        128
                      )),
                      0 === q.value.length
                        ? (o(), n("div", O, " 暂无日志 "))
                        : g("", !0),
                    ]))
                  : g("", !0),
                "tasks" === F.value
                  ? (o(),
                    n("div", L, [
                      (o(!0),
                      n(
                        u,
                        null,
                        v(
                          H.value,
                          (e, s) => (
                            o(),
                            n("div", { key: s, class: "task-entry" }, [
                              i("span", S, m(B(e.timestamp)), 1),
                              i(
                                "span",
                                { class: "task-content", innerHTML: e.content },
                                null,
                                8,
                                _
                              ),
                            ])
                          )
                        ),
                        128
                      )),
                      0 === H.value.length
                        ? (o(), n("div", A, " 暂无任务 "))
                        : g("", !0),
                    ]))
                  : g("", !0),
                "messages" === F.value
                  ? (o(),
                    n("div", G, [
                      (o(!0),
                      n(
                        u,
                        null,
                        v(
                          $.value,
                          (e, s) => (
                            o(),
                            n("div", { key: s, class: "message-entry" }, [
                              i("span", M, m(B(e.timestamp)), 1),
                              i("strong", x, m(e.sender) + ":", 1),
                              i("span", C, m(e.text), 1),
                            ])
                          )
                        ),
                        128
                      )),
                      0 === $.value.length
                        ? (o(), n("div", D, " 暂无消息 "))
                        : g("", !0),
                    ]))
                  : g("", !0),
              ]),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-8a4e4a4d"]]
  );
export { F as default };
