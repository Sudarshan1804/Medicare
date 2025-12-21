import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true,
    index: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['government', 'private', 'clinic', 'specialty'],
    default: 'private'
  },
  specialties: [{
    type: String,
    trim: true
  }],
  facilities: [{
    type: String,
    trim: true
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  isOpen24x7: {
    type: Boolean,
    default: false
  },
  emergencyAvailable: {
    type: Boolean,
    default: true
  },
  hasAmbulance: {
    type: Boolean,
    default: false
  },
  beds: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  images: [{
    type: String
  }],
  website: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ name: 'text', address: 'text' });

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
