import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if we have the required token
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (!token || type !== 'recovery') {
      toast.error('Invalid reset link', {
        description: 'Please request a new password reset link.',
      });
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password too short', {
        description: 'Password must be at least 6 characters.',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        description: 'Please make sure both passwords are the same.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success('Password updated!', {
        description: 'You can now sign in with your new password.',
      });

      // Wait a moment then redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password', {
        description: error.message || 'Please try again or request a new reset link.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-peace flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl gradient-golden flex items-center justify-center shadow-glow mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="gradient-card rounded-2xl p-6 shadow-card space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="golden"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
