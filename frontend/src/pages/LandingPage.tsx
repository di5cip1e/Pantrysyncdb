import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Users,
  ShoppingCart,
  Camera,
  Brain,
  Star,
  Mic,
  Package,
  ArrowRight,
  Shield,
  CheckCircle
} from "lucide-react";

function LandingPage() {
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
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-primary/20 border-primary/50 text-primary font-mono">
              [VAULT-TEC APPROVED TECHNOLOGY]
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-mono-upper text-primary drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] leading-tight">
              PANTRYSYNC
            </h1>
            
            <h2 className="text-2xl md:text-4xl font-mono text-primary/80">
              AI-POWERED HOUSEHOLD MANAGEMENT SYSTEM
            </h2>
            
            <p className="text-lg font-mono text-primary/70 max-w-2xl mx-auto leading-relaxed">
              Deploy advanced artificial intelligence to optimize your household's food inventory.
              Real-time synchronization, predictive analytics, and voice-activated controls
              ensure maximum efficiency and zero waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button asChild variant="pipboy" size="lg" className="text-lg px-8 py-6">
                <Link to="/" className="flex items-center gap-2">
                  INITIALIZE SYSTEM
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="pipboy-outline" size="lg" className="text-lg px-8 py-6">
                <Link to="#features">
                  VIEW SPECIFICATIONS
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              SYSTEM CAPABILITIES
            </h2>
            <p className="text-primary/70 font-mono max-w-2xl mx-auto">
              Advanced features designed for optimal household resource management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-purple-400" />}
              title="AI RECEIPT SCANNING"
              description="Neural network-powered optical character recognition automatically processes shopping receipts and updates inventory in real-time."
              badge="AI-POWERED"
            />
            
            <FeatureCard
              icon={<Mic className="h-8 w-8 text-blue-400" />}
              title="VOICE COMMAND INTERFACE"
              description="Hands-free inventory management through advanced voice recognition. Simply speak your commands to update quantities and add items."
              badge="VOICE-ACTIVATED"
            />
            
            <FeatureCard
              icon={<Camera className="h-8 w-8 text-green-400" />}
              title="BARCODE INTEGRATION"
              description="Instant product identification and nutritional data lookup using integrated barcode scanning technology."
              badge="SCAN-ENABLED"
            />
            
            <FeatureCard
              icon={<Users className="h-8 w-8 text-yellow-400" />}
              title="MULTI-USER SYNC"
              description="Real-time household synchronization ensures all family members have access to current inventory status across all devices."
              badge="COLLABORATIVE"
            />
            
            <FeatureCard
              icon={<ShoppingCart className="h-8 w-8 text-orange-400" />}
              title="SMART SHOPPING LISTS"
              description="Automated list generation based on consumption patterns, expiry dates, and household staples management."
              badge="PREDICTIVE"
            />
            
            <FeatureCard
              icon={<Star className="h-8 w-8 text-red-400" />}
              title="STAPLES MANAGEMENT"
              description="AI-powered suggestions for household staples based on usage patterns and consumption analytics."
              badge="INTELLIGENT"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-mono-upper text-primary">98%</div>
              <div className="font-mono text-primary/70">WASTE REDUCTION</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-mono-upper text-primary">2.5x</div>
              <div className="font-mono text-primary/70">EFFICIENCY INCREASE</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-mono-upper text-primary">100%</div>
              <div className="font-mono text-primary/70">HOUSEHOLD SYNC</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              DEPLOYMENT PACKAGES
            </h2>
            <p className="text-primary/70 font-mono max-w-2xl mx-auto">
              Choose your optimal household management configuration
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PricingCard
              title="BASIC VAULT"
              price="FREE"
              description="Essential household management"
              features={[
                "Up to 4 household members",
                "Basic inventory tracking",
                "Simple shopping lists",
                "Mobile access"
              ]}
              buttonText="ACTIVATE FREE"
              popular={false}
            />
            
            <PricingCard
              title="ADVANCED VAULT"
              price="$9.99/month"
              description="Full AI-powered capabilities"
              features={[
                "Unlimited household members",
                "AI receipt scanning",
                "Voice command interface",
                "Barcode scanning",
                "Advanced analytics",
                "Priority support"
              ]}
              buttonText="START TRIAL"
              popular={true}
            />
            
            <PricingCard
              title="ENTERPRISE VAULT"
              price="Custom"
              description="Multi-household management"
              features={[
                "Multiple household support",
                "Custom integrations",
                "Advanced reporting",
                "24/7 support",
                "On-premise deployment"
              ]}
              buttonText="CONTACT SALES"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-mono-upper text-primary">
              READY TO OPTIMIZE YOUR HOUSEHOLD?
            </h2>
            <p className="text-lg font-mono text-primary/70">
              Join thousands of households already using PantrySync to eliminate waste and maximize efficiency.
            </p>
            <Button asChild variant="pipboy" size="lg" className="text-xl px-12 py-8">
              <Link to="/" className="flex items-center gap-2">
                ENTER VAULT NOW
                <ArrowRight className="h-6 w-6" />
              </Link>
            </Button>
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}

function FeatureCard({ icon, title, description, badge }: FeatureCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {icon}
          <Badge variant="outline" className="text-xs font-mono border-primary/50 text-primary">
            {badge}
          </Badge>
        </div>
        <CardTitle className="text-lg font-mono-upper text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-primary/70 text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular: boolean;
}

function PricingCard({ title, price, description, features, buttonText, popular }: PricingCardProps) {
  return (
    <Card className={`bg-black/80 border-primary/30 relative ${
      popular ? 'border-primary/70 shadow-lg shadow-primary/20' : ''
    }`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-black font-mono-upper px-4 py-1">
            RECOMMENDED
          </Badge>
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-mono-upper text-primary">
          {title}
        </CardTitle>
        <div className="text-3xl font-mono-upper text-primary mt-2">
          {price}
        </div>
        <p className="font-mono text-primary/70 text-sm">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="font-mono text-primary/80 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          variant={popular ? "pipboy" : "pipboy-outline"} 
          className="w-full mt-6"
          asChild
        >
          <Link to="/">{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default LandingPage;
