"use client";
import { useState } from "react";
import { PageHeader, Section, Card } from "@/components/page-header";
import { toast } from "sonner";

const SECTIONS = [
  "Organization",
  "Preferences",
  "Notifications",
  "Security",
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof SECTIONS)[number]>("Organization");

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
            {tab === "Organization" && <OrganizationTab />}
            {tab === "Preferences" && <PreferencesTab />}
            {tab === "Notifications" && <NotificationsTab />}
            {tab === "Security" && <SecurityTab />}
          </div>
        </div>
      </Section>
    </>
  );
}

function OrganizationTab() {
  return (
    <>
      <Card
        title="Organization"
        description="These details identify Pomegrid inside the console."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Organization saved");
          }}
          className="space-y-4"
        >
          <Field label="Business name" defaultValue="Pomegrid" />
          <Field
            label="Contact email"
            defaultValue="admin@pomegrid.com"
            type="email"
          />
          <Field label="Address" defaultValue="12 Marina Rd, Lagos" />
          <div className="pt-2">
            <button className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90">
              Save changes
            </button>
          </div>
        </form>
      </Card>
      <Card title="Danger zone" description="Irreversible actions.">
        <button
          onClick={() =>
            toast.error("Organization archive is disabled in demo.")
          }
          className="h-9 px-4 rounded-md border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5"
        >
          Archive organization
        </button>
      </Card>
    </>
  );
}

function PreferencesTab() {
  return (
    <Card title="Preferences" description="Currency, fiscal, and formatting.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Preferences saved");
        }}
        className="space-y-4"
      >
        <Field label="Currency" defaultValue="USD" />
        <Field
          label="Fiscal month start (day)"
          defaultValue="1"
          type="number"
        />
        <Field label="Timezone" defaultValue="Africa/Lagos" />
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
  const [prefs, setPrefs] = useState({
    budget: true,
    payroll: true,
    weekly: false,
  });
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
          onClick={() => toast.success("Notifications saved")}
          className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90"
        >
          Save
        </button>
      </div>
    </Card>
  );
}

function SecurityTab() {
  return (
    <Card title="Security" description="Password and access.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Password updated");
        }}
        className="space-y-4"
      >
        <Field label="Current password" defaultValue="" type="password" />
        <Field label="New password" defaultValue="" type="password" />
        <Field label="Confirm new password" defaultValue="" type="password" />
        <div className="pt-2">
          <button className="h-9 px-4 rounded-md bg-brand text-brand-foreground text-sm font-medium hover:bg-brand/90">
            Update password
          </button>
        </div>
      </form>
    </Card>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
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
