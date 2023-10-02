import { Sidebar } from "@/components/modules/dashboard/settings/sidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-row space-x-8">
            <Sidebar className="w-1/5" />
            <div className="bg-background w-full rounded-xl p-8">{children}</div>
        </div>
    );
}
