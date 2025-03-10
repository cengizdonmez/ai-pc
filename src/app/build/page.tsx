// src/app/build/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComponentSelector } from '@/components/builder/component-selector';
import { PerformanceMeter } from '@/components/builder/performance-meter';
import { PriceCalculator } from '@/components/builder/price-calculator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ComponentType, Component, PCBuild } from '@/types/component';
import { Game } from '@/types/game';
import { apiClient } from '@/lib/api';
import { AiService } from '@/lib/ai';

export default function BuildPage() {
  const [currentBuild, setCurrentBuild] = useState<PCBuild>({
    name: 'Yeni Bilgisayar',
    components: {},
    totalPrice: 0,
    totalWattage: 0,
  });
  
  const [buildPurpose, setBuildPurpose] = useState<string[]>(['gaming']);
  const [budget, setBudget] = useState<number>(10000);
  const [buildName, setBuildName] = useState<string>('Yeni Bilgisayar');
  const [recommendations, setRecommendations] = useState<Record<string, Component[]>>({});
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState('components');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const aiService = new AiService();

  // URL'den yapılandırma yükle
  useEffect(() => {
    const loadBuildFromUrl = async () => {
      const buildId = searchParams.get('id');
      if (buildId) {
        setIsLoading(true);
        try {
          // API'den yapılandırmayı getir
          const buildData = await fetch(`/api/builds/${buildId}`).then(res => res.json());
          setCurrentBuild(buildData);
          setBuildName(buildData.name);
          setBuildPurpose(buildData.purpose || ['gaming']);
          setBudget(buildData.budget || 10000);
        } catch (error) {
          console.error('Yapılandırma yüklenirken hata oluştu:', error);
          toast({
            title: 'Hata',
            description: 'Yapılandırma yüklenirken bir sorun oluştu.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadBuildFromUrl();
  }, [searchParams, toast]);

  // Mevcut yapılandırmadaki parçaların tutarlılığını kontrol et
  useEffect(() => {
    const checkBuildConsistency = async () => {
      if (Object.keys(currentBuild.components).length > 0) {
        setIsLoading(true);
        try {
          // Uyumluluğu kontrol et
          const compatibilityCheck = await aiService.checkCompatibility(currentBuild);
          
          // Eğer ciddi uyumsuzluklar varsa kullanıcıyı uyar
          if (!compatibilityCheck.isCompatible) {
            toast({
              title: 'Uyumluluk Sorunu',
              description: compatibilityCheck.issues[0],
              variant: 'destructive',
            });
          }
          
          // Toplam güç tüketimini hesapla
          let totalWattage = 0;
          Object.values(currentBuild.components).forEach(component => {
            if (component.wattage) {
              totalWattage += component.wattage;
            }
          });
          
          // Toplam fiyatı hesapla (en düşük fiyat)
          let totalPrice = 0;
          Object.values(currentBuild.components).forEach(component => {
            if (component.prices && component.prices.length > 0) {
              const lowestPrice = component.prices.reduce((min, price) => 
                price.amount < min ? price.amount : min, component.prices[0].amount);
              totalPrice += lowestPrice;
            }
          });
          
          // Build nesnesini güncelle
          setCurrentBuild(prev => ({
            ...prev,
            totalWattage,
            totalPrice
          }));
          
        } catch (error) {
          console.error('Yapılandırma tutarlılığı kontrol edilirken hata oluştu:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkBuildConsistency();
  }, [currentBuild.components, toast]);

  // Oyun listesini yükle
  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await apiClient.getGames({ popular: true, limit: 20 });
        setAvailableGames(games);
      } catch (error) {
        console.error('Oyunlar yüklenirken hata oluştu:', error);
      }
    };

    loadGames();
  }, []);

  // Parça önerilerini getir
  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const result = await apiClient.getComponentRecommendations(
        currentBuild,
        budget,
        buildPurpose
      );
      
      setRecommendations(result.recommendations);
      
      toast({
        title: 'Öneriler hazır',
        description: 'Kullanım amacınıza ve bütçenize göre öneriler hazırlandı.',
      });
    } catch (error) {
      console.error('Öneriler alınırken hata oluştu:', error);
      toast({
        title: 'Hata',
        description: 'Öneriler alınırken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Parça seçme işlevi
  const handleComponentSelect = (type: ComponentType, component: Component) => {
    setCurrentBuild(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [type]: component
      }
    }));
    
    // Önerileri temizle
    setRecommendations({});
  };

  // Parça kaldırma işlevi
  const handleComponentRemove = (type: ComponentType) => {
    const updatedComponents = { ...currentBuild.components };
    delete updatedComponents[type];
    
    setCurrentBuild(prev => ({
      ...prev,
      components: updatedComponents
    }));
  };

  // Yapılandırmayı kaydetme işlevi
  const handleSaveBuild = async () => {
    setIsLoading(true);
    try {
      // Kullanıcı ID'si, gerçek uygulamada oturum yönetiminden alınır
      const userId = '123';
      
      const response = await apiClient.saveBuild({
        ...currentBuild,
        name: buildName,
      }, userId);
      
      toast({
        title: 'Başarılı',
        description: 'Yapılandırmanız kaydedildi.',
      });
      
      // Kaydedilen yapılandırmaya yönlendir
      router.push(`/saved-builds/${response.id}`);
    } catch (error) {
      console.error('Yapılandırma kaydedilirken hata oluştu:', error);
      toast({
        title: 'Hata',
        description: 'Yapılandırma kaydedilirken bir sorun oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Yapılandırmayı paylaşma işlevi
  const handleShareBuild = () => {
    // Gerçek uygulamada, yapılandırma ID'si ile bir URL oluşturulur
    const shareUrl = `${window.location.origin}/build?id=123`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: 'Bağlantı kopyalandı',
        description: 'Yapılandırma bağlantısı panoya kopyalandı.',
      });
    });
  };

  // Yapılandırmayı temizleme işlevi
  const handleClearBuild = () => {
    if (confirm('Tüm yapılandırmayı silmek istediğinizden emin misiniz?')) {
      setCurrentBuild({
        name: 'Yeni Bilgisayar',
        components: {},
        totalPrice: 0,
        totalWattage: 0,
      });
      setBuildName('Yeni Bilgisayar');
      setRecommendations({});
      toast({
        title: 'Temizlendi',
        description: 'Yapılandırma temizlendi.',
      });
    }
  };