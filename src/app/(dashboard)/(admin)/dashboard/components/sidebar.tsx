"use client";
import {
  NavLink,
  Stack,
  Text,
  Group,
  Box,
  Divider,
  ScrollArea,
  rem,
  AppShellNavbar,
  Tooltip,
} from "@mantine/core";
import {
  Home,
  Settings,
  LogOut,
  ChevronRight,
  Newspaper,
  MonitorPlay,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: <Home size={20} />,
    href: "/dashboard",
  },
  {
    label: "Notícias",
    icon: <Newspaper size={20} />,
    href: "/dashboard/noticias",
  },
  {
    label: "Publicidades",
    icon: <MonitorPlay size={20} />,
    href: "/dashboard/publicidades",
  },
];

export default function Sidebar() {
  const activeItem = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Determina se deve colapsar baseado no tamanho da tela
  const shouldCollapse = isMobile || isTablet;
  const sidebarWidth = shouldCollapse ? 80 : 280;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const renderNavItem = (item: NavigationItem, level = 0) => {
    const isActive = activeItem === item.href;
    const hasChildren = item.children && item.children.length > 0;

    const navItem = (
      <NavLink
        key={item.href}
        label={!shouldCollapse ? item.label : undefined}
        leftSection={item.icon}
        rightSection={
          !shouldCollapse && (
            <>
              {item.badge && (
                <Text
                  size="xs"
                  c="white"
                  bg="red"
                  px={6}
                  py={2}
                  style={{ borderRadius: rem(10) }}
                >
                  {item.badge}
                </Text>
              )}
              {hasChildren && <ChevronRight size={16} />}
            </>
          )
        }
        active={isActive}
        onClick={() => handleNavigation(item.href)}
        styles={(theme) => ({
          root: {
            borderRadius: theme.radius.md,
            marginBottom: rem(4),
            borderBottom: "solid 1px var(--mantine-color-gray-4)",
            padding: shouldCollapse ? rem(8) : rem(12),
            transition: "all 0.2s ease",
            justifyContent: shouldCollapse ? "center" : "flex-start",
            "&:hover": {
              backgroundColor: "var(--mantine-color-gray-5)",
            },
            "&[dataActive]": {
              backgroundColor: theme.colors.blue[0],
              color: theme.colors.blue[7],
              borderLeft: `${rem(4)} solid ${theme.colors.blue[6]}`,
            },
          },
          label: {
            fontWeight: 500,
          },
          section: {
            marginRight: shouldCollapse ? 0 : undefined,
          },
        })}
      >
        {/* Renderizar sub-itens apenas se não estiver colapsado */}
        {!shouldCollapse && hasChildren && (
          <Stack gap={2} ml="md">
            {item.children?.map((child) => renderNavItem(child, level + 1))}
          </Stack>
        )}
      </NavLink>
    );

    // Adicionar tooltip quando colapsado
    if (shouldCollapse) {
      return (
        <Tooltip
          key={item.href}
          label={item.label}
          position="right"
          offset={10}
          withArrow
        >
          {navItem}
        </Tooltip>
      );
    }

    return navItem;
  };

  return (
    <AppShellNavbar
      w={sidebarWidth}
      p="md"
      bg="gray.3"
      style={{
        transition: "width 0.3s ease",
        borderRight: "1px solid var(--mantine-color-gray-4)",
        position: "fixed",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Header da Sidebar */}
      <Group justify="center" mb="md">
        {!shouldCollapse ? (
          <Image
            src={"/images/mt9-logo.svg"}
            alt="MT9 - Notícias e Comércios"
            width={70}
            height={50}
          />
        ) : (
          <Box
            w={40}
            h={40}
            bg="blue"
            style={{
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text c="white" fw={700} size="md">
              MT9
            </Text>
          </Box>
        )}
      </Group>

      <Divider mb="md" />

      {/* Menu de Navegação */}
      <ScrollArea flex={1} offsetScrollbars>
        <Stack gap={2}>
          {navigationItems.map((item) => renderNavItem(item))}
        </Stack>
      </ScrollArea>

      {/* Footer da Sidebar */}
      <Box mt="auto" pt="md">
        <Divider mb="md" />

        {shouldCollapse ? (
          <Tooltip label="Configurações" position="right" withArrow>
            <NavLink
              leftSection={<Settings size={20} />}
              onClick={() => handleNavigation("/configuracoes")}
              styles={(theme) => ({
                root: {
                  borderRadius: theme.radius.md,
                  marginBottom: rem(4),
                  padding: rem(8),
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: theme.colors.gray[1],
                  },
                },
              })}
            />
          </Tooltip>
        ) : (
          <NavLink
            label="Configurações"
            leftSection={<Settings size={20} />}
            onClick={() => handleNavigation("/configuracoes")}
            styles={(theme) => ({
              root: {
                borderRadius: theme.radius.md,
                marginBottom: rem(4),
                padding: rem(12),
                "&:hover": {
                  backgroundColor: theme.colors.gray[1],
                },
              },
            })}
          />
        )}

        {shouldCollapse ? (
          <Tooltip label="Sair" position="right" withArrow>
            <NavLink
              leftSection={<LogOut size={20} />}
              c="red"
              onClick={() => console.log("Logout")}
              styles={(theme) => ({
                root: {
                  borderRadius: theme.radius.md,
                  padding: rem(8),
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: theme.colors.red[0],
                  },
                },
              })}
            />
          </Tooltip>
        ) : (
          <NavLink
            label="Sair"
            leftSection={<LogOut size={20} />}
            c="red"
            bdrs={"md"}
            p={rem(12)}
            onClick={async () => {
              await authClient.signOut();
              window.location.reload();
            }}
          />
        )}
      </Box>
    </AppShellNavbar>
  );
}