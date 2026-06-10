// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Shim de @workspace/api-client-react
//
//  Les pages de l'espace recruteur/conseiller (dashboard, candidats, offres,
//  entretiens, conseillers, documents, soft-skills, parcours, candidat-profil)
//  ont été écrites contre un package interne de l'ancien monorepo Replit qui
//  n'est pas distribué avec le code. Ce shim fournit la même surface d'API
//  (mêmes noms de hooks et de query-keys) afin que ces pages compilent et
//  s'affichent. Les requêtes renvoient `undefined` → les pages basculent sur
//  leurs données de démonstration intégrées. Les mutations déclenchent un
//  message courtois « module en cours de déploiement » via onError.
//
//  Quand le backend recruteur sera disponible, il suffira de remplacer ce
//  fichier par le vrai client (ou de re-router les hooks vers Supabase).
// ─────────────────────────────────────────────────────────────────────────────

const COMING_SOON =
  "L'espace recruteur arrive très bientôt. Cette action sera disponible dès l'activation du module.";

type QueryResult = {
  data: undefined;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  error: null;
  refetch: () => Promise<void>;
};

function makeQuery(): QueryResult {
  return {
    data: undefined,
    isLoading: false,
    isPending: false,
    isError: false,
    error: null,
    refetch: async () => {},
  };
}

type MutationCallbacks = {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
};

type MutationResult = {
  mutate: (variables?: unknown, callbacks?: MutationCallbacks) => void;
  mutateAsync: (variables?: unknown) => Promise<never>;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  data: undefined;
  reset: () => void;
};

function makeMutation(): MutationResult {
  return {
    mutate: (_variables?: unknown, callbacks?: MutationCallbacks) => {
      const err = new Error(COMING_SOON);
      callbacks?.onError?.(err);
      callbacks?.onSettled?.();
    },
    mutateAsync: async () => {
      throw new Error(COMING_SOON);
    },
    isPending: false,
    isError: false,
    isSuccess: false,
    data: undefined,
    reset: () => {},
  };
}

// ── Query hooks ────────────────────────────────────────────────────────────
export const useGetDashboardStats = (..._a: unknown[]) => makeQuery();
export const useGetRecentActivity = (..._a: unknown[]) => makeQuery();
export const useGetCvProgressTrend = (..._a: unknown[]) => makeQuery();
export const useListCandidates = (..._a: unknown[]) => makeQuery();
export const useGetCandidate = (..._a: unknown[]) => makeQuery();
export const useGetCandidateEmployabilityScore = (..._a: unknown[]) => makeQuery();
export const useListCvs = (..._a: unknown[]) => makeQuery();
export const useListJobs = (..._a: unknown[]) => makeQuery();
export const useGetJobMatches = (..._a: unknown[]) => makeQuery();
export const useListInterviews = (..._a: unknown[]) => makeQuery();
export const useGetInterviewReport = (..._a: unknown[]) => makeQuery();
export const useListSoftSkillsHistory = (..._a: unknown[]) => makeQuery();
export const useListDocuments = (..._a: unknown[]) => makeQuery();
export const useListAdvisors = (..._a: unknown[]) => makeQuery();
export const useGetAdvisorBeneficiaries = (..._a: unknown[]) => makeQuery();

// ── Mutation hooks ───────────────────────────────────────────────────────────
export const useCreateCandidate = (..._a: unknown[]) => makeMutation();
export const useCreateJob = (..._a: unknown[]) => makeMutation();
export const useCreateInterview = (..._a: unknown[]) => makeMutation();
export const useGetNextQuestion = (..._a: unknown[]) => makeMutation();
export const useSubmitInterviewAnswer = (..._a: unknown[]) => makeMutation();
export const useAssessSoftSkills = (..._a: unknown[]) => makeMutation();
export const useGenerateDocument = (..._a: unknown[]) => makeMutation();
export const useGetCareerRecommendations = (..._a: unknown[]) => makeMutation();
export const useCreateAdvisor = (..._a: unknown[]) => makeMutation();
export const useGenerateAdvisorReport = (..._a: unknown[]) => makeMutation();

// ── Query-key helpers ──────────────────────────────────────────────────────
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
