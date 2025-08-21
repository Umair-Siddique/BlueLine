export default function AuthLayout({ children, title }) {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#fff' }}
    >
      <div 
        className="max-w-md w-full rounded-2xl shadow-xl overflow-hidden"
        style={{ backgroundColor: '#fff', boxShadow: '0 4px 24px 0 #E0E0E0' }}
      >
        <div className="px-8 py-10">
          <h2 className="text-left text-2xl font-bold mb-2" style={{ color: '#000' }}>{title}</h2>
          <p className="text-left text-base mb-8" style={{ color: '#000', opacity: 0.8 }}>to get started</p>
          <div style={{ color: '#000' }}>
            <div style={{ color: '#000' }}>{children}</div>
            <style>{`
              label, p, input, span, h2, h1, h3, h4, h5, h6, div, a { color: #000 !important; }
              input::placeholder, textarea::placeholder {
                color: #888 !important;
                opacity: 1 !important;
              }
              .main-action-btn {
                background: #fff !important;
                color: #000 !important;
                border: 1px solid #000 !important;
                border-radius: 8px !important;
                font-weight: 500 !important;
                font-size: 1rem !important;
                margin-top: 1.5rem !important;
                margin-bottom: 1.5rem !important;
                height: 48px !important;
                box-shadow: 0 2px 8px 0 #E0E0E0;
                display: block;
                width: 100%;
              }
              .main-action-btn:hover {
                background: #f3f3f3 !important;
                color: #000 !important;
              }
              .eye-icon, .eye-icon svg, svg[aria-label='Show password'], svg[aria-label='Hide password'] {
                color: #000 !important;
                fill: #000 !important;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}