/**
 * 春节主题自动切换（配合同目录 spring.css 使用，资源目录 /home/spring/）
 *
 * 原理：给 <html> 设置 data-theme="spring"，spring.css 中
 * html[data-theme="spring"] 开头的规则才会生效。
 *
 * 调试开关（不受日期限制，方便随时预览）：
 *   /home/?spring=1   强制开启春节主题
 *   /home/?spring=0   强制关闭春节主题
 */
(function () {
  "use strict";

  // 春节档期（公历 / 本地时间），起止日期均包含。
  // 这里统一用 "YYYY-MM-DD" 字符串，避免 new Date(年, 月, 日) 的"月份从 0 开始"坑：
  // new Date(2026, 11, 1) 其实是 2026-12-01，而不是 2 月 3 日。
  // start 当天 00:00 开启，end 当天 23:59:59.999 关闭。
  //
  // 2027 年：腊八 1/15（丙午年腊月初八）→ 小年 1/30~31 → 除夕 2/5
  //          → 春节 2/6 → 元宵 2/20。
  // 按"过了腊八就是年"从腊八当天开始，到元宵后两天（2/22）收尾。
  // 以后每年往数组里加一行即可（按当年的腊八 → 元宵后两天）。
  const PERIODS = [
    { start: "2027-01-15", end: "2027-02-22", label: "2027" }
  ];

  const CHECK_INTERVAL = 60 * 60 * 1000; // 每小时复查一次
  const GREETING_SUFFIX = "新年快乐 · 愿代码如春风 🧧";

  // "2027-01-15" -> 本地时间当天 00:00:00；endOfDay=true 时取当天 23:59:59.999
  // 不用 new Date("2027-01-15")，因为纯日期 ISO 串会被当成 UTC 解析，东八区会偏 8 小时
  function localDate(iso, endOfDay) {
    const p = iso.split("-").map(Number);
    return endOfDay
      ? new Date(p[0], p[1] - 1, p[2], 23, 59, 59, 999)
      : new Date(p[0], p[1] - 1, p[2], 0, 0, 0, 0);
  }

  const RANGES = PERIODS.map(function (p) {
    return {
      start: localDate(p.start, false),
      end: localDate(p.end, true),
      label: p.label
    };
  });

  function currentPeriod(now) {
    for (let i = 0; i < RANGES.length; i++) {
      if (now >= RANGES[i].start && now <= RANGES[i].end) return RANGES[i];
    }
    return null;
  }

  // 返回 true / false / null（null = 未指定，按日期自动判断）
  function forcedState() {
    const v = new URLSearchParams(window.location.search).get("spring");
    if (v === null) return null;
    const s = v.toLowerCase();
    if (s === "1" || s === "on" || s === "true") return true;
    if (s === "0" || s === "off" || s === "false") return false;
    return null;
  }

  function applyTheme(active, label) {
    const root = document.documentElement;
    const theme = active ? "spring" : "normal";
    if (root.getAttribute("data-theme") !== theme) {
      root.setAttribute("data-theme", theme);
    }

    // 副标题跟着主题一起切换 / 还原。
    // 原版只在脚本加载时判断一次，页面开过零点后 data-theme 变回 normal，
    // 文案却会永远停在"新年快乐"。
    const sub = document.querySelector(".cyber-subtitle");
    if (!sub) return;
    if (sub.dataset.springOriginal === undefined) {
      sub.dataset.springOriginal = sub.textContent;
    }
    sub.textContent = active
      ? "🎉 " + label + GREETING_SUFFIX
      : sub.dataset.springOriginal;
  }

  function update() {
    const now = new Date();
    const forced = forcedState();
    const period = currentPeriod(now);
    const active = forced === null ? period !== null : forced;
    const label = period
      ? period.label
      : (RANGES.length ? RANGES[0].label : String(now.getFullYear()));
    applyTheme(active, label);
  }

  function init() {
    update();
    setInterval(update, CHECK_INTERVAL);
    // 电脑休眠或从后台切回来时立刻校准，不必等下一次整点
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) update();
    });
  }

  // 当前由 <script defer> 引入，执行时 DOM 已就绪；
  // 仍做一层保护，防止以后改成 async 或移动 script 位置后报错
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
