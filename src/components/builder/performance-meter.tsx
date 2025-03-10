// src/components/builder/performance-meter.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PCBuild } from '@/types/component';
import { Game } from '@/types/game';
import { apiClient } from '@/lib/api';
import { AiService } from '@/lib/ai';

interface PerformanceMeterProps {
  build: PCBuild;
  selectedGames?: Game[];
}

export const PerformanceMeter: React.FC<PerformanceMeterProps> = ({ build, selectedGames = [] }) => {
  const [performance, setPerformance] = useState<PCBuild['performance']>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('system');
  const [gameFps, setGameFps] = useState<Record<string, any>>({});
  
  const aiService = new AiService();

  useEffect(() => {
    const calculatePerformance = async () => {
      if (!build.components.cpu || !build.components.gpu) {
        setPerformance(undefined);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // API'den performans tahminlerini al
        const performanceData = await apiClient.getPerformancePrediction(build);
        setPerformance(performanceData);
        
        // Seçilen oyunlar için FPS tahminlerini al
        if (selectedGames.length > 0) {
          const fpsPromises = selectedGames.map(game => 
            apiClient.getGameFpsPrediction(build, game.id)
          );
          
          const fpsResults = await Promise.all(fpsPromises);
          const fpsData: Record<string, any> = {};
          
          fpsResults.forEach((result, index) => {
            fpsData[selectedGames[index].id] = result;
          });
          
          setGameFps(fpsData);
        }
      } catch (error) {
        console.error('Performans tahmin edilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    calculatePerformance();
  }, [build, selectedGames]);
  
  // Performans puanına göre renk ve etiket belirle
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return { color: 'bg-green-600', label: 'Mükemmel' };
    if (score >= 80) return { color: 'bg-green-500', label: 'Çok İyi' };
    if (score >= 70) return { color: 'bg-green-400', label: 'İyi' };
    if (score >= 60) return { color: 'bg-yellow-400', label: 'Orta' };
    if (score >= 50) return { color: 'bg-yellow-500', label: 'Kabul Edilebilir' };
    if (score >= 40) return { color: 'bg-orange-500', label: 'Düşük' };
    return { color: 'bg-red-500', label: 'Yetersiz' };
  };

  // FPS değerlendirmeleri
  const getFpsRating = (fps: number, resolution: string) => {
    let thresholds;
    
    if (resolution.includes('4K')) {
      thresholds = { excellent: 80, good: 60, average: 45, poor: 30 };
    } else if (resolution.includes('1440p')) {
      thresholds = { excellent: 100, good: 80, average: 60, poor: 45 };
    } else { // 1080p
      thresholds = { excellent: 144, good: 100, average: 75, poor: 60 };
    }
    
    if (fps >= thresholds.excellent) return { label: 'Mükemmel', color: 'bg-green-600' };
    if (fps >= thresholds.good) return { label: 'Çok İyi', color: 'bg-green-500' };
    if (fps >= thresholds.average) return { label: 'İyi', color: 'bg-green-400' };
    if (fps >= thresholds.poor) return { label: 'Orta', color: 'bg-yellow-400' };
    return { label: 'Düşük', color: 'bg-red-500' };
  };

  // Darboğaz bilgisini göster
  const renderBottleneck = () => {
    if (!build.components.cpu || !build.components.gpu) {
      return <p className="text-muted-foreground">Darboğaz hesaplaması için CPU ve GPU gereklidir.</p>;
    }
    
    const bottleneck = aiService.calculateBottleneck(build.components.cpu, build.components.gpu);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Darboğaz Oranı:</span>
          <Badge 
            variant={bottleneck.bottleneckPercentage > 10 ? "destructive" : "secondary"}
          >
            %{bottleneck.bottleneckPercentage}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Darboğaz Bileşeni:</span>
            <span className="font-medium">
              {bottleneck.bottleneckComponent === 'cpu' 
                ? 'CPU' 
                : bottleneck.bottleneckComponent === 'gpu'
                  ? 'GPU'
                  : 'Dengeli'
              }
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">{bottleneck.explanation}</p>
        </div>
      </div>
    );
  };

  // Uyumluluk sorunlarını göster
  const renderCompatibilityIssues = () => {
    if (!performance || !performance.compatibilityIssues || performance.compatibilityIssues.length === 0) {
      return <p className="text-muted-foreground">Tespit edilen uyumluluk sorunu yok.</p>;
    }
    
    return (
      <div className="space-y-2">
        {performance.compatibilityIssues.map((issue, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-red-500">⚠️</span>
            <p>{issue}</p>
          </div>
        ))}
      </div>
    );
  };

  // Önerilen yükseltmeleri göster
  const renderRecommendedUpgrades = () => {
    if (!performance || !performance.recommendedUpgrades || performance.recommendedUpgrades.length === 0) {
      return <p className="text-muted-foreground">Şu an için önerilen yükseltme yok.</p>;
    }
    
    return (
      <div className="space-y-2">
        {performance.recommendedUpgrades.map((upgrade, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="text-green-500">↑</span>
            <p>{upgrade}</p>
          </div>
        ))}
      </div>
    );
  };

  // Oyun FPS sonuçlarını göster
  const renderGameResults = (game: Game) => {
    if (!gameFps[game.id]) {
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      );
    }
    
    const fpsData = gameFps[game.id];
    
    return (
      <div className="space-y-4">
        {fpsData.predictions.map((prediction: any, index: number) => {
          const fpsRating = getFpsRating(prediction.averageFps, prediction.resolution);
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {prediction.resolution} ({prediction.settings})
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{Math.round(prediction.averageFps)} FPS</span>
                  <Badge className={fpsRating.color}>{fpsRating.label}</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>1% Low: {Math.round(prediction.onePercentLowFps)} FPS</span>
              </div>
              
              <Progress 
                value={Math.min(100, (prediction.averageFps / 144) * 100)} 
                className={`h-2 ${fpsRating.color}`} 
              />
            </div>
          );
        })}
      </div>
    );
  };

  if (!build.components.cpu && !build.components.gpu) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sistem Performansı</CardTitle>
          <CardDescription>
            Performans tahmini için CPU ve GPU seçin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">CPU ve GPU seçildiğinde performans tahminleri burada görüntülenecek.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performans Analizi</CardTitle>
        <CardDescription>
          Sistem ve oyun performans tahminleri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="system" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="system">Sistem</TabsTrigger>
            <TabsTrigger value="games" disabled={selectedGames.length === 0}>Oyunlar</TabsTrigger>
            <TabsTrigger value="bottleneck">Darboğaz</TabsTrigger>
            <TabsTrigger value="compatibility">Uyumluluk</TabsTrigger>
          </TabsList>
          
          <TabsContent value="system" className="space-y-4">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ) : (
              <>
                {performance ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Genel Performans</span>
                        <Badge className={getPerformanceColor(performance.gamingScore).color}>
                          {getPerformanceColor(performance.gamingScore).label}
                        </Badge>
                      </div>
                      <Progress value={performance.gamingScore} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Oyun Performansı</span>
                          <span className="font-medium">{performance.gamingScore}/100</span>
                        </div>
                        <Progress value={performance.gamingScore} className="h-1.5" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>İş İstasyonu</span>
                          <span className="font-medium">{performance.workstationScore}/100</span>
                        </div>
                        <Progress value={performance.workstationScore} className="h-1.5" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Yayın/Multimedya</span>
                          <span className="font-medium">{performance.streamingScore}/100</span>
                        </div>
                        <Progress value={performance.streamingScore} className="h-1.5" />
                      </div>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                      <h4 className="font-medium">Önerilen Yükseltmeler</h4>
                      {renderRecommendedUpgrades()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Performans tahmini için daha fazla bilgisayar parçası seçin.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="games">
            {selectedGames.length > 0 ? (
              <div className="space-y-6">
                {selectedGames.map((game) => (
                  <div key={game.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                        {game.coverImage && (
                          <img 
                            src={game.coverImage} 
                            alt={game.name} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                      </div>
                      <h4 className="font-medium">{game.name}</h4>
                    </div>
                    
                    <div className="pl-12">
                      {renderGameResults(game)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">FPS tahmini için oyun seçin.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bottleneck">
            {renderBottleneck()}
          </TabsContent>
          
          <TabsContent value="compatibility">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Uyumluluk Sorunları</h4>
                {renderCompatibilityIssues()}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Güç Gereksinimleri</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Güç Tüketimi:</span>
                    <span className="font-medium">{build.totalWattage || '?'} W</span>
                  </div>
                  
                  {build.components.psu ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Güç Kaynağı Kapasitesi:</span>
                      <span className="font-medium">{(build.components.psu.specs as any).wattage} W</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Güç kaynağı seçilmedi.</p>
                  )}
                  
                  {build.components.psu && build.totalWattage && (
                    <div className="pt-1">
                      <Progress 
                        value={(build.totalWattage / (build.components.psu.specs as any).wattage) * 100} 
                        className={`h-2 ${
                          (build.totalWattage / (build.components.psu.specs as any).wattage) > 0.8
                            ? 'bg-red-500'
                            : (build.totalWattage / (build.components.psu.specs as any).wattage) > 0.6
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`} 
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span>0 W</span>
                        <span>{(build.components.psu.specs as any).wattage} W</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};