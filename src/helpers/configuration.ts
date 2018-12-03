"use strict";

import {
  workspace,
  WorkspaceConfiguration
} from "vscode";

const RECHEDITORVSCODE = "rech.editor.vscode";

/**
 * Class to manipulate extension settings
 */
class Configuration {
  /** configuration */
  private configuration: WorkspaceConfiguration;

  /**
   * extension settings
   */
  constructor() {
    this.configuration = workspace.getConfiguration(RECHEDITORVSCODE);
  }

  /**
   * Returns specific setting
   * 
   * @param section 
   * @param defaultValue 
   */
  public get<T>(section: string, defaultValue?: T): T {
    return this.configuration.get<T>(section, defaultValue!);
  }

}

export const configuration = new Configuration();
