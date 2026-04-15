export default function SettleList({ transactions, currency }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-5xl mb-3">🎉</p>
                <p className="text-gray-300 font-semibold">All settled up!</p>
                <p className="text-gray-500 text-sm mt-1">No outstanding balances.</p>
            </div>
        )
    }

    return (
        <ul className="space-y-3">
            {transactions.map((tx, i) => (
                <li
                    key={i}
                    className="flex items-center justify-between gap-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700"
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="font-semibold text-red-400 truncate">{tx.from}</span>
                        <span className="text-gray-500 flex-shrink-0">→</span>
                        <span className="font-semibold text-green-400 truncate">{tx.to}</span>
                    </div>
                    <span className="text-brand-300 font-bold flex-shrink-0">
                        {currency} {tx.amount.toFixed(2)}
                    </span>
                </li>
            ))}
        </ul>
    )
}
