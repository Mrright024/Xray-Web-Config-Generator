// schemas/transport/certificate.schema.js
// 来源：/config/transport.html CertificateObject
// :contentReference[oaicite:3]{index=3}

const DOC = "https://xtls.github.io/config/transport.html";

export default {
  id: "transport.certificate",
  title: "证书对象 (CertificateObject)",
  doc: `${DOC}#certificateobject`,
  type: "object",
  additionalProperties: false,

  properties: {
    ocspStapling: { type: "number", title: "OCSP 装订 (ocspStapling)", doc: `${DOC}#certificateobject` },
    oneTimeLoading: { type: "boolean", title: "仅加载一次 (oneTimeLoading)", doc: `${DOC}#certificateobject`, default: false },
    usage: {
      type: "string",
      title: "用途 (usage)",
      doc: `${DOC}#certificateobject`,
      default: "encipherment",
      enum: ["encipherment", "verify", "issue"]
    },
    buildChain: { type: "boolean", title: "签发时嵌入链 (buildChain)", doc: `${DOC}#certificateobject`, default: false },

    certificateFile: { type: "string", title: "证书文件路径 (certificateFile)", doc: `${DOC}#certificateobject` },
    certificate: {
      type: "array",
      title: "证书内容数组 (certificate)",
      doc: `${DOC}#certificateobject`,
      items: { type: "string" }
    },

    keyFile: { type: "string", title: "密钥文件路径 (keyFile)", doc: `${DOC}#certificateobject` },
    key: {
      type: "array",
      title: "密钥内容数组 (key)",
      doc: `${DOC}#certificateobject`,
      items: { type: "string" }
    }
  },

  ui: {
    order: [
      "usage",
      "ocspStapling",
      "oneTimeLoading",
      "buildChain",
      "certificateFile",
      "certificate",
      "keyFile",
      "key"
    ],
    notes: [
      "certificate/certificateFile 二选一；key/keyFile 二选一（渲染器侧可做互斥校验）"
    ]
  }
};
