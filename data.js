/* Fictional sample data for the Atelier CRM live demo. No real people, businesses or contact details. */
window.DEMO_CONFIG = {
  idleMinutes: 10,                 // a sandbox resets after this many minutes without a click (owner can change)
  brand: "Your Company",
  contactEmail: "oneuni.global@gmail.com",   // used by the "Get the app" form (opens the visitor's mail app)
  contactEndpoint: ""              // optional: a form service address (for example Formspree). Leave empty to use email.
};

window.DEMO_STATUSES = ["New Enquiry", "Contacted", "Consultation", "Proposal Sent", "Confirmed", "Completed", "On Hold", "Lost"];
window.DEMO_OPEN = ["New Enquiry", "Contacted", "Consultation", "Proposal Sent"];

window.DEMO_LANGS = [
  { code: "en", name: "English", bcp: "en-US",
    q1: "What are your opening hours?", a1: "We are open Monday to Friday, from 9 am to 5 pm.",
    q2: "I would like to speak to a person about my payment.", h: "A colleague will call you back on this number as soon as possible." },
  { code: "ur", name: "Urdu", bcp: "ur-PK",
    q1: "آپ کے کھلنے کے اوقات کیا ہیں؟", a1: "ہم پیر سے جمعہ تک صبح 9 بجے سے شام 5 بجے تک کھلے ہیں۔",
    q2: "میں اپنی ادائیگی کے بارے میں کسی انسان سے بات کرنا چاہتا ہوں۔", h: "ہمارا ایک ساتھی جلد از جلد اس نمبر پر آپ کو واپس کال کرے گا۔" },
  { code: "ar", name: "Arabic", bcp: "ar-SA",
    q1: "ما هي ساعات العمل لديكم؟", a1: "نحن مفتوحون من الاثنين إلى الجمعة، من التاسعة صباحاً حتى الخامسة مساءً.",
    q2: "أريد التحدث إلى شخص بخصوص الدفع.", h: "سيتصل بك أحد زملائنا على هذا الرقم في أقرب وقت ممكن." },
  { code: "hi", name: "Hindi", bcp: "hi-IN",
    q1: "आपके खुलने का समय क्या है?", a1: "हम सोमवार से शुक्रवार तक, सुबह 9 बजे से शाम 5 बजे तक खुले हैं।",
    q2: "मैं अपने भुगतान के बारे में किसी व्यक्ति से बात करना चाहता हूँ।", h: "हमारा एक सहकर्मी जल्द से जल्द इसी नंबर पर आपको वापस कॉल करेगा।" },
  { code: "es", name: "Spanish", bcp: "es-ES",
    q1: "¿Cuál es su horario de atención?", a1: "Estamos abiertos de lunes a viernes, de 9:00 a 17:00.",
    q2: "Quisiera hablar con una persona sobre mi pago.", h: "Un compañero le devolverá la llamada a este número lo antes posible." },
  { code: "fr", name: "French", bcp: "fr-FR",
    q1: "Quels sont vos horaires d'ouverture ?", a1: "Nous sommes ouverts du lundi au vendredi, de 9 h à 17 h.",
    q2: "Je voudrais parler à une personne au sujet de mon paiement.", h: "Un collègue vous rappellera sur ce numéro dès que possible." },
  { code: "de", name: "German", bcp: "de-DE",
    q1: "Wie sind Ihre Öffnungszeiten?", a1: "Wir sind von Montag bis Freitag, von 9 bis 17 Uhr geöffnet.",
    q2: "Ich möchte mit einer Person über meine Zahlung sprechen.", h: "Ein Kollege ruft Sie so bald wie möglich unter dieser Nummer zurück." },
  { code: "pt", name: "Portuguese", bcp: "pt-PT",
    q1: "Qual é o vosso horário de funcionamento?", a1: "Estamos abertos de segunda a sexta-feira, das 9h às 17h.",
    q2: "Gostaria de falar com uma pessoa sobre o meu pagamento.", h: "Um colega ligará de volta para este número o mais depressa possível." },
  { code: "tr", name: "Turkish", bcp: "tr-TR",
    q1: "Çalışma saatleriniz nedir?", a1: "Pazartesiden cumaya, sabah 9'dan akşam 5'e kadar açığız.",
    q2: "Ödemem hakkında bir kişiyle konuşmak istiyorum.", h: "Bir meslektaşımız en kısa sürede bu numaradan sizi geri arayacak." },
  { code: "id", name: "Indonesian", bcp: "id-ID",
    q1: "Jam buka Anda kapan?", a1: "Kami buka Senin sampai Jumat, pukul 09.00 sampai 17.00.",
    q2: "Saya ingin berbicara dengan seorang staf tentang pembayaran saya.", h: "Seorang rekan kami akan menelepon kembali ke nomor ini secepat mungkin." }
];


