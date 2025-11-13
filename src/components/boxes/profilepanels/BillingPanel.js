import { useState, useEffect } from "react";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { createStripeCheckoutSession, getBillingGraphCount, getBillingPlan } from "../../../api/RequestUtils";
import { FaSyncAlt } from 'react-icons/fa';
import { BillingPlan, getBillingPlanDisplayName } from "../../../utils/BillingPlanEnum";
import { actionTypes } from "../../../context/globalReducer";

// Java's Integer.MAX_VALUE constant
const JAVA_INTEGER_MAX_VALUE = 2147483647;

export default function BillingPanel({ onClose }) {

  // Context
  const [{ userSessionDetails, userJWTCookie, billingGraphCountData, billingPlan }, dispatch] = useGlobalStateValue();

  const [isLoadingGraphCount, setIsLoadingGraphCount] = useState(false);
  const [isLoadingBillingPlan, setIsLoadingBillingPlan] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingStripePage, setIsCreatingStripePage] = useState(false);


  const fetchBillingGraphCount = async () => {
    try {
      setIsLoadingGraphCount(true);
      const apiResponse = await getBillingGraphCount(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_BILLING_GRAPH_COUNT_DATA,
          value: apiResponse
        })
      }
    } catch (error) {
      console.error("Error fetching graph count:", error);
    } finally {
      setIsLoadingGraphCount(false);
    }
  }

  const fetchBillingPlan = async () => {
    try {
      setIsLoadingBillingPlan(true);
      const apiResponse = await getBillingPlan(userJWTCookie);
      if (apiResponse) {
        dispatch({
          type: actionTypes.SET_BILLING_PLAN,
          value: apiResponse.plan
        })
      }
    } catch (error) {
      console.error("Error fetching billing plan:", error);
    } finally {
      setIsLoadingBillingPlan(false);
    }
  }

  const refreshAllBillingData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchBillingGraphCount(),
        fetchBillingPlan()
      ]);
    } catch (error) {
      console.error("Error refreshing billing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  const upgradePlan = async () => {
    try {
      setIsCreatingStripePage(true);
      const apiResponse = await createStripeCheckoutSession(userJWTCookie);
      if (apiResponse) {
        console.log(apiResponse)
      }
    } catch (error) {

    } finally {
      setIsCreatingStripePage(false);
    }
  }

  // Info tooltip component
  const InfoTooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div
        className="info-tooltip__container"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <span className="info-tooltip__icon">
          i
        </span>
        {isVisible && (
          <div className="info-tooltip__popup">
            {text}
            <div className="info-tooltip__arrow"></div>
          </div>
        )}
      </div>
    );
  };

  // Semicircular gauge component (half-moon shape)
  const SemicircularGauge = ({ label, tooltipText, current, max, color = "#4CAF50", isLoading = false }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    // Check if max is Integer.MAX_VALUE from Java backend
    const isInfinite = max === JAVA_INTEGER_MAX_VALUE;

    const percentage = isInfinite ? 0 : (max > 0 ? (current / max) * 100 : 0);
    const cappedPercentage = Math.min(percentage, 100);

    const size = 180;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // Half circle circumference

    // Calculate offset for the animated percentage
    const offset = circumference - (animatedPercentage / 100) * circumference;

    // Animate the gauge when data loads
    useEffect(() => {
      if (!isLoading && !isInfinite && cappedPercentage >= 0) {
        // Small delay to ensure the animation is visible
        const timer = setTimeout(() => {
          setAnimatedPercentage(cappedPercentage);
        }, 100);
        return () => clearTimeout(timer);
      } else if (isLoading || isInfinite) {
        setAnimatedPercentage(0);
      }
    }, [cappedPercentage, isLoading, isInfinite]);

    return (
      <div className="gauge__container">
        <div className="gauge__label">
          <span>{label}</span>
          {tooltipText && <InfoTooltip text={tooltipText} />}
        </div>

        <div
          className="gauge__svg-container"
          style={{
            width: `${size}px`,
            height: `${size / 2 + 20}px`
          }}
        >
          {isLoading ? (
            // Loading state - show empty gauge with loading text
            <>
              <svg width={size} height={size / 2 + 20} className="gauge__svg">
                <path
                  d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              </svg>
              <div className="gauge__loading-text">
                Loading...
              </div>
            </>
          ) : (
            <>
              {/* Background arc */}
              <svg width={size} height={size / 2 + 20} className="gauge__svg">
                <path
                  d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
                {/* Foreground arc with animation */}
                <path
                  d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="gauge__arc-foreground"
                />
              </svg>

              {/* Center text showing count */}
              <div className="gauge__count-text" style={{ color: color }}>
                {current} / {isInfinite ? '∞' : max}
              </div>

              {/* Percentage or Unlimited text */}
              <div className="gauge__percentage-text">
                {isInfinite ? 'Unlimited' : `${Math.round(animatedPercentage)}%`}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="billingpanel">
      <div className="info__container">
        <div className="billingpanel__header-row">
          <h3 className="billingpanel__section-header">
            <span className="billingpanel__section-icon">
              📊
            </span>
            Charts Usage
          </h3>
          <button onClick={refreshAllBillingData} disabled={isRefreshing}>
            <FaSyncAlt className={`refresh-button__icon ${isRefreshing ? 'spinning' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="billingpanel__gauges-container">
          {isLoadingGraphCount ? (
            <>
              <SemicircularGauge
                label="Chart creations"
                tooltipText="The total amount of charts that you can create since registering your account"
                current={0}
                max={100}
                color="#4CAF50"
                isLoading={true}
              />
              <SemicircularGauge
                label="Charts in dashboard"
                tooltipText="The total amount of charts that you can have in your dashboard"
                current={0}
                max={100}
                color="#2196F3"
                isLoading={true}
              />
              <SemicircularGauge
                label="Chart refreshes"
                tooltipText="The total amount of charts that you can refresh since registering your account"
                current={0}
                max={100}
                color="#FF9800"
                isLoading={true}
              />
            </>
          ) : billingGraphCountData ? (
            <>
              <SemicircularGauge
                label="Chart creations"
                tooltipText="The total amount of charts that you can create since registering your account"
                current={billingGraphCountData.currentCount || 0}
                max={billingGraphCountData.maxCount || 0}
                color="#4CAF50"
                isLoading={false}
              />
              <SemicircularGauge
                label="Charts in dashboard"
                tooltipText="The total amount of charts that you can have in your dashboard"
                current={billingGraphCountData.currentGraphList || 0}
                max={billingGraphCountData.maxGraphList || 0}
                color="#2196F3"
                isLoading={false}
              />
              <SemicircularGauge
                label="Chart refreshes"
                tooltipText="The total amount of charts that you can refresh since registering your account"
                current={billingGraphCountData.currentRefreshCount || 0}
                max={billingGraphCountData.maxRefreshCount || 0}
                color="#FF9800"
                isLoading={false}
              />
            </>
          ) : (
            <p>Unable to load chart usage data.</p>
          )}
        </div>
      </div>

      {/* Billing Plan Widget */}
      <div className="info__container">
        <h3 className="billingpanel__section-header">
          <span className="billingpanel__section-icon">
            💳
          </span>
          Current Plan
        </h3>
        {isLoadingBillingPlan ? (
          <p>Loading...</p>
        ) : billingPlan ? (
          <>
            <p>
              <span className="billingpanel__plan-name">
                {getBillingPlanDisplayName(billingPlan)}
              </span>
            </p>
            {billingPlan === BillingPlan.FREE && (
              <button onClick={upgradePlan}>
                Upgrade Plan
              </button>
            )}
          </>
        ) : (
          <p>Unable to load billing plan data.</p>
        )}
      </div>
    </div>
  );
}