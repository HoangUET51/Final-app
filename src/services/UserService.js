import axios from "./customize-axios";
const FetchAllUser = (page) => {
  return axios.get(`/api/users?page=${page}`);
};

const postCreateUser = (name, job) => {
  return axios.post("/api/users", { name, job });
};
const updateUser = (name, job) => {
  return axios.put("/api/users/", { name, job });
};

const deleteUser = (id) => {
  return axios.delete(`/api/users/${id}`);
};
const loginApi = (email, password) => {
  return axios.post("/api/login/", { email, password });
};
export { FetchAllUser, postCreateUser, updateUser, deleteUser, loginApi };
