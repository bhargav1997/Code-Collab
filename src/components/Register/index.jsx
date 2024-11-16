import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import LoadingSpinner from "../LoadingSpinner";
import { CONFIG } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faUser,
   faEnvelope,
   faLock,
   faEye,
   faEyeSlash,
   faGraduationCap,
   faBook,
   faTrophy,
   faUsers,
   faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function Register() {
   const API_URL = CONFIG.API_URL;
   const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [fieldErrors, setFieldErrors] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const navigate = useNavigate();

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmitOnRegistration = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         toast.error("Passwords don't match!");
         return;
      }

      setIsLoading(true);
      setFieldErrors({
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
      });

      try {
         console.log("Sending request to:", `${API_URL}/users/initiate-registration`);
         const response = await fetch(`${API_URL}/users/initiate-registration`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               username: formData.username,
               email: formData.email,
               password: formData.password,
            }),
         });

         const data = await response.json();
         console.log("Server response:", data);

         if (response.ok) {
            console.log("Validation successful, proceeding to two-factor auth");
            navigate("/two-factor-auth", {
               state: { email: formData.email, isRegistration: true, username: formData.username, password: formData.password },
            });
         } else {
            if (data.field && data.message) {
               setFieldErrors((prevErrors) => ({ ...prevErrors, [data.field]: data.message }));
               // toast.error(data.message);
            } else if (data.message) {
               toast.error(data.message);
            } else {
               toast.error("Registration initiation failed");
            }
         }
      } catch (error) {
         console.error("Registration initiation error:", error);
         toast.error("An error occurred during registration initiation. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   if (isLoading) {
      return <LoadingSpinner />;
   }

   return (
      <div className={styles.registerContainer}>
         <div className={styles.backgroundWaves}>
            <div className={`${styles.wave} ${styles.wave1}`}></div>
            <div className={`${styles.wave} ${styles.wave2}`}></div>
            <div className={`${styles.wave} ${styles.wave3}`}></div>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
         </div>

         <div className={styles.registerForm}>
            <div className={styles.formContent}>
               <div className={styles.welcomeIcon}>
                  <FontAwesomeIcon icon={faGraduationCap} />
               </div>
               <div className={styles.welcomeText}>
                  <h2>Welcome to LearnHub</h2>
                  <p>Start your learning journey today</p>
               </div>

               <form onSubmit={handleSubmitOnRegistration}>
                  <div className={styles.inputGroup}>
                     <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
                     <input
                        type='text'
                        name='username'
                        placeholder='Enter your username'
                        value={formData.username}
                        onChange={handleChange}
                     />
                  </div>

                  <div className={styles.inputGroup}>
                     <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                     <input type='email' name='email' placeholder='Enter your email' value={formData.email} onChange={handleChange} />
                  </div>

                  <div className={styles.inputGroup}>
                     <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                     <input
                        type={showPassword ? "text" : "password"}
                        name='password'
                        placeholder='Create password'
                        value={formData.password}
                        onChange={handleChange}
                     />
                     <button type='button' className={styles.showPasswordButton} onClick={() => setShowPassword(!showPassword)}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                     </button>
                  </div>

                  <div className={styles.inputGroup}>
                     <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                     <input
                        type={showConfirmPassword ? "text" : "password"}
                        name='confirmPassword'
                        placeholder='Confirm password'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                     />
                     <button
                        type='button'
                        className={styles.showPasswordButton}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                     </button>
                  </div>

                  <button type='submit' className={styles.submitButton}>
                     Create Account
                  </button>
               </form>

               <div className={styles.loginLink}>
                  Already have an account? <Link to='/login'>Sign in</Link>
               </div>
            </div>

            <div className={styles.appDescription}>
               <h3>Why Choose LearnHub?</h3>

               <div className={styles.featureCard}>
                  <FontAwesomeIcon icon={faRocket} className={styles.featureIcon} />
                  <div className={styles.featureTitle}>Personalized Learning</div>
                  <div className={styles.featureText}>Adaptive learning paths tailored to your pace and style</div>
               </div>

               <div className={styles.featureCard}>
                  <FontAwesomeIcon icon={faBook} className={styles.featureIcon} />
                  <div className={styles.featureTitle}>Expert-Curated Content</div>
                  <div className={styles.featureText}>Quality content created by industry professionals</div>
               </div>

               <div className={styles.featureCard}>
                  <FontAwesomeIcon icon={faTrophy} className={styles.featureIcon} />
                  <div className={styles.featureTitle}>Achievement System</div>
                  <div className={styles.featureText}>Earn certificates and track your progress</div>
               </div>

               <div className={styles.featureCard}>
                  <FontAwesomeIcon icon={faUsers} className={styles.featureIcon} />
                  <div className={styles.featureTitle}>Community Support</div>
                  <div className={styles.featureText}>Connect with peers and mentors for better learning</div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Register;
