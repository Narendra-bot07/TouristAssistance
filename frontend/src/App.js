import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import PackageDetailPage from './components/PackageDetailPage/PackageDetailPage';
import PackagesArchivePage from './components/PackagesArchivePage/PackagesArchivePage';
import CreateYourOwnPackage from './components/CreateYourOwnPackage/CreateYourOwnPackage';
import AboutUsPage from './components/AboutUsPage/AboutUsPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import "./App.css";

function App() {
  return (
    <div className='router'>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/package/:id" element={<PackageDetailPage />} />
            <Route path="/packages" element={<PackagesArchivePage />} />
            <Route path="/create-your-own" element={<CreateYourOwnPackage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
