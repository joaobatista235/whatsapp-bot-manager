import { useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:3000/";

const useApiRequest = ({
  endpoint,
  showToast = false,
  message = "Requisição concluída com sucesso!",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const url = useMemo(() => `${BASE_URL}${endpoint}`, [endpoint]);

  const handleRequest = useCallback(
    (method, body = null, config = {}, id = null) => {
      setLoading(true);
      setError(null);

      const requestUrl = id ? `${url}/${id}` : url;

      return axios({ method, url: requestUrl, data: body, ...config })
        .then((response) => {
          setData(response.data);
          if (showToast) toast.success(message);
          return response.data;
        })
        .catch((err) => {
          const errorMessage = err.response ? err.response.data : err.message;
          setError(errorMessage);
          if (showToast) toast.error(`Erro: ${errorMessage}`);
          throw err;
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [url, showToast]
  );

  const handleGet = useCallback(
    (config = {}) => handleRequest("get", null, config),
    [handleRequest]
  );

  const handleCreate = useCallback(
    (body, config = {}) => handleRequest("post", body, config),
    [handleRequest]
  );

  const handleUpdate = useCallback(
    (body, config = {}) => handleRequest("put", body, config, body?.id),
    [handleRequest]
  );

  const handleDelete = useCallback(
    (id, config = {}) => handleRequest("delete", null, config, id),
    [handleRequest]
  );

  return {
    loading,
    error,
    data,
    handleGet,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

export default useApiRequest;
