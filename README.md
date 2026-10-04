* {
  box-sizing: border-box;
}

:root {
  --bg: #eef4ff;
  --panel: #ffffff;
  --panel-soft: #f7faff;
  --sidebar: #0f172a;
  --sidebar-text: #e5eefc;
  --primary: #1d4ed8;
  --primary-2: #2563eb;
  --accent: #0ea5e9;
  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #dc2626;
  --text: #14213d;
  --muted: #5b6b84;
  --line: #dfe7f3;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  --radius: 18px;
}

body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, sans-serif;
  background: var(--bg);
  color: var(--text);
}

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: linear-gradient(180deg, var(--sidebar) 0%, #0b1220 100%);
  color: var(--sidebar-text);
  padding: 20px 14px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 10px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  margin-bottom: 16px;
}

.brand-badge {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.1);
  font-size: 22px;
}

.brand h1 {
  margin: 0;
  font-size: 1.05rem;
}

.brand small {
  opacity: 0.75;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: transparent;
  border: none;
  color: var(--sidebar-text);
  padding: 11px 12px;
  border-radius: 12px;
  text-align: right;
  transition: 0.2s ease;
}

.nav-btn:hover,
.nav-btn.active {
  background: rgba(255,255,255,0.08);
  transform: translateX(-2px);
}

.danger-btn {
  margin-top: 12px;
  background: rgba(220, 38, 38, 0.12);
}

.nav-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.08);
}

.main-content {
  flex: 1;
  padding: 24px;
}

.page {
  display: none;
}

.page.active {
  display: block;
}

.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 18px;
  margin-bottom: 18px;
}

.heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.heading-row h2,
.heading-row h3,
.heading-row h1 {
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
}

.stat-card {
  background: linear-gradient(135deg, #f8fbff 0%, #edf5ff 100%);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
}

.stat-card .label {
  color: var(--muted);
  font-size: 0.85rem;
}

.stat-card .value {
  font-size: 1.8rem;
  font-weight: 800;
  margin-top: 8px;
}

.grid-2,
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 600;
}

input, select, textarea {
  width: 100%;
  border: 1px solid var(--line);
  background: #fff;
  padding: 11px 12px;
  color: var(--text);
  border-radius: 12px;
  outline: none;
  transition: 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.08);
}

textarea {
  min-height: 90px;
  resize: vertical;
}

.btn-row,
.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.btn {
  border: none;
  background: #e9eefb;
  color: var(--text);
  padding: 10px 16px;
  font-weight: 700;
  border-radius: 12px;
  transition: 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn.primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: white;
}

.btn.success {
  background: var(--success);
  color: #fff;
}

.btn.warning {
  background: var(--warning);
  color: #fff;
}

.btn.danger {
  background: var(--danger);
  color: #fff;
}

.full-width {
  width: 100%;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

thead th {
  background: #f4f8ff;
  color: var(--muted);
  text-align: right;
  font-size: 0.85rem;
  padding: 12px 10px;
}

tbody td {
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
  white-space: nowrap;
}

.badge {
  display: inline-block;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge.green {
  background: rgba(22, 163, 74, 0.1);
  color: var(--success);
}

.badge.red {
  background: rgba(220, 38, 38, 0.1);
  color: var(--danger);
}

.badge.orange {
  background: rgba(245, 158, 11, 0.12);
  color: var(--warning);
}

.badge.blue {
  background: rgba(37, 99, 235, 0.12);
  color: var(--primary);
}

.empty-state {
  text-align: center;
  color: var(--muted);
  padding: 30px 10px;
}

.info-box {
  background: linear-gradient(135deg, #eef8ff 0%, #f7faff 100%);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
  color: var(--muted);
}

.muted {
  color: var(--muted);
}

.search-box {
  min-width: 220px;
}

.login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  padding: 24px;
}

.login-card {
  width: min(420px, 100%);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 28px 20px;
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-direction: column;
}

.login-brand h2 {
  margin: 0;
  font-size: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

@media (max-width: 980px) {
  .app-shell {
    flex-direction: column;
  }

  .sidebar {
    position: relative;
    width: 100%;
    height: auto;
  }

  .main-content {
    padding: 18px;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 12px;
  }

  .panel {
    padding: 14px;
  }
}
