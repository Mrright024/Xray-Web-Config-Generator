// schemas/transport/streamSettings.schema.js
// 来源：/config/transport.html StreamSettingsObject
// 说明：tcpSettings/rawSettings、network=tcp/raw 互为别名（文档说明）。
// :contentReference[oaicite:1]{index=1}

const DOC = "https://xtls.github.io/config/transport.html";

export default {
  id: "transport.streamSettings",
  title: "传输设置 (streamSettings)",
  doc: `${DOC}#streamsettingsobject`,
  type: "object",
  additionalProperties: false,

  properties: {
    network: {
      type: "string",
      title: "传输方式 (network)",
      doc: `${DOC}#streamsettingsobject`,
      default: "raw",
      enum: ["raw", "tcp", "xhttp", "kcp", "grpc", "ws", "httpupgrade", "hysteria"]
    },

    security: {
      type: "string",
      title: "传输层加密 (security)",
      doc: `${DOC}#streamsettingsobject`,
      default: "none",
      enum: ["none", "tls", "reality"]
    },

    tlsSettings: {
      type: "object",
      title: "TLS 配置 (tlsSettings)",
      doc: `${DOC}#tlsobject`,
      refId: "transport.tls"
    },

    realitySettings: {
      type: "object",
      title: "REALITY 配置 (realitySettings)",
      doc: `${DOC}#realityobject`,
      refId: "transport.reality"
    },

    // RAW / TCP（别名）
    rawSettings: {
      type: "object",
      title: "RAW 配置 (rawSettings)",
      doc: "https://xtls.github.io/config/transports/raw.html#rawobject",
      refId: "transport.raw"
    },
    tcpSettings: {
      type: "object",
      title: "TCP 配置别名 (tcpSettings)",
      doc: `${DOC}#streamsettingsobject`,
      refId: "transport.raw",
      ui: { hint: "与 rawSettings 互为别名（兼容字段）" }
    },

    xhttpSettings: {
      type: "object",
      title: "XHTTP 配置 (xhttpSettings)",
      doc: "https://xtls.github.io/config/transports/splithttp.html",
      refId: "transport.xhttp",
      ui: { hint: "XHTTP 文档当前指向 GitHub Discussion，schema 见 transport/xhttp.schema.js" }
    },

    kcpSettings: {
      type: "object",
      title: "mKCP 配置 (kcpSettings)",
      doc: "https://xtls.github.io/config/transports/mkcp.html#kcpobject",
      refId: "transport.mkcp"
    },

    grpcSettings: {
      type: "object",
      title: "gRPC 配置 (grpcSettings)",
      doc: "https://xtls.github.io/config/transports/grpc.html#grpcobject",
      refId: "transport.grpc"
    },

    wsSettings: {
      type: "object",
      title: "WebSocket 配置 (wsSettings)",
      doc: "https://xtls.github.io/config/transports/websocket.html#websocketobject",
      refId: "transport.ws"
    },

    httpupgradeSettings: {
      type: "object",
      title: "HTTPUpgrade 配置 (httpupgradeSettings)",
      doc: "https://xtls.github.io/config/transports/httpupgrade.html#httpupgradeobject",
      refId: "transport.httpupgrade"
    },

    hysteriaSettings: {
      type: "object",
      title: "Hysteria 配置 (hysteriaSettings)",
      doc: "https://xtls.github.io/config/transports/hysteria.html#hysteriaobject",
      refId: "transport.hysteria"
    },

    finalmask: {
      type: "object",
      title: "FinalMask 通用伪装 (finalmask)",
      doc: `${DOC}#finalmaskobject`,
      refId: "transport.finalmask"
    },

    sockopt: {
      type: "object",
      title: "Sockopt 透明代理/套接字选项 (sockopt)",
      doc: `${DOC}#sockoptobject`,
      refId: "transport.sockopt"
    }
  },

  ui: {
    order: [
      "network",
      "security",
      "tlsSettings",
      "realitySettings",
      "rawSettings",
      "tcpSettings",
      "xhttpSettings",
      "kcpSettings",
      "grpcSettings",
      "wsSettings",
      "httpupgradeSettings",
      "hysteriaSettings",
      "finalmask",
      "sockopt"
    ]
  }
};
