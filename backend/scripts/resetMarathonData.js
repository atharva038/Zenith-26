import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const Marathon = mongoose.model(
  "Marathon",
  new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    age: Number,
    gender: String,
    college: String,
    tshirtSize: String,
    emergencyContact: {
      name: String,
      phone: String,
    },
    medicalConditions: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentDetails: {
      transactionId: String,
      amount: Number,
      paymentDate: Date,
      paymentScreenshot: String,
    },
    registrationNumber: String,
    tshirtDistributed: Boolean,
    tshirtDistributedBy: String,
    tshirtDistributedAt: Date,
  }, { timestamps: true })
);

const sampleData = [
  // PENDING REGISTRATIONS (10)
  {
    fullName: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "9876543210",
    age: 22,
    gender: "Male",
    college: "MIT College of Engineering",
    tshirtSize: "L",
    emergencyContact: {
      name: "Priya Sharma",
      phone: "9876543211"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN123456789",
      amount: 99,
      paymentDate: new Date("2026-01-15"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Priya Patel",
    email: "priya.patel@gmail.com",
    phone: "9876543220",
    age: 21,
    gender: "Female",
    college: "Fergusson College",
    tshirtSize: "M",
    emergencyContact: {
      name: "Amit Patel",
      phone: "9876543221"
    },
    medicalConditions: "Asthma (mild)",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN987654321",
      amount: 99,
      paymentDate: new Date("2026-01-16"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Arjun Desai",
    email: "arjun.desai@gmail.com",
    phone: "9876543230",
    age: 24,
    gender: "Male",
    college: "COEP Technological University",
    tshirtSize: "XL",
    emergencyContact: {
      name: "Sneha Desai",
      phone: "9876543231"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN456789123",
      amount: 99,
      paymentDate: new Date("2026-01-17"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Sneha Kulkarni",
    email: "sneha.kulkarni@gmail.com",
    phone: "9876543240",
    age: 20,
    gender: "Female",
    college: "Symbiosis Institute of Technology",
    tshirtSize: "S",
    emergencyContact: {
      name: "Rajesh Kulkarni",
      phone: "9876543241"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN789123456",
      amount: 99,
      paymentDate: new Date("2026-01-17"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    phone: "9876543250",
    age: 23,
    gender: "Male",
    college: "VIT Pune",
    tshirtSize: "L",
    emergencyContact: {
      name: "Kavita Singh",
      phone: "9876543251"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN321654987",
      amount: 99,
      paymentDate: new Date("2026-01-18"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Ananya Reddy",
    email: "ananya.reddy@gmail.com",
    phone: "9876543260",
    age: 22,
    gender: "Female",
    college: "PICT Pune",
    tshirtSize: "M",
    emergencyContact: {
      name: "Suresh Reddy",
      phone: "9876543261"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN654987321",
      amount: 99,
      paymentDate: new Date("2026-01-18"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Karan Mehta",
    email: "karan.mehta@gmail.com",
    phone: "9876543270",
    age: 25,
    gender: "Male",
    college: "MIT World Peace University",
    tshirtSize: "XXL",
    emergencyContact: {
      name: "Neha Mehta",
      phone: "9876543271"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN147258369",
      amount: 99,
      paymentDate: new Date("2026-01-18"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Pooja Joshi",
    email: "pooja.joshi@gmail.com",
    phone: "9876543280",
    age: 21,
    gender: "Female",
    college: "Savitribai Phule Pune University",
    tshirtSize: "S",
    emergencyContact: {
      name: "Mahesh Joshi",
      phone: "9876543281"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN369258147",
      amount: 99,
      paymentDate: new Date("2026-01-18"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Aditya Gupta",
    email: "aditya.gupta@gmail.com",
    phone: "9876543290",
    age: 24,
    gender: "Male",
    college: "Symbiosis College of Arts & Commerce",
    tshirtSize: "L",
    emergencyContact: {
      name: "Ritu Gupta",
      phone: "9876543291"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN852963741",
      amount: 99,
      paymentDate: new Date("2026-01-18"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },
  {
    fullName: "Divya Nair",
    email: "divya.nair@gmail.com",
    phone: "9876543300",
    age: 20,
    gender: "Female",
    college: "Sinhgad College of Engineering",
    tshirtSize: "M",
    emergencyContact: {
      name: "Ramesh Nair",
      phone: "9876543301"
    },
    medicalConditions: "None",
    status: "pending",
    paymentDetails: {
      transactionId: "TXN741852963",
      amount: 99,
      paymentDate: new Date("2026-01-19"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FFA500/FFFFFF?text=Payment+Screenshot"
    }
  },

  // CONFIRMED REGISTRATIONS (8)
  {
    fullName: "Rohan Verma",
    email: "rohan.verma@gmail.com",
    phone: "9876543310",
    age: 23,
    gender: "Male",
    college: "IIT Bombay",
    tshirtSize: "L",
    emergencyContact: {
      name: "Anjali Verma",
      phone: "9876543311"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN111222333",
      amount: 99,
      paymentDate: new Date("2026-01-10"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    }
  },
  {
    fullName: "Meera Shah",
    email: "meera.shah@gmail.com",
    phone: "9876543320",
    age: 22,
    gender: "Female",
    college: "VJTI Mumbai",
    tshirtSize: "M",
    emergencyContact: {
      name: "Kiran Shah",
      phone: "9876543321"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN444555666",
      amount: 99,
      paymentDate: new Date("2026-01-11"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    }
  },
  {
    fullName: "Siddharth Rao",
    email: "siddharth.rao@gmail.com",
    phone: "9876543330",
    age: 25,
    gender: "Male",
    college: "NIT Warangal",
    tshirtSize: "XL",
    emergencyContact: {
      name: "Lakshmi Rao",
      phone: "9876543331"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN777888999",
      amount: 99,
      paymentDate: new Date("2026-01-12"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    }
  },
  {
    fullName: "Kavya Iyer",
    email: "kavya.iyer@gmail.com",
    phone: "9876543340",
    age: 21,
    gender: "Female",
    college: "Anna University",
    tshirtSize: "S",
    emergencyContact: {
      name: "Venkat Iyer",
      phone: "9876543341"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN101112131",
      amount: 99,
      paymentDate: new Date("2026-01-13"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    }
  },
  {
    fullName: "Aryan Kapoor",
    email: "aryan.kapoor@gmail.com",
    phone: "9876543350",
    age: 24,
    gender: "Male",
    college: "Delhi University",
    tshirtSize: "L",
    emergencyContact: {
      name: "Sonia Kapoor",
      phone: "9876543351"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN141516171",
      amount: 99,
      paymentDate: new Date("2026-01-14"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    },
    tshirtDistributed: true,
    tshirtDistributedBy: "Admin",
    tshirtDistributedAt: new Date("2026-01-19T10:00:00")
  },
  {
    fullName: "Ishita Bansal",
    email: "ishita.bansal@gmail.com",
    phone: "9876543360",
    age: 20,
    gender: "Female",
    college: "Manipal Institute of Technology",
    tshirtSize: "M",
    emergencyContact: {
      name: "Rajiv Bansal",
      phone: "9876543361"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN181920212",
      amount: 99,
      paymentDate: new Date("2026-01-14"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    },
    tshirtDistributed: true,
    tshirtDistributedBy: "Admin",
    tshirtDistributedAt: new Date("2026-01-19T10:15:00")
  },
  {
    fullName: "Harsh Malhotra",
    email: "harsh.malhotra@gmail.com",
    phone: "9876543370",
    age: 23,
    gender: "Male",
    college: "Birla Institute of Technology",
    tshirtSize: "XXL",
    emergencyContact: {
      name: "Geeta Malhotra",
      phone: "9876543371"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN222324252",
      amount: 99,
      paymentDate: new Date("2026-01-15"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    }
  },
  {
    fullName: "Tanvi Chatterjee",
    email: "tanvi.chatterjee@gmail.com",
    phone: "9876543380",
    age: 22,
    gender: "Female",
    college: "Jadavpur University",
    tshirtSize: "S",
    emergencyContact: {
      name: "Subhash Chatterjee",
      phone: "9876543381"
    },
    medicalConditions: "None",
    status: "confirmed",
    paymentDetails: {
      transactionId: "TXN262728293",
      amount: 99,
      paymentDate: new Date("2026-01-15"),
      paymentScreenshot: "https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Verified+Payment"
    }
  },

  // CANCELLED REGISTRATIONS (3)
  {
    fullName: "Nikhil Saxena",
    email: "nikhil.saxena@gmail.com",
    phone: "9876543390",
    age: 26,
    gender: "Male",
    college: "Amity University",
    tshirtSize: "L",
    emergencyContact: {
      name: "Rekha Saxena",
      phone: "9876543391"
    },
    medicalConditions: "None",
    status: "cancelled",
    paymentDetails: {
      transactionId: "TXN303132333",
      amount: 99,
      paymentDate: new Date("2026-01-12"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Invalid+Payment"
    }
  },
  {
    fullName: "Ritika Bhatt",
    email: "ritika.bhatt@gmail.com",
    phone: "9876543400",
    age: 21,
    gender: "Female",
    college: "Lovely Professional University",
    tshirtSize: "M",
    emergencyContact: {
      name: "Vikas Bhatt",
      phone: "9876543401"
    },
    medicalConditions: "None",
    status: "cancelled",
    paymentDetails: {
      transactionId: "TXN343536373",
      amount: 99,
      paymentDate: new Date("2026-01-13"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Invalid+Payment"
    }
  },
  {
    fullName: "Akash Tiwari",
    email: "akash.tiwari@gmail.com",
    phone: "9876543410",
    age: 24,
    gender: "Male",
    college: "Chitkara University",
    tshirtSize: "XL",
    emergencyContact: {
      name: "Sunita Tiwari",
      phone: "9876543411"
    },
    medicalConditions: "Knee injury",
    status: "cancelled",
    paymentDetails: {
      transactionId: "TXN383940414",
      amount: 99,
      paymentDate: new Date("2026-01-14"),
      paymentScreenshot: "https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Invalid+Payment"
    }
  }
];

async function resetMarathonData() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("\n🗑️  Deleting all existing marathon registrations...");
    const deleteResult = await Marathon.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} registrations`);

    console.log("\n📝 Creating fresh test data...");
    
    // Insert with registration numbers
    let counter = 1;
    for (const data of sampleData) {
      data.registrationNumber = `MAR2026${String(counter).padStart(4, "0")}`;
      counter++;
    }
    
    const inserted = await Marathon.insertMany(sampleData);
    console.log(`✅ Created ${inserted.length} new marathon registrations`);

    console.log("\n📊 Data Summary:");
    console.log(`   - Pending: ${sampleData.filter(d => d.status === "pending").length}`);
    console.log(`   - Confirmed: ${sampleData.filter(d => d.status === "confirmed").length}`);
    console.log(`   - Cancelled: ${sampleData.filter(d => d.status === "cancelled").length}`);
    console.log(`   - T-shirt Distributed: ${sampleData.filter(d => d.tshirtDistributed).length}`);

    console.log("\n✨ Marathon data reset complete!");
    console.log("\n📋 Sample Login Info:");
    console.log("   Email: rahul.sharma@gmail.com (pending)");
    console.log("   Email: rohan.verma@gmail.com (confirmed)");
    console.log("   Email: nikhil.saxena@gmail.com (cancelled)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting marathon data:", error);
    process.exit(1);
  }
}

resetMarathonData();
