/* ===== 闖關大挑戰 ===== */
(function () {
  const Quiz = {
    data: null,
    idx: 0,
    score: 0,
    answered: false,

    init(data) {
      this.data = data;
      this.bindStart();
    },

    bindStart() {
      const startBtn = document.getElementById("quizStart");
      if (startBtn) startBtn.addEventListener("click", () => this.start());
    },

    start() {
      this.idx = 0; this.score = 0; this.answered = false;
      this.renderQuestion();
    },

    renderQuestion() {
      const host = document.getElementById("quizArea");
      const q = this.data.questions[this.idx];
      this.answered = false;
      const total = this.data.questions.length;

      host.innerHTML = "";
      const card = el("div", "card");

      const meta = el("div", "quiz-meta");
      meta.appendChild(el("span", "tag", "第 " + (this.idx + 1) + " / " + total + " 關"));
      meta.appendChild(el("span", "tag", q.level));
      card.appendChild(meta);

      card.appendChild(el("p", "q-stem", q.stem));

      const opts = el("div", "options");
      q.options.forEach((text, i) => {
        const b = document.createElement("button");
        b.className = "option";
        b.type = "button";
        b.textContent = text;
        b.addEventListener("click", () => this.choose(i, b, q, opts));
        opts.appendChild(b);
      });
      card.appendChild(opts);

      const slot = el("div", "");
      slot.id = "quizExplain";
      card.appendChild(slot);

      host.appendChild(card);
      host.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    choose(i, btn, q, opts) {
      if (this.answered) return;
      this.answered = true;
      const correct = i === q.answer;
      if (correct) this.score++;

      opts.querySelectorAll(".option").forEach((o, j) => {
        o.disabled = true;
        if (j === q.answer) o.classList.add("correct");
        if (j === i && !correct) o.classList.add("wrong");
      });

      const slot = document.getElementById("quizExplain");
      const box = el("div", "explain-box" + (correct ? "" : " wrong"));
      box.appendChild(el("p", "", (correct ? "✅ 答對了！" : "❌ 再接再厲！") + " " + q.explain));
      box.appendChild(el("p", "", "📖 可回看單元：" + q.ref));

      const nextBtn = document.createElement("button");
      nextBtn.className = "btn";
      nextBtn.style.marginTop = "10px";
      const last = this.idx === this.data.questions.length - 1;
      nextBtn.textContent = last ? "看成績 🏆" : "下一關 ▶";
      nextBtn.addEventListener("click", () => {
        if (last) this.showResult();
        else { this.idx++; this.renderQuestion(); }
      });
      box.appendChild(nextBtn);
      slot.appendChild(box);
    },

    showResult() {
      const host = document.getElementById("quizArea");
      const total = this.data.questions.length;
      const pass = this.score >= (this.data.passScore || Math.ceil(total * 0.7));
      if (window.Progress) window.Progress.setQuizBest(this.score, total);

      let emoji, advice;
      if (this.score === total) { emoji = "🏆"; advice = "滿分！你是昆蟲大解密的小博士！"; }
      else if (pass) { emoji = "🎉"; advice = "做得很好！再挑戰一次說不定能拿滿分喔。"; }
      else { emoji = "💪"; advice = "別灰心！回去看看單元內容，再來挑戰一次吧。"; }

      host.innerHTML = "";
      const card = el("div", "card quiz-result");
      card.appendChild(el("div", "big-emoji", emoji));
      card.appendChild(el("div", "score", "答對 " + this.score + " / " + total + " 題"));
      card.appendChild(el("p", "lead", advice));

      const again = document.createElement("button");
      again.className = "btn big";
      again.textContent = "🔄 再挑戰一次";
      again.addEventListener("click", () => this.start());
      card.appendChild(again);

      const back = document.createElement("button");
      back.className = "btn secondary";
      back.style.marginLeft = "10px";
      back.textContent = "回去複習";
      back.addEventListener("click", () => window.Nav && window.Nav.go("where"));
      card.appendChild(back);

      host.appendChild(card);
    }
  };

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  window.Quiz = Quiz;
})();
