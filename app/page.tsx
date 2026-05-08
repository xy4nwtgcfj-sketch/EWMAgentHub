const categories = [
  {
    title: "Pre-Sales",
    color: "blue",
    commands: [
      { cmd: "/rfp [client] [industry]", desc: "Full proposal response from RFP documents" },
      { cmd: "/estimate [scope]", desc: "Effort estimate by phase and role with risk buffer" },
      { cmd: "/demo-script [client] [industry] [pain points]", desc: "Story-driven EWM demo script" },
    ],
  },
  {
    title: "Workshops & Specifications",
    color: "violet",
    commands: [
      { cmd: "/workshop-prep [process area] [duration]", desc: "Timed agenda, 20+ discovery questions, decision points" },
      { cmd: "/minutes [topic]", desc: "Convert raw notes to structured minutes with action items" },
      { cmd: "/fs [title] [description]", desc: "Complete Functional Specification with Mermaid process flow" },
      { cmd: "/ts [fs-filename]", desc: "Technical Specification linked to parent FS" },
      { cmd: "/gap-analysis", desc: "Classify requirements A–E against standard EWM" },
      { cmd: "/process-flow [process name]", desc: "Mermaid swimlane flowchart with legend" },
    ],
  },
  {
    title: "System Configuration",
    color: "teal",
    commands: [
      { cmd: "/config-guide [topic] [ewm-version]", desc: "Step-by-step IMG guide with transaction codes and rationale" },
      { cmd: "/config-workbook [warehouse]", desc: "Structured workbook: structure, strategies, queue management" },
      { cmd: "/config-check", desc: "RAG-rated review of config workbook for inconsistencies" },
    ],
  },
  {
    title: "WRICEF Coding",
    color: "amber",
    commands: [
      { cmd: "/badi [badi-name] [requirement]", desc: "Production-quality ABAP with interface, logic, unit tests" },
      { cmd: "/code-review [filename]", desc: "Clean ABAP compliance, performance, security audit" },
      { cmd: "/report [name] [selections] [outputs]", desc: "Full ALV report using CL_SALV_TABLE" },
      { cmd: "/interface [type] [description]", desc: "IDoc / BAPI / REST / RFC with mapping and error handling" },
      { cmd: "/batch-ts", desc: "Generate TS stubs for every WRICEF in inventory" },
      { cmd: "/batch-code", desc: "Generate ABAP stubs for all TS files without code" },
    ],
  },
  {
    title: "Testing",
    color: "green",
    commands: [
      { cmd: "/test-scripts [process] [format]", desc: "Happy path + error scenarios (step-by-step · BDD · SolMan · Xray)" },
      { cmd: "/uat-package [role]", desc: "Role-based UAT package in plain business language" },
      { cmd: "/triage [defect]", desc: "Root cause classification, investigation steps, workaround" },
      { cmd: "/regression [changes]", desc: "Minimum regression scope with priority order" },
    ],
  },
  {
    title: "Cutover & Migration",
    color: "orange",
    commands: [
      { cmd: "/runbook [warehouse] [go-live-date]", desc: "Detailed cutover runbook T-5 to T-0 with rollback criteria" },
      { cmd: "/go-nogo [project]", desc: "Go/No-Go checklist by category with RAG scorecard" },
    ],
  },
  {
    title: "Training & Go-Live",
    color: "pink",
    commands: [
      { cmd: "/training [role] [format]", desc: "Role-specific material: job-aid · guide · e-learning · train-the-trainer" },
      { cmd: "/release-notes [release] [audience]", desc: "Change summary for business users · key users · IT · management" },
    ],
  },
  {
    title: "AMS, Compliance & Upgrades",
    color: "red",
    commands: [
      { cmd: "/incident [description]", desc: "Classify, root-cause, investigate, resolve" },
      { cmd: "/knowledge-article [issue] [cause] [resolution]", desc: "Reusable KB article with prevention notes" },
      { cmd: "/compliance [regulation] [process]", desc: "IQ/OQ/PQ validation documentation and gap analysis" },
      { cmd: "/upgrade-assessment [current] [target]", desc: "Breaking changes, Clean Core risk, remediation effort" },
    ],
  },
  {
    title: "Chained Workflows",
    color: "indigo",
    commands: [
      { cmd: "/chain-blueprint [process area]", desc: "Workshop prep → minutes → FS → gap analysis in sequence" },
      { cmd: "/chain-build [fs-filename]", desc: "FS → TS → code → test scripts in sequence" },
      { cmd: "/chain-full", desc: "Full pipeline: batch TS → batch code → test scripts for all WRICEFs" },
    ],
  },
];

