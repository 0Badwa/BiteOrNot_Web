import { useEffect, useMemo, useState, type ReactNode } from 'react';

type Route = '/' | '/how-it-works' | '/pricing' | '/faq' | '/privacy' | '/terms';
type ResultKind = 'pass' | 'check' | 'avoid';
type PhoneKind = ResultKind | 'notFound' | 'camera' | 'profile' | 'history';

// TODO: Replace GOOGLE_PLAY_URL with the real Google Play Store listing before production.
const GOOGLE_PLAY_URL = '#google-play-link-needed';

const storeLinkProps = () =>
  GOOGLE_PLAY_URL.startsWith('#')
    ? { href: GOOGLE_PLAY_URL }
    : { href: GOOGLE_PLAY_URL, target: '_blank', rel: 'noreferrer' };

const screenshots: Record<PhoneKind, string> = {
  pass: '/assets/screenshots/screenshot-pass.webp',
  check: '/assets/screenshots/screenshot-check.webp',
  avoid: '/assets/screenshots/screenshot-avoid.webp',
  notFound: '/assets/screenshots/screenshot-product-not-found.webp',
  camera: '/assets/screenshots/screenshot-camera.webp',
  profile: '/assets/screenshots/screenshot-profile.webp',
  history: '/assets/screenshots/screenshot-history.webp',
};

const navItems: Array<{ label: string; href: Route }> = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

// Privacy production URL: https://www.biteornot.com/privacy
// Terms production URL: https://www.biteornot.com/terms
const routeTitles: Record<Route, string> = {
  '/': 'BiteOrNot — One fast product decision before you eat',
  '/how-it-works': 'How BiteOrNot works',
  '/pricing': 'BiteOrNot pricing',
  '/faq': 'BiteOrNot FAQ',
  '/privacy': 'BiteOrNot Privacy Policy',
  '/terms': 'BiteOrNot Terms of Service',
};

const faqItems = [
  {
    question: 'Is BiteOrNot medical advice?',
    answer:
      'No. BiteOrNot checks product label data against your selected restrictions. It does not diagnose, treat, or replace professional medical advice.',
  },
  {
    question: 'What does PASS mean?',
    answer:
      'PASS means the available product data did not conflict with your selected restriction. Always check the physical label if the product is important for your health or allergy safety.',
  },
  {
    question: 'What does CHECK mean?',
    answer:
      'CHECK means the product needs a closer look. Data may be missing, unclear, incomplete, or not verified.',
  },
  {
    question: 'What does AVOID mean?',
    answer: 'AVOID means the product appears to conflict with your selected restriction.',
  },
  {
    question: 'What happens when a barcode is not found?',
    answer:
      'BiteOrNot can still help. You can scan the ingredients or nutrition label and get a conservative result.',
  },
  {
    question: 'Do I need an account?',
    answer: 'No. BiteOrNot does not require an account for the core scan flow.',
  },
  {
    question: 'Where is my profile stored?',
    answer: 'Your selected restrictions are stored on your device.',
  },
  {
    question: 'Is BiteOrNot a calorie tracker?',
    answer:
      'No. BiteOrNot is focused on fast product decisions, not tracking meals or calories.',
  },
];

const resultCopy: Record<ResultKind, { title: string; detail: string; symbol: string }> = {
  pass: {
    title: 'PASS',
    detail: 'Product appears OK for your selected restriction.',
    symbol: '✓',
  },
  check: {
    title: 'CHECK',
    detail: 'Data is missing, unclear, or needs closer review.',
    symbol: '!',
  },
  avoid: {
    title: 'AVOID',
    detail: 'The product conflicts with your selected restriction.',
    symbol: '×',
  },
};

