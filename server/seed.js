import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from './models/Hospital.js';
import Pharmacy from './models/Pharmacy.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Sample hospitals data with real locations near Jalandhar and Phagwara
const hospitals = [
  {
    name: "Uni Health Center",
    address: "Lovely Professional University Campus, Phagwara",
    location: { type: "Point", coordinates: [75.7020, 31.2520] },
    phone: "+91-1824-517-000",
    type: "private",
    specialties: ["General Medicine", "Emergency Care", "Cardiology"],
    rating: 4.6,
    reviews: 342,
    isOpen24x7: true,
    emergencyAvailable: true,
    hasAmbulance: true,
    beds: { total: 150, available: 35 }
  },
  {
    name: "Lovely Professional University Hospital",
    address: "Phagwara, Jalandhar",
    location: { type: "Point", coordinates: [75.7697, 31.2547] },
    phone: "+91-1824-404-404",
    type: "private",
    specialties: ["Cardiology", "Neurology", "Orthopedics"],
    rating: 4.5,
    reviews: 234,
    isOpen24x7: true,
    emergencyAvailable: true,
    hasAmbulance: true,
    beds: { total: 200, available: 45 }
  },
  {
    name: "Ivy Hospital",
    address: "Civil Lines, Jalandhar",
    location: { type: "Point", coordinates: [75.5762, 31.3260] },
    phone: "+91-181-5000-000",
    type: "private",
    specialties: ["Cardiology", "Oncology", "Gastroenterology"],
    rating: 4.7,
    reviews: 456,
    isOpen24x7: true,
    emergencyAvailable: true,
    hasAmbulance: true,
    beds: { total: 350, available: 78 }
  },
  {
    name: "Tagore Hospital",
    address: "Model Town, Jalandhar",
    location: { type: "Point", coordinates: [75.5835, 31.3219] },
    phone: "+91-181-461-8000",
    type: "private",
    specialties: ["Multi-specialty", "Trauma", "Pediatric"],
    rating: 4.8,
    reviews: 789,
    isOpen24x7: true,
    emergencyAvailable: true,
    hasAmbulance: true,
    beds: { total: 500, available: 120 }
  },
  {
    name: "Civil Hospital Jalandhar",
    address: "Near Bus Stand, Jalandhar",
    location: { type: "Point", coordinates: [75.5698, 31.3302] },
    phone: "+91-181-222-2245",
    type: "government",
    specialties: ["Nephrology", "Cardiology", "Neurosurgery"],
    rating: 4.6,
    reviews: 567,
    isOpen24x7: true,
    emergencyAvailable: true,
    hasAmbulance: true,
    beds: { total: 400, available: 89 }
  },
  {
    name: "Deepak Hospital",
    address: "Phagwara Road, Jalandhar",
    location: { type: "Point", coordinates: [75.6012, 31.3140] },
    phone: "+91-181-222-4444",
    type: "private",
    specialties: ["Liver Transplant", "Cardiology"],
    rating: 4.7,
    reviews: 345,
    isOpen24x7: true,
    emergencyAvailable: true,
    hasAmbulance: true,
    beds: { total: 300, available: 65 }
  },
  {
    name: "Columbia Asia Hospital",
    address: "GT Road, Phagwara",
    location: { type: "Point", coordinates: [75.7750, 31.2250] },
    phone: "+91-1824-288-888",
    type: "private",
    specialties: ["Trauma", "Orthopedics", "General Surgery"],
    rating: 4.5,
    reviews: 198,
    isOpen24x7: true,
    emergencyAvailable: true,
    hasAmbulance: true,
    beds: { total: 120, available: 28 }
  }
];

// Sample pharmacies data with real locations near Jalandhar and Phagwara
const pharmacies = [
  {
    name: "LPU Pharmacy",
    address: "Lovely Professional University Campus, Phagwara",
    location: { type: "Point", coordinates: [75.7020, 31.2520] },
    phone: "+91-1824-517-100",
    type: "retail",
    rating: 4.4,
    reviews: 287,
    isOpen: true,
    isOpen24x7: true,
    hasHomeDelivery: true,
    hasOnlineOrdering: true
  },
  {
    name: "Apollo Pharmacy",
    address: "Model Town, Jalandhar",
    location: { type: "Point", coordinates: [75.5825, 31.3209] },
    phone: "+91-181-3302-3302",
    type: "retail",
    rating: 4.5,
    reviews: 234,
    isOpen: true,
    isOpen24x7: true,
    hasHomeDelivery: true,
    hasOnlineOrdering: true
  },
  {
    name: "MedPlus",
    address: "Civil Lines, Jalandhar",
    location: { type: "Point", coordinates: [75.5772, 31.3270] },
    phone: "+91-181-4466-4466",
    type: "retail",
    rating: 4.3,
    reviews: 189,
    isOpen: true,
    isOpen24x7: false,
    hasHomeDelivery: true,
    hasOnlineOrdering: true
  },
  {
    name: "Jan Aushadhi Kendra",
    address: "Phagwara",
    location: { type: "Point", coordinates: [75.7707, 31.2557] },
    phone: "+91-1824-222-333",
    type: "jan-aushadhi",
    rating: 4.2,
    reviews: 98,
    isOpen: true,
    isOpen24x7: false,
    hasHomeDelivery: false,
    hasOnlineOrdering: false
  },
  {
    name: "Wellness Forever",
    address: "Near Bus Stand, Jalandhar",
    location: { type: "Point", coordinates: [75.5688, 31.3312] },
    phone: "+91-181-5566-7788",
    type: "retail",
    rating: 4.4,
    reviews: 156,
    isOpen: true,
    isOpen24x7: true,
    hasHomeDelivery: true,
    hasOnlineOrdering: true
  },
  {
    name: "Netmeds Pharmacy",
    address: "Phagwara Road, Jalandhar",
    location: { type: "Point", coordinates: [75.6022, 31.3150] },
    phone: "+91-181-6677-8899",
    type: "retail",
    rating: 4.6,
    reviews: 267,
    isOpen: true,
    isOpen24x7: false,
    hasHomeDelivery: true,
    hasOnlineOrdering: true
  },
  {
    name: "HealthKart Pharmacy",
    address: "LPU Campus, Phagwara",
    location: { type: "Point", coordinates: [75.7687, 31.2537] },
    phone: "+91-1824-7788-9900",
    type: "retail",
    rating: 4.5,
    reviews: 178,
    isOpen: true,
    isOpen24x7: true,
    hasHomeDelivery: true,
    hasOnlineOrdering: true
  },
  {
    name: "PhagwaraMed Store",
    address: "Main Market, Phagwara",
    location: { type: "Point", coordinates: [75.7720, 31.2248] },
    phone: "+91-1824-333-444",
    type: "retail",
    rating: 4.3,
    reviews: 142,
    isOpen: true,
    isOpen24x7: false,
    hasHomeDelivery: true,
    hasOnlineOrdering: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Hospital.deleteMany({});
    await Pharmacy.deleteMany({});

    console.log('🏥 Inserting hospitals...');
    await Hospital.insertMany(hospitals);
    console.log(`✅ ${hospitals.length} hospitals added`);

    console.log('💊 Inserting pharmacies...');
    await Pharmacy.insertMany(pharmacies);
    console.log(`✅ ${pharmacies.length} pharmacies added`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
