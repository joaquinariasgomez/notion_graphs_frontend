import { useState } from 'react';
import '../css/PricingSection.css';
import { HiCheck, HiX } from 'react-icons/hi';

function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      description: 'Perfect for getting started with basic financial tracking',
      features: [
        { text: 'Up to 3 charts', included: true },
        { text: 'Bar & Line charts', included: true },
        { text: 'Basic customization', included: true },
        { text: 'Notion sync', included: true },
        { text: 'Burndown charts', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: billingCycle === 'monthly' ? '2.99' : '29.99',
      period: billingCycle === 'monthly' ? 'month' : 'year',
      description: 'For serious financial tracking with unlimited possibilities',
      features: [
        { text: 'Unlimited charts', included: true },
        { text: 'All chart types', included: true },
        { text: 'Burndown charts', included: true },
        { text: 'Advanced customization', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Early access to features', included: true },
      ],
      cta: 'Start Pro Trial',
      popular: true,
      savings: billingCycle === 'yearly' ? 'Save €5.89/year' : null,
    },
  ];

  return (
    <section className='pricing-section' id='pricing'>
      <div className='pricing-container'>
        <div className='pricing-header'>
          <h2>Pricing</h2>
          <p>Choose the plan that fits your needs. Start free, upgrade anytime.</p>
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
            <span className='savings-badge'>Save 16%</span>
          </button>
        </div>

        <div className='pricing-grid'>
          {plans.map((plan, index) => (
            <div
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              key={index}
            >
              {plan.popular && <div className='popular-badge'>Recommended</div>}

              <div className='pricing-card-header'>
                <h3>{plan.name}</h3>
                <div className='price'>
                  <span className='currency'>€</span>
                  <span className='amount'>{plan.price}</span>
                  <span className='period'>/{plan.period}</span>
                </div>
                {plan.savings && <div className='savings-text'>{plan.savings}</div>}
                <p className='plan-description'>{plan.description}</p>
              </div>

              <ul className='features-list'>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={feature.included ? 'included' : 'not-included'}>
                    <span className='feature-icon'>
                      {feature.included ? <HiCheck /> : <HiX />}
                    </span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`cta-button ${plan.popular ? 'primary' : 'secondary'}`}
              // onClick={ }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className='pricing-footer'>
          <p>All plans include secure Notion integration and data privacy. No credit card required to start.</p>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;

