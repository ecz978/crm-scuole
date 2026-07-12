import type { MethodologyContent } from "./types";

const content: MethodologyContent = [
  {
    heading: "Overview",
    body: "CogniMetric measures six cognitive domains — logical, numerical, verbal and spatial reasoning, working memory, and processing speed — through original items, most of them algorithmically generated for each attempt. Responses are combined into a difficulty-weighted ability estimate per domain, using a one-parameter logistic (Rasch-style) model, and converted to a standardized score with a mean of 100 and a standard deviation of 15, the same scale convention used by most published intelligence tests.",
  },
  {
    heading: "The six domains",
    body: "Logical reasoning uses abstract pattern-completion sequences built from shapes whose rotation, count and fill vary according to one or more concurrent rules.\n\nNumerical reasoning uses number sequences governed by arithmetic, geometric, alternating, quadratic or Fibonacci-like rules.\n\nVerbal reasoning uses analogies and odd-one-out items drawn from a curated, language-specific bank, since verbal relationships don't translate directly between languages.\n\nSpatial reasoning uses mental-rotation items built from chiral (asymmetric) polyomino shapes, with mirror-image foils as the classic distractor.\n\nWorking memory uses a digit-span task with increasing sequence length across trials.\n\nProcessing speed uses rapid same/different symbol-matching trials under a fixed time budget.",
  },
  {
    heading: "Item generation and difficulty",
    body: "Most items are generated on demand from a per-attempt random seed rather than drawn from a fixed, reusable pool. This limits memorization effects across repeated attempts and lets us scale item variety without manually authoring thousands of items.\n\nEach item carries a difficulty parameter assigned by design — for example, the number of simultaneously varying rules in a logical item, the rotation angle in a spatial item, or the sequence length in a memory trial — rather than one estimated empirically from a large pretesting sample. This is an important distinction from professionally normed instruments, and is disclosed here in full transparency.",
  },
  {
    heading: "Scoring model",
    body: "For logical, numerical, verbal, spatial and memory items, we estimate your ability (theta) with a one-parameter logistic model: P(correct) = 1 / (1 + e^-(theta − b)), where b is the item's difficulty. Theta is estimated via a short Newton-Raphson maximum-likelihood procedure and converted to a standard score as 100 + 15 × theta.\n\nYour composite score averages the theta estimates across all six domains before conversion, and your percentile is derived from the standard normal cumulative distribution function applied to that average.",
  },
  {
    heading: "Processing speed scoring",
    body: "The processing-speed domain measures throughput under time pressure rather than item difficulty (every trial is, by design, of similar low difficulty), so it is scored differently: net correct responses (correct minus incorrect) are standardized against a reference mean and standard deviation that we defined ourselves, not one derived from a clinical norming sample. This is disclosed explicitly because it materially affects how that sub-score should be interpreted.",
  },
  {
    heading: "Reliability checks",
    body: "Each report includes a basic reliability flag. If more than 30% of your choice-item responses were given in under 900 milliseconds — far faster than genuine reading and reasoning typically allow — your report is flagged accordingly, since such patterns often indicate rushed or inattentive responding rather than a true ability estimate.",
  },
  {
    heading: "What this test is — and is not",
    body: "CogniMetric is a self-administered, self-calibrated instrument. It has not been validated against established, professionally normed batteries (such as the Wechsler scales or Raven's Progressive Matrices), and it has not undergone published reliability or validity studies on a representative population sample.\n\nFor this reason, your score should be treated as an informational, recreational estimate — not a clinical, diagnostic or legally admissible measurement. It must not be used as the basis for educational placement, employment, clinical or legal decisions. If you need a validated assessment for any of those purposes, consult a licensed psychologist.",
  },
  {
    heading: "Data and item security",
    body: "Item content and correct answers are generated deterministically from a seed stored with your attempt, and are recomputed server-side at submission time to grade your responses. This means the answer key is never sent to your browser and item content doesn't need to be permanently stored — only your seed, your answers and your response times are.",
  },
];

export default content;
