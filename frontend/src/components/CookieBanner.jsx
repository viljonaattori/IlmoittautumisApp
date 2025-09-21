import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookiesAccepted");
    if (!stored) {
      setVisible(true);
    } else {
      const expiry = parseInt(stored, 10);
      if (Date.now() > expiry) {
        setVisible(true);
      }
    }
  }, []);

  // Vanhenemisaika on päivä
  const acceptCookies = () => {
    const expiresDays = 1;
    const expiryDate = Date.now() + expiresDays * 24 * 60 * 60 * 1000;
    localStorage.setItem("cookiesAccepted", expiryDate.toString());
    setVisible(false);
  };

  const declineCookies = () => {
    const confirm = window.confirm(
      "Et voi käyttää sovelluksen toimintoja ilman evästeiden hyväksymistä, haluatko jatkaa?"
    );
    if (!confirm) {
      return;
    }

    // Tyhjennetään mahdolliset tiedot ja piilotetaan banneri
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cookiesAccepted");
    setVisible(false);
  };

  if (!visible) return null;

  const bannerStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "#222",
    color: "#fff",
    padding: "1em",
    textAlign: "center",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  };

  const buttonStyle = {
    background: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "0.5em 1em",
    cursor: "pointer",
    borderRadius: "4px",
  };

  const declineButtonStyle = {
    ...buttonStyle,
    background: "#f44336",
  };

  return (
    <div style={bannerStyle}>
      Tämä sovellus tallentaa selaimeesi tunnistetietoja kirjautumisen
      ylläpitämiseksi.
      <button style={buttonStyle} onClick={acceptCookies}>
        Hyväksy
      </button>
      <button style={declineButtonStyle} onClick={declineCookies}>
        Hylkää
      </button>
    </div>
  );
}
