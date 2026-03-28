import { memo } from 'react';
import type { AgentProfile } from '../types';

const PROFILE_ICONS: Record<string, string> = {
  profile_1: 'M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0',
  profile_2: 'M8 3l3 3-3 3M4 9l-3 3 3 3M12 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2',
  profile_3: 'M3 3h18v18H3zM3 9h18M9 3v18',
  profile_4: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  profile_5: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  profile_6: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  profile_7: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  profile_8: 'M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',
  profile_9: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  profile_10: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
};

const PROFILE_COLORS: Record<string, string> = {
  profile_1: 'bg-blue-50 text-blue-600 border-blue-100',
  profile_2: 'bg-violet-50 text-violet-600 border-violet-100',
  profile_3: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  profile_4: 'bg-rose-50 text-rose-600 border-rose-100',
  profile_5: 'bg-amber-50 text-amber-600 border-amber-100',
  profile_6: 'bg-green-50 text-green-600 border-green-100',
  profile_7: 'bg-sky-50 text-sky-600 border-sky-100',
  profile_8: 'bg-orange-50 text-orange-600 border-orange-100',
  profile_9: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  profile_10: 'bg-pink-50 text-pink-600 border-pink-100',
};

interface ProfileCardProps {
  profile: AgentProfile;
  selected: boolean;
  onSelect: (id: string) => void;
}

const ProfileCard = memo(function ProfileCard({ profile, selected, onSelect }: ProfileCardProps) {
  const iconPath = PROFILE_ICONS[profile.id] || PROFILE_ICONS.profile_1;
  const colorClass = PROFILE_COLORS[profile.id] || PROFILE_COLORS.profile_1;

  return (
    <button
      onClick={() => onSelect(selected ? '' : profile.id)}
      className={`
        w-full text-left p-3.5 rounded-xl border transition-all duration-150 group
        ${selected
          ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-200'
          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all
          ${selected ? 'bg-white/20 border-white/30 text-white' : colorClass}
        `}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={iconPath} />
          </svg>
        </div>
        <div className="min-w-0">
          <p className={`text-[13px] font-semibold leading-tight ${selected ? 'text-white' : 'text-neutral-900'}`}>
            {profile.name}
          </p>
          <p className={`text-[11px] leading-relaxed mt-0.5 line-clamp-2 ${selected ? 'text-indigo-200' : 'text-neutral-500'}`}>
            {profile.description}
          </p>
        </div>
      </div>
    </button>
  );
});

export default ProfileCard;
