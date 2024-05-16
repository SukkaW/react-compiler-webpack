export interface ReactCompilerConfig {
  sources?: (filename: string) => boolean,
  compilationMode?: 'annotation'
}
