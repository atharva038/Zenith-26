import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {Instagram, Mail, Phone, MapPin} from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative py-16 px-6 bg-gradient-to-b from-black via-[#0a0604] to-black border-t border-[#3a2416]">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-3 gap-12 mb-12">
          {/* Logo & Brand Section */}
          <div className="text-center lg:text-left">
            <motion.div
              className="flex justify-center lg:justify-start mb-6"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, ease: "easeOut"}}
            >
              <img src={logo} alt="Zenith Logo" className="h-24 w-auto" />
            </motion.div>

            <motion.h3
              className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] mb-4"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, ease: "easeOut", delay: 0.1}}
            >
              ZENITH 2026
            </motion.h3>

            <motion.p
              className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto lg:mx-0"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, ease: "easeOut", delay: 0.2}}
            >
              SGGSIE&T Annual Sports Festival
              <br />
              <span className="text-[#ffb36a] font-semibold text-sm">
                Where Champions Rise
              </span>
            </motion.p>
          </div>

          {/* Quick Links Section */}
          <div className="text-center">
            <motion.h4
              className="text-xl font-semibold text-[#ffb36a] mb-6"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, ease: "easeOut"}}
            >
              Quick Links
            </motion.h4>

            <motion.div
              className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-sm mx-auto"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, ease: "easeOut", delay: 0.1}}
            >
              <Link
                to="/home"
                className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
              >
                Home
              </Link>
              <Link
                to="/team"
                className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
              >
                Team
              </Link>
              <Link
                to="/gallery"
                className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
              >
                Gallery
              </Link>
              <Link
                to="/register"
                className="text-gray-300 hover:text-[#ffb36a] transition-colors duration-300 font-medium py-2 text-sm text-center block"
              >
                Register
              </Link>
            </motion.div>
          </div>

          {/* Connect With Us Section */}
          <div className="text-center">
            <motion.h4
              className="text-xl font-semibold text-[#ffb36a] mb-6"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, ease: "easeOut"}}
            >
              Connect With Us
            </motion.h4>

            {/* Social Media Icons */}
            <motion.div
              className="flex justify-center gap-4 mb-6"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, ease: "easeOut", delay: 0.1}}
            >
              <motion.a
                href="https://www.instagram.com/zenith_sggs?igsh=djNob2lwbXg2aGdi"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.95}}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#ffb36a] to-[#ff8b1f] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                  <Instagram size={20} className="text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#ffb36a] to-[#ff8b1f] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </motion.a>

              <motion.a
                href="mailto:zenith@sggs.ac.in"
                className="group relative"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.95}}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#d97706] to-[#ffb36a] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-600/25 transition-all duration-300">
                  <Mail size={20} className="text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#d97706] to-[#ffb36a] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </motion.a>

              <motion.a
                href="tel:+919356463943"
                className="group relative"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.95}}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#ea580c] to-[#f97316] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-orange-700/25 transition-all duration-300">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </motion.a>

              <motion.a
                href="https://goo.gl/maps/qdH2ab7UjYGfyPJs6"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.95}}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#b45309] to-[#d97706] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-amber-600/25 transition-all duration-300">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#b45309] to-[#d97706] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </motion.a>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="text-gray-400 text-sm space-y-1"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, ease: "easeOut", delay: 0.2}}
            >
              <p className="flex items-center justify-center gap-2">
                <Mail size={14} className="text-[#ffb36a]" />
                zenith@sggs.ac.in
              </p>
              <p className="flex items-center justify-center gap-2">
                <Phone size={14} className="text-[#ffb36a]" />
                +91 93564 63943
              </p>
            </motion.div>

            {/* Mini Map */}
            <motion.div
              className="mt-6"
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, ease: "easeOut", delay: 0.3}}
            >
              <a
                href="https://goo.gl/maps/qdH2ab7UjYGfyPJs6"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="relative mx-auto w-full max-w-[280px] h-[120px] rounded-xl overflow-hidden border border-[#3a2416]/50 hover:border-[#ffb36a]/40 transition-all duration-300">
                  {/* Map iframe */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.123456789!2d77.31389!3d19.1028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd1d9a9a9a9a9a9%3A0x1234567890abcdef!2sSGGSIE%26T%2C%20Nanded!5e0!3m2!1sen!2sin!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "grayscale(0.7) contrast(1.1)" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SGGSIE&T Location"
                    className="pointer-events-none"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 group-hover:opacity-80 transition-opacity duration-300" />
                  {/* Location label */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                    <MapPin size={12} className="text-[#ffb36a]" />
                    <span className="text-white/80 text-xs font-medium truncate">SGGSIE&T, Nanded</span>
                    <span className="ml-auto text-[#ffb36a] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View →
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="pt-12 mt-8 border-t border-[#3a2416]/50"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, ease: "easeOut", delay: 0.3}}
        >
          <div className="text-center space-y-4">
            <p className="text-gray-500 text-sm">
              © 2026 SGGSIE&T Zenith. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with <span className="text-red-500">❤️</span> by{" "}
              <span className="text-[#ffb36a] font-medium">Atharva Joshi</span>{" "}
              & <span className="text-[#ffb36a] font-medium">Zenith Web Team</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background Gradient Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-[#ffb36a]/5 to-[#ff8b1f]/5 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;
