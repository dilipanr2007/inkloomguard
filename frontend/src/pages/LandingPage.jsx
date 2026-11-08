import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Scale,
  Users2,
  Lock,
  ArrowRight,
  BookOpen,
  Sparkles,
  GitBranch,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center font-medium border-b border-slate-800">
        <span>CodeNexus India 2026 Hackathon Entry • Source-Grounded Brand Governance • Domain: </span>
        <a href="https://inkloomguard.xyz" className="text-brand-400 font-semibold underline hover:text-brand-300 ml-1">
          inkloomguard.xyz
        </a>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Inkloom AI by InkloomGuard</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Grounded Brand Governance for the <span className="text-brand-600">AI-Generated Content</span> Era
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ensure every piece of marketing content strictly follows approved brand guidelines, preferred terminology, and verified factual claims before publication.
          </p>

          <div className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            <strong>Core Principle:</strong> AI assists the decision. Humans retain final approval authority.
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-md transition-all"
            >
              <span>Explore Platform & Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 border border-slate-300 transition-all"
            >
              How It Works
            </a>
          </div>

          {/* Key Metric Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200 pt-10">
            <div>
              <p className="text-2xl font-bold text-slate-900">0%</p>
              <p className="text-xs text-slate-500 mt-1">Hallucinated Citations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 mt-1">Grounded in Knowledge</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">3 Roles</p>
              <p className="text-xs text-slate-500 mt-1">Creator • Reviewer • Manager</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Human</p>
              <p className="text-xs text-slate-500 mt-1">Final Approval Sign-Off</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-brand-600 tracking-wider">The Challenge & The Remedy</h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">Why Generic Grammar Checkers Fail Brands</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-4">
              <div className="inline-flex p-2.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">The Problem: Unchecked Content Proliferation</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Employees, regional teams, and generative AI produce inconsistent messaging and unverified claims.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Brand guidelines sit in static PDF files that nobody reads or searches.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Curative or superlative statements (e.g. "Cures fatigue", "India's No. 1") invite legal and regulatory liabilities.</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-4">
              <div className="inline-flex p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">The Solution: Inkloom AI Source-Grounded Governance</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Dynamic Vector RAG retrieval matches submissions against active guidelines and verified facts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Deterministic terminology enforcement catches prohibited trademark variations immediately.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Every finding cites an exact source ID and excerpt, distinguishing unsupported from contradicted claims.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-brand-600 tracking-wider">Explainable Architecture</h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">How Inkloom AI Governs Content</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Knowledge Base</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Brand guidelines, prohibited terminology, and approved clinical facts are centrally indexed in vector memory.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Hybrid AI Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic regex rules catch brand terms instantly, while Gemini evaluates tone, messaging, and claim validity.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">Evidence Grounding</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every highlighted issue cites its exact source ID, explains the violation, and suggests an intent-preserving rewrite.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base">Human Sign-Off</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Creators accept, edit, or dismiss findings. Designated human reviewers retain the sole authority to approve for publication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Workflow Breakdown */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold text-brand-600 tracking-wider">Tailored SaaS Experience</h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">Unified Application with Role-Based Access</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Creator Role
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-2">Draft, Review & Revise</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit marketing copy, review AI highlights, accept suggestions, dismiss with written reasons, and submit revised versions (v1 → v2).
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                Reviewer Role
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-2">Audit, Comment & Approve</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect AI findings and cited evidence, collaborate with comments, request changes, and grant official human publication approval.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <span className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                Manager Role
              </span>
              <h4 className="font-bold text-slate-900 text-base mt-2">Govern, Calibrate & Monitor</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage brand guidelines, update preferred terms, audit user permissions, and track governance analytics across campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <span className="text-white font-bold text-sm">InkloomGuard</span>
            <span>• Inkloom AI Platform</span>
          </div>

          <p>© 2026 Inkloom AI. CodeNexus India 2026 Hackathon Round 2 Implementation.</p>

          <div className="flex items-center space-x-4">
            <a href="https://inkloomguard.xyz" className="hover:text-white transition-colors">
              inkloomguard.xyz
            </a>
            <Link to="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
