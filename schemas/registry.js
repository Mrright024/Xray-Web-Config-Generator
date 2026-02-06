(function(){
  // 简单 registry：不拉取远端，全部由本地 schema 文件 register
  const store = new Map();

  window.XraySchemas = {
    set(id, schema){ store.set(id, schema); },
    get(id){ return store.get(id); }
  };
})();
