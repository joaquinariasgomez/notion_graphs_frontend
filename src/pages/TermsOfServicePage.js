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
                <li>Integration with Notion through their official API</li>
                <li>Creation of customizable financial charts (bar, line, burndown, etc.)</li>
                <li>Dashboard for managing and viewing multiple charts</li>
                <li>Data visualization and analysis tools</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>3. Account Registration and Authentication</h2>
              <p>
                To use NotionWallet, you must authenticate through your Notion account. By connecting your
                Notion account, you:
              </p>
              <ul>
                <li>Confirm that you are at least 13 years old (or the minimum age in your jurisdiction)</li>
                <li>Grant us permission to access the Notion pages and databases you select</li>
                <li>Agree to maintain the security of your Notion credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
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
                <li>You agree to pay all applicable fees as displayed at the time of purchase</li>
                <li>Subscriptions are billed on a recurring basis (monthly or annually, as selected)</li>
                <li>You authorize us to charge your payment method automatically for each billing cycle</li>
                <li>Prices may change with reasonable notice; continued use after price changes constitutes acceptance</li>
              </ul>

              <h3>4.3 Cancellation and Refunds</h3>
              <p>
                You may cancel your subscription at any time. Upon cancellation:
              </p>
              <ul>
                <li>You will retain access to paid features until the end of your current billing period</li>
                <li>No refunds will be provided for partial billing periods</li>
                <li>Your account will revert to the free tier after the subscription ends</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>5. User Conduct</h2>
              <p>When using our Services, you agree not to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Use automated systems (bots, scrapers) to access our Services without permission</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Interfere with or disrupt the integrity or performance of our Services</li>
                <li>Attempt to reverse engineer, decompile, or disassemble our software</li>
                <li>Use our Services for any fraudulent or illegal purpose</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>6. Intellectual Property</h2>

              <h3>6.1 Our Property</h3>
              <p>
                The NotionWallet application, including its design, logo, graphics, software, and content,
                is owned by NotionWallet and is protected by copyright, trademark, and other intellectual
                property laws. You may not copy, modify, distribute, or create derivative works without
                our express written permission.
              </p>

              <h3>6.2 Your Content</h3>
              <p>
                You retain ownership of all data in your Notion workspace. By using our Services, you grant
                us a limited, non-exclusive license to access and process your data solely for the purpose
                of providing our Services to you.
              </p>

              <h3>6.3 Notion Trademark</h3>
              <p>
                "Notion" is a trademark of Notion Labs, Inc. NotionWallet is not affiliated with, endorsed
                by, or sponsored by Notion Labs, Inc. We use the Notion name and logo only to indicate
                compatibility with their platform.
              </p>
            </section>

            <section className='legal__section'>
              <h2>7. Third-Party Services</h2>
              <p>
                Our Services integrate with third-party services including:
              </p>
              <ul>
                <li><strong>Notion:</strong> For data access and authentication. Your use of Notion is subject to Notion's Terms of Service.</li>
                <li><strong>Stripe:</strong> For payment processing. Payment transactions are subject to Stripe's Terms of Service.</li>
              </ul>
              <p>
                We are not responsible for the practices or policies of any third-party services.
              </p>
            </section>

            <section className='legal__section'>
              <h2>8. Disclaimer of Warranties</h2>
              <p>
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>We do not warrant that:</p>
              <ul>
                <li>The Services will be uninterrupted, secure, or error-free</li>
                <li>The results obtained from using the Services will be accurate or reliable</li>
                <li>Any errors in the Services will be corrected</li>
                <li>The Services will meet your specific requirements</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOTIONWALLET AND ITS OFFICERS, DIRECTORS,
                EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OUR SERVICES.
              </p>
              <p>
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU
                HAVE PAID TO US IN THE TWELVE (12) MONTHS PRIOR TO THE CLAIM, OR ONE HUNDRED DOLLARS
                ($100), WHICHEVER IS GREATER.
              </p>
            </section>

            <section className='legal__section'>
              <h2>10. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless NotionWallet and its officers, directors,
                employees, agents, and affiliates from and against any claims, liabilities, damages, losses,
                and expenses (including reasonable legal fees) arising out of or in any way connected with:
              </p>
              <ul>
                <li>Your access to or use of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you provide through the Services</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>11. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to our Services at any time,
                with or without cause, and with or without notice. Upon termination:
              </p>
              <ul>
                <li>Your right to use the Services will immediately cease</li>
                <li>We may delete your account data in accordance with our Privacy Policy</li>
                <li>Any outstanding payment obligations will remain due</li>
                <li>Provisions that by their nature should survive termination will remain in effect</li>
              </ul>
            </section>

            <section className='legal__section'>
              <h2>12. Governing Law and Disputes</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                jurisdiction in which NotionWallet operates, without regard to conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Services shall first be attempted
                to be resolved through good-faith negotiation. If negotiation fails, disputes shall be
                resolved through binding arbitration or in the courts of competent jurisdiction.
              </p>
            </section>

            <section className='legal__section'>
              <h2>13. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision
                shall be limited or eliminated to the minimum extent necessary, and the remaining provisions
                shall remain in full force and effect.
              </p>
            </section>

            <section className='legal__section'>
              <h2>14. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy, constitute the entire agreement between you
                and NotionWallet regarding your use of our Services and supersede any prior agreements
                between you and us.
              </p>
            </section>

            <section className='legal__section'>
              <h2>15. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServicePage;

