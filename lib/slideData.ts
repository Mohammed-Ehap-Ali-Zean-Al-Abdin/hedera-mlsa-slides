export interface SlideDefinition {
  index: number;
  session: 1 | 2;
  title: string;
  subtitle: string;
  bullets?: string[];
}

export const slides: SlideDefinition[] = [
  // SESSION 1: Foundations
  { index: 0, session: 1, title: "Web3 Foundations", subtitle: "Beyond the Buzzwords" },
  { 
    index: 1, 
    session: 1, 
    title: "Web 1.0", 
    subtitle: "Read-Only. Information consumption.",
    bullets: [
      "The early internet (1990s - early 2000s).",
      "Characterized by static HTML pages.",
      "Users were solely consumers of information.",
      "Data was hosted on centralized, dedicated servers.",
      "No interactive applications or user-generated content."
    ]
  },
  { 
    index: 2, 
    session: 1, 
    title: "Web 2.0", 
    subtitle: "Read & Write. User-generated content.",
    bullets: [
      "The current internet era (mid 2000s - present).",
      "Rise of social media, blogs, and interactive web apps.",
      "Users create and share content dynamically.",
      "Dominated by a few massive tech corporations.",
      "Services are 'free' in exchange for user data harvesting."
    ]
  },
  { 
    index: 3, 
    session: 1, 
    title: "The Issue", 
    subtitle: "Single Points of Failure & Loss of Control.",
    bullets: [
      "Centralized servers are vulnerable to hacks and outages.",
      "Corporations can arbitrarily deplatform users or censor content.",
      "Users do not truly own their digital assets or identity.",
      "Data silos prevent interoperability between applications.",
      "Misaligned incentives: corporate profit over user privacy."
    ]
  },
  { index: 4, session: 1, title: "Web 3.0", subtitle: "Read, Write, & Own. Cryptographic control." },
  { index: 5, session: 1, title: "Architecture", subtitle: "Eliminating the single point of failure." },
  { index: 6, session: 1, title: "DLT", subtitle: "Append-only ledger. Syncing data across nodes." },
  { index: 7, session: 1, title: "Cryptographic Hashing", subtitle: "Creating unique digital fingerprints." },
  { index: 8, session: 1, title: "Provenance", subtitle: "Knowing exactly who sent the data." },
  { index: 9, session: 1, title: "Enterprise", subtitle: "End-to-end authentic tracking." },
  { 
    index: 10, 
    session: 1, 
    title: "DIDs", 
    subtitle: "Self-sovereign digital identity.",
    bullets: [
      "Decentralized Identifiers (DIDs) replace usernames and passwords.",
      "You hold the cryptographic keys to your identity.",
      "No central authority (like Google or Facebook) can revoke it.",
      "Enables privacy-preserving authentication.",
      "The foundation of the new Web3 trust layer."
    ]
  },
  { index: 11, session: 1, title: "VCs", subtitle: "Tamper-proof academic & professional degrees." },

  // SESSION 2: Hedera Deep Dive
  { index: 12, session: 2, title: "Deep Dive into Hedera", subtitle: "The Trust Layer." },
  { index: 13, session: 2, title: "The Trilemma", subtitle: "Speed, Security, Decentralization." },
  { index: 14, session: 2, title: "PoW", subtitle: "Highly secure, but massive energy consumption." },
  { index: 15, session: 2, title: "PoS", subtitle: "Energy efficient, but scaling bottlenecks." },
  { index: 16, session: 2, title: "Directed Acyclic Graph", subtitle: "Breaking the blockchain structure." },
  { index: 17, session: 2, title: "Gossip about Gossip", subtitle: "Information spreads exponentially." },
  { index: 18, session: 2, title: "Virtual Voting", subtitle: "Consensus mathematically, without bandwidth-heavy voting." },
  { index: 19, session: 2, title: "aBFT Security", subtitle: "Asynchronous Byzantine Fault Tolerance." },
  { index: 20, session: 2, title: "HCS", subtitle: "Decentralized event logs and timestamps." },
  { index: 21, session: 2, title: "Verifiable IoT", subtitle: "Secure, real-time sensor data." },
  { index: 22, session: 2, title: "Smart Contracts", subtitle: "Programmable, self-executing backend logic." },
  { index: 23, session: 2, title: "Separation of concerns", subtitle: "Write vs Read (Consensus vs Mirror Nodes)." },
  { 
    index: 24, 
    session: 2, 
    title: "Governing Council", 
    subtitle: "39 global organizations.",
    bullets: [
      "Hedera is governed by up to 39 highly diversified organizations.",
      "Includes Google, IBM, Boeing, Dell, and leading universities.",
      "No single member has control (equal voting rights).",
      "Term limits ensure the council remains decentralized over time.",
      "Provides enterprise-grade stability and legal compliance."
    ]
  },
  { 
    index: 25, 
    session: 2, 
    title: "Network Stability", 
    subtitle: "Legal and technical guarantees against network splitting.",
    bullets: [
      "Unlike Bitcoin or Ethereum, Hedera will not hard fork.",
      "The Hashgraph consensus algorithm provides mathematical finality.",
      "Council members sign legal agreements not to split the network.",
      "Ensures businesses can build applications without fear of competing ledgers.",
      "Provides long-term predictability for enterprise adoption."
    ]
  },
  { 
    index: 26, 
    session: 2, 
    title: "The Developer Stack", 
    subtitle: "Build the Future with the tools you already know.",
    bullets: [
      "Frontend: React, Next.js, Vue, or any modern web framework.",
      "Backend: Node.js, Python, Java, or Go.",
      "Smart Contracts: Solidity (EVM compatible).",
      "Integration: Hedera SDKs abstract away the cryptographic complexity.",
      "You don't need to learn a new language to build on Hedera."
    ]
  },
  { index: 27, session: 2, title: "Thank You", subtitle: "Q&A" },
];
