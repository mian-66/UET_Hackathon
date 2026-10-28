import React from 'react';
import { getRiskMeta } from '../../utils/riskClassification.js';
import { Shield, Search, Wrench, AlertTriangle } from 'lucide-react';

const RISK_ICONS = {
  safe: Shield,
  'read-only': Search,
  modifying: Wrench,
  destructive: AlertTriangle
};

export function RiskBadge({ risk, size = 'sm', showIcon = true, className = '' }) {
  const meta = getRiskMeta(risk);
  const IconComponent = RISK_ICONS[meta.id] || Shield;

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-1.5 py-0.5 gap-1' 
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium font-mono uppercase tracking-wider rounded border ${meta.badge} ${sizeClasses} ${className}`}
      title={meta.description}
    >
      {showIcon && <IconComponent className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
      <span>{meta.label}</span>
    </span>
  );
}

export function TagBadge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-term-surface text-term-muted border-term-border text-slate-400',
    accent: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    persona: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    shell: 'bg-slate-800 text-slate-300 border-slate-700 font-mono'
  };

  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

