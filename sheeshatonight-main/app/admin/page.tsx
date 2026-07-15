'use client';

import { 
  Users, 
  Store, 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Shield,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { 
      label: 'Total Platform Users', 
      value: '1,582', 
      change: '+15% this month', 
      trend: 'up',
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    { 
      label: 'Active Vendors', 
      value: '342', 
      change: '+8% this month', 
      trend: 'up',
      icon: Store, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    },
    { 
      label: 'Platform Revenue', 
      value: 'AED 2.4M', 
      change: '+23% this month', 
      trend: 'up',
      icon: DollarSign, 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    { 
      label: 'Pending KYC Checks', 
      value: '12', 
      change: 'Requires review', 
      trend: 'neutral',
      icon: Shield, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
  ];

  const oversightQueues = [
    {
      id: 1,
      title: 'Vendor Registration Verification',
      description: '5 vendors in validation queue',
      priority: 'high',
      action: 'Verify Now',
      href: '/admin/vendors'
    },
    {
      id: 2,
      title: 'Tobacco Licensing KYC Reviews',
      description: 'Requires regulatory age-gate auditing',
      priority: 'critical',
      action: 'Audit KYC',
      href: '/admin/kyc'
    },
    {
      id: 3,
      title: 'Product Compliance Check',
      description: '23 new products awaiting approval',
      priority: 'medium',
      action: 'Review Products',
      href: '/admin/products'
    },
  ];

  const liveOperations = [
    {
      id: 1,
      type: 'approval',
      title: 'Vendor Approved',
      description: 'Bundle Sheesha Co. status changed to APPROVED',
      time: '2 mins ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'checkout',
      title: 'New Checkout Placed',
      description: 'User ORD-TJ-234590 initiated checkout ORD-246-905',
      time: '5 mins ago',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Age verification check',
      description: 'Audit log:age-verification service client request',
      time: '12 mins ago',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
  ];

  const recentActions = [
    { action: 'Failed to fetch age-gate pending KYC month', status: 'error', time: '5 mins ago' },
    { action: 'Platform analytics refresh completed', status: 'success', time: '15 mins ago' },
    { action: 'Vendor bulk email notification sent', status: 'success', time: '1 hour ago' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-7 h-7 text-[#D4AF37]" />
              Platform Analytics
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Real-time marketplace oversight, verification queues, and performance
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">All Systems Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Clock;
          
          return (
            <div
              key={index}
              className={`bg-white rounded-xl p-5 border ${stat.border} hover:shadow-lg transition-all cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`} />
              </div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Oversight Queues */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Oversight Queues
                </h2>
                <button className="text-sm text-[#D4AF37] hover:text-[#B8902A] font-semibold flex items-center gap-1">
                  Resolve Action
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {oversightQueues.map((queue) => (
                <div
                  key={queue.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    queue.priority === 'critical' 
                      ? 'bg-red-50 border-red-500' 
                      : queue.priority === 'high'
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{queue.title}</h3>
                      <p className="text-sm text-slate-600">{queue.description}</p>
                    </div>
                    <button
                      onClick={() => window.location.href = queue.href}
                      className={`ml-4 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                        queue.priority === 'critical'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-[#D4AF37] text-white hover:bg-[#B8902A]'
                      }`}
                    >
                      {queue.action} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Operations */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-slate-200 bg-green-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                Live Operations
              </h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {liveOperations.map((op) => {
                const Icon = op.icon;
                return (
                  <div key={op.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${op.color === 'text-green-600' ? 'bg-green-100' : op.color === 'text-blue-600' ? 'bg-blue-100' : 'bg-orange-100'} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${op.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{op.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{op.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{op.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Actions */}
          <div className="bg-slate-900 rounded-xl p-5 text-white">
            <h3 className="text-sm font-bold mb-3 text-amber-400">System Logs</h3>
            <div className="space-y-2">
              {recentActions.map((action, i) => (
                <div key={i} className="text-xs font-mono">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    action.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-slate-400">{action.time}</span>
                  <p className="ml-4 mt-1 text-slate-300">{action.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
