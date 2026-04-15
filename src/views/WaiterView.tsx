import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../store/RestaurantContext';
import { BellRing, CheckCircle2, MessageCircle, Utensils, Clock, User, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export const WaiterView: React.FC<{ waiterId: string }> = ({ waiterId }) => {
  const { notifications, markNotificationRead, tables, callWaiter, notifyOrderReady, updateTableStatus } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'alerts' | 'tables'>('alerts');
  const [lastNotificationId, setLastNotificationId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const myNotifications = notifications
    .filter(n => n.waiterId === waiterId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  const unreadNotifications = myNotifications.filter(n => !n.read);
  const latestUnread = unreadNotifications[0];

  const myTables = tables.filter(t => t.waiterId === waiterId);

  // Auto-show alert overlay when a new notification arrives
  useEffect(() => {
    if (latestUnread && latestUnread.id !== lastNotificationId) {
      setLastNotificationId(latestUnread.id);
      setShowAlert(true);
      // Play a subtle haptic-like sound if desired, or just toast
      toast.info(`New alert: ${latestUnread.message}`);
    }
  }, [latestUnread, lastNotificationId]);

  const handleAcknowledge = (id: string, tableId: string, type: string) => {
    markNotificationRead(id);
    setShowAlert(false);
    if (type === 'order_ready') {
      updateTableStatus(tableId, 'occupied');
    }
    toast.success('Alert acknowledged');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Simulation Controls - LEFT SIDE */}
        <div className="flex flex-col gap-4 bg-neutral-900/50 p-6 rounded-3xl border border-white/5 w-64">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Clock className="w-3 h-3" /> System Simulator
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/30 font-bold block mb-2">FROM KITCHEN</label>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-2 bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                onClick={() => notifyOrderReady('t1')}
              >
                <Utensils className="w-4 h-4" /> Order Ready (T1)
              </Button>
            </div>

            <div>
              <label className="text-[10px] text-white/30 font-bold block mb-2">FROM PATRON</label>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start gap-2 bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white transition-all"
                onClick={() => callWaiter('t1')}
              >
                <BellRing className="w-4 h-4" /> Table Calling (T1)
              </Button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5">
             <div className="flex items-center gap-2 text-white/40">
                <User className="w-3 h-3" />
                <span className="text-[10px] font-medium">{waiterId === 'w1' ? 'John Doe' : 'Jane Smith'}</span>
             </div>
          </div>
        </div>

        {/* Smart Watch Mockup - CENTER */}
        <div className="relative group">
          {/* Watch Body */}
          <div className="w-[280px] h-[320px] bg-black rounded-[60px] border-[12px] border-neutral-900 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ring-2 ring-neutral-800/50">
            
            {/* Screen Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              
              {/* Status Bar */}
              <div className="h-8 flex justify-between items-center px-8 pt-4">
                <span className="text-[9px] font-bold text-white/40">12:45</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white/40 rounded-full" />
                  <div className="w-1 h-1 bg-white/40 rounded-full" />
                  <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                </div>
              </div>

              {/* Header */}
              <header className="px-6 py-2 flex items-center justify-between">
                <h2 className="text-sm font-black tracking-tight">{activeTab === 'alerts' ? 'ALERTS' : 'TABLES'}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('alerts')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeTab === 'alerts' ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-white/40'}`}
                  >
                    <BellRing className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('tables')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeTab === 'tables' ? 'bg-blue-500 text-white' : 'bg-neutral-800 text-white/40'}`}
                  >
                    <Utensils className="w-3 h-3" />
                  </button>
                </div>
              </header>

              {/* Main Feed */}
              <main className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                {activeTab === 'alerts' ? (
                  <div className="space-y-2">
                    {unreadNotifications.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-10 opacity-20">
                        <CheckCircle2 className="w-12 h-12 mb-2" />
                        <span className="text-[10px] font-bold">ALL CLEAR</span>
                      </div>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {unreadNotifications.map(notif => (
                          <motion.div
                            key={notif.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={`p-3 rounded-3xl border-l-4 ${
                              notif.type === 'call' 
                                ? 'bg-amber-500/10 border-amber-500 border-y border-r border-amber-500/10' 
                                : 'bg-emerald-500/10 border-emerald-500 border-y border-r border-emerald-500/10'
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 ${notif.type === 'call' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black'}`}>
                                {notif.type === 'call' ? <MessageCircle className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="text-[8px] font-black uppercase tracking-widest opacity-50">
                                    {notif.type === 'call' ? 'Patron Call' : 'Kitchen Ready'}
                                  </span>
                                  <span className="text-[7px] font-medium opacity-30">JUST NOW</span>
                                </div>
                                <p className="text-[11px] font-bold leading-tight mb-2">{notif.message}</p>
                                <button 
                                  onClick={() => handleAcknowledge(notif.id, notif.tableId, notif.type)}
                                  className="w-full py-1.5 bg-white text-black text-[9px] font-black rounded-xl hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-1"
                                >
                                  DONE <ChevronRight className="w-2 h-2" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {myTables.map(t => (
                      <div key={t.id} className="bg-neutral-900 p-3 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold text-white/30 uppercase">Table</span>
                        <span className="text-lg font-black">{t.number}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-[7px] h-4 px-1 border-0 ${
                            t.status === 'needs_service' ? 'bg-amber-500 text-black' : 
                            t.status === 'ready_to_serve' ? 'bg-emerald-500 text-black' : 
                            'bg-white/10 text-white/60'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </main>

              {/* Alert Overlay (Haptic Feedback Simulation) */}
              <AnimatePresence>
                {showAlert && latestUnread && (
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className={`absolute inset-0 z-50 p-6 flex flex-col items-center justify-center text-center ${
                      latestUnread.type === 'call' ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center mb-4"
                    >
                      {latestUnread.type === 'call' ? <AlertCircle className="w-8 h-8 text-white" /> : <Utensils className="w-8 h-8 text-white" />}
                    </motion.div>
                    
                    <h3 className="text-white text-xs font-black uppercase tracking-widest mb-1">
                      {latestUnread.type === 'call' ? 'NEW REQUEST' : 'FOOD READY'}
                    </h3>
                    <p className="text-white text-lg font-black leading-tight mb-6">
                      {latestUnread.message}
                    </p>
                    
                    <div className="flex flex-col gap-2 w-full">
                      <Button 
                        onClick={() => handleAcknowledge(latestUnread.id, latestUnread.tableId, latestUnread.type)}
                        className="w-full bg-white text-black font-black hover:bg-neutral-100"
                      >
                        RECEIVE
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowAlert(false)}
                        className="text-white/60 text-[10px] font-bold"
                      >
                        IGNORE
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Home Bar */}
              <div className="h-6 flex justify-center items-center pb-2">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
            </div>

            {/* Watch Crown/Buttons */}
            <div className="absolute -right-1 top-24 w-1 h-12 bg-neutral-800 rounded-l-md" />
            <div className="absolute -right-1 top-40 w-1.5 h-16 bg-neutral-700 rounded-l-md border-y border-neutral-600 shadow-inner" />
          </div>

          {/* Watch Band (Top) */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-20 bg-neutral-900 rounded-t-3xl -z-10 opacity-40 blur-[1px]" />
          {/* Watch Band (Bottom) */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-20 bg-neutral-900 rounded-b-3xl -z-10 opacity-40 blur-[1px]" />
        </div>

        {/* Legend / Info - RIGHT SIDE */}
        <div className="w-64 space-y-4">
          <div className="bg-neutral-900/50 p-6 rounded-3xl border border-white/5">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Notification States</h4>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <div>
                  <p className="text-[11px] font-bold">Patron Request</p>
                  <p className="text-[9px] text-white/40">Highest priority. Immediate service required at table.</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div>
                  <p className="text-[11px] font-bold">Kitchen Alert</p>
                  <p className="text-[9px] text-white/40">Food is ready for collection at the pass.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4">
            <p className="text-[9px] text-white/20 leading-relaxed italic">
              "Smart Watch interface uses high-contrast typography and large touch targets for reliable interaction in fast-paced environments."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};