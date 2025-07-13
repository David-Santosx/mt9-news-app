"use client";
import { useForm } from "@mantine/form";
import { Stack, TextInput, Group, Button, Checkbox } from "@mantine/core";
import FormSubmit from "../actions/formSubmit";
import Image from "next/image";

export default function AuthForm() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
    },
  });
  return (
    <form onSubmit={form.onSubmit(async (values) => await FormSubmit(values))}>
      <Stack gap={"lg"}>
        <TextInput
          w={{ base: 300, sm: 350 }}
          label={"Email"}
          key={form.key("email")}
          {...form.getInputProps("email")}
          withAsterisk
          placeholder="seu@email.com"
        />
        <TextInput
          w={{ base: 300, sm: 350 }}
          label={"Senha"}
          withAsterisk
          key={form.key("password")}
          {...form.getInputProps("password")}
          placeholder="********"
          type="password"
        />
        <Checkbox
          label="Lembrar-me"
          key={form.key("rememberMe")}
          {...form.getInputProps("rememberMe", { type: "checkbox" })}
        />
        <Group justify={"space-between"} mt="md">
          <Image
            src={"/images/mt9-logo.svg"}
            width={80}
            height={50}
            alt="MT9 Notícias e Comércios"
          />
          <Button loading={form.submitting} type="submit">
            Login
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
