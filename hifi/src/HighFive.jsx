import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

const HighFive = () => {
  const [highFives, setHighFives] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [popupMessages, setPopupMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

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

  // Listen for real-time updates in the highFiveUsers collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "highFiveUsers"), (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp.toDate().toLocaleTimeString();
        return `${data.name} from ${data.location} sent a Hi-Fi! at ${timestamp}`;
      });
      setPopupMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  // Increment the high-five counter
  const handleHighFive = async () => {
    setIsFormVisible(true); // Show the form
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const highFiveRef = doc(db, "highFiveCounter", "global");
    const highFiveSnap = await getDoc(highFiveRef);
    if (highFiveSnap.exists()) {
      const newCount = highFiveSnap.data().count + 1;
      await updateDoc(highFiveRef, { count: newCount });
      setHighFives(newCount);
      // Store user info in highFiveUsers collection
      await addDoc(collection(db, "highFiveUsers"), {
        name,
        location,
        timestamp: new Date(),
      });
      // Reset the form
      setName("");
      setLocation("");
      setIsFormVisible(false);
    }
  };

  // Increment count without form
  const handleIncrementCount = async () => {
    const highFiveRef = doc(db, "highFiveCounter", "global");
    const highFiveSnap = await getDoc(highFiveRef);
    if (highFiveSnap.exists()) {
      const newCount = highFiveSnap.data().count + 1;
      await updateDoc(highFiveRef, { count: newCount });
      setHighFives(newCount);
      // Store anonymous info in highFiveUsers collection
      await addDoc(collection(db, "highFiveUsers"), {
        name: "Anonymous",
        location: "Unknown",
        timestamp: new Date(),
      });
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen w-screen ${isDarkMode ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600' : 'bg-gradient-to-r from-pink-300 via-pink-200 to-yellow-200'}`}
      style={{
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 px-4 py-2 font-bold rounded-md"
        style={{
          backgroundColor: isDarkMode ? '#fff' : '#000',
          color: isDarkMode ? '#000' : '#fff',
          border: '2px solid',
          borderColor: isDarkMode ? '#000' : '#fff',
        }}
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* High-Five Text */}
      <motion.h1
        className="text-8xl font-extrabold mb-12"
        style={{
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: isDarkMode ? "unset" : "#fff",
        }}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        High-Five!
      </motion.h1>

      {/* Count and Emoji */}
      <div className="text-7xl flex items-center justify-center mb-16">
        <span style={{ color: isDarkMode ? '#fff' : '#fff' }}>🫸🏻</span>
        <span
          className="ml-4 font-bold"
          style={{
            color: isDarkMode ? "unset" : "#fff", // Set to pure white in white mode
          }}
        >
          {highFives}
        </span>
        <span style={{ color: isDarkMode ? '#fff' : '#fff' }}>🫷🏻</span>
      </div>

      {/* Button */}
      {!isFormVisible && (
        <motion.button
    onClick={handleHighFive}
    className="relative px-10 py-4 font-bold uppercase tracking-wide rounded-md transition-transform duration-300"
    style={{
      backgroundColor: isDarkMode ? '#fff' : 'transparent', // Transparent for white mode
      color: isDarkMode ? '#000' : '#fff', // Pure white in white mode
      border: "2px solid",
      borderColor: isDarkMode ? '#fff' : 'transparent', // Remove border in white mode
      boxShadow: isDarkMode ? "0 4px 20px rgba(255, 255, 255, 0.1)" : "0 4px 20px rgba(255, 255, 255, 0.5)",
      textTransform: "uppercase",
      fontSize: "1.25rem",


    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    Give a High-Five!
  </motion.button>
      )}

      {/* Form */}
      {isFormVisible && (
        <form
          onSubmit={handleFormSubmit}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg flex flex-col items-center gap-4`}
          style={{
            
            color: isDarkMode ? '#fff' : '#000',
            boxShadow: isDarkMode ? "0 8px 24px rgba(0, 0, 0, 0.5)" : "0 8px 24px rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
          }}
        >
          <h2 className="text-lg font-bold">Enter Your Details</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`border p-2 rounded w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            required
          />
          <input
            type="text"
            placeholder="Your Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`border p-2 rounded w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            required
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold shadow-lg"
              style={{
                background: "linear-gradient(to right, #007BFF, #0056b3)",
                boxShadow: "0 4px 12px rgba(0, 123, 255, 0.5)",
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleIncrementCount}
              className="bg-green-500 text-white px-4 py-2 rounded-md font-bold shadow-lg"
              style={{
                background: "linear-gradient(to right, #28a745, #218838)",
                boxShadow: "0 4px 12px rgba(40, 167, 69, 0.5)",
              }}
            >
              Just Increment
            </button>
          </div>
        </form>
      )}

      {/* Pop-Up Messages Container */}
      <div
        className={`fixed top-1/2 right-4 bottom-4 w-80 overflow-y-auto p-4 rounded-lg shadow-lg flex flex-col gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
        style={{
          background: isDarkMode ? "linear-gradient(to bottom, #333, #444)" : "linear-gradient(to bottom, #FFDFDF, #FFFFC2)",
        }}
      >
        {popupMessages.map((message, index) => (
          <motion.div
            key={index}
            className="px-6 py-3 rounded-lg shadow-lg"
            style={{
              background: isDarkMode ? "linear-gradient(to right, #555, #666)" : "linear-gradient(to right, #FFB3B3, #FFDFBF)",
              boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 4px 12px rgba(255, 183, 183, 0.5)",
              color: isDarkMode ? "#fff" : "#4D4D4D",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HighFive;
