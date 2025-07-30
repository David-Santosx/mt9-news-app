"use client";
import { useMediaQuery } from "@mantine/hooks";
import Sidebar from "./dashboard/components/sidebar";
import { AppShell, AppShellMain, Container } from "@mantine/core";
import "@mantine/charts/styles.css";

export default function AdminLayout({ children }: {
  children: React.ReactNode;}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const shouldCollapse = isMobile || isTablet;
  const sidebarWidth = shouldCollapse ? 40 : 150;

  return (
    <AppShell
      navbar={{ width: sidebarWidth, breakpoint: 0 }}
      padding={0}
      style={{ overflow: "hidden" }}
    >
      <Sidebar />
      
      <AppShellMain
        style={{
          marginLeft: sidebarWidth,
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Container fluid p="md" style={{ height: "100%" }}>
          {children}
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
