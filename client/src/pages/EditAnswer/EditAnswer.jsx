import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axios";
import styles from "./EditAnswer.module.css";
import { UserContext } from "../../Context/UserProvider";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import Quill from "quill";

function EditAnswer() {
  const { answer_id } = useParams();
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [originalContent, setOriginalContent] = useState(""); // Store initial content
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const response = await axiosInstance.get(`/answer/${answer_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sanitizedContent = DOMPurify.sanitize(response.data.answer.answer);
        setEditorContent(sanitizedContent);
        setOriginalContent(sanitizedContent);
        setLoading(false);
      } catch (err) {
        setError("Failed to load answer data.");
        setLoading(false);
      }
    };

    fetchAnswer();
  }, [answer_id, token]);

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ color: [] }, { background: [] }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillInstance.current.root.innerHTML = editorContent;

      quillInstance.current.on("text-change", () => {
        setEditorContent(
          DOMPurify.sanitize(quillInstance.current.root.innerHTML)
        );
      });
    }
  }, [editorContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/answer/update/${answer_id}`,
        { answer: editorContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(-1); // Go back after successful update
    } catch (err) {
      console.log(err.message);
      setError("Failed to update answer.");
    }
  };

  const handleDiscard = () => {
    setEditorContent(originalContent); // Restore original content
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = originalContent;
    }
    navigate(-1);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Edit Answer</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Description (Preview)</label>
          <div
            className={styles.previewBox}
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
          <div ref={quillRef} className={styles["quill-editor"]}></div>
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
          <button
            type="button"
            className={styles.discardButton}
            onClick={handleDiscard}
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAnswer;
