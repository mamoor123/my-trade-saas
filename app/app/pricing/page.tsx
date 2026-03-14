import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Standard",
    price: "€29",
    description: "Perfect for small importers below the 50-tonne limit.",
    features: [
      "Track up to 50 Tonnes/year",
      "Full Customs Dossier PDF",
      "TARIC Code Guidance",
      "Email Support"
    ],
    checkoutUrl: "YOUR_LEMON_SQUEEZY_STANDARD_CHECKOUT_URL", // Replace this
    color: "blue"
  },
  {
    name: "Professional",
    price: "€89",
    description: "For high-volume importers requiring constant compliance.",
    features: [
      "Unlimited Annual Tonnage",
      "Priority PDF Generation",
      "Y238 Verification Logic",
      "Multiple Company Profiles",
      "Direct Support"
    ],
    checkoutUrl: "YOUR_LEMON_SQUEEZY_PRO_CHECKOUT_URL", // Replace this
    color: "indigo"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Compliance Plan</h1>
        <p className="text-xl text-gray-600">Secure your trade operations for the 2026 CBAM transition.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
            <div className={`p-8 bg-${plan.color}-600 text-white`}>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
              <p className="mt-2 text-blue-100">{plan.description}</p>
            </div>
            
            <div className="p-8 flex-grow flex flex-col">
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href={plan.checkoutUrl}
                className={`w-full text-center py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Get Started with {plan.name}
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2">
          Skip to Dashboard (Free Tier) <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
