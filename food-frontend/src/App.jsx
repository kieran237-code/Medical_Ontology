import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import OntologyUsage from './pages/OntologyUsage'
import AddFoodForm from './pages/AddFoodForm'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-100 flex flex-col">
          <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usages" element={<OntologyUsage />} />
            <Route path="/ajouter" element={<AddFoodForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App