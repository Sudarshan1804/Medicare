export const doctors = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    hospital: "Apollo Hospital, Delhi",
    rating: 4.9,
    reviews: 234,
    experience: 15,
    fee: 800,
    videoFee: 600,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    availability: ["Mon", "Wed", "Fri"],
    nextAvailable: "Today, 3:00 PM",
    supportsVideo: true,
    isOnline: true,
    languages: ["English", "Hindi"],
    education: "MD, AIIMS Delhi"
  },
  {
    id: "2",
    name: "Dr. Rajesh Gupta",
    specialty: "Dermatologist",
    hospital: "Max Healthcare, Mumbai",
    rating: 4.8,
    reviews: 189,
    experience: 12,
    fee: 700,
    videoFee: 500,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    availability: ["Tue", "Thu", "Sat"],
    nextAvailable: "Tomorrow, 10:00 AM",
    supportsVideo: true,
    isOnline: false,
    languages: ["English", "Hindi", "Marathi"],
    education: "MD, KEM Hospital Mumbai"
  },
  {
    id: "3",
    name: "Dr. Ananya Reddy",
    specialty: "Pediatrician",
    hospital: "Rainbow Children's Hospital, Hyderabad",
    rating: 4.95,
    reviews: 312,
    experience: 18,
    fee: 600,
    videoFee: 450,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    nextAvailable: "Today, 5:00 PM",
    supportsVideo: true,
    isOnline: true,
    languages: ["English", "Hindi", "Telugu"],
    education: "MD, JIPMER Puducherry"
  },
  {
    id: "4",
    name: "Dr. Vikram Singh",
    specialty: "Orthopedic",
    hospital: "Fortis Hospital, Bangalore",
    rating: 4.7,
    reviews: 156,
    experience: 20,
    fee: 1000,
    videoFee: 750,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
    availability: ["Mon", "Wed", "Fri"],
    nextAvailable: "Wed, 2:00 PM",
    supportsVideo: true,
    isOnline: false,
    languages: ["English", "Hindi", "Punjabi"],
    education: "MS, CMC Vellore"
  },
  {
    id: "5",
    name: "Dr. Meera Patel",
    specialty: "Neurologist",
    hospital: "Narayana Health, Chennai",
    rating: 4.85,
    reviews: 201,
    experience: 14,
    fee: 1200,
    videoFee: 900,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face",
    availability: ["Tue", "Thu"],
    nextAvailable: "Thu, 11:00 AM",
    supportsVideo: true,
    isOnline: true,
    languages: ["English", "Hindi", "Tamil", "Gujarati"],
    education: "DM Neurology, NIMHANS"
  },
  {
    id: "6",
    name: "Dr. Arjun Kapoor",
    specialty: "General Physician",
    hospital: "Medanta Hospital, Gurugram",
    rating: 4.6,
    reviews: 445,
    experience: 25,
    fee: 500,
    videoFee: 350,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    nextAvailable: "Today, 1:00 PM",
    supportsVideo: true,
    isOnline: true,
    languages: ["English", "Hindi"],
    education: "MBBS, Maulana Azad Medical College"
  }
];

export const medicines = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    brand: "Crocin",
    category: "Pain Relief",
    price: 35,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
    description: "For fever and mild pain relief",
    requiresPrescription: false,
    stock: 150
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    brand: "Moxikind",
    category: "Antibiotics",
    price: 120,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop",
    description: "Antibiotic for bacterial infections",
    requiresPrescription: true,
    stock: 80
  },
  {
    id: "3",
    name: "Cetirizine 10mg",
    brand: "Zyrtec",
    category: "Allergy",
    price: 45,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop",
    description: "Antihistamine for allergies",
    requiresPrescription: false,
    stock: 200
  },
  {
    id: "4",
    name: "Omeprazole 20mg",
    brand: "Omez",
    category: "Gastric",
    price: 85,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&h=300&fit=crop",
    description: "For acid reflux and heartburn",
    requiresPrescription: false,
    stock: 120
  },
  {
    id: "5",
    name: "Metformin 500mg",
    brand: "Glycomet",
    category: "Diabetes",
    price: 65,
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop",
    description: "For type 2 diabetes management",
    requiresPrescription: true,
    stock: 100
  },
  {
    id: "6",
    name: "Vitamin D3 1000IU",
    brand: "Shelcal",
    category: "Vitamins",
    price: 180,
    image: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=300&h=300&fit=crop",
    description: "Vitamin D supplement for bone health",
    requiresPrescription: false,
    stock: 300
  },
  {
    id: "7",
    name: "Azithromycin 500mg",
    brand: "Azithral",
    category: "Antibiotics",
    price: 95,
    image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=300&fit=crop",
    description: "Antibiotic for respiratory infections",
    requiresPrescription: true,
    stock: 60
  },
  {
    id: "8",
    name: "Atorvastatin 10mg",
    brand: "Atorva",
    category: "Cardiac",
    price: 110,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=300&fit=crop",
    description: "For cholesterol management",
    requiresPrescription: true,
    stock: 90
  },
  {
    id: "9",
    name: "Ibuprofen 400mg",
    brand: "Brufen",
    category: "Pain Relief",
    price: 55,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=300&fit=crop",
    description: "Anti-inflammatory pain reliever",
    requiresPrescription: false,
    stock: 250
  },
  {
    id: "10",
    name: "Aspirin 75mg",
    brand: "Disprin",
    category: "Cardiac",
    price: 40,
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&h=300&fit=crop",
    description: "Blood thinner for heart health",
    requiresPrescription: false,
    stock: 300
  },
  {
    id: "11",
    name: "Losartan 50mg",
    brand: "Losar",
    category: "Hypertension",
    price: 95,
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=300&h=300&fit=crop",
    description: "For high blood pressure",
    requiresPrescription: true,
    stock: 180
  },
  {
    id: "12",
    name: "Montelukast 10mg",
    brand: "Montair",
    category: "Respiratory",
    price: 125,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop",
    description: "For asthma and allergies",
    requiresPrescription: true,
    stock: 140
  }
];

