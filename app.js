const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[char]));

function openDialog(selector) {
  const dialog = $(selector);
  if (dialog && !dialog.open) dialog.showModal();
}

function closeOnBackdrop(dialog) {
  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
}

function renderBehaviourFeature() {
  const target = $("#behaviourFeature");
  const item = EOI.behaviourFeature;
  if (!target || !item) return;

  target.innerHTML = `
    <div class="story-kicker">${esc(item.kicker)}</div>
    <h3>${esc(item.title)}</h3>
    <p class="story-hook">${esc(item.hook)}</p>
    <div class="story-copy">
      ${item.story.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}
    </div>
    <p class="story-outcome">${esc(item.outcome)}</p>
  `;
}

function renderCase(key, target) {
  const item = EOI.cases[key];
  if (!item || !target) return;

  target.innerHTML = `
    <div class="case-kicker">${esc(item.label)}</div>
    <h2>${esc(item.title)}</h2>
    <div class="case-block first">
      <span>WHAT HAPPENED</span>
      <p>${esc(item.summary)}</p>
    </div>
    <div class="case-block">
      <span>WHAT I DID</span>
      <p>${esc(item.action)}</p>
    </div>
    <div class="case-block outcome">
      <span>WHY IT MATTERS</span>
      <p>${esc(item.outcome)}</p>
    </div>
    <div class="tag-row">${item.tags.map(tag => `<span>${esc(tag)}</span>`).join("")}</div>
  `;
}

function renderPrinciple(principle) {
  const target = $("#principleDialogBody");
  if (!principle || !target) return;

  target.innerHTML = `
    <div class="case-kicker">BEHAVIOUR RULE ${esc(principle.number)}</div>
    <h2>${esc(principle.title)}</h2>
    <blockquote>${esc(principle.quote)}</blockquote>
    <p class="case-summary">${esc(principle.note)}</p>
  `;
  openDialog("#principleDialog");
}

function initPrinciples() {
  $$('[data-principle]').forEach(button => {
    button.addEventListener("click", () => {
      const principle = EOI.principles.find(item => item.id === button.dataset.principle);
      renderPrinciple(principle);
    });
  });
}

function renderChallenge(index) {
  const body = $("#challengeBody");
  const challenge = EOI.challenges[index];
  if (!body || !challenge) return;

  $$('[data-challenge]', $("#challengeList")).forEach(button => {
    const selected = Number(button.dataset.challenge) === index;
    button.classList.toggle("active", selected);
    if (selected) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });

  body.innerHTML = `
    <div class="case-kicker">PANEL CHALLENGE</div>
    <h2>${esc(challenge.q)}</h2>
    <p class="case-summary challenge-answer">${esc(challenge.a)}</p>
    <div class="proof-label">OPEN THE PROOF</div>
    <div class="proof-strip">
      ${challenge.keys.map(key => `<button type="button" data-proof="${esc(key)}">${esc(EOI.cases[key].title)}</button>`).join("")}
    </div>
  `;

  $$('[data-proof]', body).forEach(button => {
    button.addEventListener("click", () => {
      renderCase(button.dataset.proof, body);
      const back = document.createElement("button");
      back.type = "button";
      back.className = "link-button back-challenge";
      back.textContent = "Back to challenge";
      back.addEventListener("click", () => renderChallenge(index));
      body.append(back);
    });
  });
}

function initChallenge() {
  const list = $("#challengeList");
  if (!list) return;

  list.innerHTML = EOI.challenges
    .map((challenge, index) => `<button type="button" data-challenge="${index}">${esc(challenge.q)}</button>`)
    .join("");

  list.addEventListener("click", event => {
    const button = event.target.closest("[data-challenge]");
    if (button) renderChallenge(Number(button.dataset.challenge));
  });

  renderChallenge(0);
}

function setQuickMode(enabled) {
  const toggle = $("#quickToggle");
  const mode = $("#deskMode");
  const instruction = $("#deskInstruction");

  document.body.classList.toggle("quick", enabled);
  toggle?.setAttribute("aria-pressed", enabled ? "true" : "false");
  if (toggle) toggle.textContent = enabled ? "Explore all" : "Quick scan";
  if (mode) mode.textContent = enabled ? "Quick scan · behaviour + 4 essentials" : "Explore all";
  if (instruction) {
    instruction.textContent = enabled
      ? "The behaviour case above, then four examples that make the wider case fastest."
      : "Choose what matters. You do not need to open everything.";
  }

  $$(".object").forEach(object => {
    const unavailable = enabled && !object.classList.contains("must");
    object.disabled = unavailable;
    object.setAttribute("aria-hidden", unavailable ? "true" : "false");
  });
}

function showCase(key, button) {
  renderCase(key, $("#caseBody"));
  openDialog("#caseDialog");
  button?.classList.add("visited");
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
}

function init() {
  renderBehaviourFeature();
  initPrinciples();
  initChallenge();

  $$('.dialog-close').forEach(button => {
    button.addEventListener("click", () => button.closest("dialog")?.close());
  });
  $$("dialog").forEach(closeOnBackdrop);

  $$('[data-case]').forEach(button => {
    button.addEventListener("click", () => showCase(button.dataset.case, button));
  });

  $("#challengeBtn")?.addEventListener("click", () => openDialog("#challengeDialog"));
  $("#challengeBtn2")?.addEventListener("click", () => openDialog("#challengeDialog"));

  $("#quickToggle")?.addEventListener("click", () => {
    setQuickMode(!document.body.classList.contains("quick"));
  });

  $("#coffee")?.addEventListener("click", () => {
    showToast("Coffee helps. Evidence helps more.");
  });
}

init();
