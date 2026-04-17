import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { votingEthApi, Voter, Candidate, VoteResult, BlockchainStatus } from "~/api-services/voting-eth.service";
import { 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Shield,
  Send,
  Search,
  LogOut,
  Activity,
  Coins
} from "lucide-react";

type View = "login" | "register" | "ballot" | "verify";

interface VoterState extends Voter {
  token: string;
  privateKey?: string;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function VotingEthPage() {
  const [view, setView] = useState<View>("login");
  const [voter, setVoter] = useState<VoterState | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Wallet states
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null);
  const [verifyAddress, setVerifyAddress] = useState("");
  const [verifyResult, setVerifyResult] = useState<{valid: boolean; message: string} | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus | null>(null);

  useEffect(() => {
    const savedVoter = localStorage.getItem("eth_voter");
    const savedToken = localStorage.getItem("eth_token");
    const savedKey = localStorage.getItem("eth_private_key");
    
    if (savedVoter && savedToken) {
      const parsedVoter = JSON.parse(savedVoter);
      setVoter({ ...parsedVoter, token: savedToken, privateKey: savedKey || undefined });
      if (!parsedVoter.has_voted) {
        setView("ballot");
      }
    }
    
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      setIsMetaMaskInstalled(true);
    }
    
    loadCandidates();
    loadBlockchainStatus();
  }, []);

  const loadCandidates = async () => {
    try {
      const data = await votingEthApi.getCandidates();
      setCandidates(data.candidates);
    } catch (err) {
      console.error("Failed to load candidates:", err);
    }
  };

  const loadBlockchainStatus = async () => {
    try {
      const data = await votingEthApi.getBlockchainStatus();
      setBlockchainStatus(data);
    } catch (err) {
      console.error("Failed to load blockchain status:", err);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed!");
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      setWalletAddress(accounts[0]);
      setError("");
    } catch (err: unknown) {
      const error = err as { code?: number; message?: string };
      setError(error.message || "Failed to connect wallet");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !fullName) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await votingEthApi.register(walletAddress, fullName);
      if (response.success) {
        const voterData = { ...response.voter, token: response.token, privateKey };
        setVoter(voterData);
        localStorage.setItem("eth_token", response.token);
        localStorage.setItem("eth_voter", JSON.stringify(response.voter));
        if (privateKey) {
          localStorage.setItem("eth_private_key", privateKey);
        }
        setView("ballot");
      }
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await votingEthApi.login(walletAddress);
      if (response.success) {
        const voterData = { ...response.voter, token: response.token, privateKey };
        setVoter(voterData);
        localStorage.setItem("eth_token", response.token);
        localStorage.setItem("eth_voter", JSON.stringify(response.voter));
        
        if (response.voter.has_voted) {
          setSuccess("You have already voted.");
          setView("verify");
        } else {
          setView("ballot");
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !walletAddress || !privateKey) {
      setError("Please select a candidate and ensure your private key is entered");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await votingEthApi.castVote(selectedCandidate, walletAddress, privateKey);
      setVoteResult(result);
      setSuccess("Vote cast successfully on blockchain!");
      
      if (voter) {
        const updatedVoter = { ...voter, has_voted: true };
        setVoter(updatedVoter);
        localStorage.setItem("eth_voter", JSON.stringify(updatedVoter));
      }
      
      loadBlockchainStatus();
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { data?: { detail?: string } } };
      setError(error.message || error.response?.data?.detail || "Failed to cast vote");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAddress) return;

    setVerifying(true);
    try {
      const result = await votingEthApi.verifyVote(verifyAddress);
      setVerifyResult({ valid: result.valid, message: result.message });
    } catch (err) {
      setVerifyResult({ valid: false, message: "Verification failed" });
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("eth_token");
    localStorage.removeItem("eth_voter");
    localStorage.removeItem("eth_private_key");
    setVoter(null);
    setView("login");
    setVoteResult(null);
    setSuccess("");
    setError("");
    setWalletAddress("");
    setPrivateKey("");
    setFullName("");
    setSelectedCandidate(null);
  };

  const formatAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  const formatHash = (hash: string) => {
    return hash.slice(0, 10) + "..." + hash.slice(-8);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                Ethereum Voting
              </h1>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Connect Wallet • Vote on Blockchain
              </p>
            </div>
          </div>
          
          {blockchainStatus && (
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                blockchainStatus.connected 
                  ? "bg-green-100 dark:bg-green-900/80" 
                  : "bg-red-100 dark:bg-red-900/80"
              }`}>
                {blockchainStatus.connected ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="font-medium text-green-700 dark:text-green-300">
                  {blockchainStatus.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-purple-900/80 rounded-lg">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Block #{blockchainStatus.block_number}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={view === "login" ? "default" : "outline"}
            onClick={() => { setView("login"); setError(""); setSuccess(""); }}
          >
            Login
          </Button>
          <Button
            variant={view === "register" ? "default" : "outline"}
            onClick={() => { setView("register"); setError(""); setSuccess(""); }}
          >
            Register
          </Button>
          <Button
            variant={view === "ballot" ? "default" : "outline"}
            onClick={() => { setView("ballot"); setError(""); setSuccess(""); }}
          >
            Ballot
          </Button>
          <Button
            variant={view === "verify" ? "default" : "outline"}
            onClick={() => { setView("verify"); setError(""); setSuccess(""); }}
          >
            Verify
          </Button>
          {voter && (
            <Button variant="outline" onClick={handleLogout} className="ml-auto">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>

        {/* Login View */}
        {view === "login" && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                <Wallet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Connect Wallet</CardTitle>
              <p className="text-muted-foreground">Connect your wallet to login</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!walletAddress ? (
                  <div className="text-center space-y-4">
                    {isMetaMaskInstalled ? (
                      <Button onClick={connectWallet} className="w-full">
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect MetaMask
                      </Button>
                    ) : (
                      <div className="p-4 bg-amber-100 dark:bg-amber-900 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                        Please install MetaMask browser extension
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300">Connected:</p>
                    <p className="font-mono text-sm">{formatAddress(walletAddress)}</p>
                  </div>
                )}
                
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                
                <Button 
                  onClick={handleLogin} 
                  className="w-full" 
                  disabled={loading || !walletAddress}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Register View */}
        {view === "register" && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                <Wallet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Register to Vote</CardTitle>
              <p className="text-muted-foreground">Connect wallet and enter your details</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {!walletAddress ? (
                  <Button type="button" onClick={connectWallet} className="w-full">
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect MetaMask First
                  </Button>
                ) : (
                  <>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-center">
                      <p className="font-mono text-sm">{formatAddress(walletAddress)}</p>
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
                      <Label htmlFor="reg-privateKey">Private Key (for voting)</Label>
                      <Input
                        id="reg-privateKey"
                        type="password"
                        placeholder="Enter your private key"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Required to sign voting transactions
                      </p>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading || !fullName || !privateKey}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Register
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {/* Ballot View */}
        {view === "ballot" && (
          <div className="space-y-6">
            {voter && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">Welcome, {voter.full_name}</h2>
                      <p className="text-sm text-muted-foreground font-mono">
                        {formatAddress(voter.wallet_address)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Coins className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold">{(voter.gas_balance / 1e18).toFixed(4)} ETH</span>
                      </div>
                      <Badge variant={voter.has_voted ? "default" : "secondary"}>
                        {voter.has_voted ? "Voted" : "Not Voted"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                      <p><span className="text-muted-foreground">Tx Hash:</span> <span className="font-mono text-xs">{formatHash(voteResult.transaction_hash)}</span></p>
                      <p><span className="text-muted-foreground">Gas Used:</span> {voteResult.gas_used}</p>
                    </div>
                  </div>
                  <Button onClick={() => { setView("verify"); setVerifyAddress(voter?.wallet_address || ""); }} className="w-full">
                    Verify Your Vote
                  </Button>
                </CardContent>
              </Card>
            ) : voter?.has_voted ? (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 bg-amber-100 dark:bg-amber-900 rounded-full w-fit">
                    <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle>You Have Already Voted</CardTitle>
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
                            selectedCandidate === candidate.id
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="candidate"
                              value={candidate.id}
                              checked={selectedCandidate === candidate.id}
                              onChange={(e) => setSelectedCandidate(Number(e.target.value))}
                              className="h-4 w-4 text-purple-600"
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
                    {error && (
                      <p className="text-sm text-red-500 text-center">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={loading || !selectedCandidate}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Vote (0.001 ETH gas)
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {success && (
              <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-green-700 dark:text-green-300 text-center">
                {success}
              </div>
            )}
          </div>
        )}

        {/* Verify View */}
        {view === "verify" && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit">
                <Search className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Verify Your Vote</CardTitle>
              <p className="text-muted-foreground">Enter wallet address to verify vote on blockchain</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-address">Wallet Address</Label>
                  <Input
                    id="verify-address"
                    type="text"
                    placeholder="0x..."
                    value={verifyAddress || voter?.wallet_address || ""}
                    onChange={(e) => setVerifyAddress(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={verifying}>
                  {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify
                </Button>
              </form>
              
              {verifyResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  verifyResult.valid 
                    ? "bg-green-100 dark:bg-green-900" 
                    : "bg-red-100 dark:bg-red-900"
                }`}>
                  <div className="flex items-center gap-2">
                    {verifyResult.valid ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <p className={`font-medium ${
                      verifyResult.valid 
                        ? "text-green-700 dark:text-green-300" 
                        : "text-red-700 dark:text-red-300"
                    }`}>
                      {verifyResult.message}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
