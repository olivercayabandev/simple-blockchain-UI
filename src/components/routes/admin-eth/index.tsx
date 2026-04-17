import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { votingEthApi, BlockchainStatus } from "~/api-services/voting-eth.service";
import { 
  Shield,
  Users,
  Vote,
  Activity,
  Play,
  Square,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Wallet
} from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  description: string;
  vote_count: number;
}

export function AdminEthDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [stats, setStats] = useState<{
    total_votes: number;
    total_candidates: number;
    election_started: boolean;
    blockchain: BlockchainStatus;
  } | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionStarted, setElectionStarted] = useState(false);
  
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateDesc, setNewCandidateDesc] = useState("");

  useEffect(() => {
    const savedAdminToken = localStorage.getItem("admin_eth_token");
    if (savedAdminToken) {
      setIsAuthenticated(true);
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = async () => {
    try {
      const [statsData, candidatesData, electionData] = await Promise.all([
        votingEthApi.adminGetStats(),
        votingEthApi.getCandidates(),
        votingEthApi.getElectionStatus(),
      ]);
      setStats(statsData);
      setCandidates(candidatesData.candidates);
      setElectionStarted(electionData.election_started);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await votingEthApi.adminLogin(username, password);
      if (response.success) {
        localStorage.setItem("admin_eth_token", response.token);
        setIsAuthenticated(true);
        loadAdminData();
      }
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_eth_token");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const handleStartElection = async () => {
    setLoading(true);
    try {
      await votingEthApi.adminStartElection();
      setElectionStarted(true);
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to start election");
    } finally {
      setLoading(false);
    }
  };

  const handleStopElection = async () => {
    setLoading(true);
    try {
      await votingEthApi.adminStopElection();
      setElectionStarted(false);
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to stop election");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidateName) return;
    
    setLoading(true);
    try {
      await votingEthApi.adminAddCandidate(newCandidateName, newCandidateDesc);
      setNewCandidateName("");
      setNewCandidateDesc("");
      loadAdminData();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>Admin Login (Ethereum)</CardTitle>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                Admin Dashboard (Ethereum)
              </h1>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Manage election on blockchain
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

        {/* Blockchain Status */}
        {stats?.blockchain && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    stats.blockchain.connected 
                      ? "bg-green-100 dark:bg-green-900" 
                      : "bg-red-100 dark:bg-red-900"
                  }`}>
                    {stats.blockchain.connected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{stats.blockchain.connected ? "Connected" : "Disconnected"}</p>
                    <p className="text-sm text-muted-foreground">Ganache</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.blockchain.block_number}</p>
                    <p className="text-sm text-muted-foreground">Block Number</p>
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
                    <p className="text-2xl font-bold">{stats.total_votes}</p>
                    <p className="text-sm text-muted-foreground">Total Votes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total_candidates}</p>
                    <p className="text-sm text-muted-foreground">Candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Election Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Election Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Election Status</p>
                  <Badge variant={electionStarted ? "default" : "secondary"}>
                    {electionStarted ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {electionStarted ? (
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
                      <p className="text-sm text-muted-foreground">{candidate.vote_count} votes</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Wallet Info */}
        {stats?.blockchain && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Blockchain Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Admin Wallet Address:</p>
              <p className="font-mono text-sm break-all">{stats.blockchain.admin_address}</p>
              <p className="text-sm text-muted-foreground mt-2">Chain ID: {stats.blockchain.chain_id}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
