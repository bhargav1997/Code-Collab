import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash, faCheck, faRocket, faInfoCircle, faTrophy, faFireAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./ChallengeDetails.module.css";
import { updateChallenge, deleteChallenge } from "../../redux/challenges/challengesSlice";
import { updateUserAchievements } from "../../redux/user/userSlice";
import Confetti from "react-confetti";

const ChallengeDetails = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const challenge = useSelector((state) => state.challenges.challenges.find((c) => c.id === parseInt(id)));
   const [currentDay, setCurrentDay] = useState(1);
   const [isDayComplete, setIsDayComplete] = useState(false);
   const [taskStatus, setTaskStatus] = useState([]);
   const [showCelebration, setShowCelebration] = useState(false);
   const [isChallengeDone, setIsChallengeDone] = useState(false);

   useEffect(() => {
      if (challenge) {
         setCurrentDay(challenge.currentDay);
         setIsDayComplete(challenge.currentDay > challenge.lastCompletedDay);
         setTaskStatus(new Array(challenge.tasks.length).fill(false));
         setIsChallengeDone(challenge.currentDay > challenge.duration);
         setShowCelebration(challenge.currentDay > challenge.duration);
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

   const handleCompleteDay = () => {
      if (allTasksCompleted) {
         const newCurrentDay = currentDay + 1;
         const updatedChallenge = {
            ...challenge,
            currentDay: newCurrentDay,
            lastCompletedDay: currentDay,
         };
         dispatch(updateChallenge(updatedChallenge));
         setCurrentDay(newCurrentDay);
         setIsDayComplete(true);
         setTaskStatus(new Array(challenge.tasks.length).fill(false));

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
      }
   };

   const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this challenge?")) {
         dispatch(deleteChallenge(challenge.id))
            .unwrap()
            .then(() => {
               navigate("/challenges");
            })
            .catch((error) => {
               console.error("Failed to delete challenge:", error);
            });
      }
   };

   return (
      <div className={styles.challengeDetails}>
         {showCelebration && <Confetti />}
         <button className={styles.backButton} onClick={() => navigate("/challenges")}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Challenges
         </button>
         <div className={styles.challengeCard}>
            <h1>{challenge.name}</h1>
            <p className={styles.description}>{challenge.description}</p>
            <div className={styles.challengeActions}>
               <button onClick={handleDelete} className={styles.deleteButton}>
                  <FontAwesomeIcon icon={faTrash} /> Delete Challenge
               </button>
            </div>

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
            {!isChallengeDone && isDayComplete && (
               <div className={styles.completionMessage}>
                  <FontAwesomeIcon icon={faRocket} />
                  <h2>Great job! You&apos;ve completed today&apos;s learning.</h2>
                  <p>Come back tomorrow to continue your journey.</p>
               </div>
            )}
            {!isChallengeDone && !isDayComplete && (
               <>
                  <h2 className={styles.taskListTitle}>Today&apos;s Learning Tasks</h2>
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
      </div>
   );
};

export default ChallengeDetails;
