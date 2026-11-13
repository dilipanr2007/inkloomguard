import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Layers,
  LayoutDashboard,
  FileText,
  PlusCircle,
  BookOpen,
  BarChart3,
  History,
  Users2,
  Compass,
  Check,
  Info
} from 'lucide-react';

const TOUR_STEPS = [
  {
    id: 'welcome',
    target: null,
    title: 'Welcome to InkloomGuard',
    subtitle: 'Enterprise AI Brand Governance & Compliance Platform',
    roleTag: 'All Roles',
    content: (
      <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-sans">
        <p>
          <strong>InkloomGuard</strong> is an enterprise-grade, source-grounded Brand Governance Review Engine.
          It prevents misleading claims, brand dilution, and statutory violations before marketing copy is published.
        </p>
        <div className="p-3 bg-brand-50/70 border border-brand-200/80 rounded-lg space-y-1.5">
          <p className="font-semibold text-brand-900 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>The Human-in-the-Loop AI Paradigm:</span>
          </p>
          <p className="text-brand-800">
            AI provides instant rule checks, exact regulatory citations, and evidence-safe corrections.
            <strong> Human reviewers and managers retain final publication authority.</strong>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2 rounded bg-slate-100/80 border border-slate-200 text-center">
            <span className="block font-bold text-blue-700">Creator</span>
            <span className="text-[10px] text-slate-500">Drafts & auto-scans</span>
          </div>
          <div className="p-2 rounded bg-slate-100/80 border border-slate-200 text-center">
            <span className="block font-bold text-emerald-700">Reviewer</span>
            <span className="text-[10px] text-slate-500">Audits & approves</span>
          </div>
          <div className="p-2 rounded bg-slate-100/80 border border-slate-200 text-center">
            <span className="block font-bold text-purple-700">Manager</span>
            <span className="text-[10px] text-slate-500">Curates rules & analytics</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'brand-workspace',
    target: '[data-tour="brand-workspace"]',
    title: 'Brand Workspace & Scope',
    subtitle: 'FreshPlus Global (Fictional FMCG Beverage Enterprise)',
    roleTag: 'Organization Scope',
    content: (
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          Every submission is evaluated against <strong>FreshPlus Global</strong>'s authoritative knowledge base.
          The company produces 100% pure pasteurized fruit juices with strict natural ingredient standards.
        </p>
        <p className="text-slate-500 text-[11px]">
          Demo data is safely isolated within this evaluation workspace and never alters real production datasets.
        </p>
      </div>
    )
  },
  {
    id: 'dashboard',
    target: '[data-tour="kpi-grid"]',
    title: 'Executive Governance Dashboard',
    subtitle: 'Real-Time Brand Health Index & KPI Telemetry',
    roleTag: 'All Roles',
    content: (
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          Monitor organization-wide compliance with dynamic KPIs: <strong>Total Submissions</strong>, <strong>Pending Review</strong>, <strong>Approved for Publishing</strong>, and the aggregated <strong>Average Governance Score</strong>.
        </p>
        <p className="text-slate-500 text-[11px]">
          These cards reflect real-time telemetry from all submitted marketing assets across active brand campaigns.
        </p>
      </div>
    )
  },
  {
    id: 'submissions',
    target: '[data-tour="submissions-table"]',
    title: 'Content Submissions & Review Queue',
    subtitle: 'Multi-Channel Asset Compliance Lifecycle',
    roleTag: 'Creator & Reviewer',
    content: (
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          Track pre-publication assets across social media, advertising billboards, retail packaging, influencer sponsorships, e-commerce landing pages, and newsletters.
        </p>
        <p className="text-slate-500 text-[11px]">
          Filter and inspect submissions by review status: <code>Approved</code>, <code>In Review</code>, <code>AI Reviewed</code>, <code>Changes Requested</code>, and <code>Rejected</code>.
        </p>
      </div>
    )
  },
  {
    id: 'submit-content',
    target: '[data-tour="action-submit"], [data-tour="nav-submit"]',
    title: 'Submit Content Studio',
    subtitle: 'Creator Pre-Flight Compliance Workflow',
    roleTag: 'Creator & Manager',
    content: (
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          Creators submit copy, pick campaign channels, and run immediate AI scans before submitting to human legal review.
        </p>
        <p className="text-slate-500 text-[11px]">
          The review studio highlights exact violation substrings, displays contradictory source evidence, and offers one-click safe corrections.
        </p>
      </div>
    )
  },
  {
    id: 'knowledge-base',
    target: '[data-tour="nav-knowledge"]',
    title: 'Brand & Regulatory Knowledge Library',
    subtitle: 'Traceable Ground Truth: FSSAI, ASCI, CCPA & Brand Rules',
    roleTag: 'Manager Curated',
    content: (
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          The source of truth for the AI retrieval engine. Contains:
        </p>
        <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
          <li><strong>Official Regulations:</strong> Verifiable FSSAI advertising clauses, ASCI influencer rules, and CCPA standards.</li>
          <li><strong>Approved Product Facts:</strong> Verified lab-certified Vitamin C metrics, pure pasteurization facts, and 100% rPET packaging.</li>
          <li><strong>Brand Terminology:</strong> Strict enforcement of <code>FreshPlus</code> spelling and prohibition of synthetic beverage terms.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'analytics',
    target: '[data-tour="nav-analytics"], [data-tour="nav-audit"]',
    title: 'Governance Analytics & Audit Trail',
    subtitle: 'Violation Distributions & Regulatory Traceability',
    roleTag: 'Reviewer & Manager',
    content: (
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          Identify recurring brand risks through visual charts: violations by category, severity breakdowns, frequently triggered rules, and human reviewer dismissal reasons.
        </p>
        <p className="text-slate-500 text-[11px]">
          The <strong>Audit Trail</strong> records every AI completion, reviewer comment, and manager sign-off into an immutable log.
        </p>
      </div>
    )
  },
  {
    id: 'role-switcher',
    target: '[data-tour="role-switcher"]',
    title: 'Multi-Role Perspective Switcher',
    subtitle: 'Experience All Three Role Perspectives in 1 Click',
    roleTag: 'Role Governance',
    content: (
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
        <p>
          You can seamlessly switch between roles at any time using the top bar:
        </p>
        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-blue-600 w-16">Creator:</span>
            <span className="text-slate-600">Submit copy and test auto-governance suggestions.</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-emerald-600 w-16">Reviewer:</span>
            <span className="text-slate-600">Inspect cited rules, accept/dismiss findings, sign off.</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-purple-600 w-16">Manager:</span>
            <span className="text-slate-600">Configure guidelines and monitor quality metrics.</span>
          </div>
        </div>
      </div>
    )
  }
];

export default function GuidedTour() {
  const { user, tourOpen, startTour, closeTour, updateOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const cardRef = useRef(null);

  // When tour opens (including Replay Tour), always start from step 1
  useEffect(() => {
    if (tourOpen) {
      setCurrentStep(0);
    }
  }, [tourOpen]);

  // Check if tour should auto-launch on first visit
  useEffect(() => {
    if (!user) return;
    const localStatus = localStorage.getItem('inkloom_onboarding_status');
    const isCompleted = user?.onboarding?.completed || (localStatus && JSON.parse(localStatus)?.completed);
    const isSkipped = user?.onboarding?.skipped || (localStatus && JSON.parse(localStatus)?.skipped);

    if (!isCompleted && !isSkipped && !tourOpen) {
      startTour();
    }
  }, [user]);

  // Update target element coordinates
  const updateTargetRect = useCallback(() => {
    if (!tourOpen) return;
    const step = TOUR_STEPS[currentStep];
    if (!step || !step.target) {
      setTargetRect(null);
      return;
    }

    const selectors = step.target.split(',').map((s) => s.trim());
    let foundEl = null;
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) {
        foundEl = el;
        break;
      }
    }

    if (foundEl) {
      const rect = foundEl.getBoundingClientRect();
      // Ensure target has non-zero size before spotlighting
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
        return;
      }
    }
    // Target is missing or unavailable: gracefully fallback to centered modal
    setTargetRect(null);
  }, [tourOpen, currentStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [updateTargetRect]);

  if (!tourOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    updateOnboarding({ completed: false, skipped: true, version: 1 });
    closeTour();
  };

  const handleFinish = () => {
    updateOnboarding({ completed: true, skipped: false, version: 1 });
    closeTour();
    setCurrentStep(0);
  };

  // Calculate smart responsive card placement so it never covers the spotlight target
  const getCardPositionStyle = () => {
    if (typeof window === 'undefined') return {};
    const vpWidth = window.innerWidth;
    const vpHeight = window.innerHeight;
    const cardWidth = Math.min(480, vpWidth - 32);
    const cardHeight = cardRef.current?.offsetHeight || 380;
    const padding = 16;

    // Mobile / Tablet small screens: dock at bottom or top
    if (vpWidth < 640) {
      if (!targetRect) return {};
      if (targetRect.top < vpHeight / 2) {
        return {
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          maxWidth: 'calc(100vw - 32px)',
          margin: '0 auto'
        };
      } else {
        return {
          position: 'fixed',
          top: '16px',
          left: '16px',
          right: '16px',
          maxWidth: 'calc(100vw - 32px)',
          margin: '0 auto'
        };
      }
    }

    // Centered when no target or target unavailable
    if (!targetRect) {
      return {};
    }

    // 1. Sidebar target: left < 300px
    if (targetRect.left < 300 && targetRect.width < 320) {
      const left = targetRect.left + targetRect.width + padding;
      const top = Math.max(padding, Math.min(targetRect.top, vpHeight - cardHeight - padding));
      return {
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        maxWidth: `${cardWidth}px`
      };
    }

    // 2. Top bar target: top < 120px
    if (targetRect.top < 120) {
      const top = targetRect.top + targetRect.height + padding;
      let left = targetRect.left + (targetRect.width / 2) - (cardWidth / 2);
      left = Math.max(padding, Math.min(left, vpWidth - cardWidth - padding));
      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${cardWidth}px`
      };
    }

    // 3. Wide main area elements (KPI grid, Submissions table)
    const spaceBelow = vpHeight - (targetRect.top + targetRect.height);
    const spaceAbove = targetRect.top;

    if (spaceBelow >= cardHeight + padding) {
      const top = targetRect.top + targetRect.height + padding;
      let left = targetRect.left + (targetRect.width / 2) - (cardWidth / 2);
      left = Math.max(padding, Math.min(left, vpWidth - cardWidth - padding));
      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${cardWidth}px`
      };
    } else if (spaceAbove >= cardHeight + padding) {
      const top = targetRect.top - cardHeight - padding;
      let left = targetRect.left + (targetRect.width / 2) - (cardWidth / 2);
      left = Math.max(padding, Math.min(left, vpWidth - cardWidth - padding));
      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${cardWidth}px`
      };
    }

    return {};
  };

  const cardStyle = getCardPositionStyle();
  const isCentered = !targetRect || Object.keys(cardStyle).length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
      {/* SVG Spotlight Cutout Backdrop with Rounded Corners */}
      {targetRect ? (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 ease-in-out"
          style={{ width: '100vw', height: '100vh' }}
        >
          <defs>
            <mask id="tour-spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={Math.max(0, targetRect.left - 6)}
                y={Math.max(0, targetRect.top - 6)}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="14"
                ry="14"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.72)"
            mask="url(#tour-spotlight-mask)"
            className="transition-all duration-300 pointer-events-auto"
            onClick={handleSkip}
          />
        </svg>
      ) : (
        <div
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xs transition-opacity duration-300"
          onClick={handleSkip}
        />
      )}

      {/* Subtle Glowing Border around Highlighted Target Element */}
      {targetRect && (
        <div
          className="absolute rounded-2xl border-2 border-brand-400 ring-4 ring-brand-400/25 shadow-[0_0_24px_rgba(59,130,246,0.4)] pointer-events-none transition-all duration-300 ease-in-out"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`
          }}
        />
      )}

      {/* Tour Dialog Card Wrapper */}
      <div
        className={
          isCentered
            ? 'absolute inset-0 flex items-center justify-center p-4 pointer-events-none'
            : 'pointer-events-none'
        }
      >
        <div
          ref={cardRef}
          style={cardStyle}
          className="relative bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-6 text-slate-900 pointer-events-auto animate-in fade-in zoom-in-95 duration-200 transition-all"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-brand-100 text-brand-700">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  {step.roleTag}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </span>
                {!targetRect && currentStep > 0 && (
                  <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                    <Info className="w-3 h-3 text-amber-600" />
                    <span>Overview</span>
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">{step.title}</h2>
              <p className="text-[11px] text-slate-500 font-medium">{step.subtitle}</p>
            </div>

            <button
              onClick={handleSkip}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-4">{step.content}</div>

          {/* Progress Indicators */}
          <div className="flex items-center space-x-1.5 pb-4 pt-1">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-7 bg-brand-600'
                    : idx < currentStep
                    ? 'w-2 bg-brand-300'
                    : 'w-2 bg-slate-200'
                }`}
                title={`Step ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={handleSkip}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors px-2 py-1.5"
            >
              Skip Tour
            </button>

            <div className="flex items-center space-x-2">
              {!isFirst && (
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-xs transition-colors"
              >
                <span>{isFirst ? 'Start Guided Tour' : isLast ? 'Finish Tour' : 'Next'}</span>
                {isLast ? <Check className="w-3.5 h-3.5 ml-1" /> : <ArrowRight className="w-3.5 h-3.5 ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
