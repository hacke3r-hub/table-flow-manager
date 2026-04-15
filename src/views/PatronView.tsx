import React, { useState } from 'react';
import { useRestaurant } from '../store/RestaurantContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Bell, Film, Gamepad2, Music, Menu as MenuIcon, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export const PatronView: React.FC<{ tableId: string }> = ({ tableId }) => {
  const { menu, placeOrder, callWaiter, tables } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'menu' | 'entertainment' | 'cart'>('menu');
  const [category, setCategory] = useState<'starters' | 'mains' | 'desserts' | 'drinks'>('mains');
  const [cart, setCart] = useState<any[]>([]);

  const table = tables.find(t => t.id === tableId);
  const filteredMenu = menu.filter(item => item.category === category);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    placeOrder(tableId, cart);
    setCart([]);
    toast.success('Order sent to kitchen!');
    setActiveTab('entertainment');
  };

  const handleCallWaiter = () => {
    callWaiter(tableId);
    toast.info('Waiter called. They will be with you shortly.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/restaurant-bg-c18a1182-1776165475874.webp" alt="bg" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-10 backdrop-blur-md border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-500">DINÉ SYNC</h1>
          <p className="text-sm text-slate-400">Table {table?.number}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="rounded-full border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white" onClick={handleCallWaiter}>
            <Bell className="w-5 h-5 mr-2" /> Call Waiter
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setActiveTab('cart')}>
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex justify-center p-4 gap-8 z-10">
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'menu' ? 'text-amber-500' : 'text-slate-500'}`}>
          <MenuIcon className="w-6 h-6" />
          <span className="text-xs font-medium uppercase tracking-wider">Menu</span>
        </button>
        <button onClick={() => setActiveTab('entertainment')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'entertainment' ? 'text-amber-500' : 'text-slate-500'}`}>
          <Film className="w-6 h-6" />
          <span className="text-xs font-medium uppercase tracking-wider">Entertainment</span>
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="menu">
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {(['starters', 'mains', 'desserts', 'drinks'] as const).map(cat => (
                  <Button key={cat} variant={category === cat ? 'default' : 'secondary'} className={`capitalize rounded-full px-6 ${category === cat ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-300'}`} onClick={() => setCategory(cat)}>
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map(item => (
                  <Card key={item.id} className="bg-slate-900/50 border-white/5 overflow-hidden backdrop-blur-sm group hover:border-amber-500/30 transition-all duration-300">
                    <div className="h-48 relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-amber-500 font-bold">${item.price}</span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                      <p className="text-sm text-slate-400 mb-6 line-clamp-2">{item.description}</p>
                      <Button className="w-full bg-slate-800 hover:bg-amber-500 text-white border-white/5" onClick={() => addToCart(item)}>Add to Order</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'entertainment' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="entertainment" className="space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Film className="text-indigo-500" /> Trending Movies
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="min-w-[200px] aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden relative group cursor-pointer">
                      <img src={`https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/movie-poster-8a28063b-1776165476198.webp`} className="w-full h-full object-cover" alt="movie" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                        <span className="text-sm font-bold">Chef's Revenge {i}</span>
                        <span className="text-[10px] text-slate-400">Action • 2h 15m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Gamepad2 className="text-emerald-500" /> Instant Games
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-white/5 flex gap-4 items-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <div className="w-16 h-16 bg-slate-700 rounded-lg overflow-hidden">
                        <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/f6c715e4-d688-4313-887b-c2a5550e0878/game-thumbnail-86b3137b-1776165478954.webp" alt="game" />
                      </div>
                      <div>
                        <span className="block font-bold">Kitchen Dash</span>
                        <span className="text-xs text-slate-400">High Score: 12,450</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600/20 border border-indigo-500/20 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                    <Music className="text-white" />
                  </div>
                  <div>
                    <span className="block font-bold">Chill Lo-fi Dining</span>
                    <span className="text-sm text-indigo-300">Now Playing on Speaker #4</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-300">Request Song</Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'cart' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="cart" className="max-w-2xl mx-auto h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-8">Review Your Order</h2>
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                  <p>Your cart is empty</p>
                  <Button variant="link" className="text-amber-500" onClick={() => setActiveTab('menu')}>Go back to menu</Button>
                </div>
              ) : (
                <div className="flex-1 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-slate-900 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                        <div>
                          <span className="block font-bold">{item.name}</span>
                          <span className="text-sm text-slate-400">Quantity: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-amber-500">${item.price * item.quantity}</span>
                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}>
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-8 border-t border-white/10 mt-auto">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl">Total</span>
                      <span className="text-3xl font-bold text-amber-500">${cart.reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
                    </div>
                    <Button className="w-full h-16 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-500/20" onClick={handlePlaceOrder}>
                      <Send className="w-5 h-5 mr-2" /> Place Order
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Order Status */}
      {table?.status === 'waiting_for_food' && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-6 py-2 rounded-full backdrop-blur-md animate-pulse">
            Chef is preparing your meal...
          </Badge>
        </div>
      )}
    </div>
  );
};