const colorMap: Record<string, { badge: string; border: string; dot: string; cmdBg: string }> = {
  blue:   { badge: "bg-blue-900/50 text-blue-300",   border: "border-blue-800/40",   dot: "bg-blue-400",   cmdBg: "bg-blue-950/30" },
  violet: { badge: "bg-violet-900/50 text-violet-300", border: "border-violet-800/40", dot: "bg-violet-400", cmdBg: "bg-violet-950/30" },
  teal:   { badge: "bg-teal-900/50 text-teal-300",   border: "border-teal-800/40",   dot: "bg-teal-400",   cmdBg: "bg-teal-950/30" },
  amber:  { badge: "bg-amber-900/50 text-amber-300",  border: "border-amber-800/40",  dot: "bg-amber-400",  cmdBg: "bg-amber-950/30" },
  green:  { badge: "bg-green-900/50 text-green-300",  border: "border-green-800/40",  dot: "bg-green-400",  cmdBg: "bg-green-950/30" },
  orange: { badge: "bg-orange-900/50 text-orange-300", border: "border-orange-800/40", dot: "bg-orange-400", cmdBg: "bg-orange-950/30" },
  pink:   { badge: "bg-pink-900/50 text-pink-300",   border: "border-pink-800/40",   dot: "bg-pink-400",   cmdBg: "bg-pink-950/30" },
  red:    { badge: "bg-red-900/50 text-red-300",     border: "border-red-800/40",    dot: "bg-red-400",    cmdBg: "bg-red-950/30" },
  indigo: { badge: "bg-indigo-900/50 text-indigo-300", border: "border-indigo-800/40", dot: "bg-indigo-400", cmdBg: "bg-indigo-950/30" },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
              EW
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm leading-none">EWM Agent Hub</h1>
              <p className="text-gray-500 text-xs mt-0.5">SAP Extended Warehouse Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Claude Code
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            AI agents for the full EWM lifecycle
          </h2>
          <p className="mt-3 text-gray-400 text-base leading-relaxed">
            Run any command below in Claude Code to generate implementation-ready outputs —
            proposals, functional specs, ABAP code, test scripts, runbooks, and more.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
          {[
            { label: "Agent commands", value: "30+" },
            { label: "Output types", value: "9" },
            { label: "Chained workflows", value: "3" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Command Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const c = colorMap[cat.color];
            return (
              <div
                key={cat.title}
                className={`bg-gray-900 border ${c.border} rounded-2xl p-5 flex flex-col gap-4`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-sm">{cat.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>
                    {cat.commands.length} {cat.commands.length === 1 ? "command" : "commands"}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {cat.commands.map((item) => (
                    <div
                      key={item.cmd}
                      className={`rounded-xl p-3 ${c.cmdBg} border ${c.border}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                        <div>
                          <code className="font-mono text-xs text-white break-all leading-relaxed">
                            {item.cmd}
                          </code>
                          <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-gray-600 text-xs">
          Open this project in Claude Code and type any command to generate outputs →{" "}
          <code className="font-mono text-gray-500">outputs/</code>
        </p>
      </main>
    </div>
  );
}
