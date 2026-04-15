import React from 'react';
import { useRestaurant } from '../store/RestaurantContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Users, LayoutDashboard, Coffee, AlertCircle, CheckCircle2, Clock, Flame, UserCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ScrollArea } from '../components/ui/scroll-area';

export const AdminView: React.FC = () => {
  const { tables, waiters, assignWaiterToTable, orders } = useRestaurant();

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'occupied': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'needs_service': return 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse';
      case 'ready_to_serve': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'waiting_for_food': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const revenue = orders.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const availableTables = tables.filter(t => t.status === 'available');

  const getWaiterName = (id: string) => waiters.find(w => w.id === id)?.name || 'Unassigned';

  const getRemainingTime = (timestamp: Date, prepTime: number) => {
    const elapsed = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 60000);
    return Math.max(0, prepTime - elapsed);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">RESTAURANT OPS</h1>
            <p className="text-slate-500">Real-time floor management and kitchen insights</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Revenue</span>
                  <span className="text-xl font-bold text-slate-900">${revenue}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Waiters</span>
                  <span className="text-xl font-bold text-slate-900">{waiters.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Users className="text-slate-400" />
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100">{availableTables.length} Open</Badge>
              </div>
              <span className="text-sm text-slate-500 block">Available Tables</span>
              <span className="text-3xl font-black">{availableTables.length}</span>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <AlertCircle className="text-amber-500" />
                <Badge variant="secondary" className="bg-amber-100 text-amber-600 border-amber-200">{tables.filter(t => t.status === 'needs_service').length} Active</Badge>
              </div>
              <span className="text-sm text-slate-500 block">Service Requests</span>
              <span className="text-3xl font-black">{tables.filter(t => t.status === 'needs_service').length}</span>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Clock className="text-indigo-500" />
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100">{pendingOrders.length} Orders</Badge>
              </div>
              <span className="text-sm text-slate-500 block">Avg. Prep Time</span>
              <span className="text-3xl font-black">18<span className="text-sm font-normal text-slate-400 ml-1">min</span></span>
            </CardContent>
          </Card>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <LayoutDashboard className="text-blue-500" />
              </div>
              <span className="text-sm text-slate-500 block">Total Orders</span>
              <span className="text-3xl font-black">{orders.length}</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Floor Plan */}
          <Card className="lg:col-span-2 bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Floor Plan</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px]">AVAILABLE</Badge>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600">OCCUPIED</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map(table => (
                  <div key={table.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-slate-300 tracking-tighter">#0{table.number}</span>
                      <Badge className={getTableStatusColor(table.status)}>
                        {table.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assign Waiter</label>
                      <Select value={table.waiterId} onValueChange={(val) => assignWaiterToTable(table.id, val)}>
                        <SelectTrigger className="h-9 bg-white border-slate-200 text-sm font-medium">
                          <SelectValue placeholder="Select Waiter" />
                        </SelectTrigger>
                        <SelectContent>
                          {waiters.map(w => (
                            <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {table.status === 'available' && (
                      <Button size="sm" className="w-full bg-slate-900 text-white rounded-lg" onClick={() => assignWaiterToTable(table.id, table.waiterId)}>
                        Seat Guest
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Insights */}
          <div className="space-y-8">
            {/* Pending Tables with Prep Times */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <CardTitle className="text-lg font-bold">Pending Tables</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="divide-y divide-slate-100">
                    {pendingOrders.length > 0 ? (
                      pendingOrders.map(order => (
                        <div key={order.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div>
                            <span className="font-bold text-slate-900">Table #{tables.find(t => t.id === order.tableId)?.number}</span>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                              <UserCheck className="w-3 h-3 mr-1" />
                              {getWaiterName(order.assignedWaiterId)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-amber-600 font-bold">
                              <Flame className="w-3 h-3 mr-1 animate-pulse" />
                              {getRemainingTime(order.timestamp, order.preparationTime)}m
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Remaining</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm">No active orders</div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Currently Preparing Orders */}
            <Card className="bg-slate-900 text-white border-none shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <CardTitle className="text-lg font-bold">Kitchen Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="px-6 pb-6 space-y-4">
                    {preparingOrders.length > 0 ? (
                      preparingOrders.map(order => (
                        <div key={order.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-amber-500">TABLE #{tables.find(t => t.id === order.tableId)?.number}</span>
                            <Badge variant="outline" className="text-[10px] text-white/60 border-white/20">COOKING</Badge>
                          </div>
                          <ul className="space-y-1">
                            {order.items.slice(0, 2).map((item, i) => (
                              <li key={i} className="text-sm flex justify-between">
                                <span>{item.name}</span>
                                <span className="text-white/40">x{item.quantity}</span>
                              </li>
                            ))}
                            {order.items.length > 2 && <li className="text-[10px] text-white/40">+ {order.items.length - 2} more items</li>}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-white/20 text-sm">No items in prep</div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};