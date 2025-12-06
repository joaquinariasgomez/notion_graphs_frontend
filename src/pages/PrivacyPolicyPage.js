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
                <li><strong>Account Information:</strong> When you authenticate through Notion OAuth, we receive your Notion user ID, email address, and workspace information.</li>
                <li><strong>Notion Data:</strong> With your explicit permission, we access specific Notion databases that you choose to connect for generating financial charts and insights.</li>
                <li><strong>Payment Information:</strong> If you subscribe to our paid plans, payment processing is handled securely by Stripe. We do not store your complete credit card information on our servers.</li>
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
                <li>To provide and maintain our services, including generating charts from your Notion data</li>
                <li>To authenticate and manage your account</li>
                <li>To process transactions and send related information</li>
                <li>To communicate with you about updates, security alerts, and support</li>
                <li>To improve and optimize our services</li>
                <li>To detect, prevent, and address technical issues or fraudulent activity</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>4. Data Sharing and Disclosure</h2>
              <p>We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> We work with third-party services (such as Stripe for payments and hosting providers) that help us operate our business. These providers are bound by contractual obligations to keep your information confidential.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests.</li>
                <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
                <li><strong>With Your Consent:</strong> We may share your information for other purposes if you provide explicit consent.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>5. Notion Integration</h2>
              <p>
                Our application integrates with Notion through their official API. When you connect your
                Notion workspace:
              </p>
              <ul>
                <li>We only access the specific pages and databases you explicitly grant permission for</li>
                <li>We read your financial data solely to generate charts and insights</li>
                <li>We do not modify, delete, or write to your Notion workspace without your explicit action</li>
                <li>You can revoke access at any time through your Notion settings or by disconnecting within NotionWallet</li>
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
                <li>Encryption of data in transit using HTTPS/TLS</li>
                <li>Secure token storage for API authentication</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal data by authorized personnel only</li>
              </ul>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className='legal__section'>
              <h2>7. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes
                outlined in this Privacy Policy, unless a longer retention period is required or permitted
                by law. When you delete your account, we will delete or anonymize your personal data within
                30 days, except where retention is necessary for legal or legitimate business purposes.
              </p>
            </section>

            <section className='legal__section'>
              <h2>8. Your Rights</h2>
              <p>Depending on your location, you may have the following rights regarding your personal data:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information provided below.
              </p>
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
              <h2>10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own.
                These countries may have data protection laws different from your country. We ensure
                appropriate safeguards are in place to protect your information in accordance with
                this Privacy Policy.
              </p>
            </section>

            <section className='legal__section'>
              <h2>11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by
                posting the new Privacy Policy on this page and updating the "Last updated" date. We
                encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className='legal__section'>
              <h2>12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className='legal__contact'>
                <p><strong>Email:</strong> notionwallet@gmail.com</p>
                <p><strong>Website:</strong> <a href="https://www.notionwallet.com">www.notionwallet.com</a></p>
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

