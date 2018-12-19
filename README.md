# rech-editor-vscode

This package provides an implementation of Editor.ts class to hide VSCode specific APIs, hence preventing extensions developed by Rech Informática from dealing with complex types and other subroutines attached to this programming editor.

![General structure](./doc/rech-editor-vscode-structure.png "General structure")

In theory, it is possible to change the programming editor by just creating another implementation of Editor.ts class, since only and only this class interacts with the editor API.

It can be considered a middleware layer.
