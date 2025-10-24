"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { techStacks } from "@/lib/data";
import { TechLogo, TechShowcase } from "@/components/TechLogo";
import { useTranslation } from 'react-i18next';
import { Code, Database, MessageSquare, HardDrive, Package, Activity, Shield } from "lucide-react";

// Icon mapping for category titles
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "backend": return Code;
    case "database": return Database;
    case "message queue": return MessageSquare;
    case "storage": return HardDrive;
    case "container & orchestration": return Package;
    case "monitoring & logging": return Activity;
    case "authentication": return Shield;
    default: return Code;
  }
};

export default function TechnologyPage() {
  const { t, i18n } = useTranslation();

  // Technology mapping for logo display
  const techMapping: Record<string, string> = {
    'Go': 'go',
    'Gin': 'gin',
    'Node.js': 'nodejs',
    'TypeScript': 'typescript',
    'PostgreSQL': 'postgresql',
    'Redis': 'redis',
    'RabbitMQ': 'rabbitmq',
    'Cloudflare R2': 'cloudflareR2',
    'Docker': 'docker',
    'K3s': 'k3s',
    'Grafana': 'grafana',
    'Loki': 'loki',
    'Tempo': 'tempo',
    'Prometheus': 'prometheus',
    'JWT': 'jwt'
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('technology.title')}</h1>
        <p className="text-xl text-muted-foreground">
          {t('technology.description')}
        </p>
      </div>

      {/* Tech Stack Overview */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold">{t('home.techStack')}</h2>

        {techStacks.map((stack) => {
          const CategoryIcon = getCategoryIcon(stack.category);
          return (
            <Card key={stack.category} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <CategoryIcon className="h-6 w-6 text-primary" />
                  </div>
                  {t(`techStacks.${stack.category.toLowerCase().replace(/\s+&\s+/g, '').replace(/\s+/g, '')}`)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {stack.items.map((item) => (
                    <div key={item.name} className="group">
                      <TechShowcase
                        tech={techMapping[item.name] || item.name.toLowerCase().replace(/\s+/g, '')}
                        name={item.name}
                        description={item.description[i18n.language as 'vi' | 'en']}
                        category={t(`techStacks.${stack.category.toLowerCase().replace(/\s+&\s+/g, '').replace(/\s+/g, '')}`)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Technology Ecosystem Overview */}
      <section>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              {t('infrastructure.overview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* Core Technologies */}
              <div className="text-center group">
                <TechLogo tech="go" size="lg" className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-semibold text-sm">Go</p>
                <p className="text-xs text-muted-foreground">{t('techStacks.descriptions.go')}</p>
              </div>

              <div className="text-center group">
                <TechLogo tech="nodejs" size="lg" className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-semibold text-sm">Node.js</p>
                <p className="text-xs text-muted-foreground">{t('techStacks.descriptions.nodejs')}</p>
              </div>

              <div className="text-center group">
                <TechLogo tech="k3s" size="lg" className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-semibold text-sm">K3s</p>
                <p className="text-xs text-muted-foreground">{t('techStacks.descriptions.k3s')}</p>
              </div>

              <div className="text-center group">
                <TechLogo tech="postgresql" size="lg" className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-semibold text-sm">PostgreSQL</p>
                <p className="text-xs text-muted-foreground">{t('techStacks.descriptions.postgresql')}</p>
              </div>

              <div className="text-center group">
                <TechLogo tech="redis" size="lg" className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-semibold text-sm">Redis</p>
                <p className="text-xs text-muted-foreground">{t('techStacks.descriptions.redis')}</p>
              </div>

              <div className="text-center group">
                <TechLogo tech="grafana" size="lg" className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="font-semibold text-sm">Grafana</p>
                <p className="text-xs text-muted-foreground">{t('techStacks.descriptions.grafana')}</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl">
              <h4 className="font-bold text-xl mb-4 text-center">{t('infrastructure.dataFlow')}</h4>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <TechLogo tech="go" size="md" />
                <span className="text-2xl">→</span>
                <TechLogo tech="k3s" size="md" />
                <span className="text-2xl">→</span>
                <TechLogo tech="postgresql" size="md" />
                <span className="text-2xl">→</span>
                <TechLogo tech="redis" size="md" />
                <span className="text-2xl">→</span>
                <TechLogo tech="grafana" size="md" />
              </div>
              <p className="text-center text-muted-foreground mt-4">
                {t('infrastructure.subtitle')}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
