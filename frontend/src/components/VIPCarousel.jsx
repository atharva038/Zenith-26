import {useState, useEffect, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";

const VIPCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef(null);

  // VIP Guests Data - Replace with actual guest photos
 const vipGuests = [
   {
    id: 7,
    name: "Mr. Rishana K Devadiga",
    designation: "Captain of Maharashtra Kabaddi Team and UP Yoddha",
    year: "Zenith 2019 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dqki29mbg/image/upload/v1708458744/Zenith-24/bwm84dbzmcwms62g1j3b.jpg",
  },
  {
    id: 8,
    name: "Mr. Vishal Mane",
    designation:
      "First player to complete 100 PKL matches, Top Defender of Dabangg Delhi K.C.",
    year: "Zenith 2019 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dqki29mbg/image/upload/v1708458745/Zenith-24/ceuxn5zq5wxvjhali4vo.png",
  },
  {
    id: 9,
    name: "Mr. Murali Krishna",
    designation: "Indian Basketball Captain",
    year: "Zenith 2020 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dqki29mbg/image/upload/v1708458779/Zenith-24/ixsbnrw62yf7zxguibp5.jpg",
  },
  {
    id: 10,
    name: "Mr. Sachin Baby",
    designation: "RCB Left-hand Batsman (2016–17 & 2021)",
    year: "Zenith 2022 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dqki29mbg/image/upload/v1708459688/Zenith-24/pl2guez2miasibgq1vgl.png",
  },
  {
    id: 11,
    name: "Mr. Sangram Choughle",
    designation: "Mr. Universe, Mr. Asia, Mr. India",
    year: "Zenith 2017 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dqki29mbg/image/upload/v1708458745/Zenith-24/vmpnvp1atxin1lz3icdj.png",
  },
  {
    id: 12,
    name: "Mr. Unmukt Chand",
    designation: "Indian Cricketer, U-19 World Cup Captain (2012)",
    year: "Zenith 2018 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dqki29mbg/image/upload/v1708458745/Zenith-24/euntdtajxj1exz5te9mh.png",
  },
  {
    id: 13,
    name: "Mr. Sambhaji Kadam",
    designation:
      "Former Indian Basketball Captain, Head Coach of Army Team",
    year: "Zenith 2021 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dqki29mbg/image/upload/v1708459687/Zenith-24/yhsbo0ojfpglgjmxudjs.png",
  },
  {
    id: 14,
    name: "Mr. Pardeep Narwal",
    designation: "Former Professional Kabaddi Player",
    year: "Zenith 2024 (Guest of Honour)",
    image:
      "https://res.cloudinary.com/dyamfzeea/image/upload/v1738695799/Images%20of%20guest/gcjiyt8tqu4y2usbqvyx.jpg",
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
