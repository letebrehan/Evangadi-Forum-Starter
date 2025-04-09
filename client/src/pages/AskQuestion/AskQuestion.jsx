import { useForm } from "react-hook-form";
import { IoMdArrowRoundForward } from "react-icons/io";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import styles from "./AskQuestion.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import axiosInstance from "../../API/axios";
import { IoIosArrowDropright } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
function AskQuestion() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();
  const [user, setUser] = useContext(UserContext);
  const token = localStorage.getItem("token");

  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null); // Use a ref for Quill instance

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
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

      quillInstance.current.root.style.color = "#000"; // Ensure text is visible
    }
  }, []);

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

  const handleClick = async (data) => {
    let description = quillInstance.current.root.innerHTML.trim(); // Use quillInstance to get content
    if (!description) {
      alert("Question description is required.");
      return;
    }
    description = sanitizeContent(description);
    const question_id = uuidv4();
    setLoading(true);
    try {
      await axiosInstance.post(
        "/questions/post-question",
        {
          title: data.title,
          question_description: description,
          user_id: user.user_id,
          question_id: question_id,
          tag: data.tag,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessful(true);
      reset();
      if (quillInstance.current) quillInstance.current.root.innerHTML = "";
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to post your question. Please try again later.";
      setError("server", { type: "manual", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    "Summarize your problem in a one-line title.",
    "Describe your problem in more detail.",
    "Describe what you tried and what you expected to happen.",
    "Review your question and post it to the site.",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.steps}>
        <h2 className={styles.heading}>Steps to write a good question</h2>
        <ul className={styles.stepList}>
          {steps.map((step, index) => (
            <li key={index} className={styles.stepItem}>
              <IoMdArrowRoundForward /> {step}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.askQuestion}>
        <h2 className={styles.heading}>Ask a public question</h2>
        {successful && (
          <Link to="/home">
            <div className={styles.successMessage}>
              <small className={styles.successText}>
                Question posted successfully. Click Here to redirect to Question
                Page...
              </small>
              <IoIosArrowDropright color="green" size={25} />
            </div>
          </Link>
        )}

        <form onSubmit={handleSubmit(handleClick)} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Tag"
              className={`${styles.input} ${errors.tag ? styles.invalid : ""}`}
              {...register("tag")}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              className={`${styles.input} ${
                errors.title ? styles.invalid : ""
              }`}
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Question Description</label>
            <div className={styles.editorContainer}>
              <div className={styles.toolbar}></div>
              <div ref={quillRef} className={styles.editor}></div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.postQuestion}
            disabled={loading}
          >
            {loading ? <>Posting...</> : <>Post Your Question</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AskQuestion;
