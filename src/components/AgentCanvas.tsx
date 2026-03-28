import { memo, useCallback } from 'react';
import type { AgentData, AgentProfile } from '../types';
import DropZone from './DropZone';

const PROVIDERS = ['Claude', 'ChatGPT', 'Gemini', 'DeepSeek', 'Kimi'];

const PROVIDER_COLORS: Record<string, string> = {
  Claude:   'bg-orange-50 text-orange-700 ring-orange-200',
  ChatGPT:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Gemini:   'bg-blue-50 text-blue-700 ring-blue-200',
  DeepSeek: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  Kimi:     'bg-violet-50 text-violet-700 ring-violet-200',
};

interface AgentCanvasProps {
  data: AgentData | null;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  agentName: string;
  onSetProvider: (p: string) => void;
  onSetAgentName: (n: string) => void;
  onRemoveSkill: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onSave: () => void;
}

const AgentCanvas = memo(function AgentCanvas({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  agentName,
  onSetProvider,
  onSetAgentName,
  onRemoveSkill,
  onRemoveLayer,
  onSave,
}: AgentCanvasProps) {
  const profile = data?.agentProfiles.find((p: AgentProfile) => p.id === selectedProfile);

  const skillItems = selectedSkills.map(id => {
    const s = data?.skills.find(sk => sk.id === id);
    return { id, name: s?.name || id, meta: s?.category || '', category: s?.category || 'information' };
  });

  const layerItems = selectedLayers.map(id => {
    const l = data?.layers.find(ly => ly.id === id);
    return { id, name: l?.name || id, meta: l?.type || '', category: l?.type || 'reasoning' };
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSave();
  }, [onSave]);

  const isEmpty = !selectedProfile && selectedSkills.length === 0 && selectedLayers.length === 0;

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Canvas header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
          Agent Canvas
        </p>

        {/* Agent name input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Name your agent..."
            value={agentName}
            onChange={e => onSetAgentName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={48}
            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[14px] font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {agentName && (
            <button
              onClick={() => onSetAgentName('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2l8 8M10 2L2 10"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Profile slot */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Base Profile</p>
        {profile ? (
          <div className="bg-indigo-600 rounded-xl p-4 animate-fade-in">
            <p className="text-[13px] font-semibold text-white">{profile.name}</p>
            <p className="text-[11px] text-indigo-200 mt-0.5 leading-relaxed">{profile.description}</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-neutral-200 rounded-xl p-4 flex items-center justify-center">
            <p className="text-[12px] text-neutral-400">Select a profile from the left panel</p>
          </div>
        )}
      </div>

      {/* Skills drop zone */}
      <DropZone
        droppableId="skills-drop"
        items={skillItems}
        label="Skills"
        hint="Drag skills here"
        onRemove={onRemoveSkill}
      />

      {/* Layers drop zone */}
      <DropZone
        droppableId="layers-drop"
        items={layerItems}
        label="Personality Layers"
        hint="Drag layers here"
        onRemove={onRemoveLayer}
      />

      {/* Provider selection */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">AI Provider</p>
        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map(p => (
            <button
              key={p}
              onClick={() => onSetProvider(selectedProvider === p ? '' : p)}
              className={`
                px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all
                ${selectedProvider === p
                  ? `${PROVIDER_COLORS[p]} ring-2 border-transparent`
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      {!isEmpty && (
        <div className="bg-neutral-100 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in">
          <div className="flex gap-2 flex-1 flex-wrap">
            {selectedSkills.length > 0 && (
              <span className="text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-900">{selectedSkills.length}</span> skills
              </span>
            )}
            {selectedLayers.length > 0 && (
              <span className="text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-900">{selectedLayers.length}</span> layers
              </span>
            )}
            {selectedProvider && (
              <span className="text-[11px] text-neutral-600">
                on <span className="font-semibold text-neutral-900">{selectedProvider}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={!agentName.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-200 disabled:text-neutral-400 text-white font-semibold text-[14px] rounded-xl py-3 transition-all duration-150 shadow-sm disabled:cursor-not-allowed"
      >
        Save Agent
      </button>
    </div>
  );
});

export default AgentCanvas;
