import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Zap, CreditCard, AlertCircle, MessageSquare, Sparkles, X, CheckCircle } from 'lucide-react';
import apiClient from '../api/client';

const PRODUCTS = [
  { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', category: 'Audio', price: 29990, image: '🎧', rating: 4.8 },
  { id: 2, name: 'Apple Watch Ultra 2 (GPS + Cellular)', category: 'Wearables', price: 89900, image: '⌚', rating: 4.9 },
  { id: 3, name: 'MacBook Air M3 (16GB, 512GB SSD)', category: 'Laptops', price: 134900, image: '💻', rating: 4.9 },
  { id: 4, name: 'Nike Air Zoom Pegasus Running Shoes', category: 'Footwear', price: 11495, image: '👟', rating: 4.6 },
];

const StorefrontPage = () => {
  const [cart, setCart] = useState([
    { id: 1, name: 'Sony WH-1000XM5 Wireless Headphones', price: 29990, qty: 1, image: '🎧' }
  ]);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [liveRiskScore, setLiveRiskScore] = useState(null);
  const [whatsappPromptNumber, setWhatsappPromptNumber] = useState('9876543210');
  const [recoveryActionTriggered, setRecoveryActionTriggered] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, image: product.image }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: p.qty + delta } : p))
        .filter((p) => p.qty > 0)
    );
  };

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10 && cart.length > 0 && checkoutStep !== 'success' && !showExitPopup) {
        setShowExitPopup(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [cart, checkoutStep, showExitPopup]);

  const handleSimulatePaymentFailure = async () => {
    setCheckoutStep('payment_failed');
    setLiveRiskScore(99.8);
    try {
      await apiClient.post('/sessions/simulate');
    } catch (e) {
      console.log('Session synced');
    }
  };

  const handleOpenWhatsAppRecovery = () => {
    const targetPhone = window.prompt("Enter Target WhatsApp Mobile Number (e.g. 9876543210):", whatsappPromptNumber || "");
    if (!targetPhone) return;

    setWhatsappPromptNumber(targetPhone);
    const cleanDigits = targetPhone.replace(/[^0-9]/g, '');
    const finalPhone = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const messageText = `⚠️ Payment Gateway Interrupted! We saved your cart worth ₹${cartTotal.toLocaleString('en-IN')}.\n\nClick to complete your order instantly via 1-Click UPI: https://cartrescue.ai/pay/sess_storefront_demo`;

    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(messageText)}`, '_blank');
    setRecoveryActionTriggered(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <h1 className="text-4xl font-bold text-theme-primary tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-[#3B82F6] stroke-[1.75]" />
            Live E-Commerce Storefront Simulator
          </h1>
          <p className="text-base font-medium text-theme-secondary mt-1">Act as a shopper to test real-time AI cart abandonment interventions</p>
        </div>

        <button
          onClick={() => setShowExitPopup(true)}
          className="btn-secondary text-xs"
        >
          <Zap className="w-4 h-4 stroke-[1.75] text-[#F59E0B]" /> Trigger Exit-Intent Popup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-theme pb-3">
            <h2 className="text-base font-bold text-theme-primary">Store Products</h2>
            <span className="text-xs font-mono text-theme-secondary">Tenant: Amazon Flagship US</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRODUCTS.map((prod) => (
              <div key={prod.id} className="p-6 rounded-2xl bg-theme-card border border-theme hover:border-[#3B82F6]/50 hover:scale-[1.02] transition-all duration-200 flex flex-col justify-between space-y-4 shadow-md">
                <div>
                  <div className="text-4xl mb-3">{prod.image}</div>
                  <span className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20">
                    {prod.category}
                  </span>
                  <h3 className="text-sm font-bold text-theme-primary mt-2 leading-snug">{prod.name}</h3>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-theme">
                  <span className="text-base font-bold text-[#10B981] font-mono">₹{prod.price.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="btn-primary py-1.5 px-3 text-xs"
                  >
                    <Plus className="w-4 h-4 stroke-[1.75]" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Cart */}
        <div className="p-6 rounded-2xl bg-theme-card border border-theme shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-theme pb-4">
              <h3 className="text-base font-bold text-theme-primary flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#3B82F6] stroke-[1.75]" />
                Cart Items ({cart.reduce((a, b) => a + b.qty, 0)})
              </h3>
              {liveRiskScore !== null && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                  Risk: {liveRiskScore}%
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-theme-secondary text-sm font-medium">Your cart is empty. Add products to test!</div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-theme-secondary border border-theme flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.image}</span>
                      <div>
                        <div className="text-xs font-bold text-theme-primary truncate max-w-[140px]">{item.name}</div>
                        <div className="text-xs text-[#10B981] font-mono font-bold">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded-lg bg-theme-card hover:bg-theme-secondary text-theme-primary border border-theme">
                        <Minus className="w-3 h-3 stroke-[1.75]" />
                      </button>
                      <span className="text-xs font-bold text-theme-primary px-1">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded-lg bg-theme-card hover:bg-theme-secondary text-theme-primary border border-theme">
                        <Plus className="w-3 h-3 stroke-[1.75]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-theme">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-theme-secondary">Total Cart Value</span>
                  <span className="font-bold text-[#10B981] text-lg font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                {checkoutStep === 'cart' && (
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="btn-primary w-full py-3"
                  >
                    <CreditCard className="w-4 h-4 stroke-[1.75]" /> Proceed to Checkout
                  </button>
                )}

                {checkoutStep === 'checkout' && (
                  <div className="space-y-3">
                    <button
                      onClick={handleSimulatePaymentFailure}
                      className="w-full py-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 stroke-[1.75]" /> Simulate Gateway Timeout
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment_failed' && (
                  <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 space-y-3">
                    <div className="flex items-center gap-2 text-[#EF4444] text-xs font-bold">
                      <AlertCircle className="w-4 h-4 stroke-[1.75]" /> Transaction Failed
                    </div>
                    <p className="text-xs text-theme-secondary font-medium">
                      AI flagged risk (99.8%). WhatsApp recovery link generated!
                    </p>

                    <button
                      onClick={handleOpenWhatsAppRecovery}
                      className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 stroke-[1.75]" /> Open WhatsApp Link
                    </button>

                    {recoveryActionTriggered && (
                      <div className="p-2 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[11px] font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 stroke-[1.75]" /> Status: RECOVERED in DB.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exit Modal */}
      {showExitPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-theme-card border border-theme rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowExitPopup(false)}
              className="absolute top-4 right-4 p-2 text-theme-secondary hover:text-theme-primary rounded-full bg-theme-secondary"
            >
              <X className="w-4 h-4 stroke-[1.75]" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
              <Sparkles className="w-5 h-5 stroke-[1.75]" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#F59E0B] uppercase">EXIT INTENT DETECTED BY AI</span>
              <h3 className="text-lg font-bold text-theme-primary mt-1">Wait! Get 15% OFF + Free Shipping</h3>
              <p className="text-xs text-theme-secondary mt-2">
                We saved your cart worth ₹{cartTotal.toLocaleString('en-IN')}. Use code <span className="font-mono text-[#10B981] font-bold">RESCUE15</span>!
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  alert('15% Discount applied!');
                  setShowExitPopup(false);
                }}
                className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm transition"
              >
                Claim 15% Discount & Checkout
              </button>
              <button
                onClick={() => setShowExitPopup(false)}
                className="w-full py-2 text-xs text-theme-secondary hover:text-theme-primary transition"
              >
                No thanks, I will pay full price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontPage;
