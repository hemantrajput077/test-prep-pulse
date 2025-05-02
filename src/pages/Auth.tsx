
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Redirect if user is already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Missing information", {
        description: "Please fill in both email and password.",
      });
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            // Adding empty metadata to ensure raw_user_meta_data is not null
            email: email
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Sign up successful!", {
        description: "Check your email for the confirmation link.",
      });
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Sign up failed", {
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Sign in failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (!email) {
      toast.error("Email required", { 
        description: "Please enter your email address first."
      });
      return;
    }
    
    supabase.auth.resetPasswordForEmail(email)
      .then(() => {
        toast.success("Password reset email sent", {
          description: "Check your inbox for instructions."
        });
      })
      .catch((error) => {
        toast.error("Password reset failed", {
          description: error.message
        });
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-heading">PrepMaster</h1>
          <p className="text-muted-foreground mt-2">Your journey to success starts here</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium">Password</label>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto" 
                        type="button"
                        onClick={handleResetPassword}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button 
                    className="w-full bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
                    <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-xs text-blue-700 dark:text-blue-300">
                      After signing up, you may need to verify your email before logging in.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <label htmlFor="email-signup" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email-signup"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password-signup" className="text-sm font-medium">Password</label>
                    <Input 
                      id="password-signup"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long.
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button 
                    className="w-full bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
