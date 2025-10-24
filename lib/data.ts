export interface Service {
  name: string;
  displayName: string;
  description: {
    vi: string;
    en: string;
  };
  port: number;
  apiPath: string;
  tech: string[];
  status: "active" | "development" | "planned";
  repository: string;
}

export interface TechStack {
  category: string;
  items: {
    name: string;
    description: {
      vi: string;
      en: string;
    };
    icon?: string;
  }[];
}

export const services: Service[] = [
  {
    name: "gau-account-service",
    displayName: "Account Service",
    description: {
      vi: "Quản lý tài khoản người dùng, xác thực, đăng ký, hồ sơ người dùng",
      en: "Manages user accounts, authentication, registration, user profiles"
    },
    port: 8080,
    apiPath: "/api/v2/account",
    tech: ["Go", "Gin", "PostgreSQL", "Redis", "RabbitMQ"],
    status: "active",
    repository: "https://github.com/tnqbao/gau-account-service"
  },
  {
    name: "gau-authorization-service",
    displayName: "Authorization Service",
    description: {
      vi: "Quản lý phân quyền, kiểm soát truy cập và quản lý token",
      en: "Manages permissions, access control and token management"
    },
    port: 8081,
    apiPath: "/api/v2/authorization",
    tech: ["Go", "Gin", "PostgreSQL", "Redis", "JWT"],
    status: "active",
    repository: "https://github.com/tnqbao/gau-authorization-service"
  },
  {
    name: "gau-cdn-service",
    displayName: "CDN Service",
    description: {
      vi: "Quản lý CDN và xử lý hình ảnh",
      en: "Manages CDN and image processing"
    },
    port: 8082,
    apiPath: "/api/v2/cdn",
    tech: ["Go", "Gin", "Cloudflare R2", "Redis"],
    status: "active",
    repository: "https://github.com/tnqbao/gau-cdn-service"
  },
  {
    name: "gau-upload-service",
    displayName: "Upload Service",
    description: {
      vi: "Quản lý upload file và media",
      en: "Manages file and media uploads"
    },
    port: 8083,
    apiPath: "/api/v2/upload",
    tech: ["Go", "Gin", "Cloudflare R2", "PostgreSQL"],
    status: "active",
    repository: "https://github.com/tnqbao/gau-upload-service"
  },
  {
    name: "gau-email-service",
    displayName: "Email Service",
    description: {
      vi: "Gửi email, thông báo và xác thực email",
      en: "Sends emails, notifications and email verification"
    },
    port: 8085,
    apiPath: "/api/v2/email",
    tech: ["Node.js", "TypeScript", "Redis"],
    status: "active",
    repository: "https://github.com/tnqbao/gau-email-service"
  }
];

export const API_BASE_URL = "https://api.gauas.online";

export const techStacks: TechStack[] = [
  {
    category: "Backend",
    items: [
      {
        name: "Go",
        description: {
          vi: "Ngôn ngữ chính cho microservices",
          en: "Main language for microservices"
        }
      },
      {
        name: "Gin",
        description: {
          vi: "Web framework cho Go",
          en: "Web framework for Go"
        }
      },
      {
        name: "Node.js",
        description: {
          vi: "Runtime cho Email Service",
          en: "Runtime for Email Service"
        }
      },
      {
        name: "TypeScript",
        description: {
          vi: "Ngôn ngữ cho Email Service",
          en: "Language for Email Service"
        }
      }
    ]
  },
  {
    category: "Database",
    items: [
      {
        name: "PostgreSQL",
        description: {
          vi: "Database chính cho các service",
          en: "Main database for services"
        }
      },
      {
        name: "Redis",
        description: {
          vi: "Cache và session storage",
          en: "Cache and session storage"
        }
      }
    ]
  },
  {
    category: "Message Queue",
    items: [
      {
        name: "RabbitMQ",
        description: {
          vi: "Message broker cho async communication",
          en: "Message broker for async communication"
        }
      }
    ]
  },
  {
    category: "Storage",
    items: [
      {
        name: "Cloudflare R2",
        description: {
          vi: "S3-compatible object storage",
          en: "S3-compatible object storage"
        }
      }
    ]
  },
  {
    category: "Container & Orchestration",
    items: [
      {
        name: "Docker",
        description: {
          vi: "Container platform",
          en: "Container platform"
        }
      },
      {
        name: "K3s",
        description: {
          vi: "Lightweight Kubernetes distribution",
          en: "Lightweight Kubernetes distribution"
        }
      }
    ]
  },
  {
    category: "Monitoring & Logging",
    items: [
      {
        name: "Grafana",
        description: {
          vi: "Visualization và dashboards",
          en: "Visualization and dashboards"
        }
      },
      {
        name: "Loki",
        description: {
          vi: "Log aggregation system",
          en: "Log aggregation system"
        }
      },
      {
        name: "Tempo",
        description: {
          vi: "Distributed tracing backend",
          en: "Distributed tracing backend"
        }
      },
      {
        name: "Prometheus",
        description: {
          vi: "Metrics collection và alerting",
          en: "Metrics collection and alerting"
        }
      }
    ]
  },
  {
    category: "Authentication",
    items: [
      {
        name: "JWT",
        description: {
          vi: "JSON Web Token cho authentication",
          en: "JSON Web Token for authentication"
        }
      }
    ]
  }
];

export const infrastructureComponents = [
  {
    name: "API Gateway",
    description: {
      vi: "Điểm vào duy nhất cho tất cả các request",
      en: "Single entry point for all requests"
    },
    type: "Gateway"
  },
  {
    name: "Service Discovery",
    description: {
      vi: "Tự động phát hiện và đăng ký services",
      en: "Automatic service discovery and registration"
    },
    type: "Discovery"
  },
  {
    name: "Load Balancer",
    description: {
      vi: "Phân phối traffic đều giữa các instance",
      en: "Distributes traffic evenly between instances"
    },
    type: "LoadBalancer"
  },
  {
    name: "PostgreSQL Cluster",
    description: {
      vi: "Database chính với high availability",
      en: "Main database with high availability"
    },
    type: "Database"
  },
  {
    name: "Redis Cluster",
    description: {
      vi: "Cache và session storage",
      en: "Cache and session storage"
    },
    type: "Cache"
  },
  {
    name: "RabbitMQ Cluster",
    description: {
      vi: "Message broker cho async communication",
      en: "Message broker for async communication"
    },
    type: "MessageQueue"
  },
  {
    name: "Cloudflare R2",
    description: {
      vi: "Object storage cho files và media",
      en: "Object storage for files and media"
    },
    type: "Storage"
  },
  {
    name: "Grafana Stack",
    description: {
      vi: "Monitoring: Grafana + Loki + Tempo + Prometheus",
      en: "Monitoring: Grafana + Loki + Tempo + Prometheus"
    },
    type: "Monitoring"
  }
];
