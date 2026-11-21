/* Fictional sample data for the Atelier CRM live demo. No real people, businesses or contact details. */
window.DEMO_CONFIG = {
  idleMinutes: 10,                 // a sandbox resets after this many minutes without a click (owner can change)
  brand: "Atelier Concierge",
  contactEmail: "oneuni.global@gmail.com",   // used by the "Get the app" form (opens the visitor's mail app)
  contactEndpoint: ""              // optional: a form service address (for example Formspree). Leave empty to use email.
};

window.DEMO_STATUSES = ["New Enquiry", "Contacted", "Consultation", "Proposal Sent", "Confirmed", "Completed", "On Hold", "Lost"];
window.DEMO_OPEN = ["New Enquiry", "Contacted", "Consultation", "Proposal Sent"];

window.DEMO_PROFILE = "Atelier Concierge arranges private villas, yachts, chefs and wellness retreats. Packages start at $10,000. " +
  "A first consultation call is free. We reply within one working day. Opening hours: every day 9 am to 6 pm.";

window.DEMO_LANGS = [
  { code: "en", name: "English", bcp: "en-US",
    q1: "What are your opening hours?", a1: "We are open every day from 9 am to 6 pm.",
    q2: "I would like to speak to a person about my payment.", h: "A colleague will call you back on this number as soon as possible." },
  { code: "ur", name: "Urdu", bcp: "ur-PK",
    q1: "آپ کے کھلنے کے اوقات کیا ہیں؟", a1: "ہم روزانہ صبح 9 بجے سے شام 6 بجے تک کھلے ہیں۔",
    q2: "میں اپنی ادائیگی کے بارے میں کسی انسان سے بات کرنا چاہتا ہوں۔", h: "ہمارا ایک ساتھی جلد از جلد اس نمبر پر آپ کو واپس کال کرے گا۔" },
  { code: "ar", name: "Arabic", bcp: "ar-SA",
    q1: "ما هي ساعات العمل لديكم؟", a1: "نحن مفتوحون كل يوم من التاسعة صباحاً حتى السادسة مساءً.",
    q2: "أريد التحدث إلى شخص بخصوص الدفع.", h: "سيتصل بك أحد زملائنا على هذا الرقم في أقرب وقت ممكن." },
  { code: "hi", name: "Hindi", bcp: "hi-IN",
    q1: "आपके खुलने का समय क्या है?", a1: "हम हर दिन सुबह 9 बजे से शाम 6 बजे तक खुले हैं।",
    q2: "मैं अपने भुगतान के बारे में किसी व्यक्ति से बात करना चाहता हूँ।", h: "हमारा एक सहकर्मी जल्द से जल्द इसी नंबर पर आपको वापस कॉल करेगा।" },
  { code: "es", name: "Spanish", bcp: "es-ES",
    q1: "¿Cuál es su horario de atención?", a1: "Estamos abiertos todos los días de 9:00 a 18:00.",
    q2: "Quisiera hablar con una persona sobre mi pago.", h: "Un compañero le devolverá la llamada a este número lo antes posible." },
  { code: "fr", name: "French", bcp: "fr-FR",
    q1: "Quels sont vos horaires d'ouverture ?", a1: "Nous sommes ouverts tous les jours de 9 h à 18 h.",
    q2: "Je voudrais parler à une personne au sujet de mon paiement.", h: "Un collègue vous rappellera sur ce numéro dès que possible." },
  { code: "de", name: "German", bcp: "de-DE",
    q1: "Wie sind Ihre Öffnungszeiten?", a1: "Wir sind täglich von 9 bis 18 Uhr geöffnet.",
    q2: "Ich möchte mit einer Person über meine Zahlung sprechen.", h: "Ein Kollege ruft Sie so bald wie möglich unter dieser Nummer zurück." },
  { code: "pt", name: "Portuguese", bcp: "pt-PT",
    q1: "Qual é o vosso horário de funcionamento?", a1: "Estamos abertos todos os dias das 9h às 18h.",
    q2: "Gostaria de falar com uma pessoa sobre o meu pagamento.", h: "Um colega ligará de volta para este número o mais depressa possível." },
  { code: "tr", name: "Turkish", bcp: "tr-TR",
    q1: "Çalışma saatleriniz nedir?", a1: "Her gün sabah 9'dan akşam 6'ya kadar açığız.",
    q2: "Ödemem hakkında bir kişiyle konuşmak istiyorum.", h: "Bir meslektaşımız en kısa sürede bu numaradan sizi geri arayacak." },
  { code: "id", name: "Indonesian", bcp: "id-ID",
    q1: "Jam buka Anda kapan?", a1: "Kami buka setiap hari pukul 09.00 sampai 18.00.",
    q2: "Saya ingin berbicara dengan seorang staf tentang pembayaran saya.", h: "Seorang rekan kami akan menelepon kembali ke nomor ini secepat mungkin." }
];

/* name, email, phone, country, guests, experience, budget, page, referrer, status, deal value, days since created, owner */
window.DEMO_CLIENTS = [
  ["Amelia Hartwell", "amelia@example.test", "+44 7700 900111", "United Kingdom", 4, "Private villa week", "$25,000 to $40,000", "/private-access", "google.com", "Contacted", 4200, 0, "Maya"],
  ["Rashid Al Mansoori", "rashid@example.test", "+971 50 000 0000", "United Arab Emirates", 2, "Yacht and dining", "$15,000 to $25,000", "/experiences/yacht", "instagram.com", "Consultation", 8400, 3, "Idris"],
  ["Sofia Marchetti", "sofia@example.test", "+39 340 000 0000", "Italy", 6, "Family celebration", "$40,000+", "/", "", "Proposal Sent", 12600, 6, "Maya"],
  ["Daniel Okafor", "daniel@example.test", "+234 800 000 0000", "Nigeria", 2, "Anniversary trip", "$10,000 to $15,000", "/contact", "bing.com", "New Enquiry", 16800, 9, "Idris"],
  ["Hannah Berg", "hannah@example.test", "+49 151 00000000", "Germany", 3, "Private chef and wellness", "$20,000 to $30,000", "/experiences/wellness", "google.com", "Confirmed", 21000, 12, "Maya"],
  ["Kenji Watanabe", "kenji@example.test", "+81 90 0000 0000", "Japan", 2, "Cultural journey", "$12,000 to $18,000", "/private-access", "", "New Enquiry", 25200, 15, "Idris"],
  ["Layla Haddad", "layla@example.test", "+966 50 000 0000", "Saudi Arabia", 5, "Group retreat", "$30,000 to $50,000", "/experiences/retreats", "linkedin.com", "On Hold", 29400, 18, "Maya"],
  ["Oliver Grant", "oliver@example.test", "+1 415 555 0100", "United States", 2, "Honeymoon", "$18,000 to $26,000", "/private-access", "google.com", "Completed", 33600, 21, "Idris"]
];

/* a few seeded conversations (client wrote first), by client index */
window.DEMO_THREADS = {
  0: [["in", "Hello, we are four adults looking for a private villa for a week this spring. Do you also arrange a chef?"]],
  1: [["in", "Good evening. I would like a yacht day with dinner for two. What would you suggest?"],
      ["out", "Good evening Rashid, thank you for writing. We can plan a private yacht day with an on-board dinner. Shall we arrange a short call to agree the details?"]],
  3: [["in", "Hi, it is our anniversary in a few months and I would like to plan something special."]]
};
