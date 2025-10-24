"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Database,
  Server,
  Network,
  Shield,
  Workflow,
  GitBranch,
  Layers,
  Users,
  Zap,
  Lock,
  Globe,
  ArrowRight
} from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function ArchitecturePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Layers className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">System Design</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            {t('architecture.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('architecture.description')}
          </p>
        </div>

        {/* Microservices Architecture Principles */}
        <Card className="border-0 shadow-2xl shadow-primary/10 overflow-hidden">
          <CardHeader className="relative">
            <div className="absolute inset-0 gradient-purple opacity-90"></div>
            <div className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                {t('architecture.microservicesTitle')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 bg-gradient-to-br from-card to-muted/5">
            <div className="space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('architecture.microservicesDescription')}
              </p>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Service Independence */}
                <Card className="border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/50 dark:to-cyan-950/50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Server className="h-6 w-6 text-blue-600" />
                      </div>
                      {t('architecture.serviceIndependence')}
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'dedicatedDatabase',
                        'independentDeployment',
                        'technologyFlexibility',
                        'faultIsolation',
                        'teamOwnership'
                      ].map((key, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <div className="p-1 bg-primary/20 rounded-full mt-0.5">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm leading-relaxed">{t(`architecture.serviceIndependencePoints.${key}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Communication Patterns */}
                <Card className="border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/50 dark:to-emerald-950/50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Network className="h-6 w-6 text-green-600" />
                      </div>
                      {t('architecture.communicationPatterns')}
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'restApis',
                        'rabbitmq',
                        'eventDriven',
                        'circuitBreaker',
                        'serviceDiscovery'
                      ].map((key, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <div className="p-1 bg-primary/20 rounded-full mt-0.5">
                            <ArrowRight className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm leading-relaxed">{t(`architecture.communicationPoints.${key}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Domains */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-primary/10 rounded-xl">
                <GitBranch className="h-8 w-8 text-primary" />
              </div>
              {t('architecture.serviceDomainBreakdown')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Account Domain */}
              <Card className="border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('architecture.domains.account.title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('architecture.domains.account.subtitle')}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['registration', 'authentication', 'verification', 'passwordMgmt'].map((key, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {t(`architecture.domains.account.features.${key}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Authorization Domain */}
              <Card className="border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Lock className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('architecture.domains.authorization.title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('architecture.domains.authorization.subtitle')}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['rbac', 'jwtManagement', 'permissionValidation', 'apiGatewaySecurity'].map((key, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {t(`architecture.domains.authorization.features.${key}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Content Domain */}
              <Card className="border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Cloud className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('architecture.domains.content.title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('architecture.domains.content.subtitle')}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['fileUploads', 'cdnIntegration', 'imageOptimization', 'storageManagement'].map((key, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        {t(`architecture.domains.content.features.${key}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Communication Domain */}
              <Card className="border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                      <Zap className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('architecture.domains.communication.title')}</h4>
                      <p className="text-sm text-muted-foreground">{t('architecture.domains.communication.subtitle')}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {['emailDelivery', 'notifications', 'messageQueues', 'eventBroadcasting'].map((key, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        {t(`architecture.domains.communication.features.${key}`)}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Data Flow & Integration Patterns */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Workflow className="h-8 w-8 text-primary" />
              </div>
              {t('architecture.dataFlowPatterns')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Database Per Service */}
              <Card className="border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/50 dark:to-cyan-950/50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-xl mb-3 flex items-center gap-3">
                    <div className="p-2 gradient-blue rounded-lg">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    {t('architecture.databasePerService.title')}
                  </h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {t('architecture.databasePerService.description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">PostgreSQL</Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Redis Cache</Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">{t('architecture.databasePerService.badges.dataIsolation')}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* API Gateway */}
              <Card className="border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/50 dark:to-emerald-950/50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-xl mb-3 flex items-center gap-3">
                    <div className="p-2 gradient-green rounded-lg">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    {t('architecture.apiGateway.title')}
                  </h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {t('architecture.apiGateway.description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{t('architecture.apiGateway.badges.loadBalancing')}</Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{t('architecture.apiGateway.badges.rateLimiting')}</Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">{t('architecture.apiGateway.badges.sslTermination')}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Event-Driven Communication */}
              <Card className="border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-xl mb-3 flex items-center gap-3">
                    <div className="p-2 gradient-purple rounded-lg">
                      <Network className="h-6 w-6 text-white" />
                    </div>
                    {t('architecture.eventDriven.title')}
                  </h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {t('architecture.eventDriven.description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">RabbitMQ</Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">{t('architecture.eventDriven.badges.eventSourcing')}</Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">{t('architecture.eventDriven.badges.messageQueues')}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Monitoring */}
              <Card className="border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/50 dark:to-orange-950/50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-xl mb-3 flex items-center gap-3">
                    <div className="p-2 gradient-orange rounded-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    {t('architecture.securityMonitoring.title')}
                  </h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {t('architecture.securityMonitoring.description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">{t('architecture.securityMonitoring.badges.jwtAuth')}</Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">{t('architecture.securityMonitoring.badges.rbac')}</Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">{t('architecture.securityMonitoring.badges.observability')}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
