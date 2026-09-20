import "server-only";

import { cache } from "react";

import { makeGetCurrentUserUseCase } from "./auth-container";

export const getCurrentUserCached = cache(async () => {
  const useCase = makeGetCurrentUserUseCase();

  return useCase.execute();
});
