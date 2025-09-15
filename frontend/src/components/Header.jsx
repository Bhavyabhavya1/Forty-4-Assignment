import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLightMode, MdDarkMode, MdPerson } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi';
import { useUserContext } from '../context/UserContext';

const Header = () => {
  const { theme, setTheme } = useUserContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-green-600 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>
      <header className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-300 p-4 shadow-lg" role="banner">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold text-green-500 hover:text-green-600 focus:outline-none transition-colors"
            aria-label="Go to User Dashboard home"
          >
            <MdPerson />
          </Link>
          <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-5">
            <Link
              to="/"
              className=" text-gray-800 dark:text-gray-100  focus:outline-none focus:ring-0 px-4 py-2 transition-colors"
              aria-current="page"
            >
              Dashboard
            </Link>
            <button
              onClick={toggleTheme}
              className="text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 px-4 py-2 rounded transition-colors text-xl cursor-pointer"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
            </button>
          </nav>
          <button
            onClick={toggleMenu}
            className="md:hidden hover:text-blue-200 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 px-4 py-2 rounded transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700 dark:bg-gray-800 text-white p-4">
            <nav aria-label="Mobile navigation" className="flex flex-col space-y-2">
              <Link
                to="/"
                className="hover:text-blue-200 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 px-4 py-2 rounded transition-colors"
                aria-current="page"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                className="hover:text-blue-200 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 px-4 py-2 rounded transition-colors text-left text-xl cursor-pointer"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? <MdDarkMode className="inline mr-2" /> : <MdLightMode className="inline mr-2" />} Theme
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
