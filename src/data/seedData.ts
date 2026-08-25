import { UserCandidate, ProjectRequirement, TeamInvite, OpenTeam, TeamJoinApplication } from '../types';

export const INITIAL_CANDIDATES: UserCandidate[] = [
  {
    id: 'cand-1',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    headline: 'Distributed Systems & Go / Rust Architect | Codeforces 2100',
    college: 'IIT Bombay',
    department: 'Computer Science & Eng (CSE)',
    yearOfStudy: '3rd Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Full-Stack Engineer',
    archetype: 'System Architect',
    topSkills: ['Go', 'Rust', 'TypeScript', 'Distributed Systems', 'PostgreSQL', 'Docker', 'WebSockets', 'GraphQL'],
    selfDeclaredSkills: ['Go', 'Rust', 'TypeScript', 'Docker', 'Kubernetes', 'WebSockets'],
    inferredSkills: [
      {
        name: 'Distributed Systems & Consensus',
        category: 'Frameworks & Systems',
        proficiency: 98,
        confidence: 'High',
        confidenceScore: 98,
        supportingEvidence: [
          '32 public GitHub repositories with 540 lifetime commits',
          'Authored Raft-KV (Fault-tolerant Go distributed store with gRPC)',
          'Maintains SubSec Proxy in Rust handling 250k req/sec benchmark'
        ],
        sources: ['GitHub', 'Resume/CV']
      },
      {
        name: 'Advanced Data Structures & Algorithms',
        category: 'DSA & Problem Solving',
        proficiency: 96,
        confidence: 'High',
        confidenceScore: 96,
        supportingEvidence: [
          '620+ LeetCode problems solved with 2140 contest rating (Top 0.8% global)',
          'CodeChef 5★ competitive coder with 2050 rating'
        ],
        sources: ['LeetCode', 'CodeChef']
      },
      {
        name: 'Go & Low-Latency Microservices',
        category: 'Languages',
        proficiency: 95,
        confidence: 'High',
        confidenceScore: 94,
        supportingEvidence: [
          'Primary language across 14 GitHub backend repositories',
          'Production-grade telemetry and gRPC protocol buffers integration'
        ],
        sources: ['GitHub']
      }
    ],
    connectorReports: [
      { platform: 'github', displayName: 'GitHub Connector', status: 'connected', handle: 'aarav-systems', dataSummary: '32 repos, 540 commits, Go/Rust primary', timestamp: '2026-02-24T12:00:00Z' },
      { platform: 'leetcode', displayName: 'LeetCode Connector', status: 'connected', handle: 'aarav_sharma', dataSummary: '620 solved, 2140 rating (Knight)', timestamp: '2026-02-24T12:00:00Z' },
      { platform: 'codechef', displayName: 'CodeChef Connector', status: 'connected', handle: 'aarav_code', dataSummary: '5★ (2050 rating, Division 1)', timestamp: '2026-02-24T12:00:00Z' },
      { platform: 'linkedin', displayName: 'LinkedIn Adapter', status: 'protected_mode', handle: 'linkedin.com/in/aarav-sharma-systems', dataSummary: 'Linked securely (Protected Policy)', timestamp: '2026-02-24T12:00:00Z' }
    ],
    technicalScore: 96,
    codingHandles: {
      github: 'aarav-systems',
      githubRepos: 32,
      githubCommits: 540,
      leetcode: 'aarav_sharma',
      leetcodeProblems: 620,
      leetcodeRating: 2140,
      codechef: 'aarav_code',
      codechefStars: '5★',
      codechefRating: 2050,
      linkedin: 'linkedin.com/in/aarav-sharma-systems'
    },
    extractedSkillScores: {
      dsa: 96,
      web: 88,
      ml: 65,
      design: 45,
      pitch: 70,
      systems: 98
    },
    workingStyle: 'Structured & Methodical',
    weeklyAvailabilityHours: 35,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'aarav-systems',
    portfolioUrl: 'https://aarav.dev',
    hackathonsWon: 3,
    pastProjects: [
      { title: 'Raft-KV', tech: 'Go, gRPC', description: 'Fault-tolerant distributed key-value store implementing Raft consensus algorithm.' },
      { title: 'SubSec Proxy', tech: 'Rust, Tokio', description: 'Zero-copy reverse proxy handling 250k req/sec with dynamic rate-limiting.' }
    ],
    bio: 'Obsessed with low-latency backend architectures, clean API contracts, and crash-resilient concurrency.',
    interestedDomains: ['Cloud Infrastructure', 'FinTech', 'DevTools', 'Distributed AI'],
    status: 'available',
    verifiedBadges: ['LeetCode 600+ Solved', 'Codeforces 2100+', 'CodeChef 5★ (2050)', 'GitHub 500+ Commits', 'Hackathon Grand Winner'],
    contactInfo: {
      email: 'aarav.sharma@iitb.ac.in',
      phone: '+91 98201 44521',
      whatsapp: '+919820144521',
      telegram: '@aarav_sys',
      linkedin: 'https://linkedin.com/in/aarav-sharma-systems'
    }
  },
  {
    id: 'cand-2',
    name: 'Diya Sen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    headline: 'UI/UX Product Designer & React 19 / Motion Specialist',
    college: 'BITS Pilani / NID Ahmedabad',
    department: 'Design & Human-Computer Interaction',
    yearOfStudy: '3rd Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'UI/UX Product Designer',
    archetype: 'UX Crafter',
    topSkills: ['Figma', 'Tailwind CSS', 'Motion UI', 'Design Systems', 'User Research', 'React 19', 'Storybook', 'Micro-Interactions'],
    technicalScore: 94,
    codingHandles: {
      github: 'diya-design-lab',
      githubRepos: 18,
      githubCommits: 310,
      linkedin: 'linkedin.com/in/diya-sen-ux'
    },
    extractedSkillScores: {
      dsa: 60,
      web: 95,
      ml: 50,
      design: 98,
      pitch: 88,
      systems: 55
    },
    workingStyle: 'Pair-Programming Fast-Paced',
    weeklyAvailabilityHours: 30,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'diya-design-lab',
    portfolioUrl: 'https://diyo.design',
    hackathonsWon: 4,
    pastProjects: [
      { title: 'Fluid Design Kit', tech: 'React, Tailwind, Motion', description: 'Accessible WCAG AAA component toolkit with 40k+ developer downloads.' },
      { title: 'Pulse Health OS', tech: 'Figma, React Native', description: 'Patient monitoring interface awarded Best UX at Asia Tech Fest.' }
    ],
    bio: 'I turn complex data matrices into intuitive, high-contrast light interfaces with 60fps micro-animations and zero dead clicks.',
    interestedDomains: ['Healthcare', 'B2B SaaS', 'AI Interaction Design', 'Fintech'],
    status: 'available',
    verifiedBadges: ['Best UX Hackathon 2025', 'Figma Pro Certified', 'GitHub 300+ Commits', 'National Design Fellow'],
    contactInfo: {
      email: 'diya.sen@pilani.bits-pilani.ac.in',
      phone: '+91 97112 88902',
      whatsapp: '+919711288902',
      telegram: '@diya_ux',
      linkedin: 'https://linkedin.com/in/diya-sen-ux'
    }
  },
  {
    id: 'cand-3',
    name: 'Kabir Varma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    headline: 'Applied GenAI & Multimodal Agents | IIIT Hyderabad Kohli AI Fellow',
    college: 'IIIT Hyderabad',
    department: 'Artificial Intelligence & Data Science',
    yearOfStudy: '4th Year',
    experienceLevel: 'Grad / Masters',
    primaryRole: 'AI / ML Specialist',
    archetype: 'Quantitative Mind',
    topSkills: ['Gemini 3.7 SDK', 'PyTorch', 'Vector Search', 'LangGraph', 'Python', 'FastAPI', 'DSPy', 'RAG Pipelines'],
    technicalScore: 98,
    codingHandles: {
      github: 'kabir-ai-labs',
      githubRepos: 24,
      githubCommits: 490,
      leetcode: 'kabir_ml',
      leetcodeProblems: 410,
      leetcodeRating: 1890,
      linkedin: 'linkedin.com/in/kabir-varma-ai'
    },
    extractedSkillScores: {
      dsa: 88,
      web: 75,
      ml: 99,
      design: 40,
      pitch: 72,
      systems: 85
    },
    workingStyle: 'Async Deep-Work',
    weeklyAvailabilityHours: 40,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'kabir-ai-labs',
    portfolioUrl: 'https://kabir-ai.io',
    hackathonsWon: 5,
    pastProjects: [
      { title: 'NeuroDoc Reasoning', tech: 'Gemini, Python', description: 'Clinical differential diagnosis agent with transparent citation paths.' },
      { title: 'OmniAgent Graph', tech: 'PyTorch, LangGraph', description: 'Autonomous agentic loop with self-correcting validation layers.' }
    ],
    bio: 'Specializing in prompt chain orchestration, embeddings similarity, and explainable neural reasoning.',
    interestedDomains: ['Autonomous Agents', 'MedTech', 'Explainable AI', 'Robotics'],
    status: 'available',
    verifiedBadges: ['NeurIPS Workshop Author', 'Kaggle Grandmaster', 'LeetCode 400+', 'National AI Hackathon Winner'],
    contactInfo: {
      email: 'kabir.varma@research.iiit.ac.in',
      phone: '+91 99304 12890',
      whatsapp: '+919830412890',
      telegram: '@kabir_ai',
      linkedin: 'https://linkedin.com/in/kabir-varma-ai'
    }
  },
  {
    id: 'cand-4',
    name: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    headline: 'Product Growth Lead & Pitch Strategist | Ex-YC Hack Winner',
    college: 'IIT Delhi',
    department: 'Electronics & Comm (ECE)',
    yearOfStudy: '4th Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Domain & Product Strategist',
    archetype: 'Visionary & Domain Lead',
    topSkills: ['Product Strategy', 'Pitch Deck Pitching', 'User Interviews', 'Market Sizing', 'Go-to-Market', 'API Synthesis', 'Public Speaking'],
    technicalScore: 89,
    codingHandles: {
      github: 'ananya-builds',
      githubRepos: 12,
      githubCommits: 180,
      linkedin: 'linkedin.com/in/ananya-iyer-lead'
    },
    extractedSkillScores: {
      dsa: 65,
      web: 75,
      ml: 60,
      design: 80,
      pitch: 98,
      systems: 65
    },
    workingStyle: 'Pair-Programming Fast-Paced',
    weeklyAvailabilityHours: 35,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'ananya-builds',
    portfolioUrl: 'https://ananyaiyer.com',
    hackathonsWon: 6,
    pastProjects: [
      { title: 'KisanDirect', tech: 'Next.js, Twilio', description: 'Agri-supply chain bidding engine scaled to 12,000 farmers across Maharashtra.' },
      { title: 'FinFlow Protocol', tech: 'React, Solidity', description: 'SME invoice discounting protocol acquired in 2024.' }
    ],
    bio: 'I bridge the gap between hard engineering and judge-winning business pitch narratives. 6x Hackathon Pitch Champion.',
    interestedDomains: ['FinTech', 'ClimateTech', 'Enterprise AI', 'EdTech'],
    status: 'available',
    verifiedBadges: ['National Pitch Winner (6x)', 'YC Hack Fellow', 'Global Hackathon 1st Prize', 'Top 1% Orator'],
    contactInfo: {
      email: 'ananya.iyer@ee.iitd.ac.in',
      phone: '+91 98114 77219',
      whatsapp: '+919811477219',
      telegram: '@ananya_pitch',
      linkedin: 'https://linkedin.com/in/ananya-iyer-lead'
    }
  },
  {
    id: 'cand-5',
    name: 'Rohan Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    headline: 'High-Velocity Full-Stack Hacker & Three.js / WebGL Builder',
    college: 'NIT Trichy',
    department: 'Electronics & Comm (ECE)',
    yearOfStudy: '2nd Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Full-Stack Engineer',
    archetype: 'Speed Builder / Hacker',
    topSkills: ['React 19', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Three.js / WebGL', 'Supabase', 'Redis', 'Next.js'],
    technicalScore: 92,
    codingHandles: {
      github: 'rohan-hacks',
      githubRepos: 28,
      githubCommits: 620,
      leetcode: 'rohan_speed',
      leetcodeProblems: 380,
      leetcodeRating: 1780,
      linkedin: 'linkedin.com/in/rohan-deshmukh-builds'
    },
    extractedSkillScores: {
      dsa: 80,
      web: 96,
      ml: 55,
      design: 75,
      pitch: 70,
      systems: 85
    },
    workingStyle: 'Pair-Programming Fast-Paced',
    weeklyAvailabilityHours: 45,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'rohan-hacks',
    portfolioUrl: 'https://rohand.dev',
    hackathonsWon: 3,
    pastProjects: [
      { title: 'ChronoBoard', tech: 'React, WebSockets', description: 'Real-time collaborative sprint canvas with <12ms sync latency.' },
      { title: 'HyperGraph 3D', tech: 'Three.js, WebGL', description: '3D knowledge graph visualizer rendering 100k nodes smoothly.' }
    ],
    bio: 'Give me an empty directory and 24 hours. I ship complete, delightful web applications with zero friction.',
    interestedDomains: ['Developer Tools', 'Web3 / DeFi', 'Spatial Web', 'Productivity'],
    status: 'available',
    verifiedBadges: ['GitHub 600+ Commits', 'LeetCode 380+', 'Speed Coder Champion', 'NIT Tech Lead'],
    contactInfo: {
      email: 'rohan.deshmukh@nitt.edu',
      phone: '+91 94441 55210',
      whatsapp: '+919444155210',
      telegram: '@rohan_hacks',
      linkedin: 'https://linkedin.com/in/rohan-deshmukh-builds'
    }
  },
  {
    id: 'cand-6',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    headline: 'IoT, Embedded Systems & Edge AI Engineer | Robotics Lead',
    college: 'BITS Pilani, Goa Campus',
    department: 'Electrical & Electronics (EEE)',
    yearOfStudy: '3rd Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Hardware & Embedded Engineer',
    archetype: 'System Architect',
    topSkills: ['ESP32', 'C/C++', 'ROS 2', 'MQTT', 'TensorFlow Lite Micro', 'PCB Design', 'KiCAD', 'Rust Embedded'],
    technicalScore: 95,
    codingHandles: {
      github: 'priya-embedded',
      githubRepos: 21,
      githubCommits: 410,
      linkedin: 'linkedin.com/in/priya-patel-embedded'
    },
    extractedSkillScores: {
      dsa: 82,
      web: 60,
      ml: 85,
      design: 40,
      pitch: 75,
      systems: 96
    },
    workingStyle: 'Structured & Methodical',
    weeklyAvailabilityHours: 32,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'priya-embedded',
    portfolioUrl: 'https://priyapatel.tech',
    hackathonsWon: 4,
    pastProjects: [
      { title: 'AgriSensor Edge', tech: 'ESP32, TinyML', description: 'Solar-powered smart soil telemetry station with anomaly detection.' },
      { title: 'DroneTelemetry RTOS', tech: 'FreeRTOS, C++', description: 'Mission-critical autonomous drone control loop with sub-millisecond fail-safe.' }
    ],
    bio: 'Bridging physical hardware sensors with intelligent edge neural networks. Embedded and robotics hackathon specialist.',
    interestedDomains: ['Smart Agriculture', 'Robotics', 'Clean Energy', 'Industrial IoT'],
    status: 'available',
    verifiedBadges: ['Hardware Hackathon Winner', 'GitHub 400+ Commits', 'Robocon Lead', 'Verified Hardware Lab'],
    contactInfo: {
      email: 'priya.patel@goa.bits-pilani.ac.in',
      phone: '+91 98765 43210',
      whatsapp: '+919876543210',
      telegram: '@priya_iot',
      linkedin: 'https://linkedin.com/in/priya-patel-embedded'
    }
  },
  {
    id: 'cand-7',
    name: 'Neha Gupta',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    headline: 'Cloud Native & Kubernetes Infrastructure Lead | AWS Certified',
    college: 'Delhi Technological University (DTU)',
    department: 'Information Technology (IT)',
    yearOfStudy: '4th Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Cloud & Distributed Systems Architect',
    archetype: 'System Architect',
    topSkills: ['Kubernetes', 'Terraform', 'AWS Solutions Architect', 'Docker', 'Go', 'Prometheus', 'CI/CD Pipelines'],
    technicalScore: 93,
    codingHandles: {
      github: 'neha-cloud',
      githubRepos: 26,
      githubCommits: 380,
      leetcode: 'neha_k8s',
      leetcodeProblems: 340,
      leetcodeRating: 1720,
      linkedin: 'linkedin.com/in/neha-gupta-cloud'
    },
    extractedSkillScores: {
      dsa: 84,
      web: 78,
      ml: 55,
      design: 40,
      pitch: 70,
      systems: 95
    },
    workingStyle: 'Structured & Methodical',
    weeklyAvailabilityHours: 35,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'neha-cloud',
    portfolioUrl: 'https://nehacloud.io',
    hackathonsWon: 3,
    pastProjects: [
      { title: 'KubeMesh Autoscale', tech: 'Go, K8s Operator', description: 'Custom Kubernetes controller optimizing container scaling by predictive traffic.' },
      { title: 'ZeroTrust Vault', tech: 'Terraform, Vault', description: 'Automated secret rotation system supporting 40+ microservices.' }
    ],
    bio: 'I build resilient zero-downtime cloud pipelines, observability clusters, and rock-solid infrastructure.',
    interestedDomains: ['Cloud Infrastructure', 'Cybersecurity', 'FinTech', 'DevOps'],
    status: 'available',
    verifiedBadges: ['AWS Certified Solutions Architect', 'CKA Certified', 'LeetCode 300+', 'Cloud Hackathon Mentor'],
    contactInfo: {
      email: 'neha.gupta@dtu.ac.in',
      phone: '+91 98223 99120',
      whatsapp: '+919822399120',
      telegram: '@neha_k8s',
      linkedin: 'https://linkedin.com/in/neha-gupta-cloud'
    }
  },
  {
    id: 'cand-8',
    name: 'Siddharth Nair',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    headline: 'Data Scientist & Quantitative Analytics | Kaggle Expert',
    college: 'IIT Madras',
    department: 'Computer Science & Eng (CSE)',
    yearOfStudy: '3rd Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Data / Quantitative Engineer',
    archetype: 'Quantitative Mind',
    topSkills: ['Python', 'SQL', 'Pandas / Polars', 'DuckDB', 'Scikit-Learn', 'Tableau', 'Time-Series Forecasting', 'FastAPI'],
    technicalScore: 91,
    codingHandles: {
      github: 'sid-quant',
      githubRepos: 19,
      githubCommits: 320,
      leetcode: 'sid_quant',
      leetcodeProblems: 450,
      leetcodeRating: 1910,
      linkedin: 'linkedin.com/in/siddharth-nair-data'
    },
    extractedSkillScores: {
      dsa: 90,
      web: 65,
      ml: 92,
      design: 45,
      pitch: 75,
      systems: 80
    },
    workingStyle: 'Async Deep-Work',
    weeklyAvailabilityHours: 30,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'sid-quant',
    portfolioUrl: 'https://siddharthnair.me',
    hackathonsWon: 2,
    pastProjects: [
      { title: 'GridForecaster', tech: 'Python, Polars, XGBoost', description: 'Substation energy demand forecasting model with 98.2% accuracy.' },
      { title: 'TradePulse Analytics', tech: 'DuckDB, React', description: 'High-frequency orderbook visualization pipeline.' }
    ],
    bio: 'Specialized in turning terabytes of raw telemetry data into statistical certainty and predictive signals.',
    interestedDomains: ['Energy Analytics', 'Quantitative Finance', 'Health Data', 'Supply Chain'],
    status: 'available',
    verifiedBadges: ['Kaggle Expert', 'LeetCode 450+ Solved', 'Global Hackathon Finalist', 'IIT Madras Data Lead'],
    contactInfo: {
      email: 'sid.nair@cse.iitm.ac.in',
      phone: '+91 97401 22345',
      whatsapp: '+919740122345',
      telegram: '@sid_quant',
      linkedin: 'https://linkedin.com/in/siddharth-nair-data'
    }
  },
  {
    id: 'cand-9',
    name: 'Tanvi Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    headline: 'Cybersecurity Researcher & Smart Contract Auditor | CTF Champion',
    college: 'COEP Technological University, Pune',
    department: 'Computer Science & Cyber Security',
    yearOfStudy: '4th Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Cybersecurity & Infrastructure Specialist',
    archetype: 'System Architect',
    topSkills: ['Solidity', 'Rust', 'Foundry', 'Zero-Knowledge Proofs', 'Smart Contract Auditing', 'Penetration Testing', 'Cryptographic Primitives', 'Go'],
    selfDeclaredSkills: ['Solidity', 'Rust', 'Foundry', 'Cybersecurity', 'Web3', 'Linux'],
    inferredSkills: [
      {
        name: 'Smart Contract Security & EVM Bytecode Analysis',
        category: 'Cybersecurity & Web3',
        proficiency: 97,
        confidence: 'High',
        confidenceScore: 97,
        supportingEvidence: [
          'Audited 12 DeFi protocols with $14M TVL without exploit',
          'Ranked 1st in InCTF National Cyber Challenge 2025',
          '18 public vulnerability writeups on Immunefi bug bounty'
        ],
        sources: ['GitHub', 'Resume/CV']
      },
      {
        name: 'Algorithms & Problem Solving',
        category: 'DSA & Problem Solving',
        proficiency: 92,
        confidence: 'High',
        confidenceScore: 93,
        supportingEvidence: ['CodeChef 5★ (2110 rating)', 'Codeforces Master (2140)'],
        sources: ['CodeChef', 'LeetCode']
      }
    ],
    technicalScore: 95,
    codingHandles: {
      github: 'tanvi-sec',
      githubRepos: 22,
      githubCommits: 430,
      leetcode: 'tanvi_sec',
      leetcodeProblems: 480,
      leetcodeRating: 1980,
      codechef: 'tanvi_ctf',
      codechefStars: '5★',
      codechefRating: 2110,
      linkedin: 'linkedin.com/in/tanvi-kulkarni-cyber'
    },
    extractedSkillScores: {
      dsa: 92,
      web: 76,
      ml: 60,
      design: 40,
      pitch: 82,
      systems: 97
    },
    workingStyle: 'Structured & Methodical',
    weeklyAvailabilityHours: 35,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'tanvi-sec',
    portfolioUrl: 'https://tanvisec.io',
    hackathonsWon: 4,
    pastProjects: [
      { title: 'ZK-Aegis Bridge', tech: 'Rust, Circom, Solidity', description: 'Zero-knowledge cross-chain state proof verifier preventing reentrancy attacks.' },
      { title: 'DeFi Threat Radar', tech: 'Go, Foundry', description: 'Real-time mempool scanner detecting front-running & flash loan attacks.' }
    ],
    bio: 'Security researcher finding zero-days before attackers do. Passionate about resilient systems and verifiable cryptographic state.',
    interestedDomains: ['Web3 Security', 'FinTech Fraud Defense', 'Cryptographic Systems', 'Cloud Security'],
    status: 'available',
    verifiedBadges: ['InCTF 1st Place', 'Immunefi Top 50', 'CodeChef 5★', 'Cybersecurity Sprint Winner'],
    contactInfo: {
      email: 'tanvi.kulkarni@coep.ac.in',
      phone: '+91 98332 11094',
      whatsapp: '+919833211094',
      telegram: '@tanvi_sec',
      linkedin: 'https://linkedin.com/in/tanvi-kulkarni-cyber'
    }
  },
  {
    id: 'cand-10',
    name: 'Arjun Singhania',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    headline: 'Cross-Platform Mobile Engineer & Offline-First Architect | Flutter / Swift',
    college: 'Netaji Subhas University of Technology (NSUT)',
    department: 'Information Technology (IT)',
    yearOfStudy: '3rd Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Mobile & Cross-Platform Engineer',
    archetype: 'Speed Builder / Hacker',
    topSkills: ['Flutter', 'React Native', 'SwiftUI', 'Kotlin Multiplatform', 'SQLite / WatermelonDB', 'Bluetooth LE', 'WebSockets', 'GraphQL'],
    technicalScore: 91,
    codingHandles: {
      github: 'arjun-mobile',
      githubRepos: 30,
      githubCommits: 510,
      leetcode: 'arjun_app',
      leetcodeProblems: 390,
      leetcodeRating: 1810,
      linkedin: 'linkedin.com/in/arjun-singhania-mobile'
    },
    extractedSkillScores: {
      dsa: 82,
      web: 88,
      ml: 52,
      design: 85,
      pitch: 74,
      systems: 86
    },
    workingStyle: 'Pair-Programming Fast-Paced',
    weeklyAvailabilityHours: 38,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'arjun-mobile',
    portfolioUrl: 'https://arjunsinghania.app',
    hackathonsWon: 3,
    pastProjects: [
      { title: 'OfflineRuralCare', tech: 'Flutter, WatermelonDB, SQLite', description: 'Zero-connectivity patient records syncing over peer-to-peer Bluetooth mesh.' },
      { title: 'SwiftPulse', tech: 'SwiftUI, CoreData, HealthKit', description: 'Cardio biometric tracker with 80k+ App Store downloads.' }
    ],
    bio: 'Mobile craftsman shipping 60fps native feel across iOS and Android with battle-tested offline sync caches.',
    interestedDomains: ['Healthcare Apps', 'Consumer FinTech', 'Field Operations', 'Offline EdTech'],
    status: 'available',
    verifiedBadges: ['App Store Featured', 'Flutter Community Hero', 'GitHub 500+ Commits', 'HackOut Winner'],
    contactInfo: {
      email: 'arjun.singhania@nsut.ac.in',
      phone: '+91 99105 77623',
      whatsapp: '+919910577623',
      telegram: '@arjun_flutter',
      linkedin: 'https://linkedin.com/in/arjun-singhania-mobile'
    }
  },
  {
    id: 'cand-11',
    name: 'Meera Nambiar',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    headline: 'Multimodal Audio/Speech AI & Vernacular NLP Researcher | IISc Scholar',
    college: 'Indian Institute of Science (IISc), Bangalore',
    department: 'Computational & Data Sciences (CDS)',
    yearOfStudy: '1st Year Masters',
    experienceLevel: 'Grad / Masters',
    primaryRole: 'AI / ML Specialist',
    archetype: 'Quantitative Mind',
    topSkills: ['Whisper Speech Models', 'Gemini 3.7 Audio', 'PyTorch', 'Indic Vernacular NLP', 'FastAPI', 'Hugging Face Transformers', 'Vector DBs'],
    technicalScore: 97,
    codingHandles: {
      github: 'meera-speech-lab',
      githubRepos: 17,
      githubCommits: 360,
      leetcode: 'meera_nlp',
      leetcodeProblems: 320,
      leetcodeRating: 1760,
      linkedin: 'linkedin.com/in/meera-nambiar-speech'
    },
    extractedSkillScores: {
      dsa: 86,
      web: 70,
      ml: 99,
      design: 45,
      pitch: 80,
      systems: 88
    },
    workingStyle: 'Async Deep-Work',
    weeklyAvailabilityHours: 35,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'meera-speech-lab',
    portfolioUrl: 'https://meeranambiar.research.iisc.ac.in',
    hackathonsWon: 4,
    pastProjects: [
      { title: 'IndicVoice Triage', tech: 'Whisper, PyTorch, Gemini', description: 'Real-time diagnostic speech transcription tuned on 12 Indian regional dialects.' },
      { title: 'AcousticCough Diagnostic', tech: 'PyTorch, Librosa', description: 'Audio biomarker classifier detecting respiratory distress with 94.8% sensitivity.' }
    ],
    bio: 'Pushing acoustic machine learning and vernacular language models to reach every citizen without literacy barriers.',
    interestedDomains: ['MedTech Speech AI', 'Vernacular Accessibility', 'Voice Interfaces', 'Rural Health'],
    status: 'available',
    verifiedBadges: ['IISc Research Fellow', 'ACL Workshop Author', 'AI Innovation Winner', 'OpenSource Contributor'],
    contactInfo: {
      email: 'meera.nambiar@cds.iisc.ac.in',
      phone: '+91 94801 33490',
      whatsapp: '+919480133490',
      telegram: '@meera_speech',
      linkedin: 'https://linkedin.com/in/meera-nambiar-speech'
    }
  },
  {
    id: 'cand-12',
    name: 'Vikramaditya Roy',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    headline: 'High-Throughput Go Backend & Real-time WebSockets Engineer',
    college: 'Jadavpur University',
    department: 'Information Technology (IT)',
    yearOfStudy: '4th Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Full-Stack Engineer',
    archetype: 'Speed Builder / Hacker',
    topSkills: ['Go', 'TypeScript', 'WebSockets', 'Kafka', 'Redis Streams', 'PostgreSQL', 'Docker', 'Next.js 15'],
    technicalScore: 93,
    codingHandles: {
      github: 'vikram-roy-dev',
      githubRepos: 25,
      githubCommits: 580,
      leetcode: 'vikram_roy',
      leetcodeProblems: 540,
      leetcodeRating: 2020,
      codechef: 'vikram_jadavpur',
      codechefStars: '4★',
      codechefRating: 1940,
      linkedin: 'linkedin.com/in/vikramaditya-roy-go'
    },
    extractedSkillScores: {
      dsa: 93,
      web: 90,
      ml: 50,
      design: 55,
      pitch: 70,
      systems: 94
    },
    workingStyle: 'Pair-Programming Fast-Paced',
    weeklyAvailabilityHours: 40,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'vikram-roy-dev',
    portfolioUrl: 'https://vikramroy.dev',
    hackathonsWon: 3,
    pastProjects: [
      { title: 'StreamEngine', tech: 'Go, WebSockets, Redis', description: 'Live event pub/sub broker handling 100k concurrent client connections with 4ms latency.' },
      { title: 'TelemetryPipeline', tech: 'Go, Kafka, ClickHouse', description: 'High-volume sensor streaming ingester for IoT industrial plants.' }
    ],
    bio: 'I write concise, concurrent Go services that do not break under load. Hackathon veteran and speed coder.',
    interestedDomains: ['Real-time Streaming', 'FinTech', 'DevOps', 'Distributed Systems'],
    status: 'available',
    verifiedBadges: ['LeetCode 500+ Solved', 'GitHub 500+ Commits', 'CodeChef 4★ (1940)', 'National Sprint Finalist'],
    contactInfo: {
      email: 'vikram.roy@it.jadavpuruniversity.in',
      phone: '+91 98310 99451',
      whatsapp: '+919831099451',
      telegram: '@vikram_go',
      linkedin: 'https://linkedin.com/in/vikramaditya-roy-go'
    }
  },
  {
    id: 'cand-13',
    name: 'Tanay Joshi',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    gender: 'Male',
    headline: 'Eager 1st Year Full-Stack Apprentice | Python, React & LeetCode Beginner',
    college: 'VJTI Mumbai',
    department: 'Computer Science & Eng (CSE)',
    yearOfStudy: '1st Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'Full-Stack Engineer',
    archetype: 'Speed Builder / Hacker',
    topSkills: ['Python', 'React 19', 'JavaScript', 'Tailwind CSS', 'FastAPI', 'Git', 'SQLite', 'C++'],
    selfDeclaredSkills: ['Python', 'React', 'FastAPI', 'Git'],
    inferredSkills: [
      {
        name: 'React & Modern Frontend',
        category: 'Frameworks & Systems',
        proficiency: 84,
        confidence: 'High',
        confidenceScore: 85,
        supportingEvidence: ['Built 6 student project repositories', 'Solid CSS styling and clean component structure'],
        sources: ['GitHub']
      },
      {
        name: 'Data Structures Foundations',
        category: 'DSA & Problem Solving',
        proficiency: 80,
        confidence: 'Medium',
        confidenceScore: 80,
        supportingEvidence: ['140+ LeetCode problems solved', 'Active daily practice streak'],
        sources: ['LeetCode']
      }
    ],
    technicalScore: 86,
    codingHandles: {
      github: 'tanay-joshi-dev',
      githubRepos: 12,
      githubCommits: 210,
      leetcode: 'tanay_code',
      leetcodeProblems: 140,
      leetcodeRating: 1550,
      linkedin: 'linkedin.com/in/tanay-joshi-vjti'
    },
    extractedSkillScores: {
      dsa: 80,
      web: 86,
      ml: 60,
      design: 68,
      pitch: 78,
      systems: 74
    },
    workingStyle: 'Pair-Programming Fast-Paced',
    weeklyAvailabilityHours: 40,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'tanay-joshi-dev',
    portfolioUrl: 'https://tanayjoshi.dev',
    hackathonsWon: 0,
    pastProjects: [
      { title: 'CampusNotes Sharing', tech: 'React, Tailwind, Supabase', description: 'Peer-to-peer lecture notes sharing platform for freshmen students with live search.' },
      { title: 'AlgoVisualizer', tech: 'JavaScript, Canvas', description: 'Interactive sorting and pathfinding algorithm animation tool.' }
    ],
    bio: 'Freshman eager to participate in my very first hackathon! High energy, fast learner, and ready to contribute 40+ hours during the sprint weekend.',
    interestedDomains: ['Web Apps', 'EdTech', 'Open Source', 'AI Tools'],
    status: 'available',
    verifiedBadges: ['First-Time Hacker', 'VJTI Freshman', 'GitHub 200+ Commits', 'Verified Student'],
    contactInfo: {
      email: 'tanay.joshi@vjti.ac.in',
      phone: '+91 98202 88410',
      whatsapp: '+919820288410',
      telegram: '@tanay_dev',
      linkedin: 'https://linkedin.com/in/tanay-joshi-vjti'
    }
  },
  {
    id: 'cand-14',
    name: 'Aisha Khan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    gender: 'Female',
    headline: 'Creative UI/UX Designer & Frontend Apprentice | Figma & Framer Motion',
    college: 'Symbiosis Institute of Design (SID)',
    department: 'Design & Human-Computer Interaction',
    yearOfStudy: '2nd Year',
    experienceLevel: 'Undergrad',
    primaryRole: 'UI/UX Product Designer',
    archetype: 'UX Crafter',
    topSkills: ['Figma', 'UI Design', 'Tailwind CSS', 'Motion UI', 'User Research', 'React', 'Wireframing', 'Typography'],
    selfDeclaredSkills: ['Figma', 'UI Design', 'Tailwind CSS', 'User Research'],
    technicalScore: 88,
    codingHandles: {
      github: 'aisha-designs',
      githubRepos: 8,
      githubCommits: 140,
      linkedin: 'linkedin.com/in/aisha-khan-ux'
    },
    extractedSkillScores: {
      dsa: 50,
      web: 88,
      ml: 45,
      design: 94,
      pitch: 82,
      systems: 55
    },
    workingStyle: 'Pair-Programming Fast-Paced',
    weeklyAvailabilityHours: 35,
    timezone: 'IST (UTC+5:30)',
    githubUsername: 'aisha-designs',
    portfolioUrl: 'https://aishakhan.design',
    hackathonsWon: 0,
    pastProjects: [
      { title: 'EcoTracker Mobile UI', tech: 'Figma, React Native', description: 'Clean carbon footprint tracker UI with minimalist visual micro-interactions.' },
      { title: 'SID Student Portal Redesign', tech: 'Figma, Tailwind', description: 'Redesigned college course registration interface reducing clicks by 60%.' }
    ],
    bio: 'Aspiring product designer looking for my first hackathon team. Passionate about typography, clean design systems, and helping engineering teams look polished for the jury.',
    interestedDomains: ['Healthcare UX', 'CleanTech', 'Accessibility', 'Consumer Apps'],
    status: 'available',
    verifiedBadges: ['First-Time Hacker', 'Figma Community Creator', 'Design Apprentice', 'Verified Student'],
    contactInfo: {
      email: 'aisha.khan@sid.edu.in',
      phone: '+91 97654 32190',
      whatsapp: '+919765432190',
      telegram: '@aisha_ux',
      linkedin: 'https://linkedin.com/in/aisha-khan-ux'
    }
  }
];

export const INITIAL_PROJECT: ProjectRequirement = {
  id: 'proj-hackathon-2026',
  title: 'NeuroGrid: Autonomous Renewable Energy Balancer & Microgrid AI',
  tagline: 'Predictive peer-to-peer clean power routing with sub-second frequency stabilization and explainable AI insights.',
  track: 'CleanTech & Renewable Energy Track',
  competitionContext: 'Global Sustainability Hackathon Sprint 2026',
  description: 'Developing a localized decentralized microgrid controller that balances intermittent solar/wind generation with industrial battery storage using Gemini multimodal reasoning and edge telemetry.',
  targetTeamSize: 4,
  creatorName: 'Aarav Sharma',
  creatorCollege: 'IIT Bombay',
  recruitingPitch: 'We have core backend systems and distributed consensus in place. Actively recruiting a UI/UX Product Designer and AI Specialist with cross-domain mix to optimize our team synergy and win the 1st prize.',
  hackathonConstraints: {
    requireFemaleMember: true,
    minDepartments: 2,
    allowedYears: ['2nd Year', '3rd Year', '4th Year'],
    maxTeamSize: 6,
    targetTrack: 'Renewable Energy & IoT'
  },
  sihConstraints: {
    requireFemaleMember: true,
    minDepartments: 2,
    allowedYears: ['2nd Year', '3rd Year', '4th Year'],
    maxTeamSize: 6,
    targetTrack: 'Renewable Energy & IoT'
  },
  requiredRoles: [
    {
      role: 'Full-Stack Engineer',
      priority: 'Critical',
      archetype: 'System Architect',
      idealSkills: ['Go', 'TypeScript', 'PostgreSQL', 'WebSockets'],
      responsibility: 'Lead distributed consensus ledger, real-time energy telemetry stream, and API contracts.'
    },
    {
      role: 'AI / ML Specialist',
      priority: 'Critical',
      archetype: 'Quantitative Mind',
      idealSkills: ['Python', 'Gemini 3.7 SDK', 'Time-Series Forecasting', 'FastAPI'],
      responsibility: 'Build predictive solar yield models, dynamic pricing heuristics, and explainable grid audit logs.'
    },
    {
      role: 'UI/UX Product Designer',
      priority: 'Critical',
      archetype: 'UX Crafter',
      idealSkills: ['Figma', 'React 19', 'Tailwind CSS', 'Motion UI'],
      responsibility: 'Craft the real-time energy dispatch dashboard with responsive layout and live grid topology maps.'
    },
    {
      role: 'Domain & Product Strategist',
      priority: 'Recommended',
      archetype: 'Visionary & Domain Lead',
      idealSkills: ['Pitch Deck Pitching', 'Regulatory Frameworks', 'User Interviews', 'Market Analysis'],
      responsibility: 'Formulate jury pitch narrative, ROI calculations for utilities, and live demo rehearsal.'
    }
  ],
  criticalTechStack: ['Go / TypeScript', 'Gemini 3.7 SDK', 'React 19', 'Tailwind CSS', 'PostgreSQL', 'WebSockets', 'FastAPI'],
  radarTarget: {
    technicalCoverage: 92,
    archetypeBalance: 95,
    communicationPace: 90,
    bandwidthReliability: 88,
    innovationIndex: 94
  },
  keyMilestones: [
    { phase: 'Hours 00-08', deliverable: 'System Architecture Frozen, Microgrid Simulator Mocked, UI Components Scaffolded', leadRole: 'Full-Stack Engineer' },
    { phase: 'Hours 08-24', deliverable: 'Gemini Inference Loop Connected, Real-Time P2P Energy Bidding Engine Live', leadRole: 'AI / ML Specialist' },
    { phase: 'Hours 24-38', deliverable: 'Live Grid Topology Canvas, Micro-Interactions, Team Synergy Validation Complete', leadRole: 'UI/UX Product Designer' },
    { phase: 'Hours 38-48', deliverable: '3-Minute Flawless Live Demo Flow, Jury FAQ Prep, Final Deployment Smoke Test', leadRole: 'Domain & Product Strategist' }
  ]
};

export const AVAILABLE_PROJECTS_FOR_SOLO_BUILDERS: ProjectRequirement[] = [
  INITIAL_PROJECT,
  {
    id: 'proj-med-echo',
    title: 'MedEcho: Multi-Lingual Rural Diagnostic Triage Agent',
    tagline: 'Offline-capable multimodal symptom assessment tool for primary health centers in 14 regional languages.',
    track: 'Healthcare & MedTech Hackathon',
    competitionContext: 'Asia Health Innovation Challenge 2026',
    description: 'Combining speech recognition across vernacular dialects with Gemini 3.7 clinical reasoning to assist rural health workers with instant triage prioritization.',
    targetTeamSize: 4,
    creatorName: 'Kabir Varma',
    creatorCollege: 'IIIT Hyderabad',
    recruitingPitch: 'Looking for a passionate React UI/UX frontend designer and speech audio engineer.',
    hackathonConstraints: {
      requireFemaleMember: true,
      minDepartments: 2,
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      maxTeamSize: 5,
      targetTrack: 'Healthcare'
    },
    sihConstraints: {
      requireFemaleMember: true,
      minDepartments: 2,
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      maxTeamSize: 5,
      targetTrack: 'Healthcare'
    },
    requiredRoles: [
      { role: 'AI / ML Specialist', priority: 'Critical', archetype: 'Quantitative Mind', idealSkills: ['Python', 'Gemini SDK', 'NLP'], responsibility: 'Clinical reasoning engine' },
      { role: 'UI/UX Product Designer', priority: 'Critical', archetype: 'UX Crafter', idealSkills: ['Figma', 'React', 'Voice UI'], responsibility: 'Accessible multilingual touch & voice interface' },
      { role: 'Full-Stack Engineer', priority: 'Critical', archetype: 'Speed Builder / Hacker', idealSkills: ['React Native', 'SQLite', 'WebSockets'], responsibility: 'Offline-first sync architecture' }
    ],
    criticalTechStack: ['Gemini 3.7', 'React Native', 'Python', 'FastAPI', 'Tailwind CSS'],
    radarTarget: { technicalCoverage: 90, archetypeBalance: 90, communicationPace: 85, bandwidthReliability: 90, innovationIndex: 95 },
    keyMilestones: [
      { phase: 'Hours 00-12', deliverable: 'Vernacular Audio Pipeline & Speech-to-Text Setup', leadRole: 'AI Specialist' },
      { phase: 'Hours 12-30', deliverable: 'Triage Decision Tree with Gemini Validation', leadRole: 'AI Specialist' },
      { phase: 'Hours 30-48', deliverable: 'Offline Tablet UI & Judge Presentation Rehearsal', leadRole: 'UI/UX Designer' }
    ]
  },
  {
    id: 'proj-drone-logistics',
    title: 'AeroLink: Autonomous Disaster-Zone Medical Supply Drone Mesh',
    tagline: 'Swarm drone coordination network with decentralized collision avoidance and emergency payload dispatch.',
    track: 'Robotics & Disaster Response Sprint',
    competitionContext: 'Global Aerial Robotics Challenge 2026',
    description: 'Autonomous multi-drone mission planning software communicating over LoRa ad-hoc mesh networks for rapid delivery of antivenom and emergency blood units.',
    targetTeamSize: 5,
    creatorName: 'Priya Patel',
    creatorCollege: 'BITS Pilani',
    recruitingPitch: 'Hardware and embedded flight controllers are ready. Seeking Full-Stack web operator interface and pitch strategist.',
    hackathonConstraints: {
      requireFemaleMember: true,
      minDepartments: 3,
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      maxTeamSize: 6,
      targetTrack: 'Robotics & Disaster Management'
    },
    sihConstraints: {
      requireFemaleMember: true,
      minDepartments: 3,
      allowedYears: ['2nd Year', '3rd Year', '4th Year'],
      maxTeamSize: 6,
      targetTrack: 'Robotics & Disaster Management'
    },
    requiredRoles: [
      { role: 'Hardware & Embedded Engineer', priority: 'Critical', archetype: 'System Architect', idealSkills: ['ROS 2', 'ESP32', 'C++'], responsibility: 'Flight controllers & mesh protocol' },
      { role: 'Full-Stack Engineer', priority: 'Critical', archetype: 'Speed Builder / Hacker', idealSkills: ['React', 'Mapbox', 'WebSockets'], responsibility: 'Real-time telemetry command dashboard' },
      { role: 'Domain & Product Strategist', priority: 'Critical', archetype: 'Visionary & Domain Lead', idealSkills: ['Pitching', 'Disaster Ops', 'Regulatory Law'], responsibility: 'Emergency deployment operational pitch' }
    ],
    criticalTechStack: ['ROS 2', 'C++', 'React 19', 'Mapbox GL', 'WebSockets', 'ESP32'],
    radarTarget: { technicalCoverage: 95, archetypeBalance: 92, communicationPace: 88, bandwidthReliability: 95, innovationIndex: 96 },
    keyMilestones: [
      { phase: 'Hours 00-14', deliverable: 'Hardware Mesh Comms Link Verified', leadRole: 'Hardware Lead' },
      { phase: 'Hours 14-32', deliverable: 'Live Map Telemetry & Geofencing UI Live', leadRole: 'Full-Stack Engineer' },
      { phase: 'Hours 32-48', deliverable: 'Live Outdoor Flight Simulation & Operations Deck', leadRole: 'Domain Strategist' }
    ]
  }
];

export const PRESET_PROJECTS: ProjectRequirement[] = AVAILABLE_PROJECTS_FOR_SOLO_BUILDERS;

export const INITIAL_INVITES: TeamInvite[] = [
  {
    id: 'inv-101',
    candidateId: 'cand-2',
    candidateName: 'Diya Sen',
    candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    candidateRole: 'UI/UX Product Designer',
    projectId: 'proj-hackathon-2026',
    projectTitle: 'NeuroGrid: Autonomous Renewable Energy Balancer',
    senderName: 'Aarav Sharma',
    senderRole: 'Full-Stack Lead (IIT Bombay)',
    pitchMessage: 'Hi Diya! We are building the Renewable Energy Balancer. We love your Fluid Design Kit portfolio and need your UI/UX wizardry to craft the live energy dispatch dashboard. Your addition boosts our team synergy score significantly (+24 score delta)!',
    status: 'accepted',
    timestamp: '2 hours ago',
    unlockedContact: {
      email: 'diya.sen@pilani.bits-pilani.ac.in',
      phone: '+91 97112 88902',
      whatsapp: '+919711288902',
      telegram: '@diya_ux',
      linkedin: 'https://linkedin.com/in/diya-sen-ux'
    }
  },
  {
    id: 'inv-102',
    candidateId: 'cand-4',
    candidateName: 'Ananya Iyer',
    candidateAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    candidateRole: 'Domain & Product Strategist',
    projectId: 'proj-hackathon-2026',
    projectTitle: 'NeuroGrid: Autonomous Renewable Energy Balancer',
    senderName: 'Aarav Sharma',
    senderRole: 'Full-Stack Lead (IIT Bombay)',
    pitchMessage: 'Hi Ananya! We have technical architecture ready and need your stellar 6x hackathon pitch narrative to present our energy distribution ROI model to the jury. Let us join forces!',
    status: 'pending',
    timestamp: '15 mins ago'
  }
];

export const OPEN_TEAMS_DATA: OpenTeam[] = [
  {
    id: 'team-pulse-echo',
    name: 'Team PulseEcho',
    tagline: 'Multi-lingual clinical triage agent for primary health centers across rural communities.',
    hackathonName: 'Global Health AI Summit 2026',
    hackathonTrack: 'MedTech & Healthcare AI',
    problemStatementId: 'HEALTH-MED-2026-402',
    problemStatement: 'Building an offline-capable, multimodal triage system for primary healthcare workers that captures voice symptoms in 14 regional languages, calculates emergency risk indices, and generates actionable referral cards.',
    targetTeamSize: 5,
    leader: INITIAL_CANDIDATES[2], // Kabir Varma (IIIT Hyderabad)
    members: [
      INITIAL_CANDIDATES[2], // Kabir (AI / ML)
      INITIAL_CANDIDATES[10], // Meera (NLP & Speech AI)
      INITIAL_CANDIDATES[7], // Siddharth (Data Engineer)
    ],
    synergyScore: 82,
    urgency: 'Immediate (Sprint Starts Soon)',
    weeklyTimeCommitment: '30-40 hrs/week (Sprint mode)',
    culture: 'Async Deep-Work, paired daily standups, zero-ego engineering.',
    openVacancies: [
      {
        role: 'UI/UX Product Designer',
        archetype: 'UX Crafter',
        priority: 'Critical',
        idealSkills: ['Figma', 'React 19', 'Tailwind CSS', 'Accessible Voice UI'],
        description: 'Design the offline mobile/tablet workflow for frontline health workers with high-contrast, multi-language UI.',
        seatsOpen: 1
      },
      {
        role: 'Mobile & Cross-Platform Engineer',
        archetype: 'Speed Builder / Hacker',
        priority: 'Critical',
        idealSkills: ['Flutter', 'SQLite / WatermelonDB', 'Offline P2P Sync'],
        description: 'Build the local offline-first SQLite database and Bluetooth sync mesh for zero-connectivity rural clinics.',
        seatsOpen: 1
      }
    ],
    competitionComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 3,
      isFullyCompliant: true,
      neededToSatisfy: 'Fully Compliant with Gender & Department Diversity'
    },
    sihComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 3,
      isFullyCompliant: true,
      neededToSatisfy: 'Fully Compliant with Gender & Department Diversity'
    },
    contactInfo: {
      email: 'kabir.varma@research.iiit.ac.in',
      phone: '+91 99304 12890',
      whatsapp: '+919930412890',
      telegram: '@pulseecho_team'
    }
  },
  {
    id: 'team-aeroshield',
    name: 'AeroShield Swarm Mesh',
    tagline: 'Autonomous multi-drone disaster response network with decentralized telemetry mesh.',
    hackathonName: 'Global Aerial Robotics Challenge 2026',
    hackathonTrack: 'Robotics & Disaster Management',
    problemStatementId: 'ROBO-AERO-2026-118',
    problemStatement: 'Autonomous drone swarm coordination over LoRa mesh networks for rapid delivery of emergency medicines and antivenom in flood-isolated regions.',
    targetTeamSize: 5,
    leader: INITIAL_CANDIDATES[5], // Priya Patel (BITS Goa)
    members: [
      INITIAL_CANDIDATES[5], // Priya Patel (Hardware / IoT)
      INITIAL_CANDIDATES[6], // Neha Gupta (Cloud & DevOps)
    ],
    synergyScore: 74,
    urgency: 'Immediate (Sprint Starts Soon)',
    weeklyTimeCommitment: '35 hrs/week',
    culture: 'Hardware-first testing, rapid prototypes, high reliability standards.',
    openVacancies: [
      {
        role: 'Full-Stack Engineer',
        archetype: 'Speed Builder / Hacker',
        priority: 'Critical',
        idealSkills: ['React 19', 'Mapbox GL', 'WebSockets', 'Tailwind CSS'],
        description: 'Create the real-time ground control station and live geospatial telemetry tracking dashboard.',
        seatsOpen: 1
      },
      {
        role: 'Domain & Product Strategist',
        archetype: 'Visionary & Domain Lead',
        priority: 'Recommended',
        idealSkills: ['Field Logistics', 'Pitch Deck Pitching', 'Operational Protocol'],
        description: 'Craft the emergency deployment operational pitch and business sustainability deck for judges.',
        seatsOpen: 1
      },
      {
        role: 'AI / ML Specialist',
        archetype: 'Quantitative Mind',
        priority: 'Recommended',
        idealSkills: ['Edge AI', 'TensorFlow Lite', 'Obstacle Detection'],
        description: 'Deploy real-time edge vision models on drone cameras for autonomous landing zone detection.',
        seatsOpen: 1
      }
    ],
    competitionComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 2,
      isFullyCompliant: true,
      neededToSatisfy: 'Branch diversity satisfied (EEE + IT)'
    },
    sihComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 2,
      isFullyCompliant: true,
      neededToSatisfy: 'Branch diversity satisfied (EEE + IT)'
    },
    contactInfo: {
      email: 'priya.patel@goa.bits-pilani.ac.in',
      phone: '+91 98765 43210',
      whatsapp: '+919876543210',
      telegram: '@aeroshield_mesh'
    }
  },
  {
    id: 'team-zk-aegis',
    name: 'DeFi Aegis Threat Radar',
    hackathonName: 'EthGlobal & Web3 Defense Summit 2026',
    hackathonTrack: 'Web3 Security & Smart Contract Auditing',
    tagline: 'Real-time mempool anomaly detection & zero-knowledge circuit verification against flash loan attacks.',
    problemStatement: 'Automated formal verification of DeFi transaction sequences in the mempool to neutralize front-running and reentrancy exploits before blocks are committed.',
    targetTeamSize: 4,
    leader: INITIAL_CANDIDATES[8], // Tanvi Kulkarni (COEP Pune)
    members: [
      INITIAL_CANDIDATES[8], // Tanvi (Cybersecurity)
      INITIAL_CANDIDATES[0], // Aarav (Distributed Systems)
    ],
    synergyScore: 86,
    urgency: 'Final Seat',
    weeklyTimeCommitment: '25-30 hrs/week',
    culture: 'Security-first, comprehensive test suites, cryptographic precision.',
    openVacancies: [
      {
        role: 'UI/UX Product Designer',
        archetype: 'UX Crafter',
        priority: 'Critical',
        idealSkills: ['Figma', 'React', 'Data Visualizations', 'Dark / High-Contrast Mode'],
        description: 'Design the live mempool threat visualizer, attack trajectory graph, and emergency pause dashboard.',
        seatsOpen: 1
      },
      {
        role: 'Full-Stack Engineer',
        archetype: 'Speed Builder / Hacker',
        priority: 'Recommended',
        idealSkills: ['Next.js 15', 'Ethers.js / Viem', 'WebSockets', 'Tailwind CSS'],
        description: 'Wire up Web3 wallet signing, real-time node RPC streaming, and instant alert notification webhooks.',
        seatsOpen: 1
      }
    ],
    competitionComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 2,
      isFullyCompliant: true,
      neededToSatisfy: 'Security Track Optimal Balance'
    },
    sihComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 2,
      isFullyCompliant: true,
      neededToSatisfy: 'Security Track Optimal Balance'
    },
    contactInfo: {
      email: 'tanvi.kulkarni@coep.ac.in',
      phone: '+91 98332 11094',
      whatsapp: '+919833211094',
      telegram: '@aegis_security'
    }
  },
  {
    id: 'team-farm-vision',
    name: 'AgriSense Edge Vision',
    tagline: 'Solar-powered crop pathology edge scanners with vernacular voice advisory.',
    hackathonName: 'Global Sustainability & AgriTech Sprint 2026',
    hackathonTrack: 'Smart Agriculture & Food Tech',
    problemStatementId: 'AGRI-VISION-2026-891',
    problemStatement: 'Low-cost edge IoT devices combined with lightweight computer vision to diagnose crop blights in real-time without internet access, sending voice instructions in local dialects.',
    targetTeamSize: 5,
    leader: INITIAL_CANDIDATES[3], // Ananya Iyer (IIT Delhi)
    members: [
      INITIAL_CANDIDATES[3], // Ananya (Domain / Pitch)
      INITIAL_CANDIDATES[4], // Rohan (Full-Stack Hacker)
    ],
    synergyScore: 76,
    urgency: 'Forming Roster',
    weeklyTimeCommitment: '25-30 hrs/week',
    culture: 'High energy, rapid sprint demos every 12 hours, customer-centric focus.',
    openVacancies: [
      {
        role: 'AI / ML Specialist',
        archetype: 'Quantitative Mind',
        priority: 'Critical',
        idealSkills: ['Computer Vision', 'PyTorch', 'TensorFlow Lite', 'YOLOv11'],
        description: 'Train and quantize crop leaf disease classification models for under 20MB edge memory footprints.',
        seatsOpen: 1
      },
      {
        role: 'Hardware & Embedded Engineer',
        archetype: 'System Architect',
        priority: 'Critical',
        idealSkills: ['ESP32-CAM', 'C++', 'Solar Power Management', 'LoRa'],
        description: 'Engineer the weather-proof camera unit, solar charging circuit, and low-power wake-on-motion sensors.',
        seatsOpen: 1
      },
      {
        role: 'UI/UX Product Designer',
        archetype: 'UX Crafter',
        priority: 'Recommended',
        idealSkills: ['Voice UI', 'Figma', 'Accessible Mobile Design'],
        description: 'Design zero-text visual and audio prompts for farmers with varying literacy levels.',
        seatsOpen: 1
      }
    ],
    competitionComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 2,
      isFullyCompliant: true,
      neededToSatisfy: 'Leader Female Satisfied, Needs Hardware & ML additions'
    },
    sihComplianceStatus: {
      hasFemaleMember: true,
      branchCount: 2,
      isFullyCompliant: true,
      neededToSatisfy: 'Leader Female Satisfied, Needs Hardware & ML additions'
    },
    contactInfo: {
      email: 'ananya.iyer@ee.iitd.ac.in',
      phone: '+91 98114 77219',
      whatsapp: '+919811477219',
      telegram: '@agrisense_team'
    }
  },
  {
    id: 'team-aquasense-clean',
    name: 'AquaSense AI Water Grid',
    tagline: 'IoT sensor mesh detecting municipal water pipeline contaminants and leakages before distribution.',
    hackathonName: 'Smart City & Clean Water Hackathon 2026',
    hackathonTrack: 'Urban CleanTech & Smart Water Management',
    problemStatement: 'Distributed acoustic and chemical sensor network detecting bacterial contamination and pressure drops across urban water distribution mains in real-time.',
    targetTeamSize: 4,
    leader: INITIAL_CANDIDATES[11], // Vikramaditya Roy (Jadavpur)
    members: [
      INITIAL_CANDIDATES[11], // Vikramaditya (Go Backend)
      INITIAL_CANDIDATES[9], // Arjun (Mobile / Flutter)
    ],
    synergyScore: 71,
    urgency: 'Forming Roster',
    weeklyTimeCommitment: '25 hrs/week',
    culture: 'Pragmatic engineering, direct communication, weekend hack sprints.',
    openVacancies: [
      {
        role: 'Hardware & Embedded Engineer',
        archetype: 'System Architect',
        priority: 'Critical',
        idealSkills: ['pH / Turbidity Sensors', 'STM32', 'C/C++', 'MQTT'],
        description: 'Calibrate water quality probe telemetry and build battery-backed telemetry nodes.',
        seatsOpen: 1
      },
      {
        role: 'UI/UX Product Designer',
        archetype: 'UX Crafter',
        priority: 'Critical',
        idealSkills: ['Figma', 'React', 'Geospatial Maps', 'Alert UX'],
        description: 'Design the municipal water authority command center with GIS pipe heatmaps and automated valve alerts.',
        seatsOpen: 1
      }
    ],
    competitionComplianceStatus: {
      hasFemaleMember: false,
      branchCount: 2,
      isFullyCompliant: false,
      neededToSatisfy: 'Requires at least 1 female team member for optimal diversity score'
    },
    sihComplianceStatus: {
      hasFemaleMember: false,
      branchCount: 2,
      isFullyCompliant: false,
      neededToSatisfy: 'Requires at least 1 female team member for optimal diversity score'
    },
    contactInfo: {
      email: 'vikram.roy@it.jadavpuruniversity.in',
      phone: '+91 98310 99451',
      whatsapp: '+919831099451',
      telegram: '@aquasense_core'
    }
  }
];

