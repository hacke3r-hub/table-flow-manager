import { useState } from 'react';
import { RestaurantProvider } from './store/RestaurantContext';
import { PatronView } from './views/PatronView';
import { KitchenView } from './views/KitchenView';
import { WaiterView } from './views/WaiterView';
import { AdminView } from './views/AdminView';
import { Toaster } from './components/ui/sonner';
import { Monitor, Tablet, Watch, LayoutDashboard } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'patron' | 'kitchen' | 'waiter' | 'admin'>('patron');

  return (
    <RestaurantProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* View Switcher (For Demo Purposes) */}
        <div className="fixed bottom-6 right-6 z-50 flex gap-2 bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/20 shadow-2xl">
          <button
            onClick={() => setCurrentView('patron')}
            className={`p-3 rounded-full transition-all ${currentView === 'patron' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40' : 'text-white/60 hover:text-white'}`}
            title="Patron Tablet"
          >
            <Tablet className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('waiter')}
            className={`p-3 rounded-full transition-all ${currentView === 'waiter' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' : 'text-white/60 hover:text-white'}`}
            title="Waiter Smart Watch"
          >
            <Watch className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('kitchen')}
            className={`p-3 rounded-full transition-all ${currentView === 'kitchen' ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'text-white/60 hover:text-white'}`}
            title="Kitchen Monitor"
          >
            <Monitor className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`p-3 rounded-full transition-all ${currentView === 'admin' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'text-white/60 hover:text-white'}`}
            title="Admin Dashboard"
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
        </div>

        {/* Views */}
        {currentView === 'patron' && <PatronView tableId="t1" />}
        {currentView === 'waiter' && <WaiterView waiterId="w1" />}
        {currentView === 'kitchen' && <KitchenView />}
        {currentView === 'admin' && <AdminView />}

        <Toaster position="top-center" expand={true} richColors />
      </div>
    </RestaurantProvider>
  );
}

export default App;