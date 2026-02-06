// src/schemas/transport/grpc_settings_schema.js
// 注意：官方文档里同时出现 camelCase 与 snake_case 字段名；这里按文档示例保留 snake_case 扩展项
export const GrpcSettingsSchema = {
  id: "transport.grpcSettings",
  title: "gRPC 设置(grpcSettings)",
  type: "object",
  doc: { url: "https://xtls.github.io/en/config/transports/grpc.html", hash: "#grpcobject" },
  properties: {
    authority: {
      type: "string",
      label: "Authority(authority)",
      default: ""
    },
    serviceName: {
      type: "string",
      label: "服务名(serviceName)",
      default: ""
    },
    multiMode: {
      type: "boolean",
      label: "多路复用(multiMode)",
      default: false
    },

    // 下面为文档/实现中出现的扩展字段（snake_case）
    user_agent: {
      type: "string",
      label: "User-Agent(user_agent)",
      default: ""
    },
    idle_timeout: {
      type: "number",
      label: "空闲超时(秒)(idle_timeout)",
      default: 0,
      min: 0
    },
    health_check_timeout: {
      type: "number",
      label: "健康检查超时(秒)(health_check_timeout)",
      default: 0,
      min: 0
    },
    permit_without_stream: {
      type: "boolean",
      label: "允许无流(permit_without_stream)",
      default: false
    },
    initial_windows_size: {
      type: "integer",
      label: "初始窗口大小(initial_windows_size)",
      default: 0,
      min: 0
    }
  }
};
