// src/hooks/use-performance.ts
import { useState } from "react";
import { PCBuild } from "@/types/component";
import { Game } from "@/types/game";
import { apiClient } from "@/lib/api";

export function usePerformance() {
  const [loading, setLoading] = useState(false);
  const [performance, setPerformance] = useState<PCBuild['performance'] | null>(null);

  const predictPerformance = async (build: PCBuild) => {
    setLoading(true);
    try {
      const performanceData = await apiClient.getPerformancePrediction(build);
      setPerformance(performanceData);
      return performanceData;
    } catch (error) {
      console.error('Performans tahmini başarısız:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const predictGameFps = async (build: PCBuild, gameId: string) => {
    setLoading(true);
    try {
      return await apiClient.getGameFpsPrediction(build, gameId);
    } catch (error) {
      console.error('FPS tahmini başarısız:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { predictPerformance, predictGameFps, performance, loading };
}