function useRoute() {
  const readPath = (): Route => {
    const path = window.location.pathname;
    return path in routeTitles ? (path as Route) : '/';
  };
  const [route, setRoute] = useState<Route>(readPath);

  useEffect(() => {
    const handlePopState = () => setRoute(readPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (href: Route) => {
    if (href !== route) {
      window.history.pushState({}, '', href);
      setRoute(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.title = routeTitles[route];
  }, [route]);

  return { route, navigate };
}

export default function App() {
  const { route, navigate } = useRoute();
  const page = useMemo(() => {
    switch (route) {
      case '/how-it-works':
        return <HowItWorksPage navigate={navigate} />;
      case '/pricing':
        return <PricingPage />;
      case '/faq':
        return <FAQPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  }, [route]);

  return (
    <>
      <Header activeRoute={route} navigate={navigate} />
      <main>{page}</main>
      <Footer navigate={navigate} />
    </>
  );
}

function Header({
  activeRoute,
  navigate,
}: {
  activeRoute: Route;
  navigate: (href: Route) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (href: Route) => {
    navigate(href);
    setIsOpen(false);
  };

  return (
    <header className="site-header">
      <a
        href="/"
        className="brand-lockup"
        onClick={(event) => {
          event.preventDefault();
          handleNavigate('/');
        }}
        aria-label="BiteOrNot home"
      >
        <img
          className="brand-icon"
          src="/assets/app-icons/icon.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="brand-wordmark"
          src="/assets/app-icons/biteornot_logo_product_not_found.png"
          alt="BiteOrNot"
        />
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            activeRoute={activeRoute}
            navigate={handleNavigate}
          />
        ))}
        <a className="header-cta" {...storeLinkProps()}>
          Coming soon to Google Play
        </a>
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
        <span className="sr-only">Menu</span>
      </button>
      {isOpen ? (
        <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              activeRoute={activeRoute}
              navigate={handleNavigate}
            />
          ))}
          <a className="header-cta" {...storeLinkProps()} onClick={() => setIsOpen(false)}>
            Coming soon to Google Play
          </a>
        </nav>
      ) : null}
    </header>
  );
}

function NavLink({
  item,
  activeRoute,
  navigate,
}: {
  item: { label: string; href: Route };
  activeRoute: Route;
  navigate: (href: Route) => void;
}) {
  return (
    <a
      href={item.href}
      className={activeRoute === item.href ? 'active' : ''}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.href);
      }}
    >
      {item.label}
    </a>
  );
}

function Footer({ navigate }: { navigate: (href: Route) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <a
          href="/"
          className="wordmark footer-wordmark"
          onClick={(event) => {
            event.preventDefault();
            navigate('/');
          }}
        >
          <span className="logo-lockup footer-logo-lockup">
            <img className="logo-icon" src="/assets/app-icons/icon.png" alt="" aria-hidden="true" />
            <img
              className="logo-image footer-logo-image"
              src="/assets/app-icons/biteornot_logo_product_not_found.png"
              alt="BiteOrNot"
            />
          </span>
        </a>
        <p>One fast product decision. Scan. Decide. Done.</p>
        <a className="footer-cta" {...storeLinkProps()}>
          Coming soon to Google Play
        </a>
      </div>
      <div className="footer-links">
        <FooterLink href="/" label="Home" navigate={navigate} />
        {navItems.map((item) => (
          <FooterLink key={item.href} href={item.href} label={item.label} navigate={navigate} />
        ))}
      </div>
      <p className="footer-contact">Contact: contact@biteornot.com</p>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  navigate,
}: {
  href: Route;
  label: string;
  navigate: (href: Route) => void;
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigate(href);
      }}
    >
      {label}
    </a>
  );
}

function ButtonLink({
  children,
  href,
  variant = 'primary',
  navigate,
}: {
  children: string;
  href: Route;
  variant?: 'primary' | 'secondary';
  navigate: (href: Route) => void;
}) {
  return (
    <a
      className={`button ${variant}`}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

function StoreButton({ children, variant = 'primary' }: { children: string; variant?: 'primary' | 'secondary' }) {
  return (
    <a className={`button ${variant}`} {...storeLinkProps()}>
      {children}
    </a>
  );
}

function HomePage({ navigate }: { navigate: (href: Route) => void }) {
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">One fast product decision.</p>
          <h1>One clear answer before you eat.</h1>
          <p className="hero-subtitle">
            Scan a barcode and get a simple PASS, CHECK or AVOID based on your selected
            restrictions.
          </p>
          <div className="button-row">
            <StoreButton>Coming soon to Google Play</StoreButton>
            <ButtonLink href="/pricing" variant="secondary" navigate={navigate}>
              View pricing
            </ButtonLink>
          </div>
          <div className="trust-chips" aria-label="BiteOrNot benefits">
            <span>No login required</span>
            <span>Barcode + label scan</span>
            <span>Conservative when unsure</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="BiteOrNot app result examples">
          <PhoneMockup kind="pass" label="PASS result screen visual reference" />
          <PhoneMockup kind="check" label="CHECK result screen visual reference" />
        </div>
      </section>

      <section className="section-shell split-section">
        <div>
          <p className="eyebrow">Not a diet app.</p>
          <h2>A decision engine.</h2>
          <p>
            BiteOrNot focuses on one question: is this product OK for me? It is not a
            health score, calorie tracker, meal diary, or diet coach.
          </p>
        </div>
        <div className="result-grid">
          <ResultBadge kind="pass" />
          <ResultBadge kind="check" />
          <ResultBadge kind="avoid" />
        </div>
      </section>

      <section className="section-shell caution-band">
        <img src="/assets/app-icons/shield.png" alt="" aria-hidden="true" />
        <p>
          BiteOrNot never fakes PASS. If product data is missing or unclear, the app
          shows CHECK.
        </p>
      </section>

      <section className="section-shell fallback-section">
        <div>
          <p className="eyebrow">Barcode missing?</p>
          <h2>Product not found? Scan the label anyway.</h2>
          <p>
            If the barcode is missing from the database, BiteOrNot can still check the
            product from the ingredients or nutrition label and return a conservative result.
          </p>
          <ButtonLink href="/how-it-works" variant="secondary" navigate={navigate}>
            See how it works
          </ButtonLink>
        </div>
        <PhoneMockup kind="notFound" label="Product not found fallback screenshot" />
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <p className="eyebrow">Built for clarity, speed and safety.</p>
          <h2>Scan. Decide. Done.</h2>
        </div>
        <div className="feature-grid">
          <FeatureCard
            icon="/assets/app-icons/scan_button.png"
            title="Barcode scan"
            body="Start with the barcode when product data is available."
          />
          <FeatureCard
            icon="/assets/app-icons/reason_check_info.png"
            title="Product not found fallback"
            body="If the barcode is not found, scan the label anyway."
          />
          <FeatureCard
            icon="/assets/app-icons/splash_logo.png"
            title="Scan the label anyway"
            body="Capture ingredients or nutrition values and get a conservative result."
          />
          <FeatureCard
            icon="/assets/app-icons/profile_icon_sliders.png"
            title="Local profile"
            body="Your selected restrictions are stored on your device."
          />
          <FeatureCard
            icon="/assets/app-icons/shield.png"
            title="No mandatory account"
            body="The core scan flow works without forcing a login."
          />
          <FeatureCard
            icon="/assets/app-icons/reason_avoid_warning.png"
            title="Fast result"
            body="PASS, CHECK or AVOID appears first. Product images are secondary."
          />
        </div>
      </section>
    </>
  );
}

function HowItWorksPage({ navigate }: { navigate: (href: Route) => void }) {
  return (
    <>
      <PageHero
        eyebrow="How BiteOrNot works"
        title="A direct flow from scan to decision."
        body="Barcode scan first. Label scan fallback when product data is missing. Conservative when data is unclear."
      />
      <section className="section-shell steps-layout">
        <div className="steps-list">
          <Step number="1" title="Select one restriction">
            Choose a condition, diet preference, allergen, or custom ingredient to avoid.
          </Step>
          <Step number="2" title="Scan a barcode">
            BiteOrNot checks available product data.
          </Step>
          <Step number="3" title="Get PASS, CHECK or AVOID">
            The result appears first. Product images are secondary.
          </Step>
          <Step number="4" title="If the product is not found, scan the label">
            Capture ingredients or the nutrition table and get a conservative result.
          </Step>
          <Step number="5" title="When data is unclear, BiteOrNot shows CHECK">
            Missing data should never become PASS.
          </Step>
        </div>
        <div className="phone-pair how-phone-pair">
          <PhoneMockup kind="camera" label="Camera barcode scan screen visual reference" />
          <PhoneMockup kind="notFound" label="Product not found fallback screen visual reference" />
          <PhoneMockup kind="check" label="CHECK result screen visual reference" />
        </div>
      </section>
      <section className="section-shell flow-grid">
        <FlowCard title="Barcode flow" items={['Scan barcode', 'Product data', 'Rule engine', 'PASS / CHECK / AVOID']} />
        <FlowCard title="Fallback flow" items={['Product not found', 'Scan label', 'Conservative result']} />
      </section>
      <section className="section-shell profile-band">
        <div>
          <p className="eyebrow">Profile stays focused.</p>
          <h2>Only the restrictions needed for product checks.</h2>
          <p>
            BiteOrNot keeps the profile practical: selected restrictions, local preferences,
            and the scan flow. No meal diary. No coaching layer.
          </p>
          <ButtonLink href="/privacy" variant="secondary" navigate={navigate}>
            Read privacy details
          </ButtonLink>
        </div>
        <div className="profile-visuals">
          <PhoneMockup kind="profile" label="Profile modal screen visual reference" />
          <PhoneMockup kind="history" label="Recent local scan history screen visual reference" />
        </div>
      </section>
    </>
  );
}

function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Use BiteOrNot free. Upgrade when you check often."
        body="The core product decision flow is available without an account."
      />
      <section className="section-shell pricing-grid">
        <PricingCard
          title="Free"
          price="$0"
          bullets={[
            '1 active restriction at a time',
            '15 scans per day',
            'Barcode scan included',
            'Label scan fallback included',
            'PASS / CHECK / AVOID included',
            'No account required',
          ]}
          cta="Available at launch"
        />
        <PricingCard
          featured
          title="Pro"
          badge="Best for multiple restrictions"
          price="$4.99 / month"
          secondaryPrice="$39.99 / year"
          highlight="Check all your restrictions at once."
          bullets={[
            'Multiple active restrictions',
            'Combine allergies, diets and health conditions',
            'Unlimited scans',
            'Saved combined profile',
            'Built for people who check products often',
          ]}
          cta="Available in app after launch"
        />
      </section>
      <p id="google-play-link-needed" className="pricing-note section-shell">
        Subscriptions will be handled through Google Play when the app is available. Prices may vary by region.
      </p>
    </>
  );
}

