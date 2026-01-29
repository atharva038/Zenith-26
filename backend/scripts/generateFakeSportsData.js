import mongoose from "mongoose";
import dotenv from "dotenv";
import Registration from "../models/Registration.js";

dotenv.config();

// Sports list
const SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Chess",
  "Carrom",
  "Athletics",
  "Swimming",
  "Kabaddi",
  "Kho-Kho",
  "Hockey",
  "Lawn Tennis",
  "Squash",
];

// Sport details configuration
const SPORT_DETAILS = {
  Cricket: {maxPlayers: 15, minPlayers: 11, category: "Team Sport"},
  Football: {maxPlayers: 16, minPlayers: 11, category: "Team Sport"},
  Basketball: {maxPlayers: 12, minPlayers: 5, category: "Team Sport"},
  Volleyball: {maxPlayers: 12, minPlayers: 6, category: "Team Sport"},
  Badminton: {maxPlayers: 4, minPlayers: 1, category: "Racket Sport"},
  "Table Tennis": {maxPlayers: 4, minPlayers: 1, category: "Racket Sport"},
  Chess: {maxPlayers: 1, minPlayers: 1, category: "Board Game"},
  Carrom: {maxPlayers: 2, minPlayers: 1, category: "Board Game"},
  Athletics: {maxPlayers: 10, minPlayers: 1, category: "Individual Sport"},
  Swimming: {maxPlayers: 8, minPlayers: 1, category: "Individual Sport"},
  Kabaddi: {maxPlayers: 12, minPlayers: 7, category: "Team Sport"},
  "Kho-Kho": {maxPlayers: 12, minPlayers: 9, category: "Team Sport"},
  Hockey: {maxPlayers: 16, minPlayers: 11, category: "Team Sport"},
  "Lawn Tennis": {maxPlayers: 4, minPlayers: 1, category: "Racket Sport"},
  Squash: {maxPlayers: 2, minPlayers: 1, category: "Racket Sport"},
};

// Indian college names
const COLLEGES = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "BITS Pilani",
  "NIT Trichy",
  "NIT Surathkal",
  "IIIT Hyderabad",
  "Delhi University",
  "Mumbai University",
  "Pune University",
  "VIT Vellore",
  "SRM University",
  "Manipal Institute of Technology",
  "COEP Pune",
  "Jadavpur University",
  "Anna University",
  "BHU Varanasi",
  "Amity University",
  "Symbiosis International University",
  "Christ University Bangalore",
  "PSG College of Technology",
  "MIT Manipal",
  "Thapar University",
  "PES University",
  "RV College of Engineering",
  "BMS College of Engineering",
  "DJ Sanghvi College",
  "Sardar Patel College of Engineering",
  "K.J. Somaiya College of Engineering",
  "Veermata Jijabai Technological Institute",
  "Government College of Engineering Pune",
  "Walchand College of Engineering",
  "College of Engineering Pune",
  "Maharashtra Institute of Technology",
  "Vishwakarma Institute of Technology",
  "Pimpri Chinchwad College of Engineering",
  "Sinhgad College of Engineering",
  "Dr. D.Y. Patil College of Engineering",
];

// Indian cities
const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
];

// Sample Indian names
const FIRST_NAMES = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vihaan",
  "Arjun",
  "Sai",
  "Arnav",
  "Ayaan",
  "Krishna",
  "Ishaan",
  "Shaurya",
  "Atharv",
  "Advait",
  "Pranav",
  "Devansh",
  "Ananya",
  "Aadhya",
  "Anika",
  "Diya",
  "Saanvi",
  "Pari",
  "Anvi",
  "Navya",
  "Kiara",
  "Sara",
  "Priya",
  "Riya",
  "Ishita",
  "Tanvi",
  "Kavya",
  "Aryan",
  "Rohan",
  "Karan",
  "Varun",
  "Harsh",
  "Yash",
  "Dhruv",
  "Kunal",
  "Rahul",
  "Amit",
];

const LAST_NAMES = [
  "Sharma",
  "Verma",
  "Patel",
  "Kumar",
  "Singh",
  "Gupta",
  "Reddy",
  "Mehta",
  "Joshi",
  "Rao",
  "Nair",
  "Iyer",
  "Desai",
  "Kulkarni",
  "Pandey",
  "Mishra",
  "Agarwal",
  "Chopra",
  "Malhotra",
  "Kapoor",
  "Shah",
  "Banerjee",
  "Chatterjee",
  "Das",
  "Bose",
  "Sinha",
  "Ghosh",
  "Roy",
  "Pillai",
  "Menon",
];

