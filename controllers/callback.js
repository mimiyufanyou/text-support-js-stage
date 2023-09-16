// controllers/callback.js

const handleSmsStatusCallback = (req, res) => {
    // Handle the status update here
    const statusUpdate = req.body;
    console.log('Received SMS status update:', statusUpdate);
  
    // Respond with a 200 OK to acknowledge receipt
    res.sendStatus(200);
  };

const receiveSmsController = (req, res) => {
    // Handle the status update here
    const messagePayload = req.body;

    console.log(messagePayload);
  
    // Respond with a 200 OK to acknowledge receipt
    res.sendStatus(200);
  };

  module.exports = {
    handleSmsStatusCallback,
    receiveSmsController,
  };