import React from 'react';
import { useRestaurant } from '../store/RestaurantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, CheckCircle2, Flame, User, ChefHat, Timer, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const KitchenView: React.FC = () => {
  const { orders, updateOrderStatus, tables, waiters } = useRestaurant();

  const getTableNumber = (tableId: string) => {
    return tables.find(t => t.id === tableId)?.number || '??';
  };

  const getWaiterName = (waiterId: string) => {
    return waiters.find(w => w.id === waiterId)?.name || 'Unassigned';
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-2xl">
            <ChefHat className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Kitchen Control</h1>
            <p className="text-neutral-500 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Kitchen Online • Live Sync
            </p>
          </div>
        </div>
        
        <div className="flex gap-6 mt-6 md:mt-0">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest">New Orders</span>
            <span className="text-4xl font-black tabular-nums">{pendingOrders.length}</span>
          </div>
          <div className="w-px h-12 bg-white/10 self-center" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-amber-500 font-bold tracking-widest">Cooking</span>
            <span className="text-4xl font-black text-amber-500 tabular-nums">{preparingOrders.length}</span>
          </div>
          <div className="w-px h-12 bg-white/10 self-center" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-emerald-500 font-bold tracking-widest">Ready</span>
            <span className="text-4xl font-black text-emerald-500 tabular-nums">{readyOrders.length}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Column: Pending */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-wide flex items-center gap-3">
              <Timer className="w-5 h-5 text-neutral-500" />
              Pending <span className="text-neutral-600">({pendingOrders.length})</span>
            </h2>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} status="pending" onAction={() => updateOrderStatus(order.id, 'preparing')} />
              ))}
            </AnimatePresence>
            {pendingOrders.length === 0 && <EmptyState text="No new orders" />}
          </div>
        </section>

        {/* Column: Preparing */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-wide flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-500" />
              In Prep <span className="text-neutral-600">({preparingOrders.length})</span>
            </h2>
          </div>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {preparingOrders.map((order) => (
                <OrderCard key={order.id} order={order} status="preparing" onAction={() => updateOrderStatus(order.id, 'ready')} />
              ))}
            </AnimatePresence>
            {preparingOrders.length === 0 && <EmptyState text="Kitchen is idle" />}
          </div>
        </section>

        {/* Column: Ready */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-wide flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Out <span className="text-neutral-600">({readyOrders.length})</span>
            </h2>
          </div>
          <div className="space-y-4 opacity-70">
            <AnimatePresence mode="popLayout">
              {readyOrders.map((order) => (
                <OrderCard key={order.id} order={order} status="ready" onAction={() => {}} />
              ))}
            </AnimatePresence>
            {readyOrders.length === 0 && <EmptyState text="No orders ready" />}
          </div>
        </section>
      </div>
    </div>
  );
};

const OrderCard = ({ order, status, onAction }: { order: any, status: string, onAction: () => void }) => {
  const { tables, waiters } = useRestaurant();
  const table = tables.find(t => t.id === order.tableId);
  const waiter = waiters.find(w => w.id === order.assignedWaiterId);
  const timeAgo = Math.floor((new Date().getTime() - new Date(order.timestamp).getTime()) / 60000);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className={`bg-neutral-900 border-none shadow-2xl overflow-hidden group transition-all ${status === 'preparing' ? 'ring-1 ring-amber-500/30' : ''}`}>
        <div className="p-4 flex justify-between items-center bg-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tighter">#{table?.number}</span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Table</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-neutral-400 text-[10px] font-bold uppercase">
              <Clock className="w-3 h-3 mr-1" />
              {timeAgo}m ago
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4 p-2 bg-white/5 rounded-lg">
            <User className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-bold text-neutral-300">{waiter?.name || 'Unassigned'}</span>
            <span className="text-[10px] uppercase text-neutral-600 font-bold ml-auto">Waiter</span>
          </div>

          <ul className="space-y-3 mb-6">
            {order.items.map((item: any, i: number) => (
              <li key={i} className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="bg-neutral-800 w-8 h-8 rounded-lg flex items-center justify-center font-black text-amber-500 text-sm">{item.quantity}</span>
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </div>
              </li>
            ))}
          </ul>

          {status === 'pending' && (
            <Button className="w-full bg-white text-black hover:bg-neutral-200 font-black h-12 rounded-xl group-hover:scale-[1.02] transition-transform" onClick={onAction}>
              START COOKING <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {status === 'preparing' && (
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black h-12 rounded-xl group-hover:scale-[1.02] transition-transform" onClick={onAction}>
              READY FOR PICKUP
            </Button>
          )}
          {status === 'ready' && (
            <div className="w-full py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-center text-xs font-black uppercase tracking-widest">
              READY TO SERVE
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <div className="py-12 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center opacity-20">
    <ChefHat className="w-12 h-12 mb-2" />
    <p className="font-bold uppercase tracking-widest text-xs">{text}</p>
  </div>
);