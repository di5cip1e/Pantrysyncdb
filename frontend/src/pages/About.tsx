import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Users,
  Target,
  Award,
  Shield,
  Zap,
  Brain,
  Globe,
  Heart,
  Lightbulb
} from "lucide-react";

function About() {
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
              [VAULT-TEC ORIGINS]
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-mono-upper text-primary drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">
              ABOUT PANTRYSYNC
            </h1>
            
            <p className="text-xl font-mono text-primary/70 max-w-3xl mx-auto leading-relaxed">
              Born from the vision of eliminating household food waste through
              advanced artificial intelligence and collaborative technology.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="text-4xl font-mono-upper text-primary">
                  MISSION DIRECTIVE
                </h2>
              </div>
              <p className="font-mono text-primary/70 text-lg leading-relaxed">
                To revolutionize household food management through intelligent automation,
                eliminating waste while maximizing efficiency and family collaboration.
              </p>
              <p className="font-mono text-primary/70 leading-relaxed">
                We believe every household deserves access to advanced technology that
                simplifies daily life, reduces environmental impact, and brings families
                together through shared responsibility.
              </p>
            </div>
            
            <Card className="bg-black/80 border-primary/30">
              <CardHeader>
                <CardTitle className="font-mono-upper text-primary flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  GLOBAL IMPACT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-mono-upper text-primary">2.1M</div>
                    <div className="font-mono text-primary/70 text-sm">HOUSEHOLDS SERVED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-mono-upper text-primary">47%</div>
                    <div className="font-mono text-primary/70 text-sm">WASTE REDUCTION</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-mono-upper text-primary">$890M</div>
                    <div className="font-mono text-primary/70 text-sm">SAVINGS GENERATED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-mono-upper text-primary">156</div>
                    <div className="font-mono text-primary/70 text-sm">COUNTRIES</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              VAULT-TEC ORIGIN STORY
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-black/80 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 border-primary/50 text-primary font-mono">
                    2019
                  </Badge>
                  <CardTitle className="font-mono-upper text-primary">
                    THE PROBLEM IDENTIFIED
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-primary/70 leading-relaxed">
                  Founded by a team of former Vault-Tec engineers who witnessed firsthand
                  the inefficiencies in household resource management. After analyzing data
                  from thousands of households, we discovered that 40% of purchased food
                  was being wasted due to poor inventory tracking and lack of coordination.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 border-primary/50 text-primary font-mono">
                    2020-2022
                  </Badge>
                  <CardTitle className="font-mono-upper text-primary">
                    TECHNOLOGY DEVELOPMENT
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-primary/70 leading-relaxed">
                  Three years of intensive R&D resulted in breakthrough AI algorithms
                  for image recognition, natural language processing, and predictive analytics.
                  Our neural networks achieved 99.7% accuracy in receipt processing and
                  95% accuracy in voice command interpretation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/80 border-primary/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 border-primary/50 text-primary font-mono">
                    2023-2024
                  </Badge>
                  <CardTitle className="font-mono-upper text-primary">
                    GLOBAL DEPLOYMENT
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-primary/70 leading-relaxed">
                  PantrySync launched globally, quickly becoming the preferred household
                  management system for over 2 million families. Our commitment to privacy,
                  security, and continuous innovation has earned industry recognition and
                  user trust worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              OPERATIONAL PRINCIPLES
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<Brain className="h-10 w-10 text-purple-400" />}
              title="INNOVATION"
              description="Continuously advancing AI technology to solve real household challenges."
            />
            
            <ValueCard
              icon={<Shield className="h-10 w-10 text-green-400" />}
              title="PRIVACY"
              description="Your household data remains encrypted and under your complete control."
            />
            
            <ValueCard
              icon={<Heart className="h-10 w-10 text-red-400" />}
              title="FAMILY-FIRST"
              description="Designed to bring families together through collaborative household management."
            />
            
            <ValueCard
              icon={<Globe className="h-10 w-10 text-blue-400" />}
              title="SUSTAINABILITY"
              description="Committed to reducing global food waste and environmental impact."
            />
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              VAULT COMMAND STRUCTURE
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TeamMember
              name="DR. SARAH CHEN"
              title="Chief Executive Officer"
              background="Former Vault-Tec Senior Engineer, 15 years in AI research"
              achievement="Led development of quantum-encrypted synchronization protocols"
            />
            
            <TeamMember
              name="MARCUS RODRIGUEZ"
              title="Chief Technology Officer"
              background="Ex-RobCo Industries, Neural network architecture specialist"
              achievement="Pioneered real-time OCR processing with 99.7% accuracy"
            />
            
            <TeamMember
              name="DR. ELENA PETROV"
              title="Head of AI Research"
              background="Former MIT AI Lab, Published 47 papers on machine learning"
              achievement="Created predictive algorithms reducing waste by 47%"
            />
            
            <TeamMember
              name="JAMES WRIGHT"
              title="VP of Product"
              background="20+ years in consumer technology, Former Apple design lead"
              achievement="Designed intuitive interfaces serving 2M+ households"
            />
            
            <TeamMember
              name="PRIYA SHARMA"
              title="Head of Security"
              background="Former NSA cybersecurity specialist, Vault-Tec security protocols"
              achievement="Implemented zero-breach security architecture"
            />
            
            <TeamMember
              name="DAVID KIM"
              title="VP of Operations"
              background="Global operations expert, Former Tesla supply chain director"
              achievement="Scaled platform to 156 countries with 99.9% uptime"
            />
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-mono-upper text-primary mb-4">
              RECOGNITION & ACHIEVEMENTS
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AwardCard
              year="2024"
              title="AI Innovation Award"
              organization="Tech Excellence Institute"
              description="Outstanding achievement in household AI applications"
            />
            
            <AwardCard
              year="2024"
              title="Best Consumer App"
              organization="Digital Innovation Awards"
              description="Most impactful consumer technology solution"
            />
            
            <AwardCard
              year="2023"
              title="Sustainability Leader"
              organization="Green Tech Alliance"
              description="Significant contribution to waste reduction"
            />
            
            <AwardCard
              year="2023"
              title="Customer Choice"
              organization="App Store Awards"
              description="Highest rated household management app"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-mono-upper text-primary">
              JOIN THE PANTRYSYNC MISSION
            </h2>
            <p className="text-lg font-mono text-primary/70">
              Be part of the global movement toward intelligent household management.
              Together, we can eliminate waste and optimize efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild variant="pipboy" size="lg" className="text-lg px-8 py-6">
                <Link to="/" className="flex items-center gap-2">
                  START YOUR VAULT
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="pipboy-outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/features">
                  EXPLORE FEATURES
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

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300 text-center">
      <CardHeader>
        <div className="flex justify-center mb-3">{icon}</div>
        <CardTitle className="font-mono-upper text-primary text-lg">
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

