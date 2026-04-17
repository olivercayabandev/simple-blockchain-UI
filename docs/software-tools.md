# Software Design and Development Tools

This chapter provides an in-depth explanation of all the software, frameworks, libraries, and tools used in developing the Blockchain Voting System. Each tool is described along with its purpose, features, and rationale for selection.

---

## 1. Frontend Technologies

### 1.1 React.js (Version 19.x)

**Description:**
React.js is a JavaScript library for building user interfaces, developed and maintained by Meta (formerly Facebook). It uses a component-based architecture that allows developers to create reusable UI components.

**Purpose in this Study:**
- Used as the core frontend framework for building the voting interface
- Enables dynamic updates without page reloads
- Provides efficient state management for voter authentication and ballot interactions

**Key Features:**
- Virtual DOM for optimal rendering performance
- Component-based architecture for reusability
- One-way data binding for predictable state management
- Rich ecosystem of libraries and tools

---

### 1.2 Tailwind CSS (Version 4.x)

**Description:**
Tailwind CSS is a utility-first CSS framework that enables rapid UI development by providing low-level utility classes. Unlike traditional CSS frameworks, Tailwind doesn't impose pre-designed components, allowing complete customization.

**Purpose in this Study:**
- Styling all UI components (login forms, ballot interface, admin dashboard)
- Creating responsive layouts that work on mobile and desktop devices
- Implementing the green/teal color scheme for the voting interface

**Key Features:**
- Utility-first approach for flexible styling
- Built-in responsive design breakpoints
- Dark mode support
- Small bundle size through tree-shaking

---

### 1.3 TanStack Router (Version 1.x)

**Description:**
TanStack Router is a type-safe routing library for React applications. It provides file-based routing similar to Next.js but with full type safety and flexibility.

**Purpose in this Study:**
- Managing navigation between different pages (Login, Register, Ballot, Results, Admin)
- Creating routes: /voting, /admin, /dashboard

**Key Features:**
- Type-safe routing with TypeScript
- File-based route generation
- Nested routing support
- Lazy loading capabilities

---

### 1.4 Framer Motion (Version 11.x)

**Description:**
Framer Motion is a React library for creating smooth animations and gestures. It provides declarative animation primitives that integrate seamlessly with React's component model.

**Purpose in this Study:**
- Adding smooth transitions between views
- Enhancing user experience with subtle animations
- Visual feedback for user interactions

**Key Features:**
- Declarative animation API
- Gesture recognition (tap, drag, hover)
- Layout animations
- Exit animations

---

### 1.5 Axios

**Description:**
Axios is a promise-based HTTP client for making API requests. It works both in browsers and Node.js environments, providing a unified API for REST API communication.

**Purpose in this Study:**
- Communicating with the FastAPI backend
- Handling voter registration, login, and vote casting requests
- Managing authentication tokens

**Key Features:**
- Promise-based APIresponse intercept
- Request/ors
- Automatic JSON transformation
- Error handling

---

## 2. Backend Technologies

### 2.1 Python (Version 3.x)

**Description:**
Python is a high-level, interpreted programming language known for its readability and versatility. It supports multiple programming paradigms and has extensive library support.

**Purpose in this Study:**
- Backend API development
- Blockchain implementation
- Database management

**Key Features:**
- Simple, readable syntax
- Extensive standard library
- Strong community support
- Cross-platform compatibility

---

### 2.2 FastAPI (Version 0.109.0)

**Description:**
FastAPI is a modern, fast (high-performance) Python web framework for building APIs. It is based on standard Python type hints and provides automatic interactive documentation.

**Purpose in this Study:**
- Creating REST API endpoints for all voting operations
- Handling HTTP requests from the frontend
- Managing authentication and authorization

**Key Features:**
- High performance (comparable to Node.js and Go)
- Automatic API documentation (Swagger UI)
- Type validation with Pydantic
- Asynchronous support

**API Endpoints Created:**
```
POST   /api/register      - Register new voter
POST   /api/login         - Voter authentication
GET    /api/candidates    - List candidates
POST   /api/vote          - Cast a vote
GET    /api/verify/{hash} - Verify vote
GET    /api/chain         - Get blockchain data
POST   /api/admin/login   - Admin authentication
POST   /api/admin/election/start - Start election
POST   /api/admin/election/stop  - Stop election
POST   /api/admin/candidates     - Add candidate
POST   /api/admin/mine           - Mine block
GET    /api/admin/stats          - Get statistics
```

---

### 2.3 SQLite

**Description:**
SQLite is a lightweight, file-based relational database engine. It is self-contained, serverless, and requires no configuration, making it ideal for small to medium applications.

**Purpose in this Study:**
- Storing voter registration data
- Managing candidate information
- Recording election configuration
- Storing admin user credentials

**Database Schema:**
```sql
voters          - Stores voter information
candidates      - Stores candidate data
election_config - Election status and settings
admin_users    - Admin authentication data
```

**Key Features:**
- Zero-configuration
- Single file storage
- ACID compliant
- Lightweight (less than 500KB)

---

### 2.4 Uvicorn (Version 0.27.0)

**Description:**
Uvicorn is an ASGI (Asynchronous Server Gateway Interface) server implementation for Python. It is designed to be fast and provides minimal core for running ASGI applications.

**Purpose in this Study:**
- Running the FastAPI application
- Handling concurrent requests efficiently

**Key Features:**
- ASGI/WSGI compatibility
- Hot reload during development
- High performance
- Minimal memory footprint

---

## 3. Security & Authentication

### 3.1 JWT (JSON Web Tokens)

**Description:**
JWT is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It consists of three parts: header, payload, and signature.

**Purpose in this Study:**
- Authenticating voters after login
- Maintaining session state
- Securing API endpoints

**Token Structure:**
```
Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"resident_id_hash": "...", "full_name": "...", "role": "voter", "exp": ...}
Signature: HMAC-SHA256 signature
```

---

### 3.2 python-jose (Version 3.3.0)

**Description:**
python-jose is a Python library for working with JWT tokens. It provides functions for encoding, decoding, and validating JWTs.

**Purpose in this Study:**
- Generating JWT tokens for authenticated users
- Verifying token validity
- Handling token expiration

---

### 3.3 Passlib (Version 1.7.4)

**Description:**
Passlib is a Python library for password hashing. It provides a unified interface to various password hashing algorithms.

**Purpose in this Study:**
- Hashing voter PINs for secure storage
- Verifying passwords during authentication
- Using bcrypt for secure hashing

---

## 4. Blockchain Implementation

### 4.1 hashlib (Built-in Python)

**Description:**
hashlib is a built-in Python module that provides interface to different hash algorithms, including SHA-256.

**Purpose in this Study:**
- SHA-256 hashing for blocks and transactions
- Creating unique transaction hashes
- Generating voter ID hashes
- Validating chain integrity

**Implementation:**
```python
import hashlib

def calculate_hash(index, timestamp, transactions, previous_hash, nonce):
    block_data = f"{index}{timestamp}{transactions}{previous_hash}{nonce}"
    return hashlib.sha256(block_data.encode()).hexdigest()
```

---

## 5. Development Tools

### 5.1 Visual Studio Code

**Description:**
VS Code is a lightweight but powerful source code editor with support for TypeScript, Python, and web technologies.

**Purpose in this Study:**
- Writing all frontend and backend code
- Debugging applications
- Managing version control

---

### 5.2 Git / GitHub

**Description:**
Git is a distributed version control system, and GitHub is a cloud platform for hosting Git repositories.

**Purpose in this Study:**
- Version control for source code
- Collaboration and backup
- Deployment to cloud platforms

---

### 5.3 Vite (Version 7.x)

**Description:**
Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.

**Purpose in this Study:**
- Building and bundling the React application
- Hot Module Replacement (HMR) during development
- Production optimization

**Key Features:**
- Instant server start
- Lightning-fast HMR
- Optimized production builds

---

### 5.4 TypeScript (Version 5.x)

**Description:**
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional static typing and other features to JavaScript.

**Purpose in this Study:**
- Type safety across the frontend
- Better IDE support and autocompletion
- Catching errors during development

---

## 6. Summary Table

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Frontend Framework | React.js | 19.x | UI components and state management |
| CSS Framework | Tailwind CSS | 4.x | Styling and responsive design |
| Routing | TanStack Router | 1.x | Page navigation |
| Animations | Framer Motion | 11.x | UI animations |
| HTTP Client | Axios | 1.x | API requests |
| Backend Framework | FastAPI | 0.109.0 | REST API development |
| Database | SQLite | 3.x | Data storage |
| Server | Uvicorn | 0.27.0 | ASGI server |
| Authentication | python-jose | 3.3.0 | JWT token handling |
| Password Hashing | passlib | 1.7.4 | Secure password storage |
| Hashing | hashlib | Built-in | SHA-256 encryption |
| Build Tool | Vite | 7.x | Development & build |
| Language | TypeScript | 5.x | Type-safe JavaScript |
| Language | Python | 3.x | Backend development |

---

## 7. Rationale for Tool Selection

### 7.1 Why React.js?
- **Popularity:** Large community and extensive documentation
- **Component-based:** Promotes code reusability
- **Ecosystem:** Rich selection of libraries

### 7.2 Why FastAPI?
- **Performance:** One of the fastest Python frameworks
- **Documentation:** Automatic API docs save development time
- **Type Safety:** Native support for Pydantic models

### 7.3 Why SQLite?
- **Simplicity:** No server setup required
- **Portability:** Single file contains entire database
- **Adequacy:** Sufficient for single-barangay voting scale

### 7.4 Why Custom Blockchain?
- **Learning:** Demonstrates blockchain fundamentals
- **Control:** Full control over consensus logic
- **Cost:** No transaction fees required
- **Simplicity:** Easier to deploy than Ethereum
