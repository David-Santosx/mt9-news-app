import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Função para criar um usuário admin se não existir
export async function seedAdminUser() {
  const adminEmail = "admin@mt9.com.br"; 
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123"; // Altere para uma senha segura

  // verifica se o usuário admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Conta admin já existe. Pulando criação.");
    return;
  }

  // Cria o usuário admin
  const adminUser = await auth.api.createUser({
    body: {
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("Usuário admin criado:", adminUser);
}