// Statuses (single unified status)
const STATUSES = ["confirmed", "pending", "cancelled"];

// Sample Cloudinary document URLs (you can replace with actual uploaded samples)
const SAMPLE_DOCUMENTS = {
  permissionLetter: [
    "https://res.cloudinary.com/demo/image/upload/sample_permission_letter.pdf",
    "https://res.cloudinary.com/demo/image/upload/sample_permission_1.jpg",
    "https://res.cloudinary.com/demo/image/upload/sample_permission_2.png",
  ],
  transactionReceipt: [
    "https://res.cloudinary.com/demo/image/upload/sample_receipt_1.jpg",
    "https://res.cloudinary.com/demo/image/upload/sample_receipt_2.png",
    "https://res.cloudinary.com/demo/image/upload/sample_receipt_3.pdf",
  ],
  captainIdCard: [
    "https://res.cloudinary.com/demo/image/upload/sample_id_1.jpg",
    "https://res.cloudinary.com/demo/image/upload/sample_id_2.png",
    "https://res.cloudinary.com/demo/image/upload/sample_id_3.jpg",
  ],
};

// Helper functions
const randomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateEmail = (firstName, lastName, college) => {
  const collegePrefix = college.toLowerCase().replace(/\s+/g, "");
  const random = randomNumber(100, 999);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${random}@${collegePrefix.substring(0, 10)}.edu.in`;
};

const generatePhone = () => {
  const prefixes = ["98", "97", "96", "95", "94", "93", "92", "91", "90", "89"];
  const prefix = randomElement(prefixes);
  const remaining = randomNumber(10000000, 99999999);
  return `${prefix}${remaining}`;
};

const generateRegistrationNumber = (sport, index) => {
  const sportCode = sport.substring(0, 3).toUpperCase();
  const year = "2026";
  const num = String(index).padStart(4, "0");
  return `ZEN-${sportCode}-${year}-${num}`;
};

// Generate players for a team
const generatePlayers = (numPlayers, captainName) => {
  const players = [{name: captainName, year: randomElement([1, 2, 3, 4])}];

  for (let i = 1; i < numPlayers; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    players.push({
      name: `${firstName} ${lastName}`,
      year: randomElement([1, 2, 3, 4]),
    });
  }

  return players;
};

// Generate accommodation details
const generateAccommodation = () => {
  const needsAccommodation = Math.random() > 0.4; // 60% need accommodation
  if (!needsAccommodation) {
    return {needs_accommodation: false};
  }

  const numDays = randomElement([1, 2, 3]);
  return {
    needs_accommodation: true,
    num_days: numDays,
    num_people: randomNumber(1, 8),
    total_accommodation_fee: numDays * 200, // ₹200 per day
  };
};

// Generate fake registration data
const generateFakeRegistration = (sport, index) => {
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const captainName = `${firstName} ${lastName}`;
  const college = randomElement(COLLEGES);
  const city = randomElement(CITIES);
  const email = generateEmail(firstName, lastName, college);
  const phone = generatePhone();

  const sportDetail = SPORT_DETAILS[sport];
  const numPlayers = randomNumber(
    sportDetail.minPlayers,
    sportDetail.maxPlayers
  );
  const players = generatePlayers(numPlayers, captainName);

  const status = randomElement(STATUSES);

  const accommodationData = generateAccommodation();
  const totalFee = 500 + (accommodationData.total_accommodation_fee || 0);

  const formData = {
    sport_name: sport,
    team_name: `${college} ${sport} Team`,
    captain_name: captainName,
    captain_contact: phone,
    email: email,
    institution: college,
    city: city,
    num_players: numPlayers,
    players: players,
    ...accommodationData,
    total_fee: totalFee,
    sportDetails: sportDetail,
  };

  // Random date within last 30 days
  const daysAgo = randomNumber(0, 30);
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);

  return {
    eventId: new mongoose.Types.ObjectId(),
    eventName: sport,
    formData,
    email,
    name: captainName,
    phone,
    institution: college,
    city,
    amount: 500,
    status, // Single unified status
    accommodation: {
      needed: accommodationData.needs_accommodation || false,
      numDays: accommodationData.num_days || 0,
      numPeople: accommodationData.num_people || 0,
      totalFee: accommodationData.total_accommodation_fee || 0,
    },
    documents: {
      permissionLetter: randomElement(SAMPLE_DOCUMENTS.permissionLetter),
      transactionReceipt: randomElement(SAMPLE_DOCUMENTS.transactionReceipt),
      captainIdCard: randomElement(SAMPLE_DOCUMENTS.captainIdCard),
    },
    registrationNumber: generateRegistrationNumber(sport, index),
    confirmationEmailSent: true,
    ipAddress: `192.168.${randomNumber(1, 255)}.${randomNumber(1, 255)}`,
    userAgent: randomElement([
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.0",
      "Mozilla/5.0 (X11; Linux x86_64) Firefox/121.0",
    ]),
    createdAt,
    updatedAt: createdAt,
  };
};

// Main function to generate and insert data
const generateFakeData = async (numRegistrations = 300) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing registrations...");
    await Registration.deleteMany({});
    console.log("✅ Existing data cleared");

    // Generate registrations
    console.log(`🎲 Generating ${numRegistrations} fake registrations...`);

    const registrations = [];
    let globalIndex = 1;

    // Distribute registrations across sports
    const regsPerSport = Math.floor(numRegistrations / SPORTS.length);
    const remainder = numRegistrations % SPORTS.length;

    for (let i = 0; i < SPORTS.length; i++) {
      const sport = SPORTS[i];
      const numRegs = regsPerSport + (i < remainder ? 1 : 0);

      console.log(`  📝 Generating ${numRegs} registrations for ${sport}...`);

      for (let j = 0; j < numRegs; j++) {
        const registration = generateFakeRegistration(sport, globalIndex);
        registrations.push(registration);
        globalIndex++;
      }
    }

    // Insert all registrations
    console.log("💾 Inserting registrations into database...");
    await Registration.insertMany(registrations, {ordered: false});

    console.log(`\n✅ Successfully generated ${registrations.length} fake registrations!`);

    // Print statistics
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: "$eventName",
          count: {$sum: 1},
          confirmed: {
            $sum: {$cond: [{$eq: ["$status", "confirmed"]}, 1, 0]},
          },
          pending: {$sum: {$cond: [{$eq: ["$status", "pending"]}, 1, 0]}},
          cancelled: {
            $sum: {$cond: [{$eq: ["$status", "cancelled"]}, 1, 0]},
          },
        },
      },
      {$sort: {_id: 1}},
    ]);

    console.log("\n📊 Registration Statistics:");
    console.log("─".repeat(70));
    console.log(
      "Sport".padEnd(20),
      "Total".padEnd(10),
      "Confirmed".padEnd(12),
      "Pending".padEnd(12),
      "Cancelled"
    );
    console.log("─".repeat(70));

    stats.forEach((stat) => {
      console.log(
        stat._id.padEnd(20),
        String(stat.count).padEnd(10),
        String(stat.confirmed).padEnd(12),
        String(stat.pending).padEnd(12),
        String(stat.cancelled)
      );
    });

    console.log("─".repeat(70));

    // Overall statistics
    const totalStats = await Registration.aggregate([
      {
        $group: {
          _id: null,
          total: {$sum: 1},
          confirmed: {
            $sum: {$cond: [{$eq: ["$status", "confirmed"]}, 1, 0]},
          },
          pending: {$sum: {$cond: [{$eq: ["$status", "pending"]}, 1, 0]}},
          cancelled: {
            $sum: {$cond: [{$eq: ["$status", "cancelled"]}, 1, 0]},
          },
          needAccommodation: {
            $sum: {$cond: ["$accommodation.needed", 1, 0]},
          },
          totalAccommodationFee: {
            $sum: "$accommodation.totalFee",
          },
        },
      },
    ]);

    if (totalStats.length > 0) {
      const stats = totalStats[0];
      console.log("\n📈 Overall Statistics:");
      console.log(`   Total Registrations: ${stats.total}`);
      console.log(`   Confirmed: ${stats.confirmed}`);
      console.log(`   Pending: ${stats.pending}`);
      console.log(`   Cancelled: ${stats.cancelled}`);
      console.log(`   Need Accommodation: ${stats.needAccommodation}`);
      console.log(`   Total Accommodation Fee: ₹${stats.totalAccommodationFee}`);
    }

    console.log("\n✨ Data generation complete!");
  } catch (error) {
    console.error("❌ Error generating fake data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
};

// Run the script
const numRegistrations = process.argv[2] ? parseInt(process.argv[2]) : 300;

console.log("🚀 Fake Sports Registration Data Generator");
console.log("=" .repeat(70));
console.log(`Generating ${numRegistrations} registrations...\n`);

generateFakeData(numRegistrations)
  .then(() => {
    console.log("\n🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error.message);
    process.exit(1);
  });
