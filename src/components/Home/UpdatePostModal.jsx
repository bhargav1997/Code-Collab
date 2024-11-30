import { memo } from "react";
import styles from "./UpdatePostModal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faGraduationCap, faLightbulb, faTag, faSave, faTimes, faImage } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const UpdatePostModal = ({
   handleCancel,
   handleSave,
   editedCategory,
   setEditedCategory,
   setEditedContent,
   setCurrentTag,
   handleAddTag,
   editedTags,
   handleRemoveTag,
   editedTitle,
   setEditedTitle,
   editedImage,
   setEditedImage,
   handleImageUpload,
   currentTag,
   editedContent,
}) => {
   return (
      <div className={styles.modalOverlay} onClick={handleCancel}>
         <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
               <h2>Edit Post</h2>
               <button className={styles.closeBtn} onClick={handleCancel}>
                  <FontAwesomeIcon icon={faTimes} />
               </button>
            </div>

            <div className={styles.modalBody}>
               <div className={styles.categorySelector}>
                  <button
                     className={`${styles.categoryBtn} ${editedCategory === "tech" ? styles.active : ""}`}
                     onClick={() => setEditedCategory("tech")}>
                     <FontAwesomeIcon icon={faCode} /> Tech
                  </button>
                  <button
                     className={`${styles.categoryBtn} ${editedCategory === "education" ? styles.active : ""}`}
                     onClick={() => setEditedCategory("education")}>
                     <FontAwesomeIcon icon={faGraduationCap} /> Education
                  </button>
                  <button
                     className={`${styles.categoryBtn} ${editedCategory === "innovation" ? styles.active : ""}`}
                     onClick={() => setEditedCategory("innovation")}>
                     <FontAwesomeIcon icon={faLightbulb} /> Innovation
                  </button>
               </div>

               <div className={styles.inputGroup}>
                  <input
                     type='text'
                     value={editedTitle}
                     onChange={(e) => setEditedTitle(e.target.value)}
                     className={styles.editTitleInput}
                     placeholder='Enter post title'
                  />
               </div>

               <div className={styles.inputGroup}>
                  <textarea
                     value={editedContent}
                     onChange={(e) => setEditedContent(e.target.value)}
                     className={styles.editContentInput}
                     placeholder='Share your knowledge, insights, or questions...'
                  />
               </div>

               <div className={styles.inputGroup}>
                  <div className={styles.postTags}>
                     <input
                        type='text'
                        placeholder='Add tags'
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                     />
                     <button onClick={handleAddTag}>
                        {" "}
                        <FontAwesomeIcon icon={faTag} className={styles.tagIcon} /> Add Tag
                     </button>
                  </div>

                  <div className={styles.tagsContainer}>
                     {editedTags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                           {tag}
                           <button onClick={() => handleRemoveTag(tag)}>×</button>
                        </span>
                     ))}
                  </div>
               </div>

               <div className={styles.inputGroup}>
                  <div className={styles.imageUpload}>
                     <FontAwesomeIcon icon={faImage} className={styles.imageIcon} />
                     <input
                        type='text'
                        placeholder='Enter image URL'
                        value={editedImage || ""}
                        onChange={handleImageUpload}
                        className={styles.imageUrlInput}
                     />
                  </div>

                  {editedImage && (
                     <div className={styles.imagePreview}>
                        <img src={editedImage} alt='Post preview' />
                        <button onClick={() => setEditedImage(null)} className={styles.removeImageBtn}>
                           <FontAwesomeIcon icon={faTimes} /> Remove
                        </button>
                     </div>
                  )}
               </div>
            </div>

            <div className={styles.modalFooter}>
               <button onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
               </button>
               <button onClick={handleSave} className={styles.saveBtn}>
                  <FontAwesomeIcon icon={faSave} /> Save Changes
               </button>
            </div>
         </div>
      </div>
   );
};

UpdatePostModal.propTypes = {
   handleCancel: PropTypes.func.isRequired,
   handleSave: PropTypes.func.isRequired,
   editedCategory: PropTypes.string.isRequired,
   setEditedCategory: PropTypes.func.isRequired,
   setEditedContent: PropTypes.func.isRequired,
   setCurrentTag: PropTypes.func.isRequired,
   handleAddTag: PropTypes.func.isRequired,
   editedTags: PropTypes.array.isRequired,
   handleRemoveTag: PropTypes.func.isRequired,
   editedTitle: PropTypes.string.isRequired,
   setEditedTitle: PropTypes.func.isRequired,
   editedImage: PropTypes.string,
   setEditedImage: PropTypes.func.isRequired,
   handleImageUpload: PropTypes.func.isRequired,
   currentTag: PropTypes.string.isRequired,
   editedContent: PropTypes.string.isRequired,
};

export default memo(UpdatePostModal);
