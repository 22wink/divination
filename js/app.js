import { resolveSequence } from "./sequence.js";
import { renderResult } from "./render.js";
import { initLunarHelper } from "./lunar.js";

const form = document.getElementById("liuRenForm");
const summaryBox = document.getElementById("summaryBox");
const errorMsg = document.getElementById("errorMsg");
const grid = document.getElementById("resultGrid");
const firstInput = form?.elements["first"];
const secondInput = form?.elements["second"];
const thirdInput = form?.elements["third"];
const solarDateInput = document.getElementById("solarDate");
const solarTimeInput = document.getElementById("solarTime");
const applyLunarBtn = document.getElementById("applyLunarBtn");
const lunarPreview = document.getElementById("lunarPreview");

initForm();
initLunarHelper({
  dateInput: solarDateInput,
  timeInput: solarTimeInput,
  applyButton: applyLunarBtn,
  previewEl: lunarPreview,
  firstInput,
  secondInput,
  thirdInput,
});

function initForm() {
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const steps = ["first", "second", "third"].map((key) => Number(formData.get(key)));

    if (steps.some((n) => !Number.isInteger(n) || n < 1)) {
      if (errorMsg) errorMsg.style.display = "block";
      if (grid) grid.innerHTML = "";
      if (summaryBox) summaryBox.hidden = true;
      return;
    }

    if (errorMsg) errorMsg.style.display = "none";
    const sequence = resolveSequence(steps);
    renderResult(sequence, grid, summaryBox);
    scrollToResults();
  });
}

function scrollToResults() {
  if (!grid) return;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.requestAnimationFrame(() => {
    grid.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
}

