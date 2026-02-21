const KEY = "eu_ai_compliance_tracker_v1";

const defaultData = {
  clarifications: [
    "目标市场优先级（先覆盖哪些欧盟成员国）",
    "业务形态（仅模型服务、API、还是终端应用）",
    "数据流路径（是否跨境、是否本地化部署）",
    "内部汇报频率（周报、双周报、月报）",
    "风险分级标准（高/中/低的判定口径）",
  ].map((text) => ({ text, done: false })),
  knowledge: [
    {
      title: "欧盟 AI Act 正式文本",
      jurisdiction: "欧盟",
      type: "立法",
      domain: "隐私合规（重点）",
      source: "EUR-Lex",
    },
  ],
  updates: [
    {
      title: "EDPB 发布 AI 与 GDPR 协调执行说明",
      kind: "监管声明",
      domain: "隐私合规（重点）",
      impact: "提高训练数据可追溯和合法性审查要求",
      source: "EDPB 官网",
      date: new Date().toLocaleDateString("zh-CN"),
    },
  ],
};

const state = load();

function load() {
  const saved = localStorage.getItem(KEY);
  if (!saved) return structuredClone(defaultData);
  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(defaultData);
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function isPrivacy(domain) {
  return domain.includes("隐私");
}

function renderClarifications() {
  const host = document.querySelector("#clarification-list");
  host.innerHTML = "";
  state.clarifications.forEach((item, idx) => {
    const row = document.createElement("label");
    row.className = "item";
    row.innerHTML = `
      <input type="checkbox" ${item.done ? "checked" : ""} data-idx="${idx}" />
      ${item.text}
      <span class="small">${item.done ? "已澄清" : "待澄清"}</span>
    `;
    host.appendChild(row);
  });

  host.querySelectorAll("input[type=checkbox]").forEach((box) => {
    box.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.idx);
      state.clarifications[idx].done = e.target.checked;
      save();
      renderClarifications();
    });
  });
}

function renderKnowledge() {
  const host = document.querySelector("#knowledge-list");
  host.innerHTML = "";
  state.knowledge.forEach((k) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(k.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>${k.title}</strong>
      <span class="badge">${k.type}</span>
      <span class="badge ${isPrivacy(k.domain) ? "privacy" : ""}">${k.domain}</span>
      <div class="small">法域：${k.jurisdiction} ｜ 来源：${k.source}</div>
    `;
    host.appendChild(div);
  });
}

function renderUpdates() {
  const host = document.querySelector("#updates-list");
  host.innerHTML = "";
  state.updates.forEach((u) => {
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
    host.textContent = "暂无动态。";
    return;
  }
  state.updates.forEach((u) => {
    const div = document.createElement("div");
    div.className = `item ${isPrivacy(u.domain) ? "privacy" : ""}`;
    div.innerHTML = `
      <strong>【时评】${u.title}</strong>
      <p class="small">总结：该动态属于“${u.kind}”，反映了 ${u.domain} 领域监管持续收紧与细化。</p>
      <p class="small">评价：建议将“${u.impact}”纳入下一轮内部合规行动，优先评估对模型训练、上线节奏和审计留痕的影响。</p>
    `;
    host.appendChild(div);
  });
}

function generateGlobalReport() {
  const total = state.updates.length;
  const privacyCount = state.updates.filter((u) => isPrivacy(u.domain)).length;
  const privacyRatio = total ? Math.round((privacyCount / total) * 100) : 0;
  const clarified = state.clarifications.filter((c) => c.done).length;

  document.querySelector("#global-report").innerHTML = `
    <p><strong>总体评估：</strong>当前共跟踪 ${total} 条监管动态，其中隐私合规相关 ${privacyCount} 条（${privacyRatio}%）。监管趋势表现为跨部门协同加强，隐私、竞争与消费者保护议题趋于融合。</p>
    <p><strong>合规风险：</strong>若训练数据来源治理、合法性证明、跨境传输评估不足，可能触发 GDPR 与成员国执法风险。</p>
    <p><strong>合规趋势：</strong>欧盟层面规则框架趋于明确，成员国执行尺度仍存在差异，建议采用“欧盟统一基线 + 国家差异补丁”的合规机制。</p>
    <p><strong>准备度：</strong>需求澄清完成度 ${clarified}/${state.clarifications.length}。建议在完成全部澄清项后，输出首版面向管理层的正式合规路线图。</p>
  `;
}

function bindForms() {
  document.querySelector("#knowledge-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    state.knowledge.unshift(Object.fromEntries(fd.entries()));
    e.target.reset();
    save();
    renderKnowledge();
  });

  document.querySelector("#update-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = Object.fromEntries(fd.entries());
    obj.date = new Date().toLocaleDateString("zh-CN");
    state.updates.unshift(obj);
    e.target.reset();
    save();
    renderUpdates();
    renderCommentary();
  });

  document.querySelector("#generate-global").addEventListener("click", generateGlobalReport);
}

function bindTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
    });
  });
}

bindTabs();
bindForms();
renderClarifications();
renderKnowledge();
renderUpdates();
renderCommentary();
