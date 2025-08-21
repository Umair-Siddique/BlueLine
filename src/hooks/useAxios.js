import { useState, useCallback } from "react";
import axios from "axios";

export const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async ({ route, method, data = null, headers = {}, params = {} }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios({
          url: `${route}`,
          method: method.toLowerCase(),
          data,
          headers,
          params,
          withCredentials: true, // Include cookies with each request
        });
        return response.data;
      } catch (err) {
        if (err.response) {
          // Server responded with a non-2xx status code
          setError(err.response.data);
          throw new Error(
            err.response.data.message ||
              `Request failed with status ${err.response.status}`
          );
        } else if (err.request) {
          // Request made but no response
          setError("No response received from server");
          throw new Error("No response received from server");
        } else {
          // Something else went wrong
          setError(err.message);
          throw err;
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error };
};
