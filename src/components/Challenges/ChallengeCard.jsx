import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./ChallengeCard.module.css";
import PropTypes from "prop-types";

const ChallengeCard = ({ challenge, onDelete }) => {
   const progress = (challenge.currentDay / challenge.duration) * 100;

   return (
      <div className={styles.challengeCard}>
         <Link to={`/challenges/${challenge.id}`} className={styles.challengeLink}>
            <h2>{challenge.name}</h2>
            <p>{challenge.description}</p>
            <div className={styles.progressBar}>
               <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <p className={styles.progressText}>
               Day {challenge.currentDay} of {challenge.duration}
            </p>
         </Link>
         <button
            onClick={(e) => {
               e.preventDefault();
               onDelete();
            }}
            className={styles.deleteButton}>
            <FontAwesomeIcon icon={faTrash} />
         </button>
      </div>
   );
};

ChallengeCard.propTypes = {
   challenge: PropTypes.object.isRequired,
   onDelete: PropTypes.func.isRequired,
};

export default ChallengeCard;
