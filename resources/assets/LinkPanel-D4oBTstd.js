import {
  _ as a,
  u as e,
  a as s,
  h as l,
  r as t,
  c as u,
  o as n,
  b as r,
  d as o,
  i as v,
  t as c,
  w as i,
  v as d,
  n as p,
  l as m,
} from "./index-gWJpdIEE.js";
const b = { class: "link-panel" },
  I = { class: "description" },
  f = { class: "form-group" },
  h = ["placeholder"],
  y = a(
    {
      __name: "LinkPanel",
      props: { panelData: { type: Object, default: () => ({}) } },
      setup(a) {
        const y = a,
          g = e(),
          D = s(),
          k = l(() => {
            var a;
            return (null == (a = y.panelData) ? void 0 : a.entityName) || "";
          }),
          S = l(() =>
            "global" !== g.currentSessionId
              ? g.currentSessionId
              : "输入会话ID..."
          ),
          _ = t("global" !== g.currentSessionId ? g.currentSessionId : ""),
          w = t(""),
          x = t("");
        async function T() {
          var a, e;
          if (!_.value.trim())
            return (w.value = "请输入会话 ID"), void (x.value = "error");
          (w.value = "正在关联..."), (x.value = "");
          try {
            await m(_.value, k.value),
              (w.value = "关联成功！"),
              (x.value = "success"),
              D.showToast("关联成功", `实体已关联到会话 ${_.value}`, "success"),
              setTimeout(() => {
                D.closePanel("link"),
                  g.currentSessionId === _.value && g.loadGraphData(_.value);
              }, 1500);
          } catch (s) {
            const l =
              (null == (e = null == (a = s.response) ? void 0 : a.data)
                ? void 0
                : e.detail) || s.message;
            (w.value = `错误: ${l}`),
              (x.value = "error"),
              D.showToast("关联失败", l, "error");
          }
        }
        return (a, e) => (
          n(),
          u("div", b, [
            r("p", I, [
              e[1] || (e[1] = v(" 将实体 ", -1)),
              r("strong", null, c(k.value), 1),
              e[2] || (e[2] = v(" 关联到指定会话 ", -1)),
            ]),
            r("div", f, [
              e[3] ||
                (e[3] = r("label", { class: "form-label" }, "目标会话 ID", -1)),
              i(
                r(
                  "input",
                  {
                    "onUpdate:modelValue":
                      e[0] || (e[0] = (a) => (_.value = a)),
                    type: "text",
                    class: "form-input",
                    placeholder: S.value,
                  },
                  null,
                  8,
                  h
                ),
                [[d, _.value]]
              ),
            ]),
            r("button", { onClick: T, class: "btn btn-primary" }, " 确认关联 "),
            w.value
              ? (n(),
                u(
                  "div",
                  { key: 0, class: p(["status-message", x.value]) },
                  c(w.value),
                  3
                ))
              : o("", !0),
          ])
        );
      },
    },
    [["__scopeId", "data-v-309b1911"]]
  );
export { y as default };
