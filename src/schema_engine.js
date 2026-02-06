(function(){
  const X = window.XFB;
  const U = X.util;

  X.schema = X.schema || {};

  function getSchema(id){
    return window.XraySchemas?.get(id);
  }

  function ensureDefaults(targetObj, schema){
    // 根据 schema.example 进行缺省补齐（只补不存在的 key）
    if (!schema || !U.isPlainObject(schema.example) || !U.isPlainObject(targetObj)) return;
    for (const [k, v] of Object.entries(schema.example)){
      if (targetObj[k] === undefined){
        targetObj[k] = U.deepClone(v);
      }
    }
  }

  function showIf(field, rootObj){
    const c = field?.showIf;
    if (!c) return true;
    const v = U.getByPath(rootObj, c.path || "");
    if ("equals" in c) return v === c.equals;
    if ("in" in c) return Array.isArray(c.in) && c.in.includes(v);
    if ("exists" in c) return v !== undefined && v !== null && v !== "";
    return true;
  }

  X.schema.api = { getSchema, ensureDefaults, showIf };
})();
