import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./LoginAlert.module.css";
import PropTypes from "prop-types";

function LoginAlert({ type = "error", message, isVisible, onClose }) {
   if (!isVisible) return null;

   return (
      <div className={`${styles.alertOverlay}`}>
         <div className={`${styles.alertContent} ${styles[type]}`}>
            <div className={styles.iconContainer}>
               <FontAwesomeIcon icon={type === "success" ? faCheckCircle : faExclamationCircle} className={styles.icon} />
            </div>
            <div className={styles.messageContainer}>
               <p>{message}</p>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
               <FontAwesomeIcon icon={faTimes} />
            </button>
         </div>
      </div>
   );
}

LoginAlert.propTypes = {
   type: PropTypes.oneOf(["success", "error"]),
   message: PropTypes.string,
   isVisible: PropTypes.bool,
   onClose: PropTypes.func,
};

export default LoginAlert;
