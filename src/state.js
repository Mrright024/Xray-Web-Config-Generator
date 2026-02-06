(function(){
  const X = window.XFB;
  const U = X.util;

  X.state = X.state || {};

  const LS_KEY = "xray_form_builder_v4_state";

  X.state.PARTS = [
    { key:"log",      prefix:"00_log",      title:"日志（log）",        multi:false },
    { key:"dns",      prefix:"01_dns",      title:"DNS（dns）",         multi:false },
    { key:"routing",  prefix:"02_routing",  title:"路由（routing）",     multi:true  },
    { key:"inbounds", prefix:"03_inbounds", title:"入站（inbounds）",    multi:true  },
    { key:"outbounds",prefix:"04_outbounds",title:"出站（outbounds）",   multi:true  },
  ];
  const partMeta = Object.fromEntries(X.state.PARTS.map(p => [p.key, p]));

  X.state.DOC = {
    overview: "https://xtls.github.io/config/",
    multiple: "https://xtls.github.io/config/features/multiple.html",
    transport: "https://xtls.github.io/config/transport.html#streamsettingsobject",
    inbound: "https://xtls.github.io/config/inbound.html#inboundobject",
    outbound: "https://xtls.github.io/config/outbound.html#outboundobject",
    routing: "https://xtls.github.io/config/routing.html#routingobject"
  };

  function defaultSingleConfig(){
    return {
      log: { loglevel: "warning" },
      dns: {},
      inbounds: [],
      outbounds: [{ tag:"direct", protocol:"freedom", settings:{} }],
      routing: { domainStrategy:"AsIs", rules:[], balancers:[] }
    };
  }

  function fragmentTemplate(part){
    if (part === "log") return { log: { loglevel:"warning" } };
    if (part === "dns") return { dns: {} };
    if (part === "routing") return { routing: { domainStrategy:"AsIs", rules:[], balancers:[] } };
    if (part === "inbounds") return { inbounds: [ { tag:"in-1", listen:"0.0.0.0", port:1080, protocol:"socks", settings:{}, streamSettings:{} } ] };
    if (part === "outbounds") return { outbounds: [ { tag:"out-1", protocol:"freedom", settings:{}, streamSettings:{} } ] };
    return {};
  }

  function buildFile(part){
    return {
      id: U.uid("f"),
      part,
      suffix: "",
      obj: fragmentTemplate(part),
      jsonText: "",
      parseError: ""
    };
  }

  function computeFileName(part, indexInPart, totalInPart, suffix){
    const m = partMeta[part];
    const base = m.prefix;
    const needsIndex = m.multi && totalInPart > 1;
    const idx = needsIndex ? `-${indexInPart}` : "";
    const suf = (suffix && suffix.trim()) ? `_${suffix.trim()}` : "";
    return `${base}${idx}${suf}.json`;
  }

  function load(){
    try{
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    }catch(e){ return null; }
  }
  function save(st){
    try{
      const minimal = U.deepClone(st);
      // jsonText 可再生成，避免 LS 膨胀
      if (minimal.single) minimal.single.jsonText = "";
      if (minimal.files) minimal.files.forEach(f => f.jsonText = "");
      localStorage.setItem(LS_KEY, JSON.stringify(minimal));
    }catch(e){}
  }

  function normalize(st){
    if (!st) st = {};
    if (!st.mode) st.mode = "single";
    if (!st.tab) st.tab = "form";

    if (!st.single){
      st.single = { id:U.uid("single"), name:"config.json", obj: defaultSingleConfig(), jsonText:"", parseError:"" };
    }
    if (!Array.isArray(st.files) || st.files.length === 0){
      // 多文件初始：每个非 multi 部分 1 个文件；multi 部分 0 个（用户按需添加）
      st.files = [
        buildFile("log"),
        buildFile("dns"),
      ];
    }

    // 保障 log/dns 单文件唯一
    const ensureSinglePart = (part) => {
      const arr = st.files.filter(f => f.part === part);
      if (arr.length === 0) st.files.push(buildFile(part));
      if (arr.length > 1){
        // 仅保留第一个，其余丢弃（避免结构违背“单 part 单文件”）
        const keep = arr[0].id;
        st.files = st.files.filter(f => f.part !== part || f.id === keep);
      }
    };
    ensureSinglePart("log");
    ensureSinglePart("dns");

    // active
    if (!st.activeId){
      st.activeId = (st.mode === "single") ? st.single.id : st.files[0].id;
    }
    // 生成/校验 jsonText
    const syncFile = (f) => {
      if (!f.obj || typeof f.obj !== "object") f.obj = {};
      if (!f.jsonText) f.jsonText = U.stringifyJsonClean(f.obj);
      try{
        JSON.parse(f.jsonText.trim() || "{}");
        f.parseError = "";
      }catch(e){
        f.parseError = String(e);
      }
    };
    syncFile(st.single);
    st.files.forEach(syncFile);

    return st;
  }

  X.state.api = {
    defaultSingleConfig,
    buildFile,
    computeFileName,
    loadState: () => normalize(load()),
    saveState: save,
    normalizeState: normalize,
    getActiveFile(st){
      if (st.mode === "single") return st.single;
      return st.files.find(f => f.id === st.activeId) || st.files[0];
    },
    getFilesByPart(st, part){
      return st.files.filter(f => f.part === part);
    },
    partMeta
  };
})();
