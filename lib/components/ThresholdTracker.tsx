// components/ThresholdTracker.tsx
"use client";

export default function ThresholdTracker({ totalMass, percentage, isExempt }: any) {
  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-gray-800">2026 Exemption Tracker</h3>
      <p className="text-sm text-gray-500 mb-4">Cumulative Annual Net Mass (50t Limit)</p>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div 
          className={`h-4 rounded-full ${isExempt ? 'bg-green-500' : 'bg-red-500'}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm font-medium">
        <span>{totalMass.toLocaleString()} kg</span>
        <span>50,000 kg</span>
      </div>

      <div className={`mt-4 p-3 rounded-lg text-sm ${isExempt ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
        {isExempt 
          ? "✓ You are currently under the 50-tonne exemption limit." 
          : "⚠ Threshold exceeded. Authorised CBAM Declarant status required."}
      </div>
    </div>
  );
}
