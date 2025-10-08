export interface MeditationStageTrack {
  title: string;
  artist: string;
  src: string;
  fadeInMs?: number;
  fadeOutMs?: number;
  volume?: number;
}

export interface MeditationStep {
  nome: string;
  introducao: string;
  encerramento: string;
  trilha: MeditationStageTrack;
  subetapas: string[];
}

export interface Meditation {
  tema: string;
  etapas: MeditationStep[];
  congratulacaoFinal: string;
}

export interface MeditationResponse {
  meditation: Meditation;
  tech_plan: string;
}
