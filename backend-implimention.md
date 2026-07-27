# Todo 1
- [ ] Fix the proxy @src/proxy.ts: it is supposed to control page routing like if the user is in the dashboard and logged in he wont be able to go to the loggin page and vise versa. Pushing the user to not-found page if there is no page like that in the system.
- [ ] Fix the apiclient @src/lib/apiClient.ts: make sure all the zustand stores and the use of cookies aare all implimented. and fix the vite import to nextjs imports.
- [ ] Use the api client @src/lib/apiClient.ts to call the backend
- [ ] When consuming the backend, it should first be called in the @src/api then use react-query to cache the data in the @src/query. Example: @src/api/products.ts which should call the backend and then use react-query to cache the data in the @src/query/products.ts
- [ ] when calling a protected route and the user is not logged in send the back to the login page also if the user is logged in and his token has expired go back and get a new access token from the refresh-token endpoints maning if there is no token in the cookies send the user back to the login page.
- [ ] Make sure the calling of endpoints are not done twice.
- [ ] This app is for only authorized people only so if not logged in no user can access it.
- [ ] Create an env files and use if for stuff like base url and not the backend urls
- [ ] When consuming always check the response of the backend to know what is needed.


# Endpoints

## Auth Endpoints
Login: /auth/login
Logout: /auth/logout
Refresh Token: /auth/refresh-token
Get User: /auth/me

## Dashboard Endpoints
Overview: /console/overview
overview-budget-chart: /console/overview-budget-chart
recent expenses: /console/recent-expenses
weekly burn chart: /weekly-burn-chart

## Expenses Endpoints
Expenses: /console/expenses
create expense: /console/expenses
Update expense: /console/expenses/<expense_id>
Details of an expense: /console/expenses/<expense_id>
Delete expense: /console/expenses/<expense_id>
Updated Expenses Status: /console/expenses/<exp_id>/status

## Categories Endpoints
Note for the categories, create a page in the dashboard for it. Nothing big just a table and a button to add a new category or update an existing one.

Create Category: /console/categories
Update Category: /console/categories/<category_id>
Delete Category: /console/categories/<category_id>
Categories: /console/categories
Get single category: /console/categories/<category_id>

## Budget Endpoints
Note for the budget, it is inside the expenses page at this section( Monthly Budget).

Update Budget: /console/budget
Get Budget: /console/budget

## Report Endpoints

### Expense Reports CRUD

Create Expense Report: /console/expense-reports
Get All Expense Reports: /console/expense-reports
Get Expense Report Details: /console/expense-reports/<report_id>
Update Expense Report: /console/expense-reports/<report_id>
Delete Expense Report: /console/expense-reports/<report_id>

### Reports

Get All Reports: /console/reports
Get Report Details: /console/reports/<report_id>
Download Report: /console/reports/<report_id>/download
Print Report: /console/reports/<report_id>/print

### Report Types

Monthly Expense Summary: /console/reports/monthly-expense-summary
Payroll Register: /console/reports/payroll-register
Budget vs Actual: /console/reports/budget-vs-actual
Vendor Spend: /console/reports/vendor-spend
Cash Burn: /console/reports/cash-burn
Tax Ready Ledger: /console/reports/tax-ready-ledger

### Export Reports

Export PDF: /console/reports/pdf
Export CSV: /console/reports/csv
Printable Report: /console/reports/print

## Reports Page

- Create a new **Reports** page inside the dashboard.
- The page should contain:
  - A table listing all generated expense reports.
  - A button to create a new report.
  - Actions for each report:
    - View
    - Update
    - Delete
    - Download
    - Print
- Above the table, include cards or buttons that allow users to quickly generate:
  - Monthly Expense Summary
  - Payroll Register
  - Budget vs Actual
  - Vendor Spend
  - Cash Burn
  - Tax Ready Ledger
- Include export buttons for:
  - Export as PDF
  - Export as CSV
  - Printable View
- Use the backend endpoints provided above instead of generating report data on the frontend.


## User Roles Endpoints

**Important:** After the authenticated user is fetched using the **Get User** endpoint (`/auth/me`), immediately fetch that user's role using the **Get Current User Roles** endpoint (`/console/roles/user`). The authenticated user's role should be available globally so it can be used for route protection, permissions, and UI visibility throughout the application.

### User Roles CRUD

Create User Role: /console/roles

Get Current User Roles (Authenticated User): /console/roles/user

Get All User Roles: /console/roles

Get User Role Details: /console/roles/<role_id>

Update User Role: /console/roles/<role_id>

Delete User Role: /console/roles/<role_id>

## User Roles Page

Create a **Roles** page inside the dashboard.

The page should contain:

- A table listing all user roles.
- A button to assign a role to a user.
- Ability to:
  - View a role.
  - Update a role.
  - Delete a role.
- Use the backend endpoints above for all CRUD operations.

## Authentication & Role Flow

After a successful login:

1. Save the authentication tokens.
2. Fetch the authenticated user using:
   - `/auth/me`
3. Immediately fetch the authenticated user's role(s) using:
   - `/console/roles/user`
4. Store both the authenticated user and their role(s) in the authentication store.
5. The application should not consider initialization complete until both the user and their role(s) have been successfully loaded.
6. If either request fails because authentication is invalid, redirect the user to the login page.
7. If the access token has expired, refresh it before retrying the requests.

The authenticated user's role should be globally available for:

- Route protection.
- Permission checks.
- Conditional rendering.
- Navigation visibility.
- Feature access.
- API authorization logic where applicable.

Never hardcode roles in the frontend. Always use the values returned by the backend.

## API & React Query

Create:

```
src/api/roles.ts
src/query/roles.ts
```

Rules:

- Use the shared `ApiClient`.
- Never call backend endpoints directly from components.
- Cache role data with React Query.
- Invalidate the appropriate queries after creating, updating, or deleting a role.
- Avoid duplicate requests.
- Respect authentication and automatic token refresh.
- All URLs must come from environment variables.

## Expected Initialization Order

```text
Application Starts
        │
        ▼
Check Authentication
        │
        ▼
Refresh Token (if needed)
        │
        ▼
Get Authenticated User (/auth/me)
        │
        ▼
Get Current User Role(s) (/console/roles/user)
        │
        ▼
Store User + Role(s) in Zustand
        │
        ▼
Render Protected Application
```

## Authorization

Every protected page should verify that:

- The user is authenticated.
- The user's role has been loaded.
- Required permissions are satisfied before rendering the page.

If authentication fails, redirect to the login page.

If the user does not have permission to access a page or feature, display an appropriate **Unauthorized (403)** page instead of rendering the content.

## Workers Endpoints

### Workers CRUD

Create Worker: /console/workers

Get All Workers: /console/workers

Get Worker Details: /console/workers/<worker_id>

Update Worker: /console/workers/<worker_id>

Delete Worker: /console/workers/<worker_id>

## Workers Page

Create a **Workers** page inside the dashboard.

The page should contain:

- A table listing all workers.
- A button to add a new worker.
- A search input to search workers by name.
- Filters for:
  - Status
  - Role
- Pagination if the number of workers becomes large.

Each worker row should display at least:

- Full Name
- Role
- Status
- Email
- Phone Number
- Salary
- Joined Date
- Last Updated

Each row should have actions for:

- View
- Edit
- Delete

## Worker Form

The Create/Edit Worker form should contain the following fields:

- Full Name (Required)
- Role
- Status
- Email
- Phone
- Salary
- Joined Date
- Left Date (Edit only when applicable)

Validate all required fields before submitting.

Display backend validation errors when provided.

## Worker Details Page

Create a details page for a worker that displays all worker information returned by the backend.

Include quick actions to:

- Edit Worker
- Delete Worker

## API & React Query

Create:

```
src/api/workers.ts
src/query/workers.ts
```

## Response Format

Always inspect the backend response before implementing the frontend.

Do not assume the response structure. The backend follows a standard API envelope similar to:

```ts
{
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
}
```

Only use the `data` property when displaying information in the UI.

## Folder Structure

```
src/
├── api/
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── expenses.ts
│   ├── categories.ts
│   ├── budget.ts
│   └── reports.ts
│
├── query/
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── expenses.ts
│   ├── categories.ts
│   ├── budget.ts
│   └── reports.ts
```

# Backend Data Models

The following database models already exist on the backend.

**Do not create, modify, or generate database tables or migrations.**

These models are provided only so the frontend knows the structure of the data returned by the API.

---

## User

The User model already exists.

Use it where referenced by other models.

Do not modify it.

---

## User Roles

The User Roles model references the User model using `user_id`.

### Fields

- id (UUID)
- user_id
- role
- created_at
- updated_at

### Available Roles

- admin
- super admin
- manager
- worker

### Role Permissions

**admin**

- Can perform every action.

**super admin**

- Can perform every action except creating another super admin.

**manager**

- Can perform every action except creating managers and super admins.

**worker**

- Can only create workers.

The frontend should use the authenticated user's role to determine:

- Navigation visibility
- Route protection
- Component visibility
- Available actions
- Permission checks

Never hardcode permissions outside this role system.

---

## Categories

### Fields

- id
- name
- description
- created_by
- created_at
- updated_at

---

## Expenses

### Fields

- id
- expense_number
- category_id
- category_name
- vendor_name
- amount
- description
- expense_date
- status
- created_by
- created_at
- updated_at

### Status Values

- pending
- paid
- rejected
- void

The `expense_number` is generated by the backend.

Example:

```
EXP-999999
```

The frontend should never generate or edit this value.

---

## Monthly Budgets

### Fields

- id
- year
- month
- budget_amount
- created_at

---

## Expense Reports

### Fields

- id
- title
- report_type
- generated_by
- generated_at
- file_url

---

## Workers

### Fields

- id
- full_name
- role
- status
- email
- phone
- salary
- joined_date
- left_date
- created_at
- updated_at

### Status Values

- active
- on_leave

---

# Frontend Notes

These models are the source of truth for the frontend.

When building pages, forms, tables, filters, and details pages if those pages or modals are not built yet:

- Assume these are the fields returned by the backend.
- Always inspect the backend response before consuming it.
- Never assume additional fields exist.
- Do not generate IDs, timestamps, expense numbers, or other server-generated values.
- Treat nullable fields (such as `email`, `phone`, and `left_date`) accordingly.