import '../css/LegalPages.css';
import LandingPageFooter from '../components/LandingPageFooter';
import LandingPageHeader from '../components/LandingPageHeader';

function TermsOfServicePage() {
  const lastUpdated = "December 6, 2025";

  return (
    <div className='legalpage__base'>
      <div className='grid-background' />
      <div className='legalpage__container'>
        <LandingPageHeader />
        <main className='legal__main'>
          <article className='legal__content'>
            <header className='legal__header'>
              <h1>Terms of Service</h1>
              <p className='legal__updated'>Last updated: {lastUpdated}</p>
            </header>

            <section className='legal__section'>
              <h2>1. Acceptance of Terms</h2>
              <p>
                Welcome to NotionWallet. By accessing or using our web application, website, and services
                (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, please do not use our Services.
              </p>
              <p>
                We may modify these Terms at any time. Your continued use of the Services after any changes
                indicates your acceptance of the modified Terms. We encourage you to review these Terms
                periodically.
              </p>
            </section>

            <section className='legal__section'>
              <h2>2. Description of Services</h2>
              <p>
                NotionWallet is a web application that allows users to connect their Notion workspace and
                transform financial data stored in Notion databases into visual charts and insights. Our
                Services include:
              </p>
              <ul>
                <li>Integration with Notion through their official API.</li>
                <li>Creation of customizable financial charts (bar, line, burndown, etc.).</li>
                <li>Dashboard for managing and viewing multiple charts.</li>
                <li>Data visualization and analysis tools.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>3. Account Registration and Authentication</h2>
              <p>
                To use NotionWallet, you must authenticate through a third party provider, such as Google. By logging in to our service, you:
              </p>
              <ul>
                <li>Grant us permission to access the information from Notion pages that our integration has access to.</li>
                <li>Agree to maintain the security of your Notion credentials.</li>
                <li>Accept responsibility for all activities that occur under your account.</li>
              </ul>
              <p>
                You may revoke NotionWallet's access to your Notion workspace at any time through your
                Notion settings or by disconnecting within our application.
              </p>
            </section>

            <section className='legal__section'>
              <h2>4. Free and Paid Services</h2>

              <h3>4.1 Free Tier</h3>
              <p>
                We offer a free tier with limited features. Free tier users may have restrictions on the
                number of charts, data refresh frequency, or access to certain features.
              </p>

              <h3>4.2 Paid Subscriptions</h3>
              <p>
                We offer paid subscription plans ("Plus" and other tiers) with additional features. By
                subscribing to a paid plan:
              </p>
              <ul>
                <li>You agree to pay all applicable fees as displayed at the time of purchase.</li>
                <li>Subscriptions are billed on a recurring basis (monthly or annually, as selected).</li>
                <li>You authorize us to charge your payment method automatically for each billing cycle.</li>
              </ul>

              <h3>4.3 Cancellation and Refunds</h3>
              <p>
                You may cancel your subscription at any time. Upon cancellation:
              </p>
              <ul>
                <li>You will retain access to paid features until the end of your current billing period.</li>
                <li>No refunds will be provided for partial billing periods.</li>
                <li>Your account will revert to the free tier after the subscription ends.</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>5. Intellectual Property</h2>

              <h3>5.1 Our Property</h3>
              <p>
                The NotionWallet application, including its design, logo, graphics, software, and content,
                is owned by NotionWallet and is protected by copyright, trademark, and other intellectual
                property laws. You may not copy, modify, distribute, or create derivative works without
                our express written permission.
              </p>

              <h3>5.2 Your Content</h3>
              <p>
                You retain ownership of all data in your Notion workspace. By using our Services, you grant
                us a limited, non-exclusive license to access and process your data solely for the purpose
                of providing our Services to you.
              </p>

              <h3>5.3 Notion Trademark</h3>
              <p>
                "Notion" is a trademark of Notion Labs, Inc. NotionWallet is not affiliated with, endorsed
                by, or sponsored by Notion Labs, Inc. We use the Notion name and logo only to indicate
                compatibility with their platform.
              </p>
            </section>

            <section className='legal__section'>
              <h2>6. Third-Party Services</h2>
              <p>
                Our Services integrate with third-party services including:
              </p>
              <ul>
                <li><strong>Notion:</strong> For data access. Your use of Notion is subject to Notion's Terms of Service.</li>
                <li><strong>Stripe:</strong> For payment processing. Payment transactions are subject to Stripe's Terms of Service.</li>
              </ul>
              <p>
                We are not responsible for the practices or policies of any third-party services.
              </p>
            </section>

            <section className='legal__section'>
              <h2>7. Termination</h2>
              <p>
                We value our users and will only terminate accounts in cases where our Terms of Service
                or Privacy Policy have been violated. We are committed to fair treatment:
              </p>
              <ul>
                <li><strong>Prior Notice:</strong> Before any account termination, we will notify you via email and provide an explanation of the violation.</li>
                <li><strong>Opportunity to Respond:</strong> You will have a reasonable opportunity to address the issue or appeal the decision before termination takes effect.</li>
                <li>Any outstanding payment obligations will remain due.</li>
                <li>You may voluntarily delete your account at any time through your account settings.</li>
              </ul>
              <p>
                We believe in transparent communication and will always strive to resolve issues
                before resorting to account termination.
              </p>
            </section>

            <section className='legal__section'>
              <h2>8. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you
                and NotionWallet regarding your use of our Services and supersede any prior agreements
                between you and us.
              </p>
            </section>

            <section className='legal__section'>
              <h2>9. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServicePage;

