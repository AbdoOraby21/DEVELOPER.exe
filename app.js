/* ==========================================================================
   DEVELOPER.exe — GDG Assiut Edition
   Quiz logic · bilingual content (EN/AR) · ID card · sharing · local stats
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = n => String(n).padStart(2, "0");
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TOTAL = 6;
  const SITE_URL = "https://abdooraby21.github.io/DEVELOPER.exe/";

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } }
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- the six classes (order = answer index) ---------- */
  const PROFILES = [
    { id: "bughunter",   glyph: "⌕", color: "#ff6b6b", level: 92, mate: "creator" },
    { id: "architect",   glyph: "⌘", color: "#38bdf8", level: 96, mate: "speedrunner" },
    { id: "creator",     glyph: "✳", color: "#e879f9", level: 89, mate: "bughunter" },
    { id: "speedrunner", glyph: "⚡", color: "#facc15", level: 88, mate: "architect" },
    { id: "guardian",    glyph: "⬡", color: "#22c55e", level: 94, mate: "researcher" },
    { id: "researcher",  glyph: "◎", color: "#a78bfa", level: 90, mate: "guardian" }
  ];
  const byId = id => PROFILES.find(p => p.id === id);

  /* ---------- translations ---------- */
  const I18N = {
    en: {
      ui: {
        title: "DEVELOPER.exe — GDG Assiut",
        desc: "Discover your developer identity in the DEVELOPER.exe multiverse. Six questions, six classes, one shareable ID card.",
        skip: "Skip to the quiz",
        online: "SYSTEM ONLINE", langBtn: "عربي",
        heroEyebrow: "GDG ASSIUT COMMUNITY EXPERIMENT / 001",
        hero: "YOUR CODE.<br><em>YOUR IDENTITY.</em>",
        intro: "Every developer has a hidden class. Run the scan, reveal your powers, and find your place in the multiverse.",
        start: "INITIALIZE SCAN ↗", explore: "EXPLORE THE MULTIVERSE ↓",
        meta: "06 DEVELOPER CLASSES · ~60 SECONDS",
        challenge: "A FRIEND UNLOCKED {glyph} {name}. WHAT'S YOUR CLASS?",
        quizEyebrow: "SCAN PROTOCOL / PERSONALITY ANALYSIS",
        quizTitle: "LET'S READ YOUR <em>DNA.</em>",
        counter: "QUESTION {n} / {t}",
        back: "← BACK", hint: "TIP: PRESS 1–6 ON YOUR KEYBOARD",
        boot: ["> reading your answers ........ OK", "> decoding developer DNA ....... OK", "> class found. rendering ID card ..."],
        resEyebrow: "SCAN COMPLETE / IDENTITY DECODED",
        resTitle: "IDENTITY <em>UNLOCKED.</em>",
        cardBrand: "DEVELOPER.exe · GDG ASSIUT", cardLabel: "YOUR DEVELOPER CLASS",
        lvl: "LVL.", power: "SPECIAL POWER", weakness: "WEAKNESS",
        dna: "DNA MATRIX", second: "SECONDARY CLASS", mate: "BEST TEAMMATE",
        mateHint: "Find someone with this class at the event and build something together.",
        share: "SHARE IDENTITY ↗", linkedin: "POST ON LINKEDIN ↗", download: "DOWNLOAD ID CARD ↓", again: "↻ RUN ANOTHER SCAN",
        shareText: "I unlocked my developer identity on DEVELOPER.exe: {name}. What's your class?",
        copied: "Link copied — paste it anywhere!", saved: "ID card saved!", cancelled: "Share cancelled.", preparing: "Preparing your card…",
        multiEyebrow: "COMMUNITY DATA / LOCAL SESSION",
        multiTitle: "THE DEVELOPER <em>MULTIVERSE.</em>",
        multiIntro: "Every class has a place. Explore the identities discovered on this device.",
        scans: "SCANS COMPLETED", onDevice: "ON THIS DEVICE", topClass: "TOP CLASS", mostCommon: "MOST COMMON",
        unlockedLbl: "CLASSES UNLOCKED", uniqueClasses: "UNIQUE CLASSES",
        privacy: "ⓘ Counts are stored only in this browser. They are not shared or sent to a server.",
        reset: "CLEAR LOCAL DATA", resetConfirm: "Clear all scan counts stored on this device?",
        closingTag: "[ SYSTEM MESSAGE ]", closingTitle: "THE MULTIVERSE NEEDS <em>YOUR CODE.</em>",
        closingText: "Meet people. Exchange ideas. Build something that matters.", backTop: "BACK TO THE TOP ↑",
        footerMade: "MADE FOR THE COMMUNITY, WITH CURIOSITY.",
        cardTeammate: "BEST TEAMMATE"
      },
      profiles: {
        bughunter:   { name: "THE BUG HUNTER", tag: "I FIND WHAT OTHERS OVERLOOK.", code: "DEBUGGER", power: "Spotting hidden problems", weak: "One more quick fix", headline: "You see the signal in the noise.", desc: "You stay curious, test assumptions, and dig until the system makes sense.", traits: ["Curious", "Precise", "Persistent"] },
        architect:   { name: "THE ARCHITECT", tag: "I BUILD THE BIGGER PICTURE.", code: "SYSTEM DESIGNER", power: "Turning complexity into structure", weak: "Overthinking the blueprint", headline: "You think in systems.", desc: "You connect ideas, plan for scale, and build foundations that last.", traits: ["Strategic", "Structured", "Visionary"] },
        creator:     { name: "THE CREATOR", tag: "I TURN IDEAS INTO EXPERIENCES.", code: "UI / UX MAKER", power: "Making technology feel human", weak: "Pixel-perfect perfectionism", headline: "You make ideas visible.", desc: "You blend curiosity and creativity to make products people love to use.", traits: ["Creative", "Empathetic", "Bold"] },
        speedrunner: { name: "THE SPEEDRUNNER", tag: "SHIP IT. LEARN. REPEAT.", code: "RAPID BUILDER", power: "Moving from idea to prototype fast", weak: "Skipping the documentation", headline: "Momentum is your superpower.", desc: "You learn by building, iterate quickly, and turn blockers into momentum.", traits: ["Fast", "Adaptive", "Practical"] },
        guardian:    { name: "THE GUARDIAN", tag: "I KEEP THE SYSTEM STRONG.", code: "SECURITY MINDED", power: "Thinking ahead about risks", weak: "Trusting absolutely nothing", headline: "You protect what matters.", desc: "You value reliability, safety, and details that keep products dependable.", traits: ["Careful", "Reliable", "Analytical"] },
        researcher:  { name: "THE RESEARCHER", tag: "WHY? IS YOUR FAVORITE QUESTION.", code: "DEEP DIVER", power: "Finding patterns and new answers", weak: "Falling into another rabbit hole", headline: "You follow questions further.", desc: "You explore the unknown, learn deeply, and turn evidence into insight.", traits: ["Curious", "Patient", "Analytical"] }
      },
      questions: [
        { q: "When your code breaks before a demo, you…", a: ["Trace the bug until you find the root cause", "Redesign the flow so it cannot happen again", "Find a clever workaround and polish the experience", "Patch it fast and keep the demo moving", "Check what could fail next and secure it", "Investigate why it happened in the first place"] },
        { q: "Your favorite part of a project is…", a: ["Making tricky bugs disappear", "Designing the architecture", "Creating a beautiful experience", "Shipping a working prototype", "Making it stable and safe", "Learning something nobody knows yet"] },
        { q: "A new technology catches your eye. You…", a: ["Test its edge cases", "See how it fits a larger system", "Imagine what people could create with it", "Build a quick experiment", "Read its security notes", "Study how it works under the hood"] },
        { q: "In a team, you are usually the one who…", a: ["Finds the issue everyone missed", "Connects all the moving parts", "Makes the product feel right", "Gets everyone unstuck", "Checks quality and risks", "Asks the question that changes direction"] },
        { q: "Your ideal superpower would be…", a: ["See every bug instantly", "Understand any system", "Turn imagination into reality", "Build at incredible speed", "Prevent every failure", "Understand any technology deeply"] },
        { q: "Choose the line that feels most like you…", a: ["There is always a clue", "Think before you build", "Make it meaningful", "Done is better than perfect", "Trust, but verify", "Stay curious, always"] }
      ]
    },

    ar: {
      ui: {
        title: "DEVELOPER.exe — GDG أسيوط",
        desc: "اكتشف هويتك كمطوّر في عالم DEVELOPER.exe. ستة أسئلة، ست شخصيات، وبطاقة هوية جاهزة للمشاركة.",
        skip: "انتقل إلى الاختبار",
        online: "النظام يعمل", langBtn: "English",
        heroEyebrow: "تجربة مجتمع GDG أسيوط / 001",
        hero: "كودك.<br><em>هويتك.</em>",
        intro: "كل مطوّر لديه شخصية مخفية. ابدأ الفحص، اكتشف قدراتك، وابحث عن مكانك في عالم المطورين.",
        start: "ابدأ الفحص ↗", explore: "اكتشف عالم المطورين ↓",
        meta: "٠٦ شخصيات للمطورين · حوالي ٦٠ ثانية",
        challenge: "صديقك اكتشف {glyph} {name}. فما هي شخصيتك؟",
        quizEyebrow: "بروتوكول الفحص / تحليل الشخصية",
        quizTitle: "هيا نقرأ <em>حمضك النووي.</em>",
        counter: "السؤال {n} / {t}",
        back: "رجوع →", hint: "نصيحة: اضغط من 1 إلى 6 على لوحة المفاتيح",
        boot: ["> قراءة إجاباتك ........ تم", "> فك شفرة الحمض النووي للمطوّر ........ تم", "> تم العثور على شخصيتك. جارٍ إنشاء البطاقة ..."],
        resEyebrow: "اكتمل الفحص / تم فك الهوية",
        resTitle: "تم كشف <em>هويتك.</em>",
        cardBrand: "DEVELOPER.exe · GDG ASSIUT", cardLabel: "شخصيتك كمطوّر",
        lvl: "المستوى", power: "القوة الخاصة", weakness: "نقطة الضعف",
        dna: "مصفوفة الحمض النووي", second: "الشخصية الثانوية", mate: "أفضل زميل فريق",
        mateHint: "ابحث عن شخص بهذه الشخصية في الفعالية وابنيا شيئاً معاً.",
        share: "شارك هويتك ↗", linkedin: "انشر على LinkedIn ↗", download: "حمّل البطاقة ↓", again: "↻ فحص جديد",
        shareText: "اكتشفت هويتي كمطوّر على DEVELOPER.exe: {name}. ما هي شخصيتك؟",
        copied: "تم نسخ الرابط — الصقه في أي مكان!", saved: "تم حفظ البطاقة!", cancelled: "تم إلغاء المشاركة.", preparing: "جارٍ تجهيز بطاقتك…",
        multiEyebrow: "بيانات المجتمع / الجلسة المحلية",
        multiTitle: "عالم <em>المطورين.</em>",
        multiIntro: "لكل شخصية مكانها. استكشف الهويات التي تم اكتشافها على هذا الجهاز.",
        scans: "عمليات الفحص", onDevice: "على هذا الجهاز", topClass: "الأكثر ظهوراً", mostCommon: "الأكثر شيوعاً",
        unlockedLbl: "الشخصيات المكتشفة", uniqueClasses: "شخصيات مختلفة",
        privacy: "ⓘ الأعداد محفوظة في متصفحك فقط، ولا تُشارَك ولا تُرسَل إلى أي خادم.",
        reset: "مسح البيانات المحلية", resetConfirm: "هل تريد مسح كل أعداد الفحص المحفوظة على هذا الجهاز؟",
        closingTag: "[ رسالة النظام ]", closingTitle: "عالم المطورين يحتاج <em>إلى كودك.</em>",
        closingText: "تعرّف على الناس. تبادل الأفكار. ابنِ شيئاً ذا قيمة.", backTop: "العودة للأعلى ↑",
        footerMade: "صُنع للمجتمع، بشغف وفضول.",
        cardTeammate: "أفضل زميل فريق"
      },
      profiles: {
        bughunter:   { name: "صائد الأخطاء", tag: "أرى ما يغفل عنه الآخرون.", code: "المُصحِّح", power: "اكتشاف المشاكل الخفية", weak: "إصلاح سريع آخر فقط", headline: "ترى الإشارة وسط الضجيج.", desc: "فضولي، تختبر الافتراضات، وتحفر حتى يصبح النظام مفهوماً.", traits: ["فضولي", "دقيق", "مثابر"] },
        architect:   { name: "المعماري", tag: "أبني الصورة الكبيرة.", code: "مصمّم الأنظمة", power: "تحويل التعقيد إلى بنية واضحة", weak: "الإفراط في التفكير بالمخطط", headline: "تفكّر بمنطق الأنظمة.", desc: "تربط الأفكار، وتخطط للتوسع، وتبني أساسات تدوم.", traits: ["استراتيجي", "منظّم", "صاحب رؤية"] },
        creator:     { name: "المبدع", tag: "أحوّل الأفكار إلى تجارب.", code: "صانع الواجهات", power: "جعل التقنية أقرب للإنسان", weak: "هوس الكمال في أدق التفاصيل", headline: "تجعل الأفكار مرئية.", desc: "تمزج الفضول بالإبداع لتصنع منتجات يحبها الناس.", traits: ["مبدع", "متعاطف", "جريء"] },
        speedrunner: { name: "العدّاء السريع", tag: "أطلق، تعلّم، كرّر.", code: "البنّاء السريع", power: "الانتقال من الفكرة إلى نموذج أولي بسرعة", weak: "تخطّي التوثيق", headline: "الزخم هو قوتك الخارقة.", desc: "تتعلم بالبناء، وتكرر بسرعة، وتحوّل العوائق إلى زخم.", traits: ["سريع", "مرن", "عملي"] },
        guardian:    { name: "الحارس", tag: "أحافظ على متانة النظام.", code: "عقلية أمنية", power: "التفكير المسبق في المخاطر", weak: "عدم الثقة بأي شيء إطلاقاً", headline: "تحمي ما يهم.", desc: "تقدّر الموثوقية والأمان والتفاصيل التي تجعل المنتجات يُعتمد عليها.", traits: ["حذر", "موثوق", "تحليلي"] },
        researcher:  { name: "الباحث", tag: "«لماذا؟» سؤالي المفضل.", code: "الغوّاص العميق", power: "اكتشاف الأنماط وإجابات جديدة", weak: "السقوط في دوامة بحث أخرى", headline: "تلاحق الأسئلة أبعد من غيرك.", desc: "تستكشف المجهول، وتتعمق في التعلم، وتحوّل الأدلة إلى فهم.", traits: ["فضولي", "صبور", "تحليلي"] }
      },
      questions: [
        { q: "عندما ينكسر الكود قبل العرض التجريبي، أنت…", a: ["تتتبع الخطأ حتى تصل إلى السبب الجذري", "تعيد تصميم المسار حتى لا يتكرر", "تجد حلاً ذكياً وتصقل التجربة", "تصلحه بسرعة وتكمل العرض", "تفحص ما قد يفشل بعده وتؤمّنه", "تبحث لماذا حدث ذلك أصلاً"] },
        { q: "الجزء الأحب إليك في أي مشروع…", a: ["جعل الأخطاء المعقدة تختفي", "تصميم البنية المعمارية", "صنع تجربة جميلة", "إطلاق نموذج أولي يعمل", "جعله مستقراً وآمناً", "تعلّم شيء لا يعرفه أحد بعد"] },
        { q: "تقنية جديدة لفتت انتباهك. أنت…", a: ["تختبر حالاتها الحدّية", "ترى كيف تندمج في نظام أكبر", "تتخيل ما يمكن للناس صنعه بها", "تبني تجربة سريعة", "تقرأ ملاحظاتها الأمنية", "تدرس كيف تعمل من الداخل"] },
        { q: "في الفريق، غالباً أنت من…", a: ["يجد المشكلة التي فاتت الجميع", "يربط كل الأجزاء المتحركة", "يجعل المنتج يبدو صحيحاً", "يساعد الجميع على تجاوز العقبات", "يراجع الجودة والمخاطر", "يطرح السؤال الذي يغيّر الاتجاه"] },
        { q: "قوتك الخارقة المثالية…", a: ["رؤية كل خطأ فوراً", "فهم أي نظام", "تحويل الخيال إلى واقع", "البناء بسرعة مذهلة", "منع كل فشل", "فهم أي تقنية بعمق"] },
        { q: "اختر العبارة الأقرب إليك…", a: ["هناك دائماً دليل", "فكّر قبل أن تبني", "اجعله ذا معنى", "المنجز أفضل من المثالي", "ثق، لكن تحقق", "ابقَ فضولياً دائماً"] }
      ]
    }
  };

  /* ---------- state ---------- */
  let lang = store.get("devexe_lang") || ((navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en");
  if (!I18N[lang]) lang = "en";
  const state = { step: 0, order: [], answers: [], result: null, locked: false, booting: false };

  const ui = () => I18N[lang].ui;
  const prof = id => I18N[lang].profiles[id];
  const shortName = name => lang === "en" ? name.replace(/^THE /, "") : name;
  const baseUrl = () => location.protocol.startsWith("http") ? location.origin + location.pathname : SITE_URL;

  /* ---------- language ---------- */
  function applyLang() {
    const t = ui();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $$("[data-i]").forEach(el => { if (t[el.dataset.i] !== undefined) el.innerHTML = t[el.dataset.i]; });
    $("#lang").textContent = t.langBtn;
    document.title = t.title;
    const md = $('meta[name="description"]'); if (md) md.content = t.desc;
    store.set("devexe_lang", lang);
    renderChallenge();
    if (!$("#quiz").classList.contains("hidden") && !state.booting) renderQuestion();
    renderResult();
    updateStats();
  }
  $("#lang").addEventListener("click", () => { lang = lang === "en" ? "ar" : "en"; applyLang(); });

  /* ---------- challenge banner (?c=architect) ---------- */
  function renderChallenge() {
    const el = $("#challenge");
    const id = new URLSearchParams(location.search).get("c");
    const p = id && byId(id);
    if (!p) { el.classList.add("hidden"); return; }
    el.textContent = ui().challenge.replace("{glyph}", p.glyph).replace("{name}", prof(id).name);
    el.style.setProperty("--accent", p.color);
    el.classList.remove("hidden");
  }

  /* ---------- views ---------- */
  function show(id) {
    ["quiz", "result"].forEach(x => $("#" + x).classList.add("hidden"));
    if (id) $("#" + id).classList.remove("hidden");
  }
  function scrollToEl(el) { el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }

  /* ---------- quiz ---------- */
  function startQuiz() {
    state.step = 0;
    state.answers = [];
    state.result = null;
    state.locked = false;
    state.booting = false;
    state.order = Array.from({ length: TOTAL }, () => shuffle([0, 1, 2, 3, 4, 5]));
    $("#boot").classList.add("hidden");
    $("#quizUi").classList.remove("hidden");
    show("quiz");
    $("#quiz").classList.add("in");
    renderQuestion();
    scrollToEl($("#quiz"));
  }

  function renderQuestion() {
    const t = ui(), q = I18N[lang].questions[state.step];
    $("#question").textContent = q.q;
    $("#counter").textContent = t.counter.replace("{n}", pad(state.step + 1)).replace("{t}", pad(TOTAL));
    $("#progress").style.width = ((state.step + 1) / TOTAL * 100) + "%";
    $("#progress").parentElement.setAttribute("aria-valuenow", state.step + 1);
    const box = $("#answers");
    box.replaceChildren();
    state.order[state.step].forEach((idx, pos) => {
      const b = document.createElement("button");
      b.type = "button";
      if (state.answers[state.step] === idx) b.className = "picked";
      const k = document.createElement("kbd"); k.textContent = pos + 1;
      const s = document.createElement("span"); s.textContent = q.a[idx];
      b.append(k, s);
      b.addEventListener("click", () => choose(idx, b));
      box.append(b);
    });
    $("#back").disabled = state.step === 0;
  }

  async function choose(idx, btn) {
    if (state.locked) return;
    state.locked = true;
    state.answers[state.step] = idx;
    if (btn) btn.classList.add("picked");
    await sleep(reduceMotion ? 0 : 170);
    if (state.step < TOTAL - 1) {
      state.step++;
      state.locked = false;
      renderQuestion();
      $("#question").focus({ preventScroll: true });
    } else {
      await finish();
    }
  }

  function goBack() {
    if (state.step > 0 && !state.locked && !state.booting) { state.step--; renderQuestion(); }
  }

  function computeResult() {
    const counts = Array(PROFILES.length).fill(0);
    state.answers.forEach(a => counts[a]++);
    const max = Math.max(...counts);
    // tie-break: whichever tied class the user picked most recently
    let primaryIdx = 0;
    for (let i = state.answers.length - 1; i >= 0; i--) {
      if (counts[state.answers[i]] === max) { primaryIdx = state.answers[i]; break; }
    }
    const second = counts
      .map((c, i) => ({ c, i, last: state.answers.lastIndexOf(i) }))
      .filter(x => x.i !== primaryIdx && x.c > 0)
      .sort((a, b) => b.c - a.c || b.last - a.last)[0];
    return {
      primary: PROFILES[primaryIdx],
      secondary: second ? PROFILES[second.i] : null,
      counts,
      code: "DEV-" + Math.random().toString(36).slice(2, 7).toUpperCase()
    };
  }

  async function finish() {
    state.result = computeResult();
    const id = state.result.primary.id;
    store.set("devexe_" + id, String(+(store.get("devexe_" + id) || 0) + 1));
    store.set("devexe_total", String(+(store.get("devexe_total") || 0) + 1));

    // boot sequence
    state.booting = true;
    $("#quizUi").classList.add("hidden");
    const boot = $("#boot");
    boot.classList.remove("hidden");
    boot.textContent = "";
    for (const line of ui().boot) {
      boot.append(line + "\n");
      await sleep(reduceMotion ? 0 : 520);
    }
    await sleep(reduceMotion ? 0 : 350);

    state.booting = false;
    state.locked = false;
    show("result");
    renderResult(true);
    updateStats();
    scrollToEl($("#result"));
  }

  /* ---------- result ---------- */
  let typeToken = 0;
  async function typeInto(el, text) {
    const token = ++typeToken;
    if (reduceMotion) { el.textContent = text; return; }
    el.textContent = "";
    for (const ch of text) {
      if (token !== typeToken) return;
      el.textContent += ch;
      await sleep(28);
    }
  }

  function renderResult(fresh = false) {
    const r = state.result;
    if (!r) return;
    const t = ui(), p = prof(r.primary.id);

    $("#result").style.setProperty("--accent", r.primary.color);
    $("#glyph").textContent = r.primary.glyph;
    $("#tagline").textContent = p.tag;
    $("#code").textContent = p.code;
    $("#level").textContent = r.primary.level;
    $("#power").textContent = p.power;
    $("#weakness").textContent = p.weak;
    $("#headline").textContent = p.headline;
    $("#description").textContent = p.desc;
    $("#identity").textContent = "IDENTITY ID: " + r.code;

    if (fresh) typeInto($("#className"), p.name); else { typeToken++; $("#className").textContent = p.name; }

    const traits = $("#traits"); traits.replaceChildren();
    p.traits.forEach(x => { const li = document.createElement("li"); li.textContent = x; traits.append(li); });

    const sb = $("#secondBox");
    if (r.secondary) { $("#secondName").textContent = prof(r.secondary.id).name; sb.classList.remove("hidden"); }
    else sb.classList.add("hidden");
    $("#mateName").textContent = prof(r.primary.mate).name;
    $("#mateBox").style.setProperty("--accent", byId(r.primary.mate).color);

    // DNA bars (derived from the user's own answers)
    const dna = $("#dnaBars"); dna.replaceChildren();
    const rows = PROFILES.map((pr, i) => ({ pr, c: r.counts[i] })).filter(x => x.c > 0).sort((a, b) => b.c - a.c);
    rows.forEach(({ pr, c }) => {
      const pct = Math.round(c / TOTAL * 100);
      const row = document.createElement("div"); row.className = "dna-row";
      row.style.setProperty("--rowc", pr.color);
      const n = document.createElement("span"); n.textContent = shortName(prof(pr.id).name);
      const v = document.createElement("b"); v.textContent = pct + "%";
      const bar = document.createElement("div"); bar.className = "bar";
      const fill = document.createElement("i"); bar.append(fill);
      row.append(n, v, bar); dna.append(row);
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = pct + "%"; }));
    });
    requestAnimationFrame(() => requestAnimationFrame(() => { $("#lvlbar").style.width = r.primary.level + "%"; }));

    const card = $("#idcard");
    if (fresh) { card.classList.remove("fresh"); void card.offsetWidth; card.classList.add("fresh"); }
    $("#status").textContent = "";
  }

  /* ---------- stats (local only) ---------- */
  function updateStats() {
    const counts = PROFILES.map(p => +(store.get("devexe_" + p.id) || 0));
    const total = counts.reduce((a, b) => a + b, 0);
    const top = Math.max(...counts);
    $("#total").textContent = pad(total);
    $("#top").textContent = top ? shortName(prof(PROFILES[counts.indexOf(top)].id).name) : "—";
    $("#unlocked").textContent = counts.filter(x => x > 0).length + "/" + PROFILES.length;
    const box = $("#distribution"); box.replaceChildren();
    PROFILES.forEach((p, i) => {
      const row = document.createElement("div"); row.className = "dist-row";
      row.style.setProperty("--rowc", p.color);
      const n = document.createElement("span"); n.textContent = p.glyph + "  " + prof(p.id).name;
      const c = document.createElement("b"); c.textContent = counts[i];
      const bar = document.createElement("div"); bar.className = "bar";
      const fill = document.createElement("i"); fill.style.width = (total ? counts[i] / total * 100 : 0) + "%";
      bar.append(fill); row.append(n, c, bar); box.append(row);
    });
  }

  $("#reset").addEventListener("click", () => {
    if (!confirm(ui().resetConfirm)) return;
    PROFILES.forEach(p => store.del("devexe_" + p.id));
    store.del("devexe_total");
    updateStats();
  });

  /* ---------- ID card image (canvas) ---------- */
  async function loadFonts(isAr) {
    if (!document.fonts || !document.fonts.load) return;
    const specs = isAr
      ? ['700 40px "IBM Plex Sans Arabic"', '400 28px "IBM Plex Sans Arabic"']
      : ['700 40px "IBM Plex Mono"', '400 28px "IBM Plex Mono"'];
    try {
      await Promise.race([
        Promise.all(specs.map(s => document.fonts.load(s, isAr ? "أبجد" : "Aa"))),
        sleep(1500)
      ]);
    } catch { /* fall back to system fonts */ }
  }

  function wrap(ctx, text, x, y, maxW, lh) {
    const words = text.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; }
      else line = test;
    }
    if (line) { ctx.fillText(line, x, y); y += lh; }
    return y;
  }

  async function drawCard() {
    const r = state.result, t = ui(), p = prof(r.primary.id);
    const isAr = lang === "ar";
    await loadFonts(isAr);
    const W = 1080, H = 1350, M = 84, accent = r.primary.color;
    const FONT = isAr ? '"IBM Plex Sans Arabic","Segoe UI",Tahoma,sans-serif' : '"IBM Plex Mono",ui-monospace,Menlo,Consolas,monospace';
    const GLYPH = '"IBM Plex Mono","DejaVu Sans","Segoe UI Symbol","Apple Symbols",sans-serif';
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d");
    const ax = isAr ? W - M : M;
    const align = isAr ? "right" : "left";
    x.direction = isAr ? "rtl" : "ltr";
    x.textAlign = align;
    x.textBaseline = "alphabetic";

    // background + glow + grid
    x.fillStyle = "#070b09"; x.fillRect(0, 0, W, H);
    const g = x.createRadialGradient(W - 120, 160, 20, W - 120, 160, 900);
    g.addColorStop(0, accent + "55"); g.addColorStop(1, "#070b0900");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(255,255,255,0.04)"; x.lineWidth = 1;
    for (let i = 0; i <= W; i += 54) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
    for (let i = 0; i <= H; i += 54) { x.beginPath(); x.moveTo(0, i); x.lineTo(W, i); x.stroke(); }

    // frame + corner ticks
    x.strokeStyle = accent; x.lineWidth = 3; x.strokeRect(36, 36, W - 72, H - 72);
    x.lineWidth = 8;
    [[36, 36, 1, 1], [W - 36, 36, -1, 1], [36, H - 36, 1, -1], [W - 36, H - 36, -1, -1]].forEach(([cx, cy, dx, dy]) => {
      x.beginPath(); x.moveTo(cx, cy + dy * 46); x.lineTo(cx, cy); x.lineTo(cx + dx * 46, cy); x.stroke();
    });

    // header
    x.fillStyle = accent; x.font = "600 28px " + FONT;
    x.direction = "ltr"; // brand is Latin-only; keep its word order in Arabic cards too
    x.fillText(t.cardBrand, ax, 118);
    x.direction = isAr ? "rtl" : "ltr";
    x.fillStyle = "#8b9b90"; x.font = "400 24px " + FONT;
    x.fillText(t.cardLabel, ax, 200);

    // glyph
    x.save();
    x.shadowColor = accent; x.shadowBlur = 50; x.fillStyle = accent;
    x.font = "400 190px " + GLYPH;
    x.fillText(r.primary.glyph, ax, 400);
    x.restore();

    // class name (auto-fit)
    let size = 84;
    x.fillStyle = "#e8f4eb";
    do { x.font = "700 " + size + "px " + FONT; size -= 2; } while (x.measureText(p.name).width > W - 2 * M && size > 30);
    x.fillText(p.name, ax, 505);

    x.fillStyle = "#b9cbbe"; x.font = "400 30px " + FONT;
    let y = wrap(x, p.tag, ax, 564, W - 2 * M, 42);

    x.fillStyle = accent; x.font = "600 28px " + FONT;
    y += 14;
    x.fillText(t.lvl + " " + r.primary.level + "  ·  " + p.code, ax, y);
    y += 20;
    x.fillStyle = "rgba(255,255,255,0.1)"; x.fillRect(M, y, W - 2 * M, 8);
    x.fillStyle = accent; x.fillRect(isAr ? W - M - (W - 2 * M) * r.primary.level / 100 : M, y, (W - 2 * M) * r.primary.level / 100, 8);

    // DNA bars
    y += 64;
    x.fillStyle = "#8b9b90"; x.font = "400 22px " + FONT;
    x.fillText(t.dna, ax, y);
    const rows = PROFILES.map((pr, i) => ({ pr, c: r.counts[i] })).filter(v => v.c > 0).sort((a, b) => b.c - a.c).slice(0, 3);
    rows.forEach(({ pr, c }) => {
      y += 48;
      const pct = Math.round(c / TOTAL * 100);
      x.fillStyle = "#e8f4eb"; x.font = "500 26px " + FONT;
      x.fillText(shortName(prof(pr.id).name), ax, y);
      x.textAlign = isAr ? "left" : "right";
      x.fillStyle = pr.color;
      x.fillText(pct + "%", isAr ? M : W - M, y);
      x.textAlign = align;
      y += 14;
      x.fillStyle = "rgba(255,255,255,0.1)"; x.fillRect(M, y, W - 2 * M, 10);
      const bw = (W - 2 * M) * pct / 100;
      x.fillStyle = pr.color; x.fillRect(isAr ? W - M - bw : M, y, bw, 10);
      y += 6;
    });

    // power / weakness
    y += 56;
    x.strokeStyle = "rgba(255,255,255,0.14)"; x.lineWidth = 2;
    x.beginPath(); x.moveTo(M, y - 30); x.lineTo(W - M, y - 30); x.stroke();
    x.fillStyle = "#8b9b90"; x.font = "400 22px " + FONT; x.fillText(t.power, ax, y);
    x.fillStyle = "#e8f4eb"; x.font = "600 30px " + FONT;
    y = wrap(x, p.power, ax, y + 42, W - 2 * M, 40);
    y += 12;
    x.fillStyle = "#8b9b90"; x.font = "400 22px " + FONT; x.fillText(t.weakness, ax, y);
    x.fillStyle = "#e8f4eb"; x.font = "600 30px " + FONT;
    y = wrap(x, p.weak, ax, y + 42, W - 2 * M, 40);

    // teammate
    y += 10;
    x.fillStyle = "#8b9b90"; x.font = "400 22px " + FONT; x.fillText(t.cardTeammate, ax, y);
    x.fillStyle = byId(r.primary.mate).color; x.font = "700 30px " + FONT;
    x.fillText(prof(r.primary.mate).name, ax, y + 42);

    // footer
    x.fillStyle = "#6f8576"; x.font = "400 22px " + FONT;
    x.fillText("IDENTITY ID: " + r.code, ax, H - 100);
    x.fillStyle = accent; x.font = "600 24px " + FONT;
    x.direction = "ltr"; x.textAlign = isAr ? "right" : "left";
    x.fillText(baseUrl().replace(/^https?:\/\//, "").replace(/\/$/, ""), ax, H - 62);
    return c;
  }

  const toBlob = c => new Promise(res => c.toBlob(res, "image/png"));
  function flash(msg) {
    const el = $("#status"); el.textContent = msg;
    clearTimeout(flash.t); flash.t = setTimeout(() => { el.textContent = ""; }, 4000);
  }

  $("#download").addEventListener("click", async () => {
    if (!state.result) return;
    flash(ui().preparing);
    const blob = await toBlob(await drawCard());
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "developer-identity-" + state.result.primary.id + ".png";
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    flash(ui().saved);
  });

  $("#share").addEventListener("click", async () => {
    if (!state.result) return;
    const id = state.result.primary.id;
    const url = baseUrl() + "?c=" + id;
    const text = ui().shareText.replace("{name}", prof(id).name);
    try {
      // Best case on phones: share the card image itself.
      if (navigator.canShare && navigator.share) {
        const blob = await toBlob(await drawCard());
        const file = new File([blob], "developer-identity.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: "DEVELOPER.exe", text: text + " " + url });
          return;
        }
      }
      if (navigator.share) { await navigator.share({ title: "DEVELOPER.exe", text, url }); return; }
      await navigator.clipboard.writeText(text + " " + url);
      flash(ui().copied);
    } catch (e) {
      if (e && e.name === "AbortError") flash(ui().cancelled);
      else { try { await navigator.clipboard.writeText(text + " " + url); flash(ui().copied); } catch { flash(url); } }
    }
  });

  // LinkedIn: prepare a professional bilingual post, download the identity card,
  // copy the post text, then open LinkedIn's official share dialog.
  $("#linkedin").addEventListener("click", async () => {
    if (!state.result) return;
    const popup = window.open("about:blank", "_blank");
    const id = state.result.primary.id;
    const profile = prof(id);
    const url = baseUrl() + "?c=" + encodeURIComponent(id);
    const post = lang === "ar"
      ? `يسعدني مشاركة هويتي كمطوّر بعد تجربة DEVELOPER.exe من مجتمع GDG Assiut! 🚀

شخصيتي البرمجية: ${profile.name}
${profile.desc}

كل مطوّر لديه طريقة مختلفة في التفكير والتعلّم وبناء الحلول، ومتحمس للتواصل مع مجتمع المطورين في أسيوط وتبادل الخبرات والعمل على أفكار ومشاريع جديدة.

اكتشف شخصيتك وشارك بطاقتك:
${url}

شكرًا لمجتمع @GDG Assiut على خلق مساحة تجمع المطورين وتدعم التعلّم والمشاركة.

#GDGAssiut #DEVELOPERexe #Developers #TechCommunity #Assiut`
      : `Excited to share my developer identity after taking DEVELOPER.exe by the GDG Assiut community! 🚀

My developer class: ${profile.name}
${profile.desc}

Every developer has a unique way of thinking, learning, and building. I'm looking forward to connecting with fellow developers in Assiut, exchanging knowledge, and building meaningful projects together.

Discover your identity:
${url}

Big thanks to @GDG Assiut for bringing the local tech community together and creating space for learning and collaboration.

#GDGAssiut #DEVELOPERexe #Developers #TechCommunity #Assiut`;
    try {
      flash(lang === "ar" ? "جارٍ تجهيز البطاقة ونسخ البوست…" : "Preparing your card and copying the post…");
      const blob = await toBlob(await drawCard());
      if (!blob) throw new Error("Could not render card");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "developer-identity-" + id + ".png";
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      await navigator.clipboard.writeText(post);
      const shareUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
      if (popup) popup.location.href = shareUrl;
      else window.location.href = shareUrl;
      flash(lang === "ar"
        ? "تم نسخ البوست وتنزيل البطاقة. الصق البوست وأرفق صورة البطاقة في LinkedIn."
        : "Post copied and card downloaded. Paste the post and attach your card image on LinkedIn.");
    } catch (err) {
      if (popup) popup.close();
      flash(lang === "ar"
        ? "تعذّر النسخ تلقائيًا. استخدم زر تحميل البطاقة ثم شاركها يدويًا."
        : "Clipboard access failed. Download the card and share it manually.");
    }
  });

  /* ---------- wiring ---------- */
  $("#start").addEventListener("click", startQuiz);
  $("#again").addEventListener("click", startQuiz);
  $("#back").addEventListener("click", goBack);

  document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if ($("#quiz").classList.contains("hidden") || state.booting) return;
    if (/^[1-6]$/.test(e.key)) {
      const b = $$("#answers button")[+e.key - 1];
      if (b) b.click();
    } else if (e.key === "Backspace" || e.key === "ArrowLeft" && lang === "en" || e.key === "ArrowRight" && lang === "ar") {
      if (e.key === "Backspace") e.preventDefault();
      goBack();
    }
  });

  /* ---------- 3D tilt on the ID card ---------- */
  (function tilt() {
    if (reduceMotion || !matchMedia("(hover: hover)").matches) return;
    const card = $("#idcard");
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = "perspective(900px) rotateY(" + (px * 9) + "deg) rotateX(" + (-py * 9) + "deg)";
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  })();

  /* ---------- reveal on scroll ---------- */
  (function reveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
    items.forEach(i => io.observe(i));
  })();

  /* ---------- matrix rain background ---------- */
  (function rain() {
    if (reduceMotion) return;
    const c = $("#rain"), g = c.getContext("2d");
    const chars = "01{}<>/;=+*#$%&";
    const fs = 16;
    let cols, drops, last = 0, rafId = 0;
    function resize() {
      c.width = innerWidth; c.height = innerHeight;
      cols = Math.ceil(c.width / fs);
      drops = Array.from({ length: cols }, () => Math.random() * -40);
      g.fillStyle = "#070b09"; g.fillRect(0, 0, c.width, c.height);
    }
    function frame(ts) {
      rafId = requestAnimationFrame(frame);
      if (ts - last < 70) return;
      last = ts;
      g.fillStyle = "rgba(7,11,9,0.12)"; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = "#22c55e"; g.font = fs + "px monospace";
      for (let i = 0; i < cols; i++) {
        g.fillText(chars[(Math.random() * chars.length) | 0], i * fs, drops[i] * fs);
        if (drops[i] * fs > c.height && Math.random() > .975) drops[i] = 0;
        drops[i]++;
      }
    }
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(rafId); else rafId = requestAnimationFrame(frame);
    });
    resize(); rafId = requestAnimationFrame(frame);
  })();

  /* ---------- go ---------- */
  applyLang();
  console.log("%c>_ DEVELOPER.exe", "color:#22c55e;font:700 20px monospace");
  console.log("%cYou're reading the source — respect. Come build with GDG Assiut.", "color:#8b9b90;font:12px monospace");
})();
