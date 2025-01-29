import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';

// Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const ProposalForm = () => {
    const [isChatbotOpen, setChatbotOpen] = useState(false);
  const [userData, setUserData] = useState({
    companyName: '',
    businessProblem: '',
    businessSolution: '',
    targetMarket: '',
    revenueModel: '',
    financialGoal: '',
  });

  const [proposal, setProposal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/generate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.businessmodel) {
        setProposal(data.businessmodel);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sendEmail = async () => {
    try {
      const emailData = {
        to: 'riddhijlalla@gmail.com',
        subject: `Business Proposal - ${userData.companyName}`,
        userData: { ...userData },
        proposalContent: proposal,
      };

      const response = await fetch('http://localhost:8000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      alert('Email sent successfully!');
    } catch (error) {
      alert('Failed to send email. Please try again later.');
    }
  };

  const handleAccept = async () => {
    const acceptanceData = { proposalContent: proposal, email: userData.companyName };
    try {
      const response = await fetch('http://localhost:8000/api/accept-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acceptanceData),
      });

      if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
      
      await sendEmail();
      closeModal();
    } catch (error) {
      alert('Failed to accept proposal.');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/reject-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalContent: proposal, email: userData.companyName }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);

      alert('Proposal rejected successfully!');
      closeModal();
    } catch (error) {
      alert('Failed to reject proposal.');
    }
  };

  const toggleChatbot = () => {
    setChatbotOpen(prev => !prev);
  };

  return (
  <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-100 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      
      <motion.button
  onClick={toggleChatbot} // Ensure this matches the defined function name
  className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-blue shadow-lg flex items-center justify-center"
>
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm---jredlxQ7mtXDJdDqfZfo2rfODxDKILA&s" alt="Logo" className="w-8 h-8" />
</motion.button>
        

      {/* Chatbot Display */}
      {isChatbotOpen && (
        <iframe
        src="https://cdn.botpress.cloud/webchat/v2/shareable.html?botId=449a32c1-1043-4f6e-b520-f7d52860f92d"
        title="Chatbot"
        className="fixed bottom-0 right-0 w-80 h-80 border-0 rounded-lg shadow-md"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'transform 0.3s ease',
          zIndex: 1000,
          backgroundColor: 'transparent', // Set background color to transparent
        }}
      />
      )}

      {/* Form Card */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Create Your Proposal
        </h2>
        <div className="space-y-4">
          <motion.input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            variants={itemVariants}
          />
          <motion.input
            type="text"
            name="businessProblem"
            placeholder="Business Problem"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            variants={itemVariants}
          />
          <motion.input
            type="text"
            name="businessSolution"
            placeholder="Business Solution"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            variants={itemVariants}
          />
          <motion.input
            type="text"
            name="targetMarket"
            placeholder="Target Market"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            variants={itemVariants}
          />
          <motion.input
            type="text"
            name="revenueModel"
            placeholder="Revenue Model"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            variants={itemVariants}
          />
          <motion.input
            type="text"
            name="financialGoal"
            placeholder="Financial Goal"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            variants={itemVariants}
          />
        </div>
        <motion.button
          type="submit"
          className="w-full mt-8 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Submit
        </motion.button>
      </motion.form>

      {/* Modal Section */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Generated Proposal
            </h3>
            <div className="overflow-y-auto max-h-96">
              <Markdown>{proposal}</Markdown>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ×
            </button>
            <div className="flex justify-between mt-4">
              <motion.button
                onClick={handleAccept}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Edit
              </motion.button>
              <motion.button
                onClick={closeModal}
                className="bg-grey-500 text-white px-4 py-2 rounded-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Close
              </motion.button>
              <motion.button
                onClick={sendEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Send Proposal
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProposalForm;
