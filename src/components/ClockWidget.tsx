import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { Clock, Play, Square, MapPin } from 'lucide-react';

export const ClockWidget: React.FC = () => {
  const { 
    isClockedIn, 
    activeClockInTime, 
    clockInSeconds, 
    handleClockIn, 
    handleClockOut, 
    currentUser 
  } = useHR();

  const [location, setLocation] = useState('Office Workstation - Floor 4');

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Workstation Punch Clock</h3>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded ${
          isClockedIn 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-slate-100 text-slate-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isClockedIn ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {isClockedIn ? 'Clocked In' : 'Not Clocked In'}
        </span>
      </div>

      <div className="py-4 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Session</p>
        <div className="text-3xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
          {formatTimer(clockInSeconds)}
        </div>
        {isClockedIn && activeClockInTime && (
          <p className="text-xs text-slate-500 mt-1">
            Punched in at <span className="font-semibold text-slate-700 font-mono">{activeClockInTime}</span>
          </p>
        )}
      </div>

      <div className="space-y-3 pt-2">
        {!isClockedIn && (
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/70">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-700 focus:outline-none"
            >
              <option value="Office Workstation - Floor 4">Office Workstation - Floor 4</option>
              <option value="Engineering Pod B">Engineering Pod B</option>
              <option value="Design Studio">Design Studio</option>
              <option value="Remote / Work From Home">Remote / Work From Home</option>
            </select>
          </div>
        )}

        {isClockedIn ? (
          <button
            onClick={handleClockOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            Punch Clock Out
          </button>
        ) : (
          <button
            onClick={() => handleClockIn(location)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Punch Clock In
          </button>
        )}
      </div>
    </div>
  );
};
