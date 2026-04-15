import { useNavigate } from 'react-router-dom'

export default function RecentGroups() {
    const navigate = useNavigate()
    const recent = JSON.parse(localStorage.getItem('recentGroups') || '[]')

    if (recent.length === 0) {
        return (
            <div className="card text-center py-10">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400">No recent groups yet.</p>
                <p className="text-gray-500 text-sm mt-1">Create a group to get started!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recent.map((g) => (
                <button
                    key={g.id}
                    id={`recent-group-${g.id}`}
                    onClick={() => navigate(`/group/${g.id}`)}
                    className="card text-left hover:border-brand-500/40 hover:shadow-brand-500/10 transition-all duration-200 hover:-translate-y-0.5 group"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="font-semibold text-gray-100 group-hover:text-brand-300 transition-colors">
                                {g.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{g.currency}</p>
                        </div>
                        <span className="text-brand-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </button>
            ))}
        </div>
    )
}
