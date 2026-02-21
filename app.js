const STORAGE_KEY = "eu_ai_tracker_v2";
const LANG_KEY = "eu_ai_tracker_lang";

const i18n = {
  zh: {
    pageTitle: "欧盟AI监管追踪台",
    titleMain: "欧盟 AI 监管追踪台",
    subtitleMain: "面向欧洲市场 AI 产品的合规监测与管理层汇报前台",
    seedDemo: "加载演示数据",
    kpiKnowledge: "知识条目总数",
    kpiUpdates: "监管动态总数",
    kpiPrivacyRatio: "隐私合规占比",
    kpiPrivacyCount: "重点隐私动态",
    tabKnowledge: "知识库",
    tabUpdates: "监管动态",
    tabReports: "分析报告",
    knowledgeHeading: "AI 相关知识库（立法 / 指导 / 判例）",
    updatesHeading: "监管动态（新闻 / 立法进展 / 执法）",
    reportsHeading: "分析报告",
    knowledgeSearch: "搜索标题、法域、来源...",
    updatesSearch: "搜索标题、影响、来源...",
    knowledgeSubmit: "新增条目",
    updatesSubmit: "新增动态",
    generateGlobal: "生成全局报告",
    globalReportTitle: "全局报告",
    commentaryTitle: "时评（按动态自动生成）",
    globalReportEmpty: "点击按钮生成最新评估。",
    footer: "原型版本：可本地运行、可视化查看、可用于管理层演示。",
    noKnowledge: "没有匹配的知识条目。",
    noUpdates: "没有匹配的监管动态。",
    noCommentary: "暂无动态可生成时评。",
    domainAll: "全部领域",
    domainPrivacy: "隐私合规（重点）",
    domainCompetition: "竞争法",
    domainConsumer: "消费者保护",
    domainCyber: "网络安全",
    domainOther: "其他",
    reportOverall: "总体态势",
    reportRisk: "风险观察",
    reportTrend: "趋势判断",
    reportAction: "执行建议",
    summary: "总结",
    evaluation: "评价",
    reportOverallText: (total, privacy, pct) => `已纳入 ${total} 条监管动态，其中隐私合规 ${privacy} 条（${pct}%），隐私仍是合规核心。`,
    reportRiskText: "训练数据合法性、数据主体权利响应、跨境传输评估是近期高频执法触发点。",
    reportTrendText: "欧盟层面框架清晰化，成员国执行趋于差异化，建议采用“欧盟统一基线 + 国别补丁”治理模式。",
    reportActionText: "建议以“隐私优先 + 多法域联动”推进内部治理，并形成固定节奏的管理层简报。",
    commentarySummary: (kind, domain) => `该事件属于“${kind}”，显示 ${domain} 监管要求在持续细化。`,
    commentaryEval: (impact) => `建议围绕“${impact}”尽快形成内部整改/预案，并纳入下一轮管理层汇报。`,
  },
  en: {
    pageTitle: "EU AI Regulatory Tracker",
    titleMain: "EU AI Regulatory Tracker",
    subtitleMain: "Compliance monitoring dashboard for AI products entering the EU market",
    seedDemo: "Load Demo Data",
    kpiKnowledge: "Knowledge Entries",
    kpiUpdates: "Regulatory Updates",
    kpiPrivacyRatio: "Privacy Share",
    kpiPrivacyCount: "Key Privacy Items",
    tabKnowledge: "Knowledge Base",
    tabUpdates: "Regulatory Updates",
    tabReports: "Reports",
    knowledgeHeading: "AI Knowledge Base (Legislation / Guidance / Case Law)",
    updatesHeading: "Regulatory Updates (News / Legislative Progress / Enforcement)",
    reportsHeading: "Analysis Reports",
    knowledgeSearch: "Search title, jurisdiction, source...",
    updatesSearch: "Search title, impact, source...",
    knowledgeSubmit: "Add Entry",
    updatesSubmit: "Add Update",
    generateGlobal: "Generate Global Report",
    globalReportTitle: "Global Report",
    commentaryTitle: "Commentary (Auto-generated per update)",
    globalReportEmpty: "Click the button to generate the latest assessment.",
    footer: "Prototype: locally runnable, visual, and management-ready for demos.",
    noKnowledge: "No matching knowledge entries.",
    noUpdates: "No matching updates.",
    noCommentary: "No updates available for commentary.",
    domainAll: "All Domains",
    domainPrivacy: "Privacy Compliance (Priority)",
    domainCompetition: "Competition Law",
    domainConsumer: "Consumer Protection",
    domainCyber: "Cybersecurity",
    domainOther: "Other",
    reportOverall: "Overall",
    reportRisk: "Risk",
    reportTrend: "Trend",
    reportAction: "Action",
    summary: "Summary",
    evaluation: "Assessment",
    reportOverallText: (total, privacy, pct) => `Tracked ${total} updates in total, including ${privacy} privacy-related items (${pct}%). Privacy remains the core compliance focus.`,
    reportRiskText: "Data provenance legality, data subject rights handling, and cross-border transfer assessments are the top enforcement triggers.",
    reportTrendText: "EU-level framework is becoming clearer, while member-state enforcement remains heterogeneous. Use an EU baseline + local add-ons model.",
    reportActionText: "Adopt a privacy-first, multi-regime governance approach and provide regular management briefings.",
    commentarySummary: (kind, domain) => `This item is a "${kind}" signal showing ongoing tightening in ${domain} requirements.`,
    commentaryEval: (impact) => `Prioritize an internal remediation/response plan around "${impact}" for the next management update.`,
  },
};

