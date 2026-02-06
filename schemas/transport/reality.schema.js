// schemas/transport/reality.schema.js
// 来源：/config/transport.html RealityObject
// :contentReference[oaicite:4]{index=4}

const DOC = "https://xtls.github.io/config/transport.html";

export default {
  id: "transport.reality",
  title: "REALITY 配置 (realitySettings)",
  doc: `${DOC}#realityobject`,
  type: "object",
  additionalProperties: false,

  properties: {
    // 通用
    show: { type: "boolean", title: "输出调试信息 (show)", doc: `${DOC}#realityobject`, default: false },

    // 服务端（入站）
    target: { type: "string", title: "目标地址 (target)", doc: `${DOC}#realityobject`, ui: { hint: "常见格式 example.com:443" } },
    dest: { type: "string", title: "目标地址别名 (dest)", doc: `${DOC}#realityobject`, ui: { hint: "与 target 语义一致（兼容字段）" } },

    xver: { type: "number", title: "回落 xver (xver)", doc: `${DOC}#realityobject` },
    serverNames: {
      type: "array",
      title: "允许的 ServerName 列表 (serverNames)",
      doc: `${DOC}#realityobject`,
      items: { type: "string" }
    },
    privateKey: { type: "string", title: "服务端私钥 (privateKey)", doc: `${DOC}#realityobject` },

    minClientVer: { type: "string", title: "最小客户端版本 (minClientVer)", doc: `${DOC}#realityobject` },
    maxClientVer: { type: "string", title: "最大客户端版本 (maxClientVer)", doc: `${DOC}#realityobject` },
    maxTimeDiff: { type: "number", title: "最大时间差 (maxTimeDiff)", doc: `${DOC}#realityobject` },

    shortIds: {
      type: "array",
      title: "Short IDs 列表 (shortIds)",
      doc: `${DOC}#realityobject`,
      items: { type: "string" }
    },

    mldsa65Seed: { type: "string", title: "mldsa65 种子 (mldsa65Seed)", doc: `${DOC}#realityobject` },

    limitFallbackUpload: {
      type: "object",
      title: "回落上行限速 (limitFallbackUpload)",
      doc: `${DOC}#realityobject`,
      additionalProperties: false,
      properties: {
        afterBytes: { type: "number", title: "触发阈值字节 (afterBytes)", doc: `${DOC}#realityobject` },
        bytesPerSec: { type: "number", title: "持续速率 B/s (bytesPerSec)", doc: `${DOC}#realityobject` },
        burstBytesPerSec: { type: "number", title: "突发速率 B/s (burstBytesPerSec)", doc: `${DOC}#realityobject` }
      }
    },

    limitFallbackDownload: {
      type: "object",
      title: "回落下行限速 (limitFallbackDownload)",
      doc: `${DOC}#realityobject`,
      additionalProperties: false,
      properties: {
        afterBytes: { type: "number", title: "触发阈值字节 (afterBytes)", doc: `${DOC}#realityobject` },
        bytesPerSec: { type: "number", title: "持续速率 B/s (bytesPerSec)", doc: `${DOC}#realityobject` },
        burstBytesPerSec: { type: "number", title: "突发速率 B/s (burstBytesPerSec)", doc: `${DOC}#realityobject` }
      }
    },

    // 客户端（出站）
    fingerprint: { type: "string", title: "uTLS 指纹 (fingerprint)", doc: `${DOC}#realityobject` },
    serverName: { type: "string", title: "ServerName (serverName)", doc: `${DOC}#realityobject` },
    password: { type: "string", title: "公钥/旧称 publicKey (password)", doc: `${DOC}#realityobject` },
    shortId: { type: "string", title: "Short ID (shortId)", doc: `${DOC}#realityobject` },
    mldsa65Verify: { type: "string", title: "mldsa65 验证公钥 (mldsa65Verify)", doc: `${DOC}#realityobject` },
    spiderX: { type: "string", title: "爬虫初始路径参数 (spiderX)", doc: `${DOC}#realityobject` }
  },

  ui: {
    order: [
      "show",
      "target",
      "dest",
      "xver",
      "serverNames",
      "privateKey",
      "minClientVer",
      "maxClientVer",
      "maxTimeDiff",
      "shortIds",
      "mldsa65Seed",
      "limitFallbackUpload",
      "limitFallbackDownload",
      "fingerprint",
      "serverName",
      "password",
      "shortId",
      "mldsa65Verify",
      "spiderX"
    ]
  }
};
