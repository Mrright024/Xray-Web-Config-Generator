(function () {
  const X = window.XFB;
  const U = X.util;
  const ST = X.state.api;
  const R = X.render.api;
  const V = X.validators.api;
  const DND = X.dnd.api;
  const EXP = X.exporter.api;

  const elModeSingle = document.getElementById("modeSingle");
  const elModeMulti = document.getElementById("modeMulti");
  const elBtnDocs = document.getElementById("btnDocs");
  const elBtnDownloadActive = document.getElementById("btnDownloadActive");
  const elBtnDownloadAll = document.getElementById("btnDownloadAll");
  const elAsideHint = document.getElementById("asideHint");
  const elFilePlan = document.getElementById("filePlan");
  const elContent = document.getElementById("content");
  const elParseDot = document.getElementById("parseDot");
  const elParseText = document.getElementById("parseText");
  const elTabMerge = document.getElementById("tabMerge");

  const elBtnAddRoutingFile = document.getElementById("btnAddRoutingFile");
  const elBtnAddInboundFile = document.getElementById("btnAddInboundFile");
  const elBtnAddOutboundFile = document.getElementById("btnAddOutboundFile");

  // modal
  const elModal = document.getElementById("modal");
  const elModalTitle = document.getElementById("modalTitle");
  const elModalBody = document.getElementById("modalBody");
  const elModalClose = document.getElementById("modalClose");
  const elModalCancel = document.getElementById("modalCancel");
  const elModalContinue = document.getElementById("modalContinue");

  let state = ST.loadState();
  let lastDownloadAction = null; // function()

  function setParseOk() {
    elParseDot.classList.remove("err");
    elParseText.textContent = "JSON 可解析";
  }
  function setParseErr() {
    elParseDot.classList.add("err");
    elParseText.textContent = "JSON 解析失败";
  }

  function openModal(arg1, onContinue) {
    // 兼容旧调用：openModal(html, fn)
    const opt = (arg1 && typeof arg1 === "object")
      ? arg1
      : { title: "提示", html: String(arg1 ?? ""), onContinue };

    elModalTitle.textContent = opt.title || "提示";
    elModalBody.innerHTML = opt.html || "";
    elModalContinue.textContent = opt.continueText || "继续";
    elModalContinue.className = opt.continueClass || "btn primary";

    elModal.classList.remove("hidden");
    lastDownloadAction = opt.onContinue || null;
  }
  function closeModal() {
    elModal.classList.add("hidden");
    lastDownloadAction = null;
  }

  elModal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
  });
  elModalClose.addEventListener("click", closeModal);
  elModalCancel.addEventListener("click", closeModal);
  elModalContinue.addEventListener("click", () => {
    const fn = lastDownloadAction;
    closeModal();
    fn?.();
  });

  // UI state
  state.ui = state.ui || {};
  state.ui.collapse = state.ui.collapse || {};

  // debounce timers
  let __saveT = 0;
  let __renderT = 0;

  function scheduleSave() {
    clearTimeout(__saveT);
    __saveT = setTimeout(() => ST.saveState(state), 200);
  }

  function captureUI() {
    const snap = {
      contentScrollTop: elContent.scrollTop,
      filePlanScrollTop: elFilePlan.scrollTop,
      activePath: "",
      selStart: null,
      selEnd: null,
    };
    const a = document.activeElement;
    if (a && a.getAttribute) {
      snap.activePath = a.getAttribute("data-path") || "";
      try { snap.selStart = a.selectionStart; snap.selEnd = a.selectionEnd; } catch { }
    }
    return snap;
  }

  function restoreUI(snap) {
    elContent.scrollTop = snap.contentScrollTop || 0;
    elFilePlan.scrollTop = snap.filePlanScrollTop || 0;
    if (!snap.activePath) return;

    const selector = `[data-path="${CSS.escape(snap.activePath)}"]`;
    const el = document.querySelector(selector);
    if (!el) return;

    el.focus({ preventScroll: true });
    try {
      if (el.setSelectionRange && snap.selStart != null) {
        el.setSelectionRange(snap.selStart, snap.selEnd ?? snap.selStart);
      }
    } catch { }
  }

  function renderPreserveUI() {
    const snap = captureUI();
    render();
    restoreUI(snap);
  }

  function scheduleRender() {
    clearTimeout(__renderT);
    __renderT = setTimeout(() => renderPreserveUI(), 120);
  }


  function save() {
    ST.saveState(state);
  }

  function syncJsonFromObj(file) {
    file.jsonText = U.stringifyJsonClean(file.obj);
    file.parseError = "";
    scheduleSave();
    setParseOk();
  }

  function activeFile() {
    return ST.getActiveFile(state);
  }

  function renderFilePlan(errorMap) {
    elFilePlan.innerHTML = "";

    if (state.mode === "single") {
      const f = state.single;
      const box = document.createElement("div");
      box.className = "group";
      box.innerHTML = `
        <div class="group-head">
          <div class="group-title">单文件</div>
          <div class="hint">完整 config.json</div>
        </div>
      `;
      const list = document.createElement("div");
      list.className = "file-list";

      const item = document.createElement("div");
      item.className = "file-item active";
      item.innerHTML = `
        <div class="file-row">
          <div class="file-name">config.json</div>
          <div class="status"><span class="dot ${f.parseError ? "err" : ""}"></span><span>${f.parseError ? "解析失败" : "可解析"}</span></div>
        </div>
        <div class="hint">建议：优先补齐 inbounds/outbounds/routing</div>
      `;
      list.appendChild(item);
      box.appendChild(list);
      elFilePlan.appendChild(box);
      return;
    }

    // multi
    X.state.PARTS.forEach((p) => {
      const files = state.files.filter(f => f.part === p.key);
      const group = document.createElement("div");
      group.className = "group";
      const head = document.createElement("div");
      head.className = "group-head";
      head.innerHTML = `<div class="group-title">${U.escapeHtml(p.title)}</div><div class="hint">${p.multi ? "可拆分多文件" : "固定单文件"}</div>`;
      group.appendChild(head);

      const list = document.createElement("div");
      list.className = "file-list";
      list.setAttribute("data-part", p.key);

      files.forEach((f, idx) => {
        const total = files.length;
        const filename = ST.computeFileName(p.key, idx + 1, total, f.suffix);
        const it = document.createElement("div");
        it.className = "file-item" + (f.id === state.activeId ? " active" : "");
        it.setAttribute("draggable", p.multi ? "true" : "false");
        it.setAttribute("data-id", f.id);

        it.innerHTML = `
          <div class="file-row">
            <div class="file-name">
              ${p.multi ? `<span class="drag-handle" title="拖拽排序">⠿</span>` : ""}
              <span class="mono">${U.escapeHtml(filename)}</span>
            </div>
            <div class="status"><span class="dot ${f.parseError ? "err" : ""}"></span><span>${f.parseError ? "解析失败" : "可解析"}</span></div>
          </div>

          <div class="file-row">
            <div class="suffix-edit">
              <span class="hint">后缀</span>
              <input type="text" data-path="${U.escapeAttr(`${f.id}:filePlan.suffix`)}" value="${U.escapeAttr(f.suffix || "")}" placeholder="可选，如 hk" />
            </div>
            <div class="file-actions">
              <button class="btn small" type="button" data-open="1">打开</button>
              ${p.multi ? `<button class="btn small danger" type="button" data-del="1">删除</button>` : ""}
            </div>
          </div>

          <div class="hint">part：<span class="mono">${U.escapeHtml(p.key)}</span></div>
        `;

        it.querySelector("input").addEventListener("input", (e) => {
          f.suffix = e.target.value;
          scheduleSave();

          // 不重渲染：直接更新当前条目的文件名显示
          const idxNow = files.findIndex(x => x.id === f.id);
          const filenameNow = ST.computeFileName(p.key, idxNow + 1, files.length, f.suffix);
          const nameSpan = it.querySelector(".file-name .mono");
          if (nameSpan) nameSpan.textContent = filenameNow;
        });
it.querySelector("[data-open]").addEventListener("click", () => {
          state.activeId = f.id;
          state.tab = "form";
          save();
          scheduleRender();
        });

        const delBtn = it.querySelector("[data-del]");
        if (delBtn) {
          delBtn.addEventListener("click", () => {
            // 删除文件（仅 multi part）
            state.files = state.files.filter(x => x.id !== f.id);
            if (state.activeId === f.id) {
              const remain = state.files.find(x => x.part === p.key) || state.files[0];
              state.activeId = remain?.id;
            }
            save();
            scheduleRender();
          });
        }

        it.addEventListener("click", (e) => {
          if (e.target.closest("button") || e.target.tagName === "INPUT") return;
          state.activeId = f.id;
          save();
          scheduleRender();
        });

        list.appendChild(it);
      });

      group.appendChild(list);
      elFilePlan.appendChild(group);

      // 启用 DnD：仅 multi part
      if (p.multi) {
        DND.enableDnD({
          container: list,
          itemsSelector: ".file-item",
          onReorder: (dragId, overId) => {
            const arr = state.files.filter(f => f.part === p.key);
            const dragIdx = arr.findIndex(f => f.id === dragId);
            const overIdx = arr.findIndex(f => f.id === overId);
            if (dragIdx < 0 || overIdx < 0) return;

            const moved = arr.splice(dragIdx, 1)[0];
            arr.splice(overIdx, 0, moved);

            // 写回 state.files：保持 part 分段稳定（只重排该 part 内部顺序）
            const others = state.files.filter(f => f.part !== p.key);
            state.files = [
              ...others.filter(f => f.part === "log"),
              ...others.filter(f => f.part === "dns"),
              ...((p.key === "routing") ? arr : others.filter(f => f.part === "routing")),
              ...((p.key === "inbounds") ? arr : others.filter(f => f.part === "inbounds")),
              ...((p.key === "outbounds") ? arr : others.filter(f => f.part === "outbounds")),
            ].filter(Boolean);

            // 上面写法为简化：再做一次按 PARTS 顺序稳定化
            const stabilized = [];
            X.state.PARTS.forEach(pp => {
              stabilized.push(...state.files.filter(f => f.part === pp.key));
            });
            state.files = stabilized;

            save();
            scheduleRender();
          }
        });
      }
    });
  }

  function renderActiveContent(errorMap) {
    const f = activeFile();
    if (!f) return;

    if (f.parseError) setParseErr(); else setParseOk();

    elContent.innerHTML = "";

    if (state.tab === "json") {
      elContent.appendChild(renderJsonEditor(f));
      return;
    }

    if (state.tab === "merge") {
      elContent.appendChild(renderMergePreview());
      return;
    }

    // form
    if (state.mode === "single") {
      elContent.appendChild(renderSingleForm(state.single, errorMap));
    } else {
      elContent.appendChild(renderMultiFileForm(f, errorMap));
    }
  }

  function renderJsonEditor(file) {
    const root = document.createElement("div");
    const err = file.parseError ? `<div class="errbox"><div style="font-weight:800;margin-bottom:6px">解析失败</div><div class="mono" style="white-space:pre-wrap">${U.escapeHtml(file.parseError)}</div></div><div class="divider"></div>` : "";
    root.innerHTML = `
      ${err}
      <div class="card">
        <div class="card-head">
          <div>
            <div class="card-title">JSON 编辑</div>
            <div class="hint">仅允许纯 JSON；解析成功后会同步刷新表单</div>
          </div>
          <div class="card-actions">
            <button class="btn small" id="btnFormat" type="button">格式化</button>
            <button class="btn small danger" id="btnReset" type="button">重置</button>
          </div>
        </div>
        <textarea id="jsonArea" spellcheck="false"></textarea>
        <div class="smallnote" style="margin-top:8px">
          提示：下载时不会附加任何额外字符，也不会在文件末尾补换行。
        </div>
      </div>
    `;

    const area = root.querySelector("#jsonArea");
    area.value = file.jsonText || U.stringifyJsonClean(file.obj);
    area.addEventListener("input", () => {
      const text = area.value;
      file.jsonText = text;
      try {
        const parsed = text.trim() ? JSON.parse(text) : {};
        file.obj = parsed;
        file.parseError = "";
        setParseOk();
      } catch (e) {
        file.parseError = String(e);
        setParseErr();
      }
      save();
    });

    root.querySelector("#btnFormat").addEventListener("click", () => {
      try {
        const parsed = JSON.parse(area.value.trim() || "{}");
        const formatted = U.stringifyJsonClean(parsed);
        area.value = formatted;
        file.jsonText = formatted;
        file.obj = parsed;
        file.parseError = "";
        setParseOk();
        save();
        scheduleRender();
      } catch (e) {
        file.parseError = String(e);
        setParseErr();
        save();
        scheduleRender();
      }
    });

    root.querySelector("#btnReset").addEventListener("click", () => {
      if (state.mode === "single") {
        file.obj = ST.defaultSingleConfig();
      } else {
        file.obj = U.deepClone(file.obj?.log ? { log: { loglevel: "warning" } } : file.obj);
      }
      syncJsonFromObj(file);
      renderPreserveUI();
    });

    return root;
  }

  function renderMergePreview() {
    const root = document.createElement("div");
    if (state.mode !== "multi") {
      root.innerHTML = `<div class="smallnote">合并预览仅在多文件模式可用。</div>`;
      return root;
    }
    const merged = EXP.mergeAll(state);
    const text = U.stringifyJsonClean(merged);
    const box = document.createElement("div");
    box.className = "card";
    box.innerHTML = `
      <div class="card-head">
        <div>
          <div class="card-title">合并预览（最终生效 config.json）</div>
          <div class="hint">普通对象递归覆盖/补充；inbounds/outbounds 按 tag 覆盖，未命中则追加/插入（与 v3 一致）。</div>
        </div>
        <div class="card-actions">
          <button class="btn small primary" id="btnDownloadMerged" type="button">下载合并后的 config.json</button>
          <a class="btn small ghost" href="${X.state.DOC.multiple}" target="_blank" rel="noopener">打开“多文件配置”文档</a>
        </div>
      </div>
      <textarea class="mono" spellcheck="false" readonly>${U.escapeHtml(text)}</textarea>
    `;
    box.querySelector("#btnDownloadMerged").addEventListener("click", () => {
      gateDownload(() => EXP.downloadText("config.json", text));
    });
    root.appendChild(box);
    return root;
  }

  // ===== 业务表单：单文件 =====
  function renderSingleForm(file, errorMap) {
    const root = document.createElement("div");
    const obj = file.obj;

    // log
    obj.log = obj.log || { loglevel: "warning" };
    root.appendChild(renderLogCard({ file, log: obj.log, errorMap, pathPrefix: "log" }));
    root.appendChild(divider());

    // inbounds
    obj.inbounds = obj.inbounds || [];
    root.appendChild(renderInboundsBlock({ file, list: obj.inbounds, errorMap, pathPrefix: "inbounds" }));
    root.appendChild(divider());


    // outbounds
    obj.outbounds = obj.outbounds || [];
    root.appendChild(renderOutboundsBlock({ file, list: obj.outbounds, errorMap, pathPrefix: "outbounds" }));
    root.appendChild(divider());

    // dns
    obj.dns = obj.dns || {};
    root.appendChild(renderDnsCard({ file, dns: obj.dns, errorMap, pathPrefix: "dns" }));
    root.appendChild(divider());

    // routing
    obj.routing = obj.routing || { domainStrategy: "AsIs", rules: [], balancers: [] };
    root.appendChild(renderRoutingBlock({ file, routing: obj.routing, errorMap, pathPrefix: "routing" }));

    root.appendChild(divider());
    const note = document.createElement("div");
    note.className = "okbox";
    note.innerHTML = `<div style="font-weight:850;margin-bottom:6px">输出安全性</div><div class="smallnote">下载仅输出纯 JSON，不追加末尾换行。</div>`;
    root.appendChild(note);
    return root;
  }

  // ===== 业务表单：多文件（每文件仅 1 个 part）=====
  function renderMultiFileForm(file, errorMap) {
    const root = document.createElement("div");

    if (file.part === "log") {
      const log = U.ensureByPath(file.obj, "log", { loglevel: "warning" });
      root.appendChild(renderLogCard({ file, log, errorMap, pathPrefix: "log" }));
      return root;
    }

    if (file.part === "dns") {
      const dns = U.ensureByPath(file.obj, "dns", {});
      root.appendChild(renderDnsCard({ file, dns, errorMap, pathPrefix: "dns" }));
      return root;
    }

    if (file.part === "routing") {
      const routing = U.ensureByPath(file.obj, "routing", { domainStrategy: "AsIs", rules: [], balancers: [] });
      root.appendChild(renderRoutingBlock({ file, routing, errorMap, pathPrefix: "routing" }));
      return root;
    }

    if (file.part === "inbounds") {
      const inbounds = U.ensureByPath(file.obj, "inbounds", []);
      root.appendChild(renderInboundsBlock({ file, list: inbounds, errorMap, pathPrefix: "inbounds" }));
      return root;
    }

    if (file.part === "outbounds") {
      const outbounds = U.ensureByPath(file.obj, "outbounds", []);
      root.appendChild(renderOutboundsBlock({ file, list: outbounds, errorMap, pathPrefix: "outbounds" }));
      return root;
    }

    root.innerHTML = `<div class="smallnote">未知 part：${U.escapeHtml(file.part)}</div>`;
    return root;
  }

  function divider() { const d = document.createElement("div"); d.className = "divider"; return d; }

  function collapsibleCard({ title, body, actions, collapseKey, defaultCollapsed = false }) {
    state.ui = state.ui || {};
    state.ui.collapse = state.ui.collapse || {};

    const card = R.renderCard(title, body, actions);
    card.classList.add("collapsible");

    const head = card.querySelector(".card-head");
    const titleEl = card.querySelector(".card-title");
    const icon = document.createElement("span");
    icon.className = "collapse-icon";

    const getCollapsed = () => {
      const v = state.ui.collapse[collapseKey];
      return (v === undefined) ? !!defaultCollapsed : !!v;
    };

    const apply = () => {
      const collapsed = getCollapsed();
      card.classList.toggle("collapsed", collapsed);
      icon.textContent = collapsed ? "▸" : "▾";
    };

    titleEl.prepend(icon);
    apply();

    head.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || e.target.closest("select")) return;
      state.ui.collapse[collapseKey] = !getCollapsed();
      scheduleSave();
      apply();
    });

    return card;
  }

  // ===== log / dns blocks =====
  function renderLogCard({ file, log, errorMap, pathPrefix }) {
    const p = pathPrefix || "log";
    const base = `${file.id}:${p}`;

    return R.renderCard("日志（log）", R.renderFormGrid([
      R.renderSelect({
        labelZh: "日志级别", labelEn: "loglevel", docUrl: "https://xtls.github.io/config/log.html",
        dataPath: `${base}.loglevel`,
        value: log.loglevel ?? "warning",
        options: [{ v: "debug" }, { v: "info" }, { v: "warning" }, { v: "error" }, { v: "none" }].map(x => ({ v: x.v, zh: x.v })),
        onChange: (v) => { log.loglevel = v; syncJsonFromObj(file); renderPreserveUI(); }
      }),
      R.renderText({
        labelZh: "访问日志路径", labelEn: "access", docUrl: "https://xtls.github.io/config/log.html",
        dataPath: `${base}.access`,
        value: log.access ?? "",
        placeholder: "例如 ./access.log（可选）",
        onBlur: () => scheduleRender(),
        onInput: (v) => { log.access = v || undefined; if (!log.access) delete log.access; syncJsonFromObj(file); }
      }),
      R.renderText({
        labelZh: "错误日志路径", labelEn: "error", docUrl: "https://xtls.github.io/config/log.html",
        dataPath: `${base}.error`,
        value: log.error ?? "",
        placeholder: "例如 ./error.log（可选）",
        onBlur: () => scheduleRender(),
        onInput: (v) => { log.error = v || undefined; if (!log.error) delete log.error; syncJsonFromObj(file); }
      }),
      R.renderBool({
        labelZh: "记录 DNS 查询日志", labelEn: "dnsLog", docUrl: "https://xtls.github.io/config/log.html",
        dataPath: `${base}.dnsLog`,
        value: !!log.dnsLog,
        onChange: (v) => { log.dnsLog = v ? true : undefined; if (!log.dnsLog) delete log.dnsLog; syncJsonFromObj(file); renderPreserveUI(); }
      })
    ]));
  }

  function splitDnsServers(dns){
    const arr = Array.isArray(dns.servers) ? dns.servers : [];
    const strings = arr.filter(x => typeof x === "string").map(s => String(s));
    const objects = arr.filter(x => U.isPlainObject(x)).map(o => U.deepClone(o));
    return { strings, objects };
  }
  function commitDnsServers(dns, strings, objects){
    const merged = [];
    if (Array.isArray(strings) && strings.length) merged.push(...strings);
    if (Array.isArray(objects) && objects.length) merged.push(...objects);
    if (merged.length) dns.servers = merged;
    else delete dns.servers;
  }

  function renderDnsCard({ file, dns, errorMap, pathPrefix }) {
    const p = pathPrefix || "dns";
    const base = `${file.id}:${p}`;
    const docUrl = "https://xtls.github.io/config/dns.html";

    const { strings, objects } = splitDnsServers(dns);

    const topFields = R.renderFormGrid([
      R.renderSelect({
        labelZh: "查询策略", labelEn: "queryStrategy", docUrl,
        dataPath: `${base}.queryStrategy`,
        value: dns.queryStrategy ?? "",
        options: [
          { v: "", zh: "（留空）" },
          { v: "UseIP" },
          { v: "UseIPv4" },
          { v: "UseIPv6" },
          { v: "AsIs" }
        ],
        onChange: (v) => { dns.queryStrategy = v || undefined; if (!dns.queryStrategy) delete dns.queryStrategy; syncJsonFromObj(file); renderPreserveUI(); }
      }),
      R.renderText({
        labelZh: "客户端 IP", labelEn: "clientIp", docUrl,
        dataPath: `${base}.clientIp`,
        value: dns.clientIp ?? "",
        placeholder: "用于 EDNS Client Subnet（可选）",
        onBlur: () => scheduleRender(),
        onInput: (v) => { dns.clientIp = v || undefined; if (!dns.clientIp) delete dns.clientIp; syncJsonFromObj(file); }
      }),
      R.renderBool({
        labelZh: "禁用缓存", labelEn: "disableCache", docUrl,
        dataPath: `${base}.disableCache`,
        value: !!dns.disableCache,
        onChange: (v) => { dns.disableCache = v ? true : undefined; if (!dns.disableCache) delete dns.disableCache; syncJsonFromObj(file); renderPreserveUI(); }
      }),
      R.renderBool({
        labelZh: "禁用 fallback", labelEn: "disableFallback", docUrl,
        dataPath: `${base}.disableFallback`,
        value: !!dns.disableFallback,
        onChange: (v) => { dns.disableFallback = v ? true : undefined; if (!dns.disableFallback) delete dns.disableFallback; syncJsonFromObj(file); renderPreserveUI(); }
      }),
      R.renderJsonBox({
        labelZh: "Hosts 映射", labelEn: "hosts", docUrl,
        dataPath: `${base}.hosts`,
        value: dns.hosts || {},
        onInput: (txt) => {
          try {
            const parsed = txt.trim() ? JSON.parse(txt) : {};
            dns.hosts = parsed;
            if (!dns.hosts || (U.isPlainObject(dns.hosts) && Object.keys(dns.hosts).length === 0)) delete dns.hosts;
            syncJsonFromObj(file);
          } catch { syncJsonFromObj(file); }
        }
      }),
      R.renderStringLines({
        labelZh: "服务器（简写）", labelEn: "servers (string)", docUrl,
        dataPath: `${base}.servers_strings`,
        value: strings,
        placeholder: "每行一条，例如 1.1.1.1 / 8.8.8.8 / https+local://...（可选）",
        onBlur: () => scheduleRender(),
        onChange: (arr) => {
          strings.splice(0, strings.length, ...((arr || []).map(x => String(x))));
          commitDnsServers(dns, strings, objects);
          syncJsonFromObj(file);
        }
      })
    ]);

    // DnsServerObject components
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.innerHTML = `<div style="font-weight:900">DNS 服务器对象（DnsServerObject）</div><div class="hint">数组 · 可添加多条</div>`;

    header.appendChild(R.button("+ 添加服务器对象", "btn small primary", () => {
      objects.push({ address: "", port: 53 });
      commitDnsServers(dns, strings, objects);
      syncJsonFromObj(file);
      renderPreserveUI();
    }));

    const listWrap = document.createElement("div");
    listWrap.style.display = "flex";
    listWrap.style.flexDirection = "column";
    listWrap.style.gap = "10px";
    listWrap.style.marginTop = "10px";

    objects.forEach((sv, idx) => {
      if (!U.isPlainObject(sv)) objects[idx] = sv = {};
      const nodes = [];
      nodes.push(R.renderText({
        labelZh: "服务器地址", labelEn: "address", docUrl,
        dataPath: `${base}.servers.${idx}.address`,
        value: sv.address ?? "",
        placeholder: "例如 1.1.1.1 / https+local://...",
        onBlur: () => scheduleRender(),
        onInput: (v) => { sv.address = v || undefined; if (!sv.address) delete sv.address; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); }
      }));
      nodes.push(R.renderNumber({
        labelZh: "端口", labelEn: "port", docUrl,
        dataPath: `${base}.servers.${idx}.port`,
        value: sv.port,
        placeholder: "53",
        onBlur: () => scheduleRender(),
        onInput: (v) => { sv.port = v; if (sv.port === undefined) delete sv.port; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); }
      }));
      nodes.push(R.renderStringLines({
        labelZh: "匹配域名", labelEn: "domains", docUrl,
        dataPath: `${base}.servers.${idx}.domains`,
        value: sv.domains,
        placeholder: "每行一条，如 geosite:cn / domain:example.com（可选）",
        onBlur: () => scheduleRender(),
        onChange: (arr) => { sv.domains = arr; if (!arr) delete sv.domains; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); }
      }));
      nodes.push(R.renderStringLines({
        labelZh: "期望 IP", labelEn: "expectIPs", docUrl,
        dataPath: `${base}.servers.${idx}.expectIPs`,
        value: sv.expectIPs,
        placeholder: "每行一条，如 10.0.0.0/8 / geoip:cn（可选）",
        onBlur: () => scheduleRender(),
        onChange: (arr) => { sv.expectIPs = arr; if (!arr) delete sv.expectIPs; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); }
      }));
      nodes.push(R.renderText({
        labelZh: "客户端 IP", labelEn: "clientIP", docUrl,
        dataPath: `${base}.servers.${idx}.clientIP`,
        value: sv.clientIP ?? "",
        placeholder: "可选",
        onBlur: () => scheduleRender(),
        onInput: (v) => { sv.clientIP = v || undefined; if (!sv.clientIP) delete sv.clientIP; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); }
      }));
      nodes.push(R.renderBool({
        labelZh: "跳过 fallback", labelEn: "skipFallback", docUrl,
        dataPath: `${base}.servers.${idx}.skipFallback`,
        value: !!sv.skipFallback,
        onChange: (v) => { sv.skipFallback = v ? true : undefined; if (!sv.skipFallback) delete sv.skipFallback; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); renderPreserveUI(); }
      }));
      nodes.push(R.renderSelect({
        labelZh: "查询策略", labelEn: "queryStrategy", docUrl,
        dataPath: `${base}.servers.${idx}.queryStrategy`,
        value: sv.queryStrategy ?? "",
        options: [
          { v: "", zh: "（留空）" },
          { v: "UseIP" },
          { v: "UseIPv4" },
          { v: "UseIPv6" },
          { v: "AsIs" }
        ],
        onChange: (v) => { sv.queryStrategy = v || undefined; if (!sv.queryStrategy) delete sv.queryStrategy; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); renderPreserveUI(); }
      }));
      nodes.push(R.renderText({
        labelZh: "标识", labelEn: "tag", docUrl,
        dataPath: `${base}.servers.${idx}.tag`,
        value: sv.tag ?? "",
        placeholder: "可选",
        onBlur: () => scheduleRender(),
        onInput: (v) => { sv.tag = v || undefined; if (!sv.tag) delete sv.tag; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); }
      }));

      const actions = [
        R.button("上移", "btn small", () => { if (idx > 0) { [objects[idx - 1], objects[idx]] = [objects[idx], objects[idx - 1]]; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("下移", "btn small", () => { if (idx < objects.length - 1) { [objects[idx + 1], objects[idx]] = [objects[idx], objects[idx + 1]]; commitDnsServers(dns, strings, objects); syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("删除", "btn small danger", () => { objects.splice(idx, 1); commitDnsServers(dns, strings, objects); syncJsonFromObj(file); renderPreserveUI(); })
      ];
      listWrap.appendChild(collapsibleCard({
        title: `服务器 #${idx + 1}${sv.address ? `（${U.escapeHtml(String(sv.address)).slice(0, 26)}）` : ""}`,
        body: R.renderFormGrid(nodes),
        actions,
        collapseKey: `${file.id}::dns.servers::${idx}`,
        defaultCollapsed: true
      }));
    });

    const wrap = document.createElement("div");
    wrap.appendChild(topFields);
    wrap.appendChild(divider());
    wrap.appendChild(header);
    wrap.appendChild(listWrap);

    return R.renderCard("DNS（dns）", wrap);
  }


  // ===== inbounds/outbounds/routing blocks =====
  function renderInboundsBlock({ file, list, errorMap, pathPrefix }) {
    const container = document.createElement("div");
    const header = document.createElement("div");
    header.style.display = "flex"; header.style.alignItems = "center"; header.style.justifyContent = "space-between";
    header.innerHTML = `<div style="font-weight:900">入站（inbounds）</div><div class="hint">数组 · 组件化排列</div>`;
    header.appendChild(R.button("+ 添加入站", "btn small primary", () => {
      list.push({ tag: `in-${list.length + 1}`, listen: "0.0.0.0", port: 1080, protocol: "socks", settings: {}, streamSettings: {} });
      syncJsonFromObj(file);
      renderPreserveUI();
    }));
    container.appendChild(header);

    const listWrap = document.createElement("div");
    listWrap.style.display = "flex"; listWrap.style.flexDirection = "column"; listWrap.style.gap = "10px"; listWrap.style.marginTop = "10px";

    list.forEach((ib, idx) => {
      ib.settings = ib.settings || {};
      ib.streamSettings = ib.streamSettings || {};

      const nodes = [];
      nodes.push(R.renderText({
        labelZh: "标识", labelEn: "tag", docUrl: X.state.DOC.inbound, value: ib.tag || "", placeholder: "用于路由定位的唯一 tag",
        dataPath: `${file.id}:${pathPrefix}.${idx}.tag`,
        onBlur: () => scheduleRender(),
        onInput: (v) => { ib.tag = v || undefined; if (!ib.tag) delete ib.tag; syncJsonFromObj(file); }
      }));
      nodes.push(R.renderText({
        labelZh: "监听地址", labelEn: "listen", docUrl: X.state.DOC.inbound, value: ib.listen || "", placeholder: "如 0.0.0.0 / 127.0.0.1 / ::",
        dataPath: `${file.id}:${pathPrefix}.${idx}.listen`,
        onBlur: () => scheduleRender(),
        onInput: (v) => { ib.listen = v || undefined; if (!ib.listen) delete ib.listen; syncJsonFromObj(file); }
      }));
      nodes.push(R.renderNumber({
        labelZh: "端口", labelEn: "port", docUrl: X.state.DOC.inbound, value: ib.port, placeholder: "如 1080",
        dataPath: `${file.id}:${pathPrefix}.${idx}.port`,
        onBlur: () => scheduleRender(),
        onInput: (v) => { if (v === undefined) delete ib.port; else ib.port = v; syncJsonFromObj(file); }
      }));
      nodes.push(R.renderSelect({
        labelZh: "协议", labelEn: "protocol", docUrl: X.state.DOC.inbound, value: ib.protocol || "socks",
        dataPath: `${file.id}:${pathPrefix}.${idx}.protocol`,
        options: window.XraySchemas.get("protocol.inbounds")?.protocolOptions || [{ v: "socks" }, { v: "http" }, { v: "vmess" }, { v: "vless" }, { v: "trojan" }, { v: "shadowsocks" }, { v: "dokodemo-door" }, { v: "wireguard" }].map(x => ({ v: x.v, zh: x.v })),
        onChange: (v) => { ib.protocol = v; ib.settings = {}; syncJsonFromObj(file); renderPreserveUI(); }
      }));

      // settings：按协议 schema（缺省则 JSON 兜底）
      const settingsSchemaId = `inbound.settings.${ib.protocol}`;
      const settingsSchema = window.XraySchemas.get(settingsSchemaId);
      if (settingsSchema) {
        const wrap = document.createElement("div"); wrap.style.gridColumn = "1 / -1";
        wrap.appendChild(R.renderCard("协议 settings", R.renderBySchema({
          schemaId: settingsSchemaId,
          obj: ib.settings,
          rootObj: ib,
          onChange: () => { syncJsonFromObj(file); },
          onUIRefresh: () => scheduleRender(),
          fileId: file.id,
          pathPrefix: `${pathPrefix}.${idx}.settings`,
          errorMap
        })));
        nodes.push(wrap);
      } else {
        nodes.push((function () {
          const wrap = document.createElement("div"); wrap.style.gridColumn = "1 / -1";
          wrap.appendChild(R.renderCard("协议 settings（JSON 兜底）", R.renderFormGrid([
            R.renderJsonBox({
              labelZh: "settings", labelEn: "settings", docUrl: X.state.DOC.inbound,
               dataPath: `${file.id}:${pathPrefix}.${idx}.settings`,
              value: ib.settings,
              onBlur: () => scheduleRender(),
        onInput: (txt) => {
                try { ib.settings = txt.trim() ? JSON.parse(txt) : {}; } catch (e) { }
                syncJsonFromObj(file);
              }
            })
          ])));
          return wrap;
        })());
      }

      // streamSettings：重点全字段覆盖（schema 驱动）
      const ssWrap = document.createElement("div"); ssWrap.style.gridColumn = "1 / -1";
      ssWrap.appendChild(R.renderCard("传输层 streamSettings", R.renderBySchema({
        schemaId: "transport.streamSettings",
        obj: ib.streamSettings,
        rootObj: ib.streamSettings,
        onChange: () => { syncJsonFromObj(file); },
          onUIRefresh: () => scheduleRender(),
        fileId: file.id,
        pathPrefix: `${pathPrefix}.${idx}.streamSettings`,
        errorMap
      })));
      nodes.push(ssWrap);

      const actions = [
        R.button("上移", "btn small", () => { if (idx > 0) { [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]]; syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("下移", "btn small", () => { if (idx < list.length - 1) { [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]]; syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("删除", "btn small danger", () => { list.splice(idx, 1); syncJsonFromObj(file); renderPreserveUI(); })
      ];

      listWrap.appendChild(collapsibleCard({
        title: `入站 #${idx + 1}`,
        body: R.renderFormGrid(nodes),
        actions,
        collapseKey: `${file.id}::inbounds::${idx}`,
        defaultCollapsed: idx !== 0
      }));
    });

    container.appendChild(listWrap);
    return container;
  }

  function renderOutboundsBlock({ file, list, errorMap, pathPrefix }) {
    const container = document.createElement("div");
    const header = document.createElement("div");
    header.style.display = "flex"; header.style.alignItems = "center"; header.style.justifyContent = "space-between";
    header.innerHTML = `<div style="font-weight:900">出站（outbounds）</div><div class="hint">数组 · 首元素通常为默认出口</div>`;
    header.appendChild(R.button("+ 添加出站", "btn small primary", () => {
      list.push({ tag: `out-${list.length + 1}`, protocol: "freedom", settings: {}, streamSettings: {} });
      syncJsonFromObj(file);
      renderPreserveUI();
    }));
    container.appendChild(header);

    const listWrap = document.createElement("div");
    listWrap.style.display = "flex"; listWrap.style.flexDirection = "column"; listWrap.style.gap = "10px"; listWrap.style.marginTop = "10px";

    list.forEach((ob, idx) => {
      ob.settings = ob.settings || {};
      ob.streamSettings = ob.streamSettings || {};

      const nodes = [];
      nodes.push(R.renderText({
        labelZh: "标识", labelEn: "tag", docUrl: X.state.DOC.outbound, value: ob.tag || "", placeholder: "用于路由定位的唯一 tag",
        dataPath: `${file.id}:${pathPrefix}.${idx}.tag`,
        onBlur: () => scheduleRender(),
        onInput: (v) => { ob.tag = v || undefined; if (!ob.tag) delete ob.tag; syncJsonFromObj(file); }
      }));
      nodes.push(R.renderSelect({
        labelZh: "协议", labelEn: "protocol", docUrl: X.state.DOC.outbound, value: ob.protocol || "freedom",
        dataPath: `${file.id}:${pathPrefix}.${idx}.protocol`,
        options: window.XraySchemas.get("protocol.outbounds")?.protocolOptions || [{ v: "freedom" }, { v: "blackhole" }, { v: "vmess" }, { v: "vless" }, { v: "trojan" }, { v: "shadowsocks" }, { v: "socks" }, { v: "http" }, { v: "loopback" }, { v: "wireguard" }].map(x => ({ v: x.v, zh: x.v })),
        onChange: (v) => { ob.protocol = v; ob.settings = {}; syncJsonFromObj(file); renderPreserveUI(); }
      }));

      // settings schema / JSON fallback
      const settingsSchemaId = `outbound.settings.${ob.protocol}`;
      const settingsSchema = window.XraySchemas.get(settingsSchemaId);
      if (settingsSchema) {
        const wrap = document.createElement("div"); wrap.style.gridColumn = "1 / -1";
        wrap.appendChild(R.renderCard("协议 settings", R.renderBySchema({
          schemaId: settingsSchemaId,
          obj: ob.settings,
          rootObj: ob,
          onChange: () => { syncJsonFromObj(file); },
          onUIRefresh: () => scheduleRender(),
          fileId: file.id,
          pathPrefix: `${pathPrefix}.${idx}.settings`,
          errorMap
        })));
        nodes.push(wrap);
      } else {
        const wrap = document.createElement("div"); wrap.style.gridColumn = "1 / -1";
        wrap.appendChild(R.renderCard("协议 settings（JSON 兜底）", R.renderFormGrid([
          R.renderJsonBox({
            labelZh: "settings", labelEn: "settings", docUrl: X.state.DOC.outbound,
             dataPath: `${file.id}:${pathPrefix}.${idx}.settings`,
            value: ob.settings,
            onBlur: () => scheduleRender(),
        onInput: (txt) => {
              try { ob.settings = txt.trim() ? JSON.parse(txt) : {}; } catch (e) { }
              syncJsonFromObj(file);
            }
          })
        ])));
        nodes.push(wrap);
      }

      // streamSettings（全字段 schema）
      const ssWrap = document.createElement("div"); ssWrap.style.gridColumn = "1 / -1";
      ssWrap.appendChild(R.renderCard("传输层 streamSettings", R.renderBySchema({
        schemaId: "transport.streamSettings",
        obj: ob.streamSettings,
        rootObj: ob.streamSettings,
        onChange: () => { syncJsonFromObj(file); },
          onUIRefresh: () => scheduleRender(),
        fileId: file.id,
        pathPrefix: `${pathPrefix}.${idx}.streamSettings`,
        errorMap
      })));
      nodes.push(ssWrap);

      const actions = [
        R.button("上移", "btn small", () => { if (idx > 0) { [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]]; syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("下移", "btn small", () => { if (idx < list.length - 1) { [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]]; syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("删除", "btn small danger", () => { list.splice(idx, 1); syncJsonFromObj(file); renderPreserveUI(); })
      ];
      listWrap.appendChild(collapsibleCard({
        title: `出站 #${idx + 1}${idx === 0 ? "（默认）" : ""}`,
        body: R.renderFormGrid(nodes),
        actions,
        collapseKey: `${file.id}::outbounds::${idx}`,
        defaultCollapsed: idx !== 0
      }));
    });

    container.appendChild(listWrap);
    return container;
  }

  function renderRoutingBlock({ file, routing, errorMap, pathPrefix }) {
    const container = document.createElement("div");

    const baseGrid = R.renderFormGrid([
      R.renderSelect({
        labelZh: "域名解析策略", labelEn: "domainStrategy", docUrl: X.state.DOC.routing,
        value: routing.domainStrategy ?? "AsIs",
        dataPath: `${file.id}:${pathPrefix}.domainStrategy`,
        options: [{ v: "AsIs" }, { v: "IPIfNonMatch" }, { v: "IPOnDemand" }].map(x => ({ v: x.v, zh: x.v })),
        onChange: (v) => { routing.domainStrategy = v; syncJsonFromObj(file); renderPreserveUI(); }
      })
    ]);
    container.appendChild(R.renderCard("路由基础（routing）", baseGrid));

    routing.rules = routing.rules || [];
    routing.balancers = routing.balancers || [];

    container.appendChild(divider());

    const head = document.createElement("div");
    head.style.display = "flex"; head.style.alignItems = "center"; head.style.justifyContent = "space-between";
    head.innerHTML = `<div style="font-weight:900">规则（rules）</div><div class="hint">命中第一个规则即生效</div>`;
    head.appendChild(R.button("+ 添加规则", "btn small primary", () => {
      routing.rules.push({ ruleTag: `rule-${routing.rules.length + 1}`, outboundTag: "direct", domain: [], ip: [] });
      syncJsonFromObj(file);
      renderPreserveUI();
    }));
    container.appendChild(head);

    const listWrap = document.createElement("div");
    listWrap.style.display = "flex"; listWrap.style.flexDirection = "column"; listWrap.style.gap = "10px"; listWrap.style.marginTop = "10px";

    routing.rules.forEach((r, idx) => {
      const obPath = `${pathPrefix}.rules.${idx}.outboundTag`;
      const blPath = `${pathPrefix}.rules.${idx}.balancerTag`;

      const outboundVal = String(r.outboundTag ?? "").trim();
      const balancerVal = String(r.balancerTag ?? "").trim();

      const nodes = [];
      nodes.push(R.renderText({
        labelZh: "规则名称", labelEn: "ruleTag", docUrl: X.state.DOC.routing,
        value: r.ruleTag || "",
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.ruleTag`,
        placeholder: "可选，用于排障",
        onBlur: () => scheduleRender(),
        onInput: (v) => { r.ruleTag = v || undefined; if (!r.ruleTag) delete r.ruleTag; syncJsonFromObj(file); }
      }));

      nodes.push(R.renderText({
        labelZh: "指定出站", labelEn: "outboundTag", docUrl: X.state.DOC.routing,
        value: outboundVal,
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.outboundTag`,
        placeholder: "如 direct / proxy / block",
        disabled: !!balancerVal, // 互斥：balancerTag 有值则禁用 outboundTag
        errText: V.getError(errorMap, file.id, obPath),
        onBlur: () => scheduleRender(),
        onInput: (v) => {
          r.outboundTag = v || undefined;
          if (!r.outboundTag) delete r.outboundTag;
          if (v) { delete r.balancerTag; } // 互斥：填了 outboundTag 清空 balancerTag
          syncJsonFromObj(file);
// 不重渲染：即时同步另一侧输入框禁用状态
const dpBal = `${file.id}:${pathPrefix}.rules.${idx}.balancerTag`;
const dpOut = `${file.id}:${pathPrefix}.rules.${idx}.outboundTag`;
const balEl = document.querySelector(`[data-path="${CSS.escape(dpBal)}"]`);
const outEl = document.querySelector(`[data-path="${CSS.escape(dpOut)}"]`);
if (balEl) {
  if (v) { balEl.value = ""; balEl.disabled = true; }
  else { balEl.disabled = false; }
}
if (outEl && balEl && balEl.value) { outEl.disabled = true; }
}
      }));

      nodes.push(R.renderText({
        labelZh: "指定均衡器", labelEn: "balancerTag", docUrl: X.state.DOC.routing,
        value: balancerVal,
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.balancerTag`,
        placeholder: "与 outboundTag 二选一",
        disabled: !!outboundVal,
        errText: V.getError(errorMap, file.id, blPath),
        onBlur: () => scheduleRender(),
        onInput: (v) => {
          r.balancerTag = v || undefined;
          if (!r.balancerTag) delete r.balancerTag;
          if (v) { delete r.outboundTag; }
          syncJsonFromObj(file);
// 不重渲染：即时同步另一侧输入框禁用状态
const dpBal = `${file.id}:${pathPrefix}.rules.${idx}.balancerTag`;
const dpOut = `${file.id}:${pathPrefix}.rules.${idx}.outboundTag`;
const balEl = document.querySelector(`[data-path="${CSS.escape(dpBal)}"]`);
const outEl = document.querySelector(`[data-path="${CSS.escape(dpOut)}"]`);
if (outEl) {
  if (v) { outEl.value = ""; outEl.disabled = true; }
  else { outEl.disabled = false; }
}
if (balEl && outEl && outEl.value) { balEl.disabled = true; }
}
      }));

      nodes.push(R.renderStringLines({
        labelZh: "域名匹配", labelEn: "domain", docUrl: X.state.DOC.routing,
        value: r.domain,
        placeholder: "每行一条，如 geosite:cn / domain:example.com / keyword:google",
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.domain`,
        errText: V.getError(errorMap, file.id, `${pathPrefix}.rules.${idx}.domain`),
        onBlur: () => scheduleRender(),
        onChange: (arr) => { r.domain = arr; if (!arr) delete r.domain; syncJsonFromObj(file); }
      }));

      nodes.push(R.renderStringLines({
        labelZh: "IP 匹配", labelEn: "ip", docUrl: X.state.DOC.routing,
        value: r.ip,
        placeholder: "每行一条，如 geoip:cn / 10.0.0.0/8 / ::/0",
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.ip`,
        errText: V.getError(errorMap, file.id, `${pathPrefix}.rules.${idx}.ip`),
        onChange: (arr) => { r.ip = arr; if (!arr) delete r.ip; syncJsonFromObj(file); }
      }));

      nodes.push(R.renderText({
        labelZh: "端口匹配", labelEn: "port", docUrl: X.state.DOC.routing,
        value: r.port || "",
        placeholder: '如 "53,443,1000-2000"',
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.port`,
        onBlur: () => scheduleRender(),
        onInput: (v) => { r.port = v || undefined; if (!r.port) delete r.port; syncJsonFromObj(file); }
      }));

      nodes.push(R.renderSelect({
        labelZh: "网络", labelEn: "network", docUrl: X.state.DOC.routing,
        value: r.network || "tcp,udp",
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.network`,
        options: [{ v: "tcp" }, { v: "udp" }, { v: "tcp,udp" }].map(x => ({ v: x.v, zh: x.v })),
        onChange: (v) => { r.network = v; syncJsonFromObj(file); renderPreserveUI(); }
      }));

      nodes.push(R.renderStringLines({
        labelZh: "入站标识", labelEn: "inboundTag", docUrl: X.state.DOC.routing,
        value: r.inboundTag,
        placeholder: "每行一个 inbound tag（可选）",
        dataPath: `${file.id}:${pathPrefix}.rules.${idx}.inboundTag`,
        errText: V.getError(errorMap, file.id, `${pathPrefix}.rules.${idx}.inboundTag`),
        onBlur: () => scheduleRender(),
        onChange: (arr) => { r.inboundTag = arr; if (!arr) delete r.inboundTag; syncJsonFromObj(file); }
      }));

      const actions = [
        R.button("上移", "btn small", () => { if (idx > 0) { [routing.rules[idx - 1], routing.rules[idx]] = [routing.rules[idx], routing.rules[idx - 1]]; syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("下移", "btn small", () => { if (idx < routing.rules.length - 1) { [routing.rules[idx + 1], routing.rules[idx]] = [routing.rules[idx], routing.rules[idx + 1]]; syncJsonFromObj(file); renderPreserveUI(); } }),
        R.button("删除", "btn small danger", () => { routing.rules.splice(idx, 1); syncJsonFromObj(file); renderPreserveUI(); })
      ];
      listWrap.appendChild(collapsibleCard({
        title: `规则 #${idx + 1}`,
        body: R.renderFormGrid(nodes),
        actions,
        collapseKey: `${file.id}::routing.rules::${idx}`,
        defaultCollapsed: true
      }));

    });

    container.appendChild(listWrap);
    return container;
  }

  // ===== 下载门禁：发现错误 → 弹窗允许取消或继续 =====
  function gateDownload(doDownload) {
    const res = V.validateAll(state);
    const disclaimer = `
      <div class="okbox">
        <div style="font-weight:900;margin-bottom:6px">重要提示</div>
        <div class="smallnote">本生成器仅对 <b>部分</b> 常见格式错误进行校验（例如：routing 引用的 tag 是否存在、域名/IP 书写格式等），不保证配置在 Xray 中一定可用或按预期运行。下载后请结合文档与实际环境自行验证。</div>
      </div>
    `;

    let html = disclaimer;
    let title = "下载前提示";
    let continueText = "继续下载";
    let continueClass = "btn primary";

    if (res.hasError) {
      title = "下载前提示：发现问题";
      continueText = "仍然下载";
      continueClass = "btn danger";
      const list = res.errs.slice(0, 50).map(e => `<li><span class="mono">${U.escapeHtml(e.path)}</span>：${U.escapeHtml(e.message)}</li>`).join("");
      html += `
        <div class="divider"></div>
        <div class="errbox">
          <div style="font-weight:900;margin-bottom:6px">校验未通过</div>
          <div class="smallnote">${U.escapeHtml(res.summary)}</div>
        </div>
        <div class="divider"></div>
        <div style="font-weight:800;margin-bottom:6px">错误明细（最多显示 50 条）</div>
        <ul style="margin:0;padding-left:18px">${list}</ul>
      `;
    } else {
      html += `
        <div class="divider"></div>
        <div class="okbox">
          <div style="font-weight:900;margin-bottom:6px">未发现已覆盖范围内的格式错误</div>
          <div class="smallnote">你仍然可以继续下载；如遇运行问题，请优先对照文档与日志排查。</div>
        </div>
      `;
    }

    openModal({
      title,
      html,
      continueText,
      continueClass,
      onContinue: doDownload
    });
  }

  // ===== 顶部事件 =====
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      state.tab = btn.getAttribute("data-tab");
      save(); scheduleRender();
    });
  });

  elModeSingle.addEventListener("click", () => {
    state.mode = "single";
    state.activeId = state.single.id;
    state.tab = "form";
    save(); scheduleRender();
  });
  elModeMulti.addEventListener("click", () => {
    state.mode = "multi";
    // 若之前未设置 activeId，则选第一个文件
    if (!state.files.some(f => f.id === state.activeId)) state.activeId = state.files[0].id;
    state.tab = "form";
    save(); scheduleRender();
  });

  elBtnDocs.addEventListener("click", () => window.open(X.state.DOC.overview, "_blank", "noopener,noreferrer"));

  elBtnAddRoutingFile.addEventListener("click", () => {
    if (state.mode !== "multi") return;
    state.files.push(ST.buildFile("routing"));
    state.activeId = state.files[state.files.length - 1].id;
    state.tab = "form";
    save(); scheduleRender();
  });
  elBtnAddInboundFile.addEventListener("click", () => {
    if (state.mode !== "multi") return;
    state.files.push(ST.buildFile("inbounds"));
    state.activeId = state.files[state.files.length - 1].id;
    state.tab = "form";
    save(); scheduleRender();
  });
  elBtnAddOutboundFile.addEventListener("click", () => {
    if (state.mode !== "multi") return;
    state.files.push(ST.buildFile("outbounds"));
    state.activeId = state.files[state.files.length - 1].id;
    state.tab = "form";
    save(); scheduleRender();
  });

  elBtnDownloadActive.addEventListener("click", () => {
    const f = activeFile();
    if (!f) return;

    gateDownload(() => {
      if (state.mode === "single") {
        const text = f.parseError ? (f.jsonText || "") : U.stringifyJsonClean(f.obj);
        EXP.downloadText("config.json", text);
        return;
      }
      // multi：下载当前 fragment
      const filesOfPart = state.files.filter(x => x.part === f.part);
      const idx = filesOfPart.findIndex(x => x.id === f.id);
      const filename = ST.computeFileName(f.part, idx + 1, filesOfPart.length, f.suffix);
      const text = f.parseError ? (f.jsonText || "") : U.stringifyJsonClean(f.obj);
      EXP.downloadText(filename, text);
    });
  });

  elBtnDownloadAll.addEventListener("click", () => {
    gateDownload(() => {
      if (state.mode === "single") {
        EXP.downloadText("config.json", U.stringifyJsonClean(state.single.obj));
        return;
      }
      // multi：按 PARTS + part 内顺序批量下载
      X.state.PARTS.forEach(p => {
        const files = state.files.filter(f => f.part === p.key);
        files.forEach((f, i) => {
          if (f.parseError) return;
          const filename = ST.computeFileName(p.key, i + 1, files.length, f.suffix);
          EXP.downloadText(filename, U.stringifyJsonClean(f.obj));
        });
      });
    });
  });

  function render() {
    state = ST.normalizeState(state);
    const res = V.validateAll(state);

    // mode UI
    elModeSingle.classList.toggle("active", state.mode === "single");
    elModeMulti.classList.toggle("active", state.mode === "multi");
    elAsideHint.textContent = state.mode === "single" ? "单文件：config.json" : "多文件：按 part 拆分并自动编号";
    elTabMerge.style.display = state.mode === "multi" ? "inline-flex" : "none";
    if (state.mode !== "multi" && state.tab === "merge") state.tab = "form";

    // add buttons
    const showAdd = state.mode === "multi";
    elBtnAddRoutingFile.style.display = showAdd ? "inline-flex" : "none";
    elBtnAddInboundFile.style.display = showAdd ? "inline-flex" : "none";
    elBtnAddOutboundFile.style.display = showAdd ? "inline-flex" : "none";

    // tabs active style
    document.querySelectorAll(".tab").forEach(btn => {
      const k = btn.getAttribute("data-tab");
      btn.classList.toggle("active", k === state.tab);
    });

    renderFilePlan(res.errorMap);
    renderActiveContent(res.errorMap);
  }

  render();
})();
