(function(){
  const set = window.XraySchemas.set;

  set("protocol.outbounds", {
    protocolOptions: [
      {v:"freedom",zh:"freedom"},
      {v:"blackhole",zh:"blackhole"},
      {v:"vmess",zh:"vmess"},
      {v:"vless",zh:"vless"},
      {v:"trojan",zh:"trojan"},
      {v:"shadowsocks",zh:"shadowsocks"},
      {v:"socks",zh:"socks"},
      {v:"http",zh:"http"},
      {v:"loopback",zh:"loopback"},
      {v:"wireguard",zh:"wireguard"}
    ]
  });

  // freedom outbound
  set("outbound.settings.freedom", {
    docUrl:"https://xtls.github.io/config/outbounds/freedom.html",
    example:{ domainStrategy:"AsIs", redirect:"", userLevel:0, noises:[] },
    fields:[
      {key:"domainStrategy",labelZh:"域名策略",labelEn:"domainStrategy",type:"select",options:[{v:"AsIs",zh:"AsIs"},{v:"UseIP",zh:"UseIP"},{v:"UseIPv6v4",zh:"UseIPv6v4"},{v:"UseIPv6",zh:"UseIPv6"},{v:"UseIPv4v6",zh:"UseIPv4v6"},{v:"UseIPv4",zh:"UseIPv4"},{v:"ForceIP",zh:"ForceIP"},{v:"ForceIPv6v4",zh:"ForceIPv6v4"},{v:"ForceIPv6",zh:"ForceIPv6"},{v:"ForceIPv4v6",zh:"ForceIPv4v6"},{v:"ForceIPv4",zh:"ForceIPv4"}]},
      {key:"redirect",labelZh:"重定向",labelEn:"redirect",type:"string"},
      {key:"userLevel",labelZh:"等级",labelEn:"userLevel",type:"number"},
      {key:"noises",labelZh:"噪声",labelEn:"noises",type:"json"}
    ]
  });

  // blackhole outbound
  set("outbound.settings.blackhole", {
    docUrl:"https://xtls.github.io/config/outbounds/blackhole.html",
    example:{ response:{type:"none"} },
    fields:[
      {key:"response",labelZh:"响应",labelEn:"response",type:"json"}
    ]
  });

  // vmess outbound（常用字段）
  set("outbound.settings.vmess", {
    docUrl:"https://xtls.github.io/config/outbounds/vmess.html#outboundconfigurationobject",
    example:{ address:"", port:0, id:"", security:"auto", level:0 },
    fields:[
      {key:"address",labelZh:"服务端地址",labelEn:"address",type:"string"},
      {key:"port",labelZh:"服务端端口",labelEn:"port",type:"number"},
      {key:"id",labelZh:"用户 ID",labelEn:"id",type:"string"},
      {key:"security",labelZh:"加密方式",labelEn:"security",type:"select",options:[
        {v:"auto",zh:"auto"},{v:"aes-128-gcm",zh:"aes-128-gcm"},{v:"chacha20-poly1305",zh:"chacha20-poly1305"},
        {v:"none",zh:"none"},{v:"zero",zh:"zero"}
      ]},
      {key:"level",labelZh:"等级",labelEn:"level",type:"number"}
    ]
  });

  // vless outbound
  set("outbound.settings.vless", {
    docUrl:"https://xtls.github.io/config/outbounds/vless.html",
    example:{ address:"", port:0, id:"", flow:"", encryption:"none", level:0 },
    fields:[
      {key:"address",labelZh:"地址",labelEn:"address",type:"string"},
      {key:"port",labelZh:"端口",labelEn:"port",type:"number"},
      {key:"id",labelZh:"ID",labelEn:"id",type:"string"},
      {key:"flow",labelZh:"Flow",labelEn:"flow",type:"string"},
      {key:"encryption",labelZh:"加密",labelEn:"encryption",type:"string"},
      {key:"level",labelZh:"等级",labelEn:"level",type:"number"}
    ]
  });

  // trojan outbound
  set("outbound.settings.trojan", {
    docUrl:"https://xtls.github.io/config/outbounds/trojan.html",
    example:{ address:"", port:0, password:"", email:"", level:0 },
    fields:[
      {key:"address",labelZh:"服务器地址",labelEn:"address",type:"string"},
      {key:"port",labelZh:"服务器端口",labelEn:"port",type:"number"},
      {key:"password",labelZh:"密码",labelEn:"password",type:"string"},
      {key:"email",labelZh:"邮箱标识",labelEn:"email",type:"string"},
      {key:"level",labelZh:"等级",labelEn:"level",type:"number"}
    ]
  });

  // shadowsocks outbound
  set("outbound.settings.shadowsocks", {
    docUrl:"https://xtls.github.io/config/outbounds/shadowsocks.html",
    example:{ email:"", address:"", port:0, method:"", password:"", uot:false, UoTVersion:0, level:0 },
    fields:[
      {key:"email",labelZh:"邮箱标识",labelEn:"email",type:"string"},
      {key:"address",labelZh:"服务器地址",labelEn:"address",type:"string"},
      {key:"port",labelZh:"服务器端口",labelEn:"port",type:"number"},
      {key:"method",labelZh:"加密方法",labelEn:"method",type:"string",placeholder:"如 aes-128-gcm / 2022-blake3-aes-256-gcm"},
      {key:"password",labelZh:"密码",labelEn:"password",type:"string"},
      {key:"uot",labelZh:"启用 UoT",labelEn:"uot",type:"bool"},
      {key:"UoTVersion",labelZh:"UoT 版本",labelEn:"UoTVersion",type:"number",placeholder:"可选：1 或 2",showIf:{path:"uot",equals:true}},
      {key:"level",labelZh:"等级",labelEn:"level",type:"number"}
    ]
  });

  // socks outbound
  set("outbound.settings.socks", {
    docUrl:"https://xtls.github.io/config/outbounds/socks.html",
    example:{ address:"", port:0, user:"", pass:"", level:0, email:"" },
    fields:[
      {key:"address",labelZh:"服务器地址",labelEn:"address",type:"string"},
      {key:"port",labelZh:"服务器端口",labelEn:"port",type:"number"},
      {key:"user",labelZh:"用户名",labelEn:"user",type:"string",placeholder:"如需认证则填写"},
      {key:"pass",labelZh:"密码",labelEn:"pass",type:"string",placeholder:"如需认证则填写"},
      {key:"level",labelZh:"等级",labelEn:"level",type:"number"},
      {key:"email",labelZh:"邮箱标识",labelEn:"email",type:"string"}
    ]
  });

  // http outbound
  set("outbound.settings.http", {
    docUrl:"https://xtls.github.io/config/outbounds/http.html",
    example:{ address:"", port:0, user:"", pass:"", level:0, email:"", headers:{} },
    fields:[
      {key:"address",labelZh:"代理地址",labelEn:"address",type:"string"},
      {key:"port",labelZh:"代理端口",labelEn:"port",type:"number"},
      {key:"user",labelZh:"用户名",labelEn:"user",type:"string",placeholder:"如需认证则填写"},
      {key:"pass",labelZh:"密码",labelEn:"pass",type:"string",placeholder:"如需认证则填写"},
      {key:"level",labelZh:"等级",labelEn:"level",type:"number"},
      {key:"email",labelZh:"邮箱标识",labelEn:"email",type:"string"},
      {key:"headers",labelZh:"请求头",labelEn:"headers",type:"json"}
    ]
  });

  // loopback outbound
  set("outbound.settings.loopback", {
    docUrl:"https://xtls.github.io/config/outbounds/loopback.html",
    example:{ inboundTag:"" },
    fields:[ {key:"inboundTag",labelZh:"回环入站标识",labelEn:"inboundTag",type:"string"} ]
  });

  // wireguard outbound（先 JSON）
  set("outbound.settings.wireguard", {
    docUrl:"https://xtls.github.io/config/outbounds/wireguard.html",
    example:{},
    fields:[
      {key:"_note",labelZh:"提示",labelEn:"note",type:"string",placeholder:"wireguard 字段较多，建议 JSON 标签页全量编辑"}
    ]
  });
})();
