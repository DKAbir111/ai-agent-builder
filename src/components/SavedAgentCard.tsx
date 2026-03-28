import { memo } from 'react';
import type { SavedAgent, AgentData } from '../types';

interface SavedAgentCardProps {
  agent: SavedAgent;
  data: AgentData | null;
  onLoad: (agent: SavedAgent) => void;
  onDelete: (id: string) => void;
}

const SavedAgentCard = memo(function SavedAgentCard({ agent, data, onLoad, onDelete }: SavedAgentCardProps) {
  const profile = data?.agentProfiles.find(p => p.id === agent.profileId);
  const date = new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 hover:shadow-md hover:border-neutral-300 transition-all duration-200 group animate-fade-in flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold text-neutral-900 truncate">{agent.name}</h3>
          {profile && (
            <p className="text-[11px] text-neutral-500 mt-0.5">{profile.name}</p>
          )}
        </div>
        <span className="text-[10px] text-neutral-400 flex-shrink-0 mt-0.5">{date}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <div className="w-4 h-4 rounded bg-sky-100 flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="6" cy="6" r="4"/><path d="M6 4v2l1.5 1.5"/>
            </svg>
          </div>
          <span>{agent.skillIds?.length || 0} skills</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <div className="w-4 h-4 rounded bg-violet-100 flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2l1.5 3h3L8 7l1 3L6 8.5 3 10l1-3-2.5-2H5z"/>
            </svg>
          </div>
          <span>{agent.layerIds?.length || 0} layers</span>
        </div>
        {agent.provider && (
          <div className="ml-auto">
            <span className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
              {agent.provider}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-neutral-100">
        <button
          onClick={() => onLoad(agent)}
          className="flex-1 text-[12px] font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 py-1.5 rounded-lg transition-all"
        >
          Load
        </button>
        <button
          onClick={() => onDelete(agent.id)}
          className="text-[12px] font-medium text-neutral-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default SavedAgentCard;
