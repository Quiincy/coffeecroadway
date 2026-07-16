"use client";
import React, { useEffect, useState } from "react";
import { PackageOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface RealtimeOrdersProps {
  initialOrders: any[];
}

export const RealtimeOrders = ({ initialOrders }: RealtimeOrdersProps) => {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders((current) => [payload.new, ...current]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders((current) => current.map(o => o.id === payload.new.id ? payload.new : o));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
  };

  return (
    <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-950/50 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium text-zinc-400">ID</th>
              <th className="px-6 py-4 font-medium text-zinc-400">Клієнт</th>
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
                  <td className="px-6 py-4 font-black text-brand-500">{order.total_price} ₴</td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(order.created_at).toLocaleDateString('uk-UA')}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 text-white rounded p-1 text-sm outline-none"
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
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <PackageOpen size={48} className="mb-4 opacity-50" />
                    <p className="font-medium text-lg text-white mb-1">Поки немає замовлень</p>
                    <p className="text-sm">Нові замовлення з'являться тут</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
