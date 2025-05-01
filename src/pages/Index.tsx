
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const features = [
    {
      title: "Aptitude Tests",
      description: "Comprehensive tests for Quantitative, Logical Reasoning, and Verbal Ability.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M12 22V3"></path><path d="M5 3h14"></path><path d="M5 9h14"></path><path d="M5 15h14"></path><path d="M5 22h14"></path>
        </svg>
      ),
    },
    {
      title: "Coding Challenges",
      description: "Practice coding with our online editor and get instant feedback with automated evaluation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
    },
    {
      title: "Mock Assessments",
      description: "Simulate real exam conditions with timed tests and industry-standard questions.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      title: "Performance Analytics",
      description: "Track your progress with detailed insights and identify areas for improvement.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
    },
  ];

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="relative py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge className="mb-2" variant="outline">Welcome to TestPrepPulse</Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none gradient-heading">
                  Master Your Technical Assessments
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Comprehensive practice platform for aptitude tests, coding challenges, and mock assessments to boost your career.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700">
                  <Link to="/dashboard">
                    Get Started
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/tests">
                    Explore Tests
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto flex items-center justify-center p-4 lg:p-0">
              <div className="w-full max-w-[500px] aspect-square bg-gradient-to-br from-brand-500/20 to-accent-400/20 rounded-lg flex items-center justify-center">
                <div className="w-5/6 h-5/6 relative">
                  <div className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
                    <div className="w-full p-4">
                      <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-5/6"></div>
                        <div className="h-3 bg-muted rounded w-4/6"></div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-2">
                        <div className="h-16 bg-muted rounded"></div>
                        <div className="h-16 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-1/4 right-0 transform translate-x-1/3 w-1/2 aspect-square bg-brand-500 rounded-lg shadow-lg"></div>
                  <div className="absolute bottom-1/4 left-0 transform -translate-x-1/3 w-1/2 aspect-square bg-accent-500 rounded-lg shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-[800px] mx-auto mb-10 md:mb-16">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl gradient-heading mb-4">
              Comprehensive Test Preparation
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Everything you need to ace your upcoming technical assessments and interviews.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border card-hover">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-lg bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 border p-6 md:p-12 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-primary">
                  Ready to Boost Your Performance?
                </h2>
                <p className="text-muted-foreground">
                  Join thousands of candidates who improved their technical assessment scores with TestPrepPulse.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-brand-600"
                    >
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>Personalized learning path</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-brand-600"
                    >
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>Extensive question bank</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-brand-600"
                    >
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>Real-time performance tracking</span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-4 min-h-[300px] items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-xl font-semibold">Start your journey today</p>
                  <p className="text-sm text-muted-foreground">Create your account in just a few clicks</p>
                </div>
                <div className="flex flex-col w-full max-w-sm gap-2">
                  <Button asChild className="bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700">
                    <Link to="/dashboard">
                      Create Free Account
                    </Link>
                  </Button>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-gradient-to-br from-brand-100 to-accent-100 px-2 text-muted-foreground">or</span>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link to="/tests">
                      Browse Tests
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
