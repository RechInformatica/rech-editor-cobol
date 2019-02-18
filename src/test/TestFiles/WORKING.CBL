      *>--------------------------------------------------------------------------------------------------------------<*
      *>                                                Calcula o ICMS                                                <*
      *>--------------------------------------------------------------------------------------------------------------<*
       identification             division.
       program-id.                CALICM.
      *>--------------------------------------------------------------------------------------------------------------<*
       environment                division.
       configuration              section.
       special-names.
           decimal-point     is   comma,
           console           is   crt.
      *>--------------------------------------------------------------------------------------------------------------<*
       data                       division.
       working-storage            section.
      *>-> Nome do programa
       78  w78-nomprg                             value is "CALICM".
      *>-> Variável pai
       01  w-pai-filho-unico.
      *>-> Filho único
           05 w-filho-unico       pic is 9(06)V99 value is zeros comp-x.
      *>-> Pai
       01  w-pai.
      *>-> Filho numérico
           05 w-filho-numerico    pic is 9(06)V99 value is zeros.
      *>-> Filho PICX
           05 w-filho-picx        pic is xxx      value is space.
      *>-> Filho com 88
           05 w-filho-pai-oito-oito pic is x(01)  value is "F".
      *>-> Comentário diferente para o primeiro nível 88
              88 filho-pai-oito-oito-pri          value is "P".
      *>-> Comentário diferente para o segundo nível 88
              88 filho-pai-oito-oito-seg          value is "S".
              88 filho-pai-oito-oito-ter          value is "T".
      *>-> Variável filha com filho
           05 w-filho-com-filho.
      *>-> Neto
              10 w-neto           pic is xxx      value is space.
      *>-> Variavel pai
       01  w-pai-oito-oito        pic is x(01)    value is "F".
      *>-> Comentário diferente para o primeiro nível 88
           88 pai-oito-oito-pri                   value is "P".
      *>-> Comentário diferente para o segundo nível 88
           88 pai-oito-oito-seg                   value is "S".
           88 pai-oito-oito-ter                   value is "T".
       01  w-uf                   pic is x(02)    value is "SP".
      *>-> Nível 77
       77  w-nivel-77             pic is x(01)    value is spaces.
      *>-> Variáveis para teste de tamanho
       01  w-byte-size-100.
           05 w-byte-size-40.
              10 w-byte-size-30   pic is x(30)    value is spaces.
              10 w-byte-size-10   pic is 9(05),9(05) value is zeros.
           05 w-any-length.
              10 w-byte-size-64.
                 15 w-byte-size-09.
                    20 w-byte-size-pic1 pic is 9(01) value is zeros comp-x.
                    20 w-byte-size-pic2 pic is 9(02) value is zeros comp-x.
                    20 w-byte-size-pic3 pic is 9(03) value is zeros comp-x.
                    20 w-byte-size-pic4 pic is 9(04) value is zeros comp-x.
                    20 w-byte-size-pic5 pic is 9(05) value is zeros comp-x.
                 15 w-byte-size-10.
                    20 w-byte-size-pic6 pic is 9(06) value is zeros comp-x.
                    20 w-byte-size-pic7 pic is 9(07) value is zeros comp-x.
                    20 w-byte-size-pic8 pic is 9(08) value is zeros comp-x.
                 15 w-byte-size-19.
                    20 w-byte-size-pic9 pic is 9(09) value is zeros comp-x.
                    20 w-byte-size-pic10 pic is 9(10) value is zeros comp-x.
                    20 w-byte-size-pic11 pic is 9(11) value is zeros comp-x.
                    20 w-byte-size-pic12 pic is 9(12) value is zeros comp-x.
                 15 w-byte-size-26.
                    20 w-byte-size-pic13 pic is 9(13) value is zeros comp-x.
                    20 w-byte-size-pic14 pic is 9(14) value is zeros comp-x.
                    20 w-byte-size-pic15 pic is 9(15) value is zeros comp-x.
                    20 w-byte-size-pic16 pic is 9(16) value is zeros comp-x.
              10 w-byte-sipic1v1 pic is 9V9 value is zeros comp.
              10 w-byte-sipic91v1 pic is 9(1)V9 value is zeros comp.
              10 w-byte-sipic1v91 pic is 9V9(1) value is zeros comp.
              10 w-byte-size-pic92v99 pic is 9(02)V99 value is zeros comp.
              10 w-byte-size-pic97v93 pic is 9(7)V9(03) value is zeros comp.
              10 w-byte-size-pic999v93 pic is 999V9(03) value is zeros comp.
              10 w-byte-size-pic95v999 pic is 9(5)V999 value is zeros comp.
              10 w-byte-size-pic-s92v99 pic is s9(2)V99 value is zeros comp.
              10 w-byte-size-pic-s999v93 pic is s999V9(03) value is zeros comp.
              10 w-byte-size-pic-s95v999 pic is s9(5)V999 value is zeros comp.
              10 w-byte-size-pic-s97v93 pic is s9(7)V9(03) value is zeros comp.
              10 w-occdad.
                 15 w-occ                        occurs 12 times.
                    20 w-filho-occ pic is 9(05)                  comp-x.
      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*
