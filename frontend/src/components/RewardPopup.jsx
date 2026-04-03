import React from "react";

const RewardPopup = ({ show, onClose, qrCode, expiryDate }) => {
  if (!show) return null;

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "reward-qr.png";
    link.click();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>🎉 Congratulations!</h2>
        <p>You unlocked FREE Popcorn & Cold Drink</p>

        <img src={qrCode} alt="QR Code" style={{ width: 200 }} />

        <p style={{ fontSize: "13px", marginTop: "10px" }}>
          Valid till: <b>{expiryDate}</b>
        </p>

        <p style={{ fontSize: "12px" }}>
          Show this QR at cinema counter to redeem
        </p>

        <div style={{ marginTop: "10px" }}>
          <button onClick={downloadQR}>Download QR</button>
          <button onClick={onClose} style={{ marginLeft: "10px" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modal = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
};

export default RewardPopup;