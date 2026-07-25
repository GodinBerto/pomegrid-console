"use client";
import { PageHeader, Section, Card } from "@/components/page-header";
import { UserPlus, Search, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { StatusPill } from "../dashboard/page";
import { useWorkers, useCreateWorker, useUpdateWorker, useDeleteWorker } from "@/query/workers";
import { Worker } from "@/api/workers";

export default function WorkersPage() {
  const { data: workers = [], isLoading } = useWorkers();
  const createWorker = useCreateWorker();
  const updateWorker = useUpdateWorker();
  const deleteWorker = useDeleteWorker();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    status: "Active",
    salary: "",
    joined: new Date().toISOString().slice(0, 10),
  });

  const filtered = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(q.toLowerCase()) ||
      w.role.toLowerCase().includes(q.toLowerCase()) ||
      w.id.toLowerCase().includes(q.toLowerCase()),
  );
  const totalPayroll = workers.reduce((s, w) => s + Number(w.salary || 0), 0);

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      name: "",
      role: "",
      status: "Active",
      salary: "",
      joined: new Date().toISOString().slice(0, 10),
    });
    setOpen(true);
  };

  const handleOpenEdit = (w: Worker) => {
    setEditingId(w.id);
    setForm({
      name: w.name,
      role: w.role,
      status: w.status || "Active",
      salary: String(w.salary),
      joined: w.joined || new Date().toISOString().slice(0, 10),
    });
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sal = Number(form.salary);
    if (!form.name.trim() || !form.role.trim() || !sal) {
      toast.error("Please fill name, role and salary.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      status: form.status,
      salary: sal,
      joined: form.joined,
    };

    if (editingId) {
      updateWorker.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => setOpen(false),
        }
      );
    } else {
      createWorker.mutate(payload, {
        onSuccess: () => setOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this worker?")) {
      deleteWorker.mutate(id);
    }
  };

  return (
    <>
      <PageHeader
        title="Workers"
        actions={
          <button
            onClick={handleOpenNew}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
          >
            <UserPlus className="h-3.5 w-3.5" /> Add worker
          </button>
        }
      />
      <Section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Total workers" value={String(workers.length)} />
          <Stat
            label="Active"
            value={String(workers.filter((w) => w.status === "Active").length)}
            tone="brand"
          />
          <Stat
            label="Monthly payroll"
            value={`$${totalPayroll.toLocaleString()}`}
            tone="info"
          />
        </div>

        <div className="mt-6">
          <Card
            title="Roster"
            action={
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search workers…"
                  className="h-8 pl-8 pr-3 rounded-md border border-border bg-surface text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </div>
            }
          >
            <div className="-mx-5 -my-5">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left font-medium px-5 py-2.5">ID</th>
                    <th className="text-left font-medium px-5 py-2.5">Name</th>
                    <th className="text-left font-medium px-5 py-2.5">Role</th>
                    <th className="text-left font-medium px-5 py-2.5">
                      Status
                    </th>
                    <th className="text-left font-medium px-5 py-2.5">
                      Joined
                    </th>
                    <th className="text-right font-medium px-5 py-2.5">
                      Salary
                    </th>
                    <th className="text-right font-medium px-5 py-2.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted-foreground">Loading...</td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((w) => (
                      <tr
                        key={w.id}
                        className="border-b border-border last:border-0 hover:bg-surface-muted group"
                      >
                        <td className="px-5 py-3 font-mono text-xs">{w.id}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-linear-to-br from-brand to-info text-white text-xs font-semibold flex items-center justify-center">
                              {w.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="font-medium">{w.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {w.role}
                        </td>
                        <td className="px-5 py-3">
                          <StatusPill status={w.status} />
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {w.joined}
                        </td>
                        <td className="px-5 py-3 text-right font-medium">
                          ${Number(w.salary).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(w)}
                              className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface border border-transparent hover:border-border"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(w.id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md border border-transparent hover:border-destructive/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted-foreground">No workers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit worker" : "Add worker"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update team member details." : "Add a new team member to the roster."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium">Full name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Amaka Obi"
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium">Role</span>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Driver"
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Status</span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  <option value="Active">Active</option>
                  <option value="On leave">On leave</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium">
                  Monthly salary (USD)
                </span>
                <input
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  placeholder="0"
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Joined</span>
                <input
                  type="date"
                  value={form.joined}
                  onChange={(e) => setForm({ ...form, joined: e.target.value })}
                  className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>
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
                disabled={createWorker.isPending || updateWorker.isPending}
                className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
              >
                {editingId ? "Save changes" : "Add worker"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "brand" | "info";
}) {
  const c =
    tone === "brand" ? "text-brand" : tone === "info" ? "text-info" : "";
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={"mt-1.5 text-2xl font-semibold tracking-tight " + c}>
        {value}
      </p>
    </div>
  );
}
