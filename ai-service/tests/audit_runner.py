import sys
import os
import json

# Ensure ai-service is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

KNOWLEDGE_PAYLOAD = {
    "guidelines": [
        {"id": "GUIDE-001", "title": "Approved Product Name Spelling", "text": "The preferred and legally registered product name is 'FreshPlus'. Never separate the words or substitute '+' for 'Plus'.", "category": "Brand Terminology", "severity": "high"},
        {"id": "GUIDE-002", "title": "Prohibition of Unsupported Health Claims", "text": "Do not use unsupported health benefit claims. All statements asserting curative, medicinal, disease prevention, or instant stamina outcomes are strictly prohibited unless substantiated by an approved clinical fact in the brand repository.", "category": "Unsupported Claim", "severity": "high"},
        {"id": "GUIDE-003", "title": "Promotional Superlatives and Market Dominance Claims", "text": "Promotional superlatives such as 'India\'s No. 1', 'Best in the world', or market leadership claims require documented, verified evidence in the brand repository before publication under ASCI Clause I.4.", "category": "Promotional Claim", "severity": "medium"},
        {"id": "GUIDE-004", "title": "Brand Tone: Professional, Friendly, and Informative", "text": "Maintain a clean, premium, and trustworthy editorial voice. Avoid multiple exclamation marks (e.g. 'Buy now!!!'), aggressive commercial urgency, and threatening phrasing (e.g. 'Drink daily or get sick!').", "category": "Brand Tone", "severity": "advisory"},
        {"id": "GUIDE-005", "title": "Mandatory FSSAI Compliance and Packaging Disclaimers", "text": "Every promotional asset presenting nutritional benefits or packaging copy must incorporate official FSSAI licensing and reference packaging standards.", "category": "Regulatory Compliance", "severity": "medium"},
        {"id": "GUIDE-006", "title": "Comparative Nutritional Claims", "text": "Comparative claims must satisfy FSSAI Regulation 5(4) with at least 30% difference for macronutrients/energy and at least 10% RDA difference for micronutrients against verified baselines.", "category": "Unsupported Claim", "severity": "high"},
        {"id": "GUIDE-007", "title": "Sustainable Packaging and Recyclability", "text": "Promote sustainable packaging accurately. All bottles must reference 100% food-grade recycled rPET and recyclability.", "category": "Messaging Consistency", "severity": "medium"},
        {"id": "GUIDE-008", "title": "Influencer and Digital Creator Advertising Disclosures", "text": "All digital influencer collaborations, sponsored videos, and promotional reels must carry clear, upfront, and prominent disclosure tags (#ad, #collab, #sponsored) per ASCI Digital Media Guidelines and CCPA Guideline 12.", "category": "Influencer Marketing", "severity": "high"},
        {"id": "REG-FSSAI-001", "title": "FSSAI Disease Risk Reduction & Curative Claims Prohibition", "text": "FSSAI Regulations 7 & 10(1) and Schedule III prohibit food advertisements from claiming that a food cures, treats, or alleviates human disease or disorders without statutory approval.", "category": "Unsupported Claim", "severity": "high"},
        {"id": "REG-FSSAI-002", "title": "FSSAI Conditions for 'Fresh', 'Natural', and 'Pure' Descriptions", "text": "Food Safety and Standards (Advertising and Claims) Regulations, 2018 — Regulation 9(2) and Schedule V govern the use of 'Fresh', 'Natural', and 'Pure'. 'Fresh' is restricted to raw, unprocessed food or food minimally processed without thermal shelf-life extension. Thermally pasteurized juice cannot claim 'Fresh juice' unless qualified as 'pasteurized'.", "category": "Regulatory Compliance", "severity": "high"},
        {"id": "REG-FSSAI-003", "title": "FSSAI Sugar-Free Thresholds & Non-Addition of Sugars Requirements", "text": "FSSAI Regulation 5(3) & Schedule I restrict 'Sugar-Free' to <= 0.5g total sugars per 100g/ml. Under Regulation 6(1), 'No Added Sugar' claims require meeting all 5 conditions: (1) no sugars added, (2) no sugar ingredients, (3) no sugar substitutes, (4) no enzymatic sugar increase, and (5) mandatory 'CONTAINS NATURALLY OCCURRING SUGARS' declaration.", "category": "Brand Terminology", "severity": "high"},
        {"id": "REG-FSSAI-004", "title": "FSSAI Comparative Nutrition Claims & Disclaimer Legibility Standards", "text": "FSSAI Regulation 5(4), 5(5), 4(7), 4(8), and 4(14) regulate nutrient comparative claims and conspicuous disclaimer legibility.", "category": "Brand Tone", "severity": "medium"},
        {"id": "REG-ASCI-001", "title": "ASCI Code for Honest Representations & Superlative Claims", "text": "ASCI Code Clauses 1.1 and 1.4: Advertisements must be truthful, must not mislead by implication or exaggeration, and superlatives must be substantiated by capable evidence.", "category": "Promotional Claim", "severity": "medium"},
        {"id": "REG-ASCI-002", "title": "ASCI Guidelines for Influencer Advertising in Digital Media", "text": "ASCI Influencer Guidelines: Requires clear, upfront, and prominent disclosures (#ad, #sponsored) on all commercial influencer promotions across digital platforms.", "category": "Influencer Marketing", "severity": "high"},
        {"id": "REG-CCPA-001", "title": "CCPA Misleading Advertisements & Professional Endorsements", "text": "Consumer Protection Act, 2019 Section 18 & CCPA Guidelines 2022 Guideline 4: Prohibits misleading advertisements and unsubstantiated professional medical endorsements.", "category": "Promotional Claim", "severity": "high"},
        {"id": "REG-CCPA-002", "title": "CCPA Disclaimers, Substantiation Duties & Material Connection", "text": "CCPA Guidelines 2022 Guidelines 11, 12, 14: Mandates conspicuous disclaimers, factual substantiation duties, and upfront disclosure of material connections in endorsements.", "category": "Regulatory Compliance", "severity": "medium"}
    ],
    "terminology": [
        {"id": "TERM-001", "preferred_term": "FreshPlus", "prohibited_terms": ["Fresh+", "Fresh Plus", "Freshplus"], "explanation": "The approved, legally protected brand name is 'FreshPlus' in single-word CamelCase.", "severity": "high", "case_sensitive": True},
        {"id": "TERM-002", "preferred_term": "100% Pure Pasteurized Fruit Juice", "prohibited_terms": ["Orange Soda", "Synthetic Orange", "Fruit Concentrate Drink", "Orange Squash"], "explanation": "Do not classify our pure juices as soda, concentrate, or synthetic squash.", "severity": "high", "case_sensitive": False},
        {"id": "TERM-003", "preferred_term": "Zero Added Cane Sugar", "prohibited_terms": ["100% Sugar Free", "Sugar Free Juice", "Sugar-Free Juice", "Sugar Free", "Sugar-Free"], "explanation": "Natural fruit juice contains naturally occurring fruit sugars exceeding 0.5g/100ml. Use 'Zero Added Cane Sugar'.", "severity": "high", "case_sensitive": False},
        {"id": "TERM-004", "preferred_term": "Natural Cold-Pasteurization", "prohibited_terms": ["Chemical Treatment", "Preservative Sterilization", "Boiled Fruit Juice"], "explanation": "Refer to our gentle thermal process accurately.", "severity": "medium", "case_sensitive": False},
        {"id": "TERM-005", "preferred_term": "100% Recyclable Food-Grade rPET", "prohibited_terms": ["Single-Use Plastic", "Virgin Plastic Packaging", "Disposable Plastic Bottle"], "explanation": "Highlight our circular economy packaging standard accurately.", "severity": "medium", "case_sensitive": False}
    ],
    "facts": [
        {"id": "FACT-001", "statement": "FreshPlus Valencia Orange juice contains 100% pure pasteurized fruit juice with zero added refined cane sugars or synthetic preservatives.", "source": "Internal Lab Formulation Spec #FP-SPEC-2025-01", "category": "Ingredients"},
        {"id": "FACT-002", "statement": "FreshPlus Orange Juice delivers 24mg of natural Vitamin C per 100ml serving, satisfying 60% of daily recommended nutritional intake under Indian ICMR standards.", "source": "Internal Nutritional Quality Profile #FP-NUTR-2025-02", "category": "Nutrition"},
        {"id": "FACT-003", "statement": "FreshPlus bottles are crafted from 100% recycled food-grade rPET and are fully recyclable across India.", "source": "Packaging Sustainability Specification #FP-PKG-2025-03", "category": "Packaging"},
        {"id": "FACT-004", "statement": "FreshPlus Crisp Himalayan Apple juice contains 100% pure apple juice with natural pectin and zero synthetic preservatives.", "source": "Internal Orchard Batch Specification #FP-APL-2025-04", "category": "Ingredients"},
        {"id": "FACT-005", "statement": "Cold-pasteurization occurs at 72°C for 15 seconds to eliminate harmful microbes while preserving delicate natural fruit aroma and vitamins.", "source": "Thermal Processing SOP #FP-SOP-2025-05", "category": "Operations"},
        {"id": "FACT-006", "statement": "FreshPlus Alphonso Mango Nectar contains 40% authentic fruit pulp with authentic Alphonso mango aroma, with no synthetic yellow dyes.", "source": "Mango Pulp Standard Formulation #FP-MNG-2025-06", "category": "Ingredients"}
    ]
}

DEMO_SUBMISSIONS = [
    {
        "id": "demo-submission-1",
        "title": "Summer Launch Campaign - Social Teaser",
        "content_type": "Social Media Post",
        "text": "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!"
    },
    {
        "id": "demo-submission-2",
        "title": "Valencia Orange - Morning Energy Ad Copy",
        "content_type": "Advertising Copy",
        "text": "Drink FreshPlus every morning for guaranteed 100% natural energy. The best juice in India to power through workdays."
    },
    {
        "id": "demo-submission-3",
        "title": "Pure Valencia Orange - Retail Pack Description",
        "content_type": "Packaging Description",
        "text": "FreshPlus 100% Pure Pasteurized Orange Juice contains zero added sugar and delivers 24mg of natural Vitamin C per 100ml. Bottled in 100% recyclable rPET."
    },
    {
        "id": "demo-submission-4",
        "title": "Fitness Creator Reel Caption - Mango Nectar",
        "content_type": "Influencer Promotion",
        "text": "My secret post-workout drink is FreshPlus Alphonso Mango Nectar! Gives you miraculous stamina recovery after heavy gym sessions."
    },
    {
        "id": "demo-submission-5",
        "title": "Crisp Himalayan Apple Juice - E-Commerce Landing Copy",
        "content_type": "Website Product Page",
        "text": "FreshPlus Crisp Himalayan Apple Juice is pressed from handpicked apples with no added sugar or artificial preservatives. Each 200ml bottle delivers crisp, refreshing hydration."
    },
    {
        "id": "demo-submission-6",
        "title": "Mega Supermarket Display - Monsoon Health Banner",
        "content_type": "Promotional Banner",
        "text": "Fresh Plus completely prevents seasonal viral flu and cold! 100% Sugar Free guarantee. Drink daily or get sick!"
    },
    {
        "id": "demo-submission-7",
        "title": "Sustainability Spotlight - Monthly Customer Newsletter",
        "content_type": "Email Campaign",
        "text": "At FreshPlus Global, our commitment to nature goes beyond pure fruit. Every bottle is crafted with 100% food-grade recycled rPET, reducing virgin plastic consumption across India."
    },
    {
        "id": "demo-submission-8",
        "title": "Twitter / X Product Announcement - Guava Glow",
        "content_type": "Social Media Post",
        "text": "Say hello to FreshPlus Guava Glow! Packed with natural Vitamin C to give you an extraordinary immunity shield."
    },
    {
        "id": "demo-submission-9",
        "title": "Yoga Instructor Routine - Instagram Story Copy",
        "content_type": "Influencer Promotion",
        "text": "#ad Morning mindfulness paired with FreshPlus Valencia Orange Juice. Zero added cane sugar, pure cold-pasteurized fruit freshness to start your routine."
    },
    {
        "id": "demo-submission-10",
        "title": "Metro Station Billboard - Quick Breakfast Copy",
        "content_type": "Advertising Copy",
        "text": "Late for office? Fresh+ is the #1 choice of doctors for instant vitality on the go."
    },
    {
        "id": "demo-submission-11",
        "title": "Alphonso Mango Nectar - Nutritional Breakdown Page",
        "content_type": "Website Product Page",
        "text": "FreshPlus Alphonso Mango Nectar is made from pulp-rich Indian Alphonso mangoes. FSSAI License: 10019022009841. Delivers authentic tropical taste with no synthetic colors."
    },
    {
        "id": "demo-submission-12",
        "title": "E-Commerce Summer Header Banner",
        "content_type": "Promotional Banner",
        "text": "Beat the summer heat with FreshPlus 100% Pure Pasteurized Fruit Juices. Naturally refreshing citrus hydration."
    },
    {
        "id": "demo-submission-13",
        "title": "Corporate Wellness Partnership Email Pitch",
        "content_type": "Email Campaign",
        "text": "Replace coffee machines with Fresh Plus. 100% guaranteed to eliminate afternoon workplace fatigue permanently."
    },
    {
        "id": "demo-submission-14",
        "title": "World Environment Day Celebration Post",
        "content_type": "Social Media Post",
        "text": "Happy World Environment Day from FreshPlus! Join our circular economy journey: every FreshPlus bottle is 100% recyclable rPET. Enjoy freshness, recycle responsibly."
    }
]

print("Running audit on 14 demo submissions...")
results = []
for sub in DEMO_SUBMISSIONS:
    payload = {
        "content_id": sub["id"],
        "version_number": 1,
        "submitted_text": sub["text"],
        "content_type": sub["content_type"],
        "knowledge": KNOWLEDGE_PAYLOAD
    }
    resp = client.post("/v1/review", json=payload)
    if resp.status_code == 200:
        data = resp.json()
        results.append({
            "id": sub["id"],
            "title": sub["title"],
            "text": sub["text"],
            "score": data["governance_score"],
            "findings_count": len(data["findings"]),
            "findings": data["findings"]
        })
    else:
        print(f"FAILED on {sub['id']}: {resp.status_code} {resp.text}")

print(f"Completed audit on {len(results)} demo submissions.")
with open("ai_audit_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("Saved ai_audit_results.json successfully.")
