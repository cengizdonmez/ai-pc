// src/hooks/use-components.ts
import { useState, useEffect } from "react";
import { Component, ComponentType } from "@/types/component";
import { apiClient } from "@/lib/api";

export function useComponents(type: ComponentType, filters?: Record<string, any>) {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.getComponents(type, filters);
        setComponents(result);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Bilinmeyen hata'));
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, [type, filters]);

  return { components, loading, error };
}