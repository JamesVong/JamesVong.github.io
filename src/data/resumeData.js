export const education = [
  {
    school: 'Santa Clara University',
    location: 'Santa Clara, CA',
    degree: 'Master of Science in Computer Science and Engineering',
    dates: 'Sep. 2024 – Mar. 2026',
    gpa: '3.7',
    details: 'Relevant Coursework: Deep Learning, Distributed Systems, Advanced Algorithms, Parallel Computing, Artificial Intelligence',
  },
  {
    school: 'Santa Clara University',
    location: 'Santa Clara, CA',
    degree: 'Bachelor of Science in Computer Science and Engineering, Minor in Mathematics',
    dates: 'Sep. 2020 – Jun. 2024',
    gpa: '3.8',
    details: 'Magna Cum Laude · Dean\'s List 2020–2021 · Tau Beta Pi Engineering Honor Society, Member',
  },
]

export const publications = [
  {
    title: 'Fish2Mesh Transformer: 3D Human Mesh Recovery from Egocentric Vision',
    venue: 'ICCV 2025',
    authors: 'T. Shen, A. S. Puranik, J. Vong, et al.',
    description:
      'Accepted to International Conference on Computer Vision (top-tier, ~24% acceptance rate). Led the technical rebuttal strategy and manuscript refinement, addressing critical reviewer concerns on model complexity to secure acceptance.',
    links: [
      { url: 'https://fish2mesh.github.io/', label: 'Project Page' },
      { url: 'https://openaccess.thecvf.com/content/ICCV2025/papers/Shen_Fish2Mesh_Transformer_3D_Human_Mesh_Recovery_from_Egocentric_Vision_ICCV_2025_paper.pdf', label: 'Paper (PDF)' },
      { url: 'https://iccv.thecvf.com/virtual/2025/poster/648', label: 'Poster' },
      { url: 'https://www.linkedin.com/posts/james-vong_iccv2025-ugcPost-7358213719652225026-vAhb', label: 'LinkedIn' },
    ],
  },
]

export const experience = [
  {
    org: 'SCU Imaginarium AI Research Lab',
    advisor: 'Advisor: Dr. David Jeong',
    location: 'Santa Clara, CA',
    dates: 'Jul. 2024 – Present',
    role: 'Research Team Leader',
    bullets: [
      'Led a team exploring 3D Gaussian Splatting, succeeding the lab\'s prior focus on Mesh Transformers.',
      'Co-authored "Fish2Mesh Transformer", accepted to ICCV 2025 (top-tier AI conference, 24% acceptance rate).',
      'Developed reviewer rebuttal strategy addressing critiques on model complexity, led to acceptance.',
    ],
  },
  {
    org: 'SCU Internet of Things Research Lab',
    advisor: 'Advisor: Dr. Behnam Dezfouli',
    location: 'Santa Clara, CA',
    dates: 'Jun. 2023 – Jan. 2025',
    role: 'Research Assistant',
    bullets: [
      'Engineered C-based packet capture on Raspberry Pi, storing traffic in 10-second real-time batches.',
      'Benchmarked InfluxDB and DuckDB, identifying InfluxDB maintained a stable 5 MB RAM footprint.',
      'Developed 6 custom SQL algorithms to detect specific cybersecurity threats at the network edge.',
    ],
  },
]

export const projects = [
  {
    title: 'Chess Atlas',
    image: '/projects/chessatlasexplorer.png',
    date: 'Jan. 2025 – Present',
    category: 'AI / ML',
    description:
      'Built position recognition pipeline with YOLOv8 and MobileNetV3-Small, achieving 99.94% macro F1. Scaled dataset to 158,000 labeled images via semi-supervised learning; processed 2,046 videos with 8 parallel GPU workers using pixel-level change detection to skip 79% of frames. Full-stack (React + TypeScript, Flask + Gunicorn) deployed via Docker on Render & Vercel.',
    tags: ['YOLOv8', 'MobileNetV3', 'React', 'TypeScript', 'Flask', 'Docker'],
    links: [
      { url: 'https://chess-atlas.com', label: 'Live Site' },
      { url: 'https://www.linkedin.com/posts/james-vong_chess-machinelearning-computervision-ugcPost-7442315836629053441-UYsM', label: 'LinkedIn: Video Explorer' },
      { url: 'https://www.linkedin.com/posts/james-vong_machinelearning-computervision-chess-activity-7435865390712332288-Gg73', label: 'LinkedIn: Board Analysis' },
    ],
    featured: true,
  },
  {
    title: 'CADDesignAI',
    date: '2026',
    category: 'AI / Agentic',
    description:
      "Built for Andrew Ng's AI Fund builder challenge. Agentic Claude extension for Onshape that serializes live CAD models into LLM context, diagnosing and repairing sketch constraints (under/overconstrained) via a conversational Claude agent and parametric API mutations.",
    tags: ['Claude API', 'Onshape API', 'Agentic AI', 'Python'],
    links: null,
    featured: true,
  },
  {
    title: 'Extending DeiT-LT with Inductive Bias Distillation and Logit Adjustment for Long-Tailed Visual Recognition',
    date: '2026',
    category: 'AI / ML',
    description:
      "Graduate Deep Learning course project extending DeiT-LT (Data-Efficient Image Transformer). Trained ViTs to \"see\" like CNNs through out-of-distribution distillation for long-tail recognition. Reproduced the baseline and introduced four new loss function changes; trained on RunPod and local lab machines.",
    tags: ['PyTorch', 'ViT', 'Deep Learning', 'RunPod'],
    links: null,
  },
  {
    title: 'CUDA MLP: Parallel Backprop',
    date: '2024',
    category: 'Systems / AI',
    description:
      'Graduate Parallel Computing class project. Reproduced multilayer perceptron forward pass and backpropagation from scratch using CUDA. Benchmarked GPU vs CPU performance with OpenMP and analyzed warp-level behavior.',
    tags: ['CUDA', 'C++', 'OpenMP', 'GPU'],
    links: null,
  },
  {
    title: 'Study Rush',
    image: '/projects/studyrush.png',
    date: 'Jun. 2024',
    category: 'Hackathon',
    description:
      'UC Berkeley AI Hackathon. Flashcard study app with Python Flask backend and PostgreSQL. Designed UI in Figma; deployed with Docker. Integrated ChatGPT API with a partner to enhance user experience.',
    tags: ['Flask', 'PostgreSQL', 'Docker', 'ChatGPT API', 'Figma'],
    links: [
      { url: 'https://devpost.com/software/study-rush', label: 'Devpost' },
    ],
  },
  {
    title: 'Sunken Cost',
    image: '/projects/sunkencost.jpg',
    date: 'Apr. 2024',
    category: 'Hackathon · Game',
    description:
      'Roblox Hack: Led a team entirely new to Roblox development through game ideation and Lua development. Earned $600 first-place prize and a newspaper editorial from The Santa Clara.',
    tags: ['Lua', 'Roblox Studio', 'Game Dev'],
    links: [
      { url: 'https://devpost.com/software/sunken-cost', label: 'Devpost' },
      { url: 'https://www.linkedin.com/posts/james-vong_robloxhack-santaclarauniversity-acm-activity-7189285401134579712-Pgv3', label: 'LinkedIn' },
      { url: 'https://www.thesantaclara.org/blog/roblox-announces-winners-of-santa-claras-roblox-hackathon', label: 'Article: The Santa Clara' },
    ],
    featured: true,
  },
  {
    title: 'ProgressPlanted',
    image: '/projects/ProgressPlanted.jpg',
    date: 'Feb. 2023',
    category: 'Hackathon',
    description:
      'Hack for Humanity. Productivity site organizing tasks into visual skill trees with branching sub-goals. Node.js + Express.js REST API, Firebase Realtime Database, React frontend.',
    tags: ['Node.js', 'Express.js', 'Firebase', 'React'],
    links: [
      { url: 'https://devpost.com/software/progressplanted', label: 'Devpost' },
    ],
  },
  {
    title: 'Chillspaces',
    image: '/projects/chillspaces.jpg',
    date: 'Nov. 2022',
    category: 'Hackathon',
    description:
      'INRIX Hackathon. REST API in Python Flask for finding quiet, relaxing spots on a map by querying multiple external APIs. Won 2nd place out of 200+ participants.',
    tags: ['Flask', 'REST API', 'Python'],
    links: [
      { url: 'https://devpost.com/software/chillspaces', label: 'Devpost' },
      { url: 'https://www.linkedin.com/posts/james-vong_a-couple-of-weeks-ago-i-participated-in-activity-7003764025884893185-5QBn', label: 'LinkedIn' },
    ],
    featured: true,
  },
  {
    title: 'Seek - Career Navigator',
    image: '/projects/seekcareernav.jpg',
    date: 'Feb. 2021',
    category: 'Hackathon',
    description:
      'Hack for Humanity. Career exploration website with a Flask login backend built in 24 hours.',
    tags: ['Flask', 'Python'],
    links: [
      { url: 'https://devpost.com/software/career-navigator-app', label: 'Devpost' },
      { url: 'https://www.linkedin.com/posts/james-vong_completed-my-first-ever-hackathon-this-weekend-activity-6770397732311064576-0EJ6', label: 'LinkedIn' },
    ],
  },
]

export const skills = {
  languages: ['Python', 'C/C++', 'SQL', 'JavaScript (Node.js)', 'TypeScript'],
  frameworks: ['React', 'Flask', 'Pandas', 'OpenCV', 'NumPy', 'TensorFlow', 'PyTorch'],
  tools: ['Git & GitHub', 'Docker', 'Google Cloud Platform', 'Linux'],
  databases: ['PostgreSQL', 'SQLite', 'DuckDB', 'InfluxDB', 'MongoDB'],
}
