import { useState } from "react";
import styles from "./DeleteAccountModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faExclamationTriangle, faBug, faLightbulb, faComments } from "@fortawesome/free-solid-svg-icons";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import PropTypes from "prop-types";

const DELETION_REASONS = [
   "No longer using the platform",
   "Privacy concerns",
   "Found a better alternative",
   "Too many notifications",
   "Account security concerns",
   "Not satisfied with features",
   "Other",
];

function DeleteAccountModal({ isOpen, onClose, onDelete, onFeatureRequest }) {
   const [selectedReason, setSelectedReason] = useState("");
   const [otherReason, setOtherReason] = useState("");
   const [showFeatureRequestForm, setShowFeatureRequestForm] = useState(false);
   const [featureRequest, setFeatureRequest] = useState("");
   const [showConfirmation, setShowConfirmation] = useState(false);
   const [pendingReason, setPendingReason] = useState("");
   const [feedbackType, setFeedbackType] = useState("");
   const [isDeleting, setIsDeleting] = useState(false);

   const handleSubmit = (e) => {
      e.preventDefault();
      const finalReason = selectedReason === "Other" ? otherReason : selectedReason;
      setPendingReason(finalReason);
      setShowConfirmation(true);
   };

   const handleFeatureRequestSubmit = (e) => {
      e.preventDefault();
      onFeatureRequest(featureRequest);
      onClose();
   };

   const handleConfirmDelete = async () => {
      setIsDeleting(true);
      try {
         await onDelete(pendingReason);
      } catch (error) {
         setIsDeleting(false);
      }
   };

   if (!isOpen) return null;

   return (
      <>
         <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
               <button className={styles.closeButton} onClick={onClose}>
                  <FontAwesomeIcon icon={faTimes} />
               </button>

               {!showFeatureRequestForm ? (
                  <>
                     <div className={styles.warningIcon}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                     </div>
                     <h2 className={styles.title}>We&apos;re sorry to see you go</h2>
                     <p className={styles.subtitle}>Before you delete your account, would you like to:</p>

                     <div className={styles.feedbackOptions}>
                        <button
                           className={styles.feedbackButton}
                           onClick={() => {
                              setShowFeatureRequestForm(true);
                              setFeedbackType("bug");
                           }}>
                           <FontAwesomeIcon icon={faBug} />
                           <div className={styles.textContent}>
                              <span>Report a Bug</span>
                              <small>Help us fix issues</small>
                           </div>
                        </button>

                        <button
                           className={styles.feedbackButton}
                           onClick={() => {
                              setShowFeatureRequestForm(true);
                              setFeedbackType("feature");
                           }}>
                           <FontAwesomeIcon icon={faLightbulb} />
                           <div className={styles.textContent}>
                              <span>Suggest Features</span>
                              <small>Share your ideas</small>
                           </div>
                        </button>

                        <button
                           className={styles.feedbackButton}
                           onClick={() => {
                              setShowFeatureRequestForm(true);
                              setFeedbackType("feedback");
                           }}>
                           <FontAwesomeIcon icon={faComments} />
                           <div className={styles.textContent}>
                              <span>Give Feedback</span>
                              <small>Help us improve</small>
                           </div>
                        </button>
                     </div>

                     <div className={styles.orDivider}>
                        <span>or proceed with</span>
                     </div>

                     <form onSubmit={handleSubmit}>
                        <div className={styles.reasonSelect}>
                           <label>Please tell us why you&apos;re leaving:</label>
                           <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} required>
                              <option value=''>Select a reason</option>
                              {DELETION_REASONS.map((reason) => (
                                 <option key={reason} value={reason}>
                                    {reason}
                                 </option>
                              ))}
                           </select>
                        </div>

                        {selectedReason === "Other" && (
                           <div className={styles.otherReasonInput}>
                              <label>Please specify:</label>
                              <textarea
                                 value={otherReason}
                                 onChange={(e) => setOtherReason(e.target.value)}
                                 required
                                 placeholder='Tell us more...'
                              />
                           </div>
                        )}

                        <div className={styles.buttonGroup}>
                           <button 
                              className={styles.cancelButton}
                              onClick={onClose}
                              disabled={isDeleting}
                           >
                              No, keep my account
                           </button>
                           <button 
                              className={styles.confirmButton}
                              onClick={handleConfirmDelete}
                              disabled={isDeleting}
                           >
                              {isDeleting ? (
                                 <span className={styles.loadingText}>
                                    <span className={styles.spinner}></span>
                                    Processing...
                                 </span>
                              ) : (
                                 'Yes, delete my account'
                              )}
                           </button>
                        </div>
                     </form>
                  </>
               ) : (
                  <div className={styles.featureRequestForm}>
                     <h2>
                        {feedbackType === "bug" && "Report a Bug"}
                        {feedbackType === "feature" && "Suggest an Improvement"}
                        {feedbackType === "feedback" && "Give Feedback"}
                     </h2>
                     <p>We value your input and would love to hear from you:</p>
                     <form onSubmit={handleFeatureRequestSubmit}>
                        <textarea
                           value={featureRequest}
                           onChange={(e) => setFeatureRequest(e.target.value)}
                           required
                           placeholder={
                              feedbackType === "bug"
                                 ? "Please describe the issue you're experiencing..."
                                 : feedbackType === "feature"
                                 ? "What improvement would you like to see?"
                                 : "Tell us what we can do better..."
                           }
                        />
                        <div className={styles.buttonGroup}>
                           <button type='button' onClick={() => setShowFeatureRequestForm(false)}>
                              Back
                           </button>
                           <button type='submit'>Submit Feedback</button>
                        </div>
                     </form>
                  </div>
               )}
            </div>
         </div>
         <DeleteConfirmationModal
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={handleConfirmDelete}
            reason={pendingReason}
         />
      </>
   );
}

DeleteAccountModal.propTypes = {
   isOpen: PropTypes.bool.isRequired,
   onClose: PropTypes.func.isRequired,
   onDelete: PropTypes.func.isRequired,
   onFeatureRequest: PropTypes.func.isRequired,
};

export default DeleteAccountModal;
