import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDropright } from "react-icons/io";
import axiosInstance from "../../API/axios";
import { QuestionContext } from "../../Context/QuestionProvider";
import { UserContext } from "../../Context/UserProvider";
import DOMPurify from "dompurify";
import styles from "./HomePage.module.css";
import { ClipLoader } from "react-spinners";

const Home = () => {
  const token = localStorage.getItem("token");
  const { questions, setQuestions } = useContext(QuestionContext);
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const questionsPerPage = 7;
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("/questions/all-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(response.data.questions);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "No questions available now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [token, setQuestions]);

  const handleEdit = (question_id, e) => {
    e.stopPropagation();
    navigate(`/questions/update/${question_id}`);
  };

  const handleDelete = async (question_id, e) => {
    e.stopPropagation();
    try {
      const user_id = user?.user_id;

      if (!user_id) {
        // console.error("User not logged in.");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this question?"
      );
      // if (!confirmDelete) return;
      if (!confirmDelete) {
        return; // This stops further code execution
      }

      const response = await axiosInstance.delete(
        `/questions/delete/${question_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { user_id, question_id },
        }
      );

      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.question_id !== question_id)
      );
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const filteredQuestions = questions.filter(
    (question) =>
      question.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <div className={styles.homeContainer}>
      <header className={styles.homeHeader}>
        <div className={styles.welcomeUser}>
          <h1>Welcome: {user?.user_name}!</h1>
          <p>Engage, Ask, and Share Knowledge with the Community!</p>
        </div>
        <button
          className={styles.askQuestionBtn}
          onClick={() => navigate("/ask")}
        >
          Ask a Question
        </button>
      </header>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <ClipLoader className={styles.loadingIcon} />
          <p className={styles.loadingMessage}>Loading questions...</p>
        </div>
      )}
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!loading && !error && filteredQuestions.length === 0 && (
        <p className={styles.noQuestionsMessage}>No questions available.</p>
      )}

      {!loading && !error && filteredQuestions.length > 0 && (
        <div className={styles.questionsList}>
          {currentQuestions.map((question) => (
            <div
              key={question.question_id}
              className={styles.cardWrapper}
              id={`question-summary-${question.question_id}`}
              onClick={() => navigate(`/questions/${question.question_id}`)}
            >
              <div className={styles.questionCard}>
                <div className={styles.profileSection}>
                  <FaUserCircle className={styles.profileIcon} />
                  <span className={styles.username}>{question?.user_name}</span>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.contentTitle}>
                    <Link
                      to={`/questions/${question.question_id}`}
                      className={styles.link}
                    >
                      {question.title}
                    </Link>
                  </h3>
                  <div>
                    <div
                      className={styles.descriptionDiv}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          question?.question_description
                        ),
                      }}
                    />
                  </div>

                  <div
                    className={styles.meta}
                    // onClick={() =>
                    //   navigate(`/questions/${question.question_id}`)
                    // }
                  >
                    <div className={styles.metaTags}>
                      <ul className={styles.tagList}>
                        {question?.tags?.map((tag) => (
                          <li key={tag} className={styles.tagItem}>
                            <Link
                              href={`/questions/tagged/${tag}`}
                              className={styles.tag}
                            >
                              {tag}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.userCard} aria-live="polite">
                      <time className={styles.time}>
                        Asked at{" "}
                        <span title={question.created_at}>
                          {new Date(question.createdAt).toLocaleString()}
                        </span>
                      </time>
                    </div>
                    <div className={styles.btnContainer}>
                      {user?.user_id === question.user_id && (
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editBtn}
                            onClick={(e) => handleEdit(question.question_id, e)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={(e) =>
                              handleDelete(question?.question_id, e)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to={`/questions/${question.question_id}`}
                className={styles.arrow}
              >
                <div className={styles.arrowDiv}>
                  <IoIosArrowDropright className={styles.arrowIcon} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredQuestions.length / questionsPerPage)}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              indexOfLastQuestion < filteredQuestions.length ? prev + 1 : prev
            )
          }
          disabled={indexOfLastQuestion >= filteredQuestions.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
