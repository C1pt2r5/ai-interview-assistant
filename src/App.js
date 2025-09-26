import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, Modal } from 'antd';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';
import { setWelcomeBack, resumeInterview } from './store/interviewSlice';

const App = () => {
  const dispatch = useDispatch();
  const { showWelcomeBack, currentCandidate, isInterviewActive } = useSelector(state => state.interview);

  useEffect(() => {
    if (currentCandidate && !isInterviewActive) {
      dispatch(setWelcomeBack(true));
    }
  }, [currentCandidate, isInterviewActive, dispatch]);

  const handleWelcomeBack = () => {
    dispatch(resumeInterview());
  };

  const items = [
    {
      key: '1',
      label: 'Interviewee',
      children: <IntervieweeTab />,
    },
    {
      key: '2',
      label: 'Interviewer Dashboard',
      children: <InterviewerTab />,
    },
  ];

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>AI-Powered Interview Assistant</h1>
      
      <Modal
        title="Welcome Back!"
        open={showWelcomeBack}
        onOk={handleWelcomeBack}
        onCancel={handleWelcomeBack}
        okText="Resume Interview"
        cancelText="Continue Later"
      >
        <p>You have an unfinished interview session. Would you like to resume where you left off?</p>
      </Modal>

      <Tabs defaultActiveKey="1" items={items} size="large" />
    </div>
  );
};

export default App;