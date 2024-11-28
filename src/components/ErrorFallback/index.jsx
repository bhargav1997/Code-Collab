import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug, faHome, faRedo } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorFallback.module.css";
import PropTypes from "prop-types";

function ErrorFallback({ error, resetErrorBoundary }) {
   const navigate = useNavigate();

   return (
      <div className={styles.errorContainer}>
         <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
               <FontAwesomeIcon icon={faBug} bounce />
            </div>

            <h1>Oops! Something went wrong</h1>

            <div className={styles.errorMessage}>
               <p>We're sorry, but we encountered an unexpected error:</p>
               <div className={styles.errorDetails}>
                  <pre>{error.message}</pre>
               </div>
            </div>

            <div className={styles.buttonGroup}>
               <button className={`${styles.actionButton} ${styles.retryButton}`} onClick={resetErrorBoundary}>
                  <FontAwesomeIcon icon={faRedo} />
                  Try Again
               </button>

               <button className={`${styles.actionButton} ${styles.homeButton}`} onClick={() => navigate("/")}>
                  <FontAwesomeIcon icon={faHome} />
                  Go Home
               </button>
            </div>

            <p className={styles.supportText}>If this problem persists, please contact our support team.</p>
         </div>
      </div>
   );
}

ErrorFallback.propTypes = {
   error: PropTypes.object.isRequired,
   resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback;
