import confetti from 'canvas-confetti';

export function useAdminHandlers({
  token, user,
  qualityAudits, setQualityAudits,
  disputes, setDisputes,
  fetchData,
}) {
  const handleAddQualityAudit = async (auditData) => {
    try {
      const res = await fetch('/api/quality-audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...auditData, farmerId: user?.id, status: 'scheduled' }),
      });
      if (res.ok) {
        const newAudit = await res.json();
        setQualityAudits((prev) => [...prev, newAudit]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateQualityAudit = async (id, auditData) => {
    try {
      const res = await fetch(`/api/quality-audits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(auditData),
      });
      if (res.ok) {
        setQualityAudits(qualityAudits.map((a) => (a.id === id ? { ...a, ...auditData } : a)));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteQualityAudit = async (id) => {
    try {
      const res = await fetch(`/api/quality-audits/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setQualityAudits(qualityAudits.filter((a) => a.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleResolveDispute = async (id, resolutionData) => {
    try {
      const res = await fetch(`/api/disputes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'resolved', resolution: resolutionData.resolution || resolutionData, resolvedBy: user?.name }),
      });
      if (res.ok) {
        setDisputes(disputes.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d)));
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) { console.error(err); }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) { console.error(err); }
  };

  const handleActivateUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (err) { console.error(err); }
  };

  return {
    handleAddQualityAudit, handleUpdateQualityAudit, handleDeleteQualityAudit,
    handleResolveDispute, handleSuspendUser, handleActivateUser,
  };
}
