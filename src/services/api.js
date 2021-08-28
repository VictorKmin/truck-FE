import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
});

const routesAPI = {
    getAll: () =>
        apiInstance.get('/routes').then(({ data }) => data),
    postNewRoute: (route) =>
        apiInstance.post('/routes', { ...route }),
    deleteById: (id) =>
        apiInstance.delete(`/routes/${id}`).then(({ data }) => data),
    setPallets: (id, pallets) =>
        apiInstance.post(`/routes/${id}/pallets`, { pallets }).then(({ data }) => data),
}

export { routesAPI };