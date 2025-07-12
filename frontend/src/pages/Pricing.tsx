import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  Brain,
  Camera,
  Mic,
  Shield,
  Zap,
  Crown,
  Building
} from "lucide-react";

function Pricing() {
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
              [DEPLOYMENT CONFIGURATIONS]
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-mono-upper text-primary drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
              VAULT PACKAGES
            </h1>
            
            <p className="text-xl font-mono text-primary/70 max-w-3xl mx-auto leading-relaxed">
              Choose your optimal household management configuration.
              All packages include quantum-encrypted security and real-time synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Vault */}
            <PricingCard
              icon={<Shield className="h-12 w-12 text-green-400" />}
              title="BASIC VAULT"
              subtitle="Essential Operations Package"
              price="FREE"
              priceSubtext="Forever"
              description="Perfect for small households starting their digital transformation journey."
              features={[
                "Up to 4 household members",
                "Basic inventory tracking",
                "Simple shopping lists",
                "Mobile & web access",
                "Standard synchronization",
                "Community support"
              ]}
              limitations={[
                "No AI receipt scanning",
                "No voice commands",
                "Basic analytics only"
              ]}
              buttonText="ACTIVATE FREE VAULT"
              buttonVariant="pipboy-outline"
              popular={false}
              badge="STARTER"
            />
            
            {/* Advanced Vault */}
            <PricingCard
              icon={<Brain className="h-12 w-12 text-purple-400" />}
              title="ADVANCED VAULT"
              subtitle="AI-Powered Management Suite"
              price="$9.99"
              priceSubtext="per month"
              description="Full AI capabilities for households seeking maximum efficiency and automation."
              features={[
                "Unlimited household members",
                "AI receipt scanning",
                "Voice command interface",
                "Barcode scanning",
                "Advanced analytics & insights",
                "Predictive shopping lists",
                "Staples management",
                "Priority support",
                "Custom categories",
                "Export capabilities"
              ]}
              limitations={[]}
              buttonText="START 14-DAY TRIAL"
              buttonVariant="pipboy"
              popular={true}
              badge="RECOMMENDED"
            />
            
            {/* Enterprise Vault */}
            <PricingCard
              icon={<Building className="h-12 w-12 text-orange-400" />}
              title="ENTERPRISE VAULT"
              subtitle="Multi-Household Command Center"
              price="Custom"
              priceSubtext="Contact Sales"
              description="Advanced deployment for organizations managing multiple households or facilities."
              features={[
                "Multiple household support",
                "Custom AI model training",
                "Advanced reporting suite",
                "API access & integrations",
                "24/7 dedicated support",
                "On-premise deployment",
                "Custom branding",
                "SLA guarantees",
                "Training & onboarding",
                "Compliance certifications"
              ]}
              limitations={[]}
              buttonText="CONTACT VAULT-TEC"
              buttonVariant="pipboy-outline"
              popular={false}
              badge="ENTERPRISE"
            />
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              FEATURE COMPARISON MATRIX
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px] bg-black/80 border border-primary/30 rounded-lg">
              <div className="grid grid-cols-4 border-b border-primary/30">
                <div className="p-4">
                  <h3 className="font-mono-upper text-primary text-lg">FEATURES</h3>
                </div>
                <div className="p-4 text-center border-l border-primary/30">
                  <h3 className="font-mono-upper text-primary">BASIC</h3>
                </div>
                <div className="p-4 text-center border-l border-primary/30 bg-primary/10">
                  <h3 className="font-mono-upper text-primary">ADVANCED</h3>
                  <Badge className="mt-1 bg-primary text-black font-mono text-xs">POPULAR</Badge>
                </div>
                <div className="p-4 text-center border-l border-primary/30">
                  <h3 className="font-mono-upper text-primary">ENTERPRISE</h3>
                </div>
              </div>
              
              {/* Feature Rows */}
              <FeatureRow feature="Household Members" basic="Up to 4" advanced="Unlimited" enterprise="Unlimited" />
              <FeatureRow feature="AI Receipt Scanning" basic="—" advanced="✓" enterprise="✓ + Custom Training" />
              <FeatureRow feature="Voice Commands" basic="—" advanced="✓" enterprise="✓ + Custom Models" />
              <FeatureRow feature="Barcode Scanning" basic="—" advanced="✓" enterprise="✓" />
              <FeatureRow feature="Analytics" basic="Basic" advanced="Advanced" enterprise="Enterprise Suite" />
              <FeatureRow feature="API Access" basic="—" advanced="—" enterprise="Full API" />
              <FeatureRow feature="Support" basic="Community" advanced="Priority" enterprise="24/7 Dedicated" />
              <FeatureRow feature="Data Export" basic="—" advanced="CSV/JSON" enterprise="All Formats" />
              <FeatureRow feature="Custom Branding" basic="—" advanced="—" enterprise="Full White-label" />
              <FeatureRow feature="SLA Guarantee" basic="—" advanced="—" enterprise="99.9% Uptime" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              DEPLOYMENT QUERIES
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FAQCard
              question="Can I upgrade my vault package?"
              answer="Affirmative. Vault upgrades are processed instantly with no data loss. Your existing inventory and settings transfer seamlessly to the new configuration."
            />
            
            <FAQCard
              question="What happens to my data if I downgrade?"
              answer="All core inventory data remains intact. Advanced features like AI insights and voice recordings are archived but can be restored upon re-upgrade within 30 days."
            />
            
            <FAQCard
              question="Is there a trial period for Advanced Vault?"
              answer="Confirmed. All new Advanced Vault deployments include a 14-day trial period with full feature access. No payment required during trial phase."
            />
            
            <FAQCard
              question="How secure is my household data?"
              answer="All data transmissions use quantum-grade encryption. Your vault operates on isolated secure servers with regular security audits and compliance certifications."
            />
            
            <FAQCard
              question="Can I cancel my subscription?"
              answer="Affirmative. Subscriptions can be terminated at any time through your vault control panel. No termination fees or penalties apply."
            />
            
            <FAQCard
              question="Do you offer educational discounts?"
              answer="Confirmed. Students and educational institutions receive 50% discount on Advanced Vault packages. Verification required through our support channels."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-mono-upper text-primary">
              READY TO DEPLOY YOUR VAULT?
            </h2>
            <p className="text-lg font-mono text-primary/70">
              Join thousands of households optimizing their food management with PantrySync.
              Start your free trial today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="pipboy" size="lg" className="text-lg px-8 py-6">
                <Link to="/" className="flex items-center gap-2">
                  INITIALIZE FREE VAULT
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="pipboy-outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/features">
                  REVIEW CAPABILITIES
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

