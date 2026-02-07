import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import Registration model
import Registration from '../models/Registration.js';

const clearSportsRegistrations = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Get count before deletion
    const countBefore = await Registration.countDocuments();
    console.log(`📊 Current sports registrations in database: ${countBefore}`);
    
    if (countBefore === 0) {
      console.log('ℹ️  No registrations to delete. Database is already empty.');
    } else {
      // Confirm deletion
      console.log('\n⚠️  WARNING: This will delete ALL sports registrations!');
      console.log('⚠️  This action CANNOT be undone!');
      
      // Delete all registrations
      const result = await Registration.deleteMany({});
      
      console.log(`\n✅ Successfully deleted ${result.deletedCount} sports registrations`);
      
      // Verify deletion
      const countAfter = await Registration.countDocuments();
      console.log(`📊 Remaining registrations: ${countAfter}`);
    }
    
    console.log('\n✨ Sports registration database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing sports registrations:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
clearSportsRegistrations();
