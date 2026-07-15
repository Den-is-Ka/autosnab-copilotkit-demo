import { CopilotSidebar } from "@copilotkit/react-core/v2";

import { ApplicationsDashboard } from "@/components/applications_dashboard";

export default function Home() {
  return (
    <>
      <ApplicationsDashboard />

      <CopilotSidebar
        agentId="default"
        labels={{
          modalHeaderTitle: "AI-ассистент АвтоСнаб",
        }}
      />
    </>
  );
}
