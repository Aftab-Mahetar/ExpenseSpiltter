import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CreateGroupPage from './pages/CreateGroupPage'
import GroupPage from './pages/GroupPage'
import GroupResolver from './pages/GroupResolver'
import './index.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create-group" element={<CreateGroupPage />} />
                <Route path="/group/:groupId" element={<GroupPage />} />
                <Route path="/:groupId" element={<GroupResolver />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
