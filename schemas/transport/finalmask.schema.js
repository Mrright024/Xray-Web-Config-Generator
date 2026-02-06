// schemas/transport/finalmask.schema.js
// 来源：/config/transport.html StreamSettingsObject 示例中包含 finalmask.udp
// 文档对 FinalMaskObject 的细项在该页后续章节展开，你后续补齐 enum/结构时可保持该文件独立演进。
// :contentReference[oaicite:6]{index=6}

const DOC = "https://xtls.github.io/config/transport.html";

export default {
  id: "transport.finalmask",
  title: "FinalMask 通用伪装 (finalmask)",
  doc: `${DOC}#finalmaskobject`,
  type: "object",
  additionalProperties: false,

  properties: {
    udp: {
      type: "array",
      title: "UDP 伪装链 (udp)",
      doc: `${DOC}#finalmaskobject`,
      items: { type: "string" },
      ui: { hint: "例如 mkcp-original 等（mKCP 页提示通过 FinalMask 配置）" }
    }
  },

  ui: { order: ["udp"] }
};
