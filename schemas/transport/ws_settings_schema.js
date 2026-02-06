// src/schemas/transport/ws_settings_schema.js
export const WebSocketSettingsSchema = {
  id: "transport.wsSettings",
  title: "WebSocket 设置(wsSettings)",
  type: "object",
  doc: { url: "https://xtls.github.io/en/config/transports/websocket.html", hash: "#websocketobject" },
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
    },
    heartbeatPeriod: {
      type: "integer",
      label: "心跳间隔(秒)(heartbeatPeriod)",
      default: 0,
      min: 0,
      description: "0/不填表示不发送 Ping。"
    }
  }
};
