/* ===== 頁籤切換與上一頁／下一頁 ===== */
(function () {
  const ORDER = ["home", "where", "grow", "important", "apply", "quiz", "resources"];

  const Nav = {
    current: "home",
    init() {
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => this.go(btn.dataset.tab));
        btn.addEventListener("keydown", (e) => this.onKey(e));
      });
      document.querySelectorAll("[data-goto]").forEach((btn) => {
        btn.addEventListener("click", () => this.go(btn.dataset.goto));
      });
      this.go("home", true);
    },
    onKey(e) {
      // 鍵盤左右鍵切換頁籤
      const idx = ORDER.indexOf(this.current);
      if (e.key === "ArrowRight" && idx < ORDER.length - 1) {
        e.preventDefault(); this.go(ORDER[idx + 1]);
      } else if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault(); this.go(ORDER[idx - 1]);
      }
    },
    go(tabId, silent) {
      if (!ORDER.includes(tabId)) return;
      this.current = tabId;

      document.querySelectorAll(".tab-btn").forEach((btn) => {
        const on = btn.dataset.tab === tabId;
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
      });
      document.querySelectorAll(".panel").forEach((p) => {
        p.classList.toggle("active", p.id === "panel-" + tabId);
      });

      // 更新上一頁／下一頁按鈕
      const idx = ORDER.indexOf(tabId);
      const prev = document.getElementById("prevBtn");
      const next = document.getElementById("nextBtn");
      if (prev) { prev.disabled = idx === 0; prev.dataset.goto = ORDER[Math.max(0, idx - 1)]; }
      if (next) { next.disabled = idx === ORDER.length - 1; next.dataset.goto = ORDER[Math.min(ORDER.length - 1, idx + 1)]; }

      if (window.Progress) window.Progress.markVisited(tabId);
      if (!silent) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const tabBtn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
        if (tabBtn) tabBtn.focus();
      }
    }
  };

  window.Nav = Nav;
})();
