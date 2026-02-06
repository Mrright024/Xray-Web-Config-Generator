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
})();
