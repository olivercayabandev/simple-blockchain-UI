# 1.1 Project Context

The emerging technology comprises recent innovations across various fields that improve efficiency, innovation, and problem-solving, greatly affecting information systems in today's world, including **Macatoc VoteChain**. It is suitable for community voting, team decisions, or fair elections. Our web application provides a secure, private voting solution using blockchain technology.

Recent studies have verified this basic blockchain approach with its application in resolving the fundamental concerns of voting systems, such as security, scalability, and voter privacy. Research by Jafar et al. (2021) discussed the implementation of electronic voting systems, focusing on SHA-256 hashing for vote integrity and addressing scalability concerns of blockchain technology (Sensors, 21(17), 5874).

Building upon these fundamentals, the Macatoc VoteChain system implements a custom Python-based blockchain with SHA-256 cryptographic hashing—similar to approaches studied by Goyal et al. (2022) on Ethereum-based voting systems and Hadiprodjo et al. (2025) on anti-manipulation systems. The system uses a simplified Proof-of-Work consensus mechanism that can be easily supported on basic web hosting infrastructure.

The system also incorporates a gas mechanism (0.001 units per vote) to prevent spamming, inspired by Ethereum's transaction fee model studied by various researchers. This approach ensures that voters have a limited number of votes (1.0 initial gas balance) while preventing malicious actors from flooding the system.

By solving the problems identified in recent blockchain voting studies, the Macatoc VoteChain system achieves the following three objectives through its web application:

1. **Secure Voting through Cryptographic Hashing**: Every vote is hashed using SHA-256 algorithm, creating a unique digital fingerprint that ensures vote integrity and prevents tampering.

2. **Prevention of Vote Tampering and Double Voting**: The blockchain maintains a permanent and immutable ledger where each vote is recorded with a unique transaction hash. Once a vote is cast, it cannot be altered or deleted. The system also tracks whether a voter has already voted through both database records and blockchain verification.

3. **Accessible and Simple Voting for Communities**: The system provides a clean, mobile-responsive interface that allows any person to vote with a simple one-click process. No technical expertise is required—voters simply log in with their Resident ID and PIN, select a candidate, and submit their vote. The simplified Proof-of-Work mining (auto-mining every 5 votes or manual admin trigger) ensures the system remains lightweight and can be deployed on any basic web hosting infrastructure suitable for barangays, classrooms, communities, and teams.

---

## Technical Implementation Summary

The Macatoc VoteChain system consists of:

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React.js + Tailwind CSS | User interface for voting |
| Backend | Python FastAPI | REST API handling |
| Database | SQLite | Voter and candidate storage |
| Blockchain | Custom Python (SHA-256) | Immutable vote ledger |
| Authentication | JWT Tokens | Secure session management |
| Mining | Proof-of-Work | Block creation |

The system automatically mines blocks every 5 votes or can be manually triggered by an administrator, ensuring votes are permanently recorded on the blockchain.
