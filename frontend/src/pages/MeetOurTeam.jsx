import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {Phone, Mail, Users, Plus, X} from "lucide-react";
import {motion} from "framer-motion";
import api from "../config/api";
import TeamMemberForm from "../components/TeamMemberForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MeetOurTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [groupedMembers, setGroupedMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/team-members");
      setTeamMembers(response.data.data.teamMembers);
      setGroupedMembers(response.data.data.groupedMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAdded = (newMember) => {
    setTeamMembers((prev) => [...prev, newMember]);

    // Update grouped members
    setGroupedMembers((prev) => {
      const updated = {...prev};
      if (!updated[newMember.committee]) {
        updated[newMember.committee] = [];
      }
      updated[newMember.committee].push(newMember);
      return updated;
    });

    // Close the form
    setShowForm(false);

    // Scroll to team members section to show the newly added member
    setTimeout(() => {
      const teamSection = document.querySelector("[data-team-section]");
      if (teamSection) {
        teamSection.scrollIntoView({behavior: "smooth", block: "start"});
      }
    }, 300);
  };

  // Sparkle animation component (matching mentors section)
  const Sparkle = ({delay = 0, size = 4}) => (
    <motion.div
      className="absolute rounded-full bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"
      style={{
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        willChange: "transform, opacity",
        transform: "translate3d(0,0,0)",
      }}
      initial={{opacity: 0, scale: 0}}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1,
        ease: "easeInOut",
      }}
    />
  );

  const MemberCard = ({member, index, isLeadership = false}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Get gradient based on committee
    const getCommitteeGradient = (committee) => {
      const gradients = {
        "EVENT MANAGEMENT": "from-purple-600 to-blue-600",
        "FOOD & SITE": "from-green-600 to-emerald-600",
        "GUEST MANAGEMENT & HOSPITALITY": "from-pink-600 to-purple-600",
        "GROUND & SITE + DISCIPLINE": "from-orange-600 to-red-600",
        DECORATION: "from-teal-600 to-cyan-600",
        SPONSORSHIP: "from-yellow-600 to-orange-600",
        "MEDIA & WEB": "from-indigo-600 to-purple-600",
        "PRC/PERMISSION": "from-gray-600 to-slate-600",
        FINANCE: "from-blue-600 to-indigo-600",
      };
      return gradients[committee] || "from-gray-600 to-slate-600";
    };

    // Get position styling based on hierarchy
    const getPositionStyling = (position) => {
      if (position === "main") {
        return {
          badge: "bg-gradient-to-r from-yellow-500 to-orange-500 text-black",
          border: "border-yellow-500/50",
          icon: "👑",
          title: "MAIN",
        };
      } else {
        return {
          badge: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
          border: "border-blue-500/50",
          icon: "⭐",
          title: "SJC",
        };
      }
    };

    const positionStyle = getPositionStyling(member.position);

    return (
      <motion.div
        className="group relative h-full"
        initial={{opacity: 0, y: 40}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, margin: "-50px"}}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: "easeOut",
        }}
      >
        {/* Card Container with enhanced hierarchy styling */}
        <div
          className={`relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl ${
            isLeadership ? "p-10 shadow-2xl" : "p-8 shadow-lg"
          } border-2 ${
            positionStyle.border
          } hover:border-[#ffb36a] transition-all duration-500 overflow-hidden h-full flex flex-col ${
            isLeadership
              ? "ring-2 ring-yellow-500/30 hover:ring-yellow-500/50"
              : ""
          }`}
        >
          {/* Hover Sparkles */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(6)].map((_, i) => (
              <Sparkle key={i} delay={i * 0.1} size={4} />
            ))}
          </div>

          {/* Enhanced Gradient Overlay for Leadership */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getCommitteeGradient(
              member.committee
            )} opacity-0 group-hover:opacity-${
              isLeadership ? "20" : "10"
            } transition-opacity duration-500`}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Avatar with Animation */}
            <motion.div
              className="mb-6 flex justify-center relative"
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{duration: 0.5}}
            >
              <img
                src={member.photo}
                alt={member.name}
                className={`${
                  isLeadership ? "w-40 h-40" : "w-32 h-32"
                } rounded-full object-cover border-4 ${
                  isLeadership ? "border-yellow-500/40" : "border-white/20"
                } shadow-lg`}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Team+Member";
                }}
              />

              {/* Position Crown/Star Indicator */}
              <div
                className={`absolute -top-2 -right-2 ${
                  isLeadership ? "text-3xl" : "text-2xl"
                }`}
              >
                {positionStyle.icon}
              </div>
            </motion.div>

            {/* Position Badge */}
            <div className="text-center mb-3">
              <span
                className={`inline-flex items-center ${
                  isLeadership ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"
                } rounded-full font-bold ${positionStyle.badge} shadow-lg`}
              >
                {positionStyle.icon} {positionStyle.title}
              </span>
            </div>

            {/* Name and Committee */}
            <div className="text-center mb-4">
              <h3
                className={`${
                  isLeadership ? "text-3xl" : "text-2xl"
                } font-bold text-white mb-1 group-hover:text-[#ffb36a] transition-colors duration-300`}
              >
                {member.name}
              </h3>
              <p
                className={`${
                  isLeadership ? "text-xl" : "text-lg"
                } font-semibold bg-gradient-to-r ${getCommitteeGradient(
                  member.committee
                )} bg-clip-text text-transparent`}
              >
                {member.committee}
              </p>
            </div>

            {/* Phone Number */}
            <div className="text-center text-sm group-hover:text-gray-300 transition-colors duration-300 flex-grow">
              <div className="flex items-center justify-center text-gray-400 mb-4">
                <Phone size={16} className="mr-2 text-[#ffb36a]" />
                <span>{member.phoneNumber}</span>
              </div>
            </div>

            {/* Decorative Line with hierarchy color */}
            <motion.div
              className={`mt-6 h-1 bg-gradient-to-r from-transparent via-[${
                isLeadership ? "#fbbf24" : "#ffb36a"
              }] to-transparent rounded-full`}
              initial={{scaleX: 0}}
              whileInView={{scaleX: 1}}
              viewport={{once: true}}
              transition={{duration: 0.8, delay: 0.3}}
            />
          </div>
        </div>

        {/* Enhanced Floating Effect for Leadership */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${
            isLeadership ? "from-yellow-500/20" : "from-[#ffb36a]/20"
          } to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`}
          style={{transform: "translateY(10px)"}}
        />
      </motion.div>
    );
  };

  const CommitteeSection = ({committeeName, members}) => {
    // Group members by position for better hierarchy display
    const sortedMembers = members.sort((a, b) => {
      // Sort by position (main first, then sjc) and then by name
      if (a.position !== b.position) {
        return a.position === "main" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    // Filter with case-insensitive and trimmed comparison
    const mainMembers = sortedMembers.filter(
      (member) => member.position?.toString().toLowerCase().trim() === "main"
    );
    const sjcMembers = sortedMembers.filter(
      (member) => member.position?.toString().toLowerCase().trim() === "sjc"
    );

    return (
      <motion.div
        className="mb-20"
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        viewport={{once: true, margin: "-50px"}}
        transition={{duration: 0.7, ease: "easeOut"}}
      >
        <motion.div
          className="text-center mb-16"
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: "-50px"}}
          transition={{duration: 0.7, ease: "easeOut"}}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{scale: 0.8, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "backOut"}}
          >
            <span className="text-4xl">⚡</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] via-[#ff8b1f] to-[#ffb36a]">
            {committeeName}
          </h2>
          <p className="text-gray-400 text-lg">
            {members.length} dedicated team member
            {members.length !== 1 ? "s" : ""}
          </p>

          {/* Decorative Line */}
          <motion.div
            className="mt-6 h-1 bg-gradient-to-r from-transparent via-[#ffb36a] to-transparent rounded-full max-w-xs mx-auto"
            initial={{scaleX: 0}}
            whileInView={{scaleX: 1}}
            viewport={{once: true}}
            transition={{duration: 0.8, delay: 0.2}}
          />
        </motion.div>

        {/* SJC Position Members - NOW FIRST AND LARGER */}
        {sjcMembers.length > 0 && (
          <div className="mb-12">
            <motion.div
              className="text-center mb-8"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.3}}
            >
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2">
                ⭐ SJC Position
              </h3>
              <p className="text-gray-400 text-base">Core Committee Members</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
              {sjcMembers.map((member, index) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  index={index}
                  isLeadership={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Position Members - NOW SECOND AND SMALLER */}
        {mainMembers.length > 0 && (
          <div className="mt-16">
            {/* Divider */}
            {sjcMembers.length > 0 && (
              <motion.div
                className="mb-12 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"
                initial={{scaleX: 0}}
                whileInView={{scaleX: 1}}
                viewport={{once: true}}
                transition={{duration: 0.8}}
              />
            )}

            <motion.div
              className="text-center mb-8"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.4}}
            >
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                👑 Main Position
              </h3>
              <p className="text-gray-400 text-sm">Assistant Members</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainMembers.map((member, index) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  index={index + sjcMembers.length}
                  isLeadership={false}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0604] to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-32 h-32 border-4 border-[#ffb36a]/20 border-t-[#ffb36a] rounded-full mx-auto mb-8"
            animate={{rotate: 360}}
            transition={{duration: 1, repeat: Infinity, ease: "linear"}}
          />
          <motion.p
            className="text-gray-400 text-xl"
            animate={{opacity: [0.5, 1, 0.5]}}
            transition={{duration: 2, repeat: Infinity}}
          >
            Loading our amazing team...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0604] to-black overflow-hidden">
      {/* Navigation */}
      <Navbar />
      
      {/* Background Sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Sparkle key={i} delay={i * 0.4} size={5} />
        ))}
      </div>

      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="inline-block mb-6"
            initial={{scale: 0.8, opacity: 0}}
            whileInView={{scale: 1, opacity: 1}}
            viewport={{once: true}}
            transition={{duration: 0.6, ease: "backOut"}}
          >
            <span className="text-8xl">👥</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] via-[#ff8b1f] to-[#ffb36a]"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, ease: "easeOut"}}
          >
            Meet Our Team
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-gray-400 max-w-3xl mx-auto"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.2, ease: "easeOut"}}
          >
            The passionate individuals working together to make Zenith 2026
            extraordinary
          </motion.p>

          <motion.div
            className="flex items-center justify-center text-lg text-gray-300"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.7, delay: 0.4}}
          >
            <Users size={24} className="mr-2 text-[#ffb36a]" />
            <span>{teamMembers.length} dedicated team members</span>
          </motion.div>
        </div>
      </section>

      {/* Add Team Member Button - Available to Everyone */}
      <section className="relative py-6">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex justify-center">
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] hover:from-[#ff8b1f] hover:to-[#ffb36a] text-black px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg border-2 border-[#3a2416] hover:border-[#ffb36a]"
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              {showForm ? "Cancel" : "Add Team Member"}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Team Member Form - Available to Everyone */}
      {showForm && (
        <section className="relative py-6">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.3}}
              className="bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl p-8 border-2 border-[#3a2416]"
            >
              <TeamMemberForm
                onMemberAdded={handleMemberAdded}
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Team Members Display */}
      <section className="relative py-12 px-6" data-team-section>
        <div className="max-w-7xl mx-auto relative z-10">
          {Object.keys(groupedMembers).length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.7}}
            >
              <motion.div
                className="inline-block mb-6"
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.6, ease: "backOut"}}
              >
                <Users size={80} className="text-gray-600 mx-auto" />
              </motion.div>
              <h2 className="text-3xl font-semibold text-gray-400 mb-4">
                No team members yet
              </h2>
              <p className="text-gray-500 text-lg">
                Add the first team member using the button above!
              </p>
            </motion.div>
          ) : (
            Object.entries(groupedMembers)
              .sort(([a], [b]) => a.localeCompare(b)) // Sort committees alphabetically
              .map(([committee, members]) => (
                <CommitteeSection
                  key={committee}
                  committeeName={committee}
                  members={members}
                />
              ))
          )}
        </div>
      </section>

      {/* Statistics Section */}
      {teamMembers.length > 0 && (
        <section className="relative py-20">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: "-50px"}}
              transition={{duration: 0.7, ease: "easeOut"}}
            >
              <motion.div
                className="inline-block mb-4"
                initial={{scale: 0.8, opacity: 0}}
                whileInView={{scale: 1, opacity: 1}}
                viewport={{once: true}}
                transition={{duration: 0.6, ease: "backOut"}}
              >
                <span className="text-6xl">📊</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] via-[#ff8b1f] to-[#ffb36a]">
                Team Statistics
              </h2>
              <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                Numbers that showcase our incredible team strength
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  value: Object.keys(groupedMembers).length,
                  label: "Committees",
                  gradient: "from-blue-600 to-purple-600",
                  icon: "🏢",
                },
                {
                  value: teamMembers.length,
                  label: "Team Members",
                  gradient: "from-purple-600 to-pink-600",
                  icon: "👥",
                },
                {
                  value: teamMembers.filter((m) => m.position === "main")
                    .length,
                  label: "Main Positions",
                  gradient: "from-green-600 to-teal-600",
                  icon: "⭐",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="group relative"
                  initial={{opacity: 0, y: 40}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true, margin: "-50px"}}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                >
                  <div className="relative bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] rounded-2xl p-8 border-2 border-[#3a2416] hover:border-[#ffb36a] transition-all duration-500 text-center overflow-hidden">
                    {/* Hover Sparkles */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[...Array(4)].map((_, i) => (
                        <Sparkle key={i} delay={i * 0.1} size={3} />
                      ))}
                    </div>

                    {/* Gradient Overlay on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="text-4xl mb-4"
                        whileHover={{
                          scale: 1.2,
                          rotate: [0, -10, 10, -10, 0],
                        }}
                        transition={{duration: 0.5}}
                      >
                        {stat.icon}
                      </motion.div>
                      <motion.div
                        className="text-5xl font-bold mb-3 text-white group-hover:text-[#ffb36a] transition-colors duration-300"
                        initial={{scale: 0}}
                        whileInView={{scale: 1}}
                        viewport={{once: true}}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.2 + 0.3,
                          type: "spring",
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      <div
                        className={`text-xl font-semibold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      >
                        {stat.label}
                      </div>
                    </div>

                    {/* Floating Effect on Hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#ffb36a]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                      style={{transform: "translateY(10px)"}}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom Decorative Quote */}
      {teamMembers.length > 0 && (
        <motion.section
          className="relative py-16 text-center"
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{duration: 1, delay: 0.5}}
        >
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <p className="text-2xl italic text-gray-500 max-w-4xl mx-auto mb-6">
              "Together we create magic, together we achieve greatness - Team
              Zenith 2026"
            </p>
            <div className="flex justify-center gap-3">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="text-[#ffb36a] text-3xl"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ⭐
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MeetOurTeam;
