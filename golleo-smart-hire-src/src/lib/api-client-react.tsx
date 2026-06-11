// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Client de l'espace recruteur (remplace @workspace/api-client-react)
//
//  Implémentation réelle adossée à Supabase (CRUD candidats / offres / documents /
//  soft-skills + statistiques) et à des fonctions serverless Claude (matching,
//  génération de documents, évaluation soft-skills, recommandations de carrière).
//
//  Modules encore en cours (entretiens IA, conseillers) : stubs gracieux —
//  les requêtes renvoient des données vides et les actions affichent un message
//  « bientôt disponible ». Aucune page ne plante.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const COMING_SOON =
  "Ce module arrive très bientôt. Cette action sera disponible prochainement.";

// ── Mapping DB (snake_case) → app (camelCase) ───────────────────────────────
type Row = Record<string, any>;

const mapCandidate = (r: Row) => ({
  id: r.id,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  country: r.country,
  city: r.city,
  sector: r.sector,
  experienceLevel: r.experience_level,
  status: r.status ?? "active",
  employabilityScore: r.employability_score ?? null,
  language: r.language ?? "fr",
  createdAt: r.created_at,
});

const mapJob = (r: Row) => ({
  id: r.id,
  title: r.title,
  company: r.company,
  country: r.country,
  city: r.city,
  sector: r.sector,
  description: r.description,
  experienceLevel: r.experience_level,
  contractType: r.contract_type,
  salary: r.salary,
  tags: r.tags ?? [],
  createdAt: r.created_at,
});

const mapDocument = (r: Row) => ({
  id: r.id,
  content: r.content,
  documentType: r.doc_type,
  title: r.title,
  language: "fr",
  createdAt: r.created_at,
});

const mapSkill = (r: Row) => ({
  id: r.id,
  communication: r.communication,
  leadership: r.leadership,
  teamwork: r.teamwork,
  adaptability: r.adaptability,
  stressManagement: r.stress_management,
  summary: r.summary,
  createdAt: r.created_at,
});

// ── Helpers ─────────────────────────────────────────────────────────────────
type QueryOpts = { query?: { enabled?: boolean; queryKey?: unknown[] } };

function useSupaQuery<T>(
  defaultKey: unknown[],
  queryFn: () => Promise<T>,
  options?: QueryOpts,
) {
  const q = options?.query ?? {};
  return useQuery({
    queryKey: (q.queryKey as unknown[]) ?? defaultKey,
    queryFn,
    enabled: q.enabled ?? true,
    staleTime: 30_000,
  });
}

async function postJSON(url: string, body: unknown): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// ── CANDIDATS ────────────────────────────────────────────────────────────────
export const useListCandidates = (
  filters?: { country?: string; status?: string },
  options?: QueryOpts,
) =>
  useSupaQuery(
    ["candidates", filters],
    async () => {
      let q = supabase
        .from("golleo_candidates")
        .select("*")
        .order("created_at", { ascending: false });
      if (filters?.country) q = q.eq("country", filters.country);
      if (filters?.status) q = q.eq("status", filters.status);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapCandidate);
    },
    options,
  );

export const useGetCandidate = (id: number, options?: QueryOpts) =>
  useSupaQuery(
    ["candidate", id],
    async () => {
      const { data, error } = await supabase
        .from("golleo_candidates")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapCandidate(data) : null;
    },
    options,
  );

export const useCreateCandidate = () =>
  useMutation({
    mutationFn: async (vars: { data: Row }) => {
      const d = vars.data;
      const { data, error } = await supabase
        .from("golleo_candidates")
        .insert({
          first_name: d.firstName,
          last_name: d.lastName,
          email: d.email,
          phone: d.phone || null,
          country: d.country,
          city: d.city || null,
          sector: d.sector || null,
          experience_level: d.experienceLevel || null,
          language: d.language || "fr",
        })
        .select()
        .single();
      if (error) throw error;
      // Trace une activité (best-effort)
      void supabase.from("golleo_recruiter_activities").insert({
        type: "added",
        description: "Nouveau bénéficiaire enregistré",
        candidate_name: `${d.firstName} ${d.lastName}`,
      });
      return mapCandidate(data);
    },
  });

