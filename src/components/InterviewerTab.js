import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Card, Input, Select, Button, Modal, Space, Typography, Tag, Divider } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const InterviewerTab = () => {
  const { candidates } = useSelector(state => state.interview);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredCandidates = candidates
    .filter(candidate => 
      candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'score') return b.finalScore - a.finalScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.startTime) - new Date(a.startTime);
      return 0;
    });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Score',
      dataIndex: 'finalScore',
      key: 'finalScore',
      render: (score) => (
        <Tag color={score >= 7 ? 'green' : score >= 5 ? 'orange' : 'red'}>
          {score}/10
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCandidate(record);
            setModalVisible(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'orange';
      case 'Hard': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div>
      <Card title="Candidate Dashboard" style={{ marginBottom: 20 }}>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Search
            placeholder="Search by name or email"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchText}
            style={{ width: 300 }}
          />
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 200 }}
            size="large"
          >
            <Option value="score">Sort by Score</Option>
            <Option value="name">Sort by Name</Option>
            <Option value="date">Sort by Date</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredCandidates}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Interview Details - ${selectedCandidate?.name}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCandidate && (
          <div>
            <Card type="inner" title="Candidate Information" style={{ marginBottom: 16 }}>
              <Space direction="vertical">
                <Text><strong>Name:</strong> {selectedCandidate.name}</Text>
                <Text><strong>Email:</strong> {selectedCandidate.email}</Text>
                <Text><strong>Phone:</strong> {selectedCandidate.phone}</Text>
                <Text><strong>Final Score:</strong> 
                  <Tag color={selectedCandidate.finalScore >= 7 ? 'green' : selectedCandidate.finalScore >= 5 ? 'orange' : 'red'} style={{ marginLeft: 8 }}>
                    {selectedCandidate.finalScore}/10
                  </Tag>
                </Text>
                <Text><strong>Interview Date:</strong> {new Date(selectedCandidate.startTime).toLocaleString()}</Text>
              </Space>
            </Card>

            <Card type="inner" title="AI Summary" style={{ marginBottom: 16 }}>
              <Text>{selectedCandidate.summary}</Text>
            </Card>

            <Card type="inner" title="Question & Answers">
              {selectedCandidate.questions.map((q, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Title level={5}>Question {index + 1}</Title>
                    <Space>
                      <Tag color={getDifficultyColor(q.difficulty)}>{q.difficulty}</Tag>
                      <Tag color="blue">Score: {q.score}/10</Tag>
                    </Space>
                  </div>
                  <Text strong>{q.text}</Text>
                  <Divider />
                  <Text><strong>Answer:</strong></Text>
                  <div style={{ backgroundColor: '#f5f5f5', padding: 12, borderRadius: 6, marginTop: 8 }}>
                    <Text>{q.answer || 'No answer provided'}</Text>
                  </div>
                  {index < selectedCandidate.questions.length - 1 && <Divider />}
                </div>
              ))}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewerTab;