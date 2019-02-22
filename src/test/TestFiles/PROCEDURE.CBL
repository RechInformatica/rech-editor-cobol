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

      *>-> Teste de laço
           PERFORM
              VARYING             W-IDV FROM 1 BY 1
                 UNTIL            W-IDV > 10 AND
                                  W-IDV < 30
      *>-> Teste
              PERFORM            PLIS-ACESEL,
           END-PERFORM.
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
      *>-> Se confirmou
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
      *>----------------------------------------- SRICAD.CBL ---------------------------------------------------------<*
