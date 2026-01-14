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
            title="Update Profile"
            description="Admins can update their profile information including username and password through a user-friendly modal interface."
          />
          <FeatureCard
            title="Update Username"
            description="Admins can easily change their username to keep their profile information current."
          />
      
        </FeatureGrid>

        <Screenshot
          src="/images/EditProfile.png"
          alt="Contacts List"
        />
      </DocSection>

      {/* Add Contact */}
      <DocSection title="Edit Profile Modal">
        <p>
          Administrators can edit their profile information by clicking the
          <strong> “Edit Profile” </strong>
          drop down by clicking on admin profile.
        </p>

     

        <Screenshot
          src="/images/EditProfileModal.png"
          alt="Edit Profile Modal"
        />
      </DocSection>



    
    </>
  );
}
