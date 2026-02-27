import { useState, useMemo, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { DATA } from './data';
import Sidebar from './components/Sidebar';
import HeaderBar from './components/HeaderBar';
import DashboardView from './views/DashboardView';
import NoticesView from './views/NoticesView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [drillDownFilters, setDrillDownFilters] = useState(null);

  const alertCount = useMemo(
    () =>
      DATA.filter(
        (r) =>
          r.CertificateOfMailingRequired === 'yes' &&
          r.CertificateOfMailingUploaded === 'no'
      ).length,
    []
  );

  const handleNavigate = useCallback((view) => {
    setActiveView(view);
    setDrillDownFilters(null);
  }, []);

  const handleDrillDown = useCallback((filters) => {
    setDrillDownFilters(filters);
    setActiveView('notices');
  }, []);

  const handleAlertClick = useCallback(() => {
    setDrillDownFilters({ showAlertFilter: true });
    setActiveView('notices');
  }, []);

  const handleGlobalSearch = useCallback((value) => {
    setGlobalSearch(value);
    if (value) {
      setActiveView('notices');
    }
  }, []);

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <Sidebar
        activeView={activeView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        onNavigate={handleNavigate}
        alertCount={alertCount}
      />

      <div className="main-area">
        <HeaderBar
          activeView={activeView}
          globalSearch={globalSearch}
          onSearchChange={handleGlobalSearch}
          alertCount={alertCount}
          onAlertClick={handleAlertClick}
        />

        <div className="main-content">
          {activeView === 'dashboard' && (
            <DashboardView onDrillDown={handleDrillDown} />
          )}
          {activeView === 'notices' && (
            <NoticesView
              initialFilters={drillDownFilters}
              globalSearch={globalSearch}
            />
          )}
        </div>
      </div>

      <Analytics />
    </div>
  );
}
