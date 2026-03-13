# Documentação do Pacote `sourceflow`

## Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Design Patterns Utilizados](#design-patterns-utilizados)
4. [Camada de Utils](#camada-de-utils)
   - [NodeType (Enum)](#nodetype-enum)
   - [CobolFlowAnalyzer (Singleton / Factory)](#cobolflowanalyzer-singleton--factory)
5. [Camada de Nodes](#camada-de-nodes)
   - [NodeInterface (Interface / Contrato)](#nodeinterface-interface--contrato)
   - [ParagraphNode](#paragraphnode)
   - [MethodNode](#methodnode)
   - [CommandNode](#commandnode)
   - [IfNode](#ifnode)
   - [ElseNode](#elsenode)
   - [WhenNode](#whennode)
   - [PerformLoopNode](#performloopnode)
   - [LoopNode](#loopnode)
   - [InvertedNode (Decorator / Wrapper)](#invertednode-decorator--wrapper)
6. [Camada de Providers](#camada-de-providers)
   - [FlowProvider (TreeDataProvider)](#flowprovider-treedataprovider)
7. [Fluxo de Execução Completo](#fluxo-de-execução-completo)
8. [Funcionalidades Especiais](#funcionalidades-especiais)
   - [Detecção de Loops (parentsRows)](#detecção-de-loops-parentsrows)
   - [Árvore Invertida (Modo Descendente)](#árvore-invertida-modo-descendente)
   - [Filtro de Blocos Condicionais](#filtro-de-blocos-condicionais)
9. [Diagrama de Classes](#diagrama-de-classes)

---

## Visão Geral

O pacote `sourceflow` é um módulo da extensão VS Code `rech-editor-cobol` responsável por **analisar e exibir o fluxo de execução de código-fonte COBOL** em uma Tree View interativa. Ele permite que o desenvolvedor visualize, a partir de qualquer linha do código, toda a cadeia de chamadas (performs, go to, métodos, condicionais e loops) de forma hierárquica.

**Objetivo principal:** Dado o cursor do usuário em uma linha do código COBOL, construir uma árvore que mostra o caminho de execução — quem chama quem, passando por parágrafos, métodos, ifs, elses, whens e loops — permitindo navegar tanto no sentido ascendente (da linha atual para as folhas) quanto no sentido descendente/invertido (das folhas para a raiz).

---

## Estrutura de Diretórios

```
src/sourceflow/
├── utils/
│   ├── nodeType.ts              # Enum com os tipos de nodos COBOL
│   └── cobolFlowAnalyzer.ts     # Singleton que analisa o código e cria os nodos
└── treeView/
    ├── nodes/
    │   ├── NodeInterface.ts      # Interface/contrato para todos os nodos
    │   ├── paragraphNode.ts      # Nodo de parágrafo COBOL
    │   ├── methodNode.ts         # Nodo de método COBOL
    │   ├── commandNode.ts        # Nodo de comando genérico
    │   ├── ifNode.ts             # Nodo de bloco IF
    │   ├── elseNode.ts           # Nodo de bloco ELSE
    │   ├── whenNode.ts           # Nodo de cláusula WHEN (evaluate)
    │   ├── performLoopNode.ts    # Nodo de perform loop (varying/until)
    │   ├── loopNode.ts           # Nodo terminal de detecção de loop/recursão
    │   └── invertedNode.ts       # Wrapper/Decorator para árvore invertida
    └── providers/
        └── FlowProvider.ts       # TreeDataProvider que alimenta a Tree View do VS Code
```

---

## Design Patterns Utilizados

| Pattern | Onde é aplicado | Propósito |
|---------|----------------|-----------|
| **Singleton** | `CobolFlowAnalyzer` | Garantir uma única instância do analisador de fluxo durante toda a sessão |
| **Strategy / Polimorfismo** | `NodeInterface` + implementações concretas | Cada tipo de nodo sabe como resolver seus filhos de forma diferente, mas todos seguem o mesmo contrato |
| **Factory Method** | `CobolFlowAnalyzer.getNodeFromLine()` e `getBlockAt()` | Criar a instância concreta correta de `NodeInterface` a partir da análise léxica da linha |
| **Composite** | Toda a árvore de nodos | Cada nodo pode conter filhos do mesmo tipo (`NodeInterface`), formando uma estrutura recursiva de árvore |
| **Decorator / Wrapper** | `InvertedNode` | Envelopa um nodo existente para alterar sua estrutura de filhos sem modificar o nodo original |
| **Observer** | `FlowProvider` (via `EventEmitter`) | Notifica a Tree View do VS Code quando os dados mudam, provocando re-renderização |
| **Lazy Evaluation** | `getChildren()` em todos os nodos | Os filhos só são calculados quando o nodo é expandido na Tree View |
| **Cache** | `FlowProvider.invertedTreeCache` | Armazena a árvore invertida já construída para evitar recálculo desnecessário |

---

## Camada de Utils

### NodeType (Enum)

**Arquivo:** `utils/nodeType.ts`

Enum que define todos os tipos possíveis de nodos na árvore de fluxo COBOL.

```typescript
export enum NodeType {
    Command = 0,       // Comando genérico (perform xxx, move, etc.)
    Paragraph = 1,     // Declaração de parágrafo COBOL (ex: "MINHA-ROTINA.")
    Method = 2,        // Declaração de método (method-id)
    If = 3,            // Bloco IF
    Else = 4,          // Bloco ELSE
    When = 5,          // Cláusula WHEN dentro de EVALUATE
    PerformLoop = 6,   // PERFORM com VARYING ou UNTIL (loop)
    PerformThru = 7,   // PERFORM xxx THRU yyy
    Evaluate = 8       // Bloco EVALUATE (switch/case COBOL)
}
```

**Para que serve:** Centraliza a tipagem dos nodos, usada pelo `CobolFlowAnalyzer` para identificar o que cada linha do código-fonte representa e instanciar o nodo correto.

---

### CobolFlowAnalyzer (Singleton / Factory)

**Arquivo:** `utils/cobolFlowAnalyzer.ts`

Classe central responsável por **analisar o código-fonte COBOL linha a linha** e criar os nodos da árvore.

#### Design Patterns aplicados:
- **Singleton:** `getInstance()` garante uma única instância compartilhada.
- **Factory Method:** `getNodeFromLine()` e `getBlockAt()` decidem qual classe concreta instanciar.

#### Atributos:
| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `instance` | `CobolFlowAnalyzer` (static) | Instância singleton |
| `buffer` | `string[]` | Array de linhas do código-fonte COBOL atual |

#### Métodos Públicos:

##### `setBuffer(value: string[])`
Recebe o código-fonte COBOL (já dividido em linhas) e armazena no buffer para análise.

##### `getNodeFromLine(rowNumber: number, parentsRows: number[] = []): NodeInterface`
**Factory Method principal.** Dada uma linha, analisa seu conteúdo e retorna a instância concreta do nodo correspondente:
- Linha de declaração de método → `MethodNode`
- Linha de declaração de parágrafo → `ParagraphNode`
- Linha de IF → `IfNode`
- Linha de ELSE → `ElseNode`
- Linha de WHEN → `WhenNode`
- Linha de PERFORM VARYING/UNTIL → `PerformLoopNode`
- Qualquer outra coisa → `CommandNode`
- Linha já visitada (presente em `parentsRows`) → `LoopNode` (detecção de recursão)

##### `getBlockAt(currentRow: number, nodeTypeCommand: NodeType, parentsRows: number[] = []): NodeInterface`
Percorre o buffer **de baixo para cima** (da linha atual para o início do arquivo) buscando o bloco de código que contém o comando. Respeita blocos aninhados usando um contador `openBlocks` que rastreia `end-*` para saber quando pular blocos fechados.

**Como funciona:**
1. A partir de `currentRow`, sobe linha a linha
2. Se encontra `end-*`, incrementa `openBlocks` (está saindo de um bloco)
3. Se `openBlocks > 0` e encontra IF/PerformLoop/Evaluate, decrementa (entrou no bloco correspondente)
4. Se `openBlocks == 0`, está no nível correto: retorna o nodo encontrado
5. Pula o próprio tipo do comando que gerou a busca (`nodeTypeCommand`)

##### `getPerformGotoParagraphList(currentRow: number, parentsRows: number[] = []): NodeInterface[]`
**Busca reversa de performs/gotos.** Dado um parágrafo na linha `currentRow`, varre todo o buffer procurando quem faz `perform` ou `go to` para esse parágrafo. Retorna a lista de nodos chamadores.

Inclui **detecção de loop:** se a linha do perform/goto já está em `parentsRows`, cria um `LoopNode` ao invés de um nodo normal.

##### `getMethodCalls(currentRow: number, parentsRows: number[] = []): NodeInterface[]`
Dado um método na linha `currentRow`, busca todas as chamadas `self:>nomeDoMetodo` no buffer. Retorna a lista de nodos chamadores.

##### `getNextMethodDeclaration(currentRow: number, parentsRows: number[] = []): NodeInterface | undefined`
A partir de uma linha, sobe no buffer procurando a declaração `method-id` mais próxima. Usado para encontrar o método pai de um parágrafo.

##### `getPerformThruParents(currentRow: number, parentsRows: number[] = []): NodeInterface | undefined`
Detecta se o parágrafo atual está dentro de um bloco `PERFORM xxx THRU yyy`. Se sim, retorna um `CommandNode` apontando para a linha do perform thru.

**Como funciona:**
1. Faz scan de todas as declarações `perform X thru Y` no buffer
2. Para cada uma, identifica o range de parágrafos entre X e Y
3. Verifica se `currentRow` está dentro desse range
4. Se sim, retorna o nodo do perform thru como pai

#### Métodos Privados (Análise Léxica):

| Método | Regex | O que detecta |
|--------|-------|---------------|
| `getMethodDeclaration` | `/^ {7}method-id\.\s*(\w+)[\s.$].*/` | Declaração de método COBOL |
| `getParagraphDeclaration` | `/^ {7}([\w-]+)\.(?:\s*\*>.*)?/` | Declaração de parágrafo (nome seguido de ponto na coluna 8) |
| `getIfCommand` | `/^ *if\s+.*/` | Comando IF |
| `getElseCommand` | `/^\s+else([ ,]|$)/` | Comando ELSE |
| `getWhenCommand` | `/^\s+when\s+.*/` | Cláusula WHEN |
| `getPerformLoopCommand` | `/^\s+perform(\s*$|\s+varying|\s+until)/` | PERFORM com loop (varying/until) |
| `getEvaluateCommand` | `/^\s+evaluate\s+.*/` | Comando EVALUATE |
| `isEndBlock` | `/^\s+end-[\w]*/` | Fim de bloco (end-if, end-perform, etc.) |
| `getInfoFromLine` | (composto) | Orquestra todos os anteriores para classificar uma linha |

---

## Camada de Nodes

### NodeInterface (Interface / Contrato)

**Arquivo:** `treeView/nodes/NodeInterface.ts`

Interface TypeScript que define o contrato obrigatório para todos os nodos da árvore.

```typescript
export default interface NodeInterface {
    getChildren(): NodeInterface[];  // Retorna os filhos deste nodo
    getTreeItem(): TreeItem;         // Retorna a representação visual (VS Code TreeItem)
    getRow(): number;                // Retorna o número da linha no código-fonte
}
```

**Para que serve:** Permite que o `FlowProvider` e o `CobolFlowAnalyzer` trabalhem com qualquer tipo de nodo de forma polimórfica, sem conhecer a implementação concreta. É a base do **Strategy Pattern** — cada implementação resolve `getChildren()` de forma diferente conforme o tipo de construto COBOL.

#### Atributos comuns a todas as implementações:

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `rowNumber` | `number` | Número da linha no código-fonte (0-based) |
| `treeItem` | `TreeItem` | Representação visual do nodo no VS Code |
| `parentsRows` | `number[]` | Lista de linhas ancestrais para detecção de loops |

---

### ParagraphNode

**Arquivo:** `treeView/nodes/paragraphNode.ts`

Representa uma **declaração de parágrafo COBOL** (ex: `MINHA-ROTINA.`).

| Propriedade | Valor |
|-------------|-------|
| Ícone | `symbol-class` |
| Label | `{linha}:{nome do parágrafo}` |

#### `getChildren()` — Como resolve os filhos:
1. Chama `getPerformGotoParagraphList()` → quem faz perform/goto para este parágrafo
2. Chama `getNextMethodDeclaration()` → o método pai deste parágrafo (se houver)
3. Chama `getPerformThruParents()` → se está dentro de um perform thru

**Propaga `[...this.parentsRows, this.rowNumber]`** para o analyzer, permitindo detecção de loops em toda a cadeia.

---

### MethodNode

**Arquivo:** `treeView/nodes/methodNode.ts`

Representa uma **declaração de método COBOL** (`method-id. NomeDo Método`).

| Propriedade | Valor |
|-------------|-------|
| Ícone | `symbol-method` |
| Label | `{linha}:{nome do método}` |

#### `getChildren()` — Como resolve os filhos:
Chama `getMethodCalls()` → busca todas as linhas que fazem `self:>nomeDoMetodo`.

---

### CommandNode

**Arquivo:** `treeView/nodes/commandNode.ts`

Representa um **comando genérico** COBOL (perform de parágrafo, move, etc.). É o nodo "fallback" quando a linha não se encaixa em nenhum tipo específico.

| Propriedade | Valor |
|-------------|-------|
| Ícone | `code` |
| Label | `{linha}:{texto do comando}` |

#### `getChildren()` — Como resolve os filhos:
Chama `getBlockAt(this.rowNumber - 1, NodeType.Command)` → sobe no código procurando o bloco pai deste comando.

---

### IfNode

**Arquivo:** `treeView/nodes/ifNode.ts`

Representa um **bloco IF** COBOL.

| Propriedade | Valor |
|-------------|-------|
| Ícone | `symbol-boolean` |
| Label | `{linha}:{condição do if}` |

#### `getChildren()` — Como resolve os filhos:
Chama `getBlockAt(this.rowNumber - 1, NodeType.If)` → sobe procurando o bloco que contém este IF.

---

### ElseNode

**Arquivo:** `treeView/nodes/elseNode.ts`

Representa um **bloco ELSE** COBOL.

| Propriedade | Valor |
|-------------|-------|
| Ícone | `symbol-boolean` |
| Label | `{linha}:{else}` |

#### `getChildren()` — Como resolve os filhos:
Chama `getBlockAt(this.rowNumber - 1, NodeType.Else)` → sobe procurando o bloco que contém este ELSE.

---

### WhenNode

**Arquivo:** `treeView/nodes/whenNode.ts`

Representa uma **cláusula WHEN** dentro de um EVALUATE (switch-case COBOL).

| Propriedade | Valor |
|-------------|-------|
| Ícone | `question` |
| Label | `{linha}:{condição do when}` |

#### `getChildren()` — Como resolve os filhos:
Chama `getBlockAt(this.rowNumber - 1, NodeType.When)` → sobe procurando o bloco (evaluate) que contém este WHEN.

---

### PerformLoopNode

**Arquivo:** `treeView/nodes/performLoopNode.ts`

Representa um **PERFORM com loop** (`PERFORM VARYING ...` ou `PERFORM UNTIL ...`).

| Propriedade | Valor |
|-------------|-------|
| Ícone | `sync` |
| Label | `{linha}:{perform varying/until ...}` |

#### `getChildren()` — Como resolve os filhos:
Chama `getBlockAt(this.rowNumber - 1, NodeType.PerformLoop)` → sobe procurando o bloco que contém este perform loop.

---

### LoopNode

**Arquivo:** `treeView/nodes/loopNode.ts`

Nodo **terminal** que indica que a árvore detectou uma **referência circular (loop/recursão)**. Não possui filhos e não chama o `CobolFlowAnalyzer`.

| Propriedade | Valor |
|-------------|-------|
| Ícone | `sync` |
| Label | `{linha}:Loop Call` |

#### `getChildren()`:
Retorna `[]` — é sempre um nodo folha. Isso **interrompe a recursão infinita** na árvore.

**Para que serve:** Quando o sistema de `parentsRows` detecta que uma linha já foi visitada na cadeia de ancestrais, cria um `LoopNode` ao invés de continuar expandindo, evitando stack overflow.

---

### InvertedNode (Decorator / Wrapper)

**Arquivo:** `treeView/nodes/invertedNode.ts`

**Design Pattern: Decorator/Wrapper.** Envelopa qualquer `NodeInterface` existente para uso na árvore invertida, mantendo a representação visual do nodo original mas com uma **lista de filhos completamente diferente** (invertida).

| Propriedade | Valor |
|-------------|-------|
| Ícone | Herda do nodo embrulhado |
| Label | Herda do nodo embrulhado |

#### Atributos específicos:
| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `node` | `NodeInterface` (readonly) | Nodo original sendo embrulhado |
| `invertedChildren` | `NodeInterface[]` (readonly) | Filhos no contexto invertido (são os pais do original) |

#### Métodos:
- `addChild(child)`: Adiciona um nodo como filho na versão invertida
- `getChildren()`: Retorna `invertedChildren` (não os filhos originais)
- `getTreeItem()`: Delega para `this.node.getTreeItem()` (mesma aparência)
- `getRow()`: Delega para `this.node.getRow()`
- `getNode()`: Retorna o nodo original embrulhado

---

## Camada de Providers

### FlowProvider (TreeDataProvider)

**Arquivo:** `treeView/providers/FlowProvider.ts`

Implementa a interface `TreeDataProvider<NodeInterface>` do VS Code, sendo o **ponto de entrada** que conecta a lógica de análise COBOL à Tree View na UI.

#### Design Patterns aplicados:
- **Observer:** Usa `EventEmitter` para notificar o VS Code sobre mudanças na árvore
- **Cache:** Armazena a árvore invertida para evitar recálculo

#### Atributos:
| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `_onDidChangeTreeData` | `EventEmitter` | Emissor de eventos para atualizar a Tree View |
| `onDidChangeTreeData` | `Event` | Evento público que a Tree View escuta |
| `isAscending` | `boolean` | Modo atual: `true` = ascendente (normal), `false` = descendente (invertido) |
| `invertedTreeCache` | `NodeInterface[] \| null` | Cache da árvore invertida já construída |
| `lastOriginalNode` | `NodeInterface \| null` | Último nodo original usado para construir o cache |

#### Comandos Registrados:
| Comando | Ação |
|---------|------|
| `rech.editor.cobol.flowparser` | Atualiza/recarrega a Tree View (`refresh()`) |
| `rech.editor.cobol.gotoFlowLine` | Navega o editor para a linha do nodo clicado |
| `rech.editor.cobol.toggleFlowOrder` | Alterna entre modo ascendente e descendente |

#### `getTreeItem(element: NodeInterface)`
Delega para `element.getTreeItem()`. Cada nodo sabe como se representar visualmente.

#### `getChildren(element?: NodeInterface)`
**Método central** — chamado pelo VS Code toda vez que precisa renderizar filhos.

**Quando `element` é fornecido (expandindo um nodo):**
1. Pega os filhos via `element.getChildren()`
2. Se config `showConditionalBlockCobolFlow` estiver desativada, filtra condicionais via `removeConditionalChildrens()`

**Quando `element` é `undefined` (raiz da árvore):**
1. Obtém a linha atual do cursor no editor
2. Alimenta o `CobolFlowAnalyzer` com o buffer do código-fonte
3. Cria o nodo raiz a partir da linha atual

**Modo Ascendente (`isAscending = true`):**
- Simplesmente retorna o nodo raiz como único filho
- A expansão lazy faz o resto (cada nodo resolve seus filhos on-demand)

**Modo Descendente/Invertido (`isAscending = false`):**
- Verifica se o cache é válido (mesmo nodo de antes)
- Se precisa reconstruir: chama `buildInvertedTree()`
- Retorna raízes invertidas do cache

#### `buildInvertedTree(root: NodeInterface): NodeInterface[]`
Constrói a árvore invertida completa usando uma **travessia única**:

1. **Coleta todos os caminhos raiz→folha** via `collectPaths()` em uma única travessia
2. **Cria `InvertedNode`s** com cache por linha (`invertedCache: Map<number, InvertedNode>`)
3. **Inverte os relacionamentos**: para cada caminho `[root, ..., leaf]`, percorre do fim ao início adicionando o pai como filho do nodo atual no contexto invertido
4. **Deduplicação**: nodos com mesma linha são compartilhados (mesmo `InvertedNode`)
5. **Retorna as folhas originais como raízes** da árvore invertida

#### `collectPaths(node, currentPath, allPaths, showConditionals): void`
Percorre a árvore recursivamente em uma única travessia, coletando todos os caminhos da raiz até cada folha. Cada caminho é armazenado na ordem `[root, ..., leaf]`.

**Tratamento especial de LoopNode:** Quando encontra um `LoopNode`, termina o caminho no nodo anterior (o pai do LoopNode). Isso é necessário porque `LoopNode.getRow()` retorna a mesma linha de um nodo ancestral, o que causaria colisão no cache de inversão por `rowNumber`.

#### `removeConditionalChildrens(children: NodeInterface[]): NodeInterface[]`
Filtra nodos condicionais (IF, ELSE, WHEN, PerformLoop) da lista de filhos.

**Comportamento importante:** Quando encontra um nodo condicional, **não o adiciona, mas continua com os filhos dele**. Isso garante que o fluxo principal não é perdido quando condicionais são filtrados.

**Nodos mantidos:** `ParagraphNode`, `MethodNode`, `CommandNode`, `InvertedNode`, `LoopNode`
**Nodos removidos (mas filhos preservados):** `IfNode`, `ElseNode`, `WhenNode`, `PerformLoopNode`

---

## Fluxo de Execução Completo

### Modo Ascendente (Normal)

```
1. Usuário posiciona cursor na linha X do código COBOL
2. Executa comando "flowparser" → FlowProvider.refresh()
3. VS Code chama FlowProvider.getChildren(undefined) → raiz
4. CobolFlowAnalyzer.getNodeFromLine(X) → identifica tipo → cria nodo concreto
5. VS Code renderiza o nodo na Tree View
6. Usuário expande o nodo → VS Code chama getChildren(nodo)
7. Nodo.getChildren() → chama CobolFlowAnalyzer para buscar pais/chamadores
8. Cada pai encontrado se torna um filho na árvore
9. Repete 6-8 recursivamente até não haver mais pais (folhas)
```

### Exemplo de cadeia ascendente:
```
Cursor no comando "move x to y" (linha 50)
└── CommandNode (50: move x to y)
    └── IfNode (48: if condição)
        └── ParagraphNode (45: MINHA-ROTINA)
            ├── CommandNode (30: perform MINHA-ROTINA)
            │   └── ParagraphNode (28: ROTINA-PAI)
            │       └── ...
            └── MethodNode (10: meu-metodo)
                └── CommandNode (100: self:>meu-metodo)
                    └── ...
```

### Modo Descendente (Invertido)

```
1. Mesmo início (cursor → FlowProvider.getChildren)
2. FlowProvider detecta isAscending = false
3. Constrói árvore original completa internamente
4. Encontra todas as folhas da árvore original
5. Para cada folha, cria InvertedNode como raiz
6. Inverte os caminhos: folha → ... → raiz original
7. Retorna InvertedNodes como raízes da Tree View
```

---

## Funcionalidades Especiais

### Detecção de Loops (parentsRows)

Cada nodo carrega um array `parentsRows` que contém os números das linhas de todos os seus ancestrais na cadeia de expansão.

**Como funciona:**
1. Quando um nodo é criado, recebe `parentsRows` do pai
2. Ao expandir (`getChildren()`), cria `parents = [...this.parentsRows, this.rowNumber]`
3. Propaga esse array para o `CobolFlowAnalyzer`
4. O analyzer verifica se a linha do novo nodo já está em `parentsRows`
5. Se sim → cria `LoopNode` (terminal, sem filhos) ao invés de um nodo normal
6. Isso **previne recursão infinita** quando o código COBOL tem chamadas circulares

**Exemplo:**
```
ParagraphNode (linha 10: ROTINA-A) [parentsRows: []]
└── CommandNode (linha 50: perform ROTINA-B) [parentsRows: [10]]
    └── ParagraphNode (linha 20: ROTINA-B) [parentsRows: [10, 50]]
        └── CommandNode (linha 60: perform ROTINA-A) [parentsRows: [10, 50, 20]]
            └── LoopNode (linha 10: Loop Call)  ← linha 10 já está em parentsRows!
```

### Árvore Invertida (Modo Descendente)

Quando ativado via toggle, o FlowProvider:
1. Constrói toda a árvore original em memória
2. Encontra as folhas (nodos sem filhos)
3. Cada folha se torna uma raiz na árvore invertida
4. O caminho é invertido: `folha → intermediário → raiz original`
5. Nodos compartilhados entre caminhos diferentes são **deduplicados** usando cache por `rowNumber`

**Cache:** A árvore invertida é cacheada em `invertedTreeCache` e só é reconstruída se o nodo raiz mudar ou se `refresh()` for chamado.

### Filtro de Blocos Condicionais

Configuração: `rech.editor.cobol.showConditionalBlockCobolFlow`

Quando **desativado**, remove nodos condicionais (IF, ELSE, WHEN, PerformLoop) da árvore. Importante: **não remove os filhos** desses nodos — apenas pula o nodo condicional e continua com seus descendentes. Isso mantém o fluxo principal intacto.

---

## Diagrama de Classes

```
                    ┌──────────────────┐
                    │  <<interface>>    │
                    │  NodeInterface    │
                    ├──────────────────┤
                    │ getChildren()    │
                    │ getTreeItem()    │
                    │ getRow()         │
                    └────────┬─────────┘
                             │ implements
        ┌────────────┬───────┼───────┬────────────┬──────────────┐
        │            │       │       │            │              │
  ┌─────┴─────┐ ┌───┴───┐ ┌─┴──┐ ┌──┴──┐ ┌──────┴───────┐ ┌───┴────┐
  │Paragraph  │ │Method │ │Cmd │ │If   │ │PerformLoop   │ │Loop    │
  │Node       │ │Node   │ │Node│ │Node │ │Node          │ │Node    │
  └───────────┘ └───────┘ └────┘ └─────┘ └──────────────┘ └────────┘
        │            │       │       │            │
        │       ┌────┴───┐  │  ┌────┴────┐       │
        │       │Else    │  │  │When     │       │
        │       │Node    │  │  │Node     │       │
        │       └────────┘  │  └─────────┘       │
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │ usa
                   ┌────────┴─────────┐
                   │CobolFlowAnalyzer │  ← Singleton / Factory
                   │  (utils)         │
                   └──────────────────┘

  ┌──────────────┐              ┌──────────────────┐
  │ InvertedNode │──wraps──────>│  NodeInterface   │
  │ (Decorator)  │              │  (qualquer impl) │
  └──────────────┘              └──────────────────┘

  ┌──────────────┐  usa   ┌──────────────────┐
  │ FlowProvider │───────>│ CobolFlowAnalyzer│
  │ (Provider)   │───────>│ NodeInterface    │
  └──────────────┘        └──────────────────┘
        │
        │ implements
        ▼
  TreeDataProvider<NodeInterface>  (VS Code API)
```
