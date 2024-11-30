import { useEffect, useState, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearError } from "../../redux/user/userSlice";
import LoginAlert from "./LoginAlert";
import styles from "./Login.module.css";
// import TwoFactorAuth from "../TwoFactorAuth/TwoFactorAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { loginUser } from "../../redux/user/userHandle";
import RecoveryLink from "../common/RecoveryLink";

function Login() {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const [showPassword, setShowPassword] = useState(false);
   const { user, error: reduxError } = useSelector((state) => state.user);
   const [alert, setAlert] = useState({
      show: false,
      type: "error",
      message: "",
   });

   const dispatch = useDispatch();
   const navigate = useNavigate();

   useEffect(() => {
      if (user) {
         navigate("/");
      }
   }, [user, navigate]);

   // Add effect to handle Redux errors
   useEffect(() => {
      if (reduxError) {
         showAlert("error", reduxError);
         dispatch(clearError()); // Clear the error after showing it
      }
   }, [reduxError, dispatch]);

   // Helper function to show alerts
   const showAlert = (type, message) => {
      setAlert({
         show: true,
         type,
         message,
      });

      // Auto hide after 3 seconds
      setTimeout(() => {
         setAlert((prev) => ({ ...prev, show: false }));
      }, 3000);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const result = await dispatch(loginUser(formData)).unwrap();

         if (result.requireTwoFactor) {
            navigate("/two-factor-auth", { state: { email: formData.email } });
         } else {
            handleSuccessfulLogin(result);
         }
      } catch (error) {
         // Don't navigate or refresh, just show the error
         showAlert("error", error || "Login failed");
      }
   };

   const handleSuccessfulLogin = (data) => {
      try {
         localStorage.setItem("token", data.token);

         // Wrap state updates in startTransition
         startTransition(() => {
            dispatch(setUser(data.user));
            showAlert("success", "Login successful!");
         });

         // Navigate after a short delay to show the success message
         setTimeout(() => {
            navigate("/");
         }, 1500);
      } catch (error) {
         showAlert("error", error || "An error occurred while processing your login");
      }
   };

   const handleChange = (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
   };

   // console.log("showTwoFactor", showTwoFactor);

   // if (showTwoFactor) {
   //    return <TwoFactorAuth email={formData.email} />;
   // }

   return (
      <div className={styles.loginContainer}>
         <LoginAlert
            type={alert.type}
            message={alert.message}
            isVisible={alert.show}
            onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
         />

         <div className={styles.backgroundWaves}>
            <div className={`${styles.wave} ${styles.wave1}`}></div>
            <div className={`${styles.wave} ${styles.wave2}`}></div>
            <div className={`${styles.wave} ${styles.wave3}`}></div>
            <div className={`${styles.blob} ${styles.blob1}`}></div>
            <div className={`${styles.blob} ${styles.blob2}`}></div>
         </div>

         <div className={styles.loginForm}>
            <div className={styles.welcomeIcon}>
               <FontAwesomeIcon icon={faUser} />
            </div>
            <div className={styles.welcomeText}>
               <h2>Welcome Back!</h2>
               <p>Login to continue your learning journey</p>
            </div>

            <form onSubmit={handleSubmit}>
               <div className={styles.inputGroup}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                  <input
                     type='email'
                     name='email'
                     placeholder='Enter your email'
                     value={formData.email}
                     onChange={handleChange}
                     required
                     autoComplete='email'
                  />
               </div>

               <div className={styles.inputGroup}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  <input
                     type={showPassword ? "text" : "password"}
                     name='password'
                     placeholder='Enter your password'
                     value={formData.password}
                     onChange={handleChange}
                     required
                     autoComplete='current-password'
                  />
                  <button type='button' className={styles.showPasswordButton} onClick={() => setShowPassword(!showPassword)}>
                     <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
               </div>

               <div className={styles.rememberMe}>
                  <input type='checkbox' name='rememberMe' id='rememberMe' checked={formData.rememberMe} onChange={handleChange} />
                  <label htmlFor='rememberMe'>Remember Me</label>
               </div>

               <button type='submit' className={styles.submitButton}>
                  Login
               </button>
            </form>

            <div className={styles.registerLink}>
               Don&apos;t have an account? <Link to='/register'>Register here</Link>
            </div>
            <div className={styles.recoveryLinkContainer}>
               <RecoveryLink />
            </div>
         </div>
      </div>
   );
}

export default Login;
