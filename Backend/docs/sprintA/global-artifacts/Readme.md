# Documentação do Projeto

## Índice
1. [Visão Geral](#visão-geral)
2. [Artefatos Globais](#artefatos-globais)
   - [C4 Model](#c4-model)
   - [Modelo de Domínio](#modelo-de-domínio)
   - [Glossário](#glossário)
   - [Diagramas de Caso de Uso](#diagramas-de-caso-de-uso)
3. [Vistas e Granularidade](#vistas-e-granularidade)
   - [Nível 1](#nível-1)
   - [Nível 2](#nível-2)
   - [Nível 3](#nível-3)
   - [Nível 3.5](#nível-35)

## Visão Geral

Este repositório contém a documentação detalhada do projeto, organizada em várias categorias e níveis de granularidade. A documentação está dividida em artefatos globais e vistas detalhadas, cobrindo desde diagramas de alto nível até implementações específicas de domínio.

## Artefatos Globais

### C4 Model
Esta seção contém os diferentes níveis do modelo C4 (Contexto, Containers, Componentes e Código) para a arquitetura do sistema. O modelo C4 descreve a estrutura do sistema em diferentes níveis de abstração, oferecendo uma visão clara de como os componentes interagem entre si.

- **Nível 1**: Visão de contexto do sistema, mostrando as interações externas.

  ![Level1](C4/Level1/Level1.png)

- **Nível 2**: Visão de container, representando os principais containers e como eles se comunicam.

  ![Level2](C4/Level2/Level2.png)

- **Nível 3**: Visão de componentes, detalhando a arquitetura interna dos containers.

  ![Level3](C4/Level3/Level3.png)

- **Nível 4**: Visão de código, descrevendo as interações a nível de classe.

  ![Level4](C4/Level4/Level4.png)

### Modelo de Domínio

- **Versão 1**: Diagrama do modelo de domínio na versão inicial.

  ![DomainModelV1](DomainModel/DomainModelV1/DomainModelV1.png)

- **Versão 2**: Atualização do modelo de domínio com melhorias e ajustes.

  ![DomainModelV2](DomainModel/DomainModelV2/DomainModelV2.png)

### Glossário
- **Glossário**: O glossário fornece definições para os principais termos e conceitos utilizados ao longo do projeto.

  [Glossário](Glossary/Glossary.md)

### Diagramas de Caso de Uso
- **Use Case Diagram**: Representação dos principais casos de uso do sistema.

  ![UseCaseDiagram](UseCaseDiagram/UseCaseDiagram.png)

## Vistas e Granularidade

Abaixo estão os diagramas que representam diferentes vistas e níveis de detalhamento do sistema.

# User storie de edição

### Nível 1
- **Logical**: Visão lógica do sistema no Nível 1.

  ![Logical](ViewsAndGranularity/Edit/Level1/Logical.jpg)

- **Process**: Diagrama de processos no Nível 1.

  ![Process](ViewsAndGranularity/Edit/Level1/Process.png)

- **Scenarios**: Cenários de uso no Nível 1.

  ![Scenarios](ViewsAndGranularity/Edit/Level1/Scenarios.png)

### Nível 2
- **Development**: Visão de desenvolvimento no Nível 2.

  ![Development](ViewsAndGranularity/Edit/Level2/Development.png)

- **Logical**: Visão lógica no Nível 2.

  ![Logical](ViewsAndGranularity/Edit/Level2/Logical.png)

- **Physical**: Visão física da arquitetura no Nível 2.

  ![Physical](ViewsAndGranularity/Edit/Level2/Physical.png)

- **Process**: Detalhes de processo no Nível 2.

  ![Process](ViewsAndGranularity/Edit/Level2/Process.png)

### Nível 3
- **Development**: Visão de desenvolvimento no Nível 3.

  ![Development](ViewsAndGranularity/Edit/Level3/Development.png)

- **Logical**: Visão lógica no Nível 3.

  ![Logical](ViewsAndGranularity/Edit/Level3/Logical.png)

- **Process**: Diagrama de processo no Nível 3.

  ![Process](ViewsAndGranularity/Edit/Level3/Process.png)

### Nível 3.5
- **Logical**: Visão lógica adicional no Nível 3.5.

  ![Logical](ViewsAndGranularity/Edit/Level3.5/Logical.png)

- **SystemDiagramEdit**: Edição do diagrama do sistema no Nível 3.5.

  ![SystemDiagramEdit](ViewsAndGranularity/Edit/Level3.5/SystemDiagramEdit.jpg)
