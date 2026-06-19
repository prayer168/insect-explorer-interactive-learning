/* ===== 互動功能 ===== */
(function () {
  const Interactions = {};

  /* ---------- 1. 找昆蟲遊戲 ---------- */
  // isInsect: 是否為昆蟲（6 隻腳、頭胸腹三部分）
  const CRITTERS = [
    { emoji: "🐝", name: "蜜蜂", insect: true,  x: 8,  y: 18 },
    { emoji: "🦋", name: "蝴蝶", insect: true,  x: 70, y: 12 },
    { emoji: "🐞", name: "瓢蟲", insect: true,  x: 40, y: 55 },
    { emoji: "🐜", name: "螞蟻", insect: true,  x: 22, y: 70 },
    { emoji: "🦗", name: "蚱蜢", insect: true,  x: 80, y: 62 },
    { emoji: "🕷️", name: "蜘蛛", insect: false, x: 55, y: 25 },
    { emoji: "🐌", name: "蝸牛", insect: false, x: 15, y: 45 },
    { emoji: "🪱", name: "蚯蚓", insect: false, x: 62, y: 78 }
  ];

  Interactions.initFindGame = function () {
    const scene = document.getElementById("findScene");
    const fb = document.getElementById("findFeedback");
    const scoreEl = document.getElementById("findScore");
    const resetBtn = document.getElementById("findReset");
    if (!scene) return;

    const totalInsects = CRITTERS.filter((c) => c.insect).length;
    let found = 0;
    const foundSet = new Set();

    function render() {
      scene.innerHTML = "";
      found = 0; foundSet.clear();
      CRITTERS.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "critter fly";
        b.textContent = c.emoji;
        b.style.left = c.x + "%";
        b.style.top = c.y + "%";
        b.style.animationDelay = (i * 0.3) + "s";
        b.setAttribute("aria-label", "一隻小動物，點擊判斷是不是昆蟲");
        b.addEventListener("click", () => onClick(c, i, b));
        scene.appendChild(b);
      });
      updateScore();
      setFeedback("點點看畫面中的小動物，把 " + totalInsects + " 隻昆蟲都找出來！", "");
    }

    function onClick(c, i, el) {
      if (c.insect) {
        if (foundSet.has(i)) return;
        foundSet.add(i); found++;
        el.classList.add("found");
        el.disabled = true;
        el.style.opacity = ".55";
        setFeedback("✅ 答對了！" + c.name + "是昆蟲（有 6 隻腳）。", "ok");
        updateScore();
        if (found === totalInsects) {
          setFeedback("🎉 太棒了！你把所有昆蟲都找到了！", "ok");
        }
      } else {
        el.classList.remove("found");
        el.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
          { duration: 250 }
        );
        setFeedback("❌ " + c.name + "不是昆蟲喔！想想看牠有幾隻腳？", "no");
      }
    }

    function updateScore() {
      if (scoreEl) scoreEl.textContent = "找到昆蟲：" + found + " / " + totalInsects;
    }
    function setFeedback(msg, cls) {
      if (!fb) return;
      fb.textContent = msg;
      fb.className = "feedback " + (cls || "");
    }

    if (resetBtn) resetBtn.addEventListener("click", render);
    render();
  };

  /* ---------- 2. 數腳辨昆蟲：拖曳 / 點擊分類 ---------- */
  const SORT_ITEMS = [
    { emoji: "🐝", name: "蜜蜂", insect: true },
    { emoji: "🐞", name: "瓢蟲", insect: true },
    { emoji: "🦋", name: "蝴蝶", insect: true },
    { emoji: "🕷️", name: "蜘蛛", insect: false },
    { emoji: "🐛", name: "蜈蚣", insect: false },
    { emoji: "🐌", name: "蝸牛", insect: false }
  ];

  Interactions.initSorter = function () {
    const tray = document.getElementById("sortTray");
    const binYes = document.getElementById("binInsect");
    const binNo = document.getElementById("binNot");
    const fb = document.getElementById("sortFeedback");
    const resetBtn = document.getElementById("sortReset");
    if (!tray) return;

    let selected = null; // 給觸控／鍵盤用：先選一個再點分類桶

    function render() {
      tray.innerHTML = "";
      [...SORT_ITEMS].forEach((item, idx) => {
        const chip = document.createElement("div");
        chip.className = "chip";
        chip.setAttribute("role", "button");
        chip.tabIndex = 0;
        chip.draggable = true;
        chip.dataset.idx = idx;
        chip.innerHTML = item.emoji + '<span class="label">' + item.name + "</span>";

        chip.addEventListener("dragstart", (e) => {
          chip.classList.add("dragging");
          e.dataTransfer.setData("text/plain", idx);
        });
        chip.addEventListener("dragend", () => chip.classList.remove("dragging"));

        // 觸控 / 點擊 / 鍵盤：先選取
        chip.addEventListener("click", () => selectChip(chip));
        chip.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectChip(chip); }
        });
        tray.appendChild(chip);
      });
      [binYes, binNo].forEach((bin) => {
        bin.querySelector(".dropzone").innerHTML = "";
      });
      setFeedback("把每隻小動物拖進正確的盒子，或先點選牠再點盒子。", "");
      selected = null;
    }

    function selectChip(chip) {
      tray.querySelectorAll(".chip").forEach((c) => c.classList.remove("dragging"));
      if (selected === chip) { selected = null; return; }
      selected = chip;
      chip.classList.add("dragging");
      setFeedback("已選擇「" + SORT_ITEMS[chip.dataset.idx].name + "」，請點下方的盒子。", "");
    }

    function setupBin(bin, isInsectBin) {
      const zone = bin.querySelector(".dropzone");
      bin.addEventListener("dragover", (e) => { e.preventDefault(); bin.classList.add("over"); });
      bin.addEventListener("dragleave", () => bin.classList.remove("over"));
      bin.addEventListener("drop", (e) => {
        e.preventDefault(); bin.classList.remove("over");
        const idx = e.dataTransfer.getData("text/plain");
        const chip = tray.querySelector('.chip[data-idx="' + idx + '"]');
        place(chip, zone, isInsectBin);
      });
      // 觸控 / 鍵盤：點盒子放入已選的 chip
      bin.addEventListener("click", () => { if (selected) place(selected, zone, isInsectBin); });
    }

    function place(chip, zone, isInsectBin) {
      if (!chip) return;
      const item = SORT_ITEMS[chip.dataset.idx];
      const correct = item.insect === isInsectBin;
      chip.classList.remove("dragging");
      chip.classList.add(correct ? "placed-ok" : "placed-no");
      chip.draggable = false;
      zone.appendChild(chip);
      selected = null;
      if (correct) {
        setFeedback("✅ 對！" + item.name + (item.insect ? "是昆蟲。" : "不是昆蟲。"), "ok");
      } else {
        setFeedback("❌ 再想想，" + item.name + "的腳和身體和昆蟲一樣嗎？", "no");
      }
      checkDone();
    }

    function checkDone() {
      const placed = tray.parentElement.querySelectorAll(".dropzone .chip").length;
      const allOk = tray.parentElement.querySelectorAll(".dropzone .chip.placed-ok").length;
      if (placed === SORT_ITEMS.length) {
        if (allOk === SORT_ITEMS.length) setFeedback("🎉 全部分類正確！你已經是辨認昆蟲的小高手了！", "ok");
        else setFeedback("已經分完囉，紅框的代表放錯了，按重新開始再試一次吧！", "no");
      }
    }

    function setFeedback(msg, cls) {
      if (fb) { fb.textContent = msg; fb.className = "feedback " + (cls || ""); }
    }

    setupBin(binYes, true);
    setupBin(binNo, false);
    if (resetBtn) resetBtn.addEventListener("click", render);
    render();
  };

  /* ---------- 3. 變態動畫（文字與圖逐階段對應） ---------- */
  // data = { complete: [{name, fig, text}, ...], incomplete: [...] }
  Interactions.initMorph = function (data) {
    const wrap = document.getElementById("morphWidget");
    if (!wrap || !data) return;

    let type = "complete";
    let step = 0;
    let timer = null;

    const labelsWrap = document.getElementById("morphLabels");
    const playBtn = document.getElementById("morphPlay");
    const stepBtn = document.getElementById("morphStep");
    const resetBtn = document.getElementById("morphReset");
    const caption = document.getElementById("morphCaption");
    const desc = document.getElementById("morphDesc");

    function stages() { return data[type]; }

    // SVG 元素沒有 HTMLElement 的 hidden 屬性 (IDL)，必須直接操作 attribute
    function setHidden(elm, hide) {
      if (hide) elm.setAttribute("hidden", "");
      else elm.removeAttribute("hidden");
    }

    function showType(t) {
      type = t; stop(); step = 0;
      document.querySelectorAll(".morph-tabs .btn").forEach((b) =>
        b.classList.toggle("secondary", b.dataset.type !== t));
      document.querySelectorAll(".morph-set").forEach((s) =>
        setHidden(s, s.dataset.type !== t));
      renderLabels();
      update();
    }

    function renderLabels() {
      labelsWrap.innerHTML = "";
      stages().forEach((s, i) => {
        if (i > 0) {
          const arrow = document.createElement("span");
          arrow.className = "rail-arrow";
          arrow.setAttribute("aria-hidden", "true");
          arrow.textContent = "→";
          labelsWrap.appendChild(arrow);
        }
        const span = document.createElement("span");
        span.className = "rail-stage";
        span.textContent = s.name;
        span.dataset.i = i;
        span.tabIndex = 0;
        span.setAttribute("role", "button");
        span.addEventListener("click", () => { stop(); step = i; update(); });
        span.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stop(); step = i; update(); }
        });
        labelsWrap.appendChild(span);
      });
    }

    function update() {
      const conf = stages();
      const cur = conf[step];
      const set = document.querySelector('.morph-set[data-type="' + type + '"]');
      set.querySelectorAll(".morph-fig").forEach((f) => {
        setHidden(f, f.dataset.fig !== cur.fig);
      });
      labelsWrap.querySelectorAll(".rail-stage").forEach((sp) =>
        sp.classList.toggle("on", Number(sp.dataset.i) === step));
      if (caption) caption.textContent =
        "第 " + (step + 1) + " 步／共 " + conf.length + " 步：" + cur.name;
      if (desc) desc.textContent = cur.text;
    }

    function next() { step = (step + 1) % stages().length; update(); }

    function play() {
      if (timer) { stop(); return; }
      playBtn.textContent = "⏸ 暫停";
      timer = setInterval(() => {
        if (step === stages().length - 1) { stop(); return; }
        next();
      }, 2200);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      if (playBtn) playBtn.textContent = "▶ 播放";
    }
    function reset() { stop(); step = 0; update(); }

    document.querySelectorAll(".morph-tabs .btn").forEach((b) =>
      b.addEventListener("click", () => showType(b.dataset.type)));
    if (playBtn) playBtn.addEventListener("click", play);
    if (stepBtn) stepBtn.addEventListener("click", () => { stop(); next(); });
    if (resetBtn) resetBtn.addEventListener("click", reset);

    showType("complete");
  };

  /* ---------- 4. 授粉模擬 ---------- */
  Interactions.initPollination = function () {
    const widget = document.getElementById("pollinate");
    if (!widget) return;
    const flowers = widget.querySelectorAll(".flower");
    const fb = document.getElementById("pollinateFeedback");
    const resetBtn = document.getElementById("pollinateReset");
    let pollinated = 0;

    function reset() {
      pollinated = 0;
      flowers.forEach((f) => {
        f.classList.remove("flower-pollinated");
        f.querySelectorAll(".petal").forEach((p) => p.setAttribute("fill", "#f7c5d9"));
        const fruit = f.querySelector(".fruit");
        if (fruit) fruit.setAttribute("opacity", "0");
        f.dataset.done = "";
      });
      if (fb) { fb.textContent = "點蜜蜂讓牠飛到花上，看看授粉後會怎麼樣！"; fb.className = "feedback"; }
    }

    flowers.forEach((f) => {
      f.style.cursor = "pointer";
      f.setAttribute("tabindex", "0");
      f.setAttribute("role", "button");
      f.setAttribute("aria-label", "一朵花，點擊讓蜜蜂授粉");
      const act = () => {
        if (f.dataset.done) return;
        f.dataset.done = "1"; pollinated++;
        f.classList.add("flower-pollinated");
        f.querySelectorAll(".petal").forEach((p) => p.setAttribute("fill", "#ff9ec4"));
        const fruit = f.querySelector(".fruit");
        if (fruit) fruit.setAttribute("opacity", "1");
        if (fb) {
          fb.className = "feedback ok";
          fb.textContent = pollinated < flowers.length
            ? "🐝 蜜蜂把花粉帶來了！花朵開始結果實了。"
            : "🎉 所有花都授粉成功，結出果實了！這就是昆蟲的重要工作。";
        }
      };
      f.addEventListener("click", act);
      f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
    });

    if (resetBtn) resetBtn.addEventListener("click", reset);
    reset();
  };

  window.Interactions = Interactions;
})();
