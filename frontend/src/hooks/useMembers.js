import { useState, useEffect } from "react";

export default function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://ilmoittautumisapp.onrender.com/api/joukkueet/members",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Virhe haussa");
      setMembers(data.members || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm("Poistetaanko tämä jäsen?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://ilmoittautumisapp.onrender.com/api/joukkueet/members/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Poisto epäonnistui");
      }
      fetchMembers();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return { members, loading, error, fetchMembers, deleteMember };
}
