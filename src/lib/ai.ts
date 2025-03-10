// src/lib/ai.ts
import { Component, ComponentType, PCBuild } from '@/types/component';
import { Game } from '@/types/game';
import { Software, SoftwareCategory } from '@/types/software';
import { apiClient } from './api';

export class AiService {
  // Bir CPU ve GPU kombinasyonunun darboğaz oluşturup oluşturmayacağını hesapla
  calculateBottleneck(cpu: Component, gpu: Component): {
    bottleneckPercentage: number;
    bottleneckComponent: 'cpu' | 'gpu' | 'balanced';
    explanation: string;
  } {
    if (!cpu || !gpu) {
      return {
        bottleneckPercentage: 0,
        bottleneckComponent: 'balanced',
        explanation: 'CPU veya GPU seçilmediği için darboğaz hesaplanamıyor.'
      };
    }

    // CPU ve GPU benchmark puanlarını al (bunlar API'den gelmeli)
    const cpuScore = cpu.benchmarks?.find(b => b.category === 'single_thread')?.score || 0;
    const gpuScore = gpu.benchmarks?.find(b => b.category === 'gaming')?.score || 0;

    // Basit bir darboğaz algoritması (gerçek bir uygulamada daha karmaşık olmalı)
    const ratio = cpuScore / gpuScore;
    let bottleneckPercentage = 0;
    let bottleneckComponent: 'cpu' | 'gpu' | 'balanced' = 'balanced';
    let explanation = '';

    if (ratio < 0.75) {
      // CPU darboğaz oluşturuyor
      bottleneckPercentage = Math.min(100, Math.round((1 - ratio) * 100));
      bottleneckComponent = 'cpu';
      explanation = `CPU, GPU'nun tam performansını kullanmasını engelliyor. CPU yükseltmesi yapmanız önerilir.`;
    } else if (ratio > 1.25) {
      // GPU darboğaz oluşturuyor
      bottleneckPercentage = Math.min(100, Math.round((ratio - 1) * 50));
      bottleneckComponent = 'gpu';
      explanation = `GPU, CPU'nun tam performansını kullanmasını engelliyor. GPU yükseltmesi yapmanız önerilir.`;
    } else {
      // Dengeli sistem
      bottleneckPercentage = 0;
      bottleneckComponent = 'balanced';
      explanation = 'CPU ve GPU dengeli bir şekilde eşleşmiş, belirgin bir darboğaz bulunmuyor.';
    }

    return {
      bottleneckPercentage,
      bottleneckComponent,
      explanation
    };
  }

  // Bir bilgisayar yapılandırmasının belirli bir oyundaki tahmini FPS değerini hesapla
  async predictGamePerformance(build: PCBuild, game: Game): Promise<{
    resolutions: {
      name: string;
      settings: {
        name: string;
        averageFps: number;
        minimumFps: number;
      }[];
    }[];
  }> {
    const cpu = build.components.cpu;
    const gpu = build.components.gpu;
    const ram = build.components.ram;

    if (!cpu || !gpu || !ram) {
      throw new Error('FPS tahmini için CPU, GPU ve RAM gereklidir.');
    }

    // Bu kısımda normalde AI modeline veya benchmark veritabanına dayalı tahmin yapılır
    // Basitleştirmek için örnek veri döndürüyoruz
    return {
      resolutions: [
        {
          name: '1080p',
          settings: [
            { name: 'Low', averageFps: 180, minimumFps: 140 },
            { name: 'Medium', averageFps: 150, minimumFps: 110 },
            { name: 'High', averageFps: 120, minimumFps: 90 },
            { name: 'Ultra', averageFps: 95, minimumFps: 75 }
          ]
        },
        {
          name: '1440p',
          settings: [
            { name: 'Low', averageFps: 140, minimumFps: 100 },
            { name: 'Medium', averageFps: 110, minimumFps: 85 },
            { name: 'High', averageFps: 90, minimumFps: 70 },
            { name: 'Ultra', averageFps: 75, minimumFps: 55 }
          ]
        },
        {
          name: '4K',
          settings: [
            { name: 'Low', averageFps: 90, minimumFps: 65 },
            { name: 'Medium', averageFps: 70, minimumFps: 50 },
            { name: 'High', averageFps: 55, minimumFps: 40 },
            { name: 'Ultra', averageFps: 40, minimumFps: 30 }
          ]
        }
      ]
    };
  }

