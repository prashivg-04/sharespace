import Sidebar from '../components/Sidebar';
import { Card } from '../components/ui/card';
import { Heart, MessageCircle, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const quickActions = [
    { title: 'Share Thoughts', icon: MessageCircle, color: 'green', path: '/feed', desc: 'Express yourself anonymously' },
    { title: 'Journal', icon: BookOpen, color: 'blue', path: '/journal', desc: 'Write your daily reflections' },
    { title: 'Track Mood', icon: TrendingUp, color: 'purple', path: '/mood', desc: 'Log how you\'re feeling' },
    { title: 'Calm Tools', icon: Sparkles, color: 'pink', path: '/calm', desc: 'Find your peace' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {(() => {
                const base = (user && (user.name || user.email)) || 'Friend';
                const first = typeof base === 'string' ? base.split(' ')[0] : 'Friend';
                return `Welcome back, ${first} 🌿`;
              })()}
            </h1>
            <p className="text-gray-600">Your safe space for healing and growth</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colorMap = {
                green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50' },
                blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
                purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'hover:bg-purple-50' },
                pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'hover:bg-pink-50' },
              };
              const colors = colorMap[action.color];

              return (
                <Card
                  key={action.title}
                  data-testid={`dashboard-${action.title.toLowerCase().replace(' ', '-')}`}
                  onClick={() => navigate(action.path)}
                  className={`p-6 bg-white/70 backdrop-blur-sm border-none shadow-lg ${colors.hover} cursor-pointer transition-all hover:scale-105`}
                >
                  <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.desc}</p>
                </Card>
              );
            })}
          </div>

          {/* Inspirational Quote */}
          <Card className="p-8 bg-white/70 backdrop-blur-sm border-none shadow-lg">
            <div className="flex items-start space-x-4">
              <Heart className="text-green-600 mt-1" size={32} fill="currentColor" />
              <div>
                <p className="text-xl text-gray-700 italic mb-2">
                  "Healing is not linear. Some days will be harder than others, but every step forward counts."
                </p>
                <p className="text-sm text-gray-500">Remember: You're doing great 🌟</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;