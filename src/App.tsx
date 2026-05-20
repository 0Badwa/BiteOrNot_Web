import { useEffect, useMemo, useState, type ReactNode } from 'react';

type Route = '/' | '/how-it-works' | '/pricing' | '/faq' | '/privacy' | '/terms';
type ResultKind = 'pass' | 'check' | 'avoid';
type PhoneKind = ResultKind | 'notFound' | 'camera' | 'profile' | 'history';

const navItems: Array<{ label: string; href: Route }> = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

const routeTitles: Record<Route, string> = {
  '/': 'BiteOrNot — Scan food products before you eat',
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
        className="wordmark"
        onClick={(event) => {
          event.preventDefault();
          handleNavigate('/');
        }}
        aria-label="BiteOrNot home"
      >
        BiteOrNot
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
        <a className="header-cta" href="#google-play-placeholder">
          Coming soon on Google Play
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
          <a className="header-cta" href="#google-play-placeholder" onClick={() => setIsOpen(false)}>
            Coming soon on Google Play
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
          BiteOrNot
        </a>
        <p>One fast product decision. Scan. Decide. Done.</p>
      </div>
      <div className="footer-links">
        <FooterLink href="/" label="Home" navigate={navigate} />
        {navItems.map((item) => (
          <FooterLink key={item.href} href={item.href} label={item.label} navigate={navigate} />
        ))}
      </div>
      <p className="footer-contact">Contact: biteornot.contact@gmail.com</p>
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

function HomePage({ navigate }: { navigate: (href: Route) => void }) {
  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">One fast product decision.</p>
          <h1>One fast answer before you eat.</h1>
          <p className="hero-subtitle">
            Scan a barcode and get a simple PASS, CHECK or AVOID based on your selected
            restrictions.
          </p>
          <div className="button-row">
            <ButtonLink href="/how-it-works" navigate={navigate}>
              See how it works
            </ButtonLink>
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
          <PhoneMockup kind="notFound" label="Product not found fallback screen visual reference" />
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
        <div className="phone-pair">
          <PhoneMockup kind="camera" label="Camera barcode scan screen visual reference" />
          <PhoneMockup kind="notFound" label="Product not found fallback screen visual reference" />
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
        <PhoneMockup kind="profile" label="Profile modal screen visual reference" />
      </section>
    </>
  );
}

function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Start free. Upgrade when you check often."
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
          cta="Start free"
        />
        <PricingCard
          featured
          title="Pro"
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
          cta="Coming soon"
        />
      </section>
      <p id="google-play-placeholder" className="pricing-note section-shell">
        Subscriptions will be handled through Google Play when available. Prices may vary by
        region.
      </p>
    </>
  );
}

function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Clear answers before launch."
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
    <LegalPageLayout title="Privacy Policy" effectiveDate="Effective date: To be added before launch">
      <p>BiteOrNot is designed to work without a mandatory account.</p>
      <h2>Information stored on your device</h2>
      <ul>
        <li>selected profile restrictions such as conditions, diets, allergens, or ingredients to avoid</li>
        <li>recent local scan history, if enabled</li>
        <li>local app preferences</li>
      </ul>
      <p>This information is used to check products against your selected restrictions.</p>
      <h2>Camera</h2>
      <p>
        BiteOrNot uses the camera to scan barcodes and product labels. Camera access is
        required for scanning.
      </p>
      <h2>Product data</h2>
      <p>
        When you scan a barcode, the app may request product data from Open Food Facts or
        another product data source. The barcode is used to look up the product.
      </p>
      <h2>Label scan fallback</h2>
      <p>
        If barcode data is missing or incomplete, the app may process captured label text or
        label images to extract ingredients, allergens, traces, and nutrition values. If AI
        extraction is used, label images or text may be sent to an external processing service
        through the app’s backend or API provider.
      </p>
      <h2>No mandatory account</h2>
      <p>BiteOrNot does not require users to create an account for the core scan flow.</p>
      <h2>Analytics and technical events</h2>
      <p>The app may collect limited anonymous technical events to improve reliability, such as:</p>
      <ul>
        <li>product found</li>
        <li>product not found</li>
        <li>product data error</li>
        <li>label fallback used</li>
        <li>parser unclear</li>
        <li>result shown</li>
      </ul>
      <p>
        These events should not include raw label images, raw label text, personal identity, or
        detailed health profile data.
      </p>
      <h2>Important</h2>
      <p>
        Results depend on available product data or scanned label text. Product data may be
        incomplete, outdated, or incorrect. Scanned label text may be imperfect. When data is
        missing or unclear, BiteOrNot is designed to show CHECK.
      </p>
      <h2>Contact</h2>
      {/* TODO: Replace contact email before production if needed. */}
      <p>biteornot.contact@gmail.com</p>
    </LegalPageLayout>
  );
}

