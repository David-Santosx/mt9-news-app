import { Container, Divider, Group, Text } from "@mantine/core";
import { NewsTable } from "./components/news-table";
import NewsFormModal from "./components/news-form-modal";

export default function Page() {
    return (
        <Container>
            <Group justify="space-between">
                <Text c={"dark.4"}>Gerencie as notícias exibidas no MT9</Text>
                <NewsFormModal/>
            </Group>
            <Divider my={"lg"}/>
            <NewsTable/>
        </Container>
    )
}