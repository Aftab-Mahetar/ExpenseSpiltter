import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGroup } from '../api/api'

export default function GroupResolver() {
    const { groupId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const checkGroup = async () => {
            try {
                await getGroup(groupId)
                navigate(`/group/${groupId}`, { replace: true })
            } catch (err) {
                navigate(`/create-group?groupId=${groupId}`, { replace: true })
            }
        }
        checkGroup()
    }, [groupId, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading...</p>
            </div>
        </div>
    )
}
