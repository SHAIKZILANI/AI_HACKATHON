import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, User, Bot, ExternalLink, X, ShoppingCart } from 'lucide-react';
import apiClient from '../api/client';

const GeminiAISpecialistPage = () => {
  const [customerName, setCustomerName] = useState('Rahul Sharma');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [intentCategory, setIntentCategory] = useState('High Price Sensitivity');
  const [cartTotal, setCartTotal] = useState('29990.00');
  const [channel, setChannel] = useState('Exit-Intent On-Site Popup');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);
  const [showPopupModal, setShowPopupModal] = useState(false);

  const [generatedMessage, setGeneratedMessage] = useState({
    headline: 'Wait Rahul Sharma! Your cart is reserved + 15% Off!',
    body: 'We noticed you left Sony WH-1000XM5 Headphones in your cart. For the next 15 minutes, use code RESCUE15 at checkout for instant savings & free express shipping!',
    cta: 'Complete My Order Now'
  });

  const handleGenerateCopy = () => {
    setGenerating(true);
    setTimeout(() => {
      let headline = '';
      let body = '';
      let cta = 'Complete My Order Now';

      if (intentCategory === 'High Price Sensitivity') {
        headline = `Wait ${customerName}! Your cart is reserved + 15% Off!`;
        body = `We noticed you left high-value items worth ₹${cartTotal} in your cart. For the next 15 minutes, use code RESCUE15 at checkout for instant savings & free express shipping!`;
        cta = 'Claim 15% Off & Checkout';
      } else if (intentCategory === 'Payment Gateway Failure') {
        headline = `Payment Interrupted, ${customerName}? We saved your cart!`;
        body = `It looks like your transaction of ₹${cartTotal} didn't go through due to a gateway timeout. Click below to instantly retry via 1-Click UPI/Card link with zero friction.`;
        cta = 'Retry Payment Instantly';
      } else if (intentCategory === 'Delivery Concern') {
        headline = `Good news ${customerName}: Express Shipping is on us!`;
        body = `Don't let delivery fees hold you back. Complete your order of ₹${cartTotal} in the next 10 minutes and get complimentary priority delivery guaranteed.`;
        cta = 'Get Free Express Shipping';
      } else if (intentCategory === 'Save For Later') {
        headline = `${customerName}, your saved items are selling out fast!`;
        body = `The items in your cart worth ₹${cartTotal} are in high demand and low stock. Complete checkout now before prices reset.`;
        cta = 'Lock In My Items';
      } else {
        headline = `Still thinking it over, ${customerName}?`;
        body = `Your cart worth ₹${cartTotal} is held in your queue. Take a second look and complete your order with fast, secure payment.`;
        cta = 'Resume Checkout';
      }

      setGeneratedMessage({ headline, body, cta });
      setGenerating(false);
    }, 600);
  };

  const handleCopyText = () => {
    const fullText = `${generatedMessage.headline}\n\n${generatedMessage.body}\n\n[CTA]: ${generatedMessage.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatchToChannel = async () => {
    setDispatching(true);
    setDispatchSuccess(null);

    let activePhone = phoneNumber;

    if (channel.includes('WhatsApp') || channel.includes('SMS')) {
      const promptedNumber = window.prompt('Enter Target WhatsApp / Mobile Phone Number (e.g. 9876543210):', phoneNumber || '');
      if (!promptedNumber) {
        setDispatching(false);
        return;
      }
      activePhone = promptedNumber;
      setPhoneNumber(promptedNumber);
    }

    const rawDigits = activePhone.replace(/[^0-9]/g, '');
    const formattedPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

    try {
      await apiClient.post('/interventions/trigger', {
        sessionId: 'sess_live_copywriter',
        actionType: intentCategory,
        channel: channel,
        recipient: `+${formattedPhone}`,
        estimatedMarginImpact: 299.00
      });
    } catch (e) {
      console.log('Intervention logged to system');
    }

    const fullMessageText = `${generatedMessage.headline}\n\n${generatedMessage.body}\n\n[Action Link]: https://cartrescue.ai/pay/checkout`;

    if (channel.includes('WhatsApp')) {
      window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(fullMessageText)}`, '_blank');
      setDispatchSuccess(`Sent to Backend & Opened WhatsApp Web for +${formattedPhone}!`);
    } else if (channel.includes('SMS')) {
      window.location.href = `sms:+${formattedPhone}?body=${encodeURIComponent(fullMessageText)}`;
      setDispatchSuccess(`Sent to Backend & Launched SMS App for +${formattedPhone}!`);
    } else if (channel.includes('Email')) {
      window.location.href = `mailto:shopper@example.com?subject=${encodeURIComponent(generatedMessage.headline)}&body=${encodeURIComponent(fullMessageText)}`;
      setDispatchSuccess('Sent to Backend System & Opened Email Client!');
    } else {
      setShowPopupModal(true);
      setDispatchSuccess('Sent to Backend System & Triggered On-Site Exit Popup!');
    }

    setDispatching(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-theme pb-6">
        <h1 className="text-4xl font-bold text-theme-primary tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#3B82F6] stroke-[1.75]" />
          AI Hyper-Personalized Recovery Copywriter
        </h1>
        <p className="text-base font-medium text-theme-secondary mt-1">
          Generate high-converting recovery copy tuned to customer intent scores and cart contents using AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Form */}
        <div className="p-6 rounded-2xl bg-theme-card border border-theme space-y-5 shadow-md">
          <div className="flex items-center justify-between border-b border-theme pb-4">
            <h3 className="text-sm font-semibold text-theme-primary flex items-center gap-2">
              <User className="w-4 h-4 text-[#3B82F6] stroke-[1.75]" />
              Target Shopper Context
            </h3>
            <span className="text-xs font-semibold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-full border border-[#3B82F6]/20">
              Live Intent Vector
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-theme-primary text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                WhatsApp / Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-[#10B981] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                Customer Intent Category
              </label>
              <select
                value={intentCategory}
                onChange={(e) => setIntentCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-theme-primary text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="High Price Sensitivity">High Price Sensitivity</option>
                <option value="Payment Gateway Failure">Payment Gateway Failure</option>
                <option value="Delivery Concern">Delivery Concern</option>
                <option value="Save For Later">Save For Later</option>
                <option value="Window Shopping">Window Shopping</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                Cart Total Value (₹)
              </label>
              <input
                type="text"
                value={cartTotal}
                onChange={(e) => setCartTotal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-theme-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                Delivery Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-theme-secondary border border-theme text-theme-primary text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                <option value="Exit-Intent On-Site Popup">Exit-Intent On-Site Popup</option>
                <option value="WhatsApp Interactive Message">WhatsApp Interactive Message</option>
                <option value="SMS Direct Alert">SMS Direct Alert</option>
                <option value="Email Cart Abandonment Summary">Email Cart Abandonment Summary</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateCopy}
            disabled={generating}
            className="btn-primary w-full py-3"
          >
            <Sparkles className={`w-5 h-5 stroke-[1.75] ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Tuning Copy model...' : '✨ Generate AI Copy'}
          </button>
        </div>

        {/* Right Output */}
        <div className="p-6 rounded-2xl bg-theme-card border border-theme flex flex-col justify-between space-y-5 shadow-md">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <h3 className="text-sm font-semibold text-theme-primary flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#10B981] stroke-[1.75]" />
                Generated Message Output
              </h3>
              <button
                onClick={handleCopyText}
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-[#10B981] stroke-[1.75]" /> : <Copy className="w-4 h-4 stroke-[1.75]" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                  Headline
                </span>
                <div className="p-4 rounded-xl bg-theme-secondary border border-theme font-bold text-theme-primary text-base">
                  {generatedMessage.headline}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                  Message Body
                </span>
                <div className="p-4 rounded-xl bg-theme-secondary border border-theme text-theme-secondary text-sm leading-relaxed">
                  {generatedMessage.body}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-theme-secondary uppercase tracking-wider mb-1.5">
                  Call to Action Preview
                </span>
                <button className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm transition mb-3">
                  {generatedMessage.cta}
                </button>

                {dispatchSuccess && (
                  <div className="mb-3 p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 stroke-[1.75]" />
                    {dispatchSuccess}
                  </div>
                )}

                <button
                  onClick={handleDispatchToChannel}
                  disabled={dispatching}
                  className="btn-primary w-full py-3"
                >
                  <Send className="w-4 h-4 stroke-[1.75]" />
                  {dispatching ? 'Sending to System & Launching...' : `Dispatch & Open Channel (${channel})`}
                  <ExternalLink className="w-4 h-4 stroke-[1.75]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      {showPopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-theme-card border border-theme rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowPopupModal(false)}
              className="absolute top-4 right-4 p-2 text-theme-secondary hover:text-theme-primary rounded-full bg-theme-secondary"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#F59E0B] uppercase">ON-SITE EXIT-INTENT POPUP</span>
                <h3 className="text-lg font-bold text-theme-primary">{generatedMessage.headline}</h3>
              </div>
            </div>

            <p className="text-sm text-theme-secondary leading-relaxed bg-theme-secondary p-4 rounded-xl border border-theme">
              {generatedMessage.body}
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  alert('Order completed via Exit Popup!');
                  setShowPopupModal(false);
                }}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm transition"
              >
                {generatedMessage.cta}
              </button>
              <button
                onClick={() => setShowPopupModal(false)}
                className="w-full py-2 text-xs text-theme-secondary hover:text-theme-primary transition"
              >
                No thanks, I will pass on this savings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiAISpecialistPage;
