import express, { Request, Response } from 'express';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Function to read data from JSON file
function readData(): any[] {
  try {
    const data = fs.readFileSync('db.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return []; // Return empty array if error occurs
  }
}

// Function to write data to JSON file
function writeData(data: any[]): void {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Pretty print for readability
    fs.writeFileSync('db.json', jsonData);
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

// Generate a unique ID for new submissions
function generateId(): number {
  const submissions = readData();
  const lastId = submissions.length > 0 ? submissions[submissions.length - 1].id : 0;
  return lastId + 1;
}

// Ping Endpoint (GET /ping)
app.get('/ping', (req: Request, res: Response) => {
  res.json({ success: true });
});

// Submit Endpoint (POST /submit)
app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !stopwatch_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const submissions = readData();
  const newSubmission = {
    id: generateId(),
    name,
    email,
    phone: phone || '', // Optional phone number
    github_link: github_link || '', // Optional github link
    stopwatch_time,
  };

  submissions.push(newSubmission);
  writeData(submissions);

  res.json({ success: true, message: 'Submission saved successfully!' });
});

// Read Endpoint (GET /read)
app.get('/read', (req: Request, res: Response) => {
  const index = Number(req.query.index); // Convert query parameter to number

  if (isNaN(index) || index < 0) {
    return res.status(400).json({ error: 'Invalid index parameter' });
  }

  const submissions = readData();
  const submission = submissions[index];

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json(submission);
    });
    
    // Search by Email Endpoint (GET /search?email=emailaddress)
    app.get('/search', (req: Request, res: Response) => {
    const email = req.query.email?.toString().toLowerCase(); // Get and lowercase email
    
    if (!email) {
    return res.status(400).json({ error: 'Missing email parameter' });
    }
    
    const submissions = readData();
    const filteredSubmissions = submissions.filter((submission) => submission.email.toLowerCase() === email);
    
    if (filteredSubmissions.length === 0) {
    return res.json({ message: 'No submissions found for this email' });
    }
    
    res.json(filteredSubmissions);
    });
    
    app.listen(port, () => {
    console.log(Server listening on port ${port});
    });
