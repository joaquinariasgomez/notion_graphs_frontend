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

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [isCreatingStripeCheckoutPage, setIsCreatingStripeCheckoutPage] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleUpgrade = async () => {
    try {
      setIsCreatingStripeCheckoutPage(true);
      const priceId = billingCycle === 'monthly'
        ? BillingConstants.StripeMonthlyPlusPriceId
        : BillingConstants.StripeYearlyPlusPriceId;

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
      isSuggested: true,
      cta: 'Upgrade to Plus',
      savings: billingCycle === 'yearly' ? 'Save €9.98 / year' : null,
      trialInfo: '7-day free trial · Cancel anytime'
    }
  ];

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

        <div className="billing-toggle">
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
            <span className="savings-badge">Save 17%</span>
          </button>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => {
            const isCurrentPlan = currentPlan === plan.billingPlan;

            return (
              <div
                className={`pricing-card ${plan.isSuggested ? 'suggested-plan' : ''}`}
                key={index}
              >
                {plan.isSuggested && <div className="suggested-plan-badge">Suggested</div>}

                <div className="pricing-card-header">
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span className="currency">€</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                  {plan.savings && <div className="savings-text">{plan.savings}</div>}
                </div>

                <button
                  className={`cta-button primary ${isCurrentPlan ? 'current-plan' : ''}`}
                  onClick={isCurrentPlan ? undefined : handleUpgrade}
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
          })}
        </div>

        <div className="pricing-footer">
          <p>All plans include secure Notion integration and data privacy. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}

export default BillingPlansPage;