export const INITIAL_APPLICATIONS: TeamJoinApplication[] = [
  {
    id: 'app-user-1',
    teamId: 'team-pulse-echo',
    teamName: 'Team PulseEcho',
    hackathonName: 'Global Health AI Summit 2026',
    applicantCandidate: INITIAL_CANDIDATES[1], // Diya Sen
    targetRole: 'UI/UX Product Designer',
    pitchMessage: 'Hi Kabir & team! I have built 4 winning hackathon UI designs including accessible multilingual voice interfaces. My Fluid Design Kit has 40k downloads. I would love to design the offline triage tablet interface for your healthcare workflow and help bring home the 1st prize.',
    weeklyHoursOffered: 30,
    timestamp: '1 hour ago',
    status: 'under_review',
    feedbackNote: 'Kabir Varma reviewed your portfolio and liked the Pulse Health OS demo. Standby for team decision.'
  },
  {
    id: 'app-user-2',
    teamId: 'team-zk-aegis',
    teamName: 'DeFi Aegis Threat Radar',
    hackathonName: 'EthGlobal 2026',
    applicantCandidate: INITIAL_CANDIDATES[4], // Rohan Deshmukh
    targetRole: 'Full-Stack Engineer',
    pitchMessage: 'Hey Tanvi! I specialize in high-velocity React 19 / WebGL interfaces and real-time WebSockets streaming (620+ GitHub commits). I can build the real-time mempool attack visualizer in under 24 hours so judges see a live, interactive 3D threat simulation.',
    weeklyHoursOffered: 40,
    timestamp: '3 hours ago',
    status: 'accepted',
    feedbackNote: 'Accepted! Welcome to DeFi Aegis. Let us sync on Discord and finalize the front-end architecture.',
    teamContact: {
      email: 'tanvi.kulkarni@coep.ac.in',
      phone: '+91 98332 11094',
      whatsapp: '+919833211094',
      telegram: '@aegis_security',
      linkedin: 'https://linkedin.com/in/tanvi-kulkarni-cyber'
    }
  },
  {
    id: 'app-incoming-1',
    teamId: 'proj-hackathon-2026',
    teamName: 'NeuroGrid (Your Team)',
    hackathonName: 'Global Sustainability Hackathon Sprint 2026',
    applicantCandidate: INITIAL_CANDIDATES[1], // Diya Sen
    targetRole: 'UI/UX Product Designer',
    pitchMessage: 'Hi Aarav! I saw NeuroGrid needs a UI/UX Product Designer. My background in Human-Computer Interaction at BITS and design systems (React 19 + Motion) will give your renewable balancer a judge-winning live grid dispatch visualizer. Plus, my addition boosts your team synergy (+24 synergy)!',
    weeklyHoursOffered: 30,
    timestamp: '45 mins ago',
    status: 'pending',
    isIncomingToUserTeam: true
  },
  {
    id: 'app-incoming-2',
    teamId: 'proj-hackathon-2026',
    teamName: 'NeuroGrid (Your Team)',
    hackathonName: 'Global Sustainability Hackathon Sprint 2026',
    applicantCandidate: INITIAL_CANDIDATES[3], // Ananya Iyer
    targetRole: 'Domain & Product Strategist',
    pitchMessage: 'Hey Aarav & Kabir! 6x hackathon pitch winner here from IIT Delhi ECE. I can build our utility financial ROI model, choreograph the 3-minute jury pitch, and handle live QA with judges so the team scores maximum marks on commercial viability.',
    weeklyHoursOffered: 35,
    timestamp: '2 hours ago',
    status: 'pending',
    isIncomingToUserTeam: true
  }
];
