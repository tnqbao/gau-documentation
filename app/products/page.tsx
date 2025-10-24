"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechLogo } from "@/components/TechLogo";
import { useTranslation } from 'react-i18next';
import { Film, Globe, Server, ExternalLink, Play, Star, Package, Image } from "lucide-react";
import { useState } from "react";

export default function ProductsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('gau-phim');

  const productTabs = [
    {
      id: 'gau-phim',
      name: 'Gấu Phim',
      icon: Film,
      url: 'https://xemphim.gauas.online',
      description: t('products.gauPhim.description'),
      subtitle: 'Movie Streaming Platform'
    },
    // Có thể thêm các product khác sau này
    // {
    //   id: 'other-product',
    //   name: 'Product 2',
    //   icon: Package,
    //   url: 'https://example.com',
    //   description: 'Description for product 2',
    //   subtitle: 'Another Platform'
    // }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header with enhanced styling */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Package className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">{t('products.subtitle')}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-6">
            {t('products.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Product Tabs Navigation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl"></div>
          <div className="relative border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm p-2">
            <nav className="flex space-x-2 overflow-x-auto">
              {productTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 py-4 px-6 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{tab.name}</span>
                    <ExternalLink className="h-4 w-4 opacity-60" />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Gấu Phim Product Content */}
        {activeTab === 'gau-phim' && (
          <div className="space-y-24">
            {/* Hero Section */}
            <div className="relative overflow-hidden border-2 border-primary/20 shadow-2xl bg-card rounded-2xl">
              <div className="absolute inset-0 gradient-blue opacity-95"></div>
              <div className="relative z-10 text-center py-20">
                <div className="p-8 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 mb-8 mx-auto w-fit">
                  <Film className="h-20 w-20 text-white" />
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
                  {t('products.gauPhim.title')}
                </h1>
                <p className="text-lg text-white/90 font-medium">Movie Streaming Platform</p>
              </div>
            </div>

            {/* About Section */}
            <section className="bg-card border-2 border-border rounded-2xl shadow-lg">
              <div className="p-12">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl font-black flex items-center gap-3 mb-8 text-center justify-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                    {t('products.gauPhim.about')}
                  </h2>
                  <div className="prose prose-lg max-w-none text-center mb-12">
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-8">
                      {t('products.gauPhim.description')}
                    </p>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Gấu Phim là nền tảng streaming phim trực tuyến được xây dựng với công nghệ hiện đại,
                      cung cấp trải nghiệm xem phim chất lượng cao với giao diện thân thiện và tính năng phong phú.
                      Nền tảng này được phát triển dựa trên kiến trúc microservices, đảm bảo hiệu suất ổn định và khả năng mở rộng.
                    </p>
                  </div>

                  {/* Official Website Card */}
                  <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary/15 rounded-xl border border-primary/25">
                          <Globe className="h-12 w-12 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-xl mb-2">{t('products.gauPhim.officialWebsite')}</h3>
                          <a
                            href="https://xemphim.gauas.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 font-mono text-lg flex items-center gap-3 transition-colors font-bold"
                          >
                            https://xemphim.gauas.online
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="bg-card border-2 border-border rounded-2xl shadow-lg">
              <div className="p-12">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-black flex items-center gap-3 mb-8 text-center justify-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                    {t('products.gauPhim.featuresTitle')}
                  </h2>
                  <p className="text-center text-base text-muted-foreground mb-12 max-w-3xl mx-auto">
                    Khám phá những tính năng nổi bật giúp Gấu Phim trở thành lựa chọn hàng đầu cho người yêu điện ảnh
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { key: '4kStreaming', icon: '🎬', color: 'from-red-500/20 to-pink-500/20 border-red-300 dark:border-red-700' },
                      { key: 'offlineDownload', icon: '⬇️', color: 'from-blue-500/20 to-cyan-500/20 border-blue-300 dark:border-blue-700' },
                      { key: 'multiDevice', icon: '📱', color: 'from-green-500/20 to-emerald-500/20 border-green-300 dark:border-green-700' },
                      { key: 'noAds', icon: '🚫', color: 'from-orange-500/20 to-yellow-500/20 border-orange-300 dark:border-orange-700' },
                      { key: 'multiLanguageSubtitle', icon: '🌐', color: 'from-purple-500/20 to-indigo-500/20 border-purple-300 dark:border-purple-700' }
                    ].map((feature, index) => (
                      <Card key={index} className={`bg-gradient-to-br ${feature.color} border-2 shadow-lg hover:scale-105 transition-transform`}>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center gap-4">
                            <span className="text-4xl">{feature.icon}</span>
                            <span className="font-bold text-base">{t(`products.gauPhim.features.${feature.key}`)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Implementation Section */}
            <section className="bg-card border-2 border-border rounded-2xl shadow-lg">
              <div className="p-12">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-black flex items-center gap-3 mb-8 text-center justify-center">
                    <Package className="h-8 w-8 text-blue-500" />
                    {t('products.gauPhim.techImplementation')}
                  </h2>
                  <p className="text-center text-base text-muted-foreground mb-12 max-w-3xl mx-auto">
                    Công nghệ hiện đại được sử dụng để xây dựng một hệ thống streaming mạnh mẽ, có khả năng mở rộng và đáng tin cậy
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { tech: 'k3s', title: 'K3s Kubernetes', desc: t('products.gauPhim.techDetails.containerOrchestration'), color: 'gradient-blue' },
                      { icon: Server, title: 'Microservices', desc: t('products.gauPhim.techDetails.scalableArchitecture'), color: 'gradient-green' },
                      { tech: 'cloudflareR2', title: 'CDN Integration', desc: t('products.gauPhim.techDetails.globalContentDelivery'), color: 'gradient-orange' }
                    ].map((item, index) => (
                      <Card key={index} className="border-2 border-border shadow-lg hover:scale-105 transition-transform">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center gap-4">
                            <div className={`p-4 rounded-xl ${item.color}`}>
                              {item.tech ? (
                                <TechLogo tech={item.tech} size="md" />
                              ) : (
                                <item.icon className="h-10 w-10 text-white" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-black text-lg mb-2">{item.title}</h3>
                              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Preview Section */}
            <section className="bg-card border-2 border-border rounded-2xl shadow-lg">
              <div className="p-12">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-3xl font-black flex items-center gap-3 mb-8 text-center justify-center">
                    <Image className="h-8 w-8 text-primary" />
                    Preview
                  </h2>
                  <p className="text-center text-base text-muted-foreground mb-12 max-w-3xl mx-auto">
                    Xem trước giao diện và tính năng của Gấu Phim, hoặc truy cập trực tiếp để trải nghiệm đầy đủ
                  </p>

                  <div className="space-y-12">
                    {/* Main Preview Area */}
                    <div className="relative">
                      <Badge className="absolute top-6 left-6 z-10 bg-primary text-primary-foreground border border-primary/30 text-sm px-4 py-2">
                        <Play className="h-4 w-4 mr-2" />
                        {t('products.gauPhim.liveFromWebsite')}
                      </Badge>
                      <div className="aspect-video bg-gradient-to-br from-primary/15 via-primary/10 to-secondary/20 border-2 border-dashed border-primary/40 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                        <div className="text-center z-10">
                          <div className="p-8 bg-white/20 dark:bg-black/20 rounded-full backdrop-blur-sm mb-6 mx-auto w-fit border border-primary/30">
                            <Film className="h-20 w-20 text-primary" />
                          </div>
                          <p className="text-2xl font-black text-primary mb-6">Gấu Phim Preview</p>
                          <a
                            href="https://xemphim.gauas.online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg text-base"
                          >
                            {t('products.gauPhim.accessWebsite')}
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Preview Images - Large Layout with Captions */}
                    <div className="space-y-8">
                      <h3 className="text-xl font-bold text-center">{t('products.gauPhim.screenshotsTitle')}</h3>
                      <div className="space-y-12">
                        {[
                          {
                            id: 1,
                            titleKey: "homepage.title",
                            descKey: "homepage.description",
                            imageUrl: "https://cdn.gauas.online/images/random/gauphim_01.png"
                          },
                          {
                            id: 2,
                            titleKey: "movieDetail.title",
                            descKey: "movieDetail.description",
                            imageUrl: "https://cdn.gauas.online/images/random/gauphim_02.png"
                          },
                          {
                            id: 3,
                            titleKey: "videoPlayer.title",
                            descKey: "videoPlayer.description",
                            imageUrl: "https://cdn.gauas.online/images/random/gauphim_03.png"
                          }
                        ].map((preview) => (
                          <figure key={preview.id} className="space-y-4">
                            <div className="relative group cursor-pointer">
                              <div className="aspect-video w-full bg-gradient-to-br from-secondary/60 to-muted/80 border-2 border-border rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                                <img
                                  src={preview.imageUrl}
                                  alt={t(`products.gauPhim.screenshots.${preview.titleKey}`)}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                              {/* Overlay effect */}
                              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                                <div className="p-3 bg-white/20 dark:bg-black/20 rounded-full backdrop-blur-sm">
                                  <Play className="h-8 w-8 text-primary" />
                                </div>
                              </div>
                            </div>
                            <figcaption className="text-center space-y-2">
                              <h4 className="font-bold text-lg text-foreground">
                                {t(`products.gauPhim.screenshots.${preview.titleKey}`)}
                              </h4>
                              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                {t(`products.gauPhim.screenshots.${preview.descKey}`)}
                              </p>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>

                    <div className="text-center pt-8">
                      <p className="text-base text-muted-foreground font-medium">
                        {t('products.gauPhim.screenshotsNote')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Placeholder for other products */}
        {/* Khi có thêm product khác, chỉ cần thêm điều kiện tương tự ở đây */}
      </div>
    </div>
  );
}
