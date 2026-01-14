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
        title="Groups"
        description="Manage groups of contacts for sending SMS messages in KritimSMS."
      />

     
      <DocSection title="Groups Overview">
        <p>
          The Groups module enables administrators to store, manage, and
          maintain groups of contacts within the KritimSMS system.
          These groups can later be used for individual messaging or grouped
          for bulk SMS campaigns.
        </p>
      </DocSection>

      <DocSection title="Group Management Features">
        <FeatureGrid>
          <FeatureCard
            title="Add Group"
            description="Add new groups to the system using a simple modal form."
          />
             <FeatureCard
            title="Add Contacts to Group"
            description="Add new contacts to existing groups using a simple modal form."
          />
          <FeatureCard
            title="View Groups Contacts"
            description="View the contacts of the existing group and also can remove contacts from the group."
          />
          <FeatureCard
            title="Update Group"
            description="Edit group name or members using the edit action."
          />
          <FeatureCard
            title="Delete Group"
            description="Remove unwanted groups from the system after confirmation."
          />
          <FeatureCard
            title="Search Groups"
            description="Quickly find groups using the built-in search field."
          />
        </FeatureGrid>

        <Screenshot
          src="/images/groups-list.png"
          alt="Groups List"
        />
      </DocSection>

     
      <DocSection title="Adding a New Group">
        <p>
          Administrators can add a new group by clicking the
          <strong> “Add Group” </strong>
          button located at the top-right of the groups page.
        </p>

        <p>
          This opens a modal where the admin can enter the group’s name and
          members. Once saved, the group is immediately available in the system.
          phone number. Once saved, the contact is immediately available in the
          system.
        </p>

        <Screenshot
          src="/images/add-group-modal.png"
          alt="Add Group Modal"
        />
      </DocSection>

       <DocSection title="Adding Contacts to a group">
        <p>
          To add contact into an existing group, click the
          <strong> edit (green) button </strong>
          on the actions list.
        </p>

        <p>
          In this system, the admin can add new contacts to existing group. The modal displays the list of existing contact in the system and admin can select or check the contacts he wants to add to that specific group .
        </p>

        <Screenshot
          src="/images/add-group-contact.png"
          alt="Edit Group Modal"
        />
      </DocSection>

 <DocSection title="Removing and viewing contact of the group">
        <p>
          To remove and view existing contact from any group, click in the
          <strong> group name </strong>
        </p>

        <p>
          In this system, the admin can view and remove contact of the group. Once he clicks on the cross button on the side of contacts a confirmation modal will show up to avoid accidental deletion.
        </p>

        <Screenshot
          src="/images/delete-contact-group.png"
          alt="View and Delete Contacts of a Group"
        />
      </DocSection>

      

      
      <DocSection title="Updating Group Information">
        <p>
          To update an existing group, click the
          <strong> edit (teal) button </strong>
          next to the group record.
        </p>

        <p>
          In this system, the admin can modify the group name in inline input field. It doesn't display any modal for updating group name.
        </p>

        <Screenshot
          src="/images/edit-group-modal.png"
          alt="Edit Group Modal"
        />
      </DocSection>

      {/* Delete */}
      <DocSection title="Deleting a Group">
        <p>
          Groups can be deleted using the
          <strong> delete (red) button </strong>
          next to the edit option.
        </p>

        <p>
          A confirmation prompt ensures that groups are not removed
          accidentally. Once confirmed, the group is permanently deleted from
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
