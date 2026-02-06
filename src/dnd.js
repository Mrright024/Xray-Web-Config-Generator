(function(){
  const X = window.XFB;

  X.dnd = X.dnd || {};

  function enableDnD({container, itemsSelector, onReorder}){
    let dragEl = null;

    container.addEventListener("dragstart", (e)=>{
      const item = e.target.closest(itemsSelector);
      if (!item) return;
      dragEl = item;
      item.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", item.getAttribute("data-id") || "");
    });

    container.addEventListener("dragend", ()=>{
      if (dragEl) dragEl.classList.remove("dragging");
      dragEl = null;
      [...container.querySelectorAll(".drop-hint")].forEach(x => x.classList.remove("drop-hint"));
    });

    container.addEventListener("dragover", (e)=>{
      e.preventDefault();
      const over = e.target.closest(itemsSelector);
      if (!over || over === dragEl) return;
      over.classList.add("drop-hint");
    });

    container.addEventListener("dragleave", (e)=>{
      const over = e.target.closest(itemsSelector);
      if (over) over.classList.remove("drop-hint");
    });

    container.addEventListener("drop", (e)=>{
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const over = e.target.closest(itemsSelector);
      if (!id || !over) return;
      const overId = over.getAttribute("data-id");
      if (!overId || overId === id) return;
      onReorder?.(id, overId);
    });
  }

  X.dnd.api = { enableDnD };
})();
