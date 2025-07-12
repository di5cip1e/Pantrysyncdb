import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Camera,
  Mic,
  Users,
  ShoppingCart,
  Star,
  Package,
  ArrowRight,
  ArrowLeft,
  Zap,
  Eye,
  Cpu,
  Database,
  Smartphone,
  Clock
} from "lucide-react";

function Features() {
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
            <Link to="/demo" className="text-primary/80 hover:text-primary font-mono transition-colors">
              DEMO
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
              [FEATURE SPECIFICATIONS]
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-mono-upper text-primary drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
              SYSTEM CAPABILITIES
            </h1>
            
            <p className="text-xl font-mono text-primary/70 max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered household management features designed to optimize
              efficiency, eliminate waste, and revolutionize how families manage food inventory.
            </p>
          </div>
        </div>
      </section>

      {/* Core AI Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              AI-POWERED CORE SYSTEMS
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <DetailedFeatureCard
              icon={<Brain className="h-12 w-12 text-purple-400" />}
              title="NEURAL RECEIPT PROCESSING"
              subtitle="Advanced OCR & Pattern Recognition"
              description="Our proprietary neural network processes receipt images with 99.7% accuracy, automatically extracting item names, quantities, prices, and expiry dates. The system learns from your shopping patterns to improve recognition over time."
              features={[
                "Real-time image processing",
                "Multi-format receipt support",
                "Automatic quantity detection",
                "Price tracking & budgeting",
                "Machine learning optimization"
              ]}
              badge="AI-POWERED"
              techSpecs={[
                "Processing Speed: Under 2 seconds",
                "Accuracy Rate: 99.7%",
                "Supported Formats: All major retailers"
              ]}
            />
            
            <DetailedFeatureCard
              icon={<Mic className="h-12 w-12 text-blue-400" />}
              title="VOICE COMMAND INTERFACE"
              subtitle="Natural Language Processing"
              description="Interact with your pantry using natural speech. Our advanced NLP system understands context, handles multiple commands, and responds intelligently to complex household management requests."
              features={[
                "Natural language understanding",
                "Multi-command processing",
                "Context-aware responses",
                "Hands-free operation",
                "Voice learning & adaptation"
              ]}
              badge="VOICE-ACTIVATED"
              techSpecs={[
                "Response Time: Under 500ms",
                "Language Support: 12 languages",
                "Accuracy: 95%+ recognition"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Scanning & Detection */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              SCANNING & DETECTION SYSTEMS
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <DetailedFeatureCard
              icon={<Camera className="h-12 w-12 text-green-400" />}
              title="BARCODE INTEGRATION"
              subtitle="Universal Product Recognition"
              description="Instant product identification using advanced barcode scanning technology. Access comprehensive nutritional data, allergen information, and optimal storage recommendations."
              features={[
                "Universal barcode support",
                "Nutritional data lookup",
                "Allergen identification",
                "Storage recommendations",
                "Expiry date tracking"
              ]}
              badge="SCAN-ENABLED"
              techSpecs={[
                "Scan Speed: Instant",
                "Database: 50M+ products",
                "Coverage: Global retailers"
              ]}
            />
            
            <DetailedFeatureCard
              icon={<Eye className="h-12 w-12 text-cyan-400" />}
              title="VISUAL INVENTORY CAPTURE"
              subtitle="Computer Vision Technology"
              description="Transform photos of shopping lists, pantry shelves, or grocery hauls into organized digital inventory. Our computer vision system identifies items, estimates quantities, and categorizes automatically."
              features={[
                "Multi-item recognition",
                "Quantity estimation",
                "Automatic categorization",
                "Shelf organization mapping",
                "Bulk import processing"
              ]}
              badge="CV-POWERED"
              techSpecs={[
                "Recognition: 1000+ food items",
                "Processing: Real-time",
                "Accuracy: 94%+ identification"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Collaboration & Sync */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              COLLABORATION & SYNCHRONIZATION
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <DetailedFeatureCard
              icon={<Users className="h-12 w-12 text-yellow-400" />}
              title="REAL-TIME MULTI-USER SYNC"
              subtitle="Household Collaboration Platform"
              description="Seamless real-time synchronization across all household devices. Every family member sees updates instantly, with role-based permissions and activity tracking."
              features={[
                "Instant cross-device sync",
                "Role-based permissions",
                "Activity feed tracking",
                "Conflict resolution",
                "Offline mode support"
              ]}
              badge="COLLABORATIVE"
              techSpecs={[
                "Sync Speed: Under 100ms",
                "Devices: Unlimited",
                "Uptime: 99.9% SLA"
              ]}
            />
            
            <DetailedFeatureCard
              icon={<Database className="h-12 w-12 text-orange-400" />}
              title="INTELLIGENT DATA ANALYTICS"
              subtitle="Consumption Pattern Analysis"
              description="Advanced analytics engine tracks consumption patterns, predicts restocking needs, and identifies optimization opportunities for your household."
              features={[
                "Consumption pattern analysis",
                "Predictive restocking",
                "Waste reduction insights",
                "Budget optimization",
                "Trend reporting"
              ]}
              badge="ANALYTICS"
              techSpecs={[
                "Data Points: 100+ metrics",
                "Predictions: 7-30 day forecasts",
                "Accuracy: 92%+ predictions"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              INTELLIGENT AUTOMATION
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <DetailedFeatureCard
              icon={<ShoppingCart className="h-12 w-12 text-pink-400" />}
              title="PREDICTIVE SHOPPING LISTS"
              subtitle="AI-Driven List Generation"
              description="Automatically generate shopping lists based on consumption patterns, inventory levels, and household preferences. Never forget essential items again."
              features={[
                "Automatic list generation",
                "Consumption-based suggestions",
                "Price comparison integration",
                "Store layout optimization",
                "Seasonal adjustments"
              ]}
              badge="PREDICTIVE"
              techSpecs={[
                "Prediction Accuracy: 89%",
                "List Optimization: Route-based",
                "Price Tracking: Real-time"
              ]}
            />
            
            <DetailedFeatureCard
              icon={<Star className="h-12 w-12 text-red-400" />}
              title="STAPLES MANAGEMENT SYSTEM"
              subtitle="Essential Items Intelligence"
              description="AI-powered identification and management of household staples. Automatic reorder suggestions, consumption tracking, and preference learning."
              features={[
                "Automatic staple identification",
                "Consumption tracking",
                "Reorder notifications",
                "Brand preference learning",
                "Bulk purchase optimization"
              ]}
              badge="INTELLIGENT"
              techSpecs={[
                "Staple Detection: 95% accuracy",
                "Tracking: Continuous monitoring",
                "Suggestions: Personalized"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              TECHNICAL SPECIFICATIONS
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-black/80 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-mono-upper text-primary">
                    PROCESSING POWER
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-mono text-primary/80 text-sm space-y-1">
                  <p>• AI Processing: Neural Engine</p>
                  <p>• Image Recognition: Real-time</p>
                  <p>• Voice Processing: Under 500ms</p>
                  <p>• Data Sync: Under 100ms latency</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-mono-upper text-primary">
                    PLATFORM SUPPORT
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-mono text-primary/80 text-sm space-y-1">
                  <p>• iOS & Android Apps</p>
                  <p>• Web Browser Access</p>
                  <p>• Offline Mode Support</p>
                  <p>• Cross-device Sync</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg font-mono-upper text-primary">
                    PERFORMANCE METRICS
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-mono text-primary/80 text-sm space-y-1">
                  <p>• 99.9% Uptime SLA</p>
                  <p>• 99.7% OCR Accuracy</p>
                  <p>• 95% Voice Recognition</p>
                  <p>• 24/7 System Monitoring</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-mono-upper text-primary">
              READY TO DEPLOY THESE FEATURES?
            </h2>
            <p className="text-lg font-mono text-primary/70">
              Experience the full power of AI-driven household management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="pipboy" size="lg" className="text-lg px-8 py-6">
                <Link to="/" className="flex items-center gap-2">
                  START FREE TRIAL
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="pipboy-outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/landing-page">
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

interface DetailedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  badge: string;
  techSpecs: string[];
}

function DetailedFeatureCard({ 
  icon, 
  title, 
  subtitle, 
  description, 
  features, 
  badge, 
  techSpecs 
}: DetailedFeatureCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {icon}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl font-mono-upper text-primary">
                  {title}
                </CardTitle>
                <Badge variant="outline" className="text-xs font-mono border-primary/50 text-primary">
                  {badge}
                </Badge>
              </div>
              <p className="text-primary/60 font-mono text-sm">{subtitle}</p>
            </div>
          </div>
        </div>
        <p className="font-mono text-primary/70 text-sm leading-relaxed mb-4">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-mono-upper text-primary text-sm mb-2">KEY FEATURES:</h4>
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" />
                <span className="font-mono text-primary/80 text-xs">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2 border-t border-primary/20">
          <h4 className="font-mono-upper text-primary text-sm mb-2">TECH SPECS:</h4>
          <div className="space-y-1">
            {techSpecs.map((spec, index) => (
              <p key={index} className="font-mono text-primary/60 text-xs">
                {spec}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Features;
