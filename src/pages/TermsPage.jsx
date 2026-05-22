export default function TermsPage() {
  return (
    <div className="bg-[#fafdfb] min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Last updated: January 2025</p>
        </div>

        {[
          {
            title: "Acceptance of Terms",
            content: "By using ReCupare, you agree to these terms. If you do not agree, please do not use the platform. These terms apply to all users — buyers, sellers, and visitors."
          },
          {
            title: "Platform Use",
            content: "ReCupare is a marketplace for recovered electronic components. You may use the platform to list, buy, and sell components. You must be at least 18 years old to transact. You are responsible for the accuracy of your listings."
          },
          {
            title: "Seller Responsibilities",
            content: "Sellers must accurately describe component condition and grade. Misrepresenting a component's condition is grounds for account suspension. Sellers are responsible for safe packaging and timely shipping of sold items."
          },
          {
            title: "Buyer Responsibilities",
            content: "Buyers must complete payment for accepted purchases. Disputes must be raised within 7 days of receiving a component. ReCupare is not responsible for components damaged during shipping."
          },
          {
            title: "Platform Fees",
            content: "ReCupare charges a 3% fee on successful sales. This fee is deducted from the seller's earnings. Listing components is free. Donations (zero-price listings) are not subject to fees."
          },
          {
            title: "Prohibited Items",
            content: "You may not list stolen components, counterfeit products, hazardous materials without proper labeling, or items that violate Indian law. Violations result in immediate account termination."
          },
          {
            title: "Limitation of Liability",
            content: "ReCupare provides the platform as-is. We are not liable for disputes between buyers and sellers, component quality beyond what is stated in listings, or losses arising from platform downtime."
          },
          {
            title: "Governing Law",
            content: "These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Delhi, India."
          },
        ].map(section => (
          <div key={section.title} className="bg-white border border-[#e2ece6] rounded-2xl p-6 space-y-2 shadow-sm">
            <h2 className="font-black text-slate-800 text-base">{section.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
