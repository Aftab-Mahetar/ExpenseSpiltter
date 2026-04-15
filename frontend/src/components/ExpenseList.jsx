export default function ExpenseList({ expenses, currency, onEdit, onDelete }) {
    if (!expenses || expenses.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-5xl mb-3">👻</p>
                <p className="text-gray-300 font-semibold">No expenses yet.</p>
                <p className="text-gray-500 text-sm mt-1">Add one to get started.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {expenses.map((exp) => (
                <div key={exp._id} className="card p-4 hover:border-brand-500/30 transition-colors">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-semibold text-lg">
                                {exp.paid_by} <span className="text-gray-400 font-normal text-base">paid</span>
                            </p>
                            <p className="text-brand-300 font-bold mt-1">
                                {currency} {exp.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                For: {exp.participants.join(', ')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => onEdit(exp)}
                                className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(exp._id)}
                                className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded border border-red-500/20 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
