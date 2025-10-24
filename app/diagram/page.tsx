"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Network, Server, Database, Cloud, Shield, Layers, GitBranch, Zap, Globe, Users, Lock, ArrowRight, ArrowDown, Activity, Monitor, Cpu, Cable, Search } from "lucide-react";

const getComponentIcon = (type: string) => {
  switch (type) {
    case "Gateway": return Network;
    case "Discovery": return Server;
    case "LoadBalancer": return Network;
    case "Database": return Database;
    case "Cache": return Zap;
    case "MessageQueue": return Server;
    case "Storage": return Cloud;
    case "Search": return Search;
    case "Monitoring": return Zap;
    case "Physical": return Monitor;
    case "Virtualization": return Cpu;
    case "VPN": return Shield;
    case "Network": return Cable;
    default: return Cloud;
  }
};

export default function DiagramPage() {
  const { t } = useTranslation();

  const physicalInfrastructure = [
    {
      name: t('infrastructure.components.homelabPhysical'),
      type: "Physical",
      description: t('infrastructure.components.homelabPhysicalDesc'),
      details: t('infrastructure.components.homelabPhysicalDetails')
    },
    {
      name: t('infrastructure.components.proxmoxVe'),
      type: "Virtualization",
      description: t('infrastructure.components.proxmoxVeDesc'),
      details: t('infrastructure.components.proxmoxVeDetails')
    },
    {
      name: t('infrastructure.components.debianVms'),
      type: "Virtual Machines",
      description: t('infrastructure.components.debianVmsDesc'),
      details: t('infrastructure.components.debianVmsDetails')
    },
    {
      name: t('infrastructure.components.tailscaleVpn'),
      type: "VPN",
      description: t('infrastructure.components.tailscaleVpnDesc'),
      details: t('infrastructure.components.tailscaleVpnDetails')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">{t('infrastructure.title')}</h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            {t('infrastructure.subtitle')}
          </p>
        </div>

        {/* Infrastructure Layers Overview with enhanced contrast */}
        <section>
          <h2 className="text-3xl font-black mb-8 text-center">{t('infrastructure.overview')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-300 dark:border-blue-700 shadow-xl hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Monitor className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-black">{t('infrastructure.physicalLayer')}</CardTitle>
                <CardDescription className="text-base font-medium">Homelab & Proxmox</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/50 dark:to-emerald-950/50 border-2 border-green-300 dark:border-green-700 shadow-xl hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-black">{t('infrastructure.networkLayer')}</CardTitle>
                <CardDescription className="text-base font-medium">Tailscale VPN</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-950/50 dark:to-violet-950/50 border-2 border-purple-300 dark:border-purple-700 shadow-xl hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Server className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-black">{t('infrastructure.orchestrationLayer')}</CardTitle>
                <CardDescription className="text-base font-medium">K3s Kubernetes</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-950/50 dark:to-red-950/50 border-2 border-orange-300 dark:border-orange-700 shadow-xl hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <Cloud className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl font-black">{t('infrastructure.applicationLayer')}</CardTitle>
                <CardDescription className="text-base font-medium">Microservices</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Physical Infrastructure Layer with enhanced styling */}
        <section>
          <h2 className="text-3xl font-black mb-8">1. {t('infrastructure.physicalInfrastructure')}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {physicalInfrastructure.map((component, index) => {
              const Icon = getComponentIcon(component.type);
              return (
                <Card key={component.name} className="relative border-2 border-border shadow-xl hover:scale-105 transition-transform">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-primary/15 rounded-xl border border-primary/25">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-3 text-xl font-black">
                          {component.name}
                          <Badge variant="outline" className="text-sm font-bold border-2">{component.type}</Badge>
                        </CardTitle>
                        <CardDescription className="text-base font-medium">{component.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-medium">
                      {component.details}
                    </p>
                  </CardContent>
                  <div className="absolute top-6 right-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30">
                      <span className="text-primary font-black text-base">{index + 1}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Physical Architecture Diagram with enhanced contrast */}
          <Card className="mt-8 border-2 border-primary/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-3 text-2xl font-black">
                <Network className="h-8 w-8" />
                {t('infrastructure.physicalInfrastructureDiagram')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="space-y-8">
                {/* Homelab Physical Layer with enhanced styling */}
                <div className="p-8 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 shadow-inner">
                  <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                    <Monitor className="h-8 w-8 text-blue-600" />
                    {t('infrastructure.components.homelabPhysical')}
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <div className="p-6 bg-blue-50/80 dark:bg-blue-950/80 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                        <h5 className="font-black mb-3 flex items-center gap-3 text-lg">
                          <Cpu className="h-6 w-6 text-blue-600" />
                          Proxmox VE Host
                        </h5>
                        <ul className="text-base space-y-2 text-muted-foreground font-medium">
                          <li>• Hypervisor Type-1</li>
                          <li>• Web Management UI</li>
                          <li>• High Availability</li>
                          <li>• Backup & Restore</li>
                        </ul>
                      </div>
                    </div>
                    <div className="lg:col-span-2">
                      <div className="p-6 bg-green-50/80 dark:bg-green-950/80 rounded-xl border-2 border-green-300 dark:border-green-700 shadow-lg">
                        <h5 className="font-black mb-4 flex items-center gap-3 text-lg">
                          <Server className="h-6 w-6 text-green-600" />
                          {t('infrastructure.components.debianVms')}
                        </h5>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="p-4 bg-green-100/80 dark:bg-green-900/80 rounded-lg border-2 border-green-400 dark:border-green-600 text-center shadow-md">
                            <div className="font-black text-base text-green-800 dark:text-green-200">Master Node</div>
                            <div className="text-sm text-green-600 dark:text-green-400 font-medium">K3s Control Plane</div>
                          </div>
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="p-4 bg-green-100/80 dark:bg-green-900/80 rounded-lg border-2 border-green-400 dark:border-green-600 text-center shadow-md">
                              <div className="font-black text-base text-green-800 dark:text-green-200">Agent Node {i}</div>
                              <div className="text-sm text-green-600 dark:text-green-400 font-medium">K3s Worker</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tailscale VPN Layer with enhanced styling */}
                <div className="p-8 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-purple-950/80 dark:to-indigo-950/80 rounded-xl border-2 border-dashed border-purple-400 dark:border-purple-600 shadow-inner">
                  <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-purple-600" />
                    {t('infrastructure.tailscaleVpnMesh')}
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h5 className="font-black mb-4 text-lg">{t('infrastructure.vpnFeatures')}</h5>
                      <ul className="space-y-3 text-base">
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnFeaturesList.meshNetwork')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnFeaturesList.wireguardEncryption')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnFeaturesList.natTraversal')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnFeaturesList.zeroConfig')}</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-black mb-4 text-lg">{t('infrastructure.vpnBenefits')}</h5>
                      <ul className="space-y-3 text-base">
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnBenefitsList.secureConnection')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnBenefitsList.noComplexFirewall')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnBenefitsList.easyNodeManagement')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">{t('infrastructure.vpnBenefitsList.centralizedManagement')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* K3s Cluster Architecture Overview with enhanced contrast */}
        <section>
          <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/10">
              <CardTitle className="flex items-center gap-3 text-3xl font-black">
                <Layers className="h-8 w-8 text-primary" />
                {t('infrastructure.clusterArchitecture')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="space-y-16">
                <p className="text-muted-foreground text-center text-xl font-medium">
                  {t('infrastructure.clusterDescription')}
                </p>

                {/* External Layer with enhanced styling */}
                <div className="relative border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-3xl p-10 bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-blue-950/40 dark:to-cyan-950/40 shadow-2xl">
                  <div className="absolute top-6 left-6">
                    <Badge variant="outline" className="bg-white/90 dark:bg-gray-800/90 border-2 font-bold text-base">{t('infrastructure.externalLayer')}</Badge>
                  </div>
                  <h3 className="text-2xl font-black mb-10 text-center flex items-center justify-center gap-3 mt-6">
                    <Globe className="h-8 w-8 text-blue-600" />
                    {t('infrastructure.publicInternet')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Globe className="h-12 w-12 text-white" />
                      </div>
                      <h4 className="font-bold text-lg">{t('infrastructure.clientApps')}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{t('infrastructure.webMobileApis')}</p>
                      <Badge variant="secondary" className="mt-2">{t('infrastructure.externalAccess')}</Badge>
                    </div>
                    <div className="text-center group">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Cloud className="h-12 w-12 text-white" />
                      </div>
                      <h4 className="font-bold text-lg">{t('infrastructure.cloudflareCdn')}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{t('infrastructure.globalEdge')}</p>
                      <Badge variant="secondary" className="mt-2">{t('infrastructure.edgeCaching')}</Badge>
                    </div>
                    <div className="text-center group">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Shield className="h-12 w-12 text-white" />
                      </div>
                      <h4 className="font-bold text-lg">{t('infrastructure.loadBalancer')}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{t('infrastructure.trafficDistribution')}</p>
                      <Badge variant="secondary" className="mt-2">HA Proxy</Badge>
                    </div>
                  </div>

                  {/* Connection Arrow */}
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg">
                      <ArrowDown className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium">{t('infrastructure.httpsTraffic')}</span>
                    </div>
                  </div>
                </div>

                {/* K3s Cluster Internal with enhanced styling */}
                <div className="relative border-2 border-solid border-primary/40 rounded-2xl p-10 bg-gradient-to-br from-primary/8 to-primary/12 shadow-2xl">
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">K3s Cluster</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3 mt-4">
                    <Layers className="h-8 w-8 text-primary" />
                    {t('infrastructure.internalNetwork')}
                  </h3>

                  {/* API Gateway Layer */}
                  <div className="mb-10 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                      <Network className="h-6 w-6 text-green-600" />
                      {t('infrastructure.apiGatewayLayer')}
                    </h4>
                    <div className="flex justify-center">
                      <div className="relative group cursor-pointer">
                        <div className="w-40 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-xl">
                          <div className="text-center text-white">
                            <Network className="h-8 w-8 mx-auto mb-1" />
                            <span className="text-base font-bold">{t('infrastructure.apiGateway')}</span>
                          </div>
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                          <Badge variant="secondary" className="text-sm font-mono bg-green-100 dark:bg-green-900">
                            10.xxx.xxx.100:80
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Gateway to Services Connection */}
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-full">
                        <Activity className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">{t('infrastructure.routesToServices')}</span>
                        <ArrowDown className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  {/* Service Mesh Layer */}
                  <div className="mb-10 p-8 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-xl border shadow-lg">
                    <h4 className="font-bold text-xl mb-8 flex items-center gap-2">
                      <Server className="h-6 w-6 text-blue-600" />
                      {t('infrastructure.servicesMesh')}
                    </h4>

                    <div className="grid md:grid-cols-5 gap-6 mb-8">
                      {/* Account Service */}
                      <div className="text-center group">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto">
                          <Users className="h-10 w-10 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs mb-2 font-mono">account-svc</Badge>
                        <Badge className="text-xs block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">10.xxx.xxx.21</Badge>
                        <h5 className="font-bold text-sm mt-3">Account Service</h5>
                        <div className="mt-2 space-y-1">
                          <Badge variant="secondary" className="text-xs">Port: 8080</Badge>
                          <p className="text-xs text-muted-foreground">{t('infrastructure.userManagement')}</p>
                        </div>
                      </div>

                      {/* Authorization Service */}
                      <div className="text-center group">
                        <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto">
                          <Lock className="h-10 w-10 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs mb-2 font-mono">auth-svc</Badge>
                        <Badge className="text-xs block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">10.xxx.xxx.22</Badge>
                        <h5 className="font-bold text-sm mt-3">Auth Service</h5>
                        <div className="mt-2 space-y-1">
                          <Badge variant="secondary" className="text-xs">Port: 8081</Badge>
                          <p className="text-xs text-muted-foreground">{t('infrastructure.jwtOauth')}</p>
                        </div>
                      </div>

                      {/* CDN Service */}
                      <div className="text-center group">
                        <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto">
                          <Globe className="h-10 w-10 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs mb-2 font-mono">cdn-svc</Badge>
                        <Badge className="text-xs block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">10.xxx.xxx.23</Badge>
                        <h5 className="font-bold text-sm mt-3">CDN Service</h5>
                        <div className="mt-2 space-y-1">
                          <Badge variant="secondary" className="text-xs">Port: 8082</Badge>
                          <p className="text-xs text-muted-foreground">{t('infrastructure.contentDelivery')}</p>
                        </div>
                      </div>

                      {/* Upload Service */}
                      <div className="text-center group">
                        <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto">
                          <Cloud className="h-10 w-10 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs mb-2 font-mono">upload-svc</Badge>
                        <Badge className="text-xs block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">10.xxx.xxx.24</Badge>
                        <h5 className="font-bold text-sm mt-3">Upload Service</h5>
                        <div className="mt-2 space-y-1">
                          <Badge variant="secondary" className="text-xs">Port: 8083</Badge>
                          <p className="text-xs text-muted-foreground">{t('infrastructure.fileHandling')}</p>
                        </div>
                      </div>

                      {/* Email Service */}
                      <div className="text-center group">
                        <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl mb-3 mx-auto">
                          <Zap className="h-10 w-10 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs mb-2 font-mono">email-svc</Badge>
                        <Badge className="text-xs block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">10.xxx.xxx.25</Badge>
                        <h5 className="font-bold text-sm mt-3">Email Service</h5>
                        <div className="mt-2 space-y-1">
                          <Badge variant="secondary" className="text-xs">Port: 8084</Badge>
                          <p className="text-xs text-muted-foreground">{t('infrastructure.notifications')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Service Communication Visualization */}
                    <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-inner">
                      <Network className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                      <h5 className="text-lg font-bold text-center mb-4">{t('infrastructure.internalServiceDiscovery')}</h5>

                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md">
                          <Network className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <p className="font-semibold text-sm">{t('infrastructure.dnsResolution')}</p>
                          <p className="text-xs text-muted-foreground">service-name.namespace.svc.cluster.local</p>
                        </div>
                        <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md">
                          <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <p className="font-semibold text-sm">Load Balancing</p>
                          <p className="text-xs text-muted-foreground">{t('infrastructure.autoLoadBalancing')}</p>
                        </div>
                        <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md">
                          <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <p className="font-semibold text-sm">{t('infrastructure.serviceMesh')}</p>
                          <p className="text-xs text-muted-foreground">{t('infrastructure.secureInterService')}</p>
                        </div>
                      </div>

                      {/* Communication Examples */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-mono">account-svc</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm font-mono">auth-svc:8081</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{t('infrastructure.jwtValidation')}</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono">upload-svc</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm font-mono">cdn-svc:8082</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{t('infrastructure.fileProcessing')}</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-mono">account-svc</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-mono">email-svc:8084</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{t('infrastructure.sendNotifications')}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Layer */}
                  <div className="p-8 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-950/80 dark:to-pink-950/80 rounded-xl border shadow-lg">
                    <h4 className="font-bold text-xl mb-8 flex items-center gap-2">
                      <Database className="h-6 w-6 text-purple-600" />
                      {t('infrastructure.dataStorageLayer')}
                    </h4>

                    <div className="grid md:grid-cols-4 gap-8">
                      {/* PostgreSQL */}
                      <div className="text-center group">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <Database className="h-12 w-12 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">PostgreSQL</h5>
                        <Badge variant="secondary" className="text-sm mt-2 font-mono">postgres-svc</Badge>
                        <Badge variant="outline" className="text-sm mt-2 block bg-blue-100 dark:bg-blue-900">10.xxx.xxx.31:5432</Badge>
                        <p className="text-sm text-muted-foreground mt-2">{t('infrastructure.primaryDatabase')}</p>
                        <div className="mt-3 space-y-1">
                          <Badge variant="secondary" className="text-xs">{t('infrastructure.acidCompliance')}</Badge>
                          <Badge variant="secondary" className="text-xs block">{t('infrastructure.readReplicas')}</Badge>
                        </div>
                      </div>

                      {/* Redis */}
                      <div className="text-center group">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <Zap className="h-12 w-12 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">Redis</h5>
                        <Badge variant="secondary" className="text-sm mt-2 font-mono">redis-svc</Badge>
                        <Badge variant="outline" className="text-sm mt-2 block bg-red-100 dark:bg-red-900">10.xxx.xxx.32:6379</Badge>
                        <p className="text-sm text-muted-foreground mt-2">{t('infrastructure.cacheSessions')}</p>
                        <div className="mt-3 space-y-1">
                          <Badge variant="secondary" className="text-xs">{t('infrastructure.inMemory')}</Badge>
                          <Badge variant="secondary" className="text-xs block">{t('infrastructure.subMsLatency')}</Badge>
                        </div>
                      </div>

                      {/* RabbitMQ */}
                      <div className="text-center group">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <GitBranch className="h-12 w-12 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">RabbitMQ</h5>
                        <Badge variant="secondary" className="text-sm mt-2 font-mono">rabbitmq-svc</Badge>
                        <Badge variant="outline" className="text-sm mt-2 block bg-green-100 dark:bg-green-900">10.xxx.xxx.33:5672</Badge>
                        <p className="text-sm text-muted-foreground mt-2">{t('infrastructure.messageQueue')}</p>
                        <div className="mt-3 space-y-1">
                          <Badge variant="secondary" className="text-xs">{t('infrastructure.eventDriven')}</Badge>
                          <Badge variant="secondary" className="text-xs block">{t('infrastructure.asyncProcessing')}</Badge>
                        </div>
                      </div>

                      {/* Monitoring */}
                      <div className="text-center group">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <Activity className="h-12 w-12 text-white" />
                        </div>
                        <h5 className="font-bold text-lg">{t('infrastructure.monitoring')}</h5>
                        <Badge variant="secondary" className="text-sm mt-2 font-mono">grafana-svc</Badge>
                        <Badge variant="outline" className="text-sm mt-2 block bg-orange-100 dark:bg-orange-900">10.xxx.xxx.34:3000</Badge>
                        <p className="text-sm text-muted-foreground mt-2">{t('infrastructure.observability')}</p>
                        <div className="mt-3 space-y-1">
                          <Badge variant="secondary" className="text-xs">Prometheus</Badge>
                          <Badge variant="secondary" className="text-xs block">Grafana + Loki</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* External Storage */}
                <div className="relative border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-2xl p-8 bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 shadow-lg">
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">{t('infrastructure.externalStorage')}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-6 text-center flex items-center justify-center gap-2 mt-4">
                    <Cloud className="h-6 w-6 text-orange-600" />
                    {t('infrastructure.cloudStorageIntegration')}
                  </h3>
                  <div className="flex justify-center">
                    <div className="text-center group">
                      <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Cloud className="h-16 w-16 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mt-4">{t('infrastructure.cloudflareR2')}</h4>
                      <div className="flex gap-2 justify-center mt-3">
                        <Badge variant="secondary">{t('infrastructure.s3Compatible')}</Badge>
                        <Badge variant="secondary">{t('infrastructure.objectStorage')}</Badge>
                        <Badge variant="secondary">{t('infrastructure.globalCdn')}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
