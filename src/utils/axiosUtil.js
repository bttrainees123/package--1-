import axios from 'axios';
import { removeAuth } from '../helpers/auth';
import { defaultConfig } from '../config';

const axiosInt = axios.create({
  baseURL: defaultConfig.baseAPIUrl
}
);

axiosInt.interceptors.response.use(
  (response) => {

    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      removeAuth();
      window.location.href = '/';
    }
    // Promise.reject(
    //   (error?.response && error?.response?.data) || 'There is an error!'
    // )
  }

);

export default axiosInt;
