import { useMemo } from 'react';
import { DATA } from '../data';
import {
  computeKPIs,
  computeStatusDistribution,
  computeRevenueByCounty,
  computeNoticesByPeriod,
  computeTopFirms,
  computePipelineStages,
} from '../dataTransforms';
import KPICards from '../components/KPICards';
import StatusDonutChart from '../components/charts/StatusDonutChart';
import RevenueByCountyChart from '../components/charts/RevenueByCountyChart';
import NoticesOverTimeChart from '../components/charts/NoticesOverTimeChart';
import StatusPipeline from '../components/charts/StatusPipeline';
import TopFirmsLeaderboard from '../components/TopFirmsLeaderboard';

export default function DashboardView({ onDrillDown }) {
  const kpis = useMemo(() => computeKPIs(DATA), []);
  const statusDist = useMemo(() => computeStatusDistribution(DATA), []);
  const revenueByCounty = useMemo(() => computeRevenueByCounty(DATA, 10), []);
  const noticesOverTime = useMemo(() => computeNoticesByPeriod(DATA), []);
  const topFirms = useMemo(() => computeTopFirms(DATA, 8), []);
  const pipelineStages = useMemo(() => computePipelineStages(DATA), []);

  const drillStatus = (status) =>
    onDrillDown({ activeStatus: status });

  const drillCounty = (county) =>
    onDrillDown({ filterCounty: county });

  const drillFirm = (firm) =>
    onDrillDown({ filterFirm: firm });

  const drillPipeline = (stageName, statuses) => {
    if (statuses && statuses.length === 1) {
      onDrillDown({ activeStatus: statuses[0] });
    } else if (statuses && statuses.length > 1) {
      // For grouped stages (e.g. Verified), drill to first status
      onDrillDown({ activeStatus: statuses[0] });
    } else {
      onDrillDown({ activeStatus: stageName });
    }
  };

  return (
    <div className="dashboard-view">
      <KPICards kpis={kpis} />

      {pipelineStages.length > 0 && (
        <div className="dash-panel dash-panel-full">
          <h3 className="dash-panel-title">Notice Pipeline</h3>
          <StatusPipeline stages={pipelineStages} onStageClick={drillPipeline} />
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dash-panel">
          <h3 className="dash-panel-title">Status Distribution</h3>
          <StatusDonutChart data={statusDist} onSliceClick={drillStatus} />
        </div>

        <div className="dash-panel">
          <h3 className="dash-panel-title">Revenue by County (Top 10)</h3>
          <RevenueByCountyChart
            data={revenueByCounty}
            onBarClick={drillCounty}
          />
        </div>

        <div className="dash-panel">
          <h3 className="dash-panel-title">Notices Over Time</h3>
          <NoticesOverTimeChart data={noticesOverTime} />
        </div>

        <div className="dash-panel">
          <h3 className="dash-panel-title">Top Firms</h3>
          <TopFirmsLeaderboard firms={topFirms} onFirmClick={drillFirm} />
        </div>
      </div>
    </div>
  );
}
