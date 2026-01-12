// app/docs/contacts/page.jsx
import DocHeader from "@/components/docs/DocHeader";
import DocSection from "@/components/docs/DocSection";
import Screenshot from "@/components/docs/Screenshot";
import FeatureGrid from "@/components/docs/FeatureGrid";
import FeatureCard from "@/components/docs/FeatureCard";

export default function ContactsDocsPage() {
  return (
    <>
      <DocHeader
        title="Profile"
        description="Admin can update their profile info username and password"
      />

     
      <DocSection title="Profile Overview">
        <p>
          Admins can update profile info- their username and password through the profile modal
        </p>
      </DocSection>

      <DocSection title="Contact Management Features">
        <FeatureGrid>
          <FeatureCard
            title="Add Contact"
            description="Add new contacts to the system using a simple modal form."
          />
          <FeatureCard
            title="View Contacts"
            description="View all enrolled contacts in a searchable and paginated list."
          />
          <FeatureCard
            title="Update Contact"
            description="Edit contact name or phone number using the edit action."
          />
          <FeatureCard
            title="Delete Contact"
            description="Remove unwanted contacts from the system after confirmation."
          />
          <FeatureCard
            title="Search Contacts"
            description="Quickly find contacts using the built-in search field."
          />
        </FeatureGrid>

        <Screenshot
          src="/images/contacts-list.png"
          alt="Contacts List"
        />
      </DocSection>

      {/* Add Contact */}
      <DocSection title="Adding a New Contact">
        <p>
          Administrators can add a new contact by clicking the
          <strong> “Add Contact” </strong>
          button located at the top-right of the contacts page.
        </p>

        <p>
          This opens a modal where the admin can enter the contact’s name and
          phone number. Once saved, the contact is immediately available in the
          system.
        </p>

        <Screenshot
          src="/images/add-contact-modal.png"
          alt="Add Contact Modal"
        />
      </DocSection>

      {/* Update */}
      <DocSection title="Updating Contact Information">
        <p>
          To update an existing contact, click the
          <strong> edit (teal) button </strong>
          next to the contact record.
        </p>

        <p>
          The edit modal allows administrators to modify the contact’s name or
          phone number and save or cancel the changes.
        </p>

        <Screenshot
          src="/images/edit-contact-modal.png"
          alt="Edit Contact Modal"
        />
      </DocSection>

      {/* Delete */}
      <DocSection title="Deleting a Contact">
        <p>
          Contacts can be deleted using the
          <strong> delete (red) button </strong>
          next to the edit option.
        </p>

        <p>
          A confirmation prompt ensures that contacts are not removed
          accidentally. Once confirmed, the contact is permanently deleted from
          the system.
        </p>

        <Screenshot
          src="/images/delete-contact-confirmation.png"
          alt="Delete Contact Confirmation"
        />
      </DocSection>
    </>
  );
}
