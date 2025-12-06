import { useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import '../css/HowConnectionWorksSection.css';

function HowConnectionWorksSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const stepDescriptions = [
    <>Connect your Notion workspace by authorizing <a href="https://wallettemplates.notion.site/Notion-Wallet-2909c8c2278480629e21e2123aa91f1f" target="_blank" rel="noopener noreferrer" className="how-connection-works-link">NotionWallet</a></>,
    <>Duplicate <a href="https://wallettemplates.notion.site/Notion-Wallet-2909c8c2278480629e21e2123aa91f1f" target="_blank" rel="noopener noreferrer" className="how-connection-works-link">our template</a> or confirm that you're allowing access to your existing Notion Wallet page</>,
    "Start creating beautiful charts"
  ];

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  return (
    <section className='how-connection-works-section' id='how-connection-works'>
      <div className='how-connection-works-container'>
        <div className='how-connection-works-header'>
          <h2>Connect to Notion in 3 simple steps</h2>
          <p>Get started in seconds with our seamless integration process</p>
        </div>

        <div className='how-connection-works-content'>
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="how-connection-works-nav-button prev"
          >
            <FaChevronLeft />
          </button>

          <div className='how-connection-works-image-wrapper'>
            <div className='how-connection-works-step-badge'>
              Step {currentStep}
            </div>
            <div className='how-connection-works-image-container'>
              <img
                src={`${process.env.PUBLIC_URL}/how_integration_works/how_integration_works_step_${currentStep}.png`}
                alt={`How integration works - Step ${currentStep}`}
              />
            </div>
            <p className='how-connection-works-step-description'>
              {stepDescriptions[currentStep - 1]}
            </p>
          </div>

          <button
            onClick={goToNextStep}
            disabled={currentStep === totalSteps}
            className="how-connection-works-nav-button next"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className='how-connection-works-dots'>
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              className={`how-connection-works-dot ${currentStep === step ? 'active' : ''}`}
              onClick={() => goToStep(step)}
              aria-label={`Go to step ${step}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowConnectionWorksSection;

