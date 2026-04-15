import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGroup, addExpense, getSettle, getExpenses, deleteExpense, updateExpense } from '../api/api'
import ExpenseForm from '../components/ExpenseForm'
import SettleList from '../components/SettleList'
import ExpenseList from '../components/ExpenseList'

export default function GroupPage() {
    const { groupId } = useParams()
    const navigate = useNavigate()

    const [group, setGroup] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [settling, setSettling] = useState(false)
    const [error, setError] = useState('')
    const [expenseError, setExpenseError] = useState('')
    const [activeTab, setActiveTab] = useState('expenses') // 'expenses' | 'settle'
    const [showForm, setShowForm] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)

    const fetchGroup = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const res = await getGroup(groupId)
            setGroup(res.data)

            // Update localStorage entry with fresh name
            const recent = JSON.parse(localStorage.getItem('recentGroups') || '[]')
            const updated = [
                { id: groupId, name: res.data.group_name, currency: res.data.currency },
                ...recent.filter((g) => g.id !== groupId),
            ].slice(0, 5)
            localStorage.setItem('recentGroups', JSON.stringify(updated))
            setLoading(false)
        } catch (err) {
            if (err.response?.status === 404 || err.response?.status === 400) {
                navigate(`/create-group?groupId=${groupId}`, { replace: true })
                return
            }
            
            const apiError = err?.response?.data?.detail 
            const status = err?.response?.status
            if (apiError) {
                setError(`Error ${status}: ${apiError}`)
            } else if (err.request) {
                setError('Network error: Could not reach the server. Please check your connection.')
            } else {
                setError(`An unexpected error occurred: ${err.message}`)
            }
            
            setLoading(false)
        }
    }, [groupId, navigate])

    const fetchSettle = useCallback(async () => {
        try {
            setSettling(true)
            const res = await getSettle(groupId)
            setTransactions(res.data.transactions)
        } catch {
            setTransactions([])
        } finally {
            setSettling(false)
        }
    }, [groupId])

    const fetchExpenses = useCallback(async () => {
        try {
            const res = await getExpenses(groupId)
            setExpenses(res.data)
        } catch {
            setExpenses([])
        }
    }, [groupId])

    useEffect(() => {
        fetchGroup()
        fetchSettle()
        fetchExpenses()
    }, [fetchGroup, fetchSettle, fetchExpenses])

    const handleAddOrUpdateExpense = async (data, id) => {
        setExpenseError('')
        try {
            if (id) {
                await updateExpense(id, data)
            } else {
                await addExpense(groupId, data)
            }
            await fetchExpenses()
            await fetchSettle()
            setShowForm(false)
            setEditingExpense(null)
        } catch (err) {
            setExpenseError(err?.response?.data?.detail || 'Failed to save expense.')
            throw err
        }
    }

    const handleDeleteExpense = async (id) => {
        try {
            await deleteExpense(id)
            await fetchExpenses()
            await fetchSettle()
        } catch (err) {
            console.error(err)
        }
    }

    const openEditForm = (exp) => {
        setEditingExpense(exp)
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingExpense(null)
        setExpenseError('')
    }

    const [copySuccess, setCopySuccess] = useState(false)
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading group…</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <p className="text-5xl mb-4">😕</p>
                    <h2 className="text-xl font-bold mb-2">Group Not Found</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Go Home
                    </button>
                </div>
            </div>
        )
    }

    if (!group) return null;

    return (
        <div className="min-h-screen px-4 py-10">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 gap-4">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-400 hover:text-gray-200 text-sm mb-2 flex items-center gap-1 transition-colors"
                        >
                            ← Home
                        </button>
                        <h1 className="text-3xl font-bold">{group.group_name}</h1>
                        <p className="text-gray-400 mt-1">Currency: <span className="text-brand-300 font-medium">{group.currency}</span></p>
                    </div>
                    <button
                        onClick={handleShare}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium border border-gray-700 transition"
                    >
                        {copySuccess ? '✓ Copied!' : '🔗 Share Group'}
                    </button>
                </div>

                {/* Members */}
                <div className="card mb-6">
                    <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Members</h2>
                    <div className="flex flex-wrap gap-2">
                        {group.members.map((m) => (
                            <span
                                key={m}
                                className="px-3 py-1.5 bg-brand-500/10 border border-brand-500/20 text-brand-300 rounded-full text-sm font-medium"
                            >
                                {m}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6 border border-gray-800">
                    {['expenses', 'settle'].map((tab) => (
                        <button
                            key={tab}
                            id={`tab-${tab}`}
                            onClick={() => {
                                setActiveTab(tab)
                                setShowForm(false)
                                setEditingExpense(null)
                                setExpenseError('')
                            }}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${activeTab === tab
                                ? 'bg-brand-500 text-white shadow'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {tab === 'expenses' ? '💸 Expenses' : '⚡ Settle Up'}
                        </button>
                    ))}
                </div>

                {/* Tab Panels */}
                {activeTab === 'expenses' && (
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">{showForm ? (editingExpense ? 'Edit Expense' : 'Add an Expense') : 'Recent Expenses'}</h2>
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-3 py-1.5 text-sm font-medium bg-brand-500 hover:bg-brand-600 text-white rounded transition"
                                >
                                    + Add New
                                </button>
                            )}
                        </div>

                        {showForm ? (
                            <ExpenseForm
                                members={group.members}
                                currency={group.currency}
                                onSubmit={handleAddOrUpdateExpense}
                                error={expenseError}
                                initialData={editingExpense}
                                onCancel={closeForm}
                            />
                        ) : (
                            <ExpenseList
                                expenses={expenses}
                                currency={group.currency}
                                onEdit={openEditForm}
                                onDelete={handleDeleteExpense}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'settle' && (
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-1">Settle Up</h2>
                        <p className="text-gray-400 text-sm mb-6">Minimized transactions to balance all debts.</p>
                        {settling ? (
                            <p className="text-gray-400 text-sm">Calculating…</p>
                        ) : (
                            <SettleList transactions={transactions} currency={group.currency} />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