function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" effectiveDate="Effective date: To be added before launch">
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
      <p>biteornot.contact@gmail.com</p>
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
  price,
  secondaryPrice,
  highlight,
  bullets,
  cta,
  featured = false,
}: {
  title: string;
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
        <p className="price">{price}</p>
        {secondaryPrice ? <p className="secondary-price">{secondaryPrice}</p> : null}
        {highlight ? <p className="highlight">{highlight}</p> : null}
      </div>
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <button className="button primary" type="button">
        {cta}
      </button>
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
    <figure className={`phone-mockup ${kind}`} role="img" aria-label={label}>
      <div className="phone-screen">
        <PhoneContent kind={kind} />
      </div>
    </figure>
  );
}

function PhoneContent({ kind }: { kind: PhoneKind }) {
  if (kind === 'notFound') {
    return (
      <div className="screen not-found-screen">
        <p className="screen-wordmark">BiteOrNot</p>
        <div className="barcode-illustration">?</div>
        <h3>Product not found</h3>
        <p>This barcode isn’t in the database.</p>
        <ScreenStep number="1" title="Scan the ingredients or nutrition label" />
        <ScreenStep number="2" title="Get a conservative result" />
        <div className="screen-button">Scan product label</div>
        <BottomNav />
      </div>
    );
  }

  if (kind === 'camera') {
    return (
      <div className="screen camera-screen">
        <div className="camera-actions">
          <span />
          <span />
        </div>
        <h3>Scan a barcode</h3>
        <div className="scan-frame">
          <span />
        </div>
      </div>
    );
  }

  if (kind === 'profile') {
    return (
      <div className="screen profile-screen">
        <div className="modal-card">
          <h3>Profile</h3>
          <MiniGroup title="Conditions" items={['Diabetes', 'Hypertension', 'Cardiovascular']} checked />
          <MiniGroup title="Diet" items={['Vegetarian', 'Vegan']} />
          <MiniGroup title="Allergens" items={['Milk', 'Lactose', 'Egg']} />
          <p className="profile-note">Your profile is used only to check products against your selected restrictions.</p>
          <div className="done-button">Done</div>
        </div>
      </div>
    );
  }

  if (kind === 'history') {
    return (
      <div className="screen history-screen">
        <h3>History</h3>
        <p>Recent local scans</p>
        {['Roasted Cashew-Peanut-Mix', 'Elephant Squeezed Pretzels', 'Scanned label', 'Plazma'].map(
          (item) => (
            <div className="history-row" key={item}>
              <span />
              <strong>{item}</strong>
              <small>20.05.2026</small>
            </div>
          ),
        )}
        <div className="done-button">Done</div>
      </div>
    );
  }

  const copy = resultCopy[kind];
  const product =
    kind === 'avoid' ? 'Roasted Cashew-Peanut-Mix H.' : 'Elephant Squeezed Pretzels.';
  const reason = kind === 'pass' ? 'No issues found' : kind === 'check' ? 'High carbohydrates' : 'High sugar';

  return (
    <div className={`screen result-screen ${kind}`}>
      <div className="product-glow" />
      <div className="product-thumb" />
      <h3>{product}</h3>
      <p>Alka · 80 g</p>
      <div className="result-circle">
        <span>{copy.symbol}</span>
        <strong>{copy.title}</strong>
        <small>{kind === 'pass' ? 'No restrictions selected' : kind === 'check' ? 'Needs a closer look' : 'Doesn’t match your profile'}</small>
      </div>
      <div className="nutrition-row">
        <NutritionItem label="Fat / Saturated" value={kind === 'avoid' ? '32.4/5.6g' : '13/1.5g'} />
        <NutritionItem label="Sugar" value={kind === 'avoid' ? '35.5g' : '5.6g'} />
        <NutritionItem label="Salt" value={kind === 'pass' ? '6g' : '0.8g'} />
      </div>
      <div className="reason-box">
        <strong>Why this result</strong>
        <span>{reason}</span>
      </div>
      <BottomNav />
    </div>
  );
}

function ScreenStep({ number, title }: { number: string; title: string }) {
  return (
    <div className="screen-step">
      <span>{number}</span>
      <strong>{title}</strong>
    </div>
  );
}

function NutritionItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>/ 100g</small>
    </div>
  );
}

function BottomNav() {
  return (
    <div className="bottom-nav">
      <span>History</span>
      <img src="/assets/app-icons/scan_button.png" alt="" aria-hidden="true" />
      <span>Profile</span>
    </div>
  );
}

function MiniGroup({ title, items, checked = false }: { title: string; items: string[]; checked?: boolean }) {
  return (
    <div className="mini-group">
      <h4>{title}</h4>
      {items.map((item, index) => (
        <p key={item}>
          <span className={checked && index === 0 ? 'checked' : ''} />
          {item}
        </p>
      ))}
    </div>
  );
}
