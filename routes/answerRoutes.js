const express = require("express");
const {
  getAnswersForQuestion,
  postAnswer,
} = require("../controller/answerController");

const router = express.Router();

// Route to get answers for a specific question by question_id
// ===============================
router.get("/answer/:question_id", getAnswersForQuestion);
router.post("/answer", postAnswer);

module.exports = router;
