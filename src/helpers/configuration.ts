"use strict";

import {
  workspace,
  WorkspaceConfiguration
} from "vscode";

const CONFIG_GROUP = "rech.editor.cobol";

/**
 * Class to manipulate extension settings
 */
export class Configuration {
  /** configuration */
  private configuration: WorkspaceConfiguration;

  /**
   * extension settings
   */
  constructor(configGroup?: string) {
    if (configGroup) {
      this.configuration = workspace.getConfiguration(configGroup);
    } else {
      this.configuration = workspace.getConfiguration(CONFIG_GROUP);
    }
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
