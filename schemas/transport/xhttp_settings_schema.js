// src/schemas/transport/xhttp_settings_schema.js
// XHTTP: Beyond REALITY
export const XHttpSettingsSchema = {
  id: "transport.xhttpSettings",
  title: "XHTTP 设置(xhttpSettings)",
  type: "object",
  // 文档页主要指向讨论帖；此处按官方 schema 中出现的字段集合收敛
  doc: { url: "https://xtls.github.io/en/config/transports/xhttp.html", hash: "" },
  properties: {
    path: {
      type: "string",
      label: "路径(path)",
      default: ""
    },
    host: {
      type: "string",
      label: "Host(host)",
      default: ""
    },
    headers: {
      type: "object",
      label: "请求头(headers)",
      default: {},
      additionalProperties: { type: "string" }
    },
    mode: {
      type: "string",
      label: "模式(mode)",
      default: ""
    },
    extra: {
      type: "object",
      label: "扩展参数(extra)",
      default: {},
      description: "不同 mode 下的扩展字段集合，保持为自由对象以避免 schema 落后于实现。"
    }
  }
};
