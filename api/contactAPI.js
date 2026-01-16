import axiosClient from './axiosClient.js';

const contactApi = {
    submit(data) {
        return axiosClient.post('/contacts', data);
    },
    getAll() {
        return axiosClient.get('/contacts');
    },
    reply(id, replyText) {
        return axiosClient.put(`/contacts/${id}/reply`, { replyText });
    },
    delete(id) {
        return axiosClient.delete(`/contacts/${id}`);
    }
};

export default contactApi;