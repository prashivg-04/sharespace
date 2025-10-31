import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { TrendingUp, Plus } from 'lucide-react';

const moodOptions = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 text-yellow-700' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-700' },
  { emoji: '😰', label: 'Anxious', color: 'bg-purple-100 text-purple-700' },
  { emoji: '😔', label: 'Tired', color: 'bg-gray-100 text-gray-700' },
  { emoji: '😤', label: 'Frustrated', color: 'bg-red-100 text-red-700' },
  { emoji: '🤗', label: 'Grateful', color: 'bg-green-100 text-green-700' },
  { emoji: '💪', label: 'Motivated', color: 'bg-orange-100 text-orange-700' },
  { emoji: '🌟', label: 'Hopeful', color: 'bg-pink-100 text-pink-700' },
];

const MoodTrackerPage = ({ user, onLogout }) => {
  const [entries, setEntries] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        mood: selectedMood,
        note: note.trim(),
        created_at: new Date().toISOString(),
      };
      setEntries([newEntry, ...entries]);
      toast.success('Mood logged!');
      setSelectedMood('');
      setNote('');
      setShowCreate(false);
      setLoading(false);
    }, 500);
  };

  const getMoodStats = () => {
    const stats = {};
    entries.forEach(entry => {
      stats[entry.mood] = (stats[entry.mood] || 0) + 1;
    });
    return stats;
  };

  const moodStats = getMoodStats();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Mood Tracker</h1>
              <p className="text-gray-600">Track your emotional journey</p>
            </div>
            <Button
              data-testid="log-mood-btn"
              onClick={() => setShowCreate(!showCreate)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full px-6 shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              Log Mood
            </Button>
          </div>

          {showCreate && (
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-none shadow-xl mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    How are you feeling today?
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.emoji}
                        type="button"
                        data-testid={`mood-${mood.label.toLowerCase()}`}
                        onClick={() => setSelectedMood(mood.emoji)}
                        className={`p-4 rounded-xl text-center transition-all ${
                          selectedMood === mood.emoji
                            ? 'bg-purple-600 text-white scale-105 shadow-lg'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <div className="text-sm font-medium">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a note (optional)
                  </label>
                  <Textarea
                    data-testid="mood-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What's making you feel this way?"
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
                  <Button data-testid="save-mood-btn" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {entries.length > 0 && (
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-none shadow-xl mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Mood Overview</h2>
              <div className="grid grid-cols-4 gap-4">
                {moodOptions.map((mood) => {
                  const count = moodStats[mood.emoji] || 0;
                  const percentage = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0;
                  
                  return (
                    <div key={mood.emoji} className={`p-4 rounded-xl ${mood.color}`}>
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className="text-sm font-medium mb-1">{mood.label}</div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs opacity-75">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mood History</h2>
            <div className="space-y-3">
              {entries.length === 0 ? (
                <Card className="p-12 text-center bg-white/70 backdrop-blur-sm border-none shadow-lg">
                  <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-500 text-lg">No mood entries yet. Start tracking!</p>
                </Card>
              ) : (
                entries.map((entry) => {
                  const moodInfo = moodOptions.find(m => m.emoji === entry.mood);
                  
                  return (
                    <Card
                      key={entry.id}
                      data-testid={`mood-entry-${entry.id}`}
                      className="p-4 bg-white/70 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{entry.mood}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-800">{moodInfo?.label || 'Unknown'}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-gray-600 text-sm">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerPage;
