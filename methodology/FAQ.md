# SPAR FAQ
## Frequently Asked Questions

---

## Getting Started

### **Q: What's the difference between SPAR and just "asking for multiple perspectives"?**

**A:** When you ask an AI (or people) for "multiple perspectives," they typically provide variations on a theme — different angles that all share the same underlying assumptions. This creates the *appearance* of diversity without genuine disagreement.

SPAR is different because personas have **coherent, conflicting worldviews**. They don't just "have different perspectives" — they genuinely disagree about what matters, what's risky, and what's possible. The friction between these worldviews is where insight emerges.

---

### **Q: Do I need AI to use SPAR?**

**A:** No. SPAR has five modes (STASH):

- **Solo Human** — You role-play different personas yourself
- **Team Human** — Team members each adopt assigned personas
- **AI-Persona** — Multiple AI instances argue with each other
- **Solo AI** — One AI role-plays all personas
- **Hybrid** — Mix of AI and human participants

The methodology works in all modes. AI just makes it faster and more convenient.

---

### **Q: How long should a SPAR session be?**

**A:** It depends on the tier:

| Tier | Duration | Best For |
|------|----------|----------|
| **Tier 1 (Lite)** | 2-5 minutes | Quick habit-building |
| **Tier 2 (Practice)** | 30+ minutes | Strategic decisions |
| **Tier 3 (Mastery)** | Extended | Facilitation, teaching |

The **Minimum Viable Debate (MVD)** is 30 minutes with 4 personas — this captures 80% of the value.

---

### **Q: What if the personas agree too much?**

**A:** This is a sign your personas don't have genuinely conflicting worldviews. Check:

1. **Do they have different fundamental fears?** A Risk Analyst who fears loss and a Growth Strategist who fears missed opportunity will naturally clash.

2. **Did you select from different archetypes?** Picking all PROTECTOR personas will produce agreement. Mix archetypes (PROTECTOR + EXPLORER + STRATEGIST).

3. **Are you using the Genuine Tension Test?** Before starting, ask "On what core belief do these personas genuinely disagree?" If you can't answer, redesign the panel.

---

## Process

### **Q: How do I know when the debate is "done"?**

**A:** The debate is done when:

1. **Something surprised you** — If nothing unexpected emerged, keep going
2. **Tensions have been named** — You can articulate where positions genuinely conflict
3. **A synthesis has been stress-tested** — The Interrogate step challenges the synthesis
4. **Actionable recommendations exist** — You know what to do next

A common mistake is stopping after Round 1 (opening positions). The value comes from the clash in Round 2+.

---

### **Q: What if I disagree with the synthesis?**

**A:** Good! The synthesis is **input to your decision**, not the decision itself.

The final decision authority always remains with you. SPAR surfaces perspectives and tensions. You weigh them based on factors the debate might not know (political context, personal values, insider information).

If you disagree with the synthesis, articulate why. That articulation is often the real insight.

---

### **Q: Can I do SPAR alone without AI?**

**A:** Yes — this is **Solo Human Mode**. It's actually the most transformative mode because it builds *your* capacity for perspective-taking, rather than outsourcing it.

The practice:
1. Choose 3-4 personas with conflicting worldviews
2. Physically move or change context between personas (different chair, different pen color)
3. Argue each position as if it were your genuine view
4. Synthesize after all personas have spoken

It's slower but builds lasting cognitive capacity.

---

## Technical

### **Q: Which AI models work best with SPAR?**

**A:** Any capable instruction-following model works. Tested successfully:

| Provider | Models |
|----------|--------|
| **Ollama (Local)** | DeepSeek-R1, Qwen2.5, Mistral, Llama3 |
| **OpenAI** | GPT-4, GPT-4o |
| **Anthropic** | Claude 3, Claude 3.5 |
| **Google** | Gemini Pro, Gemini Ultra |

For local/private decisions, **Ollama with DeepSeek-R1** is recommended.

---

### **Q: How do I set up SPAR with my company's private data?**

**A:** SPAR-Kit supports local-first operation:

1. Install Ollama with a local model
2. Configure `~/.spar/config.json` to use Ollama
3. Run debates entirely on your hardware

