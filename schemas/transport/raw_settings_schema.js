// src/schemas/transport/raw_settings_schema.js
// RAW / TCP(raw) -> rawSettings / tcpSettings 共同使用
export const RawSettingsSchema = {
  id: "transport.rawSettings",
  title: "RAW 设置(rawSettings)",
  type: "object",
  doc: { url: "https://xtls.github.io/en/config/transports/raw.html", hash: "#rawobject" },
  properties: {
    acceptProxyProtocol: {
      type: "boolean",
      label: "接收 PROXY 协议(acceptProxyProtocol)",
      default: false,
      doc: { url: "https://xtls.github.io/en/config/transports/raw.html", hash: "#rawobject" },
      description: "仅 inbound 生效。是否接收 PROXY protocol v1/v2。"
    },
    header: {
      label: "头部伪装(header)",
      doc: { url: "https://xtls.github.io/en/config/transports/raw.html", hash: "#rawobject" },
      description: "报文头伪装/混淆。默认 none。",
      oneOf: [
        {
          id: "transport.rawSettings.header.none",
          type: "object",
          title: "不伪装(NoneHeaderObject)",
          doc: { url: "https://xtls.github.io/en/config/transports/raw.html", hash: "#noneheaderobject" },
          properties: {
            type: { type: "string", label: "类型(type)", enum: ["none"], default: "none" }
          },
          required: ["type"]
        },
        {
          id: "transport.rawSettings.header.http",
          type: "object",
          title: "HTTP 伪装(HttpHeaderObject)",
          doc: { url: "https://xtls.github.io/en/config/transports/raw.html", hash: "#httpheaderobject" },
          properties: {
            type: { type: "string", label: "类型(type)", enum: ["http"], default: "http" },

            request: {
              type: "object",
              label: "HTTP 请求(request)",
              doc: { url: "https://xtls.github.io/en/config/transports/raw.html", hash: "#httprequestobject" },
              properties: {
                version: {
                  type: "string",
                  label: "HTTP 版本(version)",
                  default: "1.1"
                },
                method: {
                  type: "string",
                  label: "HTTP 方法(method)",
                  default: "GET"
                },
                path: {
                  type: "array",
                  label: "路径(path)",
                  default: ["/"],
                  items: { type: "string" },
                  description: "可填多个，运行时随机选择其一。"
                },
                headers: {
                  type: "object",
                  label: "请求头(headers)",
                  description: "map{string, [string]}；也允许单个 string（与官方示例保持兼容）。",
                  additionalProperties: {
                    oneOf: [
                      { type: "array", items: { type: "string" } },
                      { type: "string" }
                    ]
                  }
                }
              }
            },

            response: {
              type: "object",
              label: "HTTP 响应(response)",
              doc: { url: "https://xtls.github.io/en/config/transports/raw.html", hash: "#httpresponseobject" },
              properties: {
                version: {
                  type: "string",
                  label: "HTTP 版本(version)",
                  default: "1.1"
                },
                status: {
                  type: "string",
                  label: "状态码(status)",
                  default: "200"
                },
                reason: {
                  type: "string",
                  label: "状态描述(reason)",
                  default: "OK"
                },
                headers: {
                  type: "object",
                  label: "响应头(headers)",
                  additionalProperties: {
                    oneOf: [
                      { type: "array", items: { type: "string" } },
                      { type: "string" }
                    ]
                  }
                }
              }
            }
          },
          required: ["type"]
        }
      ],
      default: { type: "none" }
    }
  }
};
