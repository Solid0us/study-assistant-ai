import { useParams } from "react-router";

const useUrlId = (paramName = "id") => {
  const params = useParams();
  return params[paramName];
};

export default useUrlId;
