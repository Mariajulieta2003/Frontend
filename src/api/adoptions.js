import API from "./Client";

export const sendAdoptionRequest = async ({ pet_id, message }) => {
  const res = await API.post("/adoptions", { pet_id, message });
  return res.data;
};

export const getMyRequests = async () => {
  const res = await API.get("/adoptions/my");
  return res.data;
};

export const getReceivedRequests = async () => {
  const res = await API.get("/adoptions/received");
  return res.data;
};

export const updateAdoptionStatus = async (id, status) => {
  const res = await API.put(`/adoptions/${id}/status`, { status });
  return res.data;
};
