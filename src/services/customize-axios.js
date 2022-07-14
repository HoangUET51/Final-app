import axios from "axios";

const instance = axios.create({
  baseURL: "https://reqres.in",
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : { status: response.status }; // nếu không có data thì trả về obj status
  },
  function (error) {
    let res = {};
    if (error.response) {
      // Request made and server responded
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    return res;
  }
);
export default instance;
