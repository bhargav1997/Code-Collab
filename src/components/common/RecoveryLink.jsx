import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import styles from './RecoveryLink.module.css';

function RecoveryLink() {
   return (
      <Link to="/account-recovery" className={styles.recoveryLink}>
         <FontAwesomeIcon icon={faUndo} className={styles.icon} />
         Recover Deleted Account
      </Link>
   );
}

export default RecoveryLink;