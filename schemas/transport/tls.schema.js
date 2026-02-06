// schemas/transport/tls.schema.js
// 来源：/config/transport.html TLSObject
// :contentReference[oaicite:2]{index=2}

const DOC = "https://xtls.github.io/config/transport.html";

export default {
  id: "transport.tls",
  title: "TLS 配置 (tlsSettings)",
  doc: `${DOC}#tlsobject`,
  type: "object",
  additionalProperties: false,

  properties: {
    serverName: { type: "string", title: "服务器名称 SNI (serverName)", doc: `${DOC}#tlsobject` },
    verifyPeerCertByName: { type: "string", title: "校验证书使用的 SNI 列表 (verifyPeerCertByName)", doc: `${DOC}#tlsobject` },
    rejectUnknownSni: { type: "boolean", title: "拒绝未知 SNI (rejectUnknownSni)", doc: `${DOC}#tlsobject`, default: false },
    allowInsecure: { type: "boolean", title: "允许不安全证书 (allowInsecure)", doc: `${DOC}#tlsobject`, default: false },

    alpn: {
      type: "array",
      title: "ALPN 列表 (alpn)",
      doc: `${DOC}#tlsobject`,
      items: { type: "string" }
    },

    minVersion: { type: "string", title: "最小 TLS 版本 (minVersion)", doc: `${DOC}#tlsobject` },
    maxVersion: { type: "string", title: "最大 TLS 版本 (maxVersion)", doc: `${DOC}#tlsobject` },

    cipherSuites: { type: "string", title: "加密套件 (cipherSuites)", doc: `${DOC}#tlsobject` },

    certificates: {
      type: "array",
      title: "证书列表 (certificates)",
      doc: `${DOC}#certificateobject`,
      items: { type: "object", refId: "transport.certificate" }
    },

    disableSystemRoot: { type: "boolean", title: "禁用系统根证书 (disableSystemRoot)", doc: `${DOC}#tlsobject`, default: false },
    enableSessionResumption: { type: "boolean", title: "启用会话恢复 (enableSessionResumption)", doc: `${DOC}#tlsobject`, default: false },

    fingerprint: { type: "string", title: "uTLS 指纹 (fingerprint)", doc: `${DOC}#tlsobject` },
    pinnedPeerCertSha256: { type: "string", title: "证书公钥 Pin (pinnedPeerCertSha256)", doc: `${DOC}#tlsobject` },

    curvePreferences: {
      type: "array",
      title: "曲线偏好 (curvePreferences)",
      doc: `${DOC}#tlsobject`,
      items: { type: "string" }
    },

    masterKeyLog: { type: "string", title: "主密钥日志路径 (masterKeyLog)", doc: `${DOC}#tlsobject` },

    echServerKeys: { type: "string", title: "ECH 服务端私钥 (echServerKeys)", doc: `${DOC}#tlsobject` },
    echConfigList: { type: "string", title: "ECH 配置列表 (echConfigList)", doc: `${DOC}#tlsobject` },
    echForceQuery: { type: "string", title: "ECH 强制查询 (echForceQuery)", doc: `${DOC}#tlsobject` },

    echSockopt: {
      type: "object",
      title: "ECH Sockopt (echSockopt)",
      doc: `${DOC}#tlsobject`,
      ui: { widget: "json", hint: "结构与 Sockopt 类似，保留为 JSON 编辑器以适配文档/版本变化" }
    }
  },

  ui: {
    order: [
      "serverName",
      "verifyPeerCertByName",
      "rejectUnknownSni",
      "allowInsecure",
      "alpn",
      "minVersion",
      "maxVersion",
      "cipherSuites",
      "certificates",
      "disableSystemRoot",
      "enableSessionResumption",
      "fingerprint",
      "pinnedPeerCertSha256",
      "curvePreferences",
      "masterKeyLog",
      "echServerKeys",
      "echConfigList",
      "echForceQuery",
      "echSockopt"
    ]
  }
};
