/* global React */
// Shared line icons — discreet social marks. 1.4px stroke, currentColor.
const ICON_PATHS = {
  email: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3.5 6.5 L12 13 L20.5 6.5" /></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M7 10v7M7 7.2v.01M11 17v-7M11 12.4c.5-1.6 1.5-2.4 3-2.4 1.9 0 3 1.1 3 3.2V17" /></>,
  github: <path d="M9 19c-4 1.2-4-2.2-6-2.6m12 4.6v-3.2c0-.9-.3-1.5-.7-1.9 2.4-.3 4.7-1.2 4.7-5.3a4 4 0 0 0-1.1-2.9 3.7 3.7 0 0 0-.1-2.8s-.9-.3-3 1.1a10 10 0 0 0-5.4 0C7.3 4.9 6.4 5.2 6.4 5.2a3.7 3.7 0 0 0-.1 2.8A4 4 0 0 0 5.2 11c0 4 2.3 4.9 4.6 5.3-.3.3-.6.8-.7 1.5V21" />,
  substack: <><path d="M5 5h14M5 9h14M5 13h14v7l-7-3.2L5 20z" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};

function Icon({ name, size = 16, stroke = 1.4, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

function SocialCluster({ tone = "dark", size = 15 }) {
  const C = window.CONTENT;
  return (
    <div className={`social-cluster social-${tone}`}>
      {C.social.map((s) => (
        <a key={s.id} href={s.href} className="social-mark" aria-label={s.label}
           target="_blank" rel="noopener noreferrer" title={s.label}>
          <Icon name={s.id} size={size} />
        </a>
      ))}
    </div>
  );
}

window.Icon = Icon;
window.SocialCluster = SocialCluster;
