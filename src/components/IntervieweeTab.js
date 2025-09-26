import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, Button, Input, Card, Progress, Typography, Space, message } from 'antd';
import { InboxOutlined, SendOutlined } from '@ant-design/icons';
import { parseResume } from '../utils/resumeParser';
import { startInterview, submitAnswer, nextQuestion, updateTimer } from '../store/interviewSlice';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Title, Text } = Typography;

const IntervieweeTab = () => {
  const dispatch = useDispatch();
  const { currentCandidate, currentQuestion, timeLeft, isInterviewActive, candidates } = useSelector(state => state.interview);
  
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', phone: '' });
  const [currentAnswer, setCurrentAnswer] = useState('');

  const [step, setStep] = useState('upload'); // upload, info, interview, completed

  const candidate = candidates.find(c => c.id === currentCandidate);
  const currentQ = candidate?.questions[currentQuestion];

  useEffect(() => {
    let timer;
    if (isInterviewActive && timeLeft > 0) {
      timer = setInterval(() => {
        dispatch(updateTimer());
      }, 1000);
    } else if (isInterviewActive && timeLeft === 0) {
      handleSubmitAnswer();
    }
    return () => clearInterval(timer);
  }, [isInterviewActive, timeLeft, dispatch]);

  const handleResumeUpload = async (file) => {
    try {
      const extractedInfo = await parseResume(file);
      setCandidateInfo(extractedInfo);
      
      const missing = [];
      if (!extractedInfo.name) missing.push('name');
      if (!extractedInfo.email) missing.push('email');
      if (!extractedInfo.phone) missing.push('phone');
      

      setStep(missing.length > 0 ? 'info' : 'interview');
      
      if (missing.length === 0) {
        dispatch(startInterview(extractedInfo));
      }
      
      message.success('Resume uploaded successfully!');
    } catch (error) {
      message.error(error.message);
    }
    return false;
  };

  const handleInfoSubmit = () => {
    const missing = [];
    if (!candidateInfo.name) missing.push('name');
    if (!candidateInfo.email) missing.push('email');
    if (!candidateInfo.phone) missing.push('phone');
    
    if (missing.length > 0) {
      message.error(`Please provide: ${missing.join(', ')}`);
      return;
    }
    
    dispatch(startInterview(candidateInfo));
    setStep('interview');
  };

  const handleSubmitAnswer = () => {
    dispatch(submitAnswer({ answer: currentAnswer, score: Math.floor(Math.random() * 10) + 1 }));
    setCurrentAnswer('');
    dispatch(nextQuestion());
    
    if (currentQuestion >= 5) {
      setStep('completed');
    }
  };

  const uploadProps = {
    name: 'resume',
    multiple: false,
    accept: '.pdf,.docx',
    beforeUpload: handleResumeUpload,
    showUploadList: false,
  };

  if (step === 'upload') {
    return (
      <Card title="Upload Your Resume" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag resume to upload</p>
          <p className="ant-upload-hint">Support PDF and DOCX formats only</p>
        </Dragger>
      </Card>
    );
  }

  if (step === 'info') {
    return (
      <Card title="Complete Your Information" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Full Name"
            value={candidateInfo.name}
            onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
          />
          <Input
            placeholder="Email Address"
            value={candidateInfo.email}
            onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
          />
          <Input
            placeholder="Phone Number"
            value={candidateInfo.phone}
            onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
          />
          <Button type="primary" onClick={handleInfoSubmit} block>
            Start Interview
          </Button>
        </Space>
      </Card>
    );
  }

  if (step === 'interview' && currentQ) {
    return (
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>Question {currentQuestion + 1} of 6</Title>
            <Text strong style={{ color: timeLeft <= 10 ? '#ff4d4f' : '#1890ff' }}>
              Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Text>
          </div>
          
          <Progress 
            percent={((currentQuestion + 1) / 6) * 100} 
            status={timeLeft <= 10 ? 'exception' : 'active'}
          />
          
          <Card type="inner">
            <Text strong>Difficulty: {currentQ.difficulty}</Text>
            <Title level={5} style={{ marginTop: 10 }}>{currentQ.text}</Title>
          </Card>
          
          <TextArea
            rows={6}
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
          />
          
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim()}
            block
          >
            Submit Answer
          </Button>
        </Space>
      </Card>
    );
  }

  if (step === 'completed' && candidate) {
    return (
      <Card title="Interview Completed!" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
          <Title level={2}>Thank you, {candidate.name}!</Title>
          <Text>Your interview has been completed successfully.</Text>
          <Title level={3}>Final Score: {candidate.finalScore}/10</Title>
          <Text>{candidate.summary}</Text>
          <Button type="primary" onClick={() => setStep('upload')}>
            Start New Interview
          </Button>
        </Space>
      </Card>
    );
  }

  return null;
};

export default IntervieweeTab;