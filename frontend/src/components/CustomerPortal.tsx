import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  ShoppingCart, 
  Star,
  Clock,
  DollarSign,
  Package,
  CheckCircle,
  CreditCard,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useRental, Product } from '../context/RentalContext';

export function CustomerPortal() {
  const { products, addOrder, getAvailableProducts } = useRental();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Array<{
    product: Product;
    quantity: number;
    startDate: string;
    endDate: string;
    durationType: 'hour' | 'day' | 'week' | 'month';
    duration: number;
  }>>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const isAvailable = product.availability === 'available';
    return matchesSearch && matchesCategory && isAvailable;
  });

  const addToCart = (product: Product, startDate: string, endDate: string, quantity: number) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let durationType: 'hour' | 'day' | 'week' | 'month';
    let duration: number;
    
    if (daysDiff <= 1) {
      durationType = 'hour';
      duration = Math.max(1, Math.ceil(timeDiff / (1000 * 3600)));
    } else if (daysDiff <= 7) {
      durationType = 'day';
      duration = daysDiff;
    } else if (daysDiff <= 30) {
      durationType = 'week';
      duration = Math.ceil(daysDiff / 7);
    } else {
      durationType = 'month';
      duration = Math.ceil(daysDiff / 30);
    }

    setCart([...cart, {
      product,
      quantity,
      startDate,
      endDate,
      durationType,
      duration
    }]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const calculateItemTotal = (item: typeof cart[0]) => {
    const rate = item.durationType === 'hour' ? item.product.hourlyRate :
                 item.durationType === 'day' ? item.product.dailyRate :
                 item.durationType === 'week' ? item.product.weeklyRate :
                 item.product.monthlyRate;
    return item.quantity * rate * item.duration;
  };

  const totalAmount = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const orderProducts = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      rate: item.durationType === 'hour' ? item.product.hourlyRate :
            item.durationType === 'day' ? item.product.dailyRate :
            item.durationType === 'week' ? item.product.weeklyRate :
            item.product.monthlyRate,
      duration: item.duration,
      durationType: item.durationType
    }));

    const newOrder = {
      customerId: Date.now().toString(),
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      products: orderProducts,
      status: 'quotation' as const,
      startDate: cart[0].startDate,
      endDate: cart[0].endDate,
      totalAmount,
      paidAmount: 0
    };

    addOrder(newOrder);
    setCart([]);
    setShowCheckout(false);
    alert('Order placed successfully! You will receive a quotation soon.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent Premium Equipment</h1>
        <p className="text-gray-600">Find the perfect equipment for your needs with flexible rental options</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center relative">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart ({cart.length})
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-20">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Your Cart
              </h2>
            </div>
            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Qty: {item.quantity} × {item.duration} {item.durationType}(s)
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.startDate} to {item.endDate}
                      </p>
                      <p className="font-medium text-gray-900">
                        ₹{calculateItemTotal(item).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-lg font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Complete Your Order</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-2">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span>₹{calculateItemTotal(item).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, startDate: string, endDate: string, quantity: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      alert('Please select rental dates');
      return;
    }
    onAddToCart(product, startDate, endDate, quantity);
    setShowDetails(false);
    setStartDate('');
    setEndDate('');
    setQuantity(1);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.8</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{product.category}</p>
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
            <div>₹{product.hourlyRate}/hr</div>
            <div>₹{product.dailyRate}/day</div>
            <div>₹{product.weeklyRate}/week</div>
            <div>₹{product.monthlyRate}/month</div>
          </div>
          
          <button
            onClick={() => setShowDetails(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: Math.min(product.quantity, 10) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Pricing Options</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span>₹{product.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Rate:</span>
                    <span>₹{product.dailyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Rate:</span>
                    <span>₹{product.weeklyRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Rate:</span>
                    <span>₹{product.monthlyRate}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}