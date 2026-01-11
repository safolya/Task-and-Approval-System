import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Notifications() {
  const [noti, setNoti] = useState<any[]>([]);

  useEffect(() => {
    api.get("/notifications").then(res => setNoti(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2>Notifications</h2>
      {noti.map(n => (
        <div key={n._id} className="border p-2">
          {n.message}
        </div>
      ))}
    </div>
  );
}
