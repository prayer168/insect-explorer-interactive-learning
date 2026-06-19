/* ===== 共用版面：頁首、頁籤導覽、上一頁／下一頁（多頁式） ===== */
(function () {
  const PAGES = [
    { id: "home",      file: "index.html",     tab: "🏠 學習任務" },
    { id: "where",     file: "where.html",     tab: "🔍 昆蟲在哪裡" },
    { id: "grow",      file: "grow.html",      tab: "🦋 昆蟲如何長大" },
    { id: "important", file: "important.html", tab: "🌍 昆蟲重要嗎" },
    { id: "apply",     file: "apply.html",     tab: "🍎 生活應用" },
    { id: "quiz",      file: "quiz.html",      tab: "🏆 闖關大挑戰" },
    { id: "resources", file: "resources.html", tab: "📚 自主學習" }
  ];

  const current = document.body.dataset.page || "home";
  const idx = Math.max(0, PAGES.findIndex((p) => p.id === current));

  function buildHeader() {
    const host = document.getElementById("siteHeader");
    if (!host) return;
    host.className = "site-header";
    host.innerHTML =
      '<div class="bar">' +
        '<a class="brand" href="index.html" style="text-decoration:none;color:inherit">' +
          '<span class="logo">🐞</span><span>昆蟲大解密</span>' +
        '</a>' +
        '<div class="progress-wrap">' +
          '<span>學習進度</span>' +
          '<div class="progress-track"><div class="progress-fill"></div></div>' +
          '<span class="progress-label">0%</span>' +
        '</div>' +
      '</div>';
  }

  function buildTabs() {
    const host = document.getElementById("tabNav");
    if (!host) return;
    host.className = "tabs";
    host.setAttribute("role", "navigation");
    host.setAttribute("aria-label", "教材單元");
    host.innerHTML = PAGES.map((p) => {
      const on = p.id === current;
      return '<a class="tab-btn" href="' + p.file + '"' +
        (on ? ' aria-current="page"' : '') + '>' + p.tab + '</a>';
    }).join("");
  }

  function buildFootNav() {
    const host = document.getElementById("footNav");
    if (!host) return;
    host.className = "foot-nav";
    const prev = PAGES[idx - 1];
    const next = PAGES[idx + 1];
    let html = "";
    html += prev
      ? '<a class="btn secondary" href="' + prev.file + '">⬅ ' + prev.tab + '</a>'
      : '<span></span>';
    html += next
      ? '<a class="btn" href="' + next.file + '">' + next.tab + ' ➡</a>'
      : '<span></span>';
    host.innerHTML = html;
  }

  function buildFooter() {
    const host = document.getElementById("siteFooter");
    if (!host) return;
    host.className = "site-footer";
    host.innerHTML =
      "<p>昆蟲大解密 ｜ 國小中年級自然科學互動教材 ｜ 內容依十二年國教自然領域精神設計</p>" +
      "<p>本教材以 CC BY 4.0 授權分享，歡迎教師教學使用。</p>";
  }

  function keyboardNav() {
    document.addEventListener("keydown", (e) => {
      if (e.target && /^(INPUT|TEXTAREA|BUTTON|A)$/.test(e.target.tagName)) return;
      if (e.key === "ArrowRight" && PAGES[idx + 1]) location.href = PAGES[idx + 1].file;
      if (e.key === "ArrowLeft" && PAGES[idx - 1]) location.href = PAGES[idx - 1].file;
    });
  }

  function init() {
    buildHeader();
    buildTabs();
    buildFootNav();
    buildFooter();
    keyboardNav();
    if (window.Progress) {
      window.Progress.markVisited(current);
      window.Progress.render();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
