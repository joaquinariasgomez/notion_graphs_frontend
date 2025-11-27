import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheck, HiX } from 'react-icons/hi';
import { getBillingPlan, createStripeCheckoutSession } from '../api/RequestUtils';
import BillingConstants from '../BillingConstants';
import { BillingPlan } from '../utils/BillingPlanEnum';
import '../css/PricingSection.css';
import { useGlobalStateValue } from '../context/GlobalStateProvider';
import { actionTypes, BOX_TYPES } from '../context/globalReducer';

function BillingPlansPage() {

  // Context
  const [{ userJWTCookie }, dispatch] = useGlobalStateValue();

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [isCreatingStripeCheckoutPage, setIsCreatingStripeCheckoutPage] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      setIsLoading(true);
      const response = await getBillingPlan(userJWTCookie);
      setCurrentPlan(response.plan);
    } catch (error) {
      console.error('Error fetching billing plan:', error);
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
    // Set the active box to Profile with billing panel before navigating
    dispatch({
      type: actionTypes.SET_ACTIVE_BOX,
      value: {
        type: BOX_TYPES.PROFILE,
        data: { panel: 'billing' }
      }
    });
    navigate('/dashboard');
  };

  const plans = [
    {
      name: 'Notion Wallet',
      billingPlan: BillingPlan.FREE,
      price: '0',
      period: 'forever',
      description: 'Perfect for getting started with basic financial tracking',
      features: [
        { text: 'Up to 3 charts', included: true },
        { text: 'Bar & Line charts', included: true },
        { text: 'Basic customization', included: true },
        { text: 'Notion sync', included: true },
        { text: 'Unlimited charts', included: false },
        { text: 'Burndown charts', included: false },
        { text: 'Multi-bar & Multi-line charts', included: false },
        { text: 'Advanced customization', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Notion Wallet Plus',
      billingPlan: BillingPlan.PLUS,
      price: billingCycle === 'monthly' ? '4.99' : '49.99',
      period: billingCycle === 'monthly' ? 'month' : 'year',
      description: 'For serious financial tracking with unlimited possibilities',
      features: [
        { text: 'Up to 3 charts', included: true },
        { text: 'Bar & Line charts', included: true },
        { text: 'Basic customization', included: true },
        { text: 'Notion sync', included: true },
        { text: 'Unlimited charts', included: true },
        { text: 'Burndown charts', included: true },
        { text: 'Multi-bar & Multi-line charts', included: true },
        { text: 'Advanced customization', included: true },
        { text: 'Priority email support', included: true },
      ],
      cta: 'Upgrade to Plus',
      popular: true,
      savings: billingCycle === 'yearly' ? 'Save €9.89/year' : null,
    },
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
          <p>Choose the plan that fits your needs. Upgrade anytime to unlock more features.</p>
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
                className={`pricing-card ${plan.popular ? 'popular' : ''} ${isCurrentPlan ? 'current-plan' : ''}`}
                key={index}
              >
                {plan.popular && <div className="popular-badge">Recommended</div>}
                {isCurrentPlan && <div className="current-plan-badge">Current Plan</div>}

                <div className="pricing-card-header">
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span className="currency">€</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                  {plan.savings && <div className="savings-text">{plan.savings}</div>}
                  <p className="plan-description">{plan.description}</p>
                </div>

                {/* Only show button for non-Free plans */}
                {plan.billingPlan !== BillingPlan.FREE && (
                  <button
                    className={`cta-button ${plan.popular ? 'primary' : 'secondary'}`}
                    onClick={isCurrentPlan ? undefined : handleUpgrade}
                    disabled={isCurrentPlan || isCreatingStripeCheckoutPage}
                    style={{
                      opacity: isCurrentPlan ? 0.6 : 1,
                      cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
                      marginBottom: '24px'
                    }}
                  >
                    {isCreatingStripeCheckoutPage && !isCurrentPlan ? 'Processing...' : plan.cta}
                  </button>
                )}

                <ul className="features-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={feature.included ? 'included' : 'not-included'}>
                      <span className="feature-icon">
                        {feature.included ? <HiCheck /> : <HiX />}
                      </span>
                      <span>{feature.text}</span>
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

