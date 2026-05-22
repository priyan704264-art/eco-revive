export default function RefundPage() {
  return (
    <div className="bg-[#fafdfb] min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800">Refund Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: January 2025</p>
        </div>

        <div className="bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 rounded-2xl p-5">
          <p className="text-[#0F9D8A] font-bold text-sm">
            We want every transaction on ReCupare to be fair and transparent. Here's how refunds work.
          </p>
        </div>

        {[
          {
            title: "Eligible Refund Cases",
            content: "Refunds are issued when: (1) The component received is significantly different from the listing description, (2) The component is non-functional when listed as working, (3) The item was not delivered within 15 days of purchase, (4) Payment was charged but no order was created."
          },
          {
            title: "How to Request a Refund",
            content: "Contact us at hello@recupare.in within 7 days of receiving your order. Include your order ID, payment ID, and a description of the issue with photos if applicable. We will respond within 48 hours."
          },
          {
            title: "Refund Timeline",
            content: "Approved refunds are processed within 5-7 business days back to the original payment method. Razorpay refunds typically appear in 3-5 business days after processing."
          },
          {
            title: "Non-Refundable Cases",
            content: "Refunds are not issued for: change of mind after purchase, minor cosmetic differences not affecting functionality, components damaged by the buyer after receipt, or disputes raised after 7 days of delivery."
          },
          {
            title: "Platform Fee",
            content: "The 3% platform fee is non-refundable in cases where the transaction was completed and the dispute is between buyer and seller. It is refunded if the payment failed or was not processed correctly."
          },
          {
            title: "Contact",
            content: "For refund requests: hello@recupare.in. Please include 'REFUND REQUEST' in the subject line along with your order ID."
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
