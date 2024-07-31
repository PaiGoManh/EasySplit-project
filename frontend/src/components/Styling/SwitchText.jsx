import React, { useState, useEffect } from 'react';

const SwitchText = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    { text: "On trips", color: "aqua" },
    { text: "With friends", color: "blue" },
    { text: "For events", color: "green" },
    { text: "For family", color: "rose" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prevText) => (prevText + 1) % texts.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <span 
      className="transition-opacity duration-1000 ease-in-out" 
      style={{ color: texts[currentText].color }}
    >
      {texts[currentText].text}
    </span>
  );
};

export default SwitchText;
