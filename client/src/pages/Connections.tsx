import { useEffect } from "react";
import { fetchConnections } from "../requests/User";

const Connections = () => {
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchConnections();
      console.log(data);
    };
    fetchData();
  }, []);
  return <div>Connections</div>;
};

export default Connections;
