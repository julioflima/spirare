import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Texto inválido." }, { status: 400 });
    }

    const instructions = `
Affect:
Sua voz continua jovem, convidativa, mas agora com um toque de ternura que envolve o ouvinte como um abraço caloroso. Cada palavra transmite cuidado e gentileza, mantendo a grandiosidade, mas tornando-a acessível e afetuosa.

Tone:
Nobre e heroica, mas com suavidade. A cadência de uma fada, fina permanece, porém temperada com delicadeza. Cada frase soa como um sussurro épico que conduz o ouvinte com amor e paciência.

Emotion:
Mistura de ternura, calma e um leve encantamento. A meiguice profunda faz o ouvinte sentir que está sendo guiado por uma guardiã sábia, protetora e afetuosa. O senso de aventura e destino permanece, mas sem rigidez — tudo é acolhido com carinho.

Pronunciation:
As palavras arcaicas são pronunciadas de forma clara e suave, com ênfase delicada. A formalidade existe, mas de maneira gentil e melodiosa, quase cantando as palavras para o coração do ouvinte.

Pause:
Pausas estratégicas continuam, mas agora transmitem aconchego. 
`;

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: text,
      instructions,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
    return NextResponse.json(
      { error: "Não foi possível gerar o áudio." },
      { status: 500 }
    );
  }
}
