import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
const Index = () => {
  return <MainLayout>
      <div className="container px-4">
        <section className="py-12 md:py-24 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">Ace Your Next Test with Skill Check</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The ultimate practice platform for aptitude tests, coding interviews, and more. Start mastering your skills today.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/dashboard">
                  <Button className="bg-brand-500 hover:bg-brand-600">Go to Dashboard</Button>
                </Link>
                <Link to="/tests">
                  <Button variant="outline">Explore Tests</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Master Your Skills
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                    PrepMaster helps you prepare for technical interviews, aptitude tests, and competitive exams with a vast library of practice questions and realistic test simulations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/tests">
                    <Button className="bg-brand-500 hover:bg-brand-600">Explore Tests</Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full h-80">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-xl"></div>
                  <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg flex items-center justify-center">
                    <div className="p-6 w-full space-y-4">
                      <h3 className="text-xl font-bold">Sample Question</h3>
                      <p className="text-gray-700 dark:text-gray-300">If a train travels at a speed of 60 km/hr, how long will it take to cover a distance of 240 km?</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full border mr-2"></div>
                          <span>3 hours</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full border border-brand-500 bg-brand-500/20 mr-2"></div>
                          <span className="font-medium">4 hours</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full border mr-2"></div>
                          <span>5 hours</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full border mr-2"></div>
                          <span>6 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>;
};
export default Index;