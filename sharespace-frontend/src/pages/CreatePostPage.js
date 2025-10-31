import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const categories = ['Academics', 'Relationships', 'Self-doubt', 'Motivation'];
const moodEmojis = ['😊', '😢', '😰', '😔', '😤', '🤗', '💪', '🌟'];

const anonymousNames = [
  'Anonymous Butterfly', 'Anonymous Phoenix', 'Anonymous Star', 
  'Anonymous Ocean', 'Anonymous Mountain', 'Anonymous River',
  'Anonymous Cloud', 'Anonymous Moon', 'Anonymous Sun',
  'Anonymous Rainbow', 'Anonymous Tree', 'Anonymous Breeze'
];

const getRandomAnonymousName = () => {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
};

const CreatePostPage = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('😊');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Please write something to share');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      
      const newPost = {
        id: Date.now(),
        content: content.trim(),
        category,
        mood_emoji: moodEmoji,
        kindness_count: 0,
        anonymous_id: getRandomAnonymousName(),
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      const updatedPosts = [newPost, ...existingPosts];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));
      
      toast.success('Post shared successfully!');
      navigate('/feed');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Share Your Thoughts</h1>
            <p className="text-gray-600">You're safe here. Your feelings matter.</p>
          </div>

          <Card className="p-8 bg-white/70 backdrop-blur-sm border-none shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                  How are you feeling?
                </Label>
                <div className="flex flex-wrap gap-3">
                  {moodEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      data-testid={`mood-${emoji}`}
                      onClick={() => setMoodEmoji(emoji)}
                      className={`text-4xl p-3 rounded-2xl transition-all ${
                        moodEmoji === emoji
                          ? 'bg-green-100 scale-110 shadow-lg'
                          : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                  What's on your mind?
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-testid="category-select" className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} data-testid={`category-${cat.toLowerCase()}`}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-lg font-semibold text-gray-800 mb-3 block">
                  Share your thoughts
                </Label>
                <Textarea
                  data-testid="post-content-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write what's in your heart... This is a safe space."
                  className="resize-none bg-white border-gray-200 min-h-[200px] text-lg"
                  rows={8}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/feed')}
                  className="rounded-full px-8"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="share-post-btn"
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-8 shadow-lg"
                >
                  {loading ? 'Sharing...' : 'Share Anonymously'}
                </Button>
              </div>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-600 italic">
              "Your story matters. Sharing it might help someone else feel less alone."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
