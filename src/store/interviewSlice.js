import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  currentCandidate: null,
  currentQuestion: 0,
  timeLeft: 0,
  isInterviewActive: false,
  showWelcomeBack: false,
};

const questions = [
  { difficulty: 'Easy', time: 20, text: 'What is the difference between let, const, and var in JavaScript?' },
  { difficulty: 'Easy', time: 20, text: 'Explain the concept of React components and their types.' },
  { difficulty: 'Medium', time: 60, text: 'How does React\'s virtual DOM work and what are its benefits?' },
  { difficulty: 'Medium', time: 60, text: 'Explain the difference between SQL and NoSQL databases with examples.' },
  { difficulty: 'Hard', time: 120, text: 'Design a scalable REST API for a social media platform. Explain your architecture choices.' },
  { difficulty: 'Hard', time: 120, text: 'How would you optimize a React application for performance? Discuss specific techniques.' },
];

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview: (state, action) => {
      const candidate = {
        id: Date.now(),
        ...action.payload,
        startTime: new Date().toISOString(),
        questions: questions.map(q => ({ ...q, answer: '', score: 0 })),
        finalScore: 0,
        summary: '',
        status: 'in-progress',
      };
      state.candidates.push(candidate);
      state.currentCandidate = candidate.id;
      state.currentQuestion = 0;
      state.timeLeft = questions[0].time;
      state.isInterviewActive = true;
    },
    submitAnswer: (state, action) => {
      const candidate = state.candidates.find(c => c.id === state.currentCandidate);
      if (candidate) {
        candidate.questions[state.currentQuestion].answer = action.payload.answer;
        candidate.questions[state.currentQuestion].score = action.payload.score || Math.floor(Math.random() * 10) + 1;
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestion < questions.length - 1) {
        state.currentQuestion += 1;
        state.timeLeft = questions[state.currentQuestion].time;
      } else {
        state.isInterviewActive = false;
        const candidate = state.candidates.find(c => c.id === state.currentCandidate);
        if (candidate) {
          candidate.finalScore = Math.round(candidate.questions.reduce((sum, q) => sum + q.score, 0) / questions.length);
          candidate.summary = `Candidate completed the interview with an average score of ${candidate.finalScore}/10. ${candidate.finalScore >= 7 ? 'Strong performance across all areas.' : candidate.finalScore >= 5 ? 'Moderate performance with room for improvement.' : 'Needs significant improvement in technical skills.'}`;
          candidate.status = 'completed';
          candidate.endTime = new Date().toISOString();
        }
        state.currentCandidate = null;
      }
    },
    updateTimer: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    pauseInterview: (state) => {
      state.isInterviewActive = false;
    },
    resumeInterview: (state) => {
      state.isInterviewActive = true;
      state.showWelcomeBack = false;
    },
    setWelcomeBack: (state, action) => {
      state.showWelcomeBack = action.payload;
    },
    updateCandidateInfo: (state, action) => {
      const candidate = state.candidates.find(c => c.id === state.currentCandidate);
      if (candidate) {
        Object.assign(candidate, action.payload);
      }
    },
  },
});

export const {
  startInterview,
  submitAnswer,
  nextQuestion,
  updateTimer,
  pauseInterview,
  resumeInterview,
  setWelcomeBack,
  updateCandidateInfo,
} = interviewSlice.actions;

export default interviewSlice.reducer;