/* The same fictional people for every business type: name, email, phone, country, page, referrer, status, days since created, owner */
window.DEMO_BASE = [
  ["Amelia Hartwell", "amelia@example.test", "+44 7700 900111", "United Kingdom", "/enquiry", "google.com", "Contacted", 0, "Maya"],
  ["Rashid Al Mansoori", "rashid@example.test", "+971 50 000 0000", "United Arab Emirates", "/pricing", "linkedin.com", "Consultation", 3, "Idris"],
  ["Sofia Marchetti", "sofia@example.test", "+39 340 000 0000", "Italy", "/", "", "Proposal Sent", 6, "Maya"],
  ["Daniel Okafor", "daniel@example.test", "+234 800 000 0000", "Nigeria", "/contact", "bing.com", "New Enquiry", 9, "Idris"],
  ["Hannah Berg", "hannah@example.test", "+49 151 00000000", "Germany", "/services", "google.com", "Confirmed", 12, "Maya"],
  ["Kenji Watanabe", "kenji@example.test", "+81 90 0000 0000", "Japan", "/enquiry", "", "New Enquiry", 15, "Idris"],
  ["Layla Haddad", "layla@example.test", "+966 50 000 0000", "Saudi Arabia", "/services", "linkedin.com", "On Hold", 18, "Maya"],
  ["Oliver Grant", "oliver@example.test", "+1 415 555 0100", "United States", "/enquiry", "google.com", "Completed", 21, "Idris"]
];

