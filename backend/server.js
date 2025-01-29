const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();

// Enable CORS
app.use(cors());

// Set your Agora credentials
const APP_ID = '4e719eb97a564dcda1b741cdf8170c5a'; 
const APP_CERTIFICATE = '3a9c46686d384af9bcd904e1210b5697';

const generateToken = (channelName, uid) => {
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 86400; 
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  return RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);
};

app.get('/generate-token', (req, res) => {
  const channelName = req.query.channelName || 'default';
  const uid = parseInt(req.query.uid || '0', 10);

  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required' });
  }

  const token = generateToken(channelName, uid);
  return res.json({ token });
});

app.listen(5000, () => console.log('Server running on port 5000'));
