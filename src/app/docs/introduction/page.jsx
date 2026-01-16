// app/docs/introduction/page.jsx
import DocHeader from "@/components/docs/DocHeader";
import DocSection from "@/components/docs/DocSection";
import FeatureGrid from "@/components/docs/FeatureGrid";
import FeatureCard from "@/components/docs/FeatureCard";

export default function IntroductionPage() {
  return (
    <>
      <DocHeader
        title="KritimSMS Documentation"
        description="Get started with KritimSMS - a powerful SMS portal for individual, group, and bulk messaging."
      />

      <DocSection title="What is KritimSMS?">
        <p>
          KritimSMS is an SMS portal system built by the Kritim Team to manage
          efficient SMS delivery through individuals, groups, and bulk CSV uploads. This portal is built to handle high-volume SMS sending with ease.
        </p>
      </DocSection>

      <DocSection title="Key Features">
        {/* <FeatureGrid>
          <FeatureCard title="Dashboard Analytics" description="Track SMS usage, balance, and delivery status." />
          <FeatureCard title="Individual & Group SMS" description="Send messages  to contacts or groups easily. Also manages contact lists and groups" />
          <FeatureCard title="Bulk CSV Upload" description="Upload thousands of contacts in one go." />
          <FeatureCard title="Template-Based SMS" description="Reuse and customize SMS templates." />
          <FeatureCard title="Reports & Insights" description="Daily and monthly visual reports." />
          <FeatureCard title="Top Up balance" description="User Can top up balance via esewa and khalti to the SMS system." />
        </FeatureGrid> */}

        <FeatureGrid>
  <FeatureCard
    title="Dashboard Analytics"
    description="Track SMS usage, balance, and delivery status."
    href="/docs/dashboard"
  />

  <FeatureCard
    title="Individual & Group SMS"
    description="Send messages to contacts or groups easily."
    href="/docs/contacts"
  />

  <FeatureCard
    title="Bulk CSV Upload"
    description="Upload thousands of contacts in one go."
    href="/docs/groups"
  />

  <FeatureCard
    title="Template-Based SMS"
    description="Reuse and customize SMS templates."
    href="/docs/SMS"
  />

  <FeatureCard
    title="Reports & Insights"
    description="Daily and monthly visual reports."
    href="/docs/reports"
  />

  <FeatureCard
    title="Top Up balance"
    description="Top up balance via eSewa and Khalti."
    href="/docs/reports"
  />
</FeatureGrid>

      </DocSection>
    </>
  );
}
