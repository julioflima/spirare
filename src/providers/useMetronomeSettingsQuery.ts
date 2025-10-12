import { useQuery, type QueryKey } from "@tanstack/react-query";
import type { GetMetronomeSettingsResponse } from "@/types/api";
import type { MetronomeSettings } from "@/types";

export const METRONOME_SETTINGS_QUERY_KEY: QueryKey = [
  "metronome-settings",
];

export const useMetronomeSettingsQuery = () => {
  return useQuery<MetronomeSettings>({
    queryKey: METRONOME_SETTINGS_QUERY_KEY,
    staleTime: Infinity,
  gcTime: Infinity,
    queryFn: async () => {
      const response = await fetch("/api/settings/metronome", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          "Não foi possível carregar as configurações do metrônomo."
        );
      }

      const payload =
        (await response.json()) as GetMetronomeSettingsResponse;
      return payload.settings;
    },
  });
};
