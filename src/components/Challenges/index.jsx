import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faPlus,
   faTrophy,
   faExclamationTriangle,
   faSpinner,
   faLightbulb,
   faRocket,
   faFlag,
   faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Challenges.module.css";
import CreateChallengeModal from "./CreateChallengeModal";

import { fetchChallenges, deleteChallenge } from "../../redux/challenges/challengesSlice";
import ChallengeCard from "./ChallengeCard";

// Custom SVG component for empty state
const EmptyChallengesSVG = () => (
   <svg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='100' cy='100' r='90' fill='#f0f0f0' />
      <path d='M100 20V180' stroke='#d0d0d0' strokeWidth='4' strokeDasharray='8 8' />
      <path d='M20 100H180' stroke='#d0d0d0' strokeWidth='4' strokeDasharray='8 8' />
      <circle cx='100' cy='100' r='60' fill='#3498db' />
      <path d='M80 100L95 115L120 90' stroke='white' strokeWidth='8' strokeLinecap='round' strokeLinejoin='round' />
      <circle cx='50' cy='50' r='15' fill='#f39c12' />
      <circle cx='150' cy='150' r='10' fill='#2ecc71' />
      <circle cx='150' cy='50' r='12' fill='#e74c3c' />
      <circle cx='50' cy='150' r='8' fill='#9b59b6' />
   </svg>
);

const Challenges = () => {
   const [showCreateModal, setShowCreateModal] = useState(false);
   const dispatch = useDispatch();
   const { challenges, status, error } = useSelector((state) => state.challenges);

   useEffect(() => {
      if (status === "idle") {
         dispatch(fetchChallenges());
      }
   }, [status, dispatch]);

   const handleDeleteChallenge = (challengeId) => {
      if (window.confirm("Are you sure you want to delete this challenge?")) {
         dispatch(deleteChallenge(challengeId))
            .unwrap()
            .then(() => {
               console.log("Challenge deleted successfully");
            })
            .catch((error) => {
               console.error("Failed to delete challenge:", error);
            });
      }
   };

   const renderEmptyChallenges = () => (
      <div className={styles.emptyChallenges}>
         <div className={styles.emptyContent}>
            <EmptyChallengesSVG />
            <div className={styles.emptyText}>
               <h2>Ready to Challenge Yourself?</h2>
               <p>Start your journey of growth and learning by creating your first challenge!</p>
            </div>
         </div>
         <div className={styles.infoSection}>
            <h3>
               <FontAwesomeIcon icon={faLightbulb} /> Why Start a Challenge?
            </h3>
            <ul>
               <li>
                  <FontAwesomeIcon icon={faFlag} />
                  <span>Set clear, achievable goals</span>
               </li>
               <li>
                  <FontAwesomeIcon icon={faChartLine} />
                  <span>Track your progress daily</span>
               </li>
               <li>
                  <FontAwesomeIcon icon={faRocket} />
                  <span>Boost your motivation and productivity</span>
               </li>
            </ul>
         </div>
         {/* <button className={styles.createFirstButton} onClick={() => setShowCreateModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Create Your First Challenge
         </button> */}
      </div>
   );

   return (
      <div className={styles.challengesContainer}>
         <div className={styles.header}>
            <h1 className={styles.title}>
               <FontAwesomeIcon icon={faTrophy} /> My Challenges
            </h1>
            <button className={styles.createButton} onClick={() => setShowCreateModal(true)}>
               <FontAwesomeIcon icon={faPlus} /> Create New Challenge
            </button>
         </div>

         {status === "loading" && (
            <div className={styles.loadingMessage}>
               <FontAwesomeIcon icon={faSpinner} spin />
               <p>Loading challenges...</p>
            </div>
         )}

         {status === "failed" && (
            <div className={styles.errorMessage}>
               <FontAwesomeIcon icon={faExclamationTriangle} />
               <p>{error}</p>
            </div>
         )}

         {status === "succeeded" && challenges.length === 0 && renderEmptyChallenges()}

         {status === "succeeded" && challenges.length > 0 && (
            <div className={styles.challengeGrid}>
               {challenges.map((challenge) => (
                  <ChallengeCard key={challenge._id} challenge={challenge} onDelete={() => handleDeleteChallenge(challenge._id)} />
               ))}
            </div>
         )}

         {showCreateModal && <CreateChallengeModal onClose={() => setShowCreateModal(false)} />}
      </div>
   );
};

export default Challenges;
