/* Fictional sample data for the Atelier CRM live demo. No real people, businesses or contact details. */
window.DEMO_CONFIG = {
  idleMinutes: 10,                 // a sandbox resets after this many minutes without a click (owner can change)
  brand: "Your Company",
  contactEmail: "oneuni.global@gmail.com",   // used by the "Get the app" form (opens the visitor's mail app)
  contactEndpoint: ""              // optional: a form service address (for example Formspree). Leave empty to use email.
};

window.DEMO_STATUSES = ["New Enquiry", "Contacted", "Consultation", "Proposal Sent", "Confirmed", "Completed", "On Hold", "Lost"];
window.DEMO_OPEN = ["New Enquiry", "Contacted", "Consultation", "Proposal Sent"];

window.DEMO_PROFILE = "Your Company provides web, software, training and support services to other businesses. Packages start at $2,000. " +
  "A first consultation call is free. We reply within one working day. Opening hours: Monday to Friday, 9 am to 5 pm.";

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

/* name, email, phone, country, team size, interest, budget, page, referrer, status, deal value, days since created, owner */
window.DEMO_CLIENTS = [
  ["Amelia Hartwell", "amelia@example.test", "+44 7700 900111", "United Kingdom", 12, "Website redesign", "$5,000 to $10,000", "/quote", "google.com", "Contacted", 4200, 0, "Maya"],
  ["Rashid Al Mansoori", "rashid@example.test", "+971 50 000 0000", "United Arab Emirates", 40, "Annual support plan", "$10,000 to $20,000", "/pricing", "linkedin.com", "Consultation", 8400, 3, "Idris"],
  ["Sofia Marchetti", "sofia@example.test", "+39 340 000 0000", "Italy", 8, "Online shop setup", "$8,000 to $15,000", "/", "", "Proposal Sent", 12600, 6, "Maya"],
  ["Daniel Okafor", "daniel@example.test", "+234 800 000 0000", "Nigeria", 5, "Marketing audit", "$2,000 to $4,000", "/contact", "bing.com", "New Enquiry", 16800, 9, "Idris"],
  ["Hannah Berg", "hannah@example.test", "+49 151 00000000", "Germany", 25, "Staff training programme", "$15,000 to $25,000", "/services/training", "google.com", "Confirmed", 21000, 12, "Maya"],
  ["Kenji Watanabe", "kenji@example.test", "+81 90 0000 0000", "Japan", 15, "Process automation", "$10,000 to $18,000", "/quote", "", "New Enquiry", 25200, 15, "Idris"],
  ["Layla Haddad", "layla@example.test", "+966 50 000 0000", "Saudi Arabia", 60, "Software rollout", "$30,000 to $50,000", "/services/software", "linkedin.com", "On Hold", 29400, 18, "Maya"],
  ["Oliver Grant", "oliver@example.test", "+1 415 555 0100", "United States", 3, "Brand identity", "$3,000 to $6,000", "/quote", "google.com", "Completed", 33600, 21, "Idris"]
];

/* a few seeded conversations (client wrote first), by client index */
window.DEMO_THREADS = {
  0: [["in", "Hello, we want to redesign our company website and add a booking page. Can you also host it for us?"]],
  1: [["in", "Good evening. We need ongoing IT support for about 40 staff. What would you suggest?"],
      ["out", "Good evening Rashid, thank you for writing. We can set up a yearly support plan with a named contact. Shall we arrange a short call to agree the details?"]],
  3: [["in", "Hi, we are a small shop and would like a marketing audit before we spend more on advertising."]]
};
