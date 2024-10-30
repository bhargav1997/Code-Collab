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
   console.log(id);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const challenge = useSelector((state) => state.challenges.challenges.find((c) => c._id === id));
   const [currentDay, setCurrentDay] = useState(1);
   const [isDayComplete, setIsDayComplete] = useState(false);
   const [taskStatus, setTaskStatus] = useState([]);
   const [showCelebration, setShowCelebration] = useState(false);
   const [isChallengeDone, setIsChallengeDone] = useState(false);
   const [updateError, setUpdateError] = useState(null);
   const [canUpdateToday, setCanUpdateToday] = useState(true);

   useEffect(() => {
      if (challenge) {
         setCurrentDay(challenge.currentDay);
         setIsDayComplete(challenge.currentDay > challenge.lastCompletedDay);
         setTaskStatus(new Array(challenge.tasks.length).fill(false));
         setIsChallengeDone(challenge.currentDay > challenge.duration);
         setShowCelebration(challenge.currentDay > challenge.duration);
         
         // Check if user can update today
         const lastUpdateDate = new Date(challenge.updatedAt).toLocaleDateString();
         const todayDate = new Date().toLocaleDateString();
         setCanUpdateToday(lastUpdateDate !== todayDate);
      }
   }, [challenge]);

   if (!challenge) {
      return <div>Challenge not found</div>;
   }

   const handleTaskCheck = (index) => {
      const newTaskStatus = [...taskStatus];
      newTaskStatus[index] = !newTaskStatus[index];
      setTaskStatus(newTaskStatus);
   };

   const allTasksCompleted = taskStatus.every((status) => status);

   console.log("challenge", challenge);
   const handleCompleteDay = async () => {
      if (allTasksCompleted) {
         const newCurrentDay = currentDay + 1;
         const updatedChallenge = {
            ...challenge,
            currentDay: newCurrentDay,
            lastCompletedDay: currentDay,
         };

         try {
            const resultAction = await dispatch(updateChallenge(updatedChallenge));
            if (updateChallenge.fulfilled.match(resultAction)) {
               setCurrentDay(newCurrentDay);
               setIsDayComplete(true);
               setTaskStatus(new Array(challenge.tasks.length).fill(false));
               setUpdateError(null);

               if (newCurrentDay > challenge.duration) {
                  setShowCelebration(true);
                  setIsChallengeDone(true);
                  dispatch(
                     updateUserAchievements({
                        type: "challenge",
                        title: `Completed ${challenge.name}`,
                        date: new Date().toISOString(),
                     }),
                  );
               }
            } else if (updateChallenge.rejected.match(resultAction)) {
               setUpdateError(resultAction.payload || "Failed to update challenge");
            }
         } catch (err) {
            console.log("err", err);
            setUpdateError("An unexpected error occurred");
         }
      }
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

            {isChallengeDone && (
               <div className={styles.celebrationMessage}>
                  <FontAwesomeIcon icon={faTrophy} className={styles.trophyIcon} />
                  <h2>Congratulations! You&apos;ve Conquered the Challenge!</h2>
                  <p>You&apos;ve successfully completed the {challenge.duration}-day challenge. What an achievement!</p>
                  <div className={styles.streakInfo}>
                     <FontAwesomeIcon icon={faFireAlt} />
                     <span>{challenge.duration} Day Streak!</span>
                  </div>
                  <button onClick={() => navigate("/challenges")} className={styles.newChallengeButton}>
                     Start a New Challenge
                  </button>
               </div>
            )}
            {!isChallengeDone && !canUpdateToday && (
               <div className={styles.completionMessage}>
                  <FontAwesomeIcon icon={faRocket} />
                  <h2>Great job! You&apos;ve completed today&apos;s learning.</h2>
                  <p>Come back tomorrow to continue your journey.</p>
                  <div className={styles.nextDayInfo}>
                     <FontAwesomeIcon icon={faClock} />
                     <span>Next challenge will be available tomorrow</span>
                  </div>
               </div>
            )}
            {!isChallengeDone && canUpdateToday && (
               <>
                  <h3 className={styles.taskListTitle}>Today&apos;s Learning Tasks</h3>
                  <ul className={styles.taskList}>
                     {challenge.tasks.map((task, index) => (
                        <li key={index} className={styles.taskItem}>
                           <label className={styles.taskLabel}>
                              <input
                                 type='checkbox'
                                 checked={taskStatus[index]}
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
                     disabled={!allTasksCompleted}>
                     <FontAwesomeIcon icon={faCheck} /> Complete Today&apos;s Learning
                  </button>
                  {!allTasksCompleted && (
                     <p className={styles.taskCompletionMessage}>
                        <FontAwesomeIcon icon={faInfoCircle} /> Complete all tasks to achieve today&apos;s goal
                     </p>
                  )}
               </>
            )}
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
