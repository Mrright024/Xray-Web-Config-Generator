// src/schemas/transport/kcp_settings_schema.js
export const KcpSettingsSchema = {
  id: "transport.kcpSettings",
  title: "mKCP 设置(kcpSettings)",
  type: "object",
  doc: { url: "https://xtls.github.io/en/config/transports/mkcp.html", hash: "#kcpobject" },
  properties: {
    mtu: {
      type: "number",
      label: "MTU(mtu)",
      default: 1350,
      min: 576,
      max: 1460
    },
    tti: {
      type: "number",
      label: "发送间隔(ms)(tti)",
      default: 50,
      min: 10,
      max: 100
    },
    uplinkCapacity: {
      type: "number",
      label: "上行容量(MB/s)(uplinkCapacity)",
      default: 5,
      min: 0
    },
    downlinkCapacity: {
      type: "number",
      label: "下行容量(MB/s)(downlinkCapacity)",
      default: 20,
      min: 0
    },
    congestion: {
      type: "boolean",
      label: "拥塞控制(congestion)",
      default: false
    },
    readBufferSize: {
      type: "number",
      label: "读缓冲区(MB)(readBufferSize)",
      default: 2,
      min: 0
    },
    writeBufferSize: {
      type: "number",
      label: "写缓冲区(MB)(writeBufferSize)",
      default: 2,
      min: 0
    }
  }
};
