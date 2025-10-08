import { Meditation } from "@/types/meditation";

export const defaultMeditation: Meditation = {
  tema: "Paz Interior",
  congratulacaoFinal:
    "Parabéns por concluir esta jornada. Honre a serenidade que você cultivou e leve consigo essa luz para o restante do seu dia.",
  etapas: [
    {
      nome: "Aterramento Luminoso",
      introducao:
        "Agora vamos começar a Etapa 1: Aterramento Luminoso. Permita que a mente se prepare para encontrar um ponto de apoio suave.",
      encerramento:
        "Fim da etapa: Aterramento Luminoso concluído. Sinta o corpo repousar com segurança e acolhimento.",
      trilha: {
        title: "Weightless Atmosphere",
        artist: "AmbiNet (Pixabay)",
        src: "https://cdn.pixabay.com/download/audio/2025/03/18/audio_edb18178a5.mp3?filename=weightless-atmosphere-315424.mp3",
        fadeInMs: 2000,
        fadeOutMs: 1800,
        volume: 0.55,
      },
      subetapas: [
        "Sente-se confortavelmente e imagine uma luz suave descendo pelo topo da cabeça, iluminando o corpo por inteiro.",
        "Permita que os ombros relaxem, o peito se abra e a respiração encontre um ritmo natural, sereno.",
        "Sinta o peso do corpo apoiado na terra e visualize raízes leves conectando-se ao solo.",
        "Agradeça silenciosamente por este instante de presença e bem-estar que você está oferecendo a si mesmo.",
      ],
    },
    {
      nome: "Respiração em Marés",
      introducao:
        "Agora entramos na Etapa 2: Respiração em Marés. Imagine o vai-e-vem do oceano guiando cada inspiração.",
      encerramento:
        "Fim da etapa: Respiração em Marés concluída. Observe como o fluxo da vida permanece calmo dentro de você.",
      trilha: {
        title: "Calm Sea Ambient",
        artist: "Lesfm (Pixabay)",
        src: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_4f8fe8acd4.mp3?filename=calm-sea-ambient-110368.mp3",
        fadeInMs: 1800,
        fadeOutMs: 1600,
        volume: 0.52,
      },
      subetapas: [
        "Inspire profundamente pelo nariz em quatro tempos, como se acolhesse o brilho da manhã.",
        "Segure o ar por dois tempos, mantendo o peito aberto e receptivo.",
        "Expire suavemente por seis tempos, liberando qualquer tensão e permitindo que o corpo se renda.",
        "Observe a pausa natural após a expiração e sinta a quietude que surge nesse intervalo.",
      ],
    },
    {
      nome: "Paisagem Interior",
      introducao:
        "Chegamos à Etapa 3: Paisagem Interior. Permita que a imaginação revele um cenário de beleza serena.",
      encerramento:
        "Fim da etapa: Paisagem Interior concluída. Leve consigo as imagens suaves que emergiram agora pouco.",
      trilha: {
        title: "Gentle Breeze",
        artist: "RomanBelov (Pixabay)",
        src: "https://cdn.pixabay.com/download/audio/2021/11/29/audio_8f0da0c4a6.mp3?filename=gentle-breeze-ambient-8809.mp3",
        fadeInMs: 1800,
        fadeOutMs: 1700,
        volume: 0.5,
      },
      subetapas: [
        "Imagine-se caminhando por um jardim arqueado de luz verde, ouvindo um vento calmo passando pelas folhas.",
        "Perceba aromas sutis no ar e deixe que cada fragrância acalme suavemente sua mente.",
        "Observe um lago espelhado e veja o reflexo tranquilo do seu rosto, emanando serenidade.",
        "Sente-se à beira da água, tocando a superfície com a ponta dos dedos e sentindo ondas delicadas.",
      ],
    },
    {
      nome: "Integração e Retorno",
      introducao:
        "Avançamos para a Etapa 4: Integração e Retorno. Reúna tudo o que experienciou e traga para o coração.",
      encerramento:
        "Fim da etapa: Integração e Retorno concluída. Perceba como você retorna renovado ao presente.",
      trilha: {
        title: "Glowing Light",
        artist: "SergePavkinMusic (Pixabay)",
        src: "https://cdn.pixabay.com/download/audio/2022/10/04/audio_7ee0634fd9.mp3?filename=glowing-light-ambient-121425.mp3",
        fadeInMs: 2000,
        fadeOutMs: 2000,
        volume: 0.5,
      },
      subetapas: [
        "Reconheça como a respiração, o corpo e a imaginação se uniram para restaurar o seu centro.",
        "Leve uma mão ao coração e sinta o calor pulsando em sincronia com o seu ritmo interior.",
        "Escolha uma palavra que represente a energia desta prática e repita mentalmente algumas vezes.",
        "Aos poucos, traga movimentos suaves para mãos e pés, preparando-se para retornar com esta calma radiante.",
      ],
    },
  ],
};

export const STEP_DURATION_SECONDS = 120;
export const SUBSTEPS_PER_STEP = 4;
