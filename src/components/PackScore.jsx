/**
 * PackScore.jsx
 * Visual progress bar + motivational message showing how packed the user is.
 */
import { computePackScore } from '../utils/helpers';

export default function PackScore({ checkedState, items }) {
  const { pct, message, emoji } = computePackScore(checkedState, items);

  return (
    <div className="pack-score-card" role="region" aria-label="Pack Score">
      <div className="pack-score-header">
        <h3>{emoji} Pack Score</h3>
        <span className="pack-score-value">{pct}%</span>
      </div>
      <div className="score-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="score-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="score-message">{message}</p>
    </div>
  );
}
