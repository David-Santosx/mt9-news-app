"use client";

import {
  Combobox,
  InputBase,
  useCombobox,
  Group,
  Avatar,
  Text,
  Box,
  Stack,
  Badge,
  ActionIcon,
  Flex,
  Loader,
} from "@mantine/core";
import { Search, Calendar } from "lucide-react";
import { useState, useCallback } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { searchNews } from "@/app/actions/noticias/get-news";
import { News } from "@prisma/client";
import { useRouter } from "next/navigation";

interface NewsSearchProps {
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: string | number;
}

interface SearchOption {
  value: string;
  label: string;
  news: News;
}

function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export default function NewsSearch({
  placeholder = "Pesquisar notícias...",
  size = "md",
  width = "100%",
}: NewsSearchProps) {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchOption[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setLoading(false);
      combobox.closeDropdown();
      return;
    }

    try {
      setLoading(true);
      combobox.openDropdown();
      const results = await searchNews(query, 8);
      const options: SearchOption[] = results.map((news) => ({
        value: news.slug,
        label: news.title,
        news,
      }));
      setSearchResults(options);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleSelect = (option: SearchOption) => {
    router.push(`/noticias/${option.value}`);
    setSearchValue("");
    setSearchResults([]);
    combobox.closeDropdown();
  };

  const options = searchResults.map((item) => {
    const { news } = item;
    const publishedDate = formatDate(new Date(news.publishedAt));

    return (
      <Combobox.Option value={item.value} key={item.value}>
        <Group wrap="nowrap" gap="sm">
          <Avatar
            src={news.image}
            alt={news.title}
            size="lg"
            radius="md"
            style={{ minWidth: 60 }}
          >
            <Search size={20} />
          </Avatar>
          
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Stack gap={4}>
              <Text size="sm" fw={500} lineClamp={2}>
                {news.title}
              </Text>
              
              {news.subtitle && (
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {truncateText(news.subtitle, 120)}
                </Text>
              )}
              
              <Flex align="center" gap="xs" mt={2}>
                <Badge
                  size="xs"
                  variant="light"
                  color="blue"
                  style={{ textTransform: "capitalize" }}
                >
                  {news.category}
                </Badge>
                
                <Group gap={4} style={{ fontSize: "10px", color: "var(--mantine-color-dimmed)" }}>
                  <Calendar size={10} />
                  <Text size="10px" c="dimmed">
                    {publishedDate}
                  </Text>
                </Group>
              </Flex>
            </Stack>
          </Box>
        </Group>
      </Combobox.Option>
    );
  });

  return (
    <Box w={width}>
      <Combobox
        store={combobox}
        withinPortal={true}
        onOptionSubmit={(val) => {
          const option = searchResults.find((item) => item.value === val);
          if (option) {
            handleSelect(option);
          }
        }}
      >
        <Combobox.Target>
          <InputBase
            value={searchValue}
            onChange={(event) => handleSearch(event.currentTarget.value)}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
            placeholder={placeholder}
            size={size}
            leftSection={<Search size={16} />}
            rightSection={
              loading ? (
                <Loader size={16} />
              ) : searchValue ? (
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={() => {
                    setSearchValue("");
                    setSearchResults([]);
                    combobox.closeDropdown();
                  }}
                >
                  ×
                </ActionIcon>
              ) : null
            }
            styles={(theme) => ({
              input: {
                "&:focus": {
                  borderColor: theme.colors.blue[6],
                },
              },
            })}
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {loading ? (
              <Combobox.Option value="" disabled>
                <Group gap="sm">
                  <Loader size="sm" />
                  <Text size="sm">Pesquisando...</Text>
                </Group>
              </Combobox.Option>
            ) : options.length > 0 ? (
              options
            ) : searchValue.length < 2 ? (
              <Combobox.Option value="" disabled>
                <Text size="sm" c="dimmed">
                  Digite pelo menos 2 caracteres
                </Text>
              </Combobox.Option>
            ) : (
              <Combobox.Option value="" disabled>
                <Text size="sm" c="dimmed">
                  Nenhuma notícia encontrada
                </Text>
              </Combobox.Option>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
}