/* One preset per kind of business. The words on the client card, the sample clients and the AI's facts follow the choice. */
window.DEMO_PRESETS = {
  general: { label: "General business", brand: "Your Company", interest: "Service wanted", size: "People involved", unit: "people", pitch: "Prices start at $500 and a first consultation is free.",
    profile: "Your Company serves business and private customers. Prices start at $500. A first consultation is free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Service package", "Monthly plan", "One-off project", "Consultation", "Annual contract", "Training session", "Custom order", "Support plan"],
    sizes: [2, 5, 1, 1, 12, 8, 1, 3], budgets: ["$500 to $1,500", "$1,000 to $3,000", "$2,000 to $4,000", "$500 to $800", "$5,000 to $9,000", "$1,500 to $2,500", "$800 to $1,500", "$2,000 to $3,500"], f: 0.4 },
  agency: { label: "Agency or B2B services", brand: "Your Agency", interest: "Service wanted", size: "Team size", unit: "people", pitch: "Projects start at $2,000 and a first consultation is free.",
    profile: "Your Agency provides web, marketing and software services to other businesses. Projects start at $2,000. A first consultation is free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Website redesign", "Annual support plan", "Online shop setup", "Marketing audit", "Staff training programme", "Process automation", "Software rollout", "Brand identity"],
    sizes: [12, 40, 8, 5, 25, 15, 60, 3], budgets: ["$5,000 to $10,000", "$10,000 to $20,000", "$8,000 to $15,000", "$2,000 to $4,000", "$15,000 to $25,000", "$10,000 to $18,000", "$30,000 to $50,000", "$3,000 to $6,000"], f: 1 },
  realestate: { label: "Real estate", brand: "Your Realty", interest: "Property type", size: "Rooms", unit: "rooms", pitch: "Properties start at $120,000 and a first viewing is free.",
    profile: "Your Realty sells and rents homes and commercial space. Properties start at $120,000. A first viewing is free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Family house", "City apartment", "Office space", "Retail unit", "Garden house", "Studio flat", "Warehouse", "Penthouse"],
    sizes: [6, 4, 10, 3, 8, 2, 1, 7], budgets: ["$350,000 to $450,000", "$200,000 to $280,000", "$400,000 to $600,000", "$150,000 to $250,000", "$500,000 to $700,000", "$120,000 to $160,000", "$300,000 to $450,000", "$800,000 to $1,100,000"], f: 8 },
  clinic: { label: "Clinic and beauty", brand: "Your Clinic", interest: "Treatment", size: "Sessions", unit: "sessions", pitch: "Treatments start at $80 and a first assessment is free.",
    profile: "Your Clinic offers health, skin and wellness treatments. Treatments start at $80. A first assessment is free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Skin consultation", "Dental check-up", "Physiotherapy plan", "Laser treatment", "Facial course", "Hair restoration", "Health assessment", "Teeth whitening"],
    sizes: [1, 2, 6, 4, 5, 3, 1, 2], budgets: ["$80 to $150", "$100 to $200", "$400 to $700", "$300 to $600", "$250 to $500", "$900 to $1,500", "$120 to $250", "$200 to $350"], f: 0.08 },
  shop: { label: "Shop or wholesale", brand: "Your Shop", interest: "Product", size: "Quantity", unit: "units", pitch: "Orders start at $300 and samples are free.",
    profile: "Your Shop supplies products to businesses and households, with wholesale prices on larger orders. Orders start at $300. Samples are free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Bulk coffee order", "Office furniture", "Custom uniforms", "Wholesale tiles", "Gift boxes", "Packaging supplies", "Kitchen equipment", "Branded stationery"],
    sizes: [200, 40, 150, 500, 300, 1000, 12, 2000], budgets: ["$1,500 to $3,000", "$4,000 to $7,000", "$2,000 to $3,500", "$3,000 to $5,000", "$800 to $1,500", "$1,200 to $2,500", "$5,000 to $9,000", "$600 to $1,200"], f: 0.5 },
  school: { label: "School and coaching", brand: "Your Academy", interest: "Course", size: "Learners", unit: "learners", pitch: "Courses start at $200 and the first lesson is free.",
    profile: "Your Academy teaches children, adults and companies. Courses start at $200. The first lesson is free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["IELTS preparation", "Kids coding club", "Business English", "Maths tutoring", "Music lessons", "Exam revision", "Corporate training", "Career coaching"],
    sizes: [1, 12, 20, 2, 1, 30, 50, 1], budgets: ["$300 to $500", "$400 to $800", "$600 to $1,200", "$200 to $400", "$250 to $450", "$500 to $900", "$3,000 to $6,000", "$300 to $600"], f: 0.06 },
  events: { label: "Events and hospitality", brand: "Your Events", interest: "Event type", size: "Guests", unit: "guests", pitch: "Events start at $3,000 and a site visit is free.",
    profile: "Your Events plans weddings, corporate events and private parties. Events start at $3,000. A site visit is free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Wedding reception", "Corporate dinner", "Birthday party", "Conference", "Product launch", "Baby shower", "Charity gala", "Team offsite"],
    sizes: [120, 60, 40, 300, 150, 30, 200, 45], budgets: ["$12,000 to $20,000", "$6,000 to $10,000", "$3,000 to $5,000", "$25,000 to $40,000", "$10,000 to $18,000", "$3,000 to $4,500", "$20,000 to $35,000", "$5,000 to $9,000"], f: 1 },
  travel: { label: "Travel and tourism", brand: "Your Travel", interest: "Trip wanted", size: "Travellers", unit: "travellers", pitch: "Trips start at $1,500 and planning calls are free.",
    profile: "Your Travel plans holidays and group trips. Trips start at $1,500. Planning calls are free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Family holiday", "Honeymoon trip", "Group tour", "City break", "Safari trip", "Business trip", "Cruise package", "Ski week"],
    sizes: [4, 2, 16, 2, 6, 3, 5, 4], budgets: ["$4,000 to $8,000", "$5,000 to $9,000", "$15,000 to $25,000", "$1,500 to $3,000", "$8,000 to $14,000", "$2,000 to $4,000", "$6,000 to $10,000", "$4,000 to $7,000"], f: 0.9 },
  ecomagency: { label: "E-commerce agency", brand: "Your E-commerce Agency", interest: "Service wanted", size: "Products in store", unit: "products", pitch: "Projects start at $1,500 and a free store review comes first.",
    profile: "Your E-commerce Agency builds and grows online stores for brands: store builds, migrations, ads, email marketing and monthly store care. Projects start at $1,500. A free store review comes first. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Store build", "Store migration", "Conversion audit", "Paid ads management", "Email marketing setup", "Product photography", "Marketplace listings", "Monthly store care"],
    sizes: [150, 2000, 40, 300, 80, 500, 1200, 60], budgets: ["$3,000 to $8,000", "$5,000 to $12,000", "$1,500 to $3,000", "$2,000 to $5,000", "$1,000 to $2,500", "$2,500 to $6,000", "$2,000 to $4,000", "$800 to $1,500"], f: 1 },
  onlinestore: { label: "Online store", brand: "Your Store", interest: "Product", size: "Quantity", unit: "units", pitch: "Orders start at $25 and shipping is free over $100.",
    profile: "Your Store sells products online with worldwide shipping. Orders start at $25. Shipping is free over $100. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.",
    interests: ["Wholesale order", "Corporate gift boxes", "Custom printed items", "Bulk reorder", "Subscription box", "Wedding favours", "Returns question", "Product bundle"],
    sizes: [100, 50, 200, 500, 12, 150, 1, 10], budgets: ["$900 to $2,000", "$1,500 to $3,000", "$1,000 to $2,500", "$2,500 to $5,000", "$300 to $600", "$700 to $1,200", "$25 to $100", "$100 to $250"], f: 0.3 }
};
window.DEMO_PRESET_ORDER = ["general", "agency", "ecomagency", "onlinestore", "realestate", "clinic", "shop", "school", "events", "travel"];
window.DEMO_BASE_VALUES = [4200, 8400, 12600, 16800, 21000, 25200, 29400, 33600];

/* a few seeded conversations, by client index. {i} = what the client is interested in */
window.DEMO_THREADS = {
  0: [["in", "Hello, I am interested in {i} and would like to know more. Can you tell me how it works?"]],
  1: [["in", "Good evening. I would like to ask about {i}. What would you suggest?"],
      ["out", "Good evening, thank you for writing. We can help with {i}. Shall we arrange a short call to agree the details?"]],
  3: [["in", "Hi, I found you online and I am looking for {i}. Could you send me some information?"]]
};
