import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { votingApi, Voter, Candidate, VoteResult } from "~/api-services/voting.service";
import { 
  Vote, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Shield,
  Wallet,
  LogOut,
  Activity,
  Trophy
} from "lucide-react";

type View = "login" | "register" | "ballot" | "results";

interface VoterState extends Voter {
  token: string;
}

export function VotingPage() {
  const [view, setView] = useState<View>("login");
  const [voter, setVoter] = useState<VoterState | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [residentId, setResidentId] = useState("");
  const [pin, setPin] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  
  const [blockchainStatus, setBlockchainStatus] = useState<{
    chain_length: number;
    pending_transactions: number;
    total_votes: number;
    is_valid: boolean;
  } | null>(null);

  useEffect(() => {
    const savedVoter = localStorage.getItem("voting_voter");
    const savedToken = localStorage.getItem("voting_token");
    
    if (savedVoter && savedToken) {
      const parsedVoter = JSON.parse(savedVoter);
      setVoter({ ...parsedVoter, token: savedToken });
      setView("ballot");
    }
    loadCandidates();
    loadBlockchainStatus();
  }, []);

  const loadCandidates = async () => {
    try {
      const data = await votingApi.getCandidates();
      setCandidates(data.candidates);
    } catch (err) {
      console.error("Failed to load candidates:", err);
    }
  };

  const loadBlockchainStatus = async () => {
    try {
      const data = await votingApi.getBlockchainStatus();
      setBlockchainStatus(data);
    } catch (err) {
      console.error("Failed to load blockchain status:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await votingApi.login(residentId, pin);
      if (response.success) {
        const voterData = { ...response.voter, token: response.token };
        setVoter(voterData);
        localStorage.setItem("voting_token", response.token);
        localStorage.setItem("voting_voter", JSON.stringify(response.voter));
        
        if (response.voter.has_voted) {
          setSuccess("You have already voted.");
        }
        setView("ballot");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await votingApi.register(residentId, pin, fullName);
      if (response.success) {
        const voterData = { ...response.voter, token: response.token };
        setVoter(voterData);
        localStorage.setItem("voting_token", response.token);
        localStorage.setItem("voting_voter", JSON.stringify(response.voter));
        setView("ballot");
      }
    } catch (err: unknown) {
      console.error("Register error:", err);
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) {
      setError("Please select a candidate");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await votingApi.castVote(selectedCandidate);
      setVoteResult(result);
      setSuccess("Vote cast successfully!");
      
      if (voter) {
        const updatedVoter = { ...voter, has_voted: true, gas_balance: result.gas_remaining };
        setVoter(updatedVoter);
        localStorage.setItem("voting_voter", JSON.stringify(updatedVoter));
      }
      
      loadBlockchainStatus();
    } catch (err: unknown) {
      console.error("Vote error:", err);
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Failed to cast vote");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("voting_token");
    localStorage.removeItem("voting_voter");
    setVoter(null);
    setView("login");
    setVoteResult(null);
    setSuccess("");
    setError("");
    setResidentId("");
    setPin("");
    setFullName("");
    setSelectedCandidate("");
  };

  // Calculate results - who won
  const getWinner = () => {
    if (blockchainStatus && blockchainStatus.total_votes > 0 && candidates.length > 0) {
      // Get vote counts from blockchain
      // For now, return the candidate with most votes
      return candidates[0]; // Placeholder - would need actual vote counts from chain
    }
    return null;
  };

  const winner = getWinner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                Blockchain Voting
              </h1>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Secure • Transparent • Immutable
              </p>
            </div>
          </div>
          
          {blockchainStatus && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-emerald-900/80 rounded-lg">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">{blockchainStatus.chain_length} Blocks</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-emerald-900/80 rounded-lg">
                <Vote className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">{blockchainStatus.total_votes} Votes</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                blockchainStatus.is_valid ? "bg-green-100 dark:bg-green-900/80" : "bg-red-100 dark:bg-red-900/80"
              }`}>
                {blockchainStatus.is_valid ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium text-green-700 dark:text-green-300">
                  {blockchainStatus.is_valid ? "Valid" : "Invalid"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {!voter && (
            <Button
              variant={view === "login" ? "default" : "outline"}
              onClick={() => { setView("login"); setError(""); setSuccess(""); }}
            >
              Login
            </Button>
          )}
          {!voter && (
            <Button
              variant={view === "register" ? "default" : "outline"}
              onClick={() => { setView("register"); setError(""); setSuccess(""); }}
            >
              Register
            </Button>
          )}
          {voter && (
            <Button
              variant={view === "ballot" ? "default" : "outline"}
              onClick={() => { setView("ballot"); setError(""); setSuccess(""); }}
            >
              Ballot
            </Button>
          )}
          <Button
            variant={view === "results" ? "default" : "outline"}
            onClick={() => { setView("results"); setError(""); setSuccess(""); }}
          >
            Results
          </Button>
          {voter && (
            <Button variant="outline" onClick={handleLogout} className="ml-auto">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>

        {/* Login View */}
        {!voter && view === "login" && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full w-fit">
                <Vote className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle>Voter Login</CardTitle>
              <p className="text-muted-foreground">Enter your credentials to access the ballot</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-residentId">Resident ID</Label>
                  <Input
                    id="login-residentId"
                    type="text"
                    placeholder="Enter your Resident ID"
                    value={residentId}
                    onChange={(e) => setResidentId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-pin">PIN</Label>
                  <Input
                    id="login-pin"
                    type="password"
                    placeholder="Enter your PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Register View */}
        {!voter && view === "register" && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full w-fit">
                <UserPlus className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle>Register to Vote</CardTitle>
              <p className="text-muted-foreground">Create your voter account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-residentId">Resident ID</Label>
                  <Input
                    id="reg-residentId"
                    type="text"
                    placeholder="Enter your Resident ID"
                    value={residentId}
                    onChange={(e) => setResidentId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-fullName">Full Name</Label>
                  <Input
                    id="reg-fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-pin">PIN</Label>
                  <Input
                    id="reg-pin"
                    type="password"
                    placeholder="Create a PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Ballot View - Only shown when logged in */}
        {voter && view === "ballot" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">Welcome, {voter.full_name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Resident ID: {voter.resident_id_hash.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <Wallet className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold">{voter.gas_balance.toFixed(3)} GAS</span>
                    </div>
                    <Badge variant={voter.has_voted ? "default" : "secondary"}>
                      {voter.has_voted ? "Voted" : "Not Voted"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {voteResult ? (
              <Card className="border-green-500">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                    <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-green-600">Vote Cast Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="font-medium">Transaction Receipt:</p>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Transaction Hash:</span> <span className="font-mono text-xs">{voteResult.transaction.tx_hash}</span></p>
                      <p><span className="text-muted-foreground">Candidate:</span> {voteResult.transaction.candidate}</p>
                      <p><span className="text-muted-foreground">Gas Used:</span> {voteResult.gas_used} GAS</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : voter?.has_voted ? (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-amber-100 dark:bg-amber-900 rounded-full w-fit">
                    <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle>You Have Already Voted</CardTitle>
                  <p className="text-muted-foreground">Check the Results tab to see the current standings</p>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Cast Your Vote</CardTitle>
                  <p className="text-muted-foreground">Select your candidate below</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleVote} className="space-y-4">
                    <div className="grid gap-3">
                      {candidates.map((candidate) => (
                        <label
                          key={candidate.id}
                          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedCandidate === candidate.name
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="candidate"
                              value={candidate.name}
                              checked={selectedCandidate === candidate.name}
                              onChange={(e) => setSelectedCandidate(e.target.value)}
                              className="h-4 w-4 text-emerald-600"
                            />
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              {candidate.description && (
                                <p className="text-sm text-muted-foreground">{candidate.description}</p>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading || !selectedCandidate}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Vote (0.001 GAS)
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Results View */}
        {view === "results" && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full w-fit">
                <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle>Voting Results</CardTitle>
              <p className="text-muted-foreground">Live election results from the blockchain</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {candidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className={`p-4 border rounded-lg ${
                      index === 0 ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          {candidate.description && (
                            <p className="text-sm text-muted-foreground">{candidate.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{blockchainStatus?.total_votes || 0}</p>
                        <p className="text-sm text-muted-foreground">votes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-center text-muted-foreground">
                  Total Votes Cast: <span className="font-bold text-foreground">{blockchainStatus?.total_votes || 0}</span>
                </p>
                <p className="text-center text-muted-foreground text-sm mt-2">
                  Blockchain is {blockchainStatus?.is_valid ? <span className="text-green-600">valid</span> : <span className="text-red-600">invalid</span>}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
