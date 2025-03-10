// src/types/component.ts
export interface Price {
    amount: number;
    currency: string;
    store: string;
    url?: string;
  }
  
  export interface Benchmark {
    score: number;
    category: string;
    comparedTo?: string;
  }
  
  export interface Component {
    id: string;
    name: string;
    type: ComponentType;
    brand: string;
    model: string;
    image: string;
    specs: Record<string, any>;
    prices: Price[];
    benchmarks?: Benchmark[];
    releaseDate: string;
    popularity: number;
    wattage?: number;
    compatibleWith?: {
      [key in ComponentType]?: string[];
    };
  }
  
  export enum ComponentType {
    CPU = 'cpu',
    GPU = 'gpu',
    Motherboard = 'motherboard',
    RAM = 'ram',
    Storage = 'storage',
    PSU = 'psu',
    Case = 'case',
    Cooler = 'cooler',
    Monitor = 'monitor',
    Keyboard = 'keyboard',
    Mouse = 'mouse',
    Headset = 'headset',
  }
  
  export interface CPUSpecs {
    cores: number;
    threads: number;
    baseClockGHz: number;
    boostClockGHz: number;
    socket: string;
    tdpW: number;
    architecture: string;
    cacheL3MB: number;
    integratedGraphics?: string;
  }
  
  export interface GPUSpecs {
    memoryGB: number;
    memoryType: string;
    coreClock: number;
    boostClock: number;
    tdpW: number;
    ports: string[];
    architecture: string;
    rayTracingSupport: boolean;
    dlssSupport?: boolean;
    fsrSupport?: boolean;
  }
  
  export interface MotherboardSpecs {
    socket: string;
    chipset: string;
    formFactor: string;
    memorySlots: number;
    maxMemoryGB: number;
    memoryType: string;
    pciSlots: {
      pcie_x16: number;
      pcie_x8: number;
      pcie_x4: number;
      pcie_x1: number;
    };
    sataPortsCount: number;
    m2Slots: number;
    wifiBuiltIn: boolean;
    bluetoothBuiltIn: boolean;
    usbPorts: {
      usb2: number;
      usb3: number;
      typeC: number;
    };
  }
  
  export interface RAMSpecs {
    capacityGB: number;
    type: string;
    speedMHz: number;
    casLatency: number;
    modules: number;
    voltage: number;
    rgb: boolean;
  }
  
  export interface StorageSpecs {
    capacityGB: number;
    type: 'SSD' | 'HDD' | 'NVME';
    interface: string;
    cacheSize?: number;
    readSpeedMBps?: number;
    writeSpeedMBps?: number;
    tbw?: number; // Terabytes Written (for SSDs)
  }
  
  export interface PSUSpecs {
    wattage: number;
    efficiency: string; // 80+ rating
    modular: 'Full' | 'Semi' | 'No';
    formFactor: string;
  }
  
  export interface CaseSpecs {
    formFactor: string[];
    dimensions: {
      heightMm: number;
      widthMm: number;
      depthMm: number;
    };
    maxGPULengthMm: number;
    maxCPUCoolerHeightMm: number;
    driveBays: {
      internal2_5: number;
      internal3_5: number;
      external5_25: number;
    };
    frontPorts: string[];
    fanSupport: {
      front: number;
      top: number;
      rear: number;
      bottom: number;
    };
    radiatorSupport: string[];
    windowedSide: boolean;
    rgb: boolean;
  }
  
  export interface CoolerSpecs {
    type: 'Air' | 'Liquid';
    socketSupport: string[];
    radiatorSizeMm?: number; // For liquid coolers
    fans?: number;
    noiseLevel?: string;
    height?: number; // For air coolers
  }
  
  export interface MonitorSpecs {
    sizeInch: number;
    resolution: string;
    panelType: string;
    refreshRateHz: number;
    responseTimeMs: number;
    aspectRatio: string;
    hdrSupport: boolean;
    adaptiveSync?: 'G-Sync' | 'FreeSync' | 'Both' | null;
    ports: string[];
  }
  
  // Birleştirilmiş bir build (bilgisayar yapılandırması)
  export interface PCBuild {
    id?: string;
    name: string;
    components: Partial<Record<ComponentType, Component>>;
    totalPrice: number;
    totalWattage: number;
    createdAt?: string;
    userId?: string;
    performance?: {
      gamingScore: number;
      workstationScore: number;
      streamingScore: number;
      estimatedFps: Record<string, number>; // Oyun başına tahmini FPS
      compatibilityIssues: string[];
      bottlenecks: string[];
      recommendedUpgrades: string[];
    };
  }