const defaultState = {
  clarifications: [],
  knowledge: [
    { title: "欧盟 AI Act 正式文本", jurisdiction: "欧盟", type: "立法", domain: "隐私合规（重点）", source: "EUR-Lex" },
    { title: "德国 BfDI 对 AI 训练数据处理指引", jurisdiction: "德国", type: "监管指导", domain: "隐私合规（重点）", source: "BfDI" },
  ],
  updates: [
    {
      title: "EDPB 讨论 AI 模型训练与 GDPR 合法性基础",
      kind: "监管声明",
      domain: "隐私合规（重点）",
      impact: "需补强训练数据来源审计与数据主体权利响应",
      source: "EDPB",
      date: new Date().toLocaleDateString("zh-CN"),
    },
    {
      title: "法国竞争管理机构关注生成式AI平台竞争门槛",
      kind: "新闻报道",
      domain: "竞争法",
      impact: "平台合作与分发渠道需评估排他性风险",
      source: "Autorité de la concurrence",
      date: new Date().toLocaleDateString("zh-CN"),
    },
  ],
};

const state = loadState();
let currentLang = localStorage.getItem(LANG_KEY) || "zh";

function t() {
  return i18n[currentLang] || i18n.zh;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultState);
  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isPrivacy(domain = "") {
  return domain.includes("隐私") || domain.toLowerCase().includes("privacy");
}

function containsText(item, keyword, fields) {
  if (!keyword) return true;
  const value = fields.map((f) => item[f] || "").join(" ").toLowerCase();
  return value.includes(keyword.toLowerCase());
}

function matchDomain(itemDomain, domainFilter) {
  if (domainFilter === "all") return true;
  return itemDomain.includes(domainFilter);
}

function applyLanguage() {
  const L = t();
  document.documentElement.lang = currentLang === "en" ? "en" : "zh-CN";
  document.title = L.pageTitle;

  const mapping = {
    "#title-main": L.titleMain,
    "#subtitle-main": L.subtitleMain,
    "#seed-demo": L.seedDemo,
    "#kpi-label-knowledge": L.kpiKnowledge,
    "#kpi-label-updates": L.kpiUpdates,
    "#kpi-label-privacy-ratio": L.kpiPrivacyRatio,
    "#kpi-label-privacy-count": L.kpiPrivacyCount,
    "#tab-knowledge": L.tabKnowledge,
    "#tab-updates": L.tabUpdates,
    "#tab-reports": L.tabReports,
    "#knowledge-heading": L.knowledgeHeading,
    "#updates-heading": L.updatesHeading,
    "#reports-heading": L.reportsHeading,
    "#knowledge-submit": L.knowledgeSubmit,
    "#updates-submit": L.updatesSubmit,
    "#generate-global": L.generateGlobal,
    "#global-report-title": L.globalReportTitle,
    "#commentary-title": L.commentaryTitle,
    "#footer-main": L.footer,
  };

  Object.entries(mapping).forEach(([sel, txt]) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = txt;
  });

  document.querySelector("#knowledge-search").placeholder = L.knowledgeSearch;
  document.querySelector("#updates-search").placeholder = L.updatesSearch;
  document.querySelector("#global-report").textContent = L.globalReportEmpty;
  document.querySelector("#lang-toggle").textContent = currentLang === "zh" ? "EN" : "中文";

  const domainLabels = [L.domainAll, L.domainPrivacy, L.domainCompetition, L.domainConsumer, L.domainCyber, L.domainOther];
  ["#knowledge-domain-filter", "#updates-domain-filter"].forEach((sel) => {
    const options = document.querySelectorAll(`${sel} option`);
    options.forEach((op, idx) => {
      if (domainLabels[idx]) op.textContent = domainLabels[idx];
    });
  });

  renderKnowledge();
  renderUpdates();
  renderCommentary();
}

function renderKpis() {
  const knowledgeCount = state.knowledge.length;
  const updatesCount = state.updates.length;
  const privacyCount = state.updates.filter((u) => isPrivacy(u.domain)).length;
  const ratio = updatesCount ? Math.round((privacyCount / updatesCount) * 100) : 0;
  document.querySelector("#kpi-knowledge").textContent = knowledgeCount;
  document.querySelector("#kpi-updates").textContent = updatesCount;
  document.querySelector("#kpi-privacy-ratio").textContent = `${ratio}%`;
  document.querySelector("#kpi-privacy-count").textContent = privacyCount;
}

