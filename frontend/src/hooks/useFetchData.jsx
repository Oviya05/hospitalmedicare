import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../config";

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  // 👉 Automatically prepend BASE_URL
  const fullUrl = url.startsWith("http")
    ? url
    : `${BASE_URL}${url}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(fullUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }

        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fullUrl, token]);

  return {
    data,
    loading,
    error,
  };
};

export default useFetchData;
