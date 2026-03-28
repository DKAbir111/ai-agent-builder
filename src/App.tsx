import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type Active,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type { AgentData, SavedAgent } from './types';
import Header from './components/Header';
import SkillsPanel from './components/SkillsPanel';
import AgentCanvas from './components/AgentCanvas';
import SavedAgentCard from './components/SavedAgentCard';
import DragOverlayContent from './components/DragOverlayContent';

function App() {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProfile, setSelectedProfile] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [agentName, setAgentName] = useState('');
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([]);

  const [activeDrag, setActiveDrag] = useState<Active | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // Bug Fix: wrapped in useCallback so useEffect dep is stable
  const fetchAPI = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const jsonData: AgentData = await response.json();
      setData(jsonData);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch agent data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAPI(); }, [fetchAPI]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedAgents');
      if (saved) setSavedAgents(JSON.parse(saved));
    } catch { /* ignore corrupted storage */ }
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDrag(event.active);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);
    if (!over) return;

    const dragData = active.data.current as { type: 'skill' | 'layer'; name: string; meta: string; category: string } | undefined;
    if (!dragData) return;

    if (over.id === 'skills-drop' && dragData.type === 'skill') {
      setSelectedSkills(prev => prev.includes(active.id as string) ? prev : [...prev, active.id as string]);
      return;
    }
    if (over.id === 'layers-drop' && dragData.type === 'layer') {
      setSelectedLayers(prev => prev.includes(active.id as string) ? prev : [...prev, active.id as string]);
      return;
    }

    if (selectedSkills.includes(active.id as string) && selectedSkills.includes(over.id as string)) {
      setSelectedSkills(prev => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    if (selectedLayers.includes(active.id as string) && selectedLayers.includes(over.id as string)) {
      setSelectedLayers(prev => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleSaveAgent = useCallback(() => {
    if (!agentName.trim()) return;
    const newAgent: SavedAgent = {
      id: crypto.randomUUID(),
      name: agentName.trim(),
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
      createdAt: Date.now(),
    };
    setSavedAgents(prev => {
      const updated = [...prev, newAgent];
      localStorage.setItem('savedAgents', JSON.stringify(updated));
      return updated;
    });
    setAgentName('');
    setSelectedProfile('');
    setSelectedSkills([]);
    setSelectedLayers([]);
    setSelectedProvider('');
  }, [agentName, selectedProfile, selectedSkills, selectedLayers, selectedProvider]);

  const handleLoadAgent = useCallback((agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '');
    setSelectedSkills([...(agent.skillIds || [])]);
    setSelectedLayers([...(agent.layerIds || [])]);
    setAgentName(agent.name);
    setSelectedProvider(agent.provider || '');
  }, []);

  const handleDeleteAgent = useCallback((id: string) => {
    setSavedAgents(prev => {
      const updated = prev.filter(a => a.id !== id);
      localStorage.setItem('savedAgents', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    if (!window.confirm('Clear all saved agents?')) return;
    setSavedAgents([]);
    localStorage.removeItem('savedAgents');
  }, []);

  const activeDragData = activeDrag?.data.current as { name: string; meta: string; category: string } | undefined;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-[#f8f8f6] flex flex-col">
        <Header loading={loading} onReload={fetchAPI} />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Build your AI Agent
            </h1>
            <p className="text-[14px] text-neutral-500 mt-1">
              Choose a profile, drag skills and layers onto the canvas, then save.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm h-fit lg:sticky lg:top-20">
              <SkillsPanel
                data={data}
                loading={loading}
                error={error}
                selectedProfile={selectedProfile}
                selectedSkills={selectedSkills}
                selectedLayers={selectedLayers}
                onSelectProfile={id => setSelectedProfile(id)}
              />
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <AgentCanvas
                data={data}
                selectedProfile={selectedProfile}
                selectedSkills={selectedSkills}
                selectedLayers={selectedLayers}
                selectedProvider={selectedProvider}
                agentName={agentName}
                onSetProvider={setSelectedProvider}
                onSetAgentName={setAgentName}
                onRemoveSkill={id => setSelectedSkills(prev => prev.filter(s => s !== id))}
                onRemoveLayer={id => setSelectedLayers(prev => prev.filter(l => l !== id))}
                onSave={handleSaveAgent}
              />
            </div>
          </div>

          {savedAgents.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[16px] font-semibold text-neutral-900">Saved Agents</h2>
                  <p className="text-[12px] text-neutral-400 mt-0.5">
                    {savedAgents.length} agent{savedAgents.length !== 1 ? 's' : ''} saved
                  </p>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-[12px] font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedAgents.map(agent => (
                  <SavedAgentCard
                    key={agent.id}
                    agent={agent}
                    data={data}
                    onLoad={handleLoadAgent}
                    onDelete={handleDeleteAgent}
                  />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
        {activeDragData && (
          <DragOverlayContent
            name={activeDragData.name}
            meta={activeDragData.meta}
            category={activeDragData.category}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
