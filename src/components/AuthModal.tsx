import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentView, setCurrentView] = useState<'auth' | 'forgot-password' | 'reset-sent'>('auth');
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        toast.success('Logged in successfully!');
        onClose();
        setLoginForm({ email: '', password: '' });
      } else {
        toast.error('Invalid email or password. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(signupForm.email, signupForm.password, signupForm.name);
      if (success) {
        toast.success('Account created successfully! You can now log in.');
        onClose();
        setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        toast.error('Account creation failed. Email might already be in use.');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordForm.email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password reset email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentView('reset-sent');
      toast.success('Password reset instructions sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setCurrentView('auth');
    setLoginForm({ email: '', password: '' });
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    setForgotPasswordForm({ email: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {currentView === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">
                  Welcome to Bushra's Sweet Delights
                </DialogTitle>
                <DialogDescription className="text-center">
                  Sign in to your account or create a new one to start ordering delicious desserts.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Create Account</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-lg">Sign In</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Welcome back! Please sign in to your account.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              name="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={loginForm.email}
                              onChange={handleLoginChange}
                              className="pl-10 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              disabled={isLoading}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              className="pl-10 pr-10 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              disabled={isLoading}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setCurrentView('forgot-password')}
                            className="text-sm text-primary hover:underline"
                            disabled={isLoading}
                          >
                            Forgot password?
                          </button>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Signing In...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <Card className="border-0 shadow-none">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-lg">Create Account</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Join us and start enjoying our delicious desserts!
                      </p>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-name"
                              name="name"
                              type="text"
                              placeholder="Your full name"
                              value={signupForm.name}
                              onChange={handleSignupChange}
                              className="pl-10 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              disabled={isLoading}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-email"
                              name="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={signupForm.email}
                              onChange={handleSignupChange}
                              className="pl-10 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              disabled={isLoading}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-password"
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password (min. 6 characters)"
                              value={signupForm.password}
                              onChange={handleSignupChange}
                              className="pl-10 pr-10 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              disabled={isLoading}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signup-confirm-password"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              value={signupForm.confirmPassword}
                              onChange={handleSignupChange}
                              className="pl-10 pr-10 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                              disabled={isLoading}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {currentView === 'forgot-password' && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('auth')}
                    className="p-0 h-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <DialogTitle className="text-xl">Reset Password</DialogTitle>
                </div>
                <DialogDescription>
                  Enter your email address and we'll send you instructions to reset your password.
                </DialogDescription>
              </DialogHeader>

              <Card className="border-0 shadow-none mt-4">
                <CardContent className="p-0">
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={forgotPasswordForm.email}
                          onChange={handleForgotPasswordChange}
                          className="pl-10 border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Instructions...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reset Instructions
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentView === 'reset-sent' && (
            <motion.div
              key="reset-sent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Check Your Email</DialogTitle>
                <DialogDescription className="text-center">
                  We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
                </DialogDescription>
              </DialogHeader>

              <Card className="border-0 shadow-none mt-4">
                <CardContent className="text-center p-0">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8" />
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    We've sent password reset instructions to <strong>{forgotPasswordForm.email}</strong>. 
                    Please check your email and follow the link to reset your password.
                  </p>

                  <div className="space-y-3">
                    <Button 
                      onClick={() => setCurrentView('auth')} 
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                    
                    <button
                      onClick={() => setCurrentView('forgot-password')}
                      className="text-sm text-primary hover:underline"
                    >
                      Didn't receive the email? Try again
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}