import { Routes, Route } from 'react-router-dom'; // 추가
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Notice from './pages/Notice';

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/notice" element={<Notice />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;