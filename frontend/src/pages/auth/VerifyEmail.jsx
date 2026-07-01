import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Building2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    authAPI.verifyEmail(token).then(() => setStatus('success')).catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0f1e' }}>
      <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
        {status === 'loading' && <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />}
        {status === 'success' && (<>
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Email Verified!</h2>
          <p className="text-gray-400 mb-6">Your email has been verified successfully.</p>
          <Link to="/login" className="btn-primary inline-block">Go to Login</Link>
        </>)}
        {status === 'error' && (<>
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Verification Failed</h2>
          <p className="text-gray-400 mb-6">Invalid or expired verification link.</p>
          <Link to="/login" className="btn-secondary inline-block">Back to Login</Link>
        </>)}
      </div>
    </div>
  );
}
