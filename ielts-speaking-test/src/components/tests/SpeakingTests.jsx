import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SpeakingTests = () => {
  // States for speaking tests
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  
  // States for sample questions
  const [sampleQuestions, setSampleQuestions] = useState([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [sampleError, setSampleError] = useState('');
  
  // States for new sample question
  const [newSampleQuestion, setNewSampleQuestion] = useState('');
  const [category, setCategory] = useState('General');
  const [difficulty, setDifficulty] = useState('Medium');
  
  // Toggle between views
  const [activeTab, setActiveTab] = useState('tests'); // 'tests' or 'samples'

  const API_URL = 'http://localhost:5000/api/speaking-tests';
  const SAMPLES_URL = `${API_URL}/sample-questions`;

  // Fetch speaking tests
  const fetchTests = async () => {
    try {
      const res = await axios.get(API_URL);
      setTests(res.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load tests. Is the backend running?');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sample questions
  const fetchSampleQuestions = async () => {
    try {
      const res = await axios.get(SAMPLES_URL);
      setSampleQuestions(res.data.data);
      setSampleError('');
    } catch (err) {
      setSampleError('Failed to load sample questions.');
      console.error('API Error:', err);
    } finally {
      setLoadingSamples(false);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchSampleQuestions();
  }, []);

  // Handle submitting a new speaking test
  const handleSubmitTest = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!question.trim()) {
      setError('Question cannot be empty');
      return;
    }

    try {
      const res = await axios.post(API_URL, {
        question: question,
        user_id: 1 // Default user ID for demo
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Add the new test to the top of the list
      setTests([res.data.data, ...tests]);
      setQuestion('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test');
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  // Handle submitting a new sample question
  const handleSubmitSample = async (e) => {
    e.preventDefault();
    setSampleError('');
    
    if (!newSampleQuestion.trim()) {
      setSampleError('Question text cannot be empty');
      return;
    }

    try {
      const res = await axios.post(SAMPLES_URL, {
        text: newSampleQuestion,
        category: category,
        difficulty: difficulty
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Add the new sample question to the list
      setSampleQuestions([...sampleQuestions, res.data.data]);
      setNewSampleQuestion('');
      setCategory('General');
      setDifficulty('Medium');
    } catch (err) {
      setSampleError(err.response?.data?.message || 'Failed to create sample question');
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  // Delete a speaking test
  const handleDeleteTest = async (testId) => {
    try {
      await axios.delete(`${API_URL}/${testId}`);
      // Remove the deleted test from the list
      setTests(tests.filter(test => test.id !== testId));
    } catch (err) {
      setError('Failed to delete test');
      console.error('Error deleting test:', err);
    }
  };

  // Delete a sample question
  const handleDeleteSample = async (questionId) => {
    try {
      await axios.delete(`${SAMPLES_URL}/${questionId}`);
      // Remove the deleted question from the list
      setSampleQuestions(sampleQuestions.filter(q => q.id !== questionId));
    } catch (err) {
      setSampleError('Failed to delete sample question');
      console.error('Error deleting sample question:', err);
    }
  };

  // Use a sample question as a test
  const useAsSpeakingTest = (text) => {
    setQuestion(text);
    setActiveTab('tests');
  };

  // Styling
  const tabStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    border: '1px solid #ddd',
    borderBottom: 'none',
    borderRadius: '5px 5px 0 0',
    backgroundColor: '#f5f5f5',
    marginRight: '5px'
  };
  
  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: 'white',
    borderBottom: '2px solid white',
    fontWeight: 'bold'
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  };

  const formContainerStyle = {
    margin: '20px 0',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff'
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  const deleteButtonStyle = {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const useButtonStyle = {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  };

  if (loading && loadingSamples) {
    return <div style={containerStyle}>Loading data...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2>IELTS Speaking Tests Platform</h2>
      
      {/* Navigation Tabs */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div 
          style={activeTab === 'tests' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('tests')}
        >
          Speaking Tests
        </div>
        <div 
          style={activeTab === 'samples' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('samples')}
        >
          Sample Questions
        </div>
      </div>
      
      {/* Speaking Tests Tab */}
      {activeTab === 'tests' && (
        <div>
          {error && (
            <div style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px' }}>
              {error}
              {error.includes('backend') && (
                <div>
                  <p>Make sure:</p>
                  <ul>
                    <li>Your Flask backend is running (check terminal)</li>
                    <li>You're using the correct port (usually 5000)</li>
                    <li>There are no CORS errors in browser console</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <div style={formContainerStyle}>
            <h3>Add New Speaking Test</h3>
            <form onSubmit={handleSubmitTest}>
              <div style={{ margin: '10px 0' }}>
                <textarea
                  style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your speaking test question here..."
                  required
                />
              </div>
              <button type="submit" style={buttonStyle}>Submit</button>
            </form>
          </div>

          <div>
            <h3>Test Records</h3>
            {tests.length === 0 ? (
              <p>No tests available</p>
            ) : (
              <div>
                {tests.map(test => (
                  <div key={test.id} style={{ margin: '10px 0', padding: '15px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <h4>Question #{test.id}</h4>
                    <p>{test.question}</p>
                    {test.response && <p><strong>Response:</strong> {test.response}</p>}
                    {test.score && <p><strong>Score:</strong> {test.score}</p>}
                    <p><small>Created: {new Date(test.created_at).toLocaleString('en-US', {
                      timeZone: 'Asia/Kolkata', // IST timezone
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true })}</small></p>
                    <button 
                      onClick={() => handleDeleteTest(test.id)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Sample Questions Tab */}
      {activeTab === 'samples' && (
        <div>
          {sampleError && (
            <div style={{ color: 'red', margin: '10px 0', padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px' }}>
              {sampleError}
            </div>
          )}

          <div style={formContainerStyle}>
            <h3>Add New Sample Question</h3>
            <form onSubmit={handleSubmitSample}>
              <div style={{ margin: '10px 0' }}>
                <textarea
                  style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  value={newSampleQuestion}
                  onChange={(e) => setNewSampleQuestion(e.target.value)}
                  placeholder="Enter sample question text..."
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Category:</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="General">General</option>
                    <option value="Personal">Personal</option>
                    <option value="Education">Education</option>
                    <option value="Work">Work</option>
                    <option value="Technology">Technology</option>
                    <option value="Environment">Environment</option>
                    <option value="Culture">Culture</option>
                    <option value="Health">Health</option>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Urban Life">Urban Life</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Difficulty:</label>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" style={buttonStyle}>Add Sample Question</button>
            </form>
          </div>

          <div>
            <h3>Sample Questions Library</h3>
            {sampleQuestions.length === 0 ? (
              <p>No sample questions available</p>
            ) : (
              <div>
                {sampleQuestions.map((q) => (
                  <div key={q.id} style={{
                    border: '1px solid #e2e8f0',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <h4>Question #{q.id}</h4>
                    <p><strong>Text:</strong> {q.text}</p>
                    <p>
                      <strong>Category:</strong> {q.category} | 
                      <strong> Difficulty:</strong> {q.difficulty}
                    </p>
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        onClick={() => useAsSpeakingTest(q.text)}
                        style={useButtonStyle}
                      >
                        Use as Speaking Test
                      </button>
                      <button 
                        onClick={() => handleDeleteSample(q.id)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingTests;