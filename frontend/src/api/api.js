import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: API_URL.replace(/\/$/, ''), // Ensure no trailing slash
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
