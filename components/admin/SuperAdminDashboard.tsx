import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Button } from '../shared/Button';
import { Trash2, ShieldAlert, Users, Search, RefreshCw, ShieldCheck } from 'lucide-react';
import { UserData } from '../../models/types';
import { useAppContext } from '../../lib/AppContext';

interface SuperAdminDashboardProps {
  userData: UserData;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ userData }) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { showToast, showConfirm } = useAppContext();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Karena user ini adalah superadmin, RLS "Superadmin bypass" akan aktif
      const { data, error } = await supabase
        .from('users_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setUsers(data as UserData[]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Gagal mengambil data pengguna.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (targetId: string, username: string) => {
    if (targetId === userData.id) {
      showToast('Tindakan ditolak: Anda tidak dapat menghapus akun Anda sendiri.', 'error');
      return;
    }

    showConfirm(
      "PERINGATAN KRITIS!",
      `Apakah Anda yakin ingin menghapus akun '${username}' secara PERMANEN?\nSemua data (nilai, log, soal) yang terhubung dengan akun ini akan hangus dan tidak bisa dikembalikan.`,
      async () => {
        setActionLoading(targetId);
        try {
          await supabase.from('activity_logs').insert({
            user_id: userData.id,
            username: userData.username,
            action_type: 'superadmin_delete_user',
            details: { deleted_user_id: targetId, deleted_username: username } as any
          });
          
          // Panggil fungsi RPC (Remote Procedure Call) yang kita buat dengan SECURITY DEFINER
          const { error } = await supabase.rpc('delete_user_by_superadmin', { 
            target_user_id: targetId 
          });

          if (error) throw error;
          
          // Hapus dari state lokal
          setUsers(prev => prev.filter(u => u.id !== targetId));
          showToast(`Akun ${username} berhasil dihapus permanen.`, 'success');
        } catch (error: any) {
          console.error('Error deleting user:', error);
          showToast(`Gagal menghapus akun: ${error.message}`, 'error');
        } finally {
          setActionLoading(null);
        }
      },
      "danger"
    );
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.school_name && u.school_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (userData.role !== 'superadmin') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <ShieldAlert size={80} className="text-cardinal mb-4" />
        <h2 className="text-3xl font-black text-slate-800 mb-2">Akses Ditolak</h2>
        <p className="text-slate-500 font-bold">Anda tidak memiliki otorisasi Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-slate-800 text-white p-6 rounded-3xl shadow-lg border-b-4 border-slate-900">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-macaw" size={36} />
            God Mode: Pusat Kendali Admin
          </h1>
          <p className="text-slate-400 mt-2 font-bold">Kelola, pantau, dan hapus seluruh entitas dalam sistem Logi Math.</p>
        </div>
        <div className="bg-slate-700/50 px-6 py-3 rounded-2xl border-2 border-slate-600 font-bold flex items-center gap-3">
          <Users size={24} className="text-feather" />
          Total Pengguna: <span className="text-white text-xl">{users.length}</span>
        </div>
      </div>

      <div className="card-spatial flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari email, username, sekolah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-macaw focus:ring-2 focus:ring-macaw-light/30 outline-none font-bold text-slate-700 transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 outline-none focus:border-macaw focus:ring-2 focus:ring-macaw-light/30 flex-1 md:flex-none transition-all"
          >
            <option value="all">Semua Role</option>
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <Button variant="outline" onClick={fetchUsers} disabled={loading} title="Refresh Data">
            <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
          </Button>
        </div>
      </div>

      <div className="card-spatial overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 font-extrabold uppercase tracking-wider text-sm border-b-2 border-slate-200">
                <th className="p-4">Pengguna</th>
                <th className="p-4">Role / Info</th>
                <th className="p-4">Statistik</th>
                <th className="p-4">Terdaftar Pada</th>
                <th className="p-4 text-center">Aksi (Bahaya)</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 font-bold text-slate-700">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">Memuat data semesta...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">Tidak ada pengguna yang cocok dengan pencarian.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-800">{user.username}</span>
                        <span className="text-sm text-slate-500">{user.email}</span>
                        {user.school_name && (
                           <span className="text-xs text-macaw bg-macaw-light/20 px-2 py-1 rounded-lg w-fit mt-1">{user.school_name}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-xs uppercase tracking-wider text-white ${
                          user.role === 'superadmin' ? 'bg-slate-800' :
                          user.role === 'guru' ? 'bg-bee-dark' : 'bg-feather'
                        }`}>
                          {user.role}
                        </span>
                        {user.role === 'siswa' && <span className="text-sm text-slate-500">Kelas {user.grade}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm flex flex-col gap-1">
                        <span>Level: <span className="text-fox">{user.level}</span></span>
                        <span>EXP: <span className="text-bee-dark">{user.exp}</span></span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Tidak diketahui'}
                    </td>
                    <td className="p-4 text-center">
                      <Button 
                        variant="danger" 
                        size="sm"
                        disabled={actionLoading === user.id || user.id === userData.id}
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        title={user.id === userData.id ? "Tidak bisa menghapus diri sendiri" : "Hapus Permanen"}
                      >
                        {actionLoading === user.id ? <RefreshCw className="animate-spin" size={16} /> : <Trash2 size={16} />}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
