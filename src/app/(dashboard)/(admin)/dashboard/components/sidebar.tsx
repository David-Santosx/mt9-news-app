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
            borderRadius: theme.radius.sm,
            marginBottom: rem(6),
            padding: shouldCollapse ? rem(12) : rem(14),
            transition: "all 0.2s ease",
            justifyContent: shouldCollapse ? "center" : "flex-start",
            "&:hover": {
              backgroundColor: theme.colors.gray[1],
              transform: "translateX(3px)",
            },
            "&[dataActive]": {
              backgroundColor: theme.colors.blue[0],
              color: theme.colors.blue[7],
              fontWeight: 600,
              borderLeft: `${rem(3)} solid ${theme.colors.blue[6]}`,
            },
          },
          label: {
            fontWeight: 500,
            fontSize: theme.fontSizes.sm,
          },
          section: {
            marginRight: shouldCollapse ? 0 : rem(12),
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
      bg="white"
      style={{
        transition: "width 0.3s ease",
        borderRight: "1px solid var(--mantine-color-gray-2)",
        position: "fixed",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header da Sidebar */}
      <Group justify="center" mb="xl" mt="md">
        {!shouldCollapse ? (
          <Box>
            <Image
              src={"/images/mt9-logo.svg"}
              alt="MT9 - Notícias e Comércios"
              width={80}
              height={55}
              style={{ objectFit: "contain" }}
            />
            <Text size="xs" c="dimmed" ta="center" mt={4}>
              Painel Administrativo
            </Text>
          </Box>
        ) : (
          <Box
            w={45}
            h={45}
            bg="blue.6"
            style={{
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Text c="white" fw={700} size="md">
              MT9
            </Text>
          </Box>
        )}
      </Group>

      <Divider color="gray.2" mb="md" />

      {/* Menu de Navegação */}
      <ScrollArea flex={1} offsetScrollbars>
        <Box px={shouldCollapse ? 0 : "xs"} py="md">
          <Text size="xs" c="dimmed" fw={500} mb="sm" tt="uppercase" style={{ opacity: shouldCollapse ? 0 : 0.7 }}>
            {!shouldCollapse && "Menu Principal"}
          </Text>
          <Stack gap={4}>
            {navigationItems.map((item) => renderNavItem(item))}
          </Stack>
        </Box>
      </ScrollArea>

      {/* Footer da Sidebar */}
      <Box mt="auto" pt="md">
        <Divider color="gray.2" mb="md" />

        {shouldCollapse ? (
          <Tooltip label="Sair" position="right" withArrow>
            <NavLink
              leftSection={<LogOut size={20} />}
              c="red.6"
              onClick={async () => {
                await authClient.signOut();
                window.location.reload();
              }}
              styles={(theme) => ({
                root: {
                  borderRadius: theme.radius.sm,
                  padding: rem(12),
                  justifyContent: "center",
                  "&:hover": {
                    backgroundColor: theme.colors.red[0],
                    transform: "translateX(3px)",
                  },
                },
              })}
            />
          </Tooltip>
        ) : (
          <NavLink
            label="Sair da conta"
            leftSection={<LogOut size={20} />}
            c="red.6"
            onClick={async () => {
              await authClient.signOut();
              window.location.reload();
            }}
            styles={(theme) => ({
              root: {
                borderRadius: theme.radius.sm,
                padding: rem(14),
                "&:hover": {
                  backgroundColor: theme.colors.red[0],
                  transform: "translateX(3px)",
                },
              },
              label: {
                fontWeight: 500,
              },
            })}
          />
        )}
      </Box>
    </AppShellNavbar>
  );
}