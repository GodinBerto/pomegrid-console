# Todo 
- Check the toast component and fix it to make it work.
- finish implimenting the endpoints for the rest  of the pages. 
- if the user is not logged in dont bother fetching the /me endpoint to get the use details.
- Remove the roles page or comment it out
- make sure the update for the expenses work. create the modal if not present.


## Settings Page
- this is the backend use it to finish the settings page.
"""
@console_bp.route("/settings/personal", methods=["GET"])
@jwt_required()
def get_personal_settings():
    user_id = get_authenticated_user_id()
    try:
        conn, cursor = db_connection()
        cursor.execute("SELECT full_name, phone, email FROM Users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify(envelope(None, "User not found", 404, False)), 404
            
        return jsonify(envelope(dict(row), "Personal settings fetched")), 200
    except Exception as e:
        return jsonify(envelope(None, str(e), 500, False)), 500

@console_bp.route("/settings/personal", methods=["PUT"])
@jwt_required()
def update_personal_settings():
    user_id = get_authenticated_user_id()
    data = request.get_json() or {}
    
    full_name = data.get("full_name")
    phone = data.get("phone")
    email = data.get("email")
    
    if not full_name or not email:
        return jsonify(envelope(None, "Full name and email are required", 400, False)), 400
        
    try:
        conn, cursor = db_connection()
        cursor.execute(
            "UPDATE Users SET full_name = ?, phone = ?, email = ? WHERE id = ?",
            (full_name, phone, email, user_id)
        )
        conn.commit()
        return jsonify(envelope(None, "Personal information updated successfully")), 200
    except Exception as e:
        if "UNIQUE constraint failed" in str(e):
            return jsonify(envelope(None, "Email already in use", 409, False)), 409
        return jsonify(envelope(None, str(e), 500, False)), 500

@console_bp.route("/settings/security", methods=["PUT"])
@jwt_required()
def update_security_settings():
    user_id = get_authenticated_user_id()
    data = request.get_json() or {}
    
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    
    if not current_password or not new_password:
        return jsonify(envelope(None, "Both current and new passwords are required", 400, False)), 400
        
    try:
        conn, cursor = db_connection()
        cursor.execute("SELECT password_hash FROM Users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify(envelope(None, "User not found", 404, False)), 404
            
        if not verify_password(row["password_hash"], current_password):
            return jsonify(envelope(None, "Invalid current password", 400, False)), 400
            
        new_hashed = hash_password(new_password)
        cursor.execute("UPDATE Users SET password_hash = ? WHERE id = ?", (new_hashed, user_id))
        conn.commit()
        
        return jsonify(envelope(None, "Password updated successfully")), 200
    except Exception as e:
        return jsonify(envelope(None, str(e), 500, False)), 500

@console_bp.route("/settings/notifications", methods=["GET"])
@jwt_required()
def get_notification_settings():
    user_id = get_authenticated_user_id()
    try:
        conn, cursor = db_connection()
        cursor.execute("SELECT setting_id, enabled FROM user_notification_preferences WHERE user_id = ?", (user_id,))
        rows = cursor.fetchall()
        
        # Default settings if none exist
        prefs = {
            "budget": True,
            "payroll": True,
            "weekly": False
        }
        for row in rows:
            if row["setting_id"] in prefs:
                prefs[row["setting_id"]] = bool(row["enabled"])
                
        return jsonify(envelope(prefs, "Notification preferences fetched")), 200
    except Exception as e:
        return jsonify(envelope(None, str(e), 500, False)), 500

@console_bp.route("/settings/notifications", methods=["PUT"])
@jwt_required()
def update_notification_settings():
    user_id = get_authenticated_user_id()
    data = request.get_json() or {}
    
    # We expect keys like 'budget', 'payroll', 'weekly' with boolean values
    try:
        conn, cursor = db_connection()
        for key in ["budget", "payroll", "weekly"]:
            if key in data:
                val = 1 if data[key] else 0
                # Upsert preference
                cursor.execute(
                    """
                    INSERT INTO user_notification_preferences (user_id, setting_id, enabled, updated_at)
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(user_id, setting_id) DO UPDATE SET
                    enabled = excluded.enabled,
                    updated_at = excluded.updated_at
                    """,
                    (user_id, key, val)
                )
        conn.commit()
        return jsonify(envelope(None, "Notification preferences updated")), 200
    except Exception as e:
        return jsonify(envelope(None, str(e), 500, False)), 500

"""

