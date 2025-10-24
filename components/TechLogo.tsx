import React from 'react';

interface TechLogoProps {
  tech: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TechLogo({ tech, size = 'md', className = '' }: TechLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  // Technology logos with actual image URLs (placeholder URLs - you can replace with real logos)
  const techLogos: Record<string, { url: string; alt: string; fallbackBg: string; fallbackText: string }> = {
    go: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
      alt: 'Go Logo',
      fallbackBg: 'bg-cyan-500',
      fallbackText: 'Go'
    },
    gin: {
      url: 'https://raw.githubusercontent.com/gin-gonic/logo/master/color.png',
      alt: 'Gin Logo',
      fallbackBg: 'bg-blue-500',
      fallbackText: 'Gin'
    },
    nodejs: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      alt: 'Node.js Logo',
      fallbackBg: 'bg-green-500',
      fallbackText: 'Node'
    },
    typescript: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      alt: 'TypeScript Logo',
      fallbackBg: 'bg-blue-600',
      fallbackText: 'TS'
    },
    postgresql: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      alt: 'PostgreSQL Logo',
      fallbackBg: 'bg-blue-700',
      fallbackText: 'PG'
    },
    redis: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
      alt: 'Redis Logo',
      fallbackBg: 'bg-red-500',
      fallbackText: 'Redis'
    },
    rabbitmq: {
      url: 'https://www.vectorlogo.zone/logos/rabbitmq/rabbitmq-icon.svg',
      alt: 'RabbitMQ Logo',
      fallbackBg: 'bg-orange-500',
      fallbackText: 'RMQ'
    },
    cloudflareR2: {
      url: 'https://www.vectorlogo.zone/logos/cloudflare/cloudflare-icon.svg',
      alt: 'Cloudflare R2 Logo',
      fallbackBg: 'bg-orange-400',
      fallbackText: 'R2'
    },
    docker: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      alt: 'Docker Logo',
      fallbackBg: 'bg-blue-400',
      fallbackText: 'Docker'
    },
    k3s: {
      url: 'https://k3s.io/img/k3s-logo-light.svg',
      alt: 'K3s Logo',
      fallbackBg: 'bg-purple-500',
      fallbackText: 'K3s'
    },
    kubernetes: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      alt: 'Kubernetes Logo',
      fallbackBg: 'bg-blue-600',
      fallbackText: 'K8s'
    },
    grafana: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg',
      alt: 'Grafana Logo',
      fallbackBg: 'bg-orange-600',
      fallbackText: 'Graf'
    },
    loki: {
      url: 'https://grafana.com/static/img/logos/logo-loki.svg',
      alt: 'Loki Logo',
      fallbackBg: 'bg-yellow-600',
      fallbackText: 'Loki'
    },
    tempo: {
      url: 'https://grafana.com/static/img/logos/logo-tempo.svg',
      alt: 'Tempo Logo',
      fallbackBg: 'bg-purple-600',
      fallbackText: 'Tempo'
    },
    prometheus: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg',
      alt: 'Prometheus Logo',
      fallbackBg: 'bg-red-600',
      fallbackText: 'Prom'
    },
    jwt: {
      url: 'https://jwt.io/img/pic_logo.svg',
      alt: 'JWT Logo',
      fallbackBg: 'bg-gray-700',
      fallbackText: 'JWT'
    },
    proxmox: {
      url: 'https://www.vectorlogo.zone/logos/proxmox/proxmox-icon.svg',
      alt: 'Proxmox Logo',
      fallbackBg: 'bg-orange-700',
      fallbackText: 'PVE'
    },
    tailscale: {
      url: 'https://tailscale.com/files/tailscale-logomark-color.svg',
      alt: 'Tailscale Logo',
      fallbackBg: 'bg-indigo-500',
      fallbackText: 'TS'
    },
    debian: {
      url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg',
      alt: 'Debian Logo',
      fallbackBg: 'bg-red-700',
      fallbackText: 'Deb'
    }
  };

  const logoData = techLogos[tech] || {
    url: '',
    alt: tech,
    fallbackBg: 'bg-gray-500',
    fallbackText: tech.slice(0, 3).toUpperCase()
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow overflow-hidden ${className}`}>
      {!imageError && logoData.url ? (
        <img
          src={logoData.url}
          alt={logoData.alt}
          className="w-full h-full object-contain p-1"
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        // Fallback to colored background with text
        <div className={`w-full h-full ${logoData.fallbackBg} flex items-center justify-center`}>
          <span className={`text-white font-bold ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
            {logoData.fallbackText}
          </span>
        </div>
      )}
    </div>
  );
}

// Component for larger technology showcase cards
export function TechShowcase({ tech, name, description, category }: {
  tech: string;
  name: string;
  description: string;
  category: string;
}) {
  return (
    <div className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <TechLogo tech={tech} size="lg" className="group-hover:scale-110 transition-transform duration-300" />
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <span className="text-sm text-primary font-medium">{category}</span>
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
