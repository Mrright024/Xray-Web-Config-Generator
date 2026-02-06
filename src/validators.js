(function(){
  const X = window.XFB;
  const U = X.util;

  X.validators = X.validators || {};

  // IPv4: 0-255.0-255.0-255.0-255
  function isIPv4(s){
    const m = String(s).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!m) return false;
    for (let i=1;i<=4;i++){
      const n = Number(m[i]);
      if (!Number.isInteger(n) || n < 0 || n > 255) return false;
    }
    return true;
  }

  // IPv6 (宽松但实用)：支持 :: 压缩与 hextet
  function isIPv6(s){
    s = String(s).trim();
    if (!s) return false;
    if (s.includes(".")){
      // 不处理 v4-mapped 的复杂情况，交给更宽松策略：有冒号且整体匹配基本结构即可
    }
    const parts = s.split("::");
    if (parts.length > 2) return false;
    const left = parts[0] ? parts[0].split(":").filter(Boolean) : [];
    const right = parts[1] ? parts[1].split(":").filter(Boolean) : [];
    const isH = (h) => /^[0-9a-fA-F]{1,4}$/.test(h);
    if (!left.every(isH)) return false;
    if (!right.every(isH)) return false;
    if (parts.length === 1){
      return left.length === 8; // 无 :: 必须 8 组
    }
    return (left.length + right.length) <= 8; // 有 :: 可少于 8
  }

  function isCIDR(s){
    s = String(s).trim();
    const idx = s.lastIndexOf("/");
    if (idx < 0) return false;
    const ip = s.slice(0, idx);
    const pre = s.slice(idx+1);
    if (!/^\d{1,3}$/.test(pre)) return false;
    const p = Number(pre);
    if (isIPv4(ip)) return p >= 0 && p <= 32;
    if (isIPv6(ip)) return p >= 0 && p <= 128;
    return false;
  }

  function looksLikeIpToken(line){
    // routing.ip 里允许 geoip:cn 等；只对“看起来像 IP/IP段”的行做严格校验
    const s = String(line).trim();
    if (!s) return false;
    if (/^(geoip|ext):/i.test(s)) return false;
    if (/^[\d.]+(\/\d+)?$/.test(s)) return true;
    if (/^[0-9a-fA-F:]+(\/\d+)?$/.test(s) && s.includes(":")) return true;
    return false;
  }

  function validateIpLines(lines){
    const bad = [];
    (lines || []).forEach((line) => {
      const s = String(line).trim();
      if (!looksLikeIpToken(s)) return;
      const ok = isIPv4(s) || isIPv6(s) || isCIDR(s);
      if (!ok) bad.push(s);
    });
    return bad;
  }

  function collectTagsFromState(st){
    // 合并视角收集（不依赖 merge 结果，直接扫各文件 obj）
    const inboundTags = new Set();
    const outboundTags = new Set();
    const balancerTags = new Set();

    const addTag = (set, t) => { if (t && String(t).trim()) set.add(String(t).trim()); };

    const scanObj = (obj) => {
      const inbounds = obj?.inbounds;
      const outbounds = obj?.outbounds;
      const routing = obj?.routing;

      if (Array.isArray(inbounds)) inbounds.forEach(x => addTag(inboundTags, x?.tag));
      if (Array.isArray(outbounds)) outbounds.forEach(x => addTag(outboundTags, x?.tag));
      if (routing && Array.isArray(routing.balancers)) routing.balancers.forEach(b => addTag(balancerTags, b?.tag));
    };

    if (st.mode === "single"){
      scanObj(st.single.obj);
    } else {
      st.files.forEach(f => { if (!f.parseError) scanObj(f.obj); });
    }
    return { inboundTags, outboundTags, balancerTags };
  }

  function validateRoutingRefs(st){
    const errs = [];
    const tags = collectTagsFromState(st);

    const pushErr = (fileId, path, message) => errs.push({ fileId, path, message });

    const validateRule = (fileId, rule, rulePathPrefix) => {
      // inboundTag（array）
      const ibs = rule?.inboundTag;
      if (Array.isArray(ibs)){
        ibs.forEach((t, i) => {
          const v = String(t ?? "").trim();
          if (!v) return;
          if (!tags.inboundTags.has(v)){
            pushErr(fileId, `${rulePathPrefix}.inboundTag.${i}`, `inboundTag 不存在：${v}`);
          }
        });
      }

      // outboundTag vs balancerTag（互斥 + 引用存在性）
      const ob = String(rule?.outboundTag ?? "").trim();
      const bl = String(rule?.balancerTag ?? "").trim();

      if (ob && bl){
        pushErr(fileId, `${rulePathPrefix}.outboundTag`, `outboundTag 与 balancerTag 只能二选一`);
        pushErr(fileId, `${rulePathPrefix}.balancerTag`, `outboundTag 与 balancerTag 只能二选一`);
      } else if (ob){
        if (!tags.outboundTags.has(ob)){
          pushErr(fileId, `${rulePathPrefix}.outboundTag`, `outboundTag 不存在：${ob}`);
        }
      } else if (bl){
        if (!tags.balancerTags.has(bl)){
          pushErr(fileId, `${rulePathPrefix}.balancerTag`, `balancerTag 不存在：${bl}`);
        }
      }

      // ip（array lines）校验
      const ipArr = rule?.ip;
      if (Array.isArray(ipArr)){
        const bad = validateIpLines(ipArr);
        if (bad.length){
          pushErr(fileId, `${rulePathPrefix}.ip`, `IP/IP段格式错误：${bad.slice(0,5).join(", ")}${bad.length>5?" …":""}`);
        }
      }
    };

    if (st.mode === "single"){
      const rules = st.single.obj?.routing?.rules;
      if (Array.isArray(rules)){
        rules.forEach((r, i) => validateRule(st.single.id, r, `routing.rules.${i}`));
      }
    } else {
      st.files.forEach((f) => {
        if (f.parseError) return;
        if (f.part !== "routing") return;
        const rules = f.obj?.routing?.rules;
        if (!Array.isArray(rules)) return;
        rules.forEach((r, i) => validateRule(f.id, r, `routing.rules.${i}`));
      });
    }

    return errs;
  }

  function toErrorMap(errs){
    // key: `${fileId}|${path}`
    const map = {};
    errs.forEach(e => { map[`${e.fileId}|${e.path}`] = e.message; });
    return map;
  }

  X.validators.api = {
    validateAll(st){
      const errs = [
        ...validateRoutingRefs(st)
      ];
      return {
        hasError: errs.length > 0,
        errs,
        errorMap: toErrorMap(errs),
        summary: `共 ${errs.length} 条错误（主要为 routing 引用 tag / IP/IP段 格式）`
      };
    },
    getError(errorMap, fileId, path){
      return errorMap?.[`${fileId}|${path}`] || "";
    },
    collectTagsFromState
  };
})();
