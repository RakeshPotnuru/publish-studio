"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { Button } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { Icons } from "@/assets/icons";
import { NewAssetDialog } from "@/components/modules/dashboard/assets/new-asset";
import { NewFolderDialog } from "@/components/modules/dashboard/folders/new-folder";
import { NewProject } from "@/components/modules/dashboard/projects/new-project";
import { siteConfig } from "@/config/site";

type SidebarProps = React.HTMLAttributes<HTMLElement>;

const settings = [
  {
    label: siteConfig.pages.settings.appearance.title,
    icon: <Icons.Appearance />,
    link: siteConfig.pages.settings.appearance.link,
  },
  {
    label: siteConfig.pages.settings.connections.title,
    icon: <Icons.Connections />,
    link: siteConfig.pages.settings.connections.link,
  },
  {
    label: siteConfig.pages.settings.security.title,
    icon: <Icons.Security />,
    link: siteConfig.pages.settings.security.link,
  },
  {
    label: siteConfig.pages.settings.billing.title,
    icon: <Icons.Billing />,
    link: siteConfig.pages.settings.billing.link,
  },
];

export function Sidebar({ className, ...props }: Readonly<SidebarProps>) {
  const segment = useSelectedLayoutSegment();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-row bg-background border-r",
        className,
      )}
      {...props}
    >
      <div className="space-y-2 p-4">
        {segment === "settings" ? (
          <>
            {settings.map((setting) => (
              <SidebarItem
                key={setting.link}
                label={setting.label}
                link={setting.link}
                icon={setting.icon}
              />
            ))}
          </>
        ) : (
          <>
            <SidebarItem
              label={siteConfig.pages.dashboard.title}
              link={siteConfig.pages.dashboard.link}
              icon={<Icons.Dashboard />}
            />
            <SidebarWithCreateShell>
              <div className="w-3/4">
                <SidebarItem
                  label={siteConfig.pages.projects.title}
                  link={siteConfig.pages.projects.link}
                  icon={<Icons.Projects />}
                />
              </div>
              <NewProject enableTooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="create new project"
                >
                  <Icons.Add />
                </Button>
              </NewProject>
            </SidebarWithCreateShell>
            <SidebarWithCreateShell>
              <div className="w-3/4">
                <SidebarItem
                  label={siteConfig.pages.folders.title}
                  link={siteConfig.pages.folders.link}
                  icon={<Icons.Folders />}
                />
              </div>
              <NewFolderDialog enableTooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="create new folder"
                >
                  <Icons.Add />
                </Button>
              </NewFolderDialog>
            </SidebarWithCreateShell>
            <SidebarWithCreateShell>
              <div className="w-3/4">
                <SidebarItem
                  label={siteConfig.pages.assets.title}
                  link={siteConfig.pages.assets.link}
                  icon={<Icons.Assets />}
                />
              </div>
              <NewAssetDialog enableTooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="upload new asset"
                >
                  <Icons.Add />
                </Button>
              </NewAssetDialog>
            </SidebarWithCreateShell>
            <SidebarItem
              label={siteConfig.pages.snippets.title}
              link={siteConfig.pages.snippets.link}
              icon={<Icons.Snippets />}
            />
            <SidebarItem
              label={siteConfig.pages.planner.title}
              link={siteConfig.pages.planner.link}
              icon={<Icons.Planner />}
            />
          </>
        )}
      </div>
    </aside>
  );
}

const SidebarItem = ({
  label,
  link,
  icon,
  ...props
}: {
  label: string;
  link: string;
  icon: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) => {
  const path = usePathname();
  const segment = useSelectedLayoutSegment();

  return (
    <div>
      <Link
        href={link}
        className={cn(
          "flex w-full cursor-pointer flex-row items-center space-x-4 rounded-lg px-4 py-2 font-medium",
          {
            "bg-primary text-background":
              path === link ||
              (link === "/" && !path) ||
              segment === label.toLowerCase(),
            "hover:bg-accent": path !== link && (link !== "/" || path),
          },
        )}
        {...props}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </div>
  );
};

function SidebarWithCreateShell({
  children,
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return <div className="flex flex-row items-center space-x-2">{children}</div>;
}