export const pharmacies = [
  {
    id: "1",
    name: "Apollo Pharmacy",
    address: "Connaught Place, New Delhi",
    distance: "0.5 km",
    rating: 4.5,
    isOpen: true,
    openTime: "8:00 AM",
    closeTime: "10:00 PM",
    phone: "+91-11-4233-6633",
    lat: 28.6315,
    lng: 77.2167,
    deliveryAvailable: true
  },
  {
    id: "2",
    name: "MedPlus Pharmacy",
    address: "Bandra West, Mumbai",
    distance: "1.2 km",
    rating: 4.7,
    isOpen: true,
    openTime: "24 Hours",
    closeTime: "24 Hours",
    phone: "+91-22-6789-0123",
    lat: 19.0596,
    lng: 72.8295,
    deliveryAvailable: true
  },
  {
    id: "3",
    name: "Netmeds Store",
    address: "Koramangala, Bangalore",
    distance: "2.5 km",
    rating: 4.3,
    isOpen: false,
    openTime: "9:00 AM",
    closeTime: "8:00 PM",
    phone: "+91-80-4567-8901",
    lat: 12.9352,
    lng: 77.6245,
    deliveryAvailable: true
  }
];

export const emergencyNumbers = [
  { id: "1", name: "Emergency Ambulance", number: "102", icon: "phone" },
  { id: "2", name: "Police", number: "100", icon: "alert" },
  { id: "3", name: "Fire Brigade", number: "101", icon: "fire" },
  { id: "4", name: "Women Helpline", number: "1091", icon: "heart" },
  { id: "5", name: "Child Helpline", number: "1098", icon: "info" },
  { id: "6", name: "COVID Helpline", number: "1075", icon: "phone" }
];

export const hospitals = [
  {
    id: "1",
    name: "AIIMS Delhi",
    address: "Ansari Nagar, New Delhi",
    distance: "1.5 km",
    eta: "5 min",
    emergencyAvailable: true,
    phone: "+91-11-2658-8500",
    lat: 28.5672,
    lng: 77.2100,
    beds: 2500,
    rating: 4.8
  },
  {
    id: "2",
    name: "Apollo Hospital",
    address: "Sarita Vihar, New Delhi",
    distance: "3.2 km",
    eta: "12 min",
    emergencyAvailable: true,
    phone: "+91-11-2987-1234",
    lat: 28.5355,
    lng: 77.2921,
    beds: 710,
    rating: 4.7
  },
  {
    id: "3",
    name: "Max Super Specialty",
    address: "Saket, New Delhi",
    distance: "5.0 km",
    eta: "18 min",
    emergencyAvailable: true,
    phone: "+91-11-2651-5050",
    lat: 28.5245,
    lng: 77.2156,
    beds: 500,
    rating: 4.6
  }
];

export const responders = [
  {
    id: "1",
    name: "Amit Kumar",
    type: "First Aid Certified",
    distance: "200m",
    available: true,
    phone: "+91-98765-43210",
    rating: 4.9,
    responseTime: "2 min"
  },
  {
    id: "2",
    name: "Sunita Devi",
    type: "Nurse",
    distance: "350m",
    available: true,
    phone: "+91-98765-43211",
    rating: 4.8,
    responseTime: "4 min"
  },
  {
    id: "3",
    name: "Ravi Shankar",
    type: "Paramedic",
    distance: "500m",
    available: false,
    phone: "+91-98765-43212",
    rating: 4.95,
    responseTime: "5 min"
  }
];

export const incidents = [
  {
    id: "1",
    type: "Road Accident",
    location: "MG Road & Brigade Road, Bangalore",
    time: "10 min ago",
    severity: "high",
    respondersOnScene: 2,
    description: "Two-vehicle collision, medical assistance requested"
  },
  {
    id: "2",
    type: "Medical Emergency",
    location: "Marine Drive, Mumbai",
    time: "25 min ago",
    severity: "medium",
    respondersOnScene: 1,
    description: "Person experiencing chest pain"
  },
  {
    id: "3",
    type: "Fire",
    location: "Andheri East, Mumbai",
    time: "45 min ago",
    severity: "high",
    respondersOnScene: 5,
    description: "Building fire, evacuation in progress"
  }
];

export const symptoms = [
  { id: "1", name: "Headache", severity: "low" },
  { id: "2", name: "Fever", severity: "medium" },
  { id: "3", name: "Chest Pain", severity: "high" },
  { id: "4", name: "Difficulty Breathing", severity: "high" },
  { id: "5", name: "Nausea", severity: "low" },
  { id: "6", name: "Dizziness", severity: "medium" },
  { id: "7", name: "Fatigue", severity: "low" },
  { id: "8", name: "Cough", severity: "low" },
  { id: "9", name: "Sore Throat", severity: "low" },
  { id: "10", name: "Body Aches", severity: "medium" }
];
