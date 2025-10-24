"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { services, API_BASE_URL } from "@/lib/data";
import { Server, Shield, Image, Upload, Mail, ExternalLink } from "lucide-react";
import { useTranslation } from 'react-i18next';

const getServiceIcon = (name: string) => {
  if (name.includes("account")) return Server;
  if (name.includes("authorization")) return Shield;
  if (name.includes("cdn")) return Image;
  if (name.includes("upload")) return Upload;
  if (name.includes("email")) return Mail;
  return Server;
};

export default function ServicesPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('services.title')}</h1>
        <p className="text-xl text-muted-foreground">
          {t('services.description')}
        </p>
      </div>

      {/* API Base URL Info */}
      <section>
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>{t('api.baseUrl')}</CardTitle>
            <CardDescription>
              {API_BASE_URL}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Services Grid */}
      <section>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = getServiceIcon(service.name);
            return (
              <Card key={service.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.displayName}</CardTitle>
                      <Badge variant={service.status === "active" ? "default" : "secondary"}>
                        {t(`common.${service.status}`)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    {service.description[i18n.language as 'vi' | 'en']}
                  </CardDescription>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('common.port')}:</span>
                        <span className="ml-2 font-mono">{service.port}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">API Path:</span>
                        <span className="ml-2 font-mono">{service.apiPath}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-sm">{t('common.tech')}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={service.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t('services.viewRepository')}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
