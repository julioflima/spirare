import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { SettingsService } from "@/services/settingsService";
import {
  GetMetronomeSettingsResponse,
  UpdateMetronomeSettingsResponse,
  updateMetronomeSettingsRequestSchema,
} from "@/types/api";

export async function GET() {
  try {
    const settings = await SettingsService.getMetronomeSettings();
    const payload: GetMetronomeSettingsResponse = {
      settings,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Erro ao carregar configurações do metrônomo.", error);
    return NextResponse.json(
      {
        error: "Não foi possível carregar as configurações do metrônomo.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = updateMetronomeSettingsRequestSchema.parse(body);

    const settings = await SettingsService.updateMetronomeSettings(parsed);
    const payload: UpdateMetronomeSettingsResponse = {
      settings,
      message: "Configurações do metrônomo atualizadas com sucesso.",
    };

    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos para atualizar o metrônomo.",
          details: error.flatten(),
        },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar configurações do metrônomo.", error);
    return NextResponse.json(
      {
        error: "Não foi possível atualizar as configurações do metrônomo.",
      },
      { status: 500 }
    );
  }
}
