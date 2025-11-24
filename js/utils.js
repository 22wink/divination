export function formatChineseNumber(num) {
  const numerals = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

  if (num <= 10) {
    return num === 10 ? "十" : numerals[num];
  }
  if (num < 20) {
    return `十${num === 10 ? "" : numerals[num - 10]}`;
  }
  if (num === 20) {
    return "二十";
  }
  if (num < 30) {
    return `二十${numerals[num - 20]}`;
  }
  return "三十";
}

