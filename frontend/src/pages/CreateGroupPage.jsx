import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createGroup } from '../api/api'
import MemberList from '../components/MemberList'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'SGD']

export default function CreateGroupPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const urlGroupId = searchParams.get('groupId')
    const [groupName, setGroupName] = useState('')
    const [currency, setCurrency] = useState('USD')
    const [members, setMembers] = useState(['', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const cleanMembers = members.map((m) => m.trim()).filter(Boolean)
        if (!groupName.trim()) return setError('Group name is required.')
        if (cleanMembers.length < 2) return setError('Add at least 2 members.')

        const uniqueMembers = [...new Set(cleanMembers)]
        if (uniqueMembers.length !== cleanMembers.length)
            return setError('Member names must be unique.')

        try {
            setLoading(true)
            const payload = {
                group_name: groupName.trim(),
                currency,
                members: uniqueMembers,
            }
            if (urlGroupId) {
                payload.group_id = urlGroupId
            }
            const res = await createGroup(payload)
            const groupId = res.data.groupId

            // Store in localStorage
            const recent = JSON.parse(localStorage.getItem('recentGroups') || '[]')
            const updated = [
                { id: groupId, name: groupName.trim(), currency },
                ...recent.filter((g) => g.id !== groupId),
            ].slice(0, 5)
            localStorage.setItem('recentGroups', JSON.stringify(updated))

            navigate(`/group/${groupId}`)
        } catch (err) {
            setError(err?.response?.data?.detail || 'Failed to create group. Is the backend running?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-gray-200 text-sm mb-6 flex items-center gap-1 transition-colors"
                >
                    ← Back
                </button>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-1">Create a Group</h1>
                    <p className="text-gray-400 text-sm mb-8">Set up your expense group in seconds.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Name */}
                        <div>
                            <label className="label" htmlFor="group-name">Group Name</label>
                            <input
                                id="group-name"
                                type="text"
                                placeholder="e.g. Goa Trip 2025"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="label" htmlFor="currency">Currency</label>
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="input-field"
                            >
                                {CURRENCIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Members */}
                        <div>
                            <label className="label">Members</label>
                            <MemberList members={members} setMembers={setMembers} />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            id="create-group-submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating…' : 'Create Group →'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
