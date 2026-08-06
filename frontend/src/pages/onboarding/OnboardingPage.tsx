import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Check,
  Search,
  Sparkles,
  Briefcase,
  GraduationCap,
  RefreshCw,
  Rocket,
  UserCheck,
  Sliders,
} from "lucide-react"

import { PROTECTED_ROUTES } from "@/constants/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useProfile } from "@/hooks/useProfile"
import type { UserType, SkillLevel, LearningStyle } from "@/types/profile.types"

const ROLES: Array<{ id: UserType; label: string; desc: string; icon: any }> = [
  { id: "Student", label: "Student", desc: "In school, college, or self-teaching", icon: GraduationCap },
  { id: "Working Professional", label: "Working Professional", desc: "Employed, looking to level up", icon: Briefcase },
  { id: "Career Switcher", label: "Career Switcher", desc: "Transitioning from another field", icon: RefreshCw },
  { id: "Freelancer", label: "Freelancer", desc: "Building client projects independently", icon: Rocket },
  { id: "Founder", label: "Founder", desc: "Building startups & products", icon: Sparkles },
  { id: "Job Seeker", label: "Job Seeker", desc: "Actively interviewing & job hunting", icon: UserCheck },
  { id: "Other", label: "Other", desc: "Exploring software & technology", icon: Sliders },
]

const INTEREST_OPTIONS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Cyber Security",
  "Cloud Computing",
  "DevOps",
  "Android",
  "iOS",
  "Game Development",
  "UI/UX Design",
  "Blockchain",
  "AR/VR",
  "IoT",
  "Embedded Systems",
  "Competitive Programming",
  "Open Source",
  "Product Management",
  "Startup",
  "Other",
]

const SKILL_LEVELS: Array<{ id: SkillLevel; label: string; desc: string }> = [
  { id: "Beginner", label: "Beginner", desc: "Just starting out with coding basics" },
  { id: "Intermediate", label: "Intermediate", desc: "Built projects, comfortable with core specs" },
  { id: "Advanced", label: "Advanced", desc: "Experienced developer building complex systems" },
  { id: "Professional", label: "Professional", desc: "Production engineer optimizing architectures" },
]

const GOAL_OPTIONS = [
  "Get first internship",
  "Get first job",
  "Become Full Stack Developer",
  "Become AI Engineer",
  "Switch career",
  "Crack FAANG",
  "Improve coding skills",
  "Build startup",
  "Become Freelancer",
  "Custom Goal",
]

const TECH_OPTIONS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Node",
  "Python", "Java", "C++", "C#", "Go", "Rust", "SQL",
  "MongoDB", "PostgreSQL", "Docker", "Git", "AWS", "Figma",
  "GraphQL", "Next.js", "Tailwind", "Kubernetes", "Linux",
]

