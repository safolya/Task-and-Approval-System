import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    const res = await api.post("/login", { email, password });
    setUser(res.data.user);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-96 p-6 border rounded">
        <h1 className="text-xl mb-4">Login</h1>
        <input className="input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="input mt-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={submit} className="btn mt-4 w-full">Login</button>
      </div>
    </div>
  );
}
