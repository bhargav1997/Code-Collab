import { useState, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faGraduationCap,
   faTasks,
   faUsers,
   faCog,
   faChartLine,
   faCalendar,
   faTrophy,
   faRocket,
   faCode,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Onboarding.module.css";
import PropTypes from "prop-types";

const onboardingSteps = [
   {
      title: "Welcome to LearnHub",
      description: "Your personalized learning journey starts here! Let's explore the key features that will help you succeed.",
      icon: faGraduationCap,
   },
   {
      title: "Create Learning Tasks",
      description: "Track your progress with courses, books, videos, and articles. Set goals and monitor your achievements.",
      icon: faTasks,
   },
   {
      title: "Track Your Progress",
      description: "View detailed analytics of your learning journey, complete with progress tracking and milestone achievements.",
      icon: faChartLine,
   },
   {
      title: "Take Challenges",
      description: "Push yourself with coding challenges and quizzes to test your knowledge and improve your skills.",
      icon: faCode,
   },
   {
      title: "Learning Calendar",
      description: "Plan your study schedule and never miss a learning session with our integrated calendar.",
      icon: faCalendar,
   },
   {
      title: "Community Features",
      description: "Share your progress, connect with fellow learners, and participate in discussions.",
      icon: faUsers,
   },
   {
      title: "Achievements & Rewards",
      description: "Earn certificates and track your position on the leaderboard as you progress.",
      icon: faTrophy,
   },
   {
      title: "Learning Journey",
      description: "Create custom learning paths and track your long-term educational goals.",
      icon: faRocket,
   },
   {
      title: "Customize Your Experience",
      description: "Set your preferences, manage notifications, and personalize your learning environment.",
      icon: faCog,
   },
];

function Onboarding({ onComplete }) {
   const [currentStep, setCurrentStep] = useState(0);
   const [hasSeenAllSteps, setHasSeenAllSteps] = useState(false);

   const handleNext = () => {
      if (currentStep < onboardingSteps.length - 1) {
         setCurrentStep(currentStep + 1);
         if (currentStep === onboardingSteps.length - 2) {
            setHasSeenAllSteps(true);
         }
      } else {
         onComplete();
      }
   };

   const handleSkip = () => {
      onComplete();
   };

   const handlePrevious = () => {
      if (currentStep > 0) {
         setCurrentStep(currentStep - 1);
      }
   };

   const isLastStep = currentStep === onboardingSteps.length - 1;
   const isFirstStep = currentStep === 0;

   return (
      <div className={styles.onboardingOverlay}>
         <div className={styles.onboardingModal}>
            <div className={styles.stepIndicator}>
               {onboardingSteps.map((_, index) => (
                  <div
                     key={index}
                     className={`${styles.stepDot} ${index === currentStep ? styles.active : ""} ${
                        index < currentStep ? styles.completed : ""
                     }`}
                  />
               ))}
            </div>
            <div className={styles.stepContent}>
               <FontAwesomeIcon icon={onboardingSteps[currentStep].icon} className={styles.stepIcon} />
               <h2>{onboardingSteps[currentStep].title}</h2>
               <p>{onboardingSteps[currentStep].description}</p>
            </div>
            <div className={`${styles.navigationButtons} ${isLastStep && hasSeenAllSteps ? styles.centerButton : ""}`}>
               {!isFirstStep && (
                  <button onClick={handlePrevious} className={styles.previousButton}>
                     Previous
                  </button>
               )}
               {!isLastStep ? (
                  <>
                     <button onClick={handleSkip} className={styles.skipButton}>
                        Skip Tour
                     </button>
                     <button onClick={handleNext} className={styles.nextButton}>
                        Next
                     </button>
                  </>
               ) : (
                  <button onClick={handleNext} className={styles.getStartedButton}>
                     Get Started
                  </button>
               )}
            </div>
         </div>
      </div>
   );
}

Onboarding.propTypes = {
   onComplete: PropTypes.func.isRequired,
};

export default memo(Onboarding);
