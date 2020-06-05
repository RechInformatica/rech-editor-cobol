import { CobolMethod } from "../completion/CobolMethod";

export class MethodCallUtils {

    public static isMethodCall(lineText: string, column: number): boolean {
        for (let i = column - 1; i > 0; i--) {
            const character = lineText.charAt(i);
            if (/[^\w\-]/.test(character)) {
                for (let j = CobolMethod.TOKEN_INVOKE_METHOD.length - 1; j >= 0; j--) {
                    const tokenPart = CobolMethod.TOKEN_INVOKE_METHOD.charAt(j);
                    const index = i - CobolMethod.TOKEN_INVOKE_METHOD.length + j + 1;
                    if (lineText.charAt(index) != tokenPart) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
}