function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Clear answers before you scan."
        body="BiteOrNot is focused on fast product decisions, not health scoring or diet coaching."
      />
      <section className="section-shell faq-list">
        {faqItems.map((item) => (
          <FAQItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </section>
    </>
  );
}

function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" effectiveDate="Effective date: May 26, 2026">
      <p>
        BiteOrNot helps users check whether a food product matches their selected restrictions,
        such as diet preferences, allergies, or selected health-related conditions. BiteOrNot is
        not medical advice and does not diagnose, treat, or prevent any disease.
      </p>
      <h2>Information stored on your device</h2>
      <p>
        BiteOrNot stores your selected profile locally on your device. This may include selected
        allergies, diet preferences, and selected conditions such as diabetes, hypertension,
        cardiovascular concerns, or high cholesterol.
      </p>
      <p>
        BiteOrNot may also store local scan history on your device, including product name,
        barcode, product image URL, nutrition values, result, and result reasons.
      </p>
      <p>
        This data is stored locally on your device and is not linked to an account. BiteOrNot does
        not require login.
      </p>
      <h2>Barcode scans</h2>
      <p>
        When you scan a barcode, BiteOrNot sends the barcode to Open Food Facts to look up product
        information.
      </p>
      <p>
        Open Food Facts may return product name, brand, quantity, product image, nutrition values,
        ingredients, allergens, traces, and similar product label data.
      </p>
      <h2>Label scans and OCR/AI processing</h2>
      <p>
        If a product is not found or product data is incomplete, you may scan the product label.
      </p>
      <p>
        When you use label scan, the captured label image is sent to BiteOrNot backend services for
        OCR and AI extraction. The backend may use Google Cloud/Firebase services, Google Vision
        OCR, and Google Gemini to extract and normalize product label information such as
        ingredients, allergens, traces, nutrition values, and product name candidates.
      </p>
      <p>
        AI is used only to extract and normalize label information. AI does not decide whether a
        product is PASS, CHECK, or AVOID. The final result is determined by BiteOrNot’s
        deterministic rule engine.
      </p>
      <h2>Temporary backend cache</h2>
      <p>
        To prevent duplicate processing, duplicate charges, repeated OCR/AI requests, and abuse,
        BiteOrNot may temporarily cache OCR/AI extraction responses on the backend.
      </p>
      <p>
        This cache may include extracted OCR text and normalized label data, but not the raw label
        image or image base64 payload.
      </p>
      <p>The cache is configured to expire after approximately 7 days.</p>
      <h2>Abuse prevention and security</h2>
      <p>
        BiteOrNot uses Firebase App Check / Google Play Integrity and backend rate limits to
        protect the service from abuse.
      </p>
      <p>
        The backend may process technical request metadata such as an anonymous install identifier,
        idempotency key, request type, hashed IP-based rate-limit signal, timestamps, response
        status, and usage counters.
      </p>
      <p>
        Raw IP addresses are not intentionally stored in BiteOrNot application data. IP-related
        rate-limit data is stored only as a hash.
      </p>
      <h2>Analytics and technical events</h2>
      <p>BiteOrNot may use anonymous technical events, such as:</p>
      <ul>
        <li>product found or not found</li>
        <li>OCR or AI fallback used</li>
        <li>parser unclear</li>
        <li>result shown</li>
        <li>backend usage counters</li>
      </ul>
      <p>
        These events are used to improve reliability, detect abuse, and control backend cost. They
        are not used for advertising or user tracking.
      </p>
      <h2>What BiteOrNot does not do</h2>
      <p>BiteOrNot does not:</p>
      <ul>
        <li>require an account for the core scan flow</li>
        <li>sell personal data</li>
        <li>use scanned products for advertising profiles</li>
        <li>use AI to make the final PASS/CHECK/AVOID decision</li>
        <li>intentionally store raw label images permanently</li>
        <li>intentionally store API keys, tokens, raw images, or health/profile details in production logs</li>
      </ul>
      <h2>Data sharing</h2>
      <p>
        BiteOrNot may share limited data with service providers only when needed to operate the
        app:
      </p>
      <ul>
        <li>Open Food Facts: barcode lookup and public product data</li>
        <li>Google Cloud / Firebase: backend hosting, App Check, Firestore, logging, security, and rate limiting</li>
        <li>Google Vision OCR and Google Gemini: OCR and label data extraction/normalization</li>
      </ul>
      <p>
        These services process data according to their own terms and privacy policies.
      </p>
      <h2>Local data deletion</h2>
      <p>You can delete local app data by clearing the app data from Android settings or uninstalling the app.</p>
      <p>
        If BiteOrNot provides in-app history deletion, deleting history removes local scan history
        from your device.
      </p>
      <h2>Children</h2>
      <p>
        BiteOrNot is not intended for children under the age required by applicable law to use
        such apps without parental consent.
      </p>
      <h2>Medical disclaimer</h2>
      <p>
        BiteOrNot is not medical advice. Results are based on product label data, public product
        databases, OCR/AI extraction, and your selected restrictions.
      </p>
      <p>
        Product data may be missing, incomplete, outdated, unclear, or incorrectly scanned. When
        data is missing or unclear, BiteOrNot is designed to return CHECK rather than a false PASS.
      </p>
      <p>
        Always read the product label yourself, especially if you have allergies or medical dietary
        restrictions. Consult a qualified professional for medical advice.
      </p>
      <h2>Contact</h2>
      <p>For privacy questions, contact:</p>
      <p>contact@biteornot.com</p>
    </LegalPageLayout>
  );
}

