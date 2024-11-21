// eslint-disable-next-line no-unused-vars
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from "./pages/MainPage/MainPage.jsx";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import BooksPage from "./pages/BooksPage/BooksPage.jsx";
import Favourites from "./pages/Favourites/Favourites.jsx";
import BookInfoPage from "./pages/BookInfoPage/BookInfoPage.jsx";
import Translator from "./pages/Translator/Translator.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Dictionary from "./pages/Dictionary/Dictionary.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/statistics" element={<MainPage />} />
                <Route path="/reading/:level" element={<BooksPage />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/books/:bookId" element={<BookInfoPage />} />
                <Route path="/translator" element={<Translator />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/dictionary" element={<Dictionary />} />
                {/* Добавьте другие маршруты, если нужно */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