export const useGetCandidateEmployabilityScore = (
  _id: number,
  options?: QueryOpts,
) => useSupaQuery(["candidate-employability", _id], async () => null, options);

// ── OFFRES ─────────────────────────────────────────────────────────────────
export const useListJobs = (
  filters?: { country?: string; sector?: string },
  options?: QueryOpts,
) =>
  useSupaQuery(
    ["jobs", filters],
    async () => {
      let q = supabase
        .from("golleo_jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (filters?.country) q = q.eq("country", filters.country);
      if (filters?.sector) q = q.eq("sector", filters.sector);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapJob);
    },
    options,
  );

export const useCreateJob = () =>
  useMutation({
    mutationFn: async (vars: { data: Row }) => {
      const d = vars.data;
      const { data, error } = await supabase
        .from("golleo_jobs")
        .insert({
          title: d.title,
          company: d.company,
          country: d.country,
          city: d.city || null,
          sector: d.sector,
          description: d.description,
          experience_level: d.experienceLevel || null,
          contract_type: d.contractType || null,
          salary: d.salary || null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapJob(data);
    },
  });

export const useGetJobMatches = (jobId: number, options?: QueryOpts) =>
  useSupaQuery(
    ["job-matches", jobId],
    async () => {
      if (!jobId) return [];
      const [{ data: job }, { data: cands }] = await Promise.all([
        supabase.from("golleo_jobs").select("*").eq("id", jobId).maybeSingle(),
        supabase.from("golleo_candidates").select("*").limit(50),
      ]);
      if (!job || !cands?.length) return [];
      const out = await postJSON("/api/recruiter/job-matches", {
        job: mapJob(job),
        candidates: cands.map(mapCandidate),
      });
      return out.matches ?? [];
    },
    options,
  );

// ── DASHBOARD ────────────────────────────────────────────────────────────────
export const useGetDashboardStats = (options?: QueryOpts) =>
  useSupaQuery(
    ["dashboard-stats"],
    async () => {
      const { data, error } = await supabase
        .from("golleo_candidates")
        .select("status, sector, country, employability_score");
      if (error) throw error;
      const rows = data ?? [];
      if (rows.length === 0) return undefined; // → fallback démo côté page
      const by = (key: string) => {
        const m = new Map<string, number>();
        rows.forEach((r: Row) => {
          const k = r[key] || "Autres";
          m.set(k, (m.get(k) ?? 0) + 1);
        });
        return Array.from(m.entries()).map(([k, count]) => ({ [key === "sector" ? "sector" : "country"]: k, count }));
      };
      const scores = rows.map((r: Row) => r.employability_score).filter((s: number) => s != null);
      return {
        totalCandidates: rows.length,
        activeCandidates: rows.filter((r: Row) => r.status !== "placed").length,
        placedCandidates: rows.filter((r: Row) => r.status === "placed").length,
        avgEmployabilityScore: scores.length
          ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
          : 0,
        candidatesBySector: by("sector"),
        candidatesByCountry: by("country"),
      };
    },
    options,
  );

export const useGetRecentActivity = (options?: QueryOpts) =>
  useSupaQuery(
    ["recent-activity"],
    async () => {
      const { data, error } = await supabase
        .from("golleo_recruiter_activities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []).map((r: Row) => ({
        id: r.id,
        type: r.type,
        description: r.description,
        candidateName: r.candidate_name,
        timestamp: r.created_at,
      }));
    },
    options,
  );

export const useGetCvProgressTrend = (options?: QueryOpts) =>
  useSupaQuery(["cv-progress"], async () => undefined, options);

