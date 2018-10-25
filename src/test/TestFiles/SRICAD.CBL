      *>--------------------------------------------------------------------------------------------------------------<*
      *>                           Programa de listagens/gráficos de clientes/fornecedores                            <*
      *>--------------------------------------------------------------------------------------------------------------<*
       IDENTIFICATION             DIVISION.
       PROGRAM-ID.                SRICAD.
           COPY                   CONFIGSA.CPY REPLACING ==(NOMPRG)== BY SRICAD.
      *>--------------------------------------------------------------------------------------------------------------<*
       WORKING-STORAGE            SECTION.
      *>-> Nome do programa
       78  W78-NOMPRG                             VALUE IS "SRICAD".
      *>-> Número do programa (utilizado pelas senhas)
       78  W78-NUMPRG                             VALUE IS 001.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Indicadores de uso da seleção padrão
       78  W78-SLCADTAB                           VALUE IS "S".
       78  W78-SLFATTAB                           VALUE IS "S".
       78  W78-SLTABCQL                           VALUE IS "S".
       78  W78-SLNFSTAB                           VALUE IS "S".
       78  W78-SLDOCTAB                           VALUE IS "S".
       78  W78-SLDOCTAB-DEF                       VALUE IS "S".
       78  W78-SLCCPTAB                           VALUE IS "S".
       78  W78-SLNOTTAB                           VALUE IS "S".
       78  W78-SLNOFTAB                           VALUE IS "S".
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Indicadores de uso de browse
       78  W78-SRPLPM                             VALUE IS 1.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Indicadores de uso da leitura de tabelas genéricas/por empresa
       78  W78-LERTGE-AGE                         VALUE IS "S".
       78  W78-LERTGE-BAN                         VALUE IS "S".
       78  W78-LERTGE-LOC                         VALUE IS "S".
       78  W78-LERTGE-GRC                         VALUE IS "S".
       78  W78-LERTGE-MOE                         VALUE IS "S".
       78  W78-LERTGE-MRE                         VALUE IS "S".
       78  W78-LERTGE-UCC                         VALUE IS "S".
       78  W78-LERTGE-VCT                         VALUE IS "S".
       78  W78-LERTGE-ZVD                         VALUE IS "S".
       78  W78-LERTPE-HOL                         VALUE IS "S".
       78  W78-LERTPE-REP                         VALUE IS "S".
       78  W78-LERTPE-STF                         VALUE IS "S".
       78  W78-LERTPE-TPF                         VALUE IS "S".
       78  W78-LERTPE-TRA                         VALUE IS "S".
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Indica que grava/exclui registros das observações de clientes/fornecedores
       78  W78-FOBCAD-GRV                         VALUE IS "S".
      *>-> Utiliza os dados do tipo registro 02 da observação do cadastro
       78  W78-FOBCAD-02                          VALUE IS "S".
      *>-> Utiliza os dados do tipo registro 05 da observação do cadastro
       78  W78-FOBCAD-05                          VALUE IS "S".
      *>-> Utiliza os dados do tipo registro 06 da observação do cadastro
       78  W78-FOBCAD-06                          VALUE IS "S".
      *>-> Utiliza os dados do tipo registro 09 da observação do cadastro
       78  W78-FOBCAD-09                          VALUE IS "S".
      *>-> Utiliza os dados do tipo registro 15 da observação do cadastro
       78  W78-FOBCAD-15                          VALUE IS "S".
      *>-> Utiliza os dados do tipo registro 16 Alt.do limite de crédito
       78  W78-FOBCAD-16                          VALUE IS "S".
      *>-> Utiliza os dados do tipo registro 17 Informações sociais por período
       78  W78-FOBCAD-17                          VALUE IS "S".
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Indica que utiliza a edição de linha
       78  W78-EDLIN                              VALUE IS "S".
      *>-> Indica que utiliza leitura/gravação de seleção
       78  W78-USASEL                             VALUE IS "S".
      *>-> Indica que utiliza todos os dados das Obs.da nota de serviço
       78  W78-TODONS                             VALUE IS "S".
      *>-> Indica que utiliza dados da licença do cliente
       78  W78-DADDLC-DLI                         VALUE IS "S".
      *>-> Utiliza gerenciador de Observações Genéricas
       78  W78-SRIGOB                             VALUE IS "S".
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Quantidade de ocorrências da tabela dos cadastros
       78  W78-QTDCAD                             VALUE IS 300.
      *>-> Tamanho fone editado c/14 caracteres, sem código do país
       78  W78-TAMFON                             VALUE IS 14.
      *>-> Número de ocorrências dos botões de seleção padrão de documentos para limite de crédito
       78  W78-OCOSLD                             VALUE IS 4.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Sequencial identificador do grid de seleção múltipla do SRI065
       78  W78-SQG-SRI065-001                     VALUE IS 1.
      *>-> Sequencial identificador do grid de seleção múltipla do SRI065
       78  W78-SQG-SRI065-002                     VALUE IS 2.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Registro de Working do arquivo de Itens das notas fiscais de serviços (AUE-Autom.Escrit.)
           COPY                   AWREGITS.CPY REPLACING ==(@)== BY A.
      *>-> Registro de Working do arquivo de Notas fiscais de serviços (AUE-Autom.Escrit.)
           COPY                   AWREGNFS.CPY REPLACING ==(@)== BY A.
      *>-> Registro de Working do arquivo de Observações da nota de serviço (AUE-Autom.Escrit.)
           COPY                   AWREGONS.CPY REPLACING ==(@)== BY A.
      *>-> Registro de Working do arquivo de Plano de contas
           COPY                   CWREGPLA.CPY REPLACING ==(@)== BY C.
      *>-> Registro de Working do arquivo de Cadastro de cliente/fornecedor
           COPY                   FWREGCAD.CPY REPLACING ==(@)== BY F
                                                     ==(ORGAO)== BY FCAD-OCR
                                                      ==(CFOP)== BY FCAD-NOP.
      *>-> Registro de Working do arquivo de Cadastro de cliente/fornecedor
           COPY                   FWREGCAD.CPY REPLACING ==(@)== BY O
                                                     ==(ORGAO)== BY OCAD-OCR
                                                      ==(CFOP)== BY OCAD-NOP.
      *>-> Registro de Working do arquivo de Documentos do Financeiro
           COPY                   FWREGDOC.CPY REPLACING ==(@)== BY F.
      *>-> Registro de Working do arquivo de Notas do financeiro
           COPY                   FWREGNOF.CPY REPLACING ==(@)== BY F.
      *>-> Registro de Working do arquivo de Tabelas Genéricas
           COPY                   FWREGTAB.CPY REPLACING ==(@)== BY F
                                                         ==(#)== BY FT
                                                      ==(CFOP)== BY FTAB-COD.
      *>-> Registro de Working do arquivo de Recursos Ativos
           COPY                   IWREGREA.CPY REPLACING ==(@)== BY I.
      *>-> Registro de Working do arquivo de Pedidos e notas do faturamento
           COPY                   NWREGFAT.CPY REPLACING ==(@)== BY N.
      *>-> Registro de Working do arquivo de Listas de Preços Mestres
           COPY                   NWREGLPM.CPY REPLACING ==(@)== BY N.
      *>-> Registro de Working do arquivo de Notas do Faturamento
           COPY                   NWREGNOT.CPY REPLACING ==(@)== BY N.
      *>-> Registro de Working do arquivo de Produtos
           COPY                   NWREGPRO.CPY REPLACING ==(@)== BY N.
      *>-> Registro de Working do arquivo de Contas correntes de pessoas
           COPY                   YWREGCCP.CPY REPLACING ==(@)== BY Y.
      *>-> Registro de Working do arquivo de Dados da licença do cliente do SIGER® (USO INTERNO!)
           COPY                   YWREGDLC.CPY REPLACING ==(@)== BY Y.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Copy de variáveis de uso genérico dos programas
           COPY                   VARIAVEL.CPY.
      *>-> Copy da working da tabela das siglas/descrição dos estados
           COPY                   WTDESEST.CPY.
      *>-> Parâmetros p/rotina de exibição de gráficos estatísticos
           COPY                   SRIGRAWF.CPY.
      *>-> Parâmetros para leitura/gravação das observações do cadastro
           COPY                   WDADFOBC.CPY REPLACING ==(@)== BY F
                                                         ==(#)== BY F.
      *>-> Parâmetros do programa de manipulação de API do Google Maps
           COPY                   SRIGMPWF.CPY.
      *>-> Parâmetros para rotina de exibição, registro e impressão de mensagens
           COPY                   SRORIMWF.CPY.
      *>-> Parâmetros para rotina para seleção de itens
           COPY                   WSEITENS.CPY REPLACING ==(@)== BY I
                                                    ==(OBJETO)== BY WSI-IDOBJ
                                                    ==(CLASSE)== BY SRI065
                                                    ==(NOMPRG)== BY "SRI065".
      *>-> Copy de montagem de campos de moedas(opções da combo-box)
           COPY                   WMCMOEDA.CPY.
      *>-> Parâmetros da rotina de montagem de File-ID
           COPY                   SRO045WF.CPY.
      *>-> Copy de parâmetros p/integração com cad.insc.estaduais
           COPY                   WPINSEST.CPY.
      *>-> Parâmetros p/rotinas de relatórios específicos da RECH.
           COPY                   WROTRELR.CPY.
      *>-> Variáveis passadas como parâmetros para serviços - AUE
           COPY                   WPSERVIC.CPY.
      *>-> Parâmetros do Gerenciador de Listagens
           COPY                   WPARGLIS.CPY.
      *>-> Parâmetros do programa de busca de vencimentos
           COPY                   SROVCTWF.CPY.
      *>-> Variáveis de manipulação de arquivos .INI/.properties
           COPY                   SROINFWF.CPY.
      *>-> Parâmetros da seleção de serviços/despesas existentes/inexistentes do Automação de Escritórios
           COPY                   SRIVSEWF.CPY.
      *>-> Parâmetros da tabela de conta corrente do cadastro de cli/for
           COPY                   WTBCCCAD.CPY.
      *>-> Copy de working de observações das notas de serviços
           COPY                   WDADNOTS.CPY REPLACING ==(#)== BY A.
      *>-> Copy de working dos Dados da licença do cliente do SIGER  (USO INTERNO!)
           COPY                   WDADYDLC.CPY REPLACING ==(#)== BY Y.
      *>-> Tabela de descrições de sistemas operacionais reconhecidos pelo SIGER
           COPY                   WTDESSIS.CPY.
      *>-> Parâmetros para rotinas de integração com base do SICLA
           COPY                   WPARSICL.CPY.
      *>-> Parâmetros da visão de dados do Beneficiamento
           COPY                   SROVBNWF.CPY REPLACING ==(@)== BY B.
      *>-> Parâmetros do programa de busca estrutura do plano de contas
           COPY                   SRIBEPWF.CPY.
      *>-> Rotinas para chamada dinâmica do novo SPD
           COPY                   WSLDINAM.CPY.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Definições de interface do programa SRICAD.CBL
           COPY                   SRICADGW.CPB.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis gerais.............................................................................................
       01  WRK-CAMPOS.
      *>-> Índice da janela que será aceita
           05 W-INDJAN            PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Literais.....................................................................................................
       01  WLIT-CAMPOS.
      *>-> Grupo de classificação
           05 WT-LT-GRPCLA                        VALUE IS "00-Não Classifica       "
      &                                                    "01-Grupo de Cadastro    "
      &                                                    "02-Representante        "
      &                                                    "03-Transportador        "
      &                                                    "04-Local de Cobrança    "
      &                                                    "05-Estado               "
      &                                                    "06-Preposto             "
      &                                                    "07-Vendedor             "
      &                                                    "08-Repres/Preposto/Vend."
      &                                                    "09-Estado/Cidade        "
      &                                                    "10-Grupo Empresa/Holding"
      &                                                    "11-Zona de Vendas/Região"
      &                                                    "12-Escritório           ".
              10 WLT-GRPCLA       PIC IS X(24)   OCCURS 13 TIMES.
      *>-> Listar
           05 W-LT-LIMCID                         VALUE IS "00-Só Código/Nome/Tipo de Cadastro"
      &                                                    "01-Endereço/Fone/Grupo de Cadastro"
      &                                                    "02-CNPJ/Inscr.Estad/Fone/Grupo Cad"
      &                                                    "03-CNPJ/Inscr.Estad/Val.Dívida/Grp"
      &                                                    "04-Limite Crédito/Ult/Maior Compra"
      &                                                    "05-Fone/Comprador(Enc.Coml)/Vectos"
      &                                                    "06-E-Mail/Fone/Grupo de Cadastro  "
      &                                                    "07-Endereço/CNPJ/Fone/Dias Visita "
      &                                                    "08-End.Cobr/Cid/CNPJ/Insc.Estadual"
      &                                                    "09-CNPJ/Fone/E.Coml/Ctas.Correntes"
      &                                                    "10-Fone/Fax/Lim.Créd/Val.Tot.Fatur"
      &                                                    "11-Fone/Prim/Ult.Fat./End/Enc.Coml"
      &                                                    "12-End/Fon/Grup/Bair/Dta/Vlr.últ.C"
      &                                                    "13-CNPJ/Inscr.Estadual/Ctas.Contab"
      &                                                    "14-End/Cont/Rep/CNPJ/IE/C.Pg/R.Atv"
      &                                                    "15-Cidade/Empregados/Cap.Social   "
      &                                                    "16-Cidade/Base Territorial/DDD    "
      &                                                    "17-Empresa/End/Cidade/Tel/Nº Empre"
      &                                                    "18-Escr.Cont./End/CEP/Cidade/Fone "
      &                                                    "19-Cód.Alter./Nome/End/Fone/Gr.Cad"
      &                                                    "20-Cód/Nome/Tipo/Cidade/UF/Fone   "
      &                                                    "99-Dados para Liberação / Licenças".
              10 WLT-LIMCID       PIC IS X(34)   OCCURS 22 TIMES.
      *>-> Subgrupo de classificação
           05 WLT-SGRCLA          PIC IS X(250)   VALUE IS SPACES.
              88 SRGCLA-NAO                       VALUE IS "01-Não classifica        ".
              88 SRGCLA-PRE                       VALUE IS "01-Não classifica        "
      &                                                    "03-Representante         "
      &                                                    "04-Vendedor              "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região ".
              88 SRGCLA-REP                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "04-Vendedor              "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região "
      &                                                    "10-Cidade                ".
              88 SRGCLA-VEN                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "03-Representante         "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região ".
              88 SRGCLA-GRC                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "03-Representante         "
      &                                                    "04-Vendedor              "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região ".
              88 SRGCLA-TRP                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "03-Representante         "
      &                                                    "04-Vendedor              "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região ".
              88 SRGCLA-DTI                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "03-Representante         "
      &                                                    "04-Vendedor              "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região ".
              88 SRGCLA-RPV                       VALUE IS "01-Não classifica        "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região ".
              88 SRGCLA-HOL                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "03-Representante         "
      &                                                    "04-Vendedor              "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "09-Zona de Vendas/Região ".
              88 SRGCLA-ZON                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "03-Representante         "
      &                                                    "04-Vendedor              "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding".
              88 SRGCLA-TOD                       VALUE IS "01-Não classifica        "
      &                                                    "02-Preposto              "
      &                                                    "03-Representante         "
      &                                                    "04-Vendedor              "
      &                                                    "05-Grupo de Cadastro     "
      &                                                    "06-Transportador         "
      &                                                    "07-Local de Cobrança     "
      &                                                    "08-Grupo Empresas/Holding"
      &                                                    "09-Zona de Vendas/Região ".
      *>-> Quantidades de duplicatas específicas
           05 W-DUPESPEC                          VALUE IS "  A Vista  "
      &                                                    "Apresentac."
      &                                                    "Remes/Tran.".
              10 W-DUPESP         PIC IS X(11)   OCCURS 03 TIMES.
      *>-> Tabela de literais para totalizar espécies de recursos ativos
           05 WTLT-ERC                            VALUE IS "Maquinas..........:"
      &                                                    "GRupo de Maquinas.:"
      &                                                    "Ferram.de Producao:"
      &                                                    "Grp.de Ferramentas:"
      &                                                    "Dispositivo.......:"
      &                                                    "Instrum.Inspecao..:"
      &                                                    "Instrum.Calibracao:"
      &                                                    "Ferram.de Manut...:"
      &                                                    "Veiculos..........:"
      &                                                    "Kit Ferram./Equip.:"
      &                                                    "Equipamentos......:"
      &                                                    "Grupo de equip....:"
      &                                                    "Cel/Linha producao:"
      &                                                    "Outros............:"
      &                                                    "Recursos Ativos...:".
              10 WLT-ERC          PIC IS X(19)    OCCURS 15 TIMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis da rotina de listagem simplificada de clientes/fornecedores........................................
       01  WLSI-CAMPOS.
      *>-> Testa itens de serviço (Vindo do SRIVSE)
           05 W-TSTISE            PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 TSTISE-SIM                       VALUE IS 1.
              88 TSTISE-NAO                       VALUE IS 2.
      *>-> Lista itens de serviço (Vindo do SRIVSE)
           05 W-LSTISE            PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 LSTISE-SIM                       VALUE IS 1.
              88 LSTISE-NAO                       VALUE IS 2.
      *>-> Período do movimento (Vindo do SRIVSE)
           05 W-PERMOV                            VALUE IS LOW-VALUES.
              10 W-ANOMOV         PIC IS 9(04)                   COMP-X.
              10 W-MESMOV         PIC IS 9(02)                   COMP-X.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis da rotina de aceitação da seleção para as listagens................................................
       01  WSLI-CAMPOS.
      *>-> Listar
           05 WSLI-LIMCID         PIC IS 9(02)    VALUE IS 1     COMP-X.
      *>-> Listar - Sem dados complementares, só código, descrição e tipo
              88 WSLI-LIMCID-SEM                  VALUE IS ZEROS.
      *>-> Listar - Endereço do cliente
              88 WSLI-LIMCID-END                  VALUE IS 1.
      *>-> Listar - CNPJ do cliente
              88 WSLI-LIMCID-CGC                  VALUE IS 2.
      *>-> Listar - Valor da dÍvida
              88 WSLI-LIMCID-DIV                  VALUE IS 3.
      *>-> Listar - Limite de crédito
              88 WSLI-LIMCID-LIM                  VALUE IS 4.
      *>-> Listar - Compras/Vencimentos
              88 WSLI-LIMCID-COM                  VALUE IS 5.
      *>-> Listar - E-mail/Telefone
              88 WSLI-LIMCID-EFO                  VALUE IS 6.
      *>-> Listar - Dias de visita
              88 WSLI-LIMCID-DVI                  VALUE IS 7.
      *>-> Listar - Endereço/CNPJ
              88 WSLI-LIMCID-ECN                  VALUE IS 8.
      *>-> Listar - Dados conta corrente
              88 WSLI-LIMCID-DCC                  VALUE IS 9.
      *>-> Listar - Dados limite de crédito
              88 WSLI-LIMCID-LCR                  VALUE IS 10.
      *>-> Listar - Primeira/Última fatura
              88 WSLI-LIMCID-FAT                  VALUE IS 11.
      *>-> Listar - Endereço do cliente + Bairro + data/valor da última Compra
              88 WSLI-LIMCID-EBC                  VALUE IS 12.
      *>-> Listar - CNPJ/Inscrição estadual/Telefone/Contas Contábeis
              88 WSLI-LIMCID-CFC                  VALUE IS 13.
      *>-> Listar - Endereço + Contato + Repres + CNPJ + IE + Cond.Pgto + R.Ativo
              88 WSLI-LIMCID-ECR                  VALUE IS 14.
      *>-> Listar - Cidade/Empregados/Capital Social
              88 WSLI-LIMCID-CEC                  VALUE IS 15.
      *>-> Listar - Cidade/Base Territorial/DDD
              88 WSLI-LIMCID-CBD                  VALUE IS 16.
      *>-> Listar - Empresa/End/Cidade/Telefone/Número de empregados
              88 WSLI-LIMCID-EEC                  VALUE IS 17.
      *>-> Listar - Escritório Contabilidade/Endereço/CEP/Cidade/Fone
              88 WSLI-LIMCID-ECC                  VALUE IS 18.
      *>-> Listar - Código alternativo/Razão social/Endereço/Fone/Grp. Cadastro
              88 WSLI-LIMCID-CAL                  VALUE IS 19.
      *>-> Listar - Código/Razão social/Tipo (C/F)/Cidade/UF/Telefone
              88 WSLI-LIMCID-CRT                  VALUE IS 20.
      *>-> Obs: Para uso interno da Rech - deverá ser SEMPRE o último da lista
      *>-> Listar - Dados para liberação
              88 WSLI-LIMCID-LIB                  VALUE IS 99.
      *>-> Listar - Relatório de 160 colunas
              88 WSLI-LIMCID-160                  VALUE IS 12, 20, 99.
      *>-> Indica se deve listar observações/e-mails do cadastro cli/for
           05 WSLI-OBSERV         PIC IS 9(01)    VALUE IS 1     COMP-X.
              88 WSLI-OBSERV-NAO                  VALUE IS 1.
              88 WSLI-OBSERV-OBS                  VALUE IS 2.
              88 WSLI-OBSERV-EMA                  VALUE IS 3.
              88 WSLI-OBSERV-AMB                  VALUE IS 4.
      *>-> Indica se deve listar as observações restritas
           05 WSLI-LISORC         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WSLI-LISORC-SIM                  VALUE IS 1.
              88 WSLI-LISORC-NAO                  VALUE IS 2.
      *>-> Indica se deve listar contatos de cli/for
           05 WSLI-LISCCF         PIC IS 9(01)    VALUE IS 2     COMP-X.
      *>-> Indica se deve listar contatos de cli/for - Todos
              88 WSLI-LISCCF-TOD                  VALUE IS 1.
      *>-> Indica se deve listar contatos de cli/for - Não
              88 WSLI-LISCCF-NAO                  VALUE IS 2.
      *>-> Indica se deve listar contatos de cli/for - Somente Ativos
              88 WSLI-LISCCF-ATI                  VALUE IS 3.
      *>-> Dia/mês aniversário inicial
           05 WSLI-DIMINI.
              10 WSLI-INIMES      PIC IS 9(02)    VALUE IS ZEROS COMP-X.
              10 WSLI-INIDIA      PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>-> Dia/mês aniversário final
           05 WSLI-DIMFIN.
              10 WSLI-FINMES      PIC IS 9(02)    VALUE IS 12    COMP-X.
              10 WSLI-FINDIA      PIC IS 9(02)    VALUE IS 31    COMP-X.
      *>-> Grupo de Classificação
           05 WSLI-GRPCLA         PIC IS 9(02)    VALUE IS 00    COMP-X.
      *>-> Grupo de Classificação - Não classifica
              88 WSLI-GRPCLA-NAO                  VALUE IS 00.
      *>-> Grupo de Classificação - Grupo de cadastro
              88 WSLI-GRPCLA-GRC                  VALUE IS 01.
      *>-> Grupo de Classificação - Representante
              88 WSLI-GRPCLA-REP                  VALUE IS 02.
      *>-> Grupo de Classificação - Transporte
              88 WSLI-GRPCLA-TRP                  VALUE IS 03.
      *>-> Grupo de Classificação - Local de cobrança
              88 WSLI-GRPCLA-LOC                  VALUE IS 04.
      *>-> Grupo de Classificação - Estado
              88 WSLI-GRPCLA-EST                  VALUE IS 05.
      *>-> Grupo de Classificação - Preposto
              88 WSLI-GRPCLA-CPR                  VALUE IS 06.
      *>-> Grupo de Classificação - Vendedor
              88 WSLI-GRPCLA-CVD                  VALUE IS 07.
      *>-> Grupo de Classificação - Representante/Preposto/Vendedor
              88 WSLI-GRPCLA-RPV                  VALUE IS 08.
      *>-> Grupo de Classificação - Estado/Cidade
              88 WSLI-GRPCLA-UFC                  VALUE IS 09.
      *>-> Grupo de Classificação - Holding
              88 WSLI-GRPCLA-HOL                  VALUE IS 10.
      *>-> Grupo de Classificação - Zona de venda
              88 WSLI-GRPCLA-ZON                  VALUE IS 11.
      *>-> Grupo de Classificação - Escritório
              88 WSLI-GRPCLA-ESC                  VALUE IS 12.
              88 WSLI-GRPCLA-GRP                  VALUES ARE 6 THRU 8.
              88 WSLI-GRPCLA-CUF                  VALUES ARE 5, 9.
              88 WSLI-GRPCLA-SIM                  VALUES ARE 1 THRU 12.
      *>-> Subgrupo de classificação
           05 WSLI-SGRCLA         PIC IS 9(02)    VALUE IS 01    COMP-X.
      *>-> Subgrupo de classificação - Não classifica
              88 WSLI-SGRCLA-NAO                  VALUE IS 01.
      *>-> Subgrupo de classificação - Preposto
              88 WSLI-SGRCLA-CPR                  VALUE IS 02.
      *>-> Subgrupo de classificação - Representante
              88 WSLI-SGRCLA-REP                  VALUE IS 03.
      *>-> Subgrupo de classificação - Vendedor
              88 WSLI-SGRCLA-CVD                  VALUE IS 04.
      *>-> Subgrupo de classificação - Grupo de cadastro
              88 WSLI-SGRCLA-GRC                  VALUE IS 05.
      *>-> Subgrupo de classificação - Transporte
              88 WSLI-SGRCLA-TRP                  VALUE IS 06.
      *>-> Subgrupo de classificação - Local de cobrança
              88 WSLI-SGRCLA-LOC                  VALUE IS 07.
      *>-> Subgrupo de classificação - Holding
              88 WSLI-SGRCLA-HOL                  VALUE IS 08.
      *>-> Subgrupo de classificação - Zona de venda
              88 WSLI-SGRCLA-ZON                  VALUE IS 09.
      *>-> Subgrupo de classificação - Cidade
              88 WSLI-SGRCLA-CID                  VALUE IS 10.
      *>-> Ordem do grupo de classificação
           05 WSLI-ORDGRP         PIC IS X(01)    VALUE IS "C".
              88 WSLI-ORDGRP-COD                  VALUE IS "C".
              88 WSLI-ORDGRP-ALF                  VALUE IS "A".
      *>-> Tipo de salto de linha entre cadastros
           05 WSLI-SALTO          PIC IS 9(01)    VALUE IS 1     COMP-X.
      *>-> Tipo de salto de linha entre cadastros - Simples
              88 WSLI-SALTO-SIM                   VALUE IS 1.
      *>-> Tipo de salto de linha entre cadastros - Duplo
              88 WSLI-SALTO-DUP                   VALUE IS 2.
      *>-> Tipo de salto de linha entre cadastros - Traço
              88 WSLI-SALTO-TRA                   VALUE IS 3.
      *>-> Filtra por e-mail ou conta corrente
           05 WSLI-FILECC         PIC IS 9(01)    VALUE IS 2     COMP-X.
      *>-> Filtra por e-mail ou conta corrente - Lista todos
              88 WSLI-FILECC-TOD                  VALUE IS 1.
      *>-> Filtra por e-mail ou conta corrente - Lista só os que tem e-mail
              88 WSLI-FILECC-CEM                  VALUE IS 2.
      *>-> Filtra por e-mail ou conta corrente - Lista só os não que tem e-mail
              88 WSLI-FILECC-SEM                  VALUE IS 3.
      *>-> Filtra por e-mail ou conta corrente - Lista só os que tem dados conta corrente
              88 WSLI-FILECC-CCC                  VALUE IS 4.
      *>-> Filtra por e-mail ou conta corrente - Lista só os não que tem dados conta corrente
              88 WSLI-FILECC-SCC                  VALUE IS 5.
      *>-> Dias de visita
           05 WSLI-DIAVIS         PIC IS 9(02)    VALUE IS 15    COMP-X.
      *>-> Dias de visita - Visitado no domingo
              88 WSLI-DIAVIS-DOM                  VALUE IS 1.
      *>-> Dias de visita - Visitado na segunda
              88 WSLI-DIAVIS-SEG                  VALUE IS 2.
      *>-> Dias de visita - Visitado na terça
              88 WSLI-DIAVIS-TER                  VALUE IS 3.
      *>-> Dias de visita - Visitado na quarta
              88 WSLI-DIAVIS-QUA                  VALUE IS 4.
      *>-> Dias de visita - Visitado na quinta
              88 WSLI-DIAVIS-QUI                  VALUE IS 5.
      *>-> Dias de visita - Visitado na sexta
              88 WSLI-DIAVIS-SEX                  VALUE IS 6.
      *>-> Dias de visita - Visitado no sábado
              88 WSLI-DIAVIS-SAB                  VALUE IS 7.
      *>-> Dias de visita - Só no domingo
              88 WSLI-DIAVIS-SDO                  VALUE IS 8.
      *>-> Dias de visita - Só na segunda
              88 WSLI-DIAVIS-SSE                  VALUE IS 9.
      *>-> Dias de visita - Só na terça
              88 WSLI-DIAVIS-STE                  VALUE IS 10.
      *>-> Dias de visita - Só na quarta
              88 WSLI-DIAVIS-SQU                  VALUE IS 11.
      *>-> Dias de visita - Só na quinta
              88 WSLI-DIAVIS-SQI                  VALUE IS 12.
      *>-> Dias de visita - Só na sexta
              88 WSLI-DIAVIS-SSX                  VALUE IS 13.
      *>-> Dias de visita - Só no sábado
              88 WSLI-DIAVIS-SSA                  VALUE IS 14.
      *>-> Dias de visita - Não testar
              88 WSLI-DIAVIS-NTE                  VALUE IS 15.
      *>-> Dias de visita - Com visita
              88 WSLI-DIAVIS-COM                  VALUE IS 16.
      *>-> Dias de visita - Sem visita
              88 WSLI-DIAVIS-SEM                  VALUE IS 17.
      *>-> Dias de visita - Todos as dias da semana
              88 WSLI-DIAVIS-ALL                  VALUE IS 18.
      *>-> Indica se deve listar somente cadastros com CNPJ repetidos
           05 WSLI-IMPREP         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WSLI-IMPREP-SIM                  VALUE IS 1.
              88 WSLI-IMPREP-NAO                  VALUE IS 2.
      *>-> Lista somente isentos ICMS
           05 WSLI-LSIICM         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WSLI-LSIICM-SIM                  VALUE IS 1.
              88 WSLI-LSIICM-NAO                  VALUE IS 2.
      *>-> Lista de preços do cliente
           05 WSLI-LISPRC         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
      *>-> Identificação do cadastro
           05 WSLI-IDECAD         PIC IS 9(01)    VALUE IS 1     COMP-X.
      *>-> Identificação do cadastro - Razão social
              88 WSLI-IDECAD-RAZ                  VALUE IS 1.
      *>-> Identificação do cadastro - Nome fantasia
              88 WSLI-IDECAD-FAN                  VALUE IS 2.
      *>-> Listar linhas de produto
           05 WSLI-LISPRO         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WSLI-LISPRO-SIM                  VALUE IS 1.
              88 WSLI-LISPRO-NAO                  VALUE IS 2.
      *>-> Limite de capital social do cadastro para listagem
           05 WSLI-LIMCAP         PIC IS 9(10)V99 VALUE IS 9999999999,99 COMP.
      *>-> Indica se deve listar contatos de cli/for
           05 WSLI-TIPCAD         PIC IS 9(01)    VALUE IS 3     COMP-X.
              88 WSLI-TIPCAD-ASS                  VALUE IS 1.
              88 WSLI-TIPCAD-FIL                  VALUE IS 2.
              88 WSLI-TIPCAD-AMB                  VALUE IS 3.
      *>-> Versão do cliente (Uso interno RIL)
           05 WSLI-VERCLI         PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>-> Versão do cliente - Todas (Uso interno RIL)
              88 WSLI-VERCLI-TOD                  VALUE IS 1.
      *>-> Descrição da versão do cliente (Uso interno RIL)
           05 WSLI-VERCLID-X.
              10 FILLER           PIC IS X(01)    VALUE IS SPACES.
              10 WSLI-VERCLID     PIC IS X(07)    VALUE IS SPACES.
      *>-> Indica se lista cadastros sem certificação de qualidade
           05 WSLI-LISSCQ         PIC IS 9(01)    VALUE IS 1     COMP-X.
              88 WSLI-LISSCQ-SIM                  VALUE IS 1.
              88 WSLI-LISSCQ-NAO                  VALUE IS 2.
      *>-> Data inicial
           05 WSLI-DATINI                         VALUE IS W78-DTMIN.
              10 WSLI-ANOINI      PIC IS 9(04)                   COMP-X.
              10 WSLI-MESINI      PIC IS 9(02)                   COMP-X.
              10 WSLI-DIAINI      PIC IS 9(02)                   COMP-X.
      *>-> Data final
           05 WSLI-DATFIN                         VALUE IS W78-DTMAX.
              10 WSLI-ANOFIN      PIC IS 9(04)                   COMP-X.
              10 WSLI-MESFIN      PIC IS 9(02)                   COMP-X.
              10 WSLI-DIAFIN      PIC IS 9(02)                   COMP-X.
      *>-> Dia/mês aniversário auxiliar (sem COMP-X!!!)
           05 WSLI-DIMAUX.
              10 WSLI-AUXMES      PIC IS 9(02)    VALUE IS ZEROS.
              10 WSLI-AUXDIA      PIC IS 9(02)    VALUE IS ZEROS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis da rotina centralizada de listagem.................................................................
       01  WRCL-CAMPOS.
      *>-> Variáveis auxiliares e máscara usada na classificação para grupo
           05 WRCL-GRUPO.
              10 WRCL-GRPAUX      PIC IS 9(04)    VALUE IS ZEROS COMP-X.
           05 WRCL-GRPAU2         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
           05 WRCL-GRPAU3         PIC IS 9(02)    VALUE IS ZEROS COMP-X.
           05 WRCL-FCAD-EST       PIC IS X(02)    VALUE IS SPACES.
      *>-> variáveis auxiliares de classif.Subgrupo - Preposto/Representate/Vendedor
           05 WRCL-SGRUPO.
              10 WRCL-SGRAUX      PIC IS 9(04)    VALUE IS ZEROS COMP-X.
           05 WRCL-SGRAU2         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
           05 WRCL-SGRAU3         PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>-> Variáveis auxiliares de classif. por zona de venda/micro reg
           05 WRCL-FCAD-CZM.
              10 WRCL-FCAD-ZON    PIC IS 9(03)    VALUE IS ZEROS COMP-X.
              10 WRCL-FCAD-MRG    PIC IS 9(03)    VALUE IS ZEROS COMP-X.
      *>-> Códigos auxiliares para classificação por escritório
           05 WRCL-FB-ECA         PIC IS 9(07)    VALUE IS ZEROS COMP-X.
           05 WRCL-FB-EC2         PIC IS 9(07)    VALUE IS ZEROS COMP-X.
      *>-> Cidade auxiliar para subgrupo de classificação Cidade
           05 WRCL-SGRCID         PIC IS X(20)    VALUE IS SPACES.
           05 WRCL-CIDAUX         PIC IS X(20)    VALUE IS SPACES.
      *>-> Cidade auxiliar para grupo de classificação U.F./Cidade (GRPCLA-UFC)
           05 WRCL-FCAD-CDX       PIC IS X(20)    VALUE IS SPACES.
           05 WRCL-GRPCGC.
              10 WRCL-CGCCPF      PIC IS 9(14)                   COMP-X.
      *>-> Variável auxiliar para editar o percentual
           05 WRCL-PER            PIC IS 99,99          BLANK WHEN ZERO.
      *>-> CNPJ auxiliar
           05 WRCL-CGGAUX         PIC IS X(07)    VALUE IS LOW-VALUES.
      *>-> Variáveis para totalização da dívida ativa e dos códigos
           05 WRCL-TOTDIV         PIC IS 9(12)V99 VALUE IS ZEROS COMP.
           05 WRCL-TOTACU         PIC IS 9(12)V99 VALUE IS ZEROS COMP.
           05 WRCL-TOTCOD         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
      *>-> Contador de cadastros por representantes
           05 WRCL-CONREP         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
      *>-> Contador de cadastros por cidade
           05 WRCL-CONCID         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
      *>-> Variáveis para totalização da de empresas
           05 WRCL-KC-NEP         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
           05 WRCL-KC-NEM         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
           05 WRCL-KC-CPS         PIC IS 9(09)V999 VALUE ZEROS   COMP.
      *>-> Observação auxiliar para ser utilizado para exportação excel
           05 WRCL-OBSAUX         PIC IS X(132)   VALUE IS SPACES.
      *>-> Indica se deve listar a linha do grupo de cadastro
           05 WRCL-LINGRP         PIC IS X(01)    VALUE IS "S".
              88 WRCL-LINGRP-SIM                  VALUE IS "S".
              88 WRCL-LINGRP-NAO                  VALUE IS "N".
      *>-> Indica que imprimiu o cabeçalho dos contatos
           05 WRCL-IMCACO         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WRCL-IMCACO-SIM                  VALUE IS 1.
              88 WRCL-IMCACO-NAO                  VALUE IS 2.
      *>-> Índice para sequencial do registro
           05 WRCL-SEQ            PIC IS 9(09)    VALUE IS ZEROS COMP-X.
      *>-> Mês/dia auxiliar
           05 WRCL-FCAD-MDI.
              10 WRCL-FCAD-MNA    PIC IS 9(02)    VALUE IS ZEROS COMP-X.
              10 WRCL-FCAD-DNA    PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>-> Conteúdo da linha de quebra para proxima página
           05 WRCL-WGL-LG         PIC IS X(200)   VALUE IS SPACES.
      *>-> Dado utilizado para complementar o registro dos dados do
      *>-> ...contato, pois não é mais possível colocar na redefinição
      *>-> ...por causa do tamanho do item pai.
      *>-> Obs.: Somente para excel é utilizado este campo
           05 WRCL-FB-DNC         PIC IS X(10).
      *>-> Indica se deve listar linha em branco após grupo (W-FUNCAO-LSI)
           05 WRCL-LISBRA         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WRCL-LISBRA-SIM                  VALUE IS 1.
              88 WRCL-LISBRA-NAO                  VALUE IS 2.
      *>-> Indice de DiGitação
           05 WRCL-I              PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>-> Acumula valor das notas do cliente
           05 WRCL-ACUNOT         PIC IS S9(12)V99 VALUE IS ZEROS COMP.
      *>-> Indica se tem registro para listar na opção rech
           05 WRCL-LISREC         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WRCL-LISREC-SIM                  VALUE IS 1.
              88 WRCL-LISREC-NAO                  VALUE IS 2.
      *>-> CEP utilizado para edição
           05 WRCL-FCAD-CEPX.
              10 WRCL-FCAD-CEP    PIC IS 99.999.999 VALUE ZEROS.
      *>-> Descrição auxiliar do cadastro, para listagem simplificada
           05 WRCL-DESAUX         PIC IS X(32)    VALUE IS SPACES.
      *>-> Cidade auxiliar do cadastro, para listagem simplificada
           05 WRCL-FCAD-CID       PIC IS X(20)    VALUE IS SPACES.
      *>-> 1-6 duplicatas
           05 WRCL-FTAB-QTD                       VALUE IS SPACES.
              10 WRCL-FTAB-VEN1   PIC IS ZZ9/.
              10 WRCL-FTAB-VEN2   PIC IS ZZZ/.
              10 WRCL-FTAB-VEN3   PIC IS ZZZ/.
              10 WRCL-FTAB-VEN4   PIC IS ZZZ/.
              10 WRCL-FTAB-VEN5   PIC IS ZZZ/.
              10 WRCL-FTAB-VEN6   PIC IS ZZZ.
      *>-> Tabela de visitas
           05 WRCL-TABVIS.
              10 WRCL-VISITA      PIC IS X(01)   OCCURS 07 TIMES.
      *>-> Variável total pago auxiliar - valor pago + juros - desconto
           05 WRCL-TOTAL          PIC IS 9(12)V99 VALUE IS ZEROS COMP.
      *>-> Totais dos descontos
           05 WRCL-TOTDDE.
      *>-> Ocorrências dos descontos
              10 WRCL-TOTODD                     OCCURS W78-NOCDDE TIMES.
      *>-> Total do desconto
                 15 WRCL-TOTDES   PIC IS 9(10)V99 VALUE IS ZEROS COMP.
      *>-> Variável para calcular o DESconto para pagamento no vencto
           05 WRCL-DESPAG         PIC IS 9(09)V99 VALUE IS ZEROS COMP.
      *>-> Indice da tabela de serviços
           05 WRCL-ISE            PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>-> Variável para acumular o TOTal do DEsconto para pagamento no vencimento
           05 WRCL-TOTDEP         PIC IS 9(09)V99 VALUE IS ZEROS COMP.
      *>-> Indica se está conectado no SICLA
           05 WRCL-CONSIC         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WRCL-CONSIC-SIM                  VALUE IS 1.
              88 WRCL-CONSIC-NAO                  VALUE IS 2.
      *>-> Indica se encontrou contato válido
           05 WRCL-ENCOVA         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WRCL-ENCOVA-SIM                  VALUE IS 1.
              88 WRCL-ENCOVA-NAO                  VALUE IS 2.
      *>-> Retorno da função para captura de versão
           05 WRCL-VERSAO         PIC IS X(10)    VALUE IS SPACES.
      *>-> Contador de cadastros
           05 WRCL-CONAUX         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis da rotina de correção de limite de crédito.........................................................
       01  WCLC-CAMPOS.
      *>-> Tipo de correção
           05 WCLC-TIPCOR         PIC IS 9(01)    VALUE IS 1     COMP-X.
      *>-> Tipo de correção - Percentual
              88 WCLC-TIPCOR-PER                  VALUE IS 1.
      *>-> Tipo de correção - Valor
              88 WCLC-TIPCOR-VAL                  VALUE IS 2.
      *>-> Tipo de correção - Manual
              88 WCLC-TIPCOR-MAN                  VALUE IS 3.
      *>-> Tipo de correção - Baseado nas vendas
              88 WCLC-TIPCOR-BNV                  VALUE IS 4.
      *>-> Tipo de correção - Última venda
              88 WCLC-TIPCOR-ULV                  VALUE IS 5.
      *>-> Atualizar os limites
           05 WCLC-ATULIM         PIC IS 9(01)    VALUE IS 1     COMP-X.
      *>-> Atualizar os limites - Todos
              88 WCLC-ATULIM-TOD                  VALUE IS 1.
      *>-> Atualizar os limites - Somente os limites a aumentar
              88 WCLC-ATULIM-AUM                  VALUE IS 2.
      *>-> Atualizar os limites - Somente os limites a diminuir
              88 WCLC-ATULIM-DIM                  VALUE IS 3.
      *>-> Cálculo do valor da média
           05 WCLC-CVLMED         PIC IS 9(01)    VALUE IS 1     COMP-X.
      *>-> Cálculo do valor da média - Média com meses da seleção
              88 WCLC-CVLMED-TOD                  VALUE IS 1.
      *>-> Cálculo do valor da média - Média com meses movimentados
              88 WCLC-CVLMED-AUM                  VALUE IS 2.
      *>-> Percentual de reajuste do limite de crédito
           05 WCLC-PERCOR         PIC S9(03)V9999 VALUE IS ZEROS COMP.
      *>-> Valor para correção do limite de crédito
           05 WCLC-VALCOR         PIC IS 9(10)V99 VALUE IS ZEROS COMP.
      *>-> Valor mínimo
           05 WCLC-VALMIN         PIC IS 9(10)V99 VALUE IS ZEROS COMP.
      *>-> Valor de arredondamento
           05 WCLC-VALARE         PIC IS 9(10)V99 VALUE IS ZEROS COMP.
      *>-> Percentual mínimo para reajuste
           05 WCLC-PERMIN         PIC IS 9(02)V99 VALUE IS ZEROS COMP.
      *>-> Considera os cliente que não tiveram venda no período
           05 WCLC-CONCSV         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WCLC-CONCSV-SIM                  VALUE IS 1.
              88 WCLC-CONCSV-NAO                  VALUE IS 2.
      *>-> Tabela dos cadastros a terem seus limites alterados
           05 WCLC-TABCAD                         VALUES IS LOW-VALUES.
      *>-> Ocorrências dos cadastros a terem seus limites alterados
              10 WCLC-OCOCAD                     OCCURS W78-QTDCAD TIMES.
      *>-> Código do cadastro
                 15 WCLC-CODCAD   PIC IS 9(07)                   COMP-X.
      *>-> Novo valor do limite de crédito
                 15 WCLC-NOVCRE   PIC IS 9(10)V99                COMP.
      *>-> Indica se deve ignorar o cadastro
           05 WCLC-IGNCAD         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WCLC-IGNCAD-SIM                  VALUE IS 1.
              88 WCLC-IGNCAD-NAO                  VALUE IS 2.
      *>-> Data de faturamento do pedido - Inicial
           05 WCLC-DATINI.
              10 WCLC-ANOINI      PIC IS 9(04)    VALUE W78-ANMIN COMP-X.
              10 WCLC-MESINI      PIC IS 9(02)    VALUE W78-MEMIN COMP-X.
              10 WCLC-DIAINI      PIC IS 9(02)    VALUE W78-DIMIN COMP-X.
      *>-> Data de faturamento do pedido - Final
           05 WCLC-DATFIN.
              10 WCLC-ANOFIN      PIC IS 9(04)    VALUE W78-ANMAX COMP-X.
              10 WCLC-MESFIN      PIC IS 9(02)    VALUE W78-MEMAX COMP-X.
              10 WCLC-DIAFIN      PIC IS 9(02)    VALUE W78-DIMAX COMP-X.
      *>-> Data auxiliar
           05 WCLC-DATAUX                         VALUE IS LOW-VALUES.
              10 WCLC-ANOAUX      PIC IS 9(04)                   COMP-X.
              10 WCLC-MESAUX      PIC IS 9(02)                   COMP-X.
              10 WCLC-DIAAUX      PIC IS 9(02)                   COMP-X.
      *>-> Ocorrências das flags de utilização da seleções de documentos
           05 WCLC-OCOSLD                        OCCURS W78-OCOSLD TIMES.
      *>-> Aceita a seleção de documentos para restrições
              10 WCLC-SELDOC      PIC IS 9(01)    VALUE IS 2     COMP-X.
                 88 WCLC-SELDOC-SIM               VALUE IS 1.
                 88 WCLC-SELDOC-NAO               VALUE IS 2.
      *>-> Indica se cadastro possui documento com restrição
           05 WCLC-CADPDR         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WCLC-CADPDR-SIM                  VALUE IS 1.
              88 WCLC-CADPDR-NAO                  VALUE IS 2.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis da rotina de geração de código alternativo.........................................................
       01  WGCA-CAMPOS.
      *>-> Campo para montagem de código alternativo
           05 WGCA-CAL.
              10 WGCA-ZON         PIC IS 99       VALUE IS ZEROS.
              10 FILLER           PIC IS X(01)    VALUE IS ".".
              10 WGCA-MRG         PIC IS 99       VALUE IS ZEROS.
              10 FILLER           PIC IS X(01)    VALUE IS ".".
              10 WGCA-SRO         PIC IS X(04)    VALUE IS SPACES.
      *>-> Sequência do roteiro auxiliar no código alternativo
           05 WGCA-SEQROT.
              10 FILLER           PIC IS X(01)    VALUE IS SPACES.
              10 WGCA-SRA.
                 15 FILLER        PIC IS X(04)    VALUE IS SPACES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis da rotina de consistência de Inscrição Estadual....................................................
       01  WCIE-CAMPOS.
      *>-> Inconsistências de Inscrição Estadual a listar
           05 WCIE-INCIEL         PIC IS 9(01)    VALUE IS 4     COMP-X.
      *>-> Inconsistências de Inscrição Estadual a listar - Inválidas
              88 WCIE-INCIEL-INV                  VALUE IS 1.
      *>-> Inconsistências de Inscrição Estadual a listar - Não ativas
              88 WCIE-INCIEL-NAT                  VALUE IS 2.
      *>-> Inconsistências de Inscrição Estadual a listar - CNPJ errado
              88 WCIE-INCIEL-CNE                  VALUE IS 3.
      *>-> Inconsistências de Inscrição Estadual a listar - Todas
              88 WCIE-INCIEL-TOD                  VALUE IS 4.
      *>-> Verificar inconsistências em todas as empresas
           05 WCIE-INCEMP         PIC IS 9(01)    VALUE IS 2     COMP-X.
              88 WCIE-INCEMP-SIM                  VALUE IS 1.
              88 WCIE-INCEMP-NAO                  VALUE IS 2.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Variáveis da rotina de gráfico de clientes/fornecedores......................................................
       01  WGCF-CAMPOS.
      *>-> Grupo de Classificação
           05 WGCF-GRPCLA         PIC IS 9(02)    VALUE IS 00    COMP-X.
      *>-> Grupo de Classificação - Não classifica
              88 WGCF-GRPCLA-NAO                  VALUE IS 00.
      *>-> Grupo de Classificação - Grupo de cadastro
              88 WGCF-GRPCLA-GRC                  VALUE IS 01.
      *>-> Grupo de Classificação - Representante
              88 WGCF-GRPCLA-REP                  VALUE IS 02.
      *>-> Grupo de Classificação - Transporte
              88 WGCF-GRPCLA-TRP                  VALUE IS 03.
      *>-> Grupo de Classificação - Local de cobrança
              88 WGCF-GRPCLA-LOC                  VALUE IS 04.
      *>-> Grupo de Classificação - Estado
              88 WGCF-GRPCLA-EST                  VALUE IS 05.
      *>-> Grupo de Classificação - Preposto
              88 WGCF-GRPCLA-CPR                  VALUE IS 06.
      *>-> Grupo de Classificação - Vendedor
              88 WGCF-GRPCLA-CVD                  VALUE IS 07.
      *>-> Grupo de Classificação - Representante/Preposto/Vendedor
              88 WGCF-GRPCLA-RPV                  VALUE IS 08.
      *>-> Grupo de Classificação - Estado/Cidade
              88 WGCF-GRPCLA-UFC                  VALUE IS 09.
      *>-> Grupo de Classificação - Holding
              88 WGCF-GRPCLA-HOL                  VALUE IS 10.
      *>-> Grupo de Classificação - Zona de venda
              88 WGCF-GRPCLA-ZON                  VALUE IS 11.
      *>-> Grupo de Classificação - Escritório
              88 WGCF-GRPCLA-ESC                  VALUE IS 12.
      *>-> Índice auxiliar utilizado na listagem gráfica
           05 WGCF-INDAUX         PIC IS 9(04)    VALUE IS ZEROS COMP-X.
      *>-> Código de representante/preposto/vendedor auxiliar
           05 WGCF-CODAXX.
              10 WGCF-REPAXX.
                 15 WGCF-REPAUX   PIC IS 9(04)    VALUE IS ZEROS COMP-X.
              10 WGCF-CPRAXX.
                 15 WGCF-CPRAUX   PIC IS 9(04)    VALUE IS ZEROS COMP-X.
              10 WGCF-CVDAXX.
                 15 WGCF-CVDAUX   PIC IS 9(04)    VALUE IS ZEROS COMP-X.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Arquivos virtuais............................................................................................
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Cadastros para classificação para gráfico
           COPY                   WARQVIRT.CPY REPLACING ==(ARQ)== BY ==GRA==.
      *>-> Registro do arquivo virtual de grupos de classificação para geração de gráfico
       01  W-GRA-REG.
      *>-> Chave principal..............................................................................................
           05 W-GRA-CHA.
      *>-> Tipo de classificação
              10 W-GRA-TIP        PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>-> Tipo de classificação - Grupo de cadastro
                 88 W-GRA-TIPGRC                  VALUE IS 01.
      *>-> Tipo de classificação - Representante
                 88 W-GRA-TIPREP                  VALUE IS 02.
      *>-> Tipo de classificação - Transporte
                 88 W-GRA-TIPTRP                  VALUE IS 03.
      *>-> Tipo de classificação - Destino dos títulos
                 88 W-GRA-TIPDTI                  VALUE IS 04.
      *>-> Tipo de classificação - Estado
                 88 W-GRA-TIPEST                  VALUE IS 05.
      *>-> Tipo de classificação - Preposto
                 88 W-GRA-TIPCPR                  VALUE IS 06.
      *>-> Tipo de classificação - Vendedor
                 88 W-GRA-TIPCVD                  VALUE IS 07.
      *>-> Tipo de classificação - Representante/Preposto/Vendedor
                 88 W-GRA-TIPRPV                  VALUE IS 08.
      *>-> Tipo de classificação - Estado/Cidade
                 88 W-GRA-TIPUFC                  VALUE IS 09.
      *>-> Tipo de classificação - Holding
                 88 W-GRA-TIPHOL                  VALUE IS 10.
      *>-> Tipo de classificação - Zona de venda
                 88 W-GRA-TIPZON                  VALUE IS 11.
      *>-> Tipo de classificação - Escritório
                 88 W-GRA-TIPESC                  VALUE IS 12.
      *>-> Tipo de classificação - Ok/Válido
                 88 W-GRA-TIP-OK                  VALUES ARE 01 THRU 12.
      *>-> Grupo
              10 W-GRA-UFC.
                 15 W-GRA-EST     PIC IS X(02).
                 15 W-GRA-CID     PIC IS X(20).
                 15 W-GRA-CMU     PIC IS 9(07)                   COMP-X.
              10 FILLER REDEFINES W-GRA-UFC.
                 15 W-GRA-GRP     PIC IS 9(04)                   COMP-X.
                 15 W-GRA-GR2     PIC IS 9(02)                   COMP-X.
                 15 FILLER        PIC IS X(22).
      *>-> Chave para escritório
              10 FILLER REDEFINES W-GRA-UFC.
                 15 W-GRA-ESC     PIC IS 9(07)                   COMP-X.
                 15 FILLER        PIC IS X(22).
      *>-> Dados........................................................................................................
           05 W-GRA-DAD.
      *>-> Quantidade de cadastro que o grupo de cadastro possui
              10 W-GRA-QTD        PIC IS 9(05)                   COMP-X.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Clientes/fornecedores para atualizar limite de crédito
           COPY                   WARQVIRT.CPY REPLACING ==(ARQ)== BY ==CLC==.
      *>-> Registro do arquivo virtual dos clientes/fornecedores para atualizar limite de crédito
       01  W-CLC-REG                              VALUE IS LOW-VALUES.
      *>-> Chave principal..............................................................................................
           05 W-CLC-CHA.
      *>-> Código dos cliente/fornecedores
              10 W-CLC-COD        PIC IS 9(07)                   COMP-X.
      *>-> Dados........................................................................................................
           05 W-CLC-DAD.
      *>-> Descrição dos cliente/fornecedores
              10 W-CLC-DES        PIC IS X(32).
      *>-> Limite de crédito atual
              10 W-CLC-CRA        PIC IS 9(10)V99                COMP.
      *>-> Limite de crédito novo
              10 W-CLC-CRN        PIC IS 9(10)V99                COMP.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Certificações de qualidade
           COPY                   WARQVIRT.CPY REPLACING ==(ARQ)== BY ==CQL==.
      *>-> Registro do arquivo virtual: Certificações de qualidade
       01  W-CQL-REG.
      *>-> Chave principal..............................................................................................
           05 W-CQL-CHA.
              10 W-CQL-COD        PIC IS 9(02)    VALUE IS ZEROS COMP-X.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Cadastros para classificação
           COPY                   WARQVIRT.CPY REPLACING ==(ARQ)== BY ==CAD==.
      *>-> Registro do arquivo virtual de cadastros para classificação
       01  KREG-CAD.
      *>-> Chave para classificação por grupo
      *>-> Maior chave: Alfabética por grupo 9-U.F./Cidade (39 bytes) +
      *>->              Subgrupo (32Bytes)   +
      *>->              Ordem 11-Cid/Bairro/Raz.Social (67 bytes) +
      *>->              Listar, opções 15 e 16 (22 bytes) +
      *>->              Indicador de totalizador(1 bytes)
           05 KC-CHA              PIC IS X(160).
      *>-> Dados........................................................................................................
           05 KC-DAD.
      *>-> Codigo do registro de classificação
              10 KC-COD           PIC IS 9(07)                   COMP-X.
      *>-> Tipo de cadastro gravado (para testes de listagem)
              10 KC-TIP           PIC IS 9(02)                   COMP-X.
                 88 KC-TIPREP                     VALUE IS 1.
                 88 KC-TIPCPR                     VALUE IS 2.
                 88 KC-TIPCVD                     VALUE IS 3.
      *>-> Estado do cliente
              10 KC-EST           PIC IS X(02).
      *>-> Cidade do cadastro
              10 KC-CID           PIC IS X(20).
      *>-> Código da zona de vendas/região
              10 KC-ZON           PIC IS 9(03)                   COMP-X.
      *>-> Número de empresas
              10 KC-NEP           PIC IS 9(04)                   COMP-X.
      *>-> Número de empregados
              10 KC-NEM           PIC IS 9(04)                   COMP-X.
      *>-> Capital social
              10 KC-CPS           PIC IS 9(10)V99                  COMP.
      *>-> DDD
              10 KC-DDD           PIC IS X(05).
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Totalizador por espécie dos recursos ativos
           COPY                   WARQVIRT.CPY REPLACING ==(ARQ)== BY ==RES==.
      *>-> Registro do arquivo de recursos ativos por espécie
       01  KREG-RES                               VALUE IS LOW-VALUES.
      *>-> Chave principal
           05 KR-CHA.
      *>-> Código do cadastro alfanumérico
              10 KR-CAX.
      *>-> Código do cadastro
                 15 KR-CAD        PIC IS 9(07)                   COMP-X.
      *>-> Espécie de recurso (grava HIGH-VALUES para totalizador geral)
              10 KR-ERC           PIC IS 9(02)                   COMP-X.
      *>-> Espécie de recurso - Outros
                 88 KR-ERCOUT                     VALUE IS 99.
      *>-> Faixa de espécies de recurso
                 88 KR-ERC-OK                     VALUES ARE  1 THRU 13, 99.
      *>-> Código do recurso ativo
              10 KR-COD           PIC IS 9(07)                   COMP-X.
      *>-> Chave alternativa
           05 KR-ALT.
              10 KR-ER2           PIC IS 9(02)                   COMP-X.
      *>-> Dados do arquivo
           05 KR-DAD.
      *>-> Quantidade de recursos desta espécie que foram processados
              10 KR-QTD           PIC IS 9(07)                   COMP-X.
      *>-> Número da ChaPa (apenas para o registro individual)
              10 KR-NCP           PIC IS X(20).
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Linhas de grid...............................................................................................
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grid para aceitação dos novos limite de crédito..............................................................
       01  WCLC-GRCCLC                            VALUE IS SPACES.
           05 WL-W-CLC-COD        PIC IS Z(07).
           05 FILLER              PIC IS X(01).
           05 WL-W-CLC-DES        PIC IS X(32).
           05 FILLER              PIC IS X(01).
           05 WL-W-CLC-CRA        PIC IS X(15).
           05 FILLER              PIC IS X(01).
           05 WL-W-CLC-CRN        PIC IS X(15).
      *>-> Linha de item da janela de certificações a listar do cadastro................................................
       01  WCQL-CERCAD                            VALUE IS SPACES.
           05 FILLER              PIC IS X(01).
           05 WL-FTAB-CCQL        PIC IS Z(02).
           05 FILLER              PIC IS X(02).
           05 WL-FTAB-DCQ         PIC IS X(32).
           05 FILLER              PIC IS X(01).
           05 WL-FTAB-ORC         PIC IS X(32).
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                         L  I  N  H  A  S     D  E     I  M  P  R  E  S  S  Ã  O                          <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Linha de seleção.............................................................................................
       01  W-CAB-SELECAO          PIC IS X(160)   VALUE IS SPACES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Linhas de dados da listagem detalhada........................................................................
       01  WD-DETALHE.
           05 W-CODIGO.
              10 L-LT-COD         PIC IS X(13).
              10 L-FC-COD         PIC IS ZZZZZZ9.
              10 FILLER           PIC IS X(01).
              10 L-FC-DES         PIC IS X(32).
              10 FILLER           PIC IS X(01).
              10 L-LT-FUN         PIC IS X(15).
              10 L-FC-DTNA        PIC IS X(08).
              10 FILLER           PIC IS X(02).
              10 L-LT-CGC         PIC IS X(05).
              10 L-CGCCPF         PIC IS X(18).
              10 FILLER           PIC IS X(02).
              10 L-LT-IES         PIC IS X(13).
              10 L-FC-IES         PIC IS X(15).
           05 WR-FANTAS REDEFINES W-CODIGO.
              10 L-LT-FAN         PIC IS X(13).
              10 L-FC-FAN         PIC IS X(25).
              10 FILLER           PIC IS X(15).
              10 L-LT-TIT         PIC IS X(09).
              10 L-FC-TIT         PIC IS X(12).
              10 FILLER           PIC IS X(01).
              10 L-LT-FON         PIC IS X(09).
              10 L-FC-FON         PIC IS X(14).
              10 FILLER           PIC IS X(01).
              10 L-FC-FO2         PIC IS X(14).
              10 FILLER           PIC IS X(01).
              10 L-LT-FAX         PIC IS X(04).
              10 L-FC-FAX         PIC IS X(14).
           05 WR-VISITA REDEFINES W-CODIGO.
              10 L-LT-DVI         PIC IS X(13).
              10 L-FC-DVI         PIC IS X(15).
              10 FILLER           PIC IS X(21).
              10 L-LT-ENCP        PIC IS X(13).
              10 L-FC-ENCP        PIC IS X(25).
              10 FILLER           PIC IS X(01).
              10 L-LT-FONC        PIC IS X(09).
              10 L-FC-FONC        PIC IS X(14).
              10 FILLER           PIC IS X(01).
              10 L-LT-FXC         PIC IS X(08).
              10 L-FC-FXC         PIC IS X(12).
           05 WR-ENDERE REDEFINES W-CODIGO.
              10 L-LT-END         PIC IS X(13).
              10 L-FC-END         PIC IS X(40).
              10 FILLER           PIC IS X(01).
              10 L-LT-BAI         PIC IS X(08).
              10 L-FC-BAI         PIC IS X(15).
              10 FILLER           PIC IS X(06).
              10 L-LT-CID         PIC IS X(08).
              10 L-FC-CID         PIC IS X(20).
              10 FILLER           PIC IS X(01).
              10 L-LT-CEP         PIC IS X(05).
              10 L-FC-CEP         PIC IS 99999.999      BLANK WHEN ZERO.
              10 FILLER           PIC IS X(01).
              10 L-LT-EST         PIC IS X(03).
              10 L-FC-EST         PIC IS X(02).
           05 WR-ENDCOB REDEFINES W-CODIGO.
              10 L-LT-ENDC        PIC IS X(13).
              10 L-FC-ENDC        PIC IS X(40).
              10 FILLER           PIC IS X(01).
              10 L-LT-BAIP        PIC IS X(08).
              10 L-FC-BAIP        PIC IS X(15).
              10 FILLER           PIC IS X(01).
              10 L-LT-CIDP        PIC IS X(13).
              10 L-FC-CIDP        PIC IS X(20).
              10 FILLER           PIC IS X(01).
              10 L-LT-CEPP        PIC IS X(05).
              10 L-FC-CEPP        PIC IS 99999.999      BLANK WHEN ZERO.
              10 FILLER           PIC IS X(01).
              10 L-LT-ESTP        PIC IS X(03).
              10 L-FC-ESTP        PIC IS X(02).
           05 WR-PAISRP REDEFINES W-CODIGO.
              10 L-LT-NPA         PIC IS X(13).
              10 L-FC-NPA         PIC IS X(17).
              10 FILLER REDEFINES L-FC-NPA.
                 15 L-FC-NCP      PIC IS ZZZZZZZ9       BLANK WHEN ZERO.
                 15 FILLER        PIC IS X(01).
                 15 L-FC-SCP      PIC IS X(05).
                 15 FILLER        PIC IS X(01).
                 15 L-FC-ECP      PIC IS X(02).
              10 FILLER           PIC IS X(17).
              10 L-LT-REP         PIC IS X(15).
              10 L-FC-REP         PIC IS Z(04)          BLANK WHEN ZERO.
              10 L-LT-TR1         PIC IS X(03).
              10 L-ET-ABV         PIC IS X(09).
              10 FILLER           PIC IS X(07).
              10 L-LT-ZON         PIC IS X(06).
              10 L-FC-ZON         PIC IS ZZ.
              10 FILLER           PIC IS X(03).
              10 L-LT-SPL         PIC IS X(21).
              10 L-FC-SPL         PIC IS X(03).
              10 FILLER           PIC IS X(02).
              10 L-FC-DTCS        PIC IS X(08).
              10 FILLER           PIC IS X(02).
           05 WR-DTCOMP REDEFINES W-CODIGO.
              10 L-LT-DTM         PIC IS X(13).
              10 L-FC-DTM         PIC IS X(08).
              10 FILLER           PIC IS X(02).
              10 L-LT-VMA         PIC IS X(13).
              10 L-FC-VMA         PIC Z.ZZZ.ZZZ.ZZ9,99  BLANK WHEN ZERO.
              10 FILLER           PIC IS X(03).
              10 L-LT-DTU         PIC IS X(14).
              10 L-FC-DTU         PIC IS X(08).
              10 FILLER           PIC IS X(01).
              10 L-LT-VUL         PIC IS X(13).
              10 L-FC-VUL         PIC Z.ZZZ.ZZZ.ZZ9,99  BLANK WHEN ZERO.
              10 FILLER           PIC IS X(02).
              10 L-LT-DIV         PIC IS X(08).
              10 L-FC-DIV         PIC ZZZZ.ZZZ.ZZ9,99   BLANK WHEN ZERO.
           05 WR-DESTIN REDEFINES W-CODIGO.
              10 L-LT-LOC         PIC IS X(13).
              10 L-FC-LOC         PIC IS ZZ9            BLANK WHEN ZERO.
              10 L-LT-TR2         PIC IS X(03).
              10 L-FT-ABR         PIC IS X(07).
              10 FILLER           PIC IS X(01).
              10 L-LT-AGE         PIC IS X(09).
              10 L-FC-AGE         PIC IS ZZZZ9          BLANK WHEN ZERO.
              10 L-LT-TR3         PIC IS X(03).
              10 L-FT-DES         PIC IS X(30).
              10 FILLER           PIC IS X(02).
              10 L-LT-VEN         PIC IS X(14).
              10 L-FC-CTD         PIC IS ZZ9            BLANK WHEN ZERO.
              10 L-LT-TR4         PIC IS X(03).
              10 L-FT-QTD         PIC IS X(23).
              10 FILLER           PIC IS X(13).
           05 WR-CODCAR REDEFINES W-CODIGO.
              10 L-LT-CAR         PIC IS X(13).
              10 L-FC-CAR         PIC IS Z(02).
              10 FILLER           PIC IS X(04).
              10 L-LT-DPR         PIC IS X(17).
              10 L-FC-DPR         PIC IS Z9             BLANK WHEN ZERO.
              10 FILLER           PIC IS X(10).
              10 L-LT-CXP         PIC IS X(13).
              10 FILLER           PIC IS X(01).
              10 L-FC-CXP         PIC IS X(05).
              10 FILLER           PIC IS X(08).
              10 L-LT-CRE         PIC IS X(16).
              10 L-FC-CRE         PIC Z.ZZZ.ZZZ.ZZ9,99  BLANK WHEN ZERO.
              10 FILLER           PIC IS X(01).
              10 L-LT-GRP         PIC IS X(09).
              10 L-FC-GRP         PIC IS Z(03).
              10 L-LT-TR5         PIC IS X(03).
              10 L-FT-AB1         PIC IS X(07).
              10 FILLER           PIC IS X(02).
      *>-> Redefinição para dados do contato
           05 WR-CONTAT REDEFINES W-CODIGO.
              10 FILLER           PIC IS X(06).
              10 L-FC-NOC         PIC IS X(32).
              10 FILLER           PIC IS X(01).
              10 L-FC-EMC         PIC IS X(54).
              10 FILLER REDEFINES L-FC-EMC.
                 15 FILLER        PIC IS X(47).
                 15 L-LI-INA      PIC IS X(07).
              10 FILLER           PIC IS X(01).
              10 L-FC-SAC         PIC IS X(12).
              10 FILLER           PIC IS X(01).
              10 L-FC-CDC         PIC IS X(25).
      *>-> Redefinição para listagem simplificada
           05 WR-SIMPLI REDEFINES W-CODIGO.
              10 LS-COD           PIC IS ZZZZZZ9.
              10 FILLER           PIC IS X(01).
              10 LS-DES           PIC IS X(29).
              10 FILLER           PIC IS X(01).
              10 LS-TIP           PIC IS X(01).
              10 FILLER           PIC IS X(01).
              10 LS-REP           PIC IS Z(04).
              10 FILLER           PIC IS X(01).
              10 LS-DET0.
                 15 LS-CID0       PIC IS X(23).
                 15 FILLER        PIC IS X(01).
                 15 LS-CEP0       PIC IS 9(05).9(03) BLANK WHEN ZERO.
                 15 FILLER        PIC IS X(01).
                 15 LS-END0       PIC IS X(34).
                 15 FILLER        PIC IS X(01).
                 15 LS-FON0       PIC IS X(14).
                 15 FILLER        PIC IS X(01).
                 15 LS-LOC0       PIC IS Z(03).
              10 LS-DET1   REDEFINES LS-DET0.
                 15 LS-CID1       PIC IS X(23).
                 15 FILLER        PIC IS X(01).
                 15 LS-CEP1       PIC IS 9(05).9(03) BLANK WHEN ZERO.
                 15 FILLER        PIC IS X(01).
                 15 LS-CGC1       PIC IS X(18).
                 15 FILLER        PIC IS X(01).
                 15 LS-IES1       PIC IS X(15).
                 15 FILLER        PIC IS X(01).
                 15 LS-FON1       PIC IS X(14).
                 15 FILLER        PIC IS X(01).
                 15 LS-LOC1       PIC IS Z(03).
              10 LS-DET2   REDEFINES LS-DET0.
                 15 LS-CID2       PIC IS X(23).
                 15 FILLER        PIC IS X(01).
                 15 LS-CEP2       PIC IS 9(05).9(03) BLANK WHEN ZERO.
                 15 FILLER        PIC IS X(01).
                 15 LS-CGC2       PIC IS X(18).
                 15 FILLER        PIC IS X(01).
                 15 LS-IES2       PIC IS X(15).
                 15 FILLER        PIC IS X(01).
                 15 LS-DIV2       PIC IS ZZZZZZZ.ZZ9,99 BLANK WHEN ZERO.
                 15 FILLER        PIC IS X(01).
                 15 LS-LOC2       PIC IS Z(03).
              10 LS-DET3     REDEFINES LS-DET0.
                 15 LS-CID3       PIC IS X(21).
                 15 FILLER        PIC IS X(01).
                 15 LS-CEP3       PIC IS 9(05).9(03) BLANK WHEN ZERO.
                 15 FILLER        PIC IS X(01).
                 15 LS-LIM3       PIC IS X(11).
                 15 FILLER        PIC IS X(01).
                 15 LS-DTUL3.
                    20 LS-DUL3    PIC IS 9(02)          BLANK WHEN ZERO.
                    20 LS-MUL3    PIC IS 9(02)          BLANK WHEN ZERO.
                    20 LS-AUL3    PIC IS 9(02)          BLANK WHEN ZERO.
                    20 FILLER     PIC IS X(02).
                    20 LS-VUL3    PIC IS X(13).
                 15 LS-DTUL4      REDEFINES LS-DTUL3.
                    20 LS-DTU     PIC IS X(08).
                    20 FILLER     PIC IS X(01).
                    20 LS-VUL4    PIC IS X(12).
                 15 FILLER        PIC IS X(01).
                 15 LS-DTMA3.
                    20 LS-DMA3    PIC IS 9(02)          BLANK WHEN ZERO.
                    20 LS-MMA3    PIC IS 9(02)          BLANK WHEN ZERO.
                    20 LS-AMA3    PIC IS 9(02)          BLANK WHEN ZERO.
                    20 FILLER     PIC IS X(02).
                    20 LS-VMA3    PIC IS X(13).
                 15 LS-DTMA4      REDEFINES LS-DTMA3.
                    20 LS-DTM     PIC IS X(08).
                    20 FILLER     PIC IS X(01).
                    20 LS-VMA4    PIC IS X(12).
              10 LS-DET4     REDEFINES LS-DET0.
                 15 LS-CID5       PIC IS X(23).
                 15 FILLER        PIC IS X(01).
                 15 LS-CEP5       PIC IS 9(05).9(03) BLANK WHEN ZERO.
                 15 FILLER        PIC IS X(01).
                 15 LS-FON2       PIC IS X(14).
                 15 FILLER        PIC IS X(01).
                 15 LS-DEV1       PIC IS X(25).
                 15 FILLER        PIC IS X(01).
                 15 LS-VEN        PIC IS X(11).
              10 LS-DET6     REDEFINES LS-DET0.
                 15 LS-CID6       PIC IS X(23).
                 15 FILLER        PIC IS X(01).
                 15 LS-FON6       PIC IS X(12).
                 15 FILLER        PIC IS X(01).
                 15 LS-FAX6       PIC IS X(12).
                 15 FILLER        PIC IS X(06).
                 15 LS-CRE        PIC IS X(12).
                 15 FILLER        PIC IS X(01).
                 15 LS-TOT        PIC IS X(15).
                 15 FILLER        PIC IS X(01).
                 15 LS-GRP6       PIC IS ZZ9.
              10 LS-DET7     REDEFINES LS-DET0.
                 15 LS-CID7       PIC IS X(21).
                 15 FILLER        PIC IS X(01).
                 15 LS-END7       PIC IS X(40).
                 15 FILLER        PIC IS X(01).
                 15 LS-BAI7       PIC IS X(14).
                 15 FILLER        PIC IS X(10).
              10 LS-DET8     REDEFINES LS-DET0.
                 15 LS-CGC8       PIC IS X(18).
                 15 FILLER        PIC IS X(01).
                 15 LS-IES8       PIC IS X(15).
                 15 FILLER        PIC IS X(01).
                 15 LS-CCP8       PIC IS Z(07).
                 15 FILLER        PIC IS X(01).
                 15 LS-DES8       PIC IS X(30).
                 15 FILLER        PIC IS X(14).
      *>-> Redefinição para listagem simplificada
      *>-> Listagem endereço/CNPJ
           05 WR-ENDCNPJ REDEFINES W-CODIGO.
              10 LS-COD5          PIC IS ZZZZZZ9.
              10 FILLER           PIC IS X(01).
              10 LS-DES5          PIC IS X(30).
              10 FILLER           PIC IS X(01).
              10 LS-TIP5          PIC IS X(01).
              10 FILLER           PIC IS X(01).
              10 LS-END5          PIC IS X(37).
              10 FILLER           PIC IS X(01).
              10 LS-CID55         PIC IS X(20).
              10 FILLER           PIC IS X(01).
              10 LS-CGC5          PIC IS X(16).
              10 FILLER           PIC IS X(01).
              10 LS-IES5          PIC IS X(15).
      *>-> Redefinição para listagem simplificada
      *>-> Listagem Dados da conta corrente
           05 WR-DADCCOR REDEFINES W-CODIGO.
              10 LS-COD9          PIC IS ZZZZZZ9.
              10 FILLER           PIC IS X(01).
              10 LS-DES9          PIC IS X(30).
              10 FILLER           PIC IS X(01).
              10 LS-TIP9          PIC IS X(01).
              10 FILLER           PIC IS X(01).
              10 LS-GRP9          PIC IS ZZ9.
              10 FILLER           PIC IS X(01).
              10 LS-CGC9          PIC IS X(18).
              10 FILLER           PIC IS X(01).
              10 LS-FON9          PIC IS X(14).
              10 FILLER           PIC IS X(01).
              10 LS-ENC9          PIC IS X(24).
              10 FILLER           PIC IS X(01).
              10 LS-BCO9          PIC IS 9(03).
              10 FILLER           PIC IS X(01).
              10 LS-HIA9          PIC IS X(06).
              10 FILLER           PIC IS X(01).
              10 LS-CCO9          PIC IS X(17).
      *>-> Redefinição para 1ª linha-End+Cont+Repres+CNPJ+IE+Cond.Pagto
           05 W-REPCID REDEFINES W-CODIGO.
              10 LR-FC-COD        PIC IS ZZZZZZ9.
              10 FILLER           PIC IS X(01).
              10 LR-FC-DES        PIC IS X(31).
              10 FILLER           PIC IS X(09).
              10 LR-FC-TIT        PIC IS X(18).
              10 FILLER           PIC IS X(05).
              10 LR-FC-FON        PIC IS X(14).
              10 FILLER           PIC IS X(03).
              10 LR-FC-CGC        PIC IS X(18).
              10 FILLER           PIC IS X(01).
              10 LR-FC-IES        PIC IS X(15).
              10 FILLER           PIC IS X(01).
              10 LR-FC-CEP        PIC IS 99999.999      BLANK WHEN ZERO.
      *>-> Redefinição para 2ª linha-End+Cont+Repres+CNPJ+IE+Cond.Pagto
           05 W-REPCID1 REDEFINES W-CODIGO.
              10 FILLER           PIC IS X(08).
              10 LR-FC-END        PIC IS X(39).
              10 FILLER           PIC IS X(01).
              10 LR-FC-CID        PIC IS X(20).
              10 FILLER           PIC IS X(01).
              10 LR-FC-EST        PIC IS X(02).
              10 FILLER           PIC IS X(01).
              10 LR-FC-BAI        PIC IS X(15).
              10 FILLER           PIC IS X(01).
              10 LR-FC-FAN        PIC IS X(25).
              10 FILLER           PIC IS X(01).
              10 LR-LOCPAG        PIC IS X(07).
              10 FILLER           PIC IS X(02).
              10 LR-CONPAG        PIC IS X(09).
      *>-> Redefinição para listagem simplificada
           05 WR-ORDCEC REDEFINES W-CODIGO.
              10 LS-CID10         PIC IS X(23).
              10 FILLER           PIC IS X(01).
              10 LS-NEP           PIC IS Z(07).
              10 FILLER           PIC IS X(01).
              10 LS-NEM           PIC IS X(15).
              10 FILLER           PIC IS X(01).
              10 LS-CPS           PIC IS X(15).
              10 FILLER           PIC IS X(69).
      *>-> Redefinição para listagem simplificada
           05 WR-ORDCBD REDEFINES W-CODIGO.
              10 LS-CID11         PIC IS X(23).
              10 FILLER           PIC IS X(01).
              10 LS-DEZ           PIC IS X(32).
              10 FILLER           PIC IS X(01).
              10 LS-DDD           PIC IS X(04).
              10 FILLER           PIC IS X(71).
      *>-> Redefinição para listagem simplificada
           05 WR-ORDEEC REDEFINES W-CODIGO.
              10 LS-COD12         PIC IS ZZZZZZ9.
              10 FILLER           PIC IS X(01).
              10 LS-DES12         PIC IS X(27).
              10 FILLER           PIC IS X(01).
              10 LS-END12         PIC IS X(30).
              10 FILLER           PIC IS X(01).
              10 LS-CEP12         PIC IS X(10).
              10 FILLER           PIC IS X(01).
              10 LS-CID12         PIC IS X(20).
              10 FILLER           PIC IS X(01).
              10 LS-FON12         PIC IS X(12).
              10 FILLER           PIC IS X(01).
              10 LS-FAX12         PIC IS X(12).
              10 LS-NEM12         PIC IS X(07).
              10 FILLER           PIC IS X(01).
      *>-> Redefinição para listagem simplificada
           05 WR-ORDECC REDEFINES W-CODIGO.
              10 LS-COD13         PIC IS ZZZZZZ9.
              10 FILLER           PIC IS X(01).
              10 LS-DES13         PIC IS X(29).
              10 FILLER           PIC IS X(01).
              10 LS-END13         PIC IS X(30).
              10 FILLER           PIC IS X(01).
              10 LS-CEP13         PIC IS X(10).
              10 FILLER           PIC IS X(01).
              10 LS-CID13         PIC IS X(20).
              10 FILLER           PIC IS X(01).
              10 LS-FON13         PIC IS X(12).
              10 FILLER           PIC IS X(01).
              10 LS-FAX13         PIC IS X(12).
              10 FILLER           PIC IS X(06).
      *>-> Redefinição para listagem simplificada
           05 WR-ORDCAL REDEFINES W-CODIGO.
              10 LS-CAL19         PIC IS X(12).
              10 FILLER           PIC IS X(01).
              10 LS-DES19         PIC IS X(32).
              10 FILLER           PIC IS X(01).
              10 LS-END19         PIC IS X(40).
              10 FILLER           PIC IS X(01).
              10 LS-FON19         PIC IS X(12).
              10 FILLER           PIC IS X(01).
              10 LS-GRP19         PIC IS ZZ9.
              10 FILLER           PIC IS X(01).
              10 LS-ABR19         PIC IS X(07).
              10 FILLER           PIC IS X(01).
              10 LS-DTU19         PIC IS X(08).
              10 FILLER           PIC IS X(01).
              10 LS-VUL19         PIC IS X(11).
      *>-> Redefinição para listar o total de recursos por espécie
           05 L-TOTREA REDEFINES W-CODIGO.
              10 FILLER           PIC IS X(76).
              10 L-LT-TOT         PIC IS X(08).
              10 FILLER           PIC IS X(01).
              10 L-LT-ERC         PIC IS X(19).
              10 FILLER           PIC IS X(01).
              10 L-QTDERC         PIC IS Z(07).
              10 FILLER           PIC IS X(18).
           05 FILLER              PIC IS X(19650).
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Linha detalhe listagem simplificada                                                                      <-<*
      *>-> Opção Listar: 11-Fone/Prim/Ult.Fat/End/Enc.Coml.                                                         <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       01  WL-DETALHE.
           05 WL-COD              PIC IS ZZZZZZ9.
           05 FILLER              PIC IS X(01).
           05 WL-DES              PIC IS X(30).
           05 FILLER              PIC IS X(01).
           05 WL-TIP              PIC IS X(01).
           05 FILLER              PIC IS X(01).
           05 WL-FON              PIC IS X(12).
           05 FILLER              PIC IS X(01).
           05 WL-ZON              PIC IS Z(02).
           05 FILLER              PIC IS X(01).
           05 WL-DIV              PIC IS X(14).
           05 WL-REPRE REDEFINES WL-DIV.
              10 WL-REP           PIC IS Z(04).
              10 FILLER           PIC IS X(01).
              10 WL-ABR           PIC IS X(09).
           05 FILLER              PIC IS X(01).
           05 WL-MEP              PIC IS 99/.
           05 WL-ANP              PIC IS 99.
           05 FILLER              PIC IS X(01).
           05 WL-MEU              PIC IS 99/.
           05 WL-ANU              PIC IS 99.
           05 FILLER              PIC IS X(01).
           05 WL-CRE              PIC IS X(11).
           05 WL-GRUPO REDEFINES WL-CRE.
              10 WL-GRP           PIC IS Z(03).
              10 FILLER           PIC IS X(01).
              10 WL-ABG           PIC IS X(07).
           05 FILLER              PIC IS X(01).
           05 WL-END              PIC IS X(36).
      *>-> 2ª Linha detalhe listagem simplificada.......................................................................
       01  WL-LINHA2.
           05 FILLER              PIC IS X(08).
           05 WL-TIT              PIC IS X(25).
           05 FILLER              PIC IS X(24).
           05 WL-LPR              PIC IS X(04).
           05 WL-CPR              PIC IS Z(04).
           05 FILLER              PIC IS X(01).
           05 WL-LVE              PIC IS X(03).
           05 WL-CVD              PIC IS Z(04).
           05 FILLER              PIC IS X(01).
           05 WL-LGE              PIC IS X(06).
           05 WL-HOL              PIC IS Z(04).
           05 FILLER              PIC IS X(01).
           05 WL-DHO              PIC IS X(12).
           05 FILLER              PIC IS X(01).
           05 WL-BAI              PIC IS X(13).
           05 FILLER              PIC IS X(01).
           05 WL-TOT              PIC IS Z.ZZZ.ZZZ.ZZZ.ZZ9,99.
           05 WL-CIDAD REDEFINES WL-TOT.
              10 WL-CID           PIC IS X(17).
              10 FILLER           PIC IS X(01).
              10 WL-EST           PIC IS X(02).
      *>-> Linha para listagem da opção "Código/Razão social/Tipo (C/F)/Cidade/UF/Telefone".............................
       01  LC-DETALHE.
           05 LC-FCAD-COD         PIC IS Z(07)    VALUE IS ZEROS.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-DES         PIC IS X(32)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-TIP         PIC IS X(01)    VALUE IS SPACES.
           05 FILLER              PIC IS X(02)    VALUE IS SPACES.
           05 LC-FCAD-CID         PIC IS X(20)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-EST         PIC IS X(02)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-FON         PIC IS X(14)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-TIT         PIC IS X(25)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-GRP         PIC IS Z(03)    VALUE IS ZEROS.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FTAB-ABR003      PIC IS X(07)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-VMA         PIC IS X(13)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-TOTFAT           PIC IS X(15)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LC-FCAD-DTU         PIC IS X(08)    VALUE IS SPACES.
      *>-> Complemento da listagem "LIMCID-EBC".Por esta listagem ser...................................................
      *>-> ...de 160 caracteres (compactado a 20 CPI) foi feito este
      *>-> ...complemento, porém utiliza 132 caracteres do "W-CODIGO"
       01  W-LIM-EBC.
           05 W-LIM-FON           PIC IS X(12)    VALUE IS ZEROS.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 W-LIM-LOC           PIC IS Z(03)    VALUE IS ZEROS.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 W-LIM-DTU           PIC IS X(08)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01).
           05 W-LIM-VUL           PIC IS X(11).
      *>-> Linha de "linhas de produto" da Listagem Simplificada........................................................
       01  LP-LISPRO.
           05 FILLER              PIC IS X(26)    VALUE IS SPACES.
           05 LP-CODGRU           PIC IS Z(04)    VALUE IS ZEROS.
           05 FILLER              PIC IS X(02)    VALUE IS SPACES.
           05 LP-CODSUB           PIC IS Z(04)    VALUE IS ZEROS.
           05 FILLER              PIC IS X(05)    VALUE IS SPACES.
           05 LP-DESGRU           PIC IS X(28)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LP-CODPRO           PIC IS Z(07)    VALUE IS ZEROS.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LP-DESPRO           PIC IS X(30)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LP-QTDPOT           PIC IS X(11)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01)    VALUE IS SPACES.
           05 LP-QTDCPM           PIC IS X(11)    VALUE IS SPACES.
      *>-> Linha Detalhe - Itens de serviço da nota.....................................................................
       01  WL-ITENS.
           05 FILLER              PIC IS X(15).
           05 WL-ESP              PIC IS X(22).
           05 FILLER REDEFINES WL-ESP.
              10 WL-DATEMI.
                 15 WL-DEM        PIC IS 99/.
                 15 WL-MEM        PIC IS 99/.
                 15 WL-AEM        PIC IS 99.
              10 FILLER           PIC IS X(01).
              10 WL-LIQ           PIC IS X(13).
           05 FILLER              PIC IS X(01).
           05 WL-CSE              PIC IS Z(03).
           05 FILLER              PIC IS X(01).
           05 WL-SER              PIC IS X(60).
           05 FILLER              PIC IS X(01).
           05 WL-FIX              PIC IS X(01).
           05 FILLER              PIC IS X(01).
           05 WL-VAL              PIC IS X(13).
           05 FILLER              PIC IS X(01).
           05 WL-VDE              PIC IS X(13).
      *>-> Linha Detalhe - Agendamento de pagamento.....................................................................
       01  WL-AGENDA.
           05 FILLER              PIC IS X(67)    VALUE IS SPACES.
           05 FILLER              PIC IS X(21)    VALUE IS "*** Agendamento para ".
           05 WL-AG-PAG           PIC IS X(05)    VALUE IS SPACES.
           05 WL-LITPG1           PIC IS X(12)    VALUE IS SPACES.
              88 LITPG1-VAL                       VALUE  ":    Valor  ".
              88 LITPG1-IND                       VALUE  ":   Indice  ".
           05 WL-AG-VAG           PIC IS X(13).
           05 FILLER              PIC IS X(01).
           05 WL-AG-BAR           PIC IS X(01)    VALUE IS SPACES.
           05 WL-AG-TIA           PIC IS 99       VALUE IS ZEROS
                                                        BLANK WHEN ZERO.
           05 WL-AG-HIF           PIC IS X(01)    VALUE IS SPACES.
           05 WL-AG-IND           PIC IS X(09)    VALUE IS SPACES.
           05 FILLER              PIC IS X(01).
           05 WL-AG-AFV           PIC IS X(01)    VALUE IS SPACES.
      *>-> Dados de liberação...........................................................................................
       01  LB-DADLIB                              VALUE IS SPACES.
           05 LB-FB-COD           PIC IS ZZZZZZ9.
           05 FILLER              PIC IS X(01).
           05 LB-FB-DES           PIC IS X(29).
           05 FILLER              PIC IS X(01).
           05 LB-FB-TIP           PIC IS X(01).
           05 FILLER              PIC IS X(01).
           05 LB-FB-CID           PIC IS X(23).
           05 FILLER              PIC IS X(01).
           05 LB-FB-REP           PIC IS Z(04).
           05 FILLER              PIC IS X(01).
           05 LB-FB-SEQ           PIC IS ZZ9.
           05 FILLER              PIC IS X(01).
           05 LB-FB-SIT           PIC IS X(03).
           05 FILLER              PIC IS X(01).
           05 LB-FB-NIL           PIC IS Z9 .
           05 FILLER              PIC IS X(01).
           05 LB-FB-NUS           PIC IS ZZ9.
           05 FILLER              PIC IS X(01).
           05 LB-FB-NUT           PIC IS Z9 .
           05 FILLER              PIC IS X(01).
           05 LB-FB-SIG           PIC IS X(03).
           05 FILLER              PIC IS X(01).
           05 LB-FB-DKM           PIC IS ZZZ9.
           05 FILLER              PIC IS X(01).
           05 LB-FB-CDL           PIC IS X(03).
           05 FILLER              PIC IS X(01).
           05 LB-FB-TSR           PIC IS X(15).
           05 FILLER              PIC IS X(01).
           05 LB-FB-PLI           PIC IS X(03).
           05 FILLER              PIC IS X(01).
           05 LB-FB-LUR           PIC IS X(03).
           05 FILLER              PIC IS X(01).
           05 LB-FB-TV32          PIC IS X(04).
           05 FILLER              PIC IS X(01).
           05 LB-FB-DIL           PIC IS 99/.
           05 LB-FB-MEL           PIC IS 99/.
           05 LB-FB-ANL           PIC IS 99.
           05 FILLER              PIC IS X(01).
           05 LB-FB-FON           PIC IS X(12).
           05 FILLER              PIC IS X(01).
           05 LB-FB-GRP           PIC IS Z(02).
           05 FILLER              PIC IS X(01).
           05 LB-FB-CON           PIC IS X(02).
           05 FILLER              PIC IS X(01).
           05 LB-FB-BAT           PIC IS X(03).
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aqui estão os parâmetros que são passados nos programas                                                  <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       LINKAGE                    SECTION.
      *>-> Variáveis passadas como parâmetros em todos sistemas
           COPY                   PARAMSIS.CPY.
      *>-> Parâmetros do programa de listagens/gráficos de clientes/fornecedores
           COPY                   SRICADWF.CPY.
      *>--------------------------------------------------------------------------------------------------------------<*
       PROCEDURE                  DIVISION USING W-PARSIS, WSRICAD-CAMPOS.
      *>-> Rotinas gerais padrões de usos diversos
           COPY                   ROTGERAL.CPY.
      *>--------------------------------------------------------------------------------------------------------------<*
       000-INICIO.
      *>-> Ajusta literais
           PERFORM                000-INICIO-AJULIT.
      *>-> Se não for função de fechamento dos arquivos
           IF NOT WSRICAD-FUN-FECARQ
      *>-> Abre os arquivos
              PERFORM             ABR-INI THRU ABR-FIM,
      *>-> Busca a estrutura do plano de contas
              PERFORM             SRIBEP-BUSDEP-CPLANO,
           END-IF.
      *>-> Inicializa os parâmetros de saída
           PERFORM                PSUB-INI-PARSAI.
      *>-> Avalia a função
           EVALUATE               TRUE,
      *>-> Função - Listagem detalhada de clientes/fornecedores
              WHEN WSRICAD-FUN-LISCAD
                 PERFORM          PLIS-INICIO,
      *>-> Função - Listagem simplificada de clientes/fornecedores
              WHEN WSRICAD-FUN-LISSIM
                 PERFORM          PLSI-INICIO,
      *>-> Função - Correção de limite de crédito
              WHEN WSRICAD-FUN-CORLIM
                 PERFORM          PCLC-INICIO,
      *>-> Função - Geração de código alternativo
              WHEN WSRICAD-FUN-GERCAL
                 PERFORM          PGCA-INICIO,
      *>-> Função - Consistência de Inscrição Estadual
              WHEN WSRICAD-FUN-CONIES
                 PERFORM          PCIE-INICIO,
      *>-> Função - Gráfico de clientes/fornecedores
              WHEN WSRICAD-FUN-GRACAD
                 PERFORM          PGCF-INICIO,
      *>-> Função - Visualização via Google Maps
              WHEN WSRICAD-FUN-VISGMP
                 PERFORM          PVGM-INICIO,
      *>-> Função - Listagem da validade das licenças
              WHEN WSRICAD-FUN-LISVLI
                 PERFORM          PLVL-INICIO,
      *>-> Função - Fechamento dos arquivos
              WHEN WSRICAD-FUN-FECARQ
      *>-> Inicializa os parâmetros de entrada
                 PERFORM          PSUB-INI-PARENT,
      *>-> Finaliza fechando arquivos
                 GO TO            PGE-FECARQ,
           END-EVALUATE.
      *>-> Inicializa os parâmetros de entrada
           PERFORM                PSUB-INI-PARENT.
      *>-> Volta ao programa chamador sem fechar arquivos
           GO TO                  LOAD-SEL.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Ajusta literais..............................................................................................
       000-INICIO-AJULIT.
      *>-> Se empresa é sindicato
           IF MK-EMSSIM
              MOVE "11-Base Territorial     " TO WT-LT-GRPCLA(265:24),
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->          L I S T A G E M   D E T A L H A D A   D E   C L I E N T E S / F O R N E C E D O R E S           <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
      LISTAGEM-DETALHADA         SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Listagem detalhada de clientes/fornecedores..................................................................
       PLIS-INICIO.
      *>-> Aceita seleção para a listagem detalhada
           PERFORM                PLIS-ACESEL.
      *>-> Se não confirmou
           IF NOT CNF-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Lista os cadastros
           PERFORM                PRCL-LISCAD.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção para a listagem detalhada.....................................................................
       PLIS-ACESEL.
      *>-> Inicializa índice da janela
           MOVE    1         TO   W-INDJAN.
      *>-> Presume que não confirmou
           SET     CNF-NAO   TO   TRUE.
      *>-> Laço de navegação entre as janelas
           PERFORM                UNTIL EXIT
      *>-> Avalia a janela que deve ser aceita
              EVALUATE            W-INDJAN,
                 WHEN 1
      *>-> Aceita seleção para as listagens
                    PERFORM       PSLI-ACESEL,
                 WHEN 2
      *>-> Aceita seleção padrão de clientes/fornecedores
                    PERFORM       PSLI-SELCAD,
                 WHEN 3
      *>-> Rotina geral de confirmação
                    PERFORM       ROG-CONFIRMA,
      *>-> Se confirmou ou abortou
                    IF CNF-SIM OR CNF-NAO
                       EXIT       PERFORM,
                    END-IF,
                 WHEN OTHER
                    EXIT          PERFORM,
              END-EVALUATE,
              IF JAN-AVANCA
                 ADD 1       TO   W-INDJAN,
              ELSE,
                 SUBTRACT 1  FROM W-INDJAN,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                             LISTAGEM SIMPLIFICADA DE CLIENTES/FORNECEDORES                               <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       LISTAGEM-SIMPLIFICADA      SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Listagem simplificada de clientes/fornecedores...............................................................
       PLSI-INICIO.
      *>-> Inicializa variáveis utilizadas na listagem simplificada
           PERFORM                PLSI-INI-WLSI-CAMPOS.
      *>-> Aceita seleção para a listagem simplificada
           PERFORM                PLSI-ACESEL.
      *>-> Se não confirmou
           IF NOT CNF-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Lista os cadastros
           PERFORM                PRCL-LISCAD.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção para a listagem simplificada..................................................................
       PLSI-ACESEL.
      *>-> Inicializa índice da janela
           MOVE    1         TO   W-INDJAN.
      *>-> Presume que não confirmou
           SET     CNF-NAO   TO   TRUE.
      *>-> Laço de navegação entre as janelas
           PERFORM                UNTIL EXIT
      *>-> Avalia a janela que deve ser aceita
              EVALUATE            W-INDJAN,
                 WHEN 1
      *>-> Aceita seleção para as listagens
                    PERFORM       PSLI-ACESEL,
                 WHEN 2
      *>-> Aceita seleção padrão de clientes/fornecedores
                    PERFORM       PSLI-SELCAD,
                 WHEN 3
      *>-> Se selecionou para listar dados do limite de crédito/total do faturamento OU
      *>-> ...Código/Razão social/Tipo (C/F)/Cidade/UF/Telefone
                    IF WSLI-LIMCID-LCR OR WSLI-LIMCID-CRT
      *>-> Aceita janela de Seleção do período para apuração do total faturado
                       PERFORM    PDAT-ACCEPT,
                    END-IF,
                 WHEN 4
      *>-> Se não selecionou para listar sem nenhum dado adicional e tem contratado o módulo AUE e existe registros no
      *>-> ...arquivo de notas de serviço
                    IF NOT WSLI-LIMCID-SEM AND MK-MCOSIM(10)
      *>-> Move o nome para exibir na janela de seleção (Título)
                       MOVE "Seleção - Listagem simplificada" TO WSRIVSE-WINTIT,
      *>-> Executa a rotina de seleção dos serviços/despesas e carga dos Grid's (Existentes/Inexistentes)
                       PERFORM    SRIVSE-SELSER,
      *>-> Se deve seguir na seleção
                       IF WSRIVSE-SEQSEL-SIM
      *>-> Se não confirmou aceitação
                          IF WSRIVSE-CONACE-NAO
                             SET CNF-NAO TO TRUE,
                          ELSE,
      *>-> Carrega as variáveis utilizadas na listagem simplificada
                             PERFORM PLSI-CAR-WLSI-CAMPOS,
                          END-IF,
                          EXIT    PERFORM,
                       END-IF,
                       SET JAN-VOLTAR TO TRUE,
                    END-IF,
                 WHEN 5
      *>-> Rotina geral de confirmação
                    PERFORM       ROG-CONFIRMA,
      *>-> Se confirmou ou abortou
                    IF CNF-SIM OR CNF-NAO
                       EXIT       PERFORM,
                    END-IF,
                 WHEN OTHER
                    EXIT          PERFORM,
              END-EVALUATE,
              IF JAN-AVANCA
                 ADD 1       TO   W-INDJAN,
              ELSE,
                 SUBTRACT 1  FROM W-INDJAN,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Inicializa variáveis utilizadas na listagem simplificada.....................................................
       PLSI-INI-WLSI-CAMPOS.
      *>-> Indica que não testa itens de serviço (Vindo do SRIVSE)
           SET     TSTISE-NAO TO  TRUE.
      *>-> Indica que não lista itens de serviço (Vindo do SRIVSE)
           SET     LSTISE-NAO TO  TRUE.
      *>-> Período do movimento (Vindo do SRIVSE)
           MOVE    LOW-VALUES TO  W-PERMOV.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Carrega as variáveis utilizadas na listagem simplificada.....................................................
       PLSI-CAR-WLSI-CAMPOS.
           SET     CNF-SIM   TO   TRUE.
      *>-> Testa itens de serviço (Vindo do SRIVSE)
           IF WSRIVSE-TSTISE-SIM
              SET  TSTISE-SIM TO  TRUE,
           ELSE,
              SET  TSTISE-NAO TO  TRUE,
           END-IF.
      *>-> Lista itens de serviço (Vindo do SRIVSE)
           IF WSRIVSE-LSTISE-SIM
              SET  LSTISE-SIM TO  TRUE,
           ELSE,
              SET  LSTISE-NAO TO  TRUE,
           END-IF.
      *>-> Período do movimento (Vindo do SRIVSE)
           MOVE    WSRIVSE-PERMOV TO W-PERMOV.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                      S  E  L  E  Ç  Ã  O     D  A  S     L  I  S  T  A  G  E  N  S                       <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       SELECAO-LISTAGENS          SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção para as listagens.............................................................................
       PSLI-ACESEL.
      *>-> Aceita janela de Seleção para as listagens
           PERFORM                PSLI-ACCEPT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Inicio PSLI-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para personalização do campo - Janela de seleção para as listagens
       PSLI-CONFIG-SLI.
           EVALUATE               TRUE,
      *>-> Se for listagem detalhada
              WHEN WSRICAD-FUN-LISCAD
                 MOVE "Seleção - Listagem de cadastros" TO WTE-WIN-TIT,
      *>-> Se for listagem simplificada
              WHEN WSRICAD-FUN-LISSIM
                 MOVE "Seleção - Listagem simplificada de cadastros" TO WTE-WIN-TIT,
           END-EVALUATE.
      *>-> Se não estiver no módulo de automação de escritórios
           IF NOT CODSIS-AUE
      *>-> Inicializa o número de linhas adicionais
              MOVE ZEROS     TO   WTE-WIN-LINADI,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para inicialização da janela - Janela de seleção para as listagens
       PSLI-INICIALIZA.
      *>-> Testa se habilita os grupos pro classificação
           PERFORM                PSLI-HABDES-GRPCLA.
      *>-> Testa se habilita a ordem do grupo
           PERFORM                PSLI-HABDES-ORDGRP.
      *>-> Testa se habilita subgrupo
           PERFORM                PSLI-HABDES-ORDSGR.
      *>-> Testa se habilita filtro por e-mail
           PERFORM                PSLI-HABDES-FILECC.
      *>-> Testa se habilita os dias de visita
           PERFORM                PSLI-HABDES-DIAVIS.
      *>-> Habilita/desabilita dia/mês aniversário inicial/final
           PERFORM                PSLI-HABDES-DIAMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Move dados da working para a interface - Seleção para as listagens
       PSLI-CALLBACK-MOVDAD.
      *>-> Dia/mês aniversário inicial
           MOVE    WSLI-INIMES TO WSLI-AUXMES.
           MOVE    WSLI-INIDIA TO WSLI-AUXDIA.
           MOVE    WSLI-DIMAUX TO JSLI-EF-WSLI-DIMINI.
      *>-> Dia/mês aniversário final
           MOVE    WSLI-FINMES TO WSLI-AUXMES.
           MOVE    WSLI-FINDIA TO WSLI-AUXDIA.
           MOVE    WSLI-DIMAUX TO JSLI-EF-WSLI-DIMFIN.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Move dados da interface para a working - Seleção para as listagens
       PSLI-CALLBACK-RETDAD.
      *>-> Dia/mês aniversário inicial
           MOVE    JSLI-EF-WSLI-DIMINI TO WSLI-DIMAUX.
           MOVE    WSLI-AUXMES TO WSLI-INIMES.
           MOVE    WSLI-AUXDIA TO WSLI-INIDIA.
      *>-> Dia/mês aniversário final
           MOVE    JSLI-EF-WSLI-DIMFIN TO WSLI-DIMAUX.
           MOVE    WSLI-AUXMES TO WSLI-FINMES.
           MOVE    WSLI-AUXDIA TO WSLI-FINDIA.
      *>-> Descrição da versão do cliente
           MOVE    JSLI-CO-WSLI-VERCLI-DES TO WSLI-VERCLID-X.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para personalização do campo - Combo-box
       PSLI-CONFIG-WSLI-LIMCID.
      *>-> Se o cliente for Rech Informática Ltda
           IF MK-RILSIM
              MOVE W-LT-LIMCID TO WTE-COM-OPC,
           ELSE,
      *>-> Obs: Quando aumentar o grupo não esquecer de descontar a opção "Dados para liberação" (P/uso interno da Rech)
              MOVE W-LT-LIMCID(1:714) TO WTE-COM-OPC,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Combo-box
       PSLI-CRIA-WSLI-LIMCID.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Lista observações restritas
       PSLI-CRIA-WSLI-LISORC.
      *>-> Se usuário acessa observações restritas
           IF MK-USU-ORCCAL OR MK-USU-ORCCON
      *>-> Indica que deve criar o campo
              SET  WTEG-ACC-CRI-SIM TO TRUE,
           ELSE,
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para personalização do campo - Combo-box
       PSLI-CONFIG-WSLI-GRPCLA.
      *>-> Se não for ordem de representante
           IF NOT WSLCADTAB-ORDCHR
              MOVE WT-LT-GRPCLA   TO WTE-COM-OPC,
           ELSE,
      *>-> Montando a lista deixando de fora as opções 6-Preposto, 7-Vendedor e 8-Repres/Preposto/Vend.
              MOVE WT-LT-GRPCLA(1:144) TO WTE-COM-OPC,
              MOVE WT-LT-GRPCLA(217:96) TO WTE-COM-OPC(145:),
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Salto de linha
       PSLI-CRIA-WSLI-SALTO.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Cliente com e-mail
       PSLI-CRIA-WSLI-FILECC.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Dias de visita
       PSLI-CRIA-WSLI-DIAVIS.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Listar somente CNPJ repetidos
       PSLI-CRIA-WSLI-IMPREP.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Listar somente isentos de ICMS
       PSLI-CRIA-WSLI-LSIICM.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Código da lista de preços
       PSLI-CRIA-WSLI-LISPRC.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Descrição da lista de preços
       PSLI-CRIA-DESLPM.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Combo-box
       PSLI-CRIA-WSLI-IDECAD.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Listar linhas de produto
       PSLI-CRIA-WSLI-LISPRO.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Limite de capital social
       PSLI-CRIA-WSLI-LIMCAP.
      *>-> Se empresa é sindicato
           IF MK-EMSSIM
      *>-> Indica que deve criar o campo
              SET  WTEG-ACC-CRI-SIM TO TRUE,
           ELSE,
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Tipo de cadastro
       PSLI-CRIA-WSLI-TIPCAD.
      *>-> Se empresa é sindicato
           IF MK-EMSSIM
      *>-> Indica que deve criar o campo
              SET  WTEG-ACC-CRI-SIM TO TRUE,
           ELSE,
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para personalização do campo - Versão do cliente (RIL)
       PSLI-CONFIG-WSLI-VERCLI.
      *>-> Abre arquivo INI
           MOVE    "F:\SIGER\SIGER.INI" TO WSROINF-NOMARQ.
           PERFORM                SROINF-ABRARQ.
      *>-> Opção padrão
           MOVE    1         TO   WTE-COM-ALT.
           MOVE    "01-Todas" TO  WTE-COM-OPC.
      *>-> Se não conseguiu abrir o arquivo
           IF WSROINF-RETERR
              MOVE "Não foi possível obter as versões do %1!" TO WME-LIT,
              MOVE W78-LITSIG TO  WME-SUB(1),
              PERFORM             EXIBE-MENSAGEM,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Inicia a enumeração de sessões
           PERFORM                SROINF-ENUSEC-INI.
      *>-> Loop de leitura das versões
           PERFORM                UNTIL EXIT
      *>-> Próxima seção enumerada
              PERFORM             SROINF-ENUSEC-PRX,
      *>-> Se chegou ao fim das seções
              IF WSROINF-RETERR
                 EXIT             PERFORM,
              END-IF,
      *>-> Se não for uma sessão de versão
              IF NOT WSROINF-NOMSEC(1:7) IS EQUAL TO "VERSAO_"
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Incrementa o número de opções da combo
              ADD  1         TO   WTE-COM-ALT,
      *>-> Calcula o offset da opção
              COMPUTE       W-IDV = 10 * WTE-COM-ALT - 9,
      *>-> Monta a opção da combo
              MOVE WTE-COM-ALT TO W-NUI02,
              MOVE W-NUI02   TO   WTE-COM-OPC(W-IDV:2),
              MOVE "-"       TO   WTE-COM-OPC(W-IDV + 2:1),
              MOVE WSROINF-NOMSEC(8:) TO WTE-COM-OPC(W-IDV + 3:8),
           END-PERFORM.
      *>-> Fecha o arquivo
           PERFORM                SROINF-FECARQ.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Versão do cliente (RIL)
       PSLI-CRIA-WSLI-VERCLI.
      *>-> Se o cliente for Rech Informática Ltda
           IF MK-RILSIM
      *>-> Indica que deve criar o campo
              SET  WTEG-ACC-CRI-SIM TO TRUE,
           ELSE,
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de criação condicionada de campo - Botão <Certificações>
       PSLI-CRIA-CQL.
      *>-> Se estiver no módulo de automação de escritórios
           IF CODSIS-AUE
      *>-> Indica que deve criar o campo
              SET  WTEG-ACC-CRI-SIM TO TRUE,
           ELSE,
      *>-> Indica que não deve criar o campo
              SET  WTEG-ACC-CRI-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de alteração de campo - Listar
       PSLI-ALTCAM-WSLI-LIMCID.
      *>-> Testa se habilita os dias de visita
           PERFORM                PSLI-HABDES-DIAVIS.
      *>-> Testa se habilita filtro por e-mail
           PERFORM                PSLI-HABDES-FILECC.
      *>-> Testa se habilita os grupos pro classificação
           PERFORM                PSLI-HABDES-GRPCLA.
      *>-> Testa se habilita a ordem do grupo
           PERFORM                PSLI-HABDES-ORDGRP.
      *>-> Testa se habil/desab subgrupo e troca literais
           PERFORM                PSLI-HABDES-ORDSGR.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de alteração de campo - Lista observações/e-mail
       PSLI-ALTCAM-WSLI-OBSERV.
      *>-> Habilita/desabilita lista observações restrita
           PERFORM                PSLI-HABDES-LISORC.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de alteração de campo - Listar contatos de cliente/fornecedor
       PSLI-ALTCAM-WSLI-LISCCF.
      *>-> Habilita/desabilita dia/mês aniversário inicial/final
           PERFORM                PSLI-HABDES-DIAMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de alteração de campo - Grupo de classificação
       PSLI-ALTCAM-WSLI-GRPCLA.
      *>-> Testa se habilita a ordem do grupo
           PERFORM                PSLI-HABDES-ORDGRP.
      *>-> Testa se habil/desab subgrupo e troca literais
           PERFORM                PSLI-HABDES-ORDSGR.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de saída de campo - Lista observações/e-mail
       PSLI-SAICAM-WSLI-OBSERV.
      *>-> Presume que não houve erro de validação
           SET     VAL-ERRNAO TO  TRUE.
      *>-> Habilita/desabilita lista observações restrita
           PERFORM                PSLI-HABDES-LISORC.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de saída de campo - Dia/mês inicial
       PSLI-SAICAM-WSLI-DIMINI.
      *>-> Presume que não houve erro de validação
           SET VAL-ERRNAO TO TRUE.
      *>-> Valida o campo de dia/mês aniversário inicial/final
           PERFORM                PSLI-VALIDA-DIAMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de saída de campo - Dia/mês final
       PSLI-SAICAM-WSLI-DIMFIN.
      *>-> Presume que não houve erro de validação
           SET VAL-ERRNAO TO TRUE.
      *>-> Valida o campo de dia/mês aniversário inicial/final
           PERFORM                PSLI-VALIDA-DIAMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de saída de campo - Grupo de classificação
       PSLI-SAICAM-WSLI-GRPCLA.
      *>-> Presume que não houve erro de validação
           SET     VAL-ERRNAO TO  TRUE.
      *>-> Se for ordem do grupo de classificação por código ou não classifica
           IF WSLI-ORDGRP-COD OR WSLI-GRPCLA-NAO
              SET  WSLI-ORDGRP-COD TO TRUE,
           ELSE,
              SET  WSLI-ORDGRP-ALF TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de saída de campo - Código da lista de preços
       PSLI-SAICAM-WSLI-LISPRC.
      *>-> Presume que não houve erro de validação
           SET     VAL-ERRNAO TO  TRUE.
      *>-> Se não informou lista de preços (deve listar todas)
           IF WSLI-LISPRC IS EQUAL TO ZEROS
              MOVE "TODOS"   TO   JSLI-EF-DESLPM,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Limpa a descrição da lista de preços
           MOVE    SPACES    TO   JSLI-EF-DESLPM.
           MOVE    WSLI-LISPRC TO NLPM-COD.
      *>-> Se deve validar
           IF VALIDA-SIM
      *>-> Faz a leitura da lista sem bloqueio, exibindo mensagem
              MOVE "READ NLPMES KEY NLPM-CHA IGNORE LOCK EXBMSG" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
           ELSE,
      *>-> Faz a leitura da lista sem bloqueio
              MOVE "READ NLPMES KEY NLPM-CHA IGNORE LOCK" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
           END-IF.
      *>-> Se não leu corretamente
           IF NOT FS-LPM-OK
      *>-> Se deve validar
              IF VALIDA-SIM
      *>-> Inicializa o código da lista de preços
                 MOVE ZEROS  TO   WSLI-LISPRC,
      *>-> Indica que houve erro de validação
                 SET VAL-ERRSIM   TO TRUE,
              END-IF,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Move a descrição da lista de preços
           MOVE    NLPM-DES  TO   JSLI-EF-DESLPM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de pós-browse - Código da lista de preços
       PSLI-POSBRW-WSLI-LISPRC.
      *>-> Move valor aceito para o campo
           MOVE    WSRPLPM-RET-COD TO WSLI-LISPRC.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de clique do mouse - Botão <Certificações>
       PSLI-CLIQUE-CQL.
      *>-> Janela de seleção das certificações do cadastro para listagem
           PERFORM                PSLI-SELCQL.
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Fim PSLI-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Testa se habilita os grupos de classificação.................................................................
       PSLI-HABDES-GRPCLA.
      *>-> Se deve listar Cidade/Empregados/Capital Social ou deve listar Cidade/Base Territorial/DDD
           IF WSRICAD-FUN-LISSIM AND (WSLI-LIMCID-CEC OR WSLI-LIMCID-CBD)
      *>-> Não classificar
              SET  WSLI-GRPCLA-NAO TO  TRUE,
              SET  WSLI-SGRCLA-NAO TO  TRUE,
              SET  WSLI-OBSERV-NAO TO  TRUE,
              SET  WSLI-LISCCF-NAO TO  TRUE,
              MOVE ZEROS     TO   WSLI-INIDIA, WSLI-INIMES,
              MOVE 31        TO   WSLI-FINDIA,
              MOVE 12        TO   WSLI-FINMES,
              MOVE JSLI-CO-WSLI-GRPCLA-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
              MOVE JSLI-CO-WSLI-OBSERV-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
              MOVE JSLI-CO-WSLI-LISCCF-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
              MOVE JSLI-EF-WSLI-DIMINI-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
              MOVE JSLI-EF-WSLI-DIMFIN-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
           ELSE,
              MOVE JSLI-CO-WSLI-GRPCLA-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
              MOVE JSLI-CO-WSLI-OBSERV-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
              MOVE JSLI-CO-WSLI-LISCCF-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
              MOVE JSLI-EF-WSLI-DIMINI-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
              MOVE JSLI-EF-WSLI-DIMFIN-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
           END-IF.
      *>-> Habilita/desabilita lista observações restrita
           PERFORM                PSLI-HABDES-LISORC.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Habilita/desabilita lista observações restritas..............................................................
       PSLI-HABDES-LISORC.
      *>-> Habilita o campo lista observações restritas
           MOVE    JSLI-CB-WSLI-LISORC-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Se não lista observação/e-mail ou somente lista e-mail
           IF WSLI-OBSERV-NAO OR WSLI-OBSERV-EMA
      *>-> Desabilita o campo lista observações restritas
              MOVE JSLI-CB-WSLI-LISORC-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
      *>-> Indica que não lista observações restritas
              SET  WSLI-LISORC-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Testa se habilita a ordem do grupo...........................................................................
       PSLI-HABDES-ORDGRP.
      *>-> Se classifica por algum grupo
           IF WSLI-GRPCLA-SIM
              MOVE JSLI-CO-WSLI-ORDGRP-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
           ELSE,
              MOVE JSLI-CO-WSLI-ORDGRP-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Testa se habil/desab subgrupo e troca literais..............................................................
       PSLI-HABDES-ORDSGR.
      *>-> Se for Grupo classif.  Preposto, Representante ou Vendedor
           EVALUATE               WSLI-GRPCLA,
      *>-> Se for grupo de cadastro
              WHEN 1
                 SET SRGCLA-GRC TO TRUE,
      *>-> Se for representante
              WHEN 2
                 SET SRGCLA-REP TO TRUE,
      *>-> Se for transportador
              WHEN 3
                 SET SRGCLA-TRP TO TRUE,
      *>-> Se for local de cobrança
              WHEN 4
                 SET SRGCLA-DTI TO TRUE,
      *>-> Se for por estado ou por UF/Cidade ou Escritório
              WHEN IS EQUAL TO 5 OR 9 OR 12
                 SET SRGCLA-TOD TO TRUE,
      *>-> Se for preposto
              WHEN 6
                 SET SRGCLA-PRE TO TRUE,
      *>-> Se for vendedor
              WHEN 7
                 SET SRGCLA-VEN TO TRUE,
      *>-> Se for Repres/Preposto/Vend.
              WHEN 8
                 SET SRGCLA-RPV TO TRUE,
      *>-> Se for grupo de empresas/holding
              WHEN 10
                 SET SRGCLA-HOL TO TRUE,
      *>-> Se for zona de vendas/região
              WHEN 11
                 SET SRGCLA-ZON TO TRUE,
      *>-> Se for outro
              WHEN OTHER
                 SET SRGCLA-NAO TO TRUE,
           END-EVALUATE.
           MOVE    JSLI-CO-WSLI-SGRCLA-ID TO WTE-ID.
      *>-> Se classifica subgrupo
           IF NOT SRGCLA-NAO
      *>-> Habilita subgrupo de classificação
              PERFORM             PTE-HABIL,
           ELSE,
      *>-> Desabilita subgrupo de classificação
              PERFORM             PTE-DESAB,
           END-IF.
      *>-> Se empresa é sindicato e subgrupo não for zona de vendas
           IF MK-EMSSIM AND NOT SRGCLA-ZON
      *>-> Verifica a literal a ser exibida
              EVALUATE            TRUE
                 WHEN SRGCLA-TOD
                    MOVE "09-Base Territorial      " TO WLT-SGRCLA(201:25),
                 WHEN SRGCLA-RPV
                    MOVE "09-Base Territorial      " TO WLT-SGRCLA(126:25),
      *>-> Se for outro
                 WHEN OTHER
                    MOVE "09-Base Territorial      " TO WLT-SGRCLA(176:25),
              END-EVALUATE,
           END-IF.
      *>-> Atualiza combo-box
           MOVE    JSLI-CO-WSLI-SGRCLA-ID TO WTE-COM-ID.
           MOVE    WLT-SGRCLA TO  WTE-COM-OPC.
      *>-> Se não for listagem simplificada e for classif.repres
           IF NOT WSRICAD-FUN-LISSIM AND WSLI-GRPCLA-REP
              MOVE WLT-SGRCLA(1:200) TO WTE-COM-OPC,
           END-IF.
           PERFORM                PTE-COM-MULIS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Testa se habilita filtragem por e-mail ou conta corrente.....................................................
       PSLI-HABDES-FILECC.
      *>-> Se não selecionou E-Mail/FOne ou Dados conta corrente ou não for a opção de listagem simplificada
           IF NOT (WSLI-LIMCID-EFO OR WSLI-LIMCID-DCC) OR NOT WSRICAD-FUN-LISSIM
      *>-> Não testar
              SET  WSLI-FILECC-TOD TO TRUE,
      *>-> Desabilita combo-box E-Mail/FOne
              MOVE JSLI-CO-WSLI-FILECC-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Habilita combo-box E-Mail/FOne
           MOVE    JSLI-CO-WSLI-FILECC-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Se selecionou E-Mail/FOne
           IF WSLI-LIMCID-EFO
              MOVE "Cliente com e-mail" TO WTE-COM-LEG,
              MOVE JSLI-CO-WSLI-FILECC-ID TO WTE-COM-ID,
              PERFORM             PTE-COM-MULEG,
      *>-> Só com e-mail
              SET  WSLI-FILECC-CEM TO TRUE,
              MOVE SPACES    TO   WTE-COM-OPC,
              STRING WLT-SLI-WSLI-FILECC-O(1), WLT-SLI-WSLI-FILECC-O(2), WLT-SLI-WSLI-FILECC-O(3) INTO WTE-COM-OPC,
              MOVE JSLI-CO-WSLI-FILECC-ID TO WTE-COM-ID,
              PERFORM             PTE-COM-MULIS,
           ELSE,
              MOVE "Cliente com contas" TO WTE-COM-LEG,
              MOVE JSLI-CO-WSLI-FILECC-ID TO WTE-COM-ID,
              PERFORM             PTE-COM-MULEG,
      *>-> Só com conta corrente
              SET  WSLI-FILECC-CCC TO TRUE,
              MOVE SPACES    TO   WTE-COM-OPC,
              STRING WLT-SLI-WSLI-FILECC-O(1), WLT-SLI-WSLI-FILECC-O(4), WLT-SLI-WSLI-FILECC-O(5) INTO WTE-COM-OPC,
              MOVE JSLI-CO-WSLI-FILECC-ID TO WTE-COM-ID,
              PERFORM             PTE-COM-MULIS,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Testa se habilita os dias de visita..........................................................................
       PSLI-HABDES-DIAVIS.
      *>-> Se deve listar os dias de visita
           IF WSLI-LIMCID-DVI
              MOVE JSLI-CO-WSLI-DIAVIS-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
           ELSE,
      *>-> Não testar
              SET  WSLI-DIAVIS-NTE TO TRUE,
              MOVE JSLI-CO-WSLI-DIAVIS-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Habilita/desabilita dia/mês aniversário inicial/final........................................................
       PSLI-HABDES-DIAMES.
      *>-> Se não deve listar contatos de clientes/fornecedores
           IF WSLI-LISCCF-NAO
              MOVE ZEROS     TO   WSLI-INIDIA, WSLI-INIMES,
              MOVE 31        TO   WSLI-FINDIA,
              MOVE 12        TO   WSLI-FINMES,
              MOVE JSLI-EF-WSLI-DIMINI-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
              MOVE JSLI-EF-WSLI-DIMFIN-ID TO WTE-ID,
              PERFORM             PTE-DESAB,
           ELSE,
              MOVE JSLI-EF-WSLI-DIMINI-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
              MOVE JSLI-EF-WSLI-DIMFIN-ID TO WTE-ID,
              PERFORM             PTE-HABIL,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Valida o campo de dia/mês aniversário inicial/final..........................................................
       PSLI-VALIDA-DIAMES.
      *>-> Presume que não haverá erro de validação
           SET     VAL-ERRNAO TO  TRUE.
      *>-> Testa o dia/mês aniversário inicial
      *>-> Obs.: Será movido fixo o ano de 2004 por ele ser bissexto
           MOVE    2004      TO   WCR-ANO.
           MOVE    WSLI-INIMES TO WCR-MES.
           MOVE    WSLI-INIDIA TO WCR-DIA.
           PERFORM                PCR-CRIDAT.
      *>-> Se for data inválida e foi informado dia/mês aniversário inicial
           IF WCR-DATINV AND WSLI-DIMINI IS NOT EQUAL TO LOW-VALUES
              PERFORM             EXIBE-MENSAGEM,
              MOVE ZEROS     TO   WSLI-INIDIA, WSLI-INIMES,
      *>-> Seta o foco para o campo dia/mês aniversário inicial
              MOVE JSLI-EF-WSLI-DIMINI-ID TO WTE-ID,
              PERFORM             PTE-SETFOC,
      *>-> Indica que houve erro de validação
              SET  VAL-ERRSIM TO  TRUE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Testa o dia/mês aniversário final
      *>-> Obs.: Será movido fixo o ano de 2004 por ele ser bissexto
           MOVE    2004      TO   WCR-ANO.
           MOVE    WSLI-FINMES TO WCR-MES.
           MOVE    WSLI-FINDIA TO WCR-DIA.
           PERFORM                PCR-CRIDAT.
      *>-> Se for data inválida e foi informado dia/mês aniversário final
           IF WCR-DATINV AND WSLI-DIMFIN IS NOT EQUAL TO LOW-VALUES
              PERFORM             EXIBE-MENSAGEM,
              MOVE 31        TO   WSLI-FINDIA,
              MOVE 12        TO   WSLI-FINMES,
      *>-> Seta o foco para o campo dia/mês aniversário final
              MOVE JSLI-EF-WSLI-DIMFIN-ID TO WTE-ID,
              PERFORM             PTE-SETFOC,
      *>-> Indica que houve erro de validação
              SET  VAL-ERRSIM TO  TRUE,
              EXIT                PARAGRAPH,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Janela de seleção das certificações do cadastro para listagem................................................
       PSLI-SELCQL.
      *>-> Inicializa janela de seleção das certificações do cadastro para listagem
           PERFORM                PSLI-SELCQL-INI.
      *>-> Carrega janela de seleção das certificações do cadastro para listagem
           PERFORM                PSLI-SELCQL-CAR.
      *>-> Aceita janela de seleção das certificações do cadastro para listagem
           PERFORM                PSLI-SELCQL-ACE.
      *>-> Retorna dados da janela de seleção das certificações do cadastro para listagem
           PERFORM                PSLI-SELCQL-RET.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Inicializa janela de seleção das certificações do cadastro para listagem.....................................
       PSLI-SELCQL-INI.
      *>-> Se não criou arquivo virtual de certificações de qualidade
           IF CQL-ABERTO-NAO
      *>-> Cria arquivo virtual: Certificações de qualidade
              PERFORM             CQL-OPEN,
           END-IF.
      *>-> Move o cabeçalho para o parâmetro
           MOVE    "Cód þCertificação                    þOrgão certificador              þ" TO WSI-CAB.
           MOVE    "Seleção das certificações do cadastro para listagem" TO WSI-TIT.
      *>-> Inicialização
           PERFORM                PSI-INICIALIZA.
      *>-> Move tipos das colunas
           MOVE    "NUM.ALF.ALF"  TO WSI-TIP.
      *>-> Insere tipos das colunas da janela de seleção de itens
           PERFORM                PSI-TIPOS-COLUNAS.
      *>-> Define as colunas a serem exibidas
           MOVE    "001.002.003"  TO WSI-SCO.
           PERFORM                PSI-SEQUENCIA-COLUNAS.
      *>-> Sequencial identificador do grid
           MOVE    W78-SQG-SRI065-001 TO WSI-SEQIDG.
      *>-> Monta a linha do item
           MOVE    "***************** Listar cadastros sem certificação *****************" TO WCQL-CERCAD.
           MOVE    WCQL-CERCAD TO WSI-ITM.
      *>-> Se deve listar cadastros sem certificação de qualidade
           IF WSLI-LISSCQ-SIM
      *>-> Indica que docto deve ser exibido marcado
              SET  WSI-FLGMAR TO  TRUE,
           ELSE,
      *>-> Indica que docto deve ser exibido marcado
              SET  WSI-FLGDES TO  TRUE,
           END-IF.
           PERFORM                PSI-INSERE-ITEM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Carrega janela de seleção das certificações do cadastro para listagem........................................
       PSLI-SELCQL-CAR.
      *>-> Inicializa linha do item
           MOVE    SPACES    TO   WCQL-CERCAD.
      *>-> Abre filtros da seleção padrão
           PERFORM                SLTABCQL-ABRE-FILTROS.
      *>-> Indica que como deve exibir janela de processamento - Normal
           SET     WSLTABCQL-PRCNOR TO TRUE.
      *>-> Posiciona para leitura
           PERFORM                SLTABCQL-START-NLESS.
      *>-> Insere todas certificações cadastradas na janela de seleção
           PERFORM                UNTIL EXIT
      *>-> Lê o próximo registro
              SET  WSLTABCQL-PRCNAO TO TRUE,
              PERFORM             SLTABCQL-READ-NEXT,
      *>-> Se não leu ok
              IF NOT FS-TAB-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Move dados da certificação para linha do item
              MOVE FTAB-CCQL TO   WL-FTAB-CCQL,
              MOVE FTAB-DCQ  TO   WL-FTAB-DCQ,
              MOVE FTAB-ORC  TO   WL-FTAB-ORC,
      *>-> Monta a linha do item
              MOVE WCQL-CERCAD TO WSI-ITM,
      *>-> Lê arquivo virtual de certificações de qualidade
              MOVE FTAB-CCQL TO   W-CQL-COD,
              PERFORM             CQL-READ-KEY,
      *>-> Se leu OK
              IF CQL-FS-OK
      *>-> Indica que docto deve ser exibido desmarcado
                 SET WSI-FLGDES   TO TRUE,
              ELSE,
      *>-> Indica que docto deve ser exibido marcado
                 SET WSI-FLGMAR   TO TRUE,
              END-IF,
              PERFORM             PSI-INSERE-ITEM,
           END-PERFORM.
      *>-> Apaga a janela de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita janela de seleção das certificações do cadastro para listagem.........................................
       PSLI-SELCQL-ACE.
      *>-> Laço de aceitação
           PERFORM                UNTIL EXIT
      *>-> Aceita janela
              PERFORM             PSI-ACEITA-JAN,
      *>-> Se clicou em OK ou fechou a janela
              IF WSI-RETOK OR WSI-RETFEC OR WSI-RETCAN
      *>-> Busca próximo marcado
                 PERFORM          PSI-BUSCA-PROX-MAR,
      *>-> Se chegou ao final - nenhuma ocorrência marcada
                 IF WSI-FIM
                    MOVE "Selecione pelo menos uma ocorrência!" TO WME-LIT,
                    PERFORM       EXIBE-MENSAGEM,
                    EXIT          PERFORM CYCLE,
                 END-IF,
                 EXIT             PERFORM,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Retorna dados da janela de seleção das certificações do cadastro para listagem...............................
       PSLI-SELCQL-RET.
      *>-> Posiciona itens no início
           PERFORM                PSI-POS-INICIO.
      *>-> Busca próximo - primeira ocorrência da seleção
           PERFORM                PSI-BUSCA-PROX.
      *>-> Se item estava marcado
           IF WSI-FLGMAR
      *>-> Indica que lista cadastros sem certificação de qualidade
              SET  WSLI-LISSCQ-SIM TO TRUE,
           ELSE,
      *>-> Indica que não lista cadastros sem certificação de qualidade
              SET  WSLI-LISSCQ-NAO TO TRUE,
           END-IF.
      *>-> Busca as ocorrências da seleção, a partir da segunda
           PERFORM                UNTIL EXIT
      *>-> Busca próximo
              PERFORM             PSI-BUSCA-PROX,
      *>-> Se chegou ao final
              IF WSI-FIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Move para linha de montagem
              MOVE WSI-ITM   TO   WCQL-CERCAD,
      *>-> Lê arquivo virtual de certificações de qualidade
              MOVE WL-FTAB-CCQL   TO W-CQL-COD,
              PERFORM             CQL-READ-KEY,
      *>-> Se item estava marcado
              IF WSI-FLGMAR
      *>-> Se leu OK
                 IF CQL-FS-OK
      *>-> Exclui registro no arquivo virtual
                    PERFORM       CQL-DELETE,
                 END-IF,
              ELSE,
      *>-> Se for novo registro
                 IF CQL-FS-INEX
      *>-> Grava registro no arquivo virtual
                    PERFORM       CQL-WRITE,
                 END-IF,
              END-IF,
           END-PERFORM.
      *>-> Apaga a janela, se exibida, e encerra o programa
           PERFORM                PSI-ENCERRA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção padrão de clientes/fornecedores...............................................................
       PSLI-SELCAD.
      *>-> Adiciona filtro ao campo "Restrições acesso usuário"
           MOVE    W78-CADTAB-FCAD-RAS TO WSLCADTAB-CAM.
           SET     WSLCADTAB-FLGSIM TO TRUE.
           PERFORM                SLCADTAB-ADDFIL-FLAG.
      *>-> Define filtro para o campo "Tipo de cadastro"
           EVALUATE               TRUE
      *>-> Se for TIPo de controle financeiro - RECeber
              WHEN GY-TIPREC OR MK-USU-ACFCLI
                 MOVE W78-CADTAB-FCAD-TIP TO WSLCADTAB-CAM,
                 MOVE W78-CADTAB-FCAD-TIPCLI TO WSLCADTAB-ENU(1),
                 SET WSLCADTAB-BLQSIM TO TRUE,
                 PERFORM          SLCADTAB-ADDFIL-ENUM,
      *>-> Se for TIPo de controle financeiro - PAGar
              WHEN GY-TIPPAG OR MK-USU-ACFFOR
                 MOVE W78-CADTAB-FCAD-TIP TO WSLCADTAB-CAM,
                 MOVE W78-CADTAB-FCAD-TIPFOR TO WSLCADTAB-ENU(1),
                 SET WSLCADTAB-BLQSIM TO TRUE,
                 PERFORM          SLCADTAB-ADDFIL-ENUM,
           END-EVALUATE.
      *>-> Não aceita confirmação
           SET     WSLCADTAB-CNFNAO TO TRUE.
      *>-> Indica que Aceita ordem de processamento - Sim
           SET     WSLCADTAB-ACEORD-SIM TO TRUE.
      *>-> Aceita janela de seleção
           PERFORM                SLCADTAB-ACCEPT.
      *>-> Retorna a ordem de processamento
           PERFORM                SLCADTAB-GET-ORDEM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                    R O T I N A S   C E N T R A L I Z A D A S   D E   L I S T A G E M                     <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       LISTAGEM                   SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Lista os cadastros...........................................................................................
       PRCL-LISCAD.
      *>-> Indica que não listou nada
           SET     LISTOU-NAO TO  TRUE.
      *>-> Cria virtual de classificação
           PERFORM                PRCL-LISCAD-CLA.
      *>-> Se deve interromper o processamento
           IF MK-INPSIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Inicializa campos auxiliares
           MOVE    ZEROS     TO   WRCL-GRPAUX, WRCL-GRPAU2, WRCL-GRPAU3, WRCL-SGRAUX, WRCL-SGRAU2, WRCL-SGRAU3,
                                  WRCL-FB-ECA, WRCL-FB-EC2.
           MOVE    SPACES    TO   WRCL-SGRCID, WRCL-CIDAUX.
           MOVE    LOW-VALUES TO  WRCL-CGGAUX, WRCL-FCAD-CZM.
      *>-> Inicializa totalizadores
           MOVE    ZEROS     TO   WRCL-TOTCOD, WRCL-TOTDIV, WRCL-TOTACU, WRCL-CONREP, WRCL-CONCID, WRCL-KC-NEP,
                                  WRCL-KC-NEM, WRCL-KC-CPS.
      *>-> Posiciona o virtual
           MOVE    LOW-VALUES TO  KC-CHA.
           PERFORM                CAD-START-NLESS.
      *>-> Laço de leitura
           PERFORM                UNTIL EXIT
      *>-> Lê o próximo registro do virtual de classificação
              PERFORM             CAD-READ-NEXT,
      *>-> Se não leu ok
              IF NOT CAD-FS-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Lê o registro de cliente/fornecedor com base no registro do virtual
              PERFORM             PRCL-LISPRO-READ-CAD,
      *>-> Incrementa/Exibe o registro lido
              PERFORM             EJP-REG-LIDO,
      *>-> Se não leu ok ou interrompeu o processamento
              IF NOT FS-CAD-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Atualiza dados do registro atual
              PERFORM             PRCL-LISCAD-ATUDAD,
      *>-> Se ainda não listou nada
              IF LISTOU-NAO
      *>-> Rotinas iniciais
                 PERFORM          PRCL-LISCAD-INI,
      *>-> Se não deve imprimir
                 IF WGL-IMPNAO
                    EXIT          PERFORM,
                 END-IF,
              END-IF,
      *>-> Imprime cadastro
              PERFORM             PRCL-LISCAD-IMP,
           END-PERFORM.
      *>-> Rotinas finais
           PERFORM                PRCL-LISCAD-FIM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Cria virtual de classificação................................................................................
       PRCL-LISCAD-CLA.
      *>-> Cria arquivo virtual de classifcação
           PERFORM                CAD-OPEN.
      *>-> Posicionamento NOT LESS
           SET     WSLCADTAB-EPRNAO TO TRUE.
           PERFORM                SLCADTAB-START-NLESS.
      *>-> Laço de leitura
           PERFORM                UNTIL EXIT
      *>-> Leitura sequencial NEXT
              PERFORM             SLCADTAB-READ-NEXT,
      *>-> Se não leu ok ou interrompeu o processamento
              IF NOT FS-CAD-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Verifica se o registro lido é válido
              PERFORM             PRCL-LISCAD-VALREG,
      *>-> Se o registro for inválido
              IF ERRDIV-SIM
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Se classifica pelo representante/preposto/vendedor
              IF WSLI-GRPCLA-RPV
      *>-> Grava no virtual a classificação por representante/preposto/vendedor
                 PERFORM          PRCL-LISCAD-CLA-GRVVIR-RPV,
              ELSE,
      *>-> Grava no virtual
                 PERFORM          PRCL-LISCAD-CLA-GRVVIR,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Verifica se o registro lido é válido.........................................................................
       PRCL-LISCAD-VALREG.
      *>-> Presume que não houve erro
           SET     ERRDIV-NAO TO  TRUE.
      *>-> Verifica se o registro lido é válido - Validações específicas para a listagem detalhada
           PERFORM                PRCL-LISCAD-VALREG-DET.
           IF ERRDIV-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Verifica se o registro lido é válido - Validações específicas para a listagem simplificada
           PERFORM                PRCL-LISCAD-VALREG-SIM.
           IF ERRDIV-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Verifica se o registro lido é válido - Validações comuns para ambas as listagens
           PERFORM                PRCL-LISCAD-VALREG-AMB.
           IF ERRDIV-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Verifica se o registro lido é válido - Validações específicas para a listagem detalhada
       PRCL-LISCAD-VALREG-DET.
      *>-> Se não for listagem detalhada
           IF NOT WSRICAD-FUN-LISCAD
              EXIT                PARAGRAPH,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Verifica se o registro lido é válido - Validações específicas para a listagem simplificada...................
       PRCL-LISCAD-VALREG-SIM.
      *>-> Se não for listagem simplificada
           IF NOT WSRICAD-FUN-LISSIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se lista somente isentos de ICMS e não for isento
           IF WSLI-LSIICM-SIM AND NOT FCAD-IES-ISENTO
      *>-> Indica que houve erro
              SET  ERRDIV-SIM TO  TRUE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se for lista por e-mail/fone
           IF WSLI-LIMCID-EFO
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 02 da observação do cadastro
              PERFORM             PFB-LER-FOBCAD-REGEIN,
      *>-> Se filtra por e-mail e for inválido
              IF (WSLI-FILECC-SEM AND WFB-EIN(2) NOT EQUAL TO SPACES) OR
                 (WSLI-FILECC-CEM AND WFB-EIN(2)     EQUAL TO SPACES)
      *>-> Indica que houve erro
                 SET ERRDIV-SIM   TO TRUE,
                 EXIT             PARAGRAPH,
              END-IF,
           END-IF.
      *>-> Se for dados da conta corrente
           IF WSLI-LIMCID-DCC
              MOVE FCAD-CGG  TO   WTCC-CGG,
      *>-> Posiciona o arquivo de contas correntes de pessoas para leitura sequencial
              PERFORM             PTCC-POSARQ-CCOCAP,
      *>-> Lê o arquivo de contas correntes sequencialmente
              PERFORM             PTCC-LERPRX-CCOCAP,
      *>-> Se filtra por dados da conta corrente
              IF (WSLI-FILECC-SCC AND WTCC-CODBCO NOT EQUAL TO ZEROS) OR
                 (WSLI-FILECC-CCC AND WTCC-CODBCO IS  EQUAL TO ZEROS)
      *>-> Indica que houve erro
                 SET ERRDIV-SIM   TO TRUE,
                 EXIT             PARAGRAPH,
              END-IF,
           END-IF.
      *>-> Se tem contratado o módulo do AUE e testa itens de serviço
           IF MK-MCOSIM(10) AND TSTISE-SIM
      *>-> Indica que não deve exportar cadastro
              SET  VAL-ERRNAO TO  TRUE,
      *>-> Abre filtros da seleção padrão
              PERFORM             SLNFSTAB-ABRE-FILTROS,
      *>-> Período de processamento
              MOVE W78-NFSTAB-ANFS-PER TO WSLNFSTAB-CAM,
              MOVE W-PERMOV  TO   WSLNFSTAB-INIPER, WSLNFSTAB-FINPER,
              PERFORM             SLNFSTAB-ADDFIL-ENTRE,
      *>-> Cliente
              MOVE W78-NFSTAB-ANFS-CLI TO WSLNFSTAB-CAM,
              MOVE FCAD-COD  TO   WSLNFSTAB-ININUI,
              PERFORM             SLNFSTAB-ADDFIL-IGUAL,
      *>-> Indica que não deve exibir janela de processamento
              SET  WSLNFSTAB-PRCNAO TO TRUE,
      *>-> Posicionamento NOT LESS
              PERFORM             SLNFSTAB-START-NLESS,
      *>-> Laço de leitura das notas do cliente
              PERFORM             UNTIL EXIT
      *>-> Leitura sequencial NEXT
                 PERFORM          SLNFSTAB-READ-NEXT,
      *>-> Se não leu ok
                 IF NOT FS-NFS-OK
                    EXIT          PERFORM,
                 END-IF,
      *>-> Validação de nota fiscal de serviço (Através dos itens Existentes/Inexistentes)
                 MOVE ANFS-CHA TO WSRIVSE-ANFS-CHA,
                 PERFORM          SRIVSE-VALNFS,
      *>-> Se deve processar a nota
                 IF WSRIVSE-VALNFS-PRO
      *>-> Indica que deve exportar o cadastro
                    SET VAL-ERRSIM TO TRUE,
                    EXIT          PERFORM,
                 END-IF,
              END-PERFORM,
      *>-> Se não deve exportar cadastro
              IF VAL-ERRNAO
      *>-> Indica que houve erro
                 SET ERRDIV-SIM   TO TRUE,
                 EXIT             PARAGRAPH,
              END-IF,
           END-IF.
      *>-> Se deve imprimir os CNPJ repetidos e trocou de CNPJ
           IF WSLI-IMPREP-SIM AND WRCL-CGGAUX IS NOT EQUAL TO FCAD-CGG
      *>-> Inicializa o contador de cadastros
              MOVE ZEROS     TO   WRCL-CONAUX,
      *>-> Salva o código do CNPJ
              MOVE FCAD-CGG  TO   OCAD-CGG,
      *>-> Inicializa a chave principal (parte final da chave de CNPJ)
              MOVE LOW-VALUES TO  OCAD-CHA,
      *>-> Posiciona o arq.na chave do CNPJ digitado
              MOVE "START OCADAS NOT LESS OCAD-CCG" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
      *>-> Lê o arquivo de cadastros sequencialmente
              PERFORM             UNTIL EXIT
      *>-> Lê o arquivo de cadastros sequencialmente
                 MOVE "READ OCADAS NEXT IGNORE LOCK" TO WARQ-CMD,
                 PERFORM          ARQ-COMANDO-MK-CHA,
      *>-> Se posicionou Ok
                 IF NOT FS-WRK-OK OR FCAD-CGG IS NOT EQUAL TO OCAD-CGG,
                    EXIT          PERFORM,
                 END-IF,
      *>-> Se já tiver encontrado 2 CNPJ iguais
                 IF WRCL-CONAUX EQUAL TO 2
                    EXIT          PERFORM,
                 END-IF,
      *>-> Adiciona 1 ao contador de cadastros
                 ADD 1       TO   WRCL-CONAUX,
              END-PERFORM,
      *>-> Move o CNPJ para o auxiliar
              MOVE FCAD-CGG  TO   WRCL-CGGAUX,
      *>-> Se localizou pelo menos 2 cadastros com CNPJ iguais
              IF WRCL-CONAUX IS LESS THAN 2
      *>-> Indica que houve erro
                 SET ERRDIV-SIM   TO TRUE,
                 EXIT             PARAGRAPH,
              END-IF,
           END-IF.
      *>-> Se a lista de preços é diferente da selecionada e informou alguma lista para teste
           IF WSLI-LISPRC IS NOT EQUAL TO FCAD-CLP AND
              WSLI-LISPRC IS NOT EQUAL TO ZEROS
      *>-> Indica que houve erro
              SET  ERRDIV-SIM TO  TRUE,
              EXIT                PARAGRAPH,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Verifica se o registro lido é válido - Validações comuns para ambas as listagens.............................
       PRCL-LISCAD-VALREG-AMB.
      *>-> Se deve listar os contatos
           IF WSLI-LISCCF-TOD OR WSLI-LISCCF-ATI
      *>-> Indica que não encontrou contato válido
              SET  WRCL-ENCOVA-NAO TO  TRUE,
      *>-> Testa o contato do cadastro
              PERFORM             PRCL-LISCAD-VALREG-TSTCON,
      *>-> Se não encontrou contato válido
              IF WRCL-ENCOVA-NAO
      *>-> Se for CNPJ (pessoa Jurídica)
                 IF FCAD-TINJUR
      *>-> Indica que houve erro
                    SET ERRDIV-SIM TO TRUE,
                    EXIT          PARAGRAPH,
                 END-IF,
      *>-> Verifica se o cadastro (pessoa física) está de aniversário no intervalo de datas selecionado
      *>-> Carrega o mês/dia auxiliar para teste de dia/mês
                 MOVE FCAD-MNA TO   WRCL-FCAD-MNA,
                 MOVE FCAD-DNA TO   WRCL-FCAD-DNA,
      *>-> Se está fora da seleção
                 IF WRCL-FCAD-MDI IS LESS THAN WSLI-DIMINI OR
                    WRCL-FCAD-MDI IS GREATER THAN WSLI-DIMFIN
      *>-> Indica que houve erro
                    SET ERRDIV-SIM TO TRUE,
                    EXIT          PARAGRAPH,
                 END-IF,
              END-IF,
           END-IF.
      *>-> Se estiver no módulo de automação de escritórios
           IF CODSIS-AUE
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 08 da observação do cadastro
              PERFORM             PFB-LER-FOBCAD-REGCQL,
      *>-> Se leu corretamente
              IF WFB-FS-OK
      *>-> Se cadastro não possui nenhuma certificação de qualidade
                 IF WFB-COQ(1) IS EQUAL TO ZEROS
      *>-> Se não deve listar cadastros sem certificação de qualidade
                    IF WSLI-LISSCQ-NAO
      *>-> Indica que houve erro
                       SET ERRDIV-SIM TO TRUE,
                       EXIT       PARAGRAPH,
                    END-IF,
                 ELSE,
      *>-> Se criou arquivo virtual de certificações
                    IF CQL-ABERTO-SIM
      *>-> Indica que cadastro não possui certificação selecionada
                       SET ERRDIV-SIM TO TRUE,
      *>-> Procura por certificações selecionadas no cadastro
                       PERFORM    WITH TEST BEFORE
                          VARYING W-IWK FROM 1 BY 1
                             UNTIL W-IWK IS GREATER THAN W78-TBCOBC OR WFB-COQ(W-IWK) IS EQUAL TO ZEROS
      *>-> Lê arquivo virtual de certificações de qualidade
                          MOVE WFB-COQ(W-IWK) TO W-CQL-COD,
                          PERFORM CQL-READ-KEY,
      *>-> Se não leu corretamente
                          IF NOT CQL-FS-OK
      *>-> Indica que encontrou uma certificação selecionada
                             SET ERRDIV-NAO TO TRUE,
                             EXIT PERFORM,
                          END-IF,
                       END-PERFORM,
      *>-> Se não encontrou certificação selecionada no cadastro
                       IF ERRDIV-SIM
                          EXIT    PARAGRAPH,
                       END-IF,
                    END-IF,
                 END-IF,
              ELSE,
      *>-> Se não lista cadastros sem certificação de qualidade
                 IF WSLI-LISSCQ-NAO
      *>-> Indica que houve erro
                    SET ERRDIV-SIM TO TRUE,
                    EXIT          PARAGRAPH,
                 END-IF,
              END-IF,
           END-IF.
      *>-> Busca as visitas do cadastro
           PERFORM                PRCL-LISCAD-VALREG-TSTVIS.
      *>-> Se lista visitas
           IF WSLI-LIMCID-DVI AND NOT WSLI-DIAVIS-NTE
      *>-> Se não é visitado e selecionou com visita ou é visitado e selecionou os não visitados
              IF (WRCL-TABVIS IS EQUAL TO SPACES AND NOT WSLI-DIAVIS-SEM) OR
                 (WRCL-TABVIS IS NOT EQUAL TO SPACES AND WSLI-DIAVIS-SEM)
      *>-> Indica que houve erro
                 SET ERRDIV-SIM   TO TRUE,
                 EXIT             PARAGRAPH,
              END-IF,
           END-IF.
      *>-> Se for o RIL e está filtrando a versão
           IF MK-RILSIM AND NOT WSLI-VERCLI-TOD
      *>-> Captura versão do cliente
              PERFORM             PRCL-LISCAD-VALREG-GETVER,
      *>-> Se não for a versão especificada
              IF WSLI-VERCLID IS NOT EQUAL TO WRCL-VERSAO
      *>-> Indica que houve erro
                 SET ERRDIV-SIM   TO TRUE,
                 EXIT             PARAGRAPH,
              END-IF,
           END-IF.
      *>-> Se empresa é sindicato
           IF MK-EMSSIM
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 17 da observação do cadastro
              PERFORM             PFB-LER-FOBCAD-REGISP,
      *>-> Se leu corretamente
              IF WFB-FS-OK
      *>-> Se informou limite de capital válido para filtragem E cadastro possui algum capital social informado
                 IF WSLI-LIMCAP IS LESS THAN 999999999999,99 AND WFB-CAPSOC-MAI IS NOT EQUAL TO ZEROS
      *>-> Se capital social do último período for maior que seleção
                    IF WFB-CAPSOC-MAI IS GREATER THAN WSLI-LIMCAP
      *>-> Indica que houve erro
                       SET ERRDIV-SIM TO TRUE,
                       EXIT       PARAGRAPH,
                    END-IF,
                 END-IF,
      *>-> Se o tipo de cadastro estiver fora da seleção
                 IF (WSLI-TIPCAD-ASS AND WFB-FSINAO) OR
                    (WSLI-TIPCAD-FIL AND WFB-FSISIM)
      *>-> Indica que houve erro
                    SET ERRDIV-SIM TO TRUE,
                    EXIT          PARAGRAPH,
                 END-IF,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Testa o contato do cadastro..................................................................................
       PRCL-LISCAD-VALREG-TSTCON.
      *>-> Se não foi informado um filtro para listar os contatos
           IF WSLI-DIMINI IS EQUAL TO LOW-VALUES AND
              WSLI-FINDIA IS EQUAL TO 31 AND WSLI-FINMES IS EQUAL TO 12
      *>-> Indica que encontrou contato válido
              SET  WRCL-ENCOVA-SIM TO  TRUE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Código do cadastro
           MOVE    FCAD-COD  TO   WFB-COD.
      *>-> Lê o tipo de registro 06 da observação do cadastro
           PERFORM                PFB-LER-FOBCAD-REGCON.
      *>-> Varre os contatos carregados
           PERFORM                WITH TEST BEFORE
              VARYING             WRCL-SEQ FROM 1 BY 1
                 UNTIL            WRCL-SEQ IS GREATER THAN WFB-ULTSEQ
      *>-> Se não tem dados do contato na ocorrência
              IF WFB-NOC(WRCL-SEQ) IS EQUAL TO SPACES
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Carrega o mês/dia auxiliar para teste de dia/mês
              MOVE WFB-MNC(WRCL-SEQ) TO WRCL-FCAD-MNA,
              MOVE WFB-DNA(WRCL-SEQ) TO WRCL-FCAD-DNA,
      *>-> Se está fora da seleção
              IF WRCL-FCAD-MDI IS LESS THAN WSLI-DIMINI OR
                 WRCL-FCAD-MDI IS GREATER THAN WSLI-DIMFIN
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Se deve listar somente contatos ativos e o contato está inativo
              IF WSLI-LISCCF-ATI AND WFB-ATINAO(WRCL-SEQ)
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Indica que encontrou contato válido
              SET  WRCL-ENCOVA-SIM TO  TRUE,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Busca as visitas do cadastro.................................................................................
       PRCL-LISCAD-VALREG-TSTVIS.
      *>-> Se não deve listar as visitas
           IF NOT WSLI-LIMCID-DVI
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Inicializa a tabela de visitas
           MOVE    SPACES    TO   WRCL-TABVIS.
      *>-> Converte para maiúsculo o campo de dias de visita
           CALL    "CBL_TOUPPER"  USING FCAD-DVI, BY VALUE LENGTH OF FCAD-DVI.
      *>-> Verifica quais dias o cliente/fornecedor é visitado
           PERFORM                WITH TEST BEFORE
              VARYING             W-ADV FROM 1 BY 1
                 UNTIL            W-ADV IS GREATER THAN LENGTH OF FCAD-DVI OR
                                  FCAD-DVI(W-ADV:) IS EQUAL TO SPACES
      *>-> Se for de domingo a sábado
              EVALUATE            FCAD-DVI(W-ADV:1)
                 WHEN "1"
                    MOVE "X" TO   WRCL-VISITA(1),
                 WHEN "2"
                    MOVE "X" TO   WRCL-VISITA(2),
                 WHEN "3"
                    MOVE "X" TO   WRCL-VISITA(3),
                 WHEN "4"
                    MOVE "X" TO   WRCL-VISITA(4),
                 WHEN "5"
                    MOVE "X" TO   WRCL-VISITA(5),
                 WHEN "6"
                    MOVE "X" TO   WRCL-VISITA(6),
                 WHEN "7"
                    MOVE "X" TO   WRCL-VISITA(7),
              END-EVALUATE,
      *>-> Se ainda pode testar três dígitos
              IF W-ADV IS LESS THAN (LENGTH OF FCAD-DVI - 1)
      *>-> Se for DOM, SEG, TER, QUA, QUI, SEX, SAB, ALL, TOD
                 EVALUATE      FCAD-DVI(W-ADV:3)
                    WHEN "DOM"
                       MOVE "X"   TO WRCL-VISITA(1),
                    WHEN "SEG"
                       MOVE "X"   TO WRCL-VISITA(2),
                    WHEN "TER"
                       MOVE "X"   TO WRCL-VISITA(3),
                    WHEN "QUA"
                       MOVE "X"   TO WRCL-VISITA(4),
                    WHEN "QUI"
                       MOVE "X"   TO WRCL-VISITA(5),
                    WHEN "SEX"
                       MOVE "X"   TO WRCL-VISITA(6),
                    WHEN "SAB"
                       MOVE "X"   TO WRCL-VISITA(7),
                    WHEN "TOD"
                       MOVE ALL "X" TO WRCL-TABVIS,
                    WHEN "ALL"
                       MOVE ALL "X" TO WRCL-TABVIS,
                 END-EVALUATE,
              END-IF,
              EVALUATE            TRUE
      *>-> Se for só no domingo
                 WHEN WSLI-DIAVIS-SDO AND WRCL-TABVIS IS NOT EQUAL TO "X      "
                    MOVE SPACES   TO WRCL-VISITA(1),
      *>-> Se for só na segunda
                 WHEN WSLI-DIAVIS-SSE AND WRCL-TABVIS IS NOT EQUAL TO " X     "
                    MOVE SPACES   TO WRCL-VISITA(2),
      *>-> Se for só na terça
                 WHEN WSLI-DIAVIS-STE AND WRCL-TABVIS IS NOT EQUAL TO "  X    "
                    MOVE SPACES   TO WRCL-VISITA(3),
      *>-> Se for só na quarta
                 WHEN WSLI-DIAVIS-SQU AND WRCL-TABVIS IS NOT EQUAL TO "   X   "
                    MOVE SPACES   TO WRCL-VISITA(4),
      *>-> Se for só na quinta
                 WHEN WSLI-DIAVIS-SQI AND WRCL-TABVIS IS NOT EQUAL TO "    X  "
                    MOVE SPACES   TO WRCL-VISITA(5),
      *>-> Se for só na sexta
                 WHEN WSLI-DIAVIS-SSX AND WRCL-TABVIS IS NOT EQUAL TO "     X "
                    MOVE SPACES   TO WRCL-VISITA(6),
      *>-> Se for só no sábado
                 WHEN WSLI-DIAVIS-SSA AND WRCL-TABVIS IS NOT EQUAL TO "      X"
                    MOVE SPACES   TO WRCL-VISITA(7),
              END-EVALUATE,
           END-PERFORM.
      *>-> Se for domingo e não é visitado neste dia ou
      *>-> Se for segunda e não é visitado neste dia ou
      *>-> Se for terça   e não é visitado neste dia ou
      *>-> Se for quarta  e não é visitado neste dia ou
      *>-> Se for quinta  e não é visitado neste dia ou
      *>-> Se for sexta   e não é visitado neste dia ou
      *>-> Se for sábado  e não é visitado neste dia ou
      *>-> Se for com visita e não é visitado ou
      *>-> Se for todos e não é visitado todos os dias
           IF ((WSLI-DIAVIS-DOM OR WSLI-DIAVIS-SDO) AND
                WRCL-VISITA(1) IS EQUAL TO SPACES) OR
              ((WSLI-DIAVIS-SEG OR WSLI-DIAVIS-SSE) AND
                WRCL-VISITA(2) IS EQUAL TO SPACES) OR
              ((WSLI-DIAVIS-TER OR WSLI-DIAVIS-STE) AND
                WRCL-VISITA(3) IS EQUAL TO SPACES) OR
              ((WSLI-DIAVIS-QUA OR WSLI-DIAVIS-SQU) AND
                WRCL-VISITA(4) IS EQUAL TO SPACES) OR
              ((WSLI-DIAVIS-QUI OR WSLI-DIAVIS-SQI) AND
                WRCL-VISITA(5) IS EQUAL TO SPACES) OR
              ((WSLI-DIAVIS-SEX OR WSLI-DIAVIS-SSX) AND
                WRCL-VISITA(6) IS EQUAL TO SPACES) OR
              ((WSLI-DIAVIS-SAB OR WSLI-DIAVIS-SSA) AND
                WRCL-VISITA(7) IS EQUAL TO SPACES) OR
               (WSLI-DIAVIS-COM AND WRCL-TABVIS IS EQUAL TO SPACES) OR
               (WSLI-DIAVIS-ALL AND WRCL-TABVIS IS NOT EQUAL TO ALL "X")
      *>-> Inicializa a tabela de visitas
              MOVE SPACES    TO   WRCL-TABVIS,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Captura versão do cliente....................................................................................
       PRCL-LISCAD-VALREG-GETVER.
      *>-> Se não está conectado no SICLA
           IF WRCL-CONSIC-NAO
      *>-> Carrega subprograma de integração com o Sicla
              CALL "SRISIC"       USING W-PARSIS, WSC-PARAM
                 ON EXCEPTION
                    CONTINUE,
              END-CALL,
      *>-> Conecta na base de dados do Sicla
              CALL "SIC_CON"      USING W-PARSIS, WSC-PARAM
                 ON EXCEPTION
                    CONTINUE,
              END-CALL,
      *>-> Indica que está conectado no SICLA
              SET  WRCL-CONSIC-SIM TO  TRUE,
           END-IF.
      *>-> Move o código do cliente
           MOVE    FCAD-COD  TO   WYDLC-CLI.
           PERFORM                PDLC-LER-YDLCLI.
      *>-> Percorre as sequências
           PERFORM                WITH TEST BEFORE
              VARYING             WYDLC-ISQ FROM 1 BY 1
                 UNTIL            WYDLC-ISQ IS GREATER THAN W78-NOCSLI OR
                                  WYDLC-DLI(WYDLC-ISQ) IS EQUAL TO SPACES
              MOVE WYDLC-ISQ TO   W-IDV,
           END-PERFORM.
      *>-> Consulta a versão deste cliente no SICLA
           MOVE    FCAD-COD  TO   WSC-CODCLI.
           MOVE    W-IDV     TO   WSC-SEQCLI.
           CALL    "SIC_VERCLI"   USING W-PARSIS, WSC-PARAM.
           MOVE    WSC-VERSAO TO  WRCL-VERSAO.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grava no virtual a classificação por representante/preposto/vendedor.........................................
       PRCL-LISCAD-CLA-GRVVIR-RPV.
      *>-> Indica que classifica por representante
           SET     WSLI-GRPCLA-REP TO TRUE.
      *>-> Grava no virtual
           PERFORM                PRCL-LISCAD-CLA-GRVVIR.
      *>-> Se possui preposto
           IF FCAD-CPR IS NOT EQUAL TO ZEROS
      *>-> Indica que classifica pelo preposto
              SET  WSLI-GRPCLA-CPR TO TRUE,
      *>-> Grava no virtual
              PERFORM             PRCL-LISCAD-CLA-GRVVIR,
           END-IF.
      *>-> Se possui vendedor
           IF FCAD-CVD IS NOT EQUAL TO ZEROS
      *>-> Indica que classifica pelo vendedor
              SET  WSLI-GRPCLA-CVD TO TRUE,
      *>-> Grava no virtual
              PERFORM             PRCL-LISCAD-CLA-GRVVIR,
           END-IF.
      *>-> Indica que classifica pelo representante/preposto/vendedor
           SET     WSLI-GRPCLA-RPV TO TRUE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grava no virtual.............................................................................................
       PRCL-LISCAD-CLA-GRVVIR.
      *>-> Inicializa o ponteiro do string
           MOVE 1            TO   W-POINTE.
      *>-> Inicializa o registro
           INITIALIZE             KREG-CAD.
      *>-> Inicializa a CHAve para classificação por grupo
           MOVE    SPACES    TO   KC-CHA.
      *>-> Se classifica o grupo pelo código
           IF WSLI-ORDGRP-COD
              EVALUATE            TRUE,
      *>-> Se classifica por grupo de cadastro
                 WHEN WSLI-GRPCLA-GRC
                    STRING        FCAD-GRPX,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por representante
                 WHEN WSLI-GRPCLA-REP
                    SET KC-TIPREP TO TRUE,
                    MOVE FCAD-REP TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por transportador
                 WHEN WSLI-GRPCLA-TRP
                    MOVE FCAD-TRP TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo local de cobrança
                 WHEN WSLI-GRPCLA-LOC
                    MOVE FCAD-LOC TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo estado
                 WHEN WSLI-GRPCLA-EST
                    STRING        FCAD-EST,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo preposto
                 WHEN WSLI-GRPCLA-CPR
                    SET KC-TIPCPR TO TRUE,
                    MOVE FCAD-CPR TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo vendedor
                 WHEN WSLI-GRPCLA-CVD
                    SET KC-TIPCVD TO TRUE,
                    MOVE FCAD-CVD TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo representante/preposto/vendedor
      *>-> Obs.: Não faz nada pois é tratado no parágrafo PRCL-LISCAD-CLA-GRVVIR-RPV
                 WHEN WSLI-GRPCLA-RPV
                    CONTINUE,
      *>-> Se classifica pelo estado/Cidade
                 WHEN WSLI-GRPCLA-UFC
                    STRING        FCAD-EST, FCAD-CID,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por grupo de empresas/holding
                 WHEN WSLI-GRPCLA-HOL
                    STRING        FCAD-HOLX,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por zona de vendas/região
                 WHEN WSLI-GRPCLA-ZON
      *>-> Move o código da zona de venda para variável auxiliar
                    MOVE FCAD-ZON TO WRCL-FCAD-ZON,
      *>-> Move o código da micro-região para variável auxiliar
                    MOVE FCAD-MRG TO WRCL-FCAD-MRG,
                    STRING        WRCL-FCAD-CZM,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por escritório
                 WHEN WSLI-GRPCLA-ESC
      *>-> Código do cadastro
                    MOVE FCAD-COD TO WFB-COD,
      *>-> Lê o tipo de registro 09 da observação do cadastro
                    PERFORM       PFB-LER-FOBCAD-REGISC,
      *>-> Se leu corretamente
                    IF WFB-FS-OK
      *>-> Move escritório contábil\assessoria para chave do arq.virtual
                       MOVE WFB-ECA TO W-NUI07, WRCL-FB-ECA,
                    ELSE,
                       MOVE ZEROS TO W-NUI07, WRCL-FB-ECA,
                    END-IF,
                    STRING        W-NUI07,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
              END-EVALUATE,
      *>-> Se classifica o grupo pela ordem alfabética
           ELSE,
              EVALUATE            TRUE,
      *>-> Se classifica por grupo de cadastro
                 WHEN WSLI-GRPCLA-GRC
      *>-> Faz leitura do grupo de cadastro
                    MOVE FCAD-GRP TO RFT-COD,
                    PERFORM       LER-TGE-GRC,
                    STRING        RFT-D03,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por representante
                 WHEN WSLI-GRPCLA-REP
                    SET KC-TIPREP TO TRUE,
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                    MOVE FCAD-REP TO RET-COD,
                    PERFORM       LER-TPE-REP,
                    STRING        RET-DEV,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por transportador
                 WHEN WSLI-GRPCLA-TRP
      *>-> Lê tab.TRAnsportadores
                    MOVE FCAD-TRP TO RET-COD,
                    PERFORM       LER-TPE-TRA,
                    STRING        RET-DET,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo local de cobrança
                 WHEN WSLI-GRPCLA-LOC
      *>-> Faz a leitura do local de cobrança
                    MOVE FCAD-LOC TO RFT-COD,
                    PERFORM       LER-TGE-LOC,
                    STRING        RFT-D01,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo estado
                 WHEN WSLI-GRPCLA-EST
      *>-> Busca a descrição do estado na tabela
                    MOVE FCAD-EST TO WDE-UFC,
                    PERFORM       ROG-BUSCA-EST,
      *>-> Se encontrou a UF
                    IF WDE-IUFOK
                       STRING     WDE-DES(WDE-IUF),
                          DELIMITED BY SIZE INTO KC-CHA
                             WITH POINTER W-POINTE,
                    ELSE,
                       MOVE SPACES TO KC-CHA,
                    END-IF,
      *>-> Se classifica pelo preposto
                 WHEN WSLI-GRPCLA-CPR
                    SET KC-TIPCPR TO TRUE,
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                    MOVE FCAD-CPR TO RET-COD,
                    PERFORM       LER-TPE-REP,
                    STRING        RET-DEV,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo vendedor
                 WHEN WSLI-GRPCLA-CVD
                    SET KC-TIPCVD TO TRUE,
                    MOVE FCAD-CVD TO RET-COD,
                    PERFORM       LER-TPE-REP,
                    STRING        RET-DEV,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo representante/preposto/vendedor
      *>-> Obs.: Não faz nada pois é tratado no parágrafo PRCL-LISCAD-CLA-GRVVIR-RPV
                 WHEN WSLI-GRPCLA-RPV
                    CONTINUE,
      *>-> Se classifica pelo estado/Cidade
                 WHEN WSLI-GRPCLA-UFC
      *>-> Busca a descrição do estado na tabela
                    MOVE FCAD-EST TO WDE-UFC,
                    PERFORM       ROG-BUSCA-EST,
      *>-> Se encontrou a UF
                    IF WDE-IUFOK
                       STRING     WDE-DES(WDE-IUF), FCAD-CID,
                          DELIMITED BY SIZE INTO KC-CHA
                             WITH POINTER W-POINTE,
                    ELSE,
                       MOVE SPACES TO KC-CHA,
                    END-IF,
      *>-> Se classifica por grupo de empresas/holding
                 WHEN WSLI-GRPCLA-HOL
      *>-> Faz leitura do grupo de empresas/holding
                    MOVE FCAD-HOL TO RET-COD,
                    PERFORM       LER-TPE-HOL,
                    STRING        RET-DEO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por zona de vendas/região
                 WHEN WSLI-GRPCLA-ZON
      *>-> Faz leitura da zona de vendas
                    MOVE FCAD-ZON TO RFT-COD,
                    PERFORM       LER-TGE-ZVD,
      *>-> Faz leitura da micro-região
                    MOVE FCAD-MRG TO RFT-AGE,
                    MOVE FCAD-ZON TO RFT-COD,
                    PERFORM       LER-TGE-MRE,
      *>-> Move valor retornado para chave de leitura
                    STRING        RFT-DEZ, RFT-D35,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por escritório
                 WHEN WSLI-GRPCLA-ESC
      *>-> Código do cadastro
                    MOVE FCAD-COD TO WFB-COD,
      *>-> Lê o tipo de registro 09 da observação do cadastro
                    PERFORM       PFB-LER-FOBCAD-REGISC,
      *>-> Se leu corretamente
                    IF WFB-FS-OK
      *>-> Move escritório contábil\assessoria para chave do arq.virtual
                       MOVE WFB-ECA TO W-NUI07, WRCL-FB-ECA,
                    ELSE,
                       MOVE ZEROS TO W-NUI07, WRCL-FB-ECA,
                    END-IF,
                    STRING        W-NUI07,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
              END-EVALUATE,
           END-IF.
      *>-> Subgrupo de classificação
      *>-> Se classifica o grupo pelo código
           IF WSLI-ORDGRP-COD
              EVALUATE             TRUE
      *>-> Se classifica pelo preposto
                 WHEN WSLI-SGRCLA-CPR
                    MOVE FCAD-CPR TO WRCL-SGRAUX,
                    STRING        WRCL-SGRUPO,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por representante
                 WHEN WSLI-SGRCLA-REP
                    MOVE FCAD-REP TO WRCL-SGRAUX,
                    STRING        WRCL-SGRUPO,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo vendedor
                 WHEN WSLI-SGRCLA-CVD
                    MOVE FCAD-CVD TO WRCL-SGRAUX,
                    STRING        WRCL-SGRUPO,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por grupo de cadastro
                 WHEN WSLI-SGRCLA-GRC
                    STRING        FCAD-GRPX,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por transportador
                 WHEN WSLI-SGRCLA-TRP
                    MOVE FCAD-TRP TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo local de cobrança
                 WHEN WSLI-SGRCLA-LOC
                    MOVE FCAD-LOC TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por grupo de empresas/holding
                 WHEN WSLI-SGRCLA-HOL
                    STRING        FCAD-HOLX,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por zona de vendas/região
                 WHEN WSLI-SGRCLA-ZON
      *>-> Move o código da zona de venda para variável auxiliar
                    MOVE FCAD-ZON TO WRCL-FCAD-ZON,
      *>-> Move o código da micro-região para variável auxiliar
                    MOVE FCAD-MRG TO WRCL-FCAD-MRG,
      *>-> Move código para a chave de leitura
                    STRING        WRCL-FCAD-CZM,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por cidade
                 WHEN WSLI-SGRCLA-CID
      *>-> Move código para a chave de leitura
                    STRING        FCAD-CID,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
              END-EVALUATE,
      *>-> Se classifica o grupo pela ordem alfabética
           ELSE,
              EVALUATE            TRUE
      *>-> Se classifica pelo preposto
                 WHEN WSLI-SGRCLA-CPR
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                    MOVE FCAD-CPR TO RET-COD,
                    PERFORM       LER-TPE-REP,
                    STRING        RET-DEV,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por representante
                 WHEN WSLI-SGRCLA-REP
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                    MOVE FCAD-REP TO RET-COD,
                    PERFORM       LER-TPE-REP,
                    STRING        RET-DEV,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo vendedor
                 WHEN WSLI-SGRCLA-CVD
                    MOVE FCAD-CVD TO RET-COD,
                    PERFORM       LER-TPE-REP,
                    STRING        RET-DEV,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por grupo de cadastro
                 WHEN WSLI-SGRCLA-GRC
      *>-> Faz leitura do grupo de cadastro
                    MOVE FCAD-GRP TO RFT-COD,
                    PERFORM       LER-TGE-GRC,
                    STRING        RFT-D03,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por transportador
                 WHEN WSLI-SGRCLA-TRP
      *>-> Lê tab.TRAnsportadores
                    MOVE FCAD-TRP TO RET-COD,
                    PERFORM       LER-TPE-TRA,
                    STRING        RET-DET,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica pelo local de cobrança
                 WHEN WSLI-SGRCLA-LOC
      *>-> Faz a leitura do local de cobrança
                    MOVE FCAD-LOC TO RFT-COD,
                    PERFORM       LER-TGE-LOC,
                    STRING        RFT-D01,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por grupo de empresas/holding
                 WHEN WSLI-SGRCLA-HOL
      *>-> Faz leitura do grupo de empresas/holding
                    MOVE FCAD-HOL TO RET-COD,
                    PERFORM       LER-TPE-HOL,
                    STRING        RET-DEO,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por zona de vendas/região
                 WHEN WSLI-SGRCLA-ZON
      *>-> Faz leitura da zona de vendas
                    MOVE FCAD-ZON TO RFT-COD,
                    PERFORM       LER-TGE-ZVD,
      *>-> Faz leitura da micro-região
                    MOVE FCAD-MRG TO RFT-AGE,
                    MOVE FCAD-ZON TO RFT-COD,
                    PERFORM       LER-TGE-MRE,
      *>-> Move valor retornado para a chave de leitura
                    STRING        RFT-DEZ, RFT-D35,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se classifica por cidade
                 WHEN WSLI-SGRCLA-CID
      *>-> Move código para a chave de leitura
                    STRING        FCAD-CID,
                       DELIMITED  BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
              END-EVALUATE,
           END-IF.
      *>-> Se lista cidade/empregados/capital social ou se cidade/base territorial/DDD
           IF WSRICAD-FUN-LISSIM AND (WSLI-LIMCID-CEC OR WSLI-LIMCID-CBD)
      *>-> Move a cidade/estado do cadastro para chave do arquivo virtual
              STRING              FCAD-CID, FCAD-EST,
                 DELIMITED BY SIZE INTO KC-CHA
                    WITH POINTER W-POINTE,
      *>-> Lê registro no arquivo virtual
              PERFORM             CAD-READ-KEY,
      *>-> Move o cliente
              MOVE FCAD-EST  TO   KC-EST,
      *>-> Move a cidade
              MOVE FCAD-CID  TO   KC-CID,
      *>-> Incrementa o número de empresas
              ADD  1         TO   KC-NEP,
      *>-> Se não foi informado a zona de venda
              IF KC-ZON IS EQUAL TO ZEROS
      *>-> Move a zona de venda
                 MOVE FCAD-ZON TO   KC-ZON,
              END-IF,
      *>-> Faz a edição do nº telefone comercial 1
              MOVE FCAD-FON  TO   WFON-NUM,
              PERFORM             PRG-EDTFON,
      *>-> Localiza o DDD
              PERFORM             WITH TEST BEFORE
                 VARYING          W-I4D FROM 1 BY 1
                    UNTIL         W-I4D IS GREATER THAN W78-TAMFON OR
                                  WFON-X14(W-I4D:1) IS EQUAL TO "("
              END-PERFORM,
      *>-> Se retornou um índice válido e o telefone tem DDD
              IF W-I4D IS NOT GREATER THAN W78-TAMFON AND WFON-X14(W-I4D:1) IS EQUAL TO "("
                 MOVE WFON-X14(W-I4D:4) TO KC-DDD,
              END-IF,
      *>-> Faz a edição do nº telefone comercial 2
              MOVE FCAD-FO2  TO   WFON-NUM,
              PERFORM             PRG-EDTFON,
      *>-> Localiza o DDD
              PERFORM             WITH TEST BEFORE
                 VARYING          W-I4D FROM 1 BY 1
                    UNTIL         W-I4D IS GREATER THAN W78-TAMFON OR
                                  WFON-X14(W-I4D:1) IS EQUAL TO "("
              END-PERFORM,
      *>-> Se retornou um índice válido e o telefone tem DDD
              IF W-I4D IS NOT GREATER THAN W78-TAMFON AND WFON-X14(W-I4D:1) IS EQUAL TO "("
                 MOVE WFON-X14(W-I4D:4) TO KC-DDD,
              END-IF,
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 17 da observação do cadastro
              PERFORM             PFB-LER-FOBCAD-REGISP,
      *>-> Se leu corretamente
              IF WFB-FS-OK
      *>-> Incrementa o número de empregados
                 ADD WFB-NUMEMP-MAI TO KC-NEM,
      *>-> Incrementa o capital social
                 ADD WFB-CAPSOC-MAI TO KC-CPS,
              END-IF,
           ELSE,
      *>-> Verifica a ordem de classificação do cadastro
              EVALUATE            TRUE
      *>-> Se for classif.do cadastro para ordem alfabética
                 WHEN WSLCADTAB-ORDCHD
                    STRING        FCAD-DES,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se for classif.do cadastro para ordem de CEP
                 WHEN WSLCADTAB-ORDCHC
                    STRING        FCAD-CCE,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se for classif.do cadastro para ordem de representante
                 WHEN WSLCADTAB-ORDCHR
                    MOVE FCAD-REP TO WRCL-GRPAUX,
                    STRING        WRCL-GRUPO,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se for classif.do cadastro para ordem de CNPJ ou de CPF
                 WHEN WSLCADTAB-ORDCCG
                    MOVE FCAD-CGC TO WRCL-CGCCPF,
                    STRING        WRCL-GRPCGC,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se for classif.do cadastro para ordem de nome fantasia
                 WHEN WSLCADTAB-ORDCHF
                    STRING        FCAD-FAN,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
      *>-> Se for classif.do cadastro para ordem de cidade
                 WHEN WSLCADTAB-ORDCCI
                    STRING        FCAD-CID, FCAD-DES,
                       DELIMITED BY SIZE INTO KC-CHA
                          WITH POINTER W-POINTE,
              END-EVALUATE,
      *>-> Move o código do cadastro para chave do arquivo virtual
              STRING              FCAD-CHA,
                 DELIMITED BY SIZE INTO KC-CHA
                    WITH POINTER  W-POINTE,
      *>-> Move o código do cadastro
              MOVE FCAD-COD  TO   KC-COD,
           END-IF.
      *>-> Grava/Regrava registro no arquivo virtual
           PERFORM                CAD-RE-WRITE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Lê o registro de cliente/fornecedor com base no registro do virtual..........................................
       PRCL-LISPRO-READ-CAD.
      *>-> Se lista cidade/empregados/capital social ou se cidade/base territorial/DDD
           IF WSRICAD-FUN-LISSIM AND (WSLI-LIMCID-CEC OR WSLI-LIMCID-CBD)
              SET  FS-CAD-OK TO   TRUE,
           ELSE,
      *>-> Lê o registro de produto
              MOVE KC-COD    TO   FCAD-COD,
              MOVE "READ FCADAS KEY FCAD-CHA IGNORE LOCK" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Atualiza dados do registro atual.............................................................................
       PRCL-LISCAD-ATUDAD.
      *>-> Se não for listagem simplificada e Dados para liberação
           IF NOT (WSRICAD-FUN-LISSIM AND WSLI-LIMCID-LIB)
      *>-> Incrementa totalizadores
              ADD  FCAD-DIV  TO   WRCL-TOTDIV,
      *>-> Acumula o total do cadastro
              ADD  1         TO   WRCL-TOTCOD,
           END-IF.
      *>-> Se for listagem simplificada
           IF WSRICAD-FUN-LISSIM
      *>-> Incrementa contador de cliente por representante
              ADD  1         TO   WRCL-CONREP,
      *>-> Se for classif.do cadastro para ordem de cidade
              IF WSLCADTAB-ORDCCI
      *>-> Incrementa contador de cliente por cidade
                 ADD 1       TO   WRCL-CONCID,
              END-IF,
           END-IF.
      *>-> Se classifica por algum grupo ou
      *>-> ... se lista cidade/empregados/capital social ou
      *>-> ... se cidade/base territorial/DDD
           IF WSLI-GRPCLA-SIM OR (WSRICAD-FUN-LISSIM AND (WSLI-LIMCID-CEC OR WSLI-LIMCID-CBD))
      *>-> Avalia o tipo de classificação
              EVALUATE            TRUE,
      *>-> Se classifica por grupo de cadastro
                 WHEN WSLI-GRPCLA-GRC
                    MOVE FCAD-GRP TO WRCL-GRPAU2,
      *>-> Se classifica por representante
                 WHEN WSLI-GRPCLA-REP
                    MOVE FCAD-REP TO WRCL-GRPAU2,
      *>-> Se classifica por transportador
                 WHEN WSLI-GRPCLA-TRP
                    MOVE FCAD-TRP TO WRCL-GRPAU2,
      *>-> Se classifica pelo local de cobrança
                 WHEN WSLI-GRPCLA-LOC
                    MOVE FCAD-LOC TO WRCL-GRPAU2,
      *>-> Se classifica pelo preposto
                 WHEN WSLI-GRPCLA-CPR
                    MOVE FCAD-CPR TO WRCL-GRPAU2,
      *>-> Se classifica pelo vendedor
                 WHEN WSLI-GRPCLA-CVD
                    MOVE FCAD-CVD TO WRCL-GRPAU2,
      *>-> Se classifica pelo representante/preposto/vendedor
                 WHEN WSLI-GRPCLA-RPV
                    MOVE FCAD-REP TO WRCL-GRPAU2,
                    IF KC-TIPCPR
                       MOVE FCAD-CPR TO WRCL-GRPAU2,
                    END-IF,
                    IF KC-TIPCVD
                       MOVE FCAD-CVD TO WRCL-GRPAU2,
                    END-IF,
      *>-> Se classifica por grupo de empresas/holding
                 WHEN WSLI-GRPCLA-HOL
                    MOVE FCAD-HOL TO WRCL-GRPAU2,
      *>-> Se classifica por zona de vendas/região
                 WHEN WSLI-GRPCLA-ZON
      *>-> Move o código da zona de venda para variável auxiliar
                    MOVE FCAD-ZON TO WRCL-GRPAU2,
      *>-> Move o código da micro-região para variável auxiliar
                    MOVE FCAD-MRG TO WRCL-GRPAU3,
      *>-> Se classifica por escritório
                 WHEN WSLI-GRPCLA-ESC
      *>-> Código do cadastro
                    MOVE FCAD-COD TO WFB-COD,
      *>-> Lê o tipo de registro 09 da observação do cadastro
                    PERFORM       PFB-LER-FOBCAD-REGISC,
      *>-> Se leu corretamente
                    IF WFB-FS-OK
      *>-> Move escritório contábil/Assessoria para variável auxiliar
                       MOVE WFB-ECA TO WRCL-FB-EC2,
                    ELSE,
                       MOVE ZEROS TO WRCL-FB-EC2,
                    END-IF,
              END-EVALUATE,
      *>-> Se classifica subgrupo
              EVALUATE            TRUE
                 WHEN WSLI-SGRCLA-CPR
                    MOVE FCAD-CPR TO WRCL-SGRAU2,
                 WHEN WSLI-SGRCLA-REP
                    MOVE FCAD-REP TO WRCL-SGRAU2,
                 WHEN WSLI-SGRCLA-CVD
                    MOVE FCAD-CVD TO WRCL-SGRAU2,
                 WHEN WSLI-SGRCLA-GRC
                    MOVE FCAD-GRP TO WRCL-SGRAU2,
                 WHEN WSLI-SGRCLA-TRP
                    MOVE FCAD-TRP TO WRCL-SGRAU2,
                 WHEN WSLI-SGRCLA-LOC
                    MOVE FCAD-LOC TO WRCL-SGRAU2,
                 WHEN WSLI-SGRCLA-HOL
                    MOVE FCAD-HOL TO WRCL-SGRAU2,
                 WHEN WSLI-SGRCLA-ZON
      *>-> Move o código da zona de venda para variável auxiliar
                    MOVE FCAD-ZON TO WRCL-SGRAU2,
      *>-> Move o código da micro-região para variável auxiliar
                    MOVE FCAD-MRG TO WRCL-SGRAU3,
                 WHEN WSLI-SGRCLA-CID
                    MOVE FCAD-CID TO WRCL-SGRCID,
              END-EVALUATE,
      *>-> Indica que deve listar a linha do grupo de cadastro
              SET  WRCL-LINGRP-SIM TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotinas iniciais.............................................................................................
       PRCL-LISCAD-INI.
      *>-> Indica que o Padrão de IMPRessão é CoMPactada (16,67/17 cpi)
           SET     CIMPR-CMP TO   TRUE.
      *>-> Se for listagem simplificada
           IF WSRICAD-FUN-LISSIM
      *>-> Carrega as propriedades das colunas para listagem simplificada
              PERFORM             PRCL-IMPSIM-PRPEXL-LST,
           END-IF.
      *>-> Abre a impressora
           PERFORM                PRN-ABRIMP.
      *>-> Se não deve imprimir
           IF WGL-IMPNAO
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se for listagem simplificada
           IF WSRICAD-FUN-LISSIM
      *>-> Imprime o cabeçalho da listagem simplificada
              PERFORM             PRCL-IMPSIM-IMPCAB,
           ELSE,
      *>-> Imprime o cabeçalho da listagem detalhada
              PERFORM             PRCL-IMPDET-IMPCAB,
           END-IF.
      *>-> Indica que já listou algo
           SET     LISTOU-SIM TO  TRUE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime cadastro.............................................................................................
       PRCL-LISCAD-IMP.
      *>-> Se for listagem simplificada
           IF WSRICAD-FUN-LISSIM
      *>-> Imprime listagem simplificada
              PERFORM             PRCL-IMPSIM,
           ELSE,
      *>-> Imprime listagem detalhada
              PERFORM             PRCL-IMPDET,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime listagem simplificada................................................................................
       PRCL-IMPSIM.
      *>-> Salta página, se necessário
           PERFORM                PRCL-IMPSIM-SALPAG.
      *>-> Imprime título do grupo/subgrupo, se necessário
           PERFORM                PRCL-IMPSIM-TITGRP.
      *>-> Imprime os dados do cliente/fornecedor
           PERFORM                PRCL-IMPSIM-IMPCAD.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Salta página, se necessário..................................................................................
       PRCL-IMPSIM-SALPAG.
      *>-> Se classifica por representante e Subgrupo for por cidade e mudou de cidade
           IF WSLI-GRPCLA-REP AND WSLI-SGRCLA-CID AND
              WRCL-CIDAUX IS NOT EQUAL TO WRCL-SGRCID AND
              WRCL-CIDAUX IS NOT EQUAL TO SPACES
      *>-> Se superou o limite físico do formulário
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 5)
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
                 PERFORM          PRCL-IMPSIM-IMPCAB,
              END-IF,
      *>-> Se for classif.do cadastro para ordem de cidade
      *>-> ... não for a opção de lista cidade/empregados/capital social ou
      *>-> ... de cidade/base territorial/DDD
              IF WSLCADTAB-ORDCCI AND NOT (WSLI-LIMCID-CEC OR WSLI-LIMCID-CBD)
      *>-> Total de clientes por cidade
                 MOVE "Total de clientes da cidade:" TO WGL-LG(77:),
      *>-> Move a cidade
                 MOVE WRCL-CIDAUX TO WGL-LG(105:32),
                 MOVE WRCL-CONCID TO W-MZ05I,
                 MOVE W-MZ05I TO  WGL-LG(128:),
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
                 PERFORM          PRCL-IMPSIM-EXLMES,
      *>-> Zera contador de cliente por cidade
                 MOVE ZEROS  TO   WRCL-CONCID,
              END-IF,
      *>-> Se classifica por algum grupo e não trocou de grupo
              IF WSLI-GRPCLA-SIM AND WGL-NLA IS GREATER THAN 6 AND
                 WRCL-GRPAUX IS EQUAL TO WRCL-GRPAU2
                 PERFORM          PRCL-IMPLIN-SUB-GRUPO,
              END-IF,
           END-IF.
      *>-> Cidade auxiliar para subgrupo de classificação Cidade
           MOVE    WRCL-SGRCID  TO   WRCL-CIDAUX.
      *>-> Se superou o limite físico do formulário
           IF WGL-NLA IS GREATER THAN (WGL-NLIM - 5)
      *>-> Se for Relatório de 160 colunas
              IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                 PERFORM          PRN-SPH160,
              ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                 PERFORM          PRN-SPH132,
              END-IF,
              PERFORM             PRCL-IMPSIM-IMPCAB,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime título do grupo/subgrupo, se necessário..............................................................
       PRCL-IMPSIM-TITGRP.
      *>-> Se classifica por algum grupo e trocou de grupo
           IF WSLI-GRPCLA-SIM AND
            ((NOT WSLI-GRPCLA-CUF AND WRCL-GRPAUX IS NOT EQUAL TO WRCL-GRPAU2) OR
             (    WSLI-GRPCLA-CUF AND WRCL-FCAD-EST IS NOT EQUAL TO FCAD-EST  ) OR
             (    WSLI-GRPCLA-ESC AND WRCL-FB-ECA IS NOT EQUAL TO WRCL-FB-EC2) OR
             (    WSLI-GRPCLA-ZON AND WRCL-FCAD-CZM IS NOT EQUAL TO FCAD-CZM))
      *>-> Se não estiver no início da listagem e
      *>-> ...não foi selecionada primeira/ult.fatura ou End/Cont/Repres
              IF WGL-NLA IS GREATER THAN 8 AND
                 NOT (WSLI-LIMCID-FAT OR WSLI-LIMCID-ECR)
      *>-> Imprime linha com espaços
                 PERFORM          PRN-IMPSPC,
              END-IF,
      *>-> Imprime a linha do grupo
              PERFORM             PRCL-IMPLIN-GRUPO,
      *>-> Se classifica por U.f./Cidade
              IF WSLI-GRPCLA-UFC
      *>-> Imprime a linha do grupo da cidade
                 PERFORM          PRCL-IMPLIN-GRUPO-CID,
      *>-> Atualiza a cidade auxiliar
                 MOVE FCAD-CID TO WRCL-FCAD-CDX,
              END-IF,
      *>-> Seta que não deve listar linha em branco
              SET  WRCL-LISBRA-NAO TO  TRUE,
      *>-> Imprime a linha do subgrupo de classificação
              PERFORM             PRCL-IMPLIN-SUB-GRUPO,
      *>-> Move os grupos de classificação
              MOVE WRCL-FB-EC2  TO   WRCL-FB-ECA,
              MOVE WRCL-GRPAU2  TO   WRCL-GRPAUX,
              MOVE WRCL-SGRAU2  TO   WRCL-SGRAUX,
              MOVE FCAD-EST  TO   WRCL-FCAD-EST,
      *>-> Move o código da zona de venda para variável auxiliar
              MOVE FCAD-ZON  TO   WRCL-FCAD-ZON,
      *>-> Move o código da micro-região para variável auxiliar
              MOVE FCAD-MRG  TO   WRCL-FCAD-MRG,
      *>-> Seta que deve listar linha em branco
              SET  WRCL-LISBRA-SIM TO  TRUE,
           ELSE,
      *>-> Se classifica por algum grupo e for o grupo de U.f./Cidade e a cidade auxiliar não for igual a cidade lida
              IF WSLI-GRPCLA-UFC AND WRCL-FCAD-CDX NOT EQUAL TO FCAD-CID
      *>-> Se não foi selecionada prim/ult.fatura e não estiver no início da listagem
                 IF NOT WSLI-LIMCID-FAT AND
                    WGL-NLA IS GREATER THAN 10
      *>-> Imprime linha com espaços
                    PERFORM       PRN-IMPSPC,
                 END-IF,
      *>-> Imprime a linha do grupo da cidade
                 PERFORM          PRCL-IMPLIN-GRUPO-CID,
      *>-> Seta que não deve listar linha em branco
                 SET WRCL-LISBRA-NAO   TO TRUE,
      *>-> Imprime a linha do subgrupo de classificação
                 PERFORM          PRCL-IMPLIN-SUB-GRUPO,
      *>-> Move os grupos de classificação
                 MOVE FCAD-CID TO WRCL-FCAD-CDX,
                 MOVE WRCL-SGRAU2 TO WRCL-SGRAUX,
      *>-> Seta que deve listar linha em branco
                 SET WRCL-LISBRA-SIM   TO TRUE,
              ELSE,
      *>-> Se não for subgrupo cidade e mudou sub-Grupo de classificação
                 IF NOT WSLI-SGRCLA-CID AND WRCL-SGRAUX IS NOT EQUAL TO WRCL-SGRAU2
                    PERFORM       PRCL-IMPLIN-SUB-GRUPO,
                    MOVE WRCL-SGRAU2 TO WRCL-SGRAUX,
                 END-IF,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime os dados do cliente/fornecedor.......................................................................
       PRCL-IMPSIM-IMPCAD.
           MOVE    SPACES    TO   W-CODIGO, WL-DETALHE, WL-LINHA2.
      *>-> Move a descrição do cadastro
           MOVE    FCAD-DES  TO   WRCL-DESAUX,
      *>-> Se selecionou para listar nome fantasia
           IF WSLI-IDECAD-FAN
      *>-> Move o nome fantasia do cadastro
              MOVE FCAD-FAN  TO   WRCL-DESAUX,
           END-IF.
      *>-> Se não for Dados para liberação
           IF NOT (WSLI-LIMCID-LIB OR WSLI-LIMCID-CEC OR WSLI-LIMCID-CBD OR WSLI-LIMCID-CAL OR WSLI-LIMCID-CRT)
              MOVE FCAD-COD  TO   LS-COD,
      *>-> Move a descrição do cadastro
              MOVE FCAD-DES  TO   LS-DES,
      *>-> Se for classif.do cadastro para ordem de nome fantasia ou selecionou para listar o fantasia
              IF WSLCADTAB-ORDCHF OR WSLI-IDECAD-FAN
      *>-> Move o nome fantasia do cadastro
                 MOVE FCAD-FAN TO LS-DES,
              END-IF,
      *>-> Move o tipo de cadastro
              MOVE FCAD-TIP  TO   LS-TIP,
      *>-> Se for sem dados complementares, só código, descrição e tipo
              IF WSLI-LIMCID-SEM
                 MOVE W-CODIGO TO WGL-LG,
                 MOVE SPACES   TO W-CODIGO,
      *>-> Imprime a linha
                 PERFORM          PRN-IMPLIN,
      *>-> Imprime as observações do cliente/fornecedor
                 PERFORM          PRCL-IMPSIM-IMPOBS,
      *>-> Se for tipo de SALTO de linha entre cadastros - duplo
                 IF WSLI-SALTO-DUP
      *>-> Se for excel modo simplificado
                    IF LISTA-AUT
      *>-> exportar uma linha em branco
                       PERFORM    PRN-IMPLBX,
                    ELSE,
      *>-> Imprime a linha com espaços
                       PERFORM    PRN-IMPSPC,
                    END-IF,
                 END-IF,
      *>-> Se for tipo de salto de linha entre cadastros - traço
                 IF WSLI-SALTO-TRA
      *>-> Se for Relatório de 160 colunas
                    IF WSLI-LIMCID-160
                       MOVE ALL "-" TO WGL-LG(1:160),
                    ELSE,
                       MOVE ALL "-" TO WGL-LG(1:132),
                    END-IF,
      *>-> Imprime a linha
                    PERFORM       PRN-IMPLIN,
                 END-IF,
      *>-> Vai para o próximo cadastro
                 EXIT             PARAGRAPH,
              END-IF,
              MOVE FCAD-REP  TO   LS-REP,
      *>-> Se for listagem com CEP
              IF WSLI-LIMCID-CGC OR WSLI-LIMCID-DIV OR
                 WSLI-LIMCID-COM OR WSLI-LIMCID-DVI OR WSLI-LIMCID-END
                 MOVE FCAD-CEP TO   LS-CEP0, LS-CEP1, LS-CEP2, LS-CEP5,
                 MOVE "-"    TO   LS-CEP1(6:1),
              END-IF,
              IF WSLI-LIMCID-LIM
                 MOVE FCAD-CEP TO   LS-CEP3,
                 MOVE "-"    TO   LS-CEP3(6:1),
              END-IF,
      *>-> Se lista "endereço/CNPJ"
              IF WSLI-LIMCID-ECN
                 MOVE FCAD-CIDP TO  WRCL-FCAD-CID,
              ELSE,
                 MOVE FCAD-CID TO   WRCL-FCAD-CID,
              END-IF,
              PERFORM             WITH TEST BEFORE
                 VARYING          WRCL-I FROM 17 BY -1
                    UNTIL         WRCL-I IS EQUAL TO 1 OR
                                  WRCL-FCAD-CID(WRCL-I:1) NOT EQUAL TO SPACES,
              END-PERFORM,
           END-IF.
      *>-> Edita o CNPJ/CPF
           MOVE    FCAD-CGG  TO   WCGC-CGG.
           PERFORM                EDITA-CGCCPF.
      *>-> Avalia o tipo de listagem a ser efetuada
           EVALUATE               TRUE
              WHEN WSLI-LIMCID-LIM
                 MOVE WRCL-FCAD-CID TO LS-CID3,
                 MOVE "/"    TO   LS-CID3(WRCL-I + 1:1),
                 MOVE FCAD-EST TO   LS-CID3(WRCL-I + 2:2),
                 SET  WVED-ESQ TO TRUE,
                 MOVE FCAD-CRE TO   WVED-NUM,
                 PERFORM          PRG-EDTVAL,
                 MOVE WVED-X11 TO LS-LIM3,
                 IF FCAD-VUL IS GREATER THAN 99999999,99
                    MOVE FCAD-DUL TO LS-DUL3,
                    MOVE FCAD-MUL TO LS-MUL3,
                    MOVE FCAD-AUL TO LS-AUL3,
                    SET WVED-ESQ  TO TRUE,
                    MOVE FCAD-VUL TO WVED-NUM,
                    PERFORM       PRG-EDTVAL,
                    MOVE WVED-X13 TO LS-VUL3,
                 ELSE,
      *>-> Edita a data
                    MOVE FCAD-DTU TO W-DTANO4,
                    PERFORM    EDITA-DATAS,
                    MOVE WM-DTANO2 TO LS-DTU,
                    SET WVED-ESQ  TO TRUE,
                    MOVE FCAD-VUL TO WVED-NUM,
                    PERFORM       PRG-EDTVAL,
                    MOVE WVED-X12 TO LS-VUL4,
                 END-IF,
                 IF FCAD-VMA IS GREATER THAN 99999999,99
      *>-> Se tiver conteúdo para DaTa da Maior compra
                    IF FCAD-DTM IS NOT EQUAL TO LOW-VALUES
                       MOVE FCAD-DMA TO LS-DMA3,
                       MOVE FCAD-MMA TO LS-MMA3,
                       MOVE FCAD-AMA TO LS-AMA3,
                    END-IF,
                    SET WVED-ESQ  TO TRUE,
                    MOVE FCAD-VMA TO WVED-NUM,
                    PERFORM       PRG-EDTVAL,
                    MOVE WVED-X13 TO LS-VMA3,
                 ELSE,
      *>-> Edita a DaTa da Maior compra
                    MOVE FCAD-DTM TO W-DTANO4,
                    PERFORM    EDITA-DATAS,
                    MOVE WM-DTANO2 TO LS-DTM,
                    SET WVED-ESQ  TO TRUE,
                    MOVE FCAD-VMA TO WVED-NUM,
                    PERFORM       PRG-EDTVAL,
                    MOVE WVED-X12 TO LS-VMA4,
                 END-IF,
              WHEN WSLI-LIMCID-END OR WSLI-LIMCID-DVI
                 MOVE WRCL-FCAD-CID TO LS-CID0,
                 MOVE "/"      TO LS-CID0(WRCL-I + 1:1),
                 MOVE FCAD-EST TO LS-CID0(WRCL-I + 2:2),
                 MOVE FCAD-END TO LS-END0,
      *>-> Telefone comercial
                 MOVE FCAD-FON TO WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
      *>-> Faz a edição do número do telefone
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X14 TO LS-FON0,
                 MOVE FCAD-GRP TO LS-LOC0,
              WHEN WSLI-LIMCID-CGC
                 MOVE WRCL-FCAD-CID TO LS-CID1,
                 MOVE "/"      TO LS-CID1(WRCL-I + 1:1),
                 MOVE FCAD-EST TO LS-CID1(WRCL-I + 2:2),
                 MOVE WCGC-X18 TO LS-CGC1,
                 MOVE FCAD-IES TO LS-IES1,
      *>-> Telefone comercial
                 MOVE FCAD-FON TO WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
      *>-> Faz a edição do número do telefone
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X14 TO LS-FON1,
                 MOVE FCAD-GRP TO LS-LOC1,
              WHEN WSLI-LIMCID-DIV
                 MOVE WRCL-FCAD-CID TO LS-CID2,
                 MOVE "/"      TO LS-CID2(WRCL-I + 1:1),
                 MOVE FCAD-EST TO LS-CID2(WRCL-I + 2:2),
                 MOVE WCGC-X18 TO LS-CGC2,
                 MOVE FCAD-IES TO LS-IES2,
                 MOVE FCAD-DIV TO LS-DIV2,
                 MOVE FCAD-GRP TO LS-LOC2,
              WHEN WSLI-LIMCID-COM
                 MOVE WRCL-FCAD-CID TO LS-CID5,
                 MOVE "/"      TO LS-CID5(WRCL-I + 1:1),
                 MOVE FCAD-EST TO LS-CID5(WRCL-I + 2:2),
      *>-> Telefone comercial
                 MOVE FCAD-FON TO WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
      *>-> Faz a edição do número do telefone
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X14 TO LS-FON2,
      *>->Nome do Contato
                 IF MK-UCFSIM OR FCAD-TINJUR
                    MOVE FCAD-TIT  TO   LS-DEV1,
                 ELSE,
                    MOVE SPACES    TO   LS-DEV1,
                 END-IF,
                 MOVE FCAD-CTD TO RFT-COD,
                 PERFORM          LER-TGE-VCT,
                 IF RFT-TPRAVI OR RFT-TPRAPR OR RFT-TPRREM
                    MOVE W-DUPESP(RFT-TPR - 1) TO LS-VEN,
                 ELSE,
      *>-> Monta a literal dos vencimentos
                    MOVE FCAD-CTD TO WSROVCT-CODVCT,
                    PERFORM       SROVCT-MONLIT,
      *>-> Retorna a literal do vencimento
                    MOVE WSROVCT-LITVCT TO WEDL-ENT,
      *>-> Edita a literal em várias linhas
                    MOVE FUNCTION LENGTH(LS-VEN) TO WEDL-TAM,
                    SET WEDL-SPCNAO TO TRUE,
                    PERFORM       PEDL-EDTLIN,
      *>-> Primeira linha retornada
                    MOVE WEDL-SAI(WEDL-POS(1):WEDL-TAM) TO LS-VEN,
      *>-> Se possui uma segunda linha retornada
                    IF WEDL-SAI(WEDL-POS(2):WEDL-TAM) IS NOT EQUAL TO SPACES
      *>-> Testa se há espaço livre para a impressão de mais um cadastro
                       IF WGL-NLA IS GREATER THAN (WGL-NLIM - 11)
      *>-> Salta a página
                          PERFORM PRN-SLTPAG,
                          PERFORM PRCL-IMPSIM-IMPCAB,
                       END-IF,
                       MOVE W-CODIGO TO WGL-LG,
      *>-> Imprime a linha
                       PERFORM    PRN-IMPLIN,
                       MOVE SPACES TO W-CODIGO
      *>-> Segunda linha retornada
                       MOVE WEDL-SAI(WEDL-POS(2):WEDL-TAM) TO LS-VEN,
                    END-IF,
                 END-IF,
              WHEN WSLI-LIMCID-EFO
      *>-> Código do cadastro
                 MOVE FCAD-COD TO   WFB-COD,
      *>-> Lê o tipo de registro 02 da observação do cadastro
                 PERFORM          PFB-LER-FOBCAD-REGEIN,
      *>-> E-mail
                 MOVE WFB-EIN(2)  TO W-CODIGO(46:68),
      *>-> Telefone comercial
                 MOVE FCAD-FON TO WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
      *>-> Faz a edição do número do telefone
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X14 TO LS-FON0,
                 MOVE FCAD-GRP TO LS-LOC0,
      *>-> Edita relaçao Endereço e CNPJ
              WHEN WSLI-LIMCID-ECN
                 MOVE SPACES TO   W-CODIGO,
                 MOVE FCAD-COD TO   LS-COD5,
                 MOVE WRCL-DESAUX TO LS-DES5,
                 MOVE FCAD-TIP TO   LS-TIP5,
                 MOVE FCAD-CIDP TO  LS-CID55,
                 MOVE "/"    TO   LS-CID55(WRCL-I + 1:1),
                 MOVE FCAD-ESTP TO  LS-CID55(WRCL-I + 2:2),
                 MOVE FCAD-ENDC TO  LS-END5,
      *>-> edita CNPJ
      *>-> edição NORmal 16 caracteres
                 SET  WCGC-X16NOR TO TRUE,
                 MOVE FCAD-CGG TO   WCGC-CGG,
      *>-> Edita o CNPJ/CPF
                 PERFORM          EDITA-CGCCPF,
                 MOVE WCGC-X16 TO LS-CGC5,
                 MOVE FCAD-IES TO LS-IES5
      *>-> Se for listagem das contas correntes
              WHEN WSLI-LIMCID-DCC
                 MOVE SPACES TO   W-CODIGO,
                 MOVE FCAD-COD TO LS-COD9,
                 MOVE WRCL-DESAUX TO LS-DES9,
                 MOVE FCAD-TIP TO LS-TIP9,
                 MOVE FCAD-GRP TO LS-GRP9,
                 MOVE FCAD-FON TO WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
      *>-> Edita o número do telefone movido
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X14 TO LS-FON9,
      *>-> Nome do Contato
                 IF MK-UCFSIM OR FCAD-TINJUR
                    MOVE FCAD-TIT TO LS-ENC9,
                 ELSE,
                    MOVE SPACES TO LS-ENC9,
                 END-IF,
      *>-> edição NORmal 18 caracteres
                 SET WCGC-X18NOR  TO TRUE,
                 MOVE FCAD-CGG TO   WCGC-CGG, WTCC-CGG,
      *>-> Edita o CNPJ/CPF
                 PERFORM          EDITA-CGCCPF,
                 MOVE WCGC-X18 TO LS-CGC9,
      *>-> Se filtra por dados da conta corrente - somente com contas ou
      *>-> ...lista todos os cadastros que tem e-mail e C/C
                 IF WSLI-FILECC-CCC OR WSLI-FILECC-TOD
      *>-> Posiciona o arquivo de contas correntes de pessoas para leitura sequencial
                    PERFORM       PTCC-POSARQ-CCOCAP,
                    PERFORM       UNTIL EXIT,
      *>-> Lê o arquivo de contas correntes sequencialmente
                       PERFORM    PTCC-LERPRX-CCOCAP,
      *>-> Se não retornou conta corrente
                       IF WTCC-CODBCO IS EQUAL TO ZEROS
                          EXIT    PERFORM,
                       END-IF,
      *>-> Código do banco
                       MOVE WTCC-CODBCO TO LS-BCO9,
      *>-> Chama a rotina para editar a linha da conta para impressão
                       PERFORM    PTCC-EDITA-CONTA,
      *>-> Move a agência editada
                       MOVE WTCC-LINAGE TO LS-HIA9,
      *>-> Move a conta corrente editada
                       MOVE WTCC-LINCCO TO LS-CCO9,
                       MOVE W-CODIGO TO WRCL-WGL-LG, WGL-LG,
      *>-> Imprime a linha
                       PERFORM    PRN-IMPLIN,
                       MOVE SPACES TO W-CODIGO,
                    END-PERFORM,
                 END-IF,
      *>-> Se a linha com os dados do cadastro ainda não foi impressa
                 IF NOT WSLI-FILECC-CCC AND
                    LS-COD9 IS NOT EQUAL TO SPACES
                    MOVE W-CODIGO TO WGL-LG,
      *>-> Imprime a linha
                    PERFORM       PRN-IMPLIN,
                    MOVE SPACES   TO W-CODIGO,
                 END-IF,
              WHEN WSLI-LIMCID-LCR                *> lim.crédito/Vlr.Total
                 MOVE WRCL-FCAD-CID TO LS-CID6,
                 IF WRCL-I IS LESS THAN 21
                    MOVE "/" TO LS-CID6(WRCL-I + 1:1),
                    MOVE FCAD-EST TO LS-CID6(WRCL-I + 2:2),
                 END-IF,
                 MOVE FCAD-FON TO   WFON-NUM, *> Move o nº fone a editar
                 PERFORM          PRG-EDTFON, *> Faz a edição do nº fone
                 MOVE WFON-X12 TO LS-FON6,    *> Retorna nº fone editado
                 MOVE FCAD-FAX TO   WFON-NUM, *> Move o nº fax  a editar
                 PERFORM          PRG-EDTFON, *> Faz a edição do nº fone
                 MOVE WFON-X12 TO LS-FAX6,    *> Retorna nº fax  editado
      *>-> Valor.a EDitar - edição NORmal c/Blank When Zero
                 SET WVED-NORBWZ  TO TRUE,
                 MOVE FCAD-CRE TO   WVED-NUM, *> Move o valor a editar
                 PERFORM          PRG-EDTVLE, *> Faz a edição de valor
                 MOVE WVED-X12 TO LS-CRE,     *> Retorna valor editado
      *>-> Processa as notas do cliente/fornecedor, totalizando o valor
                 PERFORM          PRCL-IMPSIM-IMPCAD-NOF,
      *>-> Valor.a EDitar - edição NORmal c/Blank When Zero
                 SET WVED-NORBWZ  TO TRUE,
                 MOVE WRCL-ACUNOT TO WVED-NUM,
                 PERFORM          PRG-EDTVLE,
                 MOVE WVED-X15 TO LS-TOT,
      *>-> Acumula no totalizador
                 ADD WRCL-ACUNOT TO  WRCL-TOTACU,
      *>-> Move o grupo
                 MOVE FCAD-GRP TO LS-GRP6,
              WHEN WSLI-LIMCID-FAT
      *>-> Rotina para impressão dos dados prim/últ.fat
                 PERFORM          PRCL-IMPSIM-IMPCAD-FAT,
      *>-> 2ª linha de impressão
                 PERFORM          PRCL-IMPSIM-IMPCAD-FAT2,
              WHEN WSLI-LIMCID-LIB
      *>-> Rotina para impressão dos dados para liberação
                 PERFORM          PRCL-IMPSIM-IMPCAD-LIBER,
      *>-> Se não possui registro a listar
                 IF WRCL-LISREC-NAO
                    EXIT          PARAGRAPH,
                 END-IF,
              WHEN WSLI-LIMCID-EBC
                 MOVE WRCL-FCAD-CID TO LS-CID7,
                 MOVE "/"      TO LS-CID7(WRCL-I + 1:1),
                 MOVE FCAD-EST TO LS-CID7(WRCL-I + 2:2),
                 MOVE FCAD-END TO LS-END7,
                 MOVE FCAD-BAI TO LS-BAI7,
      *>-> CNPJ/Inscrição estadual/Conta Contábil/Descrição Cta Contábil
              WHEN WSLI-LIMCID-CFC
                 MOVE WCGC-X18 TO LS-CGC8,
                 MOVE FCAD-IES TO   LS-IES8,
                 MOVE FCAD-CCP TO   LS-CCP8,
                 MOVE SPACES TO   LS-DES8,
      *>-> Se foi informada conta contábil
                 IF FCAD-CCP IS NOT EQUAL TO ZEROS
                    MOVE FCAD-CCP TO CPLA-ANA,
                    MOVE FCAD-CCPF  TO CPLA-CFI,
                    MOVE "READ CPLANO KEY CPLA-CHR IGNORE LOCK EXBMSG" TO WARQ-CMD,
                    PERFORM       ARQ-COMANDO-MK-CHA,
                    IF FS-PLA-OK
                       MOVE CPLA-DES TO LS-DES8,
                    ELSE,
                       MOVE "#### Conta nao cadastrada ####" TO LS-DES8,
                    END-IF,
                 END-IF,
      *>-> Endereço + Contato + Repres. + CNPJ + IE + Cond.Pgto
              WHEN WSLI-LIMCID-ECR
      *>-> Testa se há espaço livre para a impressão de mais um cadastro
                 IF WGL-NLA IS GREATER THAN (WGL-NLIM - 9)
      *>-> Se for Relatório de 160 colunas
                    IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                       PERFORM    PRN-SPH160,
                    ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                       PERFORM    PRN-SPH132,
                    END-IF,
                    PERFORM       PRCL-IMPSIM-IMPCAB,
                 END-IF,
      *>-> Limpa linha detalhe
                 MOVE SPACES TO   W-CODIGO,
      *>-> Código
                 MOVE FCAD-COD TO LR-FC-COD,
      *>-> Nome do cliente
                 MOVE WRCL-DESAUX TO LR-FC-DES,
      *>-> Telefone comercial
                 MOVE FCAD-FON TO WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
      *>-> Faz a edição do número do telefone
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X14 TO LR-FC-FON,
      *>-> Contato(Encarregado comercial)
                 IF MK-UCFSIM OR FCAD-TINJUR
                    MOVE FCAD-TIT TO LR-FC-TIT,
                 ELSE,
                    MOVE SPACES TO LR-FC-TIT,
                 END-IF,
      *>-> CNPJ
                 SET WCGC-X18NOR  TO TRUE,
                 MOVE FCAD-CGG TO   WCGC-CGG,
                 PERFORM          EDITA-CGCCPF,
                 MOVE WCGC-X18 TO LR-FC-CGC,
      *>-> Inscrição Estadual
                 MOVE FCAD-IES TO LR-FC-IES,
      *>-> CEP
                 MOVE FCAD-CEP TO   LR-FC-CEP,
                 MOVE "-"    TO   LR-FC-CEP(6:1),
      *>-> Move dados para linha de impressão e salva a linha
                 MOVE W-CODIGO TO WGL-LG, WRCL-WGL-LG,
      *>-> Imprime a linha
                 PERFORM          PRN-IMPLIN,
      *>-> Move as propriedades das células
                 MOVE "N001,A009,A049,A070,A073,A089,A115,A124" TO WGL-LINPRP,
      *>-> Carrega as propriedades da linha secundária
                 PERFORM          PRN-CARSEC,
      *>-> Limpa linha detalhe
                 MOVE SPACES TO   W-CODIGO,
      *>-> Endereço
                 MOVE FCAD-END TO LR-FC-END,
      *>-> Cidade
                 MOVE FCAD-CID TO LR-FC-CID,
      *>-> Estado
                 MOVE FCAD-EST TO LR-FC-EST,
      *>-> Bairro
                 MOVE FCAD-BAI TO LR-FC-BAI,
      *>-> Fantasia
                 MOVE FCAD-FAN TO LR-FC-FAN,
      *>-> Faz a leitura do local de cobrança
                 MOVE FCAD-LOC TO RFT-COD,
                 PERFORM          LER-TGE-LOC,
                 MOVE RFT-A01 TO  LR-LOCPAG,
      *>-> Lê os vencimentos
                 MOVE FCAD-CTD TO RFT-COD,
                 PERFORM          LER-TGE-VCT,
      *>-> Tipo de PRazo - VENcimentos
                 IF RFT-TPRVEN
                    MOVE RFT-VEN(1) TO WRCL-FTAB-VEN1,
                    MOVE RFT-VEN(2) TO WRCL-FTAB-VEN2,
                    MOVE RFT-VEN(3) TO WRCL-FTAB-VEN3,
                    MOVE RFT-VEN(4) TO WRCL-FTAB-VEN4,
                    MOVE RFT-VEN(5) TO WRCL-FTAB-VEN5,
                    MOVE RFT-VEN(6) TO WRCL-FTAB-VEN6,
                    MOVE 1   TO   W-IDV,
                    PERFORM       WITH TEST AFTER
                       VARYING    W-ADV FROM 1 BY 1
                          UNTIL   W-ADV IS EQUAL TO LENGTH OF LR-CONPAG
      *>-> Move todos os caracteres diferentes de espaço
                       IF WRCL-FTAB-QTD(W-ADV:1) IS NOT EQUAL TO SPACES
                          MOVE WRCL-FTAB-QTD(W-ADV:1) TO LR-CONPAG(W-IDV:1),
                          ADD 1   TO W-IDV,
                       END-IF,
                    END-PERFORM,
                    PERFORM       WITH TEST BEFORE
                       VARYING    W-ADV FROM 9 BY -1
                          UNTIL   W-ADV IS EQUAL TO 1 OR
                                  LR-CONPAG(W-ADV:1) NOT EQUAL TO SPACES
                    END-PERFORM,
      *>-> Substitui a última barra por espaço
                    IF LR-CONPAG(W-ADV:1) IS EQUAL TO "/"
                       MOVE SPACES TO LR-CONPAG(W-ADV:1),
                    END-IF,
                 END-IF,
      *>-> Move dados para linha de impressão
                 MOVE W-CODIGO TO WGL-LG,
      *>-> Imprime a linha
                 PERFORM          PRN-IMPLIS,
      *>-> Limpa linha detalhe
                 MOVE SPACES TO   W-CODIGO,
      *>-> Imprime os recursos ativos que estão em posse do cadastro
                 PERFORM          PRCL-IMPSIM-IMPCAD-REA,
      *>-> Cidade/Empregados/Capital Social
              WHEN WSLI-LIMCID-CEC
      *>-> Cidade
                 MOVE KC-CID TO   LS-CID10,
                 PERFORM          WITH TEST BEFORE
                    VARYING       WRCL-I FROM 20 BY -1
                       UNTIL      WRCL-I IS EQUAL TO 1 OR
                                  KC-CID(WRCL-I:1) NOT EQUAL TO SPACES,
                 END-PERFORM,
                 MOVE "/"    TO   LS-CID10(WRCL-I + 1:1),
      *>-> Estado
                 MOVE KC-EST TO   LS-CID10(WRCL-I + 2:2),
      *>-> Número das empresas
                 MOVE KC-NEP TO   LS-NEP,
      *>-> Número de empregados
                 MOVE KC-NEM TO   WQED-NUM,
                 SET WQED-NORBWZ  TO TRUE,
                 PERFORM          PRG-EDTQTD,
                 MOVE WQED-X15 TO LS-NEM,
      *>-> Capital social
                 MOVE KC-CPS TO   WVED-NUM
                 SET WVED-NORBWZ  TO TRUE,
                 PERFORM          PRG-EDTVLE,
                 MOVE WVED-X15 TO LS-CPS,
      *>-> Incrementa os totais
                 ADD KC-NEP  TO   WRCL-KC-NEP,
                 ADD KC-NEM  TO   WRCL-KC-NEM,
                 ADD KC-CPS  TO   WRCL-KC-CPS,
      *>-> Cidade/Base Territorial/DDD
              WHEN WSLI-LIMCID-CBD
      *>-> Cidade
                 MOVE KC-CID TO   LS-CID11,
                 PERFORM          WITH TEST BEFORE
                    VARYING       WRCL-I FROM 20 BY -1
                       UNTIL      WRCL-I IS EQUAL TO 1 OR
                                  KC-CID(WRCL-I:1) NOT EQUAL TO SPACES,
                 END-PERFORM,
                 MOVE "/"    TO   LS-CID11(WRCL-I + 1:1),
      *>-> Estado
                 MOVE KC-EST TO   LS-CID11(WRCL-I + 2:2),
      *>-> Lê tab.Zona de VenDas/Região. Chave: RFT-COD
                 MOVE KC-ZON TO   RFT-COD,
                 PERFORM          LER-TGE-ZVD,
                 MOVE RFT-DEZ TO  LS-DEZ,
      *>-> DDD
                 MOVE KC-DDD TO   LS-DDD,
      *>-> Empresa/End/Cidade/Telefone/Número de empregados
              WHEN WSLI-LIMCID-EEC
      *>-> Limpa linha detalhe
                 MOVE SPACES TO   W-CODIGO,
      *>-> Código
                 MOVE FCAD-COD TO LS-COD12,
      *>-> Nome do cliente
                 MOVE WRCL-DESAUX TO LS-DES12,
      *>-> Endereço
                 MOVE FCAD-END TO LS-END12,
      *>-> Cidade
                 MOVE FCAD-CID TO LS-CID12,
      *>-> Cep
                 MOVE FCAD-CEP TO WRCL-FCAD-CEP,
                 MOVE "-"    TO   WRCL-FCAD-CEPX(7:1),
                 MOVE WRCL-FCAD-CEP TO LS-CEP12,
      *>-> Faz a edição do nº Telefone comercial 1
                 MOVE FCAD-FON TO WFON-NUM,
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X12 TO LS-FON12,
      *>-> Faz a edição do nº fax
                 MOVE FCAD-FAX TO WFON-NUM,
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X12 TO LS-FAX12,
      *>-> Código do cadastro
                 MOVE FCAD-COD TO WFB-COD,
      *>-> Lê o tipo de registro 17 da observação do cadastro
                 PERFORM          PFB-LER-FOBCAD-REGISP,
      *>-> Se leu corretamente
                 IF WFB-FS-OK
      *>-> Número de empregados do maior período
                    MOVE WFB-NUMEMP-MAI TO WQED-NUM,
                    SET WQED-NORBWZ TO TRUE,
                    PERFORM       PRG-EDTQTD,
                    MOVE WQED-X07 TO LS-NEM12,
                    ADD WFB-NUMEMP-MAI TO WRCL-KC-NEM,
                 END-IF,
      *>-> Escritório Contabilidade/Endereço/CEP/Cidade/Fone
              WHEN WSLI-LIMCID-ECC
      *>-> Limpa linha detalhe
                 MOVE SPACES TO   W-CODIGO,
      *>-> Código
                 MOVE FCAD-COD TO LS-COD13,
      *>-> Nome do cliente
                 MOVE WRCL-DESAUX TO LS-DES13,
      *>-> Endereço
                 MOVE FCAD-END TO   LS-END13,
      *>-> Cidade
                 MOVE FCAD-CID TO   LS-CID13,
      *>-> Cep
                 MOVE FCAD-CEP TO   WRCL-FCAD-CEP,
                 MOVE "-"    TO   WRCL-FCAD-CEPX(7:1),
                 MOVE WRCL-FCAD-CEP TO LS-CEP13,
      *>-> Faz a edição do nº Telefone comercial 1
                 MOVE FCAD-FON TO   WFON-NUM,
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X12 TO LS-FON13,
      *>-> Faz a edição do nº fax
                 MOVE FCAD-FAX TO   WFON-NUM,
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X12 TO LS-FAX13,
      *>-> Código alternativo/Razão social/Endereço/Fone/Grp. Cadastro
              WHEN WSLI-LIMCID-CAL
                 MOVE FCAD-CAL TO   LS-CAL19,
                 MOVE WRCL-DESAUX TO LS-DES19,
                 MOVE FCAD-END TO   LS-END19,
      *>-> Faz a edição do número do telefone
                 MOVE FCAD-FON TO   WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X12 TO LS-FON19,
      *>-> Grupo de cadastro
                 MOVE FCAD-GRP TO   LS-GRP19,RFT-COD,
      *>-> Lê tab.GRupo de Cadastro.
                 PERFORM          LER-TGE-GRC,
                 IF RTAB-FS-OK
                    MOVE RFT-A03  TO LS-ABR19,
                 ELSE,
                    MOVE SPACES   TO LS-ABR19,
                 END-IF,
      *>-> Edição da última data de compra
                 MOVE FCAD-DTU TO   W-DTANO4,
                 PERFORM          EDITA-DATAS,
                 MOVE WM-DTANO2   TO LS-DTU19,
      *>-> Edição do último valor de compra
                 MOVE FCAD-VUL TO   WVED-NUM,
                 SET  WVED-ESQ TO TRUE,
                 PERFORM          PRG-EDTVAL,
                 MOVE WVED-X11 TO LS-VUL19,
      *>-> Código/Razão social/Tipo (C/F)/Cidade/UF/Telefone
              WHEN WSLI-LIMCID-CRT
                 MOVE FCAD-COD TO LC-FCAD-COD,
                 MOVE WRCL-DESAUX TO LC-FCAD-DES,
                 MOVE FCAD-TIP TO LC-FCAD-TIP,
                 MOVE FCAD-CID TO LC-FCAD-CID,
                 MOVE FCAD-EST TO LC-FCAD-EST,
                 MOVE FCAD-FON TO WFON-NUM,
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X14 TO LC-FCAD-FON,
                 MOVE FCAD-TIT TO LC-FCAD-TIT,
                 MOVE FCAD-GRP TO LC-FCAD-GRP,
                 MOVE FCAD-GRP TO RFT-COD,
                 PERFORM          LER-TGE-GRC,
                 MOVE RFT-A03 TO  LC-FTAB-ABR003,
                 MOVE FCAD-VMA TO WVED-NUM,
                 PERFORM          PRG-EDTVAL
                 MOVE WVED-X13 TO LC-FCAD-VMA,
                 PERFORM          PRCL-IMPSIM-IMPCAD-NOF,
                 SET WVED-NORBWZ  TO TRUE,
                 MOVE WRCL-ACUNOT TO WVED-NUM,
                 PERFORM          PRG-EDTVLE,
                 MOVE WVED-X15 TO LC-TOTFAT,
                 MOVE FCAD-DTU TO W-DTANO4,
                 PERFORM          EDITA-DATAS,
                 MOVE WM-DTANO2   TO LC-FCAD-DTU,
           END-EVALUATE.
      *>-> Se não for dados para liberação ou
      *>-> ...Dados conta corrente ou
      *>-> ...Primeira/Ult.Fatura ou
      *>-> ...Endereço + Contato + Repres. + CNPJ + IE + Cond.Pgto
           IF NOT (WSLI-LIMCID-LIB OR WSLI-LIMCID-DCC OR WSLI-LIMCID-FAT OR WSLI-LIMCID-ECR OR WSLI-LIMCID-CRT)
      *>-> Se há espaço livre para a impressão de mais um cadastro
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 9)
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
                 PERFORM          PRCL-IMPSIM-IMPCAB,
              END-IF,
              MOVE W-CODIGO  TO   WGL-LG,
      *>-> Se for Listagem com LIMite de Endereço do cliente + Bairro + data/valor da última Compra
              IF WSLI-LIMCID-EBC
                 MOVE SPACES TO   W-LIM-EBC,
      *>-> Edição do telefone comercial 1
                 MOVE FCAD-FON TO   WFON-NUM,
      *>-> Se não possui telefone comercial
                 IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                    MOVE FCAD-FO2 TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-FAX TO WFON-NUM,
                 END-IF,
      *>-> Se não possui nenhum dos números acima
                 IF WFON-NUM IS EQUAL TO ZEROS
                    MOVE FCAD-CEL TO WFON-NUM,
                 END-IF,
                 PERFORM          PRG-EDTFON,
                 MOVE WFON-X12 TO W-LIM-FON,
                 MOVE FCAD-GRP TO W-LIM-LOC,
      *>-> Edita a data da última compra
                 MOVE FCAD-DTU TO   W-DTANO4,
                 PERFORM          EDITA-DATAS,
                 MOVE WM-DTANO2   TO W-LIM-DTU,
                 SET WVED-ESQ TO  TRUE,
                 MOVE FCAD-VUL TO   WVED-NUM,
                 PERFORM          PRG-EDTVAL
                 MOVE WVED-X11 TO W-LIM-VUL,
                 MOVE W-LIM-EBC   TO WGL-LG(124:),
              END-IF,
      *>-> Salva a linha
              MOVE WGL-LG    TO   WRCL-WGL-LG,
      *>-> Carrega as propriedades das colunas para listagem simplificada
              PERFORM             PRCL-IMPSIM-PRPEXL-LST,
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIN,
              MOVE SPACES    TO   W-CODIGO,
           END-IF.
      *>-> Se deve listar as visitas
           IF WSLI-LIMCID-DVI
      *>-> Testa se há espaço livre para a impressão de mais um cadastro
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 7)
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
                 PERFORM          PRCL-IMPSIM-IMPCAB,
      *>-> Restaura a linha do cliente
                 MOVE WRCL-WGL-LG TO WGL-LG,
                 PERFORM          PRN-IMPLIN, *> IMPrime a LINha
              END-IF,
      *>-> Move as propriedades das células
              MOVE "A001,A007,A032,A032,A033,A057,A104" TO WGL-LINPRP,
      *>-> Carrega as propriedades da linha secundária
              PERFORM             PRN-CARSEC,
      *>-> Imprime a linha com os dados complementares do cadastro
              MOVE FCAD-FAN  TO   WGL-LG(7:25),
              MOVE "Cnpj:"   TO   WGL-LG(33:5),
              MOVE WCGC-X18  TO   WGL-LG(38:18),
              MOVE FCAD-IES  TO   WGL-LG(57:15),
      *>-> Nome do Contato
              IF MK-UCFSIM OR FCAD-TINJUR
                 MOVE FCAD-TIT TO WGL-LG(104:25),
              ELSE,
                 MOVE SPACES TO   WGL-LG(104:25),
              END-IF,
      *>-> Exporta a linha secundária
              PERFORM             PRN-IMPLIS,
      *>-> Move as propriedades das células
              MOVE "A001,A007" TO WGL-LINPRP,
      *>-> Carrega as propriedades da linha secundária
              PERFORM             PRN-CARSEC,
      *>-> Imprime a linha com os dias de visita
              MOVE "Visita: Dom.(   ) Seg.(   ) Ter.(   ) Qua.(   ) Qui.(   ) Sex.(   ) Sab.(   )" TO WGL-LG(7:),
      *>-> Move os dias de visita
              MOVE WRCL-VISITA(1) TO WGL-LG(21:1),
              MOVE WRCL-VISITA(2) TO WGL-LG(31:1),
              MOVE WRCL-VISITA(3) TO WGL-LG(41:1),
              MOVE WRCL-VISITA(4) TO WGL-LG(51:1),
              MOVE WRCL-VISITA(5) TO WGL-LG(61:1),
              MOVE WRCL-VISITA(6) TO WGL-LG(71:1),
              MOVE WRCL-VISITA(7) TO WGL-LG(81:1),
      *>-> Exporta a linha secundária
              PERFORM             PRN-IMPLIS,
           END-IF.
      *>-> Código/Razão social/Tipo (C/F)/Cidade/UF/Telefone
           IF WSLI-LIMCID-CRT
      *>-> Testa se há espaço livre para a impressão de mais um cadastro
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 7)
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
                 PERFORM          PRCL-IMPSIM-IMPCAB,
              END-IF,
      *>-> Imprime a linha
              MOVE LC-DETALHE TO  WGL-LG,
              PERFORM             PRN-IMPLIN,
           END-IF.
      *>-> Linha Detalhe - Itens de serviço da nota.....................................................................
      *>-> Se deve listar itens de serviço (Todos ou somente os selecionados)
           IF LSTISE-SIM
      *>-> Abre filtros da seleção padrão
              PERFORM             SLNFSTAB-ABRE-FILTROS,
      *>-> Período de processamento
              MOVE W78-NFSTAB-ANFS-PER TO WSLNFSTAB-CAM,
              MOVE W-PERMOV  TO   WSLNFSTAB-INIPER, WSLNFSTAB-FINPER,
              PERFORM             SLNFSTAB-ADDFIL-ENTRE,
      *>-> Cliente
              MOVE W78-NFSTAB-ANFS-CLI TO WSLNFSTAB-CAM,
              MOVE FCAD-COD  TO   WSLNFSTAB-ININUI,
              PERFORM             SLNFSTAB-ADDFIL-IGUAL,
      *>-> Indica que não deve exibir janela de processamento
              SET  WSLNFSTAB-PRCNAO TO TRUE,
      *>-> Posicionamento NOT LESS
              PERFORM             SLNFSTAB-START-NLESS,
      *>-> Laço de leitura das notas do cliente
              PERFORM             UNTIL EXIT
      *>-> Leitura sequencial NEXT
                 PERFORM          SLNFSTAB-READ-NEXT,
      *>-> Se não leu ok
                 IF NOT FS-NFS-OK
                    EXIT          PERFORM,
                 END-IF,
      *>-> Lê os itens da nota
                 MOVE ANFS-CHA TO WAONS-CHM,
                 PERFORM          PNS-LER-AITSER,
      *>-> Lê as observações da nota
                 MOVE ANFS-CHA TO WAONS-CHM,
                 PERFORM          PNS-LER-AONSER,
      *>-> Rotina para emissão itens de serviços
                 PERFORM          PRCL-IMPSIM-IMPCAD-IMPITE,
              END-PERFORM,
           END-IF.
      *>-> Imprime as observações do cliente/fornecedor
           PERFORM                PRCL-IMPSIM-IMPOBS.
      *>-> Se lista contatos de cli/for
           IF WSLI-LISCCF-TOD OR WSLI-LISCCF-ATI
      *>-> Imprime os contatos do cliente/fornecedor
              PERFORM             PRCL-IMPCNT,
           END-IF.
      *>-> Se tipo de salto de linha entre cadastros for duplo
           IF WSLI-SALTO-DUP
      *>-> Se for excel modo simplificado
              IF LISTA-AUT
      *>-> exportar uma linha em branco
                 PERFORM          PRN-IMPLBX,
              ELSE,
      *>-> Imprime a linha com espaços
                 PERFORM          PRN-IMPSPC,
              END-IF,
           END-IF.
      *>-> Se tipo de salto de linha entre cadastros for traço
           IF WSLI-SALTO-TRA
      *>-> Linha com espaço para indicar que deve listar traços
              MOVE SPACES     TO  WGL-LG,
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
              PERFORM             PRCL-IMPSIM-EXLMES,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Carrega as propriedades das colunas para listagem simplificada...............................................
       PRCL-IMPSIM-PRPEXL-LST.
      *>-> Testa a opção selecionada para configurar as colunas
           EVALUATE               TRUE
      *>-> Se SEM dados complementares, só código, descrição e tipo
              WHEN WSLI-LIMCID-SEM
                 MOVE "C001,A009,A039" TO WGL-LINPRP,
      *>-> Se limite de crédito
              WHEN WSLI-LIMCID-LIM
                 MOVE "N001,A009,A038,N041,A046,A068,A0782AN000000DNN,D090,A0982AN000000DNN,D112,A1202AN000000DNN"
                             TO   WGL-LINPRP,
      *>-> Se endereço do cliente ou dias de visita
              WHEN WSLI-LIMCID-END OR WSLI-LIMCID-DVI
                 MOVE "C001,A009,A038,N041,A046,A068,A080,A115,N130" TO WGL-LINPRP,
      *>-> Se CNPJ do cliente
              WHEN WSLI-LIMCID-CGC
                 MOVE "N001,A009,A038,N041,A046,A068,A080,A099,A115,N130" TO WGL-LINPRP,
      *>-> Se valor da dívida
              WHEN WSLI-LIMCID-DIV
                 MOVE "N001,A009,A038,N041,A046,A068,A080,A099,N1152AN000000DNN,N130" TO WGL-LINPRP,
      *>-> Se é comprad/vectos
              WHEN WSLI-LIMCID-COM
                 MOVE "N001,A009,A038,N041,A046,A068,A080,A095,A121" TO WGL-LINPRP,
      *>-> Se é e-mail/fone
              WHEN WSLI-LIMCID-EFO
                 MOVE "N001,A009,A038,N041,A046,A115,N130" TO WGL-LINPRP,
      *>-> Se é endereço/CNPJ
              WHEN WSLI-LIMCID-ECN
                 MOVE "N001,A009,A040,A042,A080,A101,A118" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-DCC
                 MOVE "N001,A009,A038,N041,A045,A064,A079,N104,A109,A116" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-LCR
                 MOVE "N001,A009,A038,N041,A046,A068,A083,A1022AN000000CNN,A1162AN000000DNN,N130" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-LIB
                 MOVE "N001,A009,A038,A041,N065,N070,A074,N077,N081,N085,A088,N092,A097,A101,A117,A121,A125,D130,A139,N"
      &               "151,N154,A157" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-FAT
                 MOVE "N001,A009,A039,A041,N055,A058,A073,A085,A097" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-EBC
                 MOVE "N001,A009,A038,N041,A046,A068,A109,A123,N137,D140,A1492AN000000DNN" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-CFC
                 MOVE "N001,A009,A038,N041,A046,A065,N082,A089" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-ECR
                 MOVE "N001,A009,A049,A070,A072,A089,A108,A124" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-CEC
                 MOVE "A001,N024,A038,A057" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-CBD
                 MOVE "A001,A025,A058" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-EEC
                 MOVE "N001,A009,A037,A068,A079,A100,A113,A126" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-ECC
                 MOVE "N001,A009,A039,A070,A081,A102,A115" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-CAL
                 MOVE "A001,A014,A047,A088,A101,D113,A1222AN000000DNN" TO WGL-LINPRP,
              WHEN WSLI-LIMCID-CRT
                 MOVE "N001,A009,A042,A045,A066,A069,A084,N110,A114,N122M,N136M,D152" TO WGL-LINPRP,
           END-EVALUATE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime as observações do cliente/fornecedor.................................................................
       PRCL-IMPSIM-IMPOBS.
      *>-> Imprime as observações do cliente/fornecedor
           PERFORM                PRCL-IMPOBS.
      *>-> Imprime as observações do cliente/fornecedor - Linhas de produto
           PERFORM                PRCL-IMPSIM-IMPOBS-LPR.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime as observações do cliente/fornecedor - Linhas de produto.............................................
       PRCL-IMPSIM-IMPOBS-LPR.
      *>-> Se deve listar linhas de produto
           IF WSLI-LISPRO-SIM
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 05 da observação do cadastro
              PERFORM             PFB-LER-FOBCAD-REGLPR,
      *>-> Se não leu corretamente
              IF NOT WFB-FS-OK
                 EXIT             PARAGRAPH,
              END-IF,
      *>-> Move as propriedades das células
              MOVE "A001,N027,N033,A042,N071,A079,N110A,N122A" TO WGL-LINPRP,
      *>-> Carrega as propriedades da linha secundária
              PERFORM             PRN-CARSEC,
      *>-> Imprime cabeçalho de linhas de produtos do cliente/fornecedor
              PERFORM             PRCL-IMPSIM-IMPOBS-LPR-CAB,
      *>-> Se deve saltar a página
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 5)
      *>-> Se classifica por algum grupo
                 IF WSLI-GRPCLA-SIM
      *>-> Indica que não deve listar a linha do grupo de cadastro
                    SET WRCL-LINGRP-NAO TO TRUE,
                 END-IF,
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
                 PERFORM          PRCL-IMPSIM-IMPCAB,
      *>-> Imprime cabeçalho de linhas de produtos do cliente/fornecedor
                 PERFORM          PRCL-IMPSIM-IMPOBS-LPR-CAB,
              END-IF,
      *>-> Percorre as linhas de produtos do cadastro
              PERFORM             WITH TEST BEFORE
                 VARYING          WRCL-SEQ FROM 1 BY 1
                    UNTIL         WRCL-SEQ IS GREATER THAN W78-LPROBC OR
                                 (WFB-TPF(WRCL-SEQ) IS EQUAL TO ZEROS AND WFB-PRO(WRCL-SEQ) IS EQUAL TO ZEROS)
      *>-> Se deve saltar a página
                 IF WGL-NLA IS GREATER THAN (WGL-NLIM - 5)
      *>-> Se classifica por algum grupo
                    IF WSLI-GRPCLA-SIM
      *>-> Indica que não deve listar a linha do grupo de cadastro
                       SET WRCL-LINGRP-NAO TO TRUE,
                    END-IF,
      *>-> Se for Relatório de 160 colunas
                    IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                       PERFORM    PRN-SPH160,
                    ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                       PERFORM    PRN-SPH132,
                    END-IF,
                    PERFORM       PRCL-IMPSIM-IMPCAB,
      *>-> Imprime cabeçalho de linhas de produtos do cliente/fornecedor
                    PERFORM       PRCL-IMPSIM-IMPOBS-LPR-CAB,
                 END-IF,
      *>-> Inicia linha de impressão
                 MOVE SPACES TO   LP-LISPRO,
      *>-> Se foi lido código só grupo
                 IF WFB-TPF(WRCL-SEQ) IS NOT EQUAL TO ZEROS AND
                    WFB-STF(WRCL-SEQ) IS EQUAL TO ZEROS
      *>-> Move código do grupo para chave e linha de impressão
                    MOVE WFB-TPF(WRCL-SEQ) TO RET-COD, LP-CODGRU,
      *>-> Lê tabela de grupos
                    PERFORM       LER-TPE-TPF,
      *>-> Move a decrição para a linha
                    MOVE RET-D03  TO LP-DESGRU,
                 END-IF,
      *>-> Se foi informado o subgrupo
                 IF WFB-STF(WRCL-SEQ) IS NOT EQUAL TO ZEROS
      *>-> Move código do grupo para chave e linha de impressão
                    MOVE WFB-TPF(WRCL-SEQ) TO RET-TPF, LP-CODGRU,
      *>-> Move código do subgrupo para chave e linha de impressão
                    MOVE WFB-STF(WRCL-SEQ) TO RET-STF, LP-CODSUB,
      *>-> Lê tabela de subgrupos
                    PERFORM       LER-TPE-STF,
      *>-> Move a decrição para a linha
                    MOVE RET-D18  TO LP-DESGRU,
                 END-IF,
      *>-> Se foi lido um produto
                 IF WFB-PRO(WRCL-SEQ) IS NOT EQUAL TO ZEROS
      *>-> Move código do produto para chave e linha de impressão
                    MOVE WFB-PRO(WRCL-SEQ) TO NPRO-COD, LP-CODPRO,
      *>-> Faz leitura do produto ignorando bloqueio
                    MOVE "READ NPRODU KEY NPRO-CHA IGNORE LOCK EXBMSG" TO WARQ-CMD,
                    PERFORM       ARQ-COMANDO-MK-CHA,
      *>-> Move a decrição para a linha
                    MOVE NPRO-DES TO LP-DESPRO,
                 END-IF,
      *>-> Move quantidade potencial
                 MOVE WFB-QPT(WRCL-SEQ) TO WQED-NUM,
                 SET WQED-NORBWZ  TO TRUE,
                 PERFORM          PRG-EDTQTD,
                 MOVE WQED-X11 TO LP-QTDPOT,
      *>-> Move quantidade comprometida
                 MOVE WFB-QCP(WRCL-SEQ) TO WQED-NUM,
                 SET WQED-NORBWZ  TO TRUE,
                 PERFORM          PRG-EDTQTD,
                 MOVE WQED-X11 TO LP-QTDCPM,
      *>-> Move linha de impressão
                 MOVE LP-LISPRO   TO WGL-LG,
      *>-> Imprime a linha secundária
                 PERFORM          PRN-IMPLIS,
              END-PERFORM,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime cabeçalho de linhas de produtos do cliente/fornecedor
       PRCL-IMPSIM-IMPOBS-LPR-CAB.
      *>-> Move literal de cabeçalho
           MOVE    "Linhas de produtos: Grupo_Subgrupo_Descricao do grupo/subgrupo__Produto_Descricao do produto_______"
      &            "_____Qtd.potenc.__Qt.compr." TO WGL-LG(7:).
      *>-> Carrega o nome das colunas secundárias na tabela de colunas
           PERFORM                PRN-CARNOS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Processa as notas do cliente/fornecedor, totalizando o valor.................................................
       PRCL-IMPSIM-IMPCAD-NOF.
      *>-> Inicializa acumulador do valor
           MOVE    ZEROS     TO   WRCL-ACUNOT.
      *>-> Abre filtros da seleção padrão
           PERFORM                SLNOFTAB-ABRE-FILTROS.
      *>-> Código do cliente/fornecedor
           MOVE    W78-NOFTAB-FNOF-COD TO WSLNOFTAB-CAM.
           MOVE    FCAD-COD  TO   WSLNOFTAB-ININUI.
           PERFORM                SLNOFTAB-ADDFIL-IGUAL.
      *>-> Data do movimento da nota
           MOVE    W78-NOFTAB-FNOF-DTM TO WSLNOFTAB-CAM.
           MOVE    WSLI-DATINI TO WSLNOFTAB-INIDAT.
           MOVE    WSLI-DATFIN TO WSLNOFTAB-FINDAT.
           PERFORM                SLNOFTAB-ADDFIL-ENTRE.
      *>-> Situação da nota - Não processa notas canceladas
           MOVE    W78-NOFTAB-FNOF-SIT TO WSLNOFTAB-CAM.
           MOVE    W78-NOFTAB-FNOF-SITCAN TO WSLNOFTAB-ENU(01).
           PERFORM                SLNOFTAB-ADDFIL-ENUM-EXC.
      *>-> Varre os registros do arquivo de notas do financeiro
           SET     WSLNOFTAB-PRCNAO TO TRUE.
           PERFORM                SLNOFTAB-START-NLESS.
           PERFORM                UNTIL EXIT
              PERFORM             SLNOFTAB-READ-NEXT,
      *>-> Se não leu OK
              IF NOT FS-NOF-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Se for nota do tipo devolução
              IF FNOF-TIPDEV
      *>-> Diminui do total de faturamento do cadastro
                 SUBTRACT FNOF-VAL FROM WRCL-ACUNOT,
              ELSE,
                 ADD FNOF-VAL TO  WRCL-ACUNOT,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Executa rotina para imprimir cadastros.......................................................................
       PRCL-IMPSIM-IMPCAD-FAT.
      *>-> Move código
           MOVE    FCAD-COD  TO   WL-COD.
      *>-> Move descrição
           MOVE    FCAD-DES  TO   WL-DES.
      *>-> Move tipo de cadastro
           MOVE    FCAD-TIP  TO   WL-TIP.
      *>-> Move Telefone comercial 1
           MOVE    FCAD-FON  TO   WFON-NUM.
      *>-> Se não possui telefone comercial
           IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
              MOVE FCAD-FO2  TO   WFON-NUM,
           END-IF.
      *>-> Se não possui nenhum dos números acima
           IF WFON-NUM IS EQUAL TO ZEROS
              MOVE FCAD-FAX  TO   WFON-NUM,
           END-IF.
      *>-> Se não possui nenhum dos números acima
           IF WFON-NUM IS EQUAL TO ZEROS
              MOVE FCAD-CEL  TO   WFON-NUM,
           END-IF.
           PERFORM                PRG-EDTFON.
           MOVE    WFON-X12  TO   WL-FON.
      *>-> Move zona de venda
           MOVE    FCAD-ZON  TO   WL-ZON.
      *>-> Se for classificado ou sub-clas. por representante
           IF WSLI-GRPCLA-REP OR WSLI-GRPCLA-CPR OR WSLI-GRPCLA-CVD OR
              WSLI-SGRCLA-REP OR WSLI-SGRCLA-CPR OR WSLI-SGRCLA-CVD
      *>-> Valor.a EDitar - edição NORmal c/Blank When Zero
              SET  WVED-NORBWZ    TO TRUE,
              MOVE FCAD-DIV  TO   WVED-NUM  , *> Move o valor a edit
              PERFORM             PRG-EDTVLE, *> Faz a edição de val
              MOVE WVED-X14  TO   WL-DIV,     *> Retorna val.editado
           ELSE,
      *>-> Move representante
              MOVE FCAD-REP  TO   WL-REP,
      *>-> Busca a descrição abreviada do representante
              MOVE FCAD-REP  TO   RET-COD,
              PERFORM             LER-TPE-REP,
              MOVE RET-ABV   TO   WL-ABR,
           END-IF.
      *>-> Abre filtros da seleção padrão
           PERFORM                SLNOFTAB-ABRE-FILTROS.
      *>-> Código do cliente/fornecedor
           MOVE    W78-NOFTAB-FNOF-COD TO WSLNOFTAB-CAM.
           MOVE    FCAD-COD  TO   WSLNOFTAB-ININUI.
           PERFORM                SLNOFTAB-ADDFIL-IGUAL.
      *>-> Seta ordem para buscar a primeira data de movimento do cadastro
           MOVE    W78-NOFTAB-ORDCHC TO WSLNOFTAB-ORD(01).
           PERFORM                SLNOFTAB-SET-ORDEM.
      *>-> Busca o primeiro registro válido
           SET     WSLNOFTAB-PRCNAO TO TRUE.
           PERFORM                SLNOFTAB-START-NLESS.
           PERFORM                SLNOFTAB-READ-NEXT.
      *>-> Se encontrou registro no arquivo de notas
           IF FS-NOF-OK
      *>-> Edita a data de movimento
              MOVE FNOF-DTM  TO   W-DTANO4,
              PERFORM             EDITA-DATAS,
              MOVE WM-M2     TO   WL-MEP,
              MOVE WM-A2     TO   WL-ANP,
           END-IF.
      *>-> Busca valor máximo para o campo de data de movimento
           MOVE    W78-NOFTAB-FNOF-DTM TO WSLNOFTAB-CAM.
           MOVE    W78-NOFTAB-ORDCHC TO WSLNOFTAB-ORD(01).
           SET     WSLNOFTAB-PRCNAO TO TRUE.
           PERFORM                SLNOFTAB-BUSCA-MAXIMO.
      *>-> Se encontrou registro no arquivo de notas
           IF FS-NOF-OK
      *>-> Edita a data de movimento
              MOVE FNOF-DTM  TO   W-DTANO4,
              PERFORM             EDITA-DATAS,
              MOVE WM-M2     TO   WL-MEU,
              MOVE WM-A2     TO   WL-ANU,
           END-IF.
      *>-> Se for classificado por grupo ou subgrupo de cadastro
           IF WSLI-GRPCLA-GRC OR WSLI-SGRCLA-GRC
      *>-> Edita o valor de limite de crédito
              MOVE FCAD-CRE  TO   WVED-NUM,
              PERFORM             PRG-EDTVAL-BWZ,
              MOVE WVED-X11  TO   WL-CRE,
           ELSE,
      *>-> Move grupo de cadastro
              MOVE FCAD-GRP  TO   WL-GRP,
      *>-> Busca a descrição abreviada do grupo
              MOVE FCAD-GRP  TO   RFT-COD,
              PERFORM             LER-TGE-GRC,
              MOVE RFT-A03   TO   WL-ABG,
           END-IF.
      *>-> Move endereço
           MOVE    FCAD-END  TO   WL-END.
      *>-> Move dados para linha de impressão
           MOVE    WL-DETALHE TO  WGL-LG, WRCL-WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> 2ª linha de impressão........................................................................................
       PRCL-IMPSIM-IMPCAD-FAT2.
      *>-> Move as propriedades das células
           MOVE    "A001,A009,A061,A062,A069,A070,A077,A101,A115" TO WGL-LINPRP.
      *>-> Carrega as propriedades da linha secundária
           PERFORM                PRN-CARSEC.
      *>-> Move encarregado comercial
           IF MK-UCFSIM OR FCAD-TINJUR
              MOVE FCAD-TIT  TO   WL-TIT,
           ELSE,
              MOVE SPACES    TO   WL-TIT,
           END-IF.
      *>-> Se código do preposto não zerado e não for grupo ou subgrupo de classificação por preposto
           IF FCAD-CPR IS NOT EQUAL TO ZEROS AND
              NOT (WSLI-GRPCLA-CPR OR WSLI-SGRCLA-CPR)
      *>-> Move código do preposto
              MOVE "Prp:"    TO   WL-LPR,
              MOVE FCAD-CPR  TO   WL-CPR,
           END-IF.
      *>-> Se código do vendedor zerado e não for grupo ou subgrupo de classificação por vendedor
           IF FCAD-CVD IS NOT EQUAL TO ZEROS AND
              NOT (WSLI-GRPCLA-CVD OR WSLI-SGRCLA-CVD)
      *>-> Move código do vendedor
              MOVE "Ve:"     TO   WL-LVE,
              MOVE FCAD-CVD  TO   WL-CVD,
           END-IF.
      *>-> Se código do grupo de empresas/holding
           IF FCAD-HOL IS NOT EQUAL TO ZEROS
      *>-> Move código do grupo de empresas/holding
              MOVE "G.Emp:"  TO   WL-LGE,
              MOVE FCAD-HOL  TO   WL-HOL, RET-COD,
      *>-> Lê tab.Holdings/Grupo Empresas
              PERFORM             LER-TPE-HOL,
              MOVE RET-ABO   TO   WL-DHO,
           END-IF.
      *>-> Move bairro
           MOVE    FCAD-BAI  TO   WL-BAI.
      *>-> Se for classificado por grupo de UF/Cidade
           IF WSLI-GRPCLA-UFC
      *>-> Apura valor líquido pago para o cadastro a partir dos documentos (total pago + juros - descontos)
              PERFORM             PRCL-IMPSIM-IMPCAD-APUVLP,
      *>-> Move total pago + juros - desconto
              MOVE WRCL-TOTAL   TO   WL-TOT,
           ELSE,
      *>-> Move cidade
              MOVE FCAD-CID  TO   WL-CID,
      *>-> Move estado
              MOVE FCAD-EST  TO   WL-EST,
           END-IF.
      *>-> Move dados para linha de impressão
           MOVE    WL-LINHA2 TO   WGL-LG.
      *>-> Exporta a linha secundária
           PERFORM                PRN-IMPLIS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Apura valor líquido pago para o cadastro a partir dos documentos (total pago + juros - descontos)............
       PRCL-IMPSIM-IMPCAD-APUVLP.
      *>-> Inicializa total auxiliar - total pago + juros - desconto
           MOVE    ZEROS     TO   WRCL-TOTAL.
      *>-> Abre filtros da seleção padrão
           PERFORM                SLDOCTAB-ABRE-FILTROS.
      *>-> Seta defaults da seleção padrão de documentos financeiros
           PERFORM                SLDOCTAB-SET-DEFAULTS.
      *>-> Código do cliente/fornecedor
           MOVE    W78-DOCTAB-FDOC-COD TO WSLDOCTAB-CAM.
           MOVE    FCAD-COD  TO   WSLDOCTAB-ININUI.
           PERFORM                SLDOCTAB-ADDFIL-IGUAL.
      *>-> Situação de pagamento do documento
           MOVE    W78-DOCTAB-FDOC-SIT TO WSLDOCTAB-CAM.
           MOVE    W78-DOCTAB-FDOC-SITPAG TO WSLDOCTAB-ENU(01).
           PERFORM                SLDOCTAB-ADDFIL-ENUM.
      *>-> Data de pagamento (considera apenas pagamentos em Real, ou seja, a partir de 01/07/1994)
           MOVE    W78-DOCTAB-FDOC-PAG TO WSLDOCTAB-CAM.
           MOVE    X"07C10701" TO WSLDOCTAB-INIDAT.
           MOVE    W78-DTMAX TO   WSLDOCTAB-FINDAT.
           PERFORM                SLDOCTAB-ADDFIL-ENTRE.
      *>-> Varre os registros do arquivo de documentos do financeiro
           SET     WSLDOCTAB-PRCNAO TO TRUE.
           PERFORM                SLDOCTAB-START-NLESS.
           PERFORM                UNTIL EXIT
      *>-> Lê os documentos
              PERFORM             SLDOCTAB-READ-NEXT,
      *>-> Se não leu OK
              IF NOT FS-DOC-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Adiciona valor ao total
              ADD  FDOC-VAL  TO   WRCL-TOTAL,
      *>-> Adiciona Juros ao total
              ADD  FDOC-JUR  TO   WRCL-TOTAL,
      *>-> Subtrai desconto do total
              SUBTRACT FDOC-DSC FROM WRCL-TOTAL,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotina para impressão dos itens de serviço...................................................................
       PRCL-IMPSIM-IMPCAD-IMPITE.
           MOVE    SPACES    TO   WL-ITENS.
      *>-> Inicializa o total dos descontos especial e para pagto. vencto.
           MOVE    LOW-VALUES TO  WRCL-TOTDDE.
           MOVE    ZEROS     TO   WRCL-DESPAG, WRCL-TOTDEP.
      *>-> Se superou o limite físico do formulário
           IF WGL-NLA IS GREATER THAN (WGL-NLIM - 6)
      *>-> Se for Relatório de 160 colunas
              IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                 PERFORM          PRN-SPH160,
              ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                 PERFORM          PRN-SPH132,
              END-IF,
              PERFORM             PRCL-IMPSIM-IMPCAB,
      *>-> Restaura a linha do cliente
              MOVE WRCL-WGL-LG TO WGL-LG,
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIN,
           END-IF.
      *>-> Imprime cabeçalho itens de serviço
           PERFORM                PRCL-IMPSIM-IMPCAD-IMPITE-CAB.
      *>-> Move data de emissão
           MOVE    ANFS-EMI  TO   W-DTANO4.
           PERFORM                EDITA-DATAS.
           MOVE    WM-A2     TO   WL-AEM.
           MOVE    WM-M2     TO   WL-MEM.
           MOVE    WM-D2     TO   WL-DEM.
      *>-> Valor liquido a EDitar - edição normal c/blank when zero
           SET     WVED-NORBWZ TO TRUE.
           MOVE    ANFS-LQD  TO   WVED-NUM.
           PERFORM                PRG-EDTVLE.
           MOVE    WVED-X13  TO   WL-LIQ.
      *>-> Lista itens da nota de serviço.
           PERFORM                WITH TEST BEFORE
              VARYING             WRCL-ISE FROM 1 BY 1
                 UNTIL            WRCL-ISE IS GREATER THAN ANFS-OCO
      *>-> Código do serviço/despesa a testar no filtro de itens
              MOVE WAITS-CSE(WRCL-ISE) TO WSRIVSE-CODSER,
      *>-> Validação de item da nota fiscal de serviço (Somente selecionados)
              PERFORM             SRIVSE-VALITS,
      *>-> Se ignora o item da nota fiscal de serviço
              IF WSRIVSE-VALITS-IGN
      *>-> Vai para o próximo item
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Se superou o limite físico do formul.e ainda tem itens a listar
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 4) AND
                 WRCL-ISE IS LESS THAN ANFS-OCO
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
                 PERFORM          PRCL-IMPSIM-IMPCAB,
      *>-> Restaura a linha do cliente
                 MOVE WRCL-WGL-LG TO WGL-LG,
      *>-> Imprime a linha
                 PERFORM          PRN-IMPLIN,
      *>-> Imprime cabeçalho itens de serviço
                 PERFORM          PRCL-IMPSIM-IMPCAD-IMPITE-CAB,
              END-IF,
      *>-> Move o código do serviço
              MOVE WAITS-CSE(WRCL-ISE) TO WL-CSE,
      *>-> Move o descrição do serviço
              MOVE WAITS-DSE(WRCL-ISE) TO WL-SER,
      *>-> Move o se o item é FIXo ou variável
              IF WAITS-FIXSIM(WRCL-ISE)
                 MOVE "S"    TO   WL-FIX,
              ELSE,
                 MOVE "N"    TO   WL-FIX,
              END-IF,
      *>-> Indica edição normal c/Blank When Zero
              SET  WVED-NORBWZ TO TRUE,
      *>-> Edição do valor
              MOVE WAITS-VAL(WRCL-ISE) TO WVED-NUM,
              PERFORM             PRG-EDTVLE,
              MOVE WVED-X13  TO   WL-VAL,
      *>-> Se o percentual de desconto não estiver zerado
              IF WAITS-DESSIM(WRCL-ISE) AND
                 ANFS-PDE IS NOT EQUAL TO ZEROS
      *>-> Calcula valor do desconto para pagto. no vencimento
                 COMPUTE WRCL-DESPAG = ANFS-PDE * WAITS-VAL(WRCL-ISE) / 100
      *>-> Acumula o valor do desconto para pagto. no vencimento
                 ADD WRCL-DESPAG  TO WRCL-TOTDEP,
              ELSE,
      *>-> Zera variável do valor o desconto para pagto. no vencimento
                 MOVE ZEROS  TO   WRCL-DESPAG,
              END-IF,
      *>-> Indica edição normal c/Blank When Zero
              SET  WVED-NORBWZ TO TRUE,
      *>-> Edição do desconto a editar
              MOVE WRCL-DESPAG TO WVED-NUM,
              PERFORM             PRG-EDTVLE,
              MOVE WVED-X13  TO   WL-VDE,
      *>-> Move dados para linha de impressão
              MOVE WL-ITENS  TO   WGL-LG,
      *>-> Imprime a linha secundária
              PERFORM             PRN-IMPLIS,
      *>-> Limpa linha de impressão de itens de serviços
              MOVE SPACES    TO   WL-ITENS,
      *>-> Se tiver Ano/Mês de AGendamento
              IF WAITS-PAG(WRCL-ISE) IS NOT EQUAL TO LOW-VALUES
                 MOVE 1      TO   W-D4,
                 MOVE WAITS-PAG(WRCL-ISE) TO W-PEANO4,
                 PERFORM          EDITA-DATAS,
                 MOVE WM-PEANO2   TO WL-AG-PAG,
      *>-> Se for agendamento em valor
                 IF WAITS-VAG(WRCL-ISE) IS NOT EQUAL TO ZEROS
                    SET LITPG1-VAL TO TRUE,
      *>-> Valor liquido a EDitar - edição NORmal c/Blank When Zero
                    SET WVED-NORBWZ TO TRUE,
                    MOVE WAITS-VAG(WRCL-ISE) TO WVED-NUM,
                    PERFORM       PRG-EDTVLE,
                    MOVE WVED-X13 TO WL-AG-VAG,
                 ELSE,
                    SET LITPG1-IND TO TRUE,
      *>-> Valor liquido a EDitar - edição NORmal c/Blank When Zero
                    SET WVED-NORBWZ TO TRUE,
                    MOVE WAITS-QIA(WRCL-ISE) TO WVED-NUM,
                    PERFORM       PRG-EDTVLE,
                    MOVE WVED-X13 TO WL-AG-VAG,
                 END-IF,
      *>-> Se tiver valor e índice
                 IF WAITS-VAG(WRCL-ISE) IS NOT EQUAL TO ZEROS AND
                    WAITS-TIA(WRCL-ISE) IS NOT EQUAL TO ZEROS
                    MOVE "/" TO   WL-AG-BAR,
                    MOVE WAITS-TIA(WRCL-ISE) TO WL-AG-TIA,
                    MOVE "-" TO   WL-AG-HIF,
                    MOVE WAITS-TIA(WRCL-ISE) TO W-IDV,
                    MOVE WDK-NIP(W-IDV) TO WL-AG-IND,
                    IF WAITS-AGFSIM(WRCL-ISE)
                       MOVE "S"   TO WL-AG-AFV,
                    ELSE,
                       MOVE "N"   TO WL-AG-AFV,
                    END-IF,
                 END-IF,
      *>-> Se tiver somente valor
                 IF WAITS-VAG(WRCL-ISE) IS NOT EQUAL TO ZEROS AND
                    WAITS-TIA(WRCL-ISE) IS EQUAL TO ZEROS
                    MOVE ZEROS TO WL-AG-TIA,
                    IF WAITS-AGFSIM(WRCL-ISE)
                       MOVE "S"   TO WL-AG-AFV,
                    ELSE,
                       MOVE "N"   TO WL-AG-AFV,
                    END-IF,
                 END-IF,
      *>-> Se tiver somente índice
                 IF WAITS-VAG(WRCL-ISE) IS EQUAL TO ZEROS AND
                    WAITS-TIA(WRCL-ISE) IS NOT EQUAL TO ZEROS
                    MOVE "/" TO   WL-AG-BAR,
                    MOVE WAITS-TIA(WRCL-ISE) TO WL-AG-TIA,
                    MOVE "-" TO   WL-AG-HIF,
                    MOVE WAITS-TIA(WRCL-ISE) TO W-IDV,
                    MOVE WDK-NIP(W-IDV) TO WL-AG-IND,
                    IF WAITS-AGFSIM(WRCL-ISE)
                       MOVE "S"   TO WL-AG-AFV,
                    ELSE,
                       MOVE "N"   TO WL-AG-AFV,
                    END-IF,
                 END-IF,
      *>-> Move dados para linha de impressão - Agendamento
                 MOVE WL-AGENDA   TO WGL-LG,
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
                 PERFORM          PRCL-IMPSIM-EXLMES,
              END-IF,
              PERFORM             WITH TEST BEFORE
                 VARYING          WAONS-IDE FROM 1 BY 1
                    UNTIL         WAONS-IDE IS GREATER THAN W78-NOCDDE
      *>-> Se possui desconto no item
                 IF WAONS-ITMVDE(WRCL-ISE) LESS THAN WAITS-VAL(WRCL-ISE) AND
                    WAONS-VDE(WRCL-ISE, WAONS-IDE) NOT EQUAL TO ZEROS AND
                    WAITS-VAL(WRCL-ISE) IS NOT EQUAL TO ZEROS
      *>-> Acumula o valor do desconto especial
                    ADD WAONS-VDE(WRCL-ISE, WAONS-IDE) TO WRCL-TOTDES(WAONS-IDE),
                 END-IF,
              END-PERFORM,
           END-PERFORM.
           PERFORM                WITH TEST BEFORE
              VARYING             WAONS-IDE FROM 1 BY 1
                 UNTIL            WAONS-IDE IS GREATER THAN W78-NOCDDE
      *>-> Se possui desconto especial
              IF WRCL-TOTDES(WAONS-IDE) IS NOT EQUAL TO ZEROS
      *>-> Limpa linha de agendamento
                 MOVE SPACES TO   WL-ITENS,
      *>-> Move desconto
                 IF WAONS-DDE(WAONS-IDE) IS EQUAL TO SPACES
                    MOVE WAONS-IDE TO W-NUI01,
                    STRING        "*** ", W-NUI01, "o.Desconto Especial:", DELIMITED BY SIZE
                       INTO       WL-SER,
                 ELSE,
                    MOVE WAONS-DDE(WAONS-IDE) TO WL-SER,
                 END-IF,
      *>-> Desconto.a EDitar - edição NORmal c/Blank When Zero
                 SET WVED-NORBWZ  TO TRUE,
                 COMPUTE WVED-NUM = WRCL-TOTDES(WAONS-IDE) * -1,
                 PERFORM          PRG-EDTVLE,
                 MOVE WVED-X13 TO WL-VAL,
      *>-> Imprime a linha do item
                 MOVE WL-ITENS TO WGL-LG,
      *>-> Imprime a linha secundária
                 PERFORM          PRN-IMPLIS,
              END-IF,
           END-PERFORM.
      *>-> Se possui desconto para pagto. no vencto.
           IF WRCL-TOTDEP IS NOT EQUAL TO ZEROS
      *>-> Limpa linha de agendamento
              MOVE SPACES    TO   WL-ITENS,
              MOVE "*** Desconto p/pagto no vencimento:" TO WL-SER,
      *>-> Desconto.a editar - edição normal c/blank when zero
              SET  WVED-NORBWZ TO TRUE,
              MOVE WRCL-TOTDEP TO WVED-NUM,
              PERFORM             PRG-EDTVLE,
              MOVE WVED-X13  TO   WL-VDE,
      *>-> Imprime a linha do item
              MOVE WL-ITENS  TO   WGL-LG,
      *>-> Imprime a linha secundária
              PERFORM             PRN-IMPLIS,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime cabeçalho itens de serviço...........................................................................
       PRCL-IMPSIM-IMPCAD-IMPITE-CAB.
      *>-> Move as propriedades das células
           MOVE    "A001,A016,A025,N039,A103,N1062,N1202" TO WGL-LINPRP.
      *>-> Carrega as propriedades da linha secundária
           PERFORM                PRN-CARSEC.
           MOVE    "               Dt.Emiss_Vl.Liq.Descon_Servico______________________________________________________"
      &            "___Fix________Valor_Desc.Pg.Vecto" TO WGL-LG.
      *>-> Carrega o nome das colunas secundárias na tabela de colunas
           PERFORM                PRN-CARNOS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotina para impressão dos dados para liberação...............................................................
       PRCL-IMPSIM-IMPCAD-LIBER.
      *>-> Seta que não tem registro a listar
           SET     WRCL-LISREC-NAO TO  TRUE.
      *>-> Move o código do cliente
           MOVE    FCAD-COD  TO   WYDLC-CLI.
           PERFORM                PDLC-LER-YDLCLI.
      *>-> Percorre as sequências
           PERFORM                WITH TEST BEFORE
              VARYING             WYDLC-ISQ FROM 1 BY 1
                 UNTIL            WYDLC-ISQ IS GREATER THAN W78-NOCSLI OR
                                  WYDLC-DLI(WYDLC-ISQ) IS EQUAL TO SPACES
      *>-> Seta que possui registo a listar
              SET  WRCL-LISREC-SIM TO  TRUE,
      *>-> Se for o primeiro registro do cliente/fornecedor
              IF WYDLC-ISQ IS EQUAL TO 1
      *>-> CODigo do cliente/fornecedor
                 MOVE FCAD-COD TO   LB-FB-COD,
      *>-> Se for ordem de processamento cadastros - fantasia
                 IF WSLCADTAB-ORDCHF
                    MOVE FCAD-FAN TO LB-FB-DES,
                 ELSE,
                    MOVE FCAD-DES TO LB-FB-DES,
                 END-IF,
                 MOVE FCAD-CID TO   LB-FB-CID,
                 PERFORM          WITH TEST BEFORE
                    VARYING       WRCL-I FROM 18 BY -1
                       UNTIL      WRCL-I IS EQUAL TO 1 OR
                                  LB-FB-CID(WRCL-I:1) NOT EQUAL TO SPACES,
                 END-PERFORM,
                 MOVE "/"    TO   LB-FB-CID(WRCL-I + 1:1),
                 MOVE FCAD-EST TO   LB-FB-CID(WRCL-I + 2:2),
      *>-> Se for cliente
                 IF FCAD-TIPCLI
                    MOVE "C" TO   LB-FB-TIP,
                 ELSE,
                    MOVE "F" TO   LB-FB-TIP,
                 END-IF,
      *>-> código do REPresentante
                 MOVE FCAD-REP TO   LB-FB-REP,
      *>-> Incrementa totalizadores
                 ADD FCAD-DIV  TO   WRCL-TOTDIV,
      *>-> Acumula o total do cadastro
                 ADD 1       TO   WRCL-TOTCOD,
              ELSE,
      *>-> A partir da licença 1, imprimir a descrição da licença
                 MOVE WYDLC-DLI(WYDLC-ISQ) TO LB-FB-DES,
              END-IF,
      *>-> SEQuencial do registro
              COMPUTE   LB-FB-SEQ = WYDLC-ISQ - 1,
      *>-> Situação da licença
              IF WYDLC-SILATI(WYDLC-ISQ)
                 MOVE "S"    TO   LB-FB-SIT,
              ELSE,
                 MOVE "Nao"    TO   LB-FB-SIT,
              END-IF,
      *>-> Número da Instalação da Licença (sequência de liberação)
              MOVE WYDLC-NIL(WYDLC-ISQ) TO LB-FB-NIL,
      *>-> Número de USuários contratados
              MOVE WYDLC-NUS(WYDLC-ISQ) TO LB-FB-NUS,
      *>-> Número de Usuários liberados Temporariamente
              MOVE WYDLC-NUT(WYDLC-ISQ) TO LB-FB-NUT,
      *>-> SIGla da nota fiscal
              MOVE WYDLC-SIG(WYDLC-ISQ) TO LB-FB-SIG,
      *>-> Distância em KM
              MOVE WYDLC-DKM(WYDLC-ISQ) TO LB-FB-DKM,
      *>-> Cobra DesLocamento
              IF WYDLC-CDLSIM(WYDLC-ISQ)
                 MOVE " S "  TO   LB-FB-CDL,
              ELSE,
                 MOVE "Nao"  TO   LB-FB-CDL,
              END-IF,
      *>-> Se o tipo de SO do servidor tem valor válido
              IF WYDLC-TSR-OK(WYDLC-ISQ)
                 MOVE WYDLC-TSR(WYDLC-ISQ) TO W-IDV,
      *>-> Move completa
                 MOVE WSVR-DESSOP(W-IDV + 1) TO LB-FB-TSR,
              END-IF,
      *>-> Permite Liberação pela Internet
              EVALUATE            WYDLC-PLI(WYDLC-ISQ)
                 WHEN 1
                    MOVE " S " TO LB-FB-PLI,
                 WHEN 2
                    MOVE "Nao" TO LB-FB-PLI,
                 WHEN 9
                    MOVE "Rev" TO LB-FB-PLI,
              END-EVALUATE,
      *>-> Lista usuário nos relatórios
              IF WYDLC-LURSIM(WYDLC-ISQ)
                 MOVE " S "  TO   LB-FB-LUR,
              ELSE,
                 MOVE "Nao"  TO   LB-FB-LUR,
              END-IF,
      *>-> Testa o volume do sistema
              IF WYDLC-TV32SIM(WYDLC-ISQ)
                 MOVE " S "  TO   LB-FB-TV32,
              ELSE,
                 MOVE "Nao"  TO   LB-FB-TV32,
              END-IF,
      *>-> Se a data da liberação não estiver em branco
              IF WYDLC-DTL(WYDLC-ISQ) IS NOT EQUAL TO LOW-VALUES
                 MOVE WYDLC-DIL(WYDLC-ISQ) TO LB-FB-DIL,
                 MOVE WYDLC-MEL(WYDLC-ISQ) TO LB-FB-MEL,
                 MOVE WYDLC-ANL(WYDLC-ISQ) TO LB-FB-ANL,
              END-IF,
      *>-> Telefone comercial
              MOVE FCAD-FON  TO   WFON-NUM,
      *>-> Se não possui telefone comercial
              IF WFON-NUM IS EQUAL TO ZEROS
      *>-> Move o segundo telefone comercial
                 MOVE FCAD-FO2 TO   WFON-NUM,
              END-IF,
      *>-> Se não possui nenhum dos números acima
              IF WFON-NUM IS EQUAL TO ZEROS
                 MOVE FCAD-FAX TO   WFON-NUM,
              END-IF,
      *>-> Se não possui nenhum dos números acima
              IF WFON-NUM IS EQUAL TO ZEROS
                 MOVE FCAD-CEL TO   WFON-NUM,
              END-IF,
      *>-> Faz a edição do número do telefone
              PERFORM             PRG-EDTFON,
              MOVE WFON-X12  TO   LB-FB-FON,
      *>-> GRuPo de cadastro
              MOVE FCAD-GRP  TO   LB-FB-GRP,
      *>-> Conceito
              MOVE WYDLC-CON(WYDLC-ISQ) TO LB-FB-CON,
      *>-> Bloqueia a atualização do cliente
              IF WYDLC-BQASIM(WYDLC-ISQ)
                 MOVE " S "  TO   LB-FB-BAT,
              ELSE,
                 MOVE "Nao"  TO   LB-FB-BAT,
              END-IF,
      *>-> Se for o primeiro registro do cliente/fornecedor
              IF WYDLC-ISQ IS EQUAL TO 1
                 MOVE LB-DADLIB   TO WRCL-WGL-LG,
      *>-> Se superou o limite físico do formulário
                 IF WGL-NLA IS GREATER THAN (WGL-NLIM - 7)
      *>-> Se for Relatório de 160 colunas
                    IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                       PERFORM    PRN-SPH160,
                    ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                       PERFORM    PRN-SPH132,
                    END-IF,
                    PERFORM       PRCL-IMPSIM-IMPCAB,
                 END-IF,
              END-IF,
      *>-> Se superou o limite físico do formulário
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 6)
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
                 PERFORM          PRCL-IMPSIM-IMPCAB,
              END-IF,
              MOVE LB-DADLIB TO   WGL-LG,
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIN,
              MOVE SPACES    TO   LB-DADLIB,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime os recursos ativos que estão em posse do cadastro....................................................
       PRCL-IMPSIM-IMPCAD-REA.
      *>-> Busca recursos ativos do cadastro
           PERFORM                PRCL-IMPSIM-BUSCA-REA.
      *>-> Inicializa o ponteiro para concatenar
           MOVE    8         TO   W-POINTE.
      *>-> Posiciona para ler os recursos do cadastro
           MOVE    LOW-VALUES TO  KREG-RES.
           MOVE    FCAD-COD  TO   KR-CAD.
           PERFORM                RES-START-GREATER.
           PERFORM                UNTIL NOT RES-FS-OK
              PERFORM             RES-READ-NEXT,
      *>-> Se não leu ok ou trocou de cadastro
              IF NOT RES-FS-OK OR KR-CAD IS NOT EQUAL TO FCAD-COD
      *>-> Se tem algum dado montado para imprimir
                 IF W-POINTE IS GREATER THAN 8
                    MOVE W-CODIGO TO WGL-LG,
                    PERFORM       PRN-IMPCOM,
                 END-IF,
                 MOVE SPACES TO   W-CODIGO,
                 EXIT             PERFORM,
              END-IF,
      *>-> Se for registro de total
              IF KR-COD IS EQUAL TO ZEROS
      *>-> Se tem algum dado montado para imprimir
                 IF W-POINTE IS GREATER THAN 8
                    MOVE W-CODIGO TO WGL-LG,
                    PERFORM       PRN-IMPCOM,
                 END-IF,
                 MOVE SPACES TO   W-CODIGO,
                 MOVE 8      TO   W-POINTE,
      *>-> Avalia a literal que deve ser exibida
                 EVALUATE         TRUE,
      *>-> Se for registro de total geral
                    WHEN KR-CHA IS EQUAL TO HIGH-VALUES
      *>-> Concatena literal inicial do campo
                       STRING     WLT-ERC(15) DELIMITED BY SIZE
                          INTO    W-CODIGO,
                             WITH POINTER W-POINTE,
      *>-> Se for espécie de recurso - Outros
                    WHEN KR-ERCOUT
      *>-> Concatena literal inicial do campo
                       STRING     WLT-ERC(14) DELIMITED BY SIZE
                          INTO    W-CODIGO,
                             WITH POINTER W-POINTE,
                    WHEN KR-ERC-OK
      *>-> Concatena literal inicial do campo
                       STRING     WLT-ERC(KR-ERC) DELIMITED BY SIZE
                          INTO    W-CODIGO,
                             WITH POINTER W-POINTE,
                 END-EVALUATE,
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Se não for a primeira chapa da linha
              IF W-POINTE GREATER THAN (FUNCTION LENGTH(WLT-ERC(1)) + 8)
      *>-> Concatena separador entre as chapas
                 STRING           "/"
                    DELIMITED BY SIZE INTO W-CODIGO,
                       WITH POINTER W-POINTE,
              END-IF,
      *>-> Se o primeiro caracter for espaço
              IF KR-NCP(01:01) IS EQUAL TO SPACES
                 MOVE KR-NCP TO   WEDL-ENT,
      *>-> Remove espaços à esquerda do texto
                 PERFORM          PEDL-RESESQ,
                 MOVE WEDL-SAI TO KR-NCP,
              END-IF,
      *>-> Define o tamanho do campo da chapa
      *>-> Busca binária em string
              MOVE Texto:>lengthOf(KR-NCP) TO WBB-TAM,
      *>-> Concatena número da chapa
              STRING              KR-NCP(01:WBB-TAM)
                 DELIMITED BY SIZE INTO W-CODIGO,
                    WITH POINTER  W-POINTE,
      *>-> Se não mais há espaço para listar na linha de detalhe
              IF W-POINTE IS NOT LESS THAN 112
      *>-> Imprime os dados da linha
                 MOVE W-CODIGO TO WGL-LG,
                 PERFORM          PRN-IMPCOM,
      *>-> Inicializa os dados para continuar concatenando
                 COMPUTE W-POINTE = FUNCTION LENGTH(WLT-ERC(1)) + 8,
              END-IF,
           END-PERFORM.
      *>-> Se existem recursos ativos do cadastro para listar
           IF W-CODIGO IS NOT EQUAL TO SPACES
      *>-> Move dados para linha de impressão
              MOVE W-CODIGO  TO   WGL-LG,
              PERFORM             PRN-IMPLIN,
      *>-> Limpa linha detalhe
              MOVE SPACES    TO   W-CODIGO,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Busca recursos ativos do cadastro............................................................................
       PRCL-IMPSIM-BUSCA-REA.
      *>-> Se ainda não abriu o arquivo virtual de recursos por espécie
           IF RES-ABERTO-NAO
      *>-> Abre o arquivo virtual
              PERFORM             RES-OPEN,
           END-IF.
      *>-> Tipo de registro - Nota do beneficiamento
           SET     WSROVBN-B-TIPREG-NBN TO TRUE.
      *>-> Ordem de leitura da nota do beneficiamento - Cadastro/série/nota
           SET     WSROVBN-B-ORDNBN-CHN TO TRUE.
      *>-> Tipo de beneficiamento - Controle de remessas
           SET     WBNBN-TIPREM   TO TRUE.
      *>-> Cadastro da nota de beneficiamento
           MOVE    FCAD-COD  TO   WBNBN-CAD.
      *>-> Inicializa o restante da chave
           MOVE    SPACES    TO   WBNBN-SER.
           MOVE    ZEROS     TO   WBNBN-NOT.
      *>-> Posicionamento NOT LESS da tabela do beneficiamento
           PERFORM                SROVBN-B-STANLE.
      *>-> Leitura das notas do beneficiamento
           PERFORM                UNTIL EXIT
      *>-> Tipo de registro - Nota do beneficiamento
              SET  WSROVBN-B-TIPREG-NBN TO TRUE,
      *>-> Leitura sequencial da tabela do beneficiamento
              PERFORM             SROVBN-B-REANEX,
      *>-> Se não leu ok
              IF NOT WSROVBN-B-FS-OK OR NOT WBNBN-TIPREM OR WBNBN-CAD IS NOT EQUAL TO FCAD-COD
                 EXIT             PERFORM,
              END-IF,
      *>-> Inicia retorno dos itens da nota do beneficiamento
              PERFORM             SROVBN-B-INIINB,
      *>-> Leitura dos itens da nota
              PERFORM             UNTIL EXIT
      *>-> Retorna próximo item da nota do beneficiamento
                 PERFORM          SROVBN-B-RETINB,
      *>-> Se não leu ok
                 IF NOT WSROVBN-B-FS-OK
                    EXIT          PERFORM,
                 END-IF,
      *>-> Se o item não tem saldo ou não tem recurso ativo
                 IF WBIBN-SLDNAO OR WBIBN-REA IS EQUAL TO ZEROS
                    EXIT          PERFORM CYCLE,
                 END-IF,
      *>-> Lê o arquivo de recursos ativos
                 MOVE WBIBN-REA   TO IREA-COD,
                 MOVE "READ IREATI KEY IREA-CHA IGNORE LOCK" TO WARQ-CMD,
                 PERFORM          ARQ-COMANDO-MK-CHA,
      *>-> Se não encontrou registro
                 IF NOT FS-REA-OK
                    EXIT          PERFORM CYCLE,
                 END-IF,
      *>-> Grava o registro de total da espécie por cadastro
                 MOVE FCAD-COD TO KR-CAD,
                 MOVE IREA-ERC TO KR-ERC,
                 MOVE ZEROS  TO   KR-COD,
                 MOVE LOW-VALUES  TO KR-ALT,
      *>-> Grava o registro no arquivo virtual
                 PERFORM          PRCL-IMPSIM-GRVRES,
      *>-> Grava o registro individual de recurso por cadastro
                 MOVE FCAD-COD TO KR-CAD,
                 MOVE IREA-ERC TO KR-ERC,
                 MOVE IREA-COD TO KR-COD,
                 MOVE LOW-VALUES  TO KR-ALT,
      *>-> Grava o registro no arquivo virtual
                 PERFORM          PRCL-IMPSIM-GRVRES,
      *>-> Grava o registro de total geral por espécie
                 MOVE HIGH-VALUES TO KR-CHA,
                 MOVE IREA-ERC TO KR-ERC,
                 MOVE IREA-ERC TO KR-ER2,
      *>-> Grava o registro no arquivo virtual
                 PERFORM          PRCL-IMPSIM-GRVRES,
      *>-> Grava o registro de total geral dos recursos
                 MOVE HIGH-VALUES TO KR-CHA,
                 MOVE HIGH-VALUES TO KR-ALT,
      *>-> Grava o registro no arquivo virtual
                 PERFORM          PRCL-IMPSIM-GRVRES,
              END-PERFORM,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grava o registro no arquivo virtual..........................................................................
       PRCL-IMPSIM-GRVRES.
      *>-> Lê os dados já gravados
           PERFORM                RES-READ-KEY.
      *>-> Se for o primeiro total gravado
           IF NOT RES-FS-OK
              MOVE LOW-VALUES TO  KR-DAD,
           END-IF.
      *>-> Se for registro individual
           IF KR-CAX IS NOT EQUAL TO HIGH-VALUES
      *>-> Se possui chapa (alguns tipos de recurso não aceitam este campo)
              IF IREA-NCP IS NOT EQUAL TO SPACES
                 MOVE IREA-NCP TO   KR-NCP,
              ELSE,
                 MOVE IREA-COD TO   W-MZ07I,
                 MOVE W-MZ07I TO  KR-NCP,
              END-IF,
           END-IF.
      *>-> Incrementa o número de recursos desta espécie
           ADD     1         TO   KR-QTD.
      *>-> Grava/regrava o registro
           PERFORM                RES-RE-WRITE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime o cabeçalho da listagem simplificada.................................................................
       PRCL-IMPSIM-IMPCAB.
      *>-> Define o cabeçalho da listagem
           EVALUATE               TRUE,
      *>-> Cidade/Empregados/Capital Social
              WHEN WSLI-LIMCID-CEC
                 MOVE "RELAÇÃO DE TOTAIS DE EMPRESAS" TO MK-CAB-TIT,
      *>-> Cidade/Base Territorial/DDD
              WHEN WSLI-LIMCID-CBD
                 MOVE "RELAÇÃO DE CIDADES" TO MK-CAB-TIT,
      *>-> Empresa/End/Cidade/Telefone/Número de empregados
              WHEN WSLI-LIMCID-EEC
                 MOVE "RELAÇÃO DE EMPRESAS E EMPREGADOS" TO MK-CAB-TIT,
      *>-> Escritório Contabilidade/Endereço/CEP/Cidade/Fone
              WHEN WSLI-LIMCID-ECC
                 MOVE "RELAÇÃO DE ESCRITÓRIOS" TO MK-CAB-TIT,
              WHEN OTHER
                 MOVE "RELAÇÃO DE CADASTROS" TO MK-CAB-TIT,
           END-EVALUATE.
      *>-> Se for Relatório de 160 colunas
           IF WSLI-LIMCID-160
      *>-> Imprime cabeçalho de topo/usuário/empresa - 160 Colunas
              COPY                PNEMP160.CPY.
      *>-> Retorna o cabeçalho de 160 colunas
              SET  WSLCADTAB-TCB160 TO TRUE,
              PERFORM             SLCADTAB-RETCAB,
      *>-> Imprime linha de seleção
              MOVE WSLCADTAB-CAB-1 TO W-CAB-SELECAO,
              COPY                PRNLINSL.CPY.
              IF WSLCADTAB-CAB-2 IS NOT EQUAL TO SPACES
                 MOVE WSLCADTAB-CAB-2 TO W-CAB-SELECAO,
                 COPY             PRNLINSL.CPY.
                 IF WSLCADTAB-CAB-3 IS NOT EQUAL TO SPACES
                    MOVE WSLCADTAB-CAB-3 TO W-CAB-SELECAO,
                    COPY          PRNLINSL.CPY.
                 END-IF,
              END-IF,
      *>-> Imprime hífens - 160 Col.
              PERFORM             PRN-HIF160,
           ELSE,
      *>-> Imprime cabeçalho de topo/usuário/empresa - 132 Colunas
              COPY                PNEMP132.CPY.
      *>-> Retorna o cabeçalho de 132 colunas
              SET  WSLCADTAB-TCB132 TO TRUE,
              PERFORM             SLCADTAB-RETCAB,
      *>-> Imprime linha de seleção
              MOVE WSLCADTAB-CAB-1 TO W-CAB-SELECAO,
              COPY                PRNLINSL.CPY.
              IF WSLCADTAB-CAB-2 IS NOT EQUAL TO SPACES
                 MOVE WSLCADTAB-CAB-2 TO W-CAB-SELECAO,
                 COPY             PRNLINSL.CPY.
                 IF WSLCADTAB-CAB-3 IS NOT EQUAL TO SPACES
                    MOVE WSLCADTAB-CAB-3 TO W-CAB-SELECAO,
                    COPY          PRNLINSL.CPY.
                 END-IF,
              END-IF,
      *>-> Imprime hífens - 132 Col.
              PERFORM             PRN-HIF132,
           END-IF.
      *>-> Se for listagem simplificada
           IF WSRICAD-FUN-LISSIM
              EVALUATE            TRUE
                 WHEN WSLI-LIMCID-SEM
                    MOVE "____Cod_Razão Social__________________Tp_____________________________________________________"
      &                  "_______________________________________" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-LIM
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Cidade/UF_____________C.E.P.____Lim.Credito_Data"
      &                  "____Vl.Ult.Compra_Data____Vl.Mai.Compra" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-END OR WSLI-LIMCID-DVI
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Cidade/UF_______________C.E.P.____Endereço______"
      &                  "______________________Telefone Coml_Grp" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-CGC
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Cidade/UF_______________C.E.P._________CNPJ/CPF_"
      &                  "_____Inscr.Estadual__Telefone Coml__Grp" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-DIV
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Cidade/UF_______________C.E.P._________CNPJ/CPF_"
      &                  "_____Inscr.Estadual___Val.da Dívida_Grp" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-COM
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Cidade/UF_______________C.E.P._________Fone Coml"
      &                  "_Encarregado Comercial_____Vencimentos_" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-EFO
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Endereco de E-Mail______________________________"
      &                  "______________________Telefone Coml_Grp" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-ECN
                    MOVE "____Cod_Razão Social___________________Tp_____________Endereço_________________Cidade/UF_____"
      &                  "____________CNPJ________Inscr.Estadual_" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-DCC
                    MOVE "____Cod_Razão Social__________________Tp_Grp______CNPJ/CPF____________Telefone_Enc.Comercial_"
      &                  "___________BCO_Agen___Con.Corrente_____" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-LCR
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Cidade/UF________________Fone Comerc_____Fax____"
      &                  "________Limite Cred_____Val.Tot.Fat_Grp" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-LIB
                    MOVE "____Cod_Razao Social_________________Tp_Cidade/UF_______________Repr_Lic_Ati_Vl_Usu_Tm_Not___"
      &                  "Km_Des_Servidor________Int_Usu_TVol__Ult.Lib___Telef.Coml_GC_CC_BAt" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-FAT
                    MOVE "____Cod_Razão Social__________________Tp__Fone Comerc_ZV_Representante__Pri/Ult.Fat_Gr.Cadast"
      &                  "ro_Endereço/Bairro_____________________" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
      *>-> Se for classificado por grupo ou subgrupo de cadastro
                    IF WSLI-GRPCLA-GRC OR WSLI-SGRCLA-GRC
                       MOVE "Lim.Crédito" TO WGL-LG(87:11),
                    END-IF,
      *>-> Se for classificado ou sub-clas. por representante
                    IF WSLI-GRPCLA-REP OR WSLI-GRPCLA-CPR OR WSLI-GRPCLA-CVD OR
                       WSLI-SGRCLA-REP OR WSLI-SGRCLA-CPR OR WSLI-SGRCLA-CVD
                       MOVE "__Valor dívida" TO WGL-LG(60:14),
                    END-IF,
      *>-> Se for classificado por grupo de UF/Cidade
                    IF WSLI-GRPCLA-UFC
                       MOVE "__Tot.Pago+Jur-Desc" TO WGL-LG(114:19),
                    END-IF,
                 WHEN WSLI-LIMCID-EBC
                    MOVE "____Cod_Razão Social_________________Tp_Repr_Cidade/UF_____________Endereço__________________"
      &                  "_______________Bairro___________Telef.Coml_Grp_Data____V.Ult.Compra" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-CFC
                    MOVE "____Cod_Razão Social_________________Tp_Repr______CNPJ/CPF______Inscr.Estadual___Ct.Ctb_Descr"
      &                  "icão da Conta__________________________" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
                 WHEN WSLI-LIMCID-ECR
                    MOVE "_Codigo_Nome Cliente____________________________Contato_________________Fone____________CNPJ_"
      &                  "______________I.Estadual______CEP______" TO WGL-LG,
      *>-> Carrega o nome das colunas principal na tabela de colunas ou imprime a linha de cabeçalho
                    PERFORM       PRN-CARNOP,
      *>-> Move as propriedades das células
                    MOVE "C001,A009,A049,A070,A073,A089,A115,A124" TO WGL-LINPRP,
      *>-> Carrega as propriedades da linha secundária
                    PERFORM       PRN-CARSEC,
                    MOVE "________Endereço________________________________Cidade_______________UF_Bairro__________Nome "
      &                  "Fantasia_____________Loc.Cob__Cond.Pag_" TO WGL-LG,
      *>-> Carrega o nome das colunas secundárias na tabela de colunas
                    PERFORM       PRN-CARNOS,
                 WHEN WSLI-LIMCID-CEC
                    MOVE "Cidade/UF______________Empresas______Empregados_________Capital______________________________"
      &                  "_______________________________________" TO WGL-LG,
                 WHEN WSLI-LIMCID-CBD
                    MOVE "Cidade/UF_______________Base Territorial_________________DDD_________________________________"
      &                  "_______________________________________" TO WGL-LG,
                 WHEN WSLI-LIMCID-EEC
                    MOVE "____Cod_Nome da Empresa_____________Endereço_______________________CEP________Cidade_________"
      &                  "______Fone_________Fax__________Num.Emp" TO WGL-LG,
                 WHEN WSLI-LIMCID-ECC
                    MOVE "____Cod_Nome da Empresa_______________Endereço_______________________CEP________Cidade_______"
      &                  "________Fone_________Fax_______________" TO WGL-LG,
                 WHEN WSLI-LIMCID-CAL
                    MOVE "Cod.Altern___Razão Social_____________________Endereço_________________________________Fone__"
      &                  "_______Grp.Cadastr_Ult.Comp__V.Ult.Comp" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(14:13),
                    END-IF,
                 WHEN WSLI-LIMCID-CRT
                    MOVE "Código__Razão Social_____________________Tp_Cidade_______________UF_Telefone_______Encarregad"
      &                  "o comercial_____Grp_Grupo___Maior compra__Total faturado__Últ.Comp" TO WGL-LG,
      *>-> Se selecionou para listar nome fantasia
                    IF WSLI-IDECAD-FAN
                       MOVE "Nome Fantasia" TO WGL-LG(9:13),
                    END-IF,
              END-EVALUATE,
      *>-> Se não for listagem que já imprimiu o cabeçalho
              IF NOT WSLI-LIMCID-ECR
      *>-> Carrega o nome das colunas principal na tabela de colunas ou imprime a linha de cabeçalho
                 PERFORM          PRN-CARNOP,
              END-IF,
           END-IF.
      *>-> Se classifica por algum grupo e for o mesmo grupo
           IF WSLI-GRPCLA-SIM AND WRCL-LINGRP-SIM AND
            ((NOT WSLI-GRPCLA-CUF AND WRCL-GRPAUX IS EQUAL TO WRCL-GRPAU2) OR
             (    WSLI-GRPCLA-CUF AND WRCL-FCAD-EST IS EQUAL TO FCAD-EST  ) OR
             (    WSLI-GRPCLA-ESC AND WRCL-FB-ECA IS EQUAL TO WRCL-FB-EC2) OR
             (    WSLI-GRPCLA-ZON AND WRCL-FCAD-CZM IS EQUAL TO FCAD-CZM))
      *>-> Imprime a linha do grupo
              PERFORM             PRCL-IMPLIN-GRUPO,
      *>-> Se classifica por U.f./Cidade
              IF WSLI-GRPCLA-UFC
      *>-> Imprime a linha do grupo da cidade
                 PERFORM          PRCL-IMPLIN-GRUPO-CID,
      *>-> Atualiza a cidade auxiliar
                 MOVE FCAD-CID TO   WRCL-FCAD-CDX,
              END-IF,
      *>-> Seta que não deve listar linha em branco
              SET  WRCL-LISBRA-NAO TO  TRUE,
      *>-> Imprime a linha do subgrupo de classificação
              PERFORM             PRCL-IMPLIN-SUB-GRUPO,
      *>-> Move os grupos de classificação
              MOVE WRCL-FB-EC2  TO   WRCL-FB-ECA,
              MOVE WRCL-GRPAU2  TO   WRCL-GRPAUX,
              MOVE WRCL-SGRAU2  TO   WRCL-SGRAUX,
              MOVE FCAD-EST  TO   WRCL-FCAD-EST,
      *>-> Move o código da zona de venda para variável auxiliar
              MOVE FCAD-ZON  TO   WRCL-FCAD-ZON,
      *>-> Move o código da micro-região para variável auxiliar
              MOVE FCAD-MRG  TO   WRCL-FCAD-MRG,
      *>-> Seta que deve listar linha em branco
              SET  WRCL-LISBRA-SIM TO  TRUE,
           ELSE,
      *>-> Se classifica por algum grupo e for o grupo de U.f./Cidade e
      *>-> a cidade auxiliar for igual a cidade lida
              IF WSLI-GRPCLA-UFC AND WRCL-FCAD-CDX EQUAL TO FCAD-CID
      *>-> Imprime a linha do grupo da cidade
                 PERFORM          PRCL-IMPLIN-GRUPO-CID,
      *>-> Atualiza a cidade auxiliar
                 MOVE FCAD-CID TO   WRCL-FCAD-CDX,
      *>-> Seta que não deve listar linha em branco
                 SET  WRCL-LISBRA-NAO  TO TRUE,
      *>-> Imprime a linha do subgrupo de classificação
                 PERFORM          PRCL-IMPLIN-SUB-GRUPO,
      *>-> Move os grupos de classificação
                 MOVE WRCL-SGRAU2 TO WRCL-SGRAUX,
      *>-> Seta que deve listar linha em branco
                 SET  WRCL-LISBRA-SIM  TO TRUE,
              ELSE,
      *>-> Se mudou sub-Grupo de classificação e não é a primeira página
                 IF WRCL-SGRAUX IS NOT EQUAL TO WRCL-SGRAU2 AND
                    MK-PAG IS NOT EQUAL TO 1
      *>-> Imprime a linha do subgrupo de classificação
                    PERFORM       PRCL-IMPLIN-SUB-GRUPO,
                    MOVE WRCL-SGRAU2 TO WRCL-SGRAUX,
                 END-IF,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime listagem detalhada...................................................................................
       PRCL-IMPDET.
      *>-> Se não há espaço livre para a impressão de mais um cadastro
           IF (WSLI-GRPCLA-NAO AND WGL-NLA GREATER THAN (WGL-NLIM - 10)) OR
              (WSLI-GRPCLA-SIM AND WGL-NLA GREATER THAN (WGL-NLIM - 12))
      *>-> Salta página
              PERFORM             PRCL-IMPDET-SALPAG,
           ELSE,
      *>-> Imprime título do grupo/subgrupo, se necessário
              PERFORM             PRCL-IMPDET-TITGRP,
           END-IF.
      *>-> Imprime os dados do cliente/fornecedor
           PERFORM                PRCL-IMPDET-IMPCAD.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Salta página.................................................................................................
       PRCL-IMPDET-SALPAG.
      *>-> Imprime hífens em 132 colunas com salto de página
           PERFORM                PRN-SPH132.
      *>-> Imprime o cabeçalho da listagem detalhada
           PERFORM                PRCL-IMPDET-IMPCAB.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime título do grupo/subgrupo, se necessário..............................................................
       PRCL-IMPDET-TITGRP.
      *>-> Se classifica por algum grupo e trocou de grupo
           IF WSLI-GRPCLA-SIM AND
            ((NOT WSLI-GRPCLA-CUF AND WRCL-GRPAUX IS NOT EQUAL TO WRCL-GRPAU2) OR
             (    WSLI-GRPCLA-CUF AND WRCL-FCAD-EST IS NOT EQUAL TO FCAD-EST  ) OR
             (    WSLI-GRPCLA-ESC AND WRCL-FB-ECA IS NOT EQUAL TO WRCL-FB-EC2) OR
             (    WSLI-GRPCLA-ZON AND WRCL-FCAD-CZM IS NOT EQUAL TO FCAD-CZM))
      *>-> Se não estiver no início da listagem e não selec.Prim/Ult.Fatura
              IF WGL-NLA IS GREATER THAN 10 AND
                 NOT WSLI-LIMCID-FAT
      *>-> Imprime linha com espaços
                 PERFORM          PRN-IMPSPC,
              END-IF,
      *>-> Imprime a linha do grupo
              PERFORM             PRCL-IMPLIN-GRUPO,
      *>-> Se classifica por U.f./Cidade
              IF WSLI-GRPCLA-UFC
      *>-> Imprime a linha do grupo da cidade
                 PERFORM          PRCL-IMPLIN-GRUPO-CID,
      *>-> Atualiza a cidade auxiliar
                 MOVE FCAD-CID TO   WRCL-FCAD-CDX,
              END-IF,
      *>-> Seta que não deve listar linha em branco
              SET WRCL-LISBRA-NAO TO   TRUE,
      *>-> Imprime a linha do subgrupo de classificação
              PERFORM             PRCL-IMPLIN-SUB-GRUPO,
      *>-> Move os grupos de classificação
              MOVE WRCL-FB-EC2  TO   WRCL-FB-ECA,
              MOVE WRCL-GRPAU2  TO   WRCL-GRPAUX,
              MOVE WRCL-SGRAU2  TO   WRCL-SGRAUX,
              MOVE FCAD-EST  TO   WRCL-FCAD-EST,
      *>-> Move o código da zona de venda para variável auxiliar
              MOVE FCAD-ZON  TO   WRCL-FCAD-ZON,
      *>-> Move o código da micro-região para variável auxiliar
              MOVE FCAD-MRG  TO   WRCL-FCAD-MRG,
      *>-> Seta que deve listar linha em branco
              SET  WRCL-LISBRA-SIM TO  TRUE,
           ELSE,
      *>-> Se classifica por algum grupo e for o grupo de U.f./Cidade e
      *>-> a cidade auxiliar não for igual a cidade lida
              IF WSLI-GRPCLA-UFC AND WRCL-FCAD-CDX NOT EQUAL TO FCAD-CID
      *>-> Se não estiver no início da listagem e não selec.Prim/Ult.Fatura
                 IF WGL-NLA IS GREATER THAN 10 AND
                    NOT WSLI-LIMCID-FAT
      *>-> Imprime linha com espaços
                    PERFORM       PRN-IMPSPC,
                 END-IF,
      *>-> Imprime a linha do grupo da cidade
                 PERFORM          PRCL-IMPLIN-GRUPO-CID,
      *>-> Seta que não deve listar linha em branco
                 SET WRCL-LISBRA-NAO   TO TRUE,
      *>-> Imprime a linha do subgrupo de classificação
                 PERFORM          PRCL-IMPLIN-SUB-GRUPO,
      *>-> Move os grupos de classificação
                 MOVE FCAD-CID TO   WRCL-FCAD-CDX,
                 MOVE WRCL-SGRAU2 TO WRCL-SGRAUX,
      *>-> Seta que deve listar linha em branco
                 SET WRCL-LISBRA-SIM   TO TRUE,
              ELSE,
      *>-> Se mudou sub-Grupo de classificação
                 IF WRCL-SGRAUX IS NOT EQUAL TO WRCL-SGRAU2
                    PERFORM       PRCL-IMPLIN-SUB-GRUPO,
                    MOVE WRCL-SGRAU2 TO WRCL-SGRAUX,
                 END-IF,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime os dados do cliente/fornecedor.......................................................................
       PRCL-IMPDET-IMPCAD.
           MOVE    SPACES    TO   W-CODIGO.
           MOVE    FCAD-COD  TO   L-FC-COD.
           MOVE    FCAD-DES  TO   L-FC-DES.
      *>-> Edita a data
           MOVE    FCAD-DTNA TO   W-DTANO4.
           PERFORM                EDITA-DATAS.
           MOVE    WM-DTANO2 TO   L-FC-DTNA.
           MOVE    SPACES    TO   L-CGCCPF.
      *>-> Se não for cli/for no EXTerior
           IF NOT FCAD-ESTEXT
      *>-> Edita o CNPJ/CPF
              MOVE FCAD-CGG  TO   WCGC-CGG,
              PERFORM             EDITA-CGCCPF,
              MOVE WCGC-X18  TO   L-CGCCPF,
           END-IF.
           MOVE    FCAD-IES  TO   L-FC-IES.
      *>-> Se for cliente
           IF FCAD-TIPCLI
              MOVE "    Cliente: " TO L-LT-COD,
           ELSE,
              MOVE " Fornecedor: " TO L-LT-COD,
           END-IF.
      *>-> Se for CNPJ
           IF FCAD-TINJUR
              IF FCAD-DTNA IS NOT EQUAL TO LOW-VALUES
                 MOVE "Data Fundacao: " TO L-LT-FUN,
              END-IF,
      *>-> Se não for cli/for no EXTerior
              IF NOT FCAD-ESTEXT
                 MOVE "CNPJ:" TO  L-LT-CGC,
              END-IF,
              MOVE "Inscr.Estad: " TO L-LT-IES,
           ELSE,
              IF FCAD-DTNA IS NOT EQUAL TO LOW-VALUES
                 MOVE "Data Nascimen: " TO L-LT-FUN,
              END-IF,
              MOVE "CPF:"    TO   L-LT-CGC,
              IF FCAD-IES IS NOT EQUAL TO SPACES
                 MOVE "Car.Identid: " TO L-LT-IES,
              END-IF,
           END-IF.
           MOVE    W-CODIGO  TO   WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
           MOVE    SPACES    TO   W-CODIGO.
           MOVE    FCAD-FAN  TO   L-FC-FAN.
      *>-> Contato
           IF MK-UCFSIM OR FCAD-TINJUR
              MOVE FCAD-TIT  TO   L-FC-TIT,
           ELSE,
              MOVE SPACES    TO   L-FC-TIT,
           END-IF.
      *>-> Se o telefone comercial 1 for válido
           IF FCAD-FON IS NOT EQUAL TO ZEROS
              MOVE "Tel.Coml:" TO L-LT-FON,
      *>-> Edição do telefone comercial 1
              MOVE FCAD-FON  TO   WFON-NUM,
              PERFORM             PRG-EDTFON,
              MOVE WFON-X14  TO   L-FC-FON,
           END-IF.
      *>-> Se o telefone comercial 2 for válido
           IF FCAD-FO2 IS NOT EQUAL TO ZEROS
              MOVE "Tel.Coml:" TO L-LT-FON,
      *>-> Edição do telefone comercial 2
              MOVE FCAD-FO2  TO   WFON-NUM,
              PERFORM             PRG-EDTFON,
              MOVE WFON-X14  TO   L-FC-FO2,
           END-IF.
      *>-> Se o fax for válido
           IF FCAD-FAX IS NOT EQUAL TO ZEROS
              MOVE "Fax:"    TO   L-LT-FAX,
      *>-> Edição do fax
              MOVE FCAD-FAX  TO   WFON-NUM,
              PERFORM             PRG-EDTFON,
              MOVE WFON-X14  TO   L-FC-FAX,
           END-IF.
           MOVE " N.Fantasia: "   TO L-LT-FAN.
      *>-> Se for CNPJ
           IF FCAD-TINJUR
              MOVE "Enc.Com: " TO L-LT-TIT,
           ELSE,
      *>-> Se utiliza Campos de Filiação para pessoa física
              IF MK-UCFSIM
                 MOVE "Nom.Pai: " TO L-LT-TIT,
              ELSE,
                 MOVE SPACES TO   L-LT-TIT,
              END-IF,
           END-IF.
           MOVE    W-CODIGO  TO   WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
           MOVE    SPACES    TO   W-CODIGO.
      *>-> Se houver dias de visita
           IF FCAD-DVI IS NOT EQUAL TO SPACES
              MOVE FCAD-DVI  TO   L-FC-DVI,
           END-IF.
           MOVE    "Dias Visita: " TO L-LT-DVI.
      *>-> Nome encarregado financeiro (pes.jurídica)
           IF MK-UCFSIM OR FCAD-TINJUR
              MOVE FCAD-ENCP TO   L-FC-ENCP,
           ELSE,
              MOVE SPACES    TO   L-FC-ENCP,
           END-IF.
      *>-> Edição do telefone de cobrança
           MOVE    FCAD-FONC TO   WFON-NUM.
           PERFORM                PRG-EDTFON.
           MOVE    WFON-X14  TO   L-FC-FONC.
      *>-> Edição do fax de cobrança
           MOVE    FCAD-FXC  TO   WFON-NUM.
           PERFORM                PRG-EDTFON.
           MOVE    WFON-X12  TO   L-FC-FXC.
      *>-> Se for CNPJ
           IF FCAD-TINJUR
              MOVE " Enc.Financ: " TO L-LT-ENCP,
              IF FCAD-FONC IS NOT EQUAL TO ZEROS
                 MOVE "Tel.Cobr:" TO L-LT-FONC,
              END-IF,
              IF FCAD-FXC IS NOT EQUAL TO ZEROS
                 MOVE "Fax Cob."  TO L-LT-FXC,
              END-IF,
           ELSE,
      *>-> Se utiliza Campos de Filiação para pessoa física
              IF MK-UCFSIM
                 MOVE "Nome da Mae: " TO L-LT-ENCP,
              ELSE,
                 MOVE SPACES TO   L-LT-ENCP,
              END-IF,
              IF FCAD-FONC IS NOT EQUAL TO ZEROS
                 MOVE "Tl.Resid:" TO L-LT-FONC,
              END-IF,
              IF FCAD-FXC IS NOT EQUAL TO ZEROS
                 MOVE "Fax Res."  TO L-LT-FXC,
              END-IF,
           END-IF.
           MOVE    W-CODIGO  TO   WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
           MOVE    SPACES    TO   W-CODIGO.
           MOVE    FCAD-END  TO   L-FC-END.
      *>-> Se houver bairro
           IF FCAD-BAI IS NOT EQUAL TO SPACES
              MOVE FCAD-BAI  TO   L-FC-BAI,
              MOVE "Bairro: " TO  L-LT-BAI,
           END-IF.
           MOVE    FCAD-CID  TO   L-FC-CID,
           MOVE    FCAD-CEP  TO   L-FC-CEP.
           MOVE    "-"       TO   L-FC-CEP(6:1).
           MOVE    FCAD-EST  TO   L-FC-EST.
           MOVE    "   Endereco: " TO L-LT-END.
           MOVE    "Cidade: " TO  L-LT-CID.
           MOVE    "CEP: "   TO   L-LT-CEP.
           MOVE    "UF:"     TO   L-LT-EST.
           MOVE    W-CODIGO  TO   WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
           MOVE    SPACES    TO   W-CODIGO.
           MOVE    FCAD-ENDC TO   L-FC-ENDC.
      *>-> Se houver bairro
           IF FCAD-BAIP IS NOT EQUAL TO SPACES
              MOVE FCAD-BAIP TO   L-FC-BAIP,
              MOVE "B.Cobr: " TO  L-LT-BAIP,
           END-IF.
           MOVE    FCAD-CIDP TO   L-FC-CIDP,
           MOVE    FCAD-CEPP TO   L-FC-CEPP.
           MOVE    "-"       TO   L-FC-CEPP(6:1).
           MOVE    FCAD-ESTP TO   L-FC-ESTP.
           MOVE    " End.Cobran: " TO L-LT-ENDC.
           MOVE    " Praca pgto: " TO L-LT-CIDP.
           MOVE    "CEP: "   TO   L-LT-CEPP.
           MOVE    "UF:"     TO   L-LT-ESTP.
           MOVE    W-CODIGO  TO   WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
           MOVE    SPACES    TO   W-CODIGO.
      *>-> Se for cli/for no EXTerior
           IF FCAD-ESTEXT
              MOVE FCAD-NPA  TO   L-FC-NPA,
           END-IF.
      *>-> Se for pessoa física e tem número de Carteira Profissional
           IF FCAD-TINFIS AND FCAD-NCP IS NOT EQUAL TO ZEROS
                 MOVE FCAD-NCP TO   L-FC-NCP,
                 MOVE FCAD-SCP TO   L-FC-SCP,
                 MOVE FCAD-ECP TO   L-FC-ECP,
           END-IF.
           MOVE    "SPC Liber./Ult.Cons: " TO L-LT-SPL,
      *>-> Se o SPc está Liberado
           IF FCAD-SPLSIM
              MOVE "Sim"     TO   L-FC-SPL,
           ELSE,
              MOVE "Nao"     TO   L-FC-SPL,
           END-IF.
      *>-> Edita a data
           MOVE    FCAD-DTCS TO   W-DTANO4,
           PERFORM                EDITA-DATAS,
           MOVE    WM-DTANO2 TO   L-FC-DTCS,
      *>-> Se existir representante
           IF FCAD-REP IS NOT EQUAL TO ZEROS
      *>-> Busca a descrição abreviada do representante
              MOVE FCAD-REP  TO   RET-COD,
              PERFORM             LER-TPE-REP,
              MOVE FCAD-REP  TO   L-FC-REP,
              MOVE RET-ABV   TO   L-ET-ABV,
              MOVE " - "     TO   L-LT-TR1,
              MOVE "Representante: " TO L-LT-REP,
           END-IF.
      *>-> Se existir zona
           IF FCAD-ZON IS NOT EQUAL TO ZEROS
              MOVE FCAD-ZON  TO   L-FC-ZON,
      *>-> Se empresa é sindicato
              IF MK-EMSSIM
                 MOVE "Base: " TO L-LT-ZON,
              ELSE,
                 MOVE "Zona: " TO L-LT-ZON,
              END-IF,
           END-IF.
           IF W-CODIGO IS NOT EQUAL TO SPACES
              MOVE "N/Sr/UF Car: " TO L-LT-NPA,
              IF FCAD-TINJUR
                 MOVE "       Pais: " TO L-LT-NPA,
              END-IF,
              MOVE W-CODIGO  TO   WGL-LG,
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIN,
           END-IF.
           MOVE    SPACES    TO   W-CODIGO.
      *>-> Se houver data maior compra
           IF FCAD-DTM IS NOT EQUAL TO LOW-VALUES
      *>-> Edita a data
              MOVE FCAD-DTM  TO   W-DTANO4,
              PERFORM             EDITA-DATAS,
              MOVE WM-DTANO2 TO   L-FC-DTM,
           END-IF.
      *>-> Se houver valor maior compra
           IF FCAD-VMA IS NOT EQUAL TO ZEROS
              MOVE FCAD-VMA  TO   L-FC-VMA,
              MOVE "Vl.Mai.Comp: " TO L-LT-VMA,
           END-IF.
      *>-> Se houver data última compra
           IF FCAD-DTM IS NOT EQUAL TO LOW-VALUES
      *>-> Edita a data
              MOVE FCAD-DTU  TO   W-DTANO4,
              PERFORM             EDITA-DATAS,
              MOVE WM-DTANO2 TO   L-FC-DTU,
              MOVE "Dt.Ult.Compr: " TO L-LT-DTU,
           END-IF.
      *>-> Se houver valor maior última compra
           IF FCAD-VUL IS NOT EQUAL TO ZEROS
              MOVE FCAD-VUL  TO   L-FC-VUL,
              MOVE "Vl.Ult.Comp: " TO L-LT-VUL,
           END-IF.
      *>-> Se houver dívida
           IF FCAD-DIV IS NOT EQUAL TO ZEROS
              MOVE FCAD-DIV  TO   L-FC-DIV,
              MOVE "Divida: " TO  L-LT-DIV,
           END-IF.
           IF W-CODIGO IS NOT EQUAL TO SPACES
              MOVE "Dt.Mai.Comp: " TO L-LT-DTM,
              MOVE W-CODIGO  TO   WGL-LG,
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIN,
           END-IF.
           MOVE    SPACES    TO   W-CODIGO.
      *>-> Faz a leitura do local de cobrança
           MOVE    FCAD-LOC  TO   RFT-COD.
           PERFORM                LER-TGE-LOC.
           MOVE    FCAD-LOC  TO   L-FC-LOC.
           MOVE    RFT-A01   TO   L-FT-ABR.
           MOVE    "Loc.Cobrança:" TO L-LT-LOC.
           MOVE    " - "     TO   L-LT-TR2.
      *>-> Se existir agência
           IF FCAD-AGE IS NOT EQUAL TO ZEROS
      *>-> Faz a leitura da agência
              MOVE FCAD-LOC  TO   RFT-COD,
              MOVE FCAD-AGE  TO   RFT-AGE,
              PERFORM             LER-TGE-AGE,
              MOVE FCAD-AGE  TO   L-FC-AGE,
              MOVE RFT-D04   TO   L-FT-DES,
              IF FCAD-AGE IS NOT EQUAL TO ZEROS
                 MOVE "Agencia: " TO L-LT-AGE,
                 MOVE " - "  TO   L-LT-TR3,
              END-IF,
           END-IF.
           IF FCAD-CTD IS NOT EQUAL TO ZEROS
              MOVE "Vencto Padrao:" TO L-LT-VEN,
              MOVE " -"      TO   L-LT-TR4,
      *>-> Lê os vencimentos
              MOVE FCAD-CTD  TO   RFT-COD,
              PERFORM             LER-TGE-VCT,
              MOVE FCAD-CTD  TO   L-FC-CTD,
              MOVE SPACES    TO   L-FT-QTD,
      *>-> Indica qual o vencimento que deve ser buscado
              MOVE FCAD-CTD  TO   WSROVCT-CODVCT,
      *>-> Função - Monta literal dos vencimentos
              PERFORM             SROVCT-MONLIT,
      *>-> Retorna a literal do vencimento
              MOVE WSROVCT-LITVCT TO L-FT-QTD,
      *>-> Se exibiu os vencimentos
              IF RFT-TPRVEN
      *>-> Move o percentual se diferente de zeros logo após últ.desd.
                 IF L-FT-QTD(13:) IS EQUAL TO SPACES AND
                    RFT-PER(1) IS NOT EQUAL TO ZEROS AND
                    RFT-PER(1) IS NOT EQUAL TO 100
      *>-> Busca binária na literal dos vencimentos
                    MOVE Texto:>lengthOf(L-FT-QTD) TO WBB-TAM,
                    MOVE RFT-PER(1) TO WRCL-PER,
      *>-> Insere o primeiro percentual
                    STRING        "%1.P:", WRCL-PER  DELIMITED BY SIZE
                       INTO       L-FT-QTD(WBB-TAM + 2:),
                 END-IF,
              END-IF,
           END-IF.
           MOVE    W-CODIGO  TO   WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
           MOVE    SPACES    TO   W-CODIGO.
           IF FCAD-CAR IS NOT EQUAL TO ZEROS
              MOVE FCAD-CAR  TO   L-FC-CAR,
           END-IF.
           MOVE    "      Carta:" TO L-LT-CAR.
           IF FCAD-DPR IS NOT EQUAL TO ZEROS
              MOVE FCAD-CAR  TO   L-FC-DPR,
              MOVE "Dias p/Protesto:" TO L-LT-DPR,
           END-IF.
           MOVE    "Caixa postal:" TO L-LT-CXP.
      *>-> Se possui Caixa Postal para listar
           IF FCAD-CXP IS NOT EQUAL TO ZEROS
              MOVE FCAD-CXP  TO   W-MZ05I,
              MOVE W-MZ05I   TO   L-FC-CXP,
           END-IF.
      *>-> Se houver limite de crédito
           IF FCAD-CRE IS NOT EQUAL TO ZEROS
              MOVE FCAD-CRE  TO   L-FC-CRE,
              MOVE "Limite Credito: " TO L-LT-CRE,
           END-IF.
      *>-> Faz leitura do grupo de cadastro
           MOVE    FCAD-GRP  TO   RFT-COD.
           PERFORM                LER-TGE-GRC.
           MOVE    FCAD-GRP  TO   L-FC-GRP.
           MOVE    " - "     TO   L-LT-TR5.
           MOVE    RFT-A03   TO   L-FT-AB1.
           MOVE    "Grp.Cad: " TO L-LT-GRP.
           MOVE    W-CODIGO  TO   WGL-LG.
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
           MOVE    SPACES    TO   W-CODIGO.
      *>-> Se deve saltar a página
           IF WGL-NLA IS GREATER THAN (WGL-NLIM - 4)
      *>-> Salta a página
              PERFORM             PRN-SLTPAG,
      *>-> Imprime o cabeçalho da listagem detalhada
              PERFORM             PRCL-IMPDET-IMPCAB,
           END-IF.
      *>-> Imprime as observações do cliente/fornecedor
           PERFORM                PRCL-IMPOBS.
      *>-> Se lista contatos de cli/for
           IF WSLI-LISCCF-TOD OR WSLI-LISCCF-ATI
      *>-> Imprime os contatos do cliente/fornecedor
              PERFORM             PRCL-IMPCNT,
           END-IF.
      *>-> Se ainda não imprimiu o último da folha
           IF ((WSLI-GRPCLA-NAO AND WGL-NLA IS LESS THAN (WGL-NLIM - 2)) OR
               (WSLI-GRPCLA-SIM AND WGL-NLA IS LESS THAN (WGL-NLIM - 1)))
              MOVE ALL "="   TO   WGL-LG(1:132),
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIN,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime o cabeçalho da listagem detalhada....................................................................
       PRCL-IMPDET-IMPCAB.
      *>-> Título do relatório
           MOVE    "R E L A Ç Ã O   D E   C L I E N T E S   E   F O R N E C E D O R E S" TO MK-CAB-TIT.
      *>-> Imprime cabeçalho de topo/usuário/empresa - 132 Colunas
           COPY                   PNEMP132.CPY.
      *>-> Retorna o cabeçalho de 132 colunas
           SET     WSLCADTAB-TCB132 TO TRUE.
           PERFORM                SLCADTAB-RETCAB.
      *>-> Imprime linha de seleção
           MOVE    WSLCADTAB-CAB-1 TO W-CAB-SELECAO.
           COPY                   PRNLINSL.CPY.
           IF WSLCADTAB-CAB-2 IS NOT EQUAL TO SPACES
              MOVE WSLCADTAB-CAB-2 TO W-CAB-SELECAO,
              COPY                PRNLINSL.CPY.
              IF WSLCADTAB-CAB-3 IS NOT EQUAL TO SPACES
                 MOVE WSLCADTAB-CAB-3 TO W-CAB-SELECAO,
                 COPY             PRNLINSL.CPY.
              END-IF,
           END-IF.
      *>-> Imprime hífens - 132 Col.
           PERFORM                PRN-HIF132.
      *>-> Se classifica por algum grupo
           IF WSLI-GRPCLA-SIM AND WRCL-LINGRP-SIM
      *>-> Imprime a linha do grupo
              PERFORM             PRCL-IMPLIN-GRUPO,
      *>-> Se classifica por U.f./Cidade
              IF WSLI-GRPCLA-UFC
      *>-> Imprime a linha do grupo da cidade
                 PERFORM          PRCL-IMPLIN-GRUPO-CID,
      *>-> Atualiza a cidade auxiliar
                 MOVE FCAD-CID TO   WRCL-FCAD-CDX,
              END-IF,
      *>-> Seta que não deve listar linha em branco
              SET  WRCL-LISBRA-NAO TO  TRUE,
      *>-> Imprime a linha do subgrupo de classificação
              PERFORM             PRCL-IMPLIN-SUB-GRUPO,
      *>-> Move os grupos de classificação
              MOVE WRCL-FB-EC2  TO   WRCL-FB-ECA,
              MOVE WRCL-GRPAU2  TO   WRCL-GRPAUX,
              MOVE WRCL-SGRAU2  TO   WRCL-SGRAUX,
              MOVE FCAD-EST  TO   WRCL-FCAD-EST,
      *>-> Move o código da zona de venda para variável auxiliar
              MOVE FCAD-ZON  TO   WRCL-FCAD-ZON,
      *>-> Move o código da micro-região para variável auxiliar
              MOVE FCAD-MRG  TO   WRCL-FCAD-MRG,
      *>-> Seta que deve listar linha em branco
              SET  WRCL-LISBRA-SIM TO  TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime a linha do grupo.....................................................................................
       PRCL-IMPLIN-GRUPO.
      *>-> Avalia o tipo de classificação
           EVALUATE               TRUE,
      *>-> Se classifica por grupo de cadastro
              WHEN WSLI-GRPCLA-GRC
      *>-> Faz leitura do grupo de cadastro
                 MOVE FCAD-GRP TO RFT-COD,
                 PERFORM          LER-TGE-GRC,
                 MOVE FCAD-GRP TO   W-MZ03I,
                 MOVE "Grupo Cadastro.:" TO WGL-LG,
                 MOVE W-MZ03I TO WGL-LG(18:3),
                 MOVE RFT-D03 TO  WGL-LG(22:30),
      *>-> Se classifica por representante
              WHEN WSLI-GRPCLA-REP
      *>-> Endereço + Contato + Repres. + CNPJ + IE + Cond.Pgto
                 IF WSLI-LIMCID-ECR AND WRCL-CONREP IS NOT EQUAL TO ZEROS AND
                    WRCL-GRPAU2 IS NOT EQUAL TO WRCL-GRPAUX
      *>-> Total de clientes por representante
                    MOVE "Total de clientes:" TO  WGL-LG(77:),
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                    MOVE WRCL-GRPAUX TO RET-COD,
                    PERFORM       LER-TPE-REP,
                    IF WRCL-GRPAUX IS NOT EQUAL TO ZEROS
                       MOVE RET-DEV TO WGL-LG(96:32),
                    ELSE,
                       MOVE "Sem Representante" TO WGL-LG(96:32),
                    END-IF,
                    MOVE WRCL-CONREP TO W-MZ05I,
                    MOVE W-MZ05I  TO WGL-LG(129:),
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
                    PERFORM       PRCL-IMPSIM-EXLMES,
      *>-> Imprime linha com espaços
                    MOVE SPACES   TO WGL-LG,
      *>-> Imprime ou exporta dados
                    PERFORM       PRN-IMPLIN,
      *>-> Zera contador de cliente por representante
                    MOVE ZEROS TO WRCL-CONREP,
                 END-IF,
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                 MOVE FCAD-REP TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-REP,
                 MOVE "Representante..:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-REP IS NOT EQUAL TO ZEROS
                    MOVE RET-DEV  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Representante" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica por transportador
              WHEN WSLI-GRPCLA-TRP
      *>-> Lê tab.TRAnsportadores
                 MOVE FCAD-TRP TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-TRA,
                 MOVE "Transportador..:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-TRP IS NOT EQUAL TO ZEROS
                    MOVE RET-DET  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Transportador" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica pelo local de cobrança
              WHEN WSLI-GRPCLA-LOC
      *>-> Faz a leitura do local de cobrança
                 MOVE FCAD-LOC TO RFT-COD,
                 PERFORM          LER-TGE-LOC,
                 MOVE FCAD-LOC TO   W-MZ03I,
                 MOVE "Local Cobrança: " TO WGL-LG,
                 MOVE W-MZ03I TO WGL-LG(17:3),
                 MOVE RFT-D01 TO  WGL-LG(21:30),
      *>-> Se classifica pelo estado
              WHEN WSLI-GRPCLA-EST
                 MOVE "U.F........:" TO WGL-LG,
                 MOVE FCAD-EST TO   WGL-LG(14:2),
                 MOVE "-"    TO   WGL-LG(17:1),
      *>-> Busca a descrição do estado na tabela
                 MOVE FCAD-EST TO   WDE-UFC,
                 PERFORM          ROG-BUSCA-EST,
      *>-> Se encontrou a UF
                 IF WDE-IUFOK
                    MOVE WDE-DES(WDE-IUF) TO WGL-LG(19:19),
                 ELSE,
                    MOVE SPACES   TO WGL-LG(19:19),
                 END-IF,
      *>-> Se classifica pelo preposto
              WHEN WSLI-GRPCLA-CPR
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                 MOVE FCAD-CPR TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-REP,
                 MOVE "Preposto.......:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-CPR IS NOT EQUAL TO ZEROS
                    MOVE RET-DEV  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Preposto" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica pelo vendedor
              WHEN WSLI-GRPCLA-CVD
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                 MOVE FCAD-CVD TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-REP,
                 MOVE "Vendedor.......:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-CVD IS NOT EQUAL TO ZEROS
                    MOVE RET-DEV  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Vendedor" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica pelo representante/preposto/vendedor
              WHEN WSLI-GRPCLA-RPV
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                 MOVE WRCL-GRPAU2 TO RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-REP,
                 MOVE "Representante..:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF WRCL-GRPAU2 IS NOT EQUAL TO ZEROS
                    MOVE RET-DEV  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Representante" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica pelo estado/Cidade
              WHEN WSLI-GRPCLA-UFC
                 MOVE "U.F........:" TO WGL-LG,
                 MOVE FCAD-EST TO   WGL-LG(14:2),
                 MOVE "-"    TO   WGL-LG(17:1),
      *>-> Busca a descrição do estado na tabela
                 MOVE FCAD-EST TO   WDE-UFC,
                 PERFORM          ROG-BUSCA-EST,
      *>-> Se encontrou a UF
                 IF WDE-IUFOK
                    MOVE WDE-DES(WDE-IUF) TO WGL-LG(19:19),
                 ELSE,
                    MOVE SPACES   TO WGL-LG(19:19),
                 END-IF,
      *>-> Se classifica por grupo de empresas
              WHEN WSLI-GRPCLA-HOL
      *>-> Faz leitura do grupo de empresas/holding
                 MOVE FCAD-HOL TO RET-COD,
                 PERFORM          LER-TPE-HOL,
                 MOVE FCAD-HOL TO   W-MZ04I,
                 MOVE "Grupo Empresas.:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-HOL IS NOT EQUAL TO ZEROS
                    MOVE RET-DEO  TO WGL-LG(23:30),
                 ELSE,
                    MOVE "Sem Grupo de empresas/Holding" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica por zona de vendas região
              WHEN WSLI-GRPCLA-ZON
      *>-> Faz leitura do zona de vendas/região
                 MOVE FCAD-ZON TO RFT-COD,
                 PERFORM          LER-TGE-ZVD,
                 MOVE FCAD-ZON TO   W-MZ03I,
      *>-> Se empresa é sindicato
                 IF MK-EMSSIM
                    MOVE "Base Territorial.:" TO WGL-LG,
                    MOVE W-MZ03I TO WGL-LG(20:3),
                 ELSE,
                    MOVE "Zona de Vendas.:" TO WGL-LG,
                    MOVE W-MZ03I TO WGL-LG(18:3),
                 END-IF,
                 IF FCAD-ZON IS NOT EQUAL TO ZEROS
      *>-> Se empresa é sindicato
                    IF MK-EMSSIM
                       MOVE RFT-DEZ TO WGL-LG(24:30),
                    ELSE,
                       MOVE RFT-DEZ TO WGL-LG(22:30),
                    END-IF,
      *>-> Se existe micro-região
                    IF FCAD-MRG IS NOT EQUAL TO ZEROS
      *>-> Faz leitura da micro-região
                       MOVE FCAD-MRG TO RFT-AGE,
                       MOVE FCAD-ZON TO RFT-COD,
                       PERFORM    LER-TGE-MRE,
      *>-> Move código da micro-região para edição
                       MOVE FCAD-MRG TO W-MZ02I,
                       MOVE "Micro-regiao:" TO WGL-LG(70:13),
      *>-> Move código da micro-região para impressão
                       MOVE W-MZ02I TO WGL-LG(84:2),
      *>-> Move descrição da micro-região para impressão
                       MOVE RFT-D35  TO WGL-LG(87:32),
                    END-IF,
                 ELSE,
      *>-> Se empresa é sindicato
                    IF MK-EMSSIM
                       MOVE "Sem Base Territorial" TO WGL-LG(24:32),
                    ELSE,
                       MOVE "Sem Zona de Vendas" TO WGL-LG(22:32),
                    END-IF,
                 END-IF,
      *>-> Se classifica por escritório
              WHEN WSLI-GRPCLA-ESC
                 MOVE "Escritorio / Assessoria:" TO WGL-LG,
      *>-> Código do cadastro
                 MOVE FCAD-COD TO   WFB-COD,
      *>-> Lê o tipo de registro 09 da observação do cadastro
                 PERFORM          PFB-LER-FOBCAD-REGISC,
      *>-> Se leu corretamente e cadastro possui escritório contábil/assessoria
                 IF WFB-FS-OK AND WFB-ECA IS NOT EQUAL TO ZEROS
      *>-> Realiza a leitura do escritório contábil
                    MOVE WFB-ECA  TO OCAD-COD,
                    MOVE "READ OCADAS KEY OCAD-CHA IGNORE LOCK" TO WARQ-CMD,
                    PERFORM       ARQ-COMANDO-MK-CHA,
      *>-> Se leu corretamente
                    IF FS-WRK-OK
      *>-> Move descrição do escritório contábil/Assessoria para listagem
                       MOVE OCAD-DES TO WGL-LG(26:32),
                    ELSE,
                       MOVE "Invalido" TO WGL-LG(26:8),
                    END-IF,
                 ELSE,
                    MOVE "Sem escritorio" TO WGL-LG(26:14),
                 END-IF,
           END-EVALUATE.
      *>-> Linha em negrito
           SET     WGL-ESFNEG TO  TRUE.
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
           PERFORM                PRCL-IMPSIM-EXLMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime a linha do grupo da cidade ..........................................................................
       PRCL-IMPLIN-GRUPO-CID.
           MOVE    "Cidade.....:" TO WGL-LG.
           MOVE    FCAD-CID  TO   WGL-LG(14:20).
      *>-> Linha em negrito
           SET     WGL-ESFNEG TO  TRUE.
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
           PERFORM                PRCL-IMPSIM-EXLMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime a linha do Subgrupo..................................................................................
       PRCL-IMPLIN-SUB-GRUPO.
      *>-> Se classifica por subgrupo e não estiver no início da listagem e deve listar a linha em branco e não trocou
      *>-> ...grupo
           IF NOT WSLI-SGRCLA-NAO AND WRCL-LISBRA-SIM AND
             ((WSRICAD-FUN-LISCAD AND WGL-NLA IS GREATER THAN 12) OR
              (WSRICAD-FUN-LISSIM AND WGL-NLA IS GREATER THAN 9)) AND
              WRCL-GRPAUX IS EQUAL TO WRCL-GRPAU2
      *>-> Imprime linha com espaços
              PERFORM             PRN-IMPSPC,
           END-IF.
      *>-> Avalia subgrupo
           EVALUATE               TRUE,
      *>-> Se classifica por representante
              WHEN WSLI-SGRCLA-REP
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                 MOVE FCAD-REP TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-REP,
                 MOVE "  Representante:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-REP IS NOT EQUAL TO ZEROS
                    MOVE RET-DEV  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Representante" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica pelo preposto
              WHEN WSLI-SGRCLA-CPR
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                 MOVE FCAD-CPR TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-REP,
                 MOVE "  Preposto.....:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-CPR IS NOT EQUAL TO ZEROS
                    MOVE RET-DEV  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Preposto" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica pelo vendedor
              WHEN WSLI-SGRCLA-CVD
      *>-> Lê tab.REPresentantes/vendedores/prepostos
                 MOVE FCAD-CVD TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-REP,
                 MOVE "  Vendedor.....:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-CVD IS NOT EQUAL TO ZEROS
                    MOVE RET-DEV  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Vendedor" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica por grupo de cadastro
              WHEN WSLI-SGRCLA-GRC
      *>-> Faz leitura do grupo de cadastro
                 MOVE FCAD-GRP TO RFT-COD,
                 PERFORM          LER-TGE-GRC,
                 MOVE FCAD-GRP TO   W-MZ03I,
                 MOVE "Grupo Cadastro.:" TO WGL-LG,
                 MOVE W-MZ03I TO WGL-LG(17:3),
                 MOVE RFT-D03 TO  WGL-LG(21:30),
      *>-> Se classifica por transportador
              WHEN WSLI-SGRCLA-TRP
      *>-> Lê tab.TRAnsportadores
                 MOVE FCAD-TRP TO   RET-COD, W-MZ04I,
                 PERFORM          LER-TPE-TRA,
                 MOVE "Transportador..:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(18:4),
                 IF FCAD-TRP IS NOT EQUAL TO ZEROS
                    MOVE RET-DET  TO WGL-LG(23:32),
                 ELSE,
                    MOVE "Sem Transportador" TO WGL-LG(23:32),
                 END-IF,
      *>-> Se classifica pelo local de cobrança
              WHEN WSLI-SGRCLA-LOC
      *>-> Faz a leitura do local de cobrança
                 MOVE FCAD-LOC TO RFT-COD,
                 PERFORM          LER-TGE-LOC,
                 MOVE FCAD-LOC TO   W-MZ03I,
                 MOVE "Local Cobrança: " TO WGL-LG,
                 MOVE W-MZ03I TO WGL-LG(17:3),
                 MOVE RFT-D01 TO  WGL-LG(21:30),
      *>-> Se classifica por grupo de empresas
              WHEN WSLI-SGRCLA-HOL
      *>-> Faz leitura do grupo de empresas/holding
                 MOVE FCAD-HOL TO RET-COD,
                 PERFORM          LER-TPE-HOL,
                 MOVE FCAD-HOL TO   W-MZ04I,
                 MOVE "Grupo Empresas.:" TO WGL-LG,
                 MOVE W-MZ04I TO WGL-LG(17:4),
                 IF FCAD-HOL IS NOT EQUAL TO ZEROS
                    MOVE RET-DEO  TO WGL-LG(22:30),
                 ELSE,
                    MOVE "Sem Grupo de empresas/Holding" TO WGL-LG(22:32),
                 END-IF,
      *>-> Se classifica por zona de vendas região
              WHEN WSLI-SGRCLA-ZON
      *>-> Faz leitura do zona de vendas/região
                 MOVE FCAD-ZON TO RFT-COD,
                 PERFORM          LER-TGE-ZVD,
                 MOVE FCAD-ZON TO   W-MZ03I,
      *>-> Se empresa é sindicato
                 IF MK-EMSSIM
                    MOVE "Base Territorial.:" TO WGL-LG,
                    MOVE W-MZ03I TO WGL-LG(20:3),
                 ELSE,
                    MOVE "Zona de Vendas.:" TO WGL-LG,
                    MOVE W-MZ03I TO WGL-LG(18:3),
                 END-IF,
      *>-> Se possui zona de vendas/região
                 IF FCAD-ZON IS NOT EQUAL TO ZEROS
      *>-> Se empresa é sindicato
                    IF MK-EMSSIM
                       MOVE RFT-DEZ TO WGL-LG(24:30),
                    ELSE,
                       MOVE RFT-DEZ TO WGL-LG(22:30),
                    END-IF,
      *>-> Se existe micro-região
                    IF FCAD-MRG IS NOT EQUAL TO ZEROS
      *>-> Faz leitura da microregião
                       MOVE FCAD-MRG TO RFT-AGE,
                       MOVE FCAD-ZON TO RFT-COD,
                       PERFORM    LER-TGE-MRE,
      *>-> Move código da micro-região para edição
                       MOVE FCAD-MRG TO W-MZ02I,
                       MOVE "Micro-regiao:" TO WGL-LG(70:13),
      *>-> Move código da micro-região para impressão
                       MOVE W-MZ02I TO WGL-LG(84:2),
      *>-> Move descrição da micro-região para impressão
                       MOVE RFT-D35  TO WGL-LG(87:32),
                    END-IF,
                 ELSE,
      *>-> Se empresa é sindicato
                    IF MK-EMSSIM
                       MOVE "Sem Base Territorial" TO WGL-LG(22:32),
                    ELSE,
                       MOVE "Sem Zona de Vendas" TO WGL-LG(22:32),
                    END-IF,
                 END-IF,
      *>-> Se classifica por cidade
              WHEN WSLI-SGRCLA-CID
                 MOVE "         Cidade:" TO WGL-LG,
                 MOVE WRCL-SGRCID TO WGL-LG(22:32),
           END-EVALUATE.
      *>-> Se não classifica subgrupo de classificação
           IF NOT WSLI-SGRCLA-NAO
      *>-> Linha em negrito
               SET WGL-ESFNEG TO  TRUE,
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
              PERFORM             PRCL-IMPSIM-EXLMES,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime as observações do cliente/fornecedor.................................................................
       PRCL-IMPOBS.
      *>-> Imprime as observações do cliente/fornecedor, se necessário
           PERFORM                PRCL-IMPOBS-OBS.
      *>-> Imprime home page/e-mails do cliente/fornecedor, se necessário
           PERFORM                PRCL-IMPOBS-EIN.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime as observações do cliente/fornecedor, se necessário..................................................
       PRCL-IMPOBS-OBS.
      *>-> Se lista observações do cadastro de cli/for
           IF WSLI-OBSERV-OBS OR WSLI-OBSERV-AMB
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 2 da observação do cadastro
              PERFORM             PFB-LER-FOBCAD-REGEIN,
      *>-> Se possui observação
              IF WFB-OCA IS NOT EQUAL TO SPACES
      *>-> Imprime as observações públicas
                 PERFORM          PRCL-IMPOBS-OBSPUB,
              END-IF,
      *>-> Se lista as observações restritas
              IF WSLI-LISORC-SIM
      *>-> Código do cadastro
                 MOVE FCAD-COD TO   WFB-COD,
      *>-> Lê o tipo de registro 2 da observação do cadastro
                 PERFORM          PFB-LER-FOBCAD-REGEIN,
      *>-> Se possui observações restritas
                 IF WFB-ORC IS NOT EQUAL TO SPACES
      *>-> Imprime as observações restritas
                    PERFORM       PRCL-IMPOBS-OBSRES,
                 END-IF,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime as observações públicas..............................................................................
       PRCL-IMPOBS-OBSPUB.
      *>-> Tamanho da linha
           MOVE    119       TO   WEDL-TAM.
      *>-> Edita a observação do cadastro para impressão/exportação
           PERFORM                PFB-EDTLIN-WFB-OCA.
      *>-> Laço para percorrer as linhas retornadas
           PERFORM                WITH TEST BEFORE
              VARYING             W-IDV FROM 1 BY 1
                 UNTIL            W-IDV IS GREATER THAN WEDL-QTL
      *>-> Se for a primeira linha das observações
              IF W-IDV IS EQUAL TO 1
                 MOVE "     Observ:" TO WGL-LG,
      *>-> Se lista as observações restritas
                 IF WSLI-LISORC-SIM
                    MOVE "  Obs.Publ.:" TO WGL-LG,
                 END-IF,
              ELSE,
                 MOVE SPACES TO   WGL-LG,
              END-IF,
      *>-> Move a linha
              MOVE WEDL-SAI(WEDL-POS(W-IDV):WEDL-TAM) TO WGL-LG(14:),
      *>-> Imprime linha de impressão da observação pública/restrita
              PERFORM             PRCL-IMPOBS-OBSLIN,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime as observações restritas.............................................................................
       PRCL-IMPOBS-OBSRES.
      *>-> Tamanho da linha
           MOVE    119       TO   WEDL-TAM.
      *>-> Edita a obs.restrita do cadastro para impressão/exportação
           PERFORM                PFB-EDTLIN-WFB-ORC.
      *>-> Laço para percorrer as linhas retornadas
           PERFORM                WITH TEST BEFORE
              VARYING             W-IDV FROM 1 BY 1
                 UNTIL            W-IDV IS GREATER THAN WEDL-QTL
      *>-> Se for a primeira linha das observações
              IF W-IDV IS EQUAL TO 1
                 MOVE "  Obs.Rest.:" TO WGL-LG,
              ELSE,
                 MOVE SPACES TO   WGL-LG,
              END-IF,
      *>-> Move a linha
              MOVE WEDL-SAI(WEDL-POS(W-IDV):WEDL-TAM) TO WGL-LG(14:),
      *>-> Imprime linha de impressão da observação pública/restrita
              PERFORM             PRCL-IMPOBS-OBSLIN,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime linha de impressão da observação pública/restrita
       PRCL-IMPOBS-OBSLIN.
      *>-> Se a linha a imprimir estiver em branco
           IF WGL-LG IS EQUAL TO SPACES
      *>-> Imprime/Exporta linha complementar
              PERFORM             PRN-IMPCOM,
           ELSE,
      *>-> Verifica se precisa forçar que a linha comece na segunda coluna
              PERFORM             PRCL-IMPOBS-DESCOL,
      *>-> Imprime a linha ou exporta dados com colunas mescladas
              PERFORM             PRCL-IMPSIM-EXLMES,
           END-IF.
      *>-> Se deve saltar página
           IF WGL-NLA IS GREATER THAN (WGL-NLIM - 4)
              IF WSLI-GRPCLA-SIM AND WGL-NLA IS GREATER THAN (WGL-NLIM - 2)
      *>-> Indica que não deve listar a linha do grupo de cadastro
                 SET WRCL-LINGRP-NAO TO TRUE,
              END-IF,
      *>-> Salta a página
              PERFORM             PRN-SLTPAG,
      *>-> Se for listagem simplificada
              IF WSRICAD-FUN-LISSIM
      *>-> Imprime o cabeçalho da listagem simplificada
                 PERFORM          PRCL-IMPSIM-IMPCAB,
              ELSE,
      *>-> Imprime o cabeçalho da listagem detalhada
                 PERFORM          PRCL-IMPDET-IMPCAB,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime home page/e-mails do cliente/fornecedor, se necessário...............................................
       PRCL-IMPOBS-EIN.
      *>-> Se lista home page/e-mails do cadastro de cli/for
           IF WSLI-OBSERV-EMA OR WSLI-OBSERV-AMB
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 02 da observação do cadastro
              PERFORM             PFB-LER-FOBCAD-REGEIN,
      *>-> Se não leu corretamente
              IF WFB-FS-OK
      *>-> Imprime os endereços de internet
                 PERFORM         PRCL-IMPOBS-DADEIN,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime os endereços de internet.............................................................................
       PRCL-IMPOBS-DADEIN.
      *>-> Se tem endereço de internet
           IF WFB-EIN(1) IS NOT EQUAL TO SPACES
      *>-> Imprime o endereço de internet
              MOVE "  Home Page:" TO WGL-LG,
              MOVE WFB-EIN(1) TO  WGL-LG(14:),
      *>-> Verifica se precisa forçar que a linha comece na segunda coluna
              PERFORM             PRCL-IMPOBS-DESCOL,
      *>-> Imprime a2linha ou exporta dados com colunas mescladas
              PERFORM             PRCL-IMPSIM-EXLMES,
      *>-> Se deve saltar de página
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 4)
      *>-> Se classifica por algum grupo
                 IF WSLI-GRPCLA-SIM AND WGL-NLA IS GREATER THAN (WGL-NLIM - 2)
      *>-> Indica que não deve listar a linha do grupo de cadastro
                    SET WRCL-LINGRP-NAO TO TRUE,
                 END-IF,
      *>-> Salta a página
                 PERFORM          PRN-SLTPAG,
      *>-> Se for listagem simplificada
                 IF WSRICAD-FUN-LISSIM
      *>-> Imprime o cabeçalho da listagem simplificada
                    PERFORM       PRCL-IMPSIM-IMPCAB,
                 ELSE,
      *>-> Imprime o cabeçalho da listagem detalhada
                    PERFORM       PRCL-IMPDET-IMPCAB,
                 END-IF,
                 MOVE SPACES TO   WGL-LG,
              END-IF,
           END-IF.
      *>-> Se for listagem detalhada ou não for opção e-mail/fone
           IF WSRICAD-FUN-LISCAD OR NOT WSLI-LIMCID-EFO
      *>-> Se informou e-mail genérico
              IF WFB-EIN(2) IS NOT EQUAL TO SPACES
                 MOVE "     E-Mail:" TO WGL-LG,
                 MOVE WFB-EIN(2)  TO WGL-LG(14:),
      *>-> Verifica se precisa forçar que a linha comece na segunda coluna
                 PERFORM          PRCL-IMPOBS-DESCOL,
      *>-> Imprime a linha ou exporta dados com colunas mescladas
                 PERFORM          PRCL-IMPSIM-EXLMES,
      *>-> Se saltar de página
                 IF WGL-NLA IS GREATER THAN (WGL-NLIM - 4)
      *>-> Se classifica por algum grupo
                    IF WSLI-GRPCLA-SIM
      *>-> Indica que não deve listar a linha do grupo de cadastro
                       SET WRCL-LINGRP-NAO TO TRUE,
                    END-IF,
      *>-> Salta a página
                    PERFORM       PRN-SLTPAG,
      *>-> Se for listagem simplificada
                    IF WSRICAD-FUN-LISSIM
      *>-> Imprime o cabeçalho da listagem simplificada
                       PERFORM    PRCL-IMPSIM-IMPCAB,
                    ELSE,
      *>-> Imprime o cabeçalho da listagem detalhada
                       PERFORM    PRCL-IMPDET-IMPCAB,
                    END-IF,
                    MOVE SPACES   TO WGL-LG,
                 END-IF,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Verifica se precisa forçar que a linha comece na segunda coluna..............................................
       PRCL-IMPOBS-DESCOL.
      *>-> Se for excel modo simplificado
           IF LISTA-AUT
      *>-> Inicializa a observação auxiliar
              MOVE SPACES    TO   WRCL-OBSAUX,
      *>-> Força para que a linha comece na segunda coluna
              MOVE WGL-LG    TO   WRCL-OBSAUX(8:),
              MOVE WRCL-OBSAUX  TO   WGL-LG,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime os contatos do cliente/fornecedor....................................................................
       PRCL-IMPCNT.
      *>-> Indica que ainda não imprimiu o cabeçalho dos contatos
           SET     WRCL-IMCACO-NAO TO  TRUE.
      *>-> Código do cadastro
           MOVE    FCAD-COD  TO   WFB-COD.
      *>-> Lê o tipo de registro 06 da observação do cadastro
           PERFORM                PFB-LER-FOBCAD-REGCON.
      *>-> Varre os contatos carregados
           PERFORM                WITH TEST BEFORE
              VARYING             WRCL-SEQ FROM 1 BY 1
                 UNTIL            WRCL-SEQ IS GREATER THAN WFB-ULTSEQ
      *>-> Se ocorrência não tem dados de contato
              IF WFB-NOC(WRCL-SEQ) IS EQUAL TO SPACES
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Carrega o mês/dia auxiliar para teste de dia/mês
              MOVE WFB-MNC(WRCL-SEQ) TO WRCL-FCAD-MNA,
              MOVE WFB-DNA(WRCL-SEQ) TO WRCL-FCAD-DNA,
      *>-> Se está fora da seleção
              IF WRCL-FCAD-MDI IS LESS THAN WSLI-DIMINI OR
                 WRCL-FCAD-MDI IS GREATER THAN WSLI-DIMFIN
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Se deve listar somente contatos ativos e o contato é inativo
              IF WSLI-LISCCF-ATI AND WFB-ATINAO(WRCL-SEQ)
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Se deve saltar a página
              IF WGL-NLA IS GREATER THAN (WGL-NLIM - 6)
      *>-> Se for Relatório de 160 colunas
                 IF WSLI-LIMCID-160
      *>-> Imprime hífens em 160 colunas com salto de página
                    PERFORM       PRN-SPH160,
                 ELSE,
      *>-> Imprime hífens em 132 colunas com salto de página
                    PERFORM       PRN-SPH132,
                 END-IF,
      *>-> Se for listagem simplificada
                 IF WSRICAD-FUN-LISSIM
      *>-> Imprime o cabeçalho da listagem simplificada
                    PERFORM       PRCL-IMPSIM-IMPCAB,
                 ELSE,
      *>-> Imprime o cabeçalho da listagem detalhada
                    PERFORM       PRCL-IMPDET-IMPCAB,
                 END-IF,
      *>-> Restaura a linha do cliente
                 MOVE WRCL-WGL-LG TO WGL-LG,
      *>-> Imprime a linha
                 PERFORM          PRN-IMPLIN,
      *>-> Se já imprimiu o cabeçalho dos contatos
                 IF WRCL-IMCACO-SIM
      *>-> Imprime o cabeçalho dos contatos do cliente fornecedor
                    PERFORM       PRCL-IMPCNT-CAB,
                 END-IF,
              END-IF,
      *>-> Se ainda não imprimiu o cabeçalho dos contatos
              IF WRCL-IMCACO-NAO
      *>-> Move as propriedades das células
                 MOVE "A001,A007,A040,A095,A108,D133" TO WGL-LINPRP,
      *>-> Carrega as propriedades da linha secundária
                 PERFORM          PRN-CARSEC,
      *>-> Imprime o cabeçalho
                 PERFORM          PRCL-IMPCNT-CAB,
      *>-> Indica que já imprimiu o cabeçalho dos contatos
                 SET WRCL-IMCACO-SIM TO TRUE,
              END-IF,
              MOVE SPACES    TO   W-CODIGO,
      *>-> Move o nome do contato
              MOVE WFB-NOC(WRCL-SEQ) TO L-FC-NOC,
      *>-> Move o e-mail do contato
              MOVE WFB-EMC(WRCL-SEQ) TO L-FC-EMC,
      *>-> Se tem Data Demissão
              IF WFB-ATINAO(WRCL-SEQ)
                 MOVE "INATIVO"   TO L-LI-INA,
              END-IF,
      *>-> Move o cargo do contato
              MOVE WFB-CDC(WRCL-SEQ) TO L-FC-CDC,
      *>-> Lê a tabela de Setor
              MOVE SPACES    TO   RFT-D36,
      *>-> Indica que não exibe mensagem para leitura padrão inexistente
              SET  RTAB-EXINEX-NAO TO TRUE,
      *>-> Lê tab.Setores de atuação para contatos
              MOVE WFB-SAC(WRCL-SEQ, 1) TO RFT-COD,
              PERFORM             LER-TGE-UCC,
      *>-> move o setor de atuação do contato
              MOVE RFT-A36   TO   L-FC-SAC,
      *>-> Linha de impressão
              MOVE WR-CONTAT TO   WGL-LG,
      *>-> Se for somente para excel
              IF LISTA-AUT
      *>-> Data de nascimento do contato
                 MOVE WFB-DNC(WRCL-SEQ) TO W-DTANO4,
                 PERFORM          EDITA-DATAS,
                 MOVE WM-DTANO4   TO WRCL-FB-DNC,
      *>-> Concatena no final da linha
                 MOVE WRCL-FB-DNC TO WGL-LG(133:),
              END-IF,
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIS,
      *>-> Se existe atribuição do contato
              IF WFB-ATR(WRCL-SEQ) IS NOT EQUAL TO SPACES
                 MOVE SPACES TO   WGL-LG,
                 MOVE "Atr:" TO   WGL-LG(8:4),
      *>-> Edita a atribuição do contato a imprimir
                 MOVE WFB-ATR(WRCL-SEQ) TO WEDL-ENT,
                 MOVE 120    TO   WEDL-TAM,
                 PERFORM          PEDL-EDTLIN,
      *>-> Laço para percorrer as linhas retornadas
                 PERFORM                WITH TEST BEFORE
                    VARYING             W-IDV FROM 1 BY 1
                       UNTIL            W-IDV IS GREATER THAN WEDL-QTL
      *>-> Atribuição do contato editado
                    MOVE WEDL-SAI(WEDL-POS(W-IDV):WEDL-TAM)
                             TO   WGL-LG(12:WEDL-TAM),
      *>-> Imprime a linha ou exporta dados com colunas mescladas
                    PERFORM       PRCL-IMPSIM-EXLMES,
                 END-PERFORM,
              END-IF,
      *>-> Se existe observação do contato e lista observação do cadastro
              IF WFB-OCN(WRCL-SEQ) IS NOT EQUAL TO SPACES AND
                (WSLI-OBSERV-OBS OR WSLI-OBSERV-AMB)
                 MOVE SPACES TO   WGL-LG,
                 MOVE "Obs:" TO   WGL-LG(8:4),
      *>-> Edita a observação do contato a imprimir
                 MOVE WFB-OCN(WRCL-SEQ) TO WEDL-ENT,
                 MOVE 120    TO   WEDL-TAM,
                 PERFORM          PEDL-EDTLIN,
      *>-> Laço para percorrer as linhas retornadas
                 PERFORM                WITH TEST BEFORE
                    VARYING             W-IDV FROM 1 BY 1
                       UNTIL            W-IDV IS GREATER THAN WEDL-QTL
      *>-> Observação do contato editado
                    MOVE WEDL-SAI(WEDL-POS(W-IDV):WEDL-TAM)
                             TO   WGL-LG(12:WEDL-TAM),
      *>-> Imprime a linha ou exporta dados com colunas mescladas
                    PERFORM       PRCL-IMPSIM-EXLMES,
                 END-PERFORM,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime cabeçalho dos contatos do cliente/fornecedor.........................................................
       PRCL-IMPCNT-CAB.
      *>-> Imprime cabeçalho do contato
           MOVE    "      Nome do Contato__________________E-mail_________________________________________________Setor"
      &            "________Cargo____________________" TO WGL-LG.
      *>-> Se for somente para excel
           IF LISTA-AUT
              MOVE "Data nascimento" TO WGL-LG(133:),
           END-IF.
      *>-> Carrega o nome das colunas secundárias na tabela de colunas
           PERFORM                PRN-CARNOS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotinas finais...............................................................................................
       PRCL-LISCAD-FIM.
      *>-> Fecha e elimina o arquivo virtual
           PERFORM                CAD-CLOSE.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>-> Se não listou nada
           IF MK-PAG IS EQUAL TO ZEROS
      *>-> Se confirmou a impressão
              IF WGL-IMPSIM
      *>-> Exibe a mensagem de seleção nula
                 PERFORM          EXB-MEN-ERRPROC,
              END-IF,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se deve INterromper o Processamento - SIM
           IF MK-INPSIM
      *>-> Exibe a mensagem de seleção nula
              PERFORM             EXB-MEN-ERRPROC,
      *>-> Imprime mensagem de listagem cancelada pelo operador
              PERFORM             PRN-IMPMSG,
      *>-> Fecha a impresssora
              PERFORM             PRN-FECIMP,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se for listagem simplificada
           IF WSRICAD-FUN-LISSIM
      *>-> Rotinas finais - Listagem simplificada
              PERFORM             PRCL-LISCAD-FIMSIM,
           ELSE,
      *>-> Rotinas finais - Listagem detalhada
              PERFORM             PRCL-LISCAD-FIMDET,
           END-IF.
      *>-> Fecha a impressora
           PERFORM                PRN-FECIMP.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotinas finais - Listagem simplificada.......................................................................
       PRCL-LISCAD-FIMSIM.
      *>-> Se for subgrupo cidade e classif.do cadastro para ordem de cidade
           IF WSLI-SGRCLA-CID AND WSLCADTAB-ORDCCI
      *>-> Total de clientes por cidade
              MOVE "Total de clientes da cidade:" TO WGL-LG(77:),
      *>-> Move a cidade
              MOVE WRCL-CIDAUX  TO   WGL-LG(105:32),
              MOVE WRCL-CONCID  TO   W-MZ05I,
              MOVE W-MZ05I   TO   WGL-LG(128:),
      *>-> Imprime a linha ou exporta dados com as colunas mescladas
              PERFORM             PRCL-IMPSIM-EXLMES,
      *>-> Zera contador de cliente por cidade
              MOVE ZEROS     TO   WRCL-CONCID,
           END-IF.
      *>-> Se classifica por representante e Endereço + Contato + Repres. + CNPJ + IE + Cond.Pgto
           IF WSLI-GRPCLA-REP AND WSLI-LIMCID-ECR AND
              WRCL-CONREP IS NOT EQUAL TO ZEROS
      *>-> Total de clientes por representante
              MOVE "Total de clientes:" TO WGL-LG(77:),
      *>-> Lê tab.REPresentantes/vendedores/prepostos
              MOVE WRCL-GRPAUX  TO   RET-COD,
              PERFORM             LER-TPE-REP,
              IF WRCL-GRPAU2 IS NOT EQUAL TO ZEROS
                 MOVE RET-DEV TO  WGL-LG(96:32),
              ELSE,
                 MOVE "Sem Representante" TO WGL-LG(96:32),
              END-IF,
              MOVE WRCL-CONREP  TO   W-MZ05I,
              MOVE W-MZ05I   TO   WGL-LG(129:),
      *>-> Imprime a linha
              PERFORM             PRN-IMPLIN,
      *>-> Zera contador de cliente por representante
              MOVE ZEROS     TO   WRCL-CONREP,
           END-IF.
      *>-> Se classifica por endereço + contato + representante
           IF WSLI-LIMCID-ECR
      *>-> Lista os totalizadores gerais dos recursos ativos
              PERFORM             PRCL-LISCAD-FIMSIM-TOTREA,
           END-IF.
      *>-> Se for Relatório de 160 colunas
           IF WSLI-LIMCID-160
      *>-> Imprime hífen - 160 colunas
              PERFORM             PRN-HIF160,
           ELSE,
      *>-> Imprime hífen - 132 colunas
              PERFORM             PRN-HIF132,
           END-IF.
      *>-> Move linha de total
           MOVE    "   ***    Total de Cadastros ->         ***" TO WGL-LG.
           MOVE    WRCL-TOTCOD  TO   W-MZ07I.
           MOVE    W-MZ07I   TO   WGL-LG(33:7).
      *>-> Se for sintética e lista valor da dídiva
           IF WSLI-LIMCID-DIV
              MOVE "*** Total da Divida ->                    ***" TO WGL-LG(88:45),
              MOVE WRCL-TOTDIV  TO   W-MZP12V2,
              MOVE W-MZP12V2 TO   WGL-LG(111:18),
           END-IF.
      *>-> Se for Lim-Cred./Vlr.Total
           IF WSLI-LIMCID-LCR
              MOVE "*** Total Faturado ->                     ***" TO WGL-LG(88:45),
              MOVE WRCL-TOTACU  TO   W-MZP12V2,
              MOVE W-MZP12V2 TO   WGL-LG(111:18),
           END-IF.
      *>-> Cidade/Empregados/Capital Social
           IF WSLI-LIMCID-CEC
      *>-> Inicializa a linha de impressão
              MOVE SPACES    TO   WR-ORDCEC,
              MOVE "*** Total ***" TO LS-CID10,
      *>-> Número das empresas
              MOVE WRCL-KC-NEP  TO   LS-NEP,
      *>-> Número de empregados
              MOVE WRCL-KC-NEM  TO   WQED-NUM,
              SET WQED-NORBWZ TO  TRUE,
              PERFORM             PRG-EDTQTD,
              MOVE WQED-X15  TO   LS-NEM,
      *>-> Capital social
              MOVE WRCL-KC-CPS  TO   WVED-NUM
              SET  WVED-NORBWZ TO TRUE,
              PERFORM             PRG-EDTVLE,
              MOVE WVED-X15 TO    LS-CPS,
      *>-> Move para a linha de impressão
              MOVE W-CODIGO  TO   WGL-LG,
           END-IF.
      *>-> Empresa/End/Cidade/Telefone/Número de empregados
           IF WSLI-LIMCID-EEC
      *>-> Número de empregados
              MOVE WRCL-KC-NEM  TO   WQED-NUM,
              SET WQED-NORBWZ TO  TRUE,
              PERFORM             PRG-EDTQTD,
              MOVE WQED-X07  TO   WGL-LG(126:07),
           END-IF.
      *>-> Imprime a linha ou exporta dados com colunas mescladas
           PERFORM                PRCL-IMPSIM-EXLMES.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Lista os totalizadores gerais dos recursos ativos............................................................
       PRCL-LISCAD-FIMSIM-TOTREA.
      *>-> Se não abriu o arquivo virtual
           IF RES-ABERTO-NAO
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Lista os totais gerais de todas as espécies de recursos
           MOVE    LOW-VALUES TO  KREG-RES.
      *>-> Posiciona para ler apenas os totalizadores (maior que zero)
           PERFORM                RES-START-GREATER-ALT.
           PERFORM                UNTIL NOT RES-FS-OK
              PERFORM             RES-READ-NEXT,
      *>-> Se não leu ok
              IF NOT RES-FS-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Inicializa a linha de impressão
              MOVE SPACES    TO   L-TOTREA,
      *>-> Move literal de total
              MOVE "Total de" TO  L-LT-TOT,
      *>-> Edita a quantidade de recursos deste tipo que foram processados
              MOVE KR-QTD    TO   L-QTDERC,
      *>-> Avalia a literal que deve ser exibida
              EVALUATE            TRUE,
      *>-> Se for registro de total geral
                 WHEN KR-CHA IS EQUAL TO HIGH-VALUES
                    MOVE WLT-ERC(15) TO L-LT-ERC,
      *>-> Se for espécie de recurso - Outros
                 WHEN KR-ERCOUT
                    MOVE WLT-ERC(14) TO L-LT-ERC,
                 WHEN KR-ERC-OK
                    MOVE WLT-ERC(KR-ERC) TO L-LT-ERC,
                 WHEN OTHER
                    EXIT          PERFORM CYCLE,
              END-EVALUATE,
      *>-> Imprime a linha
              MOVE L-TOTREA  TO   WGL-LG,
              PERFORM             PRN-IMPCOM,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotinas finais - Listagem detalhada..........................................................................
       PRCL-LISCAD-FIMDET.
      *>-> Move linha de total
           MOVE    "   ***    Total de Cadastros ->         ***" TO WGL-LG.
           MOVE    WRCL-TOTCOD  TO   W-MZ07I.
           MOVE    W-MZ07I   TO   WGL-LG(33:7).
           MOVE    "*** Total da Divida ->                    ***" TO WGL-LG(88:45).
           MOVE    WRCL-TOTDIV  TO   W-MZP12V2.
           MOVE    W-MZP12V2 TO   WGL-LG(111:18).
      *>-> Imprime a linha
           PERFORM                PRN-IMPLIN.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime linha ou exportado dados com as colunas mescladas....................................................
       PRCL-IMPSIM-EXLMES.
      *>-> Se salto entre cadastros deve ser traço
           IF WSLI-SALTO-TRA AND WGL-LG IS EQUAL TO SPACES
      *>-> Linha com traços
              IF WSLI-LIMCID-160
                 MOVE ALL "-" TO  WGL-LG(1:160),
              ELSE,
                 MOVE ALL "-" TO  WGL-LG(1:132),
              END-IF,
           END-IF.
      *>-> Se for excel modo simplificado
           IF LISTA-AUT AND WGL-LG(1:132) IS EQUAL TO ALL "-"
      *>-> exportar uma linha em branco
             PERFORM              PRN-IMPLBX,
           ELSE,
      *>-> Imprime/Exporta linha complementar
              PERFORM             PRN-IMPCOM,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                        C O R R E Ç Ã O   D E   L I M I T E   D E   C R É D I T O                         <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       CORRECAO-LIMITE-CREDITO    SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Correção de limite de crédito................................................................................
       PCLC-INICIO.
      *>-> Inicializa os campos da seleção
           PERFORM                PCLC-INISEL.
      *>-> Aceita seleção
           PERFORM                PCLC-ACESEL.
      *>-> Se não confirmou
           IF NOT CNF-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Classifica os cadastros conforme a seleção
           PERFORM                PCLC-CLACAD.
      *>-> Se deve interromper o processamento ou não criou arquivo virtual
           IF MK-INPSIM OR CLC-ABERTO-NAO
      *>-> Exibe a mensagem de seleção nula
              PERFORM             EXB-MEN-ERRPROC,
      *>-> Fecha o virtual
              PERFORM             CLC-CLOSE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se o tipo de correção for manual
           IF WCLC-TIPCOR-MAN
      *>-> Executa manualmente as correções do limite de crédito
              PERFORM             PCLC-CORMAN,
           ELSE,
      *>-> Executa automaticamente as correções do limite de crédito
              PERFORM             PCLC-CORAUT,
           END-IF.
      *>-> Fecha o virtual
           PERFORM                CLC-CLOSE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Inicializa os campos da seleção..............................................................................
       PCLC-INISEL.
      *>-> Inicializa os valores das variáveis de aceitação
           MOVE    ZEROS     TO   WCLC-VALMIN, WCLC-VALARE, WCLC-PERCOR, WCLC-VALCOR, WCLC-PERMIN.
      *>-> Considera os cliente que não tiveram venda no período - Não
           SET     WCLC-CONCSV-NAO TO TRUE.
      *>-> Atualizar os limites - Todos
           SET     WCLC-ATULIM-TOD TO TRUE.
      *>-> Cálculo do valor da média - Média com meses da seleção
           SET     WCLC-CVLMED-TOD TO TRUE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção...............................................................................................
       PCLC-ACESEL.
      *>-> Inicializa índice da janela
           MOVE    1         TO   W-INDJAN.
      *>-> Laço de navegação entre as janelas
           PERFORM                UNTIL EXIT
      *>-> Avalia a janela que deve ser aceita
              EVALUATE            W-INDJAN,
                 WHEN 1
      *>-> Aceita janela de Seleção - Correção do limite de crédito
                    PERFORM       PCLC-ACCEPT,
                 WHEN 2
      *>-> Aceita seleção padrão de clientes/fornecedores
                    PERFORM       PCLC-SELCAD,
                 WHEN 3
      *>-> Aceita seleção padrão de pedidos
                    PERFORM       PCLC-SELPED,
                 WHEN 4
      *>-> Rotina geral de confirmação
                    PERFORM       ROG-CONFIRMA,
      *>-> Se confirmou ou abortou
                    IF CNF-SIM OR CNF-NAO
                       EXIT       PERFORM,
                    END-IF,
                 WHEN OTHER
      *>-> Indica que não confirmou
                    SET CNF-NAO   TO TRUE,
                    EXIT          PERFORM,
              END-EVALUATE,
              IF JAN-AVANCA
                 ADD 1       TO   W-INDJAN,
              ELSE,
                 SUBTRACT 1  FROM W-INDJAN,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Inicio PCLC-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para personalização do campo - Valor de arredondamento
       PCLC-CONFIG-WCLC-VALARE.
           STRING                 "Defina o valor do arredondamento. (Ex.: Arredondamento = " DELIMITED BY SIZE,
                                  MK-SMO DELIMITED BY SPACES,
                                  " 5,00, Novo limite calculado = " DELIMITED BY SIZE,
                                  MK-SMO DELIMITED BY SPACES,
                                  " 1.201,17, Valor arredondado = " DELIMITED BY SIZE,
                                  MK-SMO DELIMITED BY SPACES,
                                  " 1.206,00)" DELIMITED BY SIZE,
              INTO                WTE-ENT-L25.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para inicialização da janela - Seleção - Correção do limite de crédito
       PCLC-INICIALIZA.
      *>-> Exibe/apaga campos de percentual ou valor de correção
           PERFORM                PCLC-EXBAPG-PERVAL.
      *>-> Laço para carregar as seleções de documentos
           PERFORM                WITH TEST BEFORE
              VARYING             W-IDV FROM 1 BY 1
                 UNTIL            W-IDV IS GREATER THAN W78-OCOSLD
      *>-> Instancia o menu adicional da seleção dinâmica de documentos
              PERFORM             PSUB-INSLDI-DOC,
              PERFORM             PSUB-INMEAD-DOC,
      *>-> Carrega seleção corrente dos documentos
              PERFORM             PSUB-INSLDI-DOC,
              PERFORM             SLDINAMI-CARSEL-CORRENTE,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de entrada de campo - Tipo de correção
       PCLC-ENTCAM-WCLC-TIPCOR.
      *>-> Avalia o tipo de correção
           EVALUATE               TRUE,
      *>-> Se for por percentual
              WHEN WCLC-TIPCOR-PER
                 MOVE "O novo valor de limite de crédito será obtido através da aplicação do percentual de aumento/redu"
      &               "ção sobre o valor de limite atual" TO W25-LIT,
      *>-> Se for por valor
              WHEN WCLC-TIPCOR-VAL
                 MOVE "O novo valor de limite de crédito será o valor do limite de crédito informado na seleção"
                             TO   W25-LIT,
      *>-> Se for manual
              WHEN WCLC-TIPCOR-MAN
                 MOVE "O novo valor de limite de crédito será informado de forma manual através de uma janela de aceita"
      &               "ção"  TO   W25-LIT,
      *>-> Se for baseado nas vendas
              WHEN WCLC-TIPCOR-BNV
                 MOVE "O novo valor de limite de crédito será o valor médio por pedido. Poderá ser aplicado sobre este "
      &               "valor um percentual de aumento/redução" TO W25-LIT,
      *>-> Se for baseado na última venda
              WHEN WCLC-TIPCOR-ULV
                 MOVE "O novo valor de limite de crédito será o valor da última venda efetuada. Poderá ser aplicado sob"
      &               "re este valor um percentual de aumento/redução" TO W25-LIT,
           END-EVALUATE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de entrada de campo - Cálculo do valor da média
       PCLC-ENTCAM-WCLC-CVLMED.
      *>-> Avalia o tipo de correção
           EVALUATE               TRUE,
      *>-> Cálculo do valor da média - Média com meses da seleção
              WHEN WCLC-CVLMED-TOD
                 MOVE "O Valor médio por pedido será obtido através da divisão das vendas do período pela quantidade de"
      &               " meses da seleção" TO W25-LIT,
      *>-> Cálculo do valor da média - Média com meses movimentados
              WHEN WCLC-CVLMED-AUM
                 MOVE "O Valor médio por pedido será obtido através da divisão das vendas do período pela quantidade de"
      &               " meses com movimentação" TO W25-LIT,
           END-EVALUATE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de alteração de campo - Tipo de correção
       PCLC-ALTCAM-WCLC-TIPCOR.
      *>-> Inicializa os campos da seleção
           PERFORM                PCLC-INISEL.
      *>-> Trata evento de entrada de campo - Tipo de correção
           PERFORM                PCLC-ENTCAM-WCLC-TIPCOR.
      *>-> Exibe/apaga campos de percentual ou valor de correção
           PERFORM                PCLC-EXBAPG-PERVAL.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de alteração de campo - Cálculo do valor da média
       PCLC-ALTCAM-WCLC-CVLMED.
      *>-> Trata evento de entrada de campo - Cálculo do valor da média
           PERFORM                PCLC-ENTCAM-WCLC-CVLMED.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de saída de campo - Percentual
       PCLC-SAICAM-WCLC-PERCOR.
      *>-> Presume que não houve erro de validação
           SET     VAL-ERRNAO TO  TRUE.
      *>-> Se pode validar e o percentual estiver zerado
           IF VALIDA-SIM AND WCLC-TIPCOR-PER AND
             (WCLC-PERCOR IS EQUAL TO ZEROS OR IS LESS THAN -99,9999)
              MOVE "Percentual inválido!" TO WME-LIT,
              PERFORM             EXIBE-MENSAGEM,
      *>-> Indica erro
              SET  VAL-ERRSIM TO  TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de clique do mouse - Botão <Restrições>
       PCLC-CLIQUE-WCLC-RESDOC.
      *>-> Aceita janela de seleção das restrições de documentos
           PERFORM                PSRD-ACCEPT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Fim PCLC-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Inicio PSRD-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para inicialização da janela - Seleção - Restrições dos documentos
       PSRD-CARREGA-SELDOC.
      *>-> Carrega as seleções dos filtros de documento
           PERFORM                WITH TEST BEFORE
              VARYING             W-IDV FROM 1 BY 1
                 UNTIL            W-IDV IS GREATER THAN W78-OCOSLD
      *>-> Valida o botão que aceita seleção dos documentos para restrições
              PERFORM             PCLC-VALACE-SELDOC,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de alteração de campo - Aceita restrições dos documentos
       PSRD-ALTERA-SELDOC.
      *>-> Carrega a ocorrência atual
           MOVE    WTE-ACC-OC TO  W-IDV.
      *>-> Valida o botão que aceita seleção dos documentos para restrições
           PERFORM                PCLC-VALACE-SELDOC.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de clique do mouse - Botão de SPD do documento
       PSRD-CLIQUE-SELDOC.
      *>-> Carrega a ocorrência atual
           MOVE    WTE-ACC-OC TO  W-IDV.
      *>-> Inicializa filtro de cadastros
           MOVE    W78-DOCTAB-FDOC-COD TO WSLDINAMI-CAM.
           PERFORM                PSUB-INSLDI-DOC.
           PERFORM                SLDINAMI-INICAM.
      *>-> Bloqueia edição do filtro de cadastros
           MOVE    W78-DOCTAB-FDOC-COD TO WSLDINAMI-CAM.
           PERFORM                PSUB-INSLDI-DOC.
           PERFORM                SLDINAMI-BLOQUEIA-CAMPO.
      *>-> Não aceita confirmação
           SET     WSLDINAMI-CNFNAO TO TRUE.
      *>-> Instancia o menu adicional da seleção dinâmica de documentos
           PERFORM                PSUB-INSLDI-DOC.
           PERFORM                PSUB-INMEAD-DOC.
      *>-> Aceita seleção padrão dos documentos
           PERFORM                PSUB-INSLDI-DOC.
           PERFORM                SLDINAMI-ACCEPT.
      *>-> Carrega a descrição da seleção de documentos
           PERFORM                PCLC-CARDES-SELDOC.
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Fim PSRD-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Valida o botão que aceita seleção dos documentos para restrições.............................................
       PCLC-VALACE-SELDOC.
      *>-> Se deve aceitar a seleção de documentos
           IF WCLC-SELDOC-NAO(W-IDV)
      *>-> Desabilita o botão de seleção de documento
              MOVE JSRD-PB-SELDOC-ID TO WTE-GRA-IDC,
              MOVE JSRD-RP-TABSRD-ID TO WTE-GRA-ID,
              MOVE W-IDV     TO   WTE-GRA-OCO,
              PERFORM             PTE-GRA-DESAB-CMP,
      *>-> Inicializa a descrição da seleção
              MOVE SPACES    TO   JSRD-EF-SELDOC(W-IDV),
           ELSE,
      *>-> Habilita o botão de seleção de documento
              MOVE JSRD-PB-SELDOC-ID TO WTE-GRA-IDC,
              MOVE JSRD-RP-TABSRD-ID TO WTE-GRA-ID,
              MOVE W-IDV     TO   WTE-GRA-OCO,
              PERFORM             PTE-GRA-HABIL-CMP,
      *>-> Indica que não carregou cabeçalho
              SET  WSLDINAMI-CARCAB-NAO TO TRUE,
      *>-> Carrega a descrição da seleção de documentos
              PERFORM             PCLC-CARDES-SELDOC,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Carrega a descrição da seleção de documentos.................................................................
       PCLC-CARDES-SELDOC.
      *>-> Carrega a descrição da seleção
           SET     WSLDINAMI-TCB132 TO TRUE.
           SET     WSLDINAMI-CABORD-NAO TO TRUE.
           PERFORM                PSUB-INSLDI-DOC.
           PERFORM                SLDINAMI-RETCAB.
           MOVE    WSLDINAMI-CAB-1 TO JSRD-EF-SELDOC(W-IDV).
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Exibe/apaga campos de percentual ou valor de correção........................................................
       PCLC-EXBAPG-PERVAL.
      *>-> Exibe o cálculo do valor da média
           MOVE    JCLC-CO-WCLC-CVLMED-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Exibe o percentual de aumento/redução
           MOVE    JCLC-EF-WCLC-PERCOR-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Habilita o valor
           MOVE    JCLC-EF-WCLC-VALCOR-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Habilita o valor mínimo
           MOVE    JCLC-EF-WCLC-VALMIN-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Habilita o valor de arredondamento
           MOVE    JCLC-EF-WCLC-VALARE-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Habilita o campo de percentual mínimo para reajuste
           MOVE    JCLC-EF-WCLC-PERMIN-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Habilita o campo de considera cliente sem venda no período
           MOVE    JCLC-CB-WCLC-CONCSV-ID TO WTE-ID.
           PERFORM                PTE-HABIL.
      *>-> Avalia o tipo de correção
           EVALUATE               TRUE,
      *>-> Se for por percentual
              WHEN WCLC-TIPCOR-PER
      *>-> Apaga o campo de valor de correção
                 MOVE JCLC-EF-WCLC-VALCOR-ID TO WTE-ID,
                 PERFORM          PTE-APAGA,
      *>-> Exibe o percentual de correção
                 MOVE JCLC-EF-WCLC-PERCOR-ID TO WTE-ID,
                 PERFORM          PTE-EXIBE,
      *>-> Desabilita o campo de cálculo do valor da média
                 MOVE JCLC-CO-WCLC-CVLMED-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de percentual mínimo para reajuste
                 MOVE JCLC-EF-WCLC-PERMIN-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de considera cliente sem venda no período
                 MOVE JCLC-CB-WCLC-CONCSV-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Se for por valor
              WHEN WCLC-TIPCOR-VAL
      *>-> Apaga o campo de percentual de correção
                 MOVE JCLC-EF-WCLC-PERCOR-ID TO WTE-ID,
                 PERFORM          PTE-APAGA,
      *>-> Exibe o valor de correção
                 MOVE JCLC-EF-WCLC-VALCOR-ID TO WTE-ID,
                 PERFORM          PTE-EXIBE,
      *>-> Desabilita o campo de cálculo do valor da média
                 MOVE JCLC-CO-WCLC-CVLMED-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de valor mínimo
                 MOVE JCLC-EF-WCLC-VALMIN-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de valor de arredondamento
                 MOVE JCLC-EF-WCLC-VALARE-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de considera cliente sem venda no período
                 MOVE JCLC-EF-WCLC-PERMIN-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de considera cliente sem venda no período
                 MOVE JCLC-CB-WCLC-CONCSV-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Se for manual
              WHEN WCLC-TIPCOR-MAN
      *>-> Apaga o campo de percentual de correção
                 MOVE JCLC-EF-WCLC-PERCOR-ID TO WTE-ID,
                 PERFORM          PTE-APAGA,
      *>-> Exibe o valor de correção
                 MOVE JCLC-EF-WCLC-VALCOR-ID TO WTE-ID,
                 PERFORM          PTE-EXIBE,
      *>-> Desabilita o campo de cálculo do valor da média
                 MOVE JCLC-CO-WCLC-CVLMED-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o valor
                 MOVE JCLC-EF-WCLC-VALCOR-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de valor mínimo
                 MOVE JCLC-EF-WCLC-VALMIN-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de valor de arredondamento
                 MOVE JCLC-EF-WCLC-VALARE-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de considera cliente sem venda no período
                 MOVE JCLC-EF-WCLC-PERMIN-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de considera cliente sem venda no período
                 MOVE JCLC-CB-WCLC-CONCSV-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Se for baseado nas vendas
              WHEN WCLC-TIPCOR-BNV
      *>-> Apaga o campo de valor de correção
                 MOVE JCLC-EF-WCLC-VALCOR-ID TO WTE-ID,
                 PERFORM          PTE-APAGA,
      *>-> Exibe o percentual de correção
                 MOVE JCLC-EF-WCLC-PERCOR-ID TO WTE-ID,
                 PERFORM          PTE-EXIBE,
      *>-> Se for baseado na última venda
              WHEN WCLC-TIPCOR-ULV
      *>-> Apaga o campo de valor de correção
                 MOVE JCLC-EF-WCLC-VALCOR-ID TO WTE-ID,
                 PERFORM          PTE-APAGA,
      *>-> Exibe o percentual de correção
                 MOVE JCLC-EF-WCLC-PERCOR-ID TO WTE-ID,
                 PERFORM          PTE-EXIBE,
      *>-> Desabilita o campo de cálculo do valor da média
                 MOVE JCLC-CO-WCLC-CVLMED-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de considera cliente sem venda no período
                 MOVE JCLC-EF-WCLC-PERMIN-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
      *>-> Desabilita o campo de considera cliente sem venda no período
                 MOVE JCLC-CB-WCLC-CONCSV-ID TO WTE-ID,
                 PERFORM          PTE-DESAB,
           END-EVALUATE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção padrão de clientes/fornecedores...............................................................
       PCLC-SELCAD.
      *>-> Avalia o tipo de controle financeiro
           EVALUATE               TRUE
      *>-> Se for tipo de controle financeiro - Receber
              WHEN GY-TIPREC OR MK-USU-ACFCLI
      *>-> Indica que processa apenas clientes e bloqueia campo
                 MOVE W78-CADTAB-FCAD-TIP TO WSLCADTAB-CAM,
                 MOVE W78-CADTAB-FCAD-TIPCLI TO WSLCADTAB-ENU(1),
                 SET WSLCADTAB-BLQSIM TO TRUE,
                 PERFORM          SLCADTAB-ADDFIL-ENUM,
      *>-> Se for tipo de controle financeiro - Pagar
              WHEN GY-TIPPAG OR MK-USU-ACFFOR
      *>-> Indica que processa apenas fornecedores e bloqueia campo
                 MOVE W78-CADTAB-FCAD-TIP TO WSLCADTAB-CAM,
                 MOVE W78-CADTAB-FCAD-TIPFOR TO WSLCADTAB-ENU(1),
                 SET WSLCADTAB-BLQSIM TO TRUE,
                 PERFORM          SLCADTAB-ADDFIL-ENUM,
           END-EVALUATE.
      *>-> Se o tipo de correção for percentual
           IF WCLC-TIPCOR-PER
      *>-> Filtra apenas cadastros com limite de crédito diferente de ZERO
              MOVE W78-CADTAB-FCAD-CRE TO WSLCADTAB-CAM,
              SET  WSLCADTAB-BLQSIM TO TRUE,
              PERFORM             SLCADTAB-ADDFIL-DIFERENTE,
           END-IF.
      *>-> Não aceita confirmação
           SET     WSLCADTAB-CNFNAO TO TRUE.
      *>-> Aceita seleção padrão
           PERFORM                SLCADTAB-ACCEPT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção padrão de pedidos.............................................................................
       PCLC-SELPED.
      *>-> Se o tipo de correção não for baseado nas vendas
           IF NOT WCLC-TIPCOR-BNV
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Define a ordem para o processamento - Cliente+Data Faturamento para melhorar desempenho porque leitura é
      *>-> ...feita dentro de laço
           MOVE    W78-FATTAB-ORDCCL TO WSLFATTAB-ORD(1).
           PERFORM                SLFATTAB-SET-ORDEM.
      *>-> Bloqueia o campo do Código do cliente já aceito
           MOVE    W78-FATTAB-NFAT-CLI TO WSLFATTAB-CAM.
           PERFORM                SLFATTAB-BLOQUEIA-CAMPO.
      *>-> Ativa retorno de conteúdo de filtro
           MOVE    W78-FATTAB-NFAT-DAT TO WSLFATTAB-CAM.
           PERFORM                SLFATTAB-ATIVA-GETFIL.
      *>-> Não aceita confirmação
           SET     WSLFATTAB-CNFNAO TO TRUE.
      *>-> Aceita seleção padrão pedidos do faturamento
           PERFORM                SLFATTAB-ACCEPT.
      *>-> Retorna inicial/final - Data de faturamento
           MOVE    W78-FATTAB-NFAT-DAT TO WSLFATTAB-CAM.
           PERFORM                SLFATTAB-GETFIL.
      *>-> Guarda as datas inicial/final
           MOVE    WSLFATTAB-INIDAT TO WCLC-DATINI.
           MOVE    WSLFATTAB-FINDAT TO WCLC-DATFIN.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Classifica os cadastros conforme a seleção...................................................................
       PCLC-CLACAD.
      *>-> Inicializa o contador de cadastros processados
           MOVE    ZEROS     TO   W-I4D.
      *>-> Mensagem para processamento
           MOVE    "Classificando os cadastros..." TO MK-PRCMSG.
      *>-> Indica que como deve exibir janela de processamento - Normal
           SET     WSLCADTAB-PRCNOR TO TRUE.
      *>-> Posiciona de acordo com a ordem da seleção dos cadastros
           PERFORM                SLCADTAB-START-NLESS.
      *>-> Faz a leitura sequencial para classificação
           PERFORM                UNTIL EXIT
      *>-> Lê sequencialmente pela ordem da seleção padrão dos cadastros
              PERFORM             SLCADTAB-READ-NEXT,
      *>-> Se não leu ok ou interrompeu o processamento
              IF NOT FS-CAD-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Incrementa o contador de cadastros processados
              ADD  1         TO   W-I4D,
      *>-> Se o tipo de correção for manual e ultrapassou a quantidade máxima de registros permitidos
              IF WCLC-TIPCOR-MAN AND W-I4D IS GREATER THAN W78-QTDCAD
                 MOVE "A quantidade de cadastros processados ultrapassa a quantidade máxima de cadastros que podem ser "
      &               "alterados simultaneamente (%1n). Somente será permitido realizar a correção manual do limite de "
      &               "crédito para os registros já processados!" TO WME-LIT,
                 MOVE W78-QTDCAD  TO WME-SUB(1),
                 PERFORM          EXIBE-MENSAGEM,
                 EXIT             PERFORM,
              END-IF,
      *>-> Indica que o cadastro não possui documento com restrição
              SET  WCLC-CADPDR-NAO TO TRUE,
      *>-> Laço para leitura dos registros dos cadastros
              PERFORM             WITH TEST BEFORE
                 VARYING          W-IDV FROM 1 BY 1
                    UNTIL         W-IDV IS GREATER THAN W78-OCOSLD
      *>-> Se aceita a seleção de documentos para as restrições
                 IF WCLC-SELDOC-SIM(W-IDV)
      *>-> Código do cliente/fornecedor
                    MOVE W78-DOCTAB-FDOC-COD TO WSLDINAMI-CAM,
                    MOVE FCAD-COD TO WSLDINAMI-ININUI,
                    PERFORM       PSUB-INSLDI-DOC,
                    PERFORM       SLDINAMI-ADDFIL-IGUAL,
      *>-> Verifica se o cadastro possui algum documento restringido
                    PERFORM       PSUB-INSLDI-DOC,
                    PERFORM       SLDINAMI-POSSUI-REGISTRO,
      *>-> Se encontrou algum registro
                    IF WSLDINAMI-STA-OK
      *>-> Indica que o cadastro possui documento com restrição
                       SET WCLC-CADPDR-SIM TO TRUE,
                       EXIT       PERFORM,
                    END-IF,
                 END-IF,
              END-PERFORM,
      *>-> Se o cadastro possui documento com restrição
              IF WCLC-CADPDR-SIM
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Grava registro no virtual
              PERFORM             PCLC-CLACAD-GRVVIR,
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grava registro no virtual....................................................................................
       PCLC-CLACAD-GRVVIR.
      *>-> Se não criou o arquivo virtual
           IF CLC-ABERTO-NAO
      *>-> Cria o arquivo virtual
              PERFORM             CLC-OPEN,
           END-IF.
      *>-> Inicializa o registro do arquivo virtual
           INITIALIZE             W-CLC-REG.
      *>-> Código do cadastro
           MOVE    FCAD-COD  TO   W-CLC-COD.
      *>-> Descrição do cliente/fornecedor
           MOVE    FCAD-DES  TO   W-CLC-DES.
      *>-> Limite de crédito atual
           MOVE    FCAD-CRE  TO   W-CLC-CRA.
      *>-> Grava registro no arquivo virtual
           PERFORM                CLC-WRITE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Executa manualmente as correções do limite de crédito........................................................
       PCLC-CORMAN.
      *>-> Carrega a tabela dos cadastros a terem limites alterados
           PERFORM                PCLC-CORMAN-CARTCA.
      *>-> Se deve interromper o processamento - SIM
           IF MK-INPSIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Faz a seleção da alteração manual dos limites de crédito
           PERFORM                PCLC-CORMAN-SELCRE.
      *>-> Se não confirmou
           IF CNF-NAO
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Atualiza a correção do limite de crédito manual
           PERFORM                PCL-CLC-ATUMAN.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Carrega a tabela dos cadastros a terem limites alterados.....................................................
       PCLC-CORMAN-CARTCA.
      *>-> Inicializa tabela dos cadastros a terem limites alterados
           INITIALIZE             WCLC-TABCAD.
      *>-> Inicializa o índice auxiliar
           MOVE    ZEROS     TO   W-IDV.
      *>-> Mensagem para processamento
           MOVE    "Carregando os cadastros..." TO MK-PRCMSG.
      *>-> Posiciona o arquivo virtual de revendas
           MOVE    LOW-VALUES TO  W-CLC-CHA.
           PERFORM                CLC-START-NLESS.
      *>-> Lê o arquivo virtual sequencialmente
           PERFORM                UNTIL EXIT
      *>-> Lê sequencialmente o arquivo virtual
              PERFORM             CLC-READ-NEXT,
      *>-> Incrementa/Exibe o registro processado
              MOVE "Cliente: 9999999" TO MK-CPR,
              MOVE W-CLC-COD TO   MK-CPR(10:07),
      *>-> Incrementa/Exibe os registros lidos
              PERFORM             EJP-REG-LIDO,
      *>-> Se não leu ok ou deve interromper o processamento
              IF NOT CLC-FS-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Incrementa/Exibe o registro processado
              PERFORM             EJP-REG-PROC,
      *>-> Incrementa o índice auxiliar
              ADD  1         TO   W-IDV,
      *>-> Código do cadastro
              MOVE W-CLC-COD TO   WCLC-CODCAD(W-IDV),
      *>-> Novo valor do limite de crédito
              MOVE W-CLC-CRA TO   WCLC-NOVCRE(W-IDV),
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Faz a seleção da alteração manual dos limites de crédito.....................................................
       PCLC-CORMAN-SELCRE.
      *>-> Inicializa o grupo de repetição de cadastros
           INITIALIZE             JALM-RP-WCLC-TABCAD ALL TO VALUE.
      *>-> Aceita janela de Correção manual do limite de crédito
           PERFORM                PALM-ACCEPT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Inicio PALM-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para personalização do campo - Moeda do limite de crédito
       PALM-CONFIG-MLCCAD.
      *>-> Carrega as moedas nas opções da combo-box
           PERFORM                PMCM-CAR-MOEDAS.
           MOVE    WMCM-NULCOM TO WTE-COM-ALT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para inicialização da janela - Correção manual do limite de crédito
       PALM-INICIALIZA.
      *>-> Varre a tabela dos cadastros a terem seus limites alterados
           PERFORM                WITH TEST BEFORE
              VARYING             W-IDV FROM 1 BY 1
                 UNTIL            W-IDV IS GREATER THAN W78-QTDCAD
      *>-> Código do cadastro
              MOVE WCLC-CODCAD(W-IDV) TO JALM-EF-WCLC-CODCAD(W-IDV), FCAD-COD,
      *>-> Faz leitura do cliente/fornecedor com bloqueio
              MOVE "READ FCADAS KEY FCAD-CHA IGNORE LOCK" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
      *>-> Se não leu ok
              IF NOT FS-CAD-OK
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Descrição do cadastro
              MOVE FCAD-DES  TO   JALM-EF-DESGRC(W-IDV),
      *>-> Se o tipo do cadastro for fornecedor
              IF FCAD-TIPFOR
                 MOVE "Fornecedor" TO JALM-EF-TIPCAD(W-IDV),
              ELSE,
                 MOVE "Cliente"   TO JALM-EF-TIPCAD(W-IDV),
              END-IF,
      *>-> Edita o CNPJ/CPF
              MOVE FCAD-CGG  TO   WCGC-CGG,
              PERFORM             EDITA-CGCCPF,
              MOVE WCGC-X18  TO   JALM-EF-CGCCAD(W-IDV),
      *>-> Cidade
              MOVE FCAD-CID  TO   JALM-EF-CIDCAD(W-IDV),
      *>-> Estado
              MOVE FCAD-EST  TO   JALM-EF-ESTCAD(W-IDV),
      *>-> Moeda do limite de crédito
              MOVE FCAD-MLC  TO   JALM-CO-MLCCAD(W-IDV),
      *>-> Novo valor do limite de crédito
              MOVE WCLC-NOVCRE(W-IDV) TO JALM-EF-WCLC-NOVCRE(W-IDV),
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento de clique no botão de Avançar - Correção manual do limite de crédito
       PALM-AVANCA.
      *>-> Monta a mensagem de gravação
           MOVE    "Confirma a gravação dos novos limites de crédito?" TO CNF-LIT.
      *>-> Pede a confirmação
           PERFORM                ROG-CONFIRMA.
      *>-> Se foi teclado Esc
           IF CNF-ESC
      *>-> Indica que não deve finalizar a aceitação
              SET  WTEG-FINACC-NAO TO TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Trata evento do botão de voltar a janela - Correção manual do limite de crédito
       PALM-VOLTA.
      *>-> Indica que não confirmou
           SET     CNF-NAO   TO   TRUE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Fim PALM-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Atualiza a correção do limite de crédito manual..............................................................
       PCL-CLC-ATUMAN.
      *>-> Desbloqueia o cadastro de cliente/fornecedor
           MOVE    "UNLOCK FCADAS" TO WARQ-CMD.
           PERFORM                ARQ-COMANDO-MK-CHA.
      *>-> Varre a tabela dos cadastros a terem seus limites alterados
           PERFORM                WITH TEST BEFORE
              VARYING             W-IDV FROM 1 BY 1
                 UNTIL            W-IDV IS GREATER THAN W78-QTDCAD OR
                                  WCLC-CODCAD(W-IDV) IS EQUAL TO ZEROS
      *>-> Move o código do cadastro
              MOVE WCLC-CODCAD(W-IDV) TO FCAD-COD,
      *>-> Faz leitura do cliente/fornecedor com bloqueio
              MOVE "READ FCADAS KEY FCAD-CHA LOCK EXBMSG" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
      *>-> Se não leu ok ou não mudou de limite de crédito
              IF NOT FS-CAD-OK OR WCLC-NOVCRE(W-IDV) IS EQUAL TO FCAD-CRE,
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 16 - Alterações do limite de crédito
              PERFORM             PFB-LER-FOBCAD-REGALC,
      *>-> Carrega o novo valor do limite de crédito
              MOVE WCLC-NOVCRE(W-IDV) TO FCAD-CRE,
      *>-> Regrava o cadastro de clientes/fornecedores
              MOVE "REWRITE FCADAS FREG-CAD" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
      *>-> Atualiza as alterações do limite de crédito
              PERFORM             PCLC-ATUALC,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Executa automaticamente as correções do limite de crédito....................................................
       PCLC-CORAUT.
      *>-> Calcula os novos limites de crédito
           PERFORM                PCLC-CORAUT-CALLCR.
      *>-> Se não processou nada
           IF LISTOU-NAO
      *>-> Exibe a mensagem de seleção nula
              PERFORM             EXB-MEN-ERRPROC,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se não processou nada ou deve interromper o processamento
           IF MK-INPSIM
              MOVE "Processamento interrompido pelo operador. Não foi possível finalizar o cálculo dos novos limites de"
      &            " crédito. Impossível continuar!" TO WME-LIT,
              PERFORM             EXIBE-MENSAGEM,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Efetua aceitação de quais limites devem assumir o novo valor
           PERFORM                PCLC-CORAUT-ACELCR.
      *>-> Se não processou nada
           IF LISTOU-NAO
              EXIT                PARAGRAPH,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Calcula os novos limites de crédito..........................................................................
       PCLC-CORAUT-CALLCR.
      *>-> Indica que não processou nada ainda
           SET     LISTOU-NAO TO  TRUE.
      *>-> Mensagem para processamento
           MOVE    "Calculando os novos limites de crédito..." TO MK-PRCMSG.
      *>-> Posiciona o arquivo virtual de revendas
           MOVE    LOW-VALUES TO  W-CLC-CHA.
           PERFORM                CLC-START-NLESS.
      *>-> Lê o arquivo virtual sequencialmente
           PERFORM                UNTIL EXIT
      *>-> Lê sequencialmente o arquivo virtual
              PERFORM             CLC-READ-NEXT,
      *>-> Incrementa/Exibe o registro processado
              MOVE "Cliente: 9999999" TO MK-CPR,
              MOVE W-CLC-COD TO   MK-CPR(10:07),
      *>-> Incrementa/Exibe os registros lidos
              PERFORM             EJP-REG-LIDO,
      *>-> Se não leu OK ou deve interromper o processamento
              IF NOT CLC-FS-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Incrementa/Exibe o registro processado
              PERFORM             EJP-REG-PROC,
      *>-> Calcula os novos limites
              PERFORM             PCLC-CORAUT-CALNOL,
      *>-> Se deve interromper o processamento ou deve ignorar cadastro
              IF MK-INPSIM OR WCLC-IGNCAD-SIM
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Indica que já processou algo
              SET  LISTOU-SIM TO  TRUE,
      *>-> Grava registro no arquivo virtual
              PERFORM             CLC-RE-WRITE,
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Calcula os novos limites.....................................................................................
       PCLC-CORAUT-CALNOL.
      *>-> Indica que não deve ignorar o cadastro
           SET     WCLC-IGNCAD-NAO TO TRUE.
      *>-> Avalia o tipo de correção
           EVALUATE               TRUE,
      *>-> Tipo de correção - Percentual
              WHEN WCLC-TIPCOR-PER
      *>-> Calcula os novos limites de crédito pelo percentual
                 PERFORM          PCLC-CORAUT-CALPER,
      *>-> Tipo de correção - Valor
              WHEN WCLC-TIPCOR-VAL
      *>-> Calcula os novos limites de crédito pelo valor
                 PERFORM          PCLC-CORAUT-CALVAL,
      *>-> Tipo de correção - Baseado nas vendas
              WHEN WCLC-TIPCOR-BNV
      *>-> Calcula os novos limites de crédito baseado nas vendas
                 PERFORM          PCLC-CORAUT-CALBVE,
      *>-> Tipo de correção - Última venda
              WHEN WCLC-TIPCOR-ULV
      *>-> Calcula os novos limites de crédito baseado na última venda
                 PERFORM          PCLC-CORAUT-CALBUV,
           END-EVALUATE.
      *>-> Se deve interromper o processamento ou deve ignorar cadastro
           IF MK-INPSIM OR WCLC-IGNCAD-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se foi informado um valor mínimo e o valor mínimo for maior que o novo limite calculado
           IF WCLC-VALMIN IS NOT EQUAL TO ZEROS AND
              WCLC-VALMIN IS GREATER THAN W-CLC-CRN
      *>-> Atualiza o limite calculado com o valor mínimo
              MOVE WCLC-VALMIN TO W-CLC-CRN,
           END-IF.
      *>-> Se tem valor de arredondamento e novo limite calculado tem decimais
           IF WCLC-VALARE IS NOT EQUAL TO ZEROS AND
              FUNCTION INTEGER (W-CLC-CRN) IS NOT EQUAL TO W-CLC-CRN
      *>-> Move a quantidade inteira
              MOVE FUNCTION INTEGER(W-CLC-CRN) TO W-CLC-CRN,
      *>-> Adiciona o valor do arredondamento
              ADD  WCLC-VALARE TO W-CLC-CRN,
           END-IF.
      *>-> Se deve processar somente os limites que aumentaram o limite e o limite não aumentou
           IF WCLC-ATULIM-AUM AND W-CLC-CRN IS NOT GREATER THAN W-CLC-CRA
      *>-> Indica que deve ignorar o cadastro
              SET  WCLC-IGNCAD-SIM TO TRUE,
      *>-> Deleta o registro de rateio do lote
              PERFORM             CLC-DELETE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se deve processar somente os limites que diminuiram o limite e o limite não diminuiu
           IF WCLC-ATULIM-DIM AND W-CLC-CRN IS NOT LESS THAN W-CLC-CRA
      *>-> Indica que deve ignorar o cadastro
              SET  WCLC-IGNCAD-SIM TO TRUE,
      *>-> Deleta o registro de rateio do lote
              PERFORM             CLC-DELETE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se foi informado o percentual mínimo para reajuste
           IF WCLC-PERMIN IS NOT EQUAL TO ZEROS
      *>-> Se o novo limite não for maior que o atual
      *>-> OBSERVAÇÃO: O percentual mínimo de reajuste sempre será positivo, logo, se o valor do novo limite de crédito
      *>->             for menor que o atual, significa que o percentual de reajuste deste seria negativo e
      *>->             consequentemente menor que o percentual mínimo para reajuste informado
              IF W-CLC-CRN IS NOT GREATER THAN W-CLC-CRA
      *>-> Indica que deve ignorar o cadastro
                 SET WCLC-IGNCAD-SIM TO TRUE,
      *>-> Deleta o registro de rateio do lote
                 PERFORM          CLC-DELETE,
                 EXIT             PARAGRAPH,
              END-IF,
      *>-> Calcula o percentual de reajuste
              COMPUTE       W-AVD = (100 - (W-CLC-CRA / W-CLC-CRN * 100)),
      *>-> Se o reajuste for menor que o percentual mínimo para reajuste
              IF W-AVD IS LESS THAN WCLC-PERMIN
      *>-> Indica que deve ignorar o cadastro
                 SET WCLC-IGNCAD-SIM TO TRUE,
      *>-> Deleta o registro de rateio do lote
                 PERFORM          CLC-DELETE,
                 EXIT             PARAGRAPH,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Calcula os novos limites de crédito pelo percentual..........................................................
       PCLC-CORAUT-CALPER.
      *>-> Calcula o novo limite de crédito
           COMPUTE      W-CLC-CRN ROUNDED = W-CLC-CRA + (W-CLC-CRA * WCLC-PERCOR / 100).
      *>-> Se estourou o valor do limite de crédito
           IF W-CLC-CRN IS GREATER THAN 9999999999,99
              MOVE "O novo limite de crédito do cliente/fornecedor %1n ultrapassou o valor máximo. Será assumido como v"
      &            "alor novo o valor atual!" TO WME-LIT,
              MOVE W-CLC-COD TO   WME-SUB(1),
              PERFORM             EXIBE-MENSAGEM,
      *>-> Atualiza o valor novo com o valor atual do limite de crédito
              MOVE W-CLC-CRA TO   W-CLC-CRN,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Calcula os novos limites de crédito pelo valor...............................................................
       PCLC-CORAUT-CALVAL.
      *>-> Move o valor para correção do limite de crédito/valor dívida
           MOVE    WCLC-VALCOR TO W-CLC-CRN.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Calcula os novos limites de crédito baseado nas vendas.......................................................
       PCLC-CORAUT-CALBVE.
      *>-> Inicializa a data auxiliar
           MOVE    LOW-VALUES TO  WCLC-DATAUX.
      *>-> Inicializa a quantidade de meses utilizado no cálculo do valor médio dos pedidos
           MOVE    ZEROS     TO   W-I4D.
      *>-> Inicializa o valor total das vendas
           MOVE    ZEROS     TO   W-VDV.
      *>-> Adiciona filtro de código do cliente
           MOVE    W78-FATTAB-NFAT-CLI TO WSLFATTAB-CAM.
           MOVE    W-CLC-COD TO   WSLFATTAB-ININUI.
           PERFORM                SLFATTAB-ADDFIL-IGUAL.
      *>-> Indica que como deve exibir janela de processamento - Normal
           SET     WSLFATTAB-PRCNOR TO TRUE.
      *>-> Posiciona de acordo com a ordem da seleção pedidos
           PERFORM                SLFATTAB-START-NLESS.
      *>-> Faz a leitura sequencial para classificação
           PERFORM                UNTIL EXIT
      *>-> Lê sequencialmente pela ordem da seleção padrão pedidos
              PERFORM             SLFATTAB-READ-NEXT,
      *>-> Se não leu ok ou interromper o processamento
              IF NOT FS-FAT-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Se trocou de período
              IF NFAT-PER IS NOT EQUAL TO WCLC-DATAUX
      *>-> Incrementa o contador de meses
                 ADD 1       TO   W-I4D,
      *>-> Atualiza a data auxiliar
                 MOVE NFAT-PER TO WCLC-DATAUX,
              END-IF,
      *>-> Acumula o valor total das vendas
              ADD  NFAT-VAL  TO   W-VDV,
           END-PERFORM.
      *>-> Se for interromper o processamento
           IF MK-INPSIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se não considera os cadastros que não tiveram venda no período e não possui venda no período informado
      *>-> OBSERVAÇÃO: Se o cadastro não possui venda no período, este não deve ser carregado para a janela onde será
      *>->             possível selecionar quais clientes terão seus limites de crédito alterados. Somente serão
      *>->             considerado estes cadastros, se for selecionado na janela de seleção que considera os cliente que
      *>->             não tiveram venda no período
           IF WCLC-CONCSV-NAO AND W-VDV IS EQUAL TO ZEROS
      *>-> Indica que deve ignorar o cadastro
              SET  WCLC-IGNCAD-SIM TO TRUE,
      *>-> Deleta o registro de rateio do lote
              PERFORM             CLC-DELETE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Cálculo do valor da média - Média com meses da seleção
           IF WCLC-CVLMED-TOD
      *>-> Move a data inicial da seleção
              MOVE WCLC-DATINI TO WSRIDAT-DATINI,
      *>-> Move a data final  da seleção
              MOVE WCLC-DATFIN TO WSRIDAT-DATFIN,
              PERFORM             SRIDAT-NUMERO-ANOS-MESES,
      *>-> Número de meses do período
              MOVE WSRIDAT-NUMMES TO W-I4D,
           END-IF.
      *>-> Se não calculado a quantidade de dias
      *>-> OBSERVAÇÃO: Dependendo da seleção efetuada e da existência ou não de movimentos no período, a quantidade de
      *>->             meses para utilizar no cálculo do valor médio dos pedidos pode chegar até este ponto com zeros
           IF W-I4D IS EQUAL TO ZEROS
              MOVE 1         TO   W-I4D,
           END-IF.
      *>-> Calcula o novo limite de crédito (valor médio dos pedidos)
           COMPUTE      W-CLC-CRN ROUNDED = W-VDV / W-I4D.
      *>-> Aplica o percentual de aumento/redução
           COMPUTE      W-CLC-CRN ROUNDED = W-CLC-CRN + (W-CLC-CRN * WCLC-PERCOR / 100).
      *>-> Se estourou o valor do limite de crédito
           IF W-CLC-CRN IS GREATER THAN 9999999999,99
              MOVE "O novo limite de crédito do cliente/fornecedor %1n ultrapassou o valor máximo. Será assumido como v"
      &            "alor novo o valor atual!" TO WME-LIT,
              MOVE W-CLC-COD TO   WME-SUB(1),
              PERFORM             EXIBE-MENSAGEM,
      *>-> Atualiza o valor novo com o valor atual do limite de crédito
              MOVE W-CLC-CRA TO   W-CLC-CRN,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Calcula os novos limites de crédito baseado na última venda..................................................
       PCLC-CORAUT-CALBUV.
      *>-> Inicializa o valor total da última venda
           MOVE    ZEROS     TO   W-VDV.
      *>-> Abre filtros da seleção padrão
           PERFORM                SLNOTTAB-ABRE-FILTROS.
      *>-> Código do cliente/fornecedor
           MOVE    W78-NOTTAB-NNOT-CLI TO WSLNOTTAB-CAM.
           MOVE    W-CLC-COD TO   WSLNOTTAB-ININUI.
           PERFORM                SLNOTTAB-ADDFIL-IGUAL.
      *>-> Posição de faturamento
           MOVE    W78-NOTTAB-NNOT-POS TO WSLNOTTAB-CAM.
           MOVE    W78-NOTTAB-NNOT-POSFAT TO WSLNOTTAB-ENU(01).
           PERFORM                SLNOTTAB-ADDFIL-ENUM.
      *>-> Indica ordem de cliente/data
           MOVE    W78-NOTTAB-ORDCCL TO WSLNOTTAB-ORD(01).
           PERFORM                SLNOTTAB-SET-ORDEM.
      *>-> Varre os registros do arquivo de NOTAS DO FATURAMENTO
           SET     WSLNOTTAB-PRCNOR TO TRUE.
           PERFORM                SLNOTTAB-START-NGREATER.
           PERFORM                UNTIL EXIT
              PERFORM             SLNOTTAB-READ-PREVIOUS,
              IF NOT FS-NOT-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Se Totais das naturezas remessa - Zerados
              IF NOT NNOT-TNRZER
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Carrega o valor total da última venda
              MOVE NNOT-VAL  TO   W-VDV,
              EXIT                PERFORM,
           END-PERFORM.
      *>-> Se for interromper o processamento - SIM
           IF MK-INPSIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Se o cadastro não tiver última venda
           IF W-VDV IS EQUAL TO ZEROS
      *>-> Indica que deve ignorar o cadastro
              SET  WCLC-IGNCAD-SIM TO TRUE,
      *>-> Deleta o registro de rateio do lote
              PERFORM             CLC-DELETE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Calcula o novo limite de crédito
           COMPUTE      W-CLC-CRN ROUNDED = W-VDV + (W-VDV * WCLC-PERCOR / 100).
      *>-> Se estourou o valor do limite de crédito
           IF W-CLC-CRN IS GREATER THAN 9999999999,99
              MOVE "O novo limite de crédito do cliente/fornecedor %1n ultrapassou o valor máximo. Será assumido como v"
      &            "alor novo o valor atual!" TO WME-LIT,
              MOVE W-CLC-COD TO   WME-SUB(1),
              PERFORM             EXIBE-MENSAGEM,
      *>-> Atualiza o valor novo com o valor atual do limite de crédito
              MOVE W-CLC-CRA TO   W-CLC-CRN,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Efetua aceitação de quais limites devem assumir o novo valor.................................................
       PCLC-CORAUT-ACELCR.
      *>-> Indica que não processou nada ainda
           SET     LISTOU-NAO TO  TRUE.
      *>-> Move dados para janela de múltipla seleção
           PERFORM                PCLC-CORAUT-ACELCR-MOVPIV.
      *>-> Aceita janela de seleção de itens
           PERFORM                PCLC-CORAUT-ACELCR-ACEJAN.
      *>-> Se não confirmou
           IF WME-RET-NAO
      *>-> Apaga a janela, se exibida, e encerra o programa
              PERFORM             PSI-ENCERRA,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Atualiza os cadastros que foram selecionados para considerar o novo limite de crédito
           PERFORM                PCLC-CORAUT-ACELCR-ATUCLC.
      *>-> Apaga a janela, se exibida, e encerra o programa
           PERFORM                PSI-ENCERRA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Move dados para janela de múltipla seleção...................................................................
       PCLC-CORAUT-ACELCR-MOVPIV.
      *>-> Título das colunas
           MOVE    "Código þDescrição                       þLim.créd.atual þNovo lim.créd. þ" TO WSI-CAB.
      *>-> Título da janela
           MOVE    "Limites de crédito" TO WSI-TIT.
      *>-> Move o cabeçalho
           MOVE    "Selecione os cadastros que devem assumir os novos limites de crédito calculados" TO WSI-MSG1.
      *>-> Deve selecionar pelo menos um item
           SET     WSI-OBRSIM TO  TRUE.
      *>-> Legenda do botão adicional 1
           MOVE    "F2-Aumentaram" TO WSI-LEG.
      *>-> Indica que utiliza tecla de atalho F2
           SET     WSI-KEYF02 TO  TRUE.
      *>-> Legenda do botão adicional 1
           MOVE    "F3-Reduziram" TO WSI-LG2.
      *>-> Indica que utiliza tecla de atalho F2
           SET     WSI-KE2F03 TO  TRUE.
           PERFORM                PSI-INICIALIZA.
      *>-> Move tipos das colunas
           MOVE    "NUM.ALF.NU2.NU2" TO WSI-TIP.
      *>-> Insere tipos das colunas da janela de seleção de itens
           PERFORM                PSI-TIPOS-COLUNAS.
      *>-> Define as colunas a serem exibidas
           MOVE    "001.002.003.004" TO WSI-SCO.
           PERFORM                PSI-SEQUENCIA-COLUNAS.
      *>-> Sequencial identificador do grid
           MOVE    W78-SQG-SRI065-002 TO WSI-SEQIDG.
      *>-> Mensagem para processamento
           MOVE    "Processando os novos limites de crédito..." TO MK-PRCMSG.
      *>-> Posiciona o arquivo virtual de revendas
           MOVE    LOW-VALUES TO  W-CLC-CHA.
           PERFORM                CLC-START-NLESS.
      *>-> Lê o arquivo virtual sequencialmente
           PERFORM                UNTIL EXIT
      *>-> Lê sequencialmente o arquivo virtual
              PERFORM             CLC-READ-NEXT,
      *>-> Incrementa/Exibe o registro processado
              MOVE "Cliente: 9999999" TO MK-CPR,
              MOVE W-CLC-COD TO   MK-CPR(10:07),
      *>-> Incrementa/Exibe os registros lidos
              PERFORM             EJP-REG-LIDO,
      *>-> Se não leu ok ou deve interromper o processamento
              IF NOT CLC-FS-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Incrementa/Exibe o registro processado
              PERFORM             EJP-REG-PROC,
      *>-> Move dados para linha de aceitação dos novos limite crédito
              PERFORM             PCLC-CORAUT-ACELCR-MOVLIN,
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Move dados para linha de aceitação dos novos limite crédito..................................................
       PCLC-CORAUT-ACELCR-MOVLIN.
      *>-> Inicializa a linha de aceitação dos novos limite de crédito
           MOVE    SPACES    TO   WCLC-GRCCLC.
      *>-> Move os dados para a linha de aceitação
           MOVE    W-CLC-COD TO   WL-W-CLC-COD.
           MOVE    W-CLC-DES TO   WL-W-CLC-DES.
           MOVE    W-CLC-CRA TO   WVED-NUM.
           SET     WVED-NORBWZ TO TRUE.
           PERFORM                PRG-EDTVAL.
           MOVE    WVED-X15  TO   WL-W-CLC-CRA.
           MOVE    W-CLC-CRN TO   WVED-NUM.
           SET     WVED-NORBWZ TO TRUE.
           PERFORM                PRG-EDTVAL.
           MOVE    WVED-X15  TO   WL-W-CLC-CRN.
      *>-> Move a linha do grid
           MOVE    WCLC-GRCCLC TO WSI-ITM.
      *>-> Insere a linha
           PERFORM                PSI-INSERE-ITEM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita janela de seleção de itens............................................................................
       PCLC-CORAUT-ACELCR-ACEJAN.
      *>-> Executa a seleção
           PERFORM                UNTIL EXIT,
      *>-> Aceita janela de itens
              PERFORM             PSI-ACEITA-JAN,
      *>-> Avalia o evento
              EVALUATE            TRUE,
      *>-> Se confirmou
                 WHEN WSI-RETOK
      *>-> Botões - Sim/Não
                    SET WME-BOT-SN TO TRUE,
      *>-> Pede a confirmação
                    MOVE "Os cadastros selecionados serão atualizados com o novo limite de crédito calculado! Deseja co"
      &                  "ntinuar?" TO WME-LIT,
                    PERFORM       EXIBE-MENSAGEM,
      *>-> Se foi teclado não
                    IF WME-RET-NAO
                       EXIT       PERFORM CYCLE,
                    END-IF,
                    EXIT          PERFORM,
      *>-> Se cancelou a seleção
                 WHEN WSI-RETCAN OR WSI-RETFEC
      *>-> Indica que não confirmou a seleção
                    SET WME-RET-NAO TO TRUE,
                    EXIT          PERFORM,
      *>-> Se teclou botão adicional 1
                 WHEN WSI-RETADI
      *>-> Marca somente os cadastro que tiveram aumento no limite
                    PERFORM       PCLC-CORAUT-ACELCR-MARAUM,
      *>-> Se teclou botão adicional 2
                 WHEN WSI-RETAD2
      *>-> Marca somente os cadastro que tiveram redução no limite
                    PERFORM       PCLC-CORAUT-ACELCR-MARRED,
              END-EVALUATE,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Marca somente os cadastro que tiveram aumento no limite......................................................
       PCLC-CORAUT-ACELCR-MARAUM.
      *>-> Exibe Janela de Processamento - Iniciar S/Cancelar
           SET     MK-EJPISC TO   TRUE.
      *>-> Posiciona itens no início
           PERFORM                PSI-POS-INICIO.
           PERFORM                UNTIL EXIT
              PERFORM             PSI-BUSCA-PROX,
      *>-> Incrementa/Exibe o registro lido
              PERFORM             EJP-REG-LIDO,
      *>-> Se chegou ao final
              IF WSI-FIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Move os dados do item selecionado
              MOVE WSI-ITM   TO   WCLC-GRCCLC,
      *>-> Limite de crédito atual
              MOVE WL-W-CLC-CRA   TO WGNA-LITALF,
              PERFORM             GNA-GERA-NUMERICO,
              MOVE WGNA-VLRDE2 TO W-VDV,
      *>-> Limite de crédito novo
              MOVE WL-W-CLC-CRN   TO WGNA-LITALF,
              PERFORM             GNA-GERA-NUMERICO,
              MOVE WGNA-VLRDE2 TO W-AVD,
      *>-> Se o limite de crédito novo for maior que limite de crédito atual
              IF W-AVD IS GREATER THAN W-VDV
                 SET WSI-FLGMAR   TO TRUE,
              ELSE,
                 SET WSI-FLGDES   TO TRUE,
              END-IF,
      *>-> Altera dados de um item
              PERFORM             PSI-ALTERA-ITEM,
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Marca somente os cadastro que tiveram redução no limite......................................................
       PCLC-CORAUT-ACELCR-MARRED.
      *>-> Exibe Janela de Processamento - Iniciar S/Cancelar
           SET     MK-EJPISC TO   TRUE.
      *>-> Posiciona itens no início
           PERFORM                PSI-POS-INICIO.
           PERFORM                UNTIL EXIT
              PERFORM             PSI-BUSCA-PROX,
      *>-> Incrementa/Exibe o registro lido
              PERFORM             EJP-REG-LIDO,
      *>-> Se chegou ao final
              IF WSI-FIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Move os dados do item selecionado
              MOVE WSI-ITM   TO   WCLC-GRCCLC,
      *>-> Limite de crédito atual
              MOVE WL-W-CLC-CRA   TO WGNA-LITALF,
              PERFORM             GNA-GERA-NUMERICO,
              MOVE WGNA-VLRDE2 TO W-VDV,
      *>-> Limite de crédito novo
              MOVE WL-W-CLC-CRN   TO WGNA-LITALF,
              PERFORM             GNA-GERA-NUMERICO,
              MOVE WGNA-VLRDE2 TO W-AVD,
      *>-> Se o limite de crédito novo for menor que limite de crédito atual
              IF W-AVD IS LESS THAN W-VDV
                 SET WSI-FLGMAR   TO TRUE,
              ELSE,
                 SET WSI-FLGDES   TO TRUE,
              END-IF,
      *>-> Altera dados de um item
              PERFORM             PSI-ALTERA-ITEM,
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Atualiza os cadastros que foram selecionados para considerar o novo limite de crédito........................
       PCLC-CORAUT-ACELCR-ATUCLC.
      *>-> Desbloqueia o cadastro de cliente/fornecedor
           MOVE    "UNLOCK FCADAS" TO WARQ-CMD.
           PERFORM                ARQ-COMANDO-MK-CHA.
      *>-> Posiciona para retornar todos os itens selecionaodos no SRI065
           PERFORM                PSI-POS-INICIO.
      *>-> Busca as cadastros selecionados
           PERFORM                UNTIL EXIT
      *>-> Busca o próximo marcado
              PERFORM             PSI-BUSCA-PROX-MAR,
      *>-> Se chegou ao final
              IF WSI-FIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Move os dados do item selecionado
              MOVE WSI-ITM   TO   WCLC-GRCCLC,
      *>-> Limite de crédito atual
              MOVE WL-W-CLC-COD   TO WGNA-LITALF,
              PERFORM             GNA-GERA-NUMERICO,
              MOVE WGNA-LITNUM TO FCAD-COD,
      *>-> Faz leitura do cliente/fornecedor com bloqueio
              MOVE "READ FCADAS KEY FCAD-CHA LOCK EXBMSG" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
      *>-> Se não leu ok
              IF NOT FS-CAD-OK
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Código do cadastro
              MOVE FCAD-COD  TO   WFB-COD,
      *>-> Lê o tipo de registro 16 - Alterações do limite de crédito
              PERFORM             PFB-LER-FOBCAD-REGALC,
      *>-> Limite de crédito novo
              MOVE WL-W-CLC-CRN   TO WGNA-LITALF,
              PERFORM             GNA-GERA-NUMERICO,
      *>-> Se não mudou o limite de crédito
              IF WGNA-VLRDE2 IS EQUAL TO FCAD-CRE,
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Atualiza o valor do limite de crédito
              MOVE WGNA-VLRDE2 TO FCAD-CRE,
      *>-> Regrava o cadastro de clientes/fornecedores
              MOVE "REWRITE FCADAS FREG-CAD" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
      *>-> Atualiza a alterações do limite de crédito
              PERFORM             PCLC-ATUALC,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Atualiza as alterações do limite de crédito..................................................................
       PCLC-ATUALC.
      *>-> Calcula a ocorrência para inicio do realocamento
           COMPUTE          W-I4D = W78-OCTALC - 1.
      *>-> Realoca tabela de alterações do limite de crédito
           PERFORM                WITH TEST BEFORE
              VARYING             W-IAU FROM W-I4D BY -1
                 UNTIL            W-IAU IS EQUAL TO ZEROS
              MOVE WFB-OALC(W-IAU) TO WFB-OALC(W-IAU + 1),
           END-PERFORM.
      *>-> Usuário que alterou o limite de crédito
           MOVE    MK-USU-NUP TO  WFB-USU(1).
      *>-> Origem da alteração - Correção de limite crédito
           SET     WFB-OALCLC(1)  TO TRUE.
      *>-> Avalia o tipo de correção
           EVALUATE               TRUE,
      *>-> Tipo de correção - Percentual
              WHEN WCLC-TIPCOR-PER
                 SET WFB-TALPER(1) TO TRUE,
      *>-> Tipo de correção - Valor
              WHEN WCLC-TIPCOR-VAL
                 SET WFB-TALVAL(1) TO TRUE,
      *>-> Tipo de correção - Manual
              WHEN WCLC-TIPCOR-MAN
                 SET WFB-TALMAN(1) TO TRUE,
      *>-> Tipo de correção - Baseado nas vendas
              WHEN WCLC-TIPCOR-BNV
                 SET WFB-TALBNV(1) TO TRUE,
      *>-> Tipo de correção - Última venda
              WHEN WCLC-TIPCOR-ULV
                 SET WFB-TALULV(1) TO TRUE,
           END-EVALUATE.
      *>-> Busca a data/hora atual do sistema operacional
           PERFORM                BUSCA-DATHOR.
      *>-> Data/hora de alteração
           MOVE    WDH-DATX8 TO   WFB-DTA(1).
           MOVE    WDH-HMX   TO   WFB-HMA(1).
      *>-> Limite de crédito alterado
           MOVE    FCAD-CRE  TO   WFB-LCA(1).
      *>-> Grava tipo de registro 16 da observação do cadastro
           PERFORM                PFB-GRV-FOBCAD-REGALC.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                        G E R A Ç Ã O   D E   C Ó D I G O   A L T E R N A T I V O                         <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       GERACAO-CODIGO-ALTERNATIVO SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Geração de código alternativo................................................................................
       PGCA-INICIO.
      *>-> Se não for tipo de uso de código alternativo que permita geração automática
           IF NOT (MK-CPACGC OR MK-CPALIV OR MK-CPACOD OR MK-CPAFON OR MK-CPAZSS)
              MOVE "Não está configurado um tipo de código alternativo que permita geração" TO WME-LIT,
              PERFORM             EXIBE-MENSAGEM,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Avalia o tipo de utilização do código alternativo
           EVALUATE               TRUE
      *>-> Se utiliza código alternativo com base no CNPJ e CPF
              WHEN MK-CPACGC
                 MOVE "Atenção! Ao executar esta opção o conteúdo do campo de código alternativo de todos os cadastros "
      &               "será sobreposto por parte do CNPJ se pessoa jurídica e parte do CPF quando pessoa física!þConfir"
      &               "ma o procedimento?" TO WME-LIT,
      *>-> Se utiliza código alternativo livre ou código principal
              WHEN MK-CPALIV OR MK-CPACOD
                 MOVE "Atenção! Ao executar esta opção o conteúdo do campo de código alternativo de todos os cadastros "
      &               "será sobreposto pelo código do cliente/fornecedor!þConfirma o procedimento?" TO WME-LIT,
      *>-> Se utiliza código alternativo a partir do telefone
              WHEN MK-CPAFON
                 MOVE "Atenção! Ao executar esta opção o conteúdo do campo de código alternativo de todos os cadastros "
      &               "será sobreposto pelo telefone comercial!þConfirma o procedimento?" TO WME-LIT,
      *>-> Se utiliza cód.alternativo a partir de Zona+M.reg+Seq.roteiro
              WHEN MK-CPAZSS
                 MOVE "Atenção! Ao executar esta opção o conteúdo do campo de código alternativo de todos os cadastros "
      &               "será sobreposto pelo conteúdo da Zona, Micro-região e Sequência no roteiro (00.00.XXXX).þConfirm"
      &               "a o procedimento?" TO WME-LIT,
           END-EVALUATE.
           SET     WME-ICO-QUES   TO TRUE.
           SET     WME-BOT-NS TO  TRUE.
           PERFORM                EXIBE-MENSAGEM.
      *>-> Se não confirmou
           IF WME-RET-NAO
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Processa os cadastros
           PERFORM                PGCA-PRCCAD.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Processa os cadastros........................................................................................
       PGCA-PRCCAD.
      *>-> Abre filtros da seleção padrão
           PERFORM                SLCADTAB-ABRE-FILTROS.
      *>-> Indica que como deve exibir janela de processamento - Normal
           SET     WSLCADTAB-PRCNOR TO TRUE.
      *>-> Posicionamento not less
           PERFORM                SLCADTAB-START-NLESS.
      *>-> Lê sequencialmente o cadastro
           PERFORM                UNTIL EXIT
      *>-> Leitura next
              SET  WSLCADTAB-ATELIB-SIM TO TRUE,
              PERFORM             SLCADTAB-READ-NEXT-LOCK,
      *>-> Se chegou ao final da seleção ou se deve interromper o processamento
              IF NOT FS-CAD-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Gera o código alternativo
              PERFORM             PGCA-PRCCAD-GERCAL,
      *>-> Regrava o cadastro com o código alternativo gerado
              MOVE "REWRITE FCADAS FREG-CAD" TO WARQ-CMD,
              PERFORM             ARQ-COMANDO-MK-CHA,
           END-PERFORM.
      *>-> Apaga a janela de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Gera o código alternativo....................................................................................
       PGCA-PRCCAD-GERCAL.
      *>-> Limpa o campo de código alternativo
           MOVE    SPACES    TO   FCAD-CAL.
      *>-> Avalia o tipo de utilização do código alternativo
           EVALUATE               TRUE
      *>-> Se utiliza código alternativo com base no CNPJ e CPF
              WHEN MK-CPACGC
      *>-> Se for pessoa física
                 IF FCAD-TINFIS
                    MOVE FCAD-CGC TO W-NUI11,
                    STRING        W-NUI11(1:3), W-NUI11(10:2), DELIMITED BY SIZE
                       INTO       FCAD-CAL,
                 ELSE,
                    MOVE FCAD-CGC TO W-NUI14,
                    STRING        W-NUI14(3:3), W-NUI14(13:2), DELIMITED BY SIZE
                       INTO       FCAD-CAL,
                 END-IF,
      *>-> Se utiliza código alternativo livre ou código principal
              WHEN MK-CPALIV OR MK-CPACOD
                 MOVE FCAD-COD TO W-NUI07,
                 MOVE W-NUI07 TO  WGNA-LITALF,
                 PERFORM          GNA-GERA-NUMERICO,
                 MOVE WGNA-LITALF TO FCAD-CAL,
      *>-> Se utiliza código alternativo a partir do telefone
              WHEN MK-CPAFON
                 MOVE FCAD-FON TO W-MZ14I,
                 MOVE W-MZ14I TO  WGNA-LITALF,
                 PERFORM          GNA-GERA-NUMERICO,
                 MOVE WGNA-LITALF TO FCAD-CAL,
      *>-> Se utiliza cód.alternativo a partir de Zona+M.reg+Seq.roteiro
              WHEN MK-CPAZSS
                 MOVE FCAD-ZON TO WGCA-ZON,
                 MOVE FCAD-MRG TO WGCA-MRG,
                 MOVE 4      TO   W-ADV,
      *>-> Percorre os dados da sequência do roteiro para montar o terceiro nível do código alternativo
                 PERFORM          WITH TEST BEFORE
                    VARYING       W-IDV FROM 4 BY -1
                       UNTIL      W-IDV IS EQUAL TO ZEROS
      *>-> Se caracter da sequência não for espaço
                    IF FCAD-SRO(W-IDV:1) IS NOT EQUAL TO SPACES
      *>-> Atribui caracter digitado para o código alternativo
                       MOVE FCAD-SRO(W-IDV:1) TO WGCA-SRO(W-ADV:1),
                       SUBTRACT 1 FROM W-ADV,
                    END-IF,
                 END-PERFORM,
      *>-> Move zero para o espaço restante
                 PERFORM          WITH TEST BEFORE
                    VARYING       W-IDV FROM W-ADV BY -1
                       UNTIL      W-IDV IS EQUAL TO ZEROS
                    MOVE "0" TO   WGCA-SRO(W-ADV:1),
                    SUBTRACT 1 FROM W-ADV,
                 END-PERFORM,
      *>-> Se o primeiro caracter for zero e o último for numérico
                 IF WGCA-SRO(1:1) IS EQUAL TO ZERO AND
                    WGCA-SRO(4:1) IS NUMERIC
      *>-> Realoca os três últimos caracteres da sequência já editada para a esquerda e mantém espaço no último caracter
                    MOVE WGCA-SRO  TO WGCA-SEQROT,
                    MOVE WGCA-SRA TO WGCA-SRO,
                 END-IF,
      *>-> Atribui o código alternativo do cliente/fornecedor
                 MOVE WGCA-CAL TO FCAD-CAL,
           END-EVALUATE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                   C O N S I S T Ê N C I A   D E   I N S C R I Ç Ã O   E S T A D U A L                    <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       CONSISTENCIA-INSCRICAO-ESTADUAL SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Consistência de Inscrição Estadual...........................................................................
       PCIE-INICIO.
      *>-> Aceita seleção
           PERFORM                PCIE-ACESEL.
      *>-> Se não confirmou
           IF NOT CNF-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Grava conteúdo dos campos que salvam seleção de todas as janelas (as janelas já devem ter sido apagadas!)
           PERFORM                SROSEL-GRAVA.
      *>-> Processa os cadastro
           PERFORM                PCIE-PRCCAD.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção...............................................................................................
       PCIE-ACESEL.
      *>-> Inicializa índice da janela
           MOVE    1         TO   W-INDJAN.
      *>-> Presume que não confirmou
           SET     CNF-NAO   TO   TRUE.
      *>-> Laço de navegação entre as janelas
           PERFORM                UNTIL EXIT
      *>-> Avalia a janela que deve ser aceita
              EVALUATE            W-INDJAN,
                 WHEN 1
      *>-> Aceita janela de Seleção de inconsistências de Inscrição Estadual a listar
                    PERFORM       PCIE-ACCEPT,
                 WHEN 2
      *>-> Aceita seleção padrão de clientes/fornecedores
                    PERFORM       PCIE-SELCAD,
                 WHEN OTHER
                    EXIT          PERFORM,
              END-EVALUATE,
              IF JAN-AVANCA
                 ADD 1       TO   W-INDJAN,
              ELSE,
                 SUBTRACT 1  FROM W-INDJAN,
              END-IF,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Aceita seleção padrão de clientes/fornecedores...............................................................
       PCIE-SELCAD.
      *>-> Aceita seleção padrão de cadastro de cliente/fornecedor
           PERFORM                SLCADTAB-ACCEPT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Processa os cadastro.........................................................................................
       PCIE-PRCCAD.
      *>-> Verifica se deve processar registros de todas as empresas ou somente da corrente
           EVALUATE               TRUE,
      *>-> Se é para verificar inconsistências em todas as empresas
              WHEN WCIE-INCEMP-SIM
      *>-> Verifica cadastros de todas empresas da base
                 PERFORM          PCIE-PRCCAD-VERTOD,
      *>-> Se não é para verificar inconsistências em todas as empresas
              WHEN WCIE-INCEMP-NAO
      *>-> Verifica cadastros somente da empresa corrente
                 PERFORM          PCIE-PRCCAD-VERCOR,
           END-EVALUATE.
      *>-> Apaga a janela de processamento
           PERFORM                EJP-APG-TELA.
      *>-> Se deve interromper o processamento
           IF MK-INPSIM
      *>-> Exibe a mensagem de seleção nula
              PERFORM             EXB-MEN-ERRPROC,
           ELSE,
      *>-> Move o título da listagem
              MOVE "C O N S I S T E N C I A   D E   I N S C R I C O E S   E S T A D U A I S" TO WSRORIM-TIT,
              MOVE "Listando inconsistências..." TO MK-CPR,
      *>-> Imprime as mensagens registradas
              PERFORM             PSRORIM-MENSAGEM-IMP,
           END-IF.
      *>-> Verifica se registrou alguma mensagem
           PERFORM                PSRORIM-MENSAGEM-VER.
      *>-> Se não registrou nenhuma mensagem
           IF WSRORIM-RETREG-ERR
      *>-> Exibe a mensagem de seleção nula
              PERFORM             EXB-MEN-ERRPROC,
           END-IF.
      *>-> Finaliza o programa de mensagens/log do processamento
           PERFORM                PSRORIM-MENSAGEM-FIM.
      *>-> Fecha os arquivos do programa de leitura/gravação da obs.cad
           PERFORM                PFB-FECARQ-FOBCAD.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Verifica cadastros de todas empresas da base.................................................................
       PCIE-PRCCAD-VERTOD.
      *>-> Clientes/fornecedores
           MOVE    W78-OVACAD TO  WSRO045-OVA(01).
      *>-> Carrega apenas File-ID de arquivos existentes
           SET     WSRO045-CARFID-EXI TO TRUE.
      *>-> Não retornar arquivos duplicados
           SET     WSRO045-RETDUP-NAO TO TRUE.
      *>-> Carrega File-ID dos arquivos
           PERFORM                SRO045-CARREGA.
      *>-> Se não carregou nenhum arquivo
           IF WSRO045-NUMARQ IS EQUAL TO ZEROS
      *>-> Exibe mensagem
              MOVE "Não encontrou nenhum cadastro para processar!" TO WME-LIT,
              PERFORM             EXIBE-MENSAGEM,
      *>-> Finaliza a rotina de busca de File-ID
              PERFORM             SRO045-FINALIZA,
      *>-> Encerra a função
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Salva a sigla corrente
           MOVE    MK-CHA    TO   MK-SIGORI.
      *>-> Inicia busca de File-ID
           PERFORM                SRO045-INIBUS.
      *>-> Busca pelos File-ID carregados
           PERFORM                UNTIL EXIT
      *>-> Busca o próximo File-ID
              PERFORM             SRO045-BUSPRX,
      *>-> Se chegou ao fim da busca
              IF WSRO045-FIMBUS-SIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Sigla da empresa a processar
              MOVE WSRO045-EMPRES TO MK-CHA,
      *>-> Carrega os dados de uma empresa sem exibir os dados
              PERFORM             ATDAD-EMP-FUNRDD, *> ARQ_COMANDO_VIAOK
      *>-> Verifica cadastros somente da empresa corrente
              PERFORM             PCIE-PRCCAD-VERCOR,
      *>-> Fecha os arquivos do programa de leitura/gravação da obs.cad
              PERFORM             PFB-FECARQ-FOBCAD,
      *>-> Se deve INterromper o Processamento - SIM
              IF MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
           END-PERFORM.
      *>-> Retorna a sigla original
           MOVE    MK-SIGORI TO   MK-CHA.
      *>-> Carrega os dados de uma empresa sem exibir os dados
           PERFORM                ATDAD-EMP-FUNRDD. *> ARQ_COMANDO_VIAOK
      *>-> Finaliza a rotina de busca de File-ID
           PERFORM                SRO045-FINALIZA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Verifica cadastros somente da empresa corrente...............................................................
       PCIE-PRCCAD-VERCOR.
      *>-> Indica que como deve exibir janela de processamento - Normal
           SET     WSLCADTAB-PRCNOR TO TRUE.
      *>-> Posiciona o arquivo cadastro cliente/fornecedor
           PERFORM                SLCADTAB-START-NLESS.
      *>-> Se não posicionou Ok
           IF NOT FS-CAD-OK
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Lê sequencialmente o cadastro
           PERFORM                UNTIL EXIT
      *>-> Leitura next
              PERFORM             SLCADTAB-READ-NEXT,
      *>-> Se chegou ao final do arquivo ou da seleção efetuada ou se deve INterromper o Processamento - SIM
              IF NOT FS-CAD-OK OR MK-INPSIM
      *>-> Seta o final do arquivo de cadastros
                 SET FS-CAD-FIM   TO TRUE,
      *>-> Sai do laço
                 EXIT             PERFORM,
              END-IF,
      *>-> Se for cliente/fornecedor do exterior ou for pessoa física e não for produtor rural
              IF FCAD-ESTEXT OR (FCAD-TINFIS AND FCAD-PRUNAO)
                 EXIT             PERFORM CYCLE,
              END-IF,
      *>-> Faz a consistência do cadastro
              PERFORM             PCIE-PRCCAD-CONSIS,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Faz a consistência do cadastro...............................................................................
       PCIE-PRCCAD-CONSIS.
      *>-> Código do cadastro
           MOVE    FCAD-COD  TO   WFB-COD.
      *>-> Lê o tipo de registro 09 da observação do cadastro
           PERFORM                PFB-LER-FOBCAD-REGISC.
      *>-> Código do cliente/fornecedor
           MOVE    FCAD-COD  TO   WINS-CODIGO.
      *>-> DEScrição/nome
           MOVE    FCAD-DES  TO   WINS-DESCRI.
      *>-> CNPJ/CPF
           MOVE    FCAD-CGG  TO   WINS-CGG.
      *>-> Inscrição estadual
           MOVE    FCAD-IES  TO   WINS-IESENT.
      *>-> Unidade da federação
           MOVE    FCAD-EST  TO   WINS-ESTENT.
      *>-> Grupo de cadastro
           MOVE    FCAD-PRU  TO   WINS-PRU.
      *>-> Tipo de cadastro em validação
           MOVE    FCAD-TIP  TO   WINS-TIPCAD.
      *>-> Atividade principal (CNAE)
           MOVE    WFB-ATP   TO   WINS-ATPENT.
      *>-> Complemento para atividade principal (CNAE)
           MOVE    WFB-CAP   TO   WINS-CAPENT.
      *>-> Tipo de tratamento da mensagem - somente retorno
           SET     WINS-TIPMSG-RET TO TRUE.
      *>-> Inconsistências de Inscrição Estadual a listar
           MOVE    WCIE-INCIEL TO WINS-INCIEL.
      *>-> Indica que está realizando teste de inconsistência geral
           SET     WINS-CONGER-SIM TO TRUE.
      *>-> Inicializa a mensagem de consistência
           MOVE    SPACES    TO   WINS-MENSAG.
      *>-> Testa a consistência da inscrição estadual
           PERFORM                ROG-INS-IND.
      *>-> Registra a mensagem caso tiver conteúdo
           PERFORM                PCIE-PRCCAD-MSGREG.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Registra a mensagem caso tiver conteúdo......................................................................
       PCIE-PRCCAD-MSGREG.
      *>-> Se retornou mensagem de inconsistência
           IF WINS-MENSAG IS NOT EQUAL TO SPACES
      *>-> Registra a mensagem
              MOVE WINS-MENSAG TO WME-LIT,
              PERFORM             PSRORIM-MENSAGEM-REG,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                     G R Á F I C O   D E   C L I E N T E S / F O R N E C E D O R E S                      <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       GRAFICO                    SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Gráfico de clientes/fornecedores.............................................................................
       PGCF-INICIO.
      *>-> Aceita seleção padrão
           PERFORM                SLCADTAB-ACCEPT.
      *>-> Se não confirmou
           IF NOT CNF-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Classifica os cadastros
           PERFORM                PGCF-CLAVIR.
      *>-> Se não processou nada ou cancelou o processamento
           IF LISTOU-NAO OR MK-INPSIM
      *>-> Exibe a mensagem de seleção nula
              PERFORM             EXB-MEN-ERRPROC,
      *>-> Fecha o virtual
              PERFORM             GRA-CLOSE,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Inicializa o grupo de classificação - Grupo de cadastro
           SET     WGCF-GRPCLA-GRC TO TRUE.
      *>-> Usuário poderá trocar de classificação sem ter que reprocessar todos os registros novamente
           PERFORM                UNTIL EXIT
      *>-> Aceita janela de Seleção - Gráfico de cadastros de cliente/fornecedor
              PERFORM             PGCF-ACCEPT,
      *>-> Se fechou a janela
              IF JAN-VOLTAR OR JAN-BOTCAN
                 EXIT             PERFORM,
              END-IF,
      *>-> Exibe o gráfico
              PERFORM             PGCF-EXBGRA,
           END-PERFORM.
      *>-> Fecha o virtual
           PERFORM                GRA-CLOSE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Classifica os cadastros......................................................................................
       PGCF-CLAVIR.
      *>-> Indica que não processou nada
           SET     LISTOU-NAO TO  TRUE.
      *>-> Indica que como deve exibir janela de processamento - Normal
           SET     WSLCADTAB-PRCNOR TO TRUE.
      *>-> Posicionamento NOT LESS
           PERFORM                SLCADTAB-START-NLESS.
      *>-> Lê sequencialmente o cadastro
           PERFORM                UNTIL EXIT
      *>-> Leitura sequencial NEXT
              PERFORM             SLCADTAB-READ-NEXT,
      *>-> Se chegou ao final da seleção ou se deve interromper o processamento
              IF NOT FS-CAD-OK OR MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
      *>-> Se não listou nada ainda
              IF LISTOU-NAO
      *>-> Cria arquivo virtual
                 PERFORM          GRA-OPEN,
                 SET LISTOU-SIM   TO TRUE,
              END-IF,
      *>-> Acumula os dados no virtual
              PERFORM             PGCF-CLAVIR-ACUMULA,
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Acumula os dados no virtual..................................................................................
       PGCF-CLAVIR-ACUMULA.
      *>-> Laço para carregar no virtual todos os tipos de classificação
           MOVE    ZEROS     TO   WGCF-INDAUX.
           PERFORM                UNTIL EXIT
      *>-> Incrementa o tipo de classificação
              ADD  1         TO   WGCF-INDAUX,
      *>-> Inicializa registro do virtual
              MOVE LOW-VALUES TO  W-GRA-REG,
      *>-> Atribui o tipo de classificação
              MOVE WGCF-INDAUX TO W-GRA-TIP, WGCF-GRPCLA,
      *>-> Se não for tipo de classificação válida
              IF NOT W-GRA-TIP-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Move a chave do virtual
              PERFORM             PGCF-CLAVIR-MOVCHA,
      *>-> Grava registro no virtual
              PERFORM             PGCF-CLAVIR-GRV,
           END-PERFORM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Move a  chave do virtual.....................................................................................
       PGCF-CLAVIR-MOVCHA.
      *>-> Avalia o tipo de classificação
           EVALUATE               TRUE,
      *>-> Se classifica por grupo de cadastro
              WHEN WGCF-GRPCLA-GRC
                 MOVE FCAD-GRP TO W-GRA-GRP,
      *>-> Se classifica por representante
              WHEN WGCF-GRPCLA-REP
                 MOVE FCAD-REP TO W-GRA-GRP,
      *>-> Se classifica por transportador
              WHEN WGCF-GRPCLA-TRP
                 MOVE FCAD-TRP TO W-GRA-GRP,
      *>-> Se classifica pelo local de cobrança
              WHEN WGCF-GRPCLA-LOC
                 MOVE FCAD-LOC TO W-GRA-GRP,
      *>-> Se classifica pelo preposto
              WHEN WGCF-GRPCLA-CPR
                 MOVE FCAD-CPR TO W-GRA-GRP,
      *>-> Se classifica pelo vendedor
              WHEN WGCF-GRPCLA-CVD
                 MOVE FCAD-CVD TO W-GRA-GRP,
      *>-> Se tem representante
                 IF WGCF-REPAUX IS NOT EQUAL TO ZEROS
                    MOVE WGCF-REPAXX TO W-GRA-GRP
                    MOVE LOW-VALUES TO WGCF-REPAXX,
                 ELSE,
      *>-> Se tem preposto
                    IF WGCF-CPRAUX IS NOT EQUAL TO ZEROS
                       MOVE WGCF-CPRAXX TO W-GRA-GRP
                       MOVE LOW-VALUES TO WGCF-CPRAXX,
                    ELSE,
      *>-> Se tem vendedor
                       IF WGCF-CVDAUX IS NOT EQUAL TO ZEROS
                          MOVE WGCF-CVDAXX TO W-GRA-GRP
                          MOVE LOW-VALUES TO WGCF-CVDAXX,
                       END-IF,
                    END-IF,
                 END-IF,
      *>-> Se classifica por grupo de empresas/holding
              WHEN WGCF-GRPCLA-HOL
                 MOVE FCAD-HOL TO W-GRA-GRP,
      *>-> Se classifica por zona de vendas/região
              WHEN WGCF-GRPCLA-ZON
      *>-> Move o código da zona de venda para variável auxiliar
                 MOVE FCAD-ZON TO W-GRA-GRP,
      *>-> Move o código da micro-região para variável auxiliar
                 MOVE FCAD-MRG TO W-GRA-GR2,
      *>-> Se classifica pelo estado
              WHEN WGCF-GRPCLA-EST
      *>-> Busca a descrição do estado na tabela
                 MOVE FCAD-EST TO W-GRA-EST,
      *>-> Se classifica pelo estado/Cidade
              WHEN WGCF-GRPCLA-UFC
                 MOVE FCAD-EST TO W-GRA-EST,
                 MOVE FCAD-CID TO W-GRA-CID,
                 MOVE FCAD-CMU TO W-GRA-CMU,
      *>-> Se classifica por escritório
              WHEN WGCF-GRPCLA-ESC
      *>-> Lê o tipo de registro 09 da observação do cadastro
                 MOVE FCAD-COD TO WFB-COD,
                 PERFORM          PFB-LER-FOBCAD-REGISC,
      *>-> Se leu corretamente
                 IF WFB-FS-OK
      *>-> Move escritório contábil/Assessoria para variável auxiliar
                    MOVE WFB-ECA  TO W-GRA-ESC,
                 ELSE,
                    MOVE ZEROS TO W-GRA-ESC,
                 END-IF,
           END-EVALUATE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grava registro no virtual....................................................................................
       PGCF-CLAVIR-GRV.
      *>-> Verifica se o registro já existe
           PERFORM                GRA-READ-KEY.
      *>-> Se não leu ok
           IF NOT GRA-FS-OK
              MOVE LOW-VALUES TO  W-GRA-DAD,
           END-IF.
      *>-> Incrementa a quantidade do tipo de agrupamento
           ADD     1         TO   W-GRA-QTD.
      *>-> Grava/Regrava registro no arquivo virtual
           PERFORM                GRA-RE-WRITE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                           SELEÇÃO - GRÁFICO DE CADASTROS DE CLIENTE/FORNECEDOR                           <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Inicio PGCF-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Callback para personalização do campo - Grupo de classificação
       PGCF-CONFIG-WGCF-GRPCLA.
           MOVE    WT-LT-GRPCLA(25:168) TO WTE-COM-OPC.
           MOVE    WT-LT-GRPCLA(217:) TO WTE-COM-OPC(169:).
      *>--------------------------------------------------------------------------------------------------------------<*
      *> @Fim PGCF-CALLBACKS
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Exibe o gráfico..............................................................................................
       PGCF-EXBGRA.
      *>-> Indica que não processou nada
           SET     LISTOU-NAO TO  TRUE.
      *>-> Move mensagem de processamento
           MOVE    "Exportando gráfico de cadastro de cliente/fornecedor..." TO MK-PRCMSG.
      *>-> Indica que ainda não abriu o o gráfico
           SET     LISTOU-NAO TO  TRUE.
      *>-> Posiciona no início do arquivo virtual
           MOVE    LOW-VALUES TO  W-GRA-CHA.
           MOVE    WGCF-GRPCLA TO W-GRA-TIP.
           PERFORM                GRA-START-NLESS.
      *>-> Lê sequencialmente e lista os registros do arquivo virtual
           PERFORM                UNTIL EXIT
      *>-> Lê o próximo registro
              PERFORM             GRA-READ-NEXT,
      *>-> Se não leu corretamente ou chegou ao fim do arquivo
              IF NOT GRA-FS-OK OR W-GRA-TIP IS NOT EQUAL TO WGCF-GRPCLA
                 EXIT             PERFORM,
              END-IF,
      *>-> Se não processou nada ainda
              IF LISTOU-NAO
      *>-> Rotina de início de gráfico
                 PERFORM          PGCF-EXBGRA-INIGRA,
      *>-> Indica que processou algo
                 SET LISTOU-SIM   TO TRUE,
              END-IF,
      *>-> Exibe os dados do tipo de classificação
              PERFORM             PGCF-EXBGRA-EXBGRP,
      *>-> Incrementa/Exibe o registro processado
              PERFORM             EJP-REG-PROC,
      *>-> Se deve interromper o processamento
              IF MK-INPSIM
                 EXIT             PERFORM,
              END-IF,
           END-PERFORM.
      *>-> Apaga a janela padrão de processamento
           PERFORM                EJP-APG-TELA.
      *>-> Se não listou nada
           IF LISTOU-NAO
      *>-> Exibe a mensagem de seleção nula
              PERFORM             EXB-MEN-ERRPROC,
      *>-> Finaliza a rotina de gráficos
              PERFORM             SRIGRA-FECARQ,
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Exibe o gráfico
           PERFORM                SRIGRA-EXBVIS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotina de início de gráfico..................................................................................
       PGCF-EXBGRA-INIGRA.
      *>-> Inicia gráfico
           PERFORM                SRIGRA-INIGRA.
      *>-> Tipo do gráfico - Barras
           SET     WSRIGRA-TIPGRA-BAR TO TRUE.
      *>-> Título do gráfico
           MOVE    "Gráfico de cadastros de cliente/fornecedor" TO WSRIGRA-TITGR1.
      *>-> Título da série
           MOVE    "Quantidade"   TO WSRIGRA-TITVAL.
      *>-> Número de séries visíveis
           MOVE    15        TO   WSRIGRA-NUMSER.
      *>-> Avalia o tipo de classificação
           EVALUATE               TRUE,
      *>-> Se classifica por grupo de cadastro
              WHEN WGCF-GRPCLA-GRC
                 MOVE "Quantidade de cadastro X Grupo de cadastro" TO WSRIGRA-TITGR2,
                 MOVE "Grupos de cadastro" TO WSRIGRA-TITDOM,
      *>-> Se classifica por representante
              WHEN WGCF-GRPCLA-REP
                 MOVE "Quantidade de representante X Representante" TO WSRIGRA-TITGR2,
                 MOVE "Representante" TO WSRIGRA-TITDOM,
      *>-> Se classifica por transportador
              WHEN WGCF-GRPCLA-TRP
                 MOVE "Quantidade de transportador X Transportador" TO WSRIGRA-TITGR2,
                 MOVE "Transportador" TO WSRIGRA-TITDOM,
      *>-> Se classifica pelo local de cobrança
              WHEN WGCF-GRPCLA-LOC
                 MOVE "Quantidade de local de cobrança X Local de Cobrança" TO WSRIGRA-TITGR2,
                 MOVE "Local de cobrança" TO WSRIGRA-TITDOM,
      *>-> Se classifica pelo estado
              WHEN WGCF-GRPCLA-EST
                 MOVE "Quantidade de estado X Estado" TO WSRIGRA-TITGR2,
                 MOVE "Estado" TO WSRIGRA-TITDOM,
                 SET WSRIGRA-TIPGRA-MUF TO TRUE, *> Mapa por UF
      *>-> Se classifica pelo preposto
              WHEN WGCF-GRPCLA-CPR
                 MOVE "Quantidade de preposto X Preposto" TO WSRIGRA-TITGR2,
                 MOVE "Preposto" TO WSRIGRA-TITDOM,
      *>-> Se classifica pelo vendedor
              WHEN WGCF-GRPCLA-CVD
                 MOVE "Quantidade de vendedor X Vendedor" TO WSRIGRA-TITGR2,
                 MOVE "Vendedor" TO WSRIGRA-TITDOM,
      *>-> Se classifica pelo estado/Cidade
              WHEN WGCF-GRPCLA-UFC
                 MOVE "Quantidade de Estado/Cidade X Estado/Cidade" TO WSRIGRA-TITGR2,
                 MOVE "Estado/Cidade" TO WSRIGRA-TITDOM,
      *>-> Se classifica por grupo de empresas/holding
              WHEN WGCF-GRPCLA-HOL
                 MOVE "Quantidade de Empresas/holding X Empresas/holding" TO WSRIGRA-TITGR2,
                 MOVE "Empresas/holding" TO WSRIGRA-TITDOM,
      *>-> Se classifica por zona de vendas/região
              WHEN WGCF-GRPCLA-ZON
                 MOVE "Quantidade de zona de vendas/região X Zona de vendas/região" TO WSRIGRA-TITGR2,
                 MOVE "Zona de vendas/região" TO WSRIGRA-TITDOM,
      *>-> Se classifica por escritório
              WHEN WGCF-GRPCLA-ESC
                 MOVE "Quantidade de escritório X Escritório" TO WSRIGRA-TITGR2,
                 MOVE "Escritório" TO WSRIGRA-TITDOM,
           END-EVALUATE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Exibe os dados do tipo de classificação......................................................................
       PGCF-EXBGRA-EXBGRP.
      *>-> Indica que não exibe mensagem para leitura padrão inexistente
           SET     RTAB-EXINEX-NAO TO TRUE.
      *>-> Move o código
           MOVE    W-GRA-GRP TO   RFT-COD, RET-COD.
      *>-> Avalia o tipo de classificação
           EVALUATE               TRUE,
      *>-> Se classifica por grupo de cadastro
              WHEN WGCF-GRPCLA-GRC
                 PERFORM          PGCF-EXBGRA-EXBGRP1,
      *>-> Se classifica por representante
              WHEN WGCF-GRPCLA-REP
                 PERFORM          PGCF-EXBGRA-EXBGRP2,
      *>-> Se classifica por transportador
              WHEN WGCF-GRPCLA-TRP
                 PERFORM          PGCF-EXBGRA-EXBGRP3,
      *>-> Se classifica pelo local de cobrança
              WHEN WGCF-GRPCLA-LOC
                 PERFORM          PGCF-EXBGRA-EXBGRP4,
      *>-> Se classifica pelo estado
              WHEN WGCF-GRPCLA-EST
                 PERFORM          PGCF-EXBGRA-EXBGRP5,
      *>-> Se classifica pelo preposto
              WHEN WGCF-GRPCLA-CPR
                 PERFORM          PGCF-EXBGRA-EXBGRP6,
      *>-> Se classifica pelo vendedor
              WHEN WGCF-GRPCLA-CVD
                 PERFORM          PGCF-EXBGRA-EXBGRP7,
      *>-> Se classifica pelo estado/Cidade
              WHEN WGCF-GRPCLA-UFC
                 PERFORM          PGCF-EXBGRA-EXBGRP8,
      *>-> Se classifica por grupo de empresas/holding
              WHEN WGCF-GRPCLA-HOL
                 PERFORM          PGCF-EXBGRA-EXBGRP9,
      *>-> Se classifica por zona de vendas/região
              WHEN WGCF-GRPCLA-ZON
                 PERFORM          PGCF-EXBGRA-EXBGRP10,
      *>-> Se classifica por escritório
              WHEN WGCF-GRPCLA-ESC
                 PERFORM          PGCF-EXBGRA-EXBGRP11,
           END-EVALUATE.
      *>-> Quantidade
           MOVE    W-GRA-QTD TO   WSRIGRA-VALORY.
      *>-> Adi.vlr. numérico
           PERFORM                SRIGRA-ADIVAL-NUM.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grupo de cadastro............................................................................................
       PGCF-EXBGRA-EXBGRP1.
           PERFORM                LER-TGE-GRC.
      *>-> Descrição do grupo
           MOVE    RFT-D03G  TO   WSRIGRA-NOMSER.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Representante................................................................................................
       PGCF-EXBGRA-EXBGRP2.
      *>-> Se possui representante
           IF W-GRA-GRP IS NOT EQUAL TO ZEROS
      *>-> Lê tab.REPresentantes/vendedores/prepostos
              PERFORM             LER-TPE-REP,
              MOVE RET-DEV   TO   WSRIGRA-NOMSER,
           ELSE,
              MOVE "Sem Representante" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Transportador................................................................................................
       PGCF-EXBGRA-EXBGRP3.
      *>-> Se possui representante
           IF W-GRA-GRP IS NOT EQUAL TO ZEROS
      *>-> Lê tab.TRAnsportadores
              PERFORM             LER-TPE-TRA,
      *>-> Descrição do grupo
              MOVE RET-DET   TO   WSRIGRA-NOMSER,
           ELSE,
              MOVE "Sem Transportador" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Local de cobrança............................................................................................
       PGCF-EXBGRA-EXBGRP4.
      *>-> Se possui Destinos títulos
           IF W-GRA-GRP IS NOT EQUAL TO ZEROS
      *>-> Indica tab.LOCal de cobrança
              SET  RTAB-FS-OK TO  TRUE,
      *>-> Lê tab.LOCal de cobrança. Chave: RFT-COD
              PERFORM             LER-TGE-LOC,
      *>-> Descrição do grupo
              MOVE RFT-D01   TO   WSRIGRA-NOMSER,
           ELSE,
              MOVE "Sem Local Cobrança" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Estado.......................................................................................................
       PGCF-EXBGRA-EXBGRP5.
      *>-> Busca a descrição do estado na tabela
           MOVE    W-GRA-EST TO   WDE-UFC.
           PERFORM                ROG-BUSCA-EST.
      *>-> Se encontrou a UF
           IF WDE-IUFOK
              MOVE WDE-DES(WDE-IUF) TO WSRIGRA-NOMSER,
              MOVE WDE-SIG(WDE-IUF) TO WSRIGRA-ESTSER,
           ELSE,
              MOVE "Sem Estado"   TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Preposto.....................................................................................................
       PGCF-EXBGRA-EXBGRP6.
      *>-> Se possui preposto
           IF W-GRA-GRP IS NOT EQUAL TO ZEROS
              PERFORM             LER-TPE-REP,
              MOVE RET-DEV   TO   WSRIGRA-NOMSER,
           ELSE,
              MOVE "Sem Preposto" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Vendedor.....................................................................................................
       PGCF-EXBGRA-EXBGRP7.
      *>-> Se possui vendedor
           IF W-GRA-GRP IS NOT EQUAL TO ZEROS
              PERFORM             LER-TPE-REP,
              MOVE RET-DEV   TO   WSRIGRA-NOMSER,
           ELSE,
              MOVE "Sem Vendedor" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Estado/Cidade................................................................................................
       PGCF-EXBGRA-EXBGRP8.
      *>-> Busca a descrição do estado na tabela
           MOVE    W-GRA-EST TO   WDE-UFC.
           PERFORM                ROG-BUSCA-EST.
      *>-> Se encontrou a UF e a cidade
           IF WDE-IUFOK AND W-GRA-CID IS NOT EQUAL TO SPACES
              STRING              WDE-DES(WDE-IUF), " - ", W-GRA-CID
                 INTO             WSRIGRA-NOMSER,
              MOVE W-GRA-CMU TO   WSRIGRA-CMUSER,
           ELSE,
              MOVE "Sem Estado/Cidade" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Grupo empresa/ holding.......................................................................................
       PGCF-EXBGRA-EXBGRP9.
      *>-> Se possui Grupo empresa / holding
           IF W-GRA-GRP IS NOT EQUAL TO ZEROS
      *>-> Indica tab.HOLding
              SET  RTBE-FS-OK TO  TRUE,
      *>-> Lê tab.Holdings/Grupo Empresas
              PERFORM             LER-TPE-HOL,
              MOVE RET-DEO   TO   WSRIGRA-NOMSER,
           ELSE,
              MOVE "Sem Grupo de empresas/Holding" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Zonas de venda/ Região.......................................................................................
       PGCF-EXBGRA-EXBGRP10.
      *>-> Se possui Zonas de venda/ Região
           IF W-GRA-GRP IS NOT EQUAL TO ZEROS
      *>-> Indica tab.ZONa de vendas
              SET  RTAB-FS-OK TO  TRUE,
      *>-> Lê tab.Zona de VenDas. Chave: RFT-COD
              PERFORM             LER-TGE-ZVD,
              MOVE 1         TO   W-POINTE,
              STRING              RFT-DEZ,
                 INTO             WSRIGRA-NOMSER,
                    WITH POINTER  W-POINTE,
      *>-> Se existe micro-região
              IF W-GRA-GR2 IS NOT EQUAL TO ZEROS
      *>-> Indica tab.micro-região
                 SET RTAB-FS-OK   TO TRUE,
      *>-> Move código da zona de venda para chave de leitura
                 MOVE W-GRA-GRP   TO RFT-COD,
      *>-> Move código da micro-região para chave de leitura
                 MOVE W-GRA-GR2   TO RFT-AGE,
      *>-> Lê tab.Zona de micro-região. Chave: RFT-COD
                 PERFORM          LER-TGE-MRE,
      *>-> Move descrição da micro-região para impressão
                 STRING           RFT-D35,
                    INTO          WSRIGRA-NOMSER,
                       WITH POINTER W-POINTE,
              END-IF,
           ELSE,
      *>-> Se empresa é sindicato
              IF MK-EMSSIM
                 MOVE "Sem Base Territorial" TO WSRIGRA-NOMSER,
              ELSE,
                 MOVE "Sem Zona de Vendas" TO WSRIGRA-NOMSER,
              END-IF,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Escritório...................................................................................................
       PGCF-EXBGRA-EXBGRP11.
      *>-> Se possui escritório
           IF W-GRA-ESC IS NOT EQUAL TO ZEROS
              MOVE W-GRA-ESC TO   W-MZ07I,
              MOVE W-MZ07I   TO   WSRIGRA-NOMSER,
           ELSE,
              MOVE "Sem escritório" TO WSRIGRA-NOMSER,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                         V I S U A L I Z A Ç Ã O   V I A   G O O G L E   M A P S                          <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       VISUALIZACAO-GOOGLE-MAPS   SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Visualização via Google Maps.................................................................................
       PVGM-INICIO.
      *>-> Aceita seleção padrão
           PERFORM                SLCADTAB-ACCEPT.
      *>-> Se não confirmou
           IF NOT CNF-SIM
              EXIT                PARAGRAPH,
           END-IF.
      *>-> Visualiza cadastros no Google Maps
           PERFORM                PVGM-VISGMP.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Visualiza cadastros no Google Maps...........................................................................
       PVGM-VISGMP.
      *>-> Indica que como deve exibir janela de processamento - Normal
           SET     WSLCADTAB-PRCNOR TO TRUE.
      *>-> Posiciona o cadastro de cli/for de acordo com a ordem
           PERFORM                SLCADTAB-START-NLESS.
      *>-> Lê sequencialmente o arquivo de clientes
           PERFORM                UNTIL EXIT
      *>-> Lê o arquivo de cadastros sequencialmente
              PERFORM             SLCADTAB-READ-NEXT,
      *>-> Se chegou ao final do arquivo ou da seleção efetuada
              IF NOT FS-CAD-OK
                 EXIT             PERFORM,
              END-IF,
      *>-> Move endereço do cliente
              MOVE FCAD-END  TO   WSRIGMP-ENDERE,
              MOVE FCAD-PIN  TO   WSRIGMP-PINEND,
              MOVE FCAD-PIC  TO   WSRIGMP-PICEND,
              MOVE FCAD-CID  TO   WSRIGMP-CIDADE,
              MOVE FCAD-CMU  TO   WSRIGMP-CODMUN,
              MOVE FCAD-BAI  TO   WSRIGMP-BAIRRO,
      *>-> Se cliente não for do exterior
              IF NOT FCAD-ESTEXT
                 MOVE FCAD-EST TO WSRIGMP-ESTADO,
              ELSE,
      *>-> Código do país SISCOMEX
                 MOVE FCAD-CPS TO WSRIGMP-PAISSC,
              END-IF,
      *>-> Inicia concatenação
              MOVE FCAD-COD  TO   W-MZ07I,
              MOVE W-MZ07I   TO   WEDL-ENT,
              PERFORM             PEDL-INICON,
      *>-> Concatena texto
              MOVE " - "     TO   WEDL-ENT,
              PERFORM             PEDL-CONTXT,
      *>-> Concatena texto
              MOVE FCAD-DES  TO   WEDL-ENT,
              PERFORM             PEDL-CONTXT,
      *>-> Descrição do marcador
              MOVE WEDL-SAI  TO   WSRIGMP-DESCRI,
      *>-> Se existir representante
              IF FCAD-REP IS NOT EQUAL TO ZEROS
      *>-> Busca a descrição abreviada do representante
                 MOVE FCAD-REP TO RET-COD,
                 PERFORM          LER-TPE-REP,
                 IF NOT RTBE-FS-OK
                    MOVE SPACES   TO RET-ABV,
                 END-IF,
      *>-> Inicia concatenação
                 MOVE "Representante: " TO WEDL-ENT,
                 PERFORM          PEDL-INICON,
      *>-> Concatena texto
                 MOVE FCAD-REP TO W-MZ07I,
                 MOVE W-MZ07I TO  WEDL-ENT,
                 PERFORM          PEDL-CONTXT,
      *>-> Concatena texto
                 MOVE " - "  TO   WEDL-ENT,
                 PERFORM          PEDL-CONTXT,
      *>-> Concatena texto
                 MOVE RET-ABV TO  WEDL-ENT,
                 PERFORM          PEDL-CONTXT,
      *>-> Detalhes
                 MOVE WEDL-SAI TO WSRIGMP-DETALH,
              END-IF,
      *>-> Adiciona marcador
              PERFORM             SRIGMP-ADDMAR,
      *>-> Se houve algum erro durante a consulta
              IF NOT WSRIGMP-RET-OK
                 MOVE "Erro ao consultar cadastro %1. Motivo: %3" TO WME-LIT,
                 MOVE FCAD-COD TO WME-SUB(1),
                 MOVE FCAD-DES TO WME-SUB(2),
                 EVALUATE         TRUE,
      *>-> Resposta da API - Sem resultados para o endereço especificado
                    WHEN WSRIGMP-RET-NAO
                       MOVE "Endereço inválido / inexistente" TO WME-SUB(3),
      *>-> Resposta da API - Ultrapassou o limite de requisições
                    WHEN WSRIGMP-RET-LIM
                       MOVE "Limite de consultas diárias" TO WME-SUB(3),
      *>-> Resposta da API - Indisponível
                    WHEN WSRIGMP-RET-IND
                       MOVE "Serviço indisponível" TO WME-SUB(3),
                 END-EVALUATE,
      *>-> Somente registrar a mensagem
                 PERFORM          PSRORIM-MENSAGEM-REG,
              END-IF,
           END-PERFORM.
      *>-> Apaga a janela de processamento
           PERFORM                EJP-APG-TELA.
      *>-> Verifica se registrou alguma mensagem
           PERFORM                PSRORIM-MENSAGEM-VER.
      *>-> Se registrou alguma mensagem no log
           IF WSRORIM-RETREG-OK
      *>-> Exibe mensagem de erros/alertas
              MOVE "Durante o processo, o Google Maps não identificou o endereço de um ou mais cadastros.þDeseja ver a "
      &            "relação das inconsistências?" TO WME-LIT,
              SET  WME-BOT-SN TO  TRUE,
              PERFORM             EXIBE-MENSAGEM,
      *>-> Se confirmou a listagem das mensagens
              IF WME-RET-SIM
                 MOVE "INCONSISTÊNCIAS DURANTE A CONSULTA AO GOOGLE MAPS" TO WSRORIM-TIT,
      *>-> Imprimir as mensagens de erro/alerta durante o processamento
                 PERFORM          PSRORIM-MENSAGEM-IMP,
              END-IF,
           END-IF.
      *>-> Finaliza o programa de mensagens/log do processamento
           PERFORM                PSRORIM-MENSAGEM-FIM.
      *>-> Aceita janela do Google Maps
           PERFORM                SRIGMP-ACCEPT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                    L I S T A G E M   D A   V A L I D A D E   D A S   L I C E N Ç A S                     <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       LISTAGEM-VALIDADE-LICENCAS SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Listagem da validade das licenças............................................................................
       PLVL-INICIO.
      *>-> Configura seleção do relatório padrão RECH
           PERFORM                PLVL-CFGSEL.
      *>-> Imprime relatório
           PERFORM                PLVL-IMPREL.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Configura seleção do relatório padrão RECH...................................................................
       PLVL-CFGSEL.
      *>-> Avalia o tipo de controle financeiro
           EVALUATE               TRUE
      *>-> Se for tipo de controle financeiro - Receber
              WHEN GY-TIPREC OR MK-USU-ACFCLI
      *>-> Indica que processa apenas clientes e bloqueia campo
                 MOVE W78-CADTAB-FCAD-TIP TO WSLCADTAB-CAM,
                 MOVE W78-CADTAB-FCAD-TIPCLI TO WSLCADTAB-ENU(1),
                 SET WSLCADTAB-BLQSIM TO TRUE,
                 PERFORM          SLCADTAB-ADDFIL-ENUM,
      *>-> Se for tipo de controle financeiro - Pagar
              WHEN GY-TIPPAG OR MK-USU-ACFFOR
      *>-> Indica que processa apenas fornecedores e bloqueia campo
                 MOVE W78-CADTAB-FCAD-TIP TO WSLCADTAB-CAM,
                 MOVE W78-CADTAB-FCAD-TIPFOR TO WSLCADTAB-ENU(1),
                 SET WSLCADTAB-BLQSIM TO TRUE,
                 PERFORM          SLCADTAB-ADDFIL-ENUM,
           END-EVALUATE.
      *>-> Exibe campo na janela principal - Data da validade da licença da policia federal
           MOVE    W78-CADTAB-FCAD-DVL TO WSLCADTAB-CAM.
           PERFORM                SLCADTAB-EXIBE-CAMPO-JANELA.
      *>-> Exibe campo na janela principal - Data da validade da licença do exército
           MOVE    W78-CADTAB-FCAD-DVX TO WSLCADTAB-CAM.
           PERFORM                SLCADTAB-EXIBE-CAMPO-JANELA.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Imprime relatório............................................................................................
       PLVL-IMPREL.
      *>-> Chama seleção padrão e listagem do relatório padrão Rech
           MOVE    0510502   TO   WREL-NUMREL.
           MOVE    WSLCADTAB-IDOSAI TO WREL-IDOSPD.
           PERFORM                PREL-IMPREL-RECH.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                                     S  U  B  -  R  O  T  I  N  A  S                                      <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       SUB-ROTINAS                SECTION.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Instancia a seleção padrão dinâmica de documentos de acordo com a ocorrência.................................
       PSUB-INSLDI-DOC.
           MOVE    W78-OVADOC TO  WSLDINAMI-TAB.
           MOVE    W-IDV     TO   WSLDINAMI-SEQ.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Instancia o menu adicional da seleção dinâmica de documentos.................................................
       PSUB-INMEAD-DOC.
           MOVE    W-IDV     TO   WSLDINAMI-MNA.
           PERFORM                SLDINAMI-SET-MENADI.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Inicializa os parâmetros de saída............................................................................
       PSUB-INI-PARSAI.
           INITIALIZE             WSRICAD-PARSAI ALL TO VALUE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Inicializa os parâmetros de entrada..........................................................................
       PSUB-INI-PARENT.
           INITIALIZE             WSRICAD-PARENT ALL TO VALUE.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                               A B E R T U R A    D O S    A R Q U I V O S                                <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Início da abertura dos arquivos..............................................................................
       ABR-INI.
           EXIT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Abertura I-O da tabela Cadastro de cliente/fornecedor
           COPY                   PABO-CAD.CPB.
      *>-> Abertura I-O da tabela Notas do faturamento
           COPY                   PABO-NOT.CPB.
      *>-> Abertura I-O da tabela Listas de preços mestres
           COPY                   PABO-LPM.CPB.
      *>-> Abertura I-O da tabela Itens das notas fiscais de serviços (aue-autom.escrit.)
           COPY                   PABO-ITS.CPB.
      *>-> Abertura I-O da tabela Notas fiscais de serviços (aue-autom.escrit.)
           COPY                   PABO-NFS.CPB.
      *>-> Abertura I-O da tabela Contas correntes de pessoas
           COPY                   PABO-CCP.CPB.
      *>-> Abertura I-O da tabela Dados da licença do cliente do siger
           COPY                   PABO-DLC.CPB.
      *>-> Abertura I-O da tabela Plano de contas
           COPY                   PABO-PLA.CPB.
      *>-> Abertura I-O da tabela Produtos
           COPY                   PABO-PRO.CPB.
      *>-> Abertura I-O da tabela Notas do financeiro
           COPY                   PABO-NOF.CPB.
      *>-> Abertura I-O da tabela Recursos ativos
           COPY                   PABO-REA.CPB.
      *>-> Abertura I-O da tabela Observações de nota de serviço
           COPY                   PABO-ONS.CPB.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Abertura I-O da tabela Cadastro de cliente/fornecedor
           MOVE    MK-DRICAD TO   OW-DRICAD.
           MOVE    "OPEN I-O OCADAS" TO WARQ-CMD.
           PERFORM                ARQ-COMANDO-MK-CHA.
      *>-> Abertura dos arquivos do beneficiamento
           PERFORM                SROVBN-B-ABRARQ.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Fim da abertura dos arquivos.................................................................................
       ABR-FIM.
           EXIT.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                             F E C H A M E N T O   D O S   P R O G R A M A S                              <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       FECHA-PROGRAMAS.
           PERFORM                SRIGRA-CANCEL.
           PERFORM                SRIGMP-CANCEL.
           PERFORM                SROVCT-CANCEL.
           PERFORM                SRIVSE-CANCEL.
           PERFORM                SROVBN-B-CANCEL.
           PERFORM                SRIBEP-CANCEL.
      *>-> Finaliza objetos SPD utilizados dinamicamente
           PERFORM                SLDINAMI-FINALIZA-TODOS.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                              F E C H A M E N T O   D O S   A R Q U I V O S                               <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
       FECHA-ARQUIVOS.
           PERFORM                ARQ-CLOSE-ALL.
           PERFORM                GRA-CLOSE.
           PERFORM                CLC-CLOSE.
           PERFORM                CQL-CLOSE.
           PERFORM                CAD-CLOSE.
           PERFORM                RES-CLOSE.
           PERFORM                PFB-FECARQ-FOBCAD.
           PERFORM                SRIGMP-FECARQ.
           PERFORM                SROVCT-FECARQ.
           PERFORM                SRIVSE-FECARQ.
           PERFORM                ROG-INS-FEC.
           PERFORM                SROVBN-B-FECARQ.
           PERFORM                SRIBEP-FECARQ.
      *>-> Se está conectado no SICLA
           IF WRCL-CONSIC-SIM
      *>-> Desconecta da base de dados do Sicla
              CALL "SIC_DES"      USING W-PARSIS, WSC-PARAM
                 ON EXCEPTION
                    CONTINUE,
              END-CALL,
      *>-> Indica que não está conectado no SICLA
              SET  WRCL-CONSIC-NAO TO  TRUE,
           END-IF.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                            A  R  Q  U  I  V  O  S     V  I  R  T  U  A  I  S                             <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Cadastros para classificação para gráfico
           COPY                   PARQVIRT.CPY REPLACING ==(ARQ)== BY ==GRA==
                                                         ==(PRE)== BY =="GRA"==
                                                      ==(REGIST)== BY ==W-GRA-REG==
                                                      ==(CHAPRI)== BY ==W-GRA-CHA==.
      *>-> Clientes/fornecedores para atualizar limite de crédito
           COPY                   PARQVIRT.CPY REPLACING ==(ARQ)== BY ==CLC==
                                                         ==(PRE)== BY =="CLC"==
                                                      ==(REGIST)== BY ==W-CLC-REG==
                                                      ==(CHAPRI)== BY ==W-CLC-CHA==.
      *>-> Certificações de qualidade
           COPY                   PARQVIRT.CPY REPLACING ==(ARQ)== BY ==CQL==
                                                         ==(PRE)== BY =="CQL"==
                                                      ==(REGIST)== BY ==W-CQL-REG==
                                                      ==(CHAPRI)== BY ==W-CQL-CHA==.
      *>-> Cadastros para classificação
           COPY                   PARQVIRT.CPY REPLACING ==(ARQ)== BY ==CAD==
                                                         ==(PRE)== BY =="CAD"==
                                                      ==(REGIST)== BY ==KREG-CAD==
                                                      ==(CHAPRI)== BY ==KC-CHA==.
      *>-> Totalizador por espécie dos recursos ativos
           COPY                   PARQVIRT.CPY REPLACING ==(ARQ)== BY ==RES==
                                                         ==(PRE)== BY =="RES"==
                                                      ==(REGIST)== BY ==KREG-RES==
                                                      ==(CHAPRI)== BY ==KR-CHA==
                                                        ==CHAALT== BY ==KR-ALT==.
      *>--------------------------------------------------------------------------------------------------------------<*
      *>->                         C  O  P  Y  S     D  E     P  R  O  C  E  D  U  R  E  S                          <-<*
      *>--------------------------------------------------------------------------------------------------------------<*
      *>-> Rotinas de desenho das telas do programa SRICAD.CBL
           COPY                   SRICADGP.CPB.
      *>-> Rotinas utilizadas para exibição de gráficos estatísticos
           COPY                   SRIGRAPF.CPY.
      *>-> Leitura/Gravação Observações do cadastro de Clientes/Fornecedores
           COPY                   PDADFOBC.CPY REPLACING ==(@)== BY F
                                                         ==(#)== BY F.
      *>-> Rotinas do programa de manipulação de API do Google Maps
           COPY                   SRIGMPPF.CPY.
      *>-> Rotinas para seleção de itens
           COPY                   PSEITENS.CPY REPLACING ==(@)== BY I.
      *>-> Rotina de montagem de campos de moedas(opções da combo-box)
           COPY                   PMCMOEDA.CPY.
      *>-> Rotinas do programa de busca de vencimentos
           COPY                   SROVCTPF.CPY.
      *>-> Rotinas de manipulação de arquivos .INI/.properties
           COPY                   SROINFPF.CPY.
      *>-> Rotinas do programa de seleção de serviços/despesas existentes/inexistentes do Automação de Escritórios
           COPY                   SRIVSEPF.CPY.
      *>-> Rotinas da tabela de conta corrente
           COPY                   PTBCCCAD.CPY.
      *>-> Rotinas da visão de dados do Beneficiamento
           COPY                   SROVBNPF.CPY REPLACING ==(@)== BY B.
      *>-> Rotinas do programa de Busca estrutura do plano de contas
           COPY                   SRIBEPPF.CPY.
      *>-> Rotinas para chamada dinâmica do Novo SPD
           COPY                   PSLDINAM.CPY.
      *>-> Rotinas para leitura/gravação/exclusão de registros do arquivo de observações das notas de serviço
           COPY                   PDADNOTS.CPY REPLACING ==(@)== BY ==A==
                                                         ==(#)== BY ==A==
                                                      ==(FSIT)== BY ==FS-ITS==
                                                      ==(FSOB)== BY ==FS-ONS==
                                                    ==(SIGEMP)== BY ==MK-CHA==.
      *>-> Rotinas para leitura/gravação/exclusão de Dados da licença do cliente do SIGER
           COPY                   PDADYDLC.CPY REPLACING ==(@)== BY ==Y==
                                                         ==(#)== BY ==Y==
                                                      ==(FSIT)== BY ==FS-DLC==.
      *>-> Rotinas para saída de programas: ERRO-FIM PGE-FECARQ LOAD-SEL
           COPY                   SAIDAPRG.CPY.
      *>----------------------------------------- SRICAD.CBL ---------------------------------------------------------<*
