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
  Globe
} from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function ArchitecturePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('architecture.title')}</h1>
        <p className="text-xl text-muted-foreground">
          {t('architecture.description')}
        </p>
      </div>

      {/* Microservices Architecture */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Microservices Architecture Principles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Our system follows Domain-Driven Design (DDD) principles with each microservice owning its domain and data.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Service Independence
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Each service has its own dedicated database</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Independent deployment and scaling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Technology stack flexibility per service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Fault isolation and resilience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Team ownership and autonomy</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Network className="h-5 w-5 text-primary" />
                    Communication Patterns
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>REST APIs for synchronous communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>RabbitMQ for asynchronous messaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Event-driven architecture for loose coupling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Circuit breaker pattern for resilience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Service discovery and load balancing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Service Domains */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-primary" />
              Service Domain Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-semibold">Account Domain</h4>
                    <p className="text-sm text-muted-foreground">User Management</p>
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• User registration & profiles</li>
                  <li>• Authentication & login</li>
                  <li>• Account verification</li>
                  <li>• Password management</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold">Authorization Domain</h4>
                    <p className="text-sm text-muted-foreground">Access Control</p>
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Role-based access control</li>
                  <li>• JWT token management</li>
                  <li>• Permission validation</li>
                  <li>• API gateway security</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-purple-50 dark:bg-purple-950">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-8 w-8 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">CDN Domain</h4>
                    <p className="text-sm text-muted-foreground">Content Delivery</p>
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Image processing & optimization</li>
                  <li>• Content caching strategies</li>
                  <li>• Media transformation</li>
                  <li>• Global edge distribution</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-orange-50 dark:bg-orange-950">
                <div className="flex items-center gap-3 mb-3">
                  <Cloud className="h-8 w-8 text-orange-600" />
                  <div>
                    <h4 className="font-semibold">Upload Domain</h4>
                    <p className="text-sm text-muted-foreground">File Management</p>
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• File upload & validation</li>
                  <li>• Storage management</li>
                  <li>• Metadata extraction</li>
                  <li>• Access control & sharing</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-8 w-8 text-red-600" />
                  <div>
                    <h4 className="font-semibold">Email Domain</h4>
                    <p className="text-sm text-muted-foreground">Communication</p>
                  </div>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Transactional emails</li>
                  <li>• Template management</li>
                  <li>• Queue processing</li>
                  <li>• Delivery tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Data Flow & Communication */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-6 w-6 text-primary" />
              Data Flow & Communication Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg mb-4">
                    <Shield className="h-12 w-12 text-blue-600 mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">API Gateway Layer</h4>
                  <p className="text-sm text-muted-foreground">
                    Single entry point for all client requests with authentication, rate limiting, and request routing
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-6 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg mb-4">
                    <Server className="h-12 w-12 text-green-600 mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">Service Layer</h4>
                  <p className="text-sm text-muted-foreground">
                    Business logic processing, domain-specific operations, and data persistence management
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg mb-4">
                    <Database className="h-12 w-12 text-purple-600 mx-auto" />
                  </div>
                  <h4 className="font-semibold mb-2">Data Layer</h4>
                  <p className="text-sm text-muted-foreground">
                    Persistent storage, caching, and message queuing for reliable data management
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <h5 className="font-semibold mb-3">Communication Patterns</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Synchronous Communication
                    </h6>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• HTTP/REST for real-time operations</li>
                      <li>• gRPC for internal service calls</li>
                      <li>• GraphQL for complex data queries</li>
                      <li>• WebSocket for real-time features</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2 flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Asynchronous Communication
                    </h6>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• RabbitMQ for reliable messaging</li>
                      <li>• Event sourcing for state changes</li>
                      <li>• Pub/Sub for event notifications</li>
                      <li>• Job queues for background tasks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Scalability & Reliability */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Scalability & Reliability Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Scalability Strategies</h4>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Horizontal Scaling</h5>
                    <p className="text-sm text-muted-foreground">Auto-scaling pods based on CPU/memory usage</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Database Sharding</h5>
                    <p className="text-sm text-muted-foreground">Partition data across multiple database instances</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Caching Layers</h5>
                    <p className="text-sm text-muted-foreground">Redis for session and application caching</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">CDN Integration</h5>
                    <p className="text-sm text-muted-foreground">Global content distribution for media files</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Reliability Patterns</h4>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Circuit Breaker</h5>
                    <p className="text-sm text-muted-foreground">Prevent cascade failures between services</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Health Checks</h5>
                    <p className="text-sm text-muted-foreground">Continuous monitoring and automatic recovery</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Retry Mechanisms</h5>
                    <p className="text-sm text-muted-foreground">Exponential backoff for failed requests</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium">Graceful Degradation</h5>
                    <p className="text-sm text-muted-foreground">Maintain core functionality during outages</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
