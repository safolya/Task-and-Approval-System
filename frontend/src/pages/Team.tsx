import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    api.get("/teams").then(res => setTeams(res.data.teams));
  }, []);

  const createTeam = async () => {
    await api.post("/create/team", { name });
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Your Teams</h2>

      <input placeholder="Team name" onChange={e => setName(e.target.value)} />
      <button onClick={createTeam}>Create</button>

      {teams.map(t => (
        <div key={t._id} className="border p-2 mt-2">
          {t.name}
        </div>
      ))}
    </div>
  );
}
