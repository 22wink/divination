import { meanings } from "./data.js";
import { scoreTone } from "./sequence.js";

export function renderResult(sequence, gridEl, summaryEl) {
  if (!gridEl || !summaryEl) return;

  gridEl.innerHTML = sequence
    .map((num, index) => {
      const data = meanings[num];
      return `
        <div class="result-card">
          <h2>${data.name}</h2>
          <span>${["初传", "中传", "末传"][index]} · ${normalizeToneLabel(data.tone)}</span>
          <ul>
            <li>方位：${data.direction}</li>
            <li>应期：${data.timing}</li>
            <li>${data.desc}</li>
          </ul>
        </div>
      `;
    })
    .join("");

  const toneAdvice = getToneAdvice(scoreTone(sequence));
  summaryEl.hidden = false;
  summaryEl.textContent = `三传节奏：${toneAdvice}`;
}

function normalizeToneLabel(tone) {
  if (tone === "吉") return "吉象";
  if (tone === "凶") return "凶象";
  return "平象";
}

function getToneAdvice(score) {
  if (score > 1) {
    return "整体偏吉，可大胆推进，但仍需配合现实情况。";
  }
  if (score < -1) {
    return "凶象较重，建议放缓节奏，优先稳固当下。";
  }
  return "吉凶相半，宜分清主次，做好调节与备选方案。";
}

