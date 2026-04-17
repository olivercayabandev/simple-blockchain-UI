import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { votingApi, AdminStats, Candidate, Block } from "~/api-services/voting.service";
import { 
  Shield,
  Users,
  Vote,
  Activity,
  Play,
  Square,
  Pickaxe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  FileJson
} from "lucide-react";

export function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Admin data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionStatus, setElectionStatus] = useState<{ election_started: boolean } | null>(null);
  const [chain, setChain] = useState<Block[]>([]);
  const [showChain, setShowChain] = useState(false);
  
  // New candidate form
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateDesc, setNewCandidateDesc] = useState("");

  useEffect(() => {
    const savedAdminToken = localStorage.getItem("admin_token");
    if (savedAdminToken) {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = async () => {
    try {
      const [statsData, candidatesData, electionData, chainData] = await Promise.all([
        votingApi.adminGetStats(),
        votingApi.getCandidates(),
        votingApi.getElectionStatus(),
        votingApi.getChain(),
      ]);
      setStats(statsData);
      setCandidates(candidatesData.candidates);
      setElectionStatus(electionData);
      setChain(chainData.chain);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", username);
      const response = await votingApi.adminLogin(username, password);
      console.log("Login response:", response);
      if (response.success) {
        localStorage.setItem("admin_token", response.token);
        setIsAuthenticated(true);
        loadAdminData();
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const handleStartElection = async () => {
    setLoading(true);
    try {
      await votingApi.adminStartElection();
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Failed to start election");
    } finally {
      setLoading(false);
    }
  };

  const handleStopElection = async () => {
    setLoading(true);
    try {
      await votingApi.adminStopElection();
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Failed to stop election");
    } finally {
      setLoading(false);
    }
  };

  const handleMineBlock = async () => {
    setLoading(true);
    try {
      await votingApi.adminMineBlock();
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Failed to mine block");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName) return;
    
    setLoading(true);
    try {
      await votingApi.adminAddCandidate(newCandidateName, newCandidateDesc);
      setNewCandidateName("");
      setNewCandidateDesc("");
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCandidate = async (candidateId: number) => {
    setLoading(true);
    try {
      await votingApi.adminRemoveCandidate(candidateId);
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Failed to remove candidate");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-full w-fit">
              <Shield className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <p className="text-muted-foreground">Enter admin credentials</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Admin Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage election and view blockchain
              </p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.total_voters || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Voters</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Vote className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.total_voted || 0}</p>
                  <p className="text-sm text-muted-foreground">Votes Cast</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.total_blocks || 0}</p>
                  <p className="text-sm text-muted-foreground">Blockchain Blocks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  stats?.is_valid 
                    ? "bg-green-100 dark:bg-green-900" 
                    : "bg-red-100 dark:bg-red-900"
                }`}>
                  {stats?.is_valid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-bold">{stats?.is_valid ? "Valid" : "Invalid"}</p>
                  <p className="text-sm text-muted-foreground">Chain Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Election Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Election Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Election Status</p>
                  <Badge variant={electionStatus?.election_started ? "default" : "secondary"}>
                    {electionStatus?.election_started ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {electionStatus?.election_started ? (
                  <Button variant="destructive" onClick={handleStopElection} disabled={loading}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Election
                  </Button>
                ) : (
                  <Button onClick={handleStartElection} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Election
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Manual Mining</p>
                  <p className="text-sm text-muted-foreground">
                    {stats?.pending_transactions || 0} pending transactions
                  </p>
                </div>
                <Button variant="outline" onClick={handleMineBlock} disabled={loading}>
                  <Pickaxe className="h-4 w-4 mr-2" />
                  Mine Block
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCandidate} className="space-y-3 mb-4">
                <Input
                  placeholder="Candidate name"
                  value={newCandidateName}
                  onChange={(e) => setNewCandidateName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Description (optional)"
                  value={newCandidateDesc}
                  onChange={(e) => setNewCandidateDesc(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={loading || !newCandidateName}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </form>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      {candidate.description && (
                        <p className="text-sm text-muted-foreground">{candidate.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCandidate(candidate.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blockchain View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Blockchain Ledger
              </span>
              <Button variant="outline" onClick={() => setShowChain(!showChain)}>
                {showChain ? "Hide" : "Show"} JSON
              </Button>
            </CardTitle>
          </CardHeader>
          {showChain && (
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs max-h-96 overflow-y-auto">
                {JSON.stringify(chain, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
