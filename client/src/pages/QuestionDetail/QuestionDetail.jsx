import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserContext } from "../../Context/UserProvider";
import axiosInstance from "../../API/axios";
import styles from "./QuestionDetail.module.css";
import { QuestionContext } from "../../Context/QuestionProvider";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { FaUserCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

function QuestionDetail() {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const token = localStorage.getItem("token");
  const [user, setUser] = useContext(UserContext);

  const { questions, setQuestions } = useContext(QuestionContext);
  const { question_id } = useParams();
  const [answer, setAnswer] = useState([]);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getAns = async () => {
      setLoading(true);
      try {
        const answers = await axiosInstance.get(`/answers/${question_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnswer(answers.data.answers);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };

    if (token) {
      getAns();
    }
  }, [token, question_id]); // Added question_id as a dependency

  // Fetch question if not available in context
  const selectedQuestion = questions.find(
    (question) => question.question_id === question_id
  );

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!selectedQuestion) {
        try {
          setLoading(true);
          const questionResponse = await axiosInstance.get(
            `/questions/${question_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            questionResponse.data.question,
          ]);
          setLoading(false);
        } catch (error) {
          console.error("Error:", error.message);
          // Display a user-friendly message
          alert(
            "Something went wrong while fetching the question. Please try again later."
          );
          setLoading(false);
        }
      }
    };

    fetchQuestion();
  }, [selectedQuestion, question_id, setQuestions, token]);

  useEffect(() => {
    if (!loading && quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, false] }], // Headers
            [{ font: [] }], // Font selection
            [{ list: "ordered" }, { list: "bullet" }], // Ordered & Bullet lists
            ["bold", "italic", "underline", "strike"], // Text styling
            [{ color: [] }, { background: [] }], // Text color & highlight
            [{ align: [] }], // Text alignment
            ["blockquote", "code-block"], // Blockquote & Code block
            ["link", "image", "video"], // Links, Images, Video
            [{ script: "sub" }, { script: "super" }], // Subscript & Superscript
            [{ indent: "-1" }, { indent: "+1" }], // Indent
            [{ direction: "rtl" }], // Right-to-left text
            ["clean"], // Remove formatting
          ],
        },
      });

      // Ensure that text is visible
      // quillInstance.current.root.style.color = "#000";
      // const quillRoot = quillInstance.current.root;
      // quillRoot.style.color = "red"; // Set default text color
      // quillRoot.style.backgroundColor = '#eab5af'; // Set default background color
    }
  }, [loading]);

  const sanitizeContent = (content) =>
    DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "b",
        "i",
        "u",
        "a",
        "img",
        "p",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "code",
        "pre",
        "blockquote",
        "strong",
        "em",
        "hr",
        "br",
        "sub",
        "sup",
        "mark",
        "video",
        "iframe",
        "span",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "style"],
    });

  const clickFunc = async (e) => {
    try {
      setLoading(true);
      let answer = quillInstance.current?.root.innerHTML.trim();

      if (!answer) {
        alert("Answer description is required.");
        setLoading(false);
        return;
      }

      answer = sanitizeContent(answer);

      if (!question_id || !user?.user_id) {
        // console.error("Missing required data:", { question_id, user });
        setLoading(false);
        return;
      }

      // Send answer
      await axiosInstance.post(
        `/answer/${question_id}`,
        {
          answer: answer,
          user_id: user.user_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch updated answers
      const ans = await axiosInstance.get(`/answers/${question_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswer(ans.data.answers);
      setValue("answer", ""); // Clear form input
      setLoading(false);

      // Reset Quill editor content
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = "";
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  const handleEdit = (answer_id) => {
    navigate(`/answer/update/${answer_id}`);
  };

  const handleDelete = async (answer_id, e) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      setLoading(true);
      const user_id = user?.user_id;

      if (!user_id) {
        // console.error("User not logged in.");
        setLoading(false);
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this answer?"
      );
      if (!confirmDelete) {
        setLoading(false);
        return;
      }

      const response = await axiosInstance.delete(
        `/answer/delete/${answer_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { user_id, answer_id },
        }
      );


      setAnswer((prevAnswers) =>
        prevAnswers.filter((answer) => answer.answer_id !== answer_id)
      );
      setLoading(false);
    } catch (err) {
      console.error("Error deleting answer:", err.message);
      setLoading(false);
    }
  };

  const question =
    selectedQuestion || questions.find((q) => q.question_id === question_id);

  return (
    <>
      <div className={styles.outerDiv}>
        <div className={styles.questionCard}>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Question</h4>
            <h5 className={styles.cardSubtitle}>{question?.title}</h5>
            {/* <p>{question?.question_description}</p> */}
            <div
              className={styles.questDiv}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question?.question_description),
              }}
            />

            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(question?.answer),
              }}
            />
          </div>
        </div>
        <div className={styles.answersCard}>
          <div className={styles.cardBody}>
            <h4 className={styles.cardTitle}>Answers From The Community</h4>
          </div>
        </div>
        {loading ? (
          <div className={styles.loaderContainer}>
            <ClipLoader size={50} color="#36d7b7" />
          </div>
        ) : answer.length === 0 ? (
          <div className={styles.answerFormCard}>
            <h4 className={styles.cardTitle}>No answers yet</h4>
            <p className={styles.cardSubtitle}>
              Be the first to answer this question!
            </p>
          </div>
        ) : (
          answer.map((singleAnswer, index) => (
            <div className={styles.answerCard} key={index}>
              <div className={styles.answerBody}>
                <div className={styles.userInfo}>
                  <div className={styles.userIconDiv}>
                    <FaUserCircle size={35} className={styles.profileIcon} />
                    <p className={styles.username}>{singleAnswer.user_name}</p>
                  </div>
                  <div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(singleAnswer?.answer),
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.btnContainer}>
                {user?.user_id === singleAnswer?.user_id && (
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(singleAnswer.answer_id)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => handleDelete(singleAnswer?.answer_id, e)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div className={styles.answerFormCard}>
          <form onSubmit={handleSubmit(clickFunc)}>
            <div className={styles.formGroup}>
              <div
                ref={quillRef}
                style={{
                  display: loading ? "none" : "block",
                  backgroundColor: "#cccccc",
                  color: "red",
                }}
              ></div>
              {errors.answer && (
                <div className={styles.errorMessage}>
                  {errors.answer.message}
                </div>
              )}
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <>Post Your Answer</>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default QuestionDetail;
