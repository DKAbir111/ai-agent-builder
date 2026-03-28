import { memo, useState, useMemo } from 'react';
import type { AgentData } from '../types';
import DraggableItem from './DraggableItem';
import ProfileCard from './ProfileCard';

type Tab = 'profiles' | 'skills' | 'layers';

interface SkillsPanelProps {
  data: AgentData | null;
  loading: boolean;
  error: string | null;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  onSelectProfile: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  information: 'Information',
  action: 'Action',
};

const TYPE_LABELS: Record<string, string> = {
  reasoning: 'Reasoning',
  personality: 'Personality',
  context: 'Context',
  formatting: 'Formatting',
};

const SkillsPanel = memo(function SkillsPanel({
  data,
  loading,
  error,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  onSelectProfile,
}: SkillsPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profiles');
  const [search, setSearch] = useState('');

  const filteredSkills = useMemo(() => {
    if (!data) return {};
    const skills = data.skills.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
    );
    return skills.reduce<Record<string, typeof skills>>((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});
  }, [data, search]);

  const filteredLayers = useMemo(() => {
    if (!data) return {};
    const layers = data.layers.filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase())
    );
    return layers.reduce<Record<string, typeof layers>>((acc, l) => {
      if (!acc[l.type]) acc[l.type] = [];
      acc[l.type].push(l);
      return acc;
    }, {});
  }, [data, search]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'profiles', label: 'Profiles', count: data?.agentProfiles.length },
    { id: 'skills', label: 'Skills', count: data?.skills.length },
    { id: 'layers', label: 'Layers', count: data?.layers.length },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[10px] font-semibold ${activeTab === tab.id ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search (only for skills/layers) */}
      {activeTab !== 'profiles' && (
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto -mx-1 px-1">
        {loading && (
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl p-4">
            <p className="font-medium">Failed to load data</p>
            <p className="mt-0.5 opacity-80">{error}</p>
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* Profiles tab */}
            {activeTab === 'profiles' && (
              <div className="flex flex-col gap-2">
                <p className="text-[11px] text-neutral-400 mb-1">Click to select a base profile for your agent.</p>
                {data.agentProfiles.map(profile => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    selected={selectedProfile === profile.id}
                    onSelect={onSelectProfile}
                  />
                ))}
              </div>
            )}

            {/* Skills tab */}
            {activeTab === 'skills' && (
              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-neutral-400">Drag skills onto the canvas to add them to your agent.</p>
                {Object.entries(filteredSkills).map(([category, skills]) => (
                  <div key={category} className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1">
                      {CATEGORY_LABELS[category] || category}
                    </p>
                    {skills.map(skill => (
                      <DraggableItem
                        key={skill.id}
                        id={skill.id}
                        name={skill.name}
                        meta={skill.category}
                        type="skill"
                        category={skill.category}
                        disabled={selectedSkills.includes(skill.id)}
                      />
                    ))}
                  </div>
                ))}
                {Object.keys(filteredSkills).length === 0 && (
                  <p className="text-[12px] text-neutral-400 text-center py-8">No results for "{search}"</p>
                )}
              </div>
            )}

            {/* Layers tab */}
            {activeTab === 'layers' && (
              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-neutral-400">Drag personality layers to shape how your agent behaves.</p>
                {Object.entries(filteredLayers).map(([type, layers]) => (
                  <div key={type} className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 px-1">
                      {TYPE_LABELS[type] || type}
                    </p>
                    {layers.map(layer => (
                      <DraggableItem
                        key={layer.id}
                        id={layer.id}
                        name={layer.name}
                        meta={layer.type}
                        type="layer"
                        category={layer.type}
                        disabled={selectedLayers.includes(layer.id)}
                      />
                    ))}
                  </div>
                ))}
                {Object.keys(filteredLayers).length === 0 && (
                  <p className="text-[12px] text-neutral-400 text-center py-8">No results for "{search}"</p>
                )}
              </div>
            )}
          </>
        )}

        {!loading && !error && !data && (
          <p className="text-[12px] text-neutral-400 text-center py-8">No data loaded.</p>
        )}
      </div>
    </div>
  );
});

export default SkillsPanel;
