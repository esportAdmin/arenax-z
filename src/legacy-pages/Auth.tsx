"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaDiscord } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AppLink } from "@/components/AppLink";
import { useAppNavigate } from "@/hooks/useAppNavigate";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user, signUp, signIn, signInWithGoogle, signInWithDiscord } =
    useAuth();
  const navigate = useAppNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: "Welcome!",
          description: "You are now signed in.",
        });
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to ArenaX.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDiscordSignIn = async () => {
    const { error } = await signInWithDiscord();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 bg-slate-950/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <AppLink href="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-display font-bold text-primary-foreground text-xl shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              AX
            </div>
            <span className="font-display font-bold text-2xl">
              <span className="text-foreground">Arena</span>
              <span className="gradient-text-primary">X</span>
            </span>
          </AppLink>

          {/* Title */}
          <h1 className="font-display font-bold text-3xl mb-2 text-white drop-shadow-sm">
            {isLogin ? "Welcome back" : "Join the Arena"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin
              ? "Sign in to continue your esports journey"
              : "Create an account to start earning AXT tokens"}
          </p>

          {/* Social Login - POP STYLE */}
          <div className="flex flex-col gap-4 mb-8 w-full">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-3 h-14 text-base font-semibold border-slate-600 bg-slate-900/80 hover:bg-slate-800 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:text-white transition-all duration-300"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-3 h-14 text-base font-semibold border-indigo-500/30 bg-slate-900/80 hover:bg-indigo-900/40 hover:border-indigo-400 hover:text-indigo-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300"
              onClick={handleDiscordSignIn}
              disabled={isLoading}
            >
              <FaDiscord className="w-5 h-5" />
              <span>Continue with Discord</span>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Form - CONTRASTED INPUTS */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Choose your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-700 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-indigo-400 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full group bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-500 hover:to-purple-600 text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-[1.02] transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Sign Up"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-4 opacity-70">
            AXT tokens are in-app credits, non-transferable, with no monetary
            value.
          </p>

          {/* Toggle */}
          <p className="text-center mt-6 text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:text-indigo-400 transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://z-cdn-media.chatglm.cn/files/6eddc868-ac0e-4dfe-8432-390722fb9d23.png?auth_key=1868219762-d198976440254f6eabcf3f551c7d2f30-0-cad1f93f68f1b18cc29ba67b2b008532')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90 z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="text-8xl drop-shadow-[0_0_25px_rgba(249,115,22,0.6)] relative z-10">
                🎮
              </div>
            </div>

            <h2 className="font-display font-black text-6xl md:text-7xl text-center leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                ARENA
              </span>
              <span className="block text-white tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mt-2">
                X
              </span>
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-6 opacity-80" />

            <p className="text-slate-100 text-2xl md:text-3xl font-bold max-w-lg mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-8 font-display tracking-wide">
              L'avenir se joue <span className="text-primary">Ici</span>.
            </p>

            <div className="flex items-center justify-center gap-4 text-xs font-mono text-orange-300/80 uppercase tracking-widest drop-shadow-md">
              <div className="h-[1px] w-8 bg-orange-500/50" />
              <span>Season 12 Live</span>
              <div className="h-[1px] w-8 bg-orange-500/50" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
