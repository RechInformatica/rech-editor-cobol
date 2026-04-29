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
  private configGroup: string;

  constructor(configGroup?: string) {
    this.configGroup = configGroup ?? CONFIG_GROUP;
  }

  public get<T>(section: string, defaultValue?: T): T {
    return workspace.getConfiguration(this.configGroup).get<T>(section, defaultValue!);
  }
}

export const configuration = new Configuration();
