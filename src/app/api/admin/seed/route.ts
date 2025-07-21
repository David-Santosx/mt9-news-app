import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!data || !data.secretKey) {
        return NextResponse.json({
            error: "Chave secreta ausente"
        }, { status: 400 });
    }

    const { secretKey } = data;
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    try {
        // Aqui você pode adicionar a lógica de seed, como criar usuários, notícias, etc.
        // Exemplo: criar um usuário admin
        await auth.api.createUser({
            body: {
                email: "admin@mt9.com.br",
                password: process.env.ADMIN_PASSWORD || "admin123",
                role: "admin",
                name: "Admin MT9",
            },
        })
        return NextResponse.json({ message: "Seed executada com sucesso" });
    } catch (error) {
        console.error("Erro ao executar seed:", error);
        return NextResponse.json(
            { error: "Erro ao executar seed" },
            { status: 500 }
        );
    }
}