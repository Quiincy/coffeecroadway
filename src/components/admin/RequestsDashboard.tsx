"use client";
import React, { useEffect, useState } from "react";
import { PackageOpen, Settings, Wrench, Coffee } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface RequestsDashboardProps {
  initialOrders: any[];
  initialServiceRequests: any[];
}

export const RequestsDashboard = ({ initialOrders, initialServiceRequests }: RequestsDashboardProps) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [serviceRequests, setServiceRequests] = useState<any[]>(initialServiceRequests);
  const supabase = createClient();

  useEffect(() => {
    const ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders((current) => [payload.new, ...current]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders((current) => current.map(o => o.id === payload.new.id ? payload.new : o));
      })
      .subscribe();

    const servicesChannel = supabase
      .channel('public:service_requests')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' }, (payload) => {
        setServiceRequests((current) => [payload.new, ...current]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'service_requests' }, (payload) => {
        setServiceRequests((current) => current.map(s => s.id === payload.new.id ? payload.new : s));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(servicesChannel);
    };
  }, [supabase]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
  };

  const updateServiceStatus = async (id: string, newStatus: string) => {
    await supabase.from('service_requests').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
  };

  const renderTabs = () => (
    <div className="flex gap-4 mb-6 border-b border-zinc-800 overflow-x-auto pb-2">
      <button 
        onClick={() => setActiveTab('orders')} 
        className={`flex items-center gap-2 px-4 py-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <PackageOpen size={18} /> Замовлення Товарів ({orders.length})
      </button>
      <button 
        onClick={() => setActiveTab('rental')} 
        className={`flex items-center gap-2 px-4 py-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'rental' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Coffee size={18} /> Оренда ({serviceRequests.filter(r => r.type === 'rental').length})
      </button>
      <button 
        onClick={() => setActiveTab('event')} 
        className={`flex items-center gap-2 px-4 py-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'event' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Coffee size={18} /> Бариста ({serviceRequests.filter(r => r.type === 'event').length})
      </button>
      <button 
        onClick={() => setActiveTab('repair')} 
        className={`flex items-center gap-2 px-4 py-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'repair' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Wrench size={18} /> Ремонт ({serviceRequests.filter(r => r.type === 'repair').length})
      </button>
      <button 
        onClick={() => setActiveTab('maintenance')} 
        className={`flex items-center gap-2 px-4 py-2 font-bold whitespace-nowrap transition-colors ${activeTab === 'maintenance' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-zinc-500 hover:text-white'}`}
      >
        <Settings size={18} /> Обслуговування ({serviceRequests.filter(r => r.type === 'maintenance').length})
      </button>
    </div>
  );

  const renderOrdersTable = () => (
    <table className="w-full text-left">
      <thead className="bg-zinc-950/50 border-b border-zinc-800">
        <tr>
          <th className="px-6 py-4 font-medium text-zinc-400">ID</th>
          <th className="px-6 py-4 font-medium text-zinc-400">Клієнт</th>
          <th className="px-6 py-4 font-medium text-zinc-400">Коментар</th>
          <th className="px-6 py-4 font-medium text-zinc-400">Сума</th>
          <th className="px-6 py-4 font-medium text-zinc-400">Дата</th>
          <th className="px-6 py-4 font-medium text-zinc-400">Статус</th>
        </tr>
      </thead>
      <tbody>
        {orders && orders.length > 0 ? (
          orders.map(order => (
            <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
              <td className="px-6 py-4 text-zinc-400 font-mono">#{order.id.split('-')[0]}</td>
              <td className="px-6 py-4 font-bold text-white">
                {order.customer_name} <br/>
                <span className="text-sm font-normal text-zinc-400">{order.customer_phone}</span>
              </td>
              <td className="px-6 py-4 text-zinc-300 text-sm max-w-xs truncate">{order.comment || '-'}</td>
              <td className="px-6 py-4 font-black text-brand-500">{order.total_price} ₴</td>
              <td className="px-6 py-4 text-zinc-400">{new Date(order.created_at).toLocaleDateString('uk-UA')}</td>
              <td className="px-6 py-4">
                <select 
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded p-1 text-sm outline-none focus:border-brand-500"
                >
                  <option value="new">Нове</option>
                  <option value="preparing">Готується</option>
                  <option value="delivering">В дорозі</option>
                  <option value="delivered">Доставлено</option>
                  <option value="cancelled">Скасовано</option>
                </select>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-6 py-16 text-center text-zinc-500">Немає замовлень</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderServicesTable = (type: string) => {
    const filteredRequests = serviceRequests.filter(r => r.type === type);
    return (
      <table className="w-full text-left">
        <thead className="bg-zinc-950/50 border-b border-zinc-800">
          <tr>
            <th className="px-6 py-4 font-medium text-zinc-400">ID</th>
            <th className="px-6 py-4 font-medium text-zinc-400">Клієнт</th>
            <th className="px-6 py-4 font-medium text-zinc-400">Деталі Заявки</th>
            <th className="px-6 py-4 font-medium text-zinc-400">Дата</th>
            <th className="px-6 py-4 font-medium text-zinc-400">Статус</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests && filteredRequests.length > 0 ? (
            filteredRequests.map(req => (
              <tr key={req.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 text-zinc-400 font-mono">#{req.id.split('-')[0]}</td>
                <td className="px-6 py-4 font-bold text-white">
                  {req.customer_name} <br/>
                  <span className="text-sm font-normal text-zinc-400">{req.customer_phone}</span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-300">
                  <div className="flex flex-col gap-1">
                    {Object.entries(req.details || {}).map(([key, val]) => (
                      <span key={key}><strong className="text-zinc-500">{key}:</strong> {String(val)}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">{new Date(req.created_at).toLocaleDateString('uk-UA')}</td>
                <td className="px-6 py-4">
                  <select 
                    value={req.status}
                    onChange={(e) => updateServiceStatus(req.id, e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-white rounded p-1 text-sm outline-none focus:border-brand-500"
                  >
                    <option value="new">Нова</option>
                    <option value="in_progress">В процесі</option>
                    <option value="completed">Виконано</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center text-zinc-500">Немає заявок</td>
            </tr>
          )}
        </tbody>
      </table>
    )
  };

  return (
    <div>
      {renderTabs()}
      <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 overflow-hidden overflow-x-auto">
        {activeTab === 'orders' && renderOrdersTable()}
        {activeTab === 'rental' && renderServicesTable('rental')}
        {activeTab === 'event' && renderServicesTable('event')}
        {activeTab === 'repair' && renderServicesTable('repair')}
        {activeTab === 'maintenance' && renderServicesTable('maintenance')}
      </div>
    </div>
  );
};
