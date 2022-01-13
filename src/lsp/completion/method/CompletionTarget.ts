/**
 * Information about the completion target
 */
 export type CompletionTarget = {
    /**
     * Name of the element which is having completions returned
     */
    elementName: string,

    /**
     * Buffer which has been analised to extract the element name
     */
    containingBuffer: string[]
  }
