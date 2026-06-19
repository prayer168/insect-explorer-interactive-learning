/* ===== 主程式：載入資料、渲染內容、啟動互動 ===== */
(function () {
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error("無法載入 " + path);
    return res.json();
  }

  function renderHome(c) {
    const ul = document.getElementById("homeGoals");
    if (ul) c.goals.forEach((g) => ul.appendChild(el("li", "", g)));
    const intro = document.getElementById("homeIntro");
    if (intro) intro.textContent = c.intro;
  }

  function renderWhere(w) {
    // 身體三部分
    const bp = document.getElementById("bodyParts");
    if (bp) {
      w.bodyParts.parts.forEach((p) => {
        const card = el("div", "card");
        card.appendChild(el("h4", "", p.name));
        card.appendChild(el("p", "", p.desc));
        bp.appendChild(card);
      });
      document.getElementById("bodyKey").textContent = w.bodyParts.key.replace("重點：", "");
    }
    // 棲地
    const hb = document.getElementById("habitatList");
    if (hb) {
      w.habitats.items.forEach((h) => {
        const card = el("div", "card");
        card.appendChild(el("h4", "", "📍 " + h.place));
        card.appendChild(el("p", "", "常見昆蟲：" + h.example));
        card.appendChild(el("p", "", h.why));
        hb.appendChild(card);
      });
      document.getElementById("habitatKey").textContent = w.habitats.key.replace("重點：", "");
    }
    // 不是昆蟲
    const ni = document.getElementById("notInsectList");
    if (ni) {
      w.notInsect.items.forEach((n) => {
        const card = el("div", "card");
        card.appendChild(el("h4", "", n.name + "（" + n.legs + "）"));
        card.appendChild(el("p", "", n.note));
        ni.appendChild(card);
      });
    }
  }

  function renderGrow(g) {
    const map = [["completeBox", g.complete], ["incompleteBox", g.incomplete]];
    map.forEach(([id, d]) => {
      const box = document.getElementById(id);
      if (!box) return;
      box.appendChild(el("p", "", d.desc));
      const chain = el("p", "", d.stages.map((s) => "<b>" + s + "</b>").join(" → "));
      chain.style.fontSize = "1.15rem";
      box.appendChild(chain);
      box.appendChild(el("p", "", "🐛 例子：" + d.example));
      box.appendChild(el("p", "", d.story));
      box.appendChild(el("div", "key-box", d.key.replace("重點：", "")));
    });
    const molt = document.getElementById("moltBox");
    if (molt) { molt.appendChild(el("h3", "", "🐍 " + g.molt.title)); molt.appendChild(el("p", "", g.molt.desc)); }
  }

  function renderImportant(im) {
    const host = document.getElementById("rolesList");
    if (host) {
      im.roles.forEach((r) => {
        const card = el("div", "card");
        card.appendChild(el("h3", "", r.icon + " " + r.title));
        card.appendChild(el("p", "", r.desc));
        host.appendChild(card);
      });
    }
    const bal = document.getElementById("balanceBox");
    if (bal) { bal.appendChild(el("h3", "", "⚖️ " + im.balance.title)); bal.appendChild(el("p", "", im.balance.desc)); }
    const key = document.getElementById("importantKey");
    if (key) key.textContent = im.key.replace("重點：", "");
  }

  function renderApplications(apps) {
    const host = document.getElementById("appList");
    if (!host) return;
    apps.forEach((a) => {
      const card = el("div", "card app-card");
      card.appendChild(el("h3", "", a.title));
      card.appendChild(el("p", "", a.desc));
      card.appendChild(el("span", "tag", "對應原理：" + a.principle));
      card.appendChild(el("div", "think", a.question));
      host.appendChild(card);
    });
  }

  function renderResources(data) {
    const note = document.getElementById("resNote");
    if (note) note.textContent = data.note;
    const host = document.getElementById("resList");
    if (!host) return;
    data.resources.forEach((r) => {
      const card = el("div", "card res-card");
      const a = document.createElement("a");
      a.href = r.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = r.title + " ↗";
      card.appendChild(a);
      card.appendChild(el("span", "tag", r.type));
      card.appendChild(el("p", "", r.description));
      card.appendChild(el("p", "meta", "適合：" + r.grade + "　｜　檢視日期：" + r.checkedAt));
      host.appendChild(card);
    });
  }

  function showError(msg) {
    const main = document.querySelector("main");
    if (main) {
      const box = el("div", "card");
      box.innerHTML = "<h3>😢 載入內容時發生問題</h3><p>" + msg +
        "</p><p>提示：請用本機伺服器（例如 <code>npm run dev</code>）或在 GitHub Pages 上開啟，直接用檔案路徑開啟可能無法載入資料。</p>";
      main.prepend(box);
    }
  }

  async function init() {
    if (window.Nav) window.Nav.init();
    if (window.Progress) window.Progress.render();
    // 互動（不需資料）
    if (window.Interactions) {
      Interactions.initFindGame();
      Interactions.initSorter();
      Interactions.initMorph();
      Interactions.initPollination();
    }
    try {
      const [content, quiz, resources] = await Promise.all([
        loadJSON("data/content.json"),
        loadJSON("data/quiz.json"),
        loadJSON("data/resources.json")
      ]);
      renderHome(content.home);
      renderWhere(content.where);
      renderGrow(content.grow);
      renderImportant(content.important);
      renderApplications(content.applications);
      renderResources(resources);
      if (window.Quiz) Quiz.init(quiz);
    } catch (e) {
      showError(e.message);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
