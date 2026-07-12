import type { BlogContent } from "./types";

const content: BlogContent = [
  {
    slug: "interpreting-your-score",
    title: "How to interpret your CogniMetric score",
    excerpt:
      "Your composite score isn't a fixed label — here's what the numbers on your CogniMetric report actually mean, and what they don't.",
    publishedAt: "2026-06-02",
    paragraphs: [
      "If you just finished a CogniMetric test, you're looking at a composite score built around a mean of 100 and a standard deviation of 15 — the same convention used by most published cognitive-ability scales. A score of 100 sits exactly at the middle of the reference distribution; a score of 115 sits one standard deviation above it, and so on.",
      "The percentile figure next to your composite score answers a more intuitive question: out of everyone in the reference distribution, what fraction scored lower than you? A percentile of 84 means your composite estimate places you above roughly 84% of that distribution — not that you answered 84% of items correctly.",
      "It's worth repeating what the disclaimer on your report already says: this reference distribution is a mathematical construct based on our own item-difficulty design, not an empirical sample of thousands of real test-takers. Professionally normed instruments spend years collecting representative samples across age, education and geography before publishing norms. CogniMetric doesn't have that behind it, and we think you deserve to know that plainly.",
      "That doesn't make the number meaningless — the underlying Rasch-style estimation is a legitimate, widely used psychometric technique, and your six domain scores do reflect genuine differences in how you performed across logical, numerical, verbal, spatial, memory and speed items. It just means the number is best read as a structured, self-referential estimate of your performance on this specific instrument, not a certified IQ score.",
      "A few practical notes: performance can shift meaningfully with sleep, stress, time of day, and simple practice with the item formats — which is exactly why we suggest waiting a few months between retakes rather than treating small day-to-day fluctuations as real change. And if a single domain score looks like an outlier compared to the rest of your profile, it's often more informative to think about what happened in that specific section than to read too much into the number alone.",
    ],
  },
  {
    slug: "fluid-vs-crystallized-intelligence",
    title: "Fluid vs. crystallized intelligence: what your six domain scores really mean",
    excerpt:
      "Why CogniMetric doesn't give you one number, but six — and how logical, numerical, verbal, spatial, memory and speed scores map onto a much older idea in psychology.",
    publishedAt: "2026-06-16",
    paragraphs: [
      "Long before adaptive online tests existed, psychologists Raymond Cattell and John Horn proposed splitting intelligence into two broad categories: fluid intelligence — the ability to reason and solve novel problems without relying on prior knowledge — and crystallized intelligence — the accumulated knowledge and verbal skill you've built up over a lifetime. John Carroll later folded both into a broader three-stratum model that still underpins most modern cognitive test batteries.",
      "CogniMetric's logical, numerical and spatial domains lean heavily on fluid reasoning: none of them require specialized vocabulary or cultural knowledge, just the ability to spot a rule in an unfamiliar pattern and apply it. Our verbal domain, by contrast, leans on crystallized ability — it depends directly on the vocabulary and relationships you've already learned in your language, which is also why we couldn't simply translate the same items across five languages and had to write a separate, language-specific bank for each.",
      "Working memory and processing speed sit slightly apart from the fluid/crystallized split. Working memory — your ability to hold and manipulate a handful of items in mind briefly, tested here with a digit-span task — is often treated as a foundational resource that both fluid and crystallized performance draw on. Processing speed, tested with rapid symbol-matching, captures something more basic still: how quickly you can execute simple perceptual decisions under time pressure, independent of how hard the decision itself is.",
      "Seeing your results broken down this way is more useful than a single composite number, because real cognitive profiles are rarely flat. It's common to be notably stronger in fluid, pattern-based reasoning than in working-memory span, or vice versa — and that kind of unevenness is exactly what a single overall score would hide.",
      "None of this turns CogniMetric into a diagnostic instrument — see our Methodology page for the important limitations — but the fluid/crystallized framework is a genuinely useful lens for making sense of why your six domain scores don't always move together.",
    ],
  },
];

export default content;
