import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFlag, faClock } from "@fortawesome/free-solid-svg-icons";
import styles from "./ChallengeCard.module.css";

import PropTypes from "prop-types";

const ChallengeCard = ({ challenge, onDelete }) => {
   const progress = (challenge.currentDay / challenge.duration) * 100;

   return (
      <div className={styles.challengeCard}>
         <div className={styles.cardHeader}>
            <h2>{challenge.name}</h2>
            <button
               onClick={onDelete}
               className={styles.deleteButton}
               aria-label="Delete challenge"
            >
               <FontAwesomeIcon icon={faTrash} />
            </button>
         </div>
         
         <Link to={`/challenges/${challenge._id}`} className={styles.challengeLink}>
            <p className={styles.description}>{challenge.description}</p>
            <div className={styles.progressSection}>
               <div className={styles.progressBar}>
                  <div 
                     className={styles.progressFill} 
                     style={{ width: `${progress}%` }}
                  >
                     <span className={styles.progressLabel}>{Math.round(progress)}%</span>
                  </div>
               </div>
               <div className={styles.progressInfo}>
                  <span className={styles.daysInfo}>
                     <FontAwesomeIcon icon={faClock} />
                     Day {challenge.currentDay} of {challenge.duration}
                  </span>
                  <span className={styles.status}>
                     <FontAwesomeIcon icon={faFlag} />
                     {progress === 100 ? 'Completed' : 'In Progress'}
                  </span>
               </div>
            </div>
         </Link>
      </div>
   );
};

ChallengeCard.propTypes = {
   challenge: PropTypes.object.isRequired,
   onDelete: PropTypes.func.isRequired,
};

export default ChallengeCard;