interface PricingCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  price: string;
  priceSubtext: string;
  description: string;
  features: string[];
  limitations: string[];
  buttonText: string;
  buttonVariant: "pipboy" | "pipboy-outline";
  popular: boolean;
  badge: string;
}

function PricingCard({ 
  icon,
  title, 
  subtitle,
  price, 
  priceSubtext,
  description, 
  features, 
  limitations,
  buttonText, 
  buttonVariant,
  popular,
  badge
}: PricingCardProps) {
  return (
    <Card className={`bg-black/80 border-primary/30 relative transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${
      popular ? 'border-primary/70 shadow-lg shadow-primary/20 scale-105' : 'hover:border-primary/50'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-black font-mono-upper px-6 py-2 text-sm">
            MOST POPULAR
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">{icon}</div>
        
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-xl font-mono-upper text-primary">
              {title}
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono border-primary/50 text-primary">
              {badge}
            </Badge>
          </div>
          <p className="text-primary/60 font-mono text-sm">{subtitle}</p>
        </div>
        
        <div className="space-y-1">
          <div className="text-4xl font-mono-upper text-primary">
            {price}
          </div>
          <p className="font-mono text-primary/70 text-sm">
            {priceSubtext}
          </p>
        </div>
        
        <p className="font-mono text-primary/70 text-sm leading-relaxed">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-mono-upper text-primary text-sm mb-3">INCLUDED FEATURES:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="font-mono text-primary/80 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {limitations.length > 0 && (
          <div className="pt-2 border-t border-primary/20">
            <h4 className="font-mono-upper text-primary/60 text-sm mb-3">LIMITATIONS:</h4>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-4 h-4 border border-primary/30 rounded mt-0.5 flex-shrink-0" />
                  <span className="font-mono text-primary/60 text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          variant={buttonVariant}
          className="w-full mt-6"
          asChild
        >
          <Link to="/">{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface FeatureRowProps {
  feature: string;
  basic: string;
  advanced: string;
  enterprise: string;
}

function FeatureRow({ feature, basic, advanced, enterprise }: FeatureRowProps) {
  return (
    <div className="grid grid-cols-4 border-b border-primary/30 last:border-b-0">
      <div className="p-3 font-mono text-primary/80 text-sm">{feature}</div>
      <div className="p-3 text-center border-l border-primary/30 font-mono text-primary/70 text-sm">{basic}</div>
      <div className="p-3 text-center border-l border-primary/30 bg-primary/5 font-mono text-primary text-sm">{advanced}</div>
      <div className="p-3 text-center border-l border-primary/30 font-mono text-primary/70 text-sm">{enterprise}</div>
    </div>
  );
}

interface FAQCardProps {
  question: string;
  answer: string;
}

function FAQCard({ question, answer }: FAQCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-mono-upper text-primary">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-primary/70 text-sm leading-relaxed">
          {answer}
        </p>
      </CardContent>
    </Card>
  );
}

export default Pricing;