function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" effectiveDate="Effective date: To be added">
      <h2>1. What BiteOrNot does</h2>
      <p>
        BiteOrNot helps users check food products against selected restrictions and returns
        PASS, CHECK, or AVOID.
      </p>
      <h2>2. Not medical advice</h2>
      <p>
        BiteOrNot is not medical advice. It does not diagnose, treat, prevent, or cure any
        condition. Users should consult qualified professionals for medical or dietary decisions.
      </p>
      <h2>3. Always check the product label</h2>
      <p>
        Product data, barcode databases, OCR, and AI extraction can be incomplete or incorrect.
        Users are responsible for checking the physical product label, especially for allergies or
        health-related restrictions.
      </p>
      <h2>4. Meaning of results</h2>
      <p>PASS means no issue was found in the available data.</p>
      <p>CHECK means the data is missing, unclear, incomplete, or needs closer review.</p>
      <p>AVOID means the product appears to conflict with the selected restriction.</p>
      <h2>5. No guaranteed accuracy</h2>
      <p>
        BiteOrNot is designed to be conservative, but it cannot guarantee perfect accuracy.
        Product formulations, labels, and databases can change.
      </p>
      <h2>6. Subscriptions</h2>
      <p>Pro features may be offered through Google Play subscriptions.</p>
      <p>Monthly price: $4.99</p>
      <p>Annual price: $39.99</p>
      <p>
        Billing, cancellation, refunds, and subscription management are handled by Google Play
        according to Google Play policies.
      </p>
      <h2>7. Acceptable use</h2>
      <p>
        Users must not misuse the app, attempt to reverse engineer protected services, overload
        APIs, bypass limits, or use the app for unlawful purposes.
      </p>
      <h2>8. Limitation of liability</h2>
      <p>
        BiteOrNot is provided as-is. To the maximum extent allowed by law, the app provider is
        not liable for damages resulting from reliance on product data, scanned labels, or app
        results.
      </p>
      <h2>9. Changes</h2>
      <p>
        The terms may be updated before or after launch. Continued use means acceptance of the
        updated terms.
      </p>
      <h2>10. Contact</h2>
      <p>contact@biteornot.com</p>
    </LegalPageLayout>
  );
}

