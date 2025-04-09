import React from "react";
import styles from "./HowItWorks.module.css"; // Import CSS module
import {
  FaUserPlus,
  FaSignInAlt,
  FaQuestion,
  FaReply,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";

function HowItWorks() {
  return (
    <div className={styles.how_it_works}>
      <h2 className={styles.how_it_works__title}>How It Works</h2>
      <p className={styles.how_it_works__intro_text}>
        Our platform allows users to ask and answer programming-related
        questions. You can also edit or delete your own posts. Here’s how it
        works:
      </p>

      <div className={styles.how_it_works__steps}>
        <div className={styles.how_it_works__step}>
          <FaUserPlus className={styles.how_it_works__step_icon} />
          <h3 className={styles.how_it_works__step_title}>1. Register</h3>
          <p className={styles.how_it_works__step_description}>
            Create an account by providing your name, username, email, and
            password. Ensure your username and email are unique.
          </p>
        </div>

        <div className={styles.how_it_works__step}>
          <FaSignInAlt className={styles.how_it_works__step_icon} />
          <h3 className={styles.how_it_works__step_title}>2. Sign In</h3>
          <p className={styles.how_it_works__step_description}>
            If you're already a member, log in using your email and password to
            access your account.
          </p>
        </div>

        <div className={styles.how_it_works__step}>
          <FaQuestion className={styles.how_it_works__step_icon} />
          <h3 className={styles.how_it_works__step_title}>3. Post Questions</h3>
          <p className={styles.how_it_works__step_description}>
            Once logged in, go to the Ask Question page to post your question.
            Provide a clear title and a detailed explanation for better
            responses.
          </p>
        </div>

        <div className={styles.how_it_works__step}>
          <FaReply className={styles.how_it_works__step_icon} />
          <h3 className={styles.how_it_works__step_title}>
            4. Answer Questions
          </h3>
          <p className={styles.how_it_works__step_description}>
            Browse through questions posted by other users and share your
            expertise by answering them.
          </p>
        </div>

        <div className={styles.how_it_works__step}>
          <FaEdit className={styles.how_it_works__step_icon} />
          <h3 className={styles.how_it_works__step_title}>
            5. Edit Your Posts
          </h3>
          <p className={styles.how_it_works__step_description}>
            Need to change something? You can edit your own questions and
            answers anytime to improve clarity or update information.
          </p>
        </div>

        <div className={styles.how_it_works__step}>
          <FaTrash className={styles.how_it_works__step_icon} />
          <h3 className={styles.how_it_works__step_title}>
            6. Delete Your Posts
          </h3>
          <p className={styles.how_it_works__step_description}>
            If you want to remove your question or answer, you can delete it
            permanently from your account.
          </p>
        </div>

        <div className={styles.how_it_works__step}>
          <FaEye className={styles.how_it_works__step_icon} />
          <h3 className={styles.how_it_works__step_title}>
            7. Explore and Learn
          </h3>
          <p className={styles.how_it_works__step_description}>
            Browse through questions, learn from answers, and contribute to the
            community to grow your knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
