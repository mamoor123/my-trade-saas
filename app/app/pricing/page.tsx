"use client";

import React from 'react';
import { Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Standard",
    price: "€29",
    description: "Ideal for small importers staying within the 50-tonne limit.",
    features: [
      "Track up to 50 Tonnes/year",
      "Full Customs Dossier PDF",
      "TARIC Code Y238 Guidance",
      "Email Support"
    ],
    // REPLACE with your actual LemonSqueezy link
    checkoutUrl: "https://yourstore.lemonsqueezy.com/checkout/buy/STANDARD_VARIANT_ID",
    icon: <ShieldCheck className="w-6 h-6" />,
    buttonClass: "bg-blue-600 hover:bg-blue-700"
  },
  {
    name: "Professional",
    price: "€89",
    description: "For high-volume businesses requiring full compliance tracking.",
    features: [
      "Unlimited Annual Tonnage",
      "Priority PDF Generation",
      "Advanced Compliance Logic",
      "Multiple Company Profiles",
      "Direct Priority Support"
    ],
    // REPLACE with your actual LemonSqueezy link
    checkoutUrl: "https://yourstore.lemonsqueezy.com/checkout/buy/PRO_VARIANT_ID",
    icon: <Zap className="w-6 h-6" />,
    buttonClass: "bg-indigo-600 hover:bg-indigo-700"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 font-sans">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Choose Your Compliance Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Scale your trade operations confidently for the 2026 CBAM transition with automated dossier tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]"
          >
            {/* Header Section */}
            <div className="p-8 border-b border-gray-50">
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                {plan.icon}
                <span className="font-bold uppercase tracking-wider text-sm">{plan.name}</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="ml-1 text-xl font-medium text-gray-500">/month</span>
              </div>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {plan.description}
              </p>
            </div>
            
            {/* Features List */}
            <div className="p-8 flex-grow flex flex-col">
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Checkout Button */}
              <a 
                href={plan.checkoutUrl}
                className={`w-full text-center py-4 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${plan.buttonClass}`}
              >
                Get Started with {plan.name}
              </a>
              
              <p className="mt-4 text-center text-xs text-gray-400">
                Secure payment via LemonSqueezy. Cancel anytime.
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Footer */}
      <div className="mt-16 text-center">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          Return to Dashboard <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
