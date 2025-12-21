import { useState } from 'react';
import '../css/PricingSection.css';
import { BillingPlan } from '../utils/BillingPlanEnum';
import { useNavigate } from 'react-router-dom';
import BillingConstants from '../BillingConstants';

function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'

  const navigate = useNavigate();

  const freePlan = {
    name: 'Notion Wallet Free',
    billingPlan: BillingPlan.FREE,
    price: '0',
    features: [
      { text: '📊\u00A0\u00A0Up to 3 charts in your dashboard' },
      { text: '📊\u00A0\u00A0Up to 20 chart creations' },
      { text: '🔄\u00A0\u00A0Up to 50 chart updates' },
      { text: '📈\u00A0\u00A0Show statistics (average, standard deviation) in your charts' },
      { text: '⚙️\u00A0\u00A0Advanced chart customization' }
    ],
    isSuggested: false,
    cta: 'Basic plan',
  };

  const plusPlanMonthly = {
    name: 'Notion Wallet Plus',
    billingPlan: BillingPlan.PLUS,
    price: '2.99',
    periodLabel: '/month',
    features: [
      { text: '📊\u00A0\u00A0<i>Up to 50</i> charts in your dashboard' },
      { text: '📊\u00A0\u00A0<i>Unlimited</i> chart creations' },
      { text: '🔄\u00A0\u00A0<i>Unlimited</i> chart updates' },
      { text: '📈\u00A0\u00A0Show statistics (average, standard deviation) in your charts' },
      { text: '⚙️\u00A0\u00A0Advanced chart customization' },
      { text: '🔥\u00A0\u00A0Burndown charts' },
      { text: '✉️\u00A0\u00A0Priority email support' },
    ],
    isSuggested: false,
    cta: 'Start Plus for Free',
    trialInfo: '7-day free trial · Cancel anytime',
    priceId: BillingConstants.StripeMonthlyPlusPriceId
  };

  const plusPlanYearly = {
    name: 'Notion Wallet Plus',
    billingPlan: BillingPlan.PLUS,
    oldPrice: '36',
    price: '25',
    periodLabel: '/year',
    features: [
      { text: '📊\u00A0\u00A0<i>Up to 50</i> charts in your dashboard' },
      { text: '📊\u00A0\u00A0<i>Unlimited</i> chart creations' },
      { text: '🔄\u00A0\u00A0<i>Unlimited</i> chart updates' },
      { text: '📈\u00A0\u00A0Show statistics (average, standard deviation) in your charts' },
      { text: '⚙️\u00A0\u00A0Advanced chart customization' },
      { text: '🔥\u00A0\u00A0Burndown charts' },
      { text: '✉️\u00A0\u00A0Priority email support' },
    ],
    isSuggested: false,
    cta: 'Start Plus for Free',
    trialInfo: '7-day free trial · Cancel anytime',
    priceId: BillingConstants.StripeYearlyPlusPriceId
  };

  const lifetimePlan = {
    name: 'Notion Wallet Plus',
    billingPlan: BillingPlan.PLUS,
    oldPrice: '79.90',
    price: '47',
    periodLabel: 'Lifetime',
    features: [
      { text: '📊\u00A0\u00A0<i>Up to 50</i> charts in your dashboard' },
      { text: '📊\u00A0\u00A0<i>Unlimited</i> chart creations' },
      { text: '🔄\u00A0\u00A0<i>Unlimited</i> chart updates' },
      { text: '📈\u00A0\u00A0Show statistics (average, standard deviation) in your charts' },
      { text: '⚙️\u00A0\u00A0Advanced chart customization' },
      { text: '🔥\u00A0\u00A0Burndown charts' },
      { text: '✉️\u00A0\u00A0Priority email support' },
    ],
    isSuggested: true,
    cta: 'Upgrade to Plus Forever',
    priceId: BillingConstants.StripeLifetimePlusPriceId
  };

  // Get the current middle plan based on toggle
  const subscriptionPlan = billingPeriod === 'monthly' ? plusPlanMonthly : plusPlanYearly;

  const handleGoToBillingPlansPage = () => {
    navigate('/billing-plans');
  }

  const renderPlanCard = (plan, showToggle = false) => {
    return (
      <div className={`pricing-card ${plan.isSuggested ? 'suggested-plan' : ''}`}>
        {plan.isSuggested && <div className="suggested-plan-badge">Suggested</div>}

        <div className="pricing-card-header">
          <h3>{plan.name}</h3>
          <div className="price">
            {plan.oldPrice && (
              <span className="old-price">€{plan.oldPrice}</span>
            )}
            <span className="currency">€</span>
            <span className="amount">{plan.price}</span>
            {plan.periodLabel && (
              <span className="period-label">{plan.periodLabel}</span>
            )}
          </div>
          {plan.price !== '0' && plan.periodLabel === 'Lifetime' && (
            <p className="one-time-payment">One-time payment. No subscription</p>
          )}
          {showToggle && (
            <div className="billing-toggle">
              <span className={billingPeriod === 'monthly' ? 'active' : ''}>Monthly</span>
              <button
                className="toggle-switch"
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                aria-label="Toggle billing period"
              >
                <span className={`toggle-slider ${billingPeriod === 'yearly' ? 'yearly' : ''}`} />
              </button>
              <span className={billingPeriod === 'yearly' ? 'active' : ''}>Yearly</span>
            </div>
          )}
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

        <ul className="features-list">
          {plan.features.map((feature, idx) => (
            <li key={idx}>
              <span dangerouslySetInnerHTML={{ __html: feature.text }} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className='pricing-section' id='pricing'>
      <div className='pricing-container'>
        <div className='pricing-header'>
          <h2>Pricing</h2>
          <p>Choose the plan that fits your needs. Start free, upgrade or cancel anytime</p>
        </div>

        <div className='pricing-grid'>
          {renderPlanCard(freePlan)}
          {renderPlanCard(subscriptionPlan, true)}
          {renderPlanCard(lifetimePlan)}

          {/* {plans.map((plan, index) => (
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
          ))} */}
        </div>

        <div className='pricing-footer'>
          <p>All plans include secure Notion integration and data privacy. For subscription plans, cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;

