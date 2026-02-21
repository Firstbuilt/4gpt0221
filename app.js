const STORAGE_KEY = "eu_ai_tracker_v2";

const defaultState = {
  clarifications: [
    "首批覆盖成员国（建议先德法爱意）",
    "业务上线模式（API、SaaS、本地化部署）",
    "训练与推理数据跨境传输路径",
    "内部汇报节奏（周报/双周/月报）",
    "风险等级判定与升级机制",
  ].map((text) => ({ text, done: false })),
  knowledge: [
    {
      title: "欧盟 AI Act 正式文本",
      jurisdiction: "欧盟",
      type: "立法",
      domain: "隐私合规（重点）",
      source: "EUR-Lex",
    },
    {
      title: "德国 BfDI 对 AI 训练数据处理指引",
      jurisdiction: "德国",
      type: "监管指导",
      domain: "隐私合规（重点）",
      source: "BfDI",
    },
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
  return domain.includes("隐私");
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

function renderKpis() {
  const knowledgeCount = state.knowledge.length;
  const updatesCount = state.updates.length;
  const privacyCount = state.updates.filter((u) => isPrivacy(u.domain)).length;
  const ratio = updatesCount ? Math.round((privacyCount / updatesCount) * 100) : 0;
  const done = state.clarifications.filter((c) => c.done).length;

  document.querySelector("#kpi-knowledge").textContent = knowledgeCount;
  document.querySelector("#kpi-updates").textContent = updatesCount;
  document.querySelector("#kpi-privacy-ratio").textContent = `${ratio}%`;
  document.querySelector("#kpi-clarification").textContent = `${done}/${state.clarifications.length}`;
}

function renderClarifications() {
  const host = document.querySelector("#clarification-list");
  host.innerHTML = "";

  state.clarifications.forEach((item, idx) => {
    const div = document.createElement("label");
    div.className = "item";
    div.innerHTML = `
      <input type="checkbox" data-index="${idx}" ${item.done ? "checked" : ""} />
      ${item.text}
      <span class="small">${item.done ? "已完成" : "待确认"}</span>
    `;
    host.appendChild(div);
  });

  host.querySelectorAll("input[type=checkbox]").forEach((el) => {
    el.addEventListener("change", (e) => {
      const index = Number(e.target.dataset.index);
      state.clarifications[index].done = e.target.checked;
      saveState();
      renderKpis();
      renderClarifications();
    });
  });
}

function renderKnowledge() {
  const host = document.querySelector("#knowledge-list");
  const keyword = document.querySelector("#knowledge-search").value.trim();
  const domainFilter = document.querySelector("#knowledge-domain-filter").value;

  const items = state.knowledge.filter(
    (k) =>
      containsText(k, keyword, ["title", "jurisdiction", "source"]) &&
      matchDomain(k.domain, domainFilter)
  );

  host.innerHTML = "";
  if (!items.length) {
    host.innerHTML = '<div class="item small">没有匹配的知识条目。</div>';
    return;
  }

  items.forEach((k) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(k.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>${k.title}</strong>
      <span class="badge">${k.type}</span>
      <span class="badge ${isPrivacy(k.domain) ? "privacy" : ""}">${k.domain}</span>
      <div class="small">法域：${k.jurisdiction}</div>
      <div class="small">来源：${k.source}</div>
    `;
    host.appendChild(div);
  });
}

function renderUpdates() {
  const host = document.querySelector("#updates-list");
  const keyword = document.querySelector("#updates-search").value.trim();
  const domainFilter = document.querySelector("#updates-domain-filter").value;

  const items = state.updates.filter(
    (u) =>
      containsText(u, keyword, ["title", "impact", "source"]) &&
      matchDomain(u.domain, domainFilter)
  );

  host.innerHTML = "";
  if (!items.length) {
    host.innerHTML = '<div class="item small">没有匹配的监管动态。</div>';
    return;
  }

  items.forEach((u) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(u.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>${u.title}</strong>
      <span class="badge">${u.kind}</span>
      <span class="badge ${isPrivacy(u.domain) ? "privacy" : ""}">${u.domain}</span>
      <div class="small">影响：${u.impact}</div>
      <div class="small">日期：${u.date} ｜ 来源：${u.source}</div>
    `;
    host.appendChild(div);
  });
}

function renderCommentary() {
  const host = document.querySelector("#commentary-list");
  host.innerHTML = "";

  if (!state.updates.length) {
    host.innerHTML = '<div class="item small">暂无动态可生成时评。</div>';
    return;
  }

  state.updates.forEach((u) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(u.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>【时评】${u.title}</strong>
      <div class="small">总结：该事件属于“${u.kind}”，显示 ${u.domain} 监管要求在持续细化。</div>
      <div class="small">评价：建议围绕“${u.impact}”尽快形成内部整改/预案，并纳入下一轮管理层汇报。</div>
    `;
    host.appendChild(div);
  });
}

function renderGlobalReport() {
  const total = state.updates.length;
  const privacy = state.updates.filter((u) => isPrivacy(u.domain)).length;
  const done = state.clarifications.filter((c) => c.done).length;
  const percentage = total ? Math.round((privacy / total) * 100) : 0;

  document.querySelector("#global-report").innerHTML = `
    <p><strong>总体态势：</strong>已纳入 ${total} 条监管动态，其中隐私合规 ${privacy} 条（${percentage}%），隐私仍是合规核心。</p>
    <p><strong>风险观察：</strong>训练数据合法性、数据主体权利响应、跨境传输评估是近期高频执法触发点。</p>
    <p><strong>趋势判断：</strong>欧盟层面框架清晰化，成员国执行趋于差异化，建议采用“欧盟统一基线 + 国别补丁”治理模式。</p>
    <p><strong>准备度：</strong>需求澄清完成 ${done}/${state.clarifications.length}，建议补齐后形成管理层版本路线图。</p>
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
    item.date = new Date().toLocaleDateString("zh-CN");
    state.updates.unshift(item);
    e.target.reset();
    saveState();
    renderKpis();
    renderUpdates();
    renderCommentary();
  });
}

function bindFilters() {
  [
    "#knowledge-search",
    "#knowledge-domain-filter",
  ].forEach((selector) => document.querySelector(selector).addEventListener("input", renderKnowledge));

  [
    "#updates-search",
    "#updates-domain-filter",
  ].forEach((selector) => document.querySelector(selector).addEventListener("input", renderUpdates));
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
}

bindTabs();
bindForms();
bindFilters();
bindActions();
renderKpis();
renderClarifications();
renderKnowledge();
renderUpdates();
renderCommentary();
