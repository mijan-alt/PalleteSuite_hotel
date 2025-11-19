// components/BlockPreviewImage.tsx
'use client'
import React from 'react'

export const ServicesBlockPreview: React.FC = () => {
  return (
    <div className="block-preview-container" style={{ marginBottom: '24px' }}>
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#374151',
          }}
        >
          Block Preview
        </h3>
        <img
          src="/images/blocks/services-block-preview.png"
          alt="Services Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px',
            lineHeight: '1.5',
          }}
        >
          This block displays three service cards with icons, titles, descriptions, and links. The
          middle card has a subtle offset on larger screens.
        </p>
      </div>
    </div>
  )
}

// CTA2 Block Preview
export const Cta2BlockPreview: React.FC = () => {
  return (
    <div className="block-preview-container" style={{ marginBottom: '24px' }}>
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#374151',
          }}
        >
          Block Preview
        </h3>
        <img
          src="/images/blocks/cta2-preview.png"
          alt="CTA2 Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px',
            lineHeight: '1.5',
          }}
        >
          Split layout with image on one side and call-to-action content on the other. Perfect for
          highlighting key services or partnerships.
        </p>
      </div>
    </div>
  )
}

// About Mission Block Preview
export const AboutMissionBlockPreview: React.FC = () => {
  return (
    <div className="block-preview-container" style={{ marginBottom: '24px' }}>
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#374151',
          }}
        >
          Block Preview
        </h3>
        <img
          src="/images/blocks/about-mission-preview.png"
          alt="About Mission Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px',
            lineHeight: '1.5',
          }}
        >
          Comprehensive about/mission page block with hero section, mission statement, company
          values grid, and team CTA. Perfect for company story pages.
        </p>
      </div>
    </div>
  )
}

// History1 Block Preview
export const History1BlockPreview: React.FC = () => {
  return (
    <div className="block-preview-container" style={{ marginBottom: '24px' }}>
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#374151',
          }}
        >
          Block Preview
        </h3>
        <img
          src="/admin/block-previews/history1.png"
          alt="History Timeline Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px',
            lineHeight: '1.5',
          }}
        >
          Vertical timeline with alternating milestones, decorative icons, and images. Perfect for
          company history, journey, or milestone pages.
        </p>
      </div>
    </div>
  )
}

export const History2BlockPreview: React.FC = () => {
  return (
    <div className="block-preview-container" style={{ marginBottom: '24px' }}>
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#374151',
          }}
        >
          Block Preview
        </h3>
        <img
          src="/admin/block-previews/history2.png"
          alt="History Timeline Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '8px',
            lineHeight: '1.5',
          }}
        >
          Vertical timeline with alternating milestones, decorative icons, and images. Perfect for
          company history, journey, or milestone pages.
        </p>
      </div>
    </div>
  )
}

// Alternative: More compact version for inline use
export const ServicesBlockPreviewInline: React.FC = () => {
  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
      }}
    >
      <details open>
        <summary
          style={{
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            color: '#374151',
            marginBottom: '12px',
            userSelect: 'none',
          }}
        >
          📸 Block Preview (Click to toggle)
        </summary>
        <img
          src="/images/blocks/services-block-preview.png"
          alt="Services Block Preview"
          style={{
            width: '100%',
            maxWidth: '800px',
            height: 'auto',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
          }}
        />
      </details>
    </div>
  )
}

// Option 3: Full-width banner style
export const ServicesBlockPreviewBanner: React.FC = () => {
  return (
    <div
      style={{
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '2px solid #10b981',
        backgroundColor: '#ecfdf5',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#10b981',
          color: 'white',
          fontWeight: '600',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>🎨</span>
        <span>Services Block Layout Preview</span>
      </div>
      <div style={{ padding: '16px' }}>
        <img
          src="/images/blocks/services-block-preview.png"
          alt="Services Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </div>
  )
}

export const PolicyBlockPreview: React.FC = () => {
  return (
    <div
      style={{
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '2px solid #10b981',
        backgroundColor: '#ecfdf5',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#10b981',
          color: 'white',
          fontWeight: '600',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>🎨</span>
        <span>Policy Block Preview</span>
      </div>
      <div style={{ padding: '16px' }}>
        <img
          src="/admin/block-previews/policy.png"
          alt="Services Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </div>
  )
}


export const Asset2BlockPreview: React.FC = () => {
  return (
    <div
      style={{
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '2px solid #10b981',
        backgroundColor: '#ecfdf5',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#10b981',
          color: 'white',
          fontWeight: '600',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>🎨</span>
        <span>Policy Block Preview</span>
      </div>
      <div style={{ padding: '16px' }}>
        <img
          src="/admin/block-previews/asset2.png"
          alt="Services Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        />
      </div>
    </div>
  )
}


export const About3BlockPreview: React.FC = () => {
  return (
    <div className="block-preview-container" style={{ marginBottom: '24px' }}>
      <div style={{
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#374151'
        }}>
          Block Preview
        </h3>
        <img 
          src="/admin/block-previews/about3.png" 
          alt="About Section Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '8px',
          lineHeight: '1.5'
        }}>
          Visual about section with large images, breakout highlight card, partner logos, 
          and achievement statistics. Perfect for company overview and about pages.
        </p>
      </div>
    </div>
  )
}


export const Cta1BlockPreview: React.FC = () => {
  return (
    <div className="block-preview-container" style={{ marginBottom: '24px' }}>
      <div style={{
        padding: '16px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#374151'
        }}>
          Block Preview
        </h3>
        <img 
          src="/admin/block-previews/cta1.png" 
          alt="About Section Block Preview"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginTop: '8px',
          lineHeight: '1.5'
        }}>
         Call to  Action 1
        </p>
      </div>
    </div>
  )
}




