import { useState, useEffect } from "react";
import { useGlobalStateValue } from "../../../context/GlobalStateProvider";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../../context/globalReducer";
import { getBillingGraphCount, getBillingPlan } from "../../../api/RequestUtils";
import { FaSyncAlt } from 'react-icons/fa';

export default function BillingPanel({ onClose }) {

  // Context
  const [{ userSessionDetails, userJWTCookie }, dispatch] = useGlobalStateValue();

  const navigate = useNavigate();

  // State for graph count data
  const [graphCountData, setGraphCountData] = useState(null);
  const [isLoadingGraphCount, setIsLoadingGraphCount] = useState(false);

  // State for billing plan data
  const [billingPlanData, setBillingPlanData] = useState(null);
  const [isLoadingBillingPlan, setIsLoadingBillingPlan] = useState(false);

  const closeBox = () => {
    dispatch({
      type: actionTypes.SET_SHOW_USER_PROFILE_BOX,
      value: false
    })
    dispatch({
      type: actionTypes.SET_SHOW_NOTION_CONNECTION_BOX,
      value: false
    })
  }

  // Fetch graph count data
  const fetchGraphCount = async () => {
    try {
      setIsLoadingGraphCount(true);
      const apiResponse = await getBillingGraphCount(userJWTCookie);
      if (apiResponse) {
        setGraphCountData(apiResponse);
      }
    } catch (error) {
      console.error("Error fetching graph count:", error);
    } finally {
      setIsLoadingGraphCount(false);
    }
  }

  // Fetch billing plan data
  const fetchBillingPlan = async () => {
    try {
      setIsLoadingBillingPlan(true);
      const apiResponse = await getBillingPlan(userJWTCookie);
      if (apiResponse) {
        setBillingPlanData(apiResponse);
      }
    } catch (error) {
      console.error("Error fetching billing plan:", error);
    } finally {
      setIsLoadingBillingPlan(false);
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchGraphCount();
    fetchBillingPlan();
  }, []);

  // Semicircular gauge component (half-moon shape)
  const SemicircularGauge = ({ label, current, max, color = "#4CAF50", isLoading = false }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    const percentage = max > 0 ? (current / max) * 100 : 0;
    const cappedPercentage = Math.min(percentage, 100);

    const size = 180;
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // Half circle circumference

    // Calculate offset for the animated percentage
    const offset = circumference - (animatedPercentage / 100) * circumference;

    // Animate the gauge when data loads
    useEffect(() => {
      if (!isLoading && cappedPercentage > 0) {
        // Small delay to ensure the animation is visible
        const timer = setTimeout(() => {
          setAnimatedPercentage(cappedPercentage);
        }, 100);
        return () => clearTimeout(timer);
      } else if (isLoading) {
        setAnimatedPercentage(0);
      }
    }, [cappedPercentage, isLoading]);

    return (
      <div style={{ marginBottom: '2em', textAlign: 'center' }}>
        <div style={{
          fontSize: '0.9em',
          marginBottom: '0.5em',
          fontWeight: '500'
        }}>
          {label}
        </div>

        <div style={{
          position: 'relative',
          display: 'inline-block',
          width: `${size}px`,
          height: `${size / 2 + 20}px`
        }}>
          {isLoading ? (
            // Loading state - show empty gauge with loading text
            <>
              <svg width={size} height={size / 2 + 20} style={{ overflow: 'visible' }}>
                <path
                  d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.9em',
                color: '#999'
              }}>
                Loading...
              </div>
            </>
          ) : (
            <>
              {/* Background arc */}
              <svg width={size} height={size / 2 + 20} style={{ overflow: 'visible' }}>
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
                  style={{
                    transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center',
                  }}
                />
              </svg>

              {/* Center text showing count */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '1.4em',
                fontWeight: 'bold',
                color: color,
                transition: 'opacity 0.3s ease',
                opacity: animatedPercentage > 0 ? 1 : 0
              }}>
                {current} / {max}
              </div>

              {/* Percentage text */}
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.85em',
                color: '#666',
                transition: 'opacity 0.3s ease',
                opacity: animatedPercentage > 0 ? 1 : 0
              }}>
                {Math.round(animatedPercentage)}%
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="billingpanel">
      {/* Graph Count Widget */}
      <div className="info__container">
        <h3 style={{ marginBottom: '1em' }}>
          <span
            style={{
              fontSize: '1.2em',
              marginRight: '0.5em',
              verticalAlign: 'middle'
            }}
          >
            📊
          </span>
          Graph Usage
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1em' }}>
          {isLoadingGraphCount ? (
            <>
              <SemicircularGauge
                label="Graph Count"
                current={0}
                max={100}
                color="#4CAF50"
                isLoading={true}
              />
              <SemicircularGauge
                label="Graph List"
                current={0}
                max={100}
                color="#2196F3"
                isLoading={true}
              />
            </>
          ) : graphCountData ? (
            <>
              <SemicircularGauge
                label="Graph Count"
                current={graphCountData.currentCount || 0}
                max={graphCountData.maxCount || 0}
                color="#4CAF50"
                isLoading={false}
              />
              <SemicircularGauge
                label="Graph List"
                current={graphCountData.currentGraphList || 0}
                max={graphCountData.maxGraphList || 0}
                color="#2196F3"
                isLoading={false}
              />
            </>
          ) : (
            <p>Unable to load graph usage data.</p>
          )}
        </div>
        <button onClick={fetchGraphCount} disabled={isLoadingGraphCount}>
          <FaSyncAlt className={`refresh-button__icon ${isLoadingGraphCount ? 'spinning' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Billing Plan Widget */}
      <div className="info__container">
        <h3 style={{ marginBottom: '1em' }}>
          <span
            style={{
              fontSize: '1.2em',
              marginRight: '0.5em',
              verticalAlign: 'middle'
            }}
          >
            💳
          </span>
          Current Plan
        </h3>
        {isLoadingBillingPlan ? (
          <p>Loading...</p>
        ) : billingPlanData ? (
          <p>
            <span
              style={{
                fontSize: '1.5em',
                fontWeight: 'bold',
                color: '#2196F3'
              }}
            >
              {billingPlanData.plan || 'N/A'}
            </span>
          </p>
        ) : (
          <p>Unable to load billing plan data.</p>
        )}
        <button onClick={fetchBillingPlan} disabled={isLoadingBillingPlan}>
          <FaSyncAlt className={`refresh-button__icon ${isLoadingBillingPlan ? 'spinning' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}