import { message } from "antd";
import axios from "axios";

const instance = axios.create({
     
     timeout: 10000, // 5s
});

instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    message.success("请求成功")
    return res
    
  },
  error => {
    console.log('err' + error) // for debug
    message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
);

export default instance;

    

