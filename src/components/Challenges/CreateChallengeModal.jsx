import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faTrash, faMagic, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { createChallenge } from "../../redux/challenges/challengesSlice";
import styles from "./CreateChallengeModal.module.css";
import PropTypes from "prop-types";

const CreateChallengeModal = ({ onClose }) => {
   const dispatch = useDispatch();
   const [challengeData, setChallengeData] = useState({
      name: "",
      description: "",
      duration: "",
      customDuration: "",
      tasks: [""],
   });
   const [currentStep, setCurrentStep] = useState(1);
   const totalSteps = 3;

   const handleAddTask = () => {
      setChallengeData((prev) => ({
         ...prev,
         tasks: [...prev.tasks, ""],
      }));
   };

   const handleRemoveTask = (index) => {
      setChallengeData((prev) => ({
         ...prev,
         tasks: prev.tasks.filter((_, i) => i !== index),
      }));
   };

   const handleTaskChange = (index, value) => {
      const newTasks = [...challengeData.tasks];
      newTasks[index] = value;
      setChallengeData((prev) => ({
         ...prev,
         tasks: newTasks,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const finalData = {
         ...challengeData,
         duration: challengeData.duration === "custom" ? Number(challengeData.customDuration) : Number(challengeData.duration),
         tasks: challengeData.tasks.filter((task) => task.trim() !== ""),
      };

      try {
         await dispatch(createChallenge(finalData)).unwrap();
         onClose();
      } catch (error) {
         console.error("Failed to create challenge:", error);
      }
   };

   const modalVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
   };

   const overlayVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
   };

   const renderStep = () => {
      switch (currentStep) {
         case 1:
            return (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3>Basic Information</h3>
                  <div className={styles.inputGroup}>
                     <label>Challenge Name</label>
                     <input
                        type='text'
                        value={challengeData.name}
                        onChange={(e) =>
                           setChallengeData((prev) => ({
                              ...prev,
                              name: e.target.value,
                           }))
                        }
                        placeholder='Enter challenge name'
                        required
                     />
                  </div>
                  <div className={styles.inputGroup}>
                     <label>Description</label>
                     <textarea
                        value={challengeData.description}
                        onChange={(e) =>
                           setChallengeData((prev) => ({
                              ...prev,
                              description: e.target.value,
                           }))
                        }
                        placeholder='Describe your challenge'
                        required
                     />
                  </div>
               </motion.div>
            );
         case 2:
            return (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3>Duration</h3>
                  <div className={styles.durationOptions}>
                     {[7, 14, 21, 30, "custom"].map((option) => (
                        <motion.button
                           key={option}
                           type='button'
                           className={`${styles.durationOption} ${challengeData.duration === String(option) ? styles.active : ""}`}
                           onClick={() =>
                              setChallengeData((prev) => ({
                                 ...prev,
                                 duration: String(option),
                              }))
                           }
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           {option === "custom" ? (
                              <>
                                 <FontAwesomeIcon icon={faMagic} />
                                 Custom
                              </>
                           ) : (
                              <>
                                 <FontAwesomeIcon icon={faCalendarAlt} />
                                 {option} Days
                              </>
                           )}
                        </motion.button>
                     ))}
                  </div>
                  {challengeData.duration === "custom" && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.inputGroup}>
                        <label>Custom Duration (days)</label>
                        <input
                           type='number'
                           value={challengeData.customDuration}
                           onChange={(e) =>
                              setChallengeData((prev) => ({
                                 ...prev,
                                 customDuration: e.target.value,
                              }))
                           }
                           min='1'
                           required
                        />
                     </motion.div>
                  )}
               </motion.div>
            );
         case 3:
            return (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3>Daily Tasks</h3>
                  <div className={styles.tasksList}>
                     {challengeData.tasks.map((task, index) => (
                        <motion.div
                           key={index}
                           className={styles.taskInput}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}>
                           <input
                              type='text'
                              value={task}
                              onChange={(e) => handleTaskChange(index, e.target.value)}
                              placeholder={`Task ${index + 1}`}
                              required
                           />
                           {challengeData.tasks.length > 1 && (
                              <motion.button
                                 type='button'
                                 onClick={() => handleRemoveTask(index)}
                                 className={styles.removeTask}
                                 whileHover={{ scale: 1.1 }}
                                 whileTap={{ scale: 0.9 }}>
                                 <FontAwesomeIcon icon={faTrash} />
                              </motion.button>
                           )}
                        </motion.div>
                     ))}
                     <motion.button
                        type='button'
                        onClick={handleAddTask}
                        className={styles.addTask}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <FontAwesomeIcon icon={faPlus} />
                        Add Task
                     </motion.button>
                  </div>
               </motion.div>
            );
         default:
            return null;
      }
   };

   return (
      <AnimatePresence>
         <motion.div className={styles.modalOverlay} variants={overlayVariants} initial='hidden' animate='visible' exit='hidden'>
            <motion.div className={styles.modal} variants={modalVariants} initial='hidden' animate='visible' exit='hidden'>
               <button className={styles.closeButton} onClick={onClose}>
                  <FontAwesomeIcon icon={faTimes} />
               </button>

               <div className={styles.modalHeader}>
                  <h2>Create New Challenge</h2>
                  <div className={styles.stepIndicator}>
                     {Array.from({ length: totalSteps }).map((_, index) => (
                        <motion.div
                           key={index}
                           className={`${styles.step} ${currentStep > index ? styles.completed : ""} ${
                              currentStep === index + 1 ? styles.active : ""
                           }`}
                           whileHover={{ scale: 1.1 }}
                           onClick={() => setCurrentStep(index + 1)}
                        />
                     ))}
                  </div>
               </div>

               <form onSubmit={handleSubmit}>
                  <div className={styles.modalContent}>{renderStep()}</div>

                  <div className={styles.modalFooter}>
                     {currentStep > 1 && (
                        <motion.button
                           type='button'
                           onClick={() => setCurrentStep((prev) => prev - 1)}
                           className={styles.secondaryButton}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           Back
                        </motion.button>
                     )}
                     {currentStep < totalSteps ? (
                        <motion.button
                           type='button'
                           onClick={() => setCurrentStep((prev) => prev + 1)}
                           className={styles.primaryButton}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           Next
                        </motion.button>
                     ) : (
                        <motion.button
                           type='submit'
                           className={styles.primaryButton}
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           Create Challenge
                        </motion.button>
                     )}
                  </div>
               </form>
            </motion.div>
         </motion.div>
      </AnimatePresence>
   );
};

CreateChallengeModal.propTypes = {
   onClose: PropTypes.func.isRequired,
};

export default CreateChallengeModal;
