export default function PrivacyPage() {
  return (
    <div className="bg-[#fafdfb] min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: January 2025</p>
        </div>

        {[
          {
            title: "Information We Collect",
            content: "We collect information you provide directly — name, email, city, and profile details when you register. We also collect scan data (images you upload for component detection), listing information, and transaction records when you buy or sell on the marketplace."
          },
          {
            title: "How We Use Your Information",
            content: "Your information is used to operate the platform, process payments via Razorpay, generate AI-powered component analysis, display your impact statistics, and send important account notifications. We do not sell your personal data to third parties."
          },
          {
            title: "Data Storage",
            content: "Your data is stored securely on Supabase (PostgreSQL) with row-level security policies. Images are stored in Supabase Storage. Payment data is handled by Razorpay and we only store payment IDs for order tracking — never card details."
          },
          {
            title: "AI & Image Processing",
            content: "Images you upload for scanning are processed by our YOLO detection model and optionally by Groq's vision AI. Images may be temporarily stored to generate component analysis. We do not use your images to train third-party models."
          },
          {
            title: "Cookies",
            content: "We use session storage to maintain your login state. We do not use tracking cookies or third-party advertising cookies."
          },
          {
            title: "Your Rights",
            content: "You can request deletion of your account and all associated data at any time by contacting us at hello@recupare.in. You can also update your profile information from your profile page."
          },
          {
            title: "Contact",
            content: "For privacy-related questions, contact us at hello@recupare.in. We respond within 48 hours."
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
