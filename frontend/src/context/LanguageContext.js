import React, { createContext, useState, useContext } from 'react';

export const LanguageContext = createContext();

const translations = {
  en: {
    appName: 'Grievance Redressal System',
    login: 'Login', logout: 'Logout', register: 'Register',
    dashboard: 'Dashboard', submit: 'Submit', cancel: 'Cancel', save: 'Save',
    title: 'Title', description: 'Description', category: 'Category', priority: 'Priority',
    status: 'Status', date: 'Date', actions: 'Actions', search: 'Search',
    fileGrievance: 'File New Grievance', myGrievances: 'My Grievances', trackStatus: 'Track Status',
    open: 'Open', inProgress: 'In Progress', resolved: 'Resolved', closed: 'Closed',
    high: 'High', medium: 'Medium', low: 'Low',
    feedback: 'Feedback', rating: 'Rating', comment: 'Comment',
    notifications: 'Notifications', markAllRead: 'Mark All Read',
    reports: 'Reports', export: 'Export', filter: 'Filter',
    uploadDoc: 'Upload Document', ticketId: 'Ticket ID',
    assignTo: 'Assign To', updateStatus: 'Update Status',
    manageUsers: 'Manage Users', manageGrievances: 'Manage Grievances',
    categories: 'Categories', settings: 'Settings',
    welcome: 'Welcome', totalFiled: 'Total Filed',
    submitGrievance: 'Submit Grievance', submitting: 'Submitting...',
    noGrievances: 'No grievances found', viewDetails: 'View Details',
    resolutionNotes: 'Resolution Notes', resolve: 'Resolve',
    addComment: 'Add Comment', postComment: 'Post Comment',
    statusHistory: 'Status History', documents: 'Documents',
    downloadReport: 'Download Report', totalGrievances: 'Total Grievances',
  },
  hi: {
    appName: 'शिकायत निवारण प्रणाली',
    login: 'लॉगिन', logout: 'लॉगआउट', register: 'पंजीकरण',
    dashboard: 'डैशबोर्ड', submit: 'जमा करें', cancel: 'रद्द करें', save: 'सहेजें',
    title: 'शीर्षक', description: 'विवरण', category: 'श्रेणी', priority: 'प्राथमिकता',
    status: 'स्थिति', date: 'तारीख', actions: 'कार्रवाई', search: 'खोजें',
    fileGrievance: 'नई शिकायत दर्ज करें', myGrievances: 'मेरी शिकायतें', trackStatus: 'स्थिति ट्रैक करें',
    open: 'खुला', inProgress: 'प्रगति में', resolved: 'हल किया', closed: 'बंद',
    high: 'उच्च', medium: 'मध्यम', low: 'निम्न',
    feedback: 'प्रतिक्रिया', rating: 'रेटिंग', comment: 'टिप्पणी',
    notifications: 'सूचनाएं', markAllRead: 'सभी पढ़े हुए चिह्नित करें',
    reports: 'रिपोर्ट', export: 'निर्यात', filter: 'फ़िल्टर',
    uploadDoc: 'दस्तावेज़ अपलोड करें', ticketId: 'टिकट आईडी',
    assignTo: 'असाइन करें', updateStatus: 'स्थिति अपडेट करें',
    manageUsers: 'उपयोगकर्ता प्रबंधन', manageGrievances: 'शिकायत प्रबंधन',
    categories: 'श्रेणियां', settings: 'सेटिंग्स',
    welcome: 'स्वागत है', totalFiled: 'कुल दर्ज',
    submitGrievance: 'शिकायत जमा करें', submitting: 'जमा हो रहा है...',
    noGrievances: 'कोई शिकायत नहीं मिली', viewDetails: 'विवरण देखें',
    resolutionNotes: 'समाधान नोट्स', resolve: 'हल करें',
    addComment: 'टिप्पणी जोड़ें', postComment: 'टिप्पणी पोस्ट करें',
    statusHistory: 'स्थिति इतिहास', documents: 'दस्तावेज़',
    downloadReport: 'रिपोर्ट डाउनलोड करें', totalGrievances: 'कुल शिकायतें',
  },
  ta: {
    appName: 'குறை தீர்வு அமைப்பு',
    login: 'உள்நுழை', logout: 'வெளியேறு', register: 'பதிவு செய்',
    dashboard: 'டாஷ்போர்டு', submit: 'சமர்ப்பி', cancel: 'ரத்து செய்', save: 'சேமி',
    title: 'தலைப்பு', description: 'விளக்கம்', category: 'வகை', priority: 'முன்னுரிமை',
    status: 'நிலை', date: 'தேதி', actions: 'செயல்கள்', search: 'தேடு',
    fileGrievance: 'புதிய குறை பதிவு', myGrievances: 'என் குறைகள்', trackStatus: 'நிலை கண்காணி',
    open: 'திறந்த', inProgress: 'நடவடிக்கையில்', resolved: 'தீர்க்கப்பட்டது', closed: 'மூடப்பட்டது',
    high: 'அதிக', medium: 'நடுத்தர', low: 'குறைந்த',
    feedback: 'கருத்து', rating: 'மதிப்பீடு', comment: 'கருத்து',
    notifications: 'அறிவிப்புகள்', markAllRead: 'அனைத்தும் படித்தது',
    reports: 'அறிக்கைகள்', export: 'ஏற்றுமதி', filter: 'வடிகட்டு',
    uploadDoc: 'ஆவணம் பதிவேற்று', ticketId: 'டிக்கெட் ஐடி',
    assignTo: 'ஒதுக்கு', updateStatus: 'நிலை புதுப்பி',
    manageUsers: 'பயனர் நிர்வாகம்', manageGrievances: 'குறை நிர்வாகம்',
    categories: 'வகைகள்', settings: 'அமைப்புகள்',
    welcome: 'வரவேற்கிறோம்', totalFiled: 'மொத்தம் பதிவு',
    submitGrievance: 'குறை சமர்ப்பி', submitting: 'சமர்ப்பிக்கிறது...',
    noGrievances: 'குறைகள் இல்லை', viewDetails: 'விவரங்கள் பார்',
    resolutionNotes: 'தீர்வு குறிப்புகள்', resolve: 'தீர்',
    addComment: 'கருத்து சேர்', postComment: 'கருத்து இடு',
    statusHistory: 'நிலை வரலாறு', documents: 'ஆவணங்கள்',
    downloadReport: 'அறிக்கை பதிவிறக்கு', totalGrievances: 'மொத்த குறைகள்',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

  const changeLang = (l) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
