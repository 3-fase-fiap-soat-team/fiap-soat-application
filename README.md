# FIAP SOAT - Aplicação Principal

NestJS com Clean Architecture - Fase 3

## 🎯 **Objetivo**
Migrar aplicação NestJS da Fase 2 integrando API Gateway e autenticação JWT/Cognito, mantendo Clean Architecture.

## 👨‍💻 **Responsável**
- **Dev 2 (thaismirandag)** - API Gateway + Integração Cognito JWT
- **Repositórios:** `fiap-soat-application`
- **Foco:** NestJS + API Gateway + JWT/Cognito
- **Tecnologias:** NestJS, AWS API Gateway, Cognito, JWT, Clean Architecture

## 📁 **Estrutura do Projeto**
```
src/
├── modules/           # Módulos de domínio (Clean Architecture)
│   ├── auth/          # Módulo de autenticação
│   │   ├── application/   # Use cases
│   │   ├── domain/        # Entities e interfaces
│   │   ├── infrastructure/ # Repositories e gateways
│   │   └── presentation/  # Controllers
│   ├── customers/     # Módulo de clientes
│   ├── products/      # Módulo de produtos
│   ├── orders/        # Módulo de pedidos
│   └── payments/      # Módulo de pagamentos
├── shared/            # Utilitários compartilhados
│   ├── config/        # Configurações
│   ├── guards/        # Guards JWT/Cognito
│   ├── interceptors/  # Interceptors
│   ├── pipes/         # Validation pipes
│   └── utils/         # Utilities
├── config/            # Configurações da aplicação
│   ├── database.ts    # Config PostgreSQL
│   ├── aws.ts         # Config AWS services
│   ├── jwt.ts         # Config JWT
│   └── api-gateway.ts # Config API Gateway
test/
├── unit/              # Testes unitários
├── integration/       # Testes de integração
└── e2e/              # Testes end-to-end
docker/
├── Dockerfile         # Container da aplicação
├── docker-compose.yml # Ambiente local
└── .dockerignore
```

## ⚙️ **Configuração AWS Academy**
- **Região:** us-east-1
- **Budget:** $50 USD (AWS Academy)
- **API Gateway:** REST API (mais econômico que HTTP API)
- **Cognito:** User Pool básico
- **JWT:** Tokens com expiração otimizada
- **Database:** Conexão com RDS PostgreSQL

## 🚀 **Setup Local**
```bash
# Clonar repositório
git clone https://github.com/3-fase-fiap-soat-team/fiap-soat-application.git
cd fiap-soat-application

# Configurar Git
git config user.name "thaismirandag"
git config user.email "seu-email@gmail.com"

# Instalar dependências
npm install

# Configurar ambiente local
cp .env.example .env
# Editar .env com configurações locais

# Executar migrations (se necessário)
npm run migration:run

# Executar aplicação
npm run start:dev

# Acessar aplicação
curl http://localhost:3000/health
```

## 🏗️ **Desenvolvimento**
```bash
# Executar em modo desenvolvimento
npm run start:dev

# Executar testes
npm run test           # Testes unitários
npm run test:e2e       # Testes e2e
npm run test:cov       # Coverage

# Linting e formatação
npm run lint           # ESLint
npm run format         # Prettier

# Build para produção
npm run build

# Build Docker
docker build -t fiap-soat-app .
docker run -p 3000:3000 fiap-soat-app
```

## 🔐 **Integração API Gateway + Cognito**
```typescript
// Exemplo de configuração JWT/Cognito
@Injectable()
export class CognitoAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) throw new UnauthorizedException();
    
    try {
      // Validar token JWT do Cognito
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.COGNITO_JWT_SECRET,
      });
      
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
```

## 📋 **Migração da Fase 2**
- ✅ **Clean Architecture:** Manter estrutura modular
- ✅ **CQRS:** Commands e Queries separados
- ✅ **Domain Events:** Sistema de eventos
- ✅ **Repository Pattern:** Abstração de dados
- 🔄 **Novo:** Integração API Gateway
- 🔄 **Novo:** Autenticação JWT/Cognito
- 🔄 **Novo:** Deploy em EKS

## 🔄 **Workflow de Desenvolvimento**
1. **Branch:** `feature/[nome-da-feature]`
2. **Desenvolvimento:** Implementar + testes
3. **Migração:** Adaptar código da Fase 2
4. **Integração:** API Gateway + JWT
5. **PR:** Solicitar review do team
6. **CI/CD:** GitHub Actions executa testes
7. **Deploy:** Container no EKS

## 🧪 **CI/CD Pipeline**
- **Trigger:** Push na `main` ou `develop`
- **Build:** npm build + Docker image
- **Tests:** Jest + E2E + Linting
- **Security:** Scan de vulnerabilidades
- **Deploy:** Push para registry + deploy EKS

## 🔗 **Integração com Outros Serviços**
```typescript
// Integração com Lambda de autenticação
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Chamar Lambda de autenticação via CPF
    const response = await this.httpService.post(
      process.env.LAMBDA_AUTH_URL,
      { cpf: loginDto.cpf }
    );
    
    return response.data;
  }
}

// Integração com RDS PostgreSQL
@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>
  ) {}
  
  async findByCpf(cpf: string): Promise<Customer> {
    return this.customerRepo.findOne({ where: { cpf } });
  }
}
```

## 🔐 **Variáveis de Ambiente**
```bash
# .env
# Database (RDS PostgreSQL)
DB_HOST=fiap-soat-postgres.cluster-xyz.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=fiapsoat
DB_PASSWORD=***
DB_DATABASE=fiapsoat

# AWS Services
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XYZ
COGNITO_CLIENT_ID=abc123
LAMBDA_AUTH_URL=https://abc.execute-api.us-east-1.amazonaws.com/prod/auth

# JWT
JWT_SECRET=super-secret-key
JWT_EXPIRES_IN=1h

# API Gateway
API_GATEWAY_URL=https://api.fiap-soat.com
```

## 🔐 **Secrets GitHub (Auto-configurados)**
- `AWS_ACCESS_KEY_ID` - Chave de acesso AWS Academy
- `AWS_SECRET_ACCESS_KEY` - Secret de acesso AWS Academy
- `AWS_SESSION_TOKEN` - Token de sessão AWS Academy
- `TF_STATE_BUCKET` - Bucket S3 para state

## 📋 **Endpoints da API**
```
# Autenticação
POST /auth/login          # Login via CPF
GET  /auth/profile        # Perfil do usuário

# Clientes
GET    /customers         # Listar clientes
POST   /customers         # Criar cliente
GET    /customers/:id     # Buscar cliente
PUT    /customers/:id     # Atualizar cliente

# Produtos
GET    /products          # Listar produtos
POST   /products          # Criar produto
GET    /products/:id      # Buscar produto
PUT    /products/:id      # Atualizar produto

# Pedidos
GET    /orders            # Listar pedidos
POST   /orders            # Criar pedido
GET    /orders/:id        # Buscar pedido
PUT    /orders/:id/status # Atualizar status

# Pagamentos
POST   /payments          # Processar pagamento
GET    /payments/:id      # Status do pagamento
```

## 🐳 **Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

## 📚 **Links Importantes**
- **Organização:** https://github.com/3-fase-fiap-soat-team
- **Lambda Repo:** https://github.com/3-fase-fiap-soat-team/fiap-soat-lambda
- **Database Repo:** https://github.com/3-fase-fiap-soat-team/fiap-soat-database-terraform
- **EKS Repo:** https://github.com/3-fase-fiap-soat-team/fiap-soat-k8s-terraform
- **NestJS Docs:** https://docs.nestjs.com/
- **AWS Cognito:** https://docs.aws.amazon.com/cognito/

## ⚠️ **Importante - AWS Academy**
- **Budget limitado:** $50 USD total
- **API Gateway:** ~$3.50 por milhão de calls
- **Cognito:** 50.000 MAUs gratuitos
- **Monitorar custos:** AWS Cost Explorer
- **Testes locais:** Usar Docker Compose

## 🛡️ **Segurança**
- Validação de entrada com class-validator
- Guards JWT para rotas protegidas
- Rate limiting com @nestjs/throttler
- Helmet para headers de segurança
- CORS configurado adequadamente
- Logs estruturados com Winston

## 🧪 **Testes**
```bash
# Executar todos os testes
npm run test

# Testes específicos
npm run test -- --testPathPattern=customers
npm run test:e2e -- --testNamePattern="Auth"

# Coverage
npm run test:cov

# Watch mode
npm run test:watch
```
