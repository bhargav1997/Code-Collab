import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrophy, faExclamationTriangle, faSpinner, faInfoCircle, faLightbulb, faRocket, faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./Challenges.module.css";
import CreateChallengeModal from "./CreateChallengeModal";
import ChallengeCard from "./ChallengeCard";
import { fetchChallenges, deleteChallenge } from "../../redux/challenges/challengesSlice";

const Challenges = () => {
   const [showCreateModal, setShowCreateModal] = useState(false);
   const [showInfo, setShowInfo] = useState(false);
   const dispatch = useDispatch();
   const { challenges, status, error } = useSelector((state) => state.challenges);

   useEffect(() => {
      if (status === "idle") {
         dispatch(fetchChallenges());
      }
   }, [status, dispatch]);

   const handleDeleteChallenge = (challengeId) => {
      if (window.confirm('Are you sure you want to delete this challenge?')) {
         dispatch(deleteChallenge(challengeId))
            .unwrap()
            .then(() => {
               console.log('Challenge deleted successfully');
            })
            .catch((error) => {
               console.error('Failed to delete challenge:', error);
            });
      }
   };

   const handleRetry = () => {
      dispatch(fetchChallenges());
   };

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

         <div className={styles.infoWrapper}>
            <p className={styles.infoTeaser}>
               Learn about challenges and their benefits
               <button className={styles.infoButton} onClick={() => setShowInfo(!showInfo)}>
                  <FontAwesomeIcon icon={faInfoCircle} />
               </button>
            </p>
            {showInfo && (
               <div className={styles.infoSection}>
                  <h2><FontAwesomeIcon icon={faLightbulb} /> What are Challenges?</h2>
                  <p>
                     Challenges are structured learning paths designed to help you achieve specific goals. 
                     By breaking down your learning objectives into daily tasks, challenges make it easier 
                     to stay motivated and track your progress.
                  </p>
                  <h3><FontAwesomeIcon icon={faRocket} /> Why Start a Challenge?</h3>
                  <ul>
                     <li>Build consistent learning habits</li>
                     <li>Stay motivated with daily goals</li>
                     <li>Track your progress visually</li>
                     <li>Achieve your learning objectives faster</li>
                  </ul>
               </div>
            )}
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

         {status === "succeeded" && challenges.length === 0 && (
            <div className={styles.noChallengesmessage}>
               <p>You haven&apos;t created any challenges yet.</p>
               <button className={styles.createFirstButton} onClick={() => setShowCreateModal(true)}>
                  <FontAwesomeIcon icon={faPlus} /> Create Your First Challenge
               </button>
            </div>
         )}

         {status === "succeeded" && challenges.length > 0 && (
            <div className={styles.challengeGrid}>
               {challenges.map((challenge) => (
                  <ChallengeCard 
                     key={challenge.id} 
                     challenge={challenge} 
                     onDelete={() => handleDeleteChallenge(challenge.id)}
                  />
               ))}
            </div>
         )}

         {showCreateModal && <CreateChallengeModal onClose={() => setShowCreateModal(false)} />}
      </div>
   );
};

export default Challenges;
