"use client";
import { useState } from "react";
import { PageHeader, Section, Card } from "@/components/page-header";
import { Shield, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRoles, useAssignRole } from "@/query/roles";
import { toast } from "sonner";

export default function RolesPage() {
  const { data: users = [], isLoading } = useRoles();
  const assignRole = useAssignRole();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    user_id: "",
    role: "User",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_id.trim()) {
      toast.error("Please provide a user ID");
      return;
    }

    assignRole.mutate(
      { user_id: form.user_id, role: form.role },
      {
        onSuccess: () => {
          setOpen(false);
          setForm({ user_id: "", role: "User" });
        },
      }
    );
  };

  return (
    <>
      <PageHeader
        title="User Roles"
        description="Manage users and their assigned roles in the system."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
          >
            <Shield className="h-3.5 w-3.5" /> Assign role
          </button>
        }
      />
      <Section>
        <Card>
          <div className="-mx-5 -my-5">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Name</th>
                  <th className="text-left font-medium px-5 py-2.5">Email</th>
                  <th className="text-left font-medium px-5 py-2.5">Role</th>
                  <th className="text-left font-medium px-5 py-2.5">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted-foreground">Loading...</td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-border last:border-0 hover:bg-surface-muted"
                    >
                      <td className="px-5 py-3 font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${u.role.toLowerCase() === 'admin' ? 'bg-brand/10 text-brand' : 'bg-surface-muted text-foreground'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{u.created_at || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted-foreground">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to an existing user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium">User ID</span>
              <input
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                placeholder="Enter user ID..."
                required
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Role</span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </label>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 px-4 rounded-md border border-border text-sm hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assignRole.isPending}
                className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
              >
                {assignRole.isPending ? "Assigning..." : "Assign role"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
