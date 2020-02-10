import { expect } from 'chai';
import 'mocha';
import { VariableCompletion } from '../../../../lsp/completion/variable/VariableCompletion';
import { CompletionItem } from 'vscode';
import { VariableInsertTextBuilder } from '../../../../lsp/completion/variable/VariableInsertTextBuilder';
import { BufferSplitter } from 'rech-ts-commons';

//
let buffer = "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
    "      *>                                                Calcula o ICMS                                                <*\r\n" +
    "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
    "       identification             division.\r\n" +
    "       program-id.                CALICM.\r\n" +
    "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
    "       environment                division.\r\n" +
    "       configuration              section.\r\n" +
    "       special-names.\r\n" +
    "           decimal-point     is   comma,\r\n" +
    "           console           is   crt.\r\n" +
    "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
    "       data                       division.\r\n" +
    "       working-storage            section.\r\n" +
    "      *>-> Nome do programa\r\n" +
    "       78  w78-nomprg                             value is \"CALICM\".\r" +
    "      *>-> Total da venda dos produtos\r\n" +
    "       01  w-total-venda          pic is 9(06)V99 value is zeros.\n" +
    "      *>-> Valor do ICMS\r\n" +
    "       01  w-icms                 pic is 9(06)V99 value is zeros.\n" +
    "      *>-> Categoria do produto\r\n" +
    "       01  w-categoria            pic is x(01)    value is \"C\".\n" +
    "           88 categoria-cesta-basica              values are \"c\" \"C\".\r" +
    "           88 categoria-produtos-normais          values are \"n\" \"N\".\r\n" +
    "           88 categoria-servicos                  values are \"s\" \"S\".\r" +
    "      *>-> Variável exemplo para pai de níveis 88\r\n" +
    "       01  w-pai-oito-oito        pic is x(01)    value is \"F\".\r\n" +
    "      *>-> Comentário diferente para o primeiro nível 88\r\n" +
    "           88 pai-oito-oito-pri                   value is \"P\".\r\n" +
    "      *>-> Comentário diferente para o segundo nível 88\r\n" +
    "           88 pai-oito-oito-seg                   value is \"S\".\r" +
    "           88 pai-oito-oito-ter                   value is \"T\".\r\n" +
    "       01  w-uf                   pic is x(02)    value is \"SP\".\r\n" +
    "      *>-> Tecla auxiliar\r\n" +
    "       77  w-tecla                pic is x(01)    value is spaces.\r\n" +
    "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
    "       procedure                  division.\r\n" +
    "       inicio.\r\n" +
    "      *>-> Total da venda dos produtos\r\n" +
    "           display                \"Total da venda dos produtos......... \" at 0101.\r\n" +
    "           accept                 w-total-venda at 01035.\r\n" +
    "      *>-> Aceita a categoria do produto\r\n" +
    "           display                \"Cesta basica.................... [C] \" at 0301.\r\n" +
    "           display                \"Produtos normais................ [N] \" at 0401.\r\n" +
    "           display                \"Internet, telefone e luz........ [S] \" at 0501.\r\n" +
    "           display                \"Selecione uma categoria......... [ ] \" at 0601.\r\n" +
    "           perform                aceita-categoria.\r\n" +
    "      *>-> Define o imposto\r\n" +
    "           evaluate               true,\r\n" +
    "      *>-> Imposto sobre cesta básica\r\n" +
    "              when categoria-cesta-basica\r\n" +
    "                 compute   w-icms = w-total-venda * 0,07,\r\n" +
    "      *>-> Imposto sobre produtos normais\r\n" +
    "              when categoria-produtos-normais\r\n" +
    "                 display          \"Insira o UF..................... [  ] \" at 0801,\r\n" +
    "                 accept           w-uf at 0835,\r\n" +
    "      *>-> Em Sao Paulo\r\n" +
    "                 if (w-uf = \"SP\")\r\n" +
    "                    compute w-icms = w-total-venda * 0,12,\r\n" +
    "      *>-> Fora de Sao Paulo\r\n" +
    "                 else,\r\n" +
    "                    compute w-icms = w-total-venda * 0,18,\r\n" +
    "                 end-if,\r\n" +
    "      *>-> Imposto sobre serviços\r\n" +
    "              when categoria-servicos\r\n" +
    "                 compute   w-icms = w-total-venda * 2,5,\r\n" +
    "           end-evaluate.\r\n" +
    "      *>-> Mostra o valor de ICMS\r\n" +
    "           display                \"ICMS: \" at 1001.\r\n" +
    "           display                w-icms at 1007.\r\n" +
    "      *>-> Aguarda o usuário pressionar uma tecla para encerrar o programa\r\n" +
    "           accept                 w-tecla.\r\n" +
    "           stop                   run.\r\n" +
    "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
    "      *>/**\r\n" +
    "      *> Valida categoria do produto\r\n" +
    "      *>\r\n" +
    "      *> @param w-categoria Categoria do produto\r\n" +
    "      *> @return w-categoria Categoria válida\r\n" +
    "      *>*/\r\n" +
    "       aceita-categoria.\r\n" +
    "           perform                until exit\r\n" +
    "              move \"C\"       to   w-categoria,\r\n" +
    "              accept              w-categoria at 0635,\r\n" +
    "              if (not categoria-cesta-basica) and (not categoria-produtos-normais) and (not categoria-servicos)\r\n" +
    "                 display          \"Categoria invalida\" at 0801,\r\n" +
    "              else,\r\n" +
    "                 display          \"                  \" at 0801,\r\n" +
    "                 exit             perform,\r\n" +
    "              end-if,\r\n" +
    "           end-perform.\r\n" +
    "      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*";
