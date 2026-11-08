const {
  isSuggestionSafe,
  validateFindingSuggestions,
  runLocalFallbackReview
} = require('../services/aiService');

describe('AI Review Engine - Suggested Correction Quality & Evidence Compliance', () => {
  describe('Regression: Problem 1 & Problem 2 Validation', () => {
    test('Problem 1: rejects "supports daily refreshment and natural vitality" due to ungrounded vitality claim', () => {
      const result = isSuggestionSafe('supports daily refreshment and natural vitality');
      expect(result).toBe(false);
    });

    test('Problem 2: rejects "one of India\'s most loved fruit juices" due to unsupported popularity/consensus claim', () => {
      const result = isSuggestionSafe("one of India's most loved fruit juices");
      expect(result).toBe(false);
    });

    test('rejects other unapproved curative and stamina claims', () => {
      expect(isSuggestionSafe('cures fatigue instantly')).toBe(false);
      expect(isSuggestionSafe('boosts your immunity by 300%')).toBe(false);
      expect(isSuggestionSafe('miracle cure for tiredness')).toBe(false);
      expect(isSuggestionSafe('provides instant stamina')).toBe(false);
    });

    test('rejects other unapproved rankings and superlatives', () => {
      expect(isSuggestionSafe("India's beloved beverage")).toBe(false);
      expect(isSuggestionSafe("India's No. 1 fruit juice")).toBe(false);
      expect(isSuggestionSafe("world's best orange juice")).toBe(false);
      expect(isSuggestionSafe("market leader in juices")).toBe(false);
      expect(isSuggestionSafe("guaranteed results in 7 days")).toBe(false);
    });

    test('rejects prohibited brand terms while permitting approved brand name FreshPlus', () => {
      expect(isSuggestionSafe('Drink Fresh+ every morning')).toBe(false);
      expect(isSuggestionSafe('Try Fresh Plus today')).toBe(false);
      expect(isSuggestionSafe('FreshPlus')).toBe(true);
      expect(isSuggestionSafe('Experience FreshPlus today.')).toBe(true);
    });

    test('approves safe neutral promotional rewrites and neutral refreshment wording', () => {
      expect(isSuggestionSafe('a refreshing fruit juice')).toBe(true);
      expect(isSuggestionSafe('delivers daily refreshment')).toBe(true);
      expect(isSuggestionSafe('crafted from 100% pure fruit juice')).toBe(true);
    });

    test('rejects "Human review required" string so it is not treated as an acceptable automated rewrite', () => {
      expect(isSuggestionSafe('Human review required')).toBe(false);
    });
  });

  describe('Finding Validation and Preservation', () => {
    test('replaces unsafe suggested rewrites with "Human review required" while strictly preserving finding details', () => {
      const findings = [
        {
          category: 'Unsupported Claim',
          severity: 'high',
          excerpt: 'cures fatigue instantly',
          reason: 'Health claim without clinical proof',
          evidence_status: 'unsupported',
          source_ids: ['GUIDE-002'],
          source_excerpt: 'Do not use unsupported health benefit claims.',
          suggested_rewrite: 'supports daily refreshment and natural vitality'
        },
        {
          category: 'Promotional Claim',
          severity: 'medium',
          excerpt: "India's No. 1",
          reason: 'Superlative claim without market share proof',
          evidence_status: 'unsupported',
          source_ids: ['GUIDE-003'],
          source_excerpt: 'Promotional superlatives require verified documentation.',
          suggested_rewrite: "one of India's most loved fruit juices"
        },
        {
          category: 'Brand Terminology',
          severity: 'high',
          excerpt: 'Fresh+',
          reason: 'Prohibited symbol spelling',
          evidence_status: 'contradicted',
          source_ids: ['TERM-001'],
          source_excerpt: 'Preferred product name is FreshPlus.',
          suggested_rewrite: 'FreshPlus'
        }
      ];

      const validated = validateFindingSuggestions(findings);

      expect(validated).toHaveLength(3);

      // Problem 1: natural vitality replaced with 'Human review required'
      expect(validated[0].suggested_rewrite).toBe('Human review required');
      expect(validated[0].category).toBe('Unsupported Claim');
      expect(validated[0].severity).toBe('high');
      expect(validated[0].excerpt).toBe('cures fatigue instantly');
      expect(validated[0].evidence_status).toBe('unsupported');
      expect(validated[0].source_ids).toEqual(['GUIDE-002']);

      // Problem 2: most loved replaced with 'Human review required'
      expect(validated[1].suggested_rewrite).toBe('Human review required');
      expect(validated[1].category).toBe('Promotional Claim');
      expect(validated[1].severity).toBe('medium');
      expect(validated[1].excerpt).toBe("India's No. 1");
      expect(validated[1].evidence_status).toBe('unsupported');
      expect(validated[1].source_ids).toEqual(['GUIDE-003']);

      // Valid Terminology rewrite preserved intact
      expect(validated[2].suggested_rewrite).toBe('FreshPlus');
      expect(validated[2].category).toBe('Brand Terminology');
      expect(validated[2].severity).toBe('high');
    });
  });

  describe('Local Fallback Review Engine Output Safety', () => {
    test('generates compliant suggested rewrites without replacing one unsupported claim with another', () => {
      const sampleText = "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!";
      const terminology = [
        {
          terminologyId: 'TERM-001',
          preferredTerm: 'FreshPlus',
          prohibitedTerms: ['Fresh+', 'Fresh Plus'],
          explanation: 'Use CamelCase FreshPlus.',
          severity: 'high'
        }
      ];
      const guidelines = [
        { guidelineId: 'GUIDE-001', description: 'Product name is FreshPlus' },
        { guidelineId: 'GUIDE-002', description: 'No unsupported health benefit claims.' },
        { guidelineId: 'GUIDE-003', description: 'Promotional superlatives require verification.' },
        { guidelineId: 'GUIDE-004', description: 'Professional, friendly brand tone.' }
      ];
      const facts = [
        { factId: 'FACT-001', statement: 'Contains 100% pasteurized orange juice.' }
      ];

      const result = runLocalFallbackReview(sampleText, terminology, guidelines, facts);

      expect(result.findings.length).toBeGreaterThanOrEqual(3);

      // Verify health finding
      const healthFinding = result.findings.find(f => f.excerpt.toLowerCase().includes('fatigue'));
      expect(healthFinding).toBeDefined();
      expect(healthFinding.suggested_rewrite).not.toMatch(/vitality|stamina|cure/i);
      expect(healthFinding.suggested_rewrite).toBe('delivers daily refreshment');

      // Verify superlative finding
      const supFinding = result.findings.find(f => f.excerpt.toLowerCase().includes('no. 1') || f.excerpt.toLowerCase().includes('no 1'));
      expect(supFinding).toBeDefined();
      expect(supFinding.suggested_rewrite).not.toMatch(/most loved|beloved|#1|no\.?\s*1/i);
      expect(supFinding.suggested_rewrite).toBe('a refreshing fruit juice');

      // Verify terminology finding
      const termFinding = result.findings.find(f => f.excerpt === 'Fresh+');
      expect(termFinding).toBeDefined();
      expect(termFinding.suggested_rewrite).toBe('FreshPlus');
    });
  });
});
