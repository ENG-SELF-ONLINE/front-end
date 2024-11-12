// eslint-disable-next-line no-unused-vars
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage.jsx";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import BooksPage from "./pages/BooksPage/BooksPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/statistics" element={<MainPage />} />
                <Route path="/reading/:level" element={<BooksPage />} />
                {/* Добавьте другие маршруты, если нужно */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
