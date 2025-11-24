import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";

const VIPCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);

  // VIP Guests Data - Replace with actual guest photos
  const vipGuests = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      designation: "Olympic Gold Medalist",
      year: "Zenith 2023",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Priya Sharma",
      designation: "National Cricket Captain",
      year: "Zenith 2024",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Arjun Mehta",
      designation: "Chess Grandmaster",
      year: "Zenith 2022",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Simran Singh",
      designation: "Pro E-Sports Champion",
      year: "Zenith 2024",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Vikram Malhotra",
      designation: "Athletics World Record Holder",
      year: "Zenith 2023",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Ananya Desai",
      designation: "Badminton International Player",
      year: "Zenith 2025",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % vipGuests.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, vipGuests.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + vipGuests.length) % vipGuests.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % vipGuests.length);
  };

  // Calculate visible cards (show all cards)
  const getVisibleCards = () => {
    return vipGuests.map((_, index) => index);
  };

  const visibleIndices = getVisibleCards();

  // Calculate position relative to current index
  const getCardPosition = (index) => {
    const total = vipGuests.length;
    let position = index - currentIndex;

    // Normalize position to be between -total/2 and total/2
    if (position > total / 2) position -= total;
    if (position < -total / 2) position += total;

    return position;
  };

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative flex items-center justify-center px-4 md:px-12 h-[32rem] md:h-[36rem]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-0 z-20 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
          aria-label="Previous guest"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Cards Container - positioned relative for absolute children */}
        <div className="relative w-full h-full flex items-center justify-center">
          {vipGuests.map((guest, index) => {
            const position = getCardPosition(index);
            const isCenter = position === 0;
            const absPosition = Math.abs(position);

            // Calculate scale and opacity based on distance from center
            const scale = isCenter ? 1 : Math.max(0.7, 1 - absPosition * 0.15);
            const opacity = Math.max(0.3, 1 - absPosition * 0.2);
            const zIndex = 10 - absPosition;

            // Calculate horizontal offset
            const xOffset = position * 280; // Spread cards horizontally

            return (
              <motion.div
                key={guest.id}
                className="absolute"
                initial={{opacity: 0, scale: 0.8}}
                animate={{
                  opacity: opacity,
                  scale: scale,
                  x: xOffset,
                  zIndex: zIndex,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                style={{
                  filter: isCenter ? "none" : `blur(${absPosition * 1}px)`,
                }}
              >
                {/* Card */}
                <motion.div
                  className={`relative group cursor-pointer ${
                    isCenter
                      ? "w-72 h-96 md:w-80 md:h-[28rem]"
                      : "w-64 h-80 md:w-72 md:h-96"
                  }`}
                  whileHover={isCenter ? {scale: 1.05} : {}}
                  transition={{duration: 0.3}}
                  onClick={() => !isCenter && setCurrentIndex(index)}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] blur-xl ${
                      isCenter
                        ? "opacity-40 group-hover:opacity-60"
                        : "opacity-0"
                    } transition-opacity duration-500`}
                  />

                  {/* Card Container */}
                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden border-2 ${
                      isCenter
                        ? "border-[#ffb36a] shadow-2xl shadow-orange-500/20"
                        : "border-[#3a2416]"
                    } bg-gradient-to-br from-[#2a1a11] to-[#1a0f08] transition-all duration-500`}
                  >
                    {/* Guest Photo */}
                    <div className="relative w-full h-full overflow-hidden">
                      <motion.img
                        src={guest.image}
                        alt={guest.name}
                        className="w-full h-full object-cover"
                        animate={{
                          scale: isCenter ? 1 : 1.1,
                        }}
                        whileHover={isCenter ? {scale: 1.1} : {}}
                        transition={{duration: 0.6}}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />

                      {/* Spotlight Effect on Hover */}
                      {isCenter && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          initial={{opacity: 0}}
                          whileHover={{opacity: 1}}
                        />
                      )}
                    </div>

                    {/* Guest Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                      {/* Year Tag */}
                      <motion.div
                        className="inline-block mb-2 px-3 py-1 bg-gradient-to-r from-[#ffb36a]/20 to-[#ff8b1f]/20 border border-[#ffb36a]/40 rounded-full backdrop-blur-sm"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: isCenter ? 1 : 0.7, y: 0}}
                        transition={{delay: 0.2}}
                      >
                        <span className="text-xs md:text-sm text-[#ffb36a] font-medium">
                          Appeared in {guest.year}
                        </span>
                      </motion.div>

                      {/* Name */}
                      <motion.h3
                        className={`font-bold text-white mb-1 ${
                          isCenter
                            ? "text-xl md:text-2xl"
                            : "text-lg md:text-xl"
                        }`}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: isCenter ? 1 : 0.8, y: 0}}
                        transition={{delay: 0.3}}
                      >
                        {guest.name}
                      </motion.h3>

                      {/* Designation */}
                      <motion.p
                        className={`text-gray-300 ${
                          isCenter
                            ? "text-sm md:text-base"
                            : "text-xs md:text-sm"
                        }`}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: isCenter ? 1 : 0.7, y: 0}}
                        transition={{delay: 0.4}}
                      >
                        {guest.designation}
                      </motion.p>
                    </div>

                    {/* Shine Effect on Hover */}
                    {isCenter && (
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background:
                            "linear-gradient(45deg, transparent 30%, rgba(255, 179, 106, 0.1) 50%, transparent 70%)",
                        }}
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 z-20 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
          aria-label="Next guest"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {vipGuests.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]"
                : "w-2 h-2 bg-gray-600 hover:bg-gray-400"
            }`}
            aria-label={`Go to guest ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VIPCarousel;
