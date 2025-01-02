// filepath: /c:/Wino/HIFI/hi-five/hifi/src/HighFive.jsx
import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const HighFive = () => {
  const [highFives, setHighFives] = useState(0);

  // Fetch the current high-five count from Firestore
  useEffect(() => {
    const fetchHighFives = async () => {
      const docRef = doc(db, "highFiveCounter", "global");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHighFives(docSnap.data().count);
      } else {
        // Initialize the counter if it doesn't exist
        await setDoc(docRef, { count: 0 });
        setHighFives(0);
      }
    };

    fetchHighFives();
  }, []);

  // Increment the high-five counter
  const handleHighFive = async () => {
    const docRef = doc(db, "highFiveCounter", "global");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const newCount = docSnap.data().count + 1;
      await updateDoc(docRef, { count: newCount });
      setHighFives(newCount);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-screen"
      style={{
        backgroundColor: "#000", // Black background
        color: "#fff", // White text
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* High-Five Text */}
      <motion.h1
        className="text-8xl font-extrabold mb-12"
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          background: "linear-gradient(to right, #fff, #555)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        High-Five!
      </motion.h1>

      {/* Count and Emoji */}
      <div className="text-7xl flex items-center justify-center mb-16">
        <span>🫸🏻🫷🏻</span>
        <span className="ml-4 font-bold">{highFives}</span>
      </div>

      {/* Button */}
      <motion.button
        onClick={handleHighFive}
        className="relative px-10 py-4 font-bold uppercase tracking-wide rounded-md transition-transform duration-300"
        style={{
          backgroundColor: "#fff",
          color: "#000",
          border: "2px solid #fff",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
          textTransform: "uppercase",
          fontSize: "1.25rem",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Give a High-Five!
      </motion.button>
    </div>
  );
};

export default HighFive;
