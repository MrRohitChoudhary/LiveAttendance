
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Camera from './components/Camera';
import LiveMap from './components/LiveMap';
import { User, AttendanceRecord } from './types';
import { STORAGE_KEYS } from './constants';
import { attendanceService } from './services/attendanceService';
import { 
  Camera as CameraIcon, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Trash2,
  Check,
  X,
  ShieldCheck,
  RefreshCw,
  Navigation,
  ChevronRight
} from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmpId, setRegEmpId] = useState('');

  // App State
  const [activeTab, setActiveTab] = useState<'attendance' | 'history' | 'admin'>('attendance');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>('Determining location...');
  const [locError, setLocError] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Sync records
  useEffect(() => {
    if (user) {
      setRecords(attendanceService.getRecords());
    }
  }, [user, activeTab]);

  // Reverse Geocoding
  useEffect(() => {
    if (location) {
      const fetchAddress = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`);
          const data = await res.json();
          setAddress(data.display_name || `${location.lat}, ${location.lng}`);
        } catch (err) {
          setAddress(`Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
        }
      };
      fetchAddress();
    }
  }, [location]);

  // Real-time GPS Tracking
  useEffect(() => {
    if (user && activeTab === 'attendance') {
      setLocLoading(true);
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocError(null);
          setLocLoading(false);
        },
        (err) => {
          setLocError("Location access required for clock-in.");
          setLocLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [user, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'worker',
      employeeId: 'EMP' + Math.floor(Math.random() * 1000)
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: regName,
      role: 'worker',
      employeeId: regEmpId
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const handleSubmitAttendance = async () => {
    if (!user || !location) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      attendanceService.submitRecord({
        userId: user.id,
        userName: user.name,
        timestamp: Date.now(),
        latitude: location.lat,
        longitude: location.lng,
        address: address,
        photoUrl: capturedPhoto || undefined,
        notes,
        status: 'pending',
        distanceFromOffice: 0,
        deviceInfo: navigator.userAgent
      });
      setCapturedPhoto(null);
      setNotes('');
      setActiveTab('history');
    } catch (err) {
      alert("Clock-in failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, status: AttendanceRecord['status']) => {
    attendanceService.updateRecordStatus(id, status);
    setRecords(attendanceService.getRecords());
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl shadow-indigo-200">
              <Navigation className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">GeoTrack</h1>
            <p className="text-slate-400 text-sm mt-1 font-bold uppercase tracking-widest">Field Attendance</p>
          </div>
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {isRegistering && (
              <input type="text" placeholder="Full Name" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" value={regName} onChange={e => setRegName(e.target.value)} required />
            )}
            <input type="email" placeholder="Email" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all mt-4">
              {isRegistering ? 'Start Tracking' : 'Sign In'}
            </button>
          </form>
          <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-6 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600">
            {isRegistering ? 'Go to Login' : 'Create Account'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
          
          {/* Real-time Location Info */}
          <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-white/20 rounded-2xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Current Location</p>
                <h4 className="font-bold text-sm mt-1 leading-snug line-clamp-2">
                  {locLoading ? "Detecting GPS..." : address}
                </h4>
              </div>
            </div>
          </div>

          <LiveMap userLocation={location} />

          {locError && (
            <div className="bg-rose-50 text-rose-700 p-5 rounded-3xl border border-rose-100 flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wide">{locError}</p>
            </div>
          )}

          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <CameraIcon className="w-4 h-4 text-indigo-500" />
                  Visual Proof
                </h3>
                {capturedPhoto && <CheckCircle className="w-4 h-4 text-emerald-500" />}
             </div>
            {capturedPhoto ? (
              <div className="relative group">
                <img src={capturedPhoto} alt="Proof" className="w-full h-44 object-cover rounded-2xl" />
                <button onClick={() => setCapturedPhoto(null)} className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full shadow-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsCameraOpen(true)} className="w-full h-44 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-3 group transition-colors hover:bg-slate-100">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <CameraIcon className="w-7 h-7 text-indigo-500" />
                </div>
                <span className="text-xs font-bold text-slate-400">Capture Live Photo</span>
              </button>
            )}
            <input 
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              placeholder="Add optional notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <button 
            disabled={locLoading || isSubmitting || !capturedPhoto}
            onClick={handleSubmitAttendance}
            className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all ${
              !locLoading && capturedPhoto && !isSubmitting
                ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.97]' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'
            }`}
          >
            {isSubmitting ? <RefreshCw className="w-6 h-6 animate-spin mx-auto" /> : "Clock In Now"}
          </button>
          {!capturedPhoto && !locLoading && (
            <p className="text-center text-[10px] text-indigo-500 font-bold uppercase tracking-widest animate-bounce">
              Photo required to clock in
            </p>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <h3 className="font-black text-slate-800 text-xl px-1">Your Logs</h3>
          <div className="space-y-4">
            {records.filter(r => r.userId === user.id).length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No entries found</p>
              </div>
            ) : (
              records.filter(r => r.userId === user.id).sort((a,b) => b.timestamp - a.timestamp).map(record => (
                <div key={record.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 transition-all hover:shadow-md">
                  <div className="flex justify-between items-start">
                     <div>
                       <p className="text-sm font-black text-slate-800">
                         {new Date(record.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                       </p>
                       <div className="flex items-center gap-1.5 mt-0.5">
                         <Clock className="w-3 h-3 text-slate-400" />
                         <p className="text-[10px] font-bold text-slate-400 uppercase">
                           {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                       </div>
                     </div>
                     <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
                       record.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                     }`}>
                       {record.status}
                     </span>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                     <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                     <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                        {record.address || "Street Address Not Available"}
                     </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'admin' && user.role === 'admin' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Total Logs</p>
                <h4 className="text-4xl font-black">{records.length}</h4>
              </div>
              <button onClick={() => attendanceService.exportToCSV(records)} className="p-4 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors">
                 <Download className="w-6 h-6" />
              </button>
           </div>
           
           <h3 className="font-black text-slate-800 px-1 text-lg">Verification Queue</h3>
           <div className="space-y-5">
             {records.filter(r => r.status === 'pending').map(record => (
                <div key={record.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                   <div className="flex gap-4 items-center mb-5">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                        {record.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-black text-slate-800">{record.userName}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(record.timestamp).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl mb-5">
                      <div className="flex gap-2 mb-2">
                         <MapPin className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                         <p className="text-[10px] font-bold text-slate-500">{record.address}</p>
                      </div>
                      {record.photoUrl && (
                        <img src={record.photoUrl} className="w-full h-40 object-cover rounded-2xl border border-white shadow-sm" />
                      )}
                   </div>
                   <div className="flex gap-3">
                      <button onClick={() => handleUpdateStatus(record.id, 'rejected')} className="flex-1 py-4 text-rose-500 font-black text-xs border-2 border-rose-50 rounded-2xl hover:bg-rose-50">Reject</button>
                      <button onClick={() => handleUpdateStatus(record.id, 'approved')} className="flex-1 py-4 bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-600">Approve</button>
                   </div>
                </div>
             ))}
           </div>
        </div>
      )}

      {isCameraOpen && <Camera onCapture={(base64) => { setCapturedPhoto(base64); setIsCameraOpen(false); }} onClose={() => setIsCameraOpen(false)} />}
    </Layout>
  );
};

export default App;
