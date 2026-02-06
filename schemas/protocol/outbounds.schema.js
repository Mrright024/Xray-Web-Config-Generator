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
      {key:"domainStrategy",labelZh:"域名策略",labelEn:"domainStrategy",type:"string"},
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
    example:{ servers:[] },
    fields:[ {key:"servers",labelZh:"服务器列表",labelEn:"servers",type:"json"} ]
  });

  // shadowsocks outbound
  set("outbound.settings.shadowsocks", {
    docUrl:"https://xtls.github.io/config/outbounds/shadowsocks.html",
    example:{ servers:[] },
    fields:[ {key:"servers",labelZh:"服务器列表",labelEn:"servers",type:"json"} ]
  });

  // socks outbound
  set("outbound.settings.socks", {
    docUrl:"https://xtls.github.io/config/outbounds/socks.html",
    example:{ servers:[] },
    fields:[ {key:"servers",labelZh:"服务器列表",labelEn:"servers",type:"json"} ]
  });

  // http outbound
  set("outbound.settings.http", {
    docUrl:"https://xtls.github.io/config/outbounds/http.html",
    example:{ servers:[] },
    fields:[ {key:"servers",labelZh:"服务器列表",labelEn:"servers",type:"json"} ]
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
