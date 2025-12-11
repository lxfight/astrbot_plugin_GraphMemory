import {
  _ as e,
  u as a,
  a as s,
  r as l,
  c as n,
  o as t,
  b as u,
  d as r,
  w as o,
  v as i,
  s as d,
  x as c,
  f as v,
  t as p,
  e as m,
  y as g,
} from "./index-gWJpdIEE.js";
const b = { class: "debug-panel" },
  y = { class: "debug-search" },
  h = ["disabled"],
  f = { key: 0, class: "debug-result" },
  w = { class: "result-stats" },
  k = ["disabled"],
  _ = { style: { "margin-top": "1rem" } },
  T = { class: "json-display" },
  x = { key: 1, class: "error-message" },
  z = e(
    {
      __name: "DebugPanel",
      setup(e) {
        const z = a(),
          S = s(),
          j = l(""),
          C = l(!1),
          D = l(null),
          I = l(null);
        async function J() {
          var e, a;
          if (!j.value.trim()) return;
          const s = z.currentSessionId;
          if (s) {
            (C.value = !0), (I.value = null);
            try {
              const e = await g(j.value, s);
              await new Promise((e) => setTimeout(e, 0)), (D.value = e.data);
            } catch (l) {
              (I.value =
                (null == (a = null == (e = l.response) ? void 0 : e.data)
                  ? void 0
                  : a.detail) || "搜索失败: " + l.message),
                S.showToast("搜索失败", I.value, "error");
            } finally {
              C.value = !1;
            }
          } else S.showToast("错误", "请先加载会话", "warning");
        }
        function N() {
          if (!D.value || !D.value.nodes) return;
          const e = D.value.nodes.map((e) => ({
              id: e.id || e.name,
              name: e.name || e.id,
              type: e.type || "debug",
              group: "debug",
              importance: e.importance || 0.7,
              properties: e.properties || {},
              observations: e.observations || [],
            })),
            a = (D.value.edges || []).map((e) => ({
              source: e.source,
              target: e.target,
              relation: e.relation || "debug_link",
              weight: e.weight || 1,
            }));
          (z.graphData = { nodes: e, links: a }),
            S.switchTab("info"),
            S.showToast("可视化成功", `已加载 ${e.length} 个节点`, "success");
        }
        return (e, a) => {
          var s, l;
          return (
            t(),
            n("div", b, [
              u("div", y, [
                o(
                  u(
                    "input",
                    {
                      "onUpdate:modelValue":
                        a[0] || (a[0] = (e) => (j.value = e)),
                      onKeyup: d(J, ["enter"]),
                      type: "text",
                      placeholder: "输入调试查询...",
                      class: "debug-input",
                    },
                    null,
                    544
                  ),
                  [[i, j.value]]
                ),
                u(
                  "button",
                  { onClick: J, disabled: C.value, class: "btn btn-primary" },
                  [
                    C.value
                      ? (t(),
                        c(v, {
                          key: 1,
                          name: "loader",
                          size: "0.875rem",
                          class: "spinning",
                        }))
                      : (t(),
                        c(v, { key: 0, name: "search", size: "0.875rem" })),
                    u("span", null, p(C.value ? "搜索中..." : "搜索"), 1),
                  ],
                  8,
                  h
                ),
              ]),
              D.value
                ? (t(),
                  n("div", f, [
                    u("div", w, [
                      u(
                        "span",
                        null,
                        "节点: " +
                          p(
                            (null == (s = D.value.nodes) ? void 0 : s.length) ||
                              0
                          ),
                        1
                      ),
                      u(
                        "span",
                        null,
                        "边: " +
                          p(
                            (null == (l = D.value.edges) ? void 0 : l.length) ||
                              0
                          ),
                        1
                      ),
                    ]),
                    u(
                      "button",
                      {
                        onClick: N,
                        disabled: !D.value.nodes || 0 === D.value.nodes.length,
                        class: "btn btn-secondary",
                        style: { "margin-top": "1rem", width: "100%" },
                      },
                      [
                        m(v, { name: "eye", size: "0.875rem" }),
                        a[1] || (a[1] = u("span", null, "可视化结果", -1)),
                      ],
                      8,
                      k
                    ),
                    u("details", _, [
                      a[2] ||
                        (a[2] = u(
                          "summary",
                          {
                            style: {
                              cursor: "pointer",
                              "font-size": "0.75rem",
                              color: "#666",
                              "margin-bottom": "0.5rem",
                            },
                          },
                          " 查看 JSON ",
                          -1
                        )),
                      u("pre", T, p(JSON.stringify(D.value, null, 2)), 1),
                    ]),
                  ]))
                : r("", !0),
              I.value ? (t(), n("div", x, p(I.value), 1)) : r("", !0),
            ])
          );
        };
      },
    },
    [["__scopeId", "data-v-49acac19"]]
  );
export { z as default };
