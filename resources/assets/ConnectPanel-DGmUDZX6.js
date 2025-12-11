import {
  _ as a,
  u as e,
  a as l,
  h as s,
  r as t,
  c as o,
  o as n,
  b as u,
  d as r,
  i as v,
  t as c,
  w as d,
  v as i,
  n as p,
  j as m,
} from "./index-gWJpdIEE.js";
const _ = { class: "connect-panel" },
  f = { class: "description" },
  y = { class: "form-group" },
  b = a(
    {
      __name: "ConnectPanel",
      props: { panelData: { type: Object, default: () => ({}) } },
      setup(a) {
        const b = a,
          h = e(),
          T = l(),
          g = s(() => {
            var a;
            return null == (a = b.panelData) ? void 0 : a.fromNode;
          }),
          D = s(() => {
            var a;
            return null == (a = b.panelData) ? void 0 : a.toNode;
          }),
          w = t(""),
          j = t(""),
          x = t("");
        async function A() {
          var a, e;
          if (!w.value.trim())
            return (j.value = "请输入关系名称"), void (x.value = "error");
          (j.value = "正在创建关系..."), (x.value = "");
          try {
            const a = {
              from_id: g.value.id,
              to_id: D.value.id,
              rel_type: w.value,
              from_type: g.value.type,
              to_type: D.value.type,
            };
            await m(a),
              (j.value = "关系创建成功！"),
              (x.value = "success"),
              T.showToast("创建成功", `已创建 ${w.value} 关系`, "success"),
              setTimeout(() => {
                T.closePanel("connect"), h.loadGraphData(h.currentSessionId);
              }, 1500);
          } catch (l) {
            const s =
              (null == (e = null == (a = l.response) ? void 0 : a.data)
                ? void 0
                : e.detail) || l.message;
            (j.value = `错误: ${s}`),
              (x.value = "error"),
              T.showToast("创建失败", s, "error");
          }
        }
        return (a, e) => {
          var l, s;
          return (
            n(),
            o("div", _, [
              u("p", f, [
                e[1] || (e[1] = v(" 创建从 ", -1)),
                u(
                  "strong",
                  null,
                  c(null == (l = g.value) ? void 0 : l.name),
                  1
                ),
                e[2] || (e[2] = v(" 到 ", -1)),
                u(
                  "strong",
                  null,
                  c(null == (s = D.value) ? void 0 : s.name),
                  1
                ),
                e[3] || (e[3] = v(" 的关系 ", -1)),
              ]),
              u("div", y, [
                e[4] ||
                  (e[4] = u("label", { class: "form-label" }, "关系类型", -1)),
                d(
                  u(
                    "input",
                    {
                      "onUpdate:modelValue":
                        e[0] || (e[0] = (a) => (w.value = a)),
                      type: "text",
                      class: "form-input",
                      placeholder: "例如: IS_A, PART_OF, RELATED_TO",
                    },
                    null,
                    512
                  ),
                  [[i, w.value]]
                ),
              ]),
              u(
                "button",
                { onClick: A, class: "btn btn-primary" },
                " 创建关系 "
              ),
              j.value
                ? (n(),
                  o(
                    "div",
                    { key: 0, class: p(["status-message", x.value]) },
                    c(j.value),
                    3
                  ))
                : r("", !0),
            ])
          );
        };
      },
    },
    [["__scopeId", "data-v-76c01076"]]
  );
export { b as default };
