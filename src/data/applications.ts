import type { Application } from "@/types/application";

export const initialApplications: Application[] = [
  {
    id: 1001,
    customerName: "Анна Смирнова",
    companyName: 'ООО "СтройТех"',
    email: "anna.smirnova@example.com",
    phone: "+7 900 123-45-67",
    status: "new",
    priority: "high",
    amount: 1_250_000,
    createdAt: "2026-07-10",
    description:
      "Запрос на поставку партии промышленного оборудования для нового производственного участка.",
  },
  {
    id: 1002,
    customerName: "Иван Петров",
    companyName: 'АО "РегионСнаб"',
    email: "ivan.petrov@example.com",
    phone: "+7 901 234-56-78",
    status: "in_review",
    priority: "medium",
    amount: 780_000,
    createdAt: "2026-07-11",
    description:
      "Необходимо проверить комплектацию и согласовать сроки доставки оборудования.",
  },
  {
    id: 1003,
    customerName: "Мария Волкова",
    companyName: 'ООО "ПромЛогистика"',
    email: "maria.volkova@example.com",
    phone: "+7 902 345-67-89",
    status: "approved",
    priority: "low",
    amount: 430_000,
    createdAt: "2026-07-12",
    description:
      "Заявка согласована. Ожидается подтверждение даты отгрузки со склада.",
  },
  {
    id: 1004,
    customerName: "Алексей Соколов",
    companyName: 'ООО "УралКомплект"',
    email: "alexey.sokolov@example.com",
    phone: "+7 903 456-78-90",
    status: "new",
    priority: "high",
    amount: 2_100_000,
    createdAt: "2026-07-13",
    description:
      "Срочный запрос на подбор и поставку оборудования для строительного объекта.",
  },
  {
    id: 1005,
    customerName: "Елена Кузнецова",
    companyName: 'АО "ТехИнвест"',
    email: "elena.kuznetsova@example.com",
    phone: "+7 904 567-89-01",
    status: "rejected",
    priority: "medium",
    amount: 615_000,
    createdAt: "2026-07-14",
    description:
      "Заявка отклонена из-за отсутствия требуемой позиции на складе.",
  },
];