  // Kullanıcının mevcut yapılandırmasına ve kullanım amacına göre parça önerileri yap
  async recommendComponents(
    currentBuild: Partial<PCBuild>,
    budget: number,
    purposes: string[]
  ): Promise<{
    recommendations: Partial<Record<ComponentType, Component[]>>;
    reasoning: Record<ComponentType, string>;
  }> {
    // Bu kısımda parça önerileri için AI modeline sorgu atılır
    // Gerçek uygulamada API'ye istek yapılır
    
    // Örnek olarak, eksik veya düşük performanslı parçaları belirle
    const missingComponents: ComponentType[] = [];
    for (const type of Object.values(ComponentType)) {
      if (!currentBuild.components?.[type]) {
        missingComponents.push(type);
      }
    }

    // Öneriler için örnek bir yanıt
    const recommendations: Partial<Record<ComponentType, Component[]>> = {};
    const reasoning: Record<ComponentType, string> = {} as Record<ComponentType, string>;

    // Eksik parçalar için öneriler getir
    for (const type of missingComponents) {
      // Gerçek uygulamada API'den gelir
      const suggestedComponents = await apiClient.getComponents(type, {
        budget: budget / missingComponents.length,
        purpose: purposes.join(',')
      });

      recommendations[type] = suggestedComponents.slice(0, 3); // En iyi 3 öneriyi al
      reasoning[type] = `${type} eksik. Kullanım amacınıza ve bütçenize uygun en iyi seçenekler önerildi.`;
    }

    // Özel öneri mantığı
    if (purposes.includes('gaming') && currentBuild.components?.gpu) {
      const currentGpu = currentBuild.components.gpu;
      
      // Daha iyi GPU öner
      const betterGpus = await apiClient.getComponents(ComponentType.GPU, {
        minBenchmark: currentGpu.benchmarks?.find(b => b.category === 'gaming')?.score,
        budget: budget * 0.4 // Bütçenin %40'ını GPU'ya ayır
      });

      if (betterGpus.length > 0) {
        recommendations[ComponentType.GPU] = betterGpus.slice(0, 3);
        reasoning[ComponentType.GPU] = 'Oyun performansınızı artırmak için daha güçlü bir GPU öneriyoruz.';
      }
    }

    return { recommendations, reasoning };
  }

  // Sistem uyumluluğunu kontrol et
  async checkCompatibility(build: PCBuild): Promise<{
    isCompatible: boolean;
    issues: string[];
    warnings: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // CPU ve anakart soket uyumluluğu
    if (build.components.cpu && build.components.motherboard) {
      const cpuSocket = (build.components.cpu.specs as any).socket;
      const mbSocket = (build.components.motherboard.specs as any).socket;
      
      if (cpuSocket !== mbSocket) {
        issues.push(`CPU soketi (${cpuSocket}) anakart soketi (${mbSocket}) ile uyumlu değil.`);
      }
    }
    
    // RAM ve anakart uyumluluğu
    if (build.components.ram && build.components.motherboard) {
      const ramType = (build.components.ram.specs as any).type;
      const mbRamType = (build.components.motherboard.specs as any).memoryType;
      
      if (ramType !== mbRamType) {
        issues.push(`RAM tipi (${ramType}) anakart RAM tipi (${mbRamType}) ile uyumlu değil.`);
      }
      
      const ramCapacity = (build.components.ram.specs as any).capacityGB;
      const mbMaxMemory = (build.components.motherboard.specs as any).maxMemoryGB;
      
      if (ramCapacity > mbMaxMemory) {
        warnings.push(`Seçilen RAM kapasitesi (${ramCapacity}GB), anakartın desteklediği maksimum kapasiteden (${mbMaxMemory}GB) fazla.`);
      }
    }
    
    // Güç kaynağı yeterliliği
    if (build.components.psu && build.totalWattage) {
      const psuWattage = (build.components.psu.specs as any).wattage;
      
      if (build.totalWattage > psuWattage * 0.8) { // %80 kural
        warnings.push(`Güç kaynağınız (${psuWattage}W) sistem gereksinimleriniz (${build.totalWattage}W) için sınırda kalabilir. Daha yüksek watt değerine sahip bir güç kaynağı düşünmenizi öneririz.`);
      }
    }
    
    // Kasa ve anakart form faktörü uyumluluğu
    if (build.components.case && build.components.motherboard) {
      const caseFormFactors = (build.components.case.specs as any).formFactor;
      const mbFormFactor = (build.components.motherboard.specs as any).formFactor;
      
      if (!caseFormFactors.includes(mbFormFactor)) {
        issues.push(`Anakart form faktörü (${mbFormFactor}) kasa tarafından desteklenmiyor. Desteklenen form faktörleri: ${caseFormFactors.join(', ')}`);
      }
    }
    
    // Kasa ve GPU uzunluk uyumluluğu
    if (build.components.case && build.components.gpu) {
      const maxGpuLength = (build.components.case.specs as any).maxGPULengthMm;
      const gpuLength = (build.components.gpu.specs as any).lengthMm || 0;
      
      if (gpuLength > maxGpuLength) {
        issues.push(`GPU uzunluğu (${gpuLength}mm) kasanın desteklediği maksimum GPU uzunluğunu (${maxGpuLength}mm) aşıyor.`);
      }
    }
    
    // CPU soğutucu uyumluluğu
    if (build.components.cooler && build.components.cpu) {
      const coolerSocketSupport = (build.components.cooler.specs as any).socketSupport;
      const cpuSocket = (build.components.cpu.specs as any).socket;
      
      if (!coolerSocketSupport.includes(cpuSocket)) {
        issues.push(`CPU soğutucu, CPU soketi (${cpuSocket}) ile uyumlu değil. Desteklenen soketler: ${coolerSocketSupport.join(', ')}`);
      }
    }
    
    // Genel öneriler
    if (!build.components.ssd && build.components.hdd) {
      suggestions.push('Sistem performansını artırmak için işletim sistemi için bir SSD eklemenizi öneriyoruz.');
    }
    
    if (build.components.cpu && build.components.gpu) {
      const bottleneck = this.calculateBottleneck(build.components.cpu, build.components.gpu);
      if (bottleneck.bottleneckPercentage > 10) {
        warnings.push(`${bottleneck.bottleneckComponent === 'cpu' ? 'CPU' : 'GPU'} darboğaz tespit edildi (%${bottleneck.bottleneckPercentage}). ${bottleneck.explanation}`);
      }
    }
    
    return {
      isCompatible: issues.length === 0,
      issues,
      warnings,
      suggestions
    };
  }
  
