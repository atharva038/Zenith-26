import {motion, AnimatePresence} from "framer-motion";

export default function SportModal({isOpen, onClose, sport, onRegister}) {
  if (!sport) return null;

  const handleRegisterClick = () => {
    if (onRegister) {
      onRegister(sport);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
          />

          {/* Modal - Responsive */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center 
                       p-2 sm:p-4 md:p-6"
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.8}}
            transition={{type: "spring", damping: 25, stiffness: 300}}
          >
            <div
              className="bg-gradient-to-br from-black via-gray-900 to-black 
                           border-2 border-[#ffb36a] 
                           rounded-lg sm:rounded-xl md:rounded-2xl 
                           max-w-2xl w-full 
                           max-h-[95vh] sm:max-h-[90vh] 
                           overflow-y-auto 
                           shadow-2xl shadow-[#ffb36a]/20"
            >
              {/* Header - Responsive */}
              <div
                className="relative 
                             p-4 pb-3 sm:p-6 sm:pb-4 md:p-8 md:pb-6 
                             border-b border-[#ffb36a]/30"
              >
                <button
                  onClick={onClose}
                  className="absolute 
                             top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 
                             text-gray-400 hover:text-[#ffb36a] transition-colors 
                             text-xl sm:text-2xl font-bold 
                             w-6 h-6 sm:w-8 sm:h-8 
                             flex items-center justify-center"
                  aria-label="Close modal"
                >
                  ×
                </button>

                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <span className="text-3xl sm:text-5xl md:text-6xl">
                    {sport.icon}
                  </span>
                  <div>
                    <h2
                      className="text-2xl sm:text-3xl md:text-4xl 
                                   font-black text-transparent bg-clip-text 
                                   bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f]"
                    >
                      {sport.name}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
                      {sport.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Responsive */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#ffb36a] mb-1.5 sm:mb-2">
                    About
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {sport.description}
                  </p>
                </div>

                {/* Event Details - Responsive Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div
                    className="bg-black/50 rounded-md sm:rounded-lg 
                                 p-2 sm:p-3 md:p-4 
                                 border border-[#ffb36a]/20"
                  >
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                      Date
                    </p>
                    <p className="text-white font-semibold text-xs sm:text-sm md:text-base">
                      {sport.date}
                    </p>
                  </div>
                  <div
                    className="bg-black/50 rounded-md sm:rounded-lg 
                                 p-2 sm:p-3 md:p-4 
                                 border border-[#ffb36a]/20"
                  >
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                      Venue
                    </p>
                    <p className="text-white font-semibold text-xs sm:text-sm md:text-base">
                      {sport.venue}
                    </p>
                  </div>
                  <div
                    className="bg-black/50 rounded-md sm:rounded-lg 
                                 p-2 sm:p-3 md:p-4 
                                 border border-[#ffb36a]/20"
                  >
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                      Team Size
                    </p>
                    <p className="text-white font-semibold text-xs sm:text-sm md:text-base">
                      {sport.teamSize}
                    </p>
                  </div>
                  <div
                    className="bg-black/50 rounded-md sm:rounded-lg 
                                 p-2 sm:p-3 md:p-4 
                                 border border-[#ffb36a]/20"
                  >
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">
                      Prize Pool
                    </p>
                    <p className="text-white font-semibold text-xs sm:text-sm md:text-base">
                      {sport.prize}
                    </p>
                  </div>
                </div>

                {/* Rules - Responsive */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#ffb36a] mb-2 sm:mb-3">
                    Event Rules
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {sport.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-1.5 sm:gap-2 text-gray-300 text-sm sm:text-base"
                      >
                        <span className="text-[#ffb36a] mt-0.5 sm:mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    onClick={handleRegisterClick}
                    className="flex-1 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] 
                                    text-black font-bold 
                                    py-2.5 sm:py-3 px-4 sm:px-6 
                                    text-sm sm:text-base
                                    rounded-md sm:rounded-lg 
                                    hover:scale-105 transition-transform duration-300 
                                    shadow-lg shadow-[#ffb36a]/30"
                  >
                    Register Now
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 border-2 border-[#ffb36a] text-[#ffb36a] 
                                    font-bold 
                                    py-2.5 sm:py-3 px-4 sm:px-6 
                                    text-sm sm:text-base
                                    rounded-md sm:rounded-lg 
                                    hover:bg-[#ffb36a]/10 transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
