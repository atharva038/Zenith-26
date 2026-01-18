import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Marathon from "../models/Marathon.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Indian first names
const firstNames = [
  "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Arjun", "Pooja",
  "Rohan", "Neha", "Sanjay", "Kavita", "Aditya", "Riya", "Rajesh", "Divya",
  "Karan", "Meera", "Nikhil", "Sakshi", "Harsh", "Ananya", "Varun", "Ishita",
  "Manish", "Shreya", "Akash", "Simran", "Vishal", "Tanvi", "Deepak", "Nisha",
  "Gaurav", "Swati", "Abhishek", "Preeti", "Suresh", "Aarti", "Ajay", "Ritika",
  "Sandeep", "Pallavi", "Kunal", "Megha", "Prakash", "Jyoti", "Naveen", "Shweta",
  "Yogesh", "Rupali", "Manoj", "Komal", "Praveen", "Shilpa", "Ramesh", "Sonali",
  "Ashwin", "Madhuri", "Mohit", "Shruti", "Pankaj", "Shivani", "Ashok", "Seema",
  "Sunil", "Rekha", "Ravi", "Poonam", "Vivek", "Geeta", "Ankit", "Sunita",
  "Siddharth", "Vidya", "Rohit", "Alka", "Sachin", "Usha", "Dinesh", "Shalini",
  "Tarun", "Archana", "Anil", "Vandana", "Nitin", "Chetna", "Rajat", "Nidhi",
  "Piyush", "Sarika", "Chandan", "Varsha", "Lalit", "Manisha", "Sourav", "Priyanka",
  "Vikas", "Nikita", "Kailash", "Manju", "Jayesh", "Deepika", "Hemant", "Suman",
];

// Indian last names
const lastNames = [
  "Sharma", "Kumar", "Singh", "Patel", "Verma", "Gupta", "Joshi", "Reddy",
  "Rao", "Nair", "Menon", "Desai", "Shah", "Mehta", "Kulkarni", "Kapoor",
  "Agarwal", "Mishra", "Pandey", "Tiwari", "Jain", "Bhat", "Iyer", "Shetty",
  "Chauhan", "Rathore", "Thakur", "Yadav", "Saxena", "Malhotra", "Chopra", "Bansal",
  "Mittal", "Sethi", "Arora", "Bose", "Das", "Ghosh", "Sen", "Chatterjee",
  "Mukherjee", "Roy", "Sinha", "Dutta", "Bhatt", "Trivedi", "Pathak", "Dubey",
  "Shukla", "Srivastava", "Pillai", "Krishnan", "Swamy", "Hegde", "Naidu", "Gowda",
];

// Indian colleges
const colleges = [
  "SGGSIE&T Nanded",
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "NIT Trichy",
  "NIT Warangal",
  "BITS Pilani",
  "VIT Vellore",
  "COEP Pune",
  "VJTI Mumbai",
  "Delhi University",
  "Mumbai University",
  "Pune University",
  "Anna University",
  "Osmania University",
  "Jadavpur University",
  "Manipal Institute of Technology",
  "SRM University",
  "Amity University",
  "Symbiosis International University",
  "Christ University Bangalore",
  "Fergusson College Pune",
  "St. Xavier's College Mumbai",
  "Loyola College Chennai",
  "Miranda House Delhi",
  "Engineering College Pune",
  "Government Engineering College",
  "Walchand College of Engineering",
  "College of Engineering Guindy",
  "PSG College of Technology",
];

// T-shirt sizes
const tshirtSizes = ["S", "M", "L", "XL", "XXL"];

// Genders
const genders = ["Male", "Female", "Other"];

// Generate random phone number
const generatePhone = () => {
  const firstDigit = Math.floor(Math.random() * 3) + 7; // 7, 8, or 9
  const rest = Math.floor(Math.random() * 900000000) + 100000000;
  return `${firstDigit}${rest}`;
};

