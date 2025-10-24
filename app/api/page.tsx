"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { services, API_BASE_URL } from "@/lib/data";
import { Server } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function APIPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('api.title')}</h1>
        <p className="text-xl text-muted-foreground">
          {t('api.description')}
        </p>
      </div>

      {/* API Base URL */}
      <section>
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>{t('api.baseUrl')}</CardTitle>
            <CardDescription>
              Domain chính cho tất cả API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <code className="text-2xl font-mono bg-background px-4 py-2 rounded-md border">
                  {API_BASE_URL}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* API Endpoints */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('api.endpoints')}</h2>
        <div className="grid gap-6">
          {services.map((service) => (
            <Card key={service.name}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Server className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{service.displayName}</CardTitle>
                    <CardDescription>
                      {service.description[i18n.language as 'vi' | 'en']}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{service.status === "active" ? t('common.active') : t('common.development')}</Badge>
                    <span className="text-sm text-muted-foreground">Port: {service.port}</span>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">API Endpoint</h4>
                    <code className="bg-muted px-3 py-2 rounded-md text-sm">
                      {API_BASE_URL}{service.apiPath}
                    </code>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">{t('common.tech')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.tech.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
