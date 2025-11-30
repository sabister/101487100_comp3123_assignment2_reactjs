import api from "./api";

export const getEmployees = () => {
  return api.get("/employees");
};

export const searchEmployees = (params) => {
  return api.get("/employees/search", { params });
};

export const getEmployee = (id) => {
  return api.get(`/employees/${id}`);
};

export const createEmployee = (formData) => {
  return api.post("/employees", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const updateEmployee = (id, formData) => {
  return api.put(`/employees/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteEmployee = (id) => {
  return api.delete(`/employees/${id}`);
};