function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="page-hero section-shell">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </section>
  );
}

function ResultBadge({ kind }: { kind: ResultKind }) {
  const copy = resultCopy[kind];
  return (
    <article className={`result-card ${kind}`}>
      <div className="result-mark">{copy.symbol}</div>
      <h3>{copy.title}</h3>
      <p>{copy.detail}</p>
    </article>
  );
}

function FeatureCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <article className="feature-card">
      <img src={icon} alt="" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

function PricingCard({
  title,
  badge,
  price,
  secondaryPrice,
  highlight,
  bullets,
  cta,
  featured = false,
}: {
  title: string;
  badge?: string;
  price: string;
  secondaryPrice?: string;
  highlight?: string;
  bullets: string[];
  cta: string;
  featured?: boolean;
}) {
  return (
    <article className={`pricing-card ${featured ? 'featured' : ''}`}>
      <div>
        <p className="plan-label">{title}</p>
        {badge ? <p className="plan-badge">{badge}</p> : null}
        {secondaryPrice ? (
          <div className="price-options">
            <div className="price-option">
              <p className="price">{price}</p>
              <span>Monthly plan</span>
            </div>
            <div className="price-option">
              <p className="price">{secondaryPrice}</p>
              <span>Annual plan</span>
            </div>
          </div>
        ) : (
          <p className="price">{price}</p>
        )}
        {highlight ? <p className="highlight">{highlight}</p> : null}
      </div>
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <a className="button primary" {...storeLinkProps()}>
        {cta}
      </a>
    </article>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <article className="faq-item">
      <h2>{question}</h2>
      <p>{answer}</p>
    </article>
  );
}

function LegalPageLayout({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <section className="legal-shell">
      <div className="legal-card">
        <p className="eyebrow">BiteOrNot</p>
        <h1>{title}</h1>
        <p className="effective-date">{effectiveDate}</p>
        <div className="legal-content">{children}</div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="step-item">
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </article>
  );
}

function FlowCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="flow-card">
      <h2>{title}</h2>
      <div className="flow-items">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  );
}

function PhoneMockup({ kind, label }: { kind: PhoneKind; label: string }) {
  return (
    <figure className={`phone-mockup ${kind}`}>
      <div className="phone-screen">
        <img src={screenshots[kind]} alt={label} loading="lazy" />
      </div>
    </figure>
  );
}
