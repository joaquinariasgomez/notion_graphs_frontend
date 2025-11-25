import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import '../../css/HowConnectionWorksModal.css';

export default function HowConnectionWorksModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  return (
    <div className="how-connection-works-modal__overlay" onClick={onClose}>
      <div className="how-connection-works-modal__content" onClick={(e) => e.stopPropagation()}>
        <button className="how-connection-works-modal__close" onClick={onClose}>
          ×
        </button>

        <div className="how-connection-works-modal__image-container">
          <img
            src={`${process.env.PUBLIC_URL}/how_integration_works/how_integration_works_step_${currentStep}.png`}
            alt={`How integration works - Step ${currentStep}`}
          />
        </div>

        <div className="how-connection-works-modal__navigation">
          <button
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            className="how-connection-works-modal__nav-button prev"
          >
            <FaChevronLeft color='#333' />
          </button>

          <span className="how-connection-works-modal__step-indicator">
            {currentStep} / {totalSteps}
          </span>

          <button
            onClick={goToNextStep}
            disabled={currentStep === totalSteps}
            className="how-connection-works-modal__nav-button next"
          >
            <FaChevronRight color='#333' />
          </button>
        </div>
      </div>
    </div>
  );
}

