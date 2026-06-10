import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

import Accueil from "@/pages/accueil";
import EspaceEmploi from "@/pages/espace-emploi";
import EspaceEntrepreneur from "@/pages/espace-entrepreneur";
import Dashboard from "@/pages/dashboard";
import Candidats from "@/pages/candidats";
import CandidatProfil from "@/pages/candidat-profil";
import CvEngine from "@/pages/cv-engine";
import Entretiens from "@/pages/entretiens";
import SoftSkillsPage from "@/pages/softskills";
import Parcours from "@/pages/parcours";
import Offres from "@/pages/offres";
import Documents from "@/pages/documents";
import Conseillers from "@/pages/conseillers";
import Connecteurs from "@/pages/connecteurs";

// ── Tests AFRI (nouveaux — remplacent RIASEC) ──
import AfriCodeTest from "@/pages/tests/afri-code";
import AfriSkillTest from "@/pages/tests/afri-skill";

// ── Tests conservés ──
import IkigaiTest from "@/pages/tests/ikigai";
import PersonnaliteTest from "@/pages/tests/personnalite";
import EntrepreneurTest from "@/pages/tests/entrepreneur";
import ProjetTest from "@/pages/tests/projet";
import IkigaiEntrepreneurTest from "@/pages/tests/ikigai-entrepreneur";

import CvUpload from "@/pages/cv-upload";
import InterviewSimulator from "@/pages/interview-simulator";
import BilanCompetences from "@/pages/bilan-competences";
import EvaluationAcquis from "@/pages/evaluation-acquis";
import TableauDeBord from "@/pages/tableau-de-bord";
import JobAnalyzer from "@/pages/job-analyzer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Accueil — sélection d'espace */}
        <Route path="/" component={Accueil} />

        {/* Espace Emploi */}
        <Route path="/emploi" component={EspaceEmploi} />
        <Route path="/emploi/tableau-de-bord" component={TableauDeBord} />

        {/* ── Tests AFRI propriétaires ── */}
        <Route path="/emploi/tests/afri-code" component={AfriCodeTest} />
        <Route path="/emploi/tests/afri-skill" component={AfriSkillTest} />

        {/* ── Redirection douce RIASEC → AFRI-CODE ── */}
        <Route path="/emploi/tests/riasec">
          <Redirect to="/emploi/tests/afri-code" />
        </Route>

        {/* Tests conservés */}
        <Route path="/emploi/tests/ikigai" component={IkigaiTest} />
        <Route path="/emploi/tests/personnalite" component={PersonnaliteTest} />

        <Route path="/emploi/cv-analyse" component={CvUpload} />
        <Route path="/emploi/simulateur" component={InterviewSimulator} />
        <Route path="/emploi/bilan" component={BilanCompetences} />
        <Route path="/emploi/vae" component={EvaluationAcquis} />
        <Route path="/emploi/analyse-offre" component={JobAnalyzer} />

        {/* Espace Entrepreneur */}
        <Route path="/entrepreneur" component={EspaceEntrepreneur} />
        <Route path="/entrepreneur/tests/ikigai" component={IkigaiEntrepreneurTest} />
        <Route path="/entrepreneur/tests/profil" component={EntrepreneurTest} />
        <Route path="/entrepreneur/tests/projet" component={ProjetTest} />

        {/* Espace Conseiller — tableau de bord + outils */}
        <Route path="/conseiller" component={Dashboard} />
        <Route path="/candidats" component={Candidats} />
        <Route path="/candidats/:id" component={CandidatProfil} />
        <Route path="/conseillers" component={Conseillers} />
        <Route path="/cv" component={CvEngine} />
        <Route path="/entretiens" component={Entretiens} />
        <Route path="/softskills" component={SoftSkillsPage} />
        <Route path="/parcours" component={Parcours} />
        <Route path="/offres" component={Offres} />
        <Route path="/documents" component={Documents} />
        <Route path="/connecteurs" component={Connecteurs} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