interface TeamMemberProps {
  name: string;
  title: string;
  background: string;
  achievement: string;
}

function TeamMember({ name, title, background, achievement }: TeamMemberProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="font-mono-upper text-primary text-lg">
            {name}
          </CardTitle>
          <Badge variant="outline" className="font-mono border-primary/50 text-primary text-xs">
            {title}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-mono text-primary/70 text-sm leading-relaxed">
          {background}
        </p>
        <div className="pt-2 border-t border-primary/20">
          <p className="font-mono text-primary/60 text-xs">
            • {achievement}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface AwardCardProps {
  year: string;
  title: string;
  organization: string;
  description: string;
}

function AwardCard({ year, title, organization, description }: AwardCardProps) {
  return (
    <Card className="bg-black/80 border-primary/30 hover:border-primary/50 transition-all duration-300 text-center">
      <CardHeader>
        <div className="flex justify-center mb-3">
          <Award className="h-8 w-8 text-yellow-400" />
        </div>
        <Badge className="bg-primary/20 border-primary/50 text-primary font-mono mb-2">
          {year}
        </Badge>
        <CardTitle className="font-mono-upper text-primary text-lg">
          {title}
        </CardTitle>
        <p className="font-mono text-primary/60 text-sm">{organization}</p>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-primary/70 text-xs leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default About;
