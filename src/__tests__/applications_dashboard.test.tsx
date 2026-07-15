import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApplicationsDashboard } from "@/components/applications_dashboard";
import { initialApplications } from "@/data/applications";

type FrontendToolDefinition = {
  name: string;
  handler: (args: Record<string, unknown>) => Promise<string>;
};

const { frontendTools } = vi.hoisted(() => ({
  frontendTools: new Map<string, FrontendToolDefinition>(),
}));

vi.mock("@copilotkit/react-core/v2", () => ({
  useAgentContext: vi.fn(),

  useFrontendTool: vi.fn((tool: FrontendToolDefinition) => {
    frontendTools.set(tool.name, tool);
  }),
}));

describe("ApplicationsDashboard", () => {
  beforeEach(() => {
    frontendTools.clear();
    vi.clearAllMocks();
  });

  it("регистрирует AI-инструменты управления заявками", () => {
    render(<ApplicationsDashboard />);

    expect(Array.from(frontendTools.keys())).toEqual([
      "filterApplications",
      "selectApplication",
      "requestStatusChange",
    ]);
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

    expect(applicationButton).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(applicationButton);

    expect(applicationButton).toHaveAttribute(
      "aria-pressed",
      "true",
    );

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

  it("меняет статус только после подтверждения пользователя", async () => {
    const user = userEvent.setup();
    const targetApplication = initialApplications[0];

    const nextStatus =
      targetApplication.status === "approved"
        ? "rejected"
        : "approved";

    const currentStatusLabel =
      targetApplication.status === "new"
        ? "Новая"
        : targetApplication.status === "in_review"
          ? "На рассмотрении"
          : targetApplication.status === "approved"
            ? "Одобрена"
            : "Отклонена";

    const nextStatusLabel =
      nextStatus === "approved" ? "Одобрена" : "Отклонена";

    render(<ApplicationsDashboard />);

    const applicationButton = screen.getByRole("button", {
      name: new RegExp(`#${targetApplication.id}\\b`),
    });

    expect(
      within(applicationButton).getByText(currentStatusLabel),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Изменить статус",
      }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Изменить статус заявки",
    });

    expect(dialog).toBeInTheDocument();

    const statusSelect = within(dialog).getByRole("combobox", {
      name: "Новый статус",
    });

    const confirmButton = within(dialog).getByRole("button", {
      name: "Подтвердить изменение",
    });

    expect(statusSelect).toHaveValue(targetApplication.status);
    expect(confirmButton).toBeDisabled();

    await user.selectOptions(statusSelect, nextStatus);

    expect(statusSelect).toHaveValue(nextStatus);
    expect(confirmButton).toBeEnabled();

    expect(
      within(applicationButton).getByText(currentStatusLabel),
    ).toBeInTheDocument();

    expect(
      within(applicationButton).queryByText(nextStatusLabel),
    ).not.toBeInTheDocument();

    await user.click(confirmButton);

    expect(
      within(dialog).getByRole("button", {
        name: "Сохраняем...",
      }),
    ).toBeDisabled();

    await waitFor(
      () => {
        expect(
          screen.queryByRole("dialog", {
            name: "Изменить статус заявки",
          }),
        ).not.toBeInTheDocument();
      },
      {
        timeout: 2000,
      },
    );

    expect(
      within(applicationButton).getByText(nextStatusLabel),
    ).toBeInTheDocument();

    expect(
      within(applicationButton).queryByText(
        currentStatusLabel,
      ),
    ).not.toBeInTheDocument();
  });
});
