import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApplicationsDashboard } from "@/components/applications_dashboard";

vi.mock("@copilotkit/react-core/v2", () => ({
  useAgentContext: vi.fn(),
  useFrontendTool: vi.fn(),
}));

describe("ApplicationsDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("показывает заголовок и основные элементы панели заявок", () => {
    render(<ApplicationsDashboard />);

    expect(
      screen.getByRole("heading", {
        name: "Заявки клиентов",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        "Поиск по клиенту, компании или номеру",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: "Фильтр по статусу",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Изменить статус",
      }),
    ).toBeInTheDocument();
  });
});
