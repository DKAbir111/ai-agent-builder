import { memo } from 'react';

interface HeaderProps {
  loading: boolean;
  onReload: () => void;
}

const Header = memo(function Header({ loading, onReload }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="4" r="2.5" fill="white" />
              <circle cx="3.5" cy="12" r="2" fill="white" opacity="0.7" />
              <circle cx="12.5" cy="12" r="2" fill="white" opacity="0.7" />
              <line x1="8" y1="6.5" x2="3.5" y2="10" stroke="white" strokeWidth="1.2" opacity="0.6" />
              <line x1="8" y1="6.5" x2="12.5" y2="10" stroke="white" strokeWidth="1.2" opacity="0.6" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-neutral-900">
            Agent Builder
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://tinyurl.com/darunkaras"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition-all"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M13.5 2.5H10v1h2.5l-9 9-0.707-0.707 9-9v2.5h1v-3.5a0.5 0.5 0 0 0-0.5-0.5z"
                fill="currentColor"
              />
            </svg>
            View My CV
          </a>
          <button
            onClick={onReload}
            disabled={loading}
            className="flex items-center gap-2 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              className={loading ? 'animate-spin' : ''}
            >
              <path
                d="M14 8A6 6 0 1 1 8 2a6 6 0 0 1 4.243 1.757L14 2v4h-4l1.586-1.586A4 4 0 1 0 12 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {loading ? 'Loading...' : 'Reload'}
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
