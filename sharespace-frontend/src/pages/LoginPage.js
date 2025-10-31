import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { apiRequest } from '../lib/api';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', name: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginData.email, password: loginData.password })
      });
      const { token, user } = data;
      if (token) {
        localStorage.setItem('sharespace_token', token);
      }
      if (user) {
        try { localStorage.setItem('sharespace_user', JSON.stringify(user)); } catch {}
        onLogin(user);
      }
      if (sessionStorage.getItem('shownLoginToast') !== 'true') {
        toast.success('💚 Welcome back! Take a deep breath—you\'re in a safe space.');
        sessionStorage.setItem('shownLoginToast', 'true');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const signupRes = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: signupData.name, email: signupData.email, password: signupData.password })
      });
      // Try to use token from signup; if not present, auto-login
      let token = signupRes?.token;
      let user = signupRes?.user;

      if (!token) {
        const loginRes = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: signupData.email, password: signupData.password })
        });
        token = loginRes?.token;
        user = loginRes?.user;
      }

      if (token) {
        localStorage.setItem('sharespace_token', token);
      }
      if (user) {
        try { localStorage.setItem('sharespace_user', JSON.stringify(user)); } catch {}
        onLogin(user);
      }

      toast.success('🎉 Welcome to ShareSpace!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Processing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/70 backdrop-blur-sm border-none shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <Heart className="text-green-600 mr-2" size={32} fill="currentColor" />
          <h1 className="text-3xl font-bold text-gray-800">ShareSpace</h1>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
            <TabsTrigger value="signup" data-testid="signup-tab">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    id="login-email"
                    data-testid="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    id="login-password"
                    data-testid="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                data-testid="login-submit-btn"
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    id="signup-name"
                    data-testid="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    id="signup-email"
                    data-testid="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <Input
                    id="signup-password"
                    data-testid="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                data-testid="signup-submit-btn"
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