function renderKnowledge() {
  const L = t();
  const host = document.querySelector("#knowledge-list");
  const keyword = document.querySelector("#knowledge-search").value.trim();
  const domainFilter = document.querySelector("#knowledge-domain-filter").value;

  const items = state.knowledge.filter(
    (k) => containsText(k, keyword, ["title", "jurisdiction", "source"]) && matchDomain(k.domain, domainFilter)
  );

  host.innerHTML = "";
  if (!items.length) {
    host.innerHTML = `<div class="item small">${L.noKnowledge}</div>`;
    return;
  }

  items.forEach((k) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(k.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>${k.title}</strong>
      <span class="badge">${k.type}</span>
      <span class="badge ${isPrivacy(k.domain) ? "privacy" : ""}">${k.domain}</span>
      <div class="small">${currentLang === "en" ? "Jurisdiction" : "法域"}：${k.jurisdiction}</div>
      <div class="small">${currentLang === "en" ? "Source" : "来源"}：${k.source}</div>
    `;
    host.appendChild(div);
  });
}

function renderUpdates() {
  const L = t();
  const host = document.querySelector("#updates-list");
  const keyword = document.querySelector("#updates-search").value.trim();
  const domainFilter = document.querySelector("#updates-domain-filter").value;

  const items = state.updates.filter(
    (u) => containsText(u, keyword, ["title", "impact", "source"]) && matchDomain(u.domain, domainFilter)
  );

  host.innerHTML = "";
  if (!items.length) {
    host.innerHTML = `<div class="item small">${L.noUpdates}</div>`;
    return;
  }

  items.forEach((u) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(u.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>${u.title}</strong>
      <span class="badge">${u.kind}</span>
      <span class="badge ${isPrivacy(u.domain) ? "privacy" : ""}">${u.domain}</span>
      <div class="small">${currentLang === "en" ? "Impact" : "影响"}：${u.impact}</div>
      <div class="small">${currentLang === "en" ? "Date" : "日期"}：${u.date} ｜ ${currentLang === "en" ? "Source" : "来源"}：${u.source}</div>
    `;
    host.appendChild(div);
  });
}

function renderCommentary() {
  const L = t();
  const host = document.querySelector("#commentary-list");
  host.innerHTML = "";

  if (!state.updates.length) {
    host.innerHTML = `<div class="item small">${L.noCommentary}</div>`;
    return;
  }

  state.updates.forEach((u) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(u.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>${currentLang === "en" ? "[Commentary]" : "【时评】"}${u.title}</strong>
      <div class="small">${L.summary}：${L.commentarySummary(u.kind, u.domain)}</div>
      <div class="small">${L.evaluation}：${L.commentaryEval(u.impact)}</div>
    `;
    host.appendChild(div);
  });
}

function renderGlobalReport() {
  const L = t();
  const total = state.updates.length;
  const privacy = state.updates.filter((u) => isPrivacy(u.domain)).length;
  const percentage = total ? Math.round((privacy / total) * 100) : 0;

  document.querySelector("#global-report").innerHTML = `
    <p><strong>${L.reportOverall}：</strong>${L.reportOverallText(total, privacy, percentage)}</p>
    <p><strong>${L.reportRisk}：</strong>${L.reportRiskText}</p>
    <p><strong>${L.reportTrend}：</strong>${L.reportTrendText}</p>
    <p><strong>${L.reportAction}：</strong>${L.reportActionText}</p>
  `;
}

function bindForms() {
  document.querySelector("#knowledge-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = Object.fromEntries(formData.entries());
    state.knowledge.unshift(item);
    e.target.reset();
    saveState();
    renderKpis();
    renderKnowledge();
  });

  document.querySelector("#update-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = Object.fromEntries(formData.entries());
    item.date = new Date().toLocaleDateString(currentLang === "en" ? "en-GB" : "zh-CN");
    state.updates.unshift(item);
    e.target.reset();
    saveState();
    renderKpis();
    renderUpdates();
    renderCommentary();
  });
}

function bindFilters() {
  ["#knowledge-search", "#knowledge-domain-filter"].forEach((selector) =>
    document.querySelector(selector).addEventListener("input", renderKnowledge)
  );
  ["#updates-search", "#updates-domain-filter"].forEach((selector) =>
    document.querySelector(selector).addEventListener("input", renderUpdates)
  );
}

function bindTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
    });
  });
}

function bindActions() {
  document.querySelector("#generate-global").addEventListener("click", renderGlobalReport);
  document.querySelector("#seed-demo").addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    location.reload();
  });
  document.querySelector("#lang-toggle").addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage();
    renderKpis();
  });
}

bindTabs();
bindForms();
bindFilters();
bindActions();
applyLanguage();
renderKpis();
renderKnowledge();
renderUpdates();
renderCommentary();
