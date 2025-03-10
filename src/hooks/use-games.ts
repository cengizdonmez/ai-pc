// src/hooks/use-games.ts
import { useState, useEffect } from "react";
import { Game } from "@/types/game";
import { apiClient } from "@/lib/api";

export function useGames(filters?: Record<string, any>) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.getGames(filters);
        setGames(result);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Bilinmeyen hata'));
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [filters]);

  return { games, loading, error };
}