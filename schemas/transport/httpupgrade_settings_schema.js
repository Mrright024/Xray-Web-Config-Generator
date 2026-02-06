// src/schemas/transport/httpupgrade_settings_schema.js
export const HttpUpgradeSettingsSchema = {
  id: "transport.httpupgradeSettings",
  title: "HTTPUpgrade 设置(httpupgradeSettings)",
  type: "object",
  doc: { url: "https://xtls.github.io/en/config/transports/httpupgrade.html", hash: "#httpupgradeobject" },
  properties: {
    acceptProxyProtocol: {
      type: "boolean",
      label: "接收 PROXY 协议(acceptProxyProtocol)",
      default: false,
      description: "仅 inbound 生效。"
    },
    path: {
      type: "string",
      label: "路径(path)",
      default: "/",
      description: "可在 path 上带 ed 参数启用 Early Data（由使用者自行填写）。"
    },
    host: {
      type: "string",
      label: "Host(host)",
      default: "",
      description: "为空时服务端不校验 client host。"
    },
    headers: {
      type: "object",
      label: "自定义请求头(headers)",
      default: {},
      additionalProperties: { type: "string" },
      description: "客户端自定义 HTTP headers（key-value）。"
    }
  }
};
