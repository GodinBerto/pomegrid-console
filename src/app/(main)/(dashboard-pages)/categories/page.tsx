"use client";
import { useState } from "react";
import { PageHeader, Section, Card } from "@/components/page-header";
import { Plus, Trash2, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/query/categories";
import { Category } from "@/api/categories";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, description: c.description || "" });
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      updateCategory.mutate(
        { id: editingId, payload: { name: form.name, description: form.description } },
        {
          onSuccess: () => setOpen(false),
        }
      );
    } else {
      createCategory.mutate(
        { name: form.name, description: form.description },
        {
          onSuccess: () => setOpen(false),
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage expense categories for the organization."
        actions={
          <button
            onClick={handleOpenNew}
            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90"
          >
            <Plus className="h-3.5 w-3.5" /> New category
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
                  <th className="text-left font-medium px-5 py-2.5">Description</th>
                  <th className="text-right font-medium px-5 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-muted-foreground">Loading...</td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0 hover:bg-surface-muted"
                    >
                      <td className="px-5 py-3 font-medium">{c.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.description || "-"}</td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-muted-foreground">No categories found.</td>
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
            <DialogTitle>{editingId ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the details below." : "Create a new category for tracking expenses."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                rows={3}
              />
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
                disabled={createCategory.isPending || updateCategory.isPending}
                className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
              >
                {editingId ? "Save changes" : "Create category"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
