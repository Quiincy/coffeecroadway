'use client'

import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { format, subDays, parseISO, isAfter } from 'date-fns'
import { uk } from 'date-fns/locale'

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  items: OrderItem[];
}

interface DashboardChartsProps {
  orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6', // blue
  preparing: '#eab308', // yellow
  delivering: '#a855f7', // purple
  delivered: '#22c55e', // green
  cancelled: '#ef4444', // red
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Нові',
  preparing: 'Готуються',
  delivering: 'Доставляються',
  delivered: 'Виконані',
  cancelled: 'Скасовані',
}

export default function DashboardCharts({ orders }: DashboardChartsProps) {
  
  // 1. Revenue over the last 30 days
  const revenueData = useMemo(() => {
    const data: Record<string, number> = {}
    const now = new Date()
    const thirtyDaysAgo = subDays(now, 30)

    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const dateStr = format(subDays(now, i), 'dd MMM', { locale: uk })
      data[dateStr] = 0
    }

    orders.forEach(order => {
      const orderDate = parseISO(order.created_at)
      if (isAfter(orderDate, thirtyDaysAgo) && order.status !== 'cancelled') {
        const dateStr = format(orderDate, 'dd MMM', { locale: uk })
        if (data[dateStr] !== undefined) {
          data[dateStr] += Number(order.total_price)
        }
      }
    })

    return Object.keys(data).map(key => ({
      name: key,
      Дохід: data[key]
    }))
  }, [orders])

  // 2. Order Status Distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      new: 0, preparing: 0, delivering: 0, delivered: 0, cancelled: 0
    }
    
    orders.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status] += 1
      }
    })

    return Object.keys(counts)
      .filter(key => counts[key] > 0)
      .map(key => ({
        name: STATUS_LABELS[key] || key,
        value: counts[key],
        color: STATUS_COLORS[key] || '#8884d8'
      }))
  }, [orders])

  // 3. Top Products
  const topProductsData = useMemo(() => {
    const productCounts: Record<string, number> = {}
    
    orders.forEach(order => {
      if (order.status !== 'cancelled') {
        order.items?.forEach(item => {
          productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity
        })
      }
    })

    return Object.keys(productCounts)
      .map(name => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        Кількість: productCounts[name]
      }))
      .sort((a, b) => b.Кількість - a.Кількість)
      .slice(0, 5) // Top 5
  }, [orders])

  // Custom Tooltip for Revenue
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-400 text-sm mb-1">{label}</p>
          <p className="text-brand-500 font-bold">{payload[0].value.toLocaleString('uk-UA')} ₴</p>
        </div>
      )
    }
    return null
  }

  // Custom Tooltip for Products
  const ProductTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-zinc-400 text-sm mb-1">{label}</p>
          <p className="text-blue-500 font-bold">{payload[0].value} шт.</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      
      {/* Revenue Chart */}
      <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 p-6 lg:col-span-2">
        <h2 className="text-xl font-bold text-white mb-6">Дохід за останні 30 днів</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="Дохід" stroke="#ff5c0a" strokeWidth={3} dot={{ r: 4, fill: '#ff5c0a', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              <CartesianGrid stroke="#27272a" strokeDasharray="5 5" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#a1a1aa', fontSize: 12 }} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#52525b" tick={{ fill: '#a1a1aa', fontSize: 12 }} tickFormatter={(val) => `${val} ₴`} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '5 5' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Chart */}
      <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Топ-5 товарів (шт.)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProductsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid stroke="#27272a" strokeDasharray="5 5" horizontal={false} />
              <XAxis type="number" stroke="#52525b" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={100} stroke="#52525b" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ProductTooltip />} cursor={{ fill: '#27272a' }} />
              <Bar dataKey="Кількість" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status Pie Chart */}
      <div className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Статуси замовлень</h2>
        <div className="h-64 w-full flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.5rem', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
