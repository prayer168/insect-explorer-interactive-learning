/* ===== 學習進度（存於瀏覽器 localStorage） ===== */
(function () {
  const KEY = "insect-explorer-progress";
  // 7 個頁籤，記錄哪些已造訪
  const TAB_IDS = ["home", "where", "grow", "important", "apply", "quiz", "resources"];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { visited: [], quizBest: null };
    } catch (e) {
      return { visited: [], quizBest: null };
    }
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 忽略 */ }
  }

  const state = load();

  const Progress = {
    markVisited(tabId) {
      if (!state.visited.includes(tabId)) {
        state.visited.push(tabId);
        save(state);
      }
      this.render();
    },
    setQuizBest(score, total) {
      if (state.quizBest == null || score > state.quizBest.score) {
        state.quizBest = { score, total };
        save(state);
      }
    },
    getQuizBest() { return state.quizBest; },
    percent() {
      return Math.round((state.visited.length / TAB_IDS.length) * 100);
    },
    render() {
      const fill = document.querySelector(".progress-fill");
      const label = document.querySelector(".progress-label");
      const pct = this.percent();
      if (fill) fill.style.width = pct + "%";
      if (label) label.textContent = pct + "%";
    },
    reset() {
      state.visited = [];
      state.quizBest = null;
      save(state);
      this.render();
    }
  };

  window.Progress = Progress;
})();
