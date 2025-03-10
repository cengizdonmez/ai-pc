// src/components/builder/price-calculator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { PCBuild, ComponentType, Component } from '@/types/component';

interface PriceCalculatorProps {
  build: PCBuild;
  onSaveBuild: () => void;
  onClearBuild: () => void;
  onShareBuild: () => void;
}

interface PriceStore {
  store: string;
  totalPrice: number;
  available: boolean;
  url?: string;
  components: Record<string, {price: number, url?: string}>;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  build,
  onSaveBuild,
  onClearBuild,
  onShareBuild
}) => {
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [storeOptions, setStoreOptions] = useState<PriceStore[]>([]);
  const [includePeripherals, setIncludePeripherals] = useState(true);
  
  // Mağaza seçeneklerini ve toplam fiyatları hesapla
  useEffect(() => {
    if (!build || !build.components) return;
    
    // Bilgisayar bileşenlerinden mağaza listesini oluştur
    const stores: Record<string, PriceStore> = {};
    
    // Periferilerin dahil edilip edilmeyeceğini kontrol et
    const componentTypes = Object.values(ComponentType).filter(type => 
      includePeripherals || 
      (type !== ComponentType.Monitor && type !== ComponentType.Keyboard && type !== ComponentType.Mouse && type !== ComponentType.Headset)
    );
    
    // Her bileşen için mağazaları ve fiyatları işle
    for (const type of componentTypes) {
      const component = build.components[type];
      if (!component) continue;
      
      for (const price of component.prices) {
        if (!stores[price.store]) {
          stores[price.store] = {
            store: price.store,
            totalPrice: 0,
            available: true,
            components: {}
          };
        }
        
        stores[price.store].components[type] = {
          price: price.amount,
          url: price.url
        };
        
        stores[price.store].totalPrice += price.amount;
      }
    }
    
    // Her mağaza için ürün uygunluğunu kontrol et
    for (const storeName in stores) {
      const store = stores[storeName];
      let missingComponents = 0;
      
      for (const type of componentTypes) {
        if (build.components[type] && !store.components[type]) {
          missingComponents++;
        }
      }
      
      // Eğer eksik ürün sayısı çok fazlaysa, mağazayı "uygun değil" olarak işaretle
      store.available = missingComponents <= 2; // En fazla 2 eksik parça olabilir
    }
    
    // Fiyata göre sırala ve toplam fiyata göre ilk mağazayı seç
    const sortedStores = Object.values(stores)
      .filter(store => store.available)
      .sort((a, b) => a.totalPrice - b.totalPrice);
    
    setStoreOptions(sortedStores);
    
    if (sortedStores.length > 0 && !selectedStore) {
      setSelectedStore(sortedStores[0].store);
    }
  }, [build, includePeripherals, selectedStore]);

  // Seçili mağazayı bul
  const selectedStoreOption = storeOptions.find(store => store.store === selectedStore);
  
  // Bileşenlerin toplam fiyatını hesapla
  const calculateComponentTotal = (type: ComponentType) => {
    if (!selectedStoreOption) return 0;
    
    return selectedStoreOption.components[type]?.price || 0;
  };
  
  // Seçili tüm parçaları göster
  const renderSelectedComponents = () => {
    if (!build || !build.components) return null;

    const componentTypes = Object.values(ComponentType).filter(type => 
      includePeripherals || 
      (type !== ComponentType.Monitor && type !== ComponentType.Keyboard && type !== ComponentType.Mouse && type !== ComponentType.Headset)
    );
    
    const selectedComponents = componentTypes
      .filter(type => build.components[type])
      .map(type => ({ type, component: build.components[type]! }));
    
    if (selectedComponents.length === 0) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          Henüz bir parça seçilmedi. Bilgisayar yapılandırmanızı oluşturmak için parçaları seçin.
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {selectedComponents.map(({ type, component }) => {
          const price = calculateComponentTotal(type);
          
          return (
            <div key={type} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-2">
                <div className="font-medium whitespace-nowrap min-w-20">{translateComponentType(type)}</div>
                <div className="text-sm truncate">{component.name}</div>
              </div>
              <div className="font-medium tabular-nums ml-4">
                {price > 0 ? `${price.toLocaleString('tr-TR')} TL` : 'Fiyat yok'}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Bileşen tipini Türkçe'ye çevir
  const translateComponentType = (type: ComponentType) => {
    const translations: Record<ComponentType, string> = {
      [ComponentType.CPU]: 'İşlemci',
      [ComponentType.GPU]: 'Ekran Kartı',
      [ComponentType.Motherboard]: 'Anakart',
      [ComponentType.RAM]: 'RAM',
      [ComponentType.Storage]: 'Depolama',
      [ComponentType.PSU]: 'Güç Kaynağı',
      [ComponentType.Case]: 'Kasa',
      [ComponentType.Cooler]: 'Soğutucu',
      [ComponentType.Monitor]: 'Monitör',
      [ComponentType.Keyboard]: 'Klavye',
      [ComponentType.Mouse]: 'Fare',
      [ComponentType.Headset]: 'Kulaklık',
    };
    
    return translations[type] || type;
  };
  
  // Toplam fiyatı hesapla
  const calculateTotal = () => {
    if (!selectedStoreOption) return 0;
    return selectedStoreOption.totalPrice;
  };
  
  // Eksik parçaları bul
  const getMissingComponents = () => {
    if (!build || !build.components) return [];
    
    const essentialComponents = [
      ComponentType.CPU,
      ComponentType.Motherboard,
      ComponentType.RAM,
      ComponentType.Storage,
      ComponentType.PSU,
      ComponentType.Case
    ];
    
    return essentialComponents.filter(type => !build.components[type]);
  };
  
  const missingComponents = getMissingComponents();
  const isComplete = missingComponents.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yapılandırma Özeti</CardTitle>
        <CardDescription>
          Seçilen bileşenler ve toplam fiyat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sistemin Tam Olup Olmadığını Gösteren Badge */}
        <div className="flex justify-end">
          {isComplete ? (
            <Badge className="bg-green-500">Tam Sistem</Badge>
          ) : (
            <Badge variant="outline" className="text-amber-500 border-amber-500">
              Tamamlanmamış
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={includePeripherals}
              onCheckedChange={setIncludePeripherals}
              id="peripherals"
            />
            <label htmlFor="peripherals" className="text-sm cursor-pointer">
              Çevre birimlerini dahil et
            </label>
          </div>
          
          {storeOptions.length > 0 && (
            <div className="text-sm">
              <span className="text-muted-foreground mr-1">Mağaza:</span>
              <select 
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="font-medium bg-transparent outline-none cursor-pointer"
              >
                {storeOptions.map((store) => (
                  <option key={store.store} value={store.store}>
                    {store.store}
                  </option>
                ))}
              </select>
            </div>
            )}
            </div>
            {renderSelectedComponents()}
            <div className="flex justify-between">
              <div className="font-medium">Toplam</div>
              <div className="font-medium tabular-nums">
                {calculateTotal().toLocaleString('tr-TR')} TL
              </div>
            </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={onClearBuild}>
                  Yapılandırmayı Temizle
                </Button>
                <div>
                  <Button variant="outline" onClick={onSaveBuild}>
                    Kaydet
                  </Button>
                  <Button onClick={onShareBuild}>
                    Paylaş
                  </Button>
                </div>
              </div>
            </CardFooter>
            </Card>
            );
            }
            