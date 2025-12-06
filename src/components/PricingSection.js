import { useState } from 'react';
import '../css/PricingSection.css';
import { BillingPlan } from '../utils/BillingPlanEnum';
import { useNavigate } from 'react-router-dom';

function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const navigate = useNavigate();

  const plans = [
    {
      name: 'Notion Wallet Free',
      billingPlan: BillingPlan.FREE,
      price: '0',
      period: 'month',
      features: [
        { text: '📊\u00A0\u00A0Up to 3 charts in your dashboard' },
        { text: '📊\u00A0\u00A0Up to 20 chart creations' },
        { text: '🔄\u00A0\u00A0Up to 50 chart updates' },
        { text: '📈\u00A0\u00A0Show statistics (average, standard deviation) in your charts' },
        { text: '⚙️\u00A0\u00A0Advanced chart customization' }
      ],
      isSuggested: false,
      cta: 'Basic plan',
    },
    {
      name: 'Notion Wallet Plus',
      billingPlan: BillingPlan.PLUS,
      price: billingCycle === 'monthly' ? '4.99' : '49.90',
      period: billingCycle === 'monthly' ? 'month' : 'year',
      features: [
        { text: '📊\u00A0\u00A0<i>Up to 50</i> charts in your dashboard' },
        { text: '📊\u00A0\u00A0<i>Unlimited</i> chart creations' },
        { text: '🔄\u00A0\u00A0<i>Unlimited</i> chart updates' },
        { text: '📈\u00A0\u00A0Show statistics (average, standard deviation) in your charts' },
        { text: '⚙️\u00A0\u00A0Advanced chart customization' },
        { text: '🔥\u00A0\u00A0Burndown charts' },
        { text: '✉️\u00A0\u00A0Priority email support' },
        // TODO JOAQUIN: add Coming soon section
      ],
      cta: 'Start Plus for Free',
      isSuggested: true,
      savings: billingCycle === 'yearly' ? 'Save €9.98 / year' : null,
      trialInfo: '7-day free trial · Cancel anytime'
    },
  ];

  const handleGoToBillingPlansPage = () => {
    navigate('/billing-plans');
  }

  return (
    <section className='pricing-section' id='pricing'>
      <div className='pricing-container'>
        <div className='pricing-header'>
          <h2>Pricing</h2>
          <p>Choose the plan that fits your needs. Start free, upgrade or cancel anytime.</p>
        </div>

        <div className='billing-toggle'>
          <button
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <span className='savings-badge'>Save 17%</span>
          </button>
        </div>

        <div className='pricing-grid'>
          {plans.map((plan, index) => (
            <div
              className={`pricing-card ${plan.isSuggested ? 'suggested-plan' : ''}`}
              key={index}
            >
              {plan.isSuggested && <div className='suggested-plan-badge'>Suggested</div>}

              <div className='pricing-card-header'>
                <h3>{plan.name}</h3>
                <div className='price'>
                  <span className='currency'>€</span>
                  <span className='amount'>{plan.price}</span>
                  <span className='period'>/{plan.period}</span>
                </div>
                {plan.savings && <div className='savings-text'>{plan.savings}</div>}
              </div>

              <button
                className={`cta-button primary ${plan.billingPlan === BillingPlan.FREE ? 'current-plan' : ''}`}
                disabled={plan.billingPlan === BillingPlan.FREE}
                onClick={handleGoToBillingPlansPage}
              >
                {plan.cta}
              </button>

              {plan.trialInfo && (
                <p className="trial-info">{plan.trialInfo}</p>
              )}

              <ul className='features-list'>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span dangerouslySetInnerHTML={{ __html: feature.text }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className='pricing-footer'>
          <p>All plans include secure Notion integration and data privacy. No credit card required to start. Cancel anytime.</p>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;

