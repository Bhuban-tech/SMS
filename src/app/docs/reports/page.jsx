// app/docs/reports/page.jsx
import DocHeader from "@/components/docs/DocHeader";
import DocSection from "@/components/docs/DocSection";
import Screenshot from "@/components/docs/Screenshot";
import FeatureGrid from "@/components/docs/FeatureGrid";
import FeatureCard from "@/components/docs/FeatureCard";

export default function ReportsDocsPage() {
  return (
    <>
      <DocHeader
        title="Reports"
        description="Monitor SMS delivery performance and manage system balance with detailed reports."
      />

      {/* Overview */}
      <DocSection title="Reports Overview">
        <p>
          The Reports module in KritimSMS provides administrators with detailed
          insights into SMS delivery performance and system balance. These
          reports help track message status, diagnose failures, and manage SMS
          credits efficiently.
        </p>
      </DocSection>

      {/* Report Types */}
      <DocSection title="Types of Reports">
        <FeatureGrid>
          <FeatureCard
            title="Delivery Reports"
            description="Track the delivery status of all sent SMS messages."
          />
          <FeatureCard
            title="Balance Reports"
            description="View SMS balance, usage history, and recharge details."
          />
        </FeatureGrid>
      </DocSection>

      {/* Delivery Reports */}
      <DocSection title="SMS Delivery Reports">
        <p>
          Delivery reports allow users to view the status of every SMS sent from
          the system. Each record includes detailed information to help monitor
          message performance.
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Recipient phone number</li>
          <li>Message content</li>
          <li>Delivery status (Delivered, Pending, Failed)</li>
          <li>Status description or failure reason</li>
          <li>Date and time of sending</li>
        </ul>

        <p>
          These reports help administrators quickly identify delivery issues and
          take corrective action when required.
        </p>

        <Screenshot
          src="/images/delivery-reports.png"
          alt="SMS Delivery Reports"
        />
      </DocSection>

      {/* Balance Reports */}
      <DocSection title="Balance Reports">
        <p>
          Balance reports provide a clear overview of SMS credit usage and
          remaining balance. Administrators can track how credits are consumed
          over time.
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Total SMS balance</li>
          <li>Credits used</li>
          <li>Remaining credits</li>
          <li>Top-up history</li>
        </ul>

        <Screenshot
          src="/images/balance-reports.png"
          alt="Balance Reports"
        />
      </DocSection>

      {/* Top-up */}
      <DocSection title="Top-Up Balance via eSewa & Khalti">
        <p>
          KritimSMS allows users to recharge their SMS balance directly from the
          system using secure digital payment gateways.
        </p>

        <FeatureGrid>
          <FeatureCard
            title="eSewa Top-Up"
            description="Recharge SMS balance using the eSewa digital wallet."
          />
          <FeatureCard
            title="Khalti Top-Up"
            description="Recharge SMS balance using Khalti payment services."
          />
        </FeatureGrid>

        <p>
          After a successful transaction, the balance is updated instantly and
          reflected in the system reports.
        </p>

        <Screenshot
          src="/images/balance-topup.png"
          alt="Balance Top-Up via eSewa and Khalti"
        />
      </DocSection>
    </>
  );
}
