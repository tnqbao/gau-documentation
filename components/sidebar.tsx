"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Home,
  Server,
  Layers,
  GitBranch,
  Database,
  Network,
  Languages,
  Package
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  const navigation = [
    { name: t('nav.overview'), href: `/`, icon: Home },
    { name: t('nav.diagram'), href: `/diagram`, icon: Network },
    { name: t('nav.architecture'), href: `/architecture`, icon: Layers },
    { name: t('nav.technology'), href: `/technology`, icon: Server },
    { name: t('nav.services'), href: `/services`, icon: GitBranch },
    { name: t('nav.api'), href: `/api`, icon: BookOpen },
    { name: t('nav.products'), href: `/products`, icon: Package },
  ];

  const switchLanguage = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
  };

  return (
    <div className="flex h-full w-64 flex-col fixed left-0 top-0 border-r bg-card">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Gau Docs
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Microservices Documentation
        </p>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 mt-4">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => switchLanguage('vi')}
            className={cn(
              "px-2 py-1 text-xs rounded",
              i18n.language === 'vi'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            VI
          </button>
          <button
            onClick={() => switchLanguage('en')}
            className={cn(
              "px-2 py-1 text-xs rounded",
              i18n.language === 'en'
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            EN
          </button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
}
