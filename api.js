/**
 * api.js — single place the rest of the site talks to for data.
 *
 * Right now every function resolves from MOCK data so the pages are
 * fully clickable with no backend. When the Apps Script Web App exists,
 * only this file needs to change: swap each function's body for a
 * fetch() call to APPS_SCRIPT_URL and keep the same return shape.
 *
 * Expected Web App contract (for later):
 *   POST {action:"getPeople"}                -> Employees + DATABASE rows
 *   POST {action:"getMyTasks", email}         -> rows for one person
 *   POST {action:"createTask", ...fields}     -> new Delegation Raised row
 *   POST {action:"updateStatus", ...fields}   -> new STATUS row
 *   POST {action:"rejectTask", ...fields}     -> new Rejected Tasks row
 */

const APPS_SCRIPT_URL = ""; // fill in once the Web App is deployed

const MOCK_PEOPLE = [
  { name: "ARUN", email: "alphaanalyticssolutions@gmail.com", department: "IT", role: "Manager", active: true },
  { name: "YASH", email: "alphaanalyticssolutions@gmail.com", department: "ADMIN", role: "Admin", active: true },
  { name: "ANKIT", email: "alphaanalyticssolutions@gmail.com", department: "Sales", role: "Manager", active: true },
  { name: "AJAY", email: "alphaanalyticssolutions@gmail.com", department: "Data Analysis & Science", role: "Manager", active: true },
  { name: "AVINASH", email: "happytheking111@gmail.com", department: "IT", role: "Employee", active: true },
  { name: "YOGESH", email: "happytheking111@gmail.com", department: "IT", role: "Employee", active: true },
  { name: "AMAN", email: "happytheking111@gmail.com", department: "IT", role: "Employee", active: false },
  { name: "KIRTI", email: "happytheking111@gmail.com", department: "Data Analysis & Science", role: "Employee", active: true },
  { name: "AKANSHA", email: "happytheking111@gmail.com", department: "Data Analysis & Science", role: "Employee", active: true },
  { name: "RITIKA", email: "happytheking111@gmail.com", department: "IT", role: "Employee", active: true },
  { name: "RASHMI", email: "happytheking111@gmail.com", department: "HR", role: "Employee", active: true },
  { name: "VIVEK", email: "happytheking111@gmail.com", department: "Data Analysis & Science", role: "Employee", active: true },
  { name: "ARJUN", email: "happytheking111@gmail.com", department: "Sales", role: "Employee", active: true },
  { name: "JULI", email: "happytheking111@gmail.com", department: "Finance", role: "Employee", active: true }
];

const MOCK_TASKS = [
  { taskId: "TSK-0002", delegatedBy: "YASH", delegatedTo: "RITIKA", task: "testing2", planDate: "24-Oct-2026", priority: "High", status: "On Hold", department: "ADMIN", daysOverdue: 9 },
  { taskId: "TSK-0003", delegatedBy: "AJAY", delegatedTo: "KIRTI", task: "Clean Dataset accurately", planDate: "23-Oct-2026", priority: "Urgent", status: "In Progress", department: "Data Analysis & Science", daysOverdue: 10 },
  { taskId: "TSK-0004", delegatedBy: "ANKIT", delegatedTo: "ARJUN", task: "Contact with Marketing Team and find the exact problem why our sales is decreasing day by day", planDate: "26-Oct-2026", priority: "High", status: "Pending", department: "Sales", daysOverdue: 10, remarks: "I need report in monday" },
  { taskId: "TSK-0006", delegatedBy: "YASH", delegatedTo: "AKANSHA", task: "Come to my cabin with your complain", planDate: "23-Oct-2026", priority: "Urgent", status: "Pending", department: "ADMIN", daysOverdue: 10 },
  { taskId: "TSK-0015", delegatedBy: "AJAY", delegatedTo: "KIRTI", task: "testing", planDate: "26-Oct-2026", priority: "Urgent", status: "Completed", department: "Data Analysis & Science", daysOverdue: 0 }
];

function delay(value) {
  return new Promise(resolve => setTimeout(() => resolve(value), 200));
}

const Api = {
  getPeople() {
    return delay(MOCK_PEOPLE);
  },

  getTasksFor(name) {
    return delay(MOCK_TASKS.filter(t => t.delegatedTo === name));
  },

  getAllTasks() {
    return delay(MOCK_TASKS);
  },

  createTask(fields) {
    const taskId = "TSK-" + String(1000 + MOCK_TASKS.length).slice(-4);
    MOCK_TASKS.push({ ...fields, taskId, status: "Pending", daysOverdue: 0 });
    return delay({ success: true, taskId });
  },

  updateStatus(fields) {
    const row = MOCK_TASKS.find(t => t.taskId === fields.taskId);
    if (row) Object.assign(row, fields);
    return delay({ success: true });
  },

  rejectTask(fields) {
    const row = MOCK_TASKS.find(t => t.taskId === fields.taskId);
    if (row) row.status = "Rejected";
    return delay({ success: true });
  }
};

function statusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "status-completed";
  if (s === "on hold") return "status-hold";
  if (s === "in progress") return "status-progress";
  if (s.includes("overdue")) return "status-overdue";
  return "status-pending";
}

function priorityBadgeClass(priority) {
  return "priority-" + (priority || "medium").toLowerCase();
}

function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}
