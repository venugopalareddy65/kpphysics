import heroImage from '../assets/images/hero_student_atomic_cosmos_1791096976280.jpg';
import heroQuantumDiagram from '../assets/images/home_quantum_atom_diagram_1791096554206.jpg';
import heroSecondaryImage from '../assets/images/hero_physics_academy_1791088080378.jpg';
import mechanicsImage from '../assets/images/course_mechanics_rotational_1791088103626.jpg';
import opticsImage from '../assets/images/course_electromagnetism_optics_1791088117260.jpg';
import modernPhysicsImage from '../assets/images/course_modern_quantum_physics_1791088128518.jpg';

export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  targetExam: string;
  classLevel: string;
  streakDays: number;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
}

export type LessonType = 'VIDEO' | 'PDF' | 'QUIZ' | 'SIMULATION';

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  formulaSummary: string;
  keyTakeaways: string[];
  videoSummary?: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  position: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: 'CLASS_10' | 'CLASS_11' | 'CLASS_12' | 'JEE' | 'NEET' | 'COMPETITIVE';
  boardTags: string[];
  topicDomain: string;
  description: string;
  instructor: string;
  totalHours: number;
  thumbnail: string;
  chapters: Chapter[];
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  formulaHint?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  marks: number;
  negativeMarks: number;
}

export interface MockTest {
  id: string;
  courseId: string;
  title: string;
  examCategory: 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET' | 'CBSE_BOARD' | 'CHAPTER_TEST';
  topic: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
}

export interface TestAttemptResult {
  id: string;
  testId: string;
  testTitle: string;
  examCategory: string;
  userId: string;
  userName: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeTakenSeconds: number;
  answers: Record<string, string>;
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: 'PDF_NOTES' | 'FORMULA_BOOK' | 'QUESTION_BANK' | 'PREVIOUS_PAPER' | 'IMPORTANT_QUESTIONS';
  topic: string;
  targetLevel: string;
  pages: number;
  fileSize: string;
  previewFormulas: { name: string; equation: string; context: string }[];
  summary: string;
}

export interface AssignmentItem {
  id: string;
  courseId: string;
  title: string;
  topic: string;
  dueDate: string;
  maxMarks: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  marksAwarded?: number;
  problemStatement: string;
}

