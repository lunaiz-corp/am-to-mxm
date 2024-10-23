import '~/styles/complex-components/ProgressIndicator.css';

interface IProgressIndicatorProps {
  indeterminate?: boolean;
  progress?: number;
}

export default function ProgressIndicator({
  indeterminate = false,
  progress = 1,
}: IProgressIndicatorProps) {
  return (
    <div className="progress-indicator">
      <div
        className={`progress ${indeterminate ? 'indeterminate' : ''}`}
        role="progressbar"
        aria-label="Loading..."
      >
        <div
          className="inactive-track"
          style={{ transform: `scaleX(${Math.min(progress * 100, 100)}%)` }}
        />

        <div
          className="bar primary-bar"
          style={{ transform: `scaleX(${Math.min(progress * 100, 100)}%)` }}
        >
          <div className="bar-inner" />
        </div>

        <div className="bar secondary-bar">
          <div className="bar-inner" />
        </div>
      </div>
    </div>
  );
}

ProgressIndicator.defaultProps = {
  indeterminate: false,
  progress: 1,
};
