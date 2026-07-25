// Mock data for the Pomegrid Console dashboard.

export const monthlySpend = [
  { month: "Jan", budget: 12000, actual: 10450 },
  { month: "Feb", budget: 12000, actual: 11200 },
  { month: "Mar", budget: 12500, actual: 12800 },
  { month: "Apr", budget: 12500, actual: 11900 },
  { month: "May", budget: 13000, actual: 12300 },
  { month: "Jun", budget: 13000, actual: 12750 },
  { month: "Jul", budget: 13500, actual: 13100 },
  { month: "Aug", budget: 13500, actual: 12900 },
  { month: "Sep", budget: 14000, actual: 13650 },
  { month: "Oct", budget: 14000, actual: 13820 },
  { month: "Nov", budget: 14500, actual: 14100 },
  { month: "Dec", budget: 15000, actual: 9800 },
];

export const categoryBreakdown = [
  { name: "Salaries", value: 6200, color: "var(--color-chart-1)" },
  { name: "Logistics", value: 2100, color: "var(--color-chart-2)" },
  { name: "Utilities", value: 1450, color: "var(--color-chart-3)" },
  { name: "Marketing", value: 980, color: "var(--color-chart-4)" },
  { name: "Misc", value: 620, color: "var(--color-chart-5)" },
];

export const weeklyBurn = [
  { day: "Mon", spend: 420 },
  { day: "Tue", spend: 380 },
  { day: "Wed", spend: 640 },
  { day: "Thu", spend: 520 },
  { day: "Fri", spend: 890 },
  { day: "Sat", spend: 310 },
  { day: "Sun", spend: 190 },
];

export const workers = [
  { id: "W-001", name: "Amaka Obi", role: "Operations Lead", status: "Active", salary: 1800, joined: "2023-04-12" },
  { id: "W-002", name: "Tunde Bello", role: "Driver", status: "Active", salary: 900, joined: "2023-08-02" },
  { id: "W-003", name: "Chinwe Eze", role: "Accountant", status: "Active", salary: 1500, joined: "2024-01-15" },
  { id: "W-004", name: "Femi Adeyemi", role: "Warehouse", status: "On leave", salary: 850, joined: "2024-03-10" },
  { id: "W-005", name: "Kemi Johnson", role: "Sales", status: "Active", salary: 1200, joined: "2024-06-22" },
  { id: "W-006", name: "Ibrahim Musa", role: "Driver", status: "Active", salary: 900, joined: "2025-01-05" },
  { id: "W-007", name: "Grace Okon", role: "Customer Support", status: "Active", salary: 1050, joined: "2025-03-19" },
];

export const recentExpenses = [
  { id: "EXP-1042", date: "2026-07-20", category: "Logistics", vendor: "Fastlane Freight", amount: 320, status: "Paid" },
  { id: "EXP-1041", date: "2026-07-19", category: "Utilities", vendor: "PowerCo", amount: 210, status: "Paid" },
  { id: "EXP-1040", date: "2026-07-18", category: "Marketing", vendor: "Meta Ads", amount: 480, status: "Pending" },
  { id: "EXP-1039", date: "2026-07-17", category: "Salaries", vendor: "Payroll Jul-A", amount: 3100, status: "Paid" },
  { id: "EXP-1038", date: "2026-07-16", category: "Misc", vendor: "Office Supplies", amount: 95, status: "Paid" },
  { id: "EXP-1037", date: "2026-07-15", category: "Logistics", vendor: "Fastlane Freight", amount: 280, status: "Paid" },
];

export const kpis = {
  monthlyBudget: 14500,
  spentThisMonth: 9820,
  activeWorkers: 6,
  reportsGenerated: 24,
};
