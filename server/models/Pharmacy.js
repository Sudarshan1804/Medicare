import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pharmacy name is required'],
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
    enum: ['retail', 'hospital', 'online', 'jan-aushadhi'],
    default: 'retail'
  },
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
  isOpen: {
    type: Boolean,
    default: true
  },
  isOpen24x7: {
    type: Boolean,
    default: false
  },
  openingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  services: [{
    type: String,
    trim: true
  }],
  hasHomeDelivery: {
    type: Boolean,
    default: false
  },
  hasOnlineOrdering: {
    type: Boolean,
    default: false
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
pharmacySchema.index({ location: '2dsphere' });
pharmacySchema.index({ name: 'text', address: 'text' });

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

export default Pharmacy;
