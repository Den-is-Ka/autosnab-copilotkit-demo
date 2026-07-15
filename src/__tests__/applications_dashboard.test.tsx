import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApplicationsDashboard } from "@/components/applications_dashboard";
import { initialApplications } from "@/data/applications";

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
    it("фильтрует заявки по выбранному статусу", async () => {
      const user = userEvent.setup();

      render(<ApplicationsDashboard />);

      const statusSelect = screen.getByRole("combobox", {
        name: "Фильтр по статусу",
      });

      await user.selectOptions(statusSelect, "approved");

      expect(statusSelect).toHaveValue("approved");

      for (const application of initialApplications) {
        const applicationButton = screen.queryByRole("button", {
          name: new RegExp(`#${application.id}\\b`),
        });

        if (application.status === "approved") {
          expect(applicationButton).toBeInTheDocument();
        } else {
          expect(applicationButton).not.toBeInTheDocument();
        }
      }
    });
    it("открывает выбранную заявку и показывает её данные", async () => {
  const user = userEvent.setup();
  const targetApplication = initialApplications[1];

  render(<ApplicationsDashboard />);

  const applicationButton = screen.getByRole("button", {
    name: new RegExp(`#${targetApplication.id}\\b`),
  });

  expect(applicationButton).toHaveAttribute("aria-pressed", "false");

  await user.click(applicationButton);

  expect(applicationButton).toHaveAttribute("aria-pressed", "true");

  expect(
    screen.getByText(`Заявка #${targetApplication.id}`),
  ).toBeInTheDocument();

  expect(
    screen.getByText(targetApplication.email),
  ).toBeInTheDocument();

  expect(
    screen.getByText(targetApplication.phone),
  ).toBeInTheDocument();
});

