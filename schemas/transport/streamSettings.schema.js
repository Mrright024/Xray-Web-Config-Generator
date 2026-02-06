(function(){
  const set = window.XraySchemas.set;

  // 传输层 streamSettings（schema 驱动）
  set("transport.streamSettings", {
    docUrl: "https://xtls.github.io/config/transport.html#streamsettingsobject",
    example: {
      network: "tcp",
      security: "none",
      address: "",
      port: 0,
      tlsSettings: {},
      realitySettings: {},
      rawSettings: {},
      tcpSettings: {},
      xhttpSettings: {},
      splithttpSettings: {},
      kcpSettings: {},
      grpcSettings: {},
      wsSettings: {},
      httpupgradeSettings: {},
      hysteriaSettings: {},
      finalmask: {},
      sockopt: {}
    },
    fields: [
      { key:"network", labelZh:"传输协议", labelEn:"network", type:"select",
        options:[
          {v:"tcp",zh:"tcp"},{v:"raw",zh:"raw"},{v:"kcp",zh:"kcp"},{v:"ws",zh:"ws"},
          {v:"httpupgrade",zh:"httpupgrade"},{v:"grpc",zh:"grpc"},
          {v:"xhttp",zh:"xhttp"},{v:"splithttp",zh:"splithttp"},
          {v:"hysteria",zh:"hysteria"}
        ],
        docUrl:"https://xtls.github.io/config/transport.html#streamsettingsobject"
      },
      { key:"security", labelZh:"传输安全", labelEn:"security", type:"select",
        options:[{v:"none",zh:"none"},{v:"tls",zh:"tls"},{v:"reality",zh:"reality"}],
        docUrl:"https://xtls.github.io/config/transport.html#streamsettingsobject"
      },
      { key:"address", labelZh:"目标地址", labelEn:"address", type:"string", placeholder:"（可选）", docUrl:"https://xtls.github.io/config/transport.html#streamsettingsobject" },
      { key:"port", labelZh:"目标端口", labelEn:"port", type:"number", placeholder:"（可选）", docUrl:"https://xtls.github.io/config/transport.html#streamsettingsobject" },

      { key:"tlsSettings", labelZh:"TLS 配置", labelEn:"tlsSettings", type:"object", ref:"transport.tls",
        showIf:{path:"security", equals:"tls"},
        docUrl:"https://xtls.github.io/config/transport.html#tlsobject"
      },
      { key:"realitySettings", labelZh:"REALITY 配置", labelEn:"realitySettings", type:"object", ref:"transport.reality",
        showIf:{path:"security", equals:"reality"},
        docUrl:"https://xtls.github.io/config/transport.html#realityobject"
      },

      { key:"tcpSettings", labelZh:"TCP/RAW 配置", labelEn:"tcpSettings", type:"object", ref:"transport.raw",
        showIf:{path:"network", in:["tcp","raw"]},
        docUrl:"https://xtls.github.io/config/transports/raw.html#rawobject"
      },
      { key:"rawSettings", labelZh:"RAW 配置（兼容）", labelEn:"rawSettings", type:"object", ref:"transport.raw",
        showIf:{path:"network", in:["tcp","raw"]},
        docUrl:"https://xtls.github.io/config/transports/raw.html#rawobject"
      },

      { key:"kcpSettings", labelZh:"mKCP 配置", labelEn:"kcpSettings", type:"object", ref:"transport.kcp",
        showIf:{path:"network", equals:"kcp"},
        docUrl:"https://xtls.github.io/config/transports/mkcp.html#kcpobject"
      },
      { key:"wsSettings", labelZh:"WebSocket 配置", labelEn:"wsSettings", type:"object", ref:"transport.ws",
        showIf:{path:"network", equals:"ws"},
        docUrl:"https://xtls.github.io/config/transports/websocket.html#websocketobject"
      },
      { key:"httpupgradeSettings", labelZh:"HTTPUpgrade 配置", labelEn:"httpupgradeSettings", type:"object", ref:"transport.httpupgrade",
        showIf:{path:"network", equals:"httpupgrade"},
        docUrl:"https://xtls.github.io/config/transports/httpupgrade.html#httpupgradeobject"
      },
      { key:"grpcSettings", labelZh:"gRPC 配置", labelEn:"grpcSettings", type:"object", ref:"transport.grpc",
        showIf:{path:"network", equals:"grpc"},
        docUrl:"https://xtls.github.io/config/transports/grpc.html#grpcobject"
      },

      { key:"xhttpSettings", labelZh:"XHTTP 配置", labelEn:"xhttpSettings", type:"object", ref:"transport.xhttp",
        showIf:{path:"network", equals:"xhttp"}
      },
      { key:"splithttpSettings", labelZh:"SplitHTTP 配置", labelEn:"splithttpSettings", type:"object", ref:"transport.xhttp",
        showIf:{path:"network", equals:"splithttp"}
      },

      { key:"hysteriaSettings", labelZh:"Hysteria 传输配置", labelEn:"hysteriaSettings", type:"object", ref:"transport.hysteria",
        showIf:{path:"network", equals:"hysteria"},
        docUrl:"https://xtls.github.io/config/transports/hysteria.html#hysteriaobject"
      },

      { key:"finalmask", labelZh:"FinalMask 配置", labelEn:"finalmask", type:"object", ref:"transport.finalmask",
        docUrl:"https://xtls.github.io/config/transport.html#finalmaskobject"
      },
      { key:"sockopt", labelZh:"Sockopt 配置", labelEn:"sockopt", type:"object", ref:"transport.sockopt",
        docUrl:"https://xtls.github.io/config/transport.html#sockoptobject"
      }
    ]
  });

  // TLSObject（对齐文档示例字段）
  set("transport.tls", {
    docUrl: "https://xtls.github.io/config/transport.html#tlsobject",
    example: {
      rejectUnknownSni: false,
      minVersion: "1.2",
      maxVersion: "1.3",
      cipherSuites: "",
      certificate: [],
      disableSystemRoot: false,
      enableSessionResumption: false,
      masterKeyLog: "",
      ech: { enabled:false, pqSignatureSchemesEnabled:false, dynamicRecordSizingDisabled:false }
    },
    fields: [
      {key:"rejectUnknownSni",labelZh:"拒绝未知 SNI",labelEn:"rejectUnknownSni",type:"bool"},
      {key:"minVersion",labelZh:"最小版本",labelEn:"minVersion",type:"string",placeholder:"如 1.2"},
      {key:"maxVersion",labelZh:"最大版本",labelEn:"maxVersion",type:"string",placeholder:"如 1.3"},
      {key:"cipherSuites",labelZh:"套件列表",labelEn:"cipherSuites",type:"string",placeholder:"用冒号分隔"},
      {key:"certificate",labelZh:"证书列表",labelEn:"certificate",type:"json"},
      {key:"disableSystemRoot",labelZh:"禁用系统根证书",labelEn:"disableSystemRoot",type:"bool"},
      {key:"enableSessionResumption",labelZh:"启用会话恢复",labelEn:"enableSessionResumption",type:"bool"},
      {key:"masterKeyLog",labelZh:"密钥日志路径",labelEn:"masterKeyLog",type:"string",placeholder:"（可选）"},
      {key:"ech",labelZh:"ECH 配置",labelEn:"ech",type:"object",ref:"transport.tls.ech"}
    ]
  });
  set("transport.tls.ech", {
    example: { enabled:false, pqSignatureSchemesEnabled:false, dynamicRecordSizingDisabled:false },
    fields: [
      {key:"enabled",labelZh:"启用",labelEn:"enabled",type:"bool"},
      {key:"pqSignatureSchemesEnabled",labelZh:"PQ 签名方案",labelEn:"pqSignatureSchemesEnabled",type:"bool"},
      {key:"dynamicRecordSizingDisabled",labelZh:"禁用动态记录大小",labelEn:"dynamicRecordSizingDisabled",type:"bool"}
    ]
  });

  // RealityObject（对齐文档示例字段）
  set("transport.reality", {
    docUrl: "https://xtls.github.io/config/transport.html#realityobject",
    example: {
      show: false,
      dest: "www.google.com:443",
      xver: 0,
      serverNames: ["example.com"],
      privateKey: "",
      minClientVer: "",
      maxClientVer: "",
      maxTimeDiff: 0,
      shortIds: [""],
      fingerprint: ""
    },
    fields: [
      {key:"show",labelZh:"显示调试信息",labelEn:"show",type:"bool"},
      {key:"dest",labelZh:"目标地址",labelEn:"dest",type:"string",placeholder:"host:port"},
      {key:"xver",labelZh:"Xver",labelEn:"xver",type:"number"},
      {key:"serverNames",labelZh:"SNI 列表",labelEn:"serverNames",type:"string_lines",placeholder:"每行一个域名"},
      {key:"privateKey",labelZh:"私钥",labelEn:"privateKey",type:"string",placeholder:"（敏感）"},
      {key:"minClientVer",labelZh:"最小客户端版本",labelEn:"minClientVer",type:"string"},
      {key:"maxClientVer",labelZh:"最大客户端版本",labelEn:"maxClientVer",type:"string"},
      {key:"maxTimeDiff",labelZh:"最大时间差",labelEn:"maxTimeDiff",type:"number"},
      {key:"shortIds",labelZh:"ShortId 列表",labelEn:"shortIds",type:"string_lines",placeholder:"每行一个 shortId"},
      {key:"fingerprint",labelZh:"指纹",labelEn:"fingerprint",type:"string"}
    ]
  });

  // RawObject（transports/raw）
  set("transport.raw", {
    docUrl: "https://xtls.github.io/config/transports/raw.html#rawobject",
    example: {
      acceptProxyProtocol: false,
      header: {
        type: "none",
        request: { version:"1.1", method:"GET", path:["/"], headers:{} },
        response: { version:"1.1", status:"200", reason:"OK", headers:{} }
      }
    },
    fields: [
      {key:"acceptProxyProtocol",labelZh:"接受 Proxy Protocol",labelEn:"acceptProxyProtocol",type:"bool"},
      {key:"header",labelZh:"伪装头",labelEn:"header",type:"object",ref:"transport.raw.header"}
    ]
  });
  set("transport.raw.header", {
    example: {
      type:"none",
      request:{ version:"1.1", method:"GET", path:["/"], headers:{} },
      response:{ version:"1.1", status:"200", reason:"OK", headers:{} }
    },
    fields: [
      {key:"type",labelZh:"类型",labelEn:"type",type:"select",options:[{v:"none",zh:"none"},{v:"http",zh:"http"}]},
      {key:"request",labelZh:"请求",labelEn:"request",type:"json"},
      {key:"response",labelZh:"响应",labelEn:"response",type:"json"}
    ]
  });

  // KCPObject（transports/mkcp）
  set("transport.kcp", {
    docUrl: "https://xtls.github.io/config/transports/mkcp.html#kcpobject",
    example: {
      mtu: 1350, tti: 50, uplinkCapacity: 12, downlinkCapacity: 100,
      congestion: false, readBufferSize: 2, writeBufferSize: 2,
      header: { type:"none" }, seed: ""
    },
    fields: [
      {key:"mtu",labelZh:"MTU",labelEn:"mtu",type:"number"},
      {key:"tti",labelZh:"TTI",labelEn:"tti",type:"number"},
      {key:"uplinkCapacity",labelZh:"上行容量",labelEn:"uplinkCapacity",type:"number"},
      {key:"downlinkCapacity",labelZh:"下行容量",labelEn:"downlinkCapacity",type:"number"},
      {key:"congestion",labelZh:"拥塞控制",labelEn:"congestion",type:"bool"},
      {key:"readBufferSize",labelZh:"读缓存",labelEn:"readBufferSize",type:"number"},
      {key:"writeBufferSize",labelZh:"写缓存",labelEn:"writeBufferSize",type:"number"},
      {key:"header",labelZh:"伪装头",labelEn:"header",type:"json"},
      {key:"seed",labelZh:"Seed",labelEn:"seed",type:"string"}
    ]
  });

  // GRPCObject
  set("transport.grpc", {
    docUrl: "https://xtls.github.io/config/transports/grpc.html#grpcobject",
    example: {
      authority: "", serviceName: "", multiMode: false,
      idle_timeout: 0, health_check_timeout: 0, permit_without_stream: false, initial_windows_size: 0
    },
    fields: [
      {key:"authority",labelZh:"Authority",labelEn:"authority",type:"string"},
      {key:"serviceName",labelZh:"服务名",labelEn:"serviceName",type:"string"},
      {key:"multiMode",labelZh:"多路模式",labelEn:"multiMode",type:"bool"},
      {key:"idle_timeout",labelZh:"空闲超时",labelEn:"idle_timeout",type:"number"},
      {key:"health_check_timeout",labelZh:"健康检查超时",labelEn:"health_check_timeout",type:"number"},
      {key:"permit_without_stream",labelZh:"允许无流",labelEn:"permit_without_stream",type:"bool"},
      {key:"initial_windows_size",labelZh:"初始窗口大小",labelEn:"initial_windows_size",type:"number"}
    ]
  });

  // WebSocketObject
  set("transport.ws", {
    docUrl: "https://xtls.github.io/config/transports/websocket.html#websocketobject",
    example: { path:"/", headers:{}, acceptProxyProtocol:false },
    fields: [
      {key:"path",labelZh:"路径",labelEn:"path",type:"string"},
      {key:"headers",labelZh:"请求头",labelEn:"headers",type:"json"},
      {key:"acceptProxyProtocol",labelZh:"接受 Proxy Protocol",labelEn:"acceptProxyProtocol",type:"bool"}
    ]
  });

  // HTTPUpgradeObject
  set("transport.httpupgrade", {
    docUrl: "https://xtls.github.io/config/transports/httpupgrade.html#httpupgradeobject",
    example: { path:"/", host:"", acceptProxyProtocol:false },
    fields: [
      {key:"path",labelZh:"路径",labelEn:"path",type:"string"},
      {key:"host",labelZh:"Host",labelEn:"host",type:"string"},
      {key:"acceptProxyProtocol",labelZh:"接受 Proxy Protocol",labelEn:"acceptProxyProtocol",type:"bool"}
    ]
  });

  // HysteriaObject（transports/hysteria）
  set("transport.hysteria", {
    docUrl: "https://xtls.github.io/config/transports/hysteria.html#hysteriaobject",
    example: { hopInterval:0, transmission:{}, udpHop:{}, udpNoises:[] },
    fields: [
      {key:"hopInterval",labelZh:"Hop 间隔",labelEn:"hopInterval",type:"number"},
      {key:"transmission",labelZh:"Transmission",labelEn:"transmission",type:"json"},
      {key:"udpHop",labelZh:"UDP Hop",labelEn:"udpHop",type:"json"},
      {key:"udpNoises",labelZh:"UDP 噪声",labelEn:"udpNoises",type:"json"}
    ]
  });

  // SockoptObject（对齐 transport 页面示例字段）
  set("transport.sockopt", {
    docUrl: "https://xtls.github.io/config/transport.html#sockoptobject",
    example: {
      mark: 0, tcpFastOpen: false, tcpKeepAliveInterval: 0, tcpKeepAliveIdle: 0,
      tcpUserTimeout: 0, tcpcongestion: "", tcpMptcp: false, tcpNoDelay: false,
      interface: "", V6Only: false, acceptProxyProtocol: false, dialerProxy: "",
      tproxy: "off", tcpWindowClamp: 0, tcpMaxSeg: 0, happyEyeballs: {}, customSockopt: []
    },
    fields: [
      {key:"mark",labelZh:"Mark",labelEn:"mark",type:"number"},
      {key:"tcpFastOpen",labelZh:"TFO",labelEn:"tcpFastOpen",type:"bool"},
      {key:"tcpKeepAliveInterval",labelZh:"KeepAlive 间隔",labelEn:"tcpKeepAliveInterval",type:"number"},
      {key:"tcpKeepAliveIdle",labelZh:"KeepAlive Idle",labelEn:"tcpKeepAliveIdle",type:"number"},
      {key:"tcpUserTimeout",labelZh:"TCP User Timeout",labelEn:"tcpUserTimeout",type:"number"},
      {key:"tcpcongestion",labelZh:"拥塞算法",labelEn:"tcpcongestion",type:"string",placeholder:"如 bbr"},
      {key:"tcpMptcp",labelZh:"MPTCP",labelEn:"tcpMptcp",type:"bool"},
      {key:"tcpNoDelay",labelZh:"NoDelay",labelEn:"tcpNoDelay",type:"bool"},
      {key:"interface",labelZh:"绑定网卡",labelEn:"interface",type:"string"},
      {key:"V6Only",labelZh:"V6Only",labelEn:"V6Only",type:"bool"},
      {key:"acceptProxyProtocol",labelZh:"接受 Proxy Protocol",labelEn:"acceptProxyProtocol",type:"bool"},
      {key:"dialerProxy",labelZh:"拨号代理",labelEn:"dialerProxy",type:"string"},
      {key:"tproxy",labelZh:"TPROXY",labelEn:"tproxy",type:"select",options:[{v:"off",zh:"off"},{v:"tproxy",zh:"tproxy"},{v:"redirect",zh:"redirect"}]},
      {key:"tcpWindowClamp",labelZh:"窗口钳制",labelEn:"tcpWindowClamp",type:"number"},
      {key:"tcpMaxSeg",labelZh:"最大分段",labelEn:"tcpMaxSeg",type:"number"},
      {key:"happyEyeballs",labelZh:"HappyEyeballs",labelEn:"happyEyeballs",type:"json"},
      {key:"customSockopt",labelZh:"自定义 Sockopt",labelEn:"customSockopt",type:"json"}
    ]
  });

  // FinalMaskObject（对齐 transport 页面示例字段）
  set("transport.finalmask", {
    docUrl: "https://xtls.github.io/config/transport.html#finalmaskobject",
    example: {
      enabled:false,
      paths:[""],
      regex:"",
      prefix:"",
      suffix:"",
      type:"random",
      domain:"www.example.com",
      dns:{},
      tls:{}
    },
    fields: [
      {key:"enabled",labelZh:"启用",labelEn:"enabled",type:"bool"},
      {key:"paths",labelZh:"路径列表",labelEn:"paths",type:"string_lines",placeholder:"每行一条 path"},
      {key:"regex",labelZh:"正则",labelEn:"regex",type:"string"},
      {key:"prefix",labelZh:"前缀",labelEn:"prefix",type:"string"},
      {key:"suffix",labelZh:"后缀",labelEn:"suffix",type:"string"},
      {key:"type",labelZh:"类型",labelEn:"type",type:"select",options:[{v:"random",zh:"random"},{v:"fixed",zh:"fixed"}]},
      {key:"domain",labelZh:"域名",labelEn:"domain",type:"string"},
      {key:"dns",labelZh:"DNS",labelEn:"dns",type:"json"},
      {key:"tls",labelZh:"TLS",labelEn:"tls",type:"json"}
    ]
  });

  // XHTTP/SplitHTTP（来自社区配置片段，字段随版本变化；保留 JSON 兜底能力）
  set("transport.xhttp", {
    docUrl: "https://xtls.github.io/en/config/transport.html",
    example: {
      headers: {},
      host: "",
      mode: "auto",
      noSSEHeader: false,
      path: "/",
      scMaxBufferedPosts: 30,
      scMaxEachPostBytes: "1000000",
      scStreamUpServerSecs: "20-80",
      xPaddingBytes: "100-10000",
      extra: {}
    },
    fields: [
      {key:"host",labelZh:"Host",labelEn:"host",type:"string"},
      {key:"path",labelZh:"路径",labelEn:"path",type:"string"},
      {key:"mode",labelZh:"模式",labelEn:"mode",type:"select",options:[{v:"auto",zh:"auto"},{v:"packet-up",zh:"packet-up"},{v:"stream-up",zh:"stream-up"}]},
      {key:"headers",labelZh:"Headers",labelEn:"headers",type:"json"},
      {key:"noSSEHeader",labelZh:"禁用 SSE Header",labelEn:"noSSEHeader",type:"bool"},
      {key:"scMaxBufferedPosts",labelZh:"最大缓冲 Posts",labelEn:"scMaxBufferedPosts",type:"number"},
      {key:"scMaxEachPostBytes",labelZh:"单 Post 最大字节",labelEn:"scMaxEachPostBytes",type:"string"},
      {key:"scStreamUpServerSecs",labelZh:"StreamUp ServerSecs",labelEn:"scStreamUpServerSecs",type:"string"},
      {key:"xPaddingBytes",labelZh:"Padding Bytes",labelEn:"xPaddingBytes",type:"string"},
      {key:"extra",labelZh:"Extra",labelEn:"extra",type:"json"}
    ]
  });
})();
