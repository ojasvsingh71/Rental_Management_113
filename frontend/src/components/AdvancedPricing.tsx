import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Tag,
  Percent,
  Clock
} from 'lucide-react';

interface PriceRule {
  id: string;
  name: string;
  type: 'duration' | 'customer' | 'seasonal' | 'volume';
  conditions: {
    minDuration?: number;
    maxDuration?: number;
    durationType?: 'hour' | 'day' | 'week' | 'month';
    customerType?: string;
    startDate?: string;
    endDate?: string;
    minQuantity?: number;
  };
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  applicableProducts: string[];
  priority: number;
  active: boolean;
}

interface PriceList {
  id: string;
  name: string;
  description: string;
  validFrom: string;
  validTo: string;
  customerSegments: string[];
  rules: PriceRule[];
  default: boolean;
}

export function AdvancedPricing() {
  const [priceLists, setPriceLists] = useState<PriceList[]>([
    {
      id: '1',
      name: 'Standard Pricing',
      description: 'Default pricing for all customers',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      customerSegments: ['all'],
      rules: [],
      default: true
    },
    {
      id: '2',
      name: 'Corporate Rates',
      description: 'Special rates for corporate clients',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      customerSegments: ['corporate'],
      rules: [
        {
          id: 'rule1',
          name: 'Corporate Bulk Discount',
          type: 'volume',
          conditions: { minQuantity: 5 },
          discount: { type: 'percentage', value: 15 },
          applicableProducts: ['all'],
          priority: 1,
          active: true
        }
      ],
      default: false
    }
  ]);

  const [selectedPriceList, setSelectedPriceList] = useState<PriceList | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);

  const [newRule, setNewRule] = useState<Partial<PriceRule>>({
    name: '',
    type: 'duration',
    conditions: {},
    discount: { type: 'percentage', value: 0 },
    applicableProducts: ['all'],
    priority: 1,
    active: true
  });

  const addPriceRule = () => {
    if (!selectedPriceList || !newRule.name) return;

    const rule: PriceRule = {
      id: Date.now().toString(),
      name: newRule.name,
      type: newRule.type || 'duration',
      conditions: newRule.conditions || {},
      discount: newRule.discount || { type: 'percentage', value: 0 },
      applicableProducts: newRule.applicableProducts || ['all'],
      priority: newRule.priority || 1,
      active: true
    };

    setPriceLists(prev => prev.map(pl => 
      pl.id === selectedPriceList.id 
        ? { ...pl, rules: [...pl.rules, rule] }
        : pl
    ));

    setNewRule({
      name: '',
      type: 'duration',
      conditions: {},
      discount: { type: 'percentage', value: 0 },
      applicableProducts: ['all'],
      priority: 1,
      active: true
    });
    setShowRuleModal(false);
  };

  const deleteRule = (ruleId: string) => {
    if (!selectedPriceList) return;
    
    setPriceLists(prev => prev.map(pl => 
      pl.id === selectedPriceList.id 
        ? { ...pl, rules: pl.rules.filter(r => r.id !== ruleId) }
        : pl
    ));
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'duration':
        return <Clock className="h-4 w-4" />;
      case 'customer':
        return <Users className="h-4 w-4" />;
      case 'seasonal':
        return <Calendar className="h-4 w-4" />;
      case 'volume':
        return <Tag className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'duration':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-emerald-100 text-emerald-800';
      case 'seasonal':
        return 'bg-purple-100 text-purple-800';
      case 'volume':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Pricing Management</h1>
        <p className="text-gray-600">Create flexible pricing rules and customer-specific rates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Price Lists */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Price Lists</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {priceLists.map((priceList) => (
                <div
                  key={priceList.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedPriceList?.id === priceList.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPriceList(priceList)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{priceList.name}</h3>
                      <p className="text-sm text-gray-600">{priceList.description}</p>
                    </div>
                    {priceList.default && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {priceList.rules.length} rule(s) • Valid: {priceList.validFrom} to {priceList.validTo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Rules */}
        <div className="lg:col-span-2">
          {selectedPriceList ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedPriceList.name}</h2>
                    <p className="text-gray-600">{selectedPriceList.description}</p>
                  </div>
                  <button
                    onClick={() => setShowRuleModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Price List Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Valid From:</span>
                      <div className="text-gray-600">{selectedPriceList.validFrom}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Valid To:</span>
                      <div className="text-gray-600">{selectedPriceList.validTo}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Customer Segments:</span>
                      <div className="text-gray-600">{selectedPriceList.customerSegments.join(', ')}</div>
                    </div>
                  </div>
                </div>

                {/* Rules List */}
                <div className="space-y-4">
                  {selectedPriceList.rules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No pricing rules defined</p>
                      <button
                        onClick={() => setShowRuleModal(true)}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add your first rule
                      </button>
                    </div>
                  ) : (
                    selectedPriceList.rules.map((rule) => (
                      <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getRuleTypeColor(rule.type)} mr-3`}>
                              {getRuleTypeIcon(rule.type)}
                              <span className="ml-1 capitalize">{rule.type}</span>
                            </span>
                            <h4 className="font-medium text-gray-900">{rule.name}</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              rule.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {rule.active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => deleteRule(rule.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Discount:</span>
                            <div className="text-gray-600">
                              {rule.discount.type === 'percentage' ? `${rule.discount.value}%` : `₹${rule.discount.value}`} off
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Priority:</span>
                            <div className="text-gray-600">{rule.priority}</div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Conditions:</span>
                            <div className="text-gray-600">
                              {rule.type === 'duration' && rule.conditions.minDuration && 
                                `Min: ${rule.conditions.minDuration} ${rule.conditions.durationType}(s)`}
                              {rule.type === 'volume' && rule.conditions.minQuantity && 
                                `Min quantity: ${rule.conditions.minQuantity}`}
                              {rule.type === 'customer' && rule.conditions.customerType && 
                                `Customer type: ${rule.conditions.customerType}`}
                              {rule.type === 'seasonal' && rule.conditions.startDate && 
                                `${rule.conditions.startDate} to ${rule.conditions.endDate}`}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Applies to:</span>
                            <div className="text-gray-600">
                              {rule.applicableProducts.includes('all') ? 'All products' : `${rule.applicableProducts.length} products`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Price List</h3>
              <p className="text-gray-600">Choose a price list from the sidebar to view and manage its pricing rules</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Pricing Rule</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rule Type
                </label>
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="duration">Duration-based</option>
                  <option value="volume">Volume-based</option>
                  <option value="customer">Customer-based</option>
                  <option value="seasonal">Seasonal</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {newRule.type === 'duration' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Duration
                    </label>
                    <input
                      type="number"
                      value={newRule.conditions?.minDuration || ''}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        conditions: { ...newRule.conditions, minDuration: parseInt(e.target.value) }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration Type
                    </label>
                    <select
                      value={newRule.conditions?.durationType || 'day'}
                      onChange={(e) => setNewRule({
                        ...newRule,
                        conditions: { ...newRule.conditions, durationType: e.target.value as any }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hour">Hour</option>
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>
                </div>
              )}

              {newRule.type === 'volume' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Quantity
                  </label>
                  <input
                    type="number"
                    value={newRule.conditions?.minQuantity || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      conditions: { ...newRule.conditions, minQuantity: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={newRule.discount?.type}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      discount: { ...newRule.discount, type: e.target.value as any }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={newRule.discount?.value || 0}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      discount: { ...newRule.discount, value: parseFloat(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority (1-10, higher = more priority)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newRule.priority || 1}
                  onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowRuleModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addPriceRule}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}