# 출제 가능 주제 풀

## 도메인별 주제 분류

---

## 1. Cloud & Infrastructure

### Kubernetes & Orchestration
- Kubernetes 아키텍처 및 구성 요소
- Pod, Service, Ingress, ConfigMap/Secret
- Deployment Strategies (Rolling, Blue-Green, Canary)
- Helm, Kustomize
- Kubernetes Operators
- Multi-cluster Management
- Service Mesh (Istio, Linkerd)

### Cloud Platforms
- Multi-Cloud 전략
- Hybrid Cloud 아키텍처
- Cloud Migration 전략 (6R)
- Cloud-Native Application
- Serverless (AWS Lambda, Azure Functions, Cloud Functions)
- FaaS vs CaaS vs PaaS

### Infrastructure as Code
- Terraform
- Ansible, Chef, Puppet
- CloudFormation, ARM Templates
- Pulumi
- GitOps (ArgoCD, Flux)

### Platform Engineering
- Internal Developer Platform (IDP)
- Developer Experience (DX)
- Platform as a Product
- Self-Service Infrastructure

---

## 2. DevOps & CI/CD

### CI/CD
- CI/CD Pipeline 구축
- Jenkins, GitLab CI, GitHub Actions
- Continuous Deployment vs Continuous Delivery
- Artifact Management
- Configuration Management

### DevOps Practices
- DevOps 문화 및 조직
- Infrastructure as Code
- Immutable Infrastructure
- Cattle vs Pets
- ChatOps

### GitOps
- GitOps 원칙
- ArgoCD, Flux
- Pull-based vs Push-based Deployment
- Git as Single Source of Truth

### SRE
- SRE (Site Reliability Engineering)
- SLI, SLO, SLA
- Error Budget
- Toil 제거
- Chaos Engineering

### Observability
- Observability vs Monitoring
- OpenTelemetry
- Distributed Tracing (Jaeger, Zipkin)
- Metrics (Prometheus, Grafana)
- Logging (ELK Stack, Loki)
- AIOps

---

## 3. Security

### Zero Trust
- Zero Trust Architecture
- Zero Trust Network Access (ZTNA)
- Software Defined Perimeter (SDP)
- Micro-segmentation

### DevSecOps
- Shift-Left Security
- SAST, DAST, IAST
- Security in CI/CD Pipeline
- Secret Management (Vault, Secrets Manager)

### Container & Cloud Security
- Container Security
- Image Scanning
- Runtime Security (Falco)
- Kubernetes Security (RBAC, Network Policy, Pod Security)
- Cloud Security Posture Management (CSPM)

### Application Security
- OWASP Top 10
- API Security
- Supply Chain Security (SLSA, SBOM)
- Dependency Scanning
- Software Composition Analysis (SCA)

### Identity & Access
- IAM (Identity and Access Management)
- SSO (Single Sign-On)
- OAuth 2.0, OpenID Connect
- SAML
- Multi-Factor Authentication (MFA)

### Advanced Security
- Confidential Computing
- Homomorphic Encryption
- Post-Quantum Cryptography (개념)
- Blockchain for Security

---

## 4. Software Architecture

### Microservices
- Microservices Architecture (MSA)
- Service Decomposition
- API Gateway
- Service Discovery
- Circuit Breaker, Bulkhead
- Saga Pattern
- Strangler Fig Pattern

### Event-Driven Architecture
- Event-Driven Architecture (EDA)
- Event Sourcing
- CQRS (Command Query Responsibility Segregation)
- Event Streaming (Kafka, Pulsar)
- Message Queue (RabbitMQ, ActiveMQ)

### API Design
- REST API
- GraphQL
- gRPC
- WebSocket
- API Versioning
- API Gateway Pattern
- BFF (Backend For Frontend)

### Design Patterns
- Domain-Driven Design (DDD)
- Hexagonal Architecture (Ports & Adapters)
- Clean Architecture
- SOLID Principles
- 12-Factor App

### Architecture Styles
- Monolithic Architecture
- SOA (Service-Oriented Architecture)
- Serverless Architecture
- Jamstack
- Micro Frontend

---

## 5. Data Engineering & AI/ML

### Data Architecture
- Data Lake vs Data Warehouse
- Data Lakehouse
- Data Mesh
- Data Fabric
- Lambda Architecture, Kappa Architecture

### Real-time Data
- Stream Processing (Kafka Streams, Flink, Spark Streaming)
- Change Data Capture (CDC)
- Real-time Analytics
- Event-Driven Data Pipeline

### Data Governance
- Data Quality Management
- Data Lineage
- Data Catalog
- Master Data Management (MDM)
- Data Privacy (GDPR, 개인정보보호법)

### AI/ML Infrastructure
- MLOps
- LLMOps
- Model Training Pipeline
- Model Serving (TensorFlow Serving, Seldon)
- Feature Store
- Model Registry
- Model Monitoring, Drift Detection

### Vector & Semantic Search
- Vector Database (Pinecone, Milvus, Weaviate)
- Embedding Models
- Semantic Search
- RAG (Retrieval-Augmented Generation)

### Big Data
- Hadoop Ecosystem (HDFS, MapReduce, YARN)
- Spark (Batch, Streaming, ML)
- Data Processing Patterns
- Data Partitioning, Sharding

---

## 6. Database

### Relational Database
- RDBMS 아키텍처
- ACID 속성
- Transaction Isolation Levels
- Indexing Strategies
- Query Optimization
- Replication (Master-Slave, Multi-Master)
- Sharding

### NoSQL
- NoSQL 유형 (Key-Value, Document, Column-Family, Graph)
- CAP Theorem
- Eventual Consistency
- MongoDB, Cassandra, Redis, DynamoDB
- Graph Database (Neo4j)

### NewSQL
- NewSQL Database
- Distributed SQL (CockroachDB, TiDB)
- Spanner

### Database Trends
- Multi-Model Database
- Time-Series Database (InfluxDB, TimescaleDB)
- In-Memory Database
- Database as a Service (DBaaS)

---

## 7. Network & Infrastructure

### Network Architecture
- OSI 7 Layer
- TCP/IP
- Load Balancing (L4, L7)
- Reverse Proxy
- CDN (Content Delivery Network)
- DNS, DNSSEC

### Software-Defined Networking
- SDN (Software-Defined Networking)
- Network Function Virtualization (NFV)
- SD-WAN

### Service Mesh
- Service Mesh 아키텍처
- Sidecar Pattern
- Traffic Management
- Observability, Security in Service Mesh
- Istio, Linkerd, Consul

### Modern Networking
- HTTP/2, HTTP/3, QUIC
- WebRTC
- gRPC
- WebSocket
- Server-Sent Events (SSE)

---

## 8. Emerging Technologies

### Edge Computing
- Edge Computing 아키텍처
- Edge vs Fog vs Cloud
- Edge Native Applications
- 5G + Edge Computing
- Edge AI

### WebAssembly
- WebAssembly (Wasm) 개념
- Wasm Runtime (Wasmtime, WasmEdge)
- Wasm at Edge
- WASI (WebAssembly System Interface)

### Extended Reality
- AR/VR/MR 개념
- Metaverse 인프라
- Digital Twin

### Quantum Computing
- Quantum Computing 기본 개념 (Qubit, Superposition, Entanglement)
- Quantum Algorithms (개념 수준)
- Post-Quantum Cryptography

### Blockchain & Web3
- Blockchain 기본 원리
- Smart Contract
- DeFi, NFT (개념 수준)
- Distributed Ledger Technology (DLT)

### Advanced Technologies
- eBPF (Extended Berkeley Packet Filter)
- Unikernel
- Confidential Computing (TEE, SGX)

---

## 9. Testing & Quality

### Testing Strategies
- Test Pyramid
- Unit Test, Integration Test, E2E Test
- TDD, BDD
- Contract Testing (Pact)
- Chaos Engineering

### Test Automation
- Test Automation Framework
- Shift-Left Testing
- Testing in CI/CD
- Performance Testing
- Security Testing

### Quality Assurance
- Code Quality (SonarQube, CodeClimate)
- Technical Debt Management
- Code Review Best Practices
- Static Analysis

---

## 10. Agile & Methodology

### Agile Methodologies
- Scrum, Kanban
- SAFe (Scaled Agile Framework)
- Extreme Programming (XP)
- Lean Development

### DevOps Culture
- DevOps vs Agile
- Team Topologies
- Conway's Law
- Continuous Improvement

---

## 11. Performance & Scalability

### Performance Optimization
- Caching Strategies (CDN, Redis, Memcached)
- Database Optimization
- Application Performance Monitoring (APM)
- Load Testing

### Scalability Patterns
- Horizontal vs Vertical Scaling
- Auto-scaling
- Stateless vs Stateful Services
- Database Scaling (Read Replica, Sharding)

### Reliability Patterns
- Circuit Breaker
- Retry, Timeout
- Bulkhead
- Rate Limiting, Throttling
- Graceful Degradation

---

## 12. FinOps & Sustainability

### FinOps
- FinOps 원칙
- Cloud Cost Optimization
- Resource Tagging
- Reserved Instances, Savings Plans
- Cost Allocation

### Green Computing
- Sustainable Computing
- Carbon-Aware Computing
- Energy-Efficient Architecture
- Green Cloud

---

## 난이도별 분류

### 기본 (Basic)
성숙한 기술, 표준 개념, 기본 패턴

### 중급 (Intermediate)
최근 2-3년 기술, 실무 적용, 복합 시나리오

### 고급 (Advanced)
최신 기술, 깊은 원리, 융합 시스템
