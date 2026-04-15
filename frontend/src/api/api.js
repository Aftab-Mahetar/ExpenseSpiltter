import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 15000,
})

export const createGroup = (data) => api.post('/create-group', data)
export const getGroup = (groupId) => api.get(`/group/${groupId}`)
export const addExpense = (groupId, data) => api.post(`/add-expense/${groupId}`, data)
export const getExpenses = (groupId) => api.get(`/expenses/${groupId}`)
export const deleteExpense = (expenseId) => api.delete(`/expense/${expenseId}`)
export const updateExpense = (expenseId, data) => api.put(`/expense/${expenseId}`, data)
export const getSettle = (groupId) => api.get(`/settle/${groupId}`)

export default api
