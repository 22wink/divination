import { earthlyBranches, hourSlots } from "./data.js";
import { formatChineseNumber } from "./utils.js";

export function initLunarHelper({
  dateInput,
  timeInput,
  applyButton,
  previewEl,
  firstInput,
  secondInput,
  thirdInput,
  onSequenceApplied,
}) {
  if (!dateInput || !timeInput || !applyButton || !previewEl) return;

  setDefaultSolarInputs(dateInput, timeInput);
  const formatter = createLunarFormatter();

  const updatePreview = () => {
    const result = computeLunarSequence(formatter, dateInput.value, timeInput.value);
    if (result.error) {
      previewEl.textContent = result.error;
      return null;
    }

    const { month, day, branchIndex, branchName } = result.data;
    const monthLabel = formatChineseNumber(month);
    const dayLabel = formatChineseNumber(day);
    previewEl.textContent = `农历${monthLabel}月${dayLabel} · ${branchName}时(${branchIndex}) → ${month}, ${day}, ${branchIndex}`;
    return result.data;
  };

  updatePreview();
  dateInput.addEventListener("change", updatePreview);
  timeInput.addEventListener("change", updatePreview);

  applyButton.addEventListener("click", () => {
    const sequence = updatePreview();
    if (!sequence || !firstInput || !secondInput || !thirdInput) return;
    firstInput.value = sequence.month;
    secondInput.value = sequence.day;
    thirdInput.value = sequence.branchIndex;
    if (typeof onSequenceApplied === "function") {
      onSequenceApplied();
    }
  });
}

function createLunarFormatter() {
  try {
    return new Intl.DateTimeFormat("zh-Hans-u-ca-chinese", {
      month: "numeric",
      day: "numeric",
    });
  } catch (error) {
    console.warn("当前环境暂不支持农历日历转换。", error);
    return null;
  }
}

function setDefaultSolarInputs(dateInput, timeInput) {
  const now = new Date();
  if (!dateInput.value) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateInput.value = today.toISOString().split("T")[0];
  }
  if (!timeInput.value) {
    timeInput.value = `${String(now.getHours()).padStart(2, "0")}:00`;
  }
}

function computeLunarSequence(formatter, dateValue, timeValue) {
  if (!formatter) {
    return { error: "当前环境不支持农历转换，请改为手动输入。" };
  }
  if (!dateValue || !timeValue) {
    return { error: "请先选择公历日期与整点时间。" };
  }

  const solarDate = new Date(`${dateValue}T00:00:00`);
  const parts = formatter.formatToParts(solarDate);
  const monthPart = parts.find((item) => item.type === "month");
  const dayPart = parts.find((item) => item.type === "day");

  if (!monthPart || !dayPart) {
    return { error: "农历转换失败，可尝试刷新或手动输入数字。" };
  }

  const [hourString] = timeValue.split(":");
  const hour = Number(hourString);
  if (!Number.isInteger(hour)) {
    return { error: "时间格式无效，请选择整点时间。" };
  }

  const branchIndex = getEarthlyBranchIndex(hour);
  const branchName = earthlyBranches[branchIndex - 1];
  return {
    data: {
      month: Number(monthPart.value),
      day: Number(dayPart.value),
      branchIndex,
      branchName,
    },
  };
}

function getEarthlyBranchIndex(hour) {
  return hourSlots[hour];
}

