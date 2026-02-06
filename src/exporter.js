(function(){
  const X = window.XFB;
  const U = X.util;
  const ST = X.state.api;

  X.exporter = X.exporter || {};

  function downloadText(filename, text){
    const clean = String(text ?? "").replace(/\s+$/u, "");
    const blob = new Blob([clean], { type:"application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "config.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function mergeTwo(base, patch){
    const isObj = U.isPlainObject;
    const out = U.deepClone(base || {});
    for (const [k,v] of Object.entries(patch || {})){
      if (k === "inbounds"){
        out.inbounds = mergeTaggedArray(out.inbounds || [], Array.isArray(v)?v:[], "append");
        continue;
      }
      if (k === "outbounds"){
        out.outbounds = mergeTaggedArray(out.outbounds || [], Array.isArray(v)?v:[], "prepend");
        continue;
      }
      if (isObj(v) && isObj(out[k])) out[k] = mergePlain(out[k], v);
      else out[k] = U.deepClone(v);
    }
    return out;
  }
  function mergePlain(a,b){
    const out = U.deepClone(a);
    for (const [k,v] of Object.entries(b)){
      if (U.isPlainObject(v) && U.isPlainObject(out[k])) out[k] = mergePlain(out[k], v);
      else out[k] = U.deepClone(v);
    }
    return out;
  }
  function mergeTaggedArray(baseArr, patchArr, mode){
    const out = U.deepClone(baseArr);
    for (const it of patchArr){
      const tag = it?.tag;
      if (tag){
        const idx = out.findIndex(x => x?.tag === tag);
        if (idx >= 0){ out[idx] = U.deepClone(it); continue; }
      }
      if (mode === "append") out.push(U.deepClone(it));
      else out.unshift(U.deepClone(it));
    }
    return out;
  }

  function mergeAll(st){
    if (st.mode === "single") return st.single.obj;
    let merged = {};
    // 按 PARTS 顺序合并；part 内按当前文件顺序合并
    for (const p of X.state.PARTS){
      const files = st.files.filter(f => f.part === p.key && !f.parseError);
      for (const f of files){
        merged = mergeTwo(merged, f.obj);
      }
    }
    return merged;
  }

  X.exporter.api = { downloadText, mergeAll };
})();
