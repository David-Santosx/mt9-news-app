import { notifications } from "@mantine/notifications";
import { authClient } from "../../../../../../auth-client";

export default async function FormSubmit(values: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const { email, password, rememberMe } = values;
  return await authClient.signIn.email(
    { email, password, rememberMe, callbackURL: "/admin/dashboard" },
    {
      onSuccess: () => {
        notifications.show({
          title: "Autenticação bem-sucedida",
          message: "Você foi autenticado com sucesso!",
          color: "green",
        });    
      },
      onError: (error) => {
          notifications.show({
            title: "Erro de autenticação",
            message: error.error.message || "Ocorreu um erro ao tentar autenticar.",
            color: "red",
        })
        },
      }
  );
}
