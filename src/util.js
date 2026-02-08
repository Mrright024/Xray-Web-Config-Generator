(function(){
  const X = (window.XFB = window.XFB || {});
  X.util = X.util || {};

  X.util.deepClone = (x) => JSON.parse(JSON.stringify(x));
  X.util.isPlainObject = (x) => !!x && typeof x === "object" && !Array.isArray(x);

  X.util.stringifyJsonClean = (obj) => {
    // 强制不在末尾追加换行/空白，规避 “Unexpected non-whitespace character after JSON …”
    return JSON.stringify(obj ?? {}, null, 2).replace(/\s+$/u, "");
  };

  X.util.escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  X.util.escapeAttr = (s) => X.util.escapeHtml(s).replace(/\n/g, " ");

  X.util.uid = (() => {
    let i = 0;
    return (prefix="id") => `${prefix}_${Date.now().toString(36)}_${(i++).toString(36)}`;
  })();

  X.util.getByPath = (obj, path) => {
    if (!path) return obj;
    const parts = path.split(".");
    let cur = obj;
    for (const k of parts){
      if (!cur) return undefined;
      cur = cur[k];
    }
    return cur;
  };

  X.util.ensureByPath = (obj, path, fallback) => {
    const parts = path.split(".");
    let cur = obj;
    for (let i=0;i<parts.length;i++){
      const k = parts[i];
      if (i === parts.length - 1){
        if (cur[k] === undefined) cur[k] = X.util.deepClone(fallback);
        return cur[k];
      }
      if (!X.util.isPlainObject(cur[k])) cur[k] = {};
      cur = cur[k];
    }
  };

  X.util.delByPath = (obj, path) => {
    const parts = path.split(".");
    let cur = obj;
    for (let i=0;i<parts.length-1;i++){
      cur = cur?.[parts[i]];
      if (!cur) return;
    }
    delete cur[parts[parts.length-1]];
  };

  // === Export pruning: remove unconfigured/empty options to reduce redundancy ===
  // - Removes undefined/null/"" values
  // - Removes empty objects/arrays recursively
  // - Strips some known default values (loglevel=warning, routing.domainStrategy=AsIs)
  X.util.deepEqual = (a, b) => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!X.util.deepEqual(a[i], b[i])) return false;
      return true;
    }
    if (X.util.isPlainObject(a)) {
      if (!X.util.isPlainObject(b)) return false;
      const ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (const k of ka) {
        if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
        if (!X.util.deepEqual(a[k], b[k])) return false;
      }
      return true;
    }
    return false;
  };

  X.util.orderRootKeys = (o) => {
    if (!X.util.isPlainObject(o)) return o;
    const order = [
      "log","api","dns","routing","policy",
      "inbounds","outbounds",
      "transport","stats","reverse",
      "fakedns","observatory","burstObservatory"
    ];
    const out = {};
    for (const k of order) if (Object.prototype.hasOwnProperty.call(o, k)) out[k] = o[k];
    for (const k of Object.keys(o)) if (!Object.prototype.hasOwnProperty.call(out, k)) out[k] = o[k];
    return out;
  };

  X.util.pruneConfig = (obj) => {
    const U = X.util;

    const prune = (v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "string") {
        const s = v.trim();
        return s ? s : undefined;
      }
      if (Array.isArray(v)) {
        const a = v.map(prune).filter(x => x !== undefined);
        return a.length ? a : undefined;
      }
      if (U.isPlainObject(v)) {
        const o = {};
        for (const k of Object.keys(v)) {
          const pv = prune(v[k]);
          if (pv !== undefined) o[k] = pv;
        }
        return Object.keys(o).length ? o : undefined;
      }
      return v;
    };

    const stripByExample = (target, example) => {
      if (!U.isPlainObject(target) || !U.isPlainObject(example)) return;
      for (const [k, dv] of Object.entries(example)) {
        if (!Object.prototype.hasOwnProperty.call(target, k)) continue;
        const tv = target[k];
        if (U.deepEqual(tv, dv)) {
          delete target[k];
        } else {
          if (U.isPlainObject(tv) && U.isPlainObject(dv)) stripByExample(tv, dv);
          if (Array.isArray(tv) && Array.isArray(dv) && dv.length === 0) {
            // 默认是空数组时，不强行删非空数组（用户填了就保留）
          }
        }
      }
    };

    const stripWithSchema = (target, schemaId) => {
      if (!U.isPlainObject(target)) return;
      const sch = window.XraySchemas?.get?.(schemaId);
      if (!sch) return;
      if (U.isPlainObject(sch.example)) stripByExample(target, sch.example);
      if (Array.isArray(sch.fields)) {
        for (const f of sch.fields) {
          const key = f.key;
          if (!key) continue;
          if (f.type === "object" && f.ref && U.isPlainObject(target[key])) {
            stripWithSchema(target[key], f.ref);
          }
          if (f.type === "array_object" && f.ref && Array.isArray(target[key])) {
            target[key].forEach(item => { if (U.isPlainObject(item)) stripWithSchema(item, f.ref); });
          }
        }
      }
    };

    const root = U.deepClone(obj ?? {});
    let pruned = prune(root) || {};

    // ==== schema-driven default stripping (aggressive) ====
    // inbounds
    if (Array.isArray(pruned.inbounds)) {
      pruned.inbounds.forEach(ib => {
        if (!U.isPlainObject(ib)) return;
        if (U.isPlainObject(ib.streamSettings)) stripWithSchema(ib.streamSettings, "transport.streamSettings");
        if (ib.protocol === "socks" && U.isPlainObject(ib.settings)) {
          if (ib.settings.auth !== "password") delete ib.settings.accounts;
        }
        const sid = ib.protocol ? `inbound.settings.${ib.protocol}` : "";
        if (sid && U.isPlainObject(ib.settings) && window.XraySchemas?.get?.(sid)) stripWithSchema(ib.settings, sid);
      });
    }

    // outbounds
    if (Array.isArray(pruned.outbounds)) {
      pruned.outbounds.forEach(ob => {
        if (!U.isPlainObject(ob)) return;
        if (U.isPlainObject(ob.streamSettings)) stripWithSchema(ob.streamSettings, "transport.streamSettings");
        const sid = ob.protocol ? `outbound.settings.${ob.protocol}` : "";
        if (sid && U.isPlainObject(ob.settings) && window.XraySchemas?.get?.(sid)) stripWithSchema(ob.settings, sid);
      });
    }

    // root defaults（常见模块）
    if (U.isPlainObject(pruned.log)) {
      if (pruned.log.loglevel === "warning") delete pruned.log.loglevel;
    }
    if (U.isPlainObject(pruned.routing)) {
      if (pruned.routing.domainStrategy === "AsIs") delete pruned.routing.domainStrategy;
      if (Array.isArray(pruned.routing.rules) && pruned.routing.rules.length === 0) delete pruned.routing.rules;
      if (Array.isArray(pruned.routing.balancers) && pruned.routing.balancers.length === 0) delete pruned.routing.balancers;
    }

    pruned = prune(pruned) || {};
    pruned = U.orderRootKeys(pruned) || {};
    return pruned;
  };

})();