// ── DOCUMENTS ────────────────────────────────────────────────────────────────
export const useListDocuments = (
  filters?: { candidateId?: number },
  options?: QueryOpts,
) =>
  useSupaQuery(
    ["documents", filters],
    async () => {
      let q = supabase
        .from("golleo_documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (filters?.candidateId) q = q.eq("candidate_id", filters.candidateId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapDocument);
    },
    options,
  );

export const useGenerateDocument = () =>
  useMutation({
    mutationFn: async (vars: Row) => {
      const out = await postJSON("/api/recruiter/document", vars);
      void supabase.from("golleo_documents").insert({
        candidate_id: vars.candidateId ?? vars.data?.candidateId ?? null,
        doc_type: out.documentType,
        title: out.title,
        content: out.content,
      });
      return out;
    },
  });

// ── SOFT SKILLS ────────────────────────────────────────────────────────────
export const useListSoftSkillsHistory = (
  filters?: { candidateId?: number },
  options?: QueryOpts,
) =>
  useSupaQuery(
    ["softskills-history", filters],
    async () => {
      let q = supabase
        .from("golleo_softskills")
        .select("*")
        .order("created_at", { ascending: false });
      if (filters?.candidateId) q = q.eq("candidate_id", filters.candidateId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapSkill);
    },
    options,
  );

export const useAssessSoftSkills = () =>
  useMutation({
    mutationFn: async (vars: Row) => {
      const d = vars.data ?? vars;
      const out = await postJSON("/api/recruiter/softskills", d);
      void supabase.from("golleo_softskills").insert({
        candidate_id: d.candidateId ?? null,
        communication: out.communication,
        leadership: out.leadership,
        teamwork: out.teamwork,
        adaptability: out.adaptability,
        stress_management: out.stressManagement,
        summary: out.summary,
      });
      return out;
    },
  });

// ── PARCOURS / CARRIÈRE ──────────────────────────────────────────────────────
export const useGetCareerRecommendations = () =>
  useMutation({
    mutationFn: async (vars: Row) =>
      postJSON("/api/recruiter/career", vars.data ?? vars),
  });

// ── Modules en cours (stubs gracieux) ────────────────────────────────────────
const emptyQuery = (options?: QueryOpts) =>
  useSupaQuery(["empty"], async () => [], options);
const undefinedQuery = (options?: QueryOpts) =>
  useSupaQuery(["empty"], async () => undefined, options);

export const useListCvs = (_a?: unknown, options?: QueryOpts) => emptyQuery(options);
export const useListInterviews = (_a?: unknown, options?: QueryOpts) => emptyQuery(options);
export const useGetInterviewReport = (_a?: unknown, options?: QueryOpts) => undefinedQuery(options);
export const useListAdvisors = (_a?: unknown, options?: QueryOpts) => emptyQuery(options);
export const useGetAdvisorBeneficiaries = (_a?: unknown, options?: QueryOpts) => undefinedQuery(options);

function comingSoonMutation() {
  return useMutation({
    mutationFn: async () => {
      throw new Error(COMING_SOON);
    },
  });
}
export const useCreateInterview = () => comingSoonMutation();
export const useGetNextQuestion = () => comingSoonMutation();
export const useSubmitInterviewAnswer = () => comingSoonMutation();
export const useCreateAdvisor = () => comingSoonMutation();
export const useGenerateAdvisorReport = () => comingSoonMutation();

// ── Query-key helpers (mêmes signatures que l'ancien package) ────────────────
export const getListCandidatesQueryKey = (...a: unknown[]) => ["candidates", ...a];
export const getGetCandidateQueryKey = (...a: unknown[]) => ["candidate", ...a];
export const getGetCandidateEmployabilityScoreQueryKey = (...a: unknown[]) => ["candidate-employability", ...a];
export const getListCvsQueryKey = (...a: unknown[]) => ["cvs", ...a];
export const getListJobsQueryKey = (...a: unknown[]) => ["jobs", ...a];
export const getGetJobMatchesQueryKey = (...a: unknown[]) => ["job-matches", ...a];
export const getListInterviewsQueryKey = (...a: unknown[]) => ["interviews", ...a];
export const getGetInterviewReportQueryKey = (...a: unknown[]) => ["interview-report", ...a];
export const getListSoftSkillsHistoryQueryKey = (...a: unknown[]) => ["softskills-history", ...a];
export const getListDocumentsQueryKey = (...a: unknown[]) => ["documents", ...a];
export const getListAdvisorsQueryKey = (...a: unknown[]) => ["advisors", ...a];
export const getGetAdvisorBeneficiariesQueryKey = (...a: unknown[]) => ["advisor-beneficiaries", ...a];
