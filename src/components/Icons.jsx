import React from 'react';
import { View, Text, Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

function WebSvg({ size = 20, color = 'currentColor', children, className = '' }) {
  if (!isWeb) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {children}
    </svg>
  );
}

function NativeFallback({ symbol, size = 20, color }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ fontSize: size * 0.75, color: color || '#94a3b8' }}>
        {symbol}
      </Text>
    </View>
  );
}

export function DashboardIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="⊞" size={size} color={color} />;
}

export function ShieldIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="🛡" size={size} color={color} />;
}

export function ShieldCheckIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="✓" size={size} color={color} />;
}

export function UserIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="👤" size={size} color={color} />;
}

export function LockIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="🔒" size={size} color={color} />;
}

export function KeyIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1.5-1.5L8 9" />
        <circle cx="7.5" cy="15.5" r="5.5" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="🔑" size={size} color={color} />;
}

export function LogOutIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="↪" size={size} color={color} />;
}

export function CheckIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <polyline points="20 6 9 17 4 12" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="✓" size={size} color={color} />;
}

export function AlertCircleIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="!" size={size} color={color} />;
}

export function ChevronRightIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <polyline points="9 18 15 12 9 6" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="›" size={size} color={color} />;
}

export function ChevronLeftIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <polyline points="15 18 9 12 15 6" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="‹" size={size} color={color} />;
}

export function MenuIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="☰" size={size} color={color} />;
}

export function CloseIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="✕" size={size} color={color} />;
}

export function CopyIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="⎘" size={size} color={color} />;
}

export function SparklesIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="✦" size={size} color={color} />;
}

export function RefreshIcon({ size = 20, color = 'currentColor', className = '' }) {
  if (isWeb) {
    return (
      <WebSvg size={size} color={color} className={className}>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </WebSvg>
    );
  }
  return <NativeFallback symbol="↻" size={size} color={color} />;
}
