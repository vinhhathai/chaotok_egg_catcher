const mongoose = require('mongoose');

class DBConnection {
  async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chaotok_games';
      
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('✅ MongoDB connected successfully');
      console.log('📊 Database:', mongoose.connection.name);
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }
}

module.exports = DBConnection;
