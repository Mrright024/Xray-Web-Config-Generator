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
  X.util.pruneConfig = (obj) => {
    const U = X.util;

    const prune = (v) => {
      if (v === undefined || v === null || v === "") return undefined;
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

    const stripDefaults = (o) => {
      if (!U.isPlainObject(o)) return o;

      // log defaults
      if (U.isPlainObject(o.log)) {
        if (o.log.loglevel === "warning") delete o.log.loglevel;
        if (Object.keys(o.log).length === 0) delete o.log;
      }

      // routing defaults
      if (U.isPlainObject(o.routing)) {
        if (o.routing.domainStrategy === "AsIs") delete o.routing.domainStrategy;
        if (Array.isArray(o.routing.rules) && o.routing.rules.length === 0) delete o.routing.rules;
        if (Array.isArray(o.routing.balancers) && o.routing.balancers.length === 0) delete o.routing.balancers;
        if (Object.keys(o.routing).length === 0) delete o.routing;
      }

      // dns: drop empty dns
      if (U.isPlainObject(o.dns)) {
        // empty hosts object should already be pruned
        if (Object.keys(o.dns).length === 0) delete o.dns;
      }

      // inbounds/outbounds: drop empty arrays
      if (Array.isArray(o.inbounds) && o.inbounds.length === 0) delete o.inbounds;
      if (Array.isArray(o.outbounds) && o.outbounds.length === 0) delete o.outbounds;

      return o;
    };

    const cloned = U.deepClone(obj ?? {});
    const pruned = prune(cloned);
    const stripped = stripDefaults(pruned || {});
    const final = prune(stripped) || {};
    return final;
  };

})();
