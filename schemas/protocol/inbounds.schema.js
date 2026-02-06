(function(){
  const set = window.XraySchemas.set;

  // 给 UI 下拉用
  set("protocol.inbounds", {
    protocolOptions: [
      {v:"socks",zh:"socks"},
      {v:"http",zh:"http"},
      {v:"vmess",zh:"vmess"},
      {v:"vless",zh:"vless"},
      {v:"trojan",zh:"trojan"},
      {v:"shadowsocks",zh:"shadowsocks"},
      {v:"dokodemo-door",zh:"dokodemo-door"},
      {v:"wireguard",zh:"wireguard"}
    ]
  });

  // socks inbound（常用字段）
  set("inbound.settings.socks", {
    docUrl:"https://xtls.github.io/config/inbounds/socks.html",
    example:{ auth:"noauth", accounts:[], udp:false, ip:"127.0.0.1", userLevel:0 },
    fields:[
      {key:"auth",labelZh:"认证方式",labelEn:"auth",type:"select",options:[{v:"noauth",zh:"noauth"},{v:"password",zh:"password"}]},
      {key:"accounts",labelZh:"账号列表",labelEn:"accounts",type:"json"},
      {key:"udp",labelZh:"UDP 支持",labelEn:"udp",type:"bool"},
      {key:"ip",labelZh:"本地 IP",labelEn:"ip",type:"string"},
      {key:"userLevel",labelZh:"用户等级",labelEn:"userLevel",type:"number"}
    ]
  });

  // http inbound（常用字段）
  set("inbound.settings.http", {
    docUrl:"https://xtls.github.io/config/inbounds/http.html",
    example:{ accounts:[], allowTransparent:false, timeout:0, userLevel:0 },
    fields:[
      {key:"accounts",labelZh:"账号列表",labelEn:"accounts",type:"json"},
      {key:"allowTransparent",labelZh:"透明代理",labelEn:"allowTransparent",type:"bool"},
      {key:"timeout",labelZh:"超时",labelEn:"timeout",type:"number"},
      {key:"userLevel",labelZh:"用户等级",labelEn:"userLevel",type:"number"}
    ]
  });

  // vmess inbound（先提供 clients JSON，避免错漏；后续可细拆 ClientObject 字段）
  set("inbound.settings.vmess", {
    docUrl:"https://xtls.github.io/config/inbounds/vmess.html#inboundconfigurationobject",
    example:{ clients:[], default:{level:0}, disableInsecureEncryption:false },
    fields:[
      {key:"clients",labelZh:"用户列表",labelEn:"clients",type:"json"},
      {key:"default",labelZh:"默认用户",labelEn:"default",type:"json"},
      {key:"disableInsecureEncryption",labelZh:"禁用不安全加密",labelEn:"disableInsecureEncryption",type:"bool"}
    ]
  });

  // vless inbound（按常用字段）
  set("inbound.settings.vless", {
    docUrl:"https://xtls.github.io/config/inbounds/vless.html",
    example:{ clients:[], decryption:"none", fallbacks:[], flow:"", testseed:[] },
    fields:[
      {key:"clients",labelZh:"用户列表",labelEn:"clients",type:"json"},
      {key:"decryption",labelZh:"解密",labelEn:"decryption",type:"string"},
      {key:"fallbacks",labelZh:"Fallbacks",labelEn:"fallbacks",type:"json"},
      {key:"flow",labelZh:"Flow",labelEn:"flow",type:"string"},
      {key:"testseed",labelZh:"TestSeed",labelEn:"testseed",type:"json"}
    ]
  });

  // trojan inbound
  set("inbound.settings.trojan", {
    docUrl:"https://xtls.github.io/config/inbounds/trojan.html",
    example:{ clients:[], fallbacks:[] },
    fields:[
      {key:"clients",labelZh:"用户列表",labelEn:"clients",type:"json"},
      {key:"fallbacks",labelZh:"Fallbacks",labelEn:"fallbacks",type:"json"}
    ]
  });

  // shadowsocks inbound
  set("inbound.settings.shadowsocks", {
    docUrl:"https://xtls.github.io/config/inbounds/shadowsocks.html",
    example:{ method:"aes-128-gcm", password:"", level:0, email:"", network:"tcp,udp", clients:[] },
    fields:[
      {key:"method",labelZh:"加密方法",labelEn:"method",type:"string"},
      {key:"password",labelZh:"密码",labelEn:"password",type:"string"},
      {key:"level",labelZh:"等级",labelEn:"level",type:"number"},
      {key:"email",labelZh:"Email",labelEn:"email",type:"string"},
      {key:"network",labelZh:"网络",labelEn:"network",type:"string"},
      {key:"clients",labelZh:"多用户（clients）",labelEn:"clients",type:"json"}
    ]
  });

  // dokodemo-door inbound
  set("inbound.settings.dokodemo-door", {
    docUrl:"https://xtls.github.io/config/inbounds/dokodemo.html",
    example:{ address:"", port:0, network:"tcp,udp", followRedirect:false, userLevel:0 },
    fields:[
      {key:"address",labelZh:"目标地址",labelEn:"address",type:"string"},
      {key:"port",labelZh:"目标端口",labelEn:"port",type:"number"},
      {key:"network",labelZh:"网络",labelEn:"network",type:"string"},
      {key:"followRedirect",labelZh:"跟随重定向",labelEn:"followRedirect",type:"bool"},
      {key:"userLevel",labelZh:"等级",labelEn:"userLevel",type:"number"}
    ]
  });

  // wireguard inbound（字段差异较大，先 JSON）
  set("inbound.settings.wireguard", {
    docUrl:"https://xtls.github.io/config/inbounds/wireguard.html",
    example:{},
    fields:[
      {key:"_note",labelZh:"提示",labelEn:"note",type:"string",placeholder:"wireguard 字段较多，建议 JSON 标签页全量编辑"}
    ]
  });
})();
