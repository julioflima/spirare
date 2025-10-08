export interface MeditationStep {
  nome: string;
  subetapas: string[];
}

export interface Meditation {
  tema: string;
  etapas: MeditationStep[];
}

export interface MeditationResponse {
  meditation: Meditation;
  tech_plan: string;
}
