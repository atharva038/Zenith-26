import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Trophy, Phone, Download } from "lucide-react";

const MarathonTermsAndConditions = () => {
  const sections = [
    {
      id: 1,
      title: "Eligibility",
      icon: CheckCircle,
      content: [
        "The marathon is open to all age groups.",
        "Participants below 18 years must have parental/guardian consent.",
        "All participants must be medically fit to run a 5 km distance.",
        "Organizers are not responsible for any health complications during or after the event.",
      ],
    },
    {
      id: 2,
      title: "Registration Details",
      icon: CheckCircle,
      content: [
        "Registration Fee: ₹99/-",
        "Fee Includes: Official Event T-shirt, E-Certificate, Goodies",
        "Registration can be done online via zenithsggs.com or by scanning the QR code on the poster",
        "Registration is non-refundable and non-transferable.",
      ],
    },
    {
      id: 3,
      title: "Reporting & Bib Rules",
      icon: AlertCircle,
      content: [
        "Participants must report at least 30 minutes before race start.",
        "Bib numbers must be worn on the front side and clearly visible at all times.",
        "Tampering with the bib will lead to disqualification.",
      ],
    },
    {
      id: 4,
      title: "Race Route",
      icon: CheckCircle,
      content: [
        "The 5 km route will pass through: Zudio → Ram Setu Pool → Ravi Nagar → Lute Mama Chowk → Modi Ground",
        "Participants must strictly follow the marked route.",
        "Taking shortcuts or deviating from the route will result in disqualification.",
      ],
    },
    {
      id: 5,
      title: "Race Conduct & Discipline",
      icon: AlertCircle,
      content: [
        "Follow instructions given by race marshals and volunteers",
        "Maintain sportsmanship and discipline",
        "Any form of misconduct, obstruction, or unsportsmanlike behavior will lead to immediate disqualification.",
      ],
    },
    {
      id: 6,
      title: "Cut-off Time",
      icon: AlertCircle,
      content: [
        "Maximum Cut-off Time: 1:30 hr",
        "Runners exceeding the cut-off may be asked to stop for safety reasons.",
      ],
    },
    {
      id: 7,
      title: "Safety & Medical Support",
      icon: CheckCircle,
      content: [
        "Medical assistance and volunteers will be available on the route.",
        "Participants feeling unwell must stop immediately and inform the nearest volunteer.",
        "Hydration support will be provided at designated points.",
      ],
    },
    {
      id: 8,
      title: "Prohibited Items",
      icon: AlertCircle,
      content: [
        "Cycles, motor vehicles, or skates",
        "Pets",
        "Alcohol, drugs, or performance-enhancing substances",
        "Any item that may cause obstruction or injury",
      ],
    },
    {
      id: 9,
      title: "Prizes & Certification",
      icon: Trophy,
      content: [
        "Total Prize Pool: ₹50,000/-",
        "Prizes will be distributed as per organizers' classification and rules.",
        "All finishers will receive an E-Certificate.",
        "Organizers' decision regarding results and prizes shall be final.",
      ],
    },
    {
      id: 10,
      title: "Organizer Rights",
      icon: AlertCircle,
      content: [
        "The organizing committee reserves the right to modify the route or schedule due to safety or administrative reasons",
        "Cancel or postpone the event due to unforeseen circumstances",
        "Disqualify participants violating rules",
      ],
    },
    {
      id: 11,
      title: "Liability Disclaimer",
      icon: AlertCircle,
      content: [
        "Participation is at own risk.",
        "Organizers are not liable for any injury, loss, or damage during the event.",
        "By registering, participants agree to abide by all rules and regulations.",
      ],
    },
    {
      id: 12,
      title: "Personal Belongings Advisory",
      icon: AlertCircle,
      content: [
        "Participants are strongly advised not to carry unnecessary or valuable personal belongings during the race.",
        "The organizers will not be responsible for loss, theft, or damage of any personal items.",
      ],
    },
  ];

  const eventDetails = {
    institute: "SHRI GURU GOBIND SINGHJI INSTITUTE OF ENGINEERING & TECHNOLOGY, NANDED",
    eventName: "ZENITH '26 – 5 KM MARATHON",
    date: "14th February 2026",
    time: "06:00 AM – 09:00 AM",
    distance: "5 Kilometres",
    category: "Open for All Age Groups",
  };

  const contacts = [
    {
      name: "Sagar Ubale",
      role: "Sports Secretary",
      phone: "9545956689",
    },
    {
      name: "Swayam Baheti",
      role: "Student Joint",
      phone: "7276218795",
    },
  ];

  const handleDownloadPDF = () => {
    // Use local PDF file
    const link = document.createElement("a");
    link.href = "/Rule Book & Participant Guidelines (1).pdf";
    link.download = "Zenith_Marathon_2026_Rule_Book.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-orange-500/20 py-12 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-200">
            {eventDetails.institute}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mt-6 mb-4 text-orange-400">
            RULE BOOK & PARTICIPANT GUIDELINES
          </h2>
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white inline-block px-6 py-3 rounded-lg mt-4 shadow-lg">
            {eventDetails.eventName}
          </div>
        </div>
      </motion.div>

      {/* Event Details */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Download PDF Button - Below Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Download className="w-5 h-5" />
            Download Rule Book PDF
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-8 border border-gray-700/50"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-orange-400 font-semibold mb-2">📅 DATE</p>
              <p className="text-xl font-bold text-gray-200">{eventDetails.date}</p>
            </div>
            <div>
              <p className="text-orange-400 font-semibold mb-2">⏰ TIME</p>
              <p className="text-xl font-bold text-gray-200">{eventDetails.time}</p>
            </div>
            <div>
              <p className="text-orange-400 font-semibold mb-2">📏 DISTANCE</p>
              <p className="text-xl font-bold text-gray-200">{eventDetails.distance}</p>
            </div>
            <div>
              <p className="text-orange-400 font-semibold mb-2">👥 CATEGORY</p>
              <p className="text-xl font-bold text-gray-200">{eventDetails.category}</p>
            </div>
          </div>
        </motion.div>

        {/* Terms and Conditions Sections */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:bg-gray-800/40 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-orange-600/80 rounded-full p-3">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-4 text-orange-400">
                    {section.id}. {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-orange-400/70 mt-1">▸</span>
                        <span className="text-gray-300 leading-relaxed text-sm">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-orange-500/20"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-orange-400">
            📞 Contact Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {contacts.map((contact, idx) => (
              <div
                key={idx}
                className="bg-gray-700/30 backdrop-blur-md rounded-xl p-6 text-center border border-gray-600/50"
              >
                <p className="text-lg font-bold mb-2 text-gray-200">{contact.name}</p>
                <p className="text-orange-400/80 mb-3 text-sm">{contact.role}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center gap-2 text-xl font-bold text-gray-200 hover:text-orange-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            By registering for this event, you acknowledge that you have read,
            understood, and agree to abide by all the terms and conditions
            mentioned above.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 justify-center">
            <a
              href="/marathon"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Register for Marathon
            </a>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarathonTermsAndConditions;
