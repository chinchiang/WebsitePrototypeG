/**
 * 架構先行、內容後補
 * 僅處理版面互動：行動選單、角色切換 UI、政策展開、事件類型選擇。
 * 不實作真實登入、授權或送單邏輯。
 */
const ROLE_KEY = "sec-portal-role";

function initNav() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-mobile-nav]");
  const openIcon = document.querySelector("[data-nav-open]");
  const closeIcon = document.querySelector("[data-nav-close]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    panel.classList.toggle("hidden", expanded);
    openIcon?.classList.toggle("hidden", !expanded);
    closeIcon?.classList.toggle("hidden", expanded);
  });
}

function applyRole(role: string) {
  document.documentElement.dataset.role = role;
  document.querySelectorAll<HTMLSelectElement>("[data-role-switcher]").forEach((el) => {
    el.value = role;
  });
  document.querySelectorAll<HTMLElement>("[data-for-role]").forEach((el) => {
    const allowed = (el.dataset.forRole || "").split(/\s+/).filter(Boolean);
    el.hidden = allowed.length > 0 && !allowed.includes(role);
  });
}

function initRole() {
  const stored = localStorage.getItem(ROLE_KEY) || "employee";
  applyRole(stored);
  document.querySelectorAll<HTMLSelectElement>("[data-role-switcher]").forEach((el) => {
    el.addEventListener("change", () => {
      localStorage.setItem(ROLE_KEY, el.value);
      applyRole(el.value);
    });
  });
}

function initPolicyExplorer() {
  const root = document.querySelector("[data-policy-explorer]");
  if (!root) return;
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-policy-id]");
  const panes = root.querySelectorAll<HTMLElement>("[data-policy-detail]");
  const categoryButtons = root.querySelectorAll<HTMLButtonElement>("[data-policy-cat]");
  const items = root.querySelectorAll<HTMLElement>("[data-policy-item]");

  const show = (id: string) => {
    buttons.forEach((btn) => {
      const on = btn.dataset.policyId === id;
      btn.setAttribute("aria-selected", String(on));
      btn.classList.toggle("bg-accent-soft", on);
      btn.classList.toggle("text-accent", on);
    });
    panes.forEach((pane) => {
      pane.hidden = pane.dataset.policyDetail !== id;
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => show(btn.dataset.policyId || ""));
  });

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.policyCat || "all";
      categoryButtons.forEach((b) => {
        const on = b === btn;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("bg-accent", on);
        b.classList.toggle("text-accent-fg", on);
        b.classList.toggle("bg-subtle", !on);
      });
      items.forEach((item) => {
        item.hidden = cat !== "all" && item.dataset.policyItem !== cat;
      });
      const firstVisible = root.querySelector<HTMLButtonElement>(
        "[data-policy-item]:not([hidden]) [data-policy-id]",
      );
      if (firstVisible) show(firstVisible.dataset.policyId || "");
    });
  });

  const first = buttons[0];
  if (first) show(first.dataset.policyId || "");
}

function initTrainingFilter() {
  const root = document.querySelector("[data-training-hub]");
  if (!root) return;
  const tabs = root.querySelectorAll<HTMLButtonElement>("[data-train-cat]");
  const cards = root.querySelectorAll<HTMLElement>("[data-train-card]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const cat = tab.dataset.trainCat || "all";
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-pressed", String(on));
        t.classList.toggle("bg-accent", on);
        t.classList.toggle("text-accent-fg", on);
        t.classList.toggle("bg-subtle", !on);
      });
      cards.forEach((card) => {
        card.hidden = cat !== "all" && card.dataset.trainCard !== cat;
      });
    });
  });
}

function initIncidentPicker() {
  const root = document.querySelector("[data-incident-form]");
  if (!root) return;
  const types = root.querySelectorAll<HTMLButtonElement>("[data-incident-type]");
  const label = root.querySelector("[data-selected-type]");

  types.forEach((btn) => {
    btn.addEventListener("click", () => {
      types.forEach((b) => {
        const on = b === btn;
        b.setAttribute("aria-pressed", String(on));
        b.classList.toggle("border-accent", on);
        b.classList.toggle("bg-accent-soft", on);
      });
      if (label) label.textContent = btn.dataset.incidentType || "此處放置事件類型名稱";
    });
  });
}

function initResourceFilter() {
  const root = document.querySelector("[data-resource-hub]");
  if (!root) return;
  const tabs = root.querySelectorAll<HTMLButtonElement>("[data-res-cat]");
  const cards = root.querySelectorAll<HTMLElement>("[data-res-card]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const cat = tab.dataset.resCat || "all";
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-pressed", String(on));
        t.classList.toggle("bg-accent", on);
        t.classList.toggle("text-accent-fg", on);
        t.classList.toggle("bg-subtle", !on);
      });
      cards.forEach((card) => {
        card.hidden = cat !== "all" && card.dataset.resCard !== cat;
      });
    });
  });
}

initNav();
initRole();
initPolicyExplorer();
initTrainingFilter();
initIncidentPicker();
initResourceFilter();
