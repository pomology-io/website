const copy = {
  en: {
    kicker: "Pomology",
    headline: "Cultivate your Apple strategy.",
    lead: "Experienced sales, product, and development consulting for Apple platform success.",
    contact: "Get in touch",
    formTitle: "Get in touch",
    formIntro: "Tell us a bit about your project and goals.",
    nameLabel: "Name",
    emailLabel: "Email",
    companyLabel: "Company",
    messageLabel: "Message",
    formSubmit: "Send message",
    closeForm: "Close form",
    sending: "Sending...",
    sent: "Thanks. Your message has been sent.",
    sendError: "Something went wrong. Please try again.",
    address: "Pomology B.V. · Joop Geesinkweg 501 · 1114AB Amsterdam-Duivendrecht · 🇳🇱",
    legal: "KVK: 90260392 · VAT: NL865258363B01",
  },
  nl: {
    kicker: "Pomology",
    headline: "Laat je Apple-strategie groeien.",
    lead: "Ervaren consultancy in sales, product en development voor succes met Apple-platformen.",
    contact: "Neem contact op",
    formTitle: "Neem contact op",
    formIntro: "Vertel iets over je project en doelstellingen.",
    nameLabel: "Naam",
    emailLabel: "E-mail",
    companyLabel: "Bedrijf",
    messageLabel: "Bericht",
    formSubmit: "Verstuur bericht",
    closeForm: "Sluit formulier",
    sending: "Verzenden...",
    sent: "Bedankt. Je bericht is verzonden.",
    sendError: "Er ging iets mis. Probeer het opnieuw.",
    address: "Pomology B.V. · Joop Geesinkweg 501 · 1114AB Amsterdam-Duivendrecht · 🇳🇱",
    legal: "KVK: 90260392 · BTW: NL865258363B01",
  },
};

const nodes = Array.from(document.querySelectorAll("[data-i18n]"));
const buttons = Array.from(document.querySelectorAll(".lang-btn"));
const nodesAria = Array.from(document.querySelectorAll("[data-i18n-aria-label]"));
const contactOpen = document.getElementById("contact-open");
const contactModal = document.getElementById("contact-modal");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const closeModalButtons = Array.from(document.querySelectorAll("[data-close-modal]"));
let activeLanguage = "en";
let previousFocus = null;

if (contactModal) {
  contactModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function setLanguage(lang) {
  const chosen = copy[lang] ? lang : "en";
  activeLanguage = chosen;

  nodes.forEach((node) => {
    const key = node.dataset.i18n;
    const text = copy[chosen][key];
    if (text) node.textContent = text;
  });

  nodesAria.forEach((node) => {
    const key = node.dataset.i18nAriaLabel;
    const text = copy[chosen][key];
    if (text) node.setAttribute("aria-label", text);
  });

  document.documentElement.lang = chosen;
  buttons.forEach((button) => {
    const active = button.dataset.lang === chosen;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  try {
    localStorage.setItem("pomologyLanguage", chosen);
  } catch (_error) {
    // Ignore storage access issues.
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

function openModal() {
  if (!contactModal) return;
  previousFocus = document.activeElement;
  contactModal.hidden = false;
  document.body.classList.add("modal-open");
  if (formStatus) formStatus.textContent = "";
  const focusTarget = contactModal.querySelector(
    "input:not([type='hidden']), textarea, .form-submit, .modal-close"
  );
  if (focusTarget) focusTarget.focus();
}

function closeModal() {
  if (!contactModal) return;
  contactModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

if (contactOpen) {
  contactOpen.addEventListener("click", openModal);
}

closeModalButtons.forEach((node) => {
  node.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactModal && !contactModal.hidden) {
    closeModal();
  }
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!formStatus) return;

    formStatus.textContent = copy[activeLanguage].sending;
    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("form_submit_failed");

      contactForm.reset();
      formStatus.textContent = copy[activeLanguage].sent;
    } catch (_error) {
      formStatus.textContent = copy[activeLanguage].sendError;
    }
  });
}

let initialLanguage = "en";
try {
  initialLanguage = localStorage.getItem("pomologyLanguage") || initialLanguage;
} catch (_error) {
  // Ignore storage access issues.
}

if (!copy[initialLanguage]) {
  const browserLanguage = navigator.language || "en";
  initialLanguage = browserLanguage.toLowerCase().startsWith("nl") ? "nl" : "en";
}

setLanguage(initialLanguage);
