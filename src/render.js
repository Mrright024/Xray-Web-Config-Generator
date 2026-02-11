(function () {
  const X = window.XFB;
  const U = X.util;
  const S = X.schema.api;
  const V = X.validators.api;

  X.render = X.render || {};

  // Generate unique ID for form controls
  let __idCounter = 0;
  function genId(prefix = "field") {
    return `${prefix}-${++__idCounter}`;
  }

  function fieldLabelHtml(zh, en, docUrl) {
    const safeZh = U.escapeHtml(zh);
    const safeEn = U.escapeHtml(en);
    const a = docUrl ? `<a href="${docUrl}" target="_blank" rel="noopener noreferrer">${safeZh}</a>` : safeZh;
    return `<span class="linklabel">${a}</span> <span class="muted">(${safeEn})</span>`;
  }

  function wrapField(labelHtml, controlHtml, bindFn, errText, fieldId) {
    const root = document.createElement("div");
    root.className = "field" + (errText ? " field-error" : "");
    const errorId = fieldId ? `${fieldId}-error` : "";
    const labelWithId = labelHtml.replace("<label>", `<label for="${U.escapeAttr(fieldId || "")}">`) || `<label for="${U.escapeAttr(fieldId || "")}"></label>`;
    const errorMarkup = errText ? `<div class="field-errtext" id="${U.escapeAttr(errorId)}" role="alert">${U.escapeHtml(errText)}</div>` : "";
    const ariaDescribedBy = errText ? ` aria-describedby="${U.escapeAttr(errorId)}"` : "";
    
    // Insert fieldId into controlHtml
    const controlWithId = controlHtml.replace(
      /type="(checkbox|radio)"/,
      (match) => `id="${U.escapeAttr(fieldId || "")}" ${match}`
    ).replace(
      /(<input[^>]*?)(?!id=)/,
      (match) => `${match}${fieldId && !match.includes('id=') ? ` id="${U.escapeAttr(fieldId)}"` : ""}`
    ).replace(
      /(<select[^>]*?)(?!id=)/,
      (match) => `${match}${fieldId && !match.includes('id=') ? ` id="${U.escapeAttr(fieldId)}"` : ""}`
    ).replace(
      /(<textarea[^>]*?)(?!id=)/,
      (match) => `${match}${fieldId && !match.includes('id=') ? ` id="${U.escapeAttr(fieldId)}"` : ""}`
    );
    
    root.innerHTML = labelWithId + controlWithId.replace(/(\s*\/>|>)/, ariaDescribedBy + "$1") + errorMarkup;
    if (bindFn) bindFn(root);
    return root;
  }

  function renderText({labelZh,labelEn,docUrl,value,placeholder,onInput,onBlur=null,disabled=false,errText="", dataPath=""}){
  const fieldId = genId("text");
  return wrapField(
    fieldLabelHtml(labelZh,labelEn,docUrl),
    `<input type="text" data-path="${U.escapeAttr(dataPath||"")}" ${disabled?"disabled":""} value="${U.escapeAttr(value ?? "")}" placeholder="${U.escapeAttr(placeholder||"")}" aria-invalid="${errText ? "true" : "false"}" />`,
    (root)=>{
      const el = root.querySelector("input");
      el.addEventListener("input", e => onInput(e.target.value));
      if (onBlur) el.addEventListener("blur", () => onBlur());
    },
    errText,
    fieldId
  );
}

function renderNumber({labelZh,labelEn,docUrl,value,placeholder,onInput,onBlur=null,errText="", dataPath=""}){
  const v = (value === undefined || value === null || value === "") ? "" : String(value);
  const fieldId = genId("number");
  return wrapField(
    fieldLabelHtml(labelZh,labelEn,docUrl),
    `<input type="number" data-path="${U.escapeAttr(dataPath||"")}" value="${U.escapeAttr(v)}" placeholder="${U.escapeAttr(placeholder||"")}" aria-invalid="${errText ? "true" : "false"}" />`,
    (root)=>{
      const el = root.querySelector("input");
      el.addEventListener("input", e => {
        const raw = e.target.value;
        onInput(raw === "" ? undefined : Number(raw));
      });
      if (onBlur) el.addEventListener("blur", () => onBlur());
    },
    errText,
    fieldId
  );
}

function renderSelect({labelZh,labelEn,docUrl,value,options,onChange,errText="", dataPath=""}){
  const opts = (options||[]).map(o => `<option value="${U.escapeAttr(o.v)}"${o.v===value?" selected":""}>${U.escapeHtml(o.zh ?? o.v)}</option>`).join("");
  const fieldId = genId("select");
  return wrapField(
    fieldLabelHtml(labelZh,labelEn,docUrl),
    `<select data-path="${U.escapeAttr(dataPath||"")}" aria-invalid="${errText ? "true" : "false"}">${opts}</select>`,
    (root)=> root.querySelector("select").addEventListener("change", e => onChange(e.target.value)),
    errText,
    fieldId
  );
}

function renderBool({labelZh,labelEn,docUrl,value,onChange,errText="", dataPath=""}){
  const checked = value ? "checked" : "";
  const fieldId = genId("bool");
  return wrapField(
    fieldLabelHtml(labelZh,labelEn,docUrl),
    `<label class="checkbox"><input type="checkbox" data-path="${U.escapeAttr(dataPath||"")}" ${checked} /> <span>启用</span></label>`,
    (root)=> root.querySelector("input").addEventListener("change", e => onChange(!!e.target.checked)),
    errText,
    fieldId
  );
}

function renderStringLines({labelZh,labelEn,docUrl,value,placeholder,onChange,onBlur=null,errText="", dataPath=""}){
  const text = Array.isArray(value) ? value.join("\n") : "";
  const fieldId = genId("stringlines");
  return wrapField(
    fieldLabelHtml(labelZh,labelEn,docUrl),
    `<textarea data-path="${U.escapeAttr(dataPath||"")}" placeholder="${U.escapeAttr(placeholder||"每行一条")}" aria-invalid="${errText ? "true" : "false"}">${U.escapeHtml(text)}</textarea>`,
    (root)=>{
      const el = root.querySelector("textarea");
      el.addEventListener("input", e => {
        const lines = e.target.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
        onChange(lines.length ? lines : undefined);
      });
      if (onBlur) el.addEventListener("blur", () => onBlur());
    },
    errText,
    fieldId
  );
}

function renderJsonBox({labelZh,labelEn,docUrl,value,onInput,onBlur=null,errText="", dataPath=""}){
  const text = value ? U.stringifyJsonClean(value) : "{}";
  const fieldId = genId("jsonbox");
  return wrapField(
    fieldLabelHtml(labelZh,labelEn,docUrl),
    `<textarea data-path="${U.escapeAttr(dataPath||"")}" spellcheck="false" aria-invalid="${errText ? "true" : "false"}">${U.escapeHtml(text)}</textarea>`,
    (root)=>{
      const el = root.querySelector("textarea");
      el.addEventListener("input", e => onInput(e.target.value));
      if (onBlur) el.addEventListener("blur", () => onBlur());
    },
    errText,
    fieldId
  );
}


  function renderFormGrid(nodes) {
    const div = document.createElement("div");
    div.className = "form";
    nodes.forEach(n => div.appendChild(n));
    return div;
  }

  function renderCard(title, bodyNode, actionsNodes = []) {
    const card = document.createElement("div");
    card.className = "card";
    const head = document.createElement("div");
    head.className = "card-head";
    head.innerHTML = `<div class="card-title">${U.escapeHtml(title)}</div>`;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    actionsNodes.forEach(n => actions.appendChild(n));
    head.appendChild(actions);
    card.appendChild(head);
    const body = document.createElement("div");
    body.className = "card-body";
    body.appendChild(bodyNode);
    card.appendChild(body);
    return card;
  }


  function makeCardCollapsible(card, defaultCollapsed=true) {
    if (!card) return;
    card.classList.add("collapsible");
    const head = card.querySelector(".card-head");
    const titleEl = card.querySelector(".card-title");
    if (!head || !titleEl) return;

    const icon = document.createElement("span");
    icon.className = "collapse-icon";

    // default collapsed
    if (defaultCollapsed) card.classList.add("collapsed");

    const apply = () => {
      const collapsed = card.classList.contains("collapsed");
      icon.textContent = collapsed ? "▸" : "▾";
    };

    titleEl.prepend(icon);
    apply();

    head.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a") || e.target.closest("input") || e.target.closest("select") || e.target.closest("textarea")) return;
      card.classList.toggle("collapsed");
      apply();
    });
  }

  function button(text, cls, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls || "btn";
    b.textContent = text;
    b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); onClick?.(); });
    return b;
  }

  function renderBySchema({ schemaId, obj, rootObj, onChange, onUIRefresh=null, fileId, pathPrefix, errorMap }) {
    const schema = S.getSchema(schemaId);
    if (!schema) return document.createTextNode("（缺少 schema：" + schemaId + "）");

    if (schema.example) S.ensureDefaults(obj, schema);

    const nodes = [];
    (schema.fields || []).forEach(field => {
      if (!S.showIf(field, rootObj)) return;

      const key = field.key;
      const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;
      const dataPath = `${fileId}:${fullPath}`;
      const errText = V.getError(errorMap, fileId, fullPath);

      const labelZh = field.labelZh || key;
      const labelEn = field.labelEn || key;
      const docUrl = field.docUrl || schema.docUrl || "";

      const curVal = obj[key];

      const commit = (val) => {
        if (val === undefined || val === null || val === "") {
          delete obj[key];
        } else {
          obj[key] = val;
        }
        onChange();
      };

      if (field.type === "string") {
        nodes.push(renderText({ labelZh, labelEn, docUrl, value: curVal, placeholder: field.placeholder || "", onInput: (v) => commit(v), onBlur: () => onUIRefresh && onUIRefresh(), errText, dataPath }));
      } else if (field.type === "number") {
        nodes.push(renderNumber({ labelZh, labelEn, docUrl, value: curVal, placeholder: field.placeholder || "", onInput: (v) => commit(v), onBlur: () => onUIRefresh && onUIRefresh(), errText, dataPath }));
      } else if (field.type === "bool_set") {
        const setV = field.setValue;
        const checked = (curVal === setV);
        const fieldId = genId("boolset");
        // 勾选 => 写入 setValue；取消 => 删除 key
        nodes.push(wrapField(
          fieldLabelHtml(labelZh, labelEn, docUrl),
          `<label class="checkbox"><input type="checkbox" data-path="${U.escapeAttr(dataPath||"")}" ${checked ? "checked" : ""} aria-invalid="false" /> <span>${U.escapeHtml(field.hint || "启用")}</span></label>`,
          (root)=> root.querySelector("input").addEventListener("change", (e)=>{
            if (e.target.checked) commit(setV);
            else { delete obj[key]; onChange(); }
            if (onUIRefresh) onUIRefresh();
          }),
          errText,
          fieldId
        ));
      } else if (field.type === "bool") {
        nodes.push(renderBool({ labelZh, labelEn, docUrl, value: !!curVal, onChange: (v) => { commit(v); if (onUIRefresh) onUIRefresh(); }, errText, dataPath }));
      } else if (field.type === "select") {
        nodes.push(renderSelect({ labelZh, labelEn, docUrl, value: (curVal ?? field.defaultValue), options: field.options || [], onChange: (v) => { commit(v); if (onUIRefresh) onUIRefresh(); }, errText, dataPath }));
      } else if (field.type === "string_lines") {
        nodes.push(renderStringLines({ labelZh, labelEn, docUrl, value: curVal, placeholder: field.placeholder || "每行一条", onChange: (arr) => commit(arr), onBlur: () => onUIRefresh && onUIRefresh(), errText, dataPath }));
      } else if (field.type === "object") {
        const child = U.ensureByPath(obj, key, {});
        const childNode = renderBySchema({
          schemaId: field.ref,
          obj: child,
          rootObj,
          onChange,
          onUIRefresh,
          fileId,
          pathPrefix: fullPath,
          errorMap
        });
        const wrap = document.createElement("div");
        wrap.style.gridColumn = "1 / -1";
        const childCard = renderCard(`${labelZh}（${labelEn}）`, childNode);
        if (schemaId === "transport.streamSettings") {
          makeCardCollapsible(childCard, true);
        }
        wrap.appendChild(childCard);
        nodes.push(wrap);
      } else if (field.type === "array_object") {
        const arr = Array.isArray(curVal) ? curVal : (obj[key] = []);
        const wrap = document.createElement("div");
        wrap.style.gridColumn = "1 / -1";

        const addBtn = button("+ 添加", "btn small primary", () => {
          arr.push(U.deepClone((S.getSchema(field.ref)?.itemExample) || {}));
          onChange();
          if (onUIRefresh) onUIRefresh();
        });

        const list = document.createElement("div");
        list.style.display = "flex";
        list.style.flexDirection = "column";
        list.style.gap = "10px";
        list.style.marginTop = "8px";

        arr.forEach((it, idx) => {
          if (!U.isPlainObject(it)) arr[idx] = {};
          const actions = [
            button("上移", "btn small", () => { if (idx > 0) { [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; onChange(); if (onUIRefresh) onUIRefresh(); } }),
            button("下移", "btn small", () => { if (idx < arr.length - 1) { [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]]; onChange(); if (onUIRefresh) onUIRefresh(); } }),
            button("删除", "btn small danger", () => { arr.splice(idx, 1); onChange(); if (onUIRefresh) onUIRefresh(); })
          ];
          const body = renderBySchema({
            schemaId: field.ref,
            obj: it,
            rootObj,
            onChange,
            onUIRefresh,
            fileId,
            pathPrefix: `${fullPath}.${idx}`,
            errorMap
          });
          list.appendChild(renderCard(`${labelZh} #${idx + 1}`, body, actions));
        });

        const head = document.createElement("div");
        head.className = "row";
        head.style.display = "flex";
        head.style.alignItems = "center";
        head.style.justifyContent = "space-between";
        head.innerHTML = `<div style="font-weight:800">${U.escapeHtml(labelZh)} <span class="hint">（${U.escapeHtml(labelEn)}）</span></div>`;
        const right = document.createElement("div");
        right.className = "card-actions";
        right.appendChild(addBtn);
        head.appendChild(right);

        wrap.appendChild(head);
        wrap.appendChild(list);
        nodes.push(wrap);
      } else if (field.type === "json") {
        nodes.push(renderJsonBox({
          labelZh, labelEn, docUrl, value: curVal,
          onInput: (txt) => {
            try {
              const parsed = txt.trim() ? JSON.parse(txt) : {};
              obj[key] = parsed;
              onChange();
            } catch (e) {
              // 不在这里写 parseError；保持 JSON 标签页为强兜底
              onChange();
            }
          },
          errText, dataPath
        }));
      }
    });

    return renderFormGrid(nodes);
  }

  
  // === Local code editor: line numbers + tab indent (no external scripts) ===
  function renderCodeEditor({ value="", readOnly=false, spellcheck=false, dataPath="", className="", onInput=null, onBlur=null } = {}) {
    const wrap = document.createElement("div");
    wrap.className = `code-editor ${className || ""}`.trim();

    const gutter = document.createElement("div");
    gutter.className = "code-gutter mono";

    const ta = document.createElement("textarea");
    ta.className = "code-text mono";
    ta.spellcheck = !!spellcheck;
    if (readOnly) ta.setAttribute("readonly", "readonly");
    if (dataPath) ta.setAttribute("data-path", dataPath);
    ta.value = String(value ?? "");

    const updateGutter = () => {
      const lines = ta.value.split(/\r?\n/).length || 1;
      // avoid huge DOM; cap display but keep last line index correct
      const max = Math.min(lines, 5000);
      let html = "";
      for (let i = 1; i <= max; i++) html += `${i}\n`;
      if (lines > max) html += `…\n${lines}\n`;
      gutter.textContent = html;
    };

    const syncScroll = () => { gutter.scrollTop = ta.scrollTop; };

    const insertAt = (text) => {
      const start = ta.selectionStart ?? 0;
      const end = ta.selectionEnd ?? start;
      const v = ta.value;
      ta.value = v.slice(0, start) + text + v.slice(end);
      const pos = start + text.length;
      ta.setSelectionRange(pos, pos);
    };

    const indentSelection = (indent) => {
      const v = ta.value;
      const start = ta.selectionStart ?? 0;
      const end = ta.selectionEnd ?? start;
      const lineStart = v.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = v.indexOf("\n", end);
      const sliceEnd = (lineEnd === -1) ? v.length : lineEnd;
      const block = v.slice(lineStart, sliceEnd);
      const lines = block.split(/\r?\n/);
      const next = lines.map(l => indent + l).join("\n");
      ta.value = v.slice(0, lineStart) + next + v.slice(sliceEnd);
      const delta = indent.length * lines.length;
      ta.setSelectionRange(start + indent.length, end + delta);
    };

    const unindentSelection = (indent) => {
      const v = ta.value;
      const start = ta.selectionStart ?? 0;
      const end = ta.selectionEnd ?? start;
      const lineStart = v.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = v.indexOf("\n", end);
      const sliceEnd = (lineEnd === -1) ? v.length : lineEnd;
      const block = v.slice(lineStart, sliceEnd);
      const lines = block.split(/\r?\n/);
      let removedTotal = 0;
      const next = lines.map(l => {
        if (l.startsWith(indent)) { removedTotal += indent.length; return l.slice(indent.length); }
        if (l.startsWith("\t")) { removedTotal += 1; return l.slice(1); }
        return l;
      }).join("\n");
      ta.value = v.slice(0, lineStart) + next + v.slice(sliceEnd);
      ta.setSelectionRange(Math.max(lineStart, start - indent.length), Math.max(lineStart, end - removedTotal));
    };

    ta.addEventListener("scroll", syncScroll);

    ta.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const indent = "  ";
        const start = ta.selectionStart ?? 0;
        const end = ta.selectionEnd ?? start;
        if (start !== end) {
          if (e.shiftKey) unindentSelection(indent);
          else indentSelection(indent);
        } else {
          if (e.shiftKey) return;
          insertAt(indent);
        }
        updateGutter();
        if (onInput) onInput(ta.value);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const indentUnit = "  ";
        const v = ta.value;
        const start = ta.selectionStart ?? 0;
        const end = ta.selectionEnd ?? start;

        const lineStart = v.lastIndexOf("\n", start - 1) + 1;
        const beforeLine = v.slice(lineStart, start);
        const baseIndent = (beforeLine.match(/^[ \t]*/) || [""])[0];

        const beforeTrim = beforeLine.trimEnd();
        const after = v.slice(end);
        const nextToken = (after.match(/^\s*([}\]])/) || [])[1];

        const shouldIndent = beforeTrim.endsWith("{") || beforeTrim.endsWith("[");
        const indent = baseIndent + (shouldIndent ? indentUnit : "");

        if (shouldIndent && nextToken) {
          // {<cursor> }  =>  {\n  <cursor>\n}
          const text = "\n" + indent + "\n" + baseIndent;
          ta.value = v.slice(0, start) + text + v.slice(end);
          const pos = start + 1 + indent.length;
          ta.setSelectionRange(pos, pos);
        } else {
          ta.value = v.slice(0, start) + "\n" + indent + v.slice(end);
          const pos = start + 1 + indent.length;
          ta.setSelectionRange(pos, pos);
        }

        updateGutter();
        if (onInput) onInput(ta.value);
        return;
      }
    });

    ta.addEventListener("input", () => {
      updateGutter();
      if (onInput) onInput(ta.value);
    });

    ta.addEventListener("blur", () => { if (onBlur) onBlur(ta.value); });

    updateGutter();
    wrap.appendChild(gutter);
    wrap.appendChild(ta);
    return wrap;
  }

  X.render.api = {
    button, renderCard, renderFormGrid,
    renderBySchema,
    renderText, renderNumber, renderSelect, renderBool, renderStringLines,
    renderJsonBox,
    renderCodeEditor
  };

})();