export const HERO_VISUAL = heroImage;

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-class-10',
    title: 'Class 10 Physics',
    slug: 'class-10-physics',
    category: 'CLASS_10',
    boardTags: ['CBSE', 'ICSE'],
    topicDomain: 'Beginner · 12 Chapters · 240+ Lectures',
    description: 'Comprehensive Physics course for Class 10 based on CBSE & ICSE syllabus. Build strong concepts in Light, Human Eye, Electricity, and Magnetic Effects of Current.',
    instructor: 'Prof. K. P. Vishwanath',
    totalHours: 120,
    thumbnail: opticsImage,
    chapters: [
      {
        id: 'c10-ch1',
        courseId: 'course-class-10',
        position: 1,
        title: 'Chapter 1: Light — Reflection and Refraction',
        description: 'Spherical mirrors, mirror formula, refractive index, and thin lens ray diagrams.',
        lessons: [
          {
            id: 'c10-l1',
            chapterId: 'c10-ch1',
            title: 'Spherical Mirrors & Sign Convention Rules',
            type: 'VIDEO',
            durationMinutes: 45,
            formulaSummary: '1/v + 1/u = 1/f  ·  m = -v/u',
            keyTakeaways: [
              'All distances are measured from the pole of the mirror along the principal axis.',
              'Focal length of a concave mirror is negative; convex mirror is positive.'
            ]
          },
          {
            id: 'c10-l2',
            chapterId: 'c10-ch1',
            title: 'Snell’s Law of Refraction & Lens Formula',
            type: 'VIDEO',
            durationMinutes: 50,
            formulaSummary: 'n₁ sin i = n₂ sin r  ·  1/v - 1/u = 1/f',
            keyTakeaways: [
              'Refractive index n = c / v relates vacuum speed of light to phase velocity in medium.',
              'Power of a lens P = 1 / f(meters) measured in Dioptres (D).'
            ]
          }
        ]
      },
      {
        id: 'c10-ch2',
        courseId: 'course-class-10',
        position: 2,
        title: 'Chapter 2: Electricity & Ohm’s Law Networks',
        description: 'Electric potential, drift resistance, series/parallel combinations, and Joule heating.',
        lessons: [
          {
            id: 'c10-l3',
            chapterId: 'c10-ch2',
            title: 'Ohm’s Law, Resistivity & Wire Stretching',
            type: 'VIDEO',
            durationMinutes: 40,
            formulaSummary: 'V = I R  ·  R = ρ L / A  ·  H = I² R t',
            keyTakeaways: [
              'Resistivity depends exclusively on material nature and temperature.',
              'Stretching a wire to n times its length increases resistance to n²R.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-class-11',
    title: 'Class 11 Physics',
    slug: 'class-11-physics',
    category: 'CLASS_11',
    boardTags: ['CBSE', 'ICSE'],
    topicDomain: 'Intermediate · 14 Chapters · 320+ Lectures',
    description: 'Master vectors, kinematics, laws of motion, work-energy, rotational dynamics, gravitation, thermodynamics, and waves with real-life examples.',
    instructor: 'Prof. K. P. Vishwanath',
    totalHours: 160,
    thumbnail: mechanicsImage,
    chapters: [
      {
        id: 'c11-ch1',
        courseId: 'course-class-11',
        position: 1,
        title: 'Chapter 1: Kinematics & Projectile Motion',
        description: 'Motion in a straight line, relative velocity vectors, and oblique projectile trajectories.',
        lessons: [
          {
            id: 'c11-l1',
            chapterId: 'c11-ch1',
            title: 'Oblique Projectile & Trajectory Equation Derivation',
            type: 'VIDEO',
            durationMinutes: 48,
            formulaSummary: 'y = x tan θ - g x² / (2 u² cos² θ)',
            keyTakeaways: [
              'Horizontal velocity component u cos θ remains invariant throughout flight.',
              'Complementary angles θ and (90° - θ) yield identical horizontal range.'
            ]
          },
          {
            id: 'c11-l2',
            chapterId: 'c11-ch1',
            title: 'Interactive Projectile Simulation Lab',
            type: 'SIMULATION',
            durationMinutes: 30,
            formulaSummary: 'R = u² sin(2θ) / g  ·  H_max = u² sin²θ / (2g)',
            keyTakeaways: [
              'Maximum horizontal range occurs at θ = 45°.',
              'Radius of curvature at apex is (u cos θ)² / g.'
            ]
          }
        ]
      },
      {
        id: 'c11-ch2',
        courseId: 'course-class-11',
        position: 2,
        title: 'Chapter 2: System of Particles & Rotational Motion',
        description: 'Center of mass, torque, angular momentum conservation, and rolling motion.',
        lessons: [
          {
            id: 'c11-l3',
            chapterId: 'c11-ch2',
            title: 'Moment of Inertia & Parallel Axis Theorem',
            type: 'VIDEO',
            durationMinutes: 55,
            formulaSummary: 'I = I_cm + M d²  ·  τ = I α',
            keyTakeaways: [
              'Perpendicular axis theorem I_z = I_x + I_y applies to planar laminae.',
              'Rolling without slipping satisfies v_cm = ω R.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-class-12',
    title: 'Class 12 Physics',
    slug: 'class-12-physics',
    category: 'CLASS_12',
    boardTags: ['CBSE', 'ICSE'],
    topicDomain: 'Advanced · 16 Chapters · 380+ Lectures',
    description: 'Comprehensive Physics course for Class 12 based on CBSE & ICSE syllabus. Build strong concepts, practice with MCQs, and prepare for board exams and competitive exams.',
    instructor: 'Prof. K. P. Vishwanath',
    totalHours: 190,
    thumbnail: modernPhysicsImage,
    chapters: [
      {
        id: 'c12-ch1',
        courseId: 'course-class-12',
        position: 1,
        title: 'Chapter 1: Electric Charges and Fields',
        description: 'Coulomb’s law in vector form, electric dipole field, electric flux, and Gauss’s theorem.',
        lessons: [
          {
            id: 'les-coulomb-1',
            chapterId: 'c12-ch1',
            title: 'Coulomb’s Law & Superposition Principle',
            type: 'VIDEO',
            durationMinutes: 45,
            formulaSummary: 'F = (1 / 4πε₀) (q₁ q₂ / r²) r̂',
            keyTakeaways: [
              'Electrostatic force is conservative and obeys Newton’s third law.',
              'Permittivity of free space ε₀ = 8.854 × 10⁻¹² C² N⁻¹ m⁻².'
            ]
          },
          {
            id: 'les-gauss-2',
            chapterId: 'c12-ch1',
            title: 'Electric Flux & Gauss’s Law Applications',
            type: 'VIDEO',
            durationMinutes: 50,
            formulaSummary: 'Φ_E = ∮ E · dA = q_enclosed / ε₀',
            keyTakeaways: [
              'Electric field inside a uniformly charged spherical shell is zero.',
              'Field outside behaves as if all charge were concentrated at the center.'
            ]
          }
        ]
      },
      {
        id: 'c12-ch2',
        courseId: 'course-class-12',
        position: 2,
        title: 'Chapter 2: Electrostatic Potential and Capacitance',
        description: 'Equipotential surfaces, dipole potential energy, parallel plate capacitors, and dielectrics.',
        lessons: [
          {
            id: 'les-cap-1',
            chapterId: 'c12-ch2',
            title: 'Parallel Plate Capacitor & Dielectric Insertion',
            type: 'VIDEO',
            durationMinutes: 42,
            formulaSummary: 'C = K ε₀ A / d  ·  U = ½ C V²',
            keyTakeaways: [
              'Inserting dielectric K with battery disconnected reduces potential V by factor K.',
              'Energy density stored in electric field is u = ½ ε₀ E².'
            ]
          }
        ]
      },
      {
        id: 'c12-ch3',
        courseId: 'course-class-12',
        position: 3,
        title: 'Chapter 3: Current Electricity',
        description: 'Drift velocity, mobility, Kirchhoff’s junction and loop laws, Wheatstone bridge, and potentiometer.',
        lessons: [
          {
            id: 'les-curr-1',
            chapterId: 'c12-ch3',
            title: 'Drift Velocity, Current Density & Kirchhoff’s Laws',
            type: 'VIDEO',
            durationMinutes: 48,
            formulaSummary: 'I = n e A v_d  ·  J = σ E  ·  ∑ ΔV = 0',
            keyTakeaways: [
              'Kirchhoff’s First Law (KCL) is based on conservation of electric charge.',
              'Kirchhoff’s Second Law (KVL) is based on conservation of energy.'
            ]
          },
          {
            id: 'les-curr-2',
            chapterId: 'c12-ch3',
            title: 'Wheatstone Bridge & Meter Bridge Precision Balancing',
            type: 'PDF',
            durationMinutes: 30,
            formulaSummary: 'P / Q = R / S (at null deflection I_g = 0)',
            keyTakeaways: [
              'At balance point, swapping cell and galvanometer leaves null condition unchanged.'
            ]
          }
        ]
      },
      {
        id: 'c12-ch4',
        courseId: 'course-class-12',
        position: 4,
        title: 'Chapter 4: Moving Charges and Magnetism',
        description: 'Magnetic Lorentz force, Biot-Savart law, Ampere’s circuital law, cyclotron, and moving coil galvanometer.',
        lessons: [
          {
            id: 'les-mag-1',
            chapterId: 'c12-ch4',
            title: 'Magnetic Lorentz Force & Helical Particle Trajectories',
            type: 'VIDEO',
            durationMinutes: 46,
            formulaSummary: 'F_m = q (v × B) = q v B sin θ',
            keyTakeaways: [
              'Magnetic force is always perpendicular to velocity v, so work done by magnetic force is zero.',
              'Radius of circular path in perpendicular B field is r = m v / (q B).'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-jee-main',
    title: 'JEE Main Physics',
    slug: 'jee-main-physics',
    category: 'JEE',
    boardTags: ['JEE', 'CBSE / ICSE'],
    topicDomain: 'Advanced · 12 Chapters · 280+ Lectures',
    description: 'High-scoring JEE Main Physics mastery covering Mechanics, Electrodynamics, Optics, Thermodynamics, and Modern Physics with 15-year PYQ drills.',
    instructor: 'Prof. K. P. Vishwanath',
    totalHours: 150,
    thumbnail: mechanicsImage,
    chapters: [
      {
        id: 'jm-ch1',
        courseId: 'course-jee-main',
        position: 1,
        title: 'Chapter 1: Rotational Dynamics & Angular Momentum',
        description: 'Combined translation and rotation, instantaneous axis of rotation, and toppling.',
        lessons: [
          {
            id: 'jm-l1',
            chapterId: 'jm-ch1',
            title: 'Pure Rolling on Inclined Planes & Conservation of L',
            type: 'VIDEO',
            durationMinutes: 52,
            formulaSummary: 'L_p = L_cm + r_cm × (M v_cm)',
            keyTakeaways: [
              'Angular momentum about point of contact is conserved even when friction acts.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-jee-advanced',
    title: 'JEE Advanced Physics',
    slug: 'jee-advanced-physics',
    category: 'COMPETITIVE',
    boardTags: ['JEE Advanced', 'CBSE / ICSE'],
    topicDomain: 'Expert · 15 Chapters · 360+ Lectures',
    description: 'Deep analytical multi-concept problem solving for JEE Advanced and Physics Olympiads—non-inertial frames, variable mass, Maxwell stress, and wave optics.',
    instructor: 'Prof. K. P. Vishwanath',
    totalHours: 180,
    thumbnail: modernPhysicsImage,
    chapters: [
      {
        id: 'ja-ch1',
        courseId: 'course-jee-advanced',
        position: 1,
        title: 'Chapter 1: Advanced Electrodynamics & Induced Fields',
        description: 'Time-varying magnetic fields, non-conservative induced electric fields, and LC oscillations.',
        lessons: [
          {
            id: 'ja-l1',
            chapterId: 'ja-ch1',
            title: 'Induced Electric Field in Cylindrical Solenoids',
            type: 'VIDEO',
            durationMinutes: 55,
            formulaSummary: '∮ E_ind · dl = -dΦ_B / dt',
            keyTakeaways: [
              'Inside solenoid (r < R), E_ind = (r / 2) |dB/dt|; outside (r > R), E_ind = (R² / 2r) |dB/dt|.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-neet-physics',
    title: 'NEET Physics',
    slug: 'neet-physics',
    category: 'NEET',
    boardTags: ['NEET', 'NCERT Class 11 & 12'],
    topicDomain: 'Advanced · 12 Chapters · 260+ Lectures',
    description: 'Speed-accuracy training for NEET UG aspirants. Master all 45 Physics questions in under 40 minutes using dimensional shortcuts and NCERT line-by-line concepts.',
    instructor: 'Dr. Ananya Deshmukh',
    totalHours: 140,
    thumbnail: opticsImage,
    chapters: [
      {
        id: 'neet-ch1',
        courseId: 'course-neet-physics',
        position: 1,
        title: 'Chapter 1: Ray Optics, Wave Optics & Semiconductor Devices',
        description: 'Lens combinations, optical instruments, YDSE, and logic gates for 180/180 NEET target.',
        lessons: [
          {
            id: 'neet-l1',
            chapterId: 'neet-ch1',
            title: 'Lens Maker’s Equation & Silvered Lenses',
            type: 'VIDEO',
            durationMinutes: 44,
            formulaSummary: '1/f = (n₂/n₁ - 1)(1/R₁ - 1/R₂)',
            keyTakeaways: [
              'When immersed in a medium of higher refractive index than lens, converging lens becomes diverging.'
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_TESTS: MockTest[] = [
  {
    id: 'test-c12-magnetism',
    courseId: 'course-class-12',
    title: 'Class 12 Physics · Chapter Test (Moving Charges & Magnetism)',
    examCategory: 'CHAPTER_TEST',
    topic: 'Magnetism & Electrodynamics',
    durationMinutes: 30,
    totalMarks: 20,
    questions: [
      {
        id: 'q1',
        questionText: 'A particle of charge q is moving with velocity v in a uniform magnetic field B at an angle θ with the magnetic field vector. The magnitude of magnetic Lorentz force on the particle is:',
        formulaHint: 'F = |q (v × B)|',
        options: [
          { id: 'q1-a', text: 'q v B' },
          { id: 'q1-b', text: 'q v B sin θ' },
          { id: 'q1-c', text: 'q v B cos θ' },
          { id: 'q1-d', text: 'q v² B' }
        ],
        correctOptionId: 'q1-b',
        explanation: 'By the magnetic Lorentz force law, F = q(v × B). Taking the magnitude of the cross product gives |F| = q v B sin θ, where θ is the angle between velocity vector v and magnetic field vector B.',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q2',
        questionText: 'A proton and an alpha particle enter a uniform magnetic field perpendicularly with the same kinetic energy. The ratio of the radii of their circular paths (r_proton : r_alpha) is:',
        formulaHint: 'r = √(2 m K) / (q B)',
        options: [
          { id: 'q2-a', text: '1 : 1' },
          { id: 'q2-b', text: '1 : 2' },
          { id: 'q2-c', text: '2 : 1' },
          { id: 'q2-d', text: '1 : 4' }
        ],
        correctOptionId: 'q2-a',
        explanation: 'Since r = √(2mK)/(qB) and for an alpha particle m_α = 4m_p and q_α = 2q_p, we get r_α ∝ √4 / 2 = 1. Thus r_proton : r_alpha = 1 : 1.',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q3',
        questionText: 'Two long parallel straight wires carry currents I₁ and I₂ in the same direction separated by distance d. The nature of magnetic force between them is:',
        formulaHint: 'F / L = (μ₀ I₁ I₂) / (2π d)',
        options: [
          { id: 'q3-a', text: 'Repulsive and inversely proportional to d²' },
          { id: 'q3-b', text: 'Attractive and inversely proportional to d' },
          { id: 'q3-c', text: 'Repulsive and inversely proportional to d' },
          { id: 'q3-d', text: 'Zero' }
        ],
        correctOptionId: 'q3-b',
        explanation: 'Parallel currents in the same direction attract each other with force per unit length F/L = μ₀ I₁ I₂ / (2πd).',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q4',
        questionText: 'The magnetic field B at the center of a circular current-carrying coil of radius R having N turns and carrying current I is:',
        formulaHint: 'Biot-Savart Law integrated over circular loop.',
        options: [
          { id: 'q4-a', text: 'μ₀ N I / (2 R)' },
          { id: 'q4-b', text: 'μ₀ N I / (2π R)' },
          { id: 'q4-c', text: 'μ₀ N I / R' },
          { id: 'q4-d', text: 'μ₀ N I / (4R)' }
        ],
        correctOptionId: 'q4-a',
        explanation: 'Using Biot-Savart law at the center of a circular loop of radius R with N turns, B = μ₀ N I / (2R).',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q5',
        questionText: 'A charged particle moves through a region of uniform magnetic field B. Which of the following quantities of the particle always remains constant during its motion?',
        formulaHint: 'Work done by magnetic force W = ∫ F_m · dr = 0',
        options: [
          { id: 'q5-a', text: 'Linear velocity vector v' },
          { id: 'q5-b', text: 'Linear momentum vector p' },
          { id: 'q5-c', text: 'Kinetic energy and speed' },
          { id: 'q5-d', text: 'Displacement from origin' }
        ],
        correctOptionId: 'q5-c',
        explanation: 'Since F_m = q(v × B) is always perpendicular to v, instantaneous power P = F · v = 0. By work-energy theorem, kinetic energy and scalar speed remain strictly constant.',
        marks: 4,
        negativeMarks: 1
      }
    ]
  },
  {
    id: 'test-electrostatics',
    courseId: 'course-class-12',
    title: 'Electrostatics & Gauss Law Mock Test',
    examCategory: 'JEE_MAIN',
    topic: 'Electricity',
    durationMinutes: 20,
    totalMarks: 16,
    questions: [
      {
        id: 'q201',
        questionText: 'A parallel plate air capacitor has capacitance C. Half of the space between the plates is filled with a dielectric slab of dielectric constant K = 4 parallel to the plates (thickness d/2). The new capacitance becomes:',
        formulaHint: 'Series combination of air layer (d/2) and dielectric layer (d/2).',
        options: [
          { id: 'q201-a', text: '(8/5) C' },
          { id: 'q201-b', text: '(5/8) C' },
          { id: 'q201-c', text: '2.5 C' },
          { id: 'q201-d', text: '(4/3) C' }
        ],
        correctOptionId: 'q201-a',
        explanation: 'Effective distance d_eff = d/2 + (d/2)/K = d/2(1 + 1/4) = 5d/8. Thus C_new = ε₀A / (5d/8) = (8/5) C.',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q202',
        questionText: 'An electric dipole of dipole moment p is placed in a uniform external electric field E in stable equilibrium. The work done in rotating the dipole slowly to unstable equilibrium is:',
        formulaHint: 'W = U_final - U_initial = -pE cos(180°) - (-pE cos(0°))',
        options: [
          { id: 'q202-a', text: '+2 p E' },
          { id: 'q202-b', text: '+p E' },
          { id: 'q202-c', text: 'Zero' },
          { id: 'q202-d', text: '-2 p E' }
        ],
        correctOptionId: 'q202-a',
        explanation: 'At stable equilibrium θ₁ = 0°, U₁ = -pE. At unstable equilibrium θ₂ = 180°, U₂ = +pE. Work done W = U₂ - U₁ = 2pE.',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q203',
        questionText: 'Total electric flux emerging from a unit positive charge (+1 C) placed in air is:',
        formulaHint: 'Gauss’s Law: Φ = q / ε₀',
        options: [
          { id: 'q203-a', text: 'ε₀' },
          { id: 'q203-b', text: '1 / ε₀' },
          { id: 'q203-c', text: '4π ε₀' },
          { id: 'q203-d', text: 'Zero' }
        ],
        correctOptionId: 'q203-b',
        explanation: 'By Gauss’s theorem, Φ_E = q_enclosed / ε₀. For q = +1 C, Φ_E = 1 / ε₀.',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q204',
        questionText: 'Eight identical mercury droplets, each charged to a potential of 5 V, coalesce to form a single bigger spherical drop. The potential of the new big drop is:',
        formulaHint: 'V_big = n^(2/3) V_small',
        options: [
          { id: 'q204-a', text: '20 V' },
          { id: 'q204-b', text: '40 V' },
          { id: 'q204-c', text: '10 V' },
          { id: 'q204-d', text: '80 V' }
        ],
        correctOptionId: 'q204-a',
        explanation: 'For n = 8 droplets coalescing, R = 8^(1/3) r = 2r and Q = 8q. Thus V_big = 8^(2/3) × 5 V = 4 × 5 V = 20 V.',
        marks: 4,
        negativeMarks: 1
      }
    ]
  },
  {
    id: 'test-full-syllabus',
    courseId: 'course-jee-main',
    title: 'Full Syllabus Mock Test (Mechanics, Optics & Modern Physics)',
    examCategory: 'JEE_ADVANCED',
    topic: 'Full Physics Syllabus',
    durationMinutes: 15,
    totalMarks: 12,
    questions: [
      {
        id: 'q301',
        questionText: 'The threshold wavelength for photoelectric emission from a metal surface is 6000 Å. If ultraviolet light of wavelength 4000 Å is incident on the metal (take hc = 12420 eV·Å), the stopping potential V₀ is:',
        formulaHint: 'e V₀ = hc(1/λ - 1/λ₀)',
        options: [
          { id: 'q301-a', text: '1.035 V' },
          { id: 'q301-b', text: '2.070 V' },
          { id: 'q301-c', text: '3.105 V' },
          { id: 'q301-d', text: '0.520 V' }
        ],
        correctOptionId: 'q301-a',
        explanation: 'E_photon = 12420 / 4000 = 3.105 eV. Work function Φ₀ = 12420 / 6000 = 2.070 eV. Stopping potential V₀ = 1.035 V.',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q302',
        questionText: 'A projectile is fired from horizontal ground with initial speed u = 40 m/s at an angle θ = 30° above the horizontal (g = 10 m/s²). What is the radius of curvature of its trajectory at the highest point?',
        formulaHint: 'r = (u cos θ)² / g',
        options: [
          { id: 'q302-a', text: '120 m' },
          { id: 'q302-b', text: '80 m' },
          { id: 'q302-c', text: '160 m' },
          { id: 'q302-d', text: '60 m' }
        ],
        correctOptionId: 'q302-a',
        explanation: 'At apex, v = u cos 30° = 20√3 m/s. Radius of curvature r = v²/g = 1200/10 = 120 m.',
        marks: 4,
        negativeMarks: 1
      },
      {
        id: 'q303',
        questionText: 'In the Bohr model of the hydrogen atom, the ratio of the radius of the third stationary orbit (n = 3) to the first Bohr orbit (n = 1) is:',
        formulaHint: 'r_n = r₀ n² / Z',
        options: [
          { id: 'q303-a', text: '9 : 1' },
          { id: 'q303-b', text: '3 : 1' },
          { id: 'q303-c', text: '27 : 1' },
          { id: 'q303-d', text: '1 : 9' }
        ],
        correctOptionId: 'q303-a',
        explanation: 'Orbital radius is proportional to n². Hence r₃ / r₁ = 3² / 1² = 9 : 1.',
        marks: 4,
        negativeMarks: 1
      }
    ]
  }
];

export const STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    title: 'Complete Mechanics & Rotational Dynamics Formula Compendium',
    category: 'FORMULA_BOOK',
    topic: 'Mechanics',
    targetLevel: 'JEE Main / Advanced & Class 11',
    pages: 42,
    fileSize: '2.4 MB',
    summary: 'Every standard moment of inertia tensor, center of mass coordinate, collision coefficient e relation, and Keplerian orbit equation in one reference handbook.',
    previewFormulas: [
      { name: 'Oblique Projectile Trajectory', equation: 'y = x tan θ (1 - x / R)', context: 'Valid for uniform gravity without drag where R is horizontal range.' },
      { name: 'Radius of Gyration Rolling Acceleration', equation: 'a = (g sin θ) / (1 + I_cm / M R²)', context: 'Pure rolling down an incline of angle θ.' },
      { name: 'Variable Mass Rocket Thrust', equation: 'F_thrust = -v_rel (dm / dt)', context: 'Tsiolkovsky rocket propulsion equation.' }
    ]
  },
  {
    id: 'mat-2',
    title: 'Electrodynamics, Gauss Law & AC Circuits Revision Notes',
    category: 'PDF_NOTES',
    topic: 'Electricity & Magnetism',
    targetLevel: 'Class 12 Boards & NEET UG',
    pages: 64,
    fileSize: '3.8 MB',
    summary: 'Hand-curated chapter notes with step-by-step vector field diagrams, Kirchhoff loop shortcuts, LCR phasor impedance triangles, and resonance quality factor Q derivations.',
    previewFormulas: [
      { name: 'Biot-Savart Magnetic Field of Finite Wire', equation: 'B = (μ₀ I) / (4π d) (sin φ₁ + sin φ₂)', context: 'Perpendicular distance d from straight current-carrying conductor.' },
      { name: 'Series LCR Impedance & Phase Angle', equation: 'Z = √(R² + (X_L - X_C)²)  ·  tan φ = (X_L - X_C)/R', context: 'Alternating current steady-state phasor analysis.' },
      { name: 'Cyclotron Angular Frequency', equation: 'ω_c = q B / m', context: 'Independent of particle velocity in non-relativistic limit.' }
    ]
  },
  {
    id: 'mat-3',
    title: 'JEE Main & NEET 15-Year Chapterwise Solved PYQ Archive (2011–2026)',
    category: 'PREVIOUS_PAPER',
    topic: 'All Physics Topics',
    targetLevel: 'JEE Main & NEET UG',
    pages: 128,
    fileSize: '6.1 MB',
    summary: 'Authentic past examination questions sorted by sub-topic with error-trap commentary and alternate dimensional analysis methods.',
    previewFormulas: [
      { name: 'Dimensional Homogeneity Principle', equation: '[P + a / V²] [V - b] = [n R T]', context: 'Van der Waals constants: [a] = ML⁵T⁻², [b] = L³.' },
      { name: 'Error Propagation in Power Products', equation: 'ΔZ / Z = p(ΔA / A) + q(ΔB / B)', context: 'Maximum fractional error for Z = A^p B^q.' }
    ]
  },
  {
    id: 'mat-4',
    title: 'Modern Physics, Optics & Semiconductors 250 High-Yield Problems',
    category: 'QUESTION_BANK',
    topic: 'Modern Physics & Optics',
    targetLevel: 'JEE Advanced & Olympiad',
    pages: 56,
    fileSize: '3.1 MB',
    summary: 'Selected multi-concept problems combining Compton recoil, Doppler shift of spectral lines, variable refractive index media, and Zener voltage regulation.',
    previewFormulas: [
      { name: 'Radioactive Decay & Mean Life', equation: 'N(t) = N₀ e^(-λt)  ·  T_half = ln(2) / λ = 0.693 τ', context: 'First-order nuclear transmutation kinetics.' },
      { name: 'Prism Minimum Deviation Refractive Index', equation: 'n = sin((A + δ_m) / 2) / sin(A / 2)', context: 'Symmetric ray passage where i₁ = i₂ and r₁ = r₂ = A/2.' }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-1',
    courseId: 'course-jee-mechanics',
    title: 'Problem Set 04: Angular Momentum Conservation in Eccentric Collisions',
    topic: 'Rotational Mechanics',
    dueDate: '2026-10-12',
    maxMarks: 30,
    status: 'PENDING',
    problemStatement: 'A uniform rod of mass M and length L lies at rest on a smooth horizontal table. A particle of mass m moving perpendicular to the rod with speed v₀ strikes one end elastically. Compute the post-collision angular velocity ω and center-of-mass velocity v_cm.'
  },
  {
    id: 'asg-2',
    courseId: 'course-neet-electrodynamics',
    title: 'Problem Set 02: Equivalent Capacitance of Infinite Ladder & Cube Networks',
    topic: 'Electrostatics',
    dueDate: '2026-10-08',
    maxMarks: 25,
    status: 'GRADED',
    marksAwarded: 23,
    problemStatement: 'Using equipotential symmetry and folding axes, derive the equivalent capacitance across body diagonal, face diagonal, and adjacent edge terminals of a 12-capacitor skeleton cube.'
  }
];

export const PHYSICS_TOPICS_TAXONOMY = [
  {
    id: 'topic-mechanics',
    name: 'Mechanics',
    chaptersCount: 9,
    problemsCount: 420,
    coreEquation: 'F_net = dp/dt  ·  τ_ext = dL/dt',
    subtopics: 'Kinematics, Newton’s Laws, Work-Energy, Center of Mass, Rigid Body Rotation, Gravitation, Fluid Mechanics'
  },
  {
    id: 'topic-thermo',
    name: 'Thermodynamics',
    chaptersCount: 4,
    problemsCount: 185,
    coreEquation: 'dQ = dU + P dV  ·  η = 1 - T_C / T_H',
    subtopics: 'Calorimetry, Kinetic Theory of Gases, Laws of Thermodynamics, Carnot Cycles, Radiation & Stefan’s Law'
  },
  {
    id: 'topic-waves',
    name: 'Waves & Oscillations',
    chaptersCount: 4,
    problemsCount: 190,
    coreEquation: 'd²x/dt² + ω²x = 0  ·  y(x,t) = A sin(kx - ωt)',
    subtopics: 'Simple Harmonic Motion, Damped Pendulums, Transverse String Waves, Organ Pipes, Beats & Doppler Shift'
  },
  {
    id: 'topic-optics',
    name: 'Optics',
    chaptersCount: 3,
    problemsCount: 240,
    coreEquation: '1/v - 1/u = 1/f  ·  Δx = d sin θ = n λ',
    subtopics: 'Spherical Mirrors, Thin Lens Combinations, Prism Dispersion, YDSE Interference, Single-Slit Diffraction & Brewster Law'
  },
  {
    id: 'topic-electricity',
    name: 'Electricity',
    chaptersCount: 4,
    problemsCount: 310,
    coreEquation: '∮ E · dA = q / ε₀  ·  ∑ ΔV_loop = 0',
    subtopics: 'Coulomb’s Law, Electric Potential, Dipoles, Capacitor Dielectrics, Kirchhoff’s Circuit Laws, RC Transient Charging'
  },
  {
    id: 'topic-magnetism',
    name: 'Magnetism & EMI',
    chaptersCount: 4,
    problemsCount: 275,
    coreEquation: 'F = q(E + v × B)  ·  ε = -dΦ_B / dt',
    subtopics: 'Biot-Savart Law, Ampere’s Circuital Law, Cyclotron Motion, Faraday-Lenz Induction, Self/Mutual Inductance & AC Phasors'
  },
  {
    id: 'topic-modern',
    name: 'Modern Physics',
    chaptersCount: 3,
    problemsCount: 210,
    coreEquation: 'hν = Φ₀ + K_max  ·  E_n = -13.6 Z² / n² eV',
    subtopics: 'Photoelectric Effect, Matter Waves, Bohr Atomic Spectra, Moseley’s X-Ray Law, Nuclear Binding Energy & Fission'
  },
  {
    id: 'topic-semiconductor',
    name: 'Semiconductor Physics',
    chaptersCount: 2,
    problemsCount: 130,
    coreEquation: 'n_e · n_h = n_i²  ·  Y = A · B',
    subtopics: 'Energy Bands in Solids, Intrinsic & Extrinsic Doping, p-n Junction Rectifiers, Zener Voltage Regulators & Digital Logic Gates'
  }
];

export const STUDENT_SUCCESS_RECORDS = [
  {
    id: 'stu-1',
    name: 'Aarav Kulkarni',
    exam: 'JEE Advanced 2026',
    achievement: 'All India Rank 142 · 114/120 in Physics',
    school: 'Pune Junior Science College',
    quote: 'Before joining KP Physics Academy, rotational mechanics and electrostatics felt like disconnected formulas. Prof. Vishwanath’s vector-first derivations and interactive trajectory labs raised my mock test accuracy from 64% to 95% in four months.'
  },
  {
    id: 'stu-2',
    name: 'Meera Nair',
    exam: 'NEET UG 2026',
    achievement: '705 / 720 Overall · 180/180 in Physics',
    school: 'Kochi National Public School',
    quote: 'Physics is usually the rank-decider for medical aspirants. The timed NEET high-speed chapter tests and error-trap formula compendiums helped me finish all 45 Physics questions in 38 minutes with zero negative marking.'
  },
  {
    id: 'stu-3',
    name: 'Rohan Sengupta',
    exam: 'CBSE Class 12 Boards & NSEP Qualifier',
    achievement: '99 / 100 in Physics · Top 1% NSEP National Merit',
    school: 'Kolkata South Point High School',
    quote: 'Having both CBSE derivation structure and Olympiad-level conceptual depth in the same curriculum saved me from juggling multiple coaching modules. Every single chapter test gave instant step-by-step solutions.'
  }
];
