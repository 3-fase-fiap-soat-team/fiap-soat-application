# Grupo 271 - Desafio SOAT Tech

## Sobre o Projeto

Este projeto é um sistema de autoatendimento para uma lanchonete em expansão, desenvolvido como parte do Tech Challenge da SOAT. O sistema visa resolver os desafios de gestão de pedidos e atendimento ao cliente, oferecendo uma solução completa para autoatendimento e gerenciamento de pedidos.

### Objetivos

O sistema tem como principais objetivos:

1. **Autoatendimento Eficiente**
   - Permitir que clientes realizem pedidos de forma autônoma
   - Oferecer interface intuitiva para seleção de produtos
   - Facilitar a personalização de pedidos
   - Integrar sistema de pagamento via QR Code (Mercado Pago)

2. **Gestão de Pedidos**
   - Controlar o fluxo de pedidos desde a recepção até a entrega
   - Monitorar o status dos pedidos em tempo real
   - Gerenciar filas de preparação
   - Notificar clientes sobre o status de seus pedidos

3. **Administração do Estabelecimento**
   - Gerenciar cadastro de clientes
   - Controlar produtos e categorias
   - Monitorar pedidos em andamento
   - Acompanhar tempo de espera

4. **Experiência do Cliente**
   - Permitir identificação via CPF
   - Oferecer cadastro simplificado
   - Facilitar o acompanhamento do pedido
   - Garantir transparência no processo

### Funcionalidades Principais

- **Pedidos**
  - Seleção de produtos por categoria (Lanche, Acompanhamento, Bebida, Sobremesa)
  - Personalização de pedidos
  - Identificação do cliente (CPF, cadastro ou anônimo)

- **Pagamento**
  - Integração com Mercado Pago
  - Pagamento via QR Code

- **Acompanhamento**
  - Monitoramento em tempo real do status do pedido
  - Status: Recebido, Em preparação, Pronto, Finalizado
  - Notificações de conclusão

- **Administração**
  - Gestão de clientes
  - Controle de produtos e categorias
  - Monitoramento de pedidos
  - Análise de tempo de espera

## Integrantes
- Juan Pablo Neres de Lima (RM361411) - Discord: juanjohnny
- Rafael Petherson Sampaio (RM364885) - Discord: tupanrps7477
- Gustavo Silva Chaves Do Nascimento (RM361477) - Discord: gustavosilva2673

