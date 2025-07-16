import { Container, Divider, Group, Text } from "@mantine/core";
import { AdsTable } from "./components/ads-table";
import AdsFormModal from "./components/ads-form-modal";

export default function Page() {
    return (
        <Container>
            <Group justify="space-between">
                <Text c={"dark.4"}>Gerencie as publicidades exibidas no MT9</Text>
                <AdsFormModal/>
            </Group>
            <Divider my={"lg"}/>
            <AdsTable/>
        </Container>
    )
}