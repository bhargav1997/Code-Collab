import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faExclamationTriangle,
   faUndo,
   faClock,
   faExclamationCircle,
   faEnvelope,
   faShieldAlt,
   faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { checkAccountStatus, cancelDeletion } from "../../redux/user/userHandle";
import styles from "./AccountDeletion.module.css";

function AccountDeletion() {
   const [email, setEmail] = useState("");
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { accountStatus, isLoading, error } = useSelector((state) => state.user);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await dispatch(checkAccountStatus({ email })).unwrap();
      } catch (err) {
         console.error("Error checking account status:", err);
      }
   };

   const handleCancelDeletion = async () => {
      try {
         await dispatch(cancelDeletion({ email })).unwrap();
         navigate("/");
      } catch (err) {
         console.error("Error canceling deletion:", err);
      }
   };

   const handleBack = () => {
      dispatch({ type: "user/clearAccountStatus" });
   };

   // Add back button to all states except initial form
   const BackButton = () => (
      <button onClick={handleBack} className={styles.backButton} type='button'>
         <FontAwesomeIcon icon={faArrowLeft} />
         Back to Form
      </button>
   );

   // Show error state - moved before other conditions
   if (error) {
      return (
         <div className={styles.pageContainer}>
            <div className={styles.container}>
               <div className={`${styles.card} ${styles.errorCard}`}>
                  <div className={styles.iconWrapper}>
                     <FontAwesomeIcon icon={faExclamationCircle} className={styles.errorIcon} />
                  </div>
                  <h2>Account Not Found</h2>
                  <p className={styles.errorMessage}>
                     We couldn&apos;t find an account with this email address. Please check and try again.
                  </p>
                  <div className={styles.errorActions}>
                     <button onClick={handleBack} className={styles.errorBackBtn}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back
                     </button>
                     <button className={styles.errorRetryBtn} onClick={() => dispatch(checkAccountStatus({ email }))}>
                        Try Again
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // Show the email check form if no status is available
   if (!accountStatus) {
      return (
         <div className={styles.pageContainer}>
            <div className={styles.container}>
               <div className={styles.card}>
                  <div className={styles.iconWrapper}>
                     <FontAwesomeIcon icon={faShieldAlt} className={styles.shieldIcon} />
                  </div>
                  <h1>Account Recovery</h1>
                  <p className={styles.subtitle}>
                     Enter your email address to check your account status and recover your account if needed.
                  </p>
                  <form onSubmit={handleSubmit} className={styles.form}>
                     <div className={styles.inputGroup}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                        <input
                           type='email'
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder='Enter your email'
                           required
                           className={styles.input}
                        />
                     </div>
                     <button type='submit' className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? (
                           <>
                              <div className={styles.spinnerSmall}></div>
                              Checking...
                           </>
                        ) : (
                           "Check Status"
                        )}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      );
   }

   // Show active account message
   if (!accountStatus.hasPendingDeletion) {
      return (
         <div className={styles.pageContainer}>
            <div className={styles.container}>
               <div className={`${styles.card} ${styles.successCard}`}>
                  <div className={styles.iconWrapper}>
                     <FontAwesomeIcon icon={faShieldAlt} className={styles.successIcon} />
                  </div>
                  <h2>Account Active</h2>
                  <p className={styles.successMessage}>Your account is active and in good standing.</p>
                  <p className={styles.email}>{accountStatus.email}</p>
                  <div className={styles.buttonGroup} style={{ display: "flex", justifyContent: "center" }}>
                     <BackButton />
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // Show deletion status and recovery option
   const { deletionDetails } = accountStatus;
   const deletionDate = new Date(deletionDetails.scheduledDeletionDate);
   const daysRemaining = Math.ceil((deletionDate - new Date()) / (1000 * 60 * 60 * 24));

   return (
      <div className={styles.pageContainer}>
         <div className={styles.container}>
            <div className={`${styles.card} ${styles.warningCard}`}>
               <div className={styles.iconWrapper}>
                  <FontAwesomeIcon icon={faExclamationTriangle} className={styles.warningIcon} />
               </div>

               <h1>Account Pending Deletion</h1>
               <p className={styles.subtitle}>Your account is scheduled for permanent deletion.</p>

               <div className={styles.timerContainer}>
                  <div className={styles.timer}>
                     <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
                     <div className={styles.timerContent}>
                        <span className={styles.days}>{daysRemaining}</span>
                        <span className={styles.daysLabel}>days remaining</span>
                     </div>
                  </div>
               </div>

               <div className={styles.detailsContainer}>
                  <div className={styles.details}>
                     <div className={styles.detailRow}>
                        <span className={styles.label}>Email:</span>
                        <span className={styles.value}>{accountStatus.email}</span>
                     </div>
                     <div className={styles.detailRow}>
                        <span className={styles.label}>Requested:</span>
                        <span className={styles.value}>{new Date(deletionDetails.requestDate).toLocaleDateString()}</span>
                     </div>
                     <div className={styles.detailRow}>
                        <span className={styles.label}>Status:</span>
                        <span className={styles.value}>{accountStatus.accountStatus}</span>
                     </div>
                     <div className={styles.detailRow}>
                        <span className={styles.label}>Reason:</span>
                        <span className={styles.value}>{accountStatus?.deletionDetails?.reason || "No reason provided"}</span>
                     </div>
                  </div>
               </div>

               <div className={styles.deletionActions}>
                  <button onClick={handleBack} className={styles.deletionBackBtn}>
                     <FontAwesomeIcon icon={faArrowLeft} />
                     Back to Form
                  </button>
                  <button className={styles.recoverButton} onClick={handleCancelDeletion} disabled={isLoading}>
                     <FontAwesomeIcon icon={faUndo} />
                     {isLoading ? "Recovering..." : "Recover Account"}
                  </button>
               </div>

               <p className={styles.deletionNote}>
                  Final deletion date: <strong>{new Date(deletionDetails.scheduledDeletionDate).toLocaleDateString()}</strong>
               </p>
            </div>
         </div>
      </div>
   );
}

export default AccountDeletion;
