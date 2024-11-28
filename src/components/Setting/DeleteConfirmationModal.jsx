import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import styles from "./DeleteConfirmationModal.module.css";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, reason }) {
   if (!isOpen) return null;

   return (
      <div className={styles.confirmOverlay}>
         <div className={styles.confirmContent}>
            <div className={styles.warningIcon}>
               <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>

            <h2>Are you absolutely sure?</h2>

            <div className={styles.warningText}>
               <p>This action cannot be undone immediately. Your account will be:</p>
               <ul>
                  <li>Scheduled for deletion after 30 days</li>
                  <li>Deactivated immediately</li>
                  <li>Logged out from all devices</li>
               </ul>
            </div>

            <div className={styles.reasonBox}>
               <p>Your reason for leaving:</p>
               <div className={styles.reasonText}>{reason}</div>
            </div>

            <div className={styles.buttonGroup}>
               <button className={styles.cancelButton} onClick={onClose}>
                  No, keep my account
               </button>
               <button className={styles.confirmButton} onClick={onConfirm}>
                  Yes, delete my account
               </button>
            </div>
         </div>
      </div>
   );
}

export default DeleteConfirmationModal;
