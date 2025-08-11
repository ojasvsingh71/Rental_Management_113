import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { Truck, MapPin, Clock, CheckCircle, AlertTriangle, Camera, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

export function DeliveryDashboard() {
  const { deliveryTasks, updateDeliveryTask } = useStore();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  // Mock delivery tasks
  const mockTasks = [
    {
      id: '1',
      orderId: '1',
      type: 'pickup' as const,
      status: 'scheduled' as const,
      scheduledDate: new Date('2024-03-15T10:00:00'),
      address: '123 Main St, Downtown',
      assignedTo: 'John Driver',
      estimatedTime: '30 mins',
      gpsLocation: { lat: 40.7128, lng: -74.0060 },
    },
    {
      id: '2',
      orderId: '2',
      type: 'delivery' as const,
      status: 'in-progress' as const,
      scheduledDate: new Date('2024-03-15T14:00:00'),
      address: '456 Oak Ave, Uptown',
      assignedTo: 'Sarah Driver',
      estimatedTime: '45 mins',
      actualTime: '35 mins',
      gpsLocation: { lat: 40.7589, lng: -73.9851 },
    },
    {
      id: '3',
      orderId: '3',
      type: 'return' as const,
      status: 'completed' as const,
      scheduledDate: new Date('2024-03-14T16:00:00'),
      address: '789 Pine St, Midtown',
      assignedTo: 'Mike Driver',
      actualTime: '25 mins',
      condition: 'excellent' as const,
      signature: 'Customer Signature',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'delivery':
        return <MapPin className="h-5 w-5 text-emerald-600" />;
      case 'return':
        return <CheckCircle className="h-5 w-5 text-amber-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
          <p className="text-gray-600 mt-1">Track pickups, deliveries, and returns</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Navigation className="h-4 w-4" />
            <span>Route Optimizer</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Truck className="h-4 w-4" />
            <span>Schedule Delivery</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50">
              <Truck className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed/Delayed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Delivery Tasks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {mockTasks.map((task) => (
            <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getTypeIcon(task.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Order #{task.orderId} - {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </h4>
                      <span className={clsx(
                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                        getStatusColor(task.status)
                      )}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{task.address}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>📅 {format(task.scheduledDate, 'MMM d, h:mm a')}</span>
                      <span>👤 {task.assignedTo}</span>
                      {task.estimatedTime && <span>⏱️ Est: {task.estimatedTime}</span>}
                      {task.actualTime && <span>✅ Actual: {task.actualTime}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {task.status === 'in-progress' && (
                    <>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Navigation className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {selectedTask === task.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
              
              {selectedTask === task.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Task Details</h5>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>GPS: {task.gpsLocation?.lat}, {task.gpsLocation?.lng}</p>
                        {task.condition && <p>Condition: {task.condition}</p>}
                        {task.signature && <p>Signature: ✓ Collected</p>}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Actions</h5>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          Update Status
                        </button>
                        <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-sm">
                          Add Photos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}