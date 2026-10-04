const STORAGE_KEY = 'furat-water-station-v1';

const defaultSections = [
  { id: 'dashboard', name: 'الرئيسية', icon: '🏠', active: true },
  { id: 'employees', name: 'الموظفين', icon: '👥', active: true },
  { id: 'withdrawals', name: 'السحوبات', icon: '💰', active: true },
  { id: 'attendance', name: 'الحضور', icon: '📅', active: true },
  { id: 'reports', name: 'التقارير', icon: '📊', active: true },
  { id: 'special', name: 'السحوبات الخاصة', icon: '🎁', active: true },
  { id: 'settings', name: 'الإعدادات', icon: '⚙️', active: true },
];

const defaultSettings = {
  companyName: 'محطة مياه الفرات النموذجية',
  shortName: 'محطة الفرات',
  currency: 'د.ع',
  theme: 'blue',
  deductionType: 'percentage',
  deductionValue: 10,
  phone: '0770000000',
  address: 'النجف / العراق',
  footerText: 'جميع الحقوق محفوظة © 2026',
};

const defaultData = {
  settings: defaultSettings,
  sections: defaultSections,
  currentPage: 'dashboard',
  employees: [
    { id: 1, name: 'منير جاسم', job: 'سائق', salary: 600, phone: '0771111111', whatsapp: '964771111111', telegram: '@munir', birthDate: '1990-05-12', hireDate: '2020-01-10', status: 'active' },
    { id: 2, name: 'على راضي', job: 'مراقب', salary: 700, phone: '0772222222', whatsapp: '964772222222', telegram: '@ali', birthDate: '1994-02-14', hireDate: '2021-08-09', status: 'active' },
    { id: 3, name: 'حسين كاظم', job: 'عامل', salary: 550, phone: '0773333333', whatsapp: '964773333333', telegram: '@hussain', birthDate: '1995-11-08', hireDate: '2022-03-01', status: 'active' },
  ],
  withdrawals: [
    { id: 1, employeeId: 1, amount: 80, date: '2026-10-03', note: 'سحب شهر سبتمبر' },
    { id: 2, employeeId: 2, amount: 60, date: '2026-10-02', note: 'سحب طارئ' },
  ],
  attendance: [
    { id: 1, employeeId: 1, date: '2026-10-03', status: 'حضور', deduction: 0, note: '' },
    { id: 2, employeeId: 2, date: '2026-10-03', status: 'غياب', deduction: 70, note: 'غياب بدون عذر' },
    { id: 3, employeeId: 3, date: '2026-10-03', status: 'حضور', deduction: 0, note: '' },
  ],
  specialSubscribers: [
    { id: 1, name: 'حجي عبدالرزاق', phone: '0779999999', status: 'active' },
    { id: 2, name: 'مؤسسة النور', phone: '0778888888', status: 'active' },
  ],
  specialWithdrawals: [
    { id: 1, subscriberId: 1, amount: 200, date: '2026-10-01', paidBy: 'حسين', paymentMethod: 'حوالة', note: 'مشترك خاص' },
  ],
  backupHistory: [],
};

let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultData);

  try {
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(defaultData),
      ...parsed,
      settings: { ...structuredClone(defaultSettings), ...(parsed.settings || {}) },
      sections: Array.isArray(parsed.sections) && parsed.sections.length ? parsed.sections : structuredClone(defaultSections),
      employees: Array.isArray(parsed.employees) ? parsed.employees : [],
      withdrawals: Array.isArray(parsed.withdrawals) ? parsed.withdrawals : [],
      attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
      specialSubscribers: Array.isArray(parsed.specialSubscribers) ? parsed.specialSubscribers : [],
      specialWithdrawals: Array.isArray(parsed.specialWithdrawals) ? parsed.specialWithdrawals : [],
    };
  } catch (error) {
    return structuredClone(defaultData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showPage(pageId) {
  state.currentPage = pageId;
  saveState();
  renderApp();
}

function applyTheme() {
  const root = document.documentElement;
  const theme = state.settings.theme || 'blue';
  const palettes = {
    blue: { primary: '#1d4ed8', primary2: '#2563eb', accent: '#0ea5e9', bg: '#eef4ff' },
    green: { primary: '#15803d', primary2: '#16a34a', accent: '#10b981', bg: '#ecfdf5' },
    orange: { primary: '#ea580c', primary2: '#f59e0b', accent: '#f97316', bg: '#fff7ed' },
    purple: { primary: '#7c3aed', primary2: '#8b5cf6', accent: '#a78bfa', bg: '#f5f3ff' },
  };

  const c = palettes[theme] || palettes.blue;
  root.style.setProperty('--primary', c.primary);
  root.style.setProperty('--primary-2', c.primary2);
  root.style.setProperty('--accent', c.accent);
  root.style.setProperty('--bg', c.bg);
}

function currencyFormat(value) {
  const number = Number(value || 0);
  return `${number.toLocaleString('en-US')} ${state.settings.currency}`;
}

function calculateEmployeeBalance(employeeId) {
  const employee = state.employees.find((e) => e.id === Number(employeeId));
  if (!employee) return 0;

  const totalWithdrawals = state.withdrawals
    .filter((w) => Number(w.employeeId) === Number(employeeId))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalDeductions = state.attendance
    .filter((a) => Number(a.employeeId) === Number(employeeId) && a.status === 'غياب')
    .reduce((sum, item) => sum + Number(item.deduction || 0), 0);

  return Number(employee.salary) - totalWithdrawals - totalDeductions;
}

function getEmployeeById(employeeId) {
  return state.employees.find((emp) => Number(emp.id) === Number(employeeId)) || null;
}

function getSubscriberById(subscriberId) {
  return state.specialSubscribers.find((s) => Number(s.id) === Number(subscriberId)) || null;
}

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const activeSections = state.sections.filter((sec) => sec.active !== false);
  sidebar.innerHTML = `
    <div class="brand">
      <div class="brand-badge">💧</div>
      <div>
        <h1>${state.settings.companyName}</h1>
      </div>
    </div>
    <nav class="nav-list">
      ${activeSections.map((section) => `
        <button class="nav-btn ${state.currentPage === section.id ? 'active' : ''}" data-page="${section.id}">
          <div class="nav-icon">${section.icon || '•'}</div>
          <span>${section.name}</span>
        </button>
      `).join('')}
    </nav>
  `;

  sidebar.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => showPage(button.dataset.page));
  });
}

function renderDashboardPage() {
  const activeEmployees = state.employees.filter((e) => e.status !== 'inactive');
  const totalSalary = activeEmployees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
  const totalWithdrawals = state.withdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const totalSpecial = state.specialWithdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
  const totalAbsent = state.attendance.filter((a) => a.status === 'غياب').length;
  const totalDue = state.employees.reduce((sum, emp) => sum + calculateEmployeeBalance(emp.id), 0);

  return `
    <div class="page active">
      <div class="heading-row">
        <div>
          <h1>لوحة التحكم</h1>
          <div class="muted">${state.settings.companyName}</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">إجمالي الموظفين</div>
          <div class="value">${activeEmployees.length}</div>
        </div>
        <div class="stat-card">
          <div class="label">إجمالي الرواتب</div>
          <div class="value">${currencyFormat(totalSalary)}</div>
        </div>
        <div class="stat-card">
          <div class="label">إجمالي السحوبات</div>
          <div class="value">${currencyFormat(totalWithdrawals)}</div>
        </div>
        <div class="stat-card">
          <div class="label">الغياب</div>
          <div class="value">${totalAbsent}</div>
        </div>
        <div class="stat-card">
          <div class="label">السحوبات الخاصة</div>
          <div class="value">${currencyFormat(totalSpecial)}</div>
        </div>
        <div class="stat-card">
          <div class="label">المتبقي الكلي</div>
          <div class="value">${currencyFormat(totalDue)}</div>
        </div>
      </div>

      <div class="panel">
        <h3>ملخص سريع</h3>
        <div class="info-box">
          ${state.settings.companyName} يعمل بكفاءة، ويفضل مراجعة سجل الحضور اليومي لضمان سلامة خصومات الموظفين.
        </div>
      </div>
    </div>
  `;
}

function renderEmployeesPage() {
  const employees = [...state.employees].sort((a, b) => a.id - b.id);

  return `
    <div class="page active">
      <div class="heading-row">
        <h2>إدارة الموظفين</h2>
      </div>

      <div class="panel">
        <h3>إضافة موظف جديد</h3>
        <div class="form-grid">
          <div class="field">
            <label>رقم الموظف</label>
            <input id="empId" type="number" min="1" placeholder="مثال: 101">
          </div>
          <div class="field">
            <label>اسم الموظف</label>
            <input id="empName" type="text" placeholder="اسم الموظف">
          </div>
          <div class="field">
            <label>الوظيفة</label>
            <input id="empJob" type="text" placeholder="الوظيفة">
          </div>
          <div class="field">
            <label>الراتب (${state.settings.currency})</label>
            <input id="empSalary" type="number" min="0" placeholder="مثال: 600">
          </div>
          <div class="field">
            <label>رقم الهاتف</label>
            <input id="empPhone" type="text" placeholder="077xxxxxxx">
          </div>
          <div class="field">
            <label>واتساب</label>
            <input id="empWhatsapp" type="text" placeholder="9647xxxxxxx">
          </div>
          <div class="field">
            <label>تليجرام</label>
            <input id="empTelegram" type="text" placeholder="@username">
          </div>
          <div class="field">
            <label>تاريخ الميلاد</label>
            <input id="empBirth" type="date">
          </div>
          <div class="field">
            <label>تاريخ المباشرة</label>
            <input id="empHireDate" type="date">
          </div>
        </div>
        <div class="action-row">
          <button class="btn primary" data-action="add-employee">حفظ الموظف</button>
          <button class="btn" data-action="clear-employee-form">مسح النموذج</button>
        </div>
      </div>

      <div class="panel">
        <div class="heading-row">
          <h3>قائمة الموظفين</h3>
          <input id="employeeSearch" type="text" class="search-box" placeholder="بحث بالاسم أو الرقم" />
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>الرقم</th>
                <th>الاسم</th>
                <th>الوظيفة</th>
                <th>الراتب</th>
                <th>الحالة</th>
                <th>المتبقي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              ${employees.length ? employees.map((employee) => `
                <tr>
                  <td>${employee.id}</td>
                  <td>${employee.name}</td>
                  <td>${employee.job || '—'}</td>
                  <td>${currencyFormat(employee.salary)}</td>
                  <td>
                    <span class="badge ${employee.status === 'active' ? 'green' : 'red'}">
                      ${employee.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>${currencyFormat(calculateEmployeeBalance(employee.id))}</td>
                  <td>
                    <div class="btn-row">
                      <button class="btn" data-action="edit-employee" data-id="${employee.id}">تعديل</button>
                      <button class="btn danger" data-action="delete-employee" data-id="${employee.id}">حذف</button>
                    </div>
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="7" class="empty-state">لا توجد موظفين</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderWithdrawalsPage() {
  const withdrawalRows = [...state.withdrawals].sort((a, b) => b.date.localeCompare(a.date));

  return `
    <div class="page active">
      <div class="heading-row">
        <h2>السحوبات</h2>
      </div>

      <div class="panel">
        <h3>تسجيل سحب جديد</h3>
        <div class="form-grid">
          <div class="field">
            <label>الموظف</label>
            <select id="withdrawEmployee">
              <option value="">اختر موظفًا</option>
              ${state.employees.filter((e) => e.status === 'active').map((emp) => `
                <option value="${emp.id}">${emp.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="field">
            <label>المبلغ (${state.settings.currency})</label>
            <input id="withdrawAmount" type="number" min="1" placeholder="مثال: 80">
          </div>
          <div class="field">
            <label>التاريخ</label>
            <input id="withdrawDate" type="date" value="${new Date().toISOString().slice(0, 10)}">
          </div>
          <div class="field">
            <label>ملاحظة</label>
            <input id="withdrawNote" type="text" placeholder="ملاحظة اختيارية">
          </div>
        </div>
        <div class="action-row">
          <button class="btn primary" data-action="save-withdrawal">حفظ السحب</button>
          <button class="btn" data-action="clear-withdrawal-form">مسح</button>
        </div>
      </div>

      <div class="panel">
        <div class="heading-row">
          <h3>سجل السحوبات</h3>
          <input id="withdrawSearch" type="text" class="search-box" placeholder="بحث في السحوبات" />
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>الموظف</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
                <th>الملاحظة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              ${withdrawalRows.length ? withdrawalRows.map((w) => {
                const emp = getEmployeeById(w.employeeId);
                return `
                  <tr>
                    <td>${emp ? emp.name : 'غير معروف'}</td>
                    <td>${currencyFormat(w.amount)}</td>
                    <td>${w.date}</td>
                    <td>${w.note || '—'}</td>
                    <td><button class="btn danger" data-action="delete-withdrawal" data-id="${w.id}">حذف</button></td>
                  </tr>
                `;
              }).join('') : `<tr><td colspan="5" class="empty-state">لا توجد سحوبات</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAttendancePage() {
  const attendanceDate = new Date().toISOString().slice(0, 10);

  return `
    <div class="page active">
      <div class="heading-row">
        <h2>الحضور والغياب</h2>
      </div>

      <div class="panel">
        <div class="form-grid">
          <div class="field">
            <label>تاريخ الحضور</label>
            <input id="attendanceDate" type="date" value="${attendanceDate}">
          </div>
        </div>
        <div class="action-row">
          <button class="btn success" data-action="mark-all-present">تحديد الكل حاضر</button>
          <button class="btn warning" data-action="mark-all-absent">تحديد الكل غائب</button>
        </div>

        <div class="table-wrap" style="margin-top:16px;">
          <table>
            <thead>
              <tr>
                <th>الموظف</th>
                <th>الراتب</th>
                <th>الحالة</th>
                <th>الخصم</th>
                <th>الملاحظة</th>
              </tr>
            </thead>
            <tbody>
              ${state.employees.filter((e) => e.status === 'active').map((emp) => {
                const record = state.attendance.find((a) => Number(a.employeeId) === Number(emp.id) && a.date === attendanceDate) || null;
                const status = record ? record.status : 'حضور';
                const deduction = record ? Number(record.deduction || 0) : 0;
                const note = record ? (record.note || '') : '';

                return `
                  <tr>
                    <td>${emp.name}</td>
                    <td>${currencyFormat(emp.salary)}</td>
                    <td>
                      <select data-employee-id="${emp.id}" data-role="attendance-status">
                        <option value="حضور" ${status === 'حضور' ? 'selected' : ''}>حضور</option>
                        <option value="غياب" ${status === 'غياب' ? 'selected' : ''}>غياب</option>
                      </select>
                    </td>
                    <td>
                      <input type="number" min="0" data-employee-id="${emp.id}" data-role="attendance-deduction" value="${deduction}" style="max-width:120px;">
                    </td>
                    <td>
                      <input type="text" data-employee-id="${emp.id}" data-role="attendance-note" value="${note}" placeholder="ملاحظة">
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="action-row">
          <button class="btn primary" data-action="save-attendance">حفظ الحضور</button>
        </div>
      </div>
    </div>
  `;
}

function renderReportsPage() {
  const employees = state.employees.filter((emp) => emp.status === 'active');

  return `
    <div class="page active">
      <div class="heading-row">
        <h2>التقارير</h2>
      </div>

      <div class="panel">
        <div class="form-grid">
          <div class="field">
            <label>الموظف</label>
            <select id="reportEmployeeSelect">
              <option value="">اختر موظفًا</option>
              ${employees.map((emp) => `<option value="${emp.id}">${emp.name}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>الشهر</label>
            <input id="reportMonth" type="month" value="${new Date().toISOString().slice(0, 7)}">
          </div>
        </div>
        <div class="action-row">
          <button class="btn primary" data-action="generate-report">عرض التقرير</button>
        </div>
      </div>

      <div id="reportOutput" class="panel"></div>
    </div>
  `;
}

function renderSpecialPage() {
  const subscribers = [...state.specialSubscribers].sort((a, b) => a.name.localeCompare(b.name));
  const withdrawals = [...state.specialWithdrawals].sort((a, b) => b.date.localeCompare(a.date));

  return `
    <div class="page active">
      <div class="heading-row">
        <h2>السحوبات الخاصة</h2>
      </div>

      <div class="panel">
        <h3>إضافة مشترك جديد</h3>
        <div class="form-grid">
          <div class="field">
            <label>اسم المشترك</label>
            <input id="subscriberName" type="text" placeholder="اسم المشترك أو المؤسسة">
          </div>
          <div class="field">
            <label>رقم الهاتف</label>
            <input id="subscriberPhone" type="text" placeholder="077xxxxxxx">
          </div>
        </div>
        <div class="action-row">
          <button class="btn primary" data-action="add-subscriber">حفظ المشترك</button>
        </div>
      </div>

      <div class="panel">
        <h3>تسجيل سحب خاص</h3>
        <div class="form-grid">
          <div class="field">
            <label>المشترك</label>
            <select id="specialSubscriber">
              <option value="">اختر المشترك</option>
              ${subscribers.map((sub) => `<option value="${sub.id}">${sub.name}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>المبلغ (${state.settings.currency})</label>
            <input id="specialAmount" type="number" min="1" placeholder="مثال: 200">
          </div>
          <div class="field">
            <label>تاريخ السحب</label>
            <input id="specialDate" type="date" value="${new Date().toISOString().slice(0, 10)}">
          </div>
          <div class="field">
            <label>من أسدد</label>
            <input id="specialPaidBy" type="text" placeholder="اسم الشخص">
          </div>
          <div class="field">
            <label>طريقة الدفع</label>
            <select id="specialMethod">
              <option value="حوالة">حوالة</option>
              <option value="نقدي">نقدي</option>
              <option value="شيك">شيك</option>
              <option value="تسليم">تسليم</option>
            </select>
          </div>
          <div class="field">
            <label>ملاحظة</label>
            <input id="specialNote" type="text" placeholder="ملاحظة">
          </div>
        </div>
        <div class="action-row">
          <button class="btn primary" data-action="save-special-withdrawal">حفظ السحب الخاص</button>
        </div>
      </div>

      <div class="panel">
        <h3>سجل السحوبات الخاصة</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>المشترك</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
                <th>طريقة الدفع</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              ${withdrawals.length ? withdrawals.map((w) => {
                const subscriber = getSubscriberById(w.subscriberId);
                return `
                  <tr>
                    <td>${subscriber ? subscriber.name : 'غير معروف'}</td>
                    <td>${currencyFormat(w.amount)}</td>
                    <td>${w.date}</td>
                    <td>${w.paymentMethod}</td>
                    <td><button class="btn danger" data-action="delete-special-withdrawal" data-id="${w.id}">حذف</button></td>
                  </tr>
                `;
              }).join('') : `<tr><td colspan="5" class="empty-state">لا توجد بيانات</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsPage() {
  return `
    <div class="page active">
      <div class="heading-row">
        <h2>الإعدادات</h2>
      </div>

      <div class="panel">
        <h3>إعدادات الشركة</h3>
        <div class="form-grid">
          <div class="field">
            <label>اسم الشركة</label>
            <input id="companyName" type="text" value="${state.settings.companyName}">
          </div>
          <div class="field">
            <label>الاسم المختصر</label>
            <input id="shortName" type="text" value="${state.settings.shortName}">
          </div>
          <div class="field">
            <label>العملة</label>
            <input id="currency" type="text" value="${state.settings.currency}">
          </div>
          <div class="field">
            <label>السمة</label>
            <select id="theme">
              <option value="blue" ${state.settings.theme === 'blue' ? 'selected' : ''}>أزرق</option>
              <option value="green" ${state.settings.theme === 'green' ? 'selected' : ''}>أخضر</option>
              <option value="orange" ${state.settings.theme === 'orange' ? 'selected' : ''}>برتقالي</option>
              <option value="purple" ${state.settings.theme === 'purple' ? 'selected' : ''}>بنفسجي</option>
            </select>
          </div>
          <div class="field">
            <label>نوع الخصم</label>
            <select id="deductionType">
              <option value="percentage" ${state.settings.deductionType === 'percentage' ? 'selected' : ''}>نسبة مئوية</option>
              <option value="fixed" ${state.settings.deductionType === 'fixed' ? 'selected' : ''}>قيمة ثابتة</option>
            </select>
          </div>
          <div class="field">
            <label>قيمة الخصم</label>
            <input id="deductionValue" type="number" value="${state.settings.deductionValue}">
          </div>
          <div class="field">
            <label>الهاتف</label>
            <input id="companyPhone" type="text" value="${state.settings.phone}">
          </div>
          <div class="field">
            <label>العنوان</label>
            <input id="companyAddress" type="text" value="${state.settings.address}">
          </div>
        </div>
        <div class="action-row">
          <button class="btn primary" data-action="save-settings">حفظ الإعدادات</button>
        </div>
      </div>

      <div class="panel">
        <h3>إدارة الأقسام</h3>
        <div class="form-grid">
          <div class="field">
            <label>اسم القسم</label>
            <input id="newSectionName" type="text" placeholder="مثال: المخزون">
          </div>
          <div class="field">
            <label>الأيقونة</label>
            <input id="newSectionIcon" type="text" placeholder="🏪">
          </div>
        </div>
        <div class="action-row">
          <button class="btn primary" data-action="add-section">إضافة قسم</button>
        </div>

        <div class="table-wrap" style="margin-top:16px;">
          <table>
            <thead>
              <tr>
                <th>القسم</th>
                <th>الأيقونة</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              ${state.sections.map((section) => `
                <tr>
                  <td>${section.name}</td>
                  <td>${section.icon || '•'}</td>
                  <td>
                    <span class="badge ${section.active === false ? 'red' : 'green'}">
                      ${section.active === false ? 'مخفي' : 'مرئي'}
                    </span>
                  </td>
                  <td>
                    <button class="btn ${section.active === false ? 'success' : 'warning'}" data-action="toggle-section" data-id="${section.id}">
                      ${section.active === false ? 'إظهار' : 'إخفاء'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <h3>النسخ الاحتياطي والاستعادة</h3>
        <div class="action-row">
          <button class="btn primary" data-action="backup-data">إنشاء نسخة احتياطية</button>
          <label class="btn" for="restoreFileInput">استعادة نسخة</label>
          <input id="restoreFileInput" type="file" accept="application/json" style="display:none;">
          <button class="btn danger" data-action="reset-data">إعادة تعيين البيانات</button>
        </div>
      </div>
    </div>
  `;
}

function renderCurrentPage() {
  const app = document.getElementById('app');
  if (!app) return;

  const pageMap = {
    dashboard: renderDashboardPage(),
    employees: renderEmployeesPage(),
    withdrawals: renderWithdrawalsPage(),
    attendance: renderAttendancePage(),
    reports: renderReportsPage(),
    special: renderSpecialPage(),
    settings: renderSettingsPage(),
  };

  app.innerHTML = pageMap[state.currentPage] || renderDashboardPage();
  bindPageEvents();
}

function bindPageEvents() {
  const app = document.getElementById('app');
  if (!app) return;

  app.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const action = event.currentTarget.getAttribute('data-action');
      const id = event.currentTarget.getAttribute('data-id');

      switch (action) {
        case 'add-employee':
          addEmployee();
          break;
        case 'clear-employee-form':
          clearEmployeeForm();
          break;
        case 'edit-employee':
          editEmployee(Number(id));
          break;
        case 'delete-employee':
          deleteEmployee(Number(id));
          break;
        case 'save-withdrawal':
          saveWithdrawal();
          break;
        case 'clear-withdrawal-form':
          clearWithdrawalForm();
          break;
        case 'delete-withdrawal':
          deleteWithdrawal(Number(id));
          break;
        case 'mark-all-present':
          markAllAttendance('حضور');
          break;
        case 'mark-all-absent':
          markAllAttendance('غياب');
          break;
        case 'save-attendance':
          saveAttendance();
          break;
        case 'generate-report':
          generateReport();
          break;
        case 'add-subscriber':
          addSubscriber();
          break;
        case 'save-special-withdrawal':
          saveSpecialWithdrawal();
          break;
        case 'delete-special-withdrawal':
          deleteSpecialWithdrawal(Number(id));
          break;
        case 'save-settings':
          saveSettings();
          break;
        case 'add-section':
          addSection();
          break;
        case 'toggle-section':
          toggleSection(id);
          break;
        case 'backup-data':
          backupData();
          break;
        case 'reset-data':
          resetData();
          break;
        default:
          break;
      }
    });
  });

  const restoreInput = document.getElementById('restoreFileInput');
  if (restoreInput) {
    restoreInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      restoreData(file);
    });
  }

  const employeeSearch = document.getElementById('employeeSearch');
  if (employeeSearch) {
    employeeSearch.addEventListener('input', () => {
      const search = employeeSearch.value.toLowerCase();
      const rows = state.employees.filter((emp) => {
        return emp.name.toLowerCase().includes(search) || String(emp.id).includes(search);
      });

      const tbody = document.querySelector('#app tbody');
      if (!tbody) return;
      tbody.innerHTML = rows.length ? rows.map((employee) => `
        <tr>
          <td>${employee.id}</td>
          <td>${employee.name}</td>
          <td>${employee.job || '—'}</td>
          <td>${currencyFormat(employee.salary)}</td>
          <td>
            <span class="badge ${employee.status === 'active' ? 'green' : 'red'}">
              ${employee.status === 'active' ? 'نشط' : 'غير نشط'}
            </span>
          </td>
          <td>${currencyFormat(calculateEmployeeBalance(employee.id))}</td>
          <td>
            <div class="btn-row">
              <button class="btn" data-action="edit-employee" data-id="${employee.id}">تعديل</button>
              <button class="btn danger" data-action="delete-employee" data-id="${employee.id}">حذف</button>
            </div>
          </td>
        </tr>
      `).join('') : `<tr><td colspan="7" class="empty-state">لا توجد نتائج</td></tr>`;

      tbody.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', () => {
          const action = button.getAttribute('data-action');
          const id = Number(button.getAttribute('data-id'));
          if (action === 'edit-employee') editEmployee(id);
          if (action === 'delete-employee') deleteEmployee(id);
        });
      });
    });
  }

  const withdrawSearch = document.getElementById('withdrawSearch');
  if (withdrawSearch) {
    withdrawSearch.addEventListener('input', () => {
      const search = withdrawSearch.value.toLowerCase();
      const filtered = state.withdrawals.filter((w) => {
        const emp = getEmployeeById(w.employeeId);
        return (emp && emp.name.toLowerCase().includes(search)) || String(w.amount).includes(search) || (w.note || '').toLowerCase().includes(search);
      });

      const tbody = document.querySelectorAll('#app tbody')[1];
      if (!tbody) return;
      tbody.innerHTML = filtered.length ? filtered.map((w) => {
        const emp = getEmployeeById(w.employeeId);
        return `
          <tr>
            <td>${emp ? emp.name : 'غير معروف'}</td>
            <td>${currencyFormat(w.amount)}</td>
            <td>${w.date}</td>
            <td>${w.note || '—'}</td>
            <td><button class="btn danger" data-action="delete-withdrawal" data-id="${w.id}">حذف</button></td>
          </tr>
        `;
      }).join('') : `<tr><td colspan="5" class="empty-state">لا توجد نتائج</td></tr>`;
    });
  }

  // For attendance select changes, save immediate state before page rerender
  app.querySelectorAll('[data-role="attendance-status"]').forEach((select) => {
    select.addEventListener('change', () => {
      const employeeId = Number(select.dataset.employeeId);
      const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().slice(0, 10);
      const current = state.attendance.find((a) => Number(a.employeeId) === employeeId && a.date === date) || null;
      if (current) {
        current.status = select.value;
        current.deduction = select.value === 'غياب' ? Math.round(getEmployeeById(employeeId).salary * (state.settings.deductionValue / 100)) : 0;
      } else {
        state.attendance.push({
          id: Date.now() + Math.random(),
          employeeId,
          date,
          status: select.value,
          deduction: select.value === 'غياب' ? Math.round(getEmployeeById(employeeId).salary * (state.settings.deductionValue / 100)) : 0,
          note: '',
        });
      }
      saveState();
    });
  });

  app.querySelectorAll('[data-role="attendance-deduction"]').forEach((input) => {
    input.addEventListener('input', () => {
      const employeeId = Number(input.dataset.employeeId);
      const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().slice(0, 10);
      const record = state.attendance.find((a) => Number(a.employeeId) === employeeId && a.date === date); 
      if (record) record.deduction = Number(input.value || 0);
    });
  });

  app.querySelectorAll('[data-role="attendance-note"]').forEach((input) => {
    input.addEventListener('input', () => {
      const employeeId = Number(input.dataset.employeeId);
      const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().slice(0, 10);
      const record = state.attendance.find((a) => Number(a.employeeId) === employeeId && a.date === date);
      if (record) record.note = input.value;
    });
  });
}

function addEmployee() {
  const id = Number(document.getElementById('empId')?.value || 0);
  const name = document.getElementById('empName')?.value?.trim();
  const job = document.getElementById('empJob')?.value?.trim();
  const salary = Number(document.getElementById('empSalary')?.value || 0);

  if (!id || !name || !salary) {
    alert('يرجى إدخال رقم الموظف والاسم والراتب');
    return;
  }

  const exists = state.employees.some((emp) => Number(emp.id) === id);
  if (exists) {
    alert('رقم الموظف موجود بالفعل');
    return;
  }

  state.employees.push({
    id,
    name,
    job,
    salary,
    phone: document.getElementById('empPhone')?.value || '',
    whatsapp: document.getElementById('empWhatsapp')?.value || '',
    telegram: document.getElementById('empTelegram')?.value || '',
    birthDate: document.getElementById('empBirth')?.value || '',
    hireDate: document.getElementById('empHireDate')?.value || '',
    status: 'active',
  });

  saveState();
  renderApp();
  alert('تم إضافة الموظف بنجاح');
}

function clearEmployeeForm() {
  ['empId', 'empName', 'empJob', 'empSalary', 'empPhone', 'empWhatsapp', 'empTelegram', 'empBirth', 'empHireDate']
    .forEach((fieldId) => {
      const el = document.getElementById(fieldId);
      if (el) el.value = '';
    });
}

function deleteEmployee(employeeId) {
  if (!confirm('هل أنت متأكد من حذف الموظف؟')) return;
  state.employees = state.employees.filter((emp) => Number(emp.id) !== Number(employeeId));
  state.withdrawals = state.withdrawals.filter((w) => Number(w.employeeId) !== Number(employeeId));
  state.attendance = state.attendance.filter((a) => Number(a.employeeId) !== Number(employeeId));
  saveState();
  renderApp();
}

function editEmployee(employeeId) {
  const emp = getEmployeeById(employeeId);
  if (!emp) return;

  const newName = prompt('اسم الموظف الجديد', emp.name);
  if (newName === null) return;

  const newJob = prompt('الوظيفة الجديدة', emp.job || '');
  if (newJob === null) return;

  const newSalary = Number(prompt('الراتب الجديد', emp.salary) || emp.salary);
  if (Number.isNaN(newSalary)) return;

  emp.name = newName.trim();
  emp.job = newJob.trim();
  emp.salary = newSalary;
  saveState();
  renderApp();
  alert('تم تعديل بيانات الموظف');
}

function saveWithdrawal() {
  const employeeId = Number(document.getElementById('withdrawEmployee')?.value || 0);
  const amount = Number(document.getElementById('withdrawAmount')?.value || 0);
  const date = document.getElementById('withdrawDate')?.value || new Date().toISOString().slice(0, 10);
  const note = document.getElementById('withdrawNote')?.value || '';

  if (!employeeId || !amount) {
    alert('يرجى اختيار موظف وكتابة مبلغ صحيح');
    return;
  }

  state.withdrawals.push({
    id: Date.now(),
    employeeId,
    amount,
    date,
    note,
  });

  saveState();
  renderApp();
  alert('تم حفظ السحب بنجاح');
}

function clearWithdrawalForm() {
  const employee = document.getElementById('withdrawEmployee');
  if (employee) employee.value = '';
  const amount = document.getElementById('withdrawAmount');
  if (amount) amount.value = '';
  const note = document.getElementById('withdrawNote');
  if (note) note.value = '';
}

function deleteWithdrawal(withdrawalId) {
  if (!confirm('هل تريد حذف هذا السحب؟')) return;
  state.withdrawals = state.withdrawals.filter((w) => Number(w.id) !== Number(withdrawalId));
  saveState();
  renderApp();
}

function markAllAttendance(status) {
  const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().slice(0, 10);

  state.employees.filter((e) => e.status === 'active').forEach((emp) => {
    const existing = state.attendance.find((a) => Number(a.employeeId) === Number(emp.id) && a.date === date);
    const deduction = status === 'غياب' ? Math.round((Number(emp.salary) * Number(state.settings.deductionValue || 0)) / 100) : 0;

    if (existing) {
      existing.status = status;
      existing.deduction = deduction;
      existing.note = status === 'غياب' ? 'تم التحديد كغياب' : '';
    } else {
      state.attendance.push({
        id: Date.now() + Math.random(),
        employeeId: emp.id,
        date,
        status,
        deduction,
        note: status === 'غياب' ? 'تم التحديد كغياب' : '',
      });
    }
  });

  saveState();
  renderApp();
}

function saveAttendance() {
  app.querySelectorAll('[data-role="attendance-status"]').forEach((select) => {
    const employeeId = Number(select.dataset.employeeId);
    const date = document.getElementById('attendanceDate')?.value || new Date().toISOString().slice(0, 10);
    const noteInput = document.querySelector(`[data-role="attendance-note"][data-employee-id="${employeeId}"]`);
    const deductionInput = document.querySelector(`[data-role="attendance-deduction"][data-employee-id="${employeeId}"]`);
    const status = select.value;
    const deductionValue = Number(deductionInput?.value || 0);
    const note = noteInput?.value || '';

    const existing = state.attendance.find((a) => Number(a.employeeId) === employeeId && a.date === date);
    if (existing) {
      existing.status = status;
      existing.deduction = deductionValue;
      existing.note = note;
    } else {
      state.attendance.push({
        id: Date.now() + Math.random(),
        employeeId,
        date,
        status,
        deduction: deductionValue,
        note,
      });
    }
  });

  saveState();
  renderApp();
  alert('تم حفظ الحضور بنجاح');
}

function generateReport() {
  const employeeId = Number(document.getElementById('reportEmployeeSelect')?.value || 0);
  const month = document.getElementById('reportMonth')?.value || new Date().toISOString().slice(0, 7);
  const output = document.getElementById('reportOutput');
  if (!output) return;

  if (!employeeId) {
    output.innerHTML = '<div class="empty-state">اختر موظفًا لعرض التقرير</div>';
    return;
  }

  const employee = getEmployeeById(employeeId);
  if (!employee) {
    output.innerHTML = '<div class="empty-state">الموظف غير موجود</div>';
    return;
  }

  const filteredAttendance = state.attendance.filter((a) => Number(a.employeeId) === Number(employeeId) && a.date.startsWith(month));
  const totalWithdrawals = state.withdrawals.filter((w) => Number(w.employeeId) === Number(employeeId) && w.date.startsWith(month)).reduce((sum, item) => sum + Number(item.amount), 0);
  const totalDeductions = filteredAttendance.filter((a) => a.status === 'غياب').reduce((sum, item) => sum + Number(item.deduction || 0), 0);
  const finalBalance = employee.salary - totalWithdrawals - totalDeductions;

  output.innerHTML = `
    <h3>تقرير الموظف: ${employee.name}</h3>
    <div class="grid-2">
      <div class="stat-card">
        <div class="label">الراتب الأساسي</div>
        <div class="value">${currencyFormat(employee.salary)}</div>
      </div>
      <div class="stat-card">
        <div class="label">السحوبات</div>
        <div class="value">${currencyFormat(totalWithdrawals)}</div>
      </div>
      <div class="stat-card">
        <div class="label">الخصومات</div>
        <div class="value">${currencyFormat(totalDeductions)}</div>
      </div>
      <div class="stat-card">
        <div class="label">المتبقي</div>
        <div class="value">${currencyFormat(finalBalance)}</div>
      </div>
    </div>
    <div class="table-wrap" style="margin-top:16px;">
      <table>
        <thead>
          <tr>
            <th>التاريخ</th>
            <th>الحالة</th>
            <th>الخصم</th>
            <th>ملاحظة</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAttendance.length ? filteredAttendance.map((row) => `
            <tr>
              <td>${row.date}</td>
              <td>${row.status}</td>
              <td>${currencyFormat(row.deduction || 0)}</td>
              <td>${row.note || '—'}</td>
            </tr>
          `).join('') : `<tr><td colspan="4" class="empty-state">لا توجد بيانات لهذا الشهر</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function addSubscriber() {
  const name = document.getElementById('subscriberName')?.value?.trim();
  const phone = document.getElementById('subscriberPhone')?.value?.trim();
  if (!name) {
    alert('يرجى إدخال اسم المشترك');
    return;
  }

  state.specialSubscribers.push({
    id: Date.now(),
    name,
    phone,
    status: 'active',
  });

  saveState();
  renderApp();
  alert('تم إضافة المشترك بنجاح');
}

function saveSpecialWithdrawal() {
  const subscriberId = Number(document.getElementById('specialSubscriber')?.value || 0);
  const amount = Number(document.getElementById('specialAmount')?.value || 0);
  const date = document.getElementById('specialDate')?.value || new Date().toISOString().slice(0, 10);
  const paidBy = document.getElementById('specialPaidBy')?.value || '';
  const paymentMethod = document.getElementById('specialMethod')?.value || 'حوالة';
  const note = document.getElementById('specialNote')?.value || '';

  if (!subscriberId || !amount) {
    alert('يرجى اختيار المشترك وكتابة مبلغ صحيح');
    return;
  }

  state.specialWithdrawals.push({
    id: Date.now(),
    subscriberId,
    amount,
    date,
    paidBy,
    paymentMethod,
    note,
  });

  saveState();
  renderApp();
  alert('تم تسجيل السحب الخاص بنجاح');
}

function deleteSpecialWithdrawal(id) {
  if (!confirm('هل تريد حذف هذا السحب الخاص؟')) return;
  state.specialWithdrawals = state.specialWithdrawals.filter((item) => Number(item.id) !== Number(id));
  saveState();
  renderApp();
}

function saveSettings() {
  const settings = state.settings;

  settings.companyName = document.getElementById('companyName')?.value || settings.companyName;
  settings.shortName = document.getElementById('shortName')?.value || settings.shortName;
  settings.currency = document.getElementById('currency')?.value || settings.currency;
  settings.theme = document.getElementById('theme')?.value || settings.theme;
  settings.deductionType = document.getElementById('deductionType')?.value || settings.deductionType;
  settings.deductionValue = Number(document.getElementById('deductionValue')?.value || settings.deductionValue);
  settings.phone = document.getElementById('companyPhone')?.value || settings.phone;
  settings.address = document.getElementById('companyAddress')?.value || settings.address;

  saveState();
  applyTheme();
  renderApp();
  alert('تم حفظ إعدادات الشركة');
}

function addSection() {
  const name = document.getElementById('newSectionName')?.value?.trim();
  const icon = document.getElementById('newSectionIcon')?.value?.trim() || '📌';

  if (!name) {
    alert('يرجى إدخال اسم القسم');
    return;
  }

  const exists = state.sections.some((section) => section.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    alert('هذا القسم موجود بالفعل');
    return;
  }

  state.sections.push({
    id: `custom_${Date.now()}`,
    name,
    icon,
    active: true,
  });

  saveState();
  renderApp();
  alert('تم إضافة القسم بنجاح');
}

function toggleSection(sectionId) {
  const section = state.sections.find((item) => item.id === sectionId);
  if (!section) return;
  section.active = !section.active;
  saveState();
  renderApp();
}

function backupData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  alert('تم إنشاء نسخة احتياطية بنجاح');
}

function restoreData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const restored = JSON.parse(event.target.result);
      state = { ...structuredClone(defaultData), ...restored };
      saveState();
      renderApp();
      alert('تمت استعادة النسخة الاحتياطية بنجاح');
    } catch (error) {
      alert('الملف غير صالح');
    }
  };
  reader.readAsText(file);
}

function resetData() {
  const confirmed = confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟');
  if (!confirmed) return;

  state = structuredClone(defaultData);
  saveState();
  renderApp();
  alert('تمت إعادة تعيين البيانات');
}

function renderApp() {
  applyTheme();
  renderSidebar();
  renderCurrentPage();
}

renderApp();
