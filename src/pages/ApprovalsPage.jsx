import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsApi } from '../api/services';
import { PageLoader, EmptyState, StatusBadge, Modal, Field } from '../components/ui';
import { CheckCircle, XCircle, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { safeFormatDistanceToNow } from '../utils/date';

export default function ApprovalsPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');
  const [actionOpen, setActionOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['pending-approvals-full'],
    queryFn: () => approvalsApi.getPending({ per_page: 50 }).then((r) => r.data.data),
  });

  const actMutation = useMutation({
    mutationFn: ({ id, decision, comments }) => approvalsApi.act(id, { decision, comments }),
    onSuccess: () => {
      toast.success(`Decision recorded`);
      qc.invalidateQueries(['pending-approvals-full']);
      qc.invalidateQueries(['dashboard-kpis']);
      setActionOpen(false);
      setComments('');
    },
    onError: (e) => toast.error(e.response?.data?.error?.message || 'Failed'),
  });

  const openAction = (approval, dec) => {
    setSelected(approval);
    setDecision(dec);
    setComments('');
    setActionOpen(true);
  };

  const approvals = data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1>Approvals</h1>
        {approvals.length > 0 && <span className="badge-amber">{approvals.length} pending</span>}
      </div>

      {isLoading ? <PageLoader /> : approvals.length === 0 ? (
        <div className="card">
          <EmptyState
            title="All clear!"
            description="Nothing pending your approval right now."
            action={<CheckCircle className="w-12 h-12 text-green-400 mx-auto mt-2" />}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((ap) => (
            <div key={ap.id} className="card border-l-4 border-l-amber-400">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg mt-0.5">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 capitalize">
                      {ap.approvable_type?.replace(/_/g, ' ')} — Level {ap.level}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ID: {ap.approvable_id?.slice(-8)} ·{' '}
                      {formatDistanceToNow(new Date(ap.created_at), { addSuffix: true })}
                    </p>
                    {ap.comments && (
                      <p className="text-sm text-gray-600 mt-1 italic">"{ap.comments}"</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-3"
                    onClick={() => openAction(ap, 'request_changes')}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Request Changes
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-sm py-1.5 px-3 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
                    onClick={() => openAction(ap, 'rejected')}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    className="btn-primary flex items-center gap-1.5 text-sm py-1.5 px-3"
                    onClick={() => openAction(ap, 'approved')}
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={actionOpen}
        onClose={() => setActionOpen(false)}
        title={`${decision === 'approved' ? 'Approve' : decision === 'rejected' ? 'Reject' : 'Request Changes'}`}
        size="sm"
      >
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            {decision === 'approved' && 'This will approve the request and trigger the next workflow step.'}
            {decision === 'rejected' && 'This will reject the request. Please provide a reason.'}
            {decision === 'request_changes' && 'Describe the changes needed before resubmission.'}
          </p>
          <Field label={`Comments${decision !== 'approved' ? ' *' : ''}`}>
            <textarea className="input" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add a comment…" />
          </Field>
        </div>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setActionOpen(false)}>Cancel</button>
          <button
            className={decision === 'approved' ? 'btn-primary' : 'btn-danger'}
            disabled={(['rejected', 'request_changes'].includes(decision) && !comments) || actMutation.isPending}
            onClick={() => actMutation.mutate({ id: selected?.id, decision, comments })}
          >
            {actMutation.isPending ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