const LEARNING_STYLES: Array<{ id: LearningStyle; label: string; desc: string }> = [
  { id: "Video", label: "Video Tutorials", desc: "Visual step-by-step walkthroughs" },
  { id: "Reading", label: "Reading & Docs", desc: "Deep technical articles and documentation" },
  { id: "Projects", label: "Project-Based", desc: "Learn by building real-world software" },
  { id: "Mentorship", label: "Mentorship & Guidance", desc: "Structured AI code reviews and feedback" },
  { id: "Practice", label: "Practice & Drills", desc: "Interactive coding exercises and challenges" },
  { id: "Mixed", label: "Mixed Approach", desc: "Balanced combination of all formats" },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { profile, completeOnboarding } = useProfile()

  const [step, setStep] = useState(1)

  // Step 1 State
  const [name, setName] = useState(profile.name || "")
  const [nickname, setNickname] = useState(profile.nickname || "")

  // Step 2 State
  const [userType, setUserType] = useState<UserType | string>(profile.userType || "Student")

  // Step 3 State
  const [interestSearch, setInterestSearch] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.interests.length > 0 ? profile.interests : ["Frontend Development"],
  )

  // Step 4 State
  const [skillLevel, setSkillLevel] = useState<SkillLevel | string>(
    profile.skillLevel || "Intermediate",
  )

  // Step 5 State
  const [selectedGoal, setSelectedGoal] = useState<string>(
    profile.primaryGoal || "Become Full Stack Developer",
  )
  const [customGoal, setCustomGoal] = useState("")

  // Step 6 State
  const [weeklyHours, setWeeklyHours] = useState<number>(profile.weeklyHours || 10)

  // Step 7 State
  const [techSearch, setTechSearch] = useState("")
  const [knownTechs, setKnownTechs] = useState<string[]>(
    profile.knownTechnologies.length > 0 ? profile.knownTechnologies : ["HTML", "CSS", "JavaScript", "React"],
  )

  // Step 8 State (Optional Uploads)
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || "")
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || "")

  // Step 9 State
  const [learningStyle, setLearningStyle] = useState<LearningStyle | string>(
    profile.learningStyle || "Projects",
  )

  // Step 10 State (AI Generation Loading)
  const [generationStep, setGenerationStep] = useState(0)

  const filteredInterests = useMemo(() => {
    if (!interestSearch.trim()) return INTEREST_OPTIONS
    return INTEREST_OPTIONS.filter((i) =>
      i.toLowerCase().includes(interestSearch.toLowerCase().trim()),
    )
  }, [interestSearch])

  const filteredTechs = useMemo(() => {
    if (!techSearch.trim()) return TECH_OPTIONS
    return TECH_OPTIONS.filter((t) =>
      t.toLowerCase().includes(techSearch.toLowerCase().trim()),
    )
  }, [techSearch])

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    )
  }

  const toggleTech = (tech: string) => {
    setKnownTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    )
  }

  const handleSkipOnboarding = async () => {
    await completeOnboarding({
      name: name.trim() || profile.name || "Learner",
      nickname: nickname.trim() || profile.nickname || "",
      isOnboardingCompleted: true,
    })
    navigate(PROTECTED_ROUTES.dashboard)
  }

  const handleStartGeneration = () => {
    setStep(10)
    const finalGoal = selectedGoal === "Custom Goal" ? customGoal.trim() || "Career Growth" : selectedGoal

    setTimeout(() => setGenerationStep(1), 300)
    setTimeout(() => setGenerationStep(2), 600)
    setTimeout(() => setGenerationStep(3), 900)

    setTimeout(async () => {
      await completeOnboarding({
        name: name.trim() || profile.name || "Learner",
        nickname: nickname.trim(),
        avatarUrl: profile.avatarUrl || "",
        userType,
        interests: selectedInterests,
        skillLevel,
        primaryGoal: finalGoal,
        weeklyHours,
        knownTechnologies: knownTechs,
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        portfolioUrl: profile.portfolioUrl || "",
        learningStyle,
        isOnboardingCompleted: true,
      })
      navigate(PROTECTED_ROUTES.dashboard)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#000000] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl space-y-6">
        {/* Subtle Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center font-mono text-[11px] font-bold text-[#526E7A]">
            <span>STEP {step} OF 10</span>
            <button
              onClick={handleSkipOnboarding}
              className="text-[#3B82F6] hover:underline font-mono text-xs flex items-center gap-1 font-bold cursor-pointer"
            >
              Skip Onboarding →
            </button>
            <span>{step * 10}%</span>
          </div>
          <div className="w-full bg-black/[0.08] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-black h-full rounded-full transition-all duration-300"
              style={{ width: `${step * 10}%` }}
            />
          </div>
        </div>

        {/* Conversational Prompt Card */}
        <Card className="p-6 sm:p-8 space-y-6 border border-black/[0.08] bg-white rounded-[4px] shadow-sm">
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // INITIALIZATION</span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">What should I call you?</h1>
                  <p className="text-xs sm:text-sm text-[#526E7A]">Let's start with your name for personalized AI responses.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label-mono text-[#526E7A] text-[10px] block mb-1">FULL NAME *</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="bg-white border-black/[0.12] text-[#000000] placeholder:text-[#A0A0A0]"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="label-mono text-[#526E7A] text-[10px] block mb-1">PREFERRED NICKNAME (OPTIONAL)</label>
                    <Input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. Alex"
                      className="bg-white border-black/[0.12] text-[#000000] placeholder:text-[#A0A0A0]"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => name.trim() && setStep(2)}
                  disabled={!name.trim()}
                  size="lg"
                  className="w-full bg-black hover:bg-[#1a1a1a] text-white font-mono text-xs font-bold rounded-[4px]"
                >
                  Continue <ArrowRight className="ml-2 size-4" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // PROFILE CONTEXT</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">Who are you right now?</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">Select the role profile that best fits your current career position.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {ROLES.map((role) => {
                    const isSelected = userType === role.id
                    return (
                      <button
                        key={role.id}
                        onClick={() => setUserType(role.id)}
                        className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-black bg-black text-white shadow-md"
                            : "border-black/[0.08] bg-white text-[#000000] hover:border-black/25 hover:bg-[#F9F9F9]"
                        }`}
                      >
                        <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-[#000000]"}`}>{role.label}</p>
                        <p className={`text-[0.75rem] mt-1 ${isSelected ? "text-white/80" : "text-[#526E7A]"}`}>{role.desc}</p>
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 bg-black hover:bg-[#1a1a1a] text-white">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // TARGET DOMAINS</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">What domains interest you?</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">Select one or more domains to tailor your roadmap recommendations.</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A0A0A0]" />
                  <input
                    value={interestSearch}
                    onChange={(e) => setInterestSearch(e.target.value)}
                    placeholder="Search domains..."
                    className="input-clean w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-black/[0.12] text-[#000000]"
                  />
                </div>

                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                  {filteredInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest)
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-[4px] font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "border border-black bg-black text-white font-bold shadow-sm"
                            : "border border-black/[0.09] bg-white text-[#526E7A] hover:text-black hover:border-black/25"
                        }`}
                      >
                        {isSelected ? `✓ ${interest}` : `+ ${interest}`}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button
                    onClick={() => selectedInterests.length > 0 && setStep(4)}
                    disabled={selectedInterests.length === 0}
                    className="flex-1 bg-black hover:bg-[#1a1a1a] text-white disabled:opacity-30"
                  >
                    Continue ({selectedInterests.length})
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // EXPERIENCE BASELINE</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">What is your skill level?</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">This sets your AI code exercises and baseline complexity.</p>
                </div>

                <div className="space-y-2.5">
                  {SKILL_LEVELS.map((lvl) => {
                    const isSelected = skillLevel === lvl.id
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => setSkillLevel(lvl.id)}
                        className={`w-full p-4 rounded-[4px] border text-left flex justify-between items-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-black bg-black text-white shadow-md"
                            : "border-black/[0.08] bg-white text-[#000000] hover:border-black/25 hover:bg-[#F9F9F9]"
                        }`}
                      >
                        <div>
                          <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-[#000000]"}`}>{lvl.label}</p>
                          <p className={`text-[0.75rem] mt-1 ${isSelected ? "text-white/80" : "text-[#526E7A]"}`}>{lvl.desc}</p>
                        </div>
                        {isSelected && <Check className="size-4 text-white" />}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button onClick={() => setStep(5)} className="flex-1 bg-black hover:bg-[#1a1a1a] text-white">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // MILESTONE OBJECTIVE</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">What is your primary goal?</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">Your milestone roadmap is generated around this target objective.</p>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {GOAL_OPTIONS.map((goal) => {
                    const isSelected = selectedGoal === goal
                    return (
                      <button
                        key={goal}
                        onClick={() => setSelectedGoal(goal)}
                        className={`w-full p-3.5 rounded-[4px] border text-left flex justify-between items-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-black bg-black text-white shadow-md"
                            : "border-black/[0.08] bg-white text-[#000000] hover:border-black/25 hover:bg-[#F9F9F9]"
                        }`}
                      >
                        <span className={`text-xs font-bold ${isSelected ? "text-white" : "text-[#000000]"}`}>{goal}</span>
                        {isSelected && <Check className="size-4 text-white" />}
                      </button>
                    )
                  })}
                </div>

                {selectedGoal === "Custom Goal" && (
                  <Input
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Specify your custom goal..."
                    className="bg-white border-black/[0.12] text-[#000000]"
                  />
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(6)}
                    disabled={selectedGoal === "Custom Goal" && !customGoal.trim()}
                    className="flex-1 bg-black hover:bg-[#1a1a1a] text-white disabled:opacity-30"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // TIME ALLOCATION</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">Weekly learning hours?</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">Select your weekly commitment time to calibrate study velocity.</p>
                </div>

                <div className="rounded-[4px] border border-black/[0.08] bg-white p-6 text-center space-y-6 shadow-sm">
                  <div className="space-y-1">
                    <span className="font-mono text-5xl font-extrabold text-[#000000]">{weeklyHours}</span>
                    <span className="label-mono text-[#526E7A] block mt-1">HOURS / WEEK</span>
                  </div>

                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full accent-black h-1.5 bg-black/10 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(5)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button onClick={() => setStep(7)} className="flex-1 bg-black hover:bg-[#1a1a1a] text-white">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // INDEXED TECH STACK</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">Technologies you know?</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">Select the technologies you have experience with.</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A0A0A0]" />
                  <input
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    placeholder="Search tech stack..."
                    className="input-clean w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-black/[0.12] text-[#000000]"
                  />
                </div>

                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                  {filteredTechs.map((tech) => {
                    const isSelected = knownTechs.includes(tech)
                    return (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1.5 rounded-[4px] font-mono text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "border border-black bg-black text-white font-bold shadow-sm"
                            : "border border-black/[0.09] bg-white text-[#526E7A] hover:text-black hover:border-black/25"
                        }`}
                      >
                        {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(6)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button onClick={() => setStep(8)} className="flex-1 bg-black hover:bg-[#1a1a1a] text-white">
                    Continue ({knownTechs.length})
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 8 */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // EXTERNAL ACCOUNTS</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">Optional links & profile</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">Provide your public profile links for GitHub intelligence integration.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label-mono text-[#526E7A] text-[10px] block mb-1">GITHUB PROFILE URL</label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="bg-white border-black/[0.12] text-[#000000]"
                    />
                  </div>
                  <div>
                    <label className="label-mono text-[#526E7A] text-[10px] block mb-1">LINKEDIN PROFILE URL</label>
                    <Input
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="bg-white border-black/[0.12] text-[#000000]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(7)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button onClick={() => setStep(9)} className="flex-1 bg-black hover:bg-[#1a1a1a] text-white">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 9 */}
            {step === 9 && (
              <motion.div
                key="step9"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="label-mono text-[#3B82F6] font-bold block">EV AI // LEARNING METHODOLOGY</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">Preferred learning style?</h2>
                  <p className="text-xs sm:text-sm text-[#526E7A]">How do you absorb technical material best?</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {LEARNING_STYLES.map((style) => {
                    const isSelected = learningStyle === style.id
                    return (
                      <button
                        key={style.id}
                        onClick={() => setLearningStyle(style.id)}
                        className={`p-3.5 rounded-[4px] border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-black bg-black text-white shadow-md"
                            : "border-black/[0.08] bg-white text-[#000000] hover:border-black/25 hover:bg-[#F9F9F9]"
                        }`}
                      >
                        <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-[#000000]"}`}>{style.label}</p>
                        <p className={`text-[0.75rem] mt-1 ${isSelected ? "text-white/80" : "text-[#526E7A]"}`}>{style.desc}</p>
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(8)} className="flex-1 border-black/15 text-[#000000]">
                    Back
                  </Button>
                  <Button onClick={handleStartGeneration} className="flex-1 bg-black hover:bg-[#1a1a1a] text-white">
                    Finish Onboarding <Sparkles className="ml-2 size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 10 */}
            {step === 10 && (
              <motion.div
                key="step10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center py-6"
              >
                <div className="size-10 rounded-full bg-black mx-auto animate-pulse flex items-center justify-center text-white">
                  <Sparkles className="size-5" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#000000]">
                    Initializing EV Workspace...
                  </h2>
                  <p className="label-mono text-[#10B981] font-bold">
                    SETTING UP YOUR AI WORKSPACE
                  </p>
                </div>

                <div className="space-y-2 max-w-sm mx-auto text-left font-mono text-xs text-[#526E7A]">
                  <div className={`flex items-center gap-2.5 transition-all ${generationStep >= 1 ? "text-[#000000] font-bold" : "opacity-40"}`}>
                    {generationStep >= 1 ? <Check className="size-3.5 text-[#10B981]" /> : <span className="size-2 rounded-full bg-black" />}
                    <span>Analyzing profile parameters...</span>
                  </div>

                  <div className={`flex items-center gap-2.5 transition-all ${generationStep >= 2 ? "text-[#000000] font-bold" : "opacity-40"}`}>
                    {generationStep >= 2 ? <Check className="size-3.5 text-[#10B981]" /> : <span className="size-2 rounded-full bg-black" />}
                    <span>Constructing milestone roadmap...</span>
                  </div>

                  <div className={`flex items-center gap-2.5 transition-all ${generationStep >= 3 ? "text-[#000000] font-bold" : "opacity-40"}`}>
                    {generationStep >= 3 ? <Check className="size-3.5 text-[#10B981]" /> : <span className="size-2 rounded-full bg-black" />}
                    <span>Preparing AI workspace...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  )
}
