# AI-Powered Interview Assistant

A React application that provides an AI-powered interview experience with candidate management dashboard.

## Features

### Interviewee Tab (Chat Interface)
- **Resume Upload**: Support for PDF and DOCX files
- **Field Extraction**: Automatically extracts Name, Email, Phone from resume
- **Missing Field Collection**: Chatbot prompts for any missing information
- **Timed Interview**: 6 questions with progressive difficulty
  - 2 Easy questions (20s each)
  - 2 Medium questions (60s each) 
  - 2 Hard questions (120s each)
- **Auto-submission**: Questions auto-submit when time expires
- **Real-time Progress**: Visual progress bar and timer

### Interviewer Tab (Dashboard)
- **Candidate List**: All candidates sorted by score
- **Search & Filter**: Search by name/email, sort by score/name/date
- **Detailed View**: Complete interview history for each candidate
- **AI Summary**: Automated performance summary for each candidate

### Data Persistence
- **Local Storage**: All data persists across browser sessions
- **Welcome Back Modal**: Resume interrupted interviews
- **State Management**: Redux with redux-persist

## Installation

```bash
npm install
npm start
```

## Tech Stack

- **Frontend**: React 18, Ant Design
- **State Management**: Redux Toolkit, Redux Persist
- **Document Processing**: pdf-parse, mammoth
- **Storage**: Local Storage via redux-persist

## Usage

1. **Start Interview**: Upload resume (PDF/DOCX) in Interviewee tab
2. **Complete Info**: Fill any missing fields (name, email, phone)
3. **Take Interview**: Answer 6 timed questions progressively
4. **View Results**: Check dashboard in Interviewer tab
5. **Review Details**: Click "View Details" for complete interview history

## File Structure

```
src/
├── components/
│   ├── IntervieweeTab.js    # Candidate interview interface
│   └── InterviewerTab.js    # Dashboard for viewing candidates
├── store/
│   ├── store.js            # Redux store configuration
│   └── interviewSlice.js   # Interview state management
├── utils/
│   └── resumeParser.js     # PDF/DOCX parsing utilities
└── App.js                  # Main application component
```

## Key Features Implementation

- **Resume Parsing**: Extracts contact info using regex patterns
- **Timer System**: Real-time countdown with auto-submission
- **Score Calculation**: AI-simulated scoring (1-10 per question)
- **Persistence**: Complete state restoration on app reload
- **Responsive UI**: Clean, professional interface using Ant Design