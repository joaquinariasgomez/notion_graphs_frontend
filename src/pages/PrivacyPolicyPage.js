import '../css/LegalPages.css';
import LandingPageFooter from '../components/LandingPageFooter';
import LandingPageHeader from '../components/LandingPageHeader';

function PrivacyPolicyPage() {
  const lastUpdated = "December 6, 2025";

  return (
    <div className='legalpage__base'>
      <div className='grid-background' />
      <div className='legalpage__container'>
        <LandingPageHeader />
        <main className='legal__main'>
          <article className='legal__content'>
            <header className='legal__header'>
              <h1>Privacy Policy</h1>
              <p className='legal__updated'>Last updated: {lastUpdated}</p>
            </header>

            <section className='legal__section'>
              <h2>1. Introduction</h2>
              <p>
                Welcome to NotionWallet ("we," "our," or "us"). We are committed to protecting your
                personal information and your right to privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you use our web application
                and services.
              </p>
              <p>
                By using NotionWallet, you agree to the collection and use of information in accordance
                with this policy. If you do not agree with our policies and practices, please do not use
                our services.
              </p>
            </section>

            <section className='legal__section'>
              <h2>2. Information We Collect</h2>

              <h3>2.1 Information You Provide</h3>
              <p>We collect information that you voluntarily provide when using our services:</p>
              <ul>
                <li><strong>Account Information:</strong> When you authenticate through Google OAuth, we receive your Google user ID, email address, and picture url.</li>
                <li><strong>Notion Data:</strong> With your explicit permission, we access specific Notion databases that you choose to connect for generating financial charts and insights.</li>
                <li><strong>Payment Information:</strong> If you subscribe to our paid plans, payment processing is handled securely by Stripe. We can not store any of your credit card information on our servers.</li>
              </ul>

              <h3>2.2 Information Collected Automatically</h3>
              <p>When you access our services, we may automatically collect:</p>
              <ul>
                <li><strong>Usage Data:</strong> Information about how you interact with our application, including features used and time spent.</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                <li><strong>Cookies:</strong> We use essential cookies to maintain your session and preferences.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li>To provide and maintain our services, including generating charts from your Notion data.</li>
                <li>To authenticate and manage your account.</li>
                <li>To communicate with you about updates, security alerts, and support.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>4. Data Sharing and Disclosure</h2>
              <p>We do not sell, rent, or trade your personal information.</p>
            </section>

            <section className='legal__section'>
              <h2>5. Notion Integration</h2>
              <p>
                Our application integrates with Notion through their official API. When you connect your
                Notion workspace:
              </p>
              <ul>
                <li>We only access the specific pages and databases you explicitly grant permission for.</li>
                <li>We read your financial data solely to generate charts and insights.</li>
                <li>We do not modify, delete, or write to your Notion workspace without your explicit action.</li>
                <li>You can revoke access at any time through your Notion settings or by disconnecting within NotionWallet.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your
                personal information against unauthorized access, alteration, disclosure, or destruction.
                These measures include:
              </p>
              <ul>
                <li>Encryption of data in transit using HTTPS/TLS.</li>
                <li>Secure token storage for API authentication.</li>
                <li>Regular security assessments and updates.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>7. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes
                outlined in this Privacy Policy, unless a longer retention period is required or permitted
                by law. When you delete your account, we will delete your personal data immediately.
              </p>
            </section>

            <section className='legal__section'>
              <h2>8. Your Rights and Data Control</h2>
              <p>
                We believe you should have full control over your personal data. NotionWallet provides you
                with the ability to manage and delete your data at any time:
              </p>
              <ul>
                <li><strong>Data Deletion:</strong> You can request complete deletion of all your data stored in our systems at any time through your account settings or by contacting us directly.</li>
                <li><strong>Account Deletion:</strong> When you delete your account, all associated data—including your charts, configurations, and personal information—will be permanently removed from our servers immediately.</li>
                <li><strong>No Data Retention:</strong> Once deleted, your data cannot be recovered. We do not retain backup copies of deleted user data beyond what is legally required.</li>
                <li><strong>Integration Disconnection:</strong> You can disconnect your Notion integration at any time, which immediately revokes our access to your Notion workspace data.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>9. Children's Privacy</h2>
              <p>
                Our services are not intended for users under the age of 13 (or 16 in certain jurisdictions).
                We do not knowingly collect personal information from children. If we become aware that we
                have collected data from a child without parental consent, we will take steps to delete
                that information.
              </p>
            </section>

            <section className='legal__section'>
              <h2>10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date. We
                encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className='legal__section'>
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className='legal__contact'>
                <p><strong>Email:</strong> notionwallet@gmail.com</p>
                <p><strong>Website:</strong> <a href="https://www.notionwallet.com">notionwallet.com</a></p>
              </div>
            </section>
          </article>
        </main>
        <LandingPageFooter />
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;

