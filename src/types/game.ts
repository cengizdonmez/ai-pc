// src/types/game.ts
export interface Game {
    id: string;
    name: string;
    coverImage: string;
    releaseDate: string;
    genre: string[];
    developer: string;
    publisher: string;
    description: string;
    rating: number;
    popularity: number;
    esrbRating: string;
    platforms: string[];
    
    // Sistem gereksinimleri
    requirements: {
      minimum: SystemRequirements;
      recommended: SystemRequirements;
      optimal?: SystemRequirements;
    };
    
    // Performans verileri
    performanceData?: {
      cpuImpact: number; // 1-10 arası, CPU'nun oyun performansına etkisi
      gpuImpact: number; // 1-10 arası, GPU'nun oyun performansına etkisi
      ramImpact: number; // 1-10 arası, RAM'in oyun performansına etkisi
      storageImpact: number; // 1-10 arası, depolama hızının oyun performansına etkisi
      
      benchmarks: {
        resolution: '1080p' | '1440p' | '4K';
        settings: 'Low' | 'Medium' | 'High' | 'Ultra';
        hardware: {
          cpu: string;
          gpu: string;
          ram: string;
        };
        averageFps: number;
        onePercentLowFps: number;
      }[];
    };
    
    dlssSupport: boolean;
    fsrSupport: boolean;
    rayTracingSupport: boolean;
  }
  
  export interface SystemRequirements {
    os: string[];
    cpu: string[];
    gpu: string[];
    ram: number; // GB cinsinden
    storage: number; // GB cinsinden
    directX: string;
    additionalNotes?: string;
  }
  
  // src/types/software.ts
  export interface Software {
    id: string;
    name: string;
    category: SoftwareCategory;
    developer: string;
    version: string;
    description: string;
    logo: string;
    requirements: SystemRequirements;
    
    // Yazılım performans gereksinimleri
    performanceImpact: {
      cpuUsage: 'Low' | 'Medium' | 'High';
      gpuUsage: 'Low' | 'Medium' | 'High';
      ramUsage: 'Low' | 'Medium' | 'High';
      storageUsage: number; // GB cinsinden
    };
    
    recommendedHardware?: {
      cpuRecommended: string[];
      gpuRecommended: string[];
      ramRecommended: string;
      storageRecommended: string;
    };
    
    price?: number;
    website?: string;
    downloadUrl?: string;
  }
  
  export enum SoftwareCategory {
    VideoEditing = 'video_editing',
    PhotoEditing = 'photo_editing',
    Gaming = 'gaming',
    Productivity = 'productivity',
    Development = 'development',
    Design = '3d_design',
    Music = 'music_production',
    Streaming = 'streaming',
    Office = 'office',
    Security = 'security',
    VirtualMachine = 'virtual_machine',
  }