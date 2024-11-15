import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faArrowLeft,
   faCheck,
   faRocket,
   faInfoCircle,
   faTrophy,
   faFireAlt,
   faExclamationTriangle,
   faClock,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ChallengeDetails.module.css";
import { updateChallenge } from "../../redux/challenges/challengesSlice";
import { updateUserAchievements } from "../../redux/user/userSlice";
import Confetti from "react-confetti";

const ChallengeDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const challenge = useSelector((state) => 
      state.challenges.challenges.find((c) => c._id === id)
   );

   const [taskStatus, setTaskStatus] = useState([]);
   const [currentDay, setCurrentDay] = useState(1);
   const [isDayComplete, setIsDayComplete] = useState(false);
   const [showCelebration, setShowCelebration] = useState(false);
   const [isChallengeDone, setIsChallengeDone] = useState(false);
   const [updateError, setUpdateError] = useState(null);

   useEffect(() => {
      if (challenge) {
         setTaskStatus(new Array(challenge.tasks.length).fill(false));
         
         const isFullyCompleted = challenge.currentDay > challenge.duration;

         const today = new Date();
         today.setHours(0, 0, 0, 0);

         let lastCompletedDate = null;
         if (challenge.lastCompletedAt) {
            lastCompletedDate = new Date(challenge.lastCompletedAt);
            lastCompletedDate.setHours(0, 0, 0, 0);
         }

         const isCompletedToday = lastCompletedDate && lastCompletedDate.getTime() === today.getTime();

         setCurrentDay(challenge.currentDay);
         setIsDayComplete(isCompletedToday);
         setIsChallengeDone(isFullyCompleted);
         setShowCelebration(isFullyCompleted);
      }
   }, [challenge]);

   const handleTaskCheck = (index) => {
      const newTaskStatus = [...taskStatus];
      newTaskStatus[index] = !newTaskStatus[index];
      setTaskStatus(newTaskStatus);
   };

   const allTasksCompleted = taskStatus.every((status) => status);

   const handleCompleteDay = async () => {
      if (!allTasksCompleted) return;

      const newCurrentDay = currentDay + 1;
      const now = new Date().toISOString();

      const updatedChallenge = {
         _id: challenge._id,
         currentDay: newCurrentDay,
         lastCompletedDay: currentDay,
         lastCompletedAt: now
      };

      try {
         const resultAction = await dispatch(updateChallenge(updatedChallenge));
         
         if (updateChallenge.fulfilled.match(resultAction)) {
            if (newCurrentDay > challenge.duration) {
               setIsChallengeDone(true);
               setShowCelebration(true);
               dispatch(updateUserAchievements({
                  type: "challenge",
                  title: `Completed ${challenge.name}`,
                  date: now
               }));
            }
            setCurrentDay(newCurrentDay);
            setIsDayComplete(true);
            setTaskStatus(new Array(challenge.tasks.length).fill(false));
            setUpdateError(null);
         } else {
            setUpdateError("Failed to update challenge progress");
         }
      } catch (err) {
         console.error("Error updating challenge:", err);
         setUpdateError("An unexpected error occurred");
      }
   };

   if (!challenge) {
      return (
         <div className={styles.challengeDetails}>
            <button className={styles.backButton} onClick={() => navigate("/challenges")}>
               <FontAwesomeIcon icon={faArrowLeft} /> Back to Challenges
            </button>
            <div className={styles.challengeCard}>
               <h2>Challenge not found</h2>
               <p>The challenge you're looking for doesn't exist or has been deleted.</p>
            </div>
         </div>
      );
   }

   const renderContent = () => {
      if (isChallengeDone) {
         return (
            <div className={styles.celebrationMessage}>
               <FontAwesomeIcon icon={faTrophy} className={styles.trophyIcon} />
               <h2>Congratulations! You&apos;ve Conquered the Challenge!</h2>
               <p>You&apos;ve successfully completed the {challenge.duration}-day challenge.</p>
               <div className={styles.streakInfo}>
                  <FontAwesomeIcon icon={faFireAlt} />
                  <span>{challenge.duration} Day Streak!</span>
               </div>
               <button onClick={() => navigate("/challenges")} className={styles.newChallengeButton}>
                  Start a New Challenge
               </button>
            </div>
         );
      }

      if (isDayComplete) {
         return (
            <div className={styles.completionMessage}>
               <FontAwesomeIcon icon={faRocket} />
               <h2>Great job! You&apos;ve completed today&apos;s learning.</h2>
               <p>Come back tomorrow to continue your journey.</p>
               <div className={styles.nextDayInfo}>
                  <FontAwesomeIcon icon={faClock} />
                  <span>Next challenge will be available tomorrow</span>
               </div>
               <div className={styles.progressInfo}>
                  <FontAwesomeIcon icon={faFireAlt} />
                  <span>Day {currentDay - 1} of {challenge.duration} completed!</span>
               </div>
            </div>
         );
      }

      return (
         <>
            <div className={styles.progressHeader}>
               <h3>Day {currentDay} of {challenge.duration}</h3>
               <div className={styles.progressBar}>
                  <div 
                     className={styles.progressFill} 
                     style={{ width: `${((currentDay - 1) / challenge.duration) * 100}%` }}
                  />
               </div>
            </div>
            <h3 className={styles.taskListTitle}>Today&apos;s Learning Tasks</h3>
            <ul className={styles.taskList}>
               {challenge.tasks.map((task, index) => (
                  <li key={index} className={styles.taskItem}>
                     <label className={styles.taskLabel}>
                        <input
                           type="checkbox"
                           checked={taskStatus[index] || false}
                           onChange={() => handleTaskCheck(index)}
                           className={styles.taskCheckbox}
                        />
                        <span className={styles.taskText}>{task}</span>
                     </label>
                  </li>
               ))}
            </ul>
            <button
               onClick={handleCompleteDay}
               className={`${styles.completeButton} ${!allTasksCompleted ? styles.disabled : ""}`}
               disabled={!allTasksCompleted}
            >
               <FontAwesomeIcon icon={faCheck} /> Complete Today&apos;s Learning
            </button>
            {!allTasksCompleted && (
               <p className={styles.taskCompletionMessage}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Complete all tasks to achieve today&apos;s goal
               </p>
            )}
         </>
      );
   };

   return (
      <div className={styles.challengeDetails}>
         {showCelebration && <Confetti />}
         <button className={styles.backButton} onClick={() => navigate("/challenges")}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Challenges
         </button>
         <div className={styles.challengeCard}>
            <h2>{challenge.name}</h2>
            <p className={styles.description}>{challenge.description}</p>
            {renderContent()}
         </div>
         {updateError && (
            <div className={styles.errorMessage}>
               <FontAwesomeIcon icon={faExclamationTriangle} /> {updateError}
            </div>
         )}
      </div>
   );
};

export default ChallengeDetails;
