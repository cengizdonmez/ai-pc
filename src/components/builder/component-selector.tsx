// src/components/builder/component-selector.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { 
  Component, 
  ComponentType,
  PCBuild
} from '@/types/component';
import { apiClient } from '@/lib/api';

interface ComponentSelectorProps {
  currentBuild: PCBuild;
  onComponentSelect: (type: ComponentType, component: Component) => void;
  onComponentRemove: (type: ComponentType) => void;
}

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  currentBuild,
  onComponentSelect,
  onComponentRemove
}) => {
  const [activeType, setActiveType] = useState<ComponentType>(ComponentType.CPU);
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Parçaları getir
  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        const result = await apiClient.getComponents(activeType, filters);
        setComponents(result);
      } catch (error) {
        console.error('Bilgisayar parçaları getirilirken hata oluştu:', error);
        toast({
          title: 'Hata',
          description: 'Parçalar yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [activeType, filters, toast]);

  // Filtreleri sıfırla
  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Kategori bazlı filtreler
  const renderFilters = () => {
    switch (activeType) {
      case ComponentType.CPU:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Marka</label>
              <Select 
                value={filters.brand || ''}
                onValueChange={(value) => setFilters({...filters, brand: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm markalar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm markalar</SelectItem>
                  <SelectItem value="amd">AMD</SelectItem>
                  <SelectItem value="intel">Intel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Soket</label>
              <Select 
                value={filters.socket || ''}
                onValueChange={(value) => setFilters({...filters, socket: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm soketler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm soketler</SelectItem>
                  <SelectItem value="am4">AM4</SelectItem>
                  <SelectItem value="am5">AM5</SelectItem>
                  <SelectItem value="lga1700">LGA1700</SelectItem>
                  <SelectItem value="lga1200">LGA1200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Min çekirdek sayısı</label>
              <Select 
                value={filters.minCores?.toString() || ''}
                onValueChange={(value) => setFilters({...filters, minCores: value ? parseInt(value) : ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçim yok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Seçim yok</SelectItem>
                  <SelectItem value="4">4 çekirdek+</SelectItem>
                  <SelectItem value="6">6 çekirdek+</SelectItem>
                  <SelectItem value="8">8 çekirdek+</SelectItem>
                  <SelectItem value="12">12 çekirdek+</SelectItem>
                  <SelectItem value="16">16 çekirdek+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tümleşik GPU</label>
              <Select 
                value={filters.integratedGraphics?.toString() || ''}
                onValueChange={(value) => setFilters({...filters, integratedGraphics: value === 'true'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hepsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Hepsi</SelectItem>
                  <SelectItem value="true">Var</SelectItem>
                  <SelectItem value="false">Yok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case ComponentType.GPU:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Marka</label>
              <Select 
                value={filters.brand || ''}
                onValueChange={(value) => setFilters({...filters, brand: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm markalar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm markalar</SelectItem>
                  <SelectItem value="nvidia">NVIDIA</SelectItem>
                  <SelectItem value="amd">AMD</SelectItem>
                  <SelectItem value="intel">Intel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Min bellek</label>
              <Select 
                value={filters.minMemory?.toString() || ''}
                onValueChange={(value) => setFilters({...filters, minMemory: value ? parseInt(value) : ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seçim yok" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Seçim yok</SelectItem>
                  <SelectItem value="4">4GB+</SelectItem>
                  <SelectItem value="6">6GB+</SelectItem>
                  <SelectItem value="8">8GB+</SelectItem>
                  <SelectItem value="10">10GB+</SelectItem>
                  <SelectItem value="12">12GB+</SelectItem>
                  <SelectItem value="16">16GB+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ray Tracing</label>
              <Select 
                value={filters.rayTracingSupport?.toString() || ''}
                onValueChange={(value) => setFilters({...filters, rayTracingSupport: value === 'true'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hepsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Hepsi</SelectItem>
                  <SelectItem value="true">Destekliyor</SelectItem>
                  <SelectItem value="false">Desteklemiyor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bellek tipi</label>
              <Select 
                value={filters.memoryType || ''}
                onValueChange={(value) => setFilters({...filters, memoryType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm tipler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm tipler</SelectItem>
                  <SelectItem value="gddr6x">GDDR6X</SelectItem>
                  <SelectItem value="gddr6">GDDR6</SelectItem>
                  <SelectItem value="gddr5">GDDR5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      // Diğer bileşen türleri için de benzer filtreler eklenebilir
      default:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Marka</label>
              <Select 
                value={filters.brand || ''}
                onValueChange={(value) => setFilters({...filters, brand: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tüm markalar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tüm markalar</SelectItem>
                  <SelectItem value="asus">Asus</SelectItem>
                  <SelectItem value="msi">MSI</SelectItem>
                  <SelectItem value="gigabyte">Gigabyte</SelectItem>
                  <SelectItem value="asrock">ASRock</SelectItem>
                  <SelectItem value="evga">EVGA</SelectItem>
                  <SelectItem value="corsair">Corsair</SelectItem>
                  <SelectItem value="kingston">Kingston</SelectItem>
                  <SelectItem value="crucial">Crucial</SelectItem>
                  <SelectItem value="seagate">Seagate</SelectItem>
                  <SelectItem value="wd">Western Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Fiyat aralığı</label>
              <div className="pt-2">
                <Slider 
                  min={0}
                  max={10000}
                  step={100}
                  value={[filters.minPrice || 0, filters.maxPrice || 10000]}
                  onValueChange={(value) => setFilters({...filters, minPrice: value[0], maxPrice: value[1]})}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>{filters.minPrice || 0} TL</span>
                  <span>{filters.maxPrice || 10000} TL</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Arama ve filtreleme mantığı
  const filteredComponents = components.filter(component => {
    if (searchTerm) {
      return (
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        component.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        component.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  // Bileşen kartı render işlevi
  const renderComponentCard = (component: Component) => {
    const isSelected = currentBuild.components[activeType]?.id === component.id;
    const lowestPrice = component.prices.sort((a, b) => a.amount - b.amount)[0];
    
    // İlgili benchmark puanını seç
    let benchmarkScore = 0;
    let benchmarkCategory = '';
    
    if (component.benchmarks && component.benchmarks.length > 0) {
      switch (activeType) {
        case ComponentType.CPU:
          const singleThread = component.benchmarks.find(b => b.category === 'single_thread');
          if (singleThread) {
            benchmarkScore = singleThread.score;
            benchmarkCategory = 'Tek Çekirdek Puanı';
          }
          break;
        case ComponentType.GPU:
          const gaming = component.benchmarks.find(b => b.category === 'gaming');
          if (gaming) {
            benchmarkScore = gaming.score;
            benchmarkCategory = 'Oyun Performansı';
          }
          break;
        default:
          if (component.benchmarks[0]) {
            benchmarkScore = component.benchmarks[0].score;
            benchmarkCategory = 'Performans Puanı';
          }
      }
    }
    
    return (
      <Card 
        key={component.id} 
        className={`hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg line-clamp-1">{component.name}</CardTitle>
            <Badge variant={getBadgeVariant(benchmarkScore)}>{benchmarkScore}</Badge>
          </div>
          <CardDescription className="flex items-center justify-between">
            <span>{component.brand} {component.model}</span>
            {benchmarkCategory && <small className="text-xs">{benchmarkCategory}</small>}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="h-32 flex items-center justify-center mb-3">
            <Image 
              src={component.image || `/images/components/${activeType}-placeholder.png`} 
              alt={component.name}
              width={120}
              height={120}
              className="object-contain max-h-full"
            />
          </div>
          
          {renderKeySpecs(component)}
          
          {lowestPrice && (
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-sm text-muted-foreground">En düşük fiyat</div>
                <div className="text-lg font-bold">{lowestPrice.amount} {lowestPrice.currency}</div>
              </div>
              <div className="text-xs text-muted-foreground">{lowestPrice.store}</div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            variant={isSelected ? "destructive" : "default"}
            className="w-full"
            onClick={() => {
              if (isSelected) {
                onComponentRemove(activeType);
              } else {
                onComponentSelect(activeType, component);
              }
            }}
          >
            {isSelected ? "Kaldır" : "Seç"}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => window.open(`/components/${activeType}/${component.id}`, '_blank')}
          >
            <span className="sr-only">Detaylar</span>
            <span>🔍</span>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Performans puanına göre badge varyantı seç
  const getBadgeVariant = (score: number) => {
    if (score >= 90) return "destructive";
    if (score >= 80) return "default";
    if (score >= 70) return "secondary";
    return "outline";
  };

  // Parça tipine göre önemli özellikleri göster
  const renderKeySpecs = (component: Component) => {
    switch (activeType) {
      case ComponentType.CPU:
        const cpuSpecs = component.specs as any;
        return (
          <div className="grid grid-cols-2 gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Çekirdek:</span>
              <span>{cpuSpecs.cores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thread:</span>
              <span>{cpuSpecs.threads}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hız:</span>
              <span>{cpuSpecs.baseClockGHz} GHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Turbo:</span>
              <span>{cpuSpecs.boostClockGHz} GHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soket:</span>
              <span>{cpuSpecs.socket}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TDP:</span>
              <span>{cpuSpecs.tdpW}W</span>
            </div>
          </div>
        );
      
      case ComponentType.GPU:
        const gpuSpecs = component.specs as any;
        return (
          <div className="grid grid-cols-2 gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bellek:</span>
              <span>{gpuSpecs.memoryGB} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bellek tipi:</span>
              <span>{gpuSpecs.memoryType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hız:</span>
              <span>{gpuSpecs.coreClock} MHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Boost:</span>
              <span>{gpuSpecs.boostClock} MHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TDP:</span>
              <span>{gpuSpecs.tdpW}W</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ray Tracing:</span>
              <span>{gpuSpecs.rayTracingSupport ? "Evet" : "Hayır"}</span>
            </div>
          </div>
        );
      
      // Diğer bileşen tipleri için benzer renderlar eklenebilir
      default:
        return (
          <div className="h-20 text-sm">
            <div className="text-muted-foreground">Detaylar için tıklayın</div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <Tabs 
          defaultValue={ComponentType.CPU} 
          value={activeType}
          onValueChange={(value) => setActiveType(value as ComponentType)}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-1">
            <TabsTrigger value={ComponentType.CPU}>CPU</TabsTrigger>
            <TabsTrigger value={ComponentType.Motherboard}>Anakart</TabsTrigger>
            <TabsTrigger value={ComponentType.RAM}>RAM</TabsTrigger>
            <TabsTrigger value={ComponentType.GPU}>GPU</TabsTrigger>
            <TabsTrigger value={ComponentType.Storage}>Depolama</TabsTrigger>
            <TabsTrigger value={ComponentType.PSU}>Güç</TabsTrigger>
            <TabsTrigger value={ComponentType.Cooler}>Soğutma</TabsTrigger>
            <TabsTrigger value={ComponentType.Case}>Kasa</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80"
          />
          <Button variant="outline" onClick={resetFilters}>
            Sıfırla
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card/50">
        {renderFilters()}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="p-4 pb-2">
                <div className="h-6 bg-muted rounded-md"></div>
                <div className="h-4 mt-2 bg-muted rounded-md w-2/3"></div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="h-32 bg-muted rounded-md mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded-md"></div>
                  <div className="h-4 bg-muted rounded-md"></div>
                  <div className="h-4 bg-muted rounded-md"></div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-10 bg-muted rounded-md w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredComponents.length === 0 ? (
            <div className="text-center py-10 bg-card border rounded-md">
              <p className="text-lg mb-2">Aradığınız kriterlere uygun parça bulunamadı.</p>
              <p className="text-muted-foreground">Lütfen filtreleri değiştirin veya farklı bir arama terimi deneyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {filteredComponents.map(renderComponentCard)}
            </div>
          )}
        </>
      )}
    </div>
  );
};