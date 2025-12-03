import React from "react";
import { motion } from "framer-motion";
import laptopView from "@/assets/LandingPage/Images/laptop-view-new.png";
import mobileView from "@/assets/LandingPage/Images/mobile-view-new.png";

const WebsiteView: React.FC = () => {
  return (
    <div className="w-full select-none mx-auto flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-12 py-16">
      <motion.div
        className="cursor-pointer relative"
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        whileHover={{
          scale: 1.05,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        viewport={{ once: true }}
      >
        <img
          src={mobileView}
          loading="lazy"
          alt="Mobile App Preview"
          className="mx-auto rounded-3xl shadow-2xl transition-transform duration-500 ease-in-out h-[480px] w-auto"
        />
      </motion.div>

      <motion.div
        className="cursor-pointer relative"
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        whileHover={{
          scale: 1.05,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.2,
        }}
        viewport={{ once: true }}
      >
        <img
          src={laptopView}
          loading="lazy"
          alt="Desktop App Preview"
          className="mx-auto rounded-2xl shadow-2xl transition-transform duration-500 ease-in-out w-full max-w-[600px] h-auto"
        />
      </motion.div>
    </div>
  );
};

export default WebsiteView;
