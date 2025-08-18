import TitleSection from "@/components/landingPage/titleSection";
import { Button } from "@/components/ui/button";
import React from "react";
import AppBanner from "../../../public/appBanner.png";
import Diamond from "../../../public/diamond.svg";
import Check from "../../../public/check.svg";

import Image from "next/image";
import { CLIENTS, PRICING_CARDS, PRICING_PLANS, USERS, FEATURES, STATS } from "@/lib/CONSTANT";
import { randomUUID } from "crypto";
import CustomCard from "@/components/landingPage/CustomCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
function page() {
  return (
    <>
      <section className="overflow-hidden px-4 sm:px-6 flex flex-col items-center justify-center min-h-screen relative ">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-72 w-72 rounded-full bg-brand-primary-purple/20 blur-[100px]"></div>
        
        <div className="text-center space-y-8 max-w-5xl mx-auto mt-20">
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-brand-primary-purple/20 text-brand-primary-purple">
            ✨ Trusted by 100K+ teams worldwide
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Ideas,
            <br />
            <span className="bg-gradient-to-r from-brand-primary-purple to-brand-primary-blue bg-clip-text text-transparent">
              Beautifully Organized
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The all-in-one workspace that brings your notes, tasks, docs, and team together. 
            Experience the future of productivity with AI-powered collaboration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <div className="p-[2px] bg-gradient-to-r from-brand-primary-purple to-brand-primary-blue rounded-xl">
              <form action={async () => {
                "use server";
                redirect("/login");
              }}>
              <Button size="lg" className="bg-background hover:bg-background/90 text-foreground px-8 py-6 text-lg rounded-[10px]" type="submit">
                Start Building for Free
              </Button>
              </form>
            </div>
            
          </div>
          
          <div className="pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl font-bold text-brand-primary-purple">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-16 w-full max-w-6xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
          <Image
            src={AppBanner}
            alt="Arcane Workspace Preview"
            className="rounded-2xl shadow-2xl border border-border/50"
            priority
          />
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              Trusted Partners
            </Badge>
            <p className="text-muted-foreground">Join thousands of companies already using Arcane</p>
          </div>
          
          <div className="overflow-hidden">
            <div className="flex animate-slide">
              {CLIENTS.map((client, idx) => (
                <div key={idx} className="flex-shrink-0 w-48 mx-8 opacity-60 hover:opacity-100 transition-opacity">
                  <Image
                    src={client.logo}
                    alt={client.alt}
                    width={200}
                    height={80}
                    className="object-contain h-12 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-brand-primary-purple/10 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-brand-primary-purple to-brand-primary-blue bg-clip-text text-transparent">
                work smarter
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From AI-powered content generation to real-time collaboration, 
              Arcane has all the tools your team needs to succeed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <CustomCard
                key={index}
                className="p-8 border border-border/50 hover:border-brand-primary-purple/50 transition-colors duration-300 bg-background/50 backdrop-blur-sm"
                CustomHeader={
                  <div className="space-y-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                }
                CustomContent={
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold">
              Loved by teams
              <br />
              <span className="bg-gradient-to-r from-brand-primary-purple to-brand-primary-blue bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From startups to enterprises, see how teams are transforming 
              their workflow with Arcane.
            </p>
          </div>
          
          <div className="space-y-8">
            {[...Array(2)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex gap-6 ${
                  rowIndex === 1 ? 'animate-slide-reverse' : 'animate-slide'
                }`}
              >
                {USERS.map((user, idx) => (
                  <CustomCard
                    key={`${rowIndex}-${idx}`}
                    className="min-w-[400px] bg-background/80 backdrop-blur-sm border border-border/50"
                    CustomHeader={
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/avatars/${(idx % 19) + 1}.png`}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-brand-primary-purple/10">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <CardTitle className="text-lg">{user.name}</CardTitle>
                          <CardDescription className="text-brand-primary-purple">
                            {user.role} at {user.company}
                          </CardDescription>
                        </div>
                      </div>
                    }
                    CustomContent={
                      <blockquote className="text-muted-foreground italic leading-relaxed">
                        "{user.message}"
                      </blockquote>
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold">
              Simple, transparent
              <br />
              <span className="bg-gradient-to-r from-brand-primary-purple to-brand-primary-blue bg-clip-text text-transparent">
                pricing
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your team. Upgrade or downgrade at any time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PRICING_CARDS.map((card, index) => (
              <CustomCard
                key={card.planType}
                className={`relative p-8 ${
                  card.planType === PRICING_PLANS.proplan
                    ? 'border-2 border-brand-primary-purple scale-105 bg-gradient-to-b from-brand-primary-purple/5 to-transparent'
                    : 'border border-border/50'
                } hover:border-brand-primary-purple/50 transition-all duration-300`}
                CustomHeader={
                  <div className="space-y-4">
                    {card.planType === PRICING_PLANS.proplan && (
                      <Badge className="bg-brand-primary-purple text-white">
                        Most Popular
                      </Badge>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold">{card.planType}</h3>
                      <p className="text-muted-foreground mt-2">{card.description}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${card.price}</span>
                      {+card.price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </div>
                }
                CustomContent={
                  <div className="space-y-6">
                    <Button 
                      className={`w-full py-6 text-lg ${
                        card.planType === PRICING_PLANS.proplan
                          ? 'bg-brand-primary-purple hover:bg-brand-primary-purple/90'
                          : ''
                      }`}
                      variant={card.planType === PRICING_PLANS.proplan ? 'default' : 'outline'}
                    >
                      {card.planType === PRICING_PLANS.proplan ? 'Start Free Trial' : 'Get Started'}
                    </Button>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-brand-primary-purple">
                        {card.highlightFeature}
                      </h4>
                      <ul className="space-y-3">
                        {card.freatures.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <Image src={Check} alt="check" width={16} height={16} />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-brand-primary-purple/10 via-brand-primary-blue/10 to-brand-primary-purple/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold">
            Ready to transform
            <br />
            <span className="bg-gradient-to-r from-brand-primary-purple to-brand-primary-blue bg-clip-text text-transparent">
              how you work?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join 100,000+ teams already using Arcane to build better, faster, and smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <div className="p-[2px] bg-gradient-to-r from-brand-primary-purple to-brand-primary-blue rounded-xl">
              <Button size="lg" className="bg-background hover:bg-background/90 text-foreground px-8 py-6 text-lg rounded-[10px]">
                Start Building for Free
              </Button>
            </div>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>
    </>
  );
}

export default page;
