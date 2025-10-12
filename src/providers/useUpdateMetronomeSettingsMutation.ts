import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UpdateMetronomeSettingsRequest,
  UpdateMetronomeSettingsResponse,
} from "@/types/api";
import type { MetronomeSettings } from "@/types";
import { METRONOME_SETTINGS_QUERY_KEY } from "./useMetronomeSettingsQuery";

export const useUpdateMetronomeSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<MetronomeSettings, Error, UpdateMetronomeSettingsRequest>({
    mutationFn: async (data) => {
      const response = await fetch("/api/settings/metronome", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          "Não foi possível salvar as preferências do metrônomo."
        );
      }

      const payload =
        (await response.json()) as UpdateMetronomeSettingsResponse;
      return payload.settings;
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(METRONOME_SETTINGS_QUERY_KEY, settings);
    },
  });
};
