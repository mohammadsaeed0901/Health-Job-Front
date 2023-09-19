/** @format */

import Axios from "axios";
import { getLS } from "utility";

// import get from "lodash/get";

class Api {
  _axios;
  service = "core";
  serviceKey = "gx@-t&qTYkN=7dZ";

  constructor() {
    this._axios = Axios.create();
    this.configAxios();
  }

  get axios() {
    return this._axios;
  }

  async get(url, params) {
    let absoluteUrl = process.env.REACT_APP_BASE_URL + url;
    return this._axios.get(absoluteUrl,  params );
  }

  async put(url, data, params) {
    let absoluteUrl = process.env.REACT_APP_BASE_URL + url;
    return this._axios.put(absoluteUrl, data, { params });
  }

  async patch(url, data, params) {
    let absoluteUrl = process.env.REACT_APP_BASE_URL + url;
    return this._axios.patch(absoluteUrl, data, { params });
  }

  async post(url, data, params) {
    let absoluteUrl = process.env.REACT_APP_BASE_URL + url;
    return this._axios.post(absoluteUrl, data, { params });
  }

  async delete(url, params) {
    let absoluteUrl = process.env.REACT_APP_BASE_URL + url;
    return this._axios.delete(absoluteUrl, { params });
  }

  configAxios = () => {
    this.axios.interceptors.request.use((config) => {
      config.headers['service'] = this.service;
      config.headers['service-key'] = this.serviceKey;
      return config;
    });
  
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // if (get(error, "response.status", 400) === 401) {
        //   return this.refreshTokenAndRetry(error);
        // }
        return Promise.reject(error);
      }
    );
  };
}

// export function errorHandler(store , message, errorField) {
//   return (error) =>
//     store.setState({
//       ...store.state,
//       [errorField || "error"]: get(
//         error,
//         "response.data.message",
//         message || "دریافت اطلاعات با خطا مواجه شد"
//       ),
//       loading: false,
//     });
// }


const api = new Api();
export default api;
