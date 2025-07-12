import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Play,
  Camera,
  Mic,
  Brain,
  Users,
  ShoppingCart,
  Star,
  Eye,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

function Demo() {
  return (
    <div className="min-h-screen bg-background text-foreground scanline">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-primary/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-mono-upper text-primary drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">
              PantrySync
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/landing-page" className="text-primary/80 hover:text-primary font-mono transition-colors">
              HOME
            </Link>
            <Link to="/features" className="text-primary/80 hover:text-primary font-mono transition-colors">
              FEATURES
            </Link>
            <Link to="/pricing" className="text-primary/80 hover:text-primary font-mono transition-colors">
              PRICING
            </Link>
            <Link to="/about" className="text-primary/80 hover:text-primary font-mono transition-colors">
              ABOUT
            </Link>
            <Button asChild variant="pipboy">
              <Link to="/">ENTER VAULT</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Button asChild variant="pipboy-outline" size="sm" className="mb-4">
              <Link to="/landing-page" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                BACK TO HOME
              </Link>
            </Button>
            
            <Badge className="bg-primary/20 border-primary/50 text-primary font-mono">
              [SYSTEM DEMONSTRATION]
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-mono-upper text-primary drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
              LIVE DEMO
            </h1>
            
            <p className="text-xl font-mono text-primary/70 max-w-3xl mx-auto leading-relaxed">
              Experience PantrySync's AI-powered capabilities in action.
              See how our neural networks transform household management.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Demo Video Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/80 border-primary/30 overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-mono-upper text-primary">
                  VAULT SYSTEM OVERVIEW
                </CardTitle>
                <p className="font-mono text-primary/70">
                  Watch our comprehensive system demonstration
                </p>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black/50 border-2 border-primary/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Simulated Video Interface */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center mx-auto hover:bg-primary/30 cursor-pointer transition-all">
                      <Play className="h-8 w-8 text-primary ml-1" />
                    </div>
                    <div className="font-mono text-primary/80">
                      CLICK TO INITIALIZE DEMO
                    </div>
                    <div className="font-mono text-primary/60 text-sm">
                      Duration: 3:47 | Full HD Quality
                    </div>
                  </div>
                  
                  {/* Decorative scanlines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-primary/20" />
                    <div className="absolute top-2/4 left-0 right-0 h-px bg-primary/30" />
                    <div className="absolute top-3/4 left-0 right-0 h-px bg-primary/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Demonstrations */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              FEATURE DEMONSTRATIONS
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <DemoCard
              icon={<Brain className="h-12 w-12 text-purple-400" />}
              title="AI RECEIPT SCANNING"
              description="Watch our neural network process a grocery receipt in real-time, extracting items, quantities, and prices with 99.7% accuracy."
              features={[
                "Real-time OCR processing",
                "Automatic item categorization",
                "Price and quantity detection",
                "Inventory auto-update"
              ]}
              demoType="Interactive Scan"
              duration="15 seconds"
            />
            
            <DemoCard
              icon={<Mic className="h-12 w-12 text-blue-400" />}
              title="VOICE COMMAND SYSTEM"
              description="Experience hands-free pantry management through natural language commands processed by our advanced NLP engine."
              features={[
                "Natural speech recognition",
                "Context-aware responses",
                "Multi-command processing",
                "Voice learning adaptation"
              ]}
              demoType="Voice Interface"
              duration="30 seconds"
            />
            
            <DemoCard
              icon={<Camera className="h-12 w-12 text-green-400" />}
              title="BARCODE INTEGRATION"
              description="See instant product identification and nutritional data lookup using our comprehensive global product database."
              features={[
                "Universal barcode support",
                "Instant product lookup",
                "Nutritional information",
                "Storage recommendations"
              ]}
              demoType="Scan Demo"
              duration="10 seconds"
            />
            
            <DemoCard
              icon={<Users className="h-12 w-12 text-yellow-400" />}
              title="HOUSEHOLD COLLABORATION"
              description="Observe real-time synchronization across multiple devices as family members collaborate on pantry management."
              features={[
                "Multi-device sync",
                "Real-time updates",
                "Activity tracking",
                "Role-based permissions"
              ]}
              demoType="Multi-User"
              duration="45 seconds"
            />
          </div>
        </div>
      </section>

      {/* Platform Screenshots */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              PLATFORM INTERFACES
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <PlatformCard
              icon={<Smartphone className="h-8 w-8 text-primary" />}
              title="MOBILE INTERFACE"
              description="Optimized for on-the-go pantry management with intuitive touch controls."
              features={[
                "Touch-optimized UI",
                "Camera integration",
                "Voice commands",
                "Offline sync"
              ]}
            />
            
            <PlatformCard
              icon={<Monitor className="h-8 w-8 text-primary" />}
              title="DESKTOP DASHBOARD"
              description="Comprehensive household management with advanced analytics and reporting."
              features={[
                "Full feature access",
                "Advanced analytics",
                "Bulk operations",
                "Export capabilities"
              ]}
            />
            
            <PlatformCard
              icon={<Tablet className="h-8 w-8 text-primary" />}
              title="TABLET EXPERIENCE"
              description="Perfect for kitchen use with large, easy-to-read displays and controls."
              features={[
                "Kitchen-optimized",
                "Large touch targets",
                "Recipe integration",
                "Family calendar"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Use Case Scenarios */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              REAL-WORLD SCENARIOS
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ScenarioCard
              title="WEEKLY GROCERY TRIP"
              description="Follow Sarah as she uses PantrySync to scan receipts, update inventory, and automatically generate next week's shopping list based on consumption patterns."
              steps={[
                "Scan grocery receipt with phone",
                "AI processes and categorizes items",
                "Inventory automatically updates",
                "System suggests next week's list"
              ]}
              outcome="47% reduction in food waste, 23% savings on grocery bills"
            />
            
            <ScenarioCard
              title="FAMILY COORDINATION"
              description="Watch the Johnson family coordinate meal planning across 4 family members, with real-time updates and collaborative shopping lists."
              steps={[
                "Mom adds items via voice command",
                "Dad checks pantry from office",
                "Kids mark items as consumed",
                "Auto-sync across all devices"
              ]}
              outcome="85% better household coordination, zero duplicate purchases"
            />
            
            <ScenarioCard
              title="MEAL PLANNING OPTIMIZATION"
              description="See how the AI suggests recipes based on available ingredients and upcoming expiration dates to minimize waste."
              steps={[
                "AI analyzes current inventory",
                "Identifies expiring items",
                "Suggests optimal recipes",
                "Updates shopping list automatically"
              ]}
              outcome="67% improvement in meal planning efficiency"
            />
            
            <ScenarioCard
              title="SMART NOTIFICATIONS"
              description="Experience intelligent alerts for low stock, expiring items, and optimal shopping times based on store patterns."
              steps={[
                "System monitors consumption rates",
                "Predicts when items run low",
                "Sends timely notifications",
                "Suggests optimal shopping windows"
              ]}
              outcome="Never run out of essentials again"
            />
          </div>
        </div>
      </section>

      {/* Live Demo CTA */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-mono-upper text-primary">
              READY TO TEST YOUR OWN VAULT?
            </h2>
            <p className="text-lg font-mono text-primary/70">
              Experience these features firsthand with our free trial.
              No credit card required - start optimizing your household today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="pipboy" size="lg" className="text-lg px-8 py-6">
                <Link to="/" className="flex items-center gap-2">
                  START FREE TRIAL
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="pipboy-outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/pricing">
                  VIEW PRICING
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-primary/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-mono-upper text-primary">PantrySync</span>
          </div>
          <p className="font-mono text-primary/50 text-sm">
            © 2024 PantrySync Systems. All rights reserved. Vault-Tec Approved.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface DemoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  demoType: string;
  duration: string;
}

function DemoCard({ icon, title, description, features, demoType, duration }: DemoCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {icon}
            <div>
              <CardTitle className="text-xl font-mono-upper text-primary">
                {title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-mono border-primary/50 text-primary">
                  {demoType}
                </Badge>
                <span className="font-mono text-primary/60 text-xs">{duration}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="font-mono text-primary/70 text-sm leading-relaxed mb-4">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-mono-upper text-primary text-sm mb-2">DEMONSTRATION INCLUDES:</h4>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" />
                <span className="font-mono text-primary/80 text-xs">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button variant="pipboy-outline" className="w-full mt-4">
          <Play className="h-4 w-4 mr-2" />
          WATCH DEMO
        </Button>
      </CardContent>
    </Card>
  );
}

interface PlatformCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

function PlatformCard({ icon, title, description, features }: PlatformCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-3">{icon}</div>
        <CardTitle className="font-mono-upper text-primary text-lg">
          {title}
        </CardTitle>
        <p className="font-mono text-primary/70 text-sm leading-relaxed">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              <span className="font-mono text-primary/80 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button variant="pipboy-outline" className="w-full mt-4">
          <Eye className="h-4 w-4 mr-2" />
          VIEW INTERFACE
        </Button>
      </CardContent>
    </Card>
  );
}

interface ScenarioCardProps {
  title: string;
  description: string;
  steps: string[];
  outcome: string;
}

function ScenarioCard({ title, description, steps, outcome }: ScenarioCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="font-mono-upper text-primary text-lg">
          {title}
        </CardTitle>
        <p className="font-mono text-primary/70 text-sm leading-relaxed">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-mono-upper text-primary text-sm mb-2">PROCESS STEPS:</h4>
          <ol className="space-y-1">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="font-mono text-primary text-xs mt-0.5">{index + 1}.</span>
                <span className="font-mono text-primary/80 text-xs">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <div className="pt-2 border-t border-primary/20">
          <h4 className="font-mono-upper text-primary text-sm mb-1">OUTCOME:</h4>
          <p className="font-mono text-primary/60 text-xs">
            {outcome}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Demo;
