import {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import {motion, AnimatePresence, useScroll, useTransform, useSpring} from "framer-motion";
import {toast} from "react-toastify";
import api from "../config/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/**
 * Natural Easing Curves for smooth, organic motion
 * These replace linear movement with physics-based feel
 */
const easing = {
  // Smooth deceleration - great for entrances
  easeOut: [0.16, 1, 0.3, 1],
  // Smooth acceleration then deceleration - natural feel
  easeInOut: [0.65, 0, 0.35, 1],
  // Quick start, gentle end - energetic entrances
  easeOutExpo: [0.19, 1, 0.22, 1],
  // Gentle overshoot - playful, bouncy feel
  easeOutBack: [0.34, 1.56, 0.64, 1],
  // Smooth and elegant - premium feel
  easeOutQuart: [0.25, 1, 0.5, 1],
  // Spring-like without actual spring physics
  easeOutElastic: [0.68, -0.55, 0.27, 1.55],
};

// Reusable transition presets
const transitions = {
  // Fast, snappy entrance
  snappy: { duration: 0.4, ease: easing.easeOutExpo },
  // Smooth, elegant motion
  smooth: { duration: 0.6, ease: easing.easeOut },
  // Standard section reveals
  section: { duration: 0.8, ease: easing.easeOutQuart },
  // Slow, cinematic reveals
  cinematic: { duration: 1.2, ease: easing.easeOut },
  // Playful bounce
  bouncy: { duration: 0.5, ease: easing.easeOutBack },
  // Stagger children
  stagger: { staggerChildren: 0.1, delayChildren: 0.2 },
};

/**
 * MarathonPage - Full marketing and registration page for Zenith Marathon
 * "The Moment Before the Run" - Cinematic, emotional experience
 * Performance optimized - minimal animations with natural easing
 * Supports English and Marathi with premium Devanagari fonts
 */

// Marathi Font Families
const marathiFonts = {
  // For headlines - bold, impactful
  headline: "'Noto Sans Devanagari', 'Mukta', sans-serif",
  // For body text - elegant, readable
  body: "'Mukta', 'Noto Sans Devanagari', sans-serif",
  // For quotes/emotional text - traditional, literary feel
  literary: "'Tiro Devanagari Marathi', 'Mukta', serif",
};

// Translations
const translations = {
  en: {
    // Hero Section
    heroMicroText: "Nanded Marathon · Sunrise · Endurance",
    heroLine1: "Before the run,",
    heroLine2: "there is a moment.",
    heroSubtext: "This is that moment.",
    dateBadge: "February 14, 2026 · 6:00 AM · SGGSIE&T Campus",
    ctaButton: "Begin the Journey",
    scroll: "Scroll",
    
    // Inner Voice Section
    innerVoiceLabel: "The Inner Voice",
    innerVoice1: "You will doubt yourself.",
    innerVoice2: "Your legs will question you.",
    innerVoice3: "Your mind will try to stop you.",
    breakthrough1: "And then...",
    breakthrough2: "you will keep going.",
    everyStep: "Every step counts",
    
    // About Section
    aboutTitle1: "This marathon is",
    aboutNot: "not",
    aboutTitle2: "for winners.",
    aboutSubtitle: "It's for everyone who dares to start.",
    aboutCallout: "It's for the version of you that refuses to quit.",
    
    // Race Route
    routeLabel: "The Journey",
    routeTitle: "Run Through the Heart of",
    routeCity: "Nanded",
    routeSubtitle: "The city wakes up alongside you — quiet, proud, and alive.",
    
    // Route Checkpoints
    start: "Start",
    finish: "Finish",
    checkpoint1Title: "Zudio",
    checkpoint1Desc: "The beginning is always quiet.",
    checkpoint1Subtext: "This is where intention becomes movement.",
    checkpoint2Title: "Ram Setu Pool",
    checkpoint2Desc: "You cross not just a bridge, but a belief.",
    checkpoint2Subtext: "The city opens up. The run begins to breathe.",
    checkpoint3Title: "Ravi Nagar",
    checkpoint3Desc: "Streets that have seen everyday strength.",
    checkpoint3Subtext: "You run with the city, not through it.",
    checkpoint4Title: "Mama Chowk",
    checkpoint4Desc: "Noise, life, and rhythm.",
    checkpoint4Subtext: "This is where focus matters.",
    checkpoint5Title: "Modi Ground",
    checkpoint5Desc: "Not an ending.",
    checkpoint5Highlight: "A becoming.",
    
    // Route Summary
    totalDistance: "Total Distance",
    zenithMarathon: "Zenith Marathon",
    routeQuote: "\"I know these roads… but I've never seen them like this.\"",
    liveRoute: "Live Route",
    openInMaps: "Open in Google Maps →",
    
    // Race Information
    raceInfoTitle: "Race Information",
    raceInfoSubtitle: "Everything You Need to Know",
    raceCardSubtitle: "Run through the heart of Nanded",
    allLevels: "All Fitness Levels Welcome",
    date: "Date",
    startTime: "Start Time",
    startPoint: "Start Point",
    finishPoint: "Finish Point",
    whatsIncluded: "What's Included",
    finisherMedal: "Finisher Medal",
    tShirt: "T-Shirt",
    refreshments: "Refreshments",
    eCertificate: "E-Certificate",
    cashPrizes: "Cash Prizes (Top 3)",
    registrationFee: "Registration Fee:",
    perPerson: "/ person",
    registerNow: "Register Now →",
    route: "Route",
    
    // Schedule
    scheduleTitle: "Race Day Schedule",
    scheduleSubtitle: "February 14, 2026",
    
    // FAQ
    faqLabel: "Before You Ask",
    faqTitle1: "We know what you're",
    faqTitle2: "thinking",
    faqSubtitle: "The doubts. The questions. The quiet \"what ifs\" that keep you from signing up. Let's talk through them, one by one.",
    faqClosing1: "Still have questions? That's okay.",
    faqClosing2: "The first step is always the hardest.",
    
    // Final CTA
    finalCtaTitle: "Ready to Run?",
    finalCtaSubtitle: "Join 500+ runners in making history at the first-ever SGGSIE&T campus marathon.",
    finalCtaButton: "Register for ₹99",
    finalCtaNote: "Limited slots available. Register now!",
    
    // Language toggle
    switchLang: "मराठी",
  },
  mr: {
    // Hero Section
    heroMicroText: "नांदेड मॅरेथॉन · सूर्योदय · सहनशक्ती",
    heroLine1: "धावण्यापूर्वी,",
    heroLine2: "एक क्षण असतो.",
    heroSubtext: "हाच तो क्षण आहे.",
    dateBadge: "१४ फेब्रुवारी, २०२६ · सकाळी ६:०० · SGGSIE&T कॅम्पस",
    ctaButton: "प्रवास सुरू करा",
    scroll: "खाली स्क्रोल करा",
    
    // Inner Voice Section
    innerVoiceLabel: "आतला आवाज",
    innerVoice1: "तुम्ही स्वतःवर शंका घ्याल.",
    innerVoice2: "तुमचे पाय तुम्हाला प्रश्न विचारतील.",
    innerVoice3: "तुमचं मन तुम्हाला थांबवण्याचा प्रयत्न करेल.",
    breakthrough1: "आणि मग...",
    breakthrough2: "तुम्ही पुढे जाल.",
    everyStep: "प्रत्येक पाऊल महत्त्वाचं",
    
    // About Section
    aboutTitle1: "हा मॅरेथॉन",
    aboutNot: "नाही",
    aboutTitle2: "विजेत्यांसाठी.",
    aboutSubtitle: "जो सुरू करण्याची हिंमत करतो त्याच्यासाठी आहे.",
    aboutCallout: "तुमच्यातल्या त्या आवृत्तीसाठी जी हार मानत नाही.",
    
    // Race Route
    routeLabel: "प्रवास",
    routeTitle: "नांदेडच्या हृदयातून धावा —",
    routeCity: "नांदेड",
    routeSubtitle: "शहर तुमच्यासोबत जागतं — शांत, अभिमानी आणि जिवंत.",
    
    // Route Checkpoints
    start: "सुरुवात",
    finish: "समाप्ती",
    checkpoint1Title: "झुडिओ",
    checkpoint1Desc: "सुरुवात नेहमीच शांत असते.",
    checkpoint1Subtext: "इथेच इच्छाशक्ती हालचालीत बदलते.",
    checkpoint2Title: "राम सेतू तलाव",
    checkpoint2Desc: "तुम्ही फक्त पूल नाही, विश्वास ओलांडता.",
    checkpoint2Subtext: "शहर उघडतं. धावणं श्वास घेऊ लागतं.",
    checkpoint3Title: "रवी नगर",
    checkpoint3Desc: "रोजच्या ताकदीचे साक्षीदार रस्ते.",
    checkpoint3Subtext: "तुम्ही शहरासोबत धावता, त्यातून नाही.",
    checkpoint4Title: "मामा चौक",
    checkpoint4Desc: "गोंगाट, जीवन आणि लय.",
    checkpoint4Subtext: "इथेच एकाग्रता महत्त्वाची.",
    checkpoint5Title: "मोदी ग्राउंड",
    checkpoint5Desc: "हा शेवट नाही.",
    checkpoint5Highlight: "हे होणं आहे.",
    
    // Route Summary
    totalDistance: "एकूण अंतर",
    zenithMarathon: "झेनिथ मॅरेथॉन",
    routeQuote: "\"मला हे रस्ते माहीत आहेत… पण असे कधी पाहिले नव्हते.\"",
    liveRoute: "लाइव्ह मार्ग",
    openInMaps: "Google Maps मध्ये उघडा →",
    
    // Race Information
    raceInfoTitle: "शर्यतीची माहिती",
    raceInfoSubtitle: "तुम्हाला हवं ते सर्व",
    raceCardSubtitle: "नांदेडच्या हृदयातून धावा",
    allLevels: "सर्व फिटनेस स्तरांचे स्वागत",
    date: "तारीख",
    startTime: "सुरुवातीची वेळ",
    startPoint: "सुरुवातीचा बिंदू",
    finishPoint: "समाप्तीचा बिंदू",
    whatsIncluded: "समाविष्ट आहे",
    finisherMedal: "फिनिशर मेडल",
    tShirt: "टी-शर्ट",
    refreshments: "रिफ्रेशमेंट्स",
    eCertificate: "ई-सर्टिफिकेट",
    cashPrizes: "रोख बक्षिसे (टॉप ३)",
    registrationFee: "नोंदणी शुल्क:",
    perPerson: "/ व्यक्ती",
    registerNow: "आता नोंदणी करा →",
    route: "मार्ग",
    
    // Schedule
    scheduleTitle: "शर्यतीच्या दिवसाचे वेळापत्रक",
    scheduleSubtitle: "१४ फेब्रुवारी, २०२६",
    
    // FAQ
    faqLabel: "विचारण्यापूर्वी",
    faqTitle1: "आम्हाला माहीत आहे तुम्ही काय",
    faqTitle2: "विचार करत आहात",
    faqSubtitle: "शंका. प्रश्न. नोंदणी करण्यापासून रोखणारे शांत \"जर\" आणि \"पण\". चला एक एक करून बोलूया.",
    faqClosing1: "अजून प्रश्न आहेत? ठीक आहे.",
    faqClosing2: "पहिलं पाऊल नेहमीच कठीण असतं.",
    
    // Final CTA
    finalCtaTitle: "धावायला तयार?",
    finalCtaSubtitle: "SGGSIE&T कॅम्पसच्या पहिल्या मॅरेथॉनमध्ये ५००+ धावपटूंसोबत इतिहास घडवा.",
    finalCtaButton: "₹९९ मध्ये नोंदणी करा",
    finalCtaNote: "मर्यादित जागा उपलब्ध. आत्ताच नोंदणी करा!",
    
    // Language toggle
    switchLang: "English",
  }
};

// Marathi timeline
const timelineMr = [
  {time: "सकाळी ५:००", event: "प्रवेशद्वार उघडणे आणि चेक-इन", icon: "🚪"},
  {time: "सकाळी ५:३०", event: "वॉर्म-अप सत्र", icon: "🤸"},
  {time: "सकाळी ५:४५", event: "ध्वजारोहण समारंभ", icon: "🎌"},
  {time: "सकाळी ६:००", event: "शर्यत सुरू!", icon: "🏁"},
  {time: "सकाळी ८:००", event: "बक्षीस वितरण", icon: "🏆"},
  {time: "सकाळी ९:००", event: "नाश्ता आणि नेटवर्किंग", icon: "☕"},
];

// Marathi FAQs
const faqsMr = [
  {
    thought: "मी यासाठी तंदुरुस्त आहे का?",
    voice: "तुम्हाला वेगवान असण्याची गरज नाही. परिपूर्ण असण्याची गरज नाही. फक्त येण्याची गरज आहे. ही ५K सर्वांसाठी आहे — चालणारे, जॉगिंग करणारे, पहिल्यांदा करणारे. फक्त महत्त्वाचं म्हणजे तुम्ही सुरुवात करा.",
    icon: "🌱",
  },
  {
    thought: "मी पूर्ण करू शकलो नाही तर?",
    voice: "तर तुम्ही काल होता त्यापेक्षा पुढे गेलात. चालण्यात लाज नाही. थांबण्यात लाज नाही. फिनिश लाइन तुमची वाट पाहील — आणि आम्हीही.",
    icon: "💫",
  },
  {
    thought: "नोंदणी केल्यावर मला काय मिळेल?",
    voice: "तुम्ही आलात हे सिद्ध करणारं फिनिशर मेडल. रिफ्रेशमेंट्स. ई-सर्टिफिकेट. आणि टॉप ३ साठी? रोख बक्षिसे. पण खरं बक्षीस म्हणजे ती रेषा पार करणं.",
    icon: "🏅",
  },
  {
    thought: "पाऊस पडला तर?",
    voice: "आम्ही धावतो. पाऊस असो वा ऊन, आम्ही धावतो. पावसात धावण्यात काहीतरी काव्यमय आहे — तो शंका धुवून टाकतो. पण असुरक्षित वादळ असेल तर आम्ही कळवू.",
    icon: "🌧️",
  },
  {
    thought: "मी हे कधी केलं नाही…",
    voice: "कुणीही एकदा केलं नव्हतं. तुम्ही ज्या धावपटूंची प्रशंसा करता ते सगळे तुम्ही आहात तिथूनच सुरू झाले — अनिश्चित, थोडे नर्व्हस, पण प्रयत्न करण्याइतके उत्सुक. हे तुमचं पहिलं पाऊल आहे. टाका.",
    icon: "👣",
  },
  {
    thought: "पार्किंग आहे का?",
    voice: "हो, SGGSIE&T कॅम्पसमध्ये मोफत पार्किंग. लवकर या, सकाळची हवा श्वास घ्या, धावण्यापूर्वी शांत व्हा.",
    icon: "🚗",
  },
];

const MarathonPage = () => {
  const navigate = useNavigate();
  const [showCTA, setShowCTA] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'mr'
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  
  // Smooth scroll-based parallax effect for hero
  const { scrollY } = useScroll();
  
  // Smooth the scroll value to prevent jitter
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Parallax transforms using smoothed scroll value
  const heroBackgroundY = useTransform(smoothScrollY, [0, 600], [0, 120]);
  const heroContentY = useTransform(smoothScrollY, [0, 600], [0, -40]);
  const heroOpacity = useTransform(smoothScrollY, [0, 400], [1, 0]);
  
  // Parallax effect for about section
  const aboutBackgroundY = useTransform(smoothScrollY, [500, 1500], [0, 100]);
  const aboutContentY = useTransform(smoothScrollY, [500, 1500], [0, -30]);
  
  // Get current translations
  const t = translations[language];
  const currentFaqs = language === 'mr' ? faqsMr : null; // Will use default faqs for English
  const currentTimeline = language === 'mr' ? timelineMr : null; // Will use default timeline for English

  // Delayed CTA reveal
  useEffect(() => {
    const timer = setTimeout(() => setShowCTA(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Marathon date
  const marathonDate = new Date("2026-02-14T06:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = marathonDate - new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return {days: 0, hours: 0, minutes: 0, seconds: 0};
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      name: "Zenith Marathon",
      distance: "5 KM",
      difficulty: "All Levels",
      price: "₹99",
      color: "from-orange-400 to-red-600",
      icon: "🏃",
      description: "Run through the heart of Nanded with us",
      benefits: [
        "Finisher Medal",
        "Refreshments",
        "E-Certificate",
        "Cash Prizes for Top 3",
      ],
    },
  ];

  const timeline = [
    {time: "5:00 AM", event: "Gates Open & Check-in", icon: "🚪"},
    {time: "5:30 AM", event: "Warm-up Session", icon: "🤸"},
    {time: "5:45 AM", event: "Flag-off Ceremony", icon: "🎌"},
    {time: "6:00 AM", event: "Race Starts!", icon: "🏁"},
    {time: "8:00 AM", event: "Prize Distribution", icon: "🏆"},
    {time: "9:00 AM", event: "Breakfast & Networking", icon: "☕"},
  ];

  const faqs = [
    {
      thought: "Am I fit enough for this?",
      voice: "You don't need to be fast. You don't need to be perfect. You just need to show up. This 5K is for everyone — walkers, joggers, first-timers. The only thing that matters is that you start.",
      icon: "🌱",
    },
    {
      thought: "What if I can't finish?",
      voice: "Then you'll have gone further than you were yesterday. There's no shame in walking. There's no shame in pausing. The finish line will wait for you — and so will we.",
      icon: "💫",
    },
    {
      thought: "What do I get when I register?",
      voice: "A finisher medal that proves you showed up. Refreshments to refuel. An e-certificate to remember this day. And for the top 3? Cash prizes. But honestly, the real reward is crossing that line.",
      icon: "🏅",
    },
    {
      thought: "What if it rains?",
      voice: "We run. Rain or shine, we run. There's something poetic about running in the rain — it washes away the doubt. But if there's a storm that makes it unsafe, we'll let you know.",
      icon: "🌧️",
    },
    {
      thought: "I've never done this before…",
      voice: "Neither had anyone, once. Every runner you admire started exactly where you are — uncertain, a little nervous, but curious enough to try. This is your first step. Take it.",
      icon: "👣",
    },
    {
      thought: "Is there parking?",
      voice: "Yes, free parking at SGGSIE&T campus. Come early, breathe the morning air, find your calm before the run begins.",
      icon: "🚗",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════
          LANGUAGE TOGGLE - Floating Premium Button
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2.5, ease: easing.easeOutQuart }}
        onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
        className="fixed top-24 right-6 z-50 group"
      >
        <div 
          className="relative px-5 py-3 rounded-full border overflow-hidden transition-all duration-500"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: language === 'mr' ? "rgba(234,88,12,0.6)" : "rgba(255,255,255,0.15)",
            boxShadow: language === 'mr' 
              ? "0 8px 32px rgba(234,88,12,0.2), inset 0 1px 0 rgba(255,255,255,0.1)" 
              : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* Glow effect on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle at center, rgba(245,158,11,0.15) 0%, transparent 70%)",
            }}
          />
          
          {/* Button content */}
          <div className="relative flex items-center gap-3">
            {/* Language icon */}
            <span className="text-lg">
              {language === 'en' ? '🇮🇳' : '🌐'}
            </span>
            
            {/* Text with font switch */}
            <span 
              className="text-sm font-medium tracking-wide transition-all duration-300"
              style={{ 
                fontFamily: language === 'en' 
                  ? marathiFonts.headline
                  : "'Manrope', sans-serif",
                color: language === 'mr' 
                  ? "rgba(251,191,36,1)" 
                  : "rgba(255,255,255,0.9)",
              }}
            >
              {t.switchLang}
            </span>
            
            {/* Active indicator dot */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-2 h-2 rounded-full"
              style={{
                background: language === 'mr' 
                  ? "linear-gradient(135deg, #f59e0b, #ea580c)" 
                  : "rgba(255,255,255,0.4)",
              }}
            />
          </div>
        </div>
      </motion.button>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION: "The Moment Before the Run"
          Cinematic, emotional, award-level design with subtle parallax
      ═══════════════════════════════════════════════════════════════════ */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Cinematic Dawn Background - Parallax Layer */}
        <motion.div 
          className="absolute inset-0 will-change-transform"
          style={{ 
            y: heroBackgroundY,
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
        >
          {/* Background Image - moves slower than content */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{
              backgroundImage: "url('https://res.cloudinary.com/dvmsho3pj/image/upload/v1768496483/zenith-26/marathon/marathon-bg.png')",
              transform: 'translateZ(0)', // Force GPU acceleration
            }}
          />
          
          {/* Dark Base Overlay */}
          <div className="absolute inset-0 bg-black/65" />
          
          {/* Gradient Overlay for depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          
          {/* Subtle warm light leak - Top */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/3"
            style={{
              background: "radial-gradient(ellipse at top, rgba(255,160,60,0.06) 0%, transparent 70%)",
            }}
          />
          
          {/* Vignette */}
          <div 
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)",
            }}
          />
          
          {/* Floating particles - subtle */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-orange-300/20"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 4) * 15}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Hero Content - Parallax Layer (moves at different speed) */}
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-6 text-center will-change-transform"
          style={{ 
            y: heroContentY, 
            opacity: heroOpacity,
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
        >
          {/* Micro Text - Whispered */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: easing.easeOut }}
            className="text-xs sm:text-sm tracking-[0.5em] uppercase mb-10 font-light"
            style={{ 
              fontFamily: language === 'mr' ? marathiFonts.body : "'Manrope', sans-serif",
              color: "rgba(255,180,120,0.5)",
              letterSpacing: language === 'mr' ? "0.15em" : "0.5em",
            }}
          >
            {t.heroMicroText}
          </motion.p>

          {/* Primary Headline - The Moment */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: easing.easeOutQuart }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] mb-8 tracking-tight"
            style={{ 
              fontFamily: language === 'mr' ? marathiFonts.headline : "'Bebas Neue', 'Oswald', sans-serif",
              letterSpacing: language === 'mr' ? "0" : undefined,
            }}
          >
            <span 
              className="block"
              style={{
                color: "rgba(255,255,255,0.92)",
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
              }}
            >
              {t.heroLine1}
            </span>
            <motion.span 
              className="block mt-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8, ease: easing.easeOutQuart }}
              style={{
                background: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 25%, #ea580c 50%, #f59e0b 75%, #fcd34d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 20px rgba(245,158,11,0.3))",
              }}
            >
              {t.heroLine2}
            </motion.span>
          </motion.h1>

          {/* Secondary Line - Soft, Human */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2, ease: easing.easeOut }}
            className="text-xl sm:text-2xl md:text-3xl font-light mb-14"
            style={{ 
              fontFamily: language === 'mr' ? marathiFonts.literary : "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              color: "rgba(255,220,180,0.6)",
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            {t.heroSubtext}
          </motion.p>

          {/* Date Badge - Elegant */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.6, ease: easing.easeOutBack }}
            className="mb-12"
          >
            <span 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium tracking-wide"
              style={{
                fontFamily: language === 'mr' ? marathiFonts.body : "'Manrope', sans-serif",
                color: "rgba(255,200,150,0.7)",
                background: "rgba(255,150,80,0.08)",
                border: "1px solid rgba(255,150,80,0.15)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400/60" />
              {t.dateBadge}
            </span>
          </motion.div>

          {/* CTA - Delayed Reveal */}
          <AnimatePresence>
            {showCTA && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easing.easeOutQuart }}
              >
                <button
                  onClick={() => document.getElementById('race-info')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative px-10 py-4 rounded-full font-semibold text-lg overflow-hidden group transition-all duration-500"
                  style={{
                    fontFamily: language === 'mr' ? marathiFonts.body : "'Manrope', sans-serif",
                    color: "rgba(255,230,200,0.9)",
                    background: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(234,88,12,0.1) 100%)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    boxShadow: "0 0 30px rgba(245,158,11,0.1)",
                  }}
                >
                  {/* Hover glow effect */}
                  <span 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(234,88,12,0.15) 100%)",
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    {t.ctaButton}
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Scroll Indicator - Elegant */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 3, duration: 1, ease: easing.easeOut }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span 
              className="text-xs tracking-[0.3em] uppercase"
              style={{ 
                fontFamily: language === 'mr' ? marathiFonts.body : "'Manrope', sans-serif",
                color: "rgba(255,180,120,0.4)",
              }}
            >
              {t.scroll}
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-orange-400/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* The Inner Voice Section - Transition from Stillness to Motion */}
      <section className="relative py-32 md:py-48 bg-black overflow-hidden">
        {/* Cinematic background with depth - Static for performance */}
        <div className="absolute inset-0">
          {/* Dark gradient base */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#080404] to-black" />
          
          {/* Warm radial glow - center focus */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-40"
            style={{
              background: "radial-gradient(ellipse, rgba(251,146,60,0.08) 0%, rgba(234,88,12,0.03) 40%, transparent 70%)",
            }}
          />
          
          {/* Vertical light beam effect */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full opacity-10"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.5) 70%, transparent 100%)",
            }}
          />
        </div>
        
        {/* Static decorative particles - No animation for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: (i % 3) + 2 + "px",
                height: (i % 3) + 2 + "px",
                left: `${(i * 8.3) % 100}%`,
                top: `${(i * 7.7 + 10) % 100}%`,
                background: `rgba(251, 146, 60, ${0.15 + (i % 3) * 0.1})`,
                boxShadow: "0 0 4px rgba(251, 146, 60, 0.3)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Section intro */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: easing.easeOut}}
            className="text-center mb-16"
          >
            <span 
              className="text-xs tracking-[0.5em] uppercase text-orange-400/50 font-medium"
              style={{ 
                fontFamily: language === 'mr' ? marathiFonts.body : undefined,
                letterSpacing: language === 'mr' ? "0.25em" : undefined,
              }}
            >
              {t.innerVoiceLabel}
            </span>
          </motion.div>

          {/* Doubt Messages - Simplified Cards */}
          <div className="space-y-8 md:space-y-12">
            {/* Message 1 - Left aligned */}
            <motion.div
              initial={{opacity: 0, x: -40}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.7, ease: easing.easeOutQuart}}
              className="flex justify-start"
            >
              <div 
                className="relative max-w-xl p-8 md:p-10 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Accent line */}
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
                {/* Quote icon */}
                <span className="absolute -top-3 left-6 text-4xl text-white/10">"</span>
                <p 
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-white/80 leading-relaxed pl-6"
                  style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                >
                  {t.innerVoice1}
                </p>
              </div>
            </motion.div>

            {/* Message 2 - Right aligned */}
            <motion.div
              initial={{opacity: 0, x: 40}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.7, delay: 0.05, ease: easing.easeOutQuart}}
              className="flex justify-end"
            >
              <div 
                className="relative max-w-xl p-8 md:p-10 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Accent line */}
                <div className="absolute right-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-white/20 via-white/08 to-transparent" />
                <span className="absolute -top-3 right-6 text-4xl text-white/08">"</span>
                <p 
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-white/60 leading-relaxed pr-6 text-right"
                  style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                >
                  {t.innerVoice2}
                </p>
              </div>
            </motion.div>

            {/* Message 3 - Left aligned */}
            <motion.div
              initial={{opacity: 0, x: -40}}
              whileInView={{opacity: 1, x: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.7, delay: 0.1, ease: easing.easeOutQuart}}
              className="flex justify-start"
            >
              <div 
                className="relative max-w-xl p-8 md:p-10 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-white/15 via-white/05 to-transparent" />
                <span className="absolute -top-3 left-6 text-4xl text-white/05">"</span>
                <p 
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-white/40 leading-relaxed pl-6"
                  style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                >
                  {t.innerVoice3}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Separator - Static */}
          <div className="my-20 md:my-28 flex items-center justify-center gap-6">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-orange-400/30" />
            <div className="w-2 h-2 rounded-full bg-orange-400/60" />
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-orange-400/30" />
          </div>

          {/* The Breakthrough Message - Hero Moment */}
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.9, ease: easing.easeOutQuart}}
            className="text-center"
          >
            {/* Glow container */}
            <div className="relative inline-block">
              {/* Static glow effect */}
              <div 
                className="absolute -inset-20 opacity-40"
                style={{
                  background: "radial-gradient(ellipse, rgba(251,146,60,0.25) 0%, rgba(234,88,12,0.08) 50%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              
              {/* Main text with static gradient */}
              <h2 
                className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none tracking-tight"
                style={{ 
                  fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', 'Bebas Neue', sans-serif",
                  background: "linear-gradient(135deg, #fde68a 0%, #fb923c 30%, #ea580c 70%, #fde68a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.breakthrough1}
                <br />
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                  {t.breakthrough2}
                </span>
              </h2>
            </div>
            
            {/* Decorative footer - Static */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-400/30" />
                <span className="text-3xl">🏃</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-400/30" />
              </div>
              <p 
                className="text-white/30 text-sm tracking-widest uppercase"
                style={{ 
                  fontFamily: language === 'mr' ? marathiFonts.body : undefined,
                  letterSpacing: language === 'mr' ? "0.15em" : undefined,
                }}
              >
                {t.everyStep}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Purpose & Belonging with Parallax */}
      <section
        ref={aboutRef}
        id="about"
        className="relative py-32 bg-black overflow-hidden"
      >
        {/* Background with subtle warmth - Parallax layer */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: aboutBackgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#060303] to-black" />
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30"
            style={{
              background: "radial-gradient(ellipse at bottom, rgba(251,146,60,0.05) 0%, transparent 60%)",
            }}
          />
          {/* Subtle parallax grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(rgba(251,146,60,0.3) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </motion.div>

        {/* Content with subtle parallax */}
        <motion.div 
          className="relative z-10 max-w-5xl mx-auto px-6"
          style={{ y: aboutContentY }}
        >
          {/* Main statement - Hero typography */}
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8, ease: easing.easeOutQuart}}
            className="text-center mb-20"
          >
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white/95 mb-6 leading-tight"
              style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', 'Bebas Neue', sans-serif" }}
            >
              {t.aboutTitle1}{" "}
              <span 
                className="relative inline-block"
                style={{
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.aboutNot}
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q25 0, 50 5 T100 5" stroke="rgba(251,146,60,0.5)" strokeWidth="2" fill="none"/>
                </svg>
              </span>
              {" "}{t.aboutTitle2}
            </h2>
            <div className="w-32 h-1 mx-auto rounded-full bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
          </motion.div>
          
          {/* Who it's for - Card grid */}
          <motion.div
            initial={{opacity: 0, y: 25}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.2, duration: 0.8, ease: easing.easeOutQuart}}
            className="mb-20"
          >
            <p 
              className="text-center text-xl sm:text-2xl text-white/50 mb-10"
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : "'Inter', sans-serif" }}
            >
              {t.aboutSubtitle}
            </p>
            
            {/* People cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {(language === 'mr' ? [
                { emoji: "👩‍🏫", title: "शिक्षक", desc: "उदाहरण घालून देणारे" },
                { emoji: "🎓", title: "विद्यार्थी", desc: "स्वप्नांचा पाठलाग करणारे" },
                { emoji: "👷", title: "कामगार", desc: "उद्याचे निर्माते" },
                { emoji: "✨", title: "स्वप्नाळू", desc: "अधिकावर विश्वास ठेवणारे" },
              ] : [
                { emoji: "👩‍🏫", title: "Teachers", desc: "Leading by example" },
                { emoji: "🎓", title: "Students", desc: "Chasing their dreams" },
                { emoji: "👷", title: "Workers", desc: "Building tomorrow" },
                { emoji: "✨", title: "Dreamers", desc: "Believing in more" },
              ]).map((person, i) => (
                <motion.div
                  key={person.title}
                  initial={{opacity: 0, y: 15}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{delay: 0.1 * i + 0.3, duration: 0.5, ease: easing.easeOutQuart}}
                  className="group relative p-6 rounded-2xl text-center cursor-default"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform duration-300">
                    {person.emoji}
                  </span>
                  <h3 
                    className="text-lg font-semibold text-white/80 mb-1" 
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : "'Inter', sans-serif" }}
                  >
                    {person.title}
                  </h3>
                  <p 
                    className="text-sm text-white/40"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {person.desc}
                  </p>
                  
                  {/* Hover glow */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(251,146,60,0.1) 0%, transparent 70%)",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Final statement - The call */}
          <motion.div
            initial={{opacity: 0, y: 25}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.4, duration: 0.8, ease: easing.easeOutQuart}}
            className="text-center"
          >
            <div className="relative inline-block">
              {/* Glow */}
              <div 
                className="absolute -inset-10 opacity-40 blur-2xl"
                style={{
                  background: "radial-gradient(ellipse, rgba(251,146,60,0.2) 0%, transparent 70%)",
                }}
              />
              <p 
                className="relative text-2xl sm:text-3xl md:text-4xl font-medium leading-relaxed"
                style={{
                  fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif",
                  background: "linear-gradient(90deg, #fde68a 0%, #fb923c 30%, #ea580c 60%, #fb923c 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.aboutCallout}
              </p>
            </div>
            
            {/* Subtle separator */}
            <motion.div
              initial={{scaleX: 0}}
              whileInView={{scaleX: 1}}
              viewport={{once: true}}
              transition={{delay: 0.6, duration: 1, ease: easing.easeOutQuart}}
              className="mt-8 w-48 h-px mx-auto bg-gradient-to-r from-transparent via-orange-400/30 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          RACE ROUTE SECTION: "Run Through the Heart of Nanded"
          Immersive, storytelling journey through the city
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 bg-black overflow-hidden">
        {/* Dark map-style background */}
        <div className="absolute inset-0">
          {/* Grid pattern like premium fitness apps */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Radial glow at center */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
            style={{
              background: "radial-gradient(ellipse, rgba(251,146,60,0.03) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{opacity: 0, y: 25}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8, ease: easing.easeOutQuart}}
            className="text-center mb-20"
          >
            <span 
              className="text-xs tracking-[0.5em] uppercase text-orange-400/50 font-medium mb-4 block"
              style={{ 
                fontFamily: language === 'mr' ? marathiFonts.body : undefined,
                letterSpacing: language === 'mr' ? "0.25em" : undefined,
              }}
            >
              {t.routeLabel}
            </span>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6"
              style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
            >
              {t.routeTitle}{" "}
              <span 
                style={{
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.routeCity}
              </span>
            </h2>
            <p 
              className="text-lg text-white/40 max-w-2xl mx-auto" 
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : "'Inter', sans-serif" }}
            >
              {t.routeSubtitle}
            </p>
          </motion.div>

          {/* Route Journey - Vertical Timeline */}
          <div className="relative">
            {/* Glowing Route Line - Vertical */}
            <div className="absolute left-1/2 md:left-8 top-0 bottom-0 w-px -translate-x-1/2 md:translate-x-0">
              <motion.div
                initial={{height: 0}}
                whileInView={{height: "100%"}}
                viewport={{once: true, margin: "-100px"}}
                transition={{duration: 2, ease: "easeOut"}}
                className="w-full bg-gradient-to-b from-orange-400/80 via-orange-500/60 to-orange-400/40"
                style={{
                  boxShadow: "0 0 20px rgba(251,146,60,0.4), 0 0 40px rgba(251,146,60,0.2)",
                }}
              />
            </div>

            {/* Route Checkpoints */}
            <div className="space-y-16 md:space-y-24">
              {/* START - Zudio */}
              <motion.div
                initial={{opacity: 0, x: -25}}
                whileInView={{opacity: 1, x: 0}}
                viewport={{once: true, margin: "-50px"}}
                transition={{duration: 0.7, ease: easing.easeOutQuart}}
                className="relative pl-12 md:pl-24"
              >
                {/* Checkpoint Dot */}
                <div className="absolute left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 top-2">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-orange-400 border-2 border-black" />
                    <div 
                      className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-30"
                      style={{animationDuration: "2s"}}
                    />
                  </div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] transition-colors duration-500 group">
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium tracking-wider uppercase"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                    >
                      {t.start}
                    </span>
                    <span className="text-white/30 text-sm">6:00 AM</span>
                  </div>
                  <h3 
                    className="text-2xl md:text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
                  >
                    {t.checkpoint1Title}
                  </h3>
                  <p 
                    className="text-white/50 leading-relaxed mb-4"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                  >
                    {t.checkpoint1Desc}
                  </p>
                  <p 
                    className="text-white/30 text-sm italic group-hover:text-orange-400/60 transition-colors duration-500"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.checkpoint1Subtext}
                  </p>
                </div>
              </motion.div>

              {/* Ram Setu Pool */}
              <motion.div
                initial={{opacity: 0, x: 25}}
                whileInView={{opacity: 1, x: 0}}
                viewport={{once: true, margin: "-50px"}}
                transition={{duration: 0.7, delay: 0.1, ease: easing.easeOutQuart}}
                className="relative pl-12 md:pl-24"
              >
                <div className="absolute left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 top-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400/70 border-2 border-black" />
                </div>
                
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] transition-colors duration-500 group">
                  <h3 
                    className="text-2xl md:text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
                  >
                    {t.checkpoint2Title}
                  </h3>
                  <p 
                    className="text-white/50 leading-relaxed mb-4"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                  >
                    {t.checkpoint2Desc}
                  </p>
                  <p 
                    className="text-white/30 text-sm italic group-hover:text-blue-400/60 transition-colors duration-500"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.checkpoint2Subtext}
                  </p>
                  {/* Subtle water effect */}
                  <div className="mt-4 h-1 w-full rounded-full overflow-hidden bg-white/5">
                    <motion.div
                      className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"
                      animate={{x: ["-100%", "400%"]}}
                      transition={{duration: 3, repeat: Infinity, ease: "easeInOut"}}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Ravi Nagar */}
              <motion.div
                initial={{opacity: 0, x: -25}}
                whileInView={{opacity: 1, x: 0}}
                viewport={{once: true, margin: "-50px"}}
                transition={{duration: 0.7, delay: 0.1, ease: easing.easeOutQuart}}
                className="relative pl-12 md:pl-24"
              >
                <div className="absolute left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 top-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400/60 border-2 border-black" />
                </div>
                
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] transition-colors duration-500 group relative overflow-hidden">
                  {/* Warm ambient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-700" />
                  <div className="relative">
                    <h3 
                      className="text-2xl md:text-3xl font-bold text-white mb-3"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
                    >
                      {t.checkpoint3Title}
                    </h3>
                    <p 
                      className="text-white/50 leading-relaxed mb-4"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                    >
                      {t.checkpoint3Desc}
                    </p>
                    <p 
                      className="text-white/30 text-sm italic group-hover:text-amber-400/60 transition-colors duration-500"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                    >
                      {t.checkpoint3Subtext}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Mama Chowk */}
              <motion.div
                initial={{opacity: 0, x: 25}}
                whileInView={{opacity: 1, x: 0}}
                viewport={{once: true, margin: "-50px"}}
                transition={{duration: 0.7, delay: 0.1, ease: easing.easeOutQuart}}
                className="relative pl-12 md:pl-24"
              >
                <div className="absolute left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 top-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400/50 border-2 border-black" />
                </div>
                
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] transition-colors duration-500 group">
                  <h3 
                    className="text-2xl md:text-3xl font-bold text-white mb-3"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
                  >
                    {t.checkpoint4Title}
                  </h3>
                  <p 
                    className="text-white/50 leading-relaxed mb-4"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                  >
                    {t.checkpoint4Desc}
                  </p>
                  <p 
                    className="text-white/30 text-sm italic group-hover:text-orange-400/60 transition-colors duration-500"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.checkpoint4Subtext}
                  </p>
                </div>
              </motion.div>

              {/* FINISH - Modi Ground */}
              <motion.div
                initial={{opacity: 0, y: 25}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: "-50px"}}
                transition={{duration: 0.9, delay: 0.15, ease: easing.easeOutQuart}}
                className="relative pl-12 md:pl-24"
              >
                <div className="absolute left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 top-2">
                  <div className="relative">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-black" />
                    <div 
                      className="absolute -inset-2 rounded-full border border-orange-400/30"
                      style={{
                        boxShadow: "0 0 20px rgba(251,146,60,0.3)",
                      }}
                    />
                  </div>
                </div>
                
                <div 
                  className="relative rounded-2xl p-6 md:p-8 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(251,146,60,0.08) 0%, rgba(234,88,12,0.04) 100%)",
                    border: "1px solid rgba(251,146,60,0.2)",
                  }}
                >
                  {/* Steady glow effect */}
                  <div 
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20"
                    style={{
                      background: "radial-gradient(circle, rgba(251,146,60,0.6) 0%, transparent 70%)",
                    }}
                  />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span 
                        className="px-3 py-1 rounded-full bg-orange-500/30 text-orange-300 text-xs font-medium tracking-wider uppercase"
                        style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                      >
                        {t.finish}
                      </span>
                    </div>
                    <h3 
                      className="text-2xl md:text-3xl font-bold text-white mb-3"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
                    >
                      {t.checkpoint5Title}
                    </h3>
                    <p 
                      className="text-xl text-white/70 leading-relaxed mb-4"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
                    >
                      {t.checkpoint5Desc}
                    </p>
                    <p 
                      className="text-2xl font-medium"
                      style={{
                        fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif",
                        background: "linear-gradient(90deg, #fde68a, #fb923c)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t.checkpoint5Highlight}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Route Summary */}
          <motion.div
            initial={{opacity: 0, y: 15}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.7, delay: 0.2, ease: easing.easeOut}}
            className="mt-20 text-center"
          >
            <p 
              className="text-white/30 text-sm tracking-widest uppercase mb-6"
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
            >
              {t.totalDistance}
            </p>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-bold text-orange-400">5 KM</span>
                <p 
                  className="text-white/40 text-sm mt-1"
                  style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                >
                  {t.zenithMarathon}
                </p>
              </div>
            </div>
            <p 
              className="mt-8 text-white/40 italic max-w-md mx-auto"
              style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
            >
              {t.routeQuote}
            </p>
          </motion.div>

          {/* Route Map - Integrated */}
          <motion.div
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8, delay: 0.2, ease: easing.easeOut}}
            className="mt-20 relative rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(251,146,60,0.15)",
              boxShadow: "0 0 60px rgba(251,146,60,0.08)",
            }}
          >
            {/* Map Header */}
            <div 
              className="p-4 text-center"
              style={{
                background: "linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(15,15,15,1) 100%)",
                borderBottom: "1px solid rgba(251,146,60,0.1)",
              }}
            >
              <span 
                className="text-xs tracking-[0.3em] uppercase text-orange-400/50"
                style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
              >
                {t.liveRoute}
              </span>
            </div>

            {/* Map iframe */}
            <div className="relative w-full h-[350px] md:h-[450px] bg-gray-900">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d15087.123456789!2d77.3!3d19.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e2!4m5!1s0x3bd1d5d5d5d5d5d5%3A0x1234567890abcdef!2sZudio%2C%20Nanded%2C%20Maharashtra!3m2!1d19.15!2d77.31!4m5!1s0x3bd1d5d5d5d5d5d5%3A0xfedcba0987654321!2sModi%20Ground%2C%20Nanded%2C%20Maharashtra!3m2!1d19.14!2d77.32!5e0!3m2!1sen!2sin!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.2) contrast(1.05)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Marathon Route Map"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/10" />
            </div>

            {/* Route Info Bar */}
            <div 
              className="p-5 flex flex-wrap items-center justify-between gap-4"
              style={{
                background: "linear-gradient(180deg, rgba(15,15,15,1) 0%, rgba(10,10,10,1) 100%)",
                borderTop: "1px solid rgba(251,146,60,0.1)",
              }}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-white/60 text-sm">Zudio</span>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400/40" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className="text-white/60 text-sm">Modi Ground</span>
                </div>
              </div>
              
              <a 
                href="https://maps.google.com/?q=Zudio,Nanded,Maharashtra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-medium bg-white/5 text-white/50 hover:bg-orange-500/20 hover:text-orange-400 transition-all duration-300"
                style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
              >
                {t.openInMaps}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Race Information Section */}
      <section id="race-info" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle
            title={t.raceInfoTitle}
            subtitle={t.raceInfoSubtitle}
            language={language}
            marathiFonts={marathiFonts}
          />

          {/* Main Race Card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden mb-8"
            style={{
              background: "linear-gradient(145deg, rgba(30,30,30,1) 0%, rgba(15,15,15,1) 100%)",
              border: "1px solid rgba(251,146,60,0.3)",
              boxShadow: "0 0 60px rgba(251,146,60,0.1)",
            }}
            initial={{opacity: 0, y: 25}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.7, ease: easing.easeOutQuart}}
          >
            {/* Gradient header */}
            <div className="h-2 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600" />

            <div className="p-8 md:p-10">
              {/* Title Row */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">🏃</span>
                  <div>
                    <h3 
                      className="text-3xl md:text-4xl font-black text-white"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
                    >
                      {t.zenithMarathon}
                    </h3>
                    <p 
                      className="text-white/50 text-lg"
                      style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                    >
                      {t.raceCardSubtitle}
                    </p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <span 
                    className="text-5xl md:text-6xl font-black"
                    style={{
                      background: "linear-gradient(135deg, #fb923c, #dc2626)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    5 KM
                  </span>
                  <p 
                    className="text-white/40 text-sm"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.allLevels}
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-black/40 rounded-xl p-4 text-center border border-white/5">
                  <span className="text-2xl mb-2 block">📅</span>
                  <p 
                    className="text-white/40 text-xs uppercase tracking-wider mb-1"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.date}
                  </p>
                  <p className="text-white font-bold">{language === 'mr' ? '१४ फेब्रु, २०२६' : 'Feb 14, 2026'}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 text-center border border-white/5">
                  <span className="text-2xl mb-2 block">⏰</span>
                  <p 
                    className="text-white/40 text-xs uppercase tracking-wider mb-1"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.startTime}
                  </p>
                  <p className="text-white font-bold">{language === 'mr' ? 'सकाळी ६:००' : '6:00 AM'}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 text-center border border-white/5">
                  <span className="text-2xl mb-2 block">📍</span>
                  <p 
                    className="text-white/40 text-xs uppercase tracking-wider mb-1"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.startPoint}
                  </p>
                  <p className="text-white font-bold">{language === 'mr' ? 'झुडिओ, नांदेड' : 'Zudio, Nanded'}</p>
                </div>
                <div className="bg-black/40 rounded-xl p-4 text-center border border-white/5">
                  <span className="text-2xl mb-2 block">🏁</span>
                  <p 
                    className="text-white/40 text-xs uppercase tracking-wider mb-1"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.finishPoint}
                  </p>
                  <p className="text-white font-bold">{language === 'mr' ? 'मोदी ग्राउंड' : 'Modi Ground'}</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <h4 
                  className="text-white/60 text-sm uppercase tracking-wider mb-4"
                  style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                >
                  {t.whatsIncluded}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[t.finisherMedal, t.tShirt, t.refreshments, t.eCertificate, t.cashPrizes].map((item, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-2 bg-orange-500/10 rounded-lg px-3 py-2.5 border border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-300"
                    >
                      <span className="text-orange-400 text-base">✓</span>
                      <span 
                        className="text-white text-sm font-medium"
                        style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Fee & CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                <div className="flex items-baseline gap-2">
                  <span 
                    className="text-white/50 text-sm"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.registrationFee}
                  </span>
                  <span 
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.headline : "'Oswald', sans-serif" }}
                  >
                    {language === 'mr' ? '₹९९' : '₹99'}
                  </span>
                  <span 
                    className="text-white/40"
                    style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                  >
                    {t.perPerson}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/marathon")}
                  className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 text-lg"
                  style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                >
                  {t.registerNow}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Route Summary */}
          <motion.div
            className="bg-black/40 rounded-2xl p-6 border border-white/5"
            initial={{opacity: 0, y: 15}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.5, delay: 0.2, ease: easing.easeOutQuart}}
          >
            <h4 
              className="text-white/60 text-sm uppercase tracking-wider mb-4"
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
            >
              {t.route}
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm md:text-base">
              <span className="text-green-400 font-medium">{language === 'mr' ? 'झुडिओ' : 'Zudio'}</span>
              <span className="text-white/30">→</span>
              <span className="text-blue-400 font-medium">{language === 'mr' ? 'राम सेतू तलाव' : 'Ram Setu Pool'}</span>
              <span className="text-white/30">→</span>
              <span className="text-purple-400 font-medium">{language === 'mr' ? 'रवी नगर' : 'Ravi Nagar'}</span>
              <span className="text-white/30">→</span>
              <span className="text-amber-400 font-medium">{language === 'mr' ? 'मामा चौक' : 'Mama Chowk'}</span>
              <span className="text-white/30">→</span>
              <span className="text-orange-400 font-medium">{language === 'mr' ? 'मोदी ग्राउंड' : 'Modi Ground'}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle 
            title={t.scheduleTitle} 
            subtitle={t.scheduleSubtitle}
            language={language}
            marathiFonts={marathiFonts}
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-yellow-500 to-orange-500" />

            {(language === 'mr' ? timelineMr : timeline).map((item, i) => (
              <motion.div
                key={i}
                className="relative pl-20 pb-8"
                initial={{opacity: 0, x: -15}}
                whileInView={{opacity: 1, x: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5, delay: i * 0.08, ease: easing.easeOutQuart}}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 border-4 border-black" />

                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p 
                        className="text-orange-400 font-bold"
                        style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                      >
                        {item.time}
                      </p>
                      <p 
                        className="text-white text-lg"
                        style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
                      >
                        {item.event}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - "The Quiet Conversation" */}
      <section id="faq" className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)" }}>
        {/* Soft ambient background */}
        <div className="absolute inset-0">
          {/* Gentle floating orbs */}
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Section Header - Empathetic intro */}
          <motion.div
            initial={{opacity: 0, y: 25}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8, ease: easing.easeOutQuart}}
            className="text-center mb-16 md:mb-20"
          >
            <span 
              className="text-xs tracking-[0.5em] uppercase text-orange-400/40 font-medium mb-6 block"
              style={{ 
                fontFamily: language === 'mr' ? marathiFonts.body : undefined,
                letterSpacing: language === 'mr' ? "0.25em" : undefined,
              }}
            >
              {t.faqLabel}
            </span>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-light text-white/90 mb-6"
              style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
            >
              {t.faqTitle1}{" "}
              <span 
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #fb923c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.faqTitle2}
              </span>
            </h2>
            <p 
              className="text-white/30 max-w-lg mx-auto text-lg leading-relaxed"
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
            >
              {t.faqSubtitle}
            </p>
          </motion.div>

          {/* FAQ Cards - Collapsible */}
          <div className="space-y-4">
            {(language === 'mr' ? faqsMr : faqs).map((faq, i) => (
              <FAQCard key={i} faq={faq} index={i} language={language} marathiFonts={marathiFonts} />
            ))}
          </div>

          {/* Closing reassurance */}
          <motion.div
            initial={{opacity: 0, y: 15}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.7, delay: 0.2, ease: easing.easeOut}}
            className="text-center mt-16 md:mt-20"
          >
            <p 
              className="text-white/25 text-lg italic"
              style={{ fontFamily: language === 'mr' ? marathiFonts.literary : "'Playfair Display', Georgia, serif" }}
            >
              {t.faqClosing1}
              <br className="hidden sm:block" />
              <span className="text-orange-400/50">{t.faqClosing2}</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{opacity: 0, y: 25}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.8, ease: easing.easeOutQuart}}
          >
            <h2 
              className="text-4xl md:text-5xl font-black mb-6"
              style={{ fontFamily: language === 'mr' ? marathiFonts.headline : undefined }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500">
                {t.finalCtaTitle}
              </span>
            </h2>
            <p 
              className="text-xl text-gray-300 mb-8"
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
            >
              {t.finalCtaSubtitle}
            </p>

            <button
              onClick={() => navigate("/marathon")}
              className="px-12 py-5 rounded-full font-bold text-xl text-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 hover:shadow-2xl hover:shadow-orange-500/40 transition-all transform hover:scale-105"
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
            >
              🏃 {t.finalCtaButton}
            </button>

            <p 
              className="mt-6 text-gray-500"
              style={{ fontFamily: language === 'mr' ? marathiFonts.body : undefined }}
            >
              {t.finalCtaNote}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Inner Voice Text - Emotional scroll-triggered text
const InnerVoiceText = ({text, delay = 0}) => (
  <motion.p
    initial={{opacity: 0, y: 25}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true, margin: "-50px"}}
    transition={{duration: 0.8, delay, ease: easing.easeOutQuart}}
    className="text-2xl sm:text-3xl md:text-4xl text-white/60 font-light mb-6 leading-relaxed"
  >
    {text}
  </motion.p>
);

// Section Title Component
const SectionTitle = ({title, subtitle, language, marathiFonts}) => (
  <motion.div
    className="text-center mb-12"
    initial={{opacity: 0, y: 15}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{once: true}}
    transition={{duration: 0.5, ease: easing.easeOutQuart}}
  >
    <h2 
      className="text-4xl md:text-5xl font-bold text-white mb-2"
      style={{ fontFamily: language === 'mr' ? marathiFonts?.headline : undefined }}
    >
      {title}
    </h2>
    <p 
      className="text-orange-400"
      style={{ fontFamily: language === 'mr' ? marathiFonts?.body : undefined }}
    >
      {subtitle}
    </p>
  </motion.div>
);

// FAQ Card Component - Smooth collapsible with CSS grid trick
const FAQCard = ({faq, index, language, marathiFonts}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-30px"}}
      transition={{duration: 0.5, delay: index * 0.06, ease: easing.easeOutQuart}}
    >
      <div 
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'ring-1 ring-orange-400/20' : ''
        }`}
        style={{
          background: isOpen 
            ? "linear-gradient(135deg, rgba(251,146,60,0.03) 0%, rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.04)",
          boxShadow: isOpen ? "0 8px 40px rgba(251,146,60,0.08)" : "0 4px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* Clickable Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left group"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className={`text-2xl transition-all duration-300 ${isOpen ? 'opacity-100 scale-110' : 'opacity-50 group-hover:opacity-80'}`}>
              {faq.icon}
            </span>
            <p 
              className={`text-lg md:text-xl font-light italic transition-colors duration-300 ${
                isOpen ? 'text-white/90' : 'text-white/60 group-hover:text-white/80'
              }`}
              style={{ fontFamily: language === 'mr' ? marathiFonts?.literary : "'Playfair Display', Georgia, serif" }}
            >
              "{faq.thought}"
            </p>
          </div>
          
          {/* Toggle Icon - Smooth rotation */}
          <div 
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen 
                ? 'bg-orange-400/20 rotate-180' 
                : 'bg-white/5 group-hover:bg-white/10'
            }`}
          >
            <svg 
              className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-orange-400' : 'text-white/40'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {/* Collapsible Content - CSS Grid trick for smooth height animation */}
        <div 
          className="grid transition-all duration-300 ease-out"
          style={{
            gridTemplateRows: isOpen ? '1fr' : '0fr',
          }}
        >
          <div className="overflow-hidden">
            <div className="px-5 md:px-6 pb-6 pt-0">
              {/* Subtle divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />
              
              {/* The gentle answer */}
              <div className="pl-12 md:pl-14">
                <p 
                  className="text-white/50 leading-relaxed text-base md:text-lg"
                  style={{ fontFamily: language === 'mr' ? marathiFonts?.body : "'Inter', sans-serif" }}
                >
                  {faq.voice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarathonPage;
