"use client";
import { useState, useEffect } from "react";
import { PageHeader, Section, Card } from "@/components/page-header";
import { toast } from "sonner";
import { useNotificationSettings, useUpdateNotificationSettings, useUpdatePassword } from "@/query/settings";

const SECTIONS = [
  "Personal",
  "Security",
  "Notifications",
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof SECTIONS)[number]>("Personal");

  return (
    <>
      <PageHeader
        title="Settings"
        description="Organization details, preferences, and security."
      />
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <nav className="text-sm space-y-1">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setTab(s)}
                  className={
                    "w-full text-left px-3 py-2 rounded-md " +
                    (tab === s
                      ? "bg-surface-muted font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-muted")
                  }
                >
                  {s}
                </button>
              ))}
            </nav>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {tab === "Personal" && <PersonalTab />}
            {tab === "Notifications" && <NotificationsTab />}
            {tab === "Security" && <SecurityTab />}
          </div>
        </div>
      </Section>
    </>
  );
}


function PersonalTab() {
  return (
    <Card title="Personal" description="Your personal information.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Personal information saved");
        }}
        className="space-y-4"
      >
        <Field
          label="Full Name"
          defaultValue="Pomegrid"
          type="text"
        />
        <Field label="Phone Number" defaultValue="08012345678" />
        <Field label="Email" defaultValue="" type="email" />
        <div className="pt-2">
          <button className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90">
            Save preferences
          </button>
        </div>
      </form>
    </Card>
  );
}

function NotificationsTab() {
  const { data: settings, isLoading } = useNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  const [prefs, setPrefs] = useState({
    budget: true,
    payroll: true,
    weekly: false,
  });

  useEffect(() => {
    if (settings) {
      setPrefs(settings);
    }
  }, [settings]);

  if (isLoading) {
    return (
      <Card title="Notifications" description="Choose when the console should email you.">
        <div className="py-4 text-sm text-muted-foreground">Loading preferences...</div>
      </Card>
    );
  }

  return (
    <Card
      title="Notifications"
      description="Choose when the console should email you."
    >
      <div className="space-y-3">
        <Toggle
          label="Budget threshold alerts"
          checked={prefs.budget}
          onChange={(v) => setPrefs({ ...prefs, budget: v })}
        />
        <Toggle
          label="Payroll reminders"
          checked={prefs.payroll}
          onChange={(v) => setPrefs({ ...prefs, payroll: v })}
        />
        <Toggle
          label="Weekly summary email"
          checked={prefs.weekly}
          onChange={(v) => setPrefs({ ...prefs, weekly: v })}
        />
      </div>
      <div className="pt-4">
        <button
          disabled={updateMutation.isPending}
          onClick={() => updateMutation.mutate(prefs)}
          className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </Card>
  );
}

function SecurityTab() {
  const updatePasswordMutation = useUpdatePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    updatePasswordMutation.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  return (
    <Card title="Security" description="Password and access.">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Field label="Current password" type="password" value={currentPassword} onChange={(e: any) => setCurrentPassword(e.target.value)} />
        <Field label="New password" type="password" value={newPassword} onChange={(e: any) => setNewPassword(e.target.value)} />
        <Field label="Confirm new password" type="password" value={confirmPassword} onChange={(e: any) => setConfirmPassword(e.target.value)} />
        <div className="pt-2">
          <button 
            type="submit"
            disabled={updatePasswordMutation.isPending}
            className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90 disabled:opacity-50"
          >
            {updatePasswordMutation.isPending ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  defaultValue,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 p-3 rounded-md border border-border">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={
          "relative h-5 w-9 rounded-full transition " +
          (checked ? "bg-brand" : "bg-muted")
        }
      >
        <span
          className={
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all " +
            (checked ? "left-4" : "left-0.5")
          }
        />
      </button>
    </label>
  );
}
