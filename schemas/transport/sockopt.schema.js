// schemas/transport/sockopt.schema.js
// 来源：/config/transport.html SockoptObject（注意文档示例里字段大小写存在差异，实际渲染建议做 alias 映射）
// :contentReference[oaicite:5]{index=5}

const DOC = "https://xtls.github.io/config/transport.html";

export default {
  id: "transport.sockopt",
  title: "Sockopt 选项 (sockopt)",
  doc: `${DOC}#sockoptobject`,
  type: "object",
  additionalProperties: false,

  properties: {
    mark: { type: "number", title: "SO_MARK (mark)", doc: `${DOC}#sockoptobject` },
    tcpMaxSeg: { type: "number", title: "TCP MSS 上限 (tcpMaxSeg)", doc: `${DOC}#sockoptobject` },
    tcpFastOpen: { type: "boolean", title: "TCP Fast Open (tcpFastOpen)", doc: `${DOC}#sockoptobject` },

    tproxy: {
      type: "string",
      title: "透明代理模式 (tproxy)",
      doc: `${DOC}#sockoptobject`,
      ui: { hint: "文档示例为 off；如需 enum，可在后续从文档补齐" }
    },

    domainStrategy: {
      type: "string",
      title: "域名策略 (domainStrategy)",
      doc: `${DOC}#sockoptobject`,
      default: "AsIs"
    },

    happyEyeballs: {
      type: "object",
      title: "HappyEyeballs 配置 (happyEyeballs)",
      doc: `${DOC}#sockoptobject`,
      ui: { widget: "json" }
    },

    dialerProxy: {
      type: "string",
      title: "底层链式出站 (dialerProxy)",
      doc: `${DOC}#sockoptobject`,
      ui: { hint: "与 ProxySettingsObject.Tag 不兼容（文档警告）" }
    },

    acceptProxyProtocol: {
      type: "boolean",
      title: "接收 PROXY protocol (acceptProxyProtocol)",
      doc: `${DOC}#sockoptobject`,
      default: false
    },

    tcpKeepAliveInterval: { type: "number", title: "KeepAlive 间隔秒 (tcpKeepAliveInterval)", doc: `${DOC}#sockoptobject` },
    tcpKeepAliveIdle: { type: "number", title: "KeepAlive 空闲秒 (tcpKeepAliveIdle)", doc: `${DOC}#sockoptobject` },
    tcpUserTimeout: { type: "number", title: "TCP user timeout 毫秒 (tcpUserTimeout)", doc: `${DOC}#sockoptobject` },

    // 文档中出现 tcpCongestion 与 tcpcongestion 两种写法：建议两者都支持，输出时优先 camelCase
    tcpCongestion: { type: "string", title: "TCP 拥塞算法 (tcpCongestion)", doc: `${DOC}#sockoptobject` },
    tcpcongestion: {
      type: "string",
      title: "TCP 拥塞算法别名 (tcpcongestion)",
      doc: `${DOC}#sockoptobject`,
      ui: { hint: "兼容字段：输出时建议归一到 tcpCongestion" }
    },

    interface: { type: "string", title: "绑定出口网卡名 (interface)", doc: `${DOC}#sockoptobject` },

    // 文档中出现 v6only 与 V6Only：建议两者都支持
    v6only: { type: "boolean", title: "仅 IPv6 (v6only)", doc: `${DOC}#sockoptobject` },
    V6Only: {
      type: "boolean",
      title: "仅 IPv6 别名 (V6Only)",
      doc: `${DOC}#sockoptobject`,
      ui: { hint: "兼容字段：输出时建议归一到 v6only" }
    },

    tcpWindowClamp: { type: "number", title: "TCP Window Clamp (tcpWindowClamp)", doc: `${DOC}#sockoptobject` },
    tcpMptcp: { type: "boolean", title: "启用 MPTCP (tcpMptcp)", doc: `${DOC}#sockoptobject`, default: false },

    addressPortStrategy: { type: "string", title: "AddressPort 策略 (addressPortStrategy)", doc: `${DOC}#sockoptobject` },

    customSockopt: {
      type: "array",
      title: "自定义 Sockopt (customSockopt)",
      doc: `${DOC}#sockoptobject`,
      items: { type: "object", ui: { widget: "json" } }
    }
  },

  ui: {
    order: [
      "mark",
      "tcpMaxSeg",
      "tcpFastOpen",
      "tproxy",
      "domainStrategy",
      "happyEyeballs",
      "dialerProxy",
      "acceptProxyProtocol",
      "tcpKeepAliveIdle",
      "tcpKeepAliveInterval",
      "tcpUserTimeout",
      "tcpCongestion",
      "tcpcongestion",
      "interface",
      "v6only",
      "V6Only",
      "tcpWindowClamp",
      "tcpMptcp",
      "addressPortStrategy",
      "customSockopt"
    ]
  }
};
