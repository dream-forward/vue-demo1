import axios from "axios";

let base = "http://localhost:8001";
//修改
export const editUser = params => {
  return axios.get(base + "/student/student/updateStu", { params: params });
};
//添加
export const addUser = params => {
  return axios.get(base + "/student/student/addStu", { params: params });
};