## Analytics Page
- @console_bp.route("/analytics", methods=["GET"])
@jwt_required()
def get_analytics():
    try:
        conn, cursor = db_connection()
        
        # We need data for the last 12 months for Budget Efficiency and Monthly Savings
        # For SQLite, we can just fetch all budgets and spendings and do it in Python
        cursor.execute("SELECT month, year, sum(budget_amount) as total FROM Console_Monthly_Budgets GROUP BY year, month")
        budgets_data = cursor.fetchall()
        
        # expenses grouped by YYYY-MM
        cursor.execute("SELECT substr(expense_date, 1, 7) as ym, sum(amount) as total FROM Console_Expenses WHERE status = 'paid' GROUP BY substr(expense_date, 1, 7)")
        expenses_data = cursor.fetchall()
        
        # Create a mapping of YYYY-MM to budget and actual
        monthly_map = {}
        for b in budgets_data:
            ym = f"{b['year']:04d}-{b['month']:02d}"
            monthly_map[ym] = {"budget": b["total"], "actual": 0.0}
            
        for e in expenses_data:
            ym = e["ym"]
            if ym not in monthly_map:
                monthly_map[ym] = {"budget": 0.0, "actual": 0.0}
            monthly_map[ym]["actual"] = e["total"]
            
        # Calculate Efficiency (on-target months)
        total_months = len(monthly_map)
        on_target = sum(1 for m in monthly_map.values() if m["actual"] <= m["budget"] and m["budget"] > 0)
        efficiency_pct = int((on_target / total_months) * 100) if total_months > 0 else 0
        
        efficiency_data = [
            {"name": "Efficiency", "value": efficiency_pct, "fill": "var(--color-chart-1)"}
        ]
        
        # Calculate Savings per month (sort by YYYY-MM)
        sorted_ym = sorted(monthly_map.keys())[-12:] # Last 12 months
        savings_data = []
        for ym in sorted_ym:
            month_name = datetime.strptime(ym, "%Y-%m").strftime("%b")
            m = monthly_map[ym]
            savings_data.append({
                "month": month_name,
                "budget": m["budget"],
                "actual": m["actual"]
            })
            
        # Category momentum
        cursor.execute("SELECT category_name as name, sum(amount) as value FROM Console_Expenses WHERE status = 'paid' GROUP BY category_name")
        categories_db = cursor.fetchall()
        colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]
        category_momentum = []
        for i, c in enumerate(categories_db):
            name = c["name"] or "Uncategorized"
            category_momentum.append({
                "name": name,
                "value": c["value"],
                "color": colors[i % len(colors)]
            })
            
        # Weekly rhythm
        cursor.execute("SELECT substr(expense_date, 9, 2) as day, sum(amount) as total FROM Console_Expenses WHERE status = 'paid' GROUP BY substr(expense_date, 9, 2) ORDER BY substr(expense_date, 9, 2) DESC LIMIT 7")
        weekly_db = cursor.fetchall()
        weekly_rhythm = []
        for w in reversed(weekly_db):
            weekly_rhythm.append({
                "day": w["day"],
                "spend": w["total"]
            })
            
        data = {
            "efficiency": efficiency_data,
            "savings": savings_data,
            "category_momentum": category_momentum,
            "weekly_rhythm": weekly_rhythm
        }
        
        return jsonify(envelope(data, "Analytics fetched successfully")), 200
        
    except Exception as e:
        return jsonify(envelope(None, str(e), 500, False)), 500

