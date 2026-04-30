export function createPromptError(message: string, error: unknown) {
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }

  return new Error(`${message}: ${String(error)}`);
}
