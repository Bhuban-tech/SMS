// app/docs/dashboard/page.jsx
import DocHeader from "@/components/docs/DocHeader";
import DocSection from "@/components/docs/DocSection";
import Screenshot from "@/components/docs/Screenshot";
import FeatureGrid from "@/components/docs/FeatureGrid";
import FeatureCard from "@/components/docs/FeatureCard";

export default function DashboardDocsPage() {
  return (
    <>
      <DocHeader
        title="Dashboard"
        description="The dashboard provides a real-time overview of SMS usage, system balance, and delivery performance."
      />


      <DocSection title="Dashboard Overview">
        <p>
          The KritimSMS dashboard is the central control panel of the system.
          It provides administrators with instant insights into SMS usage,
          balance, delivery status, and overall system activity.
        </p>
      </DocSection>

    
      <DocSection title="Key Dashboard Metrics">
        <FeatureGrid>
          <FeatureCard
            title="Total SMS Credits"
            description="Displays the total number of SMS credits allocated to the system."
          />
          <FeatureCard
            title="Remaining Balance"
            description="Shows the remaining SMS credits available for sending messages."
          />
          <FeatureCard
            title="Credits Used"
            description="Indicates the total number of SMS credits consumed."
          />
          <FeatureCard
            title="SMS Delivery Status"
            description="Provides a breakdown of delivered, failed, and pending SMS messages."
          />
        
        <FeatureCard
            title="Daily and Monthly Reports"
            description="Visual reports showing SMS activity over daily and monthly periods."
          />
          <FeatureCard
            title="Graphical Analytics"
            description="Graphs and charts representing SMS volume, delivery performance, and cost trends."
          />

        </FeatureGrid>

        <Screenshot
          src="/images/dashboard-overview.png"
          alt="Dashboard Overview Statistics"
        />
      </DocSection>

    
      <DocSection title="Daily & Monthly Reports">
        <p>
          The dashboard includes visual reports that help administrators analyze
          SMS activity over daily and monthly periods.
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Daily SMS sending volume</li>
          <li>Monthly SMS usage trends</li>
          <li>SMS cost analysis</li>
          <li>Overall system performance tracking</li>
        </ul>

        <Screenshot
          src="/images/dashboard-reports.png"
          alt="Daily and Monthly Reports"
        />
      </DocSection>

     
      <DocSection title="Visual Analytics">
        <p>
          Graphical charts provide an easy-to-understand representation of SMS
          volume, delivery performance, and cost trends, helping administrators
          make informed decisions.
        </p>

        <Screenshot
          src="/images/dashboard-charts.png"
          alt="Dashboard Charts"
        />
      </DocSection>
    </>
  );
}
