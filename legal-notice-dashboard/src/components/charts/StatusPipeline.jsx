import { Fragment } from 'react';

const STAGE_COLORS = {
  Received: 'var(--red)',
  'On Hold': 'var(--amb)',
  Verified: 'var(--blu)',
  Placed: 'var(--grn)',
  Completed: 'var(--grn)',
  Canceled: 'var(--pur)',
};

export default function StatusPipeline({ stages, onStageClick }) {
  if (!stages.length) return null;

  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="pipeline">
      {stages.map((stage, i) => (
        <Fragment key={stage.name}>
          <div
            className="pipeline-stage"
            style={{
              '--stage-color': STAGE_COLORS[stage.name] || 'var(--blu)',
              '--stage-pct': `${(stage.count / max) * 100}%`,
            }}
            onClick={() => onStageClick?.(stage.name, stage.statuses)}
            title={`${stage.name}: ${stage.count} notices`}
          >
            <div className="pipeline-bar" />
            <div className="pipeline-count">{stage.count}</div>
            <div className="pipeline-label">{stage.name}</div>
          </div>
          {i < stages.length - 1 && <div className="pipeline-arrow">›</div>}
        </Fragment>
      ))}
    </div>
  );
}
