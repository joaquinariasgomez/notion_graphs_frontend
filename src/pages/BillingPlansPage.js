import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBillingPlan, createStripeCheckoutSession } from '../api/RequestUtils';
import BillingConstants from '../BillingConstants';
import { BillingPlan } from '../utils/BillingPlanEnum';
import '../css/PricingSection.css';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { actionTypes } from '../context/globalReducer';

function BillingPlansPage() {

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  const [isCreatingStripeCheckoutPage, setIsCreatingStripeCheckoutPage] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      setIsLoading(true);
      const response = await getBillingPlan(userJWTCookie);
      setCurrentPlan(response.plan);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (priceId) => {
    try {
      setIsCreatingStripeCheckoutPage(true);
      const apiResponse = await createStripeCheckoutSession(userJWTCookie, priceId);
      if (apiResponse && apiResponse.checkoutUrl) {
        // Redirect to Stripe Checkout page
        window.location.href = apiResponse.checkoutUrl;
      } else {
        console.error('No checkout URL received from backend');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to initiate upgrade. Please try again.');
    } finally {
      setIsCreatingStripeCheckoutPage(false);
    }
  };

  const handleBackToDashboard = () => {
    // Close any active boxes and back to dashboard
    dispatch({ type: actionTypes.CLOSE_ACTIVE_BOX });
    navigate('/dashboard');
  };

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
    cta: 'Upgrade to Plus',
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
    cta: 'Upgrade to Plus',
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
    cta: 'Upgrade to Plus',
    priceId: BillingConstants.StripeLifetimePlusPriceId
  };

  // Get the current middle plan based on toggle
  const subscriptionPlan = billingPeriod === 'monthly' ? plusPlanMonthly : plusPlanYearly;

  const renderPlanCard = (plan, showToggle = false) => {
    const isCurrentPlan = currentPlan === plan.billingPlan;

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
          className={`cta-button primary ${isCurrentPlan ? 'current-plan' : ''}`}
          onClick={isCurrentPlan ? undefined : () => handleUpgrade(plan.priceId)}
          disabled={isCurrentPlan || isCreatingStripeCheckoutPage || plan.billingPlan === BillingPlan.FREE}
        >
          {isCreatingStripeCheckoutPage && !isCurrentPlan ? 'Processing...' : (isCurrentPlan ? 'Your current plan' : plan.cta)}
        </button>
        {plan.trialInfo && !isCurrentPlan && (
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

  if (isLoading) {
    return (
      <div className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-header">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-section">
      <div className="pricing-container">
        <button
          className="cta-button secondary"
          onClick={handleBackToDashboard}
          style={{
            maxWidth: '200px',
            marginBottom: '32px',
            padding: '10px 20px',
            fontSize: '0.9375rem'
          }}
        >
          ← Back to Dashboard
        </button>

        <div className="pricing-header">
          <h2>Upgrade Your Plan</h2>
          <p>Choose the plan that fits your needs. Upgrade or cancel anytime.</p>
        </div>

        <div className="pricing-grid">
          {renderPlanCard(freePlan)}
          {renderPlanCard(subscriptionPlan, true)}
          {renderPlanCard(lifetimePlan)}
        </div>

        <div className="pricing-footer">
          <p>All plans include secure Notion integration and data privacy. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}

export default BillingPlansPage;

