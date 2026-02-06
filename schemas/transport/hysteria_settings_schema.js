// src/schemas/transport/hysteria_settings_schema.js
export const HysteriaSettingsSchema = {
  id: "transport.hysteriaSettings",
  title: "Hysteria 设置(hysteriaSettings)",
  type: "object",
  doc: { url: "https://xtls.github.io/en/config/transports/hysteria.html", hash: "#hysteriaobject" },
  properties: {
    up_mbps: {
      type: "number",
      label: "上行速率(Mbps)(up_mbps)",
      default: 0,
      min: 0
    },
    down_mbps: {
      type: "number",
      label: "下行速率(Mbps)(down_mbps)",
      default: 0,
      min: 0
    },
    obfs: {
      type: "string",
      label: "混淆密码(obfs)",
      default: ""
    },

    // 新增：hysteria transport congestion 配置（来自最近 release 说明）
    congestion: {
      type: "string",
      label: "拥塞算法(congestion)",
      default: "",
      enum: ["", "reno", "bbr", "brutal", "force-brutal"],
      description: "可留空；或显式指定 reno/bbr/brutal/force-brutal。"
    }
  }
};
