// After connecting to the database and starting Agenda...

// Fetch users in batches
/* 
const batchSize = 100;
let skip = 0;

while (true) {
  const users = await User.find().skip(skip).limit(batchSize);
  
  if (users.length === 0) {
    break;  // Exit loop if no more users
  }

  for (const user of users) {
    const frequency = user.frequencyOfFollowUp || '1 day';
    agenda.every(frequency, 'send sms follow-up', { to: user.phoneNumber, message: 'Your custom message here' }).priority('high');
  }

  skip += batchSize;
}

// Start Agenda
await agenda.start();

*/ 