No data leaves your environment. See [Local LLM Setup](https://github.com/synthanai/spar-kit#local-llm-setup).

---

### **Q: Can SPAR integrate with Slack/Notion/other tools?**

**A:** Not yet natively, but planned. Current options:

1. Copy/paste from SPAR-Kit CLI into your tools
2. Export debates as Markdown and import to Notion
3. Use the web playground and share URLs

SDK for programmatic integration is on the roadmap.

---

## Philosophical

### **Q: Isn't SPAR just "Devil's Advocate" with extra steps?**

**A:** Devil's Advocate is one pattern (attacking a position). SPAR is a full system:

- **Multiple genuine perspectives**, not just opposition
- **Structured protocol** (7 steps), not ad-hoc challenge
- **Coherent personas** with consistent worldviews, not isolated objections
- **Synthesis**, not just critique

Devil's Advocate is useful but limited. SPAR creates a complete decision-stress-testing environment.

---

### **Q: What if SPAR makes me more indecisive?**

**A:** Valid concern. Safeguards:

1. **Time-box the debate** — SPAR has defined end points (Transmit step)
2. **Extract specific recommendations** — The output isn't "more things to worry about" but "what to do and why"
3. **Acknowledge irreducible uncertainty** — Some decisions will always be uncertain. SPAR helps you see the uncertainty clearly, not eliminate it

If SPAR consistently leads to paralysis, you may be using it for decisions that don't need it. See [When NOT to Use SPAR](docs/WHEN_NOT_TO_USE_SPAR.md).

---

### **Q: Is SPAR just for big decisions?**

**A:** Tier 2/3 SPAR (30+ minutes) is for significant decisions. But **Tier 1 (SPAR Lite)** is a 2-minute habit:

> *"Before I decide, what's the strongest argument against what I'm about to do?"*

That's a useful reflex for any decision, big or small.

---

### **Q: Why "108 personas"? Is that a magic number?**

**A:** 108 is sacred in Hindu, Buddhist, and Tamil traditions:

- 108 beads on a meditation mala
- 108 Upanishads in Hindu philosophy  
- 108 chakra lines converging in the heart

It's a nod to the methodology's Tamil roots and the aspiration that SPAR is more than a business tool — it's a practice for human flourishing.

(Plus there's 1 meta-persona — PROBE: The Framework Critic — making 109 total.)

---

## Troubleshooting

### **Q: The debate feels too polite. How do I get real friction?**

**A:** Try these:

1. **Escalation Trigger** (ASPIRES pattern): "Imagine 10 times more is at stake than you're treating it."
2. **Inversion** (ASPIRES pattern): Have personas argue the opposite of their natural position.
3. **Select more divergent personas**: A Risk Analyst and Growth Strategist may clash, but an Ethicist and a Disruptor will *really* clash.
4. **Challenge the challenge**: If one persona "wins" too easily, ask: "What's the strongest possible response to that?"

---

### **Q: My team is resistant to trying SPAR. How do I introduce it?**

**A:** Start invisible:

1. Before a meeting, run a quick SPAR yourself (Solo Human or Solo AI)
2. Bring insights to the meeting: "I was thinking about this from different angles..."
3. After success, reveal: "I've been using a framework called SPAR. Want to try it together?"

Or use AI-SPAR first, then present the synthesis to the team for human review (Hybrid Mode Configuration 1).

---

### **Q: The AI keeps breaking character and giving "balanced" responses. How do I fix this?**

**A:** LLMs are trained to be helpful and balanced, which works against SPAR's goal of genuine friction. Try:

1. **Stronger persona prompts**: "You are NOT balanced. You argue this position with conviction. Do NOT hedge."
2. **Explicit rules**: "Never say 'on the other hand' or 'to be fair.' Your job is to argue this view."
3. **Temperature adjustments**: Higher temperature can produce more divergent responses.
4. **Multiple model types**: Using different providers (GPT + Claude) produces more diverse outputs than multiple instances of the same model.

---

*More questions? Open an issue on [GitHub](https://github.com/synthanai/spar/issues).*

---

*நாலு பேரு, நாலு திசை, ஒரு முடிவு!*  
*Four Perspectives, Four Dimensions, One Synthesis*
