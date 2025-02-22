import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';

function BtnsPlayback({ 
  isPlaying, 
  currentRepetition, 
  repetitions, 
  onTogglePlay, 
  onCycleRepetitions 
}) {
  return (
    <div className="flex items-center gap-2">
      <span 
        onClick={onCycleRepetitions} 
        className="flex items-center justify-center h-8 border border-gray-500 rounded cursor-pointer min-w-14 hover:bg-gray-700"
      >
        {currentRepetition}/{repetitions}×
      </span>
      <span 
        onClick={onTogglePlay} 
        className="flex items-center justify-center border border-gray-500 rounded cursor-pointer size-8 hover:bg-gray-700"
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </span>
    </div>
  );
}

export default BtnsPlayback