  // Genel sistem puanını hesapla
  calculateSystemScore(build: PCBuild): {
    gaming: number;
    productivity: number;
    streaming: number;
    overall: number;
  } {
    let gamingScore = 0;
    let productivityScore = 0;
    let streamingScore = 0;
    
    // Bileşenlerin benchmark puanlarını kullan
    if (build.components.gpu) {
      const gpuGamingScore = build.components.gpu.benchmarks?.find(b => b.category === 'gaming')?.score || 0;
      gamingScore += gpuGamingScore * 0.6; // GPU oyun performansı için %60 etki
    }
    
    if (build.components.cpu) {
      const cpuSingleCore = build.components.cpu.benchmarks?.find(b => b.category === 'single_thread')?.score || 0;
      const cpuMultiCore = build.components.cpu.benchmarks?.find(b => b.category === 'multi_thread')?.score || 0;
      
      gamingScore += cpuSingleCore * 0.3; // CPU oyun performansı için %30 etki
      productivityScore += cpuMultiCore * 0.5; // CPU üretkenlik için %50 etki
      streamingScore += cpuMultiCore * 0.4; // CPU yayın için %40 etki
    }
    
    if (build.components.ram) {
      const ramCapacity = (build.components.ram.specs as any).capacityGB || 0;
      const ramSpeed = (build.components.ram.specs as any).speedMHz || 0;
      
      const ramScore = (ramCapacity / 32) * 50 + (ramSpeed / 3600) * 50; // 32GB ve 3600MHz için 100 puan
      
      gamingScore += ramScore * 0.1; // RAM oyun performansı için %10 etki
      productivityScore += ramScore * 0.2; // RAM üretkenlik için %20 etki
      streamingScore += ramScore * 0.3; // RAM yayın için %30 etki
    }
    
    if (build.components.storage) {
      const storageSpeed = (build.components.storage.specs as any).readSpeedMBps || 0;
      const storageScore = Math.min(100, storageSpeed / 35); // 3500MB/s için 100 puan
      
      productivityScore += storageScore * 0.3; // Depolama üretkenlik için %30 etki
    }
    
    if (build.components.gpu) {
      const gpuScore = build.components.gpu.benchmarks?.find(b => b.category === 'compute')?.score || 0;
      
      productivityScore += gpuScore * 0.1; // GPU üretkenlik için %10 etki
      streamingScore += gpuScore * 0.3; // GPU yayın için %30 etki
    }
    
    // Puanları 0-100 arası ölçekle
    gamingScore = Math.min(100, gamingScore);
    productivityScore = Math.min(100, productivityScore);
    streamingScore = Math.min(100, streamingScore);
    
    const overall = (gamingScore + productivityScore + streamingScore) / 3;
    
    return {
      gaming: Math.round(gamingScore),
      productivity: Math.round(productivityScore),
      streaming: Math.round(streamingScore),
      overall: Math.round(overall)
    };
  }
}