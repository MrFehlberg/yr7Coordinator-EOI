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
    <div class="story-copy story-copy-flow">
      ${item.story.map((paragraph, index) => `<p class="story-p story-p-${index + 1}">${esc(paragraph)}</p>`).join("")}
    </div>
  `;
}

function renderCase(key, target) {
  const item = EOI.cases[key];
  if (!item || !target) return;

  const intro = item.intro ? `<p class="case-summary">${esc(item.intro)}</p>` : "";
  const sections = item.sections.map((section, index) => `
    <div class="case-block ${index === 0 ? "first" : ""} ${section.emphasis ? "emphasis" : ""}">
      <span>${esc(section.label)}</span>
      <p>${esc(section.body)}</p>
    </div>
  `).join("");

  target.innerHTML = `
    <div class="case-kicker">${esc(item.label)}</div>
    <h2>${esc(item.title)}</h2>
    ${intro}
    ${sections}
    <div class="tag-row">${item.tags.map(tag => `<span>${esc(tag)}</span>`).join("")}</div>
  `;
}

function renderPrinciple(principle) {
  const target = $("#principleDialogBody");
  if (!principle || !target) return;

  const evidence = principle.evidence?.length ? `
    <div class="principle-evidence">
      <div class="proof-label">${esc(principle.evidenceTitle || "EVIDENCE")}</div>
      ${principle.evidence.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}
    </div>
  ` : "";

  target.innerHTML = `
    <div class="case-kicker">BEHAVIOUR PRINCIPLE ${esc(principle.number)}</div>
    <h2>${esc(principle.title)}</h2>
    <blockquote>${esc(principle.quote)}</blockquote>
    <p class="case-summary">${esc(principle.note)}</p>
    ${evidence}
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
    <div class="challenge-answer">
      ${challenge.a.map(paragraph => `<p>${esc(paragraph)}</p>`).join("")}
    </div>
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

  $("#challengeBtn2")?.addEventListener("click", () => openDialog("#challengeDialog"));

  $("#coffee")?.addEventListener("click", () => {
    showToast("Coffee helps. Evidence helps more.");
  });
}

init();
