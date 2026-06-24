const CATEGORIES = {
  "Access & Identity": [
    { key: "mfa_email", label: "MFA on email", points: 3 },
    { key: "mfa_banking", label: "MFA on business banking", points: 3 },
    { key: "mfa_accounting", label: "MFA on accounting software", points: 3 },
    { key: "mfa_payment", label: "MFA on payment processing", points: 3 },
    { key: "mfa_cloud", label: "MFA on cloud storage", points: 3 },
    { key: "password_manager", label: "Team uses a password manager", points: 3 },
    { key: "no_shared_passwords", label: "No shared passwords", points: 2 },
    { key: "admin_limited", label: "Admin access limited to 1–2 people", points: 3 },
    { key: "offboarding_24h", label: "Accounts disabled within 24h of exit", points: 3 },
    { key: "vendor_review", label: "Vendor logins reviewed quarterly", points: 2 },
  ],
  "Data Protection": [
    { key: "backups_exist", label: "Automated backups exist", points: 3 },
    { key: "backups_tested", label: "Backup restore tested within last 90 days", points: 3 },
    { key: "devices_encrypted", label: "Company devices encrypted", points: 3 },
    { key: "sensitive_pos_only", label: "Customer card data stays in POS only", points: 3 },
  ],
  "Network & Endpoint": [
    { key: "av_edr_all", label: "Antivirus/EDR on every device", points: 3 },
    { key: "guest_wifi_segment", label: "Guest Wi-Fi separate from business Wi-Fi", points: 3 },
    { key: "patches_14d", label: "OS/browser updates within 14 days", points: 3 },
  ],
  "Financial & Payment": [
    { key: "card_not_present_pci", label: "Phone/online payments PCI-compliant", points: 2 },
    { key: "banking_dual_approval", label: "Bank requires dual approval for wires/ACH", points: 2 },
  ],
  "Human Factor": [
    { key: "annual_training", label: "Cybersecurity training at least annually", points: 2 },
    { key: "recover_72h", label: "Can resume operations within 72 hours if hit tonight", points: 2 },
  ],
  "Insurance & Docs": [
    { key: "cyber_insurance", label: "Carry cyber insurance", points: 2 },
    { key: "incident_response_doc", label: "Have a 1-page incident response contact list", points: 2 },
  ],
};

const CAT_MAX = {
  "Access & Identity": 26,
  "Data Protection": 12,
  "Network & Endpoint": 9,
  "Financial & Payment": 4,
  "Human Factor": 4,
  "Insurance & Docs": 4,
};

function computeScore(form) {
  let total = 0;
  const cats = {};
  for (const [cat, items] of Object.entries(CATEGORIES)) {
    let pts = 0;
    for (const item of items) {
      if (form.has(item.key)) pts += item.points;
    }
    cats[cat] = Math.min(pts, CAT_MAX[cat]);
    total += cats[cat];
  }
  total = Math.min(total, 59);
  const scaled = Math.round((total / 59) * 40);

  let tier, color;
  if (scaled >= 32) { tier = "Low"; color = "#10b981"; }
  else if (scaled >= 22) { tier = "Moderate"; color = "#f59e0b"; }
  else if (scaled >= 11) { tier = "High"; color = "#f97316"; }
  else { tier = "Critical"; color = "#ef4444"; }

  return { total: scaled, tier, color, categories: cats };
}

function renderResult(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());
  const score = computeScore(form);

  document.getElementById("result").style.display = "block";
  document.getElementById("score-tier").textContent = score.tier + " Risk";
  document.getElementById("score-tier").style.color = score.color;
  document.getElementById("score-tier").style.borderColor = score.color + "80";
  document.getElementById("score-tier").style.background = score.color + "18";
  document.getElementById("score-num").textContent = score.total + " / 40";
  document.getElementById("score-bar-fill").style.width = (score.total / 40 * 100) + "%";
  document.getElementById("score-bar-fill").style.background =
    "linear-gradient(90deg, " + score.color + ", " + score.color + "cc)";

  const list = document.getElementById("cat-breakdown");
  list.innerHTML = "";
  for (const [cat, pts] of Object.entries(score.categories)) {
    const row = document.createElement("div");
    row.className = "cat-row";
    row.innerHTML = `<div><strong>${cat}</strong></div><div>${pts} / ${CAT_MAX[cat]}</div>`;
    list.appendChild(row);
  }

  // fixes
  const fixes = [
    { t: "Quick Win", d: "Enable MFA on your primary business email and banking.", c: "$0–50" },
    { t: "This Week", d: "Deploy a team password manager and remove shared credentials.", c: "$100–300" },
    { t: "This Month", d: "Implement offline/cloud backup testing with documented restore runs.", c: "$300–800" },
  ];
  const fixesEl = document.getElementById("fixes");
  fixesEl.innerHTML = fixes.map(f => `
    <div class="fix">
      <div class="fix-head"><span class="fix-tag">${f.t}</span><span class="fix-cost">${f.c}</span></div>
      <div class="fix-body">${f.d}</div>
    </div>
  `).join("");

  // mailto
  const subject = encodeURIComponent("Book my 30-minute Cyber Health Check walkthrough");
  document.getElementById("book-btn").href = `mailto:${CONFIG.owner_email}?subject=${subject}`;

  e.target.reset();
  window.scrollTo({ top: document.getElementById("result").offsetTop - 20, behavior: "smooth" });
}

const CONFIG = {
  owner_name: "[Your Name]",
  owner_phone: "[Phone]",
  owner_website: "[Website]",
  owner_email: "you@example.com",
};

document.getElementById("year").textContent = new Date().getFullYear();
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("health-form").addEventListener("submit", renderResult);
});
