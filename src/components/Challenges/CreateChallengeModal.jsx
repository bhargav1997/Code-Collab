import { useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import styles from "./CreateChallengeModal.module.css";
import { createChallenge } from "../../redux/challenges/challengesSlice";
import PropTypes from "prop-types";

const durationOptions = [
   { value: 5, label: "5 days" },
   { value: 10, label: "10 days" },
   { value: 15, label: "15 days" },
   { value: 30, label: "30 days" },
   { value: "other", label: "Custom" },
];

const CreateChallengeModal = ({ onClose }) => {
   const dispatch = useDispatch();
   const [challengeData, setChallengeData] = useState({
      name: "",
      description: "",
      duration: "",
      tasks: [""],
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setChallengeData((prev) => ({ ...prev, [name]: value }));
   };

   const handleDurationChange = (e) => {
      const value = e.target.value;
      if (value === "other") {
         setChallengeData(prev => ({
            ...prev,
            duration: "",
            customDuration: ""
         }));
      } else {
         setChallengeData(prev => ({
            ...prev,
            duration: Number(value),
            customDuration: ""
         }));
      }
   };

   const handleTaskChange = (index, value) => {
      const newTasks = [...challengeData.tasks];
      newTasks[index] = value;
      setChallengeData((prev) => ({ ...prev, tasks: newTasks }));
   };

   const addTask = () => {
      setChallengeData((prev) => ({ ...prev, tasks: [...prev.tasks, ""] }));
   };

   const removeTask = (index) => {
      const newTasks = challengeData.tasks.filter((_, i) => i !== index);
      setChallengeData((prev) => ({ ...prev, tasks: newTasks }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      
      // Format challenge data according to backend requirements
      const finalData = {
         name: challengeData.name.trim(),
         description: challengeData.description.trim(),
         duration: challengeData.duration || Number(challengeData.customDuration),
         tasks: challengeData.tasks.filter(task => task.trim() !== "")
      };

      dispatch(createChallenge(finalData))
         .unwrap()
         .then(() => {
            onClose();
         })
         .catch((error) => {
            console.error("Failed to create challenge:", error);
            // Handle error (you might want to show an error message to the user)
         });
   };

   return (
      <div className={styles.modalOverlay}>
         <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={onClose}>
               <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className={styles.modalTitle}>Create New Challenge</h2>
            <form onSubmit={handleSubmit}>
               <div className={styles.formGroup}>
                  <label htmlFor='name'>Challenge Name</label>
                  <input
                     type='text'
                     id='name'
                     name='name'
                     value={challengeData.name}
                     onChange={handleInputChange}
                     placeholder='Enter challenge name'
                     required
                  />
               </div>
               <div className={styles.formGroup}>
                  <label htmlFor='description'>Description</label>
                  <textarea
                     id='description'
                     name='description'
                     value={challengeData.description}
                     onChange={handleInputChange}
                     placeholder='Describe your challenge'
                     required
                  />
               </div>
               <div className={styles.formGroup}>
                  <label htmlFor='duration'>Duration</label>
                  <select 
                     id='duration' 
                     name='duration' 
                     value={challengeData.duration || "other"} 
                     onChange={handleDurationChange} 
                     required={!challengeData.customDuration}
                  >
                     <option value=''>Select duration</option>
                     {durationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
                  {(!challengeData.duration || challengeData.duration === "") && (
                     <input
                        type='number'
                        name='customDuration'
                        value={challengeData.customDuration}
                        onChange={(e) => setChallengeData(prev => ({
                           ...prev,
                           customDuration: e.target.value
                        }))}
                        className={styles.customDuration}
                        placeholder='Enter custom duration (days)'
                        min='1'
                        required={!challengeData.duration}
                     />
                  )}
               </div>
               <div className={styles.formGroup}>
                  <label>Tasks</label>
                  {challengeData.tasks.map((task, index) => (
                     <div key={index} className={styles.taskInput}>
                        <input
                           type='text'
                           value={task}
                           onChange={(e) => handleTaskChange(index, e.target.value)}
                           placeholder={`Task ${index + 1}`}
                           required
                        />
                        {index > 0 && (
                           <button type='button' onClick={() => removeTask(index)} className={styles.removeTaskButton}>
                              <FontAwesomeIcon icon={faMinus} />
                           </button>
                        )}
                     </div>
                  ))}
                  <button type='button' onClick={addTask} className={styles.addTaskButton}>
                     <FontAwesomeIcon icon={faPlus} /> Add Task
                  </button>
               </div>
               <button type='submit' className={styles.submitButton}>
                  Create Challenge
               </button>
            </form>
         </div>
      </div>
   );
};

CreateChallengeModal.propTypes = {
   onClose: PropTypes.func.isRequired,
};

export default CreateChallengeModal;