// Generate random email
const generateEmail = (firstName, lastName) => {
  const providers = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const provider = providers[Math.floor(Math.random() * providers.length)];
  const random = Math.floor(Math.random() * 1000);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${random}@${provider}`;
};

// Generate random emergency contact
const generateEmergencyContact = () => {
  const names = firstNames.concat(lastNames);
  const name = `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  return {
    name,
    phone: generatePhone(),
  };
};

// Medical conditions (mostly "None", some random conditions)
const medicalConditions = [
  "None",
  "None",
  "None",
  "None",
  "None",
  "None",
  "None",
  "None",
  "None",
  "None",
  "Asthma",
  "Diabetes",
  "High Blood Pressure",
  "Knee Pain",
  "Back Pain",
];

// Payment statuses
const paymentStatuses = ["confirmed", "confirmed", "confirmed", "confirmed", "pending"];

// Create fake marathon participant
const createFakeParticipant = (index) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  const email = generateEmail(firstName, lastName);
  const phone = generatePhone();
  const age = Math.floor(Math.random() * 45) + 18; // 18-62 years
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const college = colleges[Math.floor(Math.random() * colleges.length)];
  const tshirtSize = tshirtSizes[Math.floor(Math.random() * tshirtSizes.length)];
  const emergencyContact = generateEmergencyContact();
  const medicalCondition = medicalConditions[Math.floor(Math.random() * medicalConditions.length)];
  const status = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
  
  // Random distribution status (30% distributed for confirmed registrations)
  const tshirtDistributed = status === "confirmed" && Math.random() < 0.3;
  const tshirtDistributedAt = tshirtDistributed 
    ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Random time in last 24 hours
    : null;

  // Random registration date in the last 30 days
  const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

  // Generate registration number for ALL participants (even pending ones)
  // This prevents duplicate key errors on null values
  const registrationNumber = `MAR2026${String(index + 1).padStart(4, '0')}`;

  return {
    fullName,
    email,
    phone,
    age,
    gender,
    college,
    tshirtSize,
    emergencyContact,
    medicalConditions: medicalCondition,
    status,
    registrationNumber, // Add registration number for all
    paymentDetails: {
      transactionId: `TXN${Date.now()}${index}`,
      amount: 99,
      paymentDate: createdAt,
      paymentStatus: status === "confirmed" ? "verified" : "pending",
      paymentScreenshot: status === "confirmed" 
        ? "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        : "",
    },
    tshirtDistributed,
    tshirtDistributedBy: null, // Not tracking anymore
    tshirtDistributedAt,
    createdAt,
    updatedAt: createdAt,
  };
};

// Main function
const createFakeMarathonData = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("\n🗑️  Clearing existing marathon data...");
    const deleteResult = await Marathon.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing registrations`);

    console.log("\n👥 Creating 500 fake marathon participants...");
    const participants = [];

    for (let i = 0; i < 500; i++) {
      participants.push(createFakeParticipant(i));
    }

    console.log("💾 Inserting participants into database...");
    const insertedParticipants = await Marathon.insertMany(participants);
    
    console.log(`\n✅ Successfully created ${insertedParticipants.length} fake marathon participants!`);

    // Generate statistics
    const stats = {
      total: insertedParticipants.length,
      confirmed: insertedParticipants.filter(p => p.status === "confirmed").length,
      pending: insertedParticipants.filter(p => p.status === "pending").length,
      tshirtDistributed: insertedParticipants.filter(p => p.tshirtDistributed).length,
      male: insertedParticipants.filter(p => p.gender === "Male").length,
      female: insertedParticipants.filter(p => p.gender === "Female").length,
    };

    console.log("\n📊 Statistics:");
    console.log(`   Total: ${stats.total}`);
    console.log(`   Confirmed: ${stats.confirmed}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   T-shirts Distributed: ${stats.tshirtDistributed}`);
    console.log(`   Male: ${stats.male}`);
    console.log(`   Female: ${stats.female}`);

    console.log("\n🎉 Done! You can now test the T-shirt distribution system.");
    console.log("\n💡 Tip: Visit /tshirt-distribution to see the fake data in action!");

  } catch (error) {
    console.error("❌ Error creating fake data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed");
    process.exit(0);
  }
};

// Run the script
createFakeMarathonData();
