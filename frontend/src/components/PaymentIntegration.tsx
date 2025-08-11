import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Globe,
  Shield
} from 'lucide-react';

interface PaymentIntegrationProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentIntegration({ 
  amount, 
  orderId, 
  customerEmail, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentIntegrationProps) {
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'razorpay' | 'paypal'>('razorpay');
  const [processing, setProcessing] = useState(false);

  const paymentGateways = [
    {
      id: 'razorpay' as const,
      name: 'Razorpay',
      description: 'Popular in India with UPI, Cards, Wallets',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-blue-600'
    },
    {
      id: 'stripe' as const,
      name: 'Stripe',
      description: 'International payments with cards',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-purple-600'
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      description: 'Global digital wallet solution',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-blue-500'
    }
  ];

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would integrate with actual payment gateways
      const mockPaymentData = {
        gateway: selectedGateway,
        transactionId: `${selectedGateway}_${Date.now()}`,
        amount: amount,
        currency: 'INR',
        status: 'success',
        orderId: orderId,
        customerEmail: customerEmail,
        timestamp: new Date().toISOString()
      };
      
      onPaymentSuccess(mockPaymentData);
    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Shield className="h-4 w-4 mr-2" />
          Your payment is secured with industry-standard encryption
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Order ID:</span>
          <span className="text-sm font-medium text-gray-900">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-blue-600">₹{amount.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentGateways.map((gateway) => (
            <label
              key={gateway.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedGateway === gateway.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="gateway"
                value={gateway.id}
                checked={selectedGateway === gateway.id}
                onChange={(e) => setSelectedGateway(e.target.value as any)}
                className="sr-only"
              />
              <div className={`flex-shrink-0 w-10 h-10 ${gateway.color} rounded-lg flex items-center justify-center text-white mr-4`}>
                {gateway.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900">{gateway.name}</div>
                <div className="text-sm text-gray-600">{gateway.description}</div>
              </div>
              {selectedGateway === gateway.id && (
                <CheckCircle className="h-5 w-5 text-blue-500 ml-auto" />
              )}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={processPayment}
        disabled={processing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay ₹{amount.toLocaleString()}
          </>
        )}
      </button>

      <div className="mt-4 text-xs text-gray-500 text-center">
        By proceeding, you agree to our Terms of Service and Privacy Policy.
        All transactions are secured and encrypted.
      </div>
    </div>
  );
}

export function PaymentSetupGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Gateway Integration Guide</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Razorpay Setup</h3>
          <p className="text-sm text-gray-600 mb-4">Perfect for Indian businesses with support for UPI, cards, and digital wallets.</p>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Create Razorpay account</li>
            <li>2. Get API keys from dashboard</li>
            <li>3. Add keys to environment variables</li>
            <li>4. Configure webhook endpoints</li>
          </ol>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Stripe Integration</h3>
          <p className="text-sm text-gray-600 mb-4">Global payment processing with excellent developer experience.</p>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Sign up for Stripe account</li>
            <li>2. Get publishable and secret keys</li>
            <li>3. Install Stripe SDK</li>
            <li>4. Configure payment intents</li>
          </ol>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">PayPal Setup</h3>
          <p className="text-sm text-gray-600 mb-4">Trusted global payment solution with buyer protection.</p>
          <ol className="text-sm text-gray-600 space-y-1">
            <li>1. Create PayPal developer account</li>
            <li>2. Generate client ID and secret</li>
            <li>3. Set up sandbox for testing</li>
            <li>4. Implement payment flow</li>
          </ol>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <h4 className="font-medium text-yellow-800">Implementation Note</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This is a demo implementation. In production, you'll need to implement actual payment gateway integrations 
              with proper error handling, webhooks, and security measures.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Required Environment Variables</h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
          <div># Razorpay Configuration</div>
          <div>RAZORPAY_KEY_ID=your_key_id</div>
          <div>RAZORPAY_KEY_SECRET=your_key_secret</div>
          <div></div>
          <div># Stripe Configuration</div>
          <div>STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
          <div>STRIPE_SECRET_KEY=sk_test_...</div>
          <div></div>
          <div># PayPal Configuration</div>
          <div>PAYPAL_CLIENT_ID=your_client_id</div>
          <div>PAYPAL_CLIENT_SECRET=your_client_secret</div>
        </div>
      </div>
    </div>
  );
}