import { useState } from 'react'

export default function ExpenseForm({ members, currency, onSubmit, error, initialData = null, onCancel = null }) {
    const [paidBy, setPaidBy] = useState(initialData?.paid_by || members[0] || '')
    const [amount, setAmount] = useState(initialData?.amount || '')

    // If we have initialData, we can determine splitEqually based on participants length
    const initSplit = initialData ? (initialData.participants.length === members.length) : true
    const initParticipants = initialData ? new Set(initialData.participants) : new Set(members)

    const [splitEqually, setSplitEqually] = useState(initSplit)
    const [participants, setParticipants] = useState(initParticipants)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const toggleParticipant = (member) => {
        setParticipants((prev) => {
            const next = new Set(prev)
            if (next.has(member)) next.delete(member)
            else next.add(member)
            return next
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!amount || isNaN(amount) || Number(amount) <= 0) return
        const parts = splitEqually ? members : [...participants]
        if (parts.length === 0) return

        setLoading(true)
        setSuccess(false)
        try {
            await onSubmit({
                paid_by: paidBy,
                amount: Number(amount),
                participants: parts,
            }, initialData?._id)
            if (!initialData) {
                setAmount('')
                setParticipants(new Set(members))
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            }
        } catch {
            // error handled by parent
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Paid By */}
            <div>
                <label className="label" htmlFor="paid-by">Paid By</label>
                <select
                    id="paid-by"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="input-field"
                >
                    {members.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {/* Amount */}
            <div>
                <label className="label" htmlFor="amount">Amount ({currency})</label>
                <input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field"
                    required
                />
            </div>

            {/* Split toggle */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    id="split-toggle"
                    onClick={() => setSplitEqually(!splitEqually)}
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${splitEqually ? 'bg-brand-500' : 'bg-gray-700'
                        } relative`}
                >
                    <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${splitEqually ? 'translate-x-6' : 'translate-x-0.5'
                            }`}
                    />
                </button>
                <span className="text-sm text-gray-300">Split Equally Among All Members</span>
            </div>

            {/* Custom participants */}
            {!splitEqually && (
                <div>
                    <label className="label">Participants</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {members.map((m) => {
                            const selected = participants.has(m)
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => toggleParticipant(m)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${selected
                                        ? 'bg-brand-500 text-white border border-brand-500'
                                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
                                        }`}
                                >
                                    {m}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20">
                    {error}
                </p>
            )}

            {success && (
                <p className="text-green-400 text-sm bg-green-400/10 px-4 py-3 rounded-xl border border-green-400/20">
                    ✓ Expense added!
                </p>
            )}

            <div className="flex gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary flex-1"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    id="add-expense-submit"
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50"
                >
                    {loading ? 'Saving…' : (initialData ? 'Save Changes' : 'Add Expense')}
                </button>
            </div>
        </form>
    )
}
