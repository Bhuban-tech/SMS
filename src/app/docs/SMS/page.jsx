// app/docs/send-sms/page.jsx
import DocHeader from "@/components/docs/DocHeader";
import DocSection from "@/components/docs/DocSection";
import Screenshot from "@/components/docs/Screenshot";
import FeatureGrid from "@/components/docs/FeatureGrid";
import FeatureCard from "@/components/docs/FeatureCard";

export default function SendSMSDocsPage() {
  return (
    <>
      <DocHeader
        title="Send SMS"
        description="Send SMS efficiently using KritimSMS — individually, in groups, or in bulk using CSV uploads."
      />

      {/* Overview */}
      <DocSection title="Sending SMS with KritimSMS">
        <p>
          KritimSMS is designed to help users send a large volume of SMS messages
          efficiently. The system supports multiple sending methods, allowing
          administrators to choose the most suitable option based on their needs.
        </p>
      </DocSection>

      {/* Methods */}
      <DocSection title="SMS Sending Methods">
        <FeatureGrid>
          <FeatureCard
            title="Individual SMS"
            description="Send SMS directly to a single contact from the contact list."
          />
          <FeatureCard
            title="Group SMS"
            description="Send SMS to multiple recipients at once by selecting a contact group."
          />
          <FeatureCard
            title="Bulk SMS (CSV Upload)"
            description="Upload a CSV file containing phone numbers to send SMS in bulk."
          />
          <FeatureCard
            title="Template-Based SMS"
            description="Use pre-defined templates to save time and maintain message consistency."
          />
          <FeatureCard
            title="Message Preview"
            description="Preview SMS content before sending to avoid errors."
          />
          <FeatureCard
            title="Delivery Status"
            description="Track whether messages are delivered, pending, or failed."
          />
        </FeatureGrid>

        <Screenshot
          src="/images/send-sms-options.png"
          alt="Send SMS Options"
        />
      </DocSection>

      {/* Individual */}
      <DocSection title="Sending Individual SMS">
        <p>
          Administrators can send SMS to a single recipient by selecting a
          contact and composing a message. This method is ideal for personalized
          communication.
        </p>

        <Screenshot
          src="/images/send-individual-sms.png"
          alt="Send Individual SMS"
        />
      </DocSection>

      {/* Group */}
      <DocSection title="Sending Group SMS">
        <p>
          Group SMS allows administrators to send the same message to multiple
          recipients simultaneously by selecting an existing contact group.
        </p>

        <Screenshot
          src="/images/send-group-sms.png"
          alt="Send Group SMS"
        />
      </DocSection>

      {/* Bulk */}
      <DocSection title="Bulk SMS via CSV Upload">
        <p>
          KritimSMS supports bulk messaging through CSV uploads. The CSV file
          must contain valid phone numbers in the required format.
        </p>

        <p>
          Once uploaded, the system processes the file and sends messages to all
          listed recipients in one operation.
        </p>

        <Screenshot
          src="/images/bulk-sms-upload.png"
          alt="Bulk SMS CSV Upload"
        />
      </DocSection>

      {/* Templates */}
      <DocSection title="Using SMS Templates">
        <p>
          Templates allow users to reuse frequently sent messages. Admins can
          select an existing template and customize it before sending.
        </p>

        <Screenshot
          src="/images/sms-templates.png"
          alt="SMS Templates"
        />
      </DocSection>
    </>
  );
}
