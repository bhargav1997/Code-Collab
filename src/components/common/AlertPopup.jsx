import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./AlertPopup.module.css";
import PropTypes from "prop-types";

function AlertPopup({ type = "error", message, onClose, isVisible }) {
   if (!isVisible) return null;

   const icons = {
      success: faCheckCircle,
      error: faExclamationCircle,
      info: faInfoCircle,
   };

   return (
      <div className={`${styles.popupContainer} ${styles[type]} ${styles.slideIn}`}>
         <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={icons[type]} />
         </div>
         <div className={styles.messageContainer}>
            <p>{message}</p>
         </div>
         <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
         </button>
      </div>
   );
}

AlertPopup.propTypes = {
   type: PropTypes.oneOf(["success", "error", "info"]),
   message: PropTypes.string,
   onClose: PropTypes.func,
   isVisible: PropTypes.bool,
};

export default AlertPopup;
