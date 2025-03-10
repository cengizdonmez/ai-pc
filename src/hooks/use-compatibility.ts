// src/hooks/use-compatibility.ts
import { useState } from "react";
import { PCBuild } from "@/types/component";
import { apiClient } from "@/lib/api";

export function useCompatibility() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    compatible: boolean;
    issues: string[];
    warnings: string[];
    suggestions: string[];
  } | null>(null);

  const checkCompatibility = async (build: PCBuild) => {
    setLoading(true);
    try {
      const compatibility = await apiClient.checkCompatibility(build);
      setResult(compatibility);
      return compatibility;
    } catch (error) {
      console.error('Uyumluluk kontrolü başarısız:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkCompatibility, result, loading };
}