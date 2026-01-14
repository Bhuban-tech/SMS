// app/docs/landing-login/page.jsx
import DocHeader from "@/components/docs/DocHeader";
import DocSection from "@/components/docs/DocSection";
import Screenshot from "@/components/docs/Screenshot";
import DocSidebar from "@/components/DocSidebar";

export default function LandingLoginPage() {
  return (
    <>
  
      <DocHeader
        title="Landing Page & Login"
        description="Understand how users enter and authenticate in KritimSMS."
      />

      <DocSection title="Landing Page">
        <p>
          The landing page is the first interface users see when visiting
          <strong> www.kritimsms.com</strong>.
        </p>

        <Screenshot src="/images/landing-page.png" alt="Landing Page" />
        <p>This is the first page the user interacts with where the admin can login to the system with their authenticated credentials. User can either  press on the “Get Started” button on the hero section or “Login” button on the header to get into the system to unlock the system’s features</p>
      </DocSection>

      <DocSection title="Login Page">
        <p>
          Users authenticate using valid credentials to access the system and unlock
          all features.
        </p>

        <Screenshot src="/images/login-page.png" alt="Login Page" />
      </DocSection>
    </>
  );
}
