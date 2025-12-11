import {
  _ as s,
  u as e,
  a as t,
  r as a,
  c as o,
  o as l,
  b as c,
  d as i,
  e as d,
  f as n,
  n as v,
  t as u,
  g as r,
} from "./index-gWJpdIEE.js";
const m = { class: "tools-panel" },
  p = { class: "tool-section" },
  _ = s(
    {
      __name: "ToolsPanel",
      props: { panelData: { type: Object, default: () => ({}) } },
      setup(s) {
        const _ = e(),
          f = t(),
          h = a(""),
          y = a("");
        async function g(s, e = {}) {
          var t, a;
          (h.value = "正在执行任务..."), (y.value = "");
          try {
            const t = (await r(s, e)).data;
            (h.value = `成功删除 ${t.deleted_count} 个节点`),
              (y.value = "success"),
              f.showToast(
                "操作成功",
                `已删除 ${t.deleted_count} 个节点`,
                "success"
              ),
              setTimeout(() => {
                f.closePanel("tools"), _.loadGraphData(_.currentSessionId);
              }, 2e3);
          } catch (o) {
            const s =
              (null == (a = null == (t = o.response) ? void 0 : t.data)
                ? void 0
                : a.detail) || o.message;
            (h.value = `错误: ${s}`),
              (y.value = "error"),
              f.showToast("操作失败", s, "error");
          }
        }
        return (s, e) => (
          l(),
          o("div", m, [
            c("div", p, [
              e[4] ||
                (e[4] = c(
                  "div",
                  { class: "tool-section-title" },
                  "批量操作",
                  -1
                )),
              c(
                "div",
                {
                  onClick:
                    e[0] || (e[0] = (s) => g("delete_isolated_entities")),
                  class: "tool-item",
                },
                [
                  d(n, { name: "trash-2", class: "tool-item-icon" }),
                  e[2] ||
                    (e[2] = c(
                      "div",
                      { class: "tool-item-content" },
                      [
                        c("div", { class: "tool-item-title" }, "删除孤立实体"),
                        c(
                          "div",
                          { class: "tool-item-desc" },
                          "清理没有任何连接的节点"
                        ),
                      ],
                      -1
                    )),
                ]
              ),
              c(
                "div",
                {
                  onClick:
                    e[1] ||
                    (e[1] = (s) => g("delete_old_messages", { days: 90 })),
                  class: "tool-item",
                },
                [
                  d(n, { name: "clock", class: "tool-item-icon" }),
                  e[3] ||
                    (e[3] = c(
                      "div",
                      { class: "tool-item-content" },
                      [
                        c("div", { class: "tool-item-title" }, "删除旧消息"),
                        c(
                          "div",
                          { class: "tool-item-desc" },
                          "删除90天前的原始消息"
                        ),
                      ],
                      -1
                    )),
                ]
              ),
            ]),
            h.value
              ? (l(),
                o(
                  "div",
                  { key: 0, class: v(["status-message", y.value]) },
                  u(h.value),
                  3
                ))
              : i("", !0),
          ])
        );
      },
    },
    [["__scopeId", "data-v-a29f47c0"]]
  );
export { _ as default };