let lines = BufferSplitter.split(buffer);

describe('Cobol variable completion', () => {

    it('Checks cobol variable completion including enums', async () => {
        //
        let expectedItems: CompletionItem[] = [];
        expectedItems.push({
            label: "w78-nomprg",
            detail: "Nome do programa"
        });
        expectedItems.push({
            label: "w-total-venda",
            detail: "Total da venda dos produtos"
        });
        expectedItems.push({
            label: "w-icms",
            detail: "Valor do ICMS"
        });
        expectedItems.push({
            label: "w-categoria",
            detail: "Categoria do produto"
        });
        expectedItems.push({
            label: "categoria-cesta-basica",
            detail: "Categoria do produto"
        });
        expectedItems.push({
            label: "categoria-produtos-normais",
            detail: "Categoria do produto"
        });
        expectedItems.push({
            label: "categoria-servicos",
            detail: "Categoria do produto"
        });
        expectedItems.push({
            label: "w-pai-oito-oito",
            detail: "Variável exemplo para pai de níveis 88"
        });
        expectedItems.push({
            label: "pai-oito-oito-pri",
            detail: "Comentário diferente para o primeiro nível 88"
        });
        expectedItems.push({
            label: "pai-oito-oito-seg",
            detail: "Comentário diferente para o segundo nível 88"
        });
        expectedItems.push({
            label: "pai-oito-oito-ter",
            detail: "Variável exemplo para pai de níveis 88"
        });
        expectedItems.push({
            label: "w-uf",
            detail: ""
        });
        expectedItems.push({
            label: "w-tecla",
            detail: "Tecla auxiliar"
        });
        const items = await new VariableCompletion().generate(1, 1, lines);
        expect(expectedItems.length).to.equal(items.length);
        for (let i = 0; i < items.length; i++) {
            expect(expectedItems[i].label).to.equal(items[i].label);
            expect(expectedItems[i].detail).to.equal(items[i].detail);
        };
    });

    it('Checks cobol variable completion ignoring enums', async () => {
        //
        let expectedItems: CompletionItem[] = [];
        expectedItems.push({
            label: "w78-nomprg",
            detail: "Nome do programa"
        });
        expectedItems.push({
            label: "w-total-venda",
            detail: "Total da venda dos produtos"
        });
        expectedItems.push({
            label: "w-icms",
            detail: "Valor do ICMS"
        });
        expectedItems.push({
            label: "w-categoria",
            detail: "Categoria do produto"
        });
        expectedItems.push({
            label: "w-pai-oito-oito",
            detail: "Variável exemplo para pai de níveis 88"
        });
        expectedItems.push({
            label: "w-uf",
            detail: ""
        });
        expectedItems.push({
            label: "w-tecla",
            detail: "Tecla auxiliar"
        });
        const items = await new VariableCompletion().setIgnoreEnums(true).generate(1, 1, lines);
        expect(expectedItems.length).to.equal(items.length);
        for (let i = 0; i < items.length; i++) {
            expect(expectedItems[i].label).to.equal(items[i].label);
            expect(expectedItems[i].detail).to.equal(items[i].detail);
        };
    });

    it('Checks cobol variable completion ignoring displays and enums', async () => {
        //
        let expectedItems: CompletionItem[] = [];
        expectedItems.push({
            label: "w78-nomprg",
            insertText: "w78-nomprg",
            detail: "Nome do programa"
        });
        expectedItems.push({
            label: "w-total-venda",
            insertText: "w-total-venda",
            detail: "Total da venda dos produtos"
        });
        expectedItems.push({
            label: "w-icms",
            insertText: "w-icms",
            detail: "Valor do ICMS"
        });
        const items = await new VariableCompletion().setIgnoreDisplay(true).setIgnoreEnums(true).generate(1, 1, lines);
        expect(expectedItems.length).to.equal(items.length);
        for (let i = 0; i < items.length; i++) {
            expect(expectedItems[i].label).to.equal(items[i].label);
            expect(expectedItems[i].detail).to.equal(items[i].detail);
        };
    });

    it('Checks cobol variable completion using specific VariableInsertTextBuilder', async () => {
        //
        let expectedItems: CompletionItem[] = [];
        expectedItems.push({
            label: "w78-nomprg",
            insertText: "antes w78-nomprg dummy",
            detail: "Nome do programa"
        });
        expectedItems.push({
            label: "w-total-venda",
            insertText: "antes w-total-venda dummy",
            detail: "Total da venda dos produtos"
        });
        expectedItems.push({
            label: "w-icms",
            insertText: "antes w-icms dummy",
            detail: "Valor do ICMS"
        });
        const items = await new VariableCompletion().setInsertTextBuilder(new DummyInsertTextBuilder()).setIgnoreDisplay(true).setIgnoreEnums(true).generate(1, 1, lines);
        expect(expectedItems.length).to.equal(items.length);
        for (let i = 0; i < items.length; i++) {
            expect(expectedItems[i].label).to.equal(items[i].label);
            expect(expectedItems[i].insertText).to.equal(items[i].textEdit!.newText);
            expect(expectedItems[i].detail).to.equal(items[i].detail);
        };
    });

});

/**
 * Dummy text builder
 */
class DummyInsertTextBuilder implements VariableInsertTextBuilder {

    buildInsertText(variableName: string, _isEnum: boolean, _currentCommand: string): string {
        return "antes " + variableName + " dummy";
    }

}


