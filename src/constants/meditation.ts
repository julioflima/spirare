import { Meditation } from '@/types/meditation';

export const defaultMeditation: Meditation = {
  tema: 'Paz Interior',
  etapas: [
    {
      nome: 'Aterramento Luminoso',
      subetapas: [
        'Sente-se confortavelmente e imagine uma luz suave descendo pelo topo da cabeça, iluminando o corpo por inteiro.',
        'Permita que os ombros relaxem, o peito se abra e a respiração encontre um ritmo natural, sereno.',
        'Sinta o peso do corpo apoiado na terra e visualize raízes leves conectando-se ao solo.',
        'Agradeça silenciosamente por este instante de presença e bem-estar que você está oferecendo a si mesmo.',
      ],
    },
    {
      nome: 'Respiração em Marés',
      subetapas: [
        'Inspire profundamente pelo nariz em quatro tempos, como se acolhesse o brilho da manhã.',
        'Segure o ar por dois tempos, mantendo o peito aberto e receptivo.',
        'Expire suavemente por seis tempos, liberando qualquer tensão e permitindo que o corpo se renda.',
        'Observe a pausa natural após a expiração e sinta a quietude que surge nesse intervalo.',
      ],
    },
    {
      nome: 'Paisagem Interior',
      subetapas: [
        'Imagine-se caminhando por um jardim arqueado de luz verde, ouvindo um vento calmo passando pelas folhas.',
        'Perceba aromas sutis no ar e deixe que cada fragrância acalme suavemente sua mente.',
        'Observe um lago espelhado e veja o reflexo tranquilo do seu rosto, emanando serenidade.',
        'Sente-se à beira da água, tocando a superfície com a ponta dos dedos e sentindo ondas delicadas.',
      ],
    },
    {
      nome: 'Integração e Retorno',
      subetapas: [
        'Reconheça como a respiração, o corpo e a imaginação se uniram para restaurar o seu centro.',
        'Leve uma mão ao coração e sinta o calor pulsando em sincronia com o seu ritmo interior.',
        'Escolha uma palavra que represente a energia desta prática e repita mentalmente algumas vezes.',
        'Aos poucos, traga movimentos suaves para mãos e pés, preparando-se para retornar com esta calma radiante.',
      ],
    },
  ],
};

export const STEP_DURATION_SECONDS = 120;
export const SUBSTEPS_PER_STEP = 4;
