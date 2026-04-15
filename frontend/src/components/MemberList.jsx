export default function MemberList({ members, setMembers }) {
    const update = (index, value) => {
        const updated = [...members]
        updated[index] = value
        setMembers(updated)
    }

    const addMember = () => setMembers([...members, ''])

    const removeMember = (index) => {
        if (members.length <= 2) return
        setMembers(members.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-3">
            {members.map((m, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        type="text"
                        placeholder={`Member ${i + 1}`}
                        value={m}
                        onChange={(e) => update(i, e.target.value)}
                        className="input-field"
                        id={`member-${i}`}
                    />
                    <button
                        type="button"
                        onClick={() => removeMember(i)}
                        disabled={members.length <= 2}
                        className="px-3 py-2 text-gray-400 hover:text-red-400 disabled:opacity-30 transition-colors text-lg"
                        title="Remove member"
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addMember}
                id="add-member-btn"
                className="text-brand-400 hover:text-brand-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
                + Add Member
            </button>
        </div>
    )
}
