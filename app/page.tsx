"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services, techStacks, infrastructureComponents } from "@/lib/data";
import { TechLogo } from "@/components/TechLogo";
import { Server, Shield, Mail, Image, Upload } from "lucide-react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

const getServiceIcon = (name: string) => {
  if (name.includes("account")) return Server;
  if (name.includes("authorization")) return Shield;
  if (name.includes("cdn")) return Image;
  if (name.includes("upload")) return Upload;
  if (name.includes("email")) return Mail;
  return Server;
};

export default function HomePage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            {t('home.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{t('home.servicesOverview')}</h2>
          <p className="text-muted-foreground">
            {t('home.servicesDescription', { count: services.length })}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.name);
            return (
              <Card key={service.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {t(`common.${service.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {service.description[i18n.language as 'vi' | 'en']}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('common.port')}: {service.port}</span>
                    <Link
                      href={service.repository}
                      target="_blank"
                      className="text-primary hover:underline"
                    >
                      {t('common.viewRepository')}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{t('home.techStack')}</h2>
          <p className="text-muted-foreground">
            {t('home.techStackDescription')}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {techStacks.map((stack) => (
            <Card key={stack.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TechLogo
                    tech={stack.category.toLowerCase().replace(/\s+/g, '')}
                    size="md"
                  />
                  {t(`techStacks.${stack.category.toLowerCase().replace(/\s+&\s+/g, '').replace(/\s+/g, '')}`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {stack.items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <TechLogo
                        tech={item.name.toLowerCase().replace(/\s+/g, '').replace('.', '')}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description[i18n.language as 'vi' | 'en']}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Infrastructure Overview */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">{t('home.infrastructureOverview')}</h2>
          <p className="text-muted-foreground">
            {t('home.infrastructureDescription')}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {infrastructureComponents.map((component) => (
            <Card key={component.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <TechLogo
                    tech={component.name.toLowerCase().replace(/\s+/g, '')}
                    size="sm"
                  />
                  <div>
                    <CardTitle className="text-base">{component.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {component.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {component.description[i18n.language as 'vi' | 'en']}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Navigation */}
      <section>
        <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {t('nav.overview')}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/products" className="group">
                <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 group-hover:bg-white/80 dark:group-hover:bg-gray-800/80 transition-colors text-center">
                  <TechLogo tech="products" size="md" className="mx-auto mb-3" />
                  <h4 className="font-semibold">{t('nav.products')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('products.subtitle')}
                  </p>
                </div>
              </Link>

              <Link href="/diagram" className="group">
                <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 group-hover:bg-white/80 dark:group-hover:bg-gray-800/80 transition-colors text-center">
                  <TechLogo tech="kubernetes" size="md" className="mx-auto mb-3" />
                  <h4 className="font-semibold">{t('nav.diagram')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('infrastructure.subtitle')}
                  </p>
                </div>
              </Link>

              <Link href="/technology" className="group">
                <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 group-hover:bg-white/80 dark:group-hover:bg-gray-800/80 transition-colors text-center">
                  <TechLogo tech="go" size="md" className="mx-auto mb-3" />
                  <h4 className="font-semibold">{t('nav.technology')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('technology.description')}
                  </p>
                </div>
              </Link>

              <Link href="/services" className="group">
                <div className="p-4 rounded-lg bg-white/60 dark:bg-gray-800/60 group-hover:bg-white/80 dark:group-hover:bg-gray-800/80 transition-colors text-center">
                  <TechLogo tech="microservices" size="md" className="mx-auto mb-3" />
                  <h4 className="font-semibold">{t('nav.services')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('services.description')}
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
