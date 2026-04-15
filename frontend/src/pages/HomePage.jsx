import { useNavigate } from 'react-router-dom'
import RecentGroups from '../components/RecentGroups'

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-brand-500/10 border border-brand-500/20 rounded-full text-brand-300 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                        Free &amp; Open-Source
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                        Never wonder who<br />owes whom again
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                        Split expenses with your group, track shared costs, and settle up with
                        the fewest possible transactions — automatically.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            id="get-started-btn"
                            onClick={() => navigate('/create-group')}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            Get Started →
                        </button>
                        <a
                            href="#recent"
                            className="btn-secondary text-lg px-8 py-4 text-center"
                        >
                            View Recent Groups
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Strip */}
            <div className="border-t border-gray-800 bg-gray-900/50 py-10 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    {[
                        { emoji: '👥', title: 'Groups', desc: 'Create groups for any trip, household, or event' },
                        { emoji: '💸', title: 'Expenses', desc: 'Log who paid and who participated instantly' },
                        { emoji: '⚡', title: 'Settle Up', desc: 'Greedy algorithm minimizes total transactions' },
                    ].map((f) => (
                        <div key={f.title} className="flex flex-col items-center gap-2">
                            <span className="text-4xl">{f.emoji}</span>
                            <h3 className="font-semibold text-lg">{f.title}</h3>
                            <p className="text-gray-400 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Groups */}
            <div id="recent" className="max-w-4xl mx-auto w-full px-4 py-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-100">Recent Groups</h2>
                <RecentGroups />
            </div>
        </div>
    )
}
