(() => {
  const questions = [
    {
      id: "effect", kicker: "Desired identity effect",
      title: "When you feel most like yourself, what do you want your presence to communicate first?",
      note: "Choose up to two.", max: 2,
      options: ["Clarity","Warmth","Authority","Ease","Individuality","Beauty","Intelligence","Sensuality","Restraint","Energy","Mystery","Playfulness"]
    },
    {
      id: "aversion", kicker: "Rejection signal",
      title: "What most often makes something feel wrong for you—even when you can see why someone else likes it?",
      note: "Choose up to two.", max: 2,
      options: ["Too polished","Too casual","Too sweet","Too severe","Too trendy","Too traditional","Too minimal","Too busy","Too obvious","Too performative","Too safe","Too impractical"]
    },
    {
      id: "tension", kicker: "Productive tension",
      title: "Which combination feels most compelling to you?",
      note: "Choose one.", max: 1,
      options: ["Refined + unexpected","Soft + structured","Familiar + unusual","Restrained + sensual","Intellectual + playful","Practical + beautiful","Romantic + grounded","Strong + approachable","Minimal + distinctive","I don't know yet"]
    },
    {
      id: "mismatch", kicker: "Current mismatch",
      title: "Where do you currently feel the biggest gap between who you are and what your life communicates?",
      note: "Choose one.", max: 1,
      options: ["Clothes / personal style","Beauty / grooming","Home / surroundings","Public presence / communication","Daily life / rituals","Several of these","I’m not sure—I just know something feels off"]
    },
    {
      id: "decision", kicker: "Decision test",
      title: "When choosing between two things you genuinely like, what usually wins?",
      note: "Choose one.", max: 1,
      options: ["The one that feels more like me","The one I’ll actually use","The one with better quality","The more distinctive one","The more timeless one","The more beautiful one","The one that makes life easier","I usually struggle to choose"]
    }
  ];

  const answers = {};
  let current = 0;
  let currentResult = null;

  const $ = (id) => document.getElementById(id);
  const screens = [$("screen-intro"), $("screen-quiz"), $("screen-result")];
  const show = (el) => {
    screens.forEach(s => s.classList.toggle("is-active", s === el));
    window.scrollTo({top:0, behavior:"auto"});
    $("main").focus({preventScroll:true});
  };

  function renderQuestion() {
    const q = questions[current];
    $("progress-text").textContent = `${current+1} of ${questions.length}`;
    $("progress-fill").style.width = `${((current+1)/questions.length)*100}%`;
    $("progress-track").setAttribute("aria-valuenow", String(current+1));
    const selected = answers[q.id] || [];
    $("question-wrap").innerHTML = `
      <div class="question-kicker">${q.kicker}</div>
      <h1 id="question-title" class="question-title" tabindex="-1">${q.title}</h1>
      <p class="question-note">${q.note}</p>
      <div class="options" role="group" aria-labelledby="question-title">
        ${q.options.map((opt,i)=>`<button class="option" type="button" data-value="${escapeAttr(opt)}" aria-pressed="${selected.includes(opt)}"><span>${opt}</span><span class="option-mark" aria-hidden="true"></span></button>`).join("")}
      </div>`;
    $("back-btn").style.visibility = current === 0 ? "hidden" : "visible";
    $("next-btn").textContent = current === questions.length-1 ? "Show my signal" : "Continue";
    updateNextState();
    $("question-help").textContent = "";
    $("question-wrap").querySelectorAll(".option").forEach(btn => btn.addEventListener("click", () => toggleOption(q, btn)));
    $("question-title").focus({preventScroll:true});
  }

  function escapeAttr(s){return s.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}

  function toggleOption(q, btn) {
    const value = btn.dataset.value;
    let selected = answers[q.id] ? [...answers[q.id]] : [];
    const idx = selected.indexOf(value);
    if (idx >= 0) selected.splice(idx,1);
    else if (selected.length < q.max) selected.push(value);
    else if (q.max === 1) selected = [value];
    else { $("question-help").textContent = `Choose up to ${q.max}. Remove one before adding another.`; return; }
    answers[q.id] = selected;
    renderQuestionPreserveFocus(value);
  }

  function renderQuestionPreserveFocus(value){
    const q=questions[current];
    const selected=answers[q.id]||[];
    $("question-wrap").querySelectorAll(".option").forEach(btn=>btn.setAttribute("aria-pressed", String(selected.includes(btn.dataset.value))));
    updateNextState();
    $("question-help").textContent = "";
    const match=[...$("question-wrap").querySelectorAll(".option")].find(b=>b.dataset.value===value); if(match) match.focus();
  }

  function updateNextState(){const q=questions[current]; $("next-btn").disabled = !(answers[q.id] && answers[q.id].length);}

  function renderResult() {
    currentResult = window.IdentitySignalEngine.infer(answers);
    $("result-heading").textContent = currentResult.name;
    $("strength-label").textContent = `${currentResult.strength} signal`;
    $("strength-copy").textContent = currentResult.strengthCopy;
    $("evidence-list").innerHTML = currentResult.evidence.map(e=>`<li>${e}</li>`).join("");
    $("principle-copy").textContent = currentResult.principle;
    $("focus-label").textContent = currentResult.focus === "Cross-domain" ? "Cross-domain first move" : currentResult.focus;
    $("focus-copy").textContent = currentResult.focusMove;
    $("translation-copy").innerHTML = `<div class="translation-pair">${currentResult.translations.map(x=>{const [label,copy]=x.split("|"); return `<div><strong>${label}</strong><span>${copy}</span></div>`}).join("")}</div>`;
    const body = `Identity Signal — ${currentResult.name}\n\nSignal strength: ${currentResult.strength}\n\nPrinciple: ${currentResult.principle}\n\nWhy: ${currentResult.evidence.join(" ")}\n\nThis is a signal, not a complete identity profile.`;
    $("email-result").href = `mailto:?subject=${encodeURIComponent("My Identity Signal: "+currentResult.name)}&body=${encodeURIComponent(body)}`;
    resetFeedbackUI();
    show($("screen-result"));
    $("result-heading").focus({preventScroll:true});
  }

  function resetFeedbackUI(){
    document.querySelectorAll("[data-feedback]").forEach(b=>b.setAttribute("aria-pressed","false"));
    $("correction-detail").hidden=true; $("feedback-status").textContent="";
    $("correction-options").innerHTML=""; $("save-status").textContent="";
  }

  $("start-btn").addEventListener("click",()=>{show($("screen-quiz"));renderQuestion();});
  $("back-btn").addEventListener("click",()=>{if(current>0){current--;renderQuestion();}});
  $("next-btn").addEventListener("click",()=>{if(current<questions.length-1){current++;renderQuestion();}else renderResult();});
  $("restart-btn").addEventListener("click",()=>{Object.keys(answers).forEach(k=>delete answers[k]);current=0;currentResult=null;show($("screen-intro"));$("start-btn").focus();});

  document.querySelectorAll("[data-feedback]").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll("[data-feedback]").forEach(b=>b.setAttribute("aria-pressed", b===btn ? "true":"false"));
    const f=btn.dataset.feedback;
    if(f==="yes"){$("correction-detail").hidden=true;$("feedback-status").textContent="Noted. This feedback stays in this session unless you choose to save the result.";return;}
    $("correction-detail").hidden=false;
    const opts=["Too strong","Too soft","Too generic","Too polished","Too expressive","Missed an important contradiction","Something else"];
    $("correction-options").innerHTML=opts.map(o=>`<button type="button" aria-pressed="false">${o}</button>`).join("");
    $("correction-options").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{b.setAttribute("aria-pressed", b.getAttribute("aria-pressed")!=="true" ? "true":"false");$("feedback-status").textContent="Correction noted for this session. We do not silently rewrite your result as though the first inference were certain.";}));
  }));

  $("save-device").addEventListener("click",()=>{
    if(!currentResult)return;
    const visibleResult={
      name:currentResult.name, strength:currentResult.strength, strengthCopy:currentResult.strengthCopy,
      principle:currentResult.principle, evidence:currentResult.evidence, focus:currentResult.focus,
      focusMove:currentResult.focusMove, translations:currentResult.translations
    };
    try {
      localStorage.setItem("identitySignalV1",JSON.stringify({savedAt:new Date().toISOString(),result:visibleResult}));
      $("save-status").textContent="Saved on this device only. Raw answers and internal reasoning were not saved or sent to a server.";
    } catch {
      $("save-status").textContent="This browser did not allow local saving. Nothing was sent anywhere.";
    }
  });
  $("decline-save").addEventListener("click",()=>{$("save-status").textContent="Nothing saved. Your free result remains available on this page for this session.";});
  $("delete-save").addEventListener("click",()=>{
    try { localStorage.removeItem("identitySignalV1"); $("save-status").textContent="Saved Identity Signal data was removed from this device."; }
    catch { $("save-status").textContent="Browser storage was unavailable; no saved result could be found here."; }
  });

})();
