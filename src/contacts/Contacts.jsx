import { useState } from "react";
import { mockContacts } from "../mock/mockReports";

export default function Contacts() {
  const [contacts, setContacts] = useState(mockContacts);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function addContact() {
    // Basic validation
    if (!name.trim() || !phone.trim()) {
      setError("Both name and phone are required.");
      return;
    }
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    const newContact = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
    };

    setContacts([...contacts, newContact]);
    setName("");
    setPhone("");
    setError("");
  }

  function removeContact(id) {
    setContacts(contacts.filter((c) => c.id !== id));
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👥 Trusted Contacts</h2>
      <p style={styles.subtext}>
        These people will be alerted when you trigger SOS.
      </p>

      {/* Add Contact Form */}
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Contact Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.addBtn} onClick={addContact}>
          + Add Contact
        </button>
      </div>

      {/* Contacts List */}
      <div style={styles.list}>
        {contacts.length === 0 && (
          <p style={styles.empty}>No contacts added yet.</p>
        )}
        {contacts.map((contact) => (
          <div key={contact.id} style={styles.card}>
            <div>
              <p style={styles.contactName}>{contact.name}</p>
              <p style={styles.contactPhone}>📞 {contact.phone}</p>
            </div>
            <button
              style={styles.removeBtn}
              onClick={() => removeContact(contact.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Styles ----
const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "24px",
    fontFamily: "sans-serif",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#1a1a1a",
  },
  subtext: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "24px",
  },
  input: {
    padding: "12px 14px",
    fontSize: "15px",
    border: "1.5px solid #ddd",
    borderRadius: "10px",
    outline: "none",
  },
  error: {
    color: "#e53e3e",
    fontSize: "13px",
    margin: "0",
  },
  addBtn: {
    padding: "12px",
    background: "#4F46E5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  empty: {
    color: "#999",
    textAlign: "center",
    fontSize: "14px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: "#F7F8FF",
    borderRadius: "12px",
    border: "1px solid #E0E0FF",
  },
  contactName: {
    fontWeight: "600",
    fontSize: "15px",
    color: "#1a1a1a",
    margin: "0 0 4px 0",
  },
  contactPhone: {
    fontSize: "13px",
    color: "#555",
    margin: "0",
  },
  removeBtn: {
    padding: "8px 14px",
    background: "#FFF0F0",
    color: "#e53e3e",
    border: "1px solid #FFCDD2",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