## Links Importantes
- [Repositório GitHub](https://github.com/fiap-group-273/tech-chalenge)
- [Desenho de Fluxo](https://miro.com/app/board/uXjVJXtfEMw=/?share_link_id=247299580492)
- [Diagrama de Infraestrutura](https://drive.google.com/file/d/12MQ86MMUuziVfoD7i3s9g8UmBE3q78vQ/view?usp=sharing)
- [Vídeo](https://www.youtube.com/watch?v=m_8Sd9t2Jm4)

---

## Desafio SOAT Tech

## Como Executar o Projeto

### Pré-requisitos
- Docker
- Docker Compose
- Make (GNU Make)
- Kubernetes (para deploy em produção)
- Helm (para deploy em Kubernetes)

#### Instalação do Make

- **macOS** (usando Homebrew):
```bash
brew install make
```

- **Linux** (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install make
```

- **Linux** (Fedora):
```bash
sudo dnf install make
```

- **Windows**:
  - Instale o [Chocolatey](https://chocolatey.org/install)
  - Execute no PowerShell como administrador:
```bash
choco install make
```

### Execução Local (Docker Compose)

1. Copie o arquivo de ambiente de exemplo:
```bash
cp .env.example .env
```

2. Para iniciar a aplicação, use o comando:
```bash
make init
```
Este comando irá:
- Iniciar os containers Docker
- Executar as migrações do banco de dados
- Iniciar a aplicação

3. Acesse a aplicação em:
```
http://localhost:3000
```

4. Acesse a documentação Swagger em:
```
http://localhost:3000/docs
```

5. Caso queira criar uma migração, use o comando:
```
make migrate-create -- name=nomeDaSuaMigracao
```

6. Caso queira limpar os containers, use o comando:
```bash
make clean
```

### Deploy em Kubernetes

#### Pré-requisitos
- Cluster Kubernetes configurado
- Helm instalado
- kubectl configurado

#### Comandos de Deploy

1. **Preparação do Ambiente**
```bash
# Verificar cluster
kubectl cluster-info

# Criar namespace
kubectl create namespace fiap
```

2. **Deploy da Aplicação**
```bash
# Instalar com Helm
helm install soat-tech-challenge ./k8s --namespace fiap --create-namespace

# Verificar status
kubectl get pods -n fiap
```

3. **Acessar a Aplicação**
```bash
# Port-forward para acesso local
kubectl port-forward service/soat-tech-challenge 3000:3000 -n fiap
```

4. **Testes de Carga com Locust**
```bash
# Criar namespace para Locust
kubectl create namespace locust

# Aplicar ConfigMap
kubectl apply -f load-tests/configmap.yaml

# Instalar Locust
helm repo add deliveryhero https://charts.deliveryhero.io/
helm install locust deliveryhero/locust \
  --namespace locust \
  --values load-tests/values-locust.yaml

# Acessar interface do Locust
kubectl port-forward service/locust 8089:8089 -n locust
```

## Arquitetura Limpa (Clean Architecture)

> **⚠️ Importante**: A implementação da Clean Architecture está disponível na branch `refactor/orders-in-clean-arch`. Para acessar o código com a arquitetura limpa, faça checkout nesta branch.

Este projeto implementa a Arquitetura Limpa, também conhecida como Clean Architecture, é uma forma de organizar o código de um sistema de maneira que ele fique mais desacoplado, testável, sustentável e independente de frameworks, bancos de dados, interfaces gráficas ou outros detalhes externos. A arquitetura é dividida em camadas principais:

### 1. Domínio (Core/Entities)
- Contém as entidades e regras de negócio
- Independente de frameworks e detalhes externos
- Camada mais interna da aplicação

### 2. Aplicação (Use Cases)
- Orquestra o fluxo entre o domínio e o mundo exterior
- Implementa os casos de uso da aplicação
- Define as portas (interfaces) para comunicação com o mundo exterior
- Exemplos:
  - Portas (interfaces) para repositórios e serviços externos
  - Command/Query Handlers
  - Serviços específicos do módulo

### 3. Infraestrutura (Adaptadores)
- Implementa a comunicação com bancos de dados, APIs externas, etc.
- Adapta as interfaces definidas nas camadas internas para tecnologias externas

### 4. Interface (Presenters)
- Responsável por receber e responder requisições externas (ex: controllers, APIs, CLI)
- É a camada mais externa e independente

### Benefícios da Arquitetura Limpa

1. **Independência de Frameworks**
   - O domínio não depende de frameworks externos
   - Fácil trocar tecnologias sem afetar a lógica de negócio

2. **Testabilidade**
   - Domínio pode ser testado isoladamente
   - Adaptadores podem ser mockados facilmente
   - Testes de integração mais focados

3. **Manutenibilidade**
   - Separação clara de responsabilidades
   - Mudanças em uma camada não afetam as outras
   - Código mais organizado e previsível

4. **Flexibilidade**
   - Fácil adicionar novos adaptadores
   - Possibilidade de múltiplas interfaces (REST, GraphQL, CLI)
   - Troca de implementações sem afetar o domínio

### Fluxo de Dados na Arquitetura

1. **Entrada de Dados**
   - Request HTTP → Controller (Interface)
   - Controller valida e transforma os dados
   - Controller chama o caso de uso apropriado

2. **Processamento**
   - Caso de uso orquestra a lógica de negócio
   - Utiliza portas para comunicação com o domínio
   - Domínio executa regras de negócio

3. **Saída de Dados**
   - Domínio retorna resultado
   - Controller transforma o resultado em DTO
   - Resposta HTTP formatada e enviada

### Estrutura do Projeto

```
src/
├── core/                   # Camada de Domínio e Aplicação
│   ├── categories/         # Módulo de Categorias
│   │   ├── entities/       # Entidades de domínio
│   │   ├── operation/      # Casos de uso e controllers
│   │   │   ├── controllers/# Controllers de domínio
│   │   │   ├── gateways/   # Interfaces (portas)
│   │   │   └── presenters/ # Apresentadores
│   │   └── usecases/       # Casos de uso
│   ├── customers/          # Módulo de Clientes
│   ├── orders/             # Módulo de Pedidos
│   ├── products/           # Módulo de Produtos
│   └── common/             # Código compartilhado
├── external/               # Camada de Infraestrutura e Interface
│   ├── api/                # Controllers NestJS (Interface)
│   ├── database/           # Adaptadores de banco de dados
│   ├── gateways/           # Adaptadores de APIs externas
│   └── providers/          # Provedores de serviços
├── interfaces/             # Definições de interfaces
├── app.module.ts           # Módulo principal da aplicação
└── main.ts                 # Ponto de entrada da aplicação
```

### Estrutura dos Módulos

Cada módulo (categories, customers, orders, products) segue a arquitetura limpa:

1. **Entities (Domínio)**
   - Contém as entidades e regras de negócio
   - Independente de frameworks externos
   - Não define interfaces externas

2. **Use Cases (Aplicação)**
   - Implementa os casos de uso
   - Define as portas (interfaces) para comunicação externa
   - Implementa o padrão CQRS com commands e queries
   - Serviços específicos do módulo

3. **Infrastructure (Adaptadores)**
   - Implementa os adaptadores de persistência
   - Gerencia a comunicação com o banco de dados

4. **Presenters (Interface)**
   - Contém os controllers HTTP
   - Gerencia a apresentação dos dados
   - Implementa os endpoints REST

### Padrão CQRS (Command Query Responsibility Segregation)

O projeto implementa o padrão CQRS, que separa as operações de leitura (queries) e escrita (commands) em diferentes modelos:

1. **Commands (Comandos)**
   - Responsáveis por operações de escrita
   - Modificam o estado da aplicação
   - Exemplo: Criar categoria, Atualizar pagamento
   - Localização: `usecases/commands/`

2. **Queries (Consultas)**
   - Responsáveis por operações de leitura
   - Não modificam o estado
   - Exemplo: Buscar categorias, Consultar pagamento
   - Localização: `usecases/queries/`

3. **Benefícios do CQRS**
   - Separação clara entre leitura e escrita
   - Otimização independente para cada tipo de operação
   - Melhor escalabilidade
   - Código mais organizado e manutenível

## Integração com Mercado Pago

### Credenciais de Teste

Para testar as integrações com o Mercado Pago, utilize as seguintes credenciais:

```
Usuário de Teste: TESTUSER501385545
Senha: vZuULBwsJJ
```

### Observações sobre o Ambiente de Teste

- As credenciais acima são exclusivas para o ambiente de sandbox
- Transações realizadas não geram cobranças reais
- Cartões de teste disponíveis no ambiente de sandbox do Mercado Pago
- Recomendado para desenvolvimento e testes

## Testes de Carga

O projeto inclui testes de carga usando Locust para validar a performance da aplicação:

### Cenários de Teste
- **get_categories** (30%) - Buscar categorias
- **get_products** (30%) - Buscar produtos  
- **get_customers** (20%) - Buscar clientes
- **create_order** (10%) - Criar pedidos
- **health_check** (10%) - Health check

### Configuração Recomendada
- **Usuários simultâneos**: 10-1000
- **Taxa de spawn**: 5-10 usuários/segundo
- **Duração**: 1-2 Minutos

Para mais detalhes sobre os testes de carga, consulte o [README dos testes](./load-tests/README.md).