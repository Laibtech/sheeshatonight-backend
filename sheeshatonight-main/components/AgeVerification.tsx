'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AgeVerification() {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if user already verified
    const verified = localStorage.getItem('ageVerified');
    if (verified === 'true') {
      setIsVerified(true);
    } else {
      // Show modal after 1 second
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleVerify = (isAdult: boolean) => {
    if (isAdult) {
      localStorage.setItem('ageVerified', 'true');
      setIsVerified(true);
      setShowModal(false);
    } else {
      // Redirect to age-restricted page
      window.location.href = 'https://www.google.com';
    }
  };

  if (isVerified) return null;

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="age-verification-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="age-verification-modal"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="age-modal-icon">
              🔞
            </div>
            
            <h2>Age Verification Required</h2>
            
            <p className="age-modal-text">
              You must be <strong>18 years or older</strong> to enter this website.
              <br />
              This site contains tobacco and sheesha related products.
            </p>

            <div className="age-modal-warning">
              ⚠️ By entering, you confirm that you are of legal smoking age in your country.
            </div>

            <div className="age-modal-buttons">
              <motion.button
                className="age-btn age-btn-yes"
                onClick={() => handleVerify(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Yes, I'm 18+
              </motion.button>
              
              <motion.button
                className="age-btn age-btn-no"
                onClick={() => handleVerify(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle className="w-5 h-5" />
                No, I'm Under 18
              </motion.button>
            </div>

            <p className="age-modal-footer">
              Please consume responsibly. Smoking is harmful to health.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
