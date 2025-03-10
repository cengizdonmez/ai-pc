// src/lib/api.ts
import { Component, ComponentType, PCBuild } from '@/types/component';
import { Game } from '@/types/game';
import { Software } from '@/types/software';

// API istemcisi sınıfı
export class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.pcbuilder.example.com';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`);
    }

    return response.json();
  }

  // Bilgisayar parçalarını getir
  async getComponents(type: ComponentType, filters?: Record<string, any>): Promise<Component[]> {
    let queryParams = '';
    
    if (filters) {
      queryParams = '?' + new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
    }
    
    return this.fetchWithAuth(`/components/${type}${queryParams}`);
  }

  // Tek bir bilgisayar parçasını getir
  async getComponent(type: ComponentType, id: string): Promise<Component> {
    return this.fetchWithAuth(`/components/${type}/${id}`);
  }

  // Oyunları getir
  async getGames(filters?: Record<string, any>): Promise<Game[]> {
    let queryParams = '';
    
    if (filters) {
      queryParams = '?' + new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
    }
    
    return this.fetchWithAuth(`/games${queryParams}`);
  }

  // Tek bir oyunu getir
  async getGame(id: string): Promise<Game> {
    return this.fetchWithAuth(`/games/${id}`);
  }

  // Yazılımları getir
  async getSoftware(filters?: Record<string, any>): Promise<Software[]> {
    let queryParams = '';
    
    if (filters) {
      queryParams = '?' + new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
    }
    
    return this.fetchWithAuth(`/software${queryParams}`);
  }

  // Bilgisayar yapılandırması için performans tahminleri al
  async getPerformancePrediction(build: PCBuild): Promise<PCBuild['performance']> {
    return this.fetchWithAuth('/ai/performance-prediction', {
      method: 'POST',
      body: JSON.stringify({ build }),
    });
  }

  // Belirli bir oyun için FPS tahmini al
  async getGameFpsPrediction(build: PCBuild, gameId: string): Promise<{
    gameName: string;
    predictions: {
      resolution: string;
      settings: string;
      averageFps: number;
      onePercentLowFps: number;
    }[];
  }> {
    return this.fetchWithAuth('/ai/game-fps-prediction', {
      method: 'POST',
      body: JSON.stringify({ build, gameId }),
    });
  }

  // Kullanıcı için parça önerileri al
  async getComponentRecommendations(
    currentBuild: Partial<PCBuild>,
    budget?: number,
    purpose?: string[]
  ): Promise<{
    recommendations: Partial<Record<ComponentType, Component[]>>;
    reasoning: string;
  }> {
    return this.fetchWithAuth('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ currentBuild, budget, purpose }),
    });
  }

  // Yapılandırma uyumluluk kontrolü
  async checkCompatibility(build: PCBuild): Promise<{
    compatible: boolean;
    issues: string[];
    warnings: string[];
    suggestions: string[];
  }> {
    return this.fetchWithAuth('/ai/compatibility-check', {
      method: 'POST',
      body: JSON.stringify({ build }),
    });
  }

  // Kullanıcı yapılandırmasını kaydet
  async saveBuild(build: PCBuild, userId: string): Promise<{ id: string }> {
    return this.fetchWithAuth('/builds', {
      method: 'POST',
      body: JSON.stringify({ ...build, userId }),
    });
  }

  // Parçalar arasında karşılaştırma yap
  async compareComponents(type: ComponentType, componentIds: string[]): Promise<{
    components: Component[];
    comparisonTable: Record<string, any[]>;
  }> {
    return this.fetchWithAuth('/components/compare', {
      method: 'POST',
      body: JSON.stringify({ type, componentIds }),
    });
  }
}

// Singleton API istemcisi
export const apiClient = new ApiClient();