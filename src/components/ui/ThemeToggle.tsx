import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const THEME_KEY = 'theme-mode';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(
        () => (typeof window !== 'undefined' && localStorage.getItem(THEME_KEY) === 'dark') ? 'dark' : 'light'
    );

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem(THEME_KEY, 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem(THEME_KEY, 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label="تغییر تم"
            className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-muted hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                    <motion.span
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute"
                    >
                        <Sun className="h-5 w-5 text-yellow-500" />
                    </motion.span>
                ) : (
                    <motion.span
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute"
                    >
                        <Moon className="h-5 w-5 text-blue-400